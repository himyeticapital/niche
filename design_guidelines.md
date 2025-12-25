# EventHub Design Guidelines

## Design Approach
**Reference-Based**: Drawing from Airbnb's community discovery patterns, Eventbrite's event presentation, and Instagram's visual storytelling to create a warm, trust-building social marketplace that combats loneliness through authentic visual connection.

## Core Design Principles
1. **Community-First**: Every design decision reinforces genuine human connection
2. **Hyperlocal Clarity**: Distance and location must be immediately visible
3. **Trust Through Transparency**: Verification badges, ratings, and social proof prominent
4. **Frictionless Discovery**: Minimal clicks from browse to join

---

## Typography System

**Primary Font**: Inter (Google Fonts) - clean, modern, highly readable
**Secondary Font**: Space Grotesk (Google Fonts) - warm personality for headings

**Hierarchy**:
- Hero Headlines: Space Grotesk, 3.5rem (mobile: 2rem), font-weight 700
- Section Headings: Space Grotesk, 2.5rem (mobile: 1.75rem), font-weight 600
- Event Card Titles: Inter, 1.25rem, font-weight 600
- Body Text: Inter, 1rem, font-weight 400, line-height 1.6
- Small Labels: Inter, 0.875rem, font-weight 500
- Distance/Price Tags: Inter, 0.875rem, font-weight 600

---

## Layout & Spacing System

**Tailwind Spacing Units**: Consistently use 4, 6, 8, 12, 16, 20, 24, 32 units
- Component internal padding: p-4 to p-6
- Section spacing: py-16 to py-24 (desktop), py-12 (mobile)
- Card gaps: gap-6 to gap-8
- Form field spacing: space-y-4

**Grid System**:
- Event Cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Dashboard Metrics: grid-cols-2 lg:grid-cols-4
- Mobile-first: All layouts stack to single column on mobile

**Container Strategy**:
- Page containers: max-w-7xl mx-auto px-4
- Text content: max-w-3xl for readability
- Full-width map sections: w-full with inner controls max-w-7xl

---

## Component Library

### Navigation
- Sticky header with logo left, primary nav center, "Create Event" CTA right
- Mobile: Hamburger menu with slide-out drawer
- User avatar with dropdown (profile, dashboard, logout)
- Notification bell icon with unread count badge

### Event Cards (Critical Component)
**Structure**:
- Cover image (16:9 aspect ratio, rounded-lg)
- Category tag (top-left overlay with blur backdrop)
- Distance pill (top-right, bold with location pin icon)
- Title (2 lines max, truncate with ellipsis)
- Organizer info: Avatar + name + verification badge
- Date/time row with calendar icon
- Price + attendee count row
- Star rating with review count
- "Join" button (full-width, bold)

**Variants**:
- Default: Standard grid card
- Featured: Larger hero card for trending events
- List view: Horizontal layout for mobile/search results

### Map Integration
- Full-width interactive map section
- Custom pins with category-based icons
- Cluster markers for dense areas
- Distance radius overlay (semi-transparent circle)
- Bottom sheet with event cards on pin click

### Trust Indicators (Prominent Throughout)
- Verified organizer badge: Checkmark icon in circle
- Rating stars: Filled/outlined, with count "(47 reviews)"
- Attendee count: User group icon + "23 joined"
- Safety features: Shield icon with "Bring a Friend" text
- Response badges: "Usually replies in 2hrs"

### Forms & Input Fields
- Generous padding: p-4 on all inputs
- Clear labels above fields (font-weight 500)
- Helper text below in smaller gray text
- Error states with red border + icon
- Success states with green checkmark
- Multi-step forms: Progress bar at top

### Organizer Dashboard
- Sidebar navigation: Icons + labels (collapsible on mobile)
- Metric cards: Large numbers with trend arrows
- Revenue chart: Simple line graph
- Attendee table: Sortable, searchable, exportable
- Quick actions: Sticky floating action button

### Community Features
- Photo grid: Masonry layout for event photos
- Review cards: Avatar + name + stars + text + timestamp
- Activity feed: Timeline with icons for actions
- Group chat invitation: WhatsApp-style message bubble

### CTAs & Buttons
- Primary: Bold, full-width on mobile, auto-width on desktop
- Secondary: Outlined variant with transparent background
- Destructive: Red for cancellations/deletions
- Icon buttons: Circular for favorites, share, etc.
- Floating action button: Bottom-right for "Create Event" (mobile)

---

## Landing Page Structure

**Hero Section** (80vh):
- Large hero image: Community event photo (people connecting, active, warm)
- Centered headline: "Find Your Community Within 5km"
- Subheadline: Combat loneliness through hyperlocal niche events
- Two CTAs: "Discover Events" (primary) + "Create Event" (secondary)
- Buttons with blur backdrop for readability

**Trust Bar**:
- Single row with key metrics: "10,000+ Events" | "50+ Cities" | "4.8★ Average Rating"

**How It Works** (3 columns):
- Visual icons for: Discover → Join → Connect
- Short descriptions under each

**Trending Events Grid**:
- 6 featured event cards in 3-column grid
- "Happening Near You" section title
- Map view toggle button

**For Organizers**:
- Two-column split: Left (benefits list), Right (organizer dashboard preview image)
- Revenue highlight: "Organizers earn ₹500-₹1000 per event"

**Safety & Trust**:
- 4-column grid: Verification badges | Ratings | SOS Button | Moderation
- Shield visual motif

**Category Showcase**:
- Horizontal scroll of category pills with icons
- Running, Hiking, Dog Parents, Board Games, etc.

**Social Proof**:
- 3 testimonial cards with photos, quotes, names
- Attendee and organizer testimonials mixed

**Final CTA**:
- Full-width section with gradient backdrop
- "Start Building Your Community Today"
- Dual CTAs again

**Footer**:
- 4-column grid: About | Categories | For Organizers | Support
- Social media icons
- Newsletter signup inline
- Trust badges (payment security, verified platform)

---

## Images

**Hero Image**: Vibrant community event photo - diverse group of people laughing/connecting at outdoor activity (hiking, running, or dog park). Warm tones, genuine emotion, inclusive representation. Position: Full-width background with overlay gradient.

**Organizer Dashboard Preview**: Screenshot-style mockup showing revenue graph, attendee list, and metrics. Clean, professional aesthetic.

**Event Cards Throughout**: Each event card requires cover image - activities in action (running groups mid-stride, board game tables, dog park scenes). Authentic, user-generated feel preferred over stock photography.

**Category Icons**: Use Heroicons for all category badges (Map, Users, Heart, Camera, Book, etc.)

**Testimonial Photos**: Circular avatar images of real users (diverse ages, backgrounds)

**Safety Section**: Illustrated icons for verification, ratings, SOS features - simplified, friendly style

---

## Animations
**Minimal & Purposeful**:
- Card hover: Subtle lift (translate-y-1) + shadow increase
- Button hover: Slight scale (1.02)
- Map pin bounce on first load
- Skeleton loaders during content fetch
- NO scroll-triggered animations, NO parallax