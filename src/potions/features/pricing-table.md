---
layout: 'potion'
title: '3-Tier SaaS Pricing Table with Monthly/Yearly Toggle'
publicationDate: '2026-01-18'
excerpt: 'A responsive 3-tier pricing table component with monthly/yearly billing toggle, highlighted "Most Popular" plan, and feature comparison. Perfect for SaaS marketing pages, product pages, and subscription-based services.'
category: 'Features'
tags:
  - features
  - pricing
  - saas
  - subscription
  - billing
  - marketing
  - responsive
  - conversion
agentManifest: 'potions/features/pricing-table.json'
path: 'potions/features/pricing-table'
---

# 3-Tier SaaS Pricing Table

A responsive 3-tier pricing table component with monthly/yearly billing toggle, highlighted "Most Popular" plan, and feature comparison. Perfect for SaaS marketing pages, product pages, and subscription-based services.

## Overview

This pricing table is designed to maximize conversion with clear visual hierarchy, prominent CTAs, and transparent feature comparison. It adapts seamlessly from desktop 3-column layout to mobile stacked cards.

## Structure Specification

### Component Hierarchy

The pricing table consists of a Container that holds a Billing Toggle section at the top, followed by a Plans Grid with three Plan Cards (Starter, Professional with "Most Popular" badge, and Enterprise). Each Plan Card contains a Header (with plan name and optional badge), Pricing section (with amount and billing period), CTA Button, and Feature List (with checkmarks and x-marks).

## Detailed Component Specifications

### 1. Pricing Table Container

**Dimensions:**
- Max width: 1200px (desktop)
- Padding: 48-64px vertical, 24-32px horizontal
- Gap between billing toggle and plans: 48-64px

**Behavior:**
- Centers content horizontally
- Responsive padding (reduces on mobile)
- Background can be neutral, gradient, or transparent

### 2. Billing Toggle

**Dimensions:**
- Container: Centered, max-width 400px
- Toggle switch: 200-240px wide
- Label spacing: 16px gap between labels and switch
- Savings badge: Small pill, right of "Yearly" label

**Layout:**

The toggle consists of a Monthly label, toggle switch in the center, Yearly label, and a "Save 20%" badge to the right of Yearly.

**States:**
- `monthly` (default) - Shows monthly pricing
- `yearly` - Shows yearly pricing (with discount if applicable)

**Elements:**

#### Toggle Labels
- Font size: 16px
- Weight: Medium (500) for inactive, Semibold (600) for active
- Color: Muted gray for inactive, primary text for active
- Transition: Smooth color change (150ms)

