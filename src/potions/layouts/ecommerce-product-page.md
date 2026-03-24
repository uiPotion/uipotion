---
layout: 'potion'
title: 'Ecommerce Product Page'
publicationDate: '2026-03-24'
excerpt: 'A conversion-oriented ecommerce product detail page layout with media gallery, buy box, variant selectors, shipping and returns context, reviews, and mobile sticky purchase actions.'
category: 'Layouts'
tags:
  - layouts
  - ecommerce
  - merchandising
  - product-page
  - product-detail-page
  - pdp
  - conversion
  - reviews
  - responsive
agentManifest: 'potions/layouts/ecommerce-product-page.json'
path: 'potions/layouts/ecommerce-product-page'
---

# Ecommerce Product Page

A modern ecommerce product detail page layout built for high-intent shoppers. The layout prioritizes product inspection, variant clarity, availability confidence, shipping and return transparency, and fast purchase actions on both desktop and mobile.

## Structure Specification

### Layout Hierarchy

The page is organized as a decision-first flow:

- **Site Header**: Shared storefront navigation, search, and cart access
- **Breadcrumbs**: Lightweight location context above the product content
- **Purchase Region**: Two-column desktop split with Product Media Gallery and Purchase Panel
- **Trust and Fulfillment Strip**: Short delivery, returns, pickup, or warranty signals near the buy area
- **Product Details Region**: Highlights, description, specifications, sizing/care, FAQ, and any supporting content
- **Reviews and Q&A**: Rating summary, review filters, media reviews, and customer questions
- **Recommendations Section**: Complementary products, related variants, or recently viewed items
- **Site Footer**: Shared store footer content
- **Sticky Mobile Purchase Bar**: Mobile-only summary bar with price and primary purchase action when the main CTA scrolls away

### Above-the-Fold Contract

On desktop, the first screen should show the most decision-critical information in one scan:

- Product title and short descriptor
- Star rating and review count anchor
- Price and promotional context
- Availability and fulfillment summary
- Required variant selectors
- Quantity and primary purchase CTA
- Supporting secondary actions such as wishlist, save, or share

The media gallery should sit beside the purchase panel, not below it, so shoppers can inspect the product and buy without excessive scrolling.

## Detailed Component Specifications

### 1. Breadcrumbs

**Purpose:**
- Show category context and support return navigation

**Elements:**
- Home
- Parent collection or category
- Optional subcategory
- Current product label

**Behavior:**
- Keep copy concise to avoid wrapping above the fold
- Use the current product as non-link text
- Collapse middle levels if taxonomy is deep

### 2. Product Media Gallery

**Dimensions:**
- Desktop: Dominant left column, typically 55-65% of the purchase region width
- Mobile: Full-width stack near the top of the page

**States:**
- `default`
- `thumbnail-hover`
- `zoomed`
- `video-active`
- `ugc-active`

**Recommended media mix:**
- Clean studio images on neutral background
- Close-up detail shots
- Scale/context image
- Lifestyle image
- Optional short product video or 360 view
- Optional user-generated media in reviews

**Behavior:**
- Show a clear active image state
- Support zoom or fullscreen inspection for high-detail products
- Keep media navigation keyboard accessible
- Preserve aspect ratio and avoid layout shift while images load
- On mobile, support swipe only if explicit controls and thumbnails remain discoverable

### 3. Purchase Panel

**Dimensions:**
- Desktop width: 360-440px typical
- Sticky behavior: Optional on desktop when panel height fits the viewport

**States:**
- `default`
- `selection-incomplete`
- `ready-to-purchase`
- `adding`
- `added`
- `error`
- `out-of-stock`
- `backorder`

**Elements:**
- Product title
- Optional subtitle or short benefit statement
- Rating summary anchor
- Price stack with compare-at price, savings, financing, or subscription messaging
- Variant selectors such as color, size, material, or capacity
- Quantity selector
- Primary CTA (`Add to Cart` / `Buy Now`)
- Secondary actions such as wishlist, save, or share
- Fulfillment summary with shipping, returns, pickup, or delivery estimate
- Micro trust markers such as warranty, secure checkout, or easy returns

**Behavior:**
- Do not enable purchase until required variant values are selected
- Update price, SKU, inventory, and delivery information when the variant changes
- Keep unavailable combinations visibly disabled rather than hidden
- Provide inline feedback after add-to-cart
- Keep shipping and return expectations close to the CTA instead of hiding them deep below the fold

### 4. Trust and Fulfillment Strip

**Purpose:**
- Reinforce high-signal purchase reassurance without overwhelming the buy box

**Typical items:**
- Delivery estimate
- Free shipping threshold
- Return window
- Store pickup availability
- Warranty or authenticity guarantee

**Behavior:**
- Use 3-5 short items maximum
- Prefer icon plus short label plus short explanation
- Keep copy factual and scannable

### 5. Product Details Region

**Sections:**
- Highlights or key benefits
- Long description or narrative copy
- Specifications
- Size and fit or dimensions
- Materials and care
- FAQ

**Behavior:**
- Desktop can use stacked sections or anchored subsections
- Mobile should prefer accordions to control page length
- Keep the most decision-relevant details earlier than brand storytelling
- Avoid hiding core facts like materials, dimensions, compatibility, or care behind hard-to-find interactions

### 6. Reviews and Q&A

**Elements:**
- Rating average
- Rating distribution
- Review count
- Sort and filter controls
- Review cards with text, date, verified badge, and optional media
- Customer Q&A or FAQ continuation

