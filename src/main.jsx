import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Sprout, Send, CloudRain, TrendingUp, Landmark,
  Languages, LoaderCircle, Leaf, ExternalLink,
  ShieldCheck, Database, Sparkles, MapPin,
  RefreshCw, Mic, MicOff, AlertTriangle, CheckCircle2
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './style.css';

const LANGUAGES = [
  { value: 'Tamil + English', label: 'தமிழ் + English' },
  { value: 'Tamil', label: 'தமிழ்' },
  { value: 'English', label: 'English' },
];

const translations = {
  Tamil: {
    brand: 'விவசாய முடிவுகளுக்கான உதவியாளர்',
    assistant: 'AI விவசாய உதவியாளர்',
    capabilities: 'சேவைகள்',
    crop: 'பயிர் மற்றும் வானிலை வழிகாட்டுதல்',
    mandi: 'சந்தை விலை ஒப்பீடு',
    schemes: 'அரசுத் திட்ட வழிகாட்டி',
    trust: 'நம்பகத்தன்மைக்காக உருவாக்கப்பட்டது',
    trustText: 'ஆதாரங்கள் மற்றும் நிச்சயமற்ற தகவல்கள் தெளிவாகக் காட்டப்படும்.',
    prototype: 'முன்மாதிரி · தமிழ்நாடு',
    eyebrow: 'விவசாயம் • ஜெனரேட்டிவ் AI',
    title: 'உங்கள் விவசாயத் துணைவர்',
    subtitle: 'உங்கள் மொழியில் பயனுள்ள விவசாயத் தகவல்கள்.',
    language: 'மொழியைத் தேர்ந்தெடுக்கவும்',
    hero: 'விவசாயிகளுக்கான AI',
    heroTitle: 'சிறந்த தகவல்கள்.',
    heroEmphasis: 'தெளிவான முடிவுகள்.',
    heroText: 'பயிர்கள், சந்தை விலைகள் மற்றும் அரசுத் திட்டங்களைப் பற்றி கேளுங்கள்.',
    ask: 'KISANSETU-விடம் கேளுங்கள்',
    chatTitle: 'உங்கள் விவசாயத்திற்கு எவ்வாறு உதவலாம்?',
    ready: 'உதவியாளர் தயார்',
    suggestions: 'இவற்றைக் கேளுங்கள்',
    loading: 'தகவல்களைச் சரிபார்க்கிறது…',
    placeholder: 'உங்கள் கேள்வியைத் தமிழில் எழுதுங்கள்…',
    send: 'செய்தியை அனுப்பு',
    you: 'நீங்கள்',
    error: 'இணைப்பில் சிக்கல்',
    errorText: 'சேவையகத்தைச் சரிபார்த்து மீண்டும் முயற்சிக்கவும்.',
    disclaimer: 'CEDA சந்தை விலைகள் வரலாற்றுத் தரவாக இருக்கலாம். வானிலை முன்னறிவிப்புகளை அதிகாரப்பூர்வ IMD எச்சரிக்கைகளுடன் சரிபார்க்கவும்.',
    marketTitle: 'சந்தைத் தகவல்கள்',
    marketText: 'நெல் சந்தை விலைப் பதிவுகளையும் தேதிகளையும் ஒப்பிடுங்கள்.',
    marketStatus: 'வரலாற்றுத் தரவு',
    marketSource: 'தரவு மூலம்: CEDA Agri Market Data',
    weatherTitle: 'பயிர் மற்றும் வானிலைத் திட்டமிடல்',
    weatherText: 'தற்போதைய வானிலை மற்றும் மூன்று நாள் முன்னறிவிப்பு.',
    imd: 'அதிகாரப்பூர்வ வானிலை இணையதளம்',
    weatherLoading: 'வானிலைத் தகவல்களைப் பெறுகிறது…',
    current: 'தற்போதைய வானிலை',
    forecast: '3 நாள் முன்னறிவிப்பு',
    feels: 'உணரப்படும் வெப்பநிலை',
    humidity: 'ஈரப்பதம்',
    rain: 'மழை வாய்ப்பு',
    wind: 'காற்றின் வேகம்',
    weatherError: 'வானிலைத் தகவலைப் பெற முடியவில்லை.',
    retry: 'மீண்டும் முயற்சிக்கவும்',
    updated: 'தரவு பெறப்பட்ட நேரம்',
    weatherSource: 'தரவு மூலம்: Open-Meteo',
    weatherWarning: 'இது வானிலை மாதிரித் தகவல்; அதிகாரப்பூர்வ IMD எச்சரிக்கை அல்ல.',
    location: 'எனது இருப்பிடத்தைப் பயன்படுத்து',
    locating: 'இருப்பிடத்தைக் கண்டறிகிறது…',
    locationReady: 'உங்கள் இருப்பிடத்திற்கான வானிலை காட்டப்படுகிறது.',
    locationDenied: 'இருப்பிட அனுமதி கிடைக்கவில்லை.',
    locationUnsupported: 'இந்த உலாவியில் இருப்பிட வசதி இல்லை.',
    locationFallback: 'இயல்புநிலை இருப்பிடம்: திருவாரூர்',
    schemesTitle: 'அரசுத் திட்ட வழிகாட்டி',
    schemesText: 'அரசுத் திட்டங்கள் மற்றும் தேவையான ஆவணங்களைப் பற்றி அறியுங்கள்.',
    pmfby: 'PMFBY பயிர்க் காப்பீட்டுத் திட்டம்',
    evidence: 'ஊகங்களை விட ஆதாரங்கள் முக்கியம்',
    evidenceText: 'வரலாற்றுத் தரவுகள் மற்றும் முன்னறிவிப்புகள் தெளிவாகக் குறிப்பிடப்படும்.',
    footer: 'DevFest on Campus 2026-க்காக உருவாக்கப்பட்டது',
    tools: 'AI கருவிப் பயன்பாடு',
    used: 'பயன்படுத்தப்பட்டவை',
    harvest: 'அறுவடை வழிகாட்டுதல்',
    harvestPrompt: 'என் நெல் பயிர் அறுவடைக்குத் தயாராகிறது. என்ன கவனிக்க வேண்டும்?',
    compare: 'சந்தை விலைகளை ஒப்பிடு',
    comparePrompt: 'திருவாரூரில் 10 குவிண்டால் நெல்லின் சந்தை விலைகளை ஒப்பிடுங்கள்.',
    findSchemes: 'அரசுத் திட்டங்களை அறிக',
    schemesPrompt: 'நெல் விவசாயிக்கான பயிர்க் காப்பீட்டுத் திட்டங்கள் என்ன?',
    riskTitle: 'வானிலை சார்ந்த விவசாய அபாயம்',
    riskSubtitle: 'முன்னறிவிப்பின் அடிப்படையிலான மதிப்பீடு',
    activity: 'விவசாயச் செயல்பாடு',
    harvestActivity: 'அறுவடை',
    dryingActivity: 'நெல் உலர்த்துதல்',
    sprayingActivity: 'பூச்சிக்கொல்லி தெளித்தல்',
    generalActivity: 'பொதுவான விவசாயப் பணிகள்',
    precautions: 'பரிந்துரைக்கப்படும் முன்னெச்சரிக்கைகள்',
    riskDate: 'அபாயம் கண்டறியப்பட்ட தேதி',
    unknown: 'தெரியவில்லை',
    voiceListening: 'கேட்கிறது… உங்கள் கேள்வியைப் பேசுங்கள்.',
    voiceError: 'குரல் உள்ளீடு கிடைக்கவில்லை. மைக்ரோஃபோன் அனுமதியைச் சரிபார்க்கவும்.',
    voiceUnsupported: 'இந்த உலாவியில் குரல் உள்ளீடு ஆதரிக்கப்படவில்லை.',
    low: 'குறைந்த அபாயம்',
    moderate: 'மிதமான அபாயம்',
    high: 'அதிக அபாயம்',
    unknownRisk: 'தெரியாத அபாயம்',
    welcome: 'வணக்கம்! நான் KisanSetu AI. பயிர் வழிகாட்டுதல், நெல் சந்தை விலைப் பதிவுகள் மற்றும் அரசுத் திட்டத் தகவல்களில் உதவுகிறேன்.\n\n**முக்கிய குறிப்பு:** சந்தை விலைகள் வரலாற்றுத் தரவாக இருக்கலாம். அதிகாரப்பூர்வ IMD எச்சரிக்கைகளைச் சரிபார்க்கவும்.',
  },

  English: {
    brand: 'Farmer decision assistant',
    assistant: 'AI Farmer Assistant',
    capabilities: 'CAPABILITIES',
    crop: 'Crop & weather guidance',
    mandi: 'Mandi comparison',
    schemes: 'Scheme navigator',
    trust: 'Built for trust',
    trustText: 'Sources and uncertainty should always be visible.',
    prototype: 'Prototype · Tamil Nadu',
    eyebrow: 'AGRICULTURE • GENAI AGENT',
    title: 'Your farming companion',
    subtitle: 'Useful agricultural information, in your language.',
    language: 'Choose language',
    hero: 'FARMER-FIRST AI',
    heroTitle: 'Better information.',
    heroEmphasis: 'Clearer decisions.',
    heroText: 'Ask about your crop, market prices or government schemes.',
    ask: 'ASK KISANSETU',
    chatTitle: 'How can I help your farm?',
    ready: 'Assistant ready',
    suggestions: 'TRY ASKING',
    loading: 'Checking relevant information…',
    placeholder: 'Ask your question in English…',
    send: 'Send message',
    you: 'You',
    error: 'Connection issue',
    errorText: 'Check that the backend is running and try again.',
    disclaimer: 'CEDA prices may be historical. Check forecasts against official IMD alerts.',
    marketTitle: 'Market intelligence',
    marketText: 'Compare paddy market-price observations with their reporting dates.',
    marketStatus: 'HISTORICAL DATA',
    marketSource: 'Source: CEDA Agri Market Data · Ashoka University',
    weatherTitle: 'Crop & weather planning',
    weatherText: 'Current conditions and a three-day forecast.',
    imd: 'Official IMD website',
    weatherLoading: 'Loading weather…',
    current: 'Current weather',
    forecast: '3-day forecast',
    feels: 'Feels like',
    humidity: 'Humidity',
    rain: 'Chance of rain',
    wind: 'Wind speed',
    weatherError: 'Could not load weather information.',
    retry: 'Try again',
    updated: 'Data retrieved',
    weatherSource: 'Source: Open-Meteo',
    weatherWarning: 'Model-based weather information, not an official IMD warning.',
    location: 'Use My Location',
    locating: 'Finding your location…',
    locationReady: 'Showing weather for your device location.',
    locationDenied: 'Location permission was unavailable.',
    locationUnsupported: 'Location is not supported by this browser.',
    locationFallback: 'Default location: Thiruvarur',
    schemesTitle: 'Scheme navigator',
    schemesText: 'Explore government schemes and document checklists.',
    pmfby: 'PMFBY portal',
    evidence: 'Evidence over guesses',
    evidenceText: 'Historical data and forecasts are labelled clearly.',
    footer: 'Built for DevFest on Campus 2026',
    tools: 'Agent tool calls',
    used: 'used',
    harvest: 'Harvest guidance',
    harvestPrompt: 'My paddy crop is nearly ready for harvest. What should I check?',
    compare: 'Compare mandi prices',
    comparePrompt: 'Compare paddy selling options for 10 quintals in Thiruvarur.',
    findSchemes: 'Find schemes',
    schemesPrompt: 'What crop insurance information should a paddy farmer check?',
    riskTitle: 'Weather-related farming risk',
    riskSubtitle: 'Forecast-based assessment',
    activity: 'Farming activity',
    harvestActivity: 'Harvesting',
    dryingActivity: 'Grain drying',
    sprayingActivity: 'Pesticide spraying',
    generalActivity: 'General farm activities',
    precautions: 'Recommended precautions',
    riskDate: 'Risk forecast date',
    unknown: 'Unavailable',
    voiceListening: 'Listening… Speak your question.',
    voiceError: 'Voice input failed. Check microphone permission.',
    voiceUnsupported: 'Voice input is not supported in this browser.',
    low: 'Low Risk',
    moderate: 'Moderate Risk',
    high: 'High Risk',
    unknownRisk: 'Unknown Risk',
    welcome: 'Hello! I am KisanSetu AI. I can help with crop guidance, reported paddy-market prices and government schemes.\n\n**Important:** Market prices may be historical observations. Check official IMD alerts for severe weather.',
  },

  'Tamil + English': {
    brand: 'Farmer assistant · விவசாய உதவியாளர்',
    assistant: 'AI Farmer Assistant · AI விவசாய உதவியாளர்',
    capabilities: 'CAPABILITIES · சேவைகள்',
    crop: 'Crop & weather guidance · பயிர் மற்றும் வானிலை',
    mandi: 'Mandi comparison · சந்தை விலை ஒப்பீடு',
    schemes: 'Scheme navigator · அரசுத் திட்டங்கள்',
    trust: 'Built for trust · நம்பகத்தன்மை',
    trustText: 'Sources and uncertainty should be visible. ஆதாரங்கள் தெளிவாகக் காட்டப்படும்.',
    prototype: 'Prototype · முன்மாதிரி · Tamil Nadu',
    eyebrow: 'AGRICULTURE • விவசாயம் • GENAI',
    title: 'Your farming companion · உங்கள் விவசாயத் துணைவர்',
    subtitle: 'Useful farming information · பயனுள்ள விவசாயத் தகவல்கள்.',
    language: 'Choose language · மொழியைத் தேர்ந்தெடுக்கவும்',
    hero: 'FARMER-FIRST AI · விவசாயிகளுக்கான AI',
    heroTitle: 'Better information. சிறந்த தகவல்கள்.',
    heroEmphasis: 'Clearer decisions. தெளிவான முடிவுகள்.',
    heroText: 'Ask about crops, prices or schemes. பயிர், விலை மற்றும் அரசுத் திட்டங்களைப் பற்றி கேளுங்கள்.',
    ask: 'ASK KISANSETU · கேளுங்கள்',
    chatTitle: 'How can I help your farm? உங்கள் விவசாயத்திற்கு எவ்வாறு உதவலாம்?',
    ready: 'Assistant ready · உதவியாளர் தயார்',
    suggestions: 'TRY ASKING · இவற்றைக் கேளுங்கள்',
    loading: 'Checking information… தகவல்களைச் சரிபார்க்கிறது…',
    placeholder: 'Ask in Tamil or English · தமிழில் அல்லது ஆங்கிலத்தில் கேளுங்கள்…',
    send: 'Send · அனுப்பு',
    you: 'You · நீங்கள்',
    error: 'Connection issue · இணைப்புச் சிக்கல்',
    errorText: 'Check the backend and try again. சேவையகத்தைச் சரிபார்க்கவும்.',
    disclaimer: 'CEDA prices may be historical. சந்தை விலைகள் வரலாற்றுத் தரவாக இருக்கலாம். Check official IMD alerts.',
    marketTitle: 'Market intelligence · சந்தைத் தகவல்கள்',
    marketText: 'Compare paddy market records. நெல் சந்தை விலைகளை ஒப்பிடுங்கள்.',
    marketStatus: 'HISTORICAL DATA · வரலாற்றுத் தரவு',
    marketSource: 'Source: CEDA Agri Market Data',
    weatherTitle: 'Crop & weather planning · பயிர் மற்றும் வானிலை',
    weatherText: 'Weather for your location · உங்கள் இருப்பிட வானிலை.',
    imd: 'Official IMD site · அதிகாரப்பூர்வ இணையதளம்',
    weatherLoading: 'Loading weather… வானிலைத் தகவல்களைப் பெறுகிறது…',
    current: 'Current weather · தற்போதைய வானிலை',
    forecast: '3-day forecast · 3 நாள் முன்னறிவிப்பு',
    feels: 'Feels like · உணரப்படும் வெப்பநிலை',
    humidity: 'Humidity · ஈரப்பதம்',
    rain: 'Chance of rain · மழை வாய்ப்பு',
    wind: 'Wind speed · காற்றின் வேகம்',
    weatherError: 'Could not load weather · வானிலைத் தகவலைப் பெற முடியவில்லை.',
    retry: 'Retry · மீண்டும் முயற்சிக்கவும்',
    updated: 'Data retrieved · தரவு பெறப்பட்ட நேரம்',
    weatherSource: 'Source: Open-Meteo',
    weatherWarning: 'Forecast, not an official IMD warning · இது அதிகாரப்பூர்வ எச்சரிக்கை அல்ல.',
    location: 'Use My Location · எனது இருப்பிடம்',
    locating: 'Finding location… இருப்பிடத்தைக் கண்டறிகிறது…',
    locationReady: 'Showing your location weather · உங்கள் இருப்பிட வானிலை',
    locationDenied: 'Location permission unavailable · இருப்பிட அனுமதி இல்லை.',
    locationUnsupported: 'Location unavailable · இருப்பிட வசதி இல்லை.',
    locationFallback: 'Default location: Thiruvarur · இயல்புநிலை இருப்பிடம்',
    schemesTitle: 'Scheme navigator · அரசுத் திட்டங்கள்',
    schemesText: 'Government schemes and documents · அரசுத் திட்டங்கள் மற்றும் ஆவணங்கள்.',
    pmfby: 'PMFBY portal · பயிர்க் காப்பீடு',
    evidence: 'Evidence over guesses · ஆதாரங்களே முக்கியம்',
    evidenceText: 'Historical data and forecasts are labelled. தரவுகள் தெளிவாகக் குறிக்கப்படும்.',
    footer: 'Built for DevFest 2026 · DevFest 2026-க்காக உருவாக்கப்பட்டது',
    tools: 'Agent tool calls · AI கருவிகள்',
    used: 'used · பயன்பாடு',
    harvest: 'Harvest guidance · அறுவடை',
    harvestPrompt: 'என் நெல் பயிர் அறுவடைக்குத் தயாராகிறது. என்ன கவனிக்க வேண்டும்?',
    compare: 'Compare mandi prices · சந்தை விலை',
    comparePrompt: 'திருவாரூரில் 10 குவிண்டால் நெல்லின் சந்தை விலைகளை ஒப்பிடுங்கள்.',
    findSchemes: 'Find schemes · அரசுத் திட்டங்கள்',
    schemesPrompt: 'நெல் விவசாயிக்கான பயிர்க் காப்பீட்டுத் திட்டங்கள் என்ன?',
    riskTitle: 'Weather-related farming risk · வானிலை விவசாய அபாயம்',
    riskSubtitle: 'Forecast-based assessment · முன்னறிவிப்பு மதிப்பீடு',
    activity: 'Farming activity · விவசாயச் செயல்பாடு',
    harvestActivity: 'Harvesting · அறுவடை',
    dryingActivity: 'Grain drying · நெல் உலர்த்துதல்',
    sprayingActivity: 'Pesticide spraying · பூச்சிக்கொல்லி தெளித்தல்',
    generalActivity: 'General farm activities · பொதுவான விவசாயப் பணிகள்',
    precautions: 'Recommended precautions · முன்னெச்சரிக்கைகள்',
    riskDate: 'Risk forecast date · அபாயத் தேதி',
    unknown: 'Unavailable · கிடைக்கவில்லை',
    voiceListening: 'Listening… பேசுங்கள்.',
    voiceError: 'Voice input failed. மைக்ரோஃபோன் அனுமதியைச் சரிபார்க்கவும்.',
    voiceUnsupported: 'Voice input is not supported in this browser.',
    low: 'Low Risk · குறைந்த அபாயம்',
    moderate: 'Moderate Risk · மிதமான அபாயம்',
    high: 'High Risk · அதிக அபாயம்',
    unknownRisk: 'Unknown Risk · தெரியாத அபாயம்',
    welcome: 'வணக்கம்! நான் KisanSetu AI. I can help with crop guidance, reported paddy-market prices and government schemes.\n\n**முக்கிய குறிப்பு / Important:** CEDA prices may be historical. Check official IMD alerts.',
  },
};

