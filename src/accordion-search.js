import Mark from 'mark.js/src/vanilla.js'

import { DOMAnimations } from './dom-animations'

export default class AccordionSearch{

    /**
     * Init AccordionSearch
     * @param {HTMLElement} ctx 
     * @param {Object} config 
     */
    constructor( ctx, config = {} ){
        this.ctx = ctx
        this.config = { ...window.AccordionSearchConfig } 
        this.config = Object.assign( this.config, config )

        // Save standards elements
        this.elementSearchInput     = this.ctx.querySelector( '.as-search__input' )
        this.elementSearchBtnSearch = this.ctx.querySelector( '.as-search__search_btn' )
        this.elementSearchBtnClear  = this.ctx.querySelector( '.as-search__clear_btn' )
        this.elementSearchResult    = this.ctx.querySelector( '.as-search-result' )
        this.elementAccordions    = this.ctx.querySelectorAll( '.as-accordion' )

        // Thx ====> https://markjs.io/
        this.instanceMark = new Mark( this.config.searchOnlyTitle ? this.ctx.querySelectorAll( '.as-accordion .as-accordion__title' ) : this.elementAccordions )

        this.itemsToShow = []

        // Needed when feature "loader" activated
        this.searchActivated = true

        // Init Html & Event
        this.initHtml()
        this.initEvent()

        // Feature "queryUrl"
        if( this.config.queryUrl ){
            const urlParams     = new URLSearchParams( window.location.search )
            const paramValue    = urlParams.get( this.config.queryUrlName )

            if( paramValue != null ){
                this.elementSearchInput.value = paramValue
                this.elementSearchInput.dispatchEvent( new KeyboardEvent( 'keyup' ) )

                // Feature "searchOnClick"
                if( this.config.searchOnClick ) this.elementSearchBtnSearch.click()
            }

        }

        // Feature "pagination"
        if( this.config.pagination ){
            this.config.pagination = this.config.paginationLimit > 0
            if( this.config.pagination ) this.pagination()
        }

    }

