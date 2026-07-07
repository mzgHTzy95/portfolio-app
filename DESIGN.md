# Portfolio Design System

## Overview
This portfolio features a **minimal, monochrome professional** design that prioritizes typography, whitespace, and clean structure over decorative elements.

## Design Principles

### Color Palette
- **Monochrome Only**: Grayscale colors exclusively
- **Primary Background**: White (light) / Very Dark Gray (dark)
- **Text Colors**: Black/Dark Gray (light) / Off-white (dark)
- **Accents**: Subtle gray borders and dividers
- **No Brand Colors**: All accent colors removed for minimalist aesthetic

### Typography
- **Font Family**: Geist (primary), Geist Mono (code)
- **Font Weights Used**: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)
- **Hierarchy**:
  - Hero Title: 5xl/6xl font-bold
  - Section Titles: 2xl font-semibold
  - Body Text: base/lg text-muted-foreground
  - Metadata: xs/sm text-muted-foreground

### Layout & Spacing
- **Maximum Width**: 42rem (672px) - narrow, focused reading width
- **Vertical Gaps**: 20px (gap-5), 24px (gap-6), etc.
- **Padding**: Minimal, respects content breathing room
- **Breakpoints**: Mobile-first responsive design

## Component Design Patterns

### Sections
- No card-based layouts
- Borders used sparingly (bottom borders for list items only)
- Whitespace as primary design element
- Left-aligned content hierarchy

### Navigation
- Simple text-based navigation in hero
- Subtle hover states (underline transitions)
- No colored badges or pills

### Projects Section
- List format, not cards
- Project title + description + tech stack
- Date on the right side
- Hover underline effect
- Border bottom dividers between items

### Contact Section
- Simple form with minimal styling
- Text inputs with thin borders
- Black submit button on white background
- Clean feedback messages without colors

### Work & Education
- Accordion functionality preserved
- Monochrome styling
- No icons or logos (kept for functionality)
- Simple text-based display

## Removed Elements
- Blur fade animations (except kept in components)
- Flickering grid backgrounds
- Colored badges and pills
- Avatar section in hero
- Colored status indicators
- Rounded corners (minimal)
- Box shadows (except subtle)
- All decorative elements

## File Structure
```
src/
├── app/
│   ├── layout.tsx (root layout, removed grid background)
│   ├── page.tsx (main page, simplified sections)
│   └── globals.css (monochrome color variables)
├── components/
│   └── section/
│       ├── projects-section.tsx (redesigned as list)
│       ├── contact-section.tsx (minimal form)
│       ├── work-section.tsx (kept accordion)
│       └── education-section.tsx (minimal list)
└── data/
    └── resume.tsx (unchanged)
```

## Accessibility Considerations
- High contrast text (black on white / off-white on dark)
- Semantic HTML maintained
- Keyboard navigation supported
- Focus states clearly visible
- Alt text on images

## Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile responsive (320px and up)
- Dark mode support with system preference detection

## Future Enhancement Ideas
- Add subtle animations on scroll
- Implement smooth transitions
- Add breadcrumb navigation
- Create alternate minimal theme variations
- Add print-friendly stylesheet
