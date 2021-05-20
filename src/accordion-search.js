import Mark from 'mark.js/src/vanilla.js'

import { DOMAnimations } from './dom-animations'

export default class AccordionSearch{

    /**
     * 
     * @param {HTMLElement} ctx 
     * @param {Object} config 
     */
    constructor( ctx, config = {} ){
        this.ctx = ctx
        this.config = { ...window.AccordionSearchConfig } 
        this.config = Object.assign( this.config, config )

        this.elementSearchInput     = this.ctx.querySelector( '.as-search__input' )
        this.elementSearchBtnSearch = this.ctx.querySelector( '.as-search__search_btn' )
        this.elementSearchBtnClear  = this.ctx.querySelector( '.as-search__clear_btn' )

        this.elementSearchResult    = this.ctx.querySelector( '.as-search-result' )

        this.elementAccordions    = this.ctx.querySelectorAll( '.as-accordion' )

        this.instanceMark = new Mark( this.config.searchOnlyTitle ? this.ctx.querySelectorAll( '.as-accordion .as-accordion__title' ) : this.elementAccordions )

        this.itemsToShow = []

        if( this.config.pagination ){
            this.config.pagination = this.config.paginationLimit > 0
        }

        this.initHtml()
        this.initEvent()
    }

    initHtml(){
        // Close All & add icon in accordion title
        for (const elementAccordion of this.elementAccordions) {
            elementAccordion.querySelector( '.as-accordion__content' ).classList.add( 'as-d-none' )
            elementAccordion.querySelector( '.as-accordion__title' ).innerHTML = `<span class="as-accordion__title-icon">${ this.config.iconOpen }</span>` + elementAccordion.querySelector( '.as-accordion__title' ).innerHTML
        }

        this.elementSearchBtnSearch.innerHTML   = this.config.iconSearch
        this.elementSearchBtnClear.innerHTML    = this.config.iconClear

        this.elementSearchResult.classList.add( 'as-d-none' )
        this.elementSearchBtnSearch.classList.add( 'as-d-none' )
        this.elementSearchBtnClear.classList.add( 'as-d-none' )

        // Feature "searchOnClick"
        if( this.config.searchOnClick ){
            this.elementSearchBtnSearch.classList.add( 'as-cursor-pointer' )
        }

        // Feature "suggestionBox"
        if( this.config.suggestionBox && Array.isArray( this.config.suggestionBoxKeywords ) && this.config.suggestionBoxKeywords.length > 0 ){
            let divSuggestionBox = document.createElement( 'div' )
            divSuggestionBox.classList.add( 'as-search-suggestion-box' )
            
            let titleSuggestionBox = document.createElement( 'p' )
            titleSuggestionBox.classList.add( 'as-search-suggestion-box__title' )
            titleSuggestionBox.innerHTML = this.config.suggestionBoxTitle
            divSuggestionBox.appendChild( titleSuggestionBox )

            let itemsSuggestionBox = document.createElement( 'div' )
            itemsSuggestionBox.classList.add( 'as-search-suggestion-box__items' )
            
            for (const keyword of this.config.suggestionBoxKeywords) {
                if( keyword.length <= 2 ) continue;
                let item = document.createElement( 'p' )
                item.innerText = keyword
                item.addEventListener( 'click', (e) => this.onSuggestion( e.currentTarget ) )
                itemsSuggestionBox.appendChild( item )
            }
            
            divSuggestionBox.appendChild( itemsSuggestionBox )

            this.ctx.querySelector( '.as-search_container' ).after( divSuggestionBox )
        }

        // Feature "btnOpenCloseAll"
        if( this.config.btnOpenCloseAll ){
            let divBtns = document.createElement( 'div' )
            divBtns.classList.add( 'as-accordion-btn-all' )

            let smallBtnOpen = document.createElement( 'small' )
            smallBtnOpen.classList.add( 'as-accordion-btn-all__open' )
            smallBtnOpen.innerHTML = this.config.iconOpenAll
            divBtns.appendChild( smallBtnOpen )

            let smallBtnClose = document.createElement( 'small' )
            smallBtnClose.classList.add( 'as-accordion-btn-all__close' )
            smallBtnClose.innerHTML = this.config.iconCloseAll
            divBtns.appendChild( smallBtnClose )

            this.elementSearchResult.after( divBtns )
        }

        // Feature "itemsOpened"
        if( this.config.itemsOpened != 0 ){
            if( Array.isArray( this.config.itemsOpened) ){
                for (let index = 0; index < this.config.itemsOpened.length; index++) {
                    if( this.elementAccordions[ this.config.itemsOpened[ index ] ] != undefined ){
                        this.openAccordion( this.elementAccordions[ this.config.itemsOpened[ index ] ] )
                    }
                }
            }else if( Number.isInteger( this.config.itemsOpened ) && this.config.itemsOpened < this.elementAccordions.length ){
                for (let index = 0; index < this.config.itemsOpened; index++) {
                    if( this.elementAccordions[ index ] != undefined ){
                        this.openAccordion( this.elementAccordions[ index ] )
                    }
                }
            }else if( this.config.itemsOpened = "all" ){
                this.onAll()
            }
        }

        // Feature "pagination"
        if( this.config.pagination ){
            this.pagination()
        }

    }

