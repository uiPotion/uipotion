---
layout: 'potion'
title: 'Data Table (Sortable, Paginated, Filterable)'
publicationDate: '2026-01-18'
excerpt: 'A comprehensive data table component with sorting, pagination, filtering, row selection, and responsive behavior. Includes loading, empty, and error states with full keyboard navigation support.'
category: 'Components'
tags:
  - components
  - data-table
  - table
  - sortable
  - pagination
  - filtering
  - selection
  - responsive
  - a11y
  - wcag
  - admin
  - dashboard
agentManifest: 'potions/components/data-table.json'
path: 'potions/components/data-table'
---

# Data Table (Sortable, Paginated, Filterable)

## Overview

A comprehensive data table component designed for displaying and managing tabular data in admin panels, dashboards, and data-driven applications. The component provides essential features for data manipulation including column sorting (ascending/descending), client-side pagination with configurable page sizes, row selection (single and multi-select), and responsive behavior that adapts to mobile screens by displaying data in a card-based layout.

The table supports multiple states including loading (with skeleton rows), empty state (when no data is available), and error state (when data fetching fails). All interactions are fully keyboard accessible with proper ARIA attributes, making it compliant with WCAG AA standards.

## Component Structure

The data table consists of several key sections organized in a clear hierarchy:

**Main Container** - Root wrapper that manages responsive behavior and contains all table elements
- **Table Header** - Contains column headers with sort indicators and selection checkbox
- **Table Body** - Displays data rows or state indicators (loading/empty/error)
- **Selection Controls** - Toolbar with bulk action buttons when rows are selected
- **Pagination Controls** - Navigation controls at the bottom with page info and size selector

## Column Configuration

Each column in the table is defined with the following properties:

**Column Definition Structure**:
- **id** - Unique identifier for the column
- **header** - Display text for column header
- **accessor** - Key to access data from row object (or custom render function)
- **sortable** - Whether the column supports sorting (default: true)
- **width** - Optional fixed width (default: auto-sizing)
- **align** - Text alignment: left (default), center, or right
- **hidden** - Whether column is hidden on mobile breakpoints

## Sorting Behavior

Columns support three sort states that cycle on click:
1. **Unsorted** (initial state) - No sort indicator
2. **Ascending** - Upward arrow indicator, data sorted A-Z or 0-9
3. **Descending** - Downward arrow indicator, data sorted Z-A or 9-0

Clicking a sortable column header cycles through these states. Only one column can be sorted at a time (single-column sort). The active sort column is visually distinguished with a highlighted header and clear sort indicator.

## Pagination

The pagination system provides intuitive navigation through large datasets:

**Pagination Controls Include**:
- Previous/Next page buttons (disabled at boundaries)
- Page number indicators (current page highlighted)
- Page size selector (10, 25, 50, 100 rows per page)
- Total results count display ("Showing 1-10 of 245 results")
- Jump to first/last page buttons (optional)

Pagination info updates immediately when changing page size or navigating. Page numbers adapt to show a limited range (e.g., "1 2 3 ... 15 16 17 ... 45") for large datasets.

## Row Selection

Users can select individual rows or all rows on the current page:

**Selection Features**:
- **Header Checkbox** - Selects/deselects all rows on current page
- **Row Checkboxes** - Individual row selection
- **Shift+Click** - Range selection from last selected row
- **Keyboard Navigation** - Space key toggles selection for focused row
- **Selection Toolbar** - Appears above table showing count and bulk action buttons
- **Clear Selection** - Button to deselect all selected rows

Visual feedback includes highlighted background for selected rows and checkbox state indicators (checked, unchecked, indeterminate for header when some rows selected).

## Responsive Design

The table adapts to different screen sizes with two distinct layouts:

**Desktop (≥1024px)**:
- Standard table layout with all columns visible
- Horizontal scroll for wide tables if needed
- Sticky header option for long tables

**Tablet (768px - 1023px)**:
- Simplified table layout with fewer columns
- Non-essential columns hidden via column config

**Mobile (<768px)**:
- Card-based layout replacing table rows
- Each card displays key data fields vertically
- Selection checkboxes maintained in card headers
- Sorting and filtering preserved via dropdown controls
- Pagination simplified to Previous/Next only

## Loading, Empty, and Error States

The table handles data loading states gracefully:

**Loading State**:
- Skeleton rows with animated placeholders
- Maintains table structure for smooth transition
- Number of skeleton rows matches page size
- Loading message for screen readers

**Empty State**:
- Centered message with optional icon
- Helpful text ("No data available" or "No results match your filters")
- Optional call-to-action button
- Maintains table header for context

**Error State**:
- Error message with icon
- Retry button to attempt data reload
- Error details (optional, for debugging)
- Maintains table structure

## Accessibility

The data table is fully accessible with comprehensive keyboard support:

**Keyboard Navigation**:
- **Tab** - Navigate between interactive elements (headers, checkboxes, pagination)
- **Space** - Toggle row selection when row is focused
- **Enter** - Activate sort on column header, activate buttons
- **Arrow Keys** - Navigate between cells (optional advanced navigation)
- **Shift+Click** - Range selection

**ARIA Attributes**:
- `role="table"` on table container (or semantic `<table>`)
- `role="columnheader"` with `aria-sort="ascending|descending|none"`
- `aria-label` on interactive elements (sort buttons, checkboxes)
- `aria-selected="true"` on selected rows
- `aria-live="polite"` region for pagination updates
- `aria-busy="true"` during loading state

**Screen Reader Support**:
- Announces sort state changes
- Announces pagination info updates
- Announces selection count changes
- Provides context for each table cell

**Focus Management**:
- Clear focus indicators on all interactive elements
- Focus preserved on current element during data updates
- Focus moves logically through table structure

## Framework Patterns

The data table can be implemented across different frameworks using appropriate patterns:

**React**: Use `useState` for sort/page/selection state, `useMemo` for filtered/sorted data, custom hooks for table logic (`useTableSort`, `useTablePagination`, `useTableSelection`)

**Vue**: Use `ref()` or `reactive()` for state, `computed()` for derived data (sorted/paginated), composables for reusable logic

**Angular**: Component properties for state, getter methods or pipes for transformations, RxJS for async data loading

**Svelte**: Reactive statements for derived data, stores for shared table state, actions for enhanced DOM interactions

## Testing Checklist

- [ ] Columns render with correct headers and data
- [ ] Sorting works for all sortable columns (ascending, descending, clear)
- [ ] Only one column sorted at a time
- [ ] Pagination controls navigate correctly
- [ ] Page size changes update results correctly
- [ ] Row selection works (single, multiple, all)
- [ ] Shift+click range selection works
- [ ] Header checkbox has correct state (checked/unchecked/indeterminate)
- [ ] Selected row count displays correctly
- [ ] Bulk actions appear when rows selected
- [ ] Clear selection works
- [ ] Loading state displays skeleton rows
- [ ] Empty state displays when no data
- [ ] Error state displays with retry button
- [ ] Mobile card layout renders correctly
- [ ] Responsive breakpoints work correctly
- [ ] Keyboard navigation works (Tab, Space, Enter)
- [ ] Screen reader announces state changes
- [ ] Focus indicators visible on all interactive elements
- [ ] ARIA attributes present and correct
- [ ] Color contrast meets WCAG AA (4.5:1)
- [ ] Sort animations smooth (if implemented)
- [ ] No layout shift during data updates
- [ ] Table accessible via screen reader
- [ ] All interactive elements keyboard accessible
