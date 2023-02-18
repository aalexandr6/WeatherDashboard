// Global Variables 
var APIkey = "94becf6ba470613c95a15a73a858c3ff";
//Weather Variables
var searchHistoryList = $('#search-history-list');
var searchCityInput = $("#search-city");
var searchCityButton = $("#search-city-button");
var clearHistoryButton = $("#clear-history");

var currentCity = $("#current-city");
var currentTemp = $("#current-temp");
var currentHumidity = $("#current-humidity");
var currentWindSpeed = $("#current-wind-speed");
var UVindex = $("#uv-index");
var weatherContent = $("#weather-content");
// City list
var cityList = [];
// Current date to display in data
var currentDate = moment().format('L');
$("#current-date").text("(" + currentDate + ")");
//API Call
function currentConditionsRequest(searchValue) {
var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + searchValue + "&units=imperial&appid=" + APIkey;
$.ajax({//
        url: queryURL,
        method: "GET"
}).then(function(response){
    console.log(response);
    currentCity.text(response.name);
    currentCity.append("<small class='text-muted' id='current-date'>");
    $("#current-date").text("(" + currentDate + ")");
    currentCity.append("<img src='https://openweathermap.org/img/w/" + response.weather[0].icon + ".png' alt='" + response.weather[0].main + "' />" )
    currentTemp.text(response.main.temp);
    currentTemp.append("&deg;F");
    currentHumidity.text(response.main.humidity + "%");
    currentWindSpeed.text(response.wind.speed + "MPH");
var lat = response.coord.lat;
var lon = response.coord.lon;
var UVurl = "https://api.openweathermap.org/data/2.5/uvi?&lat=" + lat + "&lon=" + lon + "&appid=" + APIkey;
//UV index
$.ajax({
    url: UVurl,
     method: "GET"
        }).then(function(response){
    UVindex.text(response.value);
        });

var countryCode = response.sys.country;
var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?&units=imperial&appid=" + APIkey + "&lat=" + lat +  "&lon=" + lon;
$.ajax({
    url: forecastURL,
    method: "GET"
    }).then(function(response){
    console.log(response);
    $('#five-day-forecast').empty();
    for (var i = 1; i < response.list.length; i+=8) {

var forecastDateString = moment(response.list[i].dt_txt).format("L");
console.log(forecastDateString);
var forecastCol = $("<div class='col-12 col-md-6 col-lg forecast-day mb-3'>");
var forecastCard = $("<div class='card'>");
var forecastCardBody = $("<div class='card-body'>");
var forecastDate = $("<h5 class='card-title'>");
var forecastIcon = $("<img>");
var forecastTemp = $("<p class='card-text mb-0'>");
var forecastHumidity = $("<p class='card-text mb-0'>");

$('#five-day-forecast').append(forecastCol);
forecastCol.append(forecastCard);
forecastCard.append(forecastCardBody);
forecastCardBody.append(forecastDate);
forecastCardBody.append(forecastIcon);
forecastCardBody.append(forecastTemp);
forecastCardBody.append(forecastHumidity);
forecastIcon.attr("src", "https://openweathermap.org/img/w/" + response.list[i].weather[0].icon + ".png");
forecastIcon.attr("alt", response.list[i].weather[0].main)
forecastDate.text(forecastDateString);
forecastTemp.text(response.list[i].main.temp);
forecastTemp.prepend("Temp: ");
forecastTemp.append("&deg;F");
forecastHumidity.text(response.list[i].main.humidity);
forecastHumidity.prepend("Humidity: ");
forecastHumidity.append("%");
}
});
});
};
// Search history 
initalizeHistory();
showClear();

$(document).on("submit", function(){
    event.preventDefault();

// Grab value entered into search bar 
var searchValue = searchCityInput.val().trim();
currentConditionsRequest(searchValue)
searchHistory(searchValue);
searchCityInput.val(""); 
});
// Clicking  button will search history
searchCityButton.on("click", function(event){
event.preventDefault();
// Grab value entered into search bar 
var searchValue = searchCityInput.val().trim();
currentConditionsRequest(searchValue)
searchHistory(searchValue);    
searchCityInput.val(""); 
});
//clear history to update local storage
clearHistoryButton.on("click", function(){
cityList = [];
listArray();
    
$(this).addClass("hide");
});
//Search History lookup
searchHistoryList.on("click","li.city-btn", function(event) {
var value = $(this).data("value");
currentConditionsRequest(value);
searchHistory(value); 

});
// Display and save the search history of cities
function searchHistory(searchValue) {
    if (searchValue) {
    if (cityList.indexOf(searchValue) === -1) {
    cityList.push(searchValue);
// List all of the cities in user history
listArray();
    clearHistoryButton.removeClass("hide");
        weatherContent.removeClass("hide");
        } else {
// Remove existing value 
var removeIndex = cityList.indexOf(searchValue);
cityList.splice(removeIndex, 1);
// Push the value again to the array so latest enrty will go to the top
cityList.push(searchValue);
clearHistoryButton.removeClass("hide");
weatherContent.removeClass("hide");
}
}
}
// List the array into the search history sidebar/
searchHistoryList.empty();
    cityList.forEach(function(city){
var searchHistoryItem = $('<li class="list-group-item city-btn">');
searchHistoryItem.attr("data-value", city);
searchHistoryItem.text(city);
searchHistoryList.prepend(searchHistoryItem);
});
localStorage.setItem("cities", JSON.stringify(cityList));
}
// Grab city list string from local storage from array to history
function initalizeHistory() {
    if (localStorage.getItem("cities")) {
    cityList = JSON.parse(localStorage.getItem("cities"));
var lastIndex = cityList.length - 1;
listArray();
    if (cityList.length !== 0) {
    currentConditionsRequest(cityList[lastIndex]);
    weatherContent.removeClass("hide");
    }
}
}
//clear history
function showClear() {
    if (searchHistoryList.text() !== "") {
        clearHistoryButton.removeClass("hide");
    }
}

