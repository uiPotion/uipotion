---
layout: 'potion'
title: 'Landing Page Layout (Marketing)'
publicationDate: '2026-01-24'
excerpt: 'A conversion-optimized marketing landing page layout with hero section, feature highlights, social proof, and multiple CTAs. Perfect for product launches, SaaS marketing, and lead generation campaigns.'
category: 'Layouts'
tags:
  - layouts
  - landing-page
  - marketing
  - hero
  - feature-highlights
  - testimonials
  - cta
  - responsive
  - conversion
agentManifest: 'potions/layouts/landing-page.json'
path: 'potions/layouts/landing-page'
---

# Landing Page Layout (Marketing)

A conversion-optimized marketing landing page layout with hero section, feature highlights, social proof, and strategic CTAs. Perfect for product launches, SaaS marketing, and lead generation campaigns.

## Structure Specification

### Layout Hierarchy

The layout consists of a sequential stack of sections: Navbar (fixed at top) → Hero Section (above the fold) → Features Section (3-4 grid cards) → Testimonials Section (social proof) → Final CTA Section → Footer. The entire page scrolls naturally with no nested scroll containers.

## Detailed Component Specifications

### 1. Navbar Component

**Dimensions:**
- Height: 64px (fixed)
- Padding: 24-32px horizontal
- Position: Fixed at top

**States:**
- `default` (initial state)
- `scrolled` (after scrolling past threshold)

**Elements:**

#### Logo
- Height: 32-40px
- Position: Left-aligned
- Links to homepage

#### Navigation Links
- Display: Horizontal on desktop, hamburger menu on mobile
- Font size: 14-16px
- Gap: 24-32px between links

#### CTA Button
- Height: 40-44px
- Padding: 12-16px horizontal
- Position: Right-aligned

**Behavior:**
- **Optional Scroll Transition**: Background changes from transparent to solid after scrolling 50px
- **Duration**: 300ms smooth transition
- **Mobile Menu**: Below 768px, navigation collapses to hamburger icon
  - Opens as fullscreen overlay or slide-in drawer
  - Dismissible via backdrop click or close button

**CRITICAL - Mobile Menu Reliability:**

To ensure the mobile hamburger menu works consistently:

1. **DOM Ready**: Attach event listeners only after DOM is fully loaded (`DOMContentLoaded` event or use `defer` on script tag)
2. **Z-Index Hierarchy**: 
   - Hamburger button: `z-index: 60` (higher than navbar)
   - Navbar: `z-index: 50`
   - Mobile menu overlay: `z-index: 100`
3. **Touch Targets**: Button must be minimum 44x44px (better: 48x48px) for reliable touch interaction
4. **Pointer Events**: Button must have `pointer-events: auto` and `cursor: pointer`
5. **Event Propagation**: Use `event.stopPropagation()` on button click to prevent conflicts with document-level click handlers
6. **Click Events**: Use `click` event (works for both touch and mouse) rather than separate touch event handlers
7. **State Management**: Track menu state (boolean flag or CSS class) to prevent race conditions
8. **Visibility**: Ensure button is `display: flex` on mobile and `display: none` on desktop (≥768px)

**Common Issues & Fixes:**
- **Button not clickable**: Check z-index, pointer-events, ensure no transparent overlays
- **Intermittent failure**: Event listener attaching before DOM ready
- **Works in DevTools but not on device**: Touch target too small
- **Menu closes immediately**: Document click handler firing too soon, use stopPropagation
- **Button disappears on scroll**: Check navbar transition affecting button visibility

**Testing Requirements:**
- Test on actual iOS device (Safari)
- Test on actual Android device (Chrome)
- Test multiple rapid clicks
- Test after scrolling page
- Test after resizing window
- Check browser console for errors

### 2. Hero Section

**Dimensions:**
- Min-height: 600px (desktop), 500px (mobile)
- Padding: 96-120px vertical (desktop), 60-80px (mobile)
- Padding: 24-32px horizontal
- Content max-width: 1200px (centered)

**Layout:**
- Mobile: Single column, stacked (headline → subheadline → CTAs → media)
- Desktop: Two-column with 50/50 or 60/40 split (text left, media right)

**Elements:**

#### Headline
- Font size: 48-64px (desktop), 32-40px (mobile)
- Font weight: 700-900 (bold/black)
- Line height: 1.1-1.2
- Max-width: 800px
- Margin-bottom: 24px
- Color: High contrast (dark on light, light on dark)

#### Subheadline
- Font size: 18-24px (desktop), 16-20px (mobile)
- Font weight: 400 (regular)
- Line height: 1.5-1.6
- Max-width: 700px
- Margin-bottom: 32px
- Color: Medium contrast (slightly muted)

