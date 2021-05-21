const AccordionSearch = require("./accordion-search").default

window.AccordionSearchConfig = {
    searchOnlyTitle         : false,                // Feature "searchOnlyTitle" : Allow search only accordion title.
    searchOnClick           : false,                // Feature "searchOnClick" : Allow search only on click icon search in input
    caseSensitive           : false,                // Feature "caseSensitive"
    itemsOpened             : 0,                    // Feature "itemsOpened" : Int = number element to opened, [0,4,10] = position of elements to opened, "all" = all elements opened
    suggestionBox           : false,                // Feature "suggestionBox" : display a suggestion box.
    suggestionBoxTitle      : 'Popular Searches:',  // Feature "suggestionBox" : Title of suggestions box.
    suggestionBoxKeywords   : [],                   // Feature "suggestionBox" : Items of suggestions box, ex [ 'text1', 'text2' ], item.length > 2.
    btnOpenCloseAll         : false,                // Feature "btnOpenCloseAll" : Display button open/close all.
    pagination              : false,                // Feature "pagination" : pagination status
    paginationLimit         : 2,                    // Feature "pagination" : item per page
    loader                  : false,                // Feature "loader" : Add loader on search
    queryUrl                : false,                // Feature "queryUrl" : Add GET on url to start search
    queryUrlName            : 'asQuery',            // Feature "queryUrl" : custom GET
    msgItemFound            : 'Item Found !',
    msgItemsFound           : 'Items Found !',
    msgNoResult             : 'Nothing Found !',
    iconSearch              : '<i class="fas fa-search"></i>',
    iconClear               : '<i class="fas fa-times"></i>',
    iconLoader              : '<i class="fas fa-spinner fa-spin"></i>',
    iconOpen                : '<i class="fas fa-plus"></i>',
    iconClose               : '<i class="fas fa-minus"></i>',
    iconOpenAll             : '<i class="fas fa-plus"></i>',
    iconCloseAll            : '<i class="fas fa-minus"></i>',
} 

module.exports = AccordionSearch