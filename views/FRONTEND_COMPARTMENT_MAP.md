# Frontend Compartment Map

## Frontend Entrypoint

- Build entry: [`views/transform/main.js`](/home/simon/source/musenalm/views/transform/main.js)
- Vite config: [`views/vite.config.js`](/home/simon/source/musenalm/views/vite.config.js), [`views/vite.dev.config.js`](/home/simon/source/musenalm/views/vite.dev.config.js)
- Runtime include: [`views/layouts/components/_head.gohtml`](/home/simon/source/musenalm/views/layouts/components/_head.gohtml)
- Build output: `/assets/scripts.js`
- CSS chain: `main.js -> site.css -> form.css + usermgmt.css`

This means `main.js` is the single JS bootstrap for the whole server-rendered frontend. Most custom elements are globally registered there, and several cross-page behaviors also still live there directly.

## What `main.js` Contains

### 1. Asset and library bootstrap

- Imports `site.css`, `trix`, `tippy.js`, and the tooltip stylesheet.
- Disables Trix file attachments globally via `trix-file-accept`.
- Role: low-level startup. This belongs in a thin bootstrap file.

### 2. Custom element registry

- Imports and registers almost every custom element used by the frontend.
- Tags registered here include `filter-list`, `tool-tip`, `popup-image`, `tab-list`, `image-reel`, `multi-select-simple`, `lookup-field`, `edit-page`, `almanach-edit-page`, `content-images`, `content-person-relations`, `content-series-relations`, and others.
- Role: central registry only. It should stay small and declarative.

### 3. Global helpers exported on `window`

- `lookupSeriesValue`, `lookupSeriesLink`, `lookupRequiredText`, `lookupRequiredId`
  - consumed by `lookup-field` through `data-*-fn` attributes
  - currently used in the Almanach edit page
- `ShowBoostedErrors`
  - called from `_head.gohtml`
  - replaces the whole document on HTMX boosted response errors
- `GenQRCode`, `SelectableInput`
  - used in admin access-token pages
- `PathPlusQuery`
  - utility for encoding current path and query
- `HookupRBChange`
  - used by the user edit page to aggregate `reset-button` change state
- `FormLoad`, `TextareaAutoResize`, `InitTimedMessages`
  - used by page components and dynamic UI code

Role: legacy global API surface. These are strong candidates to reduce over time, but some are still required by templates and custom elements.

### 4. Cancel-link handling

- `setupCancelLinks(root)`
- Resolves `[data-role='cancel-link']`
- If `data-cancel-url` exists, it writes `href`; otherwise it falls back to browser history
- Re-run on `DOMContentLoaded`, `htmx:afterSwap`, and `htmx:load`

Used in:
- simple entity action bars
- content edit forms
- Almanach edit form

### 5. Admin status picker behavior

- `closeAdminStatusMenus`, `applyAdminStatusPickerState`, `updateAdminStatusTimestamps`, `initAdminStatusPickers`
- Owns the interactive state picker menu for `[data-role='content-status-picker']`
- Posts JSON to a `data-status-endpoint`, updates icon state optimistically, and refreshes `last_edited` timestamps in nearby rows
- Exposed as `window.initAdminStatusPickers`

Used in:
- shared status-picker partials
- admin `Baende` rows
- admin content workspace code after HTMX updates

This is admin-only behavior and should move out of the global bootstrap first.

### 6. Admin sidebar cleanup and tooltips

- `markHashNavigationCurrent`
- `pruneAdminSidebarDetails`
- `initAdminSidebarTooltips` / `destroyAdminSidebarTooltips`
- Removes extra sidebar detail text from non-current links
- Uses `tippy` when the admin sidebar is collapsed

Role: layout-specific admin behavior. Good candidate for an `admin-shell.js` module.

### 7. Reset-button aggregation

- `HookupRBChange(target, action)`
- Listens for `rbichange` from nested `reset-button` components
- Reports whether any child reset button is currently modified

Used in:
- admin user edit page

### 8. Textarea behavior and form bootstrapping

- `supportsFieldSizing`, `resolveLineHeightPx`, `TextareaAutoResize`
- `HookupTextareaAutoResize`, `DisconnectTextareaAutoResize`
- `NoEnters`, `HookupNoEnters`, `DisconnectNoEnters`
- `MutateObserve`
- `FormLoad(form)`

What it does:
- auto-resizes textareas when CSS `field-sizing` is unavailable
- enforces `.no-enter` textareas
- observes dynamically added form content
- normalizes boolean checkbox submission with hidden `false` inputs

Used by:
- `EditPage`
- `AlmanachEditPage`
- `DivManager`
- any template that relies on `window.FormLoad`

This is generic shared form infrastructure and should be split out as its own shared module.

