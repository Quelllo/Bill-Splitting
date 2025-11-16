# 🔴 TODO: Verify Circle Bridge Kit Configuration

## Quick Checklist

Before using the bridge, verify these values from Circle's official documentation:
**https://developers.circle.com/stablecoins/docs/cctp-protocol-contract**

---

## 1. Circle Domain IDs

Open `src/config/bridgeKit.ts` and verify `CIRCLE_DOMAIN_IDS`:

```typescript
export const CIRCLE_DOMAIN_IDS: Record<number, number> = {
  11155111: 0, // Ethereum Sepolia - ⚠️ VERIFY
  43113: 1,    // Avalanche Fuji - ⚠️ VERIFY
  421614: 3,   // Arbitrum Sepolia - ⚠️ VERIFY
  84532: 6,    // Base Sepolia - ⚠️ VERIFY
}
```

**Action:** Cross-reference with Circle's domain ID table
**Link:** https://developers.circle.com/stablecoins/docs/cctp-protocol-contract#domain-ids

---

## 2. TokenMessenger Contract Addresses

Verify `TOKEN_MESSENGER_ADDRESSES` in same file:

| Chain | Chain ID | Address | Status |
|-------|----------|---------|--------|
| Ethereum Sepolia | 11155111 | `0x9f3B8679c73C2Fef8b59B4f3444d4e156fb70AA5` | ⚠️ Verify |
| Avalanche Fuji | 43113 | `0xeb08f243e5d3fcff26a9e38ae5520a669f4019d0` | ⚠️ Verify |
| Arbitrum Sepolia | 421614 | `0x9f3B8679c73C2Fef8b59B4f3444d4e156fb70AA5` | ⚠️ Verify |
| Base Sepolia | 84532 | `0x9f3B8679c73C2Fef8b59B4f3444d4e156fb70AA5` | ⚠️ Verify |

**Action:** Get official addresses from Circle docs
**Link:** https://developers.circle.com/stablecoins/docs/cctp-protocol-contract

---

## 3. MessageTransmitter Contract Addresses

Verify `MESSAGE_TRANSMITTER_ADDRESSES` in same file:

| Chain | Chain ID | Address | Status |
|-------|----------|---------|--------|
| Ethereum Sepolia | 11155111 | `0x7865fAfC2db2093669d92c0F33AeEF291086BEFD` | ⚠️ Verify |
| Avalanche Fuji | 43113 | `0xa9fb1b3009dcb79e2fe346c16a604b8fa8ae0a79` | ⚠️ Verify |
| Arbitrum Sepolia | 421614 | `0xaCF1ceeF35caAc005e15888dDb8A3515C41B4872` | ⚠️ Verify |
| Base Sepolia | 84532 | `0x7865fAfC2db2093669d92c0F33AeEF291086BEFD` | ⚠️ Verify |

**Action:** Get official addresses from Circle docs
**Link:** https://developers.circle.com/stablecoins/docs/cctp-protocol-contract

---

## 4. Arc Testnet Configuration

Once Arc testnet is available, add to `bridgeKit.ts`:

```typescript
// In CIRCLE_DOMAIN_IDS
12345: ??, // TODO: Get Arc domain ID from Circle/Arc

// In TOKEN_MESSENGER_ADDRESSES  
12345: '0x...', // TODO: Get Arc TokenMessenger address

// In MESSAGE_TRANSMITTER_ADDRESSES
12345: '0x...', // TODO: Get Arc MessageTransmitter address

// In BRIDGE_RPC_URLS
12345: 'https://rpc.arc-testnet...', // TODO: Get Arc RPC URL
```

---

## 5. USDC Token Addresses

Also verify in `src/config/tokens.ts`:

Already listed in `USDC_ADDRESSES_TODO.md` - make sure those are correct too!

---

## How to Verify Each Address

### For Each Contract Address:

1. **Open block explorer for that chain**
2. **Search for the contract address**
3. **Verify it's actually the correct contract:**
   - Check contract name matches
   - Verify it's from Circle
   - Check it's verified on explorer
   - Look at recent transactions

### Block Explorers:
- Ethereum Sepolia: https://sepolia.etherscan.io
- Avalanche Fuji: https://testnet.snowtrace.io
- Arbitrum Sepolia: https://sepolia.arbiscan.io
- Base Sepolia: https://sepolia.basescan.org

---

## Testing After Configuration

1. Update all addresses
2. Restart dev server: `npm run dev`
3. Test with SMALL amounts first (1-2 USDC)
4. Try route: Ethereum Sepolia → Base Sepolia
5. Wait 15-20 minutes for completion
6. Verify USDC arrived on destination

---

## 🚨 IMPORTANT

- **Always verify with official Circle docs**
- **Test with small amounts first**
- **Wrong addresses = lost funds** (on mainnet, testnet is fine)
- **Double-check everything before going to mainnet**

---

**Delete this file after all addresses are verified!**

