# AI Evaluation Platform — Visual Design Direction

The application is an engineering/developer platform for evaluating AI agents and AI solutions.

The visual language should feel like a serious professional engineering product, not a generic AI SaaS dashboard.

## Overall aesthetic

Think:

- developer tooling
- observability platforms
- evaluation workbenches
- engineering consoles
- data-heavy professional applications

The interface should feel:

- precise
- technical
- calm
- trustworthy
- information-dense
- polished
- mature

It should NOT feel like a marketing website.

---

## Color direction

Do not use the current dark navy-on-dark-navy visual treatment.

The main application content should use a light neutral surface.

Recommended direction:

- application background: very light neutral gray
- primary surfaces: white
- primary text: near-black charcoal
- secondary text: cool gray
- borders: subtle neutral gray
- sidebar: deep charcoal/navy
- accent: a restrained violet/purple

Use the accent color primarily for:

- active navigation
- primary actions
- links
- selected states
- important interactive elements

Do NOT use blue/purple everywhere.

Do NOT use gradients.

Do NOT use glowing effects.

Do NOT use neon colors.

Do NOT use colored backgrounds for ordinary containers.

---

## Sidebar

Create a compact professional engineering-tool sidebar.

The sidebar should visually recede from the main workspace.

Use:

- dark neutral background
- subtle separators
- compact navigation
- clear section labels
- neutral inactive items
- one clearly highlighted active item

Do not give every navigation item a colored icon.

Do not use excessive blue text.

Do not make the sidebar visually compete with the workspace.

---

## Main workspace

The workspace should feel like a professional tool.

Use:

- generous but controlled whitespace
- strong typography hierarchy
- subtle borders
- compact controls
- tables
- lists
- tabs
- split panes
- inline status indicators
- contextual actions

Avoid turning every section into a rounded card.

Cards should only be used when they communicate a meaningful grouping.

---

## Information density

This is NOT a consumer dashboard.

The product contains:

- AI agents
- evaluation specifications
- scenarios
- datasets
- test suites
- graders
- executions
- traces
- failures
- root-cause analysis
- business results
- technical results

Therefore prioritize useful information density.

Prefer showing real data over decorative empty space.

Use tables and structured lists when appropriate.

---

## Status system

Use semantic status colors consistently.

Success:
subtle green

Warning:
subtle amber

Failure:
subtle red

Information:
accent color

Do not use bright saturated backgrounds.

Prefer small indicators, badges and inline status rather than large colored cards.

---

## Cards

Cards are not the default layout primitive.

Before creating a card, ask:

"Does this information actually need to be visually grouped?"

If not, use:

- a list
- a table
- a divider
- inline content
- a section
- a split layout

Avoid:

- giant rounded cards
- excessive shadows
- cards inside cards
- card grids for everything

---

## Borders and shadows

Prefer subtle borders and spacing over shadows.

Most surfaces should use:

- 1px subtle border
- flat background
- minimal radius

Do not give every component a shadow.

Do not use floating/glassmorphism panels.

---

## Border radius

Use restrained corner radii.

Do not use `rounded-2xl` or `rounded-3xl` as the default.

Small controls can use small radii.

Larger containers may use modest radii.

The interface should feel precise rather than playful.

---

## Icons

Use icons only where they improve comprehension.

Do not put an icon beside every heading simply to make the UI look designed.

Avoid decorative icon grids.

---

## Empty states

Never create giant empty placeholder panels containing implementation instructions.

If a feature has no data:

show a compact, useful empty state containing:

- what is missing
- why it matters
- the action needed to populate it

Do not expose internal development/navigation instructions to the user.

---

## Page design

Every page should answer immediately:

1. Where am I?
2. What is this page for?
3. What can I do here?
4. What information is available?
5. What requires my attention?

Preferred structure:

Breadcrumb
Page title + description + primary action
Relevant filters/tabs
Actual data/content

Do not create large decorative headers.

---

## AI-specific UI

Avoid the common "AI UI" visual language:

- glowing purple gradients
- sparkle icons
- excessive AI badges
- animated gradients
- glowing borders
- glassmorphism
- futuristic backgrounds
- robot illustrations

This is an engineering product that evaluates AI systems.

It should look like professional infrastructure software.

---

## Design test

Before completing every screen, ask:

"Could this screenshot be mistaken for a generic AI-generated SaaS dashboard?"

If yes, redesign it.

Also ask:

"Does this look like a real application containing real data?"

If no, increase useful information density and remove decorative placeholder UI.

The goal is not to make the interface unusual.

The goal is to make every visual decision intentional.
