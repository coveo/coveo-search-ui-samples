const fs = require('fs');
const components = require("./components");

const rootFolder = require("./config").rootPath;

const getReadmeLinkForComponentName = (componentName) => `https://github.com/coveo/coveo-search-ui-samples/blob/master/components/${componentName}/readme.md`;
const getElementLinkForComponentName = (componentName) => `<a href="${componentName}.html">${componentName}</a> (<a href="${getReadmeLinkForComponentName(componentName)}">readme</a>)`;

const links = components.getComponentNames()
  .map(getElementLinkForComponentName)
  .map(link => `<li>${link}</li>`);

const title = "Coveo Search UI Samples";

const page = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" >
    <meta name="viewport" content="width=device-width, height=device-height" >
    <title>${title}</title>
  </head>
  <body>
    <h2>${title}</h2>
    <ul>${links.join("\n")}</ul>
  </body>
</html>
`;

fs.writeFileSync(rootFolder + "/index.html", page);