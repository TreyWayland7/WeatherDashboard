const weatherFormEl = document.getElementById("weatherForm");
const inputWeatherCityEl = document.getElementById("inputWeatherCity");
const todayDisplayEl = document.getElementById("todayDisplay");
const forcastRowAppendEl = document.getElementById("forcastRowAppend");
const searchHistoryEl = document.getElementById("searchHistoryEl");
const currentWeatherIconEl = document.getElementById("currentWeatherIcon");
const currentWeatherHumidityEl = document.getElementById("currentWeatherHumidity");
const currentWeatherWindEl = document.getElementById("currentWeatherWind");
const currentWeatherTempEl = document.getElementById("currentWeatherTemp");
const currentWeatherDateEl = document.getElementById("currentWeatherDate");

const apiKey = "86c614e4ea9b60a41fe8906b391de9ca";
let storedID = JSON.parse(localStorage.getItem("id"));
let storedWeather = JSON.parse(localStorage.getItem("savedWeather"));
let id = 0;
let savedWeather = [];

if (storedID > 0){
    id = storedID;
}

if (storedWeather != null){
    savedWeather = storedWeather;
    renderSavedLocations();
}

function renderSavedLocations(){
    for(weather of storedWeather){
        addSearchHistory(weather.name);
    }
}

function weatherFormSubmitHandler(event){
    event.preventDefault();
    const cityInput = inputWeatherCity.value;
    callWeatherAPI(cityInput);
    callForcastAPI(cityInput);
    addSearchHistory(cityInput);
    id += 1;
    localStorage.setItem('id', JSON.stringify(id));
}

function addSearchHistory(cityInput){
    let searchHistoryContainerEl = document.createElement("div");
    searchHistoryContainerEl.classList.add("historyContainer");
    searchHistoryContainerEl.innerHTML = cityInput;
    searchHistoryContainerEl.addEventListener('click', displayLocationFromSearchHistory);
    searchHistoryEl.appendChild(searchHistoryContainerEl);
}

function displayLocationFromSearchHistory(event){
    cityName = event.currentTarget.innerHTML;
    let currentWeather = "";
    let currentID = "";
    let currentForcast = "";
    // console.log(savedWeather);
    for(let i=0; i<savedWeather.length; i++){
        weather = savedWeather[i];
        if (weather.name.toLowerCase() == cityName.toLowerCase()){
            currentWeather = weather;
            currentID = weather.id;
            let savedForcast = JSON.parse(localStorage.getItem("savedForcast" + currentID));
            currentForcast = savedForcast;
        }
    }

    const today = dayjs();
    currentWeatherDateEl.innerHTML = currentWeather.name + " - " + today.format('dddd, MMMM D YYYY');
    currentWeatherTempEl.innerHTML = "Temp: " + currentWeather.temp + "&#8457";
    currentWeatherWindEl.innerHTML = "Wind: " + currentWeather.windSpeed + " MPH";
    currentWeatherHumidityEl.innerHTML = "Humidity: " + currentWeather.humidity + "%";
    currentWeatherIconEl.src = `https://openweathermap.org/img/wn/${currentWeather.iconID}@2x.png`;
    for (i=0; i< currentForcast.length; i++){
        forcast = currentForcast[i];
        let index = i +1;
        const forCastDateEl = document.getElementById("forCastDate" + index);
        const forCastIconEl = document.getElementById("forCastIcon" + index);
        const forCastTempEl = document.getElementById("forCastTemp" + index);
        const forCastWindEl = document.getElementById("forCastWind" + index);
        const forCastHumidityEl = document.getElementById("forCastHumidity" + index);

        forCastDateEl.innerHTML = dayjs(forcast.date.split(" ")[0]).format('dddd, MMMM D YYYY');
        forCastIconEl.src = `https://openweathermap.org/img/wn/${forcast.iconID}@2x.png`;
        forCastTempEl.innerHTML = "TEMP: " + forcast.temp + "&#8457";
        forCastWindEl.innerHTML = "Wind: " + forcast.windSpeed + " MPH";
        forCastHumidityEl.innerHTML = "Humidity: " + forcast.humidity + "%";
    }
}

