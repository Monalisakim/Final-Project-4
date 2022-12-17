let weather = {
    apiKey: "8ca78e034a25bdeac5ce35d208c2941c",
    fetchWeather: function (city) {
      fetch(
        "https://api.openweathermap.org/data/2.5/weather?q=" +
          city +
          "&units=metric&appid=" +
          this.apiKey
      )
        .then((response) => {
          if (!response.ok) {
            alert("Cuaca tidak ditemukan.");
            throw new Error("Cuaca tidak ditemukan.");
          }
          return response.json();
        })
        .then((data) => this.displayWeather(data));
    },
    displayWeather: function (data) {
      const { name } = data;
      const { icon, description } = data.weather[0];
      const { temp, humidity } = data.main;
      const { speed } = data.wind;
      const latitude = data.coord.lat;
      const longitude = data.coord.lon;
      console.log(data.coord)
      document.querySelector(".latitude").innerHTML = `<div>Long: ${longitude} , Lat: ${latitude}</div>`;
      
      
      document.querySelector(".city").innerText = "Cuaca di " + name;
      document.querySelector(".icon").src =
        "https://openweathermap.org/img/wn/" + icon + "@2x.png";
      document.querySelector(".description").innerText = description;
      document.querySelector(".temp").innerText = temp + "°C";
      document.querySelector(".humidity").innerText =
        "Kelembapan: " + humidity + "%";
      document.querySelector(".wind").innerText =
        "Kecepatan Angin: " + speed + " km/h";
      document.querySelector(".weather").classList.remove("loading");
      document.body.style.backgroundImage =
        "url('https://source.unsplash.com/1600x900/?" + name + "')";
    },
    search: function () {
      this.fetchWeather(document.querySelector(".search-bar").value);
    },
  };
  
  document.querySelector(".search button").addEventListener("click", function () {
    weather.search();
  });
  
  document
    .querySelector(".search-bar")
    .addEventListener("keyup", function (event) {
      if (event.key == "Enter") {
        weather.search();
      }
    });


    function showPosition(position) {
      let lat = position.coords.latitude;
      let lng = position.coords.longitude;
     console.log(lat,lng)
     fetchLatLng(lat,lng)
     generateMaps(lat,lng)
    }
    
    
  function fetchLatLng(latitude,longitude) {
    fetch(
      "https://api.openweathermap.org/data/2.5/weather?lat=" +
        latitude +
        "&lon=" + longitude + "&units=metric&appid=" +
        weather.apiKey
    )
      .then((response) => {
        if (!response.ok) {
          alert("Cuaca tidak ditemukan.");
          throw new Error("Cuaca tidak ditemukan.");
        }
        let res = response;
        console.log("res: ",res)
        return response.json();
      }).then((data)=>{
        console.log(data)
        weather.displayWeather(data)
      })
  }

  function generateMaps(lat,lng) {
    // Initialize the map and assign it to a variable for later use
    // there's a few ways to declare a VARIABLE in javascript.
    // you might also see people declaring variables using `const` and `let`
    var map = L.map('map', {
      // Set latitude and longitude of the map center (required)
      center: [lat, lng],
      // Set the initial zoom level, values 0-18, where 0 is most zoomed-out (required)
      zoom: 11
    });

    // Create a Tile Layer and add it to the map
    var tiles = new L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    minZoom: '8'}).addTo(map);

    var marker = L.marker(
    [lat, lng],
    { 
      draggable: true,
      title: "",
      opacity: 0.75
    });

    marker.addTo(map);
    marker.on("dragend",function (e) {
      console.log(e)
      let lat = e.target._latlng.lat
      let lng = e.target._latlng.lng
     fetchLatLng(lat,lng)
    })
  }
