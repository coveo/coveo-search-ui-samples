const fs = require("fs");
const path = require("path");
const chokidar = require("chokidar");
const WebSocket = require('ws');
const components = require("./components");

function PagesFileWatcher(server, port) {
    const socket = new WebSocket(`ws://localhost:${port}`);

    const watchers = components.getComponentNames().map(componentName => {
        const basePath =  components.getPageEntryForComponent(componentName);
        const destination = `${__dirname}/bin/${componentName}.html`;
        const watcher = chokidar.watch(basePath, {});

        console.log(`Now watching ${basePath} to ${destination}`);

        watcher.on('error', (event) => {
            console.error(event);
        });
        watcher.on('change', (file) => {
            try {
                const relativePath = path.relative(basePath, file);
                fs.createReadStream(file).pipe(fs.createWriteStream(`${destination}/${relativePath}`));
                console.log(`Copied ${relativePath}`);
                const data = {
                    type: 'broadcast',
                    data: {
                        type: 'window-reload',
                        data: {}
                    }
                };

                socket.send(JSON.stringify(data));
            } catch (ex) {
                console.error(`Could not handle file change`, ex);
            }
        });

        return watcher;
    });

    server.on('close', () => {
        watchers.forEach(watcher => watcher.close());
    });
}

module.exports = PagesFileWatcher;