const apiKey = "ec0431649f7a4fef9d813649261911";           

// Search button 
async function getWeather() {
    const city = document.getElementById("cityinput").value.trim();
    const message = document.getElementById("message");
    message.innerText = "";


    //If city empty
    if (city === "") {
        message.innerText = "Please enter a city name...";
        return;
    }
    


    // WeatherAPI URL
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=5&aqi=no`;

    try {
        // Get data in Api
        const response = await fetch(url);
        
        // Error msg
        if (!response.ok) {
            message.innerText = "City not found.., Please try again.";
            return;
        }

        const data = await response.json();

        updateMap(
                data.location.lat,
                data.location.lon,
                data.location.name
        );


        // Main weather data
        document.getElementById("cityName").innerText = `${data.location.name}, ${data.location.country}`;
        document.getElementById("temperature").innerText = `${Math.round(data.current.temp_c)}°C`;
        document.getElementById("description").innerText = data.current.condition.text;

        
        // WeatherAPI Icon 
        document.getElementById("weatherIcon").innerHTML = `<img src="https:${data.current.condition.icon}" alt="weather icon">`;


        // Humidity, Wind, Feels Like
        document.getElementById("humidity").innerText = `${data.current.humidity}%`;
        document.getElementById("wind").innerText = `${data.current.wind_kph} km/h`;
        document.getElementById("feelsLike").innerText = `${Math.round(data.current.feelslike_c)}°C`;



        // Next day Forecast
        const forecastContainer = document.getElementById("forecast");
        forecastContainer.innerHTML = ""; 

        // API එකෙන් එන දින 5ක දත්ත එකින් එක loop කිරීම
        data.forecast.forecastday.forEach(day => {
            // දිනය සතියේ දවසක් (Mon, Tue වැනි) බවට හැරවීම
            const date = new Date(day.date);
            const dayName = date.toLocaleDateString("en-US", { weekday: "short" });

            // HTML card 
            const card = `
                <div class="forecast-card">
                    <p><strong>${dayName}</strong></p>
                    <img class="forecast-icon" src="https:${day.day.condition.icon}" alt="icon">
                    <p>${Math.round(day.day.avgtemp_c)}°C</p>
                    <p>🌬️ ${day.day.maxwind_kph} km/h</p>
                </div>
            `;
            forecastContainer.innerHTML += card;
        });

    } catch (error) {
        console.error("Error fetching weather data:", error);
        message.innerText = "Something went wrong., Check your connection.";
    }
}


// Press Enter key and search 
document.getElementById("cityinput").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        getWeather();
    }
});



// Show first, Colombo weather
window.onload = () => {
    document.getElementById("cityinput").value = "Colombo";
    getWeather();
};



// Create Map

let map = L.map("map").setView([6.9271, 79.8612], 10);


// Map Tiles

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap"
}).addTo(map);


// Location Marker

let marker = L.marker([6.9271, 79.8612]).addTo(map);

marker.bindPopup("Colombo").openPopup();


// Update Map Location

function updateMap(lat, lon, cityName) {

    map.setView([lat, lon], 10);
    marker.setLatLng([lat, lon]);
    marker.bindPopup(cityName).openPopup();

}