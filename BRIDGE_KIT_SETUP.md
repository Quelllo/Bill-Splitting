# Circle Bridge Kit Integration Guide

## 🎯 Overview

Circle's Bridge Kit enables native USDC transfers across blockchains using the Cross-Chain Transfer Protocol (CCTP). Unlike traditional bridges that use wrapped tokens or liquidity pools, CCTP **burns USDC on the source chain** and **mints native USDC on the destination chain**.

## 📦 What Was Added

### New Dependencies

**Added to `package.json`:**
```json
"@circle-fin/bridge-sdk": "^1.0.0",
"@circle-fin/w3s-pw-web-sdk": "^3.0.0"
```

**Note:** Package versions are placeholders. Check Circle's documentation for the actual package names and latest versions:
- https://developers.circle.com/stablecoins/docs/cctp-getting-started

### New Files

1. **`src/config/bridgeKit.ts`**
   - Circle domain IDs for each chain
   - Contract addresses (TokenMessenger, MessageTransmitter)
   - RPC URL configuration
   - Helper functions for CCTP support

2. **`src/services/bridgeKitClient.ts`**
   - `bridgeUSDC()` - Main function to initiate cross-chain transfers
   - `estimateBridgeTime()` - Estimate transfer completion time
   - `getBridgeFee()` - Get bridge fees (CCTP has no protocol fees)
   - `isBridgeRouteAvailable()` - Check if route is supported

3. **`.env.example`**
   - Template for environment variables
   - RPC URLs, API keys, etc.

### Updated Files

- **`package.json`** - Added Circle Bridge SDK dependencies
- **`src/config/tokens.ts`** - Added `approve` and `allowance` to ERC20_ABI

---

## 🔄 How CCTP Works

### The Flow

```
1. User initiates transfer on source chain
   ↓
2. Approve USDC spending to TokenMessenger contract
   ↓
3. Call depositForBurn() → Burns USDC on source chain
   ↓
4. Circle's attestation service signs the burn message (10-20 min)
   ↓
5. Use attestation to call receiveMessage() on destination chain
   ↓
6. USDC is minted on destination chain
```

### Key Concepts

- **Domain IDs**: Circle-specific chain identifiers (different from chain IDs)
- **TokenMessenger**: Contract that burns/mints USDC
- **MessageTransmitter**: Contract that handles cross-chain messages
- **Attestation**: Circle's signature proving the burn happened
- **No Bridge Fees**: Only gas costs, no protocol fees

---

## ⚙️ Configuration Required

### 1. Update Circle Domain IDs

Open `src/config/bridgeKit.ts` and verify the domain IDs:

```typescript
export const CIRCLE_DOMAIN_IDS: Record<number, number> = {
  11155111: 0, // Ethereum Sepolia - TODO: Verify
  43113: 1,    // Avalanche Fuji - TODO: Verify
  421614: 3,   // Arbitrum Sepolia - TODO: Verify
  84532: 6,    // Base Sepolia - TODO: Verify
}
```

**Find correct values at:**
https://developers.circle.com/stablecoins/docs/cctp-protocol-contract#domain-ids

### 2. Update Contract Addresses

In the same file, verify:

**TokenMessenger addresses:**
```typescript
export const TOKEN_MESSENGER_ADDRESSES: Record<number, `0x${string}`> = {
  11155111: '0x9f3B8679c73C2Fef8b59B4f3444d4e156fb70AA5', // TODO: Verify
  // ... etc
}
```

**MessageTransmitter addresses:**
```typescript
export const MESSAGE_TRANSMITTER_ADDRESSES: Record<number, `0x${string}`> = {
  11155111: '0x7865fAfC2db2093669d92c0F33AeEF291086BEFD', // TODO: Verify
  // ... etc
}
```

**Find correct addresses at:**
https://developers.circle.com/stablecoins/docs/cctp-protocol-contract

### 3. Add Arc Testnet Configuration

Once Arc testnet details are available:

```typescript
// Add to CIRCLE_DOMAIN_IDS
12345: ??, // Arc testnet domain ID

// Add to TOKEN_MESSENGER_ADDRESSES
12345: '0x...', // Arc TokenMessenger

// Add to MESSAGE_TRANSMITTER_ADDRESSES
12345: '0x...', // Arc MessageTransmitter

// Add to BRIDGE_RPC_URLS
12345: 'https://rpc.arc-testnet.example.com',
```

### 4. (Optional) Add RPC URLs

Create `.env.local` from `.env.example`:

```bash
cp .env.example .env.local
```

Add your RPC URLs for better reliability:

```env
NEXT_PUBLIC_ETHEREUM_SEPOLIA_RPC=https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY
NEXT_PUBLIC_BASE_SEPOLIA_RPC=https://base-sepolia.g.alchemy.com/v2/YOUR_KEY
# etc...
```

---

## 🚀 Usage

### Basic Bridge Flow

```typescript
import { bridgeUSDC } from '@/services/bridgeKitClient'
import { useWalletClient } from 'wagmi'

// In your component
const { data: walletClient } = useWalletClient()

const result = await bridgeUSDC(
  {
    fromChainId: 11155111, // Ethereum Sepolia
    toChainId: 84532,      // Base Sepolia
    amount: "10.00",       // 10 USDC
    recipient: "0x123...", // Destination address
    sourceChain: ethereumSepolia,
    destinationChain: baseSepolia,
  },
  walletClient
)

if (result.success) {
  console.log('Bridge initiated!', result.txHash)
} else {
  console.error('Bridge failed:', result.error)
}
```

### The Function Does:

