const button = document.querySelector('.search-icon');
const icon = document.querySelector('.weather-icon');
const city = document.querySelector('.weather-city');
const temperature = document.querySelector('.weather-temp');
document.querySelector('.weather-date').innerHTML = getCurrentDate();

async function submit() {
    // start loading once the api is called
    document.querySelector('.loading').innerHTML = 'Loading...';
    let cityName = document.querySelector('.search-input').value;
    const url = 'https://cors-proxy-weather.herokuapp.com/api/weather';

    try {
        // make the api call to open weather
        const response = await axios.post(url, { cityName });

        // save data
        save(response);

        // format response data
        const { temp, name, getIcon } = formatData(response);

        // display ui data
        updateUI(getIcon, name, temp);

        // end loading once the api has ended
        document.querySelector('.loading').innerHTML = '';
        cityName.innerHTML = '';
    } catch (error) {
        document.querySelector('.loading').innerHTML = '';
        console.log('----->', error);
    }
}

function updateUI(icon, name, temp) {
    // Update the UI
    document.querySelector('.weather-icon').innerHTML = icon;
    city.innerHTML = name;
    temperature.innerHTML = `${Math.round(temp)}°`;
}

function getWeatherIcon(condition) {
    if (condition < 300) {
        return '🌩';
    } else if (condition < 400) {
        return '🌧';
    } else if (condition < 600) {
        return '☔️';
    } else if (condition < 700) {
        return '☃️';
    } else if (condition < 800) {
        return '🌫';
    } else if (condition == 800) {
        return '☀️';
    } else if (condition <= 804) {
    return '☁️';
    } else {
    return '🤷‍';
    }
}

function formatData(response) {
    const temp = response.data.data.main.temp;
    const condition = response.data.data.weather[0].id;
    const name = response.data.data.name;
    const getIcon = getWeatherIcon(condition);

    return { temp, name, getIcon };
}

function getCurrentDate() {
    const date = new Date()
    const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date)
    const mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(date)
    const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date)

    return `${da} ${mo} ${ye}`;
}

function save(data) {
    localStorage.setItem('weather', JSON.stringify(data));
}

function isData() {
    return localStorage.getItem('weather') != null 
}

function getDataFromLocalStorage() {
    const data = localStorage.getItem('weather');
    return JSON.parse(data);
}

function clearLocalStorage() {
    localStorage.clear();
}

button.addEventListener('click', submit);

if ("serviceWorker" in navigator) {
    window.addEventListener("load", function() {
      navigator.serviceWorker
        .register("/serviceWorker.js")
        .then(res => console.log("service worker registered"))
        .catch(err => console.log("service worker not registered", err))
    })
}

// Onit
(function() {
    if (isData()) {
        const data = getDataFromLocalStorage();

        const { temp, name, getIcon } = formatData(data);

        updateUI(getIcon, name, temp);
    }
})();