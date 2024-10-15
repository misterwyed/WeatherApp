function fetchWeather() {
    let searchInput = document.getElementById("search").value;
    const weatherDataSection = document.getElementById("weather-data");
    weatherDataSection.style.display = "block";
    const apiKey = "1bb77b4160727470d07ea3b96fb28560"; 
   
    if (searchInput == "") {
        weatherDataSection.innerHTML = `
        <div>
            <h2>Empty Input!</h2>
            <p>Please try again with a valid <u>city name</u>.</p>
        </div>
        `;
        return;
    }

    async function getLonAndLat() {
        const geocodeURL = `https://api.openweathermap.org/geo/1.0/direct?q=${searchInput.replace(" ", "%20")}&limit=1&appid=${apiKey}`;
        
        try {
            const response = await fetch(geocodeURL);
            const data = await response.json();

            if (data.length === 0) {
                weatherDataSection.innerHTML = `
                <div>
                    <h2>City Not Found!</h2>
                    <p>Please try again with a valid <u>city name</u>.</p>
                </div>
                `;
                return;
            }

            const { lat, lon } = data[0];
            getWeatherData(lat, lon);
        } catch (error) {
            console.error("Error fetching geolocation data:", error);
            weatherDataSection.innerHTML = `
            <div>
                <h2>Error!</h2>
                <p>Unable to fetch location data. Please try again later.</p>
            </div>
            `;
        }
    }

    async function getWeatherData(lat, lon) {
        const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

        try {
            const response = await fetch(weatherURL);
            const data = await response.json();

            // Check for response and show weather data
            if (data.cod !== 200) {
                weatherDataSection.innerHTML = `
                <div>
                    <h2>Error!</h2>
                    <p>${data.message}</p>
                </div>
                `;
                return;
            }

            const { name, main, weather } = data;
            weatherDataSection.innerHTML = `
            <h2>Weather in ${name}</h2>
            <p>Temperature: ${main.temp} °C</p>
            <p>Condition: ${weather[0].description}</p>
            <p>Humidity: ${main.humidity}%</p>
            <p>Wind Speed: ${data.wind.speed} m/s</p>
            `;
        } catch (error) {
            console.error("Error fetching weather data:", error);
            weatherDataSection.innerHTML = `
            <div>
                <h2>Error!</h2>
                <p>Unable to fetch weather data. Please try again later.</p>
            </div>
            `;
        }
    }

    // Call the function to get latitude and longitude
    getLonAndLat();
}
