<h3>Feather-Weather</h3>
        <h4>Here's how it works:</h4>
        <p>Search for weather.</p>
        <p>Really, that's it. You can use a city name, zip code, abbrevations 
          (like NYC, or XNA), or anything that a google maps search would recognize.
        </p>
        <p>The current report tells you what's going on outside, and each of the 7 day forecasts 
          tells you a basic snapshot of each day.
        </p>
        <div class="modal-button">
          <a href="http://weather.jonlwhittaker.com" target="_blank">Try it out</a>
        </div>

<h3>Running it yourself</h3>
<p>The app is run inside a single Docker container, but it's currently using docker-compose. To build it yourself, just run:</p>
<code>docker-compose build && docker-compose up</code>
<p>from the same directory with the docker-compose file. By default it uses port 3000; to change it, edit the docker-compose file.</p>

