const express = require('express');
const app = express();
const port = 3000;
import { Reporter, Geocoder } from './utils';
import { Report, Point } from './types';

app.use(express.static("static"));

// init tools
const reporter = Reporter.getInstance();
const geocoder = Geocoder.getInstance()

app.get('/weather', (req: any, res: any) => {
    // use placename to get point from Geocoding API
    let placeName = req.query.q;
    let point : Point | boolean;
    geocoder.getPoint(placeName).then((p) => {
        if (!p) {
            res.send(JSON.stringify({
                "success": false,
            }))
        }
        else {
            point = p;
            // use point to get report
            reporter.getReport(point).then((r) => {
                res.send(JSON.stringify(r));
            });
        }
    });

});

app.get('/', (req: any, res: any) => {
    res.sendFile(__dirname + "/index.html");
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
})
