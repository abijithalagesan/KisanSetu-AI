# 🌾 KisanSetu AI

### AI-Powered Farming Assistant for Tamil Nadu Farmers

KisanSetu AI is an intelligent, multilingual agricultural assistant designed to help farmers make informed farming decisions through AI-powered guidance, live weather updates, crop-risk alerts, and agricultural market information.

🏆 **Hackathon Achievement: 2nd Place Winner**  
🎁 **Prize: ₹6,000 Gift Voucher**

---

## 🚀 Features

- 🤖 **AI Farming Assistant** — Get agricultural guidance using Google's Gemini AI.
- 🌐 **Multilingual Support** — Interact in Tamil and English.
- 🌦️ **Live Weather Updates** — Access current weather conditions and upcoming forecasts.
- 🌱 **Crop Risk Alerts** — Receive weather-based risk assessments and farming recommendations.
- 📈 **Mandi Price Information** — Explore agricultural market prices and compare available markets.
- 🎙️ **Voice Input** — Ask farming questions using browser-supported speech recognition.
- 📍 **Location-Based Weather** — Get weather information for your selected location.
- 💡 **Farmer-Friendly Interface** — Designed to make agricultural information easier to access and understand.

## 🛠️ Tech Stack

**Frontend**
- React.js
- Vite
- JavaScript
- CSS
- Lucide React
- React Markdown

**Backend**
- Node.js
- Express.js
- REST APIs

**AI & Data Sources**
- Google Gemini API
- Open-Meteo Weather API
- CEDA agricultural market data API

## 🏗️ Project Architecture

```text
KisanSetu-AI/
├── server/
│   ├── index.js
│   └── data.js
├── src/
│   ├── main.jsx
│   └── style.css
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## ⚙️ Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/abijithalagesan/KisanSetu-AI.git
cd KisanSetu-AI
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root and add the API keys required by your backend configuration.

```env
GEMINI_API_KEY=your_gemini_api_key
CEDA_API_KEY=your_ceda_api_key
```

Use the exact environment variable names expected by your backend. Configure any other required variables according to your implementation.

**Important:** Never commit API keys or your `.env` file to GitHub.

### 4. Start the backend

Run the backend command configured in your `package.json`. For example, if the script is named `server`:

```bash
npm run server
```

### 5. Start the frontend

Open another terminal in VS Code and run:

```bash
npm run dev
```

Open the local URL displayed by Vite in your terminal.

## 🌍 Vision

Our vision is to make agricultural information more accessible to farmers by combining artificial intelligence, weather intelligence, and agricultural market data in a simple multilingual platform.

KisanSetu AI aims to bridge the gap between technology and agriculture, helping farmers make better-informed decisions.

## 🏆 Achievement

🥈 **Secured 2nd Place in a Hackathon**

Recognized for our KisanSetu AI project, with a **₹6,000 gift voucher** awarded as the prize.

## 🔮 Future Enhancements

- Personalized crop recommendations.
- Soil and crop health analysis.
- Improved mandi price comparison and market coverage.
- Government agricultural scheme discovery.
- Expanded voice-based interaction in regional languages.
- More location-specific agricultural recommendations.

## 👨‍💻 Developed By

**Abijith A and Team**

GitHub: [@abijithalagesan](https://github.com/abijithalagesan)

---

⭐ If you find this project interesting, consider giving the repository a star!

**KisanSetu AI — Connecting Farmers with Intelligent Agriculture.** 🌾
