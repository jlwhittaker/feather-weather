import { Point, Report } from "./types";
import got from "got/dist/source";

export class Reporter {
    private static instance: Reporter;
    private static apiKey: string = "ac4e986b3378a86fe48e1dde17da4b9f";
    private static urlTemplate = (lat : string, lng : string) => {
        return `\
        https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lng}&exclude=minutely,hourly&appid=${Reporter.apiKey}\
        `
    }

    private constructor() {}

    public static getInstance() {
        if (!Reporter.instance) {
            Reporter.instance = new Reporter();
        }
        return Reporter.instance;
    }

    public async getReport(point: Point) {
        // get full response from API
        let path = Reporter.urlTemplate(point.lat, point.lng);
        let dump = await got(path);
        let response = JSON.parse(dump.body);
        // populate fullReport object, using makeReport helper to filter out what we need
        let fullReport = {
            meta: {
                lat: response.lat,
                lng: response.lon,
                placeName: point.placeName,
            },
            current: Reporter.makeReport(response.current, point),
            forecast: [] as Report[]
        };
        for (let i = 0; i < 7; i++) {
            let rawReport = response.daily[i];
            fullReport.forecast.push(Reporter.makeReport(rawReport, point));
        }

        return fullReport;
    }

    private static tConvert(temp : number | null) {
        if (!temp) {
            return null;
        }
        return Math.round(((temp-273)*(9/5))+32);
    }

    private static wConvert(speed: string, deg: number) {
        let direction: string;
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


        return `${parseInt(speed)}mph ${direction}`
    }

    private static makeReport(rawReport : any, point : Point) {
        let date = new Date(1000 * rawReport.dt);
        let newReport : Report = 
        {
            date: date,
            location: point,
            temp: Reporter.tConvert(rawReport.temp.max ? rawReport.temp.day : rawReport.temp),
            highTemp: Reporter.tConvert(rawReport.temp.max || null),
            lowTemp: Reporter.tConvert(rawReport.temp.night || null),
            wind: Reporter.wConvert(rawReport.wind_speed, rawReport.wind_direction),
            cloudCover: rawReport.clouds,
            humidity: rawReport.humidity,
            weatherID: rawReport.weather[0].id,
            precipTotal: rawReport.rain ? parseFloat((rawReport.rain/25.4).toPrecision(1)) : 0,
            description: rawReport.weather[0].description.split(" ").map((s : string) => {
                return s.charAt(0).toUpperCase() + s.slice(1);
            }).join(" "),
        }
        return new Report(newReport);

    }
}

export class Geocoder {
    private static instance: Geocoder;

    private static baseURL: string = "https://maps.googleapis.com/maps/api/geocode/json?"
    private static API_KEY: string = "AIzaSyB5_8Nk3CnTA80VNKqHyNPjb3_f96OeAzI";

    private constructor() {
    }

    public static getInstance() {
        if (!Geocoder.instance) {
            Geocoder.instance = new Geocoder();
        }
        return Geocoder.instance;
    }

    public async getPoint(placeName: string) {
        let path: string = `${Geocoder.baseURL}address=${placeName}&key=${Geocoder.API_KEY}`
        path = path.replace(" ", "+");
        let dump = await got(path);
        let res = JSON.parse(dump.body);
        if (res.status != "OK") {
            return false;
        }
        let lat = res.results[0].geometry.location.lat;
        let lng = res.results[0].geometry.location.lng;
        let fPlaceName = res.results[0].formatted_address;
        fPlaceName = fPlaceName.split(",");
        let city = fPlaceName[0].trim();
        let state: string;
        if (fPlaceName.length > 1) {
            state = ", "+Array.from(fPlaceName[1].trim()).slice(0,2).join('');
        }
        else {
            state = '';
        }
        return new Point(lat, lng, `${city}${state}`);
    }
}