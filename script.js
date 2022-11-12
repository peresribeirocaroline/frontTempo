const api = {
    key: "50f90d69473f1c0ec36af97510d347a5",
    base: "https://api.openweathermap.org/data/2.5/",
    lang: "pt_br",
    units:"metric"
} 

const apiGeo = {
  key: "8b058d8646a12c948b9f3af9e06a8c96",
  base: "https://apiadvisor.climatempo.com.br/api/v1/locale/"
} 
const city = document.querySelector('.city');
const state = document.querySelector('.state');
const date = document.querySelector('.date');
const container_img = document.querySelector('.container-img');
const container_temp = document.querySelector('.container-temp');
const temp_number = document.querySelector('.container-temp div');
const temp_unit = document.querySelector('.container-temp span');
const weather_t = document.querySelector('.weather');
const search_input = document.querySelector('.form-control');
const search_button = document.querySelector('.btn');
const low_high = document.querySelector('.low-high');

window.addEventListener('load', () => {
if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(setPosition, showError);
  } else {
    alert("Navegador não suporta geolocalização.");
  }
  function setPosition(position) {
    console.log(position)
    let lat = position.coords.latitude;
    let long = position.coords.longitude;
    coordResults(lat, long);
  }
  function showError(error) {
    alert(`erro: ${error.message}`);
  }
})

function coordResults(lat, long) {
  fetch(`${api.base}weather?lat=${lat}&lon=${long}&lang=${api.lang}&units=${api.units}&appid=${api.key}`)
   .then(response => {
    if (!response.ok) {
      throw new Error (`http error: status ${response.status}`)
    }
    return response.json();
   })
   .catch(error => {
    alert(error.message)
   })
   .then(response => {
    displayResults (response)
   });
} 



search_button.addEventListener('click', function() {
  searchResults(search_input.value)
})

search_input.addEventListener('keypress', enter)
function enter(event) {
  key= event.keyCode
  if (key ===13) {
    searchResults(search_input.value)
  }
}

function searchResults(city) {
  fetch(`${api.base}weather?q=${city}&lang=${api.lang}&units=${api.units}&appid=${api.key}`)
   .then(response => {
    if (!response.ok) {
      throw new Error (`http error: status ${response.status}`)
    }
    return response.json();
   })
   .catch(error => {
    alert(error.message)
   })
   .then(response => {
    displayResults (response)
   });
} 

function displayResults(weather) {
  console.log(weather)

  searchState(weather.coord.lon, weather.coord.lat)
  
  city.innerText = `${weather.name}`;

  state.innerText = `${weather.sys.country}`;

  let now = new Date();
 date.innerText = dateBuilder(now);

  let iconName = weather.weather[0].icon;
  container_img.innerHTML = `<img src="./icons/${iconName}.png">`;

  let temperature = `${Math.round(weather.main.temp)}`
  temp_number.innerHTML = temperature;
  temp_unit.innerHTML = `°C`;

  weather_t.innerHTML = weather.weather[0].description;

}

function searchState(lon, lat) {
  //console.log(lon)
  //console.log(lat)
  fetch(`http://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`, { //${apiGeo.base}city?name=${a}&token=${apiGeo.key}`, {
    method: 'GET',
  })
  .then(response => {
    console.log(response.json());
    cityCountry(response)
  })
  .then(response =>{
    //cityCountry(response)
  })
} 

function cityCountry(ctjson) {
  console.log(ctjson)
  console.log(ctjson.address)
  state.innerText = `${ctjson.address.state}, ${ctjson}`
}

function dateBuilder(d) {
  let days = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta","Sabado"]
  let months = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"]
  
  let day = days[d.getDay()];
  let date = d.getDate();
  let month = months[d.getMonth()];
  let year = d.getFullYear();

  return `${day}, ${date} ${month} ${year}`;
}