    initHtml(){
        // Close All & add icon in accordion title
        for (const elementAccordion of this.elementAccordions) {
            elementAccordion.querySelector( '.as-accordion__content' ).classList.add( 'as-d-none' )
            elementAccordion.querySelector( '.as-accordion__title' ).innerHTML = `<span class="as-accordion__title-icon">${ this.config.iconOpen }</span>` + elementAccordion.querySelector( '.as-accordion__title' ).innerHTML
        }

        // Init standards icons elements
        this.elementSearchBtnSearch.innerHTML   = this.config.iconSearch
        this.elementSearchBtnClear.innerHTML    = this.config.iconClear

        // Init standards class elements
        this.elementSearchResult.classList.add( 'as-d-none' )
        this.elementSearchBtnSearch.classList.add( 'as-d-none' )
        this.elementSearchBtnClear.classList.add( 'as-d-none' )

        // Feature "searchOnClick"
        if( this.config.searchOnClick ) this.elementSearchBtnSearch.classList.add( 'as-cursor-pointer' )

        // Feature "suggestionBox"
        if( this.config.suggestionBox && Array.isArray( this.config.suggestionBoxKeywords ) && this.config.suggestionBoxKeywords.length > 0 ){
            
            // Create container global
            let divSuggestionBox = document.createElement( 'div' )
            divSuggestionBox.classList.add( 'as-search-suggestion-box' )
            
            // Create title
            let titleSuggestionBox = document.createElement( 'p' )
            titleSuggestionBox.classList.add( 'as-search-suggestion-box__title' )
            titleSuggestionBox.innerHTML = this.config.suggestionBoxTitle
            divSuggestionBox.appendChild( titleSuggestionBox )

            // Create container items suggestions
            let itemsSuggestionBox = document.createElement( 'div' )
            itemsSuggestionBox.classList.add( 'as-search-suggestion-box__items' )
            
            // Create all keyword
            for (const keyword of this.config.suggestionBoxKeywords) {
                if( keyword.length <= 2 ) continue;
                let item = document.createElement( 'p' )
                item.innerText = keyword
                item.addEventListener( 'click', (e) => this.onSuggestion( e.currentTarget ) )
                itemsSuggestionBox.appendChild( item )
            }

            divSuggestionBox.appendChild( itemsSuggestionBox )

            // add to html
            this.ctx.querySelector( '.as-search_container' ).after( divSuggestionBox )
        }

        // Feature "btnOpenCloseAll"
        if( this.config.btnOpenCloseAll ){

            // Create container global
            let divBtns = document.createElement( 'div' )
            divBtns.classList.add( 'as-accordion-btn-all' )

            // Create button open
            let smallBtnOpen = document.createElement( 'small' )
            smallBtnOpen.classList.add( 'as-accordion-btn-all__open' )
            smallBtnOpen.innerHTML = this.config.iconOpenAll
            divBtns.appendChild( smallBtnOpen )

            // Create button close
            let smallBtnClose = document.createElement( 'small' )
            smallBtnClose.classList.add( 'as-accordion-btn-all__close' )
            smallBtnClose.innerHTML = this.config.iconCloseAll
            divBtns.appendChild( smallBtnClose )

            // add to html
            this.elementSearchResult.after( divBtns )
        }

        // Feature "itemsOpened"
        if( this.config.itemsOpened != 0 ){

            // If array - Open only the indexes entered
            if( Array.isArray( this.config.itemsOpened) ){
                for (let index = 0; index < this.config.itemsOpened.length; index++) {
                    if( this.elementAccordions[ this.config.itemsOpened[ index ] ] != undefined ){
                        this.openAccordion( this.elementAccordions[ this.config.itemsOpened[ index ] ] )
                    }
                }
            // If number - Open n elements
            }else if( Number.isInteger( this.config.itemsOpened ) && this.config.itemsOpened < this.elementAccordions.length ){
                for (let index = 0; index < this.config.itemsOpened; index++) {
                    if( this.elementAccordions[ index ] != undefined ){
                        this.openAccordion( this.elementAccordions[ index ] )
                    }
                }
            // If "all" - Open all
            }else if( this.config.itemsOpened == "all" ){
                this.onAll()
            }
        }

    }

    /**
     * Init all events
     */
    initEvent(){
        let accordionTitles = this.ctx.querySelectorAll( '.as-accordion__title' )

        // Title bar accordion - Click
        for (const accordionTitle of accordionTitles) {
            accordionTitle.addEventListener( 'click', (e) => {
                e.preventDefault()
                const accordion = e.currentTarget.parentElement
                if( accordion.querySelector( '.as-accordion__content' ).classList.contains( 'as-d-none' ) ) {
                    this.openAccordion( accordion )
                }else{
                    this.closeAccordion( accordion )
                }
            } )
        }

        // Input search - Keyup
        this.elementSearchInput.addEventListener( 'keyup', (e) => {
            if( ! this.searchActivated ) return false

            if( e.target.value.length <= 2 ) {
                this.reset() 
            }else{
                this.elementSearchBtnSearch.classList.remove( 'as-d-none' )
                this.elementSearchBtnClear.classList.remove( 'as-d-none' )

                // Feature "searchOnClick"
                if( ! this.config.searchOnClick ) this.search()
            }
        } )

        // Feature "searchOnClick"
        if( this.config.searchOnClick ){
            this.elementSearchBtnSearch.addEventListener( 'click', (e) => {
                this.search()
            } )
        }

        // Clear button
        this.elementSearchBtnClear.addEventListener( 'click', (e) => {
            if( ! this.searchActivated ) return false
            this.elementSearchInput.value = ""
            this.reset()
        } )

        // Feature "btnOpenCloseAll"
        if( this.config.btnOpenCloseAll ){
            this.ctx.querySelector( '.as-accordion-btn-all__open' ).addEventListener( 'click', (e) => this.onAll( ) )
            this.ctx.querySelector( '.as-accordion-btn-all__close' ).addEventListener( 'click', (e) => this.onAll( false ) )
        }

    }

