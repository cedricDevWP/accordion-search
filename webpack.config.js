const path = require("path")

module.exports = [
    {
        name: 'dev',
        entry:   "./src/index.js",
        output: {
            filename: 'accordion-search.js',
            path: path.resolve(__dirname, "dist"),
            libraryTarget: "var",
            library: "AccordionSearch"
        }
    },
    {
        name: 'build',
        entry:   "./src/index.js",
        output: {
            filename: 'accordion-search.min.js',
            path: path.resolve(__dirname, "dist"),
            libraryTarget: "var",
            library: "AccordionSearch"
        }
    }
]