
import express from 'express';
import dotenv from 'dotenv';

import {
  mandiPrices,
  cropGuidance,
  schemes,
  getWeatherDemo,
  compareMarkets,
} from './data.js';

dotenv.config();

const app = express();
app.use(express.json({ limit: '1mb' }));

// ==================================================
// CONFIGURATION
// ==================================================

const GEMINI_ENDPOINT =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent';

const CEDA_PRICES_ENDPOINT =
  'https://api.ceda.ashoka.edu.in/v1/agmarknet/prices';

const MARKET_NAMES = {
  303: 'Thiruvarur',
  1363: 'Tiruthuraipoondi',
  2624: 'Valangaiman',
  2625: 'Kudavasal',
  2626: 'Koradacheri',
  2627: 'Poonthottam',
  2628: 'Vaduvur',
  2629: 'Mannargudi',
  3712: 'Mannarkudi',
};

const WEATHER_LOCATIONS = {
  thiruvarur: {
    name: 'Thiruvarur',
    latitude: 10.77,
    longitude: 79.63,
  },
  thanjavur: {
    name: 'Thanjavur',
    latitude: 10.79,
    longitude: 79.14,
  },
  nagapattinam: {
    name: 'Nagapattinam',
    latitude: 10.77,
    longitude: 79.84,
  },
  chennai: {
    name: 'Chennai',
    latitude: 13.08,
    longitude: 80.27,
  },
  coimbatore: {
    name: 'Coimbatore',
    latitude: 11.02,
    longitude: 76.96,
  },
  madurai: {
    name: 'Madurai',
    latitude: 9.93,
    longitude: 78.12,
  },
  salem: {
    name: 'Salem',
    latitude: 11.66,
    longitude: 78.15,
  },
  erode: {
    name: 'Erode',
    latitude: 11.34,
    longitude: 77.72,
  },
  tiruchirappalli: {
    name: 'Tiruchirappalli',
    latitude: 10.79,
    longitude: 78.70,
  },
  trichy: {
    name: 'Tiruchirappalli',
    latitude: 10.79,
    longitude: 78.70,
  },
};

// ==================================================
// WEATHER HELPERS
// ==================================================

function describeWeatherCode(code) {
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
    56: 'Light freezing drizzle',
    57: 'Dense freezing drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    66: 'Light freezing rain',
    67: 'Heavy freezing rain',
    71: 'Slight snowfall',
    73: 'Moderate snowfall',
    75: 'Heavy snowfall',
    77: 'Snow grains',
    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    85: 'Slight snow showers',
    86: 'Heavy snow showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with hail',
    99: 'Thunderstorm with heavy hail',
  };

  return descriptions[Number(code)] || 'Condition unavailable';
}

// ==================================================
// TOOL 1: LIVE WEATHER — OPEN-METEO
// ==================================================