    /**
     *
     * @param {HTMLElement} accordion 
     */
    openAccordion( accordion ){
        DOMAnimations.slideDown( accordion.querySelector( '.as-accordion__content' ) )
        accordion.querySelector( '.as-accordion__title-icon' ).innerHTML = this.config.iconClose
    }

    /**
     * 
     * @param {HTMLElement} accordion 
     */
    closeAccordion( accordion ){
        DOMAnimations.slideUp( accordion.querySelector( '.as-accordion__content' ) )
        accordion.querySelector( '.as-accordion__title-icon' ).innerHTML = this.config.iconOpen
    }

    /**
     * Find the match in the titles (and contents)
     * @param {HTMLElement[]} elements 
     */
    search( ){

        if( ! this.searchActivated ) return false

        // Feature "loader"
        if( this.config.loader ) this.loader( true )

        this.itemsToShow = []

        // Reset marks
        this.instanceMark.unmark() 

        // Create marks
        this.instanceMark.mark( this.elementSearchInput.value, {
            separateWordSearch: false,
            caseSensitive: this.config.caseSensitive,
            "each": ( node ) => this.addItemToShow( node ),
            "done": ( counter ) => this.result( counter )
        } )
    }

    /**
     * Reset all & close all 
     */
    reset(){
        // Feature "loader"
        if( this.config.loader ) this.loader( true )

        this.elementSearchBtnSearch.classList.add( 'as-d-none' )
        this.elementSearchBtnClear.classList.add( 'as-d-none' )
        this.elementSearchResult.classList.add( 'as-d-none' )

        // Remove marks
        this.instanceMark.unmark()

        for ( const accordion of this.elementAccordions ) {
            accordion.classList.remove('as-d-none')
            // Close accordion
            if( ! accordion.querySelector( '.as-accordion__content' ).classList.contains( 'as-d-none' ) ) this.closeAccordion(accordion)
            
            // Remove hide from feature "pagination"
            if( accordion.classList.contains( 'as-accordion-pagination-hide' ) ) accordion.classList.remove( 'as-accordion-pagination-hide' )
        }

        // Feature "btnOpenCloseAll"
        if( this.config.btnOpenCloseAll ) this.ctx.querySelector( '.as-accordion-btn-all' ).classList.remove( 'as-d-none' )

        // Feature "pagination"
        if( this.config.pagination ) this.pagination()

        // Feature "loader"
        if( this.config.loader ) this.loader( false )
    }

    /**
     * Marks - Event "done" - When all marks are applied
     * @param {Number} nbResults 
     */
    result( nbResults ){
        const resultString = nbResults == 0 ? this.config.msgNoResult : ( nbResults == 1 ? this.config.msgItemFound : this.config.msgItemsFound )
        this.elementSearchResult.innerHTML = nbResults + ' ' + resultString;
        this.elementSearchResult.classList.remove( 'as-d-none' )

        // Saves accordions with marks and hide others
        for ( const accordion of this.elementAccordions ) {
            if( !this.itemsToShow.includes( accordion ) ){
                accordion.classList.add( 'as-d-none' )
            }else{
                accordion.classList.remove( 'as-d-none' )
            }
            if( accordion.classList.contains( 'as-accordion-pagination-hide' ) ){
                accordion.classList.remove( 'as-accordion-pagination-hide' )
            }
        }

        // Open accordions with marks
        for (const itemToShow of this.itemsToShow) {
            this.openAccordion( itemToShow )
        }

        // Feature "btnOpenCloseAll"
        if( this.config.btnOpenCloseAll ){
            if( nbResults == 0 ){
                this.ctx.querySelector( '.as-accordion-btn-all' ).classList.add( 'as-d-none' )
            }else{
                this.ctx.querySelector( '.as-accordion-btn-all' ).classList.remove( 'as-d-none' )
            }
        }

        // Feature "pagination"
        if( this.config.pagination ) this.pagination()

        // Feature "loader"
        if( this.config.loader ) this.loader( false )
    }

    /**
     * Marks - Event "each" - Save the accordion with marked
     * @param {HTMLElement} node 
     */
    addItemToShow( node ){
        const accordionParent = node.closest( '.as-accordion' )
        if( ! this.itemsToShow.includes( accordionParent ) ) this.itemsToShow.push( accordionParent )
    }

