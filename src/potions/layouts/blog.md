---
layout: 'potion'
title: 'Blog Layout (List and Post)'
publicationDate: '2026-02-12'
excerpt: 'A comprehensive blog layout covering the list frontpage (post cards, grid, pagination) and single post layout (article, sidebar, comments, related posts). Includes all UI sections typically needed in blogs.'
category: 'Layouts'
tags:
  - layouts
  - blog
  - article
  - post
  - content
  - responsive
  - sidebar
  - pagination
  - newsletter
agentManifest: 'potions/layouts/blog.json'
path: 'potions/layouts/blog'
---

# Blog Layout (List and Post)

A comprehensive blog layout covering both the list frontpage and the single post page. Includes all UI sections typically needed in blogs: navbar, hero, post list, post card, article header, article content, sidebar, newsletter signup, footer, pagination, comments, share buttons, and related posts.

## Structure Specification

### Two Page Types

The blog layout defines two distinct page structures:

1. **Blog List Page (Frontpage)**: Displays a grid of post cards with optional hero, sidebar, and pagination
2. **Post Page (Single Article)**: Displays the full article with header, content, optional sidebar, comments, share buttons, and related posts

Both pages share the navbar and footer components for consistency.

### Blog List Page Hierarchy

- **Navbar**: Fixed or sticky navigation with logo, links, optional search, newsletter link
- **Hero Section** (optional): Blog title and tagline
- **Main Content**: Post grid with optional sidebar
  - **Post List**: Grid of PostCard components (2 columns desktop with sidebar, 3 without sidebar; 2 tablet, 1 mobile)
  - **Sidebar**: Categories, tags, search, newsletter form
- **Pagination**: Previous, next, and page numbers
- **Footer**: Links, social, copyright

### Post Page Hierarchy

- **Navbar**: Shared navigation
- **Article Header**: Full-width hero section with post title, meta (date, author, reading time), optional featured image
- **Main Content**: Article body (constrained width for readability) with optional sidebar
  - **Article Content**: Full article body with proper typography
  - **Sidebar**: Table of contents, author bio, related posts
- **Share Buttons**: Social share links
- **Comments Section**: Comments list and form (integration-ready)
- **Related Posts**: Section with related post cards
- **Footer**: Shared footer

## Detailed Component Specifications

### 1. Navbar Component

**Dimensions:**
- Height: 64px (fixed or sticky)
- Padding: 24-32px horizontal
- Position: Fixed at top or sticky

**States:**
- `default` (initial)
- `scrolled` (for optional background transition)

**Elements:**
- **Logo**: 32-40px height, left-aligned, links to homepage
- **Navigation Links**: Blog, About, Contact, Categories (typical links)
- **Search Link** (optional): Icon, right-aligned
- **Newsletter Link** (optional): Right-aligned

**Behavior:**
- Optional scroll transition (transparent to solid background)
- Mobile: Hamburger menu below 768px

### 2. Hero Section (Blog List Page)

**Dimensions:**
- Padding: 48-80px vertical (desktop), 32-48px (mobile)
- Padding: 24-32px horizontal
- Content max-width: 1200px

**Elements:**
- **Blog Title**: 36-48px (desktop), 28-36px (mobile), bold
- **Blog Tagline**: 16-20px, muted color, max-width 600px

**Behavior:**
- Optional; some blogs skip hero and start with post list
- Center-aligned or left-aligned

### 3. Post Card Component

**Dimensions:**
- Min-height: 280px
- Border radius: 8-12px

**States:**
- `default`
- `hover` (subtle lift or shadow)
- `loading` (skeleton state)

**Elements:**
- **Featured Image**: 16:9 or 4:3 aspect ratio, 160-200px height, object-fit cover, lazy loading
- **Category Tag** (optional): 12-14px, above title
- **Post Title**: 18-22px, weight 600-700, line-clamp 2-3 lines
- **Excerpt**: 14-16px, line-clamp 2-3, muted color
- **Post Meta**: 12-14px, muted, includes date, author, reading time

**Behavior:**
- Entire card or title links to post
- Hover: Subtle lift (translateY -2px) or shadow increase

