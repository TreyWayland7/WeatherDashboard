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


function weatherFormSubmitHandler(event){
    event.preventDefault();
    const cityInput = inputWeatherCity.value;
    callWeatherAPI(cityInput);
    callForcastAPI(cityInput);
    addSearchHistory(cityInput);
    //lat=33.44&lon=-94.04

}


function addSearchHistory(cityInput){
    //searchHistoryEl
    let searchHistoryContainerEl = document.createElement("div");
    searchHistoryContainerEl.classList.add("historyContainer");
    searchHistoryContainerEl.innerHTML = cityInput;
    searchHistoryEl.appendChild(searchHistoryContainerEl);

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
            
            handleForcastRequest(data);
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
    for (forcast of forcastDays){
        console.log(forcast);
        const forcastObj = createForcastObject(forcast);
        // console.log(forcastObj);
        let forCastContainer = document.createElement("div");
        forCastContainer.classList.add("col");
        forCastContainer.classList.add("forcastContainer");
        // forCastContainer.innerHTML = "this";
        forcastRowAppendEl.appendChild(forCastContainer);

        let forCastDateEl = document.createElement("div");
        forCastDateEl.classList.add("forcastDate");
        forCastDateEl.innerHTML = dayjs(forcastObj.date.split(" ")[0]).format('dddd, MMMM D YYYY');
        forCastContainer.appendChild(forCastDateEl);

        let forcastIconEl = document.createElement("img");
        forcastIconEl.src = `https://openweathermap.org/img/wn/${forcastObj.iconID}@2x.png`
        console.log(forcastIconEl.src);
        forCastContainer.appendChild(forcastIconEl);
        // temp
        let divForcastTempEl = document.createElement("div");
        divForcastTempEl.innerHTML = "TEMP: " + forcastObj.temp + "&#8457";
        forCastContainer.appendChild(divForcastTempEl);
        // wind
        let divForcastWindEl = document.createElement("div");
        divForcastWindEl.innerHTML = "Wind: " + forcastObj.windSpeed + " MPH";
        forCastContainer.appendChild(divForcastWindEl);
        // humidity
        let divForcastHumidityEl = document.createElement("div");
        divForcastHumidityEl.innerHTML = "Humidity: " + forcastObj.humidity + "%";
        forCastContainer.appendChild(divForcastHumidityEl);
  
 

    };


}


function createForcastObject(data){
    console.log(data);
    const forcastObj = {
        date : data.dt_txt,
        iconID : data.weather[0].icon,
        windSpeed : data.wind.speed,
        temp : (((data.main.temp-273.15)*1.8)+32).toFixed(2),
        humidity : data.main.humidity
    };
    return forcastObj;

}



function handleWeatherRequest(data){
    const weatherObj = createWeatherDayObject(data)


    // let weatherContainer = document.createElement("div");
    // weatherContainer.classList.add("container-sm");
    // todayDisplayEl.appendChild(weatherContainer);
    //row
    // let weatherContainerRow = document.createElement("div");
    // weatherContainerRow.classList.add("row");
    // weatherContainer.appendChild(weatherContainerRow);
    // header
    // let dateHeader = document.createElement("h3");
    const today = dayjs();
    currentWeatherDateEl.innerHTML = weatherObj.name + " - " + today.format('dddd, MMMM D YYYY');
    // dateHeader.innerHTML = weatherObj.name + " - " + today.format('dddd, MMMM D YYYY');
    // weatherContainerRow.appendChild(dateHeader);
    //row
    // let weatherContainerRowt.add("row");
    // weatherContainer.appendChil2 = document.createElement("div");
    // weatherContainerRow2.classLisd(weatherContainerRow2);
    //col
    // let weatherContainercol = document.createElement("div");
    // weatherContainercol.classList.add("col");
    // weatherContainercol.classList.add("weatherText");
    // weatherContainerRow2.appendChild(weatherContainercol);


      //tempature
    //   let tempDiv = document.createElement("div");
        currentWeatherTempEl.innerHTML = "Temp: " + weatherObj.temp + "&#8457";
    //   tempDiv.innerHTML = "Temp: " + weatherObj.temp + "&#8457";
    //   weatherContainercol.appendChild(tempDiv);
      // wind
    //   let windDiv = document.createElement("div");
    //   windDiv.innerHTML = "Wind: " + weatherObj.windSpeed + " MPH";
        currentWeatherWindEl.innerHTML = "Wind: " + weatherObj.windSpeed + " MPH";
    //   weatherContainercol.appendChild(windDiv);
      // humidity
    //   let humidityDiv = document.createElement("div");
        currentWeatherHumidityEl.innerHTML = "Humidity: " + weatherObj.humidity + "%";
    //   humidityDiv.innerHTML = "Humidity: " + weatherObj.humidity + "%";
    //   weatherContainercol.appendChild(humidityDiv);
  
 
   //col
//    let weatherContainercol2 = document.createElement("div");
//    weatherContainercol2.classList.add("col-8");
//    weatherContainerRow2.appendChild(weatherContainercol2);

   // img
//    let iconIMG = document.createElement("img");
   //https://openweathermap.org/img/wn/10d@2x.png
//    iconIMG.src = `https://openweathermap.org/img/wn/${weatherObj.iconID}@2x.png`
//    weatherContainercol2.appendChild(iconIMG);
    currentWeatherIconEl.src = `https://openweathermap.org/img/wn/${weatherObj.iconID}@2x.png`;


//   
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
        humidity : data.main.humidity
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
