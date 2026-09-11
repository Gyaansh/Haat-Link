/**
 * mockData.js — retained ONLY for isolated price chart history data.
 *
 * PRICE CHART EXCEPTION (documented):
 * The 7-day price history arrays below are intentionally hard-coded illustrative
 * data. Building a real historical price database is out of scope for this
 * SIH prototype phase. These arrays are isolated here so they can be connected
 * to a MongoDB historical price collection in the future without touching any
 * other application code.
 *
 * ALL OTHER application/business data (crops, buyers, markets, deals,
 * requirements, offers, notifications) comes from MongoDB via the backend API.
 * Do NOT add new business data arrays to this file.
 */

export const chartHistory = {
  Onion: [
    ['Monday', 2280],
    ['Tuesday', 2320],
    ['Wednesday', 2350],
    ['Thursday', 2410],
    ['Friday', 2420],
    ['Saturday', 2450],
    ['Sunday', 2480],
  ],
  Tomato: [
    ['Monday', 1710],
    ['Tuesday', 1735],
    ['Wednesday', 1750],
    ['Thursday', 1780],
    ['Friday', 1805],
    ['Saturday', 1820],
    ['Sunday', 1850],
  ],
  Potato: [
    ['Monday', 2010],
    ['Tuesday', 1990],
    ['Wednesday', 1980],
    ['Thursday', 1975],
    ['Friday', 1960],
    ['Saturday', 1955],
    ['Sunday', 1950],
  ],
};