async function getLiveWeather(district = 'Thiruvarur') {
  const key = String(district).trim().toLowerCase();
  const location = WEATHER_LOCATIONS[key];

  if (!location) {
    return {
      status: 'unsupported_location',
      source: 'Open-Meteo',
      message:
        'Supported locations: Thiruvarur, Thanjavur, Nagapattinam, Chennai, Coimbatore, Madurai, Salem, Erode and Tiruchirappalli.',
    };
  }

  const parameters = new URLSearchParams({
    latitude: String(location.latitude),
    longitude: String(location.longitude),
    current:
      'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,wind_speed_10m',
    daily:
      'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum',
    forecast_days: '3',
    timezone: 'Asia/Kolkata',
  });

  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?${parameters}`,
      { signal: AbortSignal.timeout(12000) },
    );

    if (!response.ok) {
      console.error('Open-Meteo HTTP error:', response.status);

      return {
        status: 'unavailable',
        source: 'Open-Meteo',
        message: `Weather provider returned HTTP ${response.status}.`,
      };
    }

    const data = await response.json();

    if (!data.current || !data.daily) {
      return {
        status: 'unavailable',
        source: 'Open-Meteo',
        message: 'The weather provider returned incomplete data.',
      };
    }

    return {
      status: 'success',
      source: 'Open-Meteo Weather Forecast API',
      attribution: 'Weather data by Open-Meteo.com',
      attributionUrl: 'https://open-meteo.com/',
      location: location.name,
      timezone: data.timezone,
      retrievedAt: new Date().toISOString(),

      current: {
        observationTime: data.current.time,
        temperatureC: data.current.temperature_2m,
        feelsLikeC: data.current.apparent_temperature,
        humidityPercent: data.current.relative_humidity_2m,
        precipitationMm: data.current.precipitation,
        rainMm: data.current.rain,
        windSpeedKmh: data.current.wind_speed_10m,
        condition: describeWeatherCode(data.current.weather_code),
      },

      forecast: (data.daily.time || []).map((date, index) => ({
        date,
        condition: describeWeatherCode(data.daily.weather_code?.[index]),
        minC: data.daily.temperature_2m_min?.[index] ?? null,
        maxC: data.daily.temperature_2m_max?.[index] ?? null,
        rainChancePercent:
          data.daily.precipitation_probability_max?.[index] ?? null,
        precipitationSumMm:
          data.daily.precipitation_sum?.[index] ?? null,
      })),

      warning:
        'Weather-model output, not an official IMD severe-weather warning. Check IMD for official alerts.',
    };
  } catch (error) {
    console.error(
      'Open-Meteo connection error:',
      error.name,
      error.message,
    );

    return {
      status: 'unavailable',
      source: 'Open-Meteo',
      message:
        error.name === 'TimeoutError'
          ? 'Weather request timed out. Please try again later.'
          : 'Could not connect to the weather provider. Please try again later.',
    };
  }
}

// ==================================================
// TOOL 2: CEDA MANDI PRICES
// ==================================================

async function getCedaPaddyPrices(
  quantityQuintals = 10,
  district = 'Thiruvarur',
) {
  const source =
    'CEDA Agri Market Data, Centre for Economic Data & Analysis, Ashoka University';

  const quantity = Number(quantityQuintals);

  if (
    !Number.isFinite(quantity) ||
    quantity <= 0 ||
    quantity > 100000
  ) {
    return {
      status: 'invalid_input',
      source,
      records: [],
      message:
        'Quantity must be greater than zero and at most 100000 quintals.',
    };
  }

  if (String(district).trim().toLowerCase() !== 'thiruvarur') {
    return {
      status: 'unavailable',
      source,
      records: [],
      message:
        'The verified CEDA price integration currently supports Thiruvarur district only.',
    };
  }

  if (!process.env.CEDA_API_KEY) {
    return {
      status: 'unavailable',
      source,
      records: [],
      message: 'CEDA_API_KEY is missing from .env.',
    };
  }

  const today = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());

  try {
    const response = await fetch(CEDA_PRICES_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.CEDA_API_KEY}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        commodity_id: 2,
        state_id: 33,
        district_id: [619],
        market_id: [],
        from_date: '2024-01-01',
        to_date: today,
      }),
      signal: AbortSignal.timeout(25000),
    });

    const raw = await response.text();
    let payload;

    try {
      payload = JSON.parse(raw);
    } catch {
      return {
        status: 'unavailable',
        source,
        records: [],
        message: 'CEDA returned an unreadable response.',
      };
    }

    if (!response.ok) {
      console.error('CEDA request failed:', response.status);

      return {
        status: 'unavailable',
        source,
        records: [],
        message:
          response.status === 429
            ? 'CEDA is rate-limiting requests. Please try again later.'
            : `CEDA request failed with HTTP ${response.status}.`,
      };
    }

    const rows = payload?.output?.data;

    if (payload?.output?.type !== 'success' || !Array.isArray(rows)) {
      return {
        status: 'no_data',
        source,
        records: [],
        message:
          payload?.output?.message ||
          'No price records are available for this selection.',
      };
    }

    const normalized = rows
      .map((row) => {
        const marketId = Number(row.market_id);

        return {
          marketId,
          market: MARKET_NAMES[marketId] || `Market ${marketId}`,
          reportedDate: String(row.date || '').slice(0, 10),
          minPrice: Number(row.min_price),
          maxPrice: Number(row.max_price),
          modalPrice: Number(row.modal_price),
        };
      })
      .filter(
        (row) =>
          /^\d{4}-\d{2}-\d{2}$/.test(row.reportedDate) &&
          Number.isFinite(row.minPrice) &&
          Number.isFinite(row.maxPrice) &&
          Number.isFinite(row.modalPrice) &&
          row.modalPrice > 0,
      );

    if (normalized.length === 0) {
      return {
        status: 'no_data',
        source,
        records: [],
        message: 'No usable price observations were returned.',
      };
    }

    const latestByMarket = new Map();

    for (const row of normalized) {
      const previous = latestByMarket.get(row.marketId);

      if (!previous || row.reportedDate > previous.reportedDate) {
        latestByMarket.set(row.marketId, row);
      }
    }

    const records = [...latestByMarket.values()]
      .sort((a, b) => b.reportedDate.localeCompare(a.reportedDate))
      .map((row) => {
        const observationAgeDays = Math.max(
          0,
          Math.floor(
            (
              Date.parse(`${today}T00:00:00Z`) -
              Date.parse(`${row.reportedDate}T00:00:00Z`)
            ) / 86400000,
          ),
        );

        return {
          ...row,
          currency: 'INR',
          unit: 'per quintal',
          quantityQuintals: quantity,
          grossValueRs: Math.round(row.modalPrice * quantity),
          observationAgeDays,
          freshness:
            observationAgeDays > 90 ? 'stale' : 'within_90_days',
        };
      });

    const newestObservationDate = records[0].reportedDate;

    const observationAgeDays = Math.max(
      0,
      Math.floor(
        (
          Date.parse(`${today}T00:00:00Z`) -
          Date.parse(`${newestObservationDate}T00:00:00Z`)
        ) / 86400000,
      ),
    );

    return {
      status: 'success',
      source,
      commodity: 'Paddy (Common)',
      state: 'Tamil Nadu',
      district: 'Thiruvarur',
      quantityQuintals: quantity,
      retrievedAt: new Date().toISOString(),
      observationsReturned: normalized.length,
      newestObservationDate,
      observationAgeDays,
      freshness:
        observationAgeDays > 90 ? 'stale' : 'within_90_days',
      warning:
        observationAgeDays > 90
          ? `Historical data only. The newest observation is ${newestObservationDate}, ${observationAgeDays} days old. Do not present these prices as current quotes or use them alone to recommend a sale today.`
          : `The latest observation is dated ${newestObservationDate}. Verify today's prices with the market before selling.`,
      records,
    };
  } catch (error) {
    console.error(
      'CEDA connection error:',
      error.name,
      error.message,
    );

    return {
      status: 'unavailable',
      source,
      records: [],
      message:
        error.name === 'TimeoutError'
          ? 'CEDA request timed out. Please try again later.'
          : 'Could not connect to CEDA. Please try again later.',
    };
  }
}

