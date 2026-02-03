// ANT Token Total Supply API
// Returns total supply for CoinMarketCap and CoinGecko

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Total supply is fixed at 1.2 billion ANT
  res.setHeader("Cache-Control", "public, max-age=3600");
  return res.status(200).json({
    total_supply: "1200000000",
    decimals: 18,
  });
}
