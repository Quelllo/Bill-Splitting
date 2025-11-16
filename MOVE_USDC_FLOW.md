# Move USDC Flow - User Guide

## 🎯 Overview

The Move USDC flow is the main feature of the app, allowing users to transfer USDC across different blockchain networks using Circle's Cross-Chain Transfer Protocol (CCTP).

## 📦 What Was Implemented

### New Component

**`src/components/bridge/MoveUSDCFlow.tsx`**
- Complete bridge UI with form, validation, and status tracking
- Integrates with `bridgeUSDC()` service
- User-friendly status machine with progress visualization
- Automatic form population with wallet data

### Updated Component

**`src/components/bridge/BridgeForm.tsx`**
- Now simply wraps `MoveUSDCFlow` component
- Replaced old placeholder UI

---

## ✨ Features

### 1. Network Selection

**From Network:**
- Dropdown with all supported networks
- Automatically selects currently connected chain
- Shows current USDC balance
- Disabled during active transfer

**To Network:**
- Dropdown excludes selected "From" network
- Automatically filters out source chain
- Updates when source changes

### 2. Amount Input

**Main Input:**
- Numeric input with 2 decimal precision
- Placeholder shows "0.00"
- Real-time validation against balance

**Quick Amount Buttons:**
- **Max** button - fills entire balance
- **25%** chip - quarter of balance
- **50%** chip - half of balance
- **100%** chip - full balance (same as Max)

### 3. Recipient Address

**Auto-filled:**
- Defaults to connected wallet address
- User can change to any valid address
- Validates Ethereum address format (starts with 0x)
- Monospace font for better readability

**Use case:** Send to different wallet or friend's address

### 4. Review Section

**Appears when form is valid**, shows:
- "You are moving X USDC from [Network] to [Network]"
- Estimated time (from `estimateBridgeTime()`)
- Bridge fee: "$0 (gas only)"
- Note about network gas fees

**Design:** Blue highlighted box to draw attention

### 5. Status State Machine

**Five states:**

1. **`idle`** - Default state, form is editable
2. **`preparing`** - Initial validation, setting up transfer
3. **`awaiting_approval`** - Waiting for user to approve in wallet
4. **`in_transit`** - Transaction confirmed, USDC on the way
5. **`error`** - Something went wrong

**Progress Visualization:**
- ✅ Transfer prepared
- ✅ Wallet confirmed
- ⚡ In transit (pulsing yellow during)
- ⭕ Arrived on destination

### 6. Transaction Tracking

**During transfer:**
- Shows spinner and status message
- Human-friendly copy for each step
- Link to block explorer for burn transaction
- Progress dots show completion status

**Status messages:**
- "Preparing transfer..." - Setting up
- "Waiting for your confirmation" - Approve in wallet
- "Your USDC is on the way!" - Transaction confirmed
- "Transfer Complete!" - Arrived (TODO: needs attestation tracking)

### 7. Error Handling

**Friendly error messages:**
- "Something went wrong before your USDC moved. Please try again."
- Shows specific error if available
- Red alert box with icon
- "Try Again" button to reset form

**Validation errors shown in button:**
- "Please connect your wallet"
- "Please select source network"
- "Please select destination network"
- "Please enter an amount"
- "Insufficient balance"
- "Please enter a valid recipient address"
- "This route is not available"

---

## 🎨 UX Design Decisions

### Simple, Not Complex

**What we did:**
- Single component with all logic
- Linear flow (no tabs, no steps)
- Instant validation feedback
- Auto-population of sensible defaults

**What we avoided:**
- Multi-step wizards
- Complex state management
- Technical jargon
- Overwhelming options

### Non-Technical Copy

**Before:** "Approve token spending to TokenMessenger contract"
**After:** "Waiting for your confirmation"

**Before:** "Call depositForBurn() with 10^6 units"
**After:** "Moving 10.00 USDC from Ethereum to Base"

**Before:** "Transaction hash: 0x1234..."
**After:** "View transaction on Ethereum Sepolia" (clickable link)

