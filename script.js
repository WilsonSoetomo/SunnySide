var APIkey = "3d6e43d79aa3e316dee7cb1fc394f4b1";
var cities = JSON.parse(localStorage.getItem("city")) || [];
var APIcity = "https://api.openweathermap.org/data/2.5/weather";
var APIcord = "http://api.openweathermap.org/data/2.5/onecall";
let submitBtn = document.querySelector(".searchBarBtn");
var inputEl = document.querySelector(".cityHere");
// GIVEN a weather dashboard with form inputs

//function to take in a city and does a API search, maybe also appends results on page with dynamic html
function getCity(city) {
  console.log("WILSONS CITY --- ", city);
  fetch(APIcity + `?q=${encodeURI(city)}&appid=${APIkey}`)
    .then((cityRes) => cityRes.json())
    .then((cityData) => {
      console.log(cityData);

      //adding searched city to the list, saving in localStorage
      cities.push(city);
      localStorage.setItem("city", JSON.stringify(cities));
      makeCityList();
      var lat = cityData.coord.lat;
      var lon = cityData.coord.lon;
      fetch(APIcord + `?lat=${lat}&lon=${lon}&appid=${APIkey}`)
        .then((corRes) => corRes.json())
        .then((corData) => {
          var temp = corData.current.temp;
          var wind = corData.current.wind;
          // var humidity = corData.main.humidity;
          var uv =corData.current.uvi;
          document.querySelector(".temp").textContent = temp;
          document.querySelector(".wind").textContent = wind;
          // document.querySelector(".humidity").textContent = humidity;
          document.querySelector(".uv").textContent = uv;
        });
    });
}
//checks for cities stored in localStorage, append them on page if any
function makeCityList() {
  var cityList = document.querySelector(".cityList");
  cityList.innerHTML = "";
  var cityArr = JSON.parse(localStorage.getItem("city")) || [];
  //loop through cityArr to make buttons
  for (var i = 0; i < cityArr.length; i++) {
    var cityEl = document.createElement("button");
    cityEl.textContent = cityArr[i];
    cityList.append(cityEl);
  }
}

makeCityList();
// THEN I am presented with current and future conditions for that city and that city is added to the search history

// WHEN I view current weather conditions for that city

// THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index

// WHEN I view the UV index

// THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe

// WHEN I view future weather conditions for that city

// THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity

// WHEN I click on a city in the search history

// THEN I am again presented with current and future conditions for that city

//create event listener to listen for click on submitBtn

submitBtn.addEventListener("click", function () {
  getCity(inputEl.value.trim());
});
