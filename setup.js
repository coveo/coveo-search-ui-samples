const fs = require('fs');
const ncp = require('ncp').ncp;
const components = require("./components");

const rootFolder = "./docs";

const directoriesToCreate = [
  rootFolder,
  `${rootFolder}/css`,
  `${rootFolder}/image`,
  `${rootFolder}/js`,
  `${rootFolder}/templates`
]

const pagesToCopy = components.getComponentNames().map(componentName => {
  const sourceToCopy = components.getPageEntryForComponent(componentName);
  console.log("Copying", sourceToCopy)
  return {
    "src": sourceToCopy,
    "dest": `${rootFolder}/${componentName}.html`
  };
})

const filesToCopy = [{
  "src": './node_modules/coveo-search-ui/bin/css/CoveoFullSearch.css',
  "dest": `${rootFolder}/css/CoveoFullSearch.css`
}].concat(pagesToCopy);

const folderToCopy = [{
  "src": "./node_modules/coveo-search-ui/bin/js",
  "dest": `${rootFolder}/js`
}, {
  "src": './node_modules/coveo-search-ui/bin/image',
  "dest": `${rootFolder}/image`
}, {
  "src": './templates',
  "dest": `${rootFolder}/templates`
}, {
  "src": './pages',
  "dest": `${rootFolder}`
}];

directoriesToCreate.filter(directory => !fs.existsSync(directory))
  .forEach(directory => fs.mkdirSync(directory));

filesToCopy.forEach(file => fs.createReadStream(file.src).pipe(fs.createWriteStream(file.dest)))
folderToCopy.forEach(folder => ncp(folder.src, folder.dest));