### 9. Global HTMX notice

- `InitGlobalHtmxNotice()`
- Creates and maintains `#global-notice`
- Tracks pending HTMX requests
- Sets busy state on `documentElement`, `body`, and triggering elements
- Handles request, response error, send error, swap, and `pageshow`

Role: cross-page HTMX UX. Good shared infrastructure module.

### 10. Sticky action bars

- `InitStickyActionBars()`
- Adds/removes `.is-stuck` on `.form-action-bar` depending on viewport position

Role: small global UI behavior; easy to move into a `ui/sticky-action-bars.js`.

### 11. Timed flash messages

- `InitTimedMessages()`
- Auto-hides `[data-autohide='true']` messages
- re-schedules after HTMX swaps and DOM insertions

Role: shared feedback behavior; independent module.

### 12. Global event wiring

- Registers listeners for `DOMContentLoaded`, `htmx:afterSwap`, `htmx:load`, `admin-sidebar-statechange`, document `click`, document `keydown`, and `pageshow`
- The pattern is mostly "re-run initializers on freshly swapped DOM"

This is the real reason `main.js` feels crowded: it is both registry and runtime coordinator.

## Imported Modules

### Search and navigation

- `filter-list.js`
  - Tag: `filter-list`
  - Used in search and Reihen filter UIs
  - Filters a rendered link list client-side and drives navigation to the first match on Enter
  - Depends on `Mark` for highlighting
- `filter-pill.js`
  - Tag: `filter-pill`
  - Used in Beitrage search pills
  - Renders an active-filter chip that removes one query parameter and performs an HTMX request
- `int-link.js`
  - Tag: `int-link`
  - Used in TOC components
  - Smooth-scrolls to a selector given in `data-jump`
- `scroll-button.js`
  - Tag: `scroll-button`
  - Used in the shared footer
  - Shows a fixed scroll-to-top button after the page is scrolled

### Presentation helpers

- `tool-tip.js`
  - Tag: `tool-tip`
  - Used widely across public and admin templates
  - Custom tooltip implementation with hover timing, dynamic content watching, and drag suppression
- `status-tooltips.js`
  - Export: `initStatusTooltips`
  - Used indirectly from `main.js`
  - Initializes `tippy.js` for `[data-tippy-content]`
- `popup-image.js`
  - Tag: `popup-image`
  - Used in public and admin image galleries
  - Opens a full-screen overlay, supports next/previous navigation, and optional download button
- `image-reel.js`
  - Tag: `image-reel`
  - Used on the main body page
  - Shows only as many preview images as fit within the current width
- `abbrev-tooltips.js`
  - Tag: `abbrev-tooltips`
  - Used in Almanach entry data
  - Rewrites abbreviations into inline `tool-tip` markup using a built-in abbreviation map
- `tab-list.js`
  - Tag: `tab-list`
  - Used in linked-items and person pages
  - Shows one tab panel at a time, with optional disabled/default tab indices

### Generic form controls

- `reset-button.js`
  - Tag: `reset-button`
  - Used in admin user edit forms
  - Tracks controlled input state, resets fields to original values, and emits change state
- `lookup-field.js`
  - Tag: `lookup-field`
  - Used in admin edit pages for entities and Almanach
  - Renders text or textarea lookup input plus hidden ID field, remote search results, duplicate warnings, and an edit/open link
  - Depends on `window` function names provided via attributes
- `single-select-remote.js`
  - Tag: `single-select-remote`
  - Used inside relation editors
  - Remote autocomplete/select control for a single chosen item
- `multi-select-simple.js`
  - Tag: `multi-select-simple`
  - Used in Almanach edit and content editing flows
  - Rich multiselect with pills, optional remote fetch, ordering/removal tracking, and form-associated behavior
- `multi-select-role.js`
  - Tag: `multi-select-places`
  - Imported globally, but no current template usage found
  - Likely a role/checkbox style multiselect kept for future or legacy use
- `content-type-select.js`
  - Tag: `content-type-select`
  - Used in admin content type dropdown
  - Custom menu/select control for content type switching

### Dynamic editors

- `div-menu.js`
  - Tag: `div-manager`
  - Used in content/status edit partials and Almanach edit
  - Moves optional field groups into target containers and toggles them through a menu
  - Calls `window.TextareaAutoResize` when newly shown content contains textareas
- `items-editor.js`
  - Tag: `items-editor`
  - Used in Almanach edit
  - Adds/removes/edits repeated item rows from a `<template>`, manages summary text, and tracks removed items
- `relations-editor.js`
  - Tag: `relations-editor`
  - Used by the shared content relations editor
  - Adds/removes relation rows, especially for classic agent/series relation blocks
  - Uses `single-select-remote` inside its add panel
