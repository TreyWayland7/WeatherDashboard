// const dayjs = require("dayjs")
const weatherFormEl = document.getElementById("weatherForm");
const inputWeatherCityEl = document.getElementById("inputWeatherCity");
const todayDisplayEl = document.getElementById("todayDisplay");
const apiKey = "86c614e4ea9b60a41fe8906b391de9ca";


function weatherFormSubmitHandler(event){
    event.preventDefault();
    const cityInput = inputWeatherCity.value;
    callWeatherAPI(cityInput);
    //lat=33.44&lon=-94.04

}


function handleWeatherRequest(data){
    const weatherObj = createWeatherDayObject(data)
    let dateHeader = document.createElement("h3");
    const today = dayjs();
    dateHeader.innerHTML = weatherObj.name + " - " + today.format('dddd, MMMM D YYYY');
    todayDisplayEl.appendChild(dateHeader);

    //tempature
    let tempDiv = document.createElement("div");
    tempDiv.innerHTML = "Temp: " + weatherObj.temp + "&#8457";
    todayDisplayEl.appendChild(tempDiv);
    // wind
    let windDiv = document.createElement("div");
    windDiv.innerHTML = "Wind: " + weatherObj.windSpeed + " MPH";
    todayDisplayEl.appendChild(windDiv);
}

function createWeatherDayObject(data){
    console.log(data); // Example: Logging the data to the console
    console.log(data.wind.speed);
    console.log((((data.main.temp-273.15)*1.8)+32).toFixed(2));//((K-273.15)*1.8)+32
    console.log(data.main.humidity);
    console.log(data.weather[0].description);
    const weatherObj = {
        name : data.name,
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


            
        })
        .catch(error => {
            // Handle any errors here
            console.error(error); // Example: Logging the error to the console
    });

}



weatherFormEl.addEventListener("submit", weatherFormSubmitHandler);
