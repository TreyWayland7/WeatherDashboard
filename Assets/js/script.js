// const dayjs = require("dayjs")
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
// let savedForcast = JSON.parse(localStorage.getItem("savedForcast"));
let id = 0;
// let savedForcast = [];
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
    //lat=33.44&lon=-94.04

}


function addSearchHistory(cityInput){
    //searchHistoryEl
    let searchHistoryContainerEl = document.createElement("div");
    searchHistoryContainerEl.classList.add("historyContainer");
    searchHistoryContainerEl.innerHTML = cityInput;
    searchHistoryContainerEl.addEventListener('click', displayLocationFromSearchHistory);
    searchHistoryEl.appendChild(searchHistoryContainerEl);
    

}

function displayLocationFromSearchHistory(event){
    // event.preventDefault();
    // storedWeather = JSON.parse(localStorage.getItem("savedWeather"));
    cityName = event.currentTarget.innerHTML;
    let currentWeather = "";
    let currentID = "";
    let currentForcast = "";
    // console.log(savedWeather);

    for(let i=0; i<savedWeather.length; i++){
        weather = savedWeather[i];
        if (weather.name == cityName){
            currentWeather = weather;
            currentID = weather.id;
            let savedForcast = JSON.parse(localStorage.getItem("savedForcast" + currentID));
            currentForcast = savedForcast;
        }
    }
    console.log(currentWeather);
    console.log(currentForcast);
    // console.log();
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
    
    // console.log(apiRequest);


    
    fetch(apiRequest)
        .then(response => {
            if (response.ok) {
                return response.json(); // Parse the response data as JSON
            } else {
                throw new Error('API request failed');
            }
        })
        .then(data => {
            // Process the response data here
            // console.log(data); // Example: Logging the data to the console
            // console.log(data.wind.speed);
            // console.log(((data.main.temp-273.15)*1.8)+32);//((K-273.15)*1.8)+32
            // console.log(data.main.humidity);
            // console.log(data.weather[0].description);
            
            const forcastObj = handleForcastRequest(data);
            console.log(forcastObj);
            // return data;

            
        })
        .catch(error => {
            // Handle any errors here
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
        // console.log(forcast);
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

        // console.log(forcastObj);
        // let forCastContainer = document.createElement("div");
        // forCastContainer.classList.add("col");
        // forCastContainer.classList.add("forcastContainer");
        // forCastContainer.innerHTML = "this";
        // forcastRowAppendEl.appendChild(forCastContainer);

        // let forCastDateEl = document.createElement("div");
        // forCastDateEl.classList.add("forcastDate");
        // forCastDateEl.innerHTML = dayjs(forcastObj.date.split(" ")[0]).format('dddd, MMMM D YYYY');
        // forCastContainer.appendChild(forCastDateEl);

        // let forcastIconEl = document.createElement("img");
        // forcastIconEl.src = `https://openweathermap.org/img/wn/${forcastObj.iconID}@2x.png`
        // console.log(forcastIconEl.src);
        // forCastContainer.appendChild(forcastIconEl);
        // // temp
        // let divForcastTempEl = document.createElement("div");
        // divForcastTempEl.innerHTML = "TEMP: " + forcastObj.temp + "&#8457";
        // forCastContainer.appendChild(divForcastTempEl);
        // // wind
        // let divForcastWindEl = document.createElement("div");
        // divForcastWindEl.innerHTML = "Wind: " + forcastObj.windSpeed + " MPH";
        // forCastContainer.appendChild(divForcastWindEl);
        // // humidity
        // let divForcastHumidityEl = document.createElement("div");
        // divForcastHumidityEl.innerHTML = "Humidity: " + forcastObj.humidity + "%";
        // forCastContainer.appendChild(divForcastHumidityEl);
  
 
        // return forcastObj;
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
    // console.log(data); // Example: Logging the data to the console
    // console.log(data.wind.speed);
    // console.log((((data.main.temp-273.15)*1.8)+32).toFixed(2));//((K-273.15)*1.8)+32
    // console.log(data.main.humidity);
    // console.log(data.weather[0].description);
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
    
    // console.log(apiRequest);


    
    fetch(apiRequest)
        .then(response => {
            if (response.ok) {
                return response.json(); // Parse the response data as JSON
            } else {
                throw new Error('API request failed');
            }
        })
        .then(data => {
            // Process the response data here
            // console.log(data); // Example: Logging the data to the console
            // console.log(data.wind.speed);
            // console.log(((data.main.temp-273.15)*1.8)+32);//((K-273.15)*1.8)+32
            // console.log(data.main.humidity);
            // console.log(data.weather[0].description);
            
            handleWeatherRequest(data);
            // return data;

            
        })
        .catch(error => {
            // Handle any errors here
            console.error(error); // Example: Logging the error to the console
    });

}



weatherFormEl.addEventListener("submit", weatherFormSubmitHandler);