function callForcastAPI(cityName){
    const apiRequest = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&APPID=4393ee44e42a1059d7c3b2ec2bb61fc3`;
    fetch(apiRequest)
        .then(response => {
            if (response.ok) {
                return response.json(); // Parse the response data as JSON
            } else {
                throw new Error('API request failed');
            }
        })
        .then(data => {
            const forcastObj = handleForcastRequest(data);
            console.log(forcastObj);
        })
        .catch(error => {
            console.error(error); // Example: Logging the error to the console
    });
}

function handleForcastRequest(data){
    dayOne_focastData = data.list[3];
    dayTwo_focastData = data.list[12];
    dayThree_focastData = data.list[21];
    dayFour_focastData = data.list[27];
    dayFive_focastData = data.list[35];

    let forcastDays = [dayOne_focastData, dayTwo_focastData, dayThree_focastData, dayFour_focastData, dayFive_focastData];
    let savedForcast = [];

    for (i=0; i< forcastDays.length; i++){
        forcast = forcastDays[i];
        const forcastObj = createForcastObject(forcast);

        let index = i +1;
        const forCastDateEl = document.getElementById("forCastDate" + index);
        const forCastIconEl = document.getElementById("forCastIcon" + index);
        const forCastTempEl = document.getElementById("forCastTemp" + index);
        const forCastWindEl = document.getElementById("forCastWind" + index);
        const forCastHumidityEl = document.getElementById("forCastHumidity" + index);

        forCastDateEl.innerHTML = dayjs(forcastObj.date.split(" ")[0]).format('dddd, MMMM D YYYY');
        forCastIconEl.src = `https://openweathermap.org/img/wn/${forcastObj.iconID}@2x.png`;
        forCastTempEl.innerHTML = "TEMP: " + forcastObj.temp + "&#8457";
        forCastWindEl.innerHTML = "Wind: " + forcastObj.windSpeed + " MPH";
        forCastHumidityEl.innerHTML = "Humidity: " + forcastObj.humidity + "%";

        savedForcast.push(forcastObj);
        localStorage.setItem('savedForcast' + id, JSON.stringify(savedForcast));
    };
}

function createForcastObject(data){
    console.log(data);
    const forcastObj = {
        date : data.dt_txt,
        iconID : data.weather[0].icon,
        windSpeed : data.wind.speed,
        temp : (((data.main.temp-273.15)*1.8)+32).toFixed(2),
        humidity : data.main.humidity,
        id : id
    };
    return forcastObj;
}

function handleWeatherRequest(data){
    const weatherObj = createWeatherDayObject(data)
    const today = dayjs();
    currentWeatherDateEl.innerHTML = weatherObj.name + " - " + today.format('dddd, MMMM D YYYY');
    currentWeatherTempEl.innerHTML = "Temp: " + weatherObj.temp + "&#8457";
    currentWeatherWindEl.innerHTML = "Wind: " + weatherObj.windSpeed + " MPH";
    currentWeatherHumidityEl.innerHTML = "Humidity: " + weatherObj.humidity + "%";
    currentWeatherIconEl.src = `https://openweathermap.org/img/wn/${weatherObj.iconID}@2x.png`;
    savedWeather.push(weatherObj);
    localStorage.setItem('savedWeather', JSON.stringify(savedWeather));
}

function createWeatherDayObject(data){
    const weatherObj = {
        name : data.name,
        iconID : data.weather[0].icon,
        windSpeed : data.wind.speed,
        temp : (((data.main.temp-273.15)*1.8)+32).toFixed(2),
        humidity : data.main.humidity,
        id : id
    }
    return weatherObj;
}

function callWeatherAPI(cityName){
    const apiRequest = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&APPID=4393ee44e42a1059d7c3b2ec2bb61fc3`;
    fetch(apiRequest)
        .then(response => {
            if (response.ok) {
                return response.json(); // Parse the response data as JSON
            } else {
                throw new Error('API request failed');
            }
        })
        .then(data => {
            handleWeatherRequest(data);
        })
        .catch(error => {
            console.error(error); // Example: Logging the error to the console
    });
}

weatherFormEl.addEventListener("submit", weatherFormSubmitHandler);
