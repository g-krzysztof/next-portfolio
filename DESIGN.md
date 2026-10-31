---
name: krzysztofg.pl
description: Bilingual single-page portfolio of Krzysztof Gryc, Senior React Developer, built around a business card you can tilt and flip.
colors:
  field: "#0F3B3A"
  field-deep: "#0A2C2B"
  teal: "#50A3A2"
  teal-ink: "#23706F"
  band-mid: "#6CC39A"
  mint: "#8FE388"
  paper: "#F3F6F1"
  paper-deep: "#E3ECE7"
  line: "#CFDCD6"
  ink: "#10201F"
  ink-soft: "#2D4644"
  ink-muted: "#4F6965"
  on-field: "#F3F6F1"
  on-field-soft: "#C6DAD5"
typography:
  display:
    fontFamily: "Bricolage Grotesque, system-ui, sans-serif"
    fontSize: "clamp(3.25rem, 7.4vw, 6rem)"
    fontWeight: 800
    lineHeight: 0.92
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Bricolage Grotesque, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 6vw, 5rem)"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "-0.04em"
  display-link:
    fontFamily: "Bricolage Grotesque, system-ui, sans-serif"
    fontSize: "clamp(1.9rem, 6.2vw, 5.25rem)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.035em"
  headline-deck:
    fontFamily: "Bricolage Grotesque, system-ui, sans-serif"
    fontSize: "clamp(2rem, 3.4vw, 3.1rem)"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "-0.04em"
  card-name:
    fontFamily: "Bricolage Grotesque, system-ui, sans-serif"
    fontSize: "clamp(1.9rem, 3.4vw, 2.75rem)"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.035em"
  stack-strong:
    fontFamily: "Bricolage Grotesque, system-ui, sans-serif"
    fontSize: "clamp(1.8rem, 3.2vw, 2.8rem)"
    fontWeight: 800
    lineHeight: 1.15
    letterSpacing: "-0.03em"
  numeric:
    fontFamily: "Bricolage Grotesque, system-ui, sans-serif"
    fontSize: "clamp(1.6rem, 2.4vw, 2.1rem)"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.035em"
    fontFeature: "tnum"
  title:
    fontFamily: "Bricolage Grotesque, system-ui, sans-serif"
    fontSize: "clamp(1.3rem, 2vw, 1.65rem)"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  stack-word:
    fontFamily: "Bricolage Grotesque, system-ui, sans-serif"
    fontSize: "clamp(1.2rem, 1.9vw, 1.6rem)"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.03em"
  author:
    fontFamily: "Bricolage Grotesque, system-ui, sans-serif"
    fontSize: "1.35rem"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  role:
    fontFamily: "Bricolage Grotesque, system-ui, sans-serif"
    fontSize: "1.15rem"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.015em"
  quote-lead:
    fontFamily: "Bricolage Grotesque, system-ui, sans-serif"
    fontSize: "1.12rem"
    fontWeight: 600
    lineHeight: 1.38
    letterSpacing: "-0.01em"
  menu-link:
    fontFamily: "Bricolage Grotesque, system-ui, sans-serif"
    fontSize: "28px"
    fontWeight: 700
    letterSpacing: "-0.02em"
  mark:
    fontFamily: "Bricolage Grotesque, system-ui, sans-serif"
    fontSize: "20px"
    fontWeight: 700
    letterSpacing: "-0.02em"
  lede:
    fontFamily: "Onest, system-ui, sans-serif"
    fontSize: "clamp(1.1rem, 1.5vw, 1.3rem)"
    fontWeight: 400
    lineHeight: 1.5
  lede-fixed:
    fontFamily: "Onest, system-ui, sans-serif"
    fontSize: "1.1rem"
    fontWeight: 400
    lineHeight: 1.5
  body:
    fontFamily: "Onest, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.6
  button:
    fontFamily: "Onest, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 600
    lineHeight: 1.2
  body-sm:
    fontFamily: "Onest, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Onest, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 600
    lineHeight: 1.35
  caption:
    fontFamily: "Onest, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 600
    lineHeight: 1.35
rounded:
  tile: "12px"
  control: "14px"
  card: "28px"
  pill: "99px"
  round: "50%"
spacing:
  space5: "5px"
  space10: "10px"
  space15: "15px"
  space20: "20px"
  space30: "30px"
  space50: "50px"
  space100: "100px"
  deck-gap: "24px"
  gutter: "clamp(20px, 5vw, 96px)"
  section: "clamp(64px, 8vw, 112px)"