// ==================================================
// TOOL 3: CROP GUIDANCE MATCHING
// ==================================================

async function searchCropGuidance(topic = '') {
  const query = String(topic).toLowerCase().trim();

  if (!query) {
    return {
      status: 'invalid_input',
      topic: query,
      results: [],
      message: 'Please provide a crop name or farming concern.',
    };
  }

  const words = query
    .split(/[^a-z0-9]+/)
    .filter((word) => word.length > 2);

  const aliases = {
    paddy: ['paddy', 'rice'],
    wheat: ['wheat'],
    maize: ['maize', 'corn'],
    cotton: ['cotton'],
    sugarcane: ['sugarcane'],
    groundnut: ['groundnut', 'peanut'],
    tomato: ['tomato'],
    banana: ['banana'],
  };

  const matchedCrop = Object.entries(aliases).find(([, names]) =>
    names.some((name) => query.includes(name)),
  )?.[0];

  const ranked = cropGuidance
    .map((item) => {
      const searchableText = [
        item.crop,
        item.stage,
        item.title,
        ...(item.keywords || []),
        item.advice,
      ]
        .join(' ')
        .toLowerCase();

      let score = 0;

      for (const word of words) {
        if (searchableText.includes(word)) score += 1;
      }

      if (
        matchedCrop &&
        (item.crop === matchedCrop ||
          (matchedCrop === 'paddy' && item.crop === 'paddy'))
      ) {
        score += 5;
      }

      // Never return an unrelated crop-specific entry.
      if (
        matchedCrop &&
        item.crop !== matchedCrop &&
        item.crop !== 'general'
      ) {
        score = 0;
      }

      if (item.crop === 'general' && score === 0) {
        score = 1;
      }

      return { item, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ item }) => item);

  return {
    status: ranked.length > 0 ? 'guidance_found' : 'no_match',
    topic: query,
    results: ranked,
    source:
      'KisanSetu local starter knowledge base; guidance is not independently verified',
    message:
      ranked.length > 0
        ? 'These are general educational suggestions, not a confirmed diagnosis. Verify crop-specific decisions with a qualified agricultural expert or official agricultural extension service.'
        : 'No matching guidance was found. Ask for the crop name, growth stage and symptoms, or consult a qualified agricultural expert.',
  };
}

