var cityList = document.querySelector(".cityHistory");
var APIkey = "3d6e43d79aa3e316dee7cb1fc394f4b1";
var cities = JSON.parse(localStorage.getItem("city")) || [];
var APIcity = "https://api.openweathermap.org/data/2.5/weather";
var APIcord = "https://api.openweathermap.org/data/2.5/onecall";
let submitBtn = document.querySelector(".searchBarBtn");
var inputEl = document.querySelector(".cityHere");
var currentHour = new Date();
var fiveDaysDiv = document.querySelector(".fiveDays");

// Function to search city and retrieve weather data
function getCity(city, locObj) {
  fetch(APIcity + `?q=${encodeURI(city)}&appid=${APIkey}`)
    .then((cityRes) => cityRes.json())
    .then((cityData) => {
      if (!cities.includes(city)) {
        cities.push(city);
        localStorage.setItem("city", JSON.stringify(cities));
        makeCityList();
      }

      if (cityData.message == "Nothing to geocode") {
        var lat = locObj.lat;
        var lon = locObj.lon;
      } else {
        var lat = cityData.coord.lat;
        var lon = cityData.coord.lon;
      }

      fetch(APIcord + `?lat=${lat}&lon=${lon}&appid=${APIkey}`)
        .then((corRes) => corRes.json())
        .then((corData) => {
          const currentDate = new Date();
          const weekday = currentDate.toLocaleDateString('en-US', { weekday: 'long' }); // Get the day (e.g., "Monday")
          const fullDate = currentDate.toLocaleDateString('en-US'); // Full date

          document.querySelector(".weatherIcon").src = `http://openweathermap.org/img/wn/${corData.current.weather[0].icon}.png`;
          document.querySelector(".cityNameDate").textContent = `${city} - ${weekday}, ${fullDate}`;
          document.querySelector(".temp").textContent = `${Math.round((corData.current.temp - 273.15) * 9/5 + 32)} °F`;
          document.querySelector(".wind").textContent = `${corData.current.wind_speed}`;
          document.querySelector(".humidity").textContent = `${corData.current.humidity}%`;

          // UV Index and color change based on value
          const uvValue = corData.current.uvi;
          const uvElement = document.querySelector(".uv");
          uvElement.textContent = uvValue;

          // Apply background color based on UV index range
          if (uvValue <= 2) {
            uvElement.style.backgroundColor = "green";
            uvElement.style.color = "#fff";
          } else if (uvValue <= 5) {
            uvElement.style.backgroundColor = "yellow";
            uvElement.style.color = "#333";
          } else if (uvValue <= 7) {
            uvElement.style.backgroundColor = "orange";
            uvElement.style.color = "#fff";
          } else if (uvValue <= 10) {
            uvElement.style.backgroundColor = "red";
            uvElement.style.color = "#fff";
          } else {
            uvElement.style.backgroundColor = "purple";
            uvElement.style.color = "#fff";
          }

          make5Days(corData.daily);
        });
    });
}



// Function to create the list of previously searched cities
function makeCityList() {
  cityList.innerHTML = "";
  var cityArr = JSON.parse(localStorage.getItem("city")) || [];
  
  cityArr.forEach((city, index) => {
    var cityItem = document.createElement("li");
    cityItem.className = "list-group-item city-item";

    // Handle "Current Location" case
    if (city === "Current Location") {
      cityItem.textContent = "Current Location"; // Display text for current location
    } else {
      cityItem.textContent = city;
    }

    // Add event listener to fetch weather for the clicked city
    cityItem.addEventListener("click", function () {
      getCity(city); // Fetch weather data for clicked city
    });

    cityList.appendChild(cityItem);
  });
}


// Submit button triggers weather search
submitBtn.addEventListener("click", function () {
  const city = inputEl.value.trim();
  if (city) {  // Check if the city is not an empty string
    getCity(city);
  }
});

// Function to generate 5-day forecast
function make5Days(daily) {
  fiveDaysDiv.innerHTML = "";
  for (let i = 1; i < 6; i++) {
    var div = document.createElement("div");
    div.classList.add("col-2");

    // Get the day of the week
    var dayName = new Date(daily[i].dt * 1000).toLocaleDateString('en-US', { weekday: 'long' });

    // Create and append the day name
    var weatherDay = document.createElement("p");
    weatherDay.textContent = dayName; // Only show the day (e.g., "Monday")

    // Create and append weather icon
    var icon = document.createElement("img");
    icon.src = `http://openweathermap.org/img/wn/${daily[i].weather[0].icon}.png`;
    icon.alt = "Weather icon";

    // Create and append temperature
    var temp = document.createElement("p");
    temp.textContent = `Temp: ${Math.round((daily[i].temp.day - 273.15) * 9/5 + 32)} °F`;

    div.append(weatherDay, icon, temp);
    fiveDaysDiv.appendChild(div);
  }
}


window.onload = makeCityList;

// Get current location weather on load
navigator.geolocation.getCurrentPosition(
  function (pos) {
    getCity("Current Location", { lat: pos.coords.latitude, lon: pos.coords.longitude });
  },
  function (err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  },
  {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0,
  }
);

