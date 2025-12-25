# Jum - Hyperlocal Social Event Marketplace

## Overview
Jum is a hyperlocal social marketplace that combats urban loneliness by enabling real-world discovery of niche interest groups within a 5km radius. Unlike generic event platforms, Jum focuses on authentic community building through passion-based hyperlocal events.

**MVP Trial Location**: Gangtok, Sikkim
**Expansion Markets**: Bangalore, Pune, Hyderabad, Mumbai (Tier 1 Indian cities)

## Recent Changes
- **Dec 25, 2025**: Payment functionality disabled for initial launch
  - All events can be joined directly without payment
  - Razorpay integration code preserved in backend for future activation
  - Simple registration flow with name only required
- **Dec 25, 2025**: Bug fixes and improvements
  - Fixed TanStack Query key format in landing page (was causing 404 errors)
  - Added validation for join and review API endpoints
  - Added seed data for attendees to populate dashboard stats
  - All end-to-end tests passing
- **Dec 25, 2025**: Initial MVP implementation
  - Full landing page with hero, trust bar, how it works, trending events, categories, testimonials
  - Event discovery with filtering, search, and multiple view modes
  - Event detail page with join functionality
  - Multi-step event creation form
  - Organizer dashboard with metrics

## Project Architecture

### Frontend (React + TypeScript)
```
client/src/
├── components/
│   ├── ui/              # Shadcn components
│   ├── header.tsx       # Main navigation header
│   ├── footer.tsx       # Site footer with newsletter
│   ├── event-card.tsx   # Reusable event card component
│   ├── category-pill.tsx # Category filter buttons
│   ├── star-rating.tsx  # Star rating display/input
│   ├── trust-badge.tsx  # Verification badges
│   └── theme-toggle.tsx # Dark/light mode toggle
├── pages/
│   ├── landing.tsx      # Homepage with hero & featured events
│   ├── events.tsx       # Event discovery with filters
│   ├── event-detail.tsx # Single event view
│   ├── create-event.tsx # Multi-step event creation
│   └── dashboard.tsx    # Organizer dashboard
├── hooks/
│   └── use-toast.ts     # Toast notifications
├── lib/
│   ├── queryClient.ts   # TanStack Query setup
│   └── utils.ts         # Utility functions
└── App.tsx              # Main app with routing
```

### Backend (Express + TypeScript)
```
server/
├── routes.ts            # API endpoints
├── storage.ts           # In-memory data storage
├── index.ts             # Server entry point
└── vite.ts              # Vite dev server integration

shared/
└── schema.ts            # Shared types and schemas (Drizzle + Zod)
```

### API Endpoints
- `GET /api/events` - List all events with optional filters
- `GET /api/events/:id` - Get single event
- `POST /api/events` - Create new event
- `PATCH /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event
- `POST /api/events/:id/join` - Join an event (free events)
- `POST /api/events/:id/checkout` - Create Stripe checkout session (paid events)
- `POST /api/events/:id/verify-payment` - Verify payment and register attendee
- `GET /api/events/:id/attendees` - Get event attendees
- `GET /api/events/:id/reviews` - Get event reviews
- `POST /api/events/:id/reviews` - Add review
- `GET /api/organizer/dashboard` - Get dashboard stats
- `GET /api/categories` - List all categories
- `GET /api/stripe/config` - Get Stripe publishable key

## Design System
- **Fonts**: Inter (body), Space Grotesk (headings)
- **Primary Color**: Purple (hsl 262 83% 58%)
- **Approach**: Clean, warm, community-focused design
- **Components**: Uses Shadcn UI component library

## Key Features
1. **Hyperlocal Discovery** - Events within 5km radius
2. **Niche Categories** - Running, Hiking, Dog Parents, Board Games, etc.
3. **Trust System** - Verified organizers, ratings, reviews
4. **Event Creation** - Multi-step form with recurring support
5. **Organizer Dashboard** - Revenue tracking, attendee management
6. **Dark Mode** - Full light/dark theme support

## User Preferences
- Modern, clean design with warm community feel
- Mobile-first responsive approach
- Focus on genuine human connection
- No emoji in UI, use icons instead
- **Dashboard feature is a priority** - User loves the organizer dashboard and wants it enhanced in future iterations
- **Color scheme is a favorite** - User loves the purple primary color palette (hsl 262 83% 58%) and wants it preserved

## Priority Features for Future Iterations
1. **Dashboard** - Enhanced analytics, more detailed metrics, improved visualizations
2. **Color Scheme** - Keep the purple primary palette, community-focused warm aesthetic

## Development Commands
- `npm run dev` - Start development server
- Frontend runs on port 5000 via Vite

## Data Model
- **Users**: Organizers and attendees
- **Events**: Community gatherings with location, pricing, capacity
- **Attendees**: Event registrations
- **Reviews**: Post-event feedback
