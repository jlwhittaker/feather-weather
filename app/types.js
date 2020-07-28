"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Point = /** @class */ (function () {
    function Point(lat, lng, placeName) {
        this.lat = lat;
        this.lng = lng;
        this.placeName = placeName;
    }
    ;
    Point.prototype.toString = function () {
        return this.lat + "," + this.lng;
    };
    return Point;
}());
exports.Point = Point;
var Report = /** @class */ (function () {
    function Report(details) {
        Object.assign(this, details);
    }
    return Report;
}());
exports.Report = Report;
