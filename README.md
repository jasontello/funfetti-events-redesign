# Funfetti Events Website Redesign

A responsive redesign concept for **Funfetti Events**, a Northern California event-planning and party-rental business. The project refreshes the company's existing website with clearer service discovery, stronger calls to action, playful custom visuals, and an interactive event-rental estimator.

> This is a portfolio project created with permission for an existing local business. It is a redesign concept, not the business's current production website.

[View the live redesign](https://jasontello.github.io/funfetti-events-redesign/) · [View the original website](https://funfettievents.com/)

![Funfetti Events illustrated party scene](assets/hero-illustration-v3.png)

## Project Overview

The original Funfetti Events website contains useful information about the company and its services, but the redesign explores a more memorable and customer-focused experience. The new direction keeps the business playful while making the presentation polished enough for weddings, corporate events, family celebrations, and adult parties.

The experience is organized around a simple customer journey:

1. Understand what Funfetti Events offers.
2. Browse examples of previous event setups.
3. Estimate basic table and chair needs.
4. Contact the business for availability and an exact quote.

## Key Features

- Responsive floating navigation with a mobile menu
- Custom illustrated hero and short session-based intro animation
- Service cards for rentals, photo booths, and event support
- Dedicated event-rental estimator with guided and manual paths
- Animated guided questions with event-specific illustrations
- Estimates for tables, chairs, chair packages, and a planning-range subtotal
- Quote request links prefilled with the customer's estimator selections
- Horizontally moving event gallery with pause-on-hover and touch scrolling
- Accessible full-screen gallery lightbox with keyboard controls
- Business information, contact links, social links, and responsive footer
- Reduced-motion support for visitors who prefer less animation

## Event Estimator

The estimator gives visitors two ways to plan their event:

- **Guided walkthrough:** asks one question at a time about the event type, guest count, seating style, service tables, and chair buffer.
- **Manual entry:** displays all estimator controls at once for visitors who already know what they need.

Answers stay synchronized when switching between the two modes. The result includes recommended quantities and a planning-range subtotal, then prepares an email containing the selections for a more accurate quote from Funfetti Events.

The estimator is a planning aid only. Delivery, setup, taxes, availability, venue requirements, and event-specific pricing are intentionally left for the final business quote.

## Design Direction

The visual system balances celebration and professionalism:

- Warm off-white backgrounds keep the site bright and approachable.
- Blue anchors the brand presentation without returning to a green-dominant theme.
- Yellow, orange, pink, and purple appear as supporting party accents.
- Editorial serif headings are paired with clean sans-serif body copy.
- Hand-drawn illustrations, highlights, and doodles add energy without overwhelming the content.

The existing Funfetti Events logo is retained for brand continuity. A future phase could modernize the logo to better match the new visual system.

## Accessibility

The interface includes:

- Semantic headings, landmarks, labels, and form controls
- Visible keyboard focus states
- Keyboard navigation for the gallery lightbox
- Escape-key support for dismissing the intro and lightbox
- Reduced-motion behavior for animations and transitions
- Descriptive image alternative text where images provide meaning
- Mobile layouts designed to avoid horizontal overflow

## Built With

- HTML5
- CSS3
- Vanilla JavaScript
- [Vite](https://vite.dev/)
- GitHub Pages

No front-end framework or component library is used.

## Project Structure

```text
funfettievents/
├── assets/             Images, illustrations, logo, and intro media
├── index.html          Main marketing page
├── styles.css          Main-page styles and responsive behavior
├── main.js             Intro, navigation, and gallery interactions
├── estimator.html      Event-estimator page
├── estimator.css       Estimator layout, components, and animations
├── estimator.js        Estimate calculations and walkthrough behavior
├── vite.config.mjs     Multi-page Vite and GitHub Pages configuration
└── package.json        Scripts and development dependencies
```

## Run Locally

### Requirements

- Node.js 20 or newer
- npm

### Setup

```bash
git clone https://github.com/jasontello/funfetti-events-redesign.git
cd funfetti-events-redesign
npm install
npm run dev
```

Open the local URL printed by Vite, normally `http://localhost:5173/`.

## Production Build

```bash
npm run build
npm run preview
```

Vite creates the production files in `dist/`. The project uses `base: './'` so both pages and their assets work under the GitHub Pages repository path.

## Deployment

The live demo is published from the `gh-pages` branch:

```bash
npm run build
npx --yes gh-pages@6.3.0 -d dist -m "Deploy website update"
```

## Future Improvements

- Replace planning allowances with a business-managed pricing and inventory source
- Add more real event photography to the gallery
- Connect the estimator to a hosted inquiry form or lightweight backend
- Create dedicated FAQ and policy pages
- Redesign the existing logo to match the refreshed visual identity
- Perform usability testing with prospective rental customers

## Credits and Usage

Design and development by [Jason Tello](https://github.com/jasontello).

The Funfetti Events name, logo, business photography, service information, and social accounts belong to Funfetti Events and are included here for this redesign project. Custom project illustrations were created specifically for this concept. Do not reuse the business branding or photography without permission.
