"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var types_1 = require("./types");
var source_1 = __importDefault(require("got/dist/source"));
var Reporter = /** @class */ (function () {
    function Reporter() {
    }
    Reporter.getInstance = function () {
        if (!Reporter.instance) {
            Reporter.instance = new Reporter();
        }
        return Reporter.instance;
    };
    Reporter.prototype.getReport = function (point) {
        return __awaiter(this, void 0, void 0, function () {
            var path, dump, response, fullReport, i, rawReport;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        path = Reporter.urlTemplate(point.lat, point.lng);
                        return [4 /*yield*/, source_1.default(path)];
                    case 1:
                        dump = _a.sent();
                        response = JSON.parse(dump.body);
                        fullReport = {
                            meta: {
                                lat: response.lat,
                                lng: response.lon,
                                placeName: point.placeName,
                            },
                            current: Reporter.makeReport(response.current, point),
                            forecast: []
                        };
                        for (i = 0; i < 7; i++) {
                            rawReport = response.daily[i];
                            fullReport.forecast.push(Reporter.makeReport(rawReport, point));
                        }
                        return [2 /*return*/, fullReport];
                }
            });
        });
    };
    Reporter.tConvert = function (temp) {
        if (!temp) {
            return null;
        }
        return Math.round(((temp - 273) * (9 / 5)) + 32);
    };
    Reporter.wConvert = function (speed, deg) {
        var direction;
        if (deg >= 348 || deg <= 11) {
            direction = "N";
        }
        else if (deg < 56) {
            direction = "NE";
        }
        else if (deg < 101) {
            direction = "E";
        }
        else if (deg < 146) {
            direction = "SE";
        }
        else if (deg < 191) {
            direction = "S";
        }
        else if (deg < 236) {
            direction = "SW";
        }
        else if (deg < 281) {
            direction = "W";
        }
        else {
            direction = "NW";
        }
        return parseInt(speed) + "mph " + direction;
    };
    Reporter.makeReport = function (rawReport, point) {
        var date = new Date(1000 * rawReport.dt);
        var newReport = {
            date: date,
            location: point,
            temp: Reporter.tConvert(rawReport.temp.max ? rawReport.temp.day : rawReport.temp),
            highTemp: Reporter.tConvert(rawReport.temp.max || null),
            lowTemp: Reporter.tConvert(rawReport.temp.night || null),
            wind: Reporter.wConvert(rawReport.wind_speed, rawReport.wind_direction),
            cloudCover: rawReport.clouds,
            humidity: rawReport.humidity,
            weatherID: rawReport.weather[0].id,
            precipTotal: rawReport.rain ? parseFloat((rawReport.rain / 25.4).toPrecision(1)) : 0,
            description: rawReport.weather[0].description.split(" ").map(function (s) {
                return s.charAt(0).toUpperCase() + s.slice(1);
            }).join(" "),
        };
        return new types_1.Report(newReport);
    };
    Reporter.apiKey = "ac4e986b3378a86fe48e1dde17da4b9f";
    Reporter.urlTemplate = function (lat, lng) {
        return "        https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lng + "&exclude=minutely,hourly&appid=" + Reporter.apiKey + "        ";
    };
    return Reporter;
}());
exports.Reporter = Reporter;
var Geocoder = /** @class */ (function () {
    function Geocoder() {
    }
    Geocoder.getInstance = function () {
        if (!Geocoder.instance) {
            Geocoder.instance = new Geocoder();
        }
        return Geocoder.instance;
    };
    Geocoder.prototype.getPoint = function (placeName) {
        return __awaiter(this, void 0, void 0, function () {
            var path, dump, res, lat, lng, fPlaceName, city, state;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        path = Geocoder.baseURL + "address=" + placeName + "&key=" + Geocoder.API_KEY;
                        path = path.replace(" ", "+");
                        console.log(path);
                        return [4 /*yield*/, source_1.default(path)];
                    case 1:
                        dump = _a.sent();
                        res = JSON.parse(dump.body);
                        console.log(res);
                        if (res.status != "OK") {
                            console.log("foo");
                            return [2 /*return*/, false];
                        }
                        lat = res.results[0].geometry.location.lat;
                        lng = res.results[0].geometry.location.lng;
                        fPlaceName = res.results[0].formatted_address;
                        console.log(fPlaceName);
                        fPlaceName = fPlaceName.split(",");
                        city = fPlaceName[0].trim();
                        if (fPlaceName.length > 1) {
                            state = ", " + Array.from(fPlaceName[1].trim()).slice(0, 2).join('');
                        }
                        else {
                            state = '';
                        }
                        return [2 /*return*/, new types_1.Point(lat, lng, "" + city + state)];
                }
            });
        });
    };
    Geocoder.baseURL = "https://maps.googleapis.com/maps/api/geocode/json?";
    Geocoder.API_KEY = "AIzaSyB5_8Nk3CnTA80VNKqHyNPjb3_f96OeAzI";
    return Geocoder;
}());
exports.Geocoder = Geocoder;
