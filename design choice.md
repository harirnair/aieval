# UI Design Directive — Human-Designed, Product-Specific UI

## Core principle

Do not generate a generic "AI-designed" SaaS interface.

The UI must feel like it was designed specifically for this product, its users, and its workflow — not assembled from a generic Tailwind/shadcn dashboard template.

Prioritize:

- product context
- information hierarchy
- usability
- visual identity
- purposeful density
- consistency
- restraint
- accessibility

Do not optimize for "modern-looking" at the expense of product-specific design.

---

## 1. Explicitly avoid AI-generated UI patterns

Do NOT default to:

- purple/indigo/blue gradients
- gradient text
- aurora backgrounds
- decorative blobs
- glassmorphism
- frosted-glass panels
- excessive backdrop blur
- huge rounded cards
- `rounded-2xl` / `rounded-3xl` everywhere
- excessive pill-shaped controls
- gradient buttons
- excessive drop shadows
- floating cards with shadows
- three-card feature grids
- repetitive icon + title + description cards
- generic KPI card grids
- centered SaaS hero sections
- oversized marketing headlines
- fake testimonials
- "Trusted by 5,000+..." style content
- generic marketing copy
- emoji as UI icons
- unnecessary illustrations
- decorative elements that do not communicate information
- animations simply because an element can animate
- hover effects that scale or lift every component
- excessive empty space
- putting every piece of information inside a card
- making every section visually symmetrical
- making every component look equally important

Do not use these patterns unless there is a clear product-specific reason.

---

## 2. Do not automatically use the standard AI stack

Do not automatically choose:

- Inter
- Roboto
- Arial
- system-ui

Do not automatically choose:

- shadcn/ui visual defaults
- Lucide icons for everything
- Tailwind's default color palette
- Tailwind's default border radius everywhere

Libraries may be used for implementation, but their visual defaults must NOT determine the product's visual identity.

---

## 3. Establish a design system BEFORE implementing the UI

Before writing components, determine:

### Typography

Choose a deliberate typeface appropriate for the product.

Define:

- display size
- page title size
- section title size
- body size
- metadata size
- line heights
- font weights

Use typography to create hierarchy rather than relying on cards, colors and shadows.

### Color

Create a deliberate semantic palette:

- background
- elevated surface
- primary text
- secondary text
- muted text
- border
- primary action
- success
- warning
- error
- informational

Use color primarily for meaning and hierarchy.

Do not use gradients simply to make the interface look "premium."

Use one meaningful brand/accent color rather than several competing accent colors.

### Spacing

Use a consistent spacing system.

Prefer a small number of deliberate spacing values rather than arbitrary spacing throughout the application.

### Radius

Choose a restrained radius system.

Not every element needs rounded corners.

Use smaller radii for dense/productive interfaces and larger radii only where they communicate grouping or hierarchy.

### Shadows

Prefer borders, contrast and spacing to communicate hierarchy.

Use shadows sparingly.

---

## 4. Design for the actual product workflow

Before designing a screen, ask:

1. Who is using this screen?
2. What are they trying to accomplish?
3. What information do they need first?
4. What information is secondary?
5. What action should be easiest to perform?
6. What information should remain visible while they work?
7. What can be progressively disclosed?
8. What should be dense versus spacious?

Do not turn every screen into a generic dashboard.

The interface should reflect the domain.

---

## 5. Prefer product surfaces over decorative cards

Do not put everything into cards.

Use:

- tables
- lists
- split panes
- timelines
- command bars
- inline controls
- tabs
- side panels
- drawers
- contextual toolbars
- dense information surfaces
- inline status indicators

when they are more appropriate.

Cards should communicate meaningful grouping.

If removing a card does not reduce comprehension, consider removing it.

---

## 6. Create visual hierarchy through structure

The most important information should be visually dominant.

Use:

1. typography
2. spacing
3. position
4. contrast
5. grouping
6. color

in that order where possible.

Do not make everything visually prominent.

Avoid the common AI pattern where every component has:

- a border
- a background
- a shadow
- rounded corners
- an icon
- an accent color

That creates visual noise.

---

## 7. Motion must have a reason

Animations should communicate:

- state changes
- progress
- loading
- hierarchy
- navigation
- feedback

Do not animate elements merely because hover animations look impressive.

Avoid:

- excessive scale transforms
- bouncing
- floating
- exaggerated spring animations
- constant background motion

Prefer subtle transitions around 100–200ms.

---

## 8. Icons must communicate meaning

Do not add icons just to make empty space look designed.

Every icon should either:

- communicate meaning
- identify an action
- improve navigation
- improve scanning

Avoid decorative icon grids.

---

## 9. Content must feel real

Do not generate placeholder marketing language such as:

"Supercharge your workflow"

"Unlock powerful insights"

"Seamlessly manage your workflow"

"Built for the future"

Use concise, functional language appropriate for the actual product.

Labels should tell the user what something does.

---

## 10. Avoid unnecessary symmetry

Do not force every layout into:

3 columns
4 columns
equal cards
centered content
perfect symmetry

Real product interfaces often benefit from asymmetry.

Allow the content hierarchy to determine the layout.

---

## 11. Make the interface feel like a real application

For application screens, prioritize:

- useful density
- persistent context
- fast scanning
- keyboard accessibility
- clear states
- useful empty states
- meaningful loading states
- meaningful error states
- clear success feedback

Do not make internal product screens look like marketing landing pages.

---

## 12. Design states, not just screenshots

Every important component should consider:

- default
- hover
- focus
- active
- disabled
- loading
- empty
- error
- success

Do not treat the static happy path as the complete UI.

---

## 13. Accessibility is part of the design

Ensure:

- sufficient color contrast
- visible keyboard focus
- semantic HTML
- accessible labels
- appropriate ARIA only where necessary
- keyboard navigation
- readable text sizes
- status changes communicated appropriately

Do not sacrifice usability for visual aesthetics.

---

# REQUIRED DESIGN PROCESS

Before implementing a significant UI screen:

### Step 1 — Understand

Identify:

- user
- task
- information hierarchy
- primary action
- secondary actions
- important states

### Step 2 — Define visual direction

Choose deliberately:

- typography
- palette
- radius
- spacing
- density
- icon style
- interaction style

Do not let the framework choose these automatically.

### Step 3 — Define the layout

Explain why each major region exists.

Do not start with a generic dashboard/landing-page template.

### Step 4 — Implement

Build the UI using the defined design system.

### Step 5 — Critique yourself

Before considering the work complete, inspect the result and ask:

- Could this UI belong to any random SaaS product?
- Does it look like a default shadcn/Tailwind implementation?
- Did I use cards where a simpler layout would work?
- Did I use gradients unnecessarily?
- Is the typography distinctive and intentional?
- Is there excessive rounding?
- Is there excessive whitespace?
- Is everything trying to attract attention?
- Are icons being used decoratively?
- Does the layout reflect the actual workflow?
- Does the interface feel like a real product rather than a generated mockup?

If the answer to any of these indicates generic AI styling, revise the design before finishing.

---

# IMPORTANT

Do not interpret "avoid AI-looking UI" as "make the UI unusual."

The goal is NOT novelty.

The goal is intentionality.

A simple interface is acceptable if every visual decision has a reason.

Prefer:

**specific + restrained + functional + distinctive**

over:

**flashy + trendy + decorative + generic**