#### CTA Group
- Layout: Horizontal (desktop), vertical (mobile)
- Gap: 16px between buttons
- Margin-bottom: 48px

#### Primary CTA Button
- Height: 48-56px
- Padding: 16-24px horizontal
- Font size: 16-18px
- Font weight: 500-600
- Border radius: 8-12px
- Background: Brand primary color (high saturation)
- Text: White or high contrast
- Hover: Darken 10-15% or increase shadow

#### Secondary CTA Button
- Height: 48-56px
- Padding: 16-24px horizontal
- Font size: 16-18px
- Font weight: 500
- Style: Outlined or ghost button (lower visual weight)
- Hover: Light background fill or darken border

#### Hero Media
- Type: Image, video, or illustration
- Width: 100% (mobile), 50-60% (desktop)
- Aspect ratio: 16:9 or 4:3
- Position: Below CTAs (mobile), right side (desktop)
- Loading: Eager (above fold, no lazy loading)

**Background Options:**
- Solid color (white, light gray, or brand color at 5-10% opacity)
- Gradient (brand colors, subtle)
- Image with overlay (40-60% dark overlay for text readability)
- Video background with text overlay

### 3. Features Section

**Dimensions:**
- Padding: 96-120px vertical (desktop), 60-80px (mobile)
- Padding: 24-32px horizontal
- Content max-width: 1200px (centered)

**Elements:**

#### Section Heading
- Font size: 32-40px (desktop), 24-32px (mobile)
- Font weight: 600-700
- Text align: Center
- Margin-bottom: 48px

#### Feature Grid
- Columns: 3-4 (desktop ≥1024px), 2 (tablet 768-1023px), 1 (mobile <768px)
- Gap: 32px (desktop), 24px (mobile)
- Implementation: CSS Grid or Flexbox

#### Feature Card
- Padding: 32-40px
- Border radius: 12-16px
- Background: White or subtle card background
- Shadow: Subtle (optional)
- Border: Optional 1px subtle border

#### Feature Icon
- Size: 48-64px
- Margin-bottom: 16px
- Color: Primary or accent color

#### Feature Title
- Font size: 18-20px
- Font weight: 600
- Margin-bottom: 12px

#### Feature Description
- Font size: 14-16px
- Line height: 1.5-1.6
- Color: Muted text color (medium gray)

**Behavior:**
- Responsive grid auto-adjusts columns based on breakpoint
- Optional: Subtle lift or shadow increase on card hover
- Optional: Fade in + slide up animation when scrolling into viewport (staggered 100-150ms)

### 4. Testimonials Section

**Dimensions:**
- Padding: 96-120px vertical (desktop), 60-80px (mobile)
- Padding: 24-32px horizontal
- Content max-width: 1200px (centered)

**Variants:**
- **Option A**: Customer testimonials with quotes
- **Option B**: Client logo grid (social proof via brand recognition)

**Elements (Testimonials Variant):**

#### Section Heading
- Font size: 32-40px (desktop), 24-32px (mobile)
- Font weight: 600-700
- Text align: Center
- Margin-bottom: 48px

#### Testimonial Grid
- Columns: 3 (desktop ≥1024px), 2 (tablet 768-1023px), 1 (mobile <768px)
- Gap: 32px (desktop), 24px (mobile)

#### Testimonial Card
- Padding: 32-40px
- Border radius: 12-16px
- Background: White or subtle card background

#### Quote
- Font size: 16-18px
- Line height: 1.6-1.7
- Font style: Italic (optional)
- Margin-bottom: 24px

#### Author Info
- Layout: Horizontal (avatar + name + title)

#### Avatar
- Size: 48-56px
- Border radius: 50% (circle)
- Margin-right: 16px

#### Author Name
- Font size: 14-16px
- Font weight: 600

#### Author Title
- Font size: 14px
- Color: Muted text color

**Behavior:**
- Optional: Fade in animation when entering viewport

### 5. Final CTA Section

**Dimensions:**
- Padding: 96-120px vertical (desktop), 60-80px (mobile)
- Padding: 24-32px horizontal
- Content max-width: 800px (centered)

**Elements:**

#### CTA Headline
- Font size: 32-48px (desktop), 24-32px (mobile)
- Font weight: 700
- Text align: Center
- Margin-bottom: 16px

#### CTA Subtext
- Font size: 16-18px
- Text align: Center
- Margin-bottom: 32px

#### CTA Button
- Height: 48-56px
- Padding: 20-28px horizontal
- Font size: 16-18px
- Font weight: 600
- Display: Centered

**Behavior:**
- Background: Accent color or gradient for visual emphasis
- Links to signup, demo, or pricing page

### 6. Footer Component

**Dimensions:**
- Padding: 48-64px vertical
- Padding: 24-32px horizontal
- Content max-width: 1200px (centered)

