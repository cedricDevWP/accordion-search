
# Accordion Search
Accordion Search is a JS library for search text across different accordions.

## Demo

![AccordionSearch (2)](https://user-images.githubusercontent.com/12508260/119106746-e80ec780-ba1e-11eb-98fb-9ee36ffc7213.gif)

## Installation

1) NPM
Use the package manager [npm](https://www.npmjs.com/) to install Accordion Search.

```bash
npm i accordion-search
```

2) Files

Go to [/dist](dist) and take what you want.

Recommendation take : 
-  [/dist/accordion-search.min.js](dist/accordion-search.min.js)
-  [/dist/accordion-search.min.css](dist/accordion-search.min.css)

## Usage

1) Creation of the html structure

```html
<div id="my-accordion-search" class="as">
        <div class="as-search-container">
            <input class="as-search__input" type="text" value="" placeholder="Lorem ipsum dolor sit amet"/>
            <span class="as-search__search_btn"></span>
            <span class="as-search__clear_btn"></span>
        </div>

        <div class="as-search-result"></div>

        <section class="as-accordion">
            <h2 class="as-accordion__title"> ... </h2>
            <div class="as-accordion__content">
               ...
            </div>
        </section>
        <section class="as-accordion">
            <h2 class="as-accordion__title"> ... </h2>
            <div class="as-accordion__content">
                ...
            </div>
        </section>
</div>
```
You can choose the tags you want for :
- .as
- .as-search__search_btn
- .as-search__clear_btn
- .as-search-result
- .as-accordion
- .as-accordion__title
- .as-accordion__content

There is an example in : [/dist/index.html](dist/index.html)

2) JS initialization

- Default settings 
```js
const accordionSearch = new AccordionSearch( document.getElementById( 'my-accordion-search' ) )
```

- Advanced settings

```js
const accordionSearch = new AccordionSearch( document.getElementById( 'my-accordion-search' ), {
        searchOnClick: true,
        searchOnlyTitle: true,
        caseSensitive: false,
        btnOpenCloseAll: true,
        itemsOpened:[1,5],
        suggestionBox: true,
        suggestionBoxTitle: 'Popular Searches:',
        suggestionBoxKeywords: [ 'Title 1', 'Title 2', 'Title 3', '..'],
        pagination: true,
        paginationLimit: 3,
        loader: true,
        queryUrl: true,
        queryUrlName: 'myQuery',
} )
```

## Availables configurations

```js
{
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
```
You can edit defaults settings by modifying the values of the variable

You can change icons if you don't use Font-Awesome solid

```js
window.AccordionSearchConfig
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.
Please create all format files (dev/build)

1) Availables Scripts:

`npm run dev-js` => Launch Webpack in development mode (without optimization and minification) with '- watch' create the accordion-search.js file in [/dist](dist)

`npm run build-js` => Launch Webpack in production mode (with optimization and minification) and create the accordion-search.min.js file in [/dist](dist)

`npm run dev-css` => Launch Sass with '- watch' and create the accordion-search.css file and the accordion-search.css.map file in [/dist](dist)

`npm run build-css` => Launch Sass ( with compressed and no source map ) and create the accordion-search.min.css file in [/dist](dist) + Launch postcss with replace and autoprefixer

## External libraries used
- [Mark.js](https://github.com/julmot/mark.js/)
- [Font Awesome](https://github.com/FortAwesome/Font-Awesome) (solid version)

## License
[MIT](https://choosealicense.com/licenses/mit/)
