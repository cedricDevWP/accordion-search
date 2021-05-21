# Accordion Search
Accordion Search is a JS library for search text across different accordions.

## Demo



## Installation

Use the package manager [pip](https://pip.pypa.io/en/stable/) to install foobar.

```bash
pip install foobar
```

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

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)
