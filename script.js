$(".container").append(
  $(`<div class="searchBar col-8" cols="30" rows="3" >
            <input type="text" placeholder="search for the weather here!" cols="30" rows="3" class="cityHere col-9">
            <button class="searchBarBtn">search</button>
        </div>
    </div>
    <div>
    <div class="details hidden">
        <div class="weatherInfo">this is weather info:</div>
        <div class="dayBox">[][][][][] data of five days portrayed in flex boxes</div>
    </div>`)
);

// GIVEN a weather dashboard with form inputs

// WHEN I search for a city
//line 3
let submitBtn = document.querySelector(".searchBarBtn");
submitBtn.addEventListener("click",(e) => {
    let insert = document.querySelector(".cityHere").value;
    localStorage.setItem("city",insert);
    
    console.log(insert)

});

// THEN I am presented with current and future conditions for that city and that city is added to the search history

// WHEN I view current weather conditions for that city

// THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index

// WHEN I view the UV index

// THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe

// WHEN I view future weather conditions for that city

// THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity

// WHEN I click on a city in the search history

// THEN I am again presented with current and future conditions for that city
