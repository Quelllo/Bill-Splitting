# USDC Balance Fetching Setup Guide

## ✅ What Was Added

### New Files

1. **`src/config/tokens.ts`**
   - USDC token addresses for all supported testnets
   - Contains PLACEHOLDER addresses that need to be updated
   - ERC-20 ABI for reading balances
   - Helper functions to check if USDC is configured

2. **`src/lib/usdc.ts`**
   - `getUSDCBalance()` - Fetch balance for one chain
   - `getUSDCBalances()` - Fetch balances across multiple chains (parallel)
   - `calculateTotalUSDC()` - Sum total USDC across all networks
   - Uses Viem for blockchain reads

3. **`src/hooks/useUSDCBalances.ts`**
   - React hook that automatically fetches balances when wallet connects
   - Returns balances, total, loading state, and errors
   - Auto-refetches when wallet address changes

### Updated Files

4. **`src/components/bridge/BalanceDisplay.tsx`**
   - Completely rewritten to show real USDC balances
   - Displays total USDC across all networks (highlighted)
   - Individual balance cards for each network
   - Loading states with spinner animations
   - Error handling with friendly messages
   - Link to Circle faucet for getting testnet USDC

---

## 🚀 How It Works

### 1. Balance Fetching Flow

```
User connects wallet
    ↓
useUSDCBalances hook triggers
    ↓
Fetches USDC balance from each network in parallel
    ↓
Uses Viem to call balanceOf() on USDC contracts
    ↓
Formats balances and calculates total
    ↓
Updates UI with real-time data
```

### 2. Key Functions

**`getUSDCBalance(address, chain)`**
- Reads balance from USDC contract on specified chain
- Handles decimal conversion (USDC uses 6 decimals)
- Returns formatted string like "100.50" or null on error

**`getUSDCBalances(address, chains)`**
- Fetches balances from multiple chains in parallel
- Returns map of chainId → balance
- Much faster than sequential fetching

**`calculateTotalUSDC(balances)`**
- Sums all balances across networks
- Ignores null values (errors or unconfigured)
- Returns formatted total with 2 decimal places

---

## 📝 Update USDC Contract Addresses

### Current Status
The addresses in `src/config/tokens.ts` are PLACEHOLDERS. Some may be correct, but you should verify all of them.

### Where to Find Real Addresses

Visit Circle's official documentation:
**https://developers.circle.com/stablecoins/docs/usdc-on-test-networks**

Look for:
- USDC Token Contract addresses
- Testnet deployments section
- Network-specific addresses

### How to Update

Open `src/config/tokens.ts` and replace addresses:

```typescript
export const USDC_ADDRESSES: Record<number, `0x${string}`> = {
  // Arc Testnet - UPDATE THIS!
  12345: '0x0000000000000000000000000000000000000000', // ⚠️ PLACEHOLDER
  
  // Ethereum Sepolia - Verify this address
  11155111: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
  
  // Base Sepolia - Verify this address
  84532: '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
  
  // Avalanche Fuji - Verify this address
  43113: '0x5425890298aed601595a70AB815c96711a31Bc65',
  
  // Arbitrum Sepolia - Verify this address
  421614: '0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d',
}
```

### Verification Steps

For each address you update:

1. **Check Circle docs** for the official testnet USDC address
2. **Verify on block explorer**:
   - Ethereum Sepolia: https://sepolia.etherscan.io/
   - Base Sepolia: https://sepolia.basescan.org/
   - Avalanche Fuji: https://testnet.snowtrace.io/
   - Arbitrum Sepolia: https://sepolia.arbiscan.io/
3. **Confirm the token symbol** is "USDC" and decimals are 6
4. **Paste the correct address** in `tokens.ts`

---

## 🎯 Features Implemented

### ✅ Real-Time Balance Fetching
- Automatically fetches when wallet connects
- Updates when wallet address changes
- Parallel fetching for fast loading

### ✅ Total Balance Display
- Prominent card showing total USDC across all networks
- Gradient background for visual emphasis
- Updates in real-time

### ✅ Per-Network Balances
- Individual cards for each supported network
- Shows network logo and name
- Displays balance with $ sign and 2 decimal places
- Indicates which networks don't have USDC configured

### ✅ Loading States
- Spinner animation while fetching
- "Loading..." text for each network
- Non-blocking - UI remains interactive

### ✅ Error Handling
- Red alert box if fetching fails
- Friendly error messages (no technical jargon)
- Graceful fallback - shows "—" for unavailable balances

