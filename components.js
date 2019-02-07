const path = require("path");
const fs = require("fs");

const getComponentNames = () => {
    return fs.readdirSync(__dirname + "/components/");
}

const getSassEntryForComponent = (componentName) => {
    return `./components/${componentName}/sass/Index.scss`;
}

const getSrcEntryForComponent = (componentName) => {
    return `./components/${componentName}/src/Index.ts`;
}

const getPageEntryForComponent = (componentName) => {
    return `./components/${componentName}/index.html`;
}

module.exports = {
    getComponentNames,
    getSassEntryForComponent,
    getSrcEntryForComponent,
    getPageEntryForComponent
}