### 4. Article Header (Post Page)

**Dimensions:**
- Padding: 48-80px vertical (desktop), 32-48px (mobile)
- Width: Full-width hero section (spans entire viewport width for visual impact)
- Content max-width: 1200px or none (for contained look within the full-width section)

**Layout Note:**
The article header should span full width to create a strong visual impact when entering a post. Only the article content area should be constrained to ~720px for optimal readability.

**Elements:**
- **Category Tag** (optional): 12-14px
- **Post Title**: 32-48px (desktop), 24-32px (mobile), weight 700-800
- **Post Meta**: Date, author, reading time in horizontal layout
- **Author Info** (optional): Avatar 40-48px, name
- **Featured Image** (optional): 16:9 or 21:9, below meta

### 5. Article Content

**Dimensions:**
- Max-width: 720px (optimal reading width)
- Padding: 24-48px vertical
- Line height: 1.6-1.8

**Elements:**
- **Article Body**: 16-18px font size, 24px paragraph spacing
- **Headings**: Logical hierarchy (h2, h3, h4)
- **Code Blocks**: 14-16px, padding 16px, border radius 8px
- **Blockquotes**: Left border 4px, padding left 16px, italic
- **Images**: Max-width 100%, border radius 8-12px

### 6. Sidebar Component

**Dimensions:**
- Width: 280-320px (desktop)
- Padding: 24px
- Position: Right on desktop, below content on mobile

**List Page Sidebar Elements:**
- **Section Heading**: 14-16px, weight 600
- **Categories List**: 14-16px
- **Tags Cloud**: 12-14px, flex-wrap layout
- **Search Input**: 40px height
- **Newsletter Form**: Email input, submit button

**Post Page Sidebar Elements:**
- **Table of Contents**: 14-16px, nested headings with indent
- **Author Bio**: Avatar 64-80px, name, short bio
- **Related Posts**: Small post cards

**Behavior:**
- Optional sticky on desktop
- Full width below content on mobile

### 7. Pagination Component

**Dimensions:**
- Padding: 32px vertical
- Gap: 8px between elements

**States:**
- `default`
- `disabled` (prev on first page, next on last page)
- `active` (current page highlighted)

**Elements:**
- **Prev Link**: Label "Previous" or "Prev"
- **Page Numbers**: 1, 2, 3... or ellipsis for long lists
- **Next Link**: Label "Next"

**Behavior:**
- aria-label="Pagination"
- Tab through links for keyboard navigation

### 8. Share Buttons

**Dimensions:**
- Gap: 12px between buttons
- Icon size: 20-24px

**Platforms:**
- Twitter, LinkedIn, Facebook, Copy link

**Behavior:**
- Each button has descriptive aria-label
- Placement: Below article or in sidebar

### 9. Comments Section

**Dimensions:**
- Padding: 48px vertical
- Max-width: 720px

**States:**
- `default`
- `loading`
- `empty`

**Elements:**
- **Section Heading**: "Comments" or similar
- **Comments List**: Avatar, name, date, body; optional nesting for replies
- **Comment Form**: Name, email, body fields, submit button

**Behavior:**
- Integration-ready placeholder for Disqus, Commento, or custom implementation

### 10. Related Posts Section

**Dimensions:**
- Padding: 48px vertical
- Content max-width: 1200px

**Elements:**
- **Section Heading**: "Related Posts" or similar
- **Related Post Cards**: Same as PostCard but may be smaller (2-3 columns desktop)

### 11. Newsletter Section

**Dimensions:**
- Padding: 48-64px vertical
- Padding: 24px horizontal

**States:**
- `default`
- `submitting`
- `success`
- `error`

**Elements:**
- **Headline**: 20-24px, weight 600
- **Subtext**: 14-16px, muted
- **Email Input**: 44px height
- **Submit Button**: 44px height

### 12. Footer Component

**Dimensions:**
- Padding: 48-64px vertical
- Padding: 24-32px horizontal
- Content max-width: 1200px

**Elements:**
- **Footer Links**: Grid or horizontal, 2-4 columns desktop
- **Social Links**: Horizontal row, 20-24px icons
- **Copyright**: 14px, muted color