### ✅ User-Friendly Copy
- "Total Across All Networks" instead of "Sum"
- "USDC address not configured" for missing addresses
- Help text with link to Circle faucet
- All text optimized for non-technical users

---

## 🧪 Testing the Integration

### 1. Connect Wallet
```bash
npm run dev
# Go to http://localhost:3000/app
# Click "Connect Wallet"
```

### 2. Watch Balances Load
- You should see loading spinners on each network card
- Balances will populate as they're fetched
- Total will update at the top

### 3. Get Testnet USDC
If all balances show $0.00:
1. Click the Circle faucet link in the help text
2. Visit https://faucet.circle.com
3. Request testnet USDC for your address
4. Wait a few seconds, then reload the page
5. Your new balance should appear!

### 4. Test Network Switching
- Use the Network Status component to switch chains
- Balances should remain accurate
- No refetching needed (already loaded)

### 5. Test Error States
- Disconnect wallet → should show "Connect your wallet" message
- Invalid RPC → should show error alert
- Missing USDC address → shows "USDC address not configured"

---

## 📊 What the UI Shows

### When Disconnected
```
┌─────────────────────────────┐
│ USDC Balances              │
├─────────────────────────────┤
│ 💡 Connect your wallet to  │
│    see your balances        │
└─────────────────────────────┘
```

### When Loading
```
┌─────────────────────────────┐
│ USDC Balances          ⟳   │
├─────────────────────────────┤
│ Total: $0.00 (loading...)   │
│                             │
│ ⟠ Ethereum  ⟳ Loading...   │
│ 🔵 Base      ⟳ Loading...   │
│ 🔺 Avalanche ⟳ Loading...   │
└─────────────────────────────┘
```

### When Loaded
```
┌─────────────────────────────┐
│ USDC Balances               │
├─────────────────────────────┤
│ Total Across All Networks   │
│ $245.80 USDC               │
│                             │
│ ⟠ Ethereum    $100.00      │
│ 🔵 Base        $50.50      │
│ 🔺 Avalanche   $75.30      │
│ 🔷 Arbitrum    $20.00      │
│ 🌐 Arc         —           │
│                             │
│ 💡 Need USDC? Visit faucet │
└─────────────────────────────┘
```

---

## 🔧 Code Structure

### Simple & Readable
The code is intentionally straightforward:

- **No complex state management** - Just React hooks
- **No caching layer** - Fetches on mount (can add later if needed)
- **Clear function names** - `getUSDCBalance`, not `fetchTokenData`
- **Lots of comments** - Every function explains what it does
- **Error handling** - Try/catch with friendly messages

### Where to Make Changes

**Update USDC addresses**: `src/config/tokens.ts`
**Change balance logic**: `src/lib/usdc.ts`
**Modify UI appearance**: `src/components/bridge/BalanceDisplay.tsx`
**Add auto-refresh**: `src/hooks/useUSDCBalances.ts` (add interval)

---

## 🐛 Troubleshooting

### All balances show "—"
- Check if USDC addresses in `tokens.ts` are correct
- Verify RPC URLs in `chains.ts` are accessible
- Open browser console for error logs

### Balance shows $0.00 but I have USDC
- Confirm you're on the correct network
- Check your wallet address on the block explorer
- Verify the USDC contract address is correct
- Make sure you have testnet USDC, not mainnet

### Loading never completes
- Check network connection
- RPC endpoint might be down - try a different one
- Check browser console for errors
- Try refreshing the page

### Balance is wrong amount
- Verify USDC decimals are 6 (check contract)
- Check if the contract address is actually USDC
- Some testnets might have multiple USDC versions

---

## ⏭️ Next Steps

After updating USDC addresses and verifying balances work:

1. ✅ Balances are fetched ← **YOU ARE HERE**
2. ⏳ Integrate Circle Bridge Kit for transfers
3. ⏳ Add Arc Network integration
4. ⏳ Implement transfer functionality in BridgeForm
5. ⏳ Add transfer history with localStorage
6. ⏳ Polish UI/UX for hackathon judging

---

## 📚 Resources

- [Circle USDC Testnet Docs](https://developers.circle.com/stablecoins/docs/usdc-on-test-networks)
- [Circle Testnet Faucet](https://faucet.circle.com)
- [Viem Documentation](https://viem.sh/)
- [ERC-20 Token Standard](https://ethereum.org/en/developers/docs/standards/tokens/erc-20/)

---

**Ready to test!** Connect your wallet and watch those balances load in real-time! 🚀

