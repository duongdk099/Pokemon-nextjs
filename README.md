# 🎓 Student Directory - Pokemon Next.js Application

A modern, feature-rich student directory application built with Next.js 16, TypeScript, and React Query. Browse, compare, and analyze Pokemon stats with a beautiful, responsive interface and comprehensive data visualization tools.

![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=flat-square&logo=typescript)
![React Query](https://img.shields.io/badge/React%20Query-5.90-red?style=flat-square&logo=react-query)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

## ✨ Features

### 🎯 Core Functionality
- **Infinite Scroll Pagination** - Seamlessly load more Pokemon as you scroll
- **Advanced Filtering** - Search by name and filter by multiple types simultaneously
- **Smart Search** - Real-time search with debouncing for optimal performance
- **Responsive Design** - Beautiful UI that works on all devices

### 🌙 UI/UX Features
- **Dark Mode** - Toggle between light and dark themes with persistent storage
- **Grid/List View** - Switch between compact grid and detailed list layouts
- **Skeleton Loading** - Smooth loading states with animated placeholders
- **Glassmorphism Design** - Modern frosted glass effects throughout

### ⭐ Advanced Features
- **Favorites System** - Mark and filter favorite Pokemon with localStorage persistence
- **Comparison Tool** - Select 2-3 Pokemon for side-by-side stat comparison with radar charts
- **Stats Radar Charts** - Visual representation of all six stats (HP, Attack, Defense, Sp. Attack, Sp. Defense, Speed)
- **Stat Leaderboards** - View top 10 Pokemon by each stat category with rankings (🥇🥈🥉)
- **Sort Options** - Sort by ID, Name, HP, Attack, Defense, or Speed
- **CSV Export** - Download current filtered/sorted data with all stats

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0 or higher
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/duongdk099/Pokemon-nextjs.git
cd Pokemon-nextjs
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Run the development server**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
src/
├── components/
│   ├── ComparisonTool.tsx      # Side-by-side Pokemon comparison modal
│   ├── DarkModeToggle.tsx      # Theme toggle button
│   ├── Filters.tsx             # Search and type filter component
│   ├── Leaderboards.tsx        # Stat leaderboards modal
│   ├── PokemonCard.tsx         # Pokemon card with grid/list variants
│   └── StatsRadarChart.tsx     # SVG radar chart for stats
├── lib/
│   └── api.ts                  # API client and data fetching logic
├── pages/
│   ├── _app.tsx                # App wrapper with providers (React Query, Contexts)
│   ├── index.tsx               # Home page with infinite scroll
│   └── pokemon/
│       └── [id].tsx            # Dynamic Pokemon detail page
├── styles/
│   ├── comparison.module.css   # Comparison tool styles
│   ├── darkModeToggle.module.css
│   ├── filters.module.css
│   ├── globals.css             # Global styles and CSS variables
│   ├── home.module.css         # Home page styles
│   ├── leaderboards.module.css
│   ├── pokemonCard.module.css  # Card styles for both views
│   ├── pokemonDetail.module.css
│   └── radarChart.module.css
└── types/
    └── index.ts                # TypeScript interfaces and types
```

## 🛠️ Technologies & Libraries

### Core Stack
- **[Next.js 16](https://nextjs.org/)** - React framework with server-side rendering
- **[TypeScript 5.9](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[React 19](https://react.dev/)** - UI library

### Data Management
- **[TanStack Query (React Query) 5.90](https://tanstack.com/query/latest)** - Powerful data fetching and caching
- **[Axios 1.13](https://axios-http.com/)** - HTTP client for API requests

### Styling
- **CSS Modules** - Component-scoped styling
- **Custom CSS** - Handcrafted animations and transitions

### State Management
- **React Context API** - Global state for dark mode, favorites, and comparison
- **localStorage** - Client-side data persistence

## 🎮 Usage Guide

### Basic Navigation
1. **Browse Pokemon** - Scroll through the grid to load more Pokemon automatically
2. **Search** - Use the search bar to find Pokemon by name
3. **Filter by Type** - Select one or multiple types to narrow results
4. **Toggle Dark Mode** - Click the sun/moon icon in the top-right corner

### Advanced Features

#### Favorites ⭐
- Click the heart icon on any Pokemon card to add/remove from favorites
- Click "Show Favorites" button to view only your favorite Pokemon
- Favorites are saved in localStorage and persist across sessions

#### Comparison Tool 🔍
1. Click "Compare Students" to enter comparison mode
2. Select 2-3 Pokemon by clicking their cards
3. View side-by-side comparison with:
   - Basic info (name, ID, types)
   - All six stats with progress bars
   - Radar charts for visual comparison
4. Click "Clear Selection" to start over

#### View Modes 📋
- **Grid View** - Compact cards showing image, name, ID, and types
- **List View** - Horizontal cards with inline stats display

#### Sorting 🔢
Sort Pokemon by:
- ID (default)
- Name (A-Z)
- HP (highest first)
- Attack (highest first)
- Defense (highest first)
- Speed (highest first)

#### Leaderboards 🏆
- Click "Leaderboards" to view top 10 Pokemon for each stat
- Six categories: HP, Attack, Defense, Sp. Attack, Sp. Defense, Speed
- Medal icons for top 3 (🥇🥈🥉)
- Click any Pokemon to view their detail page

#### Export Data 💾
- Click "Export CSV" to download current data
- Respects active filters, favorites, and sort order
- Includes all stats in spreadsheet format

## 🎨 Design Features

### Color Scheme
- **Light Mode**: Clean whites with gradient accents (#667eea → #764ba2)
- **Dark Mode**: Deep grays (#1a202c, #2d3748) with blue accents (#90cdf4)

### Animations
- Smooth transitions on all interactive elements
- Heartbeat animation for favorite icons
- Card hover effects with transform and shadow
- Fade-in and slide-up animations for modals
- Loading skeleton pulse animations

### Type Colors
Each Pokemon type has its own color:
- Fire: #ef5350, Water: #4fc3f7, Grass: #66bb6a
- Electric: #ffd54f, Psychic: #ba68c8, Ice: #81d4fa
- Dragon: #7e57c2, Dark: #5d4037, Fairy: #f48fb1
- And more...

## 🔧 Configuration

### API Endpoint
The application uses the Pokemon API at `https://nestjs-pokedex-api.vercel.app/`

To change the API endpoint, edit `src/lib/api.ts`:
```typescript
const API_BASE_URL = 'https://your-api-endpoint.com';
```

### Pagination Limits
Default: 50 Pokemon per page. Adjustable in the UI (10, 25, 50, 100).

### Cache Configuration
React Query cache settings in `src/pages/_app.tsx`:
- **staleTime**: 5 minutes
- **gcTime**: 10 minutes

## 📦 Build & Deployment

### Production Build
```bash
npm run build
npm start
```

### Deploy to Vercel
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/duongdk099/Pokemon-nextjs)

1. Push your code to GitHub
2. Import project to Vercel
3. Vercel will automatically detect Next.js and configure build settings
4. Deploy!

### Environment Variables
No environment variables required for basic functionality.

## 🐛 Troubleshooting

### Common Issues

**Pokemon images not loading**
- Check network connection
- Verify API endpoint is accessible
- Clear browser cache

**Dark mode not persisting**
- Ensure localStorage is enabled in your browser
- Check browser privacy settings

**Infinite scroll not working**
- Verify JavaScript is enabled
- Check console for errors
- Try refreshing the page

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Pokemon data provided by [NestJS Pokedex API](https://nestjs-pokedex-api.vercel.app/)
- Built with [Next.js](https://nextjs.org/)
- Powered by [TanStack Query](https://tanstack.com/query/latest)

## 📧 Contact

**Duong DK** - [@duongdk099](https://github.com/duongdk099)

Project Link: [https://github.com/duongdk099/Pokemon-nextjs](https://github.com/duongdk099/Pokemon-nextjs)

---

Made with ❤️ using Next.js and TypeScript
