const CEDA_PRICES_URL =
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

export async function getCedaPaddyPrices(
  quantityQuintals = 10,
  district = 'Thiruvarur'
) {
  const source = 'CEDA Agri Market Data, Ashoka University';

  if (!process.env.CEDA_API_KEY) {
    return {
      status: 'unavailable',
      source,
      message: 'CEDA_API_KEY is missing from .env.',
      records: [],
    };
  }

  if (district.toLowerCase() !== 'thiruvarur') {
    return {
      status: 'unavailable',
      source,
      message:
        'The current price integration supports Thiruvarur district only.',
      records: [],
    };
  }

  const quantity = Number(quantityQuintals);

  if (!Number.isFinite(quantity) || quantity <= 0) {
    return {
      status: 'invalid_input',
      source,
      message: 'Quantity must be a positive number of quintals.',
      records: [],
    };
  }

  const today = new Date().toISOString().slice(0, 10);

  try {
    const response = await fetch(CEDA_PRICES_URL, {
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
      signal: AbortSignal.timeout(20000),
    });

    const text = await response.text();
    let payload;

    try {
      payload = JSON.parse(text);
    } catch {
      return {
        status: 'unavailable',
        source,
        message: 'CEDA returned an unreadable response.',
        records: [],
      };
    }

    if (!response.ok) {
      return {
        status: 'unavailable',
        source,
        message: `CEDA request failed with HTTP ${response.status}.`,
        records: [],
      };
    }

    const rows = payload?.output?.data;

    if (payload?.output?.type !== 'success' || !Array.isArray(rows)) {
      return {
        status: 'no_data',
        source,
        message: payload?.output?.message || 'No price records returned.',
        records: [],
      };
    }

    const normalized = rows
      .map((row) => ({
        marketId: Number(row.market_id),
        market:
          MARKET_NAMES[Number(row.market_id)] ||
          `Market ${row.market_id}`,
        reportedDate: String(row.date || '').slice(0, 10),
        minPrice: Number(row.min_price),
        maxPrice: Number(row.max_price),
        modalPrice: Number(row.modal_price),
      }))
      .filter(
        (row) =>
          row.reportedDate &&
          Number.isFinite(row.modalPrice) &&
          row.modalPrice > 0
      );

    if (normalized.length === 0) {
      return {
        status: 'no_data',
        source,
        message: 'No usable paddy-price observations were returned.',
        records: [],
      };
    }

    // Keep the latest reported observation for each market.
    const latestByMarket = new Map();

    for (const row of normalized) {
      const previous = latestByMarket.get(row.marketId);

      if (
        !previous ||
        row.reportedDate > previous.reportedDate
      ) {
        latestByMarket.set(row.marketId, row);
      }
    }

    const records = [...latestByMarket.values()]
      .sort((a, b) => b.reportedDate.localeCompare(a.reportedDate))
      .map((row) => ({
        ...row,
        grossValueRs: Math.round(row.modalPrice * quantity),
      }));

    const newestDate = records[0].reportedDate;
    const ageDays = Math.max(
      0,
      Math.floor(
        (Date.parse(today) - Date.parse(newestDate)) / 86400000
      )
    );

    return {
      status: 'success',
      source,
      commodity: 'Paddy (Common)',
      district: 'Thiruvarur',
      quantityQuintals: quantity,
      retrievedAt: new Date().toISOString(),
      observationsReturned: normalized.length,
      newestObservationDate: newestDate,
      observationAgeDays: ageDays,
      freshness: ageDays > 90 ? 'stale' : 'within_90_days',
      warning:
        ageDays > 90
          ? `The newest observation is ${newestDate}, ${ageDays} days old. These are historical prices, not current market quotes.`
          : `The newest observation is dated ${newestDate}. Verify current prices before selling.`,
      records,
    };
  } catch (error) {
    return {
      status: 'unavailable',
      source,
      message:
        error.name === 'TimeoutError'
          ? 'CEDA request timed out. Please try again later.'
          : 'Could not retrieve CEDA price data.',
      records: [],
    };
  }
}