#### Toggle Switch
- Width: 56px, Height: 32px
- Border radius: 16px (pill shape)
- Thumb: 24px circle
- Colors:
  - Background (inactive): Light gray (#e5e7eb)
  - Background (active): Primary color (#3b82f6)
  - Thumb: White (#ffffff)
- Animation: Thumb slides 150-200ms with ease-out

#### Savings Badge
- Padding: 4px 12px
- Border radius: 12px (pill)
- Background: Success/primary color at 10-20% opacity
- Text: 12-14px, medium weight
- Icon: Optional small savings/discount icon

**Behavior:**
- Click either label or switch to toggle
- Keyboard accessible (Tab to focus, Enter/Space to toggle)
- Updates all plan prices simultaneously
- Smooth price transition (fade or slide animation)
- ARIA: `role="switch"`, `aria-checked="true/false"`, `aria-label="Billing frequency"`

### 3. Plans Grid

**Layout:**
- Desktop (≥1024px): 3 columns, equal width, 24-32px gap
- Tablet (768px-1023px): 3 columns, smaller gap (16-24px)
- Mobile (<768px): Single column, 24px gap, stacked

**Alignment:**
- Plans vertically aligned at top
- "Most Popular" plan can be visually elevated (slightly larger or with subtle shadow)

**Responsive:**
- Grid to stack transition smooth
- Mobile cards full width with 16px margins

### 4. Plan Card

**Dimensions:**
- Padding: 32-40px (desktop), 24-32px (mobile)
- Border radius: 12-16px
- Min height: Equal across all plans for better visual alignment

**Visual Hierarchy:**
- Most popular plan stands out with:
  - Darker border or shadow
  - Optional scale (102-105%)
  - Higher z-index for depth
  - Primary color accent

**States:**
- Default - Standard appearance
- Highlighted (Most Popular) - Enhanced visual prominence
- Hover - Subtle scale or shadow increase

**Border & Shadow:**
- Border: 1px solid, light gray (#e5e7eb) or transparent
- Shadow: Subtle elevation, more prominent on popular plan
- Hover shadow: Slightly increased elevation

**Background:**
- Light mode: White (#ffffff) or very light gray (#fafafa)
- Dark mode: Dark neutral (#1f2937) or slightly lighter than page background

### 5. Plan Header

**Layout:**
- Badge (if applicable) at top
- Plan name below badge
- Optional subtitle/description below name

**Elements:**

#### Badge ("Most Popular", "Best Value")
- Position: Top of card, centered or left-aligned
- Padding: 6px 16px
- Border radius: 12px (pill) or 6px (rounded)
- Background: Primary color or gradient
- Text: 12-14px, medium/semibold weight, uppercase optional
- Color: White or high-contrast text
- Icon: Optional star/crown icon

#### Plan Name
- Font size: 24-28px (desktop), 20-24px (mobile)
- Weight: Bold (700) or Semibold (600)
- Color: Primary text color
- Margin: 12-16px below badge, 8-12px above pricing

#### Description (Optional)
- Font size: 14-16px
- Weight: Regular (400)
- Color: Muted text (#6b7280)
- Margin: 8px below plan name
- Example: "Perfect for individuals"

### 6. Pricing Section

**Layout:**
- Price amount prominent and centered/left-aligned
- Billing period below or adjacent to price
- Optional "from" prefix for variable pricing
- Optional strikethrough original price (for yearly savings)

**Elements:**

#### Price Amount
- Font size: 48-56px (desktop), 40-48px (mobile)
- Weight: Bold (700) or Extra Bold (800)
- Color: Primary text color
- Currency symbol: Same size or slightly smaller (80% size)
- Decimals: Optional, smaller size (60-70% of price)

#### Billing Period
- Font size: 16-18px
- Weight: Regular (400) or Medium (500)
- Color: Muted text (#6b7280)
- Format: "/month" or "/mo", "/year" or "/yr"
- Position: Adjacent to price (baseline aligned) or below

#### Price Change Animation
- Duration: 200-250ms
- Easing: ease-in-out
- Effect: Fade out old price, fade in new price
- Alternative: Slide up/down or scale
- Stagger: Optional subtle delay between cards (50ms)

#### Discount Indicator (Yearly Plans)
- Original price: Strikethrough, smaller, muted
- Position: Above or next to new price
- Example: "~~$348~~ $279/year"
- Savings text: "Save $69/year" below price

### 7. CTA Button

**Dimensions:**
- Width: Full width or 80-90% of card width
- Height: 48-56px (desktop), 44-48px (mobile)
- Padding: 12-16px vertical, 24-32px horizontal
- Border radius: 8-12px

**Visual Variants:**

#### Primary CTA (Most Popular Plan)
- Background: Primary color (#3b82f6)
- Text: White (#ffffff)
- Weight: Medium (500) or Semibold (600)
- Font size: 16-18px
- Shadow: Subtle elevation
- Hover: Darker shade or increased shadow

#### Secondary CTA (Other Plans)
- Variant 1: Outlined
  - Border: 2px solid primary or neutral
  - Background: Transparent or white
  - Text: Primary color
  - Hover: Light background fill
- Variant 2: Ghost/Muted
  - Background: Light gray (#f3f4f6)
  - Text: Primary text color
  - Hover: Darker background

**States:**
- Default - Normal appearance
- Hover - Enhanced (shadow/scale/color change)
- Active - Slight press effect
- Focus - Clear outline (accessibility)
- Loading - Disabled with spinner
- Disabled - Muted colors, not interactive

**Text Examples:**
- Free plan: "Start Free", "Get Started Free"
- Paid plans: "Get Started", "Start Trial", "Subscribe"
- Enterprise: "Contact Sales", "Request Demo", "Talk to Sales"

**Behavior:**
- Click triggers appropriate action (signup, checkout, contact form)
- Keyboard accessible (Enter/Space)
- ARIA: `aria-label` if button text is ambiguous

### 8. Feature List

**Layout:**
- Unordered list with checkmarks/x-marks
- Left-aligned text
- Consistent spacing between items
- Optional feature grouping with subtle dividers

**Dimensions:**
- Item height: 36-44px
- Icon size: 20-24px
- Gap between icon and text: 12-16px
- Gap between items: 8-12px
- Margin top: 24-32px from CTA

**Elements:**

#### Feature Item
- Font size: 14-16px
- Weight: Regular (400)
- Color: Primary text for included, muted for unavailable
- Line height: 1.5 for readability

#### Check Icon (Included Feature)
- Color: Success green (#10b981) or primary color
- Style: Solid checkmark or circle with check
- Weight: Medium/bold stroke

#### X-Mark / Unavailable Icon
- Color: Muted gray (#9ca3af) or light red (#ef4444)
- Style: X mark, minus sign, or grayed-out check
- Optional: Strikethrough text

#### Feature Groups (Optional)
- Group header: 12-14px, uppercase, semibold, muted
- Divider: 1px line or extra spacing
- Examples: "Core Features", "Advanced Features", "Support"

**Accessibility:**
- Icons should have `aria-hidden="true"`
- Text should convey included/unavailable status
- Alternative: Use prefixes like "Included:" or "Not included:"
- Screen reader text: `<span class="sr-only">Included</span>`

### 9. Feature Comparison Behavior

**Desktop:**
- Features align horizontally across all plans
- Equal height for each feature row
- Makes it easy to compare at a glance

**Mobile:**
- Features within each card only
- No cross-card comparison (acceptable trade-off)
- Consider showing only top features, with "See all features" expand

**Feature Synchronization:**
- If feature appears in multiple plans, keep descriptions identical
- Order features by importance (most valuable first)
- Consider using tooltips for complex features

## Responsive Breakpoints

### Desktop (≥1024px)
- 3-column grid layout
- Full feature lists visible
- Larger typography and spacing
- "Most Popular" plan can be elevated/scaled
- Horizontal alignment of features across cards

### Tablet (768px - 1023px)
- 3-column grid maintained, reduced spacing
- Slightly smaller typography
- Reduced padding in cards
- May require horizontal scroll if cards too narrow
- Alternative: Switch to 2+1 layout (2 top, 1 bottom)

### Mobile (<768px)
- Single column, stacked cards
- Full width cards with 16px margins
- Reduced typography sizes
- Most Popular plan first or maintain order
- Simplified feature lists (show top 5-7, expand for more)
- Sticky CTA button optional for easier conversion

### Small Mobile (<375px)
- Further reduced padding (16-20px)
- Smaller typography
- More compact button sizing

## Interaction Patterns

### Billing Toggle

1. User clicks Monthly/Yearly label or switch
2. Switch animates to new position (150-200ms)
3. All prices simultaneously update with smooth transition
4. Savings badge visibility updates (show on yearly)
5. State persists during session (optional localStorage)

### Plan Selection

1. User clicks CTA button
2. Button shows loading state (if async action)
3. Navigate to signup/checkout with plan preselected
4. Or open modal for immediate action
5. Track plan selection for analytics

### Feature Tooltip (Optional)

1. User hovers or clicks info icon next to feature
2. Tooltip appears with detailed explanation
3. Tooltip dismisses on mouse leave or Escape key
4. Accessible via keyboard (Tab to icon, Enter to show)

### Plan Comparison Modal (Optional)

1. "Compare plans" link below pricing table
2. Opens modal or navigates to detailed comparison page
3. Shows full feature matrix with all plans side-by-side
4. Helpful for complex products with many features

## Accessibility Requirements

### WCAG 2.1 Compliance (Level AA)

**Structure:**
- Use semantic HTML: `<section>`, `<article>`, `<ul>`, `<button>`
- Proper heading hierarchy (h2 for section title, h3 for plan names)
- Each plan card should be a landmark or have clear structure

**Keyboard Navigation:**
- Tab order: Billing toggle → Plan 1 CTA → Plan 2 CTA → Plan 3 CTA
- Enter/Space: Activate buttons and toggle
- Focus visible on all interactive elements

**ARIA Attributes:**

1. **Billing Toggle:**
   ```html
   <div role="radiogroup" aria-label="Billing frequency">
     <button role="radio" aria-checked="true">Monthly</button>
     <button role="radio" aria-checked="false">Yearly</button>
   </div>
   ```
   Or use switch pattern:
   ```html
   <button role="switch" aria-checked="false" aria-label="Switch to yearly billing">
     <span>Monthly</span> | <span>Yearly</span>
   </button>
   ```

2. **Plan Cards:**
   ```html
   <article aria-labelledby="plan-pro-name">
     <h3 id="plan-pro-name">Professional</h3>
     ...
   </article>
   ```

3. **Feature List:**
   ```html
   <ul aria-label="Features included in Professional plan">
     <li>
       <svg aria-hidden="true">...</svg>
       <span>Unlimited projects</span>
       <span class="sr-only">Included</span>
     </li>
   </ul>
   ```

4. **Badges:**
   ```html
   <span class="badge" role="status" aria-label="Most popular plan">
     Most Popular
   </span>
   ```

**Screen Reader Support:**

- Prices announced correctly: "$29 per month"
- Feature icons marked `aria-hidden="true"`
- Feature status clear from text or sr-only spans
- Plan changes announced when billing toggle switches

**Color Contrast:**
- Text: Minimum 4.5:1 contrast ratio
- Buttons: 3:1 contrast for non-text elements
- Icons: Ensure checkmarks and x-marks are distinguishable
- Test with color blindness simulators

**Focus Indicators:**
```css
button:focus-visible,
a:focus-visible {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}
```

## Design System Specifications

**Important**: These specifications are framework and styling-agnostic. Implement using your project's chosen approach (Tailwind, CSS Modules, styled-components, Chakra UI, Material-UI, SCSS, etc.).

### Color Guidelines

#### Plan Cards
- **Background (Light)**: White (#ffffff) or very light gray (#fafafa)
- **Background (Dark)**: Dark neutral (#1f2937) or slightly lighter than page (#1a1a1a)
- **Border (Light)**: Light gray (#e5e7eb) or transparent
- **Border (Dark)**: Medium gray (#374151) or transparent
- **Most Popular Border**: Primary color (#3b82f6) or darker border with shadow

#### Text Colors
- **Primary Text (Light)**: Dark gray (#111827, #1f2937)
- **Primary Text (Dark)**: Light gray (#f9fafb, #e5e7eb)
- **Muted Text (Light)**: Medium gray (#6b7280, #9ca3af)
- **Muted Text (Dark)**: Medium gray (#9ca3af, #6b7280)
- **Price**: Emphasis color, typically darker/bolder than primary text

#### CTA Buttons
- **Primary Button Background**: Primary color (#3b82f6, #10b981)
- **Primary Button Text**: White (#ffffff)
- **Primary Button Hover**: Darker shade (darken by 10-15%)
- **Secondary Button Border**: Primary color or neutral (#e5e7eb)
- **Secondary Button Text**: Primary color or primary text
- **Secondary Button Hover**: Light background fill (#f3f4f6)

#### Feature Icons
- **Checkmark (Included)**: Success green (#10b981) or primary color
- **X-mark (Unavailable)**: Light gray (#9ca3af) or muted red (#ef4444)

#### Badge
- **Background**: Primary color or gradient
- **Text**: White or high-contrast color
- **Alternative**: Primary color at 10-20% opacity with primary text

#### Billing Toggle
- **Inactive Label**: Muted text (#6b7280)
- **Active Label**: Primary text color
- **Switch Background (Off)**: Light gray (#e5e7eb)
- **Switch Background (On)**: Primary color (#3b82f6)
- **Switch Thumb**: White (#ffffff)
- **Savings Badge**: Success/primary color at 10-20% opacity, primary text

### Typography

- **Section Title**: 32-40px, bold (700), primary text
- **Plan Name**: 24-28px (desktop), 20-24px (mobile), semibold/bold
- **Price**: 48-56px (desktop), 40-48px (mobile), bold/extra-bold
- **Billing Period**: 16-18px, regular/medium, muted text
- **CTA Button**: 16-18px, medium/semibold
- **Features**: 14-16px, regular
- **Badge**: 12-14px, medium/semibold, uppercase optional
- **Description**: 14-16px, regular, muted text

**Font Family**: Use project's font stack (system-ui, -apple-system, sans-serif or custom)

**Line Height**:
- Headings: 1.2-1.3
- Body text: 1.5
- Features: 1.5

### Spacing System

Use consistent spacing scale (4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px):

- **Container Padding**: 48-64px vertical, 24-32px horizontal (desktop), 32-48px vertical, 16-24px horizontal (mobile)
- **Card Padding**: 32-40px (desktop), 24-32px (mobile)
- **Grid Gap**: 24-32px (desktop), 24px (mobile)
- **Element Spacing**: 24-32px between major sections, 16-24px between related elements
- **Feature Items**: 8-12px gap between items

### Shadows & Elevation

- **Default Card**: `0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)`
- **Most Popular Card**: `0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)`
- **Hover Card**: `0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)`
- **Primary Button**: `0 1px 2px rgba(0, 0, 0, 0.05)`
- **Primary Button Hover**: `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)`

### Border Radius

- **Cards**: 12-16px
- **Buttons**: 8-12px
- **Badges**: 12px (pill) or 6px (rounded)
- **Toggle Switch**: 16px (pill)

## State Management Considerations

### For AI Agents to Implement

**State to Track:**
1. `billingFrequency: "monthly" | "yearly"` - Current billing period selection
   - **Default**: "monthly"
   - **Persistence**: Session storage or component state (optional localStorage for persistence)
2. `selectedPlan: string | null` - Which plan user clicked (optional, for analytics)
3. `loading: boolean` - Loading state for CTA buttons (if async)

**Computed Values:**
- Current prices based on `billingFrequency`
- Discount amounts for yearly plans
- Feature availability per plan (can be static data)

**State Persistence:**
- `billingFrequency` → Session storage (optional)
- Reset on page reload acceptable
- Or persist in URL query param: `?billing=yearly`

**Data Structure:**
```javascript
const pricingPlans = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Perfect for individuals',
    monthlyPrice: 9,
    yearlyPrice: 89, // 17% discount
    highlighted: false,
    features: [
      { name: 'Up to 5 projects', included: true },
      { name: '1 GB storage', included: true },
      { name: 'Basic support', included: true },
      { name: 'Advanced analytics', included: false },
      { name: 'Custom domain', included: false },
    ],
    cta: { text: 'Start Free', action: '/signup?plan=starter' }
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Perfect for small teams',
    monthlyPrice: 29,
    yearlyPrice: 279, // 20% discount
    highlighted: true,
    badge: 'Most Popular',
    features: [
      { name: 'Unlimited projects', included: true },
      { name: '10 GB storage', included: true },
      { name: 'Priority support', included: true },
      { name: 'Advanced analytics', included: true },
      { name: 'Custom domain', included: true },
      { name: 'API access', included: false },
    ],
    cta: { text: 'Get Started', action: '/signup?plan=pro' }
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Perfect for large organizations',
    monthlyPrice: 99,
    yearlyPrice: 990, // 17% discount
    highlighted: false,
    features: [
      { name: 'Unlimited everything', included: true },
      { name: 'Unlimited storage', included: true },
      { name: '24/7 dedicated support', included: true },
      { name: 'Advanced analytics', included: true },
      { name: 'Custom domain', included: true },
      { name: 'API access', included: true },
      { name: 'SSO & SAML', included: true },
    ],
    cta: { text: 'Contact Sales', action: '/contact?plan=enterprise' }
  }
];
```

## Animation Specifications

### Billing Toggle Animation
- **Duration**: 200ms
- **Easing**: ease-in-out
- **Properties**:
  - Switch thumb: `transform` (translateX)
  - Switch background: `background-color`
  - Label colors: `color`

### Price Change Animation
- **Duration**: 250ms
- **Easing**: ease-in-out
- **Effect Options**:
  1. Fade: Opacity 1 → 0 → 1
  2. Slide: translateY(10px) → translateY(0)
  3. Scale: scale(0.95) → scale(1)
- **Stagger**: Optional 50ms delay between cards for polished effect

### Card Hover Animation
- **Duration**: 150-200ms
- **Easing**: ease-out
- **Properties**:
  - Shadow: Increase elevation
  - Transform: translateY(-4px) or scale(1.02)
- **Boundary**: Keep subtle to avoid distraction

### CTA Button Hover
- **Duration**: 150ms
- **Easing**: ease-out
- **Properties**:
  - Background color: Darken
  - Shadow: Increase elevation
  - Transform: scale(1.02) optional

### Prefers Reduced Motion
When user has `prefers-reduced-motion: reduce`:
- Disable card hover transforms
- Disable price change slide/scale (use only fade)
- Keep toggle switch animation (functional)
- Reduce animation durations to <100ms

## Code Implementation Patterns

### React Example Pattern
```jsx
const PricingTable = () => {
  const [billingFrequency, setBillingFrequency] = useState('monthly');
  
  const toggleBilling = () => {
    setBillingFrequency(prev => prev === 'monthly' ? 'yearly' : 'monthly');
  };
  
  return (
    <section className="pricing-container">
      <BillingToggle 
        frequency={billingFrequency}
        onToggle={toggleBilling}
      />
      <div className="plans-grid">
        {pricingPlans.map(plan => (
          <PlanCard
            key={plan.id}
            plan={plan}
            billingFrequency={billingFrequency}
            highlighted={plan.highlighted}
          />
        ))}
      </div>
    </section>
  );
};
```

### Vue Example Pattern
```vue
<template>
  <section class="pricing-container">
    <BillingToggle
      :frequency="billingFrequency"
      @toggle="toggleBilling"
    />
    <div class="plans-grid">
      <PlanCard
        v-for="plan in pricingPlans"
        :key="plan.id"
        :plan="plan"
        :billing-frequency="billingFrequency"
        :highlighted="plan.highlighted"
      />
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';

const billingFrequency = ref('monthly');

const toggleBilling = () => {
  billingFrequency.value = billingFrequency.value === 'monthly' ? 'yearly' : 'monthly';
};
</script>
```

### Angular Example Pattern
```typescript
@Component({
  selector: 'app-pricing-table',
  template: `
    <section class="pricing-container">
      <app-billing-toggle
        [frequency]="billingFrequency"
        (toggle)="toggleBilling()"
      />
      <div class="plans-grid">
        <app-plan-card
          *ngFor="let plan of pricingPlans"
          [plan]="plan"
          [billingFrequency]="billingFrequency"
          [highlighted]="plan.highlighted"
        />
      </div>
    </section>
  `
})
export class PricingTableComponent {
  billingFrequency: 'monthly' | 'yearly' = 'monthly';
  pricingPlans = PRICING_PLANS;
  
  toggleBilling() {
    this.billingFrequency = this.billingFrequency === 'monthly' ? 'yearly' : 'monthly';
  }
}
```

## Testing Checklist

When implementing this pricing table, test:

- [ ] Billing toggle switches between monthly and yearly
- [ ] All plan prices update simultaneously when billing changes
- [ ] Price change animations are smooth
- [ ] Most Popular plan is visually distinct
- [ ] CTA buttons are prominently displayed and functional
- [ ] Feature lists align properly across plans (desktop)
- [ ] Cards stack properly on mobile
- [ ] Responsive at all breakpoints (mobile, tablet, desktop)
- [ ] Keyboard navigation works (Tab through toggle and CTAs)
- [ ] Screen reader announces prices correctly
- [ ] Focus indicators visible on all interactive elements
- [ ] Color contrast meets WCAG AA (4.5:1 for text)
- [ ] Hover states work on cards and buttons
- [ ] Touch interactions work on mobile
- [ ] No layout shift when prices change
- [ ] Feature icons are accessible (aria-hidden + text)
- [ ] Toggle has proper ARIA attributes
- [ ] Plan selection tracking works (if implemented)
- [ ] Animations respect prefers-reduced-motion
- [ ] Long feature text wraps properly
- [ ] Badges are readable and accessible

## Common Variations

### 2-Tier Pricing
- Remove middle plan
- Adjust grid to 2 columns
- Both plans equal visual weight or highlight one

### 4+ Tier Pricing
- Horizontal scroll on mobile
- Or accordion/tabs for mobile
- Feature comparison table more important

### Feature Comparison Table
- Separate section below cards
- Full feature matrix
- Plan columns with checkmarks
- "Compare plans" link

### Annual Discount Badge
- Show "Save 20%" prominently
- Highlight savings in pricing section
- Animate badge on toggle

### Free Trial CTA
- "Start 14-day free trial"
- Emphasize no credit card required
- Convert to paid after trial

### Tiered Features
- Group features by category
- Expandable sections for long lists
- Icons for feature categories

### Custom Enterprise
- "Contact us" or "Request quote"
- Custom pricing
- Feature list different or hidden

## Edge Cases

### Very Long Feature Names
- Wrap text to multiple lines
- Maintain consistent height across cards
- Consider truncation with tooltip

### Many Features
- Limit visible features (show top 7-10)
- "Show all features" expand button
- Or link to full comparison page

### Price Changes During View
- Handle real-time price updates
- Smooth transition, no jarring jumps
- Consider "prices may change" disclaimer

### Currency Conversion
- Support multiple currencies
- Currency selector above/below pricing
- Respect user locale

### Fractional Pricing
- Handle decimals: $9.99 vs $10
- Consistent decimal formatting
- Cents in smaller font size

## AI Agent Implementation Prompt Template

Use this template when asking an AI agent to implement this pricing table:

```
Create a 3-tier SaaS pricing table with the following specifications:

1. Billing Toggle:
   - Monthly/Yearly switch with savings badge
   - Smooth toggle animation
   - Updates all plan prices simultaneously

2. Three Plan Cards (Starter, Professional, Enterprise):
   - Professional plan highlighted as "Most Popular"
   - Each card includes: plan name, price, CTA button, feature list
   - Price changes animate when billing toggle switches
   - Responsive: 3-column grid on desktop, stacked on mobile

3. Visual Design:
   - Cards with subtle shadows, highlighted plan more prominent
   - Checkmarks for included features, x-marks for unavailable
   - Primary CTA for highlighted plan, secondary for others
   - Consistent spacing and typography

4. Pricing:
   - Starter: $9/mo, $89/yr
   - Professional: $29/mo, $279/yr (Most Popular)
   - Enterprise: $99/mo, $990/yr
   - Show savings on yearly plans

5. Accessibility:
   - Keyboard navigation (Tab, Enter, Space)
   - ARIA labels for toggle and features
   - Screen reader announcements for price changes
   - Focus visible on all interactive elements

6. Use [Framework: React/Vue/Angular/Svelte] with [Styling: Tailwind/Chakra/CSS Modules]

7. Animate price changes (250ms fade/slide) and respect prefers-reduced-motion

Reference: UI Potion 3-Tier SaaS Pricing Table
```

## Summary for AI Agents

This 3-tier pricing table is a standard marketing component with billing frequency toggle and feature comparison. Key implementation points:

1. **Layout**: CSS Grid for plans (3 columns desktop, 1 column mobile)
2. **State**: Track billing frequency (monthly/yearly), update prices reactively
3. **Responsive**: Grid to stack transition, adjust typography and spacing
4. **Animations**: Smooth price transitions (250ms), toggle switch animation
5. **Accessibility**: ARIA labels, keyboard navigation, screen reader support
6. **Framework-agnostic**: Adapt patterns to any framework's component model

Generate clean, semantic HTML with proper component separation. Use framework-specific state management patterns and CSS methodology as specified by the user. Prioritize conversion optimization with clear visual hierarchy and prominent CTAs.
