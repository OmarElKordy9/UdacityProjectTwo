/* Global Variables */

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = (d.getMonth()+1)+'.'+ d.getDate()+'.'+ d.getFullYear();

let baseURL = 'https://api.openweathermap.org/data/2.5/weather?zip=';
let apiKey = ',&appid=9d6d096e9f8a2ebf66be7c9339eecf9f&units=metric';
let server =  'http://127.0.0.1:3000';

const weatherData = () => {
    const zipCode = document.getElementById('zip').value;
    const feeling = document.getElementById('feelings').value;

    getWeather(zipCode).then((data) => {
        if (data.cod != 200) {
            alert('The zip code entered is wrong');
        }
        if(data){
            const entry = {
                cityName: data.name,
                temperature: data.main.temp,
                newDate: newDate,
                condition: data.weather[0].description,
                feeling: feeling,
                humidity: data.main.humidity,
                wind: data.wind.speed,
            };
            postWeather(server + '/addWeather', entry);
        }
    })
    .then(updateUI);
}

const getWeather = async(zipCode) => {
    try {
        const res = await fetch(baseURL + zipCode + apiKey);
        const weatherData = await res.json();
        return weatherData;
    } catch (error) {
        console.log('Error', error);
    }
}

const postWeather = async(serverURL = '', entry = {}) => {
    const res = await fetch(serverURL, {
        method: 'POST', 
        credentials: 'same-origin', 
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(entry),
      });
      try {
          const weatherData = await res.json();
          return weatherData;
      } catch (error) {
          console.log('Error', error);
      }
}

const updateUI = async() => {
    const req = await fetch(server + '/allData');
    try {
        const newData = await req.json();

        document.getElementById('city').innerHTML = '<img src="../location.png" alt="location">'+newData.cityName;
        document.getElementById('date').innerHTML = newData.newDate;
        document.getElementById('temp').innerHTML = newData.temperature + '&degC';
        document.getElementById('condition').innerHTML = newData.condition;
        document.getElementById('content').innerHTML = 'You are Feeling '+newData.feeling;
        document.getElementById('humidity').innerHTML = 'Humidity: &emsp;'+newData.humidity+' %';
        document.getElementById('wind').innerHTML = 'Wind: &emsp;'+newData.wind+' km/h';
    } catch (error) {
        console.log('Error', error);
    }
}

let button = document.getElementById('generate');
button.addEventListener('mousedown', weatherData);