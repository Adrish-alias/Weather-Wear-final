let vantaEffect = null;

// Navigation functionality
function showSection(sectionName) {
    // Hide all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Show the selected section
    const selectedSection = document.getElementById(sectionName);
    if (selectedSection) {
        selectedSection.classList.add('active');
    }
    
    // Update navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    // Add active class to the clicked link
    const activeLink = document.querySelector(`[onclick="showSection('${sectionName}')"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
    
    // If switching to home section, ensure Vanta background is visible
    if (sectionName === 'home') {
        const vantaBg = document.getElementById('vanta-bg');
        if (vantaBg) {
            vantaBg.style.display = 'block';
        }
    }
}

// Map your weather conditions to fog colors
function getFogColorScheme(condition) {
  switch (condition.toLowerCase()) {
    case "clear":
      return {
        highlightColor: 0xf0f8ff, // AliceBlue, very pale whitish-blue
        midtoneColor: 0xddeeff,   // soft pale blue
        lowlightColor: 0xa3c1e1,  // light sky blue (same as before)
        baseColor: 0xb3d1f2       // very light blue background
      };
    case "clouds":
      return {
        highlightColor: 0xd0d6db,
        midtoneColor: 0x99b3cc,
        lowlightColor: 0x6f8fa6,
        baseColor: 0x5c6b78 // muted blue-gray base
      };
    case "rain":
      return {
        highlightColor: 0x4b5a68,
        midtoneColor: 0x3f4d59,
        lowlightColor: 0x2d3b47,
        baseColor: 0x1f2a33 // dark rainy base
      };
    case "snow":
      return {
        highlightColor: 0xb0c4de, // light steel blue
        midtoneColor: 0x6495ed,   // cornflower blue
        lowlightColor: 0x4169e1,  // royal blue
        baseColor: 0x0d1f4f       // dark blue (navy-ish)
      };
    default:
      return {
        highlightColor: 0xff9919,
        midtoneColor: 0xffcc66,
        lowlightColor: 0x996633,
        baseColor: 0x87ceeb
      };
  }
}

// Initialize or update the Vanta fog effect
function changeBackgroundByCondition(condition) {
  const colors = getFogColorScheme(condition);

  if (vantaEffect) {
    vantaEffect.setOptions({
      highlightColor: colors.highlightColor,
      midtoneColor: colors.midtoneColor,
      lowlightColor: colors.lowlightColor,
      baseColor: colors.baseColor,
      speed: 5
    });
  } else {
    vantaEffect = VANTA.FOG({
      el: "#vanta-bg",
      mouseControls: false,
      touchControls: false,
      gyroControls: false,
      highlightColor: colors.highlightColor,
      midtoneColor: colors.midtoneColor,
      lowlightColor: colors.lowlightColor,
      baseColor: colors.baseColor,
      blurFactor: 0.7,
      speed: 5,
      zoom: 1,
      minHeight: 200.0,
      minWidth: 200.0
    });
  }
}
//clothing reccomenation
function getClothingRecommendation(temp, weather) {
    weather = weather.toLowerCase();
    let recommendations = [];

    if (temp < 5) {
        if (weather.includes("snow")) {
            recommendations.push("🧥 Heavy coat or parka");
            recommendations.push("🧤 Gloves & 🧣 scarf");
            recommendations.push("🥾 Waterproof insulated boots");
            recommendations.push("🧦 Thermal inner layers");
        } else if (weather.includes("rain")) {
            recommendations.push("🧥 Heavy coat with hood");
            recommendations.push("☔ Waterproof jacket or raincoat");
            recommendations.push("🥾 Waterproof boots");
            recommendations.push("🧤 Warm gloves");
        } else {
            recommendations.push("🧥 Heavy winter jacket");
            recommendations.push("🧤 Gloves");
            recommendations.push("🧦 Thick socks");
        }
    }
    else if (temp < 15) {
        if (weather.includes("rain")) {
            recommendations.push("🧥 Warm jacket");
            recommendations.push("☔ Umbrella or raincoat");
            recommendations.push("👖 Long pants");
        } else if (weather.includes("snow")) {
            recommendations.push("🧥 Winter coat");
            recommendations.push("🧤 Gloves");
            recommendations.push("🧣 Scarf");
            recommendations.push("🥾 Boots");
        } else {
            recommendations.push("🧥 Light sweater or jacket");
            recommendations.push("👖 Jeans or trousers");
            recommendations.push("🧦 Warm socks");
        }
    }
    else if (temp < 25) {
        if (weather.includes("rain")) {
            recommendations.push("🧥 Light waterproof jacket");
            recommendations.push("☔ Carry an umbrella");
            recommendations.push("👖 Light pants");
        } else if (weather.includes("wind")) {
            recommendations.push("🧥 Windbreaker");
            recommendations.push("👕 Light shirt");
            recommendations.push("👖 Comfortable pants");
        } else {
            recommendations.push("👕 T-shirt or polo");
            recommendations.push("🧥 Light cardigan or hoodie");
            recommendations.push("👖 Jeans or chinos");
        }
    }
    else {
        if (weather.includes("rain")) {
            recommendations.push("👕 Light clothes");
            recommendations.push("☔ Umbrella or rain poncho");
            recommendations.push("🩳 Shorts or breathable pants");
        } else if (weather.includes("sun") || weather.includes("clear")) {
            recommendations.push("👕 Light T-shirt or tank top");
            recommendations.push("🩳 Shorts");
            recommendations.push("🕶️ Sunglasses");
            recommendations.push("🧢 Hat or cap");
        } else {
            recommendations.push("👕 Light clothing suitable for warm weather");
            recommendations.push("🩳 Shorts or thin trousers");
            recommendations.push("💧 Stay hydrated");
        }
    }

    // Return HTML list
    return "<ul>" + recommendations.map(item => `<li>${item}</li>`).join("") + "</ul>";
}

// Geolocation success callback - fetch weather based on coords
function success(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  const apiKey = "e43e276b6a85a35682551f79e24d0669";
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      let city = data.name;
      let temp = data.main.temp;
      let weather = data.weather[0].main;
      if(weather==="Rain"||weather==="Clouds"||weather==="Snow"){
        document.getElementById("header").style.color="white";
        document.getElementById("content").style.color="white";
        document.getElementById("cont").style.color="white";
      }

      changeBackgroundByCondition(weather);

      // Update cards and recommendation
      const cityNameEl = document.getElementById("city-name");
      const tempValueEl = document.getElementById("temp-value");
      const weatherCondEl = document.getElementById("weather-condition");

      if (cityNameEl) cityNameEl.textContent = city;
      if (tempValueEl) tempValueEl.textContent = Math.round(temp);
      if (weatherCondEl) weatherCondEl.textContent = weather;

      document.getElementById("recc").innerHTML = `
        ${getClothingRecommendation(temp, weather)}
      `;
    })
    .catch(err => {
      console.error("Error fetching weather:", err);
    });
}

function error() {
  document.getElementById("location").textContent = "❌ Location access denied";
  console.log("Unable to retrieve location");
}

// Request user location and get weather
function getlocation() {
  navigator.geolocation.getCurrentPosition(success, error);
}

// Fetch weather by city name input
function getWeather() {
  let city = document.getElementById("city").value.trim();

  if (city === "") {
    alert("Please enter a city name.");
    return;
  }

  fetchWeatherByCity(city);
}

function fetchWeatherByCity(city) {
  const apiKey = "e43e276b6a85a35682551f79e24d0669";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city},IN&appid=${apiKey}&units=metric`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      if (data.cod === "404") {
        alert("City not found. Please check spelling.");
        return;
      }

      const temp = data.main.temp;
      const weather = data.weather[0].main;
      const City = data.name;
      

      changeBackgroundByCondition(weather);

      // Adjust text colors for darker backgrounds
      if(weather==="Rain"||weather==="Clouds"||weather==="Snow"){
         document.getElementById("header").style.color="white";
         document.getElementById("content").style.color="white";
         document.getElementById("cont").style.color="white";
      }

      // Update cards and recommendation
      const cityNameEl = document.getElementById("city-name");
      const tempValueEl = document.getElementById("temp-value");
      const weatherCondEl = document.getElementById("weather-condition");

      if (cityNameEl) cityNameEl.textContent = City;
      if (tempValueEl) tempValueEl.textContent = Math.round(temp);
      if (weatherCondEl) weatherCondEl.textContent = weather;

      document.getElementById("recc").innerHTML = `
        ${getClothingRecommendation(temp, weather)}
      `;
    })
    .catch(err => console.error("Error fetching weather:", err));
}

// Initialize with default weather condition so Vanta Fog shows right away
document.addEventListener("DOMContentLoaded", () => {
  changeBackgroundByCondition("clear");
  
  // Set up navigation based on URL hash
  const hash = window.location.hash.substring(1);
  if (hash && ['home', 'about', 'map'].includes(hash)) {
    showSection(hash);
  } else {
    showSection('home');
  }
  
  // Listen for hash changes
  window.addEventListener('hashchange', () => {
    const newHash = window.location.hash.substring(1);
    if (newHash && ['home', 'about', 'map'].includes(newHash)) {
      showSection(newHash);
    }
  });
});