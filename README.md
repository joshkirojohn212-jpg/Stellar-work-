# StellarWork

StellarWork is an open-source decentralized freelance marketplace on Stellar. Payments are held in Soroban escrow and released by state transitions, not platform custody logic.

## Repository Layout

```
stellarwork
├── contracts/escrow
├── frontend
└── docs
```

## Local Setup

### 1) Contract

```bash
cd contracts/escrow
cargo test
```

### 2) Frontend

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy Contract to Stellar Testnet

Prerequisites:
- Soroban CLI installed
- Testnet identity configured in Soroban CLI

Example flow:

```bash
cd contracts/escrow
soroban contract build
soroban contract deploy --wasm target/wasm32-unknown-unknown/release/escrow.wasm --source <identity> --network testnet
```

After deploy:
- Set returned contract ID as `NEXT_PUBLIC_CONTRACT_ID` in `frontend/.env.local`
- Restart frontend dev server

## Current Feature Set

- Core escrow lifecycle (`post_job`, `accept_job`, `submit_work`, `approve_work`, `cancel_job`)
- On-chain job storage and count queries
- Platform fee accounting (2.5%)
- Contract unit tests for core paths
- Core pages: `/`, `/post-job`, `/job/[id]`

## Planned Expansions

- Dispute arbitration logic (stubbed in contract)
- Dashboard/profile/admin feature implementations
- Multi-milestone and tipping features
- IPFS-based description persistence (localStorage used currently)

## Open Issues to Contribute

### Good First Issues

- Add pagination to home job listing
- Add copy-to-clipboard helpers for IDs and addresses
- Show connected wallet XLM balance in header
- Replace localStorage description persistence with IPFS integration
- Add tests for `submit_work` edge cases

### Medium Issues

- Build `/dashboard` client/freelancer job views
- Build `/profile/[address]` with on-chain history
- Implement `extend_deadline` contract + UI
- Implement `tip_freelancer` contract + UI
- Add transaction history panel in `/job/[id]`

### Hard Issues

- Design and implement on-chain dispute resolution
- Implement multi-milestone escrow flow
- Add SEP-0031 based cross-border payment support
- Design contract upgrade path and governance guardrails

## License

MIT (`LICENSE`).
