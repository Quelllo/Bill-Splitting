# 🔴 TODO: Update USDC Token Addresses

## Quick Reference

Open `src/config/tokens.ts` and update these addresses with real Circle testnet USDC contracts.

### Where to Find Addresses
**Primary Source**: https://developers.circle.com/stablecoins/docs/usdc-on-test-networks

---

## Addresses to Update

### 1. Arc Testnet
```typescript
12345: '0x0000000000000000000000000000000000000000', // ⚠️ PLACEHOLDER
```
**Status**: ❌ Not configured (placeholder address)
**Action**: Get real address from Arc + Circle docs

---

### 2. Ethereum Sepolia
```typescript
11155111: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
```
**Status**: ⚠️ Needs verification
**Verify at**: https://sepolia.etherscan.io/address/0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238
**Check**: Symbol should be "USDC", decimals should be 6

---

### 3. Base Sepolia
```typescript
84532: '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
```
**Status**: ⚠️ Needs verification
**Verify at**: https://sepolia.basescan.org/address/0x036CbD53842c5426634e7929541eC2318f3dCF7e
**Check**: Symbol should be "USDC", decimals should be 6

---

### 4. Avalanche Fuji
```typescript
43113: '0x5425890298aed601595a70AB815c96711a31Bc65',
```
**Status**: ⚠️ Needs verification
**Verify at**: https://testnet.snowtrace.io/address/0x5425890298aed601595a70AB815c96711a31Bc65
**Check**: Symbol should be "USDC", decimals should be 6

---

### 5. Arbitrum Sepolia
```typescript
421614: '0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d',
```
**Status**: ⚠️ Needs verification
**Verify at**: https://sepolia.arbiscan.io/address/0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d
**Check**: Symbol should be "USDC", decimals should be 6

---

## Verification Checklist

For each address, verify:

- [ ] Address is from official Circle documentation
- [ ] Block explorer shows it's a valid contract
- [ ] Token symbol is exactly "USDC" (not USDC.e or other variants)
- [ ] Decimals are 6 (standard for USDC)
- [ ] Contract is verified on the explorer
- [ ] Address works with Circle's Bridge Kit / CCTP

---

## How to Test After Updating

1. Update address in `src/config/tokens.ts`
2. Restart dev server: `npm run dev`
3. Go to `/app` and connect wallet
4. Watch balance load for that network
5. If shows "—", check console for errors
6. Get testnet USDC from Circle faucet to test with real balance

---

## Circle Documentation Links

- **Main Testnet Docs**: https://developers.circle.com/stablecoins/docs/usdc-on-test-networks
- **CCTP Supported Chains**: https://developers.circle.com/stablecoins/docs/cctp-protocol-contract
- **Testnet Faucet**: https://faucet.circle.com

---

**Delete this file after all addresses are verified!**