components:
  button-mint:
    backgroundColor: "{colors.mint}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.control}"
    padding: "0 24px"
    height: "56px"
  button-mint-hover:
    backgroundColor: "{colors.on-field}"
    textColor: "{colors.ink}"
  button-arrow:
    textColor: "{colors.mint}"
    rounded: "{rounded.round}"
    size: "52px"
  button-arrow-hover:
    backgroundColor: "{colors.mint}"
    textColor: "{colors.ink}"
  card-row-primary:
    backgroundColor: "{colors.mint}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "0 18px"
    height: "56px"
  card-row-primary-hover:
    backgroundColor: "{colors.field}"
    textColor: "{colors.mint}"
  card-row:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "0 18px"
    height: "56px"
  channel-on-field:
    backgroundColor: "{colors.field}"
    textColor: "{colors.on-field}"
    rounded: "{rounded.control}"
    padding: "0 22px"
    height: "56px"
  nav-pill:
    textColor: "{colors.mint}"
    rounded: "{rounded.pill}"
    padding: "0 16px"
    height: "40px"
  proof-pill:
    textColor: "{colors.on-field}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.pill}"
    padding: "8px 18px 8px 8px"
  business-card:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    width: "580px"
  rec-card:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "0 28px 24px"
    width: "min(430px, 84vw)"
  initials-disc:
    backgroundColor: "{colors.field}"
    textColor: "{colors.mint}"
    typography: "{typography.mark}"
    rounded: "{rounded.round}"
    size: "64px"
  social-tile:
    backgroundColor: "{colors.paper-deep}"
    textColor: "{colors.field}"
    rounded: "{rounded.tile}"
    size: "44px"
  social-tile-hover:
    backgroundColor: "{colors.field}"
    textColor: "{colors.mint}"
  timeline-dot:
    backgroundColor: "{colors.paper}"
    rounded: "{rounded.round}"
    size: "20px"
  timeline-dot-current:
    backgroundColor: "{colors.mint}"
    rounded: "{rounded.round}"
    size: "20px"
---

# Design System: krzysztofg.pl

## Overview

**Creative North Star: "The Card in Hand"**

The old site's business card has become a physical object. It sits on a deep teal field, tilted at rest, throws a soft floor shadow, follows the pointer with a moving glare and flips over to show the stack on its back. The same object language (paper face, teal-to-mint band with contour arcs, a disc overlapping the band) is dealt out again directly below as a fanned deck of recommendation cards, so the proof sits on the same field as the identity.

The page opens with one continuous teal field: the hero (no longer full height) runs straight into the recommendations deck, which peeks into the first viewport. A proof pill in the hero (five initials discs and a count) points down to it. The middle of the page is paper: a horizontal career timeline whose line draws itself in, then deep paper holding the about text beside a typographic stack wall. The contact band closes on the field again. Headlines are heavy, tightly tracked Bricolage Grotesque; reading text is Onest. Mint is the only bright colour. It marks what you can act on and what is current or highlighted.

The system refreshes an existing identity rather than replacing it. The teal and green family and the personal business card with avatar are carried over from the previous site on purpose.

**Key Characteristics:**
- An opening teal field (hero plus recommendations deck) and a closing teal contact band, with paper sections between them.
- One card family: the 3D business card and the paper recommendation cards share band, disc and paper face. Only they are lifted.
- Heavy, tightly tracked grotesque display type over a calm humanist sans; the stack is set as type, not as chips.
- Mint as the single action, current-state and highlight colour.
- Motion is bound to objects and plays once: the card drop-in, the deck fanning out, the timeline line drawing in.

## Colors

A cool teal-green family on near-white paper, with one bright mint voice.

### Primary
- **Deep Teal Field** (field): The hero, recommendations and contact background, the colour of section headlines and strong stack words on paper, the timeline line and dot rings, the stack wall's top rule and the initials discs. The browser `theme-color` is set to it too.
- **Mint** (mint): The single action and highlight colour. It fills the CV button, colours the second half of the hero greeting, the recommendations title accents, the proof count, the deck arrows and the contact e-mail, draws the CMS highlight underline (`max(3px, 0.1em)`, offset 0.3em), fills the current timeline dot and is the text selection colour. On the field it reads at about 7.9:1.

### Secondary
- **Old-Site Teal** (teal): Carried over from the previous site. Non-text marks only: list bullets (6–8px dots), the dots separating stack words, the scrollbar thumb and the start of the band gradient. Against paper it is only about 2.7:1, so it is never used for text.
- **Teal Ink** (teal-ink): The accessible teal for text on paper (5.3:1 on paper, 4.8:1 on deep paper). Used for the card role line, secondary stack words, the company line on recommendation cards, group and sub-labels, the "read in full" toggle, the focus ring, caret and accent-color.
- **Band Mid** (band-mid): The middle stop of the band gradient (118deg, teal → band-mid → mint) on the business card and every recommendation card. Never used alone.

### Neutral
- **Paper** (paper): The page background, the face of the business card and recommendation cards, and the fill of resting timeline dots.
- **Deep Paper** (paper-deep): The about and stack section, the social tiles on the card and the scrollbar track.
- **Hairline** (line): 1px dividers (quote rule on cards, the secondary stack groups) and the nav's bottom edge once it turns solid.
- **Ink** (ink): Primary text on paper, and text on mint.
- **Ink Soft** (ink-soft): Reading paragraphs on paper.
- **Ink Muted** (ink-muted): Secondary metadata such as roles, dates and skill details (4.9:1 on deep paper).
- **Field Deep** (field-deep): The back face of the card and the bottom of the back-plate gradient.
- **On Field / On Field Soft** (on-field, on-field-soft): Text on the teal field; the soft variant is used for ledes, intros, footers and secondary lines.

### Named Rules
**The One Bright Voice Rule.** Mint is the only saturated colour. It marks actions, the current item and highlights, and it never fills a section. Its largest fill is the card band, and even there it is the end of a teal-to-mint gradient.

**The Text-Teal Rule.** Text that should read as teal on paper uses teal-ink, never teal. Teal (#50A3A2) is for marks and shapes only.

**The Field Frame Rule.** The deep teal field opens the page (hero and the recommendations deck as one continuous field) and closes it (contact band). Everything between is paper or deep paper.

## Typography

**Display Font:** Bricolage Grotesque (via `next/font`, `--font-display`, falls back to system-ui)
**Body Font:** Onest (via `next/font`, `--font-body`, falls back to system-ui)

**Character:** A chunky, slightly quirky grotesque at weight 800 with negative tracking carries the voice. It is set against Onest, a clear, even humanist sans that keeps the CMS text readable.

### Hierarchy
- **Display** (hero greeting only): the second phrase is set in mint.
- **Headline**: section titles, in field colour on paper and on-field on the contact band, balanced.
- **Display link**: the contact e-mail on the field, in mint, with a 3px underline that grows in on hover.
- **Deck headline**: the recommendations title on the field. It steps down from Headline so the deck stays in the first viewport.
- **Card name**: the name on the business card.
- **Stack strong / Stack word**: the typographic stack wall. Technologies emphasised in the CMS are 800 in field colour; the rest are 600 in teal-ink.
- **Numeric**: career periods in the timeline and the title on the card's back, with tabular figures.
- **Title**: about-section statements.
- **Author / Role / Quote lead**: the recommender's name on a card, the job role in the timeline, and the opening paragraph of a recommendation (Bricolage 600).
- **Menu link / Mark**: mobile menu links, the wordmark and the initials in the 64px discs.
- **Lede**: the hero lede (fluid) and the contact lead and card role line (fixed).
- **Body** (17px, 1.6): reading text with a 52–64ch maximum.
- **Button / Body small / Label / Caption** (16 / 15 / 14 / 13px): buttons; card rows, nav links, timeline details and secondary paragraphs; roles, toggles and group labels; pills, dates and sub-labels. Labels are sentence case, never uppercase, and letter-spaced no more than 0.02em (the nav pill).

### Named Rules
**The Tight Display Rule.** Bricolage is set at 600–800 with negative tracking (-0.01em to -0.04em). At 1.6rem and above its line-height is 1.15 or less. Onest is never used for headlines.

**The Stack-as-Type Rule.** Technologies are set as a wall of words separated by 7px teal dots, with emphasis carried by size and weight. They are not chips, badges or logos.

**The Sentence-Case Rule.** Labels and controls are sentence case at weight 600. There are no uppercase tracked micro-labels.

## Layout

Single column of full-bleed bands, with content in a 1600px max-width wrap and a fluid gutter of clamp(20px, 5vw, 96px). The nav is fixed at 76px; `scroll-padding-top` matches it. Paper sections use the section padding token top and bottom. The hero is not full height: it sizes to its content below the nav so the deck head shows in the first viewport, and the recommendations band uses tighter padding (clamp(24px, 3vw, 40px) top, clamp(48px, 6vw, 80px) bottom).

The hero splits 0.9fr/1.1fr (greeting left, card right) and stacks below 1140px (laptopS). The recommendations head splits 1.3fr/1fr (title left, intro and arrows right). The deck track starts on the wrap's left edge and runs off the right edge of the screen; it scroll-snaps per card with a 24px gap and hidden scrollbar. The timeline is a grid of one equal column per entry with a horizontal line on top. Below 1140px it turns vertical, with the line at the left. About and stack split 0.85fr/1.15fr and stack below 1140px. Below 568px (mobileL) the deck arrows hide and the card rows go single column.

Rhythm: section heads have clamp(36px, 5vw, 56px) below them, timeline columns are clamp(20px, 2.6vw, 40px) apart, and two-column splits use gaps of clamp(28px, 5vw, 80px) to clamp(40px, 6vw, 96px).

## Elevation & Depth

Paper is flat; depth lives only in the card family on the field. The business card is staged in real 3D (perspective 1600px, preserve-3d). It rests at rotateX 6deg / rotateY -14deg and returns there over 0.9s with the house ease. A darker teal back-plate peeks out behind it at translateZ(-36px), and a blurred elliptical floor shadow sits beneath it. Recommendation cards lie on the field like a dealt hand: each has its own small rotation (-2.2deg to 2deg) and vertical offset (0–16px) and a soft drop shadow. On hover, or when opened, a card straightens and rises 6px. On paper, separation comes from tone (paper versus deep paper) and rules.

### Shadow Vocabulary
- **Card lift** (`box-shadow: 0 1px 0 rgba(255,255,255,0.7) inset, 0 30px 60px -20px rgba(3,18,17,0.6)`): Both business card faces.
- **Floor shadow** (`background: rgba(3,18,17,0.55); filter: blur(28px)`, a 56px ellipse): The business card's cast shadow on the field.
- **Deck card** (`box-shadow: 0 30px 50px -24px rgba(3,18,17,0.7)`, hover `0 40px 60px -24px rgba(3,18,17,0.8)`): Recommendation cards on the field.
- **Glare** (radial white 0.35 → 0 at 45%, soft-light blend): Follows the pointer on the business card while it is tracking.
- **Current halo** (`box-shadow: 0 0 0 6px rgba(143,227,136,0.35)`): A ring around the current timeline dot. It is a mark, not an elevation.
- **Menu drop** (`box-shadow: 0 24px 32px -24px rgba(15,59,58,0.35)`): The mobile menu sheet under the nav.

### Named Rules
**The Card Family Rule.** Only objects in the business-card language (paper face, gradient band with contour arcs, overlapping disc) are lifted, rotated or shadowed, and only on the field. Sections and lists on paper are never boxed in shadowed cards.

## Shapes

Cards are softly rounded (28px). Controls (buttons, card rows, contact channels) are 14px. Social tiles are 12px. Toggles and the proof link are full pills (99px). Discs, dots and the deck arrows are circles. On every card band, thin concentric arcs (1.5px rings every 18–22px at 14% field) echo the contour lines on the old card. Rules are 2px in field colour for the timeline line and the stack wall's top edge, and 1px hairlines for dividers. Interactive outlines are 1.5px.

## Components

### Buttons
Solid, roomy and confident, with a 56px minimum height.
- **Shape:** gently rounded (14px).
- **Mint (primary action):** mint fill, ink text, 0 24px padding, 10px gap to a 16px line icon. On hover it fades to on-field. On press it nudges translateY(1px) scale(0.99). Transitions are 0.25s with the house ease on colour, border and transform.
- **Channel (outline on field):** a 1.5px on-field-soft border at 35% opacity, inherited light text, padding 0 22px. On hover the border and text turn mint.
- **Card row:** the same 56px/14px shape, padding 0 18px. The primary row is mint and flips to field with mint text on hover. Secondary rows have a 1.5px hairline outline, a teal-ink icon and tabular numerals, and the border turns field on hover.
- **Deck arrow:** a 52px circle with a 1.5px mint ring and a 20px mint arrow (mirrored for "previous"). On hover it fills mint with ink.

### Pills
- **Nav pill:** 40px high, 1.5px border in the nav's current pill colour (mint over the field, field over paper). On hover it fills.
- **Proof pill:** on the hero field, a mint-tinted pill (mint at 10% fill, 30% 1px border) holding five overlapping 36px initials discs (the first is mint, the rest paper with a field ring), the count in mint Bricolage 800 and an arrow that slides 4px right on hover. It links to the deck.
- **Flip corner:** a 36px pill in the business card's top-right, field at 82% with on-field text. On the back face it switches to a mint outline.

### Recommendation deck (signature)
A horizontal row of paper cards (min(430px, 84vw) wide) on the field. Each card has a 64px gradient band, a 64px field initials disc in a 4px paper ring overlapping the band, the author's name, the role in ink-muted with the company in teal-ink, a hairline, then the quote lead. A "read in full" underline toggle (40px target) reveals the remaining paragraphs and straightens the card; the date sits right in caption size. When the deck first scrolls into view the cards fan out from a pile (0.9s, 70ms stagger per card). Under reduced motion they appear already dealt.

### Career timeline
A 2px field line that draws in from the left over 1.4s when the section enters view (from the top when vertical). Each entry hangs from a 20px dot, a paper fill with a 2px field ring; the current entry's dot is mint with a mint halo. Below it come the period, the role, and detail text with 6px teal bullets and teal-ink sub-labels.

### Stack wall
On deep paper beside the about text: a 2px field top rule, a teal-ink group label, then the technologies as flowing words separated by teal dots, with optional muted details beside each word. Further groups follow below a hairline as one line of text joined by middle dots.

### Navigation
A fixed 76px bar. It is transparent over the hero, fills with field once scrolled and turns paper with an ink hairline once the field leaves it. The wordmark is "krzysztof**g**.pl" with the "g" in the accent. Links have a 2px underline that scales in from the left on hover and for the current section. Below 1024px a "Menu" pill opens a paper sheet of large Bricolage links.

### Business Card (signature)
The identity object: about 580px wide, a paper face and a teal-to-mint band with contour arcs. The 132px avatar overlaps the band inside a 6px paper ring. Social tiles sit at the right and the CV, phone and e-mail rows below. It drops in once on load (1.2s, from 64px down, 28deg tilt, 10px blur). On hover-capable devices without reduced motion it tilts with the pointer (±8deg X, ±11deg Y) and shows the glare. It flips 180deg over 0.9s to a field-deep back with the core stack list. Under reduced motion it holds a gentler 3deg/-6deg rest and nothing animates.

### Line icons
One family, defined in code: 24-grid SVG, 1.8 stroke, round caps and joins, `currentColor` (download, phone, mail, GitHub, LinkedIn, arrow, flip). Use 16–20px inline with text.

## Do's and Don'ts

### Do:
- **Do** keep mint as the only saturated colour and reserve it for actions, the current item and highlights.
- **Do** set teal text on paper in teal-ink (#23706F); keep teal (#50A3A2) for dots, marks and gradients.
- **Do** set every headline in Bricolage Grotesque at 700–800 with -0.02em to -0.04em tracking.
- **Do** reuse the card language (band with contour arcs, initials disc overlapping it, paper face, 28px radius) for any new object that sits on the field.
- **Do** give interactive controls a 56px (primary), 52px (round arrow) or 40px (pill, toggle) minimum height and gate hover effects behind `(hover: hover)`.
- **Do** trigger reveal motion once through `useInView`, default to visible when IntersectionObserver is missing, and remove it under `prefers-reduced-motion`.
- **Do** use the house ease `cubic-bezier(0.16, 1, 0.3, 1)` for every state transition.

### Don't:
- **Don't** lift, rotate or shadow anything on paper. Depth belongs to the card family on the field.
- **Don't** box sections or list items on paper in shadowed cards.
- **Don't** use teal (#50A3A2) for text on paper. It is only about 2.7:1.
- **Don't** add uppercase tracked micro-labels or eyebrows above headlines.
- **Don't** fade or slide text blocks in on scroll. Reveal motion belongs to objects (the card, the deck, the timeline line) and plays once.
- **Don't** set the stack as chips, badges or logo grids.
- **Don't** mix in icon fonts or other icon sets. Use the single 1.8-stroke line family.