### Visual Feedback

✅ **Colors:**
- Blue for info/review
- Red for errors
- Green for success
- Yellow for in-progress

✅ **Icons:**
- Zap for "Move USDC" action
- Loader for processing
- Check circle for complete
- Alert circle for errors
- External link for explorer

✅ **Animations:**
- Spinner during processing
- Pulsing yellow dots for in-progress steps
- Smooth transitions

---

## 🔄 User Flow

### Happy Path

```
1. User goes to /app page
   ↓
2. Connects wallet → form auto-fills
   ↓
3. Selects "From" network (defaults to connected)
   ↓
4. Selects "To" network (different chain)
   ↓
5. Enters amount or clicks quick buttons
   ↓
6. Reviews transfer details
   ↓
7. Clicks "Move USDC"
   ↓
8. Status: "Preparing transfer..."
   ↓
9. Status: "Waiting for your confirmation"
   User approves in MetaMask
   ↓
10. Status: "Your USDC is on the way!"
    Transaction link appears
    ↓
11. Wait 15-20 minutes
    ↓
12. Check destination balance
    USDC has arrived!
```

### Error Paths

**Insufficient Balance:**
```
User enters 100 USDC but only has 50
↓
Button shows: "Insufficient balance"
Button is disabled
```

**User Rejects in Wallet:**
```
Status: "Waiting for your confirmation"
User clicks "Reject" in MetaMask
↓
Status: "error"
Shows: "User rejected the request"
"Try Again" button appears
```

**Network Issues:**
```
RPC fails during transfer
↓
Status: "error"
Shows: "Something went wrong..."
"Try Again" button appears
```

---

## 💻 Technical Implementation

### Key React Hooks Used

```typescript
// Wallet connection
const { address, isConnected, chain } = useAccount()
const { data: walletClient } = useWalletClient()

// USDC balances
const { balances } = useUSDCBalances()

// State management
const [fromChainId, setFromChainId] = useState<number | null>(null)
const [toChainId, setToChainId] = useState<number | null>(null)
const [amount, setAmount] = useState('')
const [status, setStatus] = useState<TransferStatus>('idle')
```

### Validation Logic

**Uses `useMemo` for efficiency:**
```typescript
const validation = useMemo(() => {
  // Check wallet connected
  // Check networks selected
  // Check amount entered
  // Check sufficient balance
  // Check route available
  return { isValid: boolean, error: string | null }
}, [dependencies])
```

### Bridge Execution

```typescript
const handleBridge = async () => {
  setStatus('preparing')
  
  try {
    setStatus('awaiting_approval')
    
    const result = await bridgeUSDC(params, walletClient)
    
    if (result.success) {
      setTxHash(result.txHash)
      setStatus('in_transit')
    } else {
      setStatus('error')
      setErrorMessage(result.error)
    }
  } catch (error) {
    setStatus('error')
    setErrorMessage('Something went wrong...')
  }
}
```

---

## 🧪 Testing the Flow

### Prerequisites

1. ✅ Wallet connected (MetaMask recommended)
2. ✅ USDC on source chain (from Circle faucet)
3. ✅ Gas tokens on source chain (ETH/AVAX/etc)

### Test Steps

1. **Go to `/app` page**
2. **Connect wallet** - form auto-fills with your address
3. **Select Ethereum Sepolia** as "From" network
4. **Select Base Sepolia** as "To" network
5. **Enter 5.00** USDC (or click 50% chip)
6. **Review** - check the blue review box appears
7. **Click "Move USDC"**
8. **Approve in MetaMask** when prompted (may need 2 approvals)
9. **Watch status** - should show "In transit"
10. **Click transaction link** - opens Etherscan
11. **Wait 15-20 minutes**
12. **Check balance** - should update on Base

### Expected Results

- ✅ Form validates inputs correctly
- ✅ Balance updates after transfer
- ✅ Status shows clear progress
- ✅ Transaction link works
- ✅ Error messages are clear
- ✅ Can start new transfer after completion

---

