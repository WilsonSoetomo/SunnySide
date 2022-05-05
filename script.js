var cityList = document.querySelector(".cityHistory");
var APIkey = "3d6e43d79aa3e316dee7cb1fc394f4b1";
var cities = JSON.parse(localStorage.getItem("city")) || [];
var APIcity = "https://api.openweathermap.org/data/2.5/weather";
var APIcord = "http://api.openweathermap.org/data/2.5/onecall";
let submitBtn = document.querySelector(".searchBarBtn");
var inputEl = document.querySelector(".cityHere");
var currentHour = new Date();
var fiveDaysDiv = $(".fiveDays");
// GIVEN a weather dashboard with form inputs

function appendCityList(city, i) {
  $(".cityHistory").append(
    `<button data-city="${city}" class="cityButton" id="city-${i}"><span class="cityName">${city}</span></button>`
  );
  console.log(city);
  console.log(i);
}
//function to take in a city and does a API search, maybe also appends results on page with dynamic html
function getCity(city) {
  console.log("WILSONS CITY --- ", city);
  fetch(APIcity + `?q=${encodeURI(city)}&appid=${APIkey}`)
    .then((cityRes) => cityRes.json())
    .then((cityData) => {
      console.log(cityData);

      //adding searched city to the list, saving in localStorage
      if (!cities.includes(city)) {
        cities.push(city);
        localStorage.setItem("city", JSON.stringify(cities));
        makeCityList();
      }
      var lat = cityData.coord.lat;
      var lon = cityData.coord.lon;
      fetch(APIcord + `?lat=${lat}&lon=${lon}&appid=${APIkey}`)
        .then((corRes) => corRes.json())
        .then((corData) => {
          $(".weatherIcon").attr(
            "src",
            `http://openweathermap.org/img/wn/${corData.current.weather[0].icon}.png`
          );
          console.log(corData);
          var temp = corData.current.temp;
          console.log(temp);
          var wind = corData.current.wind_speed;
          console.log(wind);
          var humidity = corData.current.humidity;
          console.log(humidity);
          var uv = corData.current.uvi;
          console.log(uv);
          document.querySelector(".cityNameDate").textContent =
            city + " " + currentHour;
          document.querySelector(".temp").textContent =
            parseInt(temp - 273.15) + " Fehrenheit";
          document.querySelector(".wind").textContent = wind + "MPH";
          document.querySelector(".humidity").textContent = humidity + "%";
          document.querySelector(".uv").textContent = uv + " UV index";
          if (uv < 4) {
            document.querySelector(".uv").style.backgroundColor = "green";
          } else if (uv < 7) {
            document.querySelector(".uv").style.backgroundColor = "yellow";
          } else {
            document.querySelector(".uv").style.backgroundColor = "red";
          }
          var daily = corData.daily;
          make5Days(daily);
        });
    });
}
//checks for cities stored in localStorage, append them on page if any

function makeCityList() {
  cityList.innerHTML = "";
  var cityArr = JSON.parse(localStorage.getItem("city")) || [];
  //loop through cityArr to make buttons
  for (var i = 0; i < cityArr.length; i++) {
    appendCityList(cityArr[i], i);
  }
}
submitBtn.addEventListener("click", function () {
  getCity(inputEl.value.trim());
});
function make5Days(daily) {
  fiveDaysDiv.html("");
  for (i = 1; i < 6; i++) {
    console.log(daily);
    var div = document.createElement("div");
    var weatherDate = document.createElement("p");
    var icon = document.createElement("img");
    var temp = document.createElement("p");
    var wind = document.createElement("p");
    var humidity = document.createElement("p");

    weatherDate.textContent = new Date(daily[i].dt * 1000);
    var iconName = daily[i].weather[0].icon;
    icon.src = `http://openweathermap.org/img/wn/${iconName}.png`;
    temp.textContent = "Temp: " + daily[i].temp.day;
    wind.textContent = "speed = " + daily[i].wind_speed + "MPH";
    humidity.textContent = "humidity = " + daily[i].humidity + "%";

    div.append(weatherDate);
    div.append(icon);
    div.append(temp);
    div.append(wind);
    div.append(humidity);
    fiveDaysDiv.append(div);
  }
}