## Responsive Breakpoints

### Desktop (1024px and above)
- Blog list: 2 column grid when sidebar visible (for better card proportions ~360-400px each), 3 columns if no sidebar
- Layout note: With a 320px sidebar, 3 columns makes cards too narrow (~240px each). Use 2 columns for optimal card sizing.
- Post page: Full-width article header, constrained article content, sidebar right (280-320px)
- Sidebar always visible

### Tablet (768px - 1023px)
- Blog list: 2 column grid
- Sidebar: Full width below content or hidden
- Post page: Article full width or sidebar below

### Mobile (below 768px)
- Blog list: 1 column stack
- Post page: Article full width
- Sidebar: Full width below content
- Pagination: Prev/next only or condensed page numbers

## Accessibility Requirements

### WCAG 2.1 Level AA

- **1.1.1 Non-text Content**: Descriptive alt text for all images
- **1.3.1 Info and Relationships**: Semantic HTML (header, main, article, nav, footer)
- **2.1.1 Keyboard**: All interactive elements keyboard accessible
- **2.4.2 Page Titled**: Descriptive page title in `<title>`
- **2.4.4 Link Purpose**: Descriptive link text (avoid generic "Read more" without context)
- **2.4.7 Focus Visible**: Clear focus indicators on all interactive elements

### Keyboard Navigation

**Tab Order:**
- Navbar, main content, sidebar, pagination, footer

**Pagination:**
- Tab through prev, page numbers, next links

### ARIA Attributes

- `<main role="main">` for main content
- `<article>` for post content
- `aria-label="Pagination"` on pagination nav
- `aria-label="Main navigation"` on nav
- `aria-label="Search"` on search input

### Heading Hierarchy

- One `<h1>` per page (post title on post page, blog title on list page)
- Logical `<h2>`, `<h3>`, `<h4>` for sections
- No skipped levels

## State Management

### States to Track

1. **mobileMenuOpen**: Boolean, mobile hamburger menu state
2. **navbarScrolled**: Boolean, for navbar background transition
3. **currentPage**: Number, from URL query or route for pagination
4. **newsletterForm**: Object with email, submitting, error, success
5. **commentForm**: Object with name, email, body, submitting, error

### Persistence

- Pagination: Current page in URL (query param or route)
- Other state: Component state only (no persistence)

## Framework Patterns

### React Example
```jsx
<BlogLayout>
  <Navbar />
  <main>
    {isListPage ? (
      <>
        <HeroSection />
        <PostGrid posts={posts} />
        <Pagination currentPage={page} totalPages={total} />
      </>
    ) : (
      <>
        <ArticleHeader post={post} />
        <ArticleContent content={post.content} />
        <ShareButtons url={post.url} title={post.title} />
        <CommentsSection postId={post.id} />
        <RelatedPosts posts={relatedPosts} />
      </>
    )}
  </main>
  <Footer />
</BlogLayout>
```

### Vue Example
```vue
<BlogLayout>
  <Navbar />
  <main>
    <BlogListPage v-if="isListPage" :posts="posts" />
    <PostPage v-else :post="post" />
  </main>
  <Footer />
</BlogLayout>
```

## Design System Guidelines

### Typography
- **Post title (page)**: 32-48px desktop, 24-32px mobile, weight 700-800
- **Card title**: 18-22px, weight 600-700
- **Body**: 16-18px, line-height 1.6-1.8
- **Meta**: 12-14px, muted color

### Spacing
- Use consistent scale: 4, 8, 12, 16, 24, 32, 48, 64, 96px
- Section padding: 48-64px vertical
- Grid gap: 24-32px