## 🐛 Known Limitations & TODOs

### Current Limitations

1. **No attestation tracking**
   - Status shows "in_transit" but doesn't know when minting occurs
   - User must manually check destination balance
   - **TODO:** Poll Circle's attestation service

2. **No automatic completion detection**
   - Doesn't update to "completed" automatically
   - **TODO:** Monitor destination chain for mint transaction

3. **No transfer history storage**
   - Each transfer is independent
   - **TODO:** Store transfers in localStorage

4. **Hardcoded ETA**
   - `estimateBridgeTime()` returns fixed 15 minutes
   - **TODO:** Make dynamic based on actual route performance

5. **No gas estimation**
   - Doesn't show estimated gas cost
   - **TODO:** Calculate gas for approve + burn transactions

### Assumptions Made

**Places marked with TODO comments:**

```typescript
// TODO: In a full implementation, you would:
// - Poll for attestation from Circle
// - Track when minting occurs on destination
// - Update to 'completed' when done
// For now, we show "in_transit" and user can check manually
```

**Review section:**
```typescript
// Using hardcoded ETA from estimateBridgeTime()
// Could be made more accurate with historical data
```

**Fee display:**
```typescript
// Shows "$0 (gas only)" 
// Could calculate actual gas costs if needed
```

---

## 🎯 Future Enhancements

### High Priority

1. **Attestation Tracking**
   - Poll Circle's API for attestation status
   - Automatically update when mint occurs
   - Show accurate completion state

2. **Transfer History**
   - Store all transfers in localStorage
   - Show past transfers with status
   - Link to source and destination transactions

3. **Better Error Recovery**
   - Retry failed transactions
   - Resume interrupted transfers
   - Clear error explanations with fixes

### Medium Priority

4. **Gas Estimation**
   - Calculate actual gas costs
   - Show in USD if possible
   - Warn if user has insufficient gas

5. **Transaction Notifications**
   - Browser notifications when complete
   - Toast messages for updates
   - Email notifications (optional)

6. **Multi-hop Routing** (if Arc enables it)
   - Route through Arc for better experience
   - Optimize for speed or cost
   - Show route visualization

### Low Priority

7. **Amount Suggestions**
   - "Popular amounts" chips ($10, $50, $100)
   - Recent amounts quick select
   - Split from total balance

8. **Address Book**
   - Save frequent recipients
   - Name addresses for easy selection
   - QR code scanning

9. **Batch Transfers**
   - Send to multiple recipients
   - Same or different chains
   - Single approval for all

---

## 📝 Copy Guidelines

All user-facing text follows these principles:

### DO ✅

- "Your USDC is on the way!" (friendly, personal)
- "Move USDC" (simple action verb)
- "Something went wrong" (honest, non-technical)
- "Waiting for your confirmation" (clear expectation)

### DON'T ❌

- "Executing cross-chain atomic swap" (too technical)
- "depositForBurn() failed" (shows implementation)
- "RPC timeout on block 12345" (developer jargon)
- "Insufficient gas for tx execution" (technical terms)

### Voice

- **Conversational**: "You are moving" not "User is transferring"
- **Active**: "Moving" not "Transfer will be executed"
- **Helpful**: Include context and next steps
- **Honest**: If something fails, say so clearly

---

## 🔗 Related Files

- `src/services/bridgeKitClient.ts` - Bridge logic
- `src/config/bridgeKit.ts` - Configuration
- `src/hooks/useUSDCBalances.ts` - Balance fetching
- `src/components/bridge/TransferHistory.tsx` - History (TODO)

---

## 🚀 Ready to Use!

The Move USDC flow is fully functional for testnet transfers. Users can:

1. ✅ Select source and destination chains
2. ✅ Enter amount with quick buttons
3. ✅ Specify recipient address
4. ✅ Review transfer details
5. ✅ Execute cross-chain transfer
6. ✅ Track transaction progress
7. ✅ View on block explorer
8. ✅ Handle errors gracefully

**Start testing with small amounts!** 🌉

