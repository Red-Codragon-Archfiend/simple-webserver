'use strict';

require('dotenv').config();

const HOST = process.env.HOST;
const PORT = process.env.PORT;

const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');

const mimeTypes = {
    "html":"text/html", 
    "jpeg":"image/jpeg", 
    "jpg":"image/jpg",
    "png":"image/png",
    "js":"text/javascript",
    "css":"text/css",
}

http.createServer((req, res) => {
    let uri = url.parse(req.url).pathname;
    let fileName = path.join(process.cwd(), unescape(uri));
    console.log(`Loading ${uri}`);

    let stats;

    try {
        stats = fs.lstatSync(fileName);
    } catch(e) {
        res.writeHead(404, {
            'Content-Type': 'text/plain',
        });
        res.write('404 Not Found\n');
        res.end();
        return;
    }

    if (stats.isFile()) {
        let mimeType = mimeTypes[path.extname(fileName).split(".").reverse()[0]];
        res.writeHead(200, {'Content-Type': mimeType});

        var fileStream = fs.createReadStream(fileName);
        fileStream.pipe(res);
    } else if (stats.isDirectory()) {
        res.writeHead(302, {
            'Location': 'index.html'
        });
        res.end();
    } else {
        res.writeHead(500, {'Content-Type': 'text/plain'});
        res.write('500 Internal Error\n');
    }
}).listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
});

