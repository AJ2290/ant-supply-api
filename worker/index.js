// ANT Token Supply API — Cloudflare Worker
// Port of the Vercel functions in /api. Same endpoints, same response
// formats: total-supply and circulating-supply are plain-text numbers
// (what CoinMarketCap/CoinGecko poll), health and supply are JSON.

const ARBITRUM_RPC = "https://arb1.arbitrum.io/rpc";

const ANT_CONTRACT = "0xa78d8321B20c4Ef90eCd72f2588AA985A4BDb684";
const TOTAL_SUPPLY = BigInt("1200000000000000000000000000"); // 1.2B with 18 decimals
const DECIMALS = 18;

// Wallets excluded from circulating supply
const EXCLUDED_WALLETS = [
  {
    name: "Network Emissions",
    address: "0xdA4f3aF146f86850DE8e0D6FaE6EEe051Ad0AA44",
    purpose: "Network rewards and emissions for node operators",
  },
  {
    name: "MAID Airdrop Wallet",
    address: "0x675D39cdCEA31ba8313565b03D684A3bbe183a1a",
    purpose: "Tokens for MAID token holders airdrop",
  },
  {
    name: "Foundation Cold Wallet",
    address: "0x4f7B7fd0533d06D2ABFad07eAe57C9CE8E92B670",
    purpose: "Foundation treasury and long-term reserves",
  },
  {
    name: "Foundation Hot Wallet",
    address: "0xd10A556E6A5111b5D4Dd5Ae06761d41F6CE1D499",
    purpose: "Foundation operational wallet",
  },
  {
    name: "Shareholder NFT Contract",
    address: "0x1617C551E1d63e693b0F6B42FE5352a79f2F9961",
    purpose: "Tokens locked in Shareholder NFT smart contract",
  },
];

// In-memory caches persist per Worker isolate, mirroring the warm-lambda
// caches in the Vercel version
const CACHE_DURATION = 60 * 1000; // 1 minute
let circulatingCache = { data: null, timestamp: 0 };
let detailedCache = { data: null, timestamp: 0 };

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

// Format BigInt to full decimal representation
function formatWithDecimals(value) {
  const str = value.toString().padStart(DECIMALS + 1, "0");
  const intPart = str.slice(0, -DECIMALS) || "0";
  const decPart = str.slice(-DECIMALS);
  return `${intPart}.${decPart}`;
}

async function calculateCirculatingSupply() {
  const now = Date.now();
  if (circulatingCache.data && now - circulatingCache.timestamp < CACHE_DURATION) {
    return circulatingCache.data;
  }

  let totalExcluded = BigInt(0);
  for (const wallet of EXCLUDED_WALLETS) {
    const balance = await getBalance(wallet.address);
    totalExcluded += balance;
  }

  const circulatingSupply = TOTAL_SUPPLY - totalExcluded;
  const formattedSupply = formatSupply(circulatingSupply);

  circulatingCache = { data: formattedSupply, timestamp: now };
  return formattedSupply;
}

async function getDetailedSupply() {
  const now = Date.now();
  if (detailedCache.data && now - detailedCache.timestamp < CACHE_DURATION) {
    return detailedCache.data;
  }

  let totalExcluded = BigInt(0);
  const walletDetails = [];

  for (const wallet of EXCLUDED_WALLETS) {
    const balance = await getBalance(wallet.address);
    totalExcluded += balance;

    walletDetails.push({
      name: wallet.name,
      address: wallet.address,
      purpose: wallet.purpose,
      balance: formatSupply(balance),
      balance_with_decimals: formatWithDecimals(balance),
    });
  }

  const circulatingSupply = TOTAL_SUPPLY - totalExcluded;

  const data = {
    total_supply: formatSupply(TOTAL_SUPPLY),
    circulating_supply: formatSupply(circulatingSupply),
    total_excluded: formatSupply(totalExcluded),
    excluded_wallets: walletDetails,
    timestamp: new Date().toISOString(),
    decimals: DECIMALS,
    token: {
      name: "Autonomi Network Token",
      symbol: "ANT",
      contract: ANT_CONTRACT,
      blockchain: "Arbitrum One",
    },
  };

  detailedCache = { data: data, timestamp: now };
  return data;
}

const TEXT_CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Content-Type": "text/plain; charset=utf-8",
};

function textResponse(body, status, extraHeaders = {}) {
  return new Response(body, {
    status,
    headers: { ...TEXT_CORS_HEADERS, ...extraHeaders },
  });
}

function jsonResponse(body, status, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json; charset=utf-8",
      ...extraHeaders,
    },
  });
}

async function handleHealth() {
  return jsonResponse(
    {
      status: "healthy",
      service: "ANT Supply API",
      timestamp: new Date().toISOString(),
    },
    200
  );
}

async function handleTotalSupply(request) {
  if (request.method === "OPTIONS") {
    return textResponse(null, 200);
  }
  if (request.method !== "GET") {
    return textResponse("Method not allowed", 405);
  }
  return textResponse("1200000000", 200, { "Cache-Control": "public, max-age=3600" });
}

async function handleCirculatingSupply(request) {
  if (request.method === "OPTIONS") {
    return textResponse(null, 200);
  }
  if (request.method !== "GET") {
    return textResponse("Method not allowed", 405);
  }

  try {
    const circulatingSupply = await calculateCirculatingSupply();
    return textResponse(circulatingSupply, 200, { "Cache-Control": "public, max-age=60" });
  } catch (error) {
    console.error("Error calculating circulating supply:", error);
    return textResponse("Error calculating circulating supply", 500);
  }
}

async function handleSupply(request) {
  const corsHeaders = {
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (request.method === "OPTIONS") {
    return jsonResponse(null, 200, corsHeaders);
  }
  if (request.method !== "GET") {
    return jsonResponse({ error: "Method not allowed" }, 405, corsHeaders);
  }

  try {
    const data = await getDetailedSupply();
    return jsonResponse(data, 200, { ...corsHeaders, "Cache-Control": "public, max-age=60" });
  } catch (error) {
    console.error("Error fetching supply details:", error);
    return jsonResponse(
      { error: "Failed to fetch supply details", details: error.message },
      500,
      corsHeaders
    );
  }
}

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, "") || "/";

    switch (path) {
      case "/": // vercel.json routed / to the health check
      case "/api/health":
        return handleHealth();
      case "/api/total-supply":
        return handleTotalSupply(request);
      case "/api/circulating-supply":
        return handleCirculatingSupply(request);
      case "/api/supply":
        return handleSupply(request);
      default:
        return textResponse("Not found", 404);
    }
  },
};
