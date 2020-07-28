"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require('express');
// const forecast = require("./forecast.js");
var app = express();
var port = 3000;
var utils_1 = require("./utils");
app.use(express.static("static"));
// init tools
var reporter = utils_1.Reporter.getInstance();
var geocoder = utils_1.Geocoder.getInstance();
app.get('/weather', function (req, res) {
    // use placename to get point from Geocoding API
    var placeName = req.query.q;
    var point;
    geocoder.getPoint(placeName).then(function (p) {
        if (!p) {
            res.send(JSON.stringify({
                "success": false,
            }));
        }
        else {
            point = p;
            // use point to get report
            reporter.getReport(point).then(function (r) {
                res.send(JSON.stringify(r));
            });
        }
    });
});
app.get('/', function (req, res) {
    res.sendFile(__dirname + "/index.html");
});
app.listen(port, function () {
    console.log("Example app listening at http://localhost:" + port);
});
