# Garum - Hyperlocal Social Event Marketplace

Garum is a hyperlocal social marketplace that combats urban loneliness by enabling real-world discovery of niche interest groups within a 5km radius.

**MVP Trial Location**: Gangtok, Sikkim  
**Expansion Markets**: Bangalore, Pune, Hyderabad, Mumbai (Tier 1 Indian cities)

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, TailwindCSS, Shadcn UI
- **Backend**: Express.js, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Replit Auth (OpenID Connect)

## Local Development Setup

### Prerequisites

- Node.js 18+ (recommended: Node.js 20)
- PostgreSQL 14+
- npm or yarn

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/garum.git
cd garum
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up PostgreSQL Database

Create a new PostgreSQL database:

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE garum;

# Create user (optional)
CREATE USER garum_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE garum TO garum_user;
```

### 4. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Database connection
DATABASE_URL=postgresql://garum_user:your_password@localhost:5432/garum

# Session secret (generate a random string)
SESSION_SECRET=your-super-secret-session-key-here

# Replit-specific (for local dev, you can use mock values)
REPLIT_DEPLOYMENT=
REPL_ID=local-dev
REPL_OWNER=local
REPL_SLUG=garum
ISSUER_URL=

# Optional: Razorpay (payments disabled for MVP)
# RAZORPAY_KEY_ID=your_key_id
# RAZORPAY_KEY_SECRET=your_key_secret
```

### 5. Push Database Schema

Run Drizzle migrations to create the database tables:

```bash
npm run db:push
```

### 6. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5000`

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Run production build |
| `npm run check` | TypeScript type checking |
| `npm run db:push` | Push schema changes to database |

## Project Structure

```
garum/
├── client/                 # Frontend React application
│   └── src/
│       ├── components/     # Reusable UI components
│       ├── pages/          # Page components
│       ├── hooks/          # Custom React hooks
│       └── lib/            # Utilities and query client
├── server/                 # Backend Express application
│   ├── routes.ts           # API endpoints
│   ├── storage.ts          # Data storage interface
│   ├── db-storage.ts       # PostgreSQL storage implementation
│   └── db.ts               # Database connection
├── shared/                 # Shared types and schemas
│   └── schema.ts           # Drizzle schema and Zod validators
└── package.json
```

## API Endpoints

### Events
- `GET /api/events` - List all events (with optional filters)
- `GET /api/events/:id` - Get single event
- `POST /api/events` - Create new event
- `PATCH /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

### Event Participation
- `POST /api/events/:id/join` - Join an event
- `GET /api/events/:id/attendees` - Get event attendees
- `GET /api/events/:id/reviews` - Get event reviews
- `POST /api/events/:id/reviews` - Add review

### Dashboard
- `GET /api/organizer/dashboard` - Get organizer dashboard stats
- `GET /api/organizer/attendees` - Get organizer's attendees

### Categories
- `GET /api/categories` - List all categories

## Authentication Note

This app uses Replit Auth for authentication in production. For local development without Replit:

1. The auth routes (`/api/login`, `/api/logout`, `/api/auth/user`) require the Replit environment
2. For local testing, you may need to mock the authentication or implement a local auth strategy
3. The `useAuth` hook in `client/src/hooks/use-auth.tsx` handles auth state

## Design System

- **Primary Color**: Purple (hsl 262 83% 58%)
- **Fonts**: Inter (body), Space Grotesk (headings)
- **Components**: Shadcn UI with custom theming
- **Icons**: Lucide React

## Key Features

1. **Event Discovery** - Browse local events with filtering by category, price, date
2. **Event Creation** - Multi-step form for organizers to create events
3. **Organizer Dashboard** - Revenue tracking, attendee management, analytics
4. **Trust System** - Verified organizers, ratings, and reviews
5. **Dark Mode** - Full light/dark theme support

## Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Test locally
4. Submit a pull request

## License

MIT