**Behavior:**
- Surface a review summary near the product title and link it to the full section
- Allow filtering by rating, use case, size, or other category-relevant dimensions when review volume is high
- Keep write-review actions secondary to reading and filtering
- If there are no reviews, show a helpful empty state and preserve layout balance

### 7. Recommendations Section

**Purpose:**
- Support continued shopping after the core decision content

**Variants:**
- Related products
- Frequently bought together
- Complete the look
- Recently viewed
- Similar products by use case or price band

**Behavior:**
- Place recommendations after the main decision content, not above the purchase panel
- Keep recommendation cards consistent with the store's catalog card pattern
- Avoid injecting aggressive upsells before the shopper understands the base product

### 8. Sticky Mobile Purchase Bar

**Purpose:**
- Preserve access to the primary CTA on small screens when the main purchase controls are off-screen

**Elements:**
- Current price
- Selected variant summary or “Select options” prompt
- Primary CTA

**Behavior:**
- Only appear after the main buy box scrolls out of view
- Respect mobile safe-area insets
- Do not obscure native browser UI or product notices
- Keep tap targets at least 44px high

## Responsive Breakpoints

### Desktop (≥1024px)

- Two-column purchase region with gallery and buy box visible together
- Optional sticky purchase panel
- Product details use stacked sections or anchored subsections
- Recommendations can display 4 columns depending on card density

### Tablet (768px - 1023px)

- Keep gallery and summary visually close, using either a narrower split or early stack depending on content density
- Reduce sticky behavior if the panel becomes too tall
- Details remain stacked with generous spacing
- Recommendations typically 2-3 columns

### Mobile (<768px)

- Single-column page
- Gallery first, followed by title, rating, price, selectors, CTA
- Details become accordions
- Sticky mobile purchase bar appears when needed
- Recommendations usually 2 columns or horizontal card rail

### Resize Handling

- Re-evaluate sticky desktop behavior on resize
- Close fullscreen media overlays when switching between layout modes if they no longer fit
- Preserve selected variants and quantity across breakpoint changes

## Interaction Patterns

### Variant Selection

1. Shopper selects one option group
2. Remaining options update to reflect valid combinations
3. Price, inventory, SKU, and fulfillment messaging update
4. CTA becomes enabled only when the selection is valid

### Media Inspection

1. Shopper changes the active thumbnail or media chip
2. Main media updates without layout shift
3. Zoom or fullscreen overlay opens for close inspection
4. Escape or close button exits the overlay and returns focus

### Add-to-Cart Feedback

1. Shopper activates the primary CTA
2. CTA shows loading state and is temporarily guarded against repeat submits
3. Success feedback appears inline, in a mini-cart, or as a toast
4. Errors point back to the blocking field or state

### Reviews Exploration

1. Shopper jumps from the top rating summary to the reviews section
2. Filters and sort update the review list
3. Media reviews remain accessible without trapping keyboard or touch users

## Accessibility Requirements

### WCAG 2.1 Compliance (Level AA Target)

- Use semantic landmarks for header, main content, reviews, and footer
- Ensure variant controls are grouped with `fieldset` and `legend` when appropriate
- Keep all gallery controls keyboard accessible
- Provide clear focus states for thumbnails, selectors, CTAs, accordions, and filters
- Announce dynamic inventory or add-to-cart status changes with polite live regions
- Maintain 4.5:1 contrast for text and 3:1 for UI boundaries and large text
- Ensure fullscreen media and any modal interactions trap and restore focus correctly

### Keyboard Navigation

Suggested tab order:

- Header actions
- Breadcrumbs
- Gallery controls
- Rating anchor
- Price and variant selectors
- Quantity and primary CTA
- Secondary actions
- Detail accordions or anchors
- Reviews controls
- Recommendation cards
- Footer links

## Framework Patterns

- **React**: Split large page implementations into smaller components, and keep logic in small hooks such as variant resolution, sticky CTA visibility, media overlay state, and add-to-cart status
- **Vue**: Use composables for selection state and sticky purchase behavior, and keep reactive derived pricing close to the product model
- **Angular**: Prefer separate services or helper utilities for variant matching and fulfillment messaging rather than bloated components
- **Svelte**: Keep stores minimal and derive active SKU, price, and availability from selected option values

## Testing Checklist

- Required variants must be selected before purchase
- Unavailable variant combinations are visibly disabled
- Price, availability, and shipping details update with variant changes
- Gallery thumbnails, zoom, and fullscreen view work with keyboard and touch
- Review summary anchor scrolls to the correct section
- Details accordions work on mobile and preserve focus visibility
- Sticky mobile purchase bar appears only when primary actions are off-screen
- No horizontal scroll appears at any breakpoint
- Safe-area insets prevent sticky bar overlap on notched devices
- Add-to-cart feedback is clear for success, loading, and failure states
- Structured product data can stay in sync with the selected variant if SEO markup is part of the implementation

## See Also

- [Button](/potions/components/button): works well for primary purchase and secondary saved-item actions.
- [Dropdown Select](/potions/components/dropdown-select): useful as a fallback for variant selectors when swatches or chips are not appropriate.
- [Tabs](/potions/components/tabs): consider using for desktop details navigation when the content is short and highly scannable.
- [Toast Notifications](/potions/components/toast-notifications): works well for non-blocking add-to-cart confirmation and cart-related feedback.
