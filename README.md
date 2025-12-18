# Bucket Homework

A minimalist Sui blockchain interaction hub. Built on top of the [Bucket Sui DApp Scaffold](https://github.com/Bucket-Protocol/sui-dapp-scaffold-v1) for the Bucket Protocol assessment.

## Features

### Mainnet
- **Wallet Connection** `[UserStory 1-1]`: Multi-wallet support (Slush, Binance, etc.) via Sui DappKit. Displays SUI balance and address.
- **Address Lookup** `[UserStory 1-2]`: NodeJS API to query any address's full token portfolio (SUI + Altcoins) via Sui RPC.

### Testnet
- **Object Inspector** `[UserStory 3]`: Direct state reading of static contract object (`0xee...e45`) to fetch Admin, ID, and Balance info.
- **Transaction Sender** `[UserStory 4]`: Frontend-signed SUI transfers with real-time TX hash and explorer integration.

## Quick Start

```bash
pnpm install
pnpm dev
```

Visit `http://localhost:3000`.