// ==================================================
// TOOL 4: GOVERNMENT SCHEMES
// ==================================================

async function searchSchemes(topic = '') {
  const query = String(topic).toLowerCase().trim();

  if (!query) {
    return {
      status: 'invalid_input',
      topic: query,
      results: [],
      liveSearch: false,
      message: 'Please specify a scheme name or farmer need.',
    };
  }

  const aliases = {
    pmfby: [
      'pmfby',
      'fasal bima',
      'crop insurance',
      'paddy insurance',
      'rice insurance',
      'crop loss',
      'damaged crop',
      'flood',
      'drought',
      'insurance premium',
      'farmer insurance',
      'natural disaster',
    ],
    tnau: [
      'tnau',
      'crop guidance',
      'farming advice',
      'agriculture advice',
      'crop disease',
      'pest management',
      'cultivation',
      'farming techniques',
      'agricultural research',
      'technical guidance',
    ],
  };

  const words = query
    .split(/[^a-z0-9]+/)
    .filter((word) => word.length > 1);

  const ranked = schemes
    .map((scheme) => {
      const name = String(scheme.name || '').toLowerCase();

      let keywords = [];

      if (
        name.includes('pradhan mantri fasal bima yojana') ||
        name.includes('pmfby')
      ) {
        keywords = aliases.pmfby;
      } else if (
        name.includes('tamil nadu agricultural university') ||
        name.includes('tnau')
      ) {
        keywords = aliases.tnau;
      }

      const searchableText = [
        scheme.name,
        scheme.summary,
        ...(scheme.checklist || []),
        ...keywords,
      ]
        .join(' ')
        .toLowerCase();

      let score = 0;

      for (const word of words) {
        if (searchableText.includes(word)) {
          score += word.length > 5 ? 2 : 1;
        }
      }

      if (
        /\b(insurance|pmfby|fasal bima|crop loss|paddy insurance|rice insurance)\b/.test(
          query,
        ) &&
        keywords === aliases.pmfby
      ) {
        score += 5;
      }

      return { scheme, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ scheme, score }) => ({
      name: scheme.name,
      summary: scheme.summary,
      checklist: scheme.checklist,
      url: scheme.url,
      source: scheme.source,
      relevanceScore: score,
      recordType: scheme.name
        .toLowerCase()
        .includes('fasal bima')
        ? 'scheme'
        : 'agricultural_resource',
    }));

  return {
    status: ranked.length > 0 ? 'scheme_information' : 'no_match',
    topic: query,
    results: ranked,
    source: 'KisanSetu local scheme information dataset',
    liveSearch: false,
    message:
      ranked.length > 0
        ? 'These are locally stored scheme or agricultural resource records, not a live government search. Verify eligibility, notified crops, deadlines and current rules with the official authority.'
        : 'No matching record was found in the local dataset. This does not mean that no government scheme is available. Check official government portals for current schemes.',
  };
}

// ==================================================
// GEMINI FUNCTION DECLARATIONS
// ==================================================

const tools = [
  {
    functionDeclarations: [
      {
        name: 'get_weather',
        description:
          'Fetch current weather-model conditions and a three-day forecast from Open-Meteo for supported Tamil Nadu locations. State the location, observation time, forecast dates, units and source. This is not an official IMD severe-weather warning.',
        parameters: {
          type: 'OBJECT',
          properties: {
            district: {
              type: 'STRING',
              description: 'Supported Tamil Nadu district or city name.',
            },
          },
          required: [],
        },
      },
      {
        name: 'compare_mandi_prices',
        description:
          'Retrieve reported CEDA/AGMARKNET Paddy (Common) prices for Thiruvarur and calculate gross value from modal prices and quantity. Always disclose the reporting date and stale-data warning. Never describe historical observations as guaranteed live prices.',
        parameters: {
          type: 'OBJECT',
          properties: {
            quantity_quintals: {
              type: 'NUMBER',
              description: 'Paddy quantity in quintals.',
            },
            district: {
              type: 'STRING',
              description:
                'District in Tamil Nadu. Verified CEDA integration currently supports Thiruvarur only.',
            },
          },
          required: [],
        },
      },
      {
        name: 'search_crop_guidance',
        description:
          'Find relevant general crop-care guidance from the local crop knowledge base. Use for questions about crop stages, irrigation, yellow leaves, suspected pests or diseases, and harvest preparation. Pass the crop and farmer concern in topic. Do not invent diagnoses or pesticide prescriptions.',
        parameters: {
          type: 'OBJECT',
          properties: {
            topic: {
              type: 'STRING',
              description:
                'Crop name, growth stage, symptoms, or farming problem.',
            },
          },
          required: ['topic'],
        },
      },
      {
        name: 'search_schemes',
        description:
          'Search locally stored agricultural scheme and resource records for the farmer’s need. This is not a live government search. Direct users to official authorities to verify eligibility, deadlines and current rules.',
        parameters: {
          type: 'OBJECT',
          properties: {
            topic: {
              type: 'STRING',
              description: 'Scheme name or farmer need.',
            },
          },
          required: ['topic'],
        },
      },
    ],
  },
];

