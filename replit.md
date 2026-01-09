# FinSight - Financial News & Market Analysis Platform

## Overview

FinSight is a professional financial news and stock market analysis website built with a React frontend and Express backend. The platform provides market news, stock analysis, portfolio tools, and a content management system (CMS) for publishing articles. The design follows a clean, investor-friendly aesthetic with a green and white color theme, structured similarly to Trade Brains.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts for stock data visualization
- **Build Tool**: Vite with path aliases (@/, @shared/, @assets/)

The frontend follows a page-based architecture with shared components:
- Pages: Home, ArticleDetail, CategoryPage, MarketCategoryPage, Analytics, AdminCMS
- Layout components: Navbar (with dropdown navigation), Footer, StockTicker
- Article components: NewsCard for displaying market news
- UI components: Full shadcn/ui library (buttons, forms, dialogs, etc.)

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Replit Auth (OpenID Connect integration)
- **Session Storage**: PostgreSQL-backed sessions via connect-pg-simple
- **API Design**: RESTful endpoints defined in shared/routes.ts with Zod schemas

Key backend patterns:
- Typed API routes with input/output validation
- Storage abstraction layer (DatabaseStorage class implements IStorage interface)
- Auth middleware (isAuthenticated) for protected routes
- Shared schema between frontend and backend via @shared/schema

### Data Models
- **Articles**: Core content with title, slug, summary, content, category, subcategory, imageUrl, authorName, publishedAt, isFeatured, isEditorPick, tickerSymbol
- **Stocks**: Market data with symbol, name, price, change, changePercent, sector
- **Users/Sessions**: Replit Auth managed tables for authentication

### Content Management
The AdminCMS page provides authenticated users with:
- Article creation with category selection (maps to market segments)
- Edit and delete functionality for existing articles
- Featured/Editor's Pick toggles
- Auto-generated slugs from titles

## External Dependencies

### Database
- **PostgreSQL**: Primary database (DATABASE_URL environment variable required)
- **Drizzle ORM**: Type-safe database queries and migrations
- **Drizzle Kit**: Database schema management (db:push command)

### Authentication
- **Replit Auth**: OAuth/OpenID Connect provider
- Requires SESSION_SECRET environment variable
- Uses ISSUER_URL (defaults to https://replit.com/oidc)

### Frontend Libraries
- **@tanstack/react-query**: Data fetching and caching
- **shadcn/ui + Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first styling
- **Recharts**: Stock charts and data visualization
- **date-fns**: Date formatting utilities

### Build & Development
- **Vite**: Development server with HMR
- **esbuild**: Production bundling for server
- **TSX**: TypeScript execution for development
- Replit-specific plugins: runtime-error-modal, cartographer, dev-banner