    initEvent(){
        let accordionTitles = this.ctx.querySelectorAll( '.as-accordion__title' )

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

        this.elementSearchInput.addEventListener( 'keyup', (e) => {
            if( e.target.value.length <= 2 ) {
                this.reset() 
            }else{
                this.elementSearchBtnSearch.classList.remove( 'as-d-none' )
                this.elementSearchBtnClear.classList.remove( 'as-d-none' )

                if( ! this.config.searchOnClick ){
                    this.search()
                }
            }
        } )

        if( this.config.searchOnClick ){
            this.elementSearchBtnSearch.addEventListener( 'click', (e) => {
                this.search()
            } )
        }

        this.elementSearchBtnClear.addEventListener( 'click', (e) => {
            this.elementSearchInput.value = ""
            this.reset()
        } )

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
     * 
     * @param {HTMLElement[]} elements 
     */
    search( ){
        this.itemsToShow = []

        this.instanceMark.unmark() 

        this.instanceMark.mark( this.elementSearchInput.value, {
            separateWordSearch: false,
            caseSensitive: this.config.caseSensitive,
            "each": ( node ) => this.addItemToShow( node ),
            "done": ( counter ) => this.result( counter )
        } )
    }

    reset(){
        this.elementSearchBtnSearch.classList.add( 'as-d-none' )
        this.elementSearchBtnClear.classList.add( 'as-d-none' )
        this.elementSearchResult.classList.add( 'as-d-none' )
        this.instanceMark.unmark()
        for (const accordion of this.elementAccordions) {
            accordion.classList.remove('as-d-none')
            if( ! accordion.querySelector( '.as-accordion__content' ).classList.contains( 'as-d-none' ) ){
                this.closeAccordion(accordion)
            }
            if( this.accordion.classList.contains( 'as-accordion-pagination-hide' ) ){
                accordion.classList.remove( 'as-accordion-pagination-hide' )
            }
        }

        // Feature "pagination"
        if( this.config.pagination ){
            this.pagination(0)
        }
    }

    result( nbResults ){
        const resultString = nbResults == 0 ? this.config.msgNoResult : ( nbResults == 1 ? this.config.msgItemFound : this.config.msgItemsFound )
        this.elementSearchResult.innerHTML = nbResults + ' ' + resultString;
        this.elementSearchResult.classList.remove( 'as-d-none' )

        for (const accordion of this.elementAccordions) {
            if( !this.itemsToShow.includes( accordion ) ){
                accordion.classList.add( 'as-d-none' )
            }else{
                accordion.classList.remove( 'as-d-none' )
            }
            if( this.accordion.classList.contains( 'as-accordion-pagination-hide' ) ){
                accordion.classList.remove( 'as-accordion-pagination-hide' )
            }
        }

        for (const itemToShow of this.itemsToShow) {
            this.openAccordion( itemToShow )
        }

        // Feature "pagination"
        if( this.config.pagination ){
            this.pagination(0)
        }
    }

    addItemToShow( node ){
        const accordionParent = node.closest( '.as-accordion' )
        if( ! this.itemsToShow.includes( accordionParent ) ){
            this.itemsToShow.push( accordionParent )
        }
    }

    onAll( open = true ){
        for (const accordion of this.elementAccordions) {
            const currentIsHidden = accordion.querySelector( '.as-accordion__content' ).classList.contains( 'as-d-none' )
            if( open && currentIsHidden ){
                this.openAccordion( accordion )
            }else if( ! open && ! currentIsHidden ){
                this.closeAccordion( accordion )
            }
        }
    }

    /**
     * 
     * @param {HTMLElement} item 
     */
    onSuggestion( item ){
        this.elementSearchInput.value = item.textContent
        this.elementSearchInput.dispatchEvent( new KeyboardEvent( 'keyup' ) )
        if( this.config.searchOnClick ){
            this.elementSearchBtnSearch.click()
        }   
    }

    pagination( currentPaginationItem = 0 ){
        let divPagination = this.ctx.querySelector( '.as-accordion-pagination' )
        if( divPagination == null ){
            divPagination = document.createElement( 'div' )
            divPagination.classList.add( 'as-accordion-pagination' )
        }else{
            divPagination.querySelectorAll('*').forEach(n => n.remove());
        }

        const nbItems = Math.ceil( this.ctx.querySelectorAll( '.as-accordion:not(.as-d-none)' ).length / this.config.paginationLimit )

        let currentPaginationItemElement

        for (let index = 0; index < nbItems; index++) {
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
     * 
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

}
