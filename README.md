#🌤️ Weather App

Weather application built with React that provides real-time weather information for cities worldwide

#📋 Table of Contents

Features

Setup Instructions

Environment Variables

Technologies Used

#✨ Features

🌍 Multi-City Weather: View weather for multiple cities simultaneously

🎨 Dynamic UI: Colors change based on current weather conditions

⚡ Real-time Data: Live weather updates from OpenWeatherMap API

💾 Smart Caching: 5-minute cache to reduce API calls

🔍 City Search: Add any city worldwide to your dashboard

📱 Responsive Design: Works on all devices

🔐 Secure Authentication: Protected by Auth0

🎯 Interactive Cards: Remove cities with one click

#🚀 Setup Instructions
##Prerequisites

*Node.js (v14 or higher)

*npm or yarn

*OpenWeatherMap API account

*Auth0 account

##Step-by-Step Installation

Clone the repository:
git clone <repository-url>
cd weather-app

Install dependencies:
npm install

Set up environment variables:
cp .env.example .env

Start the development server:
npm start

Open your browser:
Navigate to http://localhost:3000

#🔧 Environment Variables

### OpenWeatherMap API Configuration
REACT_APP_OPENWEATHER_API_KEY=your_openweather_api_key_here

### Auth0 Configuration
REACT_APP_AUTH0_DOMAIN=your-auth0-domain.auth0.com
REACT_APP_AUTH0_CLIENT_ID=your-auth0-client-id
REACT_APP_AUTH0_AUDIENCE=your-auth0-audience

#💻 Technologies Used

Frontend Framework: React 18

Styling: Tailwind CSS

Authentication: Auth0

HTTP Client: Axios

Notifications: React Toastify

Icons: React Icons (Fa6, Fa)

Routing: React Router DOM

State Management: React Hooks (useState, useEffect)

API: OpenWeatherMap REST API
