# ANT Token Supply API

Public API for Autonomi Network Token (ANT) supply data, designed for CoinMarketCap and CoinGecko integration.

## Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/health` | Health check |
| `GET /api/total-supply` | Returns total supply (1,200,000,000 ANT) |
| `GET /api/circulating-supply` | Returns circulating supply (total minus excluded wallets) |
| `GET /api/supply` | Returns detailed breakdown with all wallet balances |

## Response Format

All endpoints return live data from the Arbitrum blockchain. Values shown below are format examples only.

### `/api/total-supply`
```json
{
  "total_supply": "<total_supply_value>",
  "decimals": 18
}
```

### `/api/circulating-supply`
```json
{
  "circulating_supply": "<calculated_circulating_supply>",
  "decimals": 18
}
```

### `/api/supply`
```json
{
  "total_supply": "<total_supply_value>",
  "circulating_supply": "<calculated_circulating_supply>",
  "total_excluded": "<sum_of_excluded_wallets>",
  "excluded_wallets": [
    {
      "name": "Network Emissions",
      "address": "0xdA4f3aF146f86850DE8e0D6FaE6EEe051Ad0AA44",
      "purpose": "Network rewards and emissions for node operators",
      "balance": "<live_balance>",
      "balance_with_decimals": "<live_balance_with_decimals>"
    }
  ],
  "timestamp": "<iso_timestamp>",
  "decimals": 18,
  "token": {
    "name": "Autonomi Network Token",
    "symbol": "ANT",
    "contract": "0xa78d8321B20c4Ef90eCd72f2588AA985A4BDb684",
    "blockchain": "Arbitrum One"
  }
}
```

## Excluded Wallets

These wallets are subtracted from total supply to calculate circulating supply:

1. **Network Emissions** - `0xdA4f3aF146f86850DE8e0D6FaE6EEe051Ad0AA44`
2. **MAID Airdrop Wallet** - `0x675D39cdCEA31ba8313565b03D684A3bbe183a1a`
3. **Foundation Cold Wallet** - `0x4f7B7fd0533d06D2ABFad07eAe57C9CE8E92B670`
4. **Foundation Hot Wallet** - `0xd10A556E6A5111b5D4Dd5Ae06761d41F6CE1D499`
5. **Shareholder NFT Contract** - `0x1617C551E1d63e693b0F6B42FE5352a79f2F9961`

## Technical Details

- Data is cached for 1 minute to reduce RPC calls
- Uses Arbitrum public RPC endpoint
- All supply values returned as integer strings (no decimals)
- CORS enabled for browser access

## License

MIT
