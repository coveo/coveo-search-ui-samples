'use strict';
const component = require("./components");
const sass = require('node-sass');
const fs = require('fs');

const rootFolder = require("./config").rootPath;

const createCssFileForComponent = (componentName) => {
  const sassIndexFile = component.getSassEntryForComponent(componentName);

  if (fs.existsSync(sassIndexFile)) {
    console.log(`Creating css file for ${componentName}`);

    const result = sass.renderSync({
      file: sassIndexFile,
      outFile: `${rootFolder}/css/${componentName}.css`
    });

    fs.writeFileSync(`${rootFolder}/css/${componentName}.css`, result.css);
  }
};

component.getComponentNames().forEach(createCssFileForComponent);