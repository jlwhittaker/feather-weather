class WeatherApp extends React.Component {

    constructor(props) {
        super(props);
        this.search = this.search.bind(this);
        this.state = {"status": "unloaded"};
    }

    render() {
        if (this.state.success == false) {
            return (
                <div className="container">
                    <Header
                        success={false}
                        droppedDown={true} 
                        search={this.search}
                        status={this.state.status}
                    />
                    <img src="img/unloaded.svg" className="unloaded"/>
                </div>
            )
        }
        if (this.state.status == "unloaded") {
            return (
                <div className="container">
                    <Header
                        droppedDown={true} 
                        search={this.search}
                        status={this.state.status}
                    />
                    <img src="img/unloaded.svg" className="unloaded"/>
                </div>
            )
        }
        else if (this.state.status == "loading") {
            return (
                <div className="container">
                    <Header
                        placeName="Searching..."
                        droppedDown={false}
                        search={this.search}
                        status={this.state.status}
                    />
                    <div className="loading"></div>
                </div>
            )
        }
        // Page is loaded
        let hour = (new Date()).getHours();
        let night = false;
        if (hour < 5 || hour > 20) {
            night = true;
        }
        let weatherClass = WeatherApp.getWeatherClass(this.state.current.weatherID, night);
        return (
            <div className="container">
                <Header 
                    droppedDown={false}
                    placeName={this.state.meta.placeName} 
                    search={this.search}
                    status={this.state.status}
                />   
                <CurrentReport
                    weatherClass={weatherClass}
                    imagePath={`img/${weatherClass}.svg`}
                    temperature={this.state.current.temp}
                    description={this.state.current.description}
                    precip=
                        { (this.state.forecast[0].precipTotal ?
                            this.state.forecast[0].precipTotal : 0)+"\""}
                    precipImagePath={this.state.current.weatherID >= 700 && !night ? 
                        "img/precip-black.svg" : "img/precip-white.svg"}
                    humidityImagePath={this.state.current.weatherID >= 700 && !night ? 
                        "img/humidity-black.svg" : "img/humidity-white.svg"}
                    windImagePath={this.state.current.weatherID >= 700 && !night ?  
                        "img/wind-black.svg" : "img/wind-white.svg"}
                    wind={this.state.forecast[0].wind}
                    humidity={this.state.current.humidity+"%"}
                    loaded={this.state.loaded}
                />
                <Forecast 
                    reports={this.state.forecast}
                    loaded={this.state.loaded}
                />
            </div>
        )
    }

    static getWeatherClass(weatherID, night) {
        if (weatherID == 800) {
            return night ? "clear-night" : "clear";
        }
        else if (weatherID >= 802 && weatherID <= 803) {
            return "partly-cloudy";
        }
        let mainCode = Math.round(weatherID/100);
        switch (mainCode) {
            case 2:
                return "storm";
            case 3:
                return "rain";
            case 5:
                return "rain";
            case 6:
                return "snow";
            case 7:
                return "atmosphere";
            case 8:
                return "cloud";
        }
    }

    async search(query) {
        this.setState({"status": "loading",
                        "success": true,
                        });
        fetch(`weather?q=${query}`).then((r) => {
            return r.json();
        }).then((res) => {
            if (res.success == false) {
                this.setState({"success": false});
            }
            else {
                this.setState(res);
                this.setState({
                    "status" : "loaded",
                    "success" : true,
                    });
            }
        })
    }
}

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.dropDown = this.dropDown.bind(this);
        this.setQuery = this.setQuery.bind(this);
        this.sendSearch = this.sendSearch.bind(this);
        this.keyPress = this.keyPress.bind(this);
        this.search = props.search;
        this.state = {
            placeName: props.placeName,
            droppedDown: props.droppedDown,
        };
    }

    dropDown() {
        this.setState({"droppedDown": !this.state.droppedDown});
    }

    setQuery(e) {
        this.setState({"query": e.target.value});   
    }

    keyPress(e) {
        if (e.charCode == 13) {
            this.sendSearch();
        }
    }

    sendSearch() {
        this.search(this.state.query);
        this.setState({"droppedDown": false})
        document.querySelector(".search-input input").value='';
    }

    render() {
        if (this.props.success == false) {
            return (
                <header>
                    <div className="place-info" onClick={this.dropDown}>
                        <h2 className="place-name">No Results Found</h2>
                    </div>
                    <div className="search active">
                        <div className="search-input">
                            <input type="text" onKeyPress={this.keyPress} onChange={this.setQuery} placeholder="Search city/town or zip code..."/>
                        </div>
                        <button className="search-button" onClick={this.sendSearch}>&#128269;</button>
                    </div>
                </header> 
            )
        }
        if (this.props.status == "unloaded") {
            return (
            <header>
                <div className="place-info" onClick={this.dropDown}>
                    <h2 className="place-name">Search for weather...</h2>
                </div>
                <div className="search active">
                    <div className="search-input">
                        <input type="text" onKeyPress={this.keyPress} onChange={this.setQuery} placeholder="Search city/town or zip code..."/>
                    </div>
                    <button className="search-button" onClick={this.sendSearch}>&#128269;</button>
                </div>
            </header>                
            )
        }
        else if (this.props.status == "loading") {
            return (
            <header>
                <div className="place-info" onClick={this.dropDown}>
                    <h2 className="place-name">{this.props.placeName}</h2>
                </div>
                <div className="search inactive">
                    <div className="search-input">
                        <input type="text" onKeyPress={this.keyPress} onChange={this.setQuery} placeholder="Search city/town or zip code..."/>
                    </div>
                    <button className="search-button" onClick={this.sendSearch}>&#128269;</button>
                </div>
            </header>                
            )
        }
        return (
        <header>
            <div className="place-info" onClick={this.dropDown}>
                <h2 className="place-name">{this.props.placeName}</h2>
                <div className="dropdown">&#x25BC;</div>
            </div>
            <div className={"search " + (!this.props.status | this.state.droppedDown ? "active" : "inactive")}>
                <div className="search-input">
                    <input type="text" onKeyPress={this.keyPress} onChange={this.setQuery} placeholder="Search city/town or zip code..." />
                </div>
                <button className="search-button" onClick={this.sendSearch}>&#128269;</button>
            </div>
        </header>
        );
    }


}
class CurrentReport extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
        <div className={"current-report " + this.props.weatherClass}>
            <div className="report">
                <div className="report-image">
                    <img className="weather-icon" src={this.props.imagePath} alt=""/>
                </div>
                <div className="description">
                    <p>{this.props.temperature}&#176;</p>
                    <p>{this.props.description}</p>
                </div>
            </div>
            <div className="weather-details">
                <div className="precipitation">
                    <img src={this.props.precipImagePath} alt="" />
                    <p>{this.props.precip}</p>
                </div>
                <div className="humidity">
                    <img src={this.props.humidityImagePath} alt="" />
                    <p>{this.props.humidity}</p>
                </div>
                <div className="wind">
                    <img src={this.props.windImagePath} alt="" />
                    <p className="wind-speed">{this.props.wind}</p>
                </div>
            </div>
        </div>
        )
    }
}