**Elements:**

#### Footer Links
- Layout: Grid or horizontal list
- Columns: 4 (desktop), 2 (tablet), 1 (mobile)
- Gap: 24-32px
- Font size: 14-16px

#### Link Groups
- Structure: Category heading + list of links
- Categories: Product, Company, Resources, Support (examples)

#### Social Links
- Layout: Horizontal row
- Icon size: 20-24px
- Gap: 16px between icons

#### Copyright
- Font size: 14px
- Text align: Center or left
- Color: Muted text color

**Behavior:**
- Border-top: 1px solid subtle divider
- Background: Subtle (light gray) or match body background

## Responsive Breakpoints

### Desktop (≥1024px)
- Hero: Two-column layout (text left, media right), 50/50 or 60/40 split
- Features: 3-4 column grid
- Testimonials: 3 column grid
- Navbar: Full navigation links visible
- Footer: 4 column grid
- CTA Group: Horizontal buttons

### Tablet (768px - 1023px)
- Hero: Two-column or stacked (depends on design preference)
- Features: 2 column grid
- Testimonials: 2 column grid
- Navbar: Hamburger menu or condensed nav
- Footer: 2 column grid

### Mobile (<768px)
- Hero: Single column, fully stacked
- Features: 1 column stack
- Testimonials: 1 column stack
- Navbar: Hamburger menu
- Footer: 1 column stack
- CTA Group: Vertical stacking instead of horizontal

### Window Resize Handling
- **Debounce**: 200ms recommended
- **Behavior**: Re-evaluate grid columns on resize
- **Implementation**: CSS Grid auto-adjusts, no JavaScript needed unless dynamic state management required

## Interaction Patterns

### Navbar Scroll Transition (Optional)
1. User scrolls down the page
2. When `window.scrollY > 50px`, navbar transitions state
3. Background: transparent → solid (white or brand color)
4. Shadow: none → subtle shadow
5. Duration: 300ms smooth transition
6. On scroll back up, reverses transition

### Hero CTA Actions
1. Primary CTA: Links to signup, trial, or main conversion action
2. Secondary CTA: Links to demo, features, or learn more page
3. Both buttons keyboard accessible (Tab + Enter)

### Mobile Menu
1. User taps hamburger icon
2. Menu opens as fullscreen overlay or slide-in drawer
3. Backdrop appears with semi-transparent overlay
4. User can close via:
   - Close button (X icon)
   - Backdrop click
   - Escape key
5. Menu closes with smooth animation

### Scroll-Triggered Animations (Optional)
1. Elements start invisible or translated down (off-screen)
2. Intersection Observer detects when element enters viewport
3. Animation triggers: fade in + slide up
4. Stagger delay: 100-150ms between cards in same section
5. Respects `prefers-reduced-motion` (disables animations)

## Accessibility Requirements

### WCAG 2.1 Compliance (Level AA Target)

This landing page layout should meet WCAG 2.1 Level AA standards. Key requirements:

- **1.1.1 Non-text Content**: All images have descriptive alt text, decorative images have `alt=""`
- **1.3.1 Info and Relationships**: Use semantic HTML5 elements (`<header>`, `<main>`, `<section>`, `<footer>`)
- **1.4.3 Contrast Minimum**: 4.5:1 for normal text, 3:1 for large text and UI components (verify CTAs)
- **2.1.1 Keyboard**: All CTAs and links keyboard accessible (Tab, Enter/Space to activate)
- **2.4.2 Page Titled**: Descriptive page title in `<title>` tag
- **2.4.4 Link Purpose**: Descriptive CTA text (avoid generic "Click Here" or "Learn More" without context)
- **2.4.7 Focus Visible**: Clear focus indicators on all interactive elements
- **4.1.2 Name, Role, Value**: All buttons and links have accessible names

### Keyboard Navigation

**Tab Order:**
- Navbar links and CTA → Hero CTAs → Feature links (if any) → Testimonial links (if any) → Final CTA → Footer links

**Implementation:**
- All interactive elements: Tab to focus, Enter/Space to activate
- Escape key: Close mobile menu

### ARIA Attributes

**Required ARIA Attributes:**

1. **Main Content:**
   ```html
   <main id="main-content" role="main">
   ```

2. **Sections:**
   ```html
   <section aria-labelledby="features-heading">
     <h2 id="features-heading">Features</h2>
   </section>
   ```

3. **CTA Buttons:**
   ```html
   <button aria-label="Start your free 14-day trial">Get Started Free</button>
   ```

4. **Hero Media:**
   ```html
   <!-- Descriptive image -->
   <img src="hero.jpg" alt="Product dashboard showing real-time analytics, user management, and reporting features" loading="eager" />
   
   <!-- Decorative image -->
   <img src="pattern.svg" alt="" role="presentation" />
   
   <!-- Video -->
   <video aria-label="Product demo video showing key features" autoplay muted playsinline>
   ```

