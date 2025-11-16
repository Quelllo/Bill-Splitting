# 🔴 TODO: Update Arc Testnet Configuration

## Current Status
The Arc Testnet configuration in `src/config/chains.ts` contains **PLACEHOLDER** values that need to be replaced with real values from Arc documentation.

## What Needs to Be Updated

Open `src/config/chains.ts` and find the `arcTestnet` object. Replace these values:

### 1. Chain ID
```typescript
id: 12345, // ⚠️ REPLACE THIS
```
**Where to find:** Arc docs or https://chainlist.org/?testnets=true&search=arc

### 2. RPC URL
```typescript
rpcUrls: {
  default: {
    http: ['https://rpc.arc-testnet.example.com'], // ⚠️ REPLACE THIS
  },
  public: {
    http: ['https://rpc.arc-testnet.example.com'], // ⚠️ REPLACE THIS
  },
},
```
**Where to find:** Arc documentation at https://docs.arc.network/

### 3. Block Explorer URL
```typescript
blockExplorers: {
  default: { 
    name: 'Arc Explorer', 
    url: 'https://explorer.arc-testnet.example.com' // ⚠️ REPLACE THIS
  },
},
```
**Where to find:** Arc documentation

### 4. (Optional) Faucet URL
```typescript
// In SUPPORTED_NETWORKS array
faucetUrl: 'https://faucet.arc.network', // Verify this is correct
```

## How to Get These Values

### Option 1: Arc Documentation
Visit https://docs.arc.network/ and look for:
- Network/Chain Configuration
- RPC Endpoints
- Testnet Information
- Developer Resources

### Option 2: ChainList
1. Go to https://chainlist.org/
2. Enable "Testnets" toggle
3. Search for "Arc"
4. Find the testnet and note the Chain ID and RPC URL

### Option 3: Arc Discord/Support
If values aren't documented, reach out to Arc team:
- Join Arc Discord
- Ask in developer support channel
- Request testnet RPC endpoints and chain ID

## Example of What It Should Look Like

```typescript
export const arcTestnet = {
  id: 987654321, // Real chain ID from docs
  name: 'Arc Testnet',
  nativeCurrency: {
    decimals: 6, // Might need to verify this too
    name: 'USDC',
    symbol: 'USDC',
  },
  rpcUrls: {
    default: {
      http: ['https://testnet-rpc.arc.network'], // Real RPC
    },
    public: {
      http: ['https://testnet-rpc.arc.network'], // Real RPC
    },
  },
  blockExplorers: {
    default: { 
      name: 'Arc Explorer', 
      url: 'https://testnet-explorer.arc.network' // Real explorer
    },
  },
  testnet: true,
} as const satisfies Chain
```

## Once Updated

After updating with real values:
1. Restart the dev server (`npm run dev`)
2. Connect your wallet on `/app`
3. Try switching to Arc Testnet using the "Change Network" button
4. Your wallet will prompt you to add/switch to the network
5. Verify it appears correctly in the Network Status component

## Additional Configuration

You might also need to update in the `SUPPORTED_NETWORKS` array:
- The description text
- The logo emoji (if Arc has a preferred icon)
- The faucet URL

---

**Delete this file after Arc Testnet configuration is complete!**

