const path = require("path")

module.exports = {
    entry:   "./src/index.js",
    output: {
        filename: 'accordion-search.js',
        path: path.resolve(__dirname, "dist"),
        libraryTarget: "var",
        library: "AccordionSearch"
    }
}