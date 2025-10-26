import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaRegPaperPlane } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";

// Cache storage
const cache = {
  data: {},
  timestamps: {}
};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

const isCacheValid = key => {
  const timestamp = cache.timestamps[key];
  if (!timestamp) return false;
  return Date.now() - timestamp < CACHE_DURATION;
};

const getCachedData = key => {
  if (isCacheValid(key)) {
    console.log(`Serving from cache: ${key}`);
    return cache.data[key];
  }
  // Clear expired cache
  delete cache.data[key];
  delete cache.timestamps[key];
  return null;
};

const setCachedData = (key, data) => {
  cache.data[key] = data;
  cache.timestamps[key] = Date.now();
  console.log(`Cached data for: ${key}`);
};

const HomePage = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [cityInput, setCityInput] = useState("");
  const { logout, isAuthenticated } = useAuth0();
  const navigate = useNavigate();
  const apiKey = process.env.REACT_APP_OPENWEATHER_API_KEY;

  const cardColors = {
    // Sunny & Clear (Warm tones)
    "clear sky": "#DC2F02", // Vibrant red-orange
    sunny: "#E85D04", // Bright orange

    // Clouds (Cool blues and purples)
    "few clouds": "#3A86FF", // Bright blue
    "scattered clouds": "#8338EC", // Electric purple
    "broken clouds": "#5A189A", // Deep purple
    "overcast clouds": "#4CC9F0", // Sky blue

    // Rain (Blue-greens and teals)
    "light rain": "#0077B6", // Ocean blue
    "moderate rain": "#0096C7", // Cerulean
    "heavy intensity rain": "#023E8A", // Navy blue
    "very heavy rain": "#03045E", // Midnight blue
    "extreme rain": "#2A9D8F", // Teal green
    "freezing rain": "#00B4D8", // Cyan
    "light intensity shower rain": "#48CAE4", // Light teal
    "shower rain": "#118AB2", // Steel blue

    // Drizzle (Green-blues)
    drizzle: "#2A9D8F", // Sea green
    "heavy intensity drizzle": "#264653", // Dark teal
    "light intensity drizzle": "#8AC926", // Lime green

    // Thunderstorm (Dramatic purples)
    "thunderstorm with light rain": "#560BAD", // Royal purple
    "thunderstorm with rain": "#480CA8", // Deep purple
    thunderstorm: "#3A0CA3", // Electric indigo
    "heavy thunderstorm": "#7209B7", // Vibrant purple
    "light thunderstorm": "#4361EE", // Blue-purple
    "ragged thunderstorm": "#4CC9F0", // Electric blue

    // Snow (Cool tones)
    "light snow": "#A8DADC", // Powder blue
    snow: "#F1FAEE", // Off-white
    "heavy snow": "#457B9D", // Steel blue
    sleet: "#8ECAE6", // Ice blue
    "light shower sleet": "#CDB4DB", // Lavender

    // Atmospheric (Earthy tones)
    mist: "#606C38", // Olive green
    smoke: "#283618", // Dark olive
    haze: "#BC6C25", // Terracotta
    "sand/dust whirls": "#DDA15E", // Sandy brown
    fog: "#7F8C8D", // Muted gray
    sand: "#E09F3E", // Golden sand
    dust: "#9A8C98", // Muted purple

    // Extreme Weather (Warning colors)
    tornado: "#E63946", // Vibrant red
    squalls: "#D90429", // Crimson
    hurricane: "#9D0208", // Deep red
    "volcanic ash": "#6A040F", // Burgundy

    // Mixed Conditions
    "rain and snow": "#4A4E69", // Muted purple
    "light rain and snow": "#6D6875", // Gray-purple
    "shower snow": "#B5838D", // Dusty rose

    // Additional conditions
    "shower drizzle": "#90BE6D", // Soft green
    "thunderstorm with drizzle": "#577590", // Blue-gray
    "thunderstorm with heavy drizzle": "#4D908E", // Green-blue

    // Default
    Default: "#2D3748" // Charcoal blue
  };

  const cities = [
    {
      CityCode: 1248991,
      CityName: "Colombo",
      Temp: "33.0",
      Status: "Clouds"
    },
    { CityCode: 1850147, CityName: "Tokyo", Temp: "8.6", Status: "Clear" },
    {
      CityCode: 2644210,
      CityName: "Liverpool",
      Temp: "16.5",
      Status: "Rain"
    },
    { CityCode: 2988507, CityName: "Paris", Temp: "22.4", Status: "Clear" },
    { CityCode: 2147714, CityName: "Sydney", Temp: "27.3", Status: "Rain" },
    { CityCode: 4930956, CityName: "Boston", Temp: "4.2", Status: "Mist" },
    {
      CityCode: 1796236,
      CityName: "Shanghai",
      Temp: "10.1",
      Status: "Clouds"
    },
    { CityCode: 3143244, CityName: "Oslo", Temp: "-3.9", Status: "Clear" }
  ];

  useEffect(
    () => {
      const fetchAllWeaatherData = async () => {
        const promises = cities.map(async city => {
          const cacheKey = `city_${city.CityCode}`;

          // Check cache first
          const cachedData = getCachedData(cacheKey);
          if (cachedData) {
            return cachedData;
          }
          try {
            const res = await axios.get(
              `https://api.openweathermap.org/data/2.5/weather?id=${city.CityCode}&appid=${apiKey}&units=metric`
            );
            const data = res.data;
            const weatherInfo = {
              country: data.sys.country,
              cityCode: city.CityCode,
              cityName: city.CityName,
              description: data.weather[0].description,
              main: data.weather[0].main,
              temp: Math.round(data.main.temp),
              minTemp: Math.round(data.main.temp_min),
              maxTemp: Math.round(data.main.temp_max),
              pressure: data.main.pressure,
              humidity: data.main.humidity,
              visibility: data.visibility / 1000, // convert to km
              windSpeed: data.wind.speed,
              windDeg: data.wind.deg,
              sunrise: new Date(
                data.sys.sunrise * 1000
              ).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
              }),
              sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
              }),
              icon: `https://openweathermap.org/img/wn/${data.weather[0]
                .icon}@2x.png`,
              time: new Date(data.dt * 1000).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
              }),
              date: new Date(data.dt * 1000).toLocaleDateString([], {
                month: "short",
                day: "numeric"
              })
            };
            setCachedData(cacheKey, weatherInfo);
            return weatherInfo;
          } catch (error) {
            console.error(`Error fetching data for ${city.CityName}:`, error);
            return null;
          }
        });
        const results = await Promise.all(promises);
        setWeatherData(results.filter(data => data !== null));
      };
      fetchAllWeaatherData();
    },
    [apiKey]
  );

  if (!isAuthenticated) {
    console.log("IsAuthenticated", isAuthenticated);
    navigate("/");
    return null;
  }

  const handleAddCity = async e => {
    e.preventDefault();
    if (!cityInput.trim()) {
      toast.warning("Please enter a city name");
      return;
    }

    try {
      const cacheKey = `city_search_${cityInput.toLowerCase().trim()}`;

      // Check cache first
      const cachedData = getCachedData(cacheKey);
      if (cachedData) {
        setWeatherData(prev => {
          if (prev.some(city => city.cityCode === cachedData.cityCode)) {
            toast.info("City already added");
            return prev;
          }
          toast.success(`Successfully added ${cachedData.cityName} (cached)`);
          return [...prev, cachedData];
        });
        setCityInput("");
        return;
      }

      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&appid=${apiKey}&units=metric`
      );
      const data = response.data;
      const newCityWeather = {
        country: data.sys.country,
        cityCode: data.id,
        cityName: data.name,
        description: data.weather[0].description,
        main: data.weather[0].main,
        temp: Math.round(data.main.temp),
        minTemp: Math.round(data.main.temp_min),
        maxTemp: Math.round(data.main.temp_max),
        pressure: data.main.pressure,
        humidity: data.main.humidity,
        visibility: data.visibility / 1000,
        windSpeed: data.wind.speed,
        windDeg: data.wind.deg,
        sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit"
        }),
        sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit"
        }),
        icon: `https://openweathermap.org/img/wn/${data.weather[0]
          .icon}@2x.png`,
        time: new Date(data.dt * 1000).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit"
        }),
        date: new Date(data.dt * 1000).toLocaleDateString([], {
          month: "short",
          day: "numeric"
        })
      };

      // Cache the new city data
      setCachedData(cacheKey, newCityWeather);
      setCachedData(`city_${data.id}`, newCityWeather); // Also cache by city ID

      // avoid duplicate cities
      setWeatherData(prev => {
        if (prev.some(city => city.cityCode === newCityWeather.cityCode)) {
          toast.info("City already added");
          return prev; // remain previous list
        }
        toast.success(`Successfully added ${newCityWeather.cityName}`);
        return [...prev, newCityWeather];
      });
      setCityInput(""); // Clear input field
    } catch (error) {
      toast.error("City not found or error fetching data");
    }
  };

  const handleRemoveCity = (cityCode, cityName) => {
    setWeatherData(prev => prev.filter(city => city.cityCode !== cityCode));
    toast.info(`Removed ${cityName}`);
  };

  const handleLogout = async e => {
    e.preventDefault();
    logout({ logoutParams: { returnTo: window.location.origin } });
    toast.success("Successfully logout!");
  };

  return (
    <div
      className=" min-h-screen font-sans text-white relative flex flex-col"
      style={{
        backgroundImage: `url('/mask.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundColor: "#1e2839",
        backgroundBlendMode: "overlay"
      }}
    >
      <div className="flex-1 p-5">
        <div className="absolute top-5 right-5">
          <button
            onClick={handleLogout}
            className=" hover:bg-sky-950 ease-in text-white font-semibold px-2 py-2 rounded-md shadow-lg transition"
            aria-label="Log Out"
          >
            Log Out
          </button>
        </div>
        <header className="text-center mb-5">
          <h1 className="text-bold font-family">
            <span role="img" aria-label="weather">
              🌤️
            </span>{" "}
            Weather App
          </h1>
          <form className="mt-2.5 text-black" onSubmit={handleAddCity}>
            <input
              type="text"
              placeholder="Enter a city"
              className="p-2 rounded-md border-none mr-2 w-48"
              value={cityInput}
              onChange={e => setCityInput(e.target.value)}
            />
            <button className=" bg: py-2 rounded-md border-none p-2 bg-indigo-600 text-white">
              Add City
            </button>
          </form>
        </header>

        <div className="flex flex-wrap gap-5 justify-center">
          {weatherData.map(
            ({
              country,
              cityCode,
              cityName,
              description,
              temp,
              minTemp,
              maxTemp,
              pressure,
              humidity,
              visibility,
              windSpeed,
              windDeg,
              sunrise,
              sunset,
              icon,
              time,
              date
            }) =>
              <div
                key={cityCode}
                className="rounded-lg w-96 shadow-lg flex flex-col text-white relative"
                style={{
                  backgroundImage: `url('/mask.jpg')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  backgroundColor:
                    cardColors[description] || cardColors.Default,
                  backgroundBlendMode: "overlay"
                }}
              >
                <button
                  onClick={() => handleRemoveCity(cityCode, cityName)}
                  className="absolute top-3 right-3 text-white hover:text-gray-300 transition-colors duration-200 bg-black bg-opacity-30 rounded-full p-1"
                  aria-label={`Remove ${cityName}`}
                >
                  <FaXmark className="w-4 h-4" />
                </button>
                <div className="px-10 py-5 flex flex-row justify-between">
                  <div className="flex flex-col content-center items-center ">
                    <h2 className=" font-sans text-2xl">
                      {cityName}, {country}
                    </h2>
                    <div className=" text-xxs opacity-80 mb-2.5 ">
                      {time}, {date}
                    </div>
                    <div className="flex flex-row items-center">
                      <img
                        src={icon}
                        alt={description}
                        className=" w-10 h-10"
                      />
                      <div className="text-sm opacity-90 mt-1 capitalize">
                        {description}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col content-center items-center ">
                    <div className="text-5xl font-semibold">
                      {temp} <span className="text-4xl">°C</span>
                    </div>
                    <div className="text-xs mt-1.5">
                      Temp Min: {minTemp}
                      <span className="text-xxs">°C</span>
                    </div>
                    <div className="text-xs mt-0.5">
                      Temp Max: {maxTemp}
                      <span className="text-xxs">°C</span>
                    </div>
                  </div>
                </div>

                <div className="bg-black bg-opacity-40 p-4 text-xs rounded-b-lg flex justify-between flex-wrap text-white">
                  <div className=" flex flex-col">
                    <div>
                      <strong>Pressure:</strong> {pressure}hPa
                    </div>
                    <div>
                      <strong>Humidity:</strong> {humidity}%
                    </div>
                    <div>
                      <strong>Visibility:</strong> {visibility} km
                    </div>
                  </div>
                  <div className="w-px h-full bg-gray-600 mx-2" />
                  <div className=" flex flex-col items-center gap-2">
                    <FaRegPaperPlane />
                    <div>
                      <strong /> {windSpeed} m/s {windDeg} Degree
                    </div>
                  </div>
                  <div className="w-px h-full bg-gray-600 mx-2" />
                  <div className=" flex flex-col">
                    <div>
                      <strong>Sunrise:</strong> {sunrise}
                    </div>
                    <div>
                      <strong>Sunset:</strong> {sunset}
                    </div>
                  </div>
                </div>
              </div>
          )}
        </div>
      </div>
      <footer className="text-center py-4 text-gray-400 bg-[#1e2839] bg-opacity-80 mt-auto w-full">
        2021 Fidenz Technologies
      </footer>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};
export default HomePage;