- `content-person-relations.js`
  - Tag: `content-person-relations`
  - Used in Almanach edit and shared content relation partials
  - Specialized editor for person relations with its own remote search and row template flow
- `content-series-relations.js`
  - Tag: `content-series-relations`
  - Used in Almanach edit
  - Specialized editor for series relations with duplicate prevention and template-based row insertion
- `content-images.js`
  - Tag: `content-images`
  - Used in content image panels
  - Manages content-associated images, uploads/selection state, ordering, and HTMX-backed updates

### Page-level controllers

- `edit-page.js`
  - Tag: `edit-page`
  - Used in simple admin entity edit pages
  - Calls `window.FormLoad`, manages delete dialog flow, and syncs status icon classes
- `almanach-edit.js`
  - Tag: `almanach-edit-page`
  - Used only in the admin Almanach edit page
  - Page-specific orchestrator for form init, places multiselect init, save/reset/delete actions, and dynamic relation/image areas
- `duplicate-warning.js`
  - Tag: `duplicate-warning-checker`
  - Used in several admin edit pages
  - Debounced exact-match duplicate checking against remote endpoints
- `export-manager.js`
  - Tag: `export-manager`
  - Used in admin exports and settings pages
  - Starts exports, polls status, and updates export UI

## Template Usage Map

- Always loaded globally:
  - `_head.gohtml` loads `/assets/scripts.js`
- Heaviest page-specific consumers:
  - `admin/almanach/edit/body.gohtml`
  - `admin/contents/edit/body.gohtml`
  - `routes/components/_content_relations_editor.gohtml`
- Most reused UI primitives:
  - `tool-tip`
  - `popup-image`
  - `filter-list`
  - `tab-list`
  - `lookup-field`
  - `edit-page`

This means the clearest split is not by file size alone, but by runtime scope: global shared behavior, admin shell behavior, shared form infrastructure, and page-specific controllers.

## Unused And Unimported Files

### Confirmed active through imports

- `main.js` is not imported by another source file, but it is the Vite entrypoint, so it is active.
- `site.css` is active via `main.js`.
- `form.css` is active via `site.css`.
- `usermgmt.css` is active via `site.css`.

### Imported but currently unused in templates

- `multi-select-role.js`
  - imported and registered by `main.js`
  - no current `<multi-select-places>` usage found in `views/routes` or `views/layouts`
  - likely dead or waiting for re-use
- `single-select-remote.js`
  - imported and registered by `main.js`
  - no direct template tag usage found
  - still active indirectly because `relations-editor` depends on it internally
- `div-menu.js`
  - direct tag usage exists
  - earlier raw filename search undercounted it because the tag is `div-manager`, not `div-menu`

### Present but not imported and not used anywhere found

- [`views/transform/easymde-example.js`](/home/simon/source/musenalm/views/transform/easymde-example.js)
  - no importers
  - no template references
  - no build references
  - current status: safe candidate for deletion or archival once confirmed no one uses it manually

No other file in `views/transform` is currently in the "not imported and not used in any way" bucket.

## Suggested Split Boundaries

### 1. Keep `main.js` as bootstrap only

Leave only:
- CSS import
- third-party library bootstrapping
- custom element registration
- imports of initializer modules
- one `boot()` function that wires global listeners

### 2. Move shared infrastructure out first

- `form-runtime.js`
  - `TextareaAutoResize`
  - no-enter logic
  - mutation observers
  - `FormLoad`
- `htmx-runtime.js`
  - global notice
  - boosted error handling
  - HTMX re-init hooks
- `messages-runtime.js`
  - timed autohide
- `sticky-action-bars.js`

These are cross-page and do not belong beside custom element registration.

### 3. Move admin-only runtime into its own module

- `admin/status-pickers.js`
- `admin/sidebar-tooltips.js`
- `admin/cancel-links.js`

That will remove a large amount of admin-specific branching from the global entrypoint.

### 4. Keep page controllers page-local

- `almanach-edit.js`
- `edit-page.js`
- `export-manager.js`

These should stay separate from shared primitives and should not accumulate more global responsibilities.

### 5. Group primitives by purpose

- `components/navigation`
  - `filter-list`, `filter-pill`, `int-link`, `scroll-button`, `tab-list`
- `components/feedback`
  - `tool-tip`, `status-tooltips`, `abbrev-tooltips`
- `components/media`
  - `popup-image`, `image-reel`, `content-images`
- `components/forms`
  - `reset-button`, `lookup-field`, `single-select-remote`, `multi-select-simple`, `multi-select-role`, `content-type-select`
- `components/editors`
  - `div-menu`, `items-editor`, `relations-editor`, `content-person-relations`, `content-series-relations`, `duplicate-warning`

That split matches the current behavior better than splitting by page alone.
