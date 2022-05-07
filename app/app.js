//const http = require('http');

const hostname = '127.0.0.1';
const port = 8000;

// const server = http.createServer((req, res) => {
//     res.statusCode = 200;
//     res.sendFile('main.html')
//     // res.setHeader('Content-Type', 'text/plain');
//     // res.end('Hello World');
// });

// const http = require('http')
// const fs = require('fs')
// const app = express();

// const server = http.createServer((req, res) => {
//     res.writeHead(200, { 'content-type': 'text/html' })
//     fs.createReadStream('main.html').pipe(res)
// })

// server.listen(process.env.PORT || 8000)

const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const request = require('request');

app.get('/home', function (request, response) {
    response.sendFile('/Users/lpeng/Documents/schema_visualization/schema_visualization/app/public/main.html');
});

app.use(cors());

app.get('/attribute/visualization', function (req, res) {
    var selectedSchema = req.query.schema;

    console.log('selected schema', selectedSchema);

    if (selectedSchema == "HTAN") {
        var requestedUrl = "http://localhost:3001/v1/visualize/attributes?schema_url=https%3A%2F%2Fraw.githubusercontent.com%2FSage-Bionetworks%2Fschematic%2Fdevelop%2Ftests%2Fdata%2Fexample.model.jsonld"
    }
    else if (selectedSchema == "NF") {
        var requestedUrl = "http://localhost:3001/v1/visualize/attributes?schema_url=https%3A%2F%2Fraw.githubusercontent.com%2FSage-Bionetworks%2Fschematic%2Fdevelop%2Ftests%2Fdata%2Fexample.model.jsonld"
    } else if (selectedSchema == "AmpAD") {
        var requestedUrl = "http://localhost:3001/v1/visualize/attributes?schema_url=https%3A%2F%2Fraw.githubusercontent.com%2FSage-Bionetworks%2Fschematic%2Fdevelop%2Ftests%2Fdata%2Fexample.model.jsonld"
    }
    request(requestedUrl, function (error, response, body) {
        console.log('error:', error);
        console.log('statusCode:', response && response.statusCode);
        console.log('body:', body);
        res.json(body);
    });
});



app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});