5. **Mobile Menu:**
   ```html
   <button class="menu-toggle" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-nav">
     <span class="sr-only">Menu</span>
     <svg aria-hidden="true">...</svg>
   </button>
   
   <nav id="mobile-nav" class="mobile-menu" aria-hidden="true">
     <!-- Navigation links -->
   </nav>
   ```

6. **Navbar:**
   ```html
   <header role="banner">
     <nav role="navigation" aria-label="Main navigation">
   ```

7. **Footer:**
   ```html
   <footer role="contentinfo">
   ```

**Dynamic ARIA Updates:**
- Update `aria-expanded` when mobile menu opens/closes
- Update `aria-hidden` for mobile menu based on state

### Screen Reader Support

**Heading Hierarchy:**
- One `<h1>` per page (hero headline)
- `<h2>` for section headings (Features, Testimonials, etc.)
- `<h3>` for subsections (feature card titles, testimonial author names)
- Never skip heading levels

**Alt Text Guidelines:**
- **Descriptive**: Explain what the image shows and its purpose
  - Example: `alt="Product dashboard showing real-time analytics, user management, and reporting features"`
- **Decorative**: Use `alt=""` or `role="presentation"` for purely decorative images
  - Example: `alt=""` for background patterns
- **Complex**: For charts or diagrams, provide longer description via `aria-describedby`

**Screen Reader Only Text (sr-only class):**
```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

**Landmarks:**
- Use semantic HTML: `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`
- Or use ARIA roles: `role="banner"`, `role="navigation"`, `role="main"`, `role="contentinfo"`

### Color Contrast

**Requirements:**
- **WCAG AA**: 4.5:1 for normal text, 3:1 for large text (18pt+ or 14pt+ bold)
- **WCAG AAA (Recommended)**: 7:1 for important CTAs

**Verification:**
- Use WebAIM Contrast Checker or similar tool
- Test all text/background combinations:
  - Hero headline and subheadline on background
  - CTA button text on button background
  - Body text on section backgrounds
  - Footer text on footer background
  - Link text on background (including hover state)

### Focus Visible Styles

**Implementation:**
```css
button:focus-visible,
a:focus-visible,
[tabindex]:focus-visible {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}