function weatherDescription(code) {
  const descriptions = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Fog',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    71: 'Light snow',
    73: 'Moderate snow',
    75: 'Heavy snow',
    80: 'Rain showers',
    81: 'Moderate rain showers',
    82: 'Heavy rain showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with hail',
    99: 'Heavy thunderstorm with hail',
  };

  return descriptions[code] || 'Weather conditions unavailable';
}

function App() {
  const [language, setLanguage] = useState('Tamil + English');
  const t = translations[language] || translations['Tamil + English'];

  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [listening, setListening] = useState(false);
  const [voiceError, setVoiceError] = useState('');
  const [tools, setTools] = useState([]);

  const [messages, setMessages] = useState(() => [
    {
      role: 'assistant',
      text: translations['Tamil + English'].welcome,
      isWelcome: true,
    },
  ]);

  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [weatherError, setWeatherError] = useState('');
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationMode, setLocationMode] = useState('default');
  const [locationMessage, setLocationMessage] = useState('');
  const [farmingActivity, setFarmingActivity] = useState('harvest');

  // Browser voice recognition. This does not call Gemini.
  function startVoiceInput() {
    const Recognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!Recognition) {
      setVoiceError(t.voiceUnsupported);
      return;
    }

    const recognition = new Recognition();

    recognition.lang = language === 'English' ? 'en-IN' : 'ta-IN';
    recognition.continuous = false;
    recognition.interimResults = true;

    setVoiceError('');
    setListening(true);

    recognition.onresult = (event) => {
      let transcript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }

      setMessage(transcript.trim());
    };

    recognition.onerror = (event) => {
      setListening(false);
      setVoiceError(
        event.error === 'not-allowed'
          ? 'Please allow microphone access in your browser.'
          : `${t.voiceError} (${event.error})`
      );
    };

    recognition.onend = () => setListening(false);

    try {
      recognition.start();
    } catch {
      setListening(false);
      setVoiceError(t.voiceError);
    }
  }

  async function loadDefaultWeather() {
    setWeatherLoading(true);
    setWeatherError('');
    setLocationMode('default');
    setLocationMessage('');

    try {
      const response = await fetch('/api/weather?district=Thiruvarur');
      const data = await response.json();

      if (!response.ok || data.status !== 'success') {
        throw new Error(data.message || data.error || 'Weather request failed');
      }

      setWeather(data);
    } catch (error) {
      setWeatherError(error.message || t.weatherError);
    } finally {
      setWeatherLoading(false);
    }
  }

  function useMyLocation() {
    if (!navigator.geolocation) {
      setLocationMessage(t.locationUnsupported);
      return;
    }

    setLocationLoading(true);
    setWeatherLoading(true);
    setWeatherError('');
    setLocationMessage('');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const params = new URLSearchParams({
            latitude: String(position.coords.latitude),
            longitude: String(position.coords.longitude),
            current: [
              'temperature_2m',
              'relative_humidity_2m',
              'apparent_temperature',
              'precipitation',
              'rain',
              'weather_code',
              'wind_speed_10m',
            ].join(','),
            daily: [
              'weather_code',
              'temperature_2m_max',
              'temperature_2m_min',
              'precipitation_probability_max',
              'precipitation_sum',
            ].join(','),
            forecast_days: '3',
            timezone: 'auto',
          });

          const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?${params}`
          );

          if (!response.ok) {
            throw new Error('Weather provider request failed');
          }

          const data = await response.json();

          if (!data.current || !data.daily) {
            throw new Error('Weather data was incomplete');
          }

          setWeather({
            status: 'success',
            source: 'Open-Meteo Weather Forecast API',
            attribution: 'Weather data by Open-Meteo.com',
            attributionUrl: 'https://open-meteo.com/',
            location: 'Your current location',
            timezone: data.timezone || 'auto',
            retrievedAt: new Date().toISOString(),
            current: {
              observationTime: data.current.time,
              temperatureC: data.current.temperature_2m,
              feelsLikeC: data.current.apparent_temperature,
              humidityPercent: data.current.relative_humidity_2m,
              precipitationMm: data.current.precipitation,
              rainMm: data.current.rain,
              windSpeedKmh: data.current.wind_speed_10m,
              condition: weatherDescription(data.current.weather_code),
            },
            forecast: (data.daily.time || []).map((date, index) => ({
              date,
              condition: weatherDescription(data.daily.weather_code?.[index]),
              minC: data.daily.temperature_2m_min?.[index] ?? null,
              maxC: data.daily.temperature_2m_max?.[index] ?? null,
              rainChancePercent:
                data.daily.precipitation_probability_max?.[index] ?? null,
              precipitationSumMm:
                data.daily.precipitation_sum?.[index] ?? null,
            })),
            warning:
              'Weather-model output, not an official IMD severe-weather warning.',
          });

          setLocationMode('device');
          setLocationMessage(t.locationReady);
        } catch (error) {
          setWeatherError(error.message || t.weatherError);
        } finally {
          setWeatherLoading(false);
          setLocationLoading(false);
        }
      },
      () => {
        setWeatherLoading(false);
        setLocationLoading(false);
        setLocationMessage(t.locationDenied);

        if (!weather) loadDefaultWeather();
      },
      {
        enableHighAccuracy: false,
        timeout: 12000,
        maximumAge: 300000,
      }
    );
  }

  useEffect(() => {
    loadDefaultWeather();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Risk screening uses forecast data, not Gemini.
  // Thresholds are prototype rules and require agricultural validation.
  const farmingRisk = useMemo(() => {
    if (!weather || !Array.isArray(weather.forecast) ||
        weather.forecast.length === 0) {
      return {
        level: 'Unknown',
        reason: 'Reliable forecast data is unavailable.',
        date: null,
        actions: [
          'Check the latest local forecast and official IMD alerts.',
          'Do not assume conditions are safe when data is missing.',
        ],
      };
    }

    const days = weather.forecast
      .map((day) => ({
        ...day,
        rainChance:
          typeof day.rainChancePercent === 'number' &&
          Number.isFinite(day.rainChancePercent)
            ? day.rainChancePercent
            : null,
        rainfall:
          typeof day.precipitationSumMm === 'number' &&
          Number.isFinite(day.precipitationSumMm)
            ? day.precipitationSumMm
            : null,
        condition: day.condition || '',
      }))
      .filter(
        (day) =>
          day.rainChance !== null ||
          day.rainfall !== null ||
          day.condition !== ''
      );

    if (days.length === 0) {
      return {
        level: 'Unknown',
        reason: 'The forecast contains no usable weather information.',
        date: null,
        actions: [
          'Check the local forecast before planning farm work.',
        ],
      };
    }

    const today = new Intl.DateTimeFormat('en-CA', {
      timeZone: weather.timezone || 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date());

    const assessedDays = days.map((day) => {
      const isToday = day.date === today;
      const thunderstorm = /thunderstorm/i.test(day.condition);
      const heavyRain = /heavy rain/i.test(day.condition);

      const extremeRain =
        day.rainfall !== null && day.rainfall >= 20;

      const highRainChance =
        day.rainChance !== null && day.rainChance >= 80;

      const moderateRainChance =
        day.rainChance !== null && day.rainChance >= 40;

      let level = 'Low';
      let reason = 'No configured high-risk weather trigger was detected.';

      if (
        (thunderstorm || heavyRain || extremeRain || highRainChance) &&
        (isToday || extremeRain || highRainChance)
      ) {
        level = 'High';

        if (thunderstorm) {
          reason = 'Thunderstorms are forecast for this day.';
        } else if (heavyRain) {
          reason = 'Heavy rain is indicated in the forecast.';
        } else if (extremeRain) {
          reason = `Forecast rainfall is ${day.rainfall} mm.`;
        } else {
          reason = `Rain probability is ${day.rainChance}%.`;
        }
      } else if (
        thunderstorm || heavyRain || extremeRain || moderateRainChance
      ) {
        level = 'Moderate';

        reason = thunderstorm
          ? 'Thunderstorms are forecast on a later day.'
          : heavyRain
            ? 'Heavy rain is indicated on a later day.'
            : extremeRain
              ? `Forecast rainfall is ${day.rainfall} mm.`
              : `Rain probability is ${day.rainChance}%.`;
      }

      return { ...day, level, reason };
    });

    const rank = { Low: 1, Moderate: 2, High: 3 };

    const highest = assessedDays.reduce((best, day) =>
      rank[day.level] > rank[best.level] ? day : best
    );

    const actionsByActivity = {
      harvest: [
        'Check crop maturity before deciding when to harvest.',
        'If rain is approaching, prepare covered, dry storage.',
        'Recheck the latest local forecast before field operations.',
      ],
      drying: [
        'Prepare a covered area to protect grain from rain.',
        'Avoid relying on outdoor drying when rain is expected.',
        'Check grain moisture before storing harvested produce.',
      ],
      spraying: [
        'Check the pesticide label for rain-free intervals.',
        'Avoid spraying during thunderstorms or unsafe wind conditions.',
        'Follow label instructions and local agricultural advice.',
      ],
      general: [
        'Monitor the forecast and official IMD alerts.',
        'Protect harvested produce if rain is expected.',
        'Consult agricultural extension services for crop-specific decisions.',
      ],
    };

    return {
      level: highest.level,
      reason: highest.reason,
      date: highest.date || null,
      actions: actionsByActivity[farmingActivity],
    };
  }, [weather, farmingActivity]);

  const starters = [
    { icon: CloudRain, text: t.harvestPrompt, label: t.harvest },
    { icon: TrendingUp, text: t.comparePrompt, label: t.compare },
    { icon: Landmark, text: t.schemesPrompt, label: t.findSchemes },
  ];

  const history = useMemo(
    () =>
      messages.slice(-8).map((item) => ({
        role: item.role === 'assistant' ? 'model' : 'user',
        text: item.text,
      })),
    [messages]
  );

  function handleLanguageChange(nextLanguage) {
    setLanguage(nextLanguage);
    setTools([]);

    setMessages((previous) => {
      if (
        previous.length === 1 &&
        previous[0].role === 'assistant' &&
        previous[0].isWelcome
      ) {
        return [{
          ...previous[0],
          text: translations[nextLanguage].welcome,
        }];
      }

      return previous;
    });
  }

  async function send(text = message) {
    const clean = text.trim();
    if (!clean || busy) return;

    setMessages((previous) => [
      ...previous,
      { role: 'user', text: clean },
    ]);

    setMessage('');
    setBusy(true);
    setTools([]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: clean,
          language,
          history,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Request failed');
      }

      setMessages((previous) => [
        ...previous,
        {
          role: 'assistant',
          text: data.reply || 'No response returned.',
        },
      ]);

      setTools(data.toolsUsed || []);
    } catch (error) {
      setMessages((previous) => [
        ...previous,
        {
          role: 'assistant',
          text: `${t.error}: ${error.message}. ${t.errorText}`,
        },
      ]);
    } finally {
      setBusy(false);
    }
  }

  const riskLabel = {
    Low: t.low,
    Moderate: t.moderate,
    High: t.high,
    Unknown: t.unknownRisk,
  }[farmingRisk.level];

  const riskColor = {
    Low: { bg: '#dcfce7', color: '#166534' },
    Moderate: { bg: '#fef3c7', color: '#92400e' },
    High: { bg: '#fee2e2', color: '#991b1b' },
    Unknown: { bg: '#e2e8f0', color: '#334155' },
  }[farmingRisk.level];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon"><Sprout size={25} /></div>
          <div>
            <strong>KisanSetu AI</strong>
            <span>{t.brand}</span>
          </div>
        </div>

        <div className="side-label">{t.assistant}</div>
        <div className="nav-item active">
          <Sparkles size={17} /> {t.assistant}
        </div>

        <div className="side-label">{t.capabilities}</div>
        <div className="nav-item"><CloudRain size={17} /> {t.crop}</div>
        <div className="nav-item"><TrendingUp size={17} /> {t.mandi}</div>
        <div className="nav-item"><Landmark size={17} /> {t.schemes}</div>

        <div className="sidebar-note">
          <ShieldCheck size={18} />
          <div>
            <strong>{t.trust}</strong>
            <p>{t.trustText}</p>
          </div>
        </div>

        <div className="sidebar-bottom">
          <span className="dot" /> {t.prototype}
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <div className="eyebrow">{t.eyebrow}</div>
            <h1>{t.title}</h1>
            <p>{t.subtitle}</p>
          </div>

          <label className="language-select">
            <Languages size={17} />
            <select
              aria-label={t.language}
              value={language}
              onChange={(event) => handleLanguageChange(event.target.value)}
            >
              {LANGUAGES.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
        </header>

        <section className="hero">
          <div className="hero-copy">
            <span className="hero-pill">
              <Leaf size={14} /> {t.hero}
            </span>
            <h2>
              {t.heroTitle}
              <br />
              <em>{t.heroEmphasis}</em>
            </h2>
            <p>{t.heroText}</p>
          </div>

          <div className="hero-art">
            <div className="sun"></div>
            <div className="hill hill-back"></div>
            <div className="hill hill-front"></div>
            <div className="field-lines"></div>
            <div className="plant plant-one">✳</div>
            <div className="plant plant-two">✳</div>
          </div>
        </section>

        <section className="workspace">
          <div className="chat-column">
            <div className="section-heading">
              <div>
                <span className="eyebrow">{t.ask}</span>
                <h3>{t.chatTitle}</h3>
              </div>
              <span className="online">
                <span className="dot"></span> {t.ready}
              </span>
            </div>

            <div className="chat-window">
              {messages.map((item, index) => (
                <div
                  className={`message-row ${item.role}`}
                  key={index}
                >
                  <div className="avatar">
                    {item.role === 'assistant' ? <Sprout size={17} /> : t.you}
                  </div>

                  <div className="bubble">
                    <div className="message-author">
                      {item.role === 'assistant' ? 'KisanSetu AI' : t.you}
                    </div>
                    <div className="markdown-body">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {item.text}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              ))}

              {busy && (
                <div className="message-row assistant">
                  <div className="avatar"><Sprout size={17} /></div>
                  <div className="bubble loading">
                    <LoaderCircle className="spin" size={18} />
                    {t.loading}
                  </div>
                </div>
              )}

              <div className="suggestions">
                <div className="suggestion-title">{t.suggestions}</div>
                {starters.map((starter, index) => {
                  const Icon = starter.icon;
                  return (
                    <button
                      key={index}
                      className="suggestion"
                      onClick={() => send(starter.text)}
                      disabled={busy}
                    >
                      <Icon size={17} />
                      <span>{starter.label}</span>
                      <span className="suggestion-arrow">↗</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {tools.length > 0 && (
              <div className="tool-panel">
                <div className="tool-panel-title">
                  <Database size={16} />
                  {t.tools}
                  <span>{tools.length} {t.used}</span>
                </div>
                {tools.map((tool, index) => (
                  <details key={index}>
                    <summary>{tool.name.replaceAll('_', ' ')}</summary>
                    <pre>{JSON.stringify(tool.result, null, 2)}</pre>
                  </details>
                ))}
              </div>
            )}

            <form
              className="composer"
              onSubmit={(event) => {
                event.preventDefault();
                send();
              }}
            >
              <button
                type="button"
                onClick={startVoiceInput}
                disabled={busy || listening}
                aria-label="Speak your question"
                title="Speak your question"
                style={{
                  minWidth: 44,
                  height: 44,
                  border: '1px solid #cbdccf',
                  borderRadius: 12,
                  background: listening ? '#dff4e5' : '#fff',
                  color: '#245b3b',
                  cursor: listening ? 'wait' : 'pointer',
                }}
              >
                {listening ? <MicOff size={19} /> : <Mic size={19} />}
              </button>

              <input
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder={t.placeholder}
                aria-label={t.placeholder}
                disabled={busy}
              />

              <button disabled={busy || !message.trim()} aria-label={t.send}>
                <Send size={18} />
              </button>
            </form>

            {listening && (
              <p role="status" style={{ fontSize: 13, color: '#276749' }}>
                🎙️ {t.voiceListening}
              </p>
            )}

            {voiceError && (
              <p role="alert" style={{ fontSize: 13, color: '#b42318' }}>
                {voiceError}
              </p>
            )}

            <div className="disclaimer">{t.disclaimer}</div>
          </div>

          <aside className="right-column">
            {/* Weather-based farming risk */}
            <div
              className="side-card"
              style={{
                border: '1px solid #dce7dc',
                borderRadius: 16,
                padding: 20,
                background: '#fff',
                marginBottom: 18,
              }}
            >
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <div className="card-icon green">
                  {farmingRisk.level === 'Low'
                    ? <CheckCircle2 size={20} />
                    : <AlertTriangle size={20} />}
                </div>
                <div>
                  <h3 style={{ margin: 0 }}>{t.riskTitle}</h3>
                  <span style={{ fontSize: 12, color: '#64748b' }}>
                    {t.riskSubtitle}
                  </span>
                </div>
              </div>

              <div
                style={{
                  display: 'inline-block',
                  marginTop: 14,
                  padding: '6px 11px',
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 700,
                  background: riskColor.bg,
                  color: riskColor.color,
                }}
              >
                {riskLabel}
              </div>

              <p style={{ fontSize: 14, lineHeight: 1.6 }}>
                {farmingRisk.reason}
              </p>

              <label
                style={{
                  display: 'block',
                  fontSize: 13,
                  fontWeight: 600,
                  marginTop: 16,
                }}
              >
                {t.activity}

                <select
                  value={farmingActivity}
                  onChange={(event) => setFarmingActivity(event.target.value)}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: 10,
                    marginTop: 7,
                    border: '1px solid #dce7dc',
                    borderRadius: 9,
                    background: '#fff',
                    color: '#244b36',
                  }}
                >
                  <option value="harvest">{t.harvestActivity}</option>
                  <option value="drying">{t.dryingActivity}</option>
                  <option value="spraying">{t.sprayingActivity}</option>
                  <option value="general">{t.generalActivity}</option>
                </select>
              </label>

              <p style={{ fontSize: 12, color: '#64748b' }}>
                {t.riskDate}: {farmingRisk.date || t.unknown}
              </p>

              <strong style={{ fontSize: 13 }}>{t.precautions}</strong>

              <ul style={{ paddingLeft: 20, lineHeight: 1.7 }}>
                {farmingRisk.actions.map((action, index) => (
                  <li
                    key={index}
                    style={{ fontSize: 13, marginTop: 6 }}
                  >
                    {action}
                  </li>
                ))}
              </ul>

              <p style={{ fontSize: 11, color: '#64748b', marginBottom: 0 }}>
                Forecast-based prototype only. Not an official warning or
                validated crop-risk diagnosis. Check official IMD alerts.
              </p>
            </div>

            {/* Market information */}
            <div className="side-card">
              <div className="card-icon green"><TrendingUp size={20} /></div>
              <h3>{t.marketTitle}</h3>
              <p>{t.marketText}</p>
              <span className="status-tag">{t.marketStatus}</span>
              <p className="market-source">{t.marketSource}</p>
            </div>

            {/* Weather */}
            <div className="side-card weather-card">
              <div className="card-icon blue"><CloudRain size={20} /></div>
              <h3>{t.weatherTitle}</h3>
              <p>{t.weatherText}</p>

              <button
                type="button"
                onClick={useMyLocation}
                disabled={locationLoading || weatherLoading}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  width: '100%',
                  padding: 11,
                  margin: '14px 0',
                  border: '1px solid #cbdccf',
                  borderRadius: 10,
                  background: '#eef6f0',
                  color: '#244b36',
                  fontWeight: 600,
                  cursor: locationLoading || weatherLoading ? 'wait' : 'pointer',
                  opacity: locationLoading || weatherLoading ? 0.7 : 1,
                }}
              >
                {locationLoading
                  ? <LoaderCircle className="spin" size={17} />
                  : <MapPin size={17} />}
                {locationLoading ? t.locating : t.location}
              </button>

              {locationMessage && (
                <p role="status" style={{ fontSize: 12 }}>{locationMessage}</p>
              )}

              {weatherLoading && (
                <div className="weather-message">
                  <LoaderCircle className="spin" size={18} />
                  <span>{t.weatherLoading}</span>
                </div>
              )}

              {!weatherLoading && weatherError && (
                <div className="weather-message weather-error">
                  <p>{t.weatherError}</p>
                  <button
                    type="button"
                    onClick={locationMode === 'device'
                      ? useMyLocation
                      : loadDefaultWeather}
                  >
                    <RefreshCw size={14} /> {t.retry}
                  </button>
                  <p style={{ fontSize: 11 }}>{weatherError}</p>
                </div>
              )}

              {!weatherLoading && weather && (
                <div className="weather-details">
                  <div className="weather-location">
                    <strong>{weather.location}</strong>
                    <span>{t.current}</span>
                  </div>

                  {locationMode === 'default' && (
                    <p style={{ fontSize: 11 }}>{t.locationFallback}</p>
                  )}

                  <div className="weather-current">
                    <div className="weather-temperature">
                      {Math.round(weather.current.temperatureC)}°C
                    </div>
                    <div className="weather-condition">
                      {weather.current.condition}
                    </div>
                  </div>

                  <div className="weather-stats">
                    <div>
                      <span>{t.feels}</span>
                      <strong>{weather.current.feelsLikeC}°C</strong>
                    </div>
                    <div>
                      <span>{t.humidity}</span>
                      <strong>{weather.current.humidityPercent}%</strong>
                    </div>
                    <div>
                      <span>{t.wind}</span>
                      <strong>{weather.current.windSpeedKmh} km/h</strong>
                    </div>
                    <div>
                      <span>{t.rain}</span>
                      <strong>{weather.current.rainMm} mm</strong>
                    </div>
                  </div>

                  <h4 className="weather-forecast-title">{t.forecast}</h4>

                  <div className="weather-forecast">
                    {weather.forecast.map((day) => (
                      <div className="forecast-day" key={day.date}>
                        <strong>
                          {new Date(`${day.date}T12:00:00`).toLocaleDateString(
                            language === 'Tamil' ? 'ta-IN' : 'en-IN',
                            {
                              weekday: 'short',
                              day: 'numeric',
                              month: 'short',
                              timeZone: weather.timezone || 'Asia/Kolkata',
                            }
                          )}
                        </strong>
                        <span>{day.condition}</span>
                        <strong>{Math.round(day.maxC)}° / {Math.round(day.minC)}°C</strong>
                        <span>{t.rain}: {day.rainChancePercent ?? '—'}%</span>
                      </div>
                    ))}
                  </div>

                  <p className="weather-source">
                    {t.weatherSource}
                    <br />
                    {t.updated}:{' '}
                    {new Date(weather.retrievedAt).toLocaleTimeString('en-IN', {
                      hour: '2-digit',
                      minute: '2-digit',
                      timeZone: weather.timezone || 'Asia/Kolkata',
                    })}
                  </p>

                  <p className="weather-warning">{t.weatherWarning}</p>
                </div>
              )}

              <a
                href="https://mausam.imd.gov.in/"
                target="_blank"
                rel="noreferrer"
              >
                {t.imd} <ExternalLink size={13} />
              </a>
            </div>

            {/* Government schemes */}
            <div className="side-card">
              <div className="card-icon gold"><Landmark size={20} /></div>
              <h3>{t.schemesTitle}</h3>
              <p>{t.schemesText}</p>
              <a
                href="https://pmfby.gov.in/"
                target="_blank"
                rel="noreferrer"
              >
                {t.pmfby} <ExternalLink size={13} />
              </a>
            </div>

            <div className="trust-card">
              <ShieldCheck size={20} />
              <div>
                <strong>{t.evidence}</strong>
                <p>{t.evidenceText}</p>
              </div>
            </div>
          </aside>
        </section>

        <footer>
          <Sprout size={16} />
          KisanSetu AI
          <span>{t.footer}</span>
        </footer>
      </main>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);