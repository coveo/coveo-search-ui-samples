'use strict';
const component = require("./components");
const sass = require('node-sass');
const fs = require('fs');

const createCssFileForComponent = (componentName) => {
  console.log(`Creating css file for ${componentName}`);

  const result = sass.renderSync({
    file: component.getSassEntryForComponent(componentName),
    outFile: `./bin/css/${componentName}.css`
  });

  fs.writeFileSync(`./bin/css/${componentName}.css`, result.css);
};

component.getComponentNames().forEach(createCssFileForComponent);