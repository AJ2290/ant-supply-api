// ANT Token Circulating Supply API
// Returns circulating supply for CoinMarketCap and CoinGecko

const ARBITRUM_RPC = "https://arb1.arbitrum.io/rpc";

const ANT_CONTRACT = "0xa78d8321B20c4Ef90eCd72f2588AA985A4BDb684";
const TOTAL_SUPPLY = BigInt("1200000000000000000000000000"); // 1.2B with 18 decimals
const DECIMALS = 18;

// Wallets excluded from circulating supply
const EXCLUDED_WALLETS = [
  {
    name: "Network Emissions",
    address: "0xdA4f3aF146f86850DE8e0D6FaE6EEe051Ad0AA44",
  },
  {
    name: "MAID Airdrop Wallet",
    address: "0x675D39cdCEA31ba8313565b03D684A3bbe183a1a",
  },
  {
    name: "Foundation Cold Wallet",
    address: "0x4f7B7fd0533d06D2ABFad07eAe57C9CE8E92B670",
  },
  {
    name: "Foundation Hot Wallet",
    address: "0xd10A556E6A5111b5D4Dd5Ae06761d41F6CE1D499",
  },
  {
    name: "Shareholder NFT Contract",
    address: "0x1617C551E1d63e693b0F6B42FE5352a79f2F9961",
  },
];

// Simple in-memory cache
let cache = {
  data: null,
  timestamp: 0,
};
const CACHE_DURATION = 60 * 1000; // 1 minute

// Query wallet balance using eth_call
async function getBalance(walletAddress) {
  // ERC20 balanceOf(address) function signature
  const data = "0x70a08231000000000000000000000000" + walletAddress.slice(2).toLowerCase();

  const response = await fetch(ARBITRUM_RPC, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: "eth_call",
      params: [
        {
          to: ANT_CONTRACT,
          data: data,
        },
        "latest",
      ],
      id: 1,
    }),
  });

  const result = await response.json();
  if (result.error) {
    throw new Error(`RPC error: ${result.error.message}`);
  }

  return BigInt(result.result);
}

// Format BigInt to human-readable number (without decimals)
function formatSupply(value) {
  return (value / BigInt(10 ** DECIMALS)).toString();
}

async function calculateCirculatingSupply() {
  // Check cache
  const now = Date.now();
  if (cache.data && now - cache.timestamp < CACHE_DURATION) {
    return cache.data;
  }

  // Fetch all excluded wallet balances
  let totalExcluded = BigInt(0);

  for (const wallet of EXCLUDED_WALLETS) {
    const balance = await getBalance(wallet.address);
    totalExcluded += balance;
  }

  const circulatingSupply = TOTAL_SUPPLY - totalExcluded;
  const formattedSupply = formatSupply(circulatingSupply);

  // Update cache
  cache = {
    data: formattedSupply,
    timestamp: now,
  };

  return formattedSupply;
}

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Content-Type", "text/plain");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    return res.status(405).send("Method not allowed");
  }

  try {
    const circulatingSupply = await calculateCirculatingSupply();
    res.setHeader("Cache-Control", "public, max-age=60");
    return res.status(200).send(circulatingSupply);
  } catch (error) {
    console.error("Error calculating circulating supply:", error);
    return res.status(500).send("Error calculating circulating supply");
  }
}
