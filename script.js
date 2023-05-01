// Global variables
var disp = document.getElementById("locationDisplay");

// Get the latitude and longitude of user
navigator.geolocation.getCurrentPosition((position) => {
    RequestEndpoints(position.coords.latitude, position.coords.longitude);
});

function RequestEndpoints(x, y) {
    // Variables
    let ajax = new XMLHttpRequest; // Asynchronous JavaScript And Xml
    let requestMethod = "GET"; // Give me data
    let requestUrl = `https://api.weather.gov/points/${x},${y}`; // URL
    let requestIsAsyncronous = true; // Don't hold up wepage when awaiting response

    // Send AJAX request to the URL
    ajax.open(requestMethod, requestUrl, requestIsAsyncronous); // ajax.open(method, url, async)

    // Set callback function
    ajax.onreadystatechange = ReturnEndpoints;
    // This function gets called automatically when the response gets back

    // Send request
    ajax.send();
}// End function

function ReturnEndpoints() {
    // Get response from api
    var responseStatusOK = this.status === 200; // Status 200 means OK
    var responseComplete = this.readyState === 4; // readyState 4 means response is ready

    // If response is good
    if (responseStatusOK && responseComplete) {
        // Parse response and convert values to JSON
        let responseData = JSON.parse(this.responseText);

        // Get the office, gridX, and gridY from the response text
        let properties = responseData.properties;
        let office = properties.gridId;
        let gridX = properties.gridX;
        let gridY = properties.gridY;

        // Send info to RequestForecast
        RequestForecast(office, gridX, gridY);
    }// End if
}// End function

function RequestForecast(office, gridX, gridY) {
    // Variables
    let ajax = new XMLHttpRequest; // Asynchronous JavaScript And Xml
    let requestMethod = "GET"; // Give me data
    let requestUrl = `https://api.weather.gov/gridpoints/${office}/${gridX},${gridY}/forecast`; // URL
    let requestIsAsyncronous = true; // Don't hold up wepage when awaiting response

    // Send AJAX request to the URL
    ajax.open(requestMethod, requestUrl, requestIsAsyncronous); // ajax.open(method, url, async)

    // Set callback function
    ajax.onreadystatechange = ReturnForecast;
    // This function gets called automatically when the response gets back

    // Send request
    ajax.send();
}// End function

function ReturnForecast() {
    // Get response from api
    var responseStatusOk = this.status === 200; //STATUS 200 means OK
    var responseComplete = this.readyState === 4; //readyState 4 means response is ready

    // If response is good
    if (responseStatusOk && responseComplete) {
        // Parse response and convert values to JSON
        let responseData = JSON.parse(this.responseText);

        // Get the weather from the response text
        let properties = responseData.properties;

        // String to store forecasts
        let weatherString = "";

        // Loop through properties
        for (i = 0; i < properties.periods.length; i++) {
            // Add each forecast name to string
            weatherString += "<h2>" + properties.periods[i].name + "</h2>";

            // Set weather image icon
            let img = '"' + properties.periods[i].icon + '"';

            // Set image alt text to short forecast
            let imgAlt = '"' + properties.periods[i].shortForecast + '"';

            // Add each image to string
            weatherString += "<img src=" + img + " alt=" + imgAlt + "></img>";

            // Insert break
            weatherString += "<br />";

            // Add each detailed forecast to string
            weatherString += properties.periods[i].detailedForecast;

            // If before last forecast
            if (i < properties.periods.length - 1) {
                // Insert double break on end
                weatherString += "<br /><br />";

                // Insert horizontal line
                weatherString += "<hr />";
            }// End if
        }// End for

        // Display weather on page
        disp.innerHTML = weatherString;
    }// End if
}// End function