/* Fallback for older browsers */
button:focus,
a:focus,
[tabindex]:focus {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}
```

### Accessibility Implementation Checklist

When implementing this landing page, ensure:

- [ ] All images have descriptive alt text (or `alt=""` if decorative)
- [ ] Semantic HTML5 elements used (`<header>`, `<main>`, `<section>`, `<footer>`)
- [ ] One `<h1>` per page, logical heading hierarchy
- [ ] All CTAs keyboard accessible (Tab + Enter/Space)
- [ ] Clear focus indicators on all interactive elements
- [ ] Color contrast verified with contrast checker (4.5:1 minimum)
- [ ] Mobile menu has `aria-expanded` and `aria-controls`
- [ ] Sections linked to headings with `aria-labelledby`
- [ ] No keyboard traps or inaccessible content
- [ ] Screen reader tested with NVDA, VoiceOver, or JAWS

## Design System Specifications

**Important**: The design specifications below are tool-agnostic and should be implemented using your project's chosen styling approach (Tailwind, CSS Modules, styled-components, Chakra UI, Material-UI, SCSS, etc.). The styling examples in the "Code Implementation Patterns" section show how to apply these design values, but these specifications are the source of truth for the design.

### Color Guidelines

#### Hero Section
- **Background Options**:
  - Solid color: White (#ffffff), light gray (#f9fafb), or brand color at 5-10% opacity
  - Gradient: Subtle brand color gradient (e.g., `linear-gradient(to bottom, #eff6ff, #ffffff)`)
  - Image: Background image with 40-60% dark overlay for text readability
  - Video: Muted, autoplay video with text overlay
- **Text**:
  - Headline: High contrast (black #000000, dark gray #111827 on light bg; white #ffffff on dark bg)
  - Subheadline: Medium contrast (dark gray #374151 on light bg; light gray #e5e7eb on dark bg)
  - Minimum contrast: 4.5:1 (WCAG AA)
- **CTA Primary**:
  - Background: Brand primary color (e.g., #3b82f6, #10b981, high saturation)
  - Text: White #ffffff (ensure 4.5:1 contrast)
  - Hover: Darken background 10-15% or increase shadow
- **CTA Secondary**:
  - Background: Transparent or white
  - Border: 2px solid primary or neutral
  - Text: Primary color or dark gray
  - Hover: Light background fill or darken border

#### Content Sections
- **Background**: Alternate white (#ffffff) and light gray (#f9fafb or #f5f5f5) for visual separation
- **Text**:
  - Section headings: Dark gray #111827 or #1f2937
  - Body text: Medium gray #374151 or #6b7280
  - Muted text: Light gray #9ca3af (for author titles, captions)

#### Feature/Testimonial Cards
- **Background**: White #ffffff
- **Border**: Optional 1px solid #e5e7eb
- **Shadow**: Subtle: `0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)`
- **Hover**: Increase shadow: `0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)` (optional)

#### Navbar
- **Default**: Transparent or white
- **Scrolled**: White with shadow (light mode) or dark with shadow (dark mode)
- **Text**: Dark gray #111827 (light bg) or white #ffffff (dark bg)
- **Links**:
  - Default: Medium gray #6b7280
  - Hover: Primary color or darker gray
  - Active: Primary color

#### Footer
- **Background**: Light gray #f9fafb or #f5f5f5
- **Text**: Medium gray #6b7280
- **Links**:
  - Default: Medium gray #6b7280
  - Hover: Primary color or darker gray
- **Border**: Top border 1px solid #e5e7eb

#### Final CTA Section
- **Background**: Brand color at 5-10% opacity or gradient for emphasis
- **Text**: High contrast to stand out

### Typography

- **Font Family**: Use project's font stack (typically: `system-ui, -apple-system, sans-serif` or custom brand font like Inter, Poppins, Roboto)

#### Hero
- **Headline**: 48-64px (desktop), 32-40px (mobile), bold 700-900, line-height 1.1-1.2
- **Subheadline**: 18-24px (desktop), 16-20px (mobile), regular 400, line-height 1.5-1.6

#### Section Headings
- **Font size**: 32-40px (desktop), 24-32px (mobile)
- **Font weight**: 600-700 (semibold/bold)

#### Body Text
- **Font size**: 16-18px
- **Font weight**: 400 (regular)
- **Line height**: 1.5-1.6

#### Feature/Testimonial Cards
- **Title**: 18-20px, semibold 600
- **Description**: 14-16px, regular 400, line-height 1.5

#### CTA Buttons
- **Font size**: 16-18px
- **Font weight**: 500-600 (medium/semibold)

#### Footer
- **Links**: 14-16px, regular 400
- **Copyright**: 14px, regular 400

### Spacing System

Use consistent spacing scale: **4, 8, 12, 16, 24, 32, 48, 64, 80, 96, 120px** (or project's spacing system)

#### Sections
- **Padding vertical**: 96-120px (desktop), 60-80px (mobile)
- **Padding horizontal**: 24-32px
- **Margin-bottom**: 48px between section heading and content

#### Hero
- **Padding vertical**: 96-120px (desktop), 60-80px (mobile)
- **Content spacing**: 24px between headline and subheadline, 32px between subheadline and CTAs

#### Grids (Features, Testimonials)
- **Gap**: 32px (desktop), 24px (mobile)

#### Cards
- **Padding**: 32-40px
- **Internal gap**: 16px between card elements

#### Navbar
- **Height**: 64px
- **Padding**: 24-32px horizontal

#### Footer
- **Padding**: 48-64px vertical, 24-32px horizontal

### Shadows & Elevation

#### Cards
- **Default**: `0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)`
- **Hover**: `0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)` (optional)

#### Navbar (Scrolled)
- **Shadow**: `0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)`

#### CTA Buttons
- **Default**: `0 2px 4px rgba(0, 0, 0, 0.1)`
- **Hover**: `0 4px 8px rgba(0, 0, 0, 0.15)`

### Border Radius
- **Buttons**: 8-12px
- **Cards**: 12-16px
- **Images**: 8-12px (optional, depends on design style)
- **Inputs**: 8px (if forms present)

### Visual Hierarchy Principles

1. **Hero headline** is the largest, boldest element on the page
2. **Section headings** clearly separate content areas
3. **Primary CTA** stands out with high contrast brand color
4. **Secondary CTA** has lower visual weight (outlined or ghost style)
5. **Alternating section backgrounds** create visual rhythm
6. **White space** creates breathing room and guides eye flow
7. **Feature/testimonial cards** have consistent visual treatment

## State Management Considerations

### For AI Agents to Implement

**State to Track:**
1. `navbarScrolled: boolean` - Whether user has scrolled past threshold (for navbar transition)
   - **Determination**: `window.scrollY > 50`
   - **Persistence**: Component state only (don't persist)
2. `mobileMenuOpen: boolean` - Whether mobile hamburger menu is open
   - **Default**: `false`
   - **Persistence**: Component state only
3. `formState: object` (optional, if form included) - Email/newsletter form state
   - **Fields**: `{ email: string, submitting: boolean, error: string | null, success: boolean }`
   - **Persistence**: Component state only

**No State Persistence:**
- Landing pages are typically stateless
- Optional: localStorage for form pre-fill (email) if user returns (rare)

### SSR/Hydration Considerations
- **Scroll listener**: Only add scroll listener in `onMounted`/`useEffect`, check for `window` object
- **Default state**: Use `false` as default for `navbarScrolled`, update after mount
- **Implementation**: Check `typeof window !== 'undefined'` before accessing window APIs

## Critical Implementation Guidelines

### Vanilla CSS Detection
**CRITICAL**: When detecting vanilla CSS in the project, ALWAYS create CSS classes in a stylesheet. NEVER use inline style attributes on HTML elements.

- Define classes like `.hero`, `.features-grid`, `.cta-section` in your CSS file
- Apply classes via `className`/`class` attributes: `<section class="hero">`
- Do NOT use: `<section style="padding: 96px">`

### React Hook Patterns
**CRITICAL**: When detecting React, extract logic from `useEffect` hooks into separate custom hooks that do ONE thing each.

- Instead of one `useEffect` handling scroll + animations + form state:
  - `useScrollPosition()` - Detects scroll position only
  - `useInView(ref)` - Intersection observer for element visibility
  - `useFormState()` - Form state management only
- Each hook should have a single responsibility

## Code Implementation Patterns

### React Example Pattern
```jsx
// Suggested component structure
<LandingPage>
  <Navbar transparent={!scrolled} />
  <HeroSection>
    <h1>Build amazing products</h1>
    <p>The fastest way to ship your ideas</p>
    <CTAGroup>
      <Button variant="primary" href="/signup">Get Started</Button>
      <Button variant="secondary" href="/demo">Watch Demo</Button>
    </CTAGroup>
    <HeroImage src="/hero.jpg" alt="Product screenshot" />
  </HeroSection>
  <FeaturesSection features={features} />
  <TestimonialsSection testimonials={testimonials} />
  <CTASection />
  <Footer />
</LandingPage>
```

### Vue Example Pattern
```vue
<!-- Suggested component structure -->
<template>
  <LandingPage>
    <Navbar :transparent="!scrolled" />
    <HeroSection>
      <h1>Build amazing products</h1>
      <p>The fastest way to ship your ideas</p>
      <div class="cta-group">
        <Button variant="primary" href="/signup">Get Started</Button>
        <Button variant="secondary" href="/demo">Watch Demo</Button>
      </div>
      <HeroImage src="/hero.jpg" alt="Product screenshot" />
    </HeroSection>
    <FeaturesSection :features="features" />
    <TestimonialsSection :testimonials="testimonials" />
    <CTASection />
    <Footer />
  </LandingPage>
</template>
```

### Angular Example Pattern
```html
<!-- Suggested template structure -->
<app-landing-page>
  <app-navbar [transparent]="!scrolled"></app-navbar>
  <app-hero-section>
    <h1>Build amazing products</h1>
    <p>The fastest way to ship your ideas</p>
    <div class="cta-group">
      <button class="btn-primary" routerLink="/signup">Get Started</button>
      <button class="btn-secondary" routerLink="/demo">Watch Demo</button>
    </div>
    <img src="/hero.jpg" alt="Product screenshot" />
  </app-hero-section>
  <app-features-section [features]="features"></app-features-section>
  <app-testimonials-section [testimonials]="testimonials"></app-testimonials-section>
  <app-cta-section></app-cta-section>
  <app-footer></app-footer>
</app-landing-page>
```

### CSS/Styling Approaches

**Note**: The examples below show how to implement the design specifications using different styling tools. Always refer to the "Design System Specifications" section above for the authoritative design values, then adapt them to your project's styling approach.

#### Tailwind CSS Pattern
```html
<!-- Hero Section -->
<section class="min-h-[600px] py-24 lg:py-32 px-6 flex items-center bg-gradient-to-b from-blue-50 to-white">
  <div class="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
    <div>
      <h1 class="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
        Build amazing products
      </h1>
      <p class="text-lg lg:text-xl text-gray-600 mb-8">
        The fastest way to ship your ideas
      </p>
      <div class="flex flex-col sm:flex-row gap-4">
        <a href="/signup" class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          Get Started
        </a>
        <a href="/demo" class="px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition">
          Watch Demo
        </a>
      </div>
    </div>
    <div>
      <img src="/hero.jpg" alt="Product screenshot" class="rounded-lg shadow-lg" />
    </div>
  </div>
</section>

<!-- Features Section -->
<section class="py-24 lg:py-32 px-6">
  <div class="max-w-6xl mx-auto">
    <h2 class="text-3xl lg:text-4xl font-bold text-center mb-12">Features</h2>
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      <!-- Feature cards -->
    </div>
  </div>
</section>
```

#### Vanilla CSS Pattern
```css
/* CRITICAL: Always create CSS classes, never use inline styles */
.hero {
  min-height: 600px;
  padding: 96px 24px;
  display: flex;
  align-items: center;
  background: linear-gradient(to bottom, #eff6ff, #ffffff);
}

.hero-content {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: 48px;
  align-items: center;
}

.hero-headline {
  font-size: 48px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 24px;
  line-height: 1.2;
}

.features-section {
  padding: 96px 24px;
}

.features-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;
}

@media (min-width: 768px) {
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .hero-content {
    grid-template-columns: 1fr 1fr;
  }
  
  .hero-headline {
    font-size: 64px;
  }
  
  .features-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 767px) {
  .hero {
    min-height: 500px;
    padding: 60px 16px;
  }
  
  .hero-headline {
    font-size: 32px;
  }
}
```

## Animation Specifications

### Hero Entrance Animation (Optional)
- **Headline**: Fade in + slide up, 800ms, 0ms delay, ease-out
- **Subheadline**: Fade in + slide up, 800ms, 100ms delay, ease-out
- **CTA Group**: Fade in + slide up, 800ms, 200ms delay, ease-out
- **Hero Media**: Fade in + scale(0.95 → 1), 1000ms, 300ms delay, ease-out
- **Trigger**: Page load
- **Implementation**: CSS animations, GSAP, Framer Motion, or similar

### Scroll Reveal Animation (Optional)
- **Elements**: Feature cards, testimonial cards, CTA section
- **Animation**: Fade in + slide up, 600ms
- **Threshold**: 10% of element visible
- **Stagger**: 100-150ms between cards in same section
- **Implementation**: Intersection Observer API
- **Example**:
  ```javascript
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });
  ```

### CTA Hover Animation
- **Transform**: `scale(1.05)` or `translateY(-2px)`
- **Duration**: 200ms
- **Shadow**: Increase elevation on hover
- **Easing**: ease-out

### Navbar Transition (Optional)
- **Properties**: `background-color`, `box-shadow`
- **Duration**: 300ms
- **Easing**: ease-in-out
- **Trigger**: Scroll > 50px

### Prefers-Reduced-Motion
**Implementation**:
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Behavior**:
- Disable hero entrance animations
- Disable scroll-reveal animations
- Keep CTA hover (but subtle)
- Keep navbar transition

## Testing Checklist

When implementing this landing page, test:

### Visual
- [ ] Hero section looks good on all breakpoints (desktop, tablet, mobile)
- [ ] Feature cards aligned in grid (3-4 desktop, 2 tablet, 1 mobile)
- [ ] Testimonial cards display correctly
- [ ] All images load and scale properly
- [ ] CTAs are prominent and stand out
- [ ] Footer displays correctly with proper link groups

### Functional
- [ ] All CTAs link to correct destinations and are clickable
- [ ] Forms submit successfully (if present)
- [ ] Navbar transitions on scroll (if implemented)
- [ ] **CRITICAL: Mobile menu hamburger button works on first click every time**
- [ ] **CRITICAL: Mobile menu hamburger button tested on real iOS device (Safari)**
- [ ] **CRITICAL: Mobile menu hamburger button tested on real Android device (Chrome)**
- [ ] **CRITICAL: Mobile menu button has minimum 44x44px touch target**
- [ ] Mobile menu opens and closes correctly
- [ ] Mobile menu closes when clicking outside (backdrop dismiss)
- [ ] Mobile menu closes when pressing Escape key
- [ ] Mobile menu works after scrolling the page
- [ ] Mobile menu works after window resize
- [ ] Mobile menu works with rapid repeated clicks
- [ ] Scroll animations trigger at correct positions (if implemented)
- [ ] No horizontal scroll on any breakpoint
- [ ] No JavaScript errors in browser console

### Accessibility
- [ ] Keyboard navigation works (Tab through all CTAs and links)
- [ ] Focus indicators visible on all interactive elements
- [ ] All images have appropriate alt text (descriptive or empty)
- [ ] Color contrast verified (4.5:1 minimum)
- [ ] One `<h1>` per page, logical heading hierarchy
- [ ] Screen reader reads content in logical order
- [ ] Semantic HTML used (`<header>`, `<main>`, `<section>`, `<footer>`)
- [ ] Mobile menu has proper ARIA attributes

### Performance
- [ ] Images optimized and lazy-loaded (except hero)
- [ ] Hero image uses `loading="eager"`
- [ ] No layout shift on load (CLS score good)
- [ ] Fast page load (LCP < 2.5s)
- [ ] Smooth scroll animations (60fps)
- [ ] Responsive images use `srcset` (optional)

### Responsive
- [ ] Layout adapts correctly at all breakpoints
- [ ] Text is readable on all screen sizes
- [ ] Touch targets are at least 44x44px on mobile
- [ ] Mobile safe-area respected on notched devices
- [ ] No content cut off or overflowing

## Edge Cases

### Mobile Menu Not Working (CRITICAL)

If the mobile hamburger menu works intermittently or not at all, check:

**Debugging Steps:**

1. **Check DOM Ready**:
   ```javascript
   // Ensure event listener is added after DOM loads
   document.addEventListener('DOMContentLoaded', () => {
     const button = document.querySelector('.mobile-menu-toggle');
     if (button) {
       button.addEventListener('click', handleMenuToggle);
     }
   });
   ```

2. **Verify Z-Index**:
   ```css
   .navbar { z-index: 50; }
   .mobile-menu-toggle { z-index: 60; } /* MUST be higher than navbar */
   .mobile-menu { z-index: 100; } /* MUST be higher than button */
   ```

3. **Check Touch Target Size**:
   ```css
   .mobile-menu-toggle {
     min-width: 48px;
     min-height: 48px;
     /* NOT 44px - use 48px for better reliability */
   }
   ```

4. **Verify Pointer Events**:
   ```css
   .mobile-menu-toggle {
     pointer-events: auto;
     cursor: pointer;
     display: flex; /* or block */
   }
   ```

5. **Use Event Propagation Correctly**:
   ```javascript
   button.addEventListener('click', (e) => {
     e.stopPropagation(); // CRITICAL: prevents immediate close
     toggleMenu();
   });
   ```

6. **Check Browser Console**:
   - Open DevTools Console
   - Look for JavaScript errors
   - Add `console.log('Menu button clicked')` to verify event fires

7. **Test on Real Devices**:
   - Browser DevTools responsive mode is NOT reliable
   - Test on actual iOS device (Safari)
   - Test on actual Android device (Chrome)

**Common Issues:**

- **Button not clickable**: Cause: covered by overlay. Fix: check z-index and ensure `pointer-events: auto`.
- **Works in DevTools, not on device**: Cause: touch target too small. Fix: use 48x48px minimum.
- **Intermittent failure**: Cause: event listener before DOM ready. Fix: use `DOMContentLoaded` or `defer` script.
- **Menu closes immediately**: Cause: document click fires too soon. Fix: use `e.stopPropagation()` on button.
- **Button disappears**: Cause: navbar transition affects button. Fix: check CSS transitions on navbar.

### Long Headlines
- Reduce font size on mobile if headline is very long
- Ensure text doesn't overflow container
- Use `word-wrap: break-word` if necessary

### Many Features
- If more than 6 features, consider carousel or tabs
- Or use two rows on desktop (6 features = 2 rows of 3)

### No Testimonials
- Replace section with client logo grid
- Or skip testimonials section entirely

### Video Hero
- Provide fallback image for users who disable autoplay
- Mute video by default
- Add `autoplay muted playsinline` attributes
- Ensure video doesn't impact page load performance

### Slow Image Loading
- Show skeleton loaders or placeholders
- Use blur-up technique (load tiny blurred image first)

### Form Errors
- Display clear, accessible error messages
- Maintain focus management
- Use `aria-invalid` and `aria-describedby` for error messages

### Very Small Screens
- Test on 320px width (iPhone SE, older devices)
- Reduce padding if content feels cramped

---

## See Also

This landing page layout commonly uses these components:

- **[Navbar Component](/potions/components/navbar)** - For the header navigation
- **[Button](/potions/components/button)** - For hero and section CTAs (primary, secondary)
- **[Pricing Table Feature](/potions/features/pricing-table)** - For the pricing section

These are examples of components that work well with landing pages. The layout is flexible and works with any content sections you choose.

---

## Summary for AI Agents

This landing page layout is a conversion-optimized marketing page with sequential stacked sections. Key implementation points:

1. **Layout**: Sequential vertical stack (navbar → hero → features → testimonials → CTA → footer)
2. **Scroll Region**: Entire page scrolls naturally (no nested scroll containers)
3. **State**: Track navbar scroll position (optional), mobile menu state, form state (optional)
4. **Responsive**: Mobile-first approach with grid layouts that adapt to breakpoints
5. **Animations**: Optional entrance and scroll-reveal animations (respect prefers-reduced-motion)
6. **Accessibility**: Semantic HTML, clear focus indicators, proper ARIA attributes, alt text on all images
7. **Framework-agnostic**: Adapt patterns to any framework's component model

Generate clean, semantic HTML with proper component separation. Use framework-specific state management patterns and CSS methodology as specified by the user. Ensure all CTAs are conversion-focused with clear, action-oriented text.
