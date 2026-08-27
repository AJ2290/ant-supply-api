# ANT Supply API

Public supply data for the Autonomi Network Token (ANT), served at **https://api.autonomi.com**. CoinMarketCap and CoinGecko poll the two plain-text endpoints below; anything may read the JSON ones.

Runs as a Cloudflare Worker named `api` (`worker/index.js`) in the Autonomi Cloudflare account. **This repository is the source of truth** — see [How this is deployed](#how-this-is-deployed).

**Stale-over-error:** if the Arbitrum RPC is unavailable, the supply endpoints serve the last good figure (from in-memory or Cache API fallback) with an `X-Stale: true` header instead of a 500 — a slightly stale number beats an error for CMC/CoinGecko. A 500 only occurs if no figure has ever been computed.

## Endpoint contract

| Endpoint | Content type | Returns |
|----------|--------------|---------|
| `GET /` | `application/json` | Machine-readable index of everything this host serves |
| `GET /api/health` | `application/json` | `{"status":"healthy","service":"ANT Supply API","timestamp":"<ISO>"}` |
| `GET /api/total-supply` | `text/plain` | **Bare integer string**, e.g. `1200000000` |
| `GET /api/circulating-supply` | `text/plain` | **Bare integer string**, e.g. `342278929` |
| `GET /api/supply` | `application/json` | Detailed breakdown (see below) |

The two plain-text endpoints return a bare number with no JSON wrapper — this is the format CoinMarketCap and CoinGecko require and **must not change**. All endpoints send `Access-Control-Allow-Origin: *`. Supply endpoints accept `GET`/`OPTIONS` only (405 otherwise, including `HEAD`).

### Circulating supply definition

`circulating = 1,200,000,000 − Σ(excluded wallet balances)`, read live from the ANT contract on Arbitrum One (`0xa78d8321B20c4Ef90eCd72f2588AA985A4BDb684`) via the public RPC, cached for 60 seconds. Excluded wallets:

1. **Network Emissions** — `0xdA4f3aF146f86850DE8e0D6FaE6EEe051Ad0AA44`
2. **MAID Airdrop Wallet** — `0x675D39cdCEA31ba8313565b03D684A3bbe183a1a`
3. **Foundation Cold Wallet** — `0x4f7B7fd0533d06D2ABFad07eAe57C9CE8E92B670`
4. **Foundation Hot Wallet** — `0xd10A556E6A5111b5D4Dd5Ae06761d41F6CE1D499`
5. **Shareholder NFT Contract** — `0x1617C551E1d63e693b0F6B42FE5352a79f2F9961`

Changing this list is a change to the published circulating supply figure — treat it as a reviewed change (PR), and mirror any change in this README.

### `/api/supply` response shape

```json
{
  "total_supply": "1200000000",
  "circulating_supply": "342278929",
  "total_excluded": "857721070",
  "excluded_wallets": [
    { "name": "...", "address": "0x...", "purpose": "...", "balance": "...", "balance_with_decimals": "..." }
  ],
  "timestamp": "<ISO>",
  "decimals": 18,
  "token": { "name": "Autonomi Network Token", "symbol": "ANT", "contract": "0x...", "blockchain": "Arbitrum One" }
}
```

## How this is deployed

- **Config as code.** Worker code, routes, and settings live in this repo (`wrangler.jsonc`). The Cloudflare dashboard is for looking, not editing — dashboard changes are invisible to git and overwritten by the next deploy.
- **Deploys run from GitHub Actions** (`.github/workflows/deploy.yml`) on every merge to `main`, using a scoped Cloudflare API token stored as the repo secret `CLOUDFLARE_API_TOKEN`. No laptop deploys, no personal credentials.
- **Staging**: every deploy also serves at https://api.autonomi.workers.dev (note: `workers.dev` sits behind Cloudflare bot protection and may 403 some non-browser user agents; the production hostname is the contract). CI also runs a public-contract test against `api.autonomi.com`, including automation user-agents, so a zone bot-protection change that would block machine clients fails the build.
- **Production domain** (`api.autonomi.com`) is declared in `wrangler.jsonc` — enabling/changing it happens via a reviewed commit.

## Secrets

None. The Worker reads a public RPC endpoint and holds no credentials. If a secret is ever added, set it via `wrangler secret put` / Actions secrets and document its **name only** here.

## Local development

```bash
npx wrangler dev          # local simulator on http://localhost:8787
```

## Legacy

`/api/*.js` are the original Vercel serverless functions this Worker replaced (identical behaviour, verified byte-for-byte at migration). They are kept for reference until the Vercel project is retired, then removed.
