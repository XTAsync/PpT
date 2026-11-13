# Paper Trading Tournament

A contest-style paper-trading application for practising market decisions with virtual capital. Participants can explore supported markets, manage simulated positions, and compare performance on a leaderboard.

## Features

- Virtual portfolio and cash balance
- Simulated buy and sell workflows
- Support for stocks, crypto, ETFs, and forex/commodities market categories
- Holdings, transactions, and limit-order models
- Contest leaderboard and performance metrics
- AI-assisted market and portfolio analysis

## Technology

React 19 · TypeScript · Vite · Express · Google Gemini API

## Getting Started

Requirements: Node.js and npm.

```bash
git clone https://github.com/XTAsync/PpT.git
cd PpT
npm install
npm run dev
```

The development command starts the application server. Configure `GEMINI_API_KEY` in your local environment to enable Gemini-powered analysis. The application includes fallback analysis behaviour when the key is not configured.

## Available Scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## Important

This is a paper-trading environment. Orders use simulated funds and do not execute through a brokerage or move real money. Market information and AI-generated analysis should not be treated as investment advice.