### Colors
- Body background: White or light gray (#f9fafb)
- Text: Dark gray (#111827)
- Muted: Medium gray (#6b7280)
- Links: Primary color on hover

## Modern UI Quality Contract (Framework-Agnostic)

This potion should produce polished, modern results without requiring exact font families, UI kits, or brand-specific styles.

### Core Principles

- Use one coherent surface language for cards, panels, forms, nav, and footer (consistent radius, border style, depth, and hover behavior)
- Establish clear above-the-fold hierarchy (primary focal point, secondary metadata, visible primary actions)
- Keep spacing rhythm predictable across sections; avoid random jumps in vertical density
- Use subtle depth layering (elevation, section separation, background treatment) to avoid flat starter aesthetics
- Ensure interaction states are deliberate and consistent (default, hover, focus-visible, active, disabled)

### Composition Rules

- Include at least one high-emphasis entry section (hero or full-width article header) that creates immediate visual identity
- Keep utility/sidebar modules visually grouped and clearly secondary to core reading content
- Optimize card grid readability before increasing density
- Reuse accents intentionally; avoid random one-off styling per component

### Anti-Patterns to Avoid

- Plain scaffold look with mostly default framework styles
- Mixed visual systems in one page (different corner radii, shadow logic, and component behavior)
- Decoration that harms readability or contrast
- Inconsistent focus and hover behavior across interactive elements

### Quick Quality Gate (Before Finalizing)

- [ ] The first screen has a clear focal point and readable supporting content
- [ ] Cards, sidebar blocks, forms, and navigation feel like one design system
- [ ] Interactive elements have visible and consistent state behavior
- [ ] Section spacing follows a repeatable rhythm
- [ ] The result does not look like a default starter template

## Layout Best Practices

### Blog List Grid Columns

When implementing the blog list page, choose the appropriate number of columns based on whether a sidebar is present:

**With Sidebar (Recommended Default):**
- Use **2 columns** on desktop
- With a 320px sidebar, this gives each card approximately 360-400px width
- Cards at this width maintain proper proportions and readability

**Without Sidebar:**
- Use **3 columns** on desktop
- Without the sidebar constraint, cards can be distributed across more columns
- Maintains optimal card sizing across the full content width

**Why Not 3 Columns With Sidebar?**
- Three columns with a 320px sidebar results in cards that are only ~240px wide
- Cards become too narrow, causing images and text to lose impact
- The layout feels cramped and reduces scannability

### Post Page Header Layout

The article header on post pages should create a strong visual entry point:

**Full-Width Hero:**
- Span the entire viewport width for visual impact
- Content within can be constrained (up to 1200px) but the section itself is full-width
- Creates a clear distinction between blog list and post page

**Constrained Content:**
- Only the article body content should be constrained to ~720px
- This optimal reading width applies to paragraphs, headings, and body content
- Sidebar sits alongside this constrained content area

**Why Not Constrain the Header?**
- A constrained header at 720px looks cramped and diminishes the post entry experience
- Full-width headers provide breathing room and visual hierarchy
- Separates the "landing" (header) from "reading" (content) experiences

## Testing Checklist

### Blog List Page
- [ ] Post grid displays correctly (2 columns desktop with sidebar, 3 without; 2 tablet; 1 mobile)
- [ ] Post cards show image, title, excerpt, date, author
- [ ] Post cards are properly sized (not too narrow ~240px, but ~360-400px when sidebar is visible)
- [ ] Pagination works (prev, next, page numbers)
- [ ] Sidebar displays or collapses on mobile
- [ ] Hero section displays (if implemented)

### Post Page
- [ ] Article header spans full width (not constrained to article width)
- [ ] Article header shows title, meta, author, reading time with visual impact
- [ ] Article content is constrained to optimal reading width (~720px)
- [ ] Sidebar displays TOC, author bio, related posts
- [ ] Share buttons are accessible
- [ ] Comments section structure present
- [ ] Related posts display

### Shared
- [ ] Navbar and footer consistent across pages
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] Images have alt text
- [ ] Heading hierarchy logical
- [ ] No horizontal scroll
- [ ] Mobile menu works (if implemented)

## See Also

The blog layout works well with these potions:

- **[Navbar Component](/potions/components/navbar)** - For the header navigation bar
- **[Button](/potions/components/button)** - For newsletter submit, pagination, share buttons
- **[Text Input](/potions/components/text-input)** - For search input, newsletter email, comment form
- **[Landing Page Layout](/potions/layouts/landing-page)** - Blog can share hero patterns with landing pages

These are suggestions. The blog layout is self-contained and works independently.
