
export class Point {
    public lat: string;
    public lng: string;
    public placeName: string;

    constructor(lat : string, lng : string, placeName : string) {
        this.lat = lat;
        this.lng = lng;
        this.placeName = placeName;
    };

    public toString() {
        return `${this.lat},${this.lng}`
    }
}

export class Report {
    weatherID: number;
    date: Date;
    location: Point;
    temp: number | null;
    highTemp: number | null;
    lowTemp: number | null;
    wind: string;
    cloudCover: string;
    humidity: string;
    // precipChance: string;
    precipTotal: number;
    description: string;

    constructor(details : Report) {
        Object.assign(this, details);
    }
}

export interface IReportDetails {
    
}