// ==================================================
// TOOL EXECUTION DISPATCHER
// ==================================================

async function runTool(name, args = {}) {
  switch (name) {
    case 'get_weather':
      return getLiveWeather(args.district || 'Thiruvarur');

    case 'compare_mandi_prices':
      return getCedaPaddyPrices(
        args.quantity_quintals ?? 10,
        args.district || 'Thiruvarur',
      );

    case 'search_crop_guidance':
      return searchCropGuidance(args.topic || '');

    case 'search_schemes':
      return searchSchemes(args.topic || '');

    default:
      return {
        status: 'error',
        message: `Unknown tool: ${name}`,
      };
  }
}

// ==================================================
// API ROUTES
// ==================================================

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    app: 'KisanSetu AI',
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
    cedaConfigured: Boolean(process.env.CEDA_API_KEY),
    liveWeatherConfigured: true,
    cropGuidanceConfigured: Array.isArray(cropGuidance),
    schemesConfigured: Array.isArray(schemes),
  });
});

app.get('/api/weather', async (req, res) => {
  const result = await getLiveWeather(
    String(req.query.district || 'Thiruvarur'),
  );

  const statusCode =
    result.status === 'success'
      ? 200
      : result.status === 'unsupported_location'
        ? 400
        : 502;

  res.status(statusCode).json(result);
});

app.get('/api/demo-data', (_req, res) => {
  res.json({
    mode: 'demo',
    warning:
      'This endpoint contains starter/demo fixtures and should not be represented as live market or weather data.',
    mandiPrices,
    cropGuidance,
    schemes,
  });
});

// ==================================================
// CHAT ENDPOINT + GEMINI FUNCTION CALLING
// ==================================================

