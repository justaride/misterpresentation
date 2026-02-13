# Blue Economy + Natural State Portfolio Presentation

## Overview

Interactive scroll-driven presentation welcoming three Blue Economy leaders and showcasing Natural State's AI/data portfolio.

## Access

- **Dev Server**: http://localhost:5173
- **Direct Link**: http://localhost:5173/examples/blue-economy-leaders

## Structure

### 1. Terminal Intro (Phase 1)

- Matrix rain animation
- Auto-typing terminal commands
- Welcomes three guests:
  - Linn Indrestrand (Port of Hirtshals & Danish Ocean Cluster)
  - Unni Grebstad (OceanVju AS - Digital Twins)
  - Marit Aune (Hitra Municipality - Spatial Planning)
- Introduces Natural State portfolio (16 apps, 4 categories)

### 2. Portfolio Sections (Phase 2)

**Portal Overview**

- Key stats: 16 live apps, 4 categories, 99.8% uptime
- Architecture: Cloudflare Zero Trust → Coolify → Hetzner
- Tech stack: React + TypeScript + Vite

**PLACE Category** (5 apps)

- Sunnmørsalpene Dashboard
- Løkka Gardeierforening (51 properties)
- Rendalen Dashboard (1,015 survey responses)
- Rendalen Besøksstrategi
- Sundland Bolig

**MARKET Category** (5 apps)

- Nordic Circular Buildings (195 projects)
- FYRA Circular Platform
- Finansieringskart
- Nordic Circular Summit 2025
- Natural State Design

**INTERNAL Category** (3 apps)

- Løkka Internal Dashboard
- Hovfaret 13
- Coffee & Forest (EUDR compliance)

**LAB Category** (2 apps)

- Docker Graphics
- Perronggården

**Design System Section**

- Design tokens, component library, motion primitives
- Unified design language across 16 apps

**Infrastructure Section**

- Zero Trust security architecture
- Live monitoring and health checks
- Automated deployment

**Closing Section**

- Collaboration opportunities
- Contact: gabriel@naturalstate.no

## Navigation

- **Scroll**: Native vertical scroll through sections
- **Arrow Keys**: Up/Down to navigate sections
- **Escape**: Return to terminal intro
- **Progress Dots**: Visual indicator at bottom center

## Design Highlights

- Terminal: Matrix green (#00ff41) on black
- Portal Overview: Dark blue gradient
- Place: Green gradient (#10b981 → #0891b2)
- Market: Purple/Cyan gradient (#a855f7 → #06b6d4)
- Internal: Orange/Red gradient (#f59e0b → #dc2626)
- Lab: Cyan/Blue gradient (#06b6d4 → #0ea5e9)
- Design System: Warm gray gradient
- Infrastructure: Dark navy gradient
- Closing: Emerald gradient

## Key Features

- Scroll-snap for buttery smooth navigation
- Framer Motion animations with stagger effects
- Reduced motion support
- Responsive layout (mobile-friendly)
- Live status badges on app cards
- Glassmorphism UI elements

## Files Modified

- `/src/components/presentation-modes/BlueEconomyLeaders.tsx` - Main component
- `/src/data/natural-state-portfolio.ts` - Portfolio data (NEW)
- `/src/data/examples.ts` - Updated description

## Build Status

✅ TypeScript compilation: No errors
✅ Dev server: Running on port 5173
✅ All imports resolved
✅ All animations functional
