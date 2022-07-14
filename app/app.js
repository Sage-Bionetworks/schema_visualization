const hostname = '127.0.0.1';
const port = 8000;

// const express = require('express');
// const app = express();
// const path = require('path');
// const cors = require('cors');
// const request = require('request');
// var fs = require('fs');
// var stringify = require('csv-stringify');
// var csv = require('d3-fetch').csv
import express from 'express'
import cors from 'cors'
import { csv, json } from 'd3-fetch'

const app = express();

import fetch, {
    Blob,
    blobFrom,
    blobFromSync,
    File,
    fileFrom,
    fileFromSync,
    FormData,
    Headers,
    Request,
    Response,
} from 'node-fetch'

if (!globalThis.fetch) {
    globalThis.fetch = fetch
    globalThis.Headers = Headers
    globalThis.Request = Request
    globalThis.Response = Response
}


app.use(express.static('public'))

app.get('/home', function (request, response) {
    response.sendFile('/Users/lpeng/Documents/schema_visualization/schema_visualization/app/public/main.html');
});

app.use(cors());

app.get('/visualize/attributes', function (req, res) {
    var selectedSchema = req.query.schema;

    if (selectedSchema == "HTAN") {
        var requested_url = "http://localhost:3001/v1/visualize/attributes?schema_url=https%3A%2F%2Fraw.githubusercontent.com%2Fmialy-defelice%2Fdata_models%2Fmain%2FHTAN%2FHTAN_schema_v21_10.model.jsonld"
    } else if (selectedSchema == "NF") {
        var requested_url = "http://localhost:3001/v1/visualize/attributes?schema_url=https%3A%2F%2Fraw.githubusercontent.com%2Fnf-osi%2Fnf-research-tools-schema%2Fmain%2Fnf-research-tools.jsonld"
    }

    csv(requested_url).then(data => {
        res.send(data);
    })


})



app.get('/visualize/tangled_tree/layers', function (req, res) {
    var selectedSchema = req.query.schema;

    if (selectedSchema == "HTAN") {
        var requested_url = "http://localhost:3001/v1/visualize/tangled_tree/layers?schema_url=https%3A%2F%2Fraw.githubusercontent.com%2Fmialy-defelice%2Fdata_models%2Fmain%2FHTAN%2FHTAN_schema_v21_10.model.jsonld&figure_type=component"
    } else if (selectedSchema == "NF") {
        var requested_url = "http://localhost:3001/v1/visualize/tangled_tree/layers?schema_url=https%3A%2F%2Fraw.githubusercontent.com%2Fnf-osi%2Fnf-research-tools-schema%2Fmain%2Fnf-research-tools.jsonld&figure_type=component"
    }

    json(requested_url).then(data => {
        res.send(data);
    })


})




app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});