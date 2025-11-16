# Setup Checklist for Hackathon Judges

This checklist will help you get the USDC Bridge app running in ~10 minutes.

## ✅ Prerequisites (5 minutes)

- [ ] **Node.js 18+** installed (`node --version`)
- [ ] **MetaMask** or another Web3 wallet
- [ ] **Testnet USDC** from https://faucet.circle.com
- [ ] **Gas tokens** (ETH, AVAX) from network faucets

## 🚀 Quick Setup (5 minutes)

### 1. Clone & Install

```bash
git clone <repo-url>
cd Bill-Splitting-1
npm install
```

**Expected time:** 2-3 minutes

### 2. Environment Setup

```bash
# Copy environment template
cp ENV_TEMPLATE.txt .env.local

# Edit .env.local (optional but recommended)
# Add WalletConnect Project ID from https://cloud.walletconnect.com/
```

**Minimum config:** Leave .env.local empty - app uses public RPCs by default

**Recommended:** Add WalletConnect Project ID for better wallet UX

### 3. Configuration Updates

#### Option A: Quick Start (Use as-is)
```bash
# Skip configuration updates for now
# App will work with placeholder values for initial testing
```

#### Option B: Full Setup (Recommended for demo)

Update these files with real values:

**`src/config/chains.ts`** - Arc testnet details
```typescript
// Line ~11: Update Arc chain ID
id: 12345, // TODO: Real Arc testnet chain ID

// Line ~20: Update Arc RPC URL
http: ['https://rpc.arc-testnet.example.com'], // TODO: Real RPC
```

**`src/config/tokens.ts`** - USDC contract addresses
```typescript
// Verify these addresses from Circle docs:
// https://developers.circle.com/stablecoins/docs/usdc-on-test-networks

11155111: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238', // Ethereum Sepolia
84532: '0x036CbD53842c5426634e7929541eC2318f3dCF7e',    // Base Sepolia
// ... etc
```

**`src/config/bridgeKit.ts`** - Circle CCTP contracts
```typescript
// Verify from: https://developers.circle.com/stablecoins/docs/cctp-protocol-contract

export const CIRCLE_DOMAIN_IDS = { /* ... */ }
export const TOKEN_MESSENGER_ADDRESSES = { /* ... */ }
export const MESSAGE_TRANSMITTER_ADDRESSES = { /* ... */ }
```

**See detailed checklists:**
- `ARC_NETWORK_TODO.md`
- `USDC_ADDRESSES_TODO.md`
- `BRIDGE_CONFIG_TODO.md`

### 4. Start the App

```bash
npm run dev
```

Open http://localhost:3000

**Expected time:** 30 seconds

## 🧪 Quick Test (5 minutes)

### Testnet Tokens

1. **Get USDC** - Visit https://faucet.circle.com
   - Connect MetaMask
   - Select Ethereum Sepolia
   - Request 10 USDC
   - Wait ~30 seconds for confirmation

2. **Get Gas ETH** - Visit https://sepoliafaucet.com
   - Paste your wallet address
   - Request testnet ETH
   - Wait ~1 minute

### Test the App

1. **Landing Page** (/)
   - [ ] Page loads with hero section
   - [ ] "Open App" button works
   - [ ] Sections explain CCTP and Arc

2. **Connect Wallet** (/app)
   - [ ] Click "Connect Wallet"
   - [ ] Select MetaMask
   - [ ] Approve connection
   - [ ] Address shows in Network Status

3. **View Balances**
   - [ ] USDC balances load
   - [ ] Shows balance on Ethereum Sepolia
   - [ ] Total USDC displays at top

4. **Execute Transfer** (5 USDC: Ethereum → Base)
   - [ ] Select "From": Ethereum Sepolia
   - [ ] Select "To": Base Sepolia
   - [ ] Enter amount: 5.00
   - [ ] Review section appears
   - [ ] Click "Move USDC"
   - [ ] Approve in MetaMask (2 transactions)
   - [ ] Status shows "In Transit"
   - [ ] Transaction link works

5. **Check History**
   - [ ] Scroll to "Recent Transfers"
   - [ ] Transfer appears in list
   - [ ] Shows status "In Transit"
   - [ ] "View on explorer" link works

## ⚡ Fast Track (Minimum Setup)

If you just want to see the UI without testnet tokens:

```bash
git clone <repo-url>
cd Bill-Splitting-1
npm install
npm run dev
```

Then:
1. Open http://localhost:3000 - See landing page
2. Go to /app - See bridge interface
3. Click "Connect Wallet" - See wallet connection UI
4. View UI components (balances will show 0.00)

**Time:** 3 minutes total

## 🐛 Troubleshooting

### "Cannot find module" errors
```bash
rm -rf node_modules package-lock.json
npm install
```

### Wallet won't connect
- Check MetaMask is installed
- Try refreshing the page
- Clear browser cache

### Balances show 0.00
- Make sure you have testnet USDC from Circle faucet
- Check you're on the correct network
- Wait 30 seconds for balances to load

### Transfer fails
- Ensure you have gas tokens (ETH/AVAX)
- Check USDC balance is sufficient
- Verify contract addresses in config files

### "Hydration error" in console
- This is a known Next.js + Web3 warning
- Refresh the page - it will work
- Doesn't affect functionality

## 📚 Documentation

For deeper understanding, see:

- `README.md` - Complete setup guide
- `WALLET_SETUP.md` - Wallet integration details
- `BRIDGE_KIT_SETUP.md` - CCTP implementation
- `MOVE_USDC_FLOW.md` - UI flow documentation
- `LANDING_PAGE_GUIDE.md` - Landing page design

## 🎯 Demo Script for Judges

**1. Landing Page (1 min)**
```
"This is our landing page explaining Circle's CCTP 
and Arc Network's unique features..."
```

**2. App Interface (1 min)**
```
"Here's the main bridge interface. I'll connect 
my wallet and show you the balances..."
```

**3. Live Transfer (2 min)**
```
"I'm going to transfer 5 USDC from Ethereum to Base.
Watch the status tracking and visual feedback..."
```

**4. History & Features (1 min)**
```
"All transfers are saved locally. Here's the history
with transaction links and status badges..."
```

**Total demo time:** 5 minutes

## ✅ Final Checklist

Before presenting to judges:

- [ ] App runs without errors
- [ ] Landing page displays correctly
- [ ] Wallet connection works
- [ ] At least one test transfer completed
- [ ] Transfer history shows transfers
- [ ] Mobile responsive works
- [ ] Dark mode functions
- [ ] All links work (explorer, faucets, docs)
- [ ] No console errors (except minor warnings)

## 🚀 Ready to Demo!

You're all set! The app should be running smoothly and ready to impress judges.

**Questions?** Check the documentation files or open an issue on GitHub.

**Good luck with your hackathon presentation!** 🏆

