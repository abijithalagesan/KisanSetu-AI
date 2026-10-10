// Demo market records only. Never present these as live prices.
export const mandiPrices = [
  {
    market: "Thiruvarur",
    commodity: "Paddy",
    variety: "Common",
    modalPrice: 2250,
    unit: "quintal",
    date: "2026-10-09",
    source: "Synthetic demo fixture"
  },
  {
    market: "Thanjavur",
    commodity: "Paddy",
    variety: "Common",
    modalPrice: 2310,
    unit: "quintal",
    date: "2026-10-09",
    source: "Synthetic demo fixture"
  },
  {
    market: "Nagapattinam",
    commodity: "Paddy",
    variety: "Common",
    modalPrice: 2190,
    unit: "quintal",
    date: "2026-10-09",
    source: "Synthetic demo fixture"
  }
];

// Local starter knowledge base.
// General educational guidance, NOT verified official recommendations.
export const cropGuidance = [
  {
    crop: "paddy",
    stage: "seedling",
    keywords: ["seedling", "nursery", "transplanting", "young plant"],
    title: "Paddy seedling care",
    advice:
      "Inspect seedlings regularly for uneven growth, discoloration, and pest damage. Maintain water according to the crop stage and locally recommended cultivation practice. Check seedling health before transplanting.",
    source: "KisanSetu local starter knowledge base",
    verified: false
  },
  {
    crop: "paddy",
    stage: "vegetative",
    keywords: ["vegetative", "tillering", "growth", "growing"],
    title: "Paddy vegetative growth",
    advice:
      "Monitor tillering, weed pressure, soil moisture, and plant colour. Follow locally recommended nutrient and water management practices. Do not apply additional fertilizer based only on leaf colour; inspect the field and soil conditions first.",
    source: "KisanSetu local starter knowledge base",
    verified: false
  },
  {
    crop: "paddy",
    stage: "irrigation",
    keywords: ["water", "irrigation", "dry", "drought", "moisture"],
    title: "Paddy water management",
    advice:
      "Check field moisture, soil type, crop stage, and water availability before changing irrigation. Avoid assuming that continuous deep flooding is always necessary. Follow locally recommended irrigation guidance, especially around sensitive growth stages.",
    source: "KisanSetu local starter knowledge base",
    verified: false
  },
  {
    crop: "paddy",
    stage: "yellow leaves",
    keywords: ["yellow", "yellowing", "pale", "discoloration", "leaves"],
    title: "Paddy leaves turning yellow",
    advice:
      "Yellowing can have several causes, including nutrient problems, water stress, root damage, or disease. Check whether the symptoms affect older or newer leaves, whether they occur in patches, and whether roots or stems show damage. Do not diagnose a nutrient deficiency or apply fertilizer or pesticide based on colour alone. Seek local agricultural advice if symptoms spread.",
    source: "KisanSetu local starter knowledge base",
    verified: false
  },
  {
    crop: "paddy",
    stage: "pest",
    keywords: ["pest", "insect", "stem borer", "leaf folder", "damage"],
    title: "Paddy pest investigation",
    advice:
      "Inspect affected plants and look for visible insects, feeding marks, damaged stems, or folded leaves. Record the affected area and crop stage. Confirm the pest and follow locally approved integrated pest management guidance before considering any pesticide.",
    source: "KisanSetu local starter knowledge base",
    verified: false
  },
  {
    crop: "paddy",
    stage: "disease",
    keywords: ["disease", "spots", "blast", "lesion", "fungus", "infection"],
    title: "Paddy disease investigation",
    advice:
      "Photograph affected leaves, stems, and the whole plant. Note when symptoms began and how quickly they are spreading. Different diseases and environmental problems can look similar, so obtain a reliable diagnosis before using fungicides or other treatments.",
    source: "KisanSetu local starter knowledge base",
    verified: false
  },
  {
    crop: "paddy",
    stage: "near harvest",
    keywords: ["harvest", "maturity", "ripe", "grain", "cutting"],
    title: "Pre-harvest planning",
    advice:
      "Assess crop maturity and grain condition, check the latest local weather forecast, and prepare a dry storage area. Coordinate harvesting and drying based on crop condition and local agricultural advice. Do not make a harvest decision from a forecast alone.",
    source: "KisanSetu local starter knowledge base",
    verified: false
  },
  {
    crop: "general",
    stage: "unknown crop",
    keywords: ["crop", "plant", "farming", "agriculture"],
    title: "General crop problem assessment",
    advice:
      "Identify the crop and variety, its growth stage, the location, when the problem began, and which plant parts are affected. Photos and recent irrigation or fertilizer details can help an agricultural expert assess the issue. Avoid applying chemicals before the problem is identified.",
    source: "KisanSetu local starter knowledge base",
    verified: false
  }
];

export const schemes = [
  {
    name: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
    summary:
      "A crop-insurance scheme. Availability, notified crops, enrollment windows, documents and rules can vary by season and location.",
    checklist: [
      "Confirm the current season and notified crop for your area",
      "Check the official portal for current enrollment dates and requirements",
      "Keep land/cultivation and identity documents ready as specified by the official process"
    ],
    url: "https://pmfby.gov.in/",
    source: "Official scheme portal; confirm current details"
  },
  {
    name: "Tamil Nadu Agricultural University resources",
    summary:
      "Agricultural extension and crop guidance resources. Use the official site to find current crop-specific material.",
    checklist: [
      "Choose the crop and growth stage",
      "Check the publication date and local applicability",
      "Contact local extension support for uncertain or high-risk cases"
    ],
    url: "https://tnau.ac.in/",
    source: "Official university website; verify current guidance"
  }
];

export function getWeatherDemo(district) {
  return {
    district: district || "Thiruvarur",
    status: "DEMO ONLY — not a live forecast",
    summary:
      "Weather API is not connected in this demo function. Check the official IMD forecast before making a harvest or spraying decision.",
    source: "India Meteorological Department",
    url: "https://mausam.imd.gov.in/"
  };
}

export function compareMarkets(quantityQuintals = 10, transportCosts = {}) {
  const quantity = Number(quantityQuintals);

  if (!Number.isFinite(quantity) || quantity <= 0 || quantity > 100000) {
    throw new Error("Quantity must be a positive number of quintals.");
  }

  return mandiPrices
    .map((row) => {
      const cost = Number(
        transportCosts[row.market] ??
          (row.market === "Thiruvarur"
            ? 150
            : row.market === "Thanjavur"
              ? 350
              : 450)
      );

      return {
        ...row,
        quantityQuintals: quantity,
        estimatedGross: quantity * row.modalPrice,
        estimatedTransportCost: cost,
        estimatedNet: quantity * row.modalPrice - cost,
        warning:
          "Synthetic demo prices and assumed transport costs. Not for real selling decisions."
      };
    })
    .sort((a, b) => b.estimatedNet - a.estimatedNet);
}