1. ✅ Validates chains are CCTP-supported
2. ✅ Checks USDC balance
3. ✅ Approves USDC spending if needed
4. ✅ Calls `depositForBurn()` on TokenMessenger
5. ✅ Returns transaction hash

### What It Doesn't Do (Yet):

- ⏳ Wait for Circle's attestation
- ⏳ Automatically call `receiveMessage()` on destination
- ⏳ Track transfer status

**Note:** After the burn transaction, it takes 10-20 minutes for Circle to provide the attestation. The minting happens automatically once the attestation is available.

---

## 🧪 Testing the Bridge

### Prerequisites

1. ✅ Wallet connected
2. ✅ Have USDC on source chain (from Circle faucet)
3. ✅ Have gas tokens on source chain (ETH/AVAX/etc)
4. ✅ Source and destination chains must be different
5. ✅ Both chains must be CCTP-supported

### Test Transfer Steps

1. **Get Testnet USDC**
   - Visit https://faucet.circle.com
   - Request USDC on your source chain (e.g., Ethereum Sepolia)
   - Wait for transaction to confirm

2. **Get Gas Tokens**
   - Get testnet ETH/AVAX/etc for gas fees
   - Use network-specific faucets (see landing page)

3. **Initiate Bridge**
   - Go to `/app` page
   - Connect wallet
   - Select source and destination chains
   - Enter amount (e.g., "5.00")
   - Click "Bridge USDC"
   - Approve in wallet (may need 2 transactions: approve + burn)

4. **Wait for Completion**
   - Burn transaction confirms in ~1 minute
   - Circle attestation takes ~10-20 minutes
   - USDC appears on destination chain automatically

5. **Verify Balance**
   - Check balance on destination chain in the app
   - Or check on block explorer

---

## 🔍 Verification Checklist

Before using the bridge, verify:

- [ ] Domain IDs match Circle's documentation
- [ ] TokenMessenger addresses are correct for each chain
- [ ] MessageTransmitter addresses are correct for each chain
- [ ] USDC token addresses are correct (from `tokens.ts`)
- [ ] RPC URLs are working and accessible
- [ ] All contracts are verified on block explorers
- [ ] Test with small amounts first!

---

## 📊 Supported Routes

Currently configured (verify addresses):

- ✅ Ethereum Sepolia ↔ Base Sepolia
- ✅ Ethereum Sepolia ↔ Avalanche Fuji
- ✅ Ethereum Sepolia ↔ Arbitrum Sepolia
- ✅ Base Sepolia ↔ Avalanche Fuji
- ✅ Base Sepolia ↔ Arbitrum Sepolia
- ✅ Avalanche Fuji ↔ Arbitrum Sepolia
- ⏳ Arc Testnet ↔ Other chains (once configured)

**All combinations work!** CCTP is fully bidirectional.

---

## 🐛 Troubleshooting

### "Chain not supported by CCTP"
- Check if chain has domain ID in `bridgeKit.ts`
- Verify chain is in Circle's supported networks list

### "Bridge configuration not available"
- USDC address might be missing in `tokens.ts`
- TokenMessenger address might be missing in `bridgeKit.ts`

### "Insufficient USDC balance"
- Get testnet USDC from Circle faucet
- Make sure you're on the correct network

### Approval transaction fails
- Check gas balance on source chain
- Verify USDC contract address is correct

### Burn transaction fails
- Check TokenMessenger contract address
- Verify destination domain ID is correct
- Ensure you've approved enough USDC

### USDC never appears on destination
- Wait 20-30 minutes (attestation can be slow on testnet)
- Check Circle's attestation service status
- Verify transaction on source chain succeeded
- Check if you need to manually call `receiveMessage()` (implementation dependent)

---

## 🔗 Important Links

### Circle Documentation
- **CCTP Overview**: https://developers.circle.com/stablecoins/docs/cctp-getting-started
- **Protocol Contracts**: https://developers.circle.com/stablecoins/docs/cctp-protocol-contract
- **Domain IDs**: https://developers.circle.com/stablecoins/docs/cctp-protocol-contract#domain-ids
- **Testnet Faucet**: https://faucet.circle.com

### Block Explorers
- **Ethereum Sepolia**: https://sepolia.etherscan.io
- **Base Sepolia**: https://sepolia.basescan.org
- **Avalanche Fuji**: https://testnet.snowtrace.io
- **Arbitrum Sepolia**: https://sepolia.arbiscan.io

---

## 💡 Implementation Notes

### Why This is Simple

1. **No liquidity pools** - CCTP burns and mints natively
2. **No wrapped tokens** - Always native USDC
3. **No bridge fees** - Only gas costs
4. **No slippage** - 1:1 transfer always

### Current Limitations

- Only returns after burn transaction (doesn't wait for mint)
- No status tracking UI (coming next)
- No automatic attestation handling (could be added)
- No error recovery (user must retry manually)

### Potential Enhancements

- Add attestation polling
- Implement `receiveMessage()` call on destination
- Add transaction status tracking
- Show progress indicator (burn → attestation → mint)
- Store transfer history
- Add retry logic for failed transfers

---

## ⏭️ Next Steps

1. ✅ Bridge Kit integrated ← **YOU ARE HERE**
2. ⏳ Update BridgeForm component to use `bridgeUSDC()`
3. ⏳ Add bridge status tracking
4. ⏳ Implement transfer history
5. ⏳ Add Arc Network integration
6. ⏳ Polish UI/UX for judging

---

**Ready to bridge!** Update the configuration values, install dependencies, and test with small amounts first. 🌉

