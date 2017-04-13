var http = require('http');
var url = require('url');
var path = require('path');
var fs = require('fs');

//Array of mimeType
var mimeTypes = {
    "html": "text/html",
    "jpeg": "image/jpeg",
    "jpg": "image/jpeg",
    "png": "image/png",
    "js": "text/javascript",
    "css": "text/css"
};

//createServer
http.createServer(function(req, res) {
    var uri = url.parse(req.url).pathname;
    var fileName = path.join(process.cwd(), unescape(uri));
    console.log('Loding ' + uri);
    var stats;

    try {
        stats = fs.lstatSync(fileName);
    } catch (e) {
        res.writeHead(404, {
            'Content-type': 'text/plain'
        });
        res.write('404 Page Not found\n');
        res.end();
        return;
    }
    //Check if file/directory
    if (stats.isFile()) {
        var mimeType = mimeTypes[path.extname(fileName).split(".").reverse()[0]];
        res.writeHead(200, {
            'Content-type': mimeType
        });

        var fileStream = fs.createReadStream(fileName);
        fileStream.pipe(res);
    } else if (stats.isDirectory()) {
        res.writeHead(302, {
            'Location': 'index.html'
        });
        res.end();
    } else {
        res.writeHead(500, {
            'Content-type': 'text/plain'
        });
        res.write('500 Internal Error\n');
        res.end();
    }
}).listen(3000);