app.post('/api/chat', async (req, res) => {
  try {
    const {
      message,
      language = 'Tamil + English',
      history = [],
    } = req.body || {};

    if (typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({
        error: 'Please enter a question.',
      });
    }

    if (
      !process.env.GEMINI_API_KEY ||
      process.env.GEMINI_API_KEY === 'replace_with_your_key'
    ) {
      return res.status(503).json({
        error:
          'Gemini is not configured. The direct weather endpoint remains available at /api/weather.',
        toolsUsed: [],
      });
    }

    const languageInstruction =
      language === 'Tamil'
        ? 'Respond entirely in natural Tamil using Tamil script.'
        : language === 'English'
          ? 'Respond entirely in English.'
          : 'Respond in both Tamil and English. Present each key point in Tamil first, followed by its English translation.';

    const systemText = `
You are KisanSetu AI, an agricultural decision-support assistant for farmers in Tamil Nadu.

${languageInstruction}

TOOL SELECTION:
- Use get_weather for relevant weather questions.
- Use compare_mandi_prices for paddy market price questions.
- Use search_crop_guidance for crop-care, crop growth, irrigation, symptoms, pests, diseases and harvest questions.
- Use search_schemes for government agricultural scheme questions.
- Call the relevant tool when external or local tool data is needed.
- Use returned results, not assumptions.
- Never claim that a tool was used unless a function call actually occurred.

WEATHER:
- Data comes from Open-Meteo weather models.
- State location, observation time, dates, units and source.
- This is not an official IMD severe-weather warning.
- Never invent weather values.

MANDI PRICES:
- CEDA returns reported Paddy (Common) price observations for Thiruvarur.
- These observations are not guaranteed live prices.
- State the newest observation date and source.
- Highlight stale data and advise checking the market before selling.
- Gross value is modal price multiplied by quantity.
- Do not claim net proceeds without costs.
- Never invent prices or silently substitute demo prices.

CROP GUIDANCE:
- Results come from a local starter knowledge base and are not independently verified official recommendations.
- Give general educational guidance, not a certain diagnosis.
- Ask for more details if necessary.
- Never invent pesticide prescriptions or dosages.
- Refer serious or spreading crop problems to qualified agricultural extension staff.
- Do not claim image-based diagnosis unless image analysis is actually available.

GOVERNMENT SCHEMES:
- Results come from locally stored records, not a live or comprehensive government database.
- Clearly distinguish a scheme from an agricultural resource.
- Do not invent benefits, eligibility or deadlines.
- Direct farmers to the returned official URL and tell them to verify current eligibility, notified crops, enrollment dates and rules.
- If no matching record is found, explain that the local dataset may be incomplete.

Be transparent about sources, dates, uncertainty and whether data is historical, forecast or demo. Keep responses clear and practical.
`;

    const safeHistory = Array.isArray(history)
      ? history
          .filter(
            (item) =>
              item &&
              ['user', 'model'].includes(item.role) &&
              typeof item.text === 'string',
          )
          .slice(-8)
          .map((item) => ({
            role: item.role,
            parts: [{ text: item.text }],
          }))
      : [];

    const contents = [
      ...safeHistory,
      {
        role: 'user',
        parts: [{ text: message.trim() }],
      },
    ];

    const toolsUsed = [];
    let responseText = '';
    let completed = false;
    const maxRounds = 3;

    for (let turn = 0; turn < maxRounds; turn += 1) {
      const response = await fetch(GEMINI_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': process.env.GEMINI_API_KEY,
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: systemText }],
          },
          contents,
          tools,
          generationConfig: {
            thinkingConfig: {
              thinkingLevel: 'low',
            },
            maxOutputTokens: 1000,
          },
        }),
        signal: AbortSignal.timeout(25000),
      });

      const raw = await response.text();
      let payload;

      try {
        payload = JSON.parse(raw);
      } catch {
        return res.status(502).json({
          error: 'The AI provider returned an unreadable response.',
          toolsUsed,
        });
      }

      if (!response.ok) {
        const providerMessage =
          payload?.error?.message || `HTTP ${response.status}`;

        console.error(
          'Gemini API error:',
          response.status,
          providerMessage,
        );

        return res.status(502).json({
          error: providerMessage,
          toolsUsed,
        });
      }

      const candidate = payload.candidates?.[0]?.content;

      if (!candidate || !Array.isArray(candidate.parts)) {
        return res.status(502).json({
          error:
            'The AI provider returned no usable response. Please try again.',
          toolsUsed,
        });
      }

      const calls = candidate.parts.filter(
        (part) => part.functionCall?.name,
      );

      const texts = candidate.parts
        .filter((part) => typeof part.text === 'string')
        .map((part) => part.text);

      if (texts.length > 0) {
        responseText = texts.join('\n');
      }

      if (calls.length === 0) {
        completed = true;
        break;
      }

      // Preserve Gemini's function-call metadata.
      contents.push(candidate);

      const functionResponses = [];

      for (const part of calls) {
        const call = part.functionCall;

        const result = await runTool(call.name, call.args || {});

        toolsUsed.push({
          name: call.name,
          result,
        });

        const functionResponse = {
          name: call.name,
          response: { result },
        };

        if (call.id) {
          functionResponse.id = call.id;
        }

        functionResponses.push({ functionResponse });
      }

      contents.push({
        role: 'user',
        parts: functionResponses,
      });
    }

    if (!completed || !responseText.trim()) {
      return res.status(502).json({
        error:
          'The AI could not complete its answer within the allowed tool-call rounds. Please try again.',
        toolsUsed,
      });
    }

    return res.json({
      mode: 'ai',
      reply: responseText,
      toolsUsed,
    });
  } catch (error) {
    console.error(
      'Chat endpoint error:',
      error.name,
      error.message,
    );

    if (error.name === 'TimeoutError') {
      return res.status(504).json({
        error: 'The request took too long. Please try again shortly.',
      });
    }

    return res.status(500).json({
      error:
        'The server could not complete your request. Check the backend terminal.',
    });
  }
});

// ==================================================
// START SERVER
// ==================================================

const port = Number(process.env.PORT || 3001);

app.listen(port, () => {
  console.log(`KisanSetu API running at http://localhost:${port}`);
  console.log(
    `Gemini: ${process.env.GEMINI_API_KEY ? 'configured' : 'not configured'}`,
  );
  console.log(
    `CEDA: ${process.env.CEDA_API_KEY ? 'configured' : 'not configured'}`,
  );
  console.log('Live weather: Open-Meteo');
  console.log('Crop guidance: local starter knowledge base');
  console.log('Schemes: local scheme information dataset');
});
