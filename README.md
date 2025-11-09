# VaultHive - Fractional Investment Platform

A modern React web application for fractional ownership and co-investment in high-value assets.

## Features

- **Landing Page**: Hero section with feature showcase and call-to-action
- **Dashboard**: Portfolio overview, impact score, recommendations, and activity feed
- **Discover Assets**: Browse and filter investment opportunities with AI assistant
- **My Investments**: Track owned assets and NFT vault collection
- **Secondary Market**: Trade shares during liquidity windows with reverse-bidding
- **Impact Dashboard**: ESG scoring, achievements, and impact tracking
- **Dark/Light Mode**: Toggle between dark and light themes with persistent storage

## Design

- Dark and light theme support with orange accent colors
- Modern card-based layout with adaptive shadows and borders
- Responsive design for mobile and desktop
- Smooth animations with Framer Motion
- Clean typography using Inter font
- Theme persistence with localStorage

## Tech Stack

- React 18
- React Router for navigation
- Framer Motion for animations
- Lucide React for icons
- CSS custom properties for theming

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm eject` - Ejects from Create React App

## Project Structure

```
src/
├── components/
│   ├── Navbar.js
│   └── Navbar.css
├── contexts/
│   └── ThemeContext.js
├── pages/
│   ├── LandingPage.js
│   ├── Dashboard.js
│   ├── DiscoverAssets.js
│   ├── MyInvestments.js
│   ├── Market.js
│   └── Impact.js
├── App.js
├── App.css
├── index.js
└── index.css
```

## Key Features Implemented

### Landing Page
- Hero section with gradient text and call-to-action
- Feature showcase with icons and descriptions
- Statistics section
- How it works process
- Final CTA section

### Dashboard
- Portfolio value overview with performance metrics
- Impact score display
- Recommended syndicates/assets
- Upcoming liquidity windows
- Recent activity feed

### Discover Assets
- Asset filtering and search
- Grid/list view toggle
- AI assistant chat widget
- Detailed asset cards with key metrics
- ESG scores and performance indicators

### My Investments
- Asset portfolio with performance tracking
- NFT vault for ownership certificates
- Voting notifications
- Dividend tracking

### Secondary Market
- Open market listings with bidding
- My shares for sale management
- Upcoming liquidity windows
- Reverse-bidding mechanics

### Impact Dashboard
- Overall impact score with progress
- Category breakdown (Environmental, Social, Governance)
- Achievement system with badges
- Leaderboard
- Impact investment tracking

## Styling

The application uses a consistent design system with:
- CSS custom properties for colors and spacing with theme support
- Responsive grid layouts
- Hover effects and transitions
- Card-based components with adaptive shadows
- Orange gradient theme matching the provided design reference
- Dark/light mode toggle with smooth transitions
- Theme persistence using localStorage

## Theme System

The application includes a comprehensive theme system:
- **Dark Mode (Default)**: Dark backgrounds with orange accents
- **Light Mode**: Clean white backgrounds with subtle shadows
- **Theme Toggle**: Sun/Moon icon in the navbar
- **Persistence**: Theme preference saved to localStorage
- **Smooth Transitions**: All elements transition smoothly between themes