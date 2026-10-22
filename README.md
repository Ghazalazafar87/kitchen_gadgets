# Khaalis Kitchen - Production Kitchen Essentials & Culinary Gadgets Storefront

A modern, responsive, high-performance e-commerce website for kitchen essentials, everyday cooking tools, and smart kitchen gadgets built with **React, TypeScript, Tailwind CSS, and Local Storage**, ready for production deployment on platforms such as Vercel, Netlify, or Cloud Run.

---

## 🌟 Key Features

1. **Comprehensive Product Catalog (42 Unique Products)**
   - 6 Specialized Kitchen Departments (7 products each):
     - **Kitchen Appliances** (Digital Vortex Air Fryer, Immersion Blender, Spice Grinder, Smart Pressure Cooker, etc.)
     - **Cooking Essentials** (Pre-Seasoned Cast Iron Skillet, 3-Ply Kadai, Hard-Anodized Tawa, Enameled Dutch Oven, etc.)
     - **Modern Kitchen Gadgets** (Gravity Electric Salt & Pepper Mills, USB Cordless Mini Chopper, Meat Thermometer, etc.)
     - **Food Storage & Organization** (Airtight Canisters, Masala Dabba, Rotating Lazy Susan, Bamboo Organizer, etc.)
     - **Kitchen Tools & Accessories** (Acacia End-Grain Butcher Board, Japanese Chef Knife, Silicone Utensils, Digital Scale, etc.)
     - **Cleaning & Dishwashing** (Roll-Up Over-Sink Drying Rack, Soap Dispenser Palm Brush, Swedish Dishcloths, etc.)
   - Real specifications (material, dimensions, capacity, voltage/power, warranty, care instructions)
   - Prices in Pakistani Rupees (PKR) formatted with tabular alignment
   - High-resolution imagery with graceful CSS/SVG fallback handlers

2. **Full-Featured E-Commerce Flow**
   - **Real-Time Search & Keywords**: Instant filtering by product title, material, and tags.
   - **Departmental Navigation**: Fast category filters with item counters.
   - **Price Range & Rating Filters**: Interactive slider and customer rating presets.
   - **Sorting Options**: By featured picks, price (low-to-high, high-to-low), customer rating, and newest arrivals.
   - **Product Detail Modal (PDP)**: Contiguous purchase module, stock counters, multi-image view, and related products recommendations.
   - **Video Tutorials & Chef Guides**: Responsive video players and step-by-step instructions for smart gadgets.

3. **Persistent LocalStorage State Management**
   - **Shopping Cart**: Real-time quantity adjustment, removal, and free shipping progress tracker (free delivery over PKR 3,500).
   - **Wishlist**: Quick-save favorite tools with one-click "Move to Cart".
   - **Discount Promo Codes**: Validated client-side codes (`KHAALIS10`, `COOKING2026`, `FIRSTORDER`).
   - **Order History & Tracking**: Simulated demo orders stored permanently in the customer's browser.
   - **Hydration Safe**: Zero SSR/client hydration mismatches.

4. **Dedicated Pakistani Checkout Experience**
   - **Pakistani Currency (PKR)** displayed across all components (`₨ 4,850`).
   - **Nationwide Coverage**: Preset selection for Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad, Multan, Peshawar, Quetta, and all districts.
   - **Form Validation**: Strict Pakistani phone number verification (`03xx-xxxxxxx` format).
   - **Payment Modes**: Cash on Delivery (COD) as primary option, plus Direct Bank Transfer and EasyPaisa/JazzCash instructions.
   - **Receipt & Tracking**: Instant generated Order ID (`PK-######`) with estimated delivery times.

5. **WhatsApp Click-to-Chat Integration**
   - Normalized contact number: `923126687237` (from `03126687237`).
   - **Floating WhatsApp Help**: Positioned non-intrusively on bottom-left so it never blocks checkout or navigation actions.
   - **Product Fast Order**: Prefilled inquiry messages with exact product names and quantities.
   - **Cart WhatsApp Dispatch**: Itemized order summary with line items, delivery fee, and grand total.
   - **Order Confirmation WhatsApp Link**: One-click confirmation dispatch to warehouse support.

6. **Mobile-First & Anti-Slop Design**
   - Fully tested across viewports (320px mobile to 1920px desktop).
   - Clean color palette inspired by modern kitchens (warm porcelain, forest sage `#2D5A46`, terracotta accents, charcoal text).
   - No generic AI cliches: zero static pill sandwiches, no fake telemetry tickers, no code-comment headings.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or 20+
- npm or pnpm

### Installation
```bash
# Clone the repository
git clone https://github.com/your-username/khaalis-kitchen.git
cd khaalis-kitchen

# Install dependencies
npm install
```

### Running Locally
```bash
# Start development server
npm run dev
```
Open `http://localhost:3000` in your browser.

### Building for Production
```bash
# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

### Verification & Linting
```bash
npm run lint
```

---

## 🚢 Deployment to Vercel / Netlify / Cloud Run

### Option 1: Vercel
1. Push your repository to GitHub.
2. Sign in to [Vercel](https://vercel.com) and click **Add New Project**.
3. Import your GitHub repository.
4. Set Build Command: `npm run build` and Output Directory: `dist`.
5. Click **Deploy**.

### Option 2: Netlify
1. Connect repository on Netlify.
2. Build Command: `npm run build`
3. Publish Directory: `dist`
4. Add a `_redirects` file in `public/` containing `/* /index.html 200` for client-side routing.

---

## 📋 Technology Stack
- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Storage**: Browser LocalStorage API
- **Deployment Compatibility**: Static SPA / Vercel / Netlify / Cloud Run / GitHub Pages

---

## ⚠️ Notes on Production Limitations
- **Local Storage Demonstration**: In this frontend build, cart items, customer shipping preferences, and demo orders are persisted to the user's browser `localStorage`.
- In a production corporate deployment with payment gateways (e.g., PayFast, Kuickpay, JazzCash Merchant API) and live inventory tracking, attach a backend API server (Express/PostgreSQL/Supabase/Firebase) with authenticated webhooks.
