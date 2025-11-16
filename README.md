# USDC Bridge - Cross-Chain USDC with Circle & Arc

A hackathon demo application showcasing seamless cross-chain USDC transfers using Circle's Bridge Kit and Arc Network.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- A Web3 wallet (MetaMask recommended)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd Bill-Splitting-1
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📁 Project Structure

```
Bill-Splitting-1/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with navbar/footer
│   │   ├── page.tsx             # Landing page (/)
│   │   ├── app/
│   │   │   └── page.tsx         # Bridge app page (/app)
│   │   └── globals.css          # Global styles
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx       # Navigation bar
│   │   │   └── Footer.tsx       # Footer
│   │   ├── landing/
│   │   │   ├── Hero.tsx         # Hero section
│   │   │   ├── HowItWorks.tsx   # How it works section
│   │   │   ├── Features.tsx     # Features section
│   │   │   └── TestnetGuide.tsx # Faucet links
│   │   └── bridge/
│   │       ├── WalletConnect.tsx    # Wallet connection
│   │       ├── BalanceDisplay.tsx   # Multi-chain balances
│   │       ├── BridgeForm.tsx       # Bridge interface
│   │       └── TransferHistory.tsx  # Transfer history
├── public/                      # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

## 📝 Current Status

✅ Project skeleton created
✅ Landing page with educational sections
✅ App page with UI components
⏳ Blockchain integration (coming next)
⏳ Circle Bridge Kit integration (coming next)
⏳ Arc Network integration (coming next)

## 🌐 Routes

- `/` - Landing page with information about Circle, Arc, and Bridge Kit
- `/app` - Main bridge application

## 🎨 Features (UI Only - No Logic Yet)

- Responsive design (mobile, tablet, desktop)
- Dark mode support
- Modern, clean interface
- Placeholder components for:
  - Wallet connection
  - Multi-chain USDC balances
  - Bridge form (from/to chains)
  - Transfer history

## 📚 Next Steps

1. Add Web3 wallet connection (Wagmi + RainbowKit)
2. Integrate Circle Bridge Kit for CCTP transfers
3. Add Arc Network for chain abstraction
4. Implement balance fetching across chains
5. Add transfer history with localStorage
6. Connect to testnet RPC endpoints

## 🧪 Testnet Resources

- [Circle Testnet Faucet](https://faucet.circle.com) - Get testnet USDC
- [Ethereum Sepolia Faucet](https://sepoliafaucet.com) - Get testnet ETH
- [Avalanche Fuji Faucet](https://core.app/tools/testnet-faucet) - Get testnet AVAX

## 📖 Documentation

- [Arc Network Docs](https://docs.arc.network)
- [Circle Developers](https://developers.circle.com)
- [Next.js Docs](https://nextjs.org/docs)

## 🏗️ Built For

Hackathon Bounty: "Best Cross-Chain USDC Experience with Circle's Bridge Kit and Arc"

---

**Note**: This is currently a UI skeleton. Blockchain functionality will be added in the next phase.

