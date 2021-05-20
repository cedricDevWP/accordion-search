const AccordionSearch = require("./accordion-search").default

window.AccordionsSearchs = []
window.AccordionSearchConfig = {
    searchOnlyTitle: false, // Allow search only accordion title.
    searchOnClick: false, // Allow search only on click icon search in input
    caseSensitive: false,
    suggestionBox: false, // display a suggestion box.
    suggestionBoxTitle: 'Popular Searches:', // Title of suggestions box.
    suggestionBoxKeywords: [], // Items of suggestions box, ex [ 'text1', 'text2' ], item.length > 2.
    msgItemFound: 'Item Found !',
    msgItemsFound: 'Items Found !',
    msgNoResult: 'Nothing Found !',
    btnOpenCloseAll: false, //Display button open/close all.
    itemsOpened: 0, // Int = number element to opened, [0,4,10] = position of elements to opened, "all" = all elements opened
    iconSearch: '<i class="fas fa-search"></i>',
    iconClear: '<i class="fas fa-times"></i>',
    iconOpen: '<i class="fas fa-plus"></i>',
    iconClose: '<i class="fas fa-minus"></i>',
    iconOpenAll: '<i class="fas fa-plus"></i>',
    iconCloseAll: '<i class="fas fa-minus"></i>',
    pagination: false, // pagination status
    paginationLimit: 2, // item per page
    //query_string: false,
} 

module.exports = AccordionSearch