    /**
     * Apply on all accordions (open/close)
     * @param {Boolean} open 
     */
    onAll( open = true ){
        for ( const accordion of this.elementAccordions ) {
            const currentIsHidden = accordion.querySelector( '.as-accordion__content' ).classList.contains( 'as-d-none' )
            if( open && currentIsHidden ){
                this.openAccordion( accordion )
            }else if( ! open && ! currentIsHidden ){
                this.closeAccordion( accordion )
            }
        }
    }

    /**
     * Event Click - When click on keyword suggestion
     * @param {HTMLElement} item 
     */
    onSuggestion( item ){
        if( ! this.searchActivated ) return false
        this.elementSearchInput.value = item.textContent
        this.elementSearchInput.dispatchEvent( new KeyboardEvent( 'keyup' ) )

        // Feature "searchOnClick" - Trigger click
        if( this.config.searchOnClick ) this.elementSearchBtnSearch.click()
    }

    /**
     * To manage pagination
     * @param {Number} currentPaginationItem 
     */
    pagination( currentPaginationItem = 0 ){
        let divPagination = this.ctx.querySelector( '.as-accordion-pagination' )

        // Create pagination if not exist
        if( divPagination == null ){
            divPagination = document.createElement( 'div' )
            divPagination.classList.add( 'as-accordion-pagination' )
        }else{
            // Remove all items in pagination
            divPagination.querySelectorAll('*').forEach(n => n.remove())
        }

        const nbItems = Math.ceil( this.ctx.querySelectorAll( '.as-accordion:not(.as-d-none)' ).length / this.config.paginationLimit )

        let currentPaginationItemElement

        // Create all items for pagination
        for ( const index = 0; index < nbItems; index++ ) {
            let item = document.createElement( 'p' )
            item.innerText = index + 1
            if( currentPaginationItem == index ){
                currentPaginationItemElement = item
                item.classList.add( 'as-accordion-pagination__active' )
            }else{
                item.classList.remove( 'as-accordion-pagination__active' )
            }
            item.addEventListener( 'click', (e) => this.pagination( index ) )
            divPagination.appendChild( item )
        }

        this.ctx.appendChild( divPagination )

        this.onPagination( currentPaginationItemElement )
    }

    /**
     * Shows the correct accordions 
     * @param {HTMLElement} item 
     */
    onPagination( item ){

        const items = Array.prototype.slice.call( this.ctx.querySelectorAll( '.as-accordion-pagination > *' ) )

        const itemPosition = items.indexOf( item )

        const startPositionSlice = itemPosition * this.config.paginationLimit

        const currentAccordionsVisible = Array.prototype.slice.call( this.ctx.querySelectorAll( '.as-accordion:not(.as-d-none)' ) )

        for (const accordion of currentAccordionsVisible) {
            accordion.classList.add( 'as-accordion-pagination-hide' )
        }

        const newAccordionsVisible = currentAccordionsVisible.slice( startPositionSlice, startPositionSlice + this.config.paginationLimit )

        for (const accordion of newAccordionsVisible) {
            accordion.classList.remove( 'as-accordion-pagination-hide' )
        }
    }

    /**
     * Add loader and block search & reset
     * @param {Boolean} add 
     */
    loader( add = true ){

        this.searchActivated = !add

        this.elementSearchBtnSearch.classList.toggle( 'as-cursor-not-allowed' )
        this.elementSearchBtnClear.classList.toggle( 'as-cursor-not-allowed' )
        this.elementSearchInput.classList.toggle( 'as-cursor-not-allowed' )
        if( this.config.suggestionBox ){
            for (const item of this.ctx.querySelectorAll( '.as-search-suggestion-box__items > *' )) {
                item.classList.toggle( 'as-cursor-not-allowed' )
            }
        }
        
        this.elementSearchInput.readOnly = add

        const iconToAdd = add ? this.config.iconLoader : this.config.iconSearch
        this.elementSearchBtnSearch.innerHTML = iconToAdd
    }

}