class Forecast extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let cards = [];
        for (let i = 0; i < 7; i++) {
            cards.push(<ForecastCard
                            key={i} 
                            report={this.props.reports[i]}
                            />)
        }
        return (
            <div className="forecast">
                {cards}
            </div>
        )
    }
}

class ForecastCard extends React.Component {
    constructor(props) {
        super(props);
        this.formatDate = this.formatDate.bind(this);
    }

    formatDate(dateString) {
        let d = new Date(dateString);
        let days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
        let weekday;
        let date = d.getDate();
        let month = d.getMonth()+1;
        if (Date.now().getDay == d.getDay()) {
            weekday = "Today";
        } else {
            weekday = days[d.getDay()];
        }

        return `${weekday}, ${month}/${date}`;
    }
    
    render() {
        return (
            <div className="forecast-card">
                <div className="forecast-day">
                    <p>{this.formatDate(this.props.report.date)}</p>
                </div>
                <div className={WeatherApp.getWeatherClass(this.props.report.weatherID)+" forecast-image"}>
                    <img src={"img/"+WeatherApp.getWeatherClass(this.props.report.weatherID)+".svg"} alt="#" className="forecast-icon"/>
                    <p className="forecast-description">{this.props.report.description}</p>
                </div>
                <div className="forecast-details">
                    <div className="forecast-temps">
                        <p className="high">{this.props.report.highTemp}</p>
                        <p className="low">{this.props.report.lowTemp}</p>
                    </div>
                    <div className="forecast-precipitation">
                        <img src="img/precip-black.svg" alt=""/>
                        <p>{(this.props.report.precipTotal ? this.props.report.precipTotal : 0)+"\""}</p>
                    </div>
                </div>
            </div>
        )
    }
}

const app_root = document.getElementById("app-root");
ReactDOM.render(React.createElement(WeatherApp, { placeName: "West Fork, AR"}), app_root);