---
layout: 'potion'
title: 'Ecommerce Product Page'
publicationDate: '2026-03-24'
excerpt: 'A product page whose gallery and buy box share the first screen: options that say when they''re sold out, an Add to cart that is never disabled and points to the missing choice, and a cart request the server prices.'
category: 'Layouts'
tags:
  - layouts
  - ecommerce
  - product-page
  - product-detail-page
  - pdp
  - conversion
  - reviews
  - responsive
  - merchandising
agentManifest: 'potions/layouts/ecommerce-product-page.json'
path: 'potions/layouts/ecommerce-product-page'
promptSubject: 'an ecommerce product page'
useWhen: 'a store needs a product page: photos to inspect, options to choose, the price and delivery, reviews, and a way to add the product to the cart.'
specifies:
  - 'Add to cart is never disabled: pressed before every option is chosen, it shows what is missing and moves focus there.'
  - 'Sold-out options say so in text, and a sale price is read as "Was $58, now $48".'
  - 'The cart request sends the product, the options, and the quantity, never the price, and a timeout is treated as an unknown outcome.'
example: 'A shopper presses Add to cart before choosing a size: nothing is sent, "Choose a size" appears, and focus moves to the first size that can be chosen.'
---

A product page supports one decision: whether to buy this, in this option. Its common mistakes cost both sales and trust: a disabled Add to cart that doesn't say why, sold-out sizes shown only in gray, a sale price read out as two numbers, and a cart request that trusts the browser's price. This guide covers the page from the gallery to the recommendations, and targets WCAG 2.2 AA.

## Start from what the project has

1. If the project has product page parts, in its storefront, its commerce platform's theme, or a library it already uses, configure or extend them to meet this guide. Keep their APIs.
2. Otherwise build it from plain HTML: the buy box is a `<form>` that posts to the cart, with a `<fieldset>` for each option group.

Implement only what the task needs, and add no dependency without asking. The project's conventions win for styling and visual defaults. If one conflicts with an accessibility or correctness requirement here, ask instead of choosing.

## The first screen

- From 1024 px, the gallery (55 to 65% of the width) and the buy box sit side by side, so the shopper can look and buy without scrolling. On phones they stack: the gallery, then the buy box.
- The buy box holds, in this order: the product's title (the page's `<h1>`), the rating summary, the price, the options, the quantity, Add to cart, and delivery and returns. Nothing needed to buy is in a tab or an accordion.
- A sticky buy box on wide screens is optional, and only if it fits the window below the sticky header.

## The gallery

- The main image, and thumbnails as buttons named after their image ("Front view", "Fabric close-up"), the shown one marked with `aria-current="true"` and by more than color.
- A "View full size" button opens the full-size view in a native `<dialog>`, as the Modal Dialog guide says: the rest of the page is inert, Escape closes it, and focus returns to the button. Zoom on hover is an extra, never the only way.
- Swiping between images needs buttons too (WCAG 2.5.1), and works with them alone.
- The first image loads at once with `fetchpriority="high"`; the others `loading="lazy"`. Every image has `width` and `height`, or the gallery an `aspect-ratio`, so nothing shifts.
- A video doesn't play with sound on its own, has visible controls, and has captions when it has speech.

## Price

- Prices are formatted with `Intl.NumberFormat` for the currency and the locale, and say whether tax is included where that's required.
- A compare-at price is struck through, which most screen readers don't announce, so "$58 $48" is unclear. Add visually hidden text: "Was $58, now $48". A saving ("Save 17%") is worked out from the two prices, rounded down.

## Options

- Each group (color, size) is a `<fieldset>` with a `<legend>`, and its options are native radios: one Tab stop, and the arrows choose. The chosen value shows beside the legend ("Size: M").
- Color swatches are radios named after the color ("Navy"), drawn as swatches.
- An option that can't be bought says so in its label ("M, sold out"), not only with a strike-through or a faded color (WCAG 1.4.1). It can be `disabled`, which the arrows skip (checked in Chromium, Firefox, and WebKit); the words in its label are what say why.
- When a choice in one group makes the chosen option of another unavailable (a size sold out in the new color), that option is cleared, and the status region says so ("M isn't available in Navy").
- Price, availability, delivery, and images follow the chosen options. With many options, a select or a combobox (the Select and Combobox guide).

## Add to cart

- Add to cart is never disabled, since a disabled button can't be focused and doesn't say what's missing. Pressed while an option group has no choice it can send, or while the quantity breaks its rules, it sends nothing, shows each problem's message, and moves focus to the first: the group's first option that can be chosen, or the quantity field.
- Each message sits in its control's description (`aria-describedby` on the group's fieldset, or on the field), and is empty while it's hidden, so it adds nothing until it shows; the quantity field also has `aria-invalid="true"` while its message shows. A message goes as soon as its problem is fixed.
- Without script, `required` on the radios and the quantity field's own rules make the browser block the post and focus the first problem (checked in Chromium, Firefox, and WebKit). The script sets `novalidate` and shows its own messages instead, as the Form Validation Pattern does, so it checks every rule the browser would have: a check of the option groups alone let quantities 0, 6, 1.5, and an empty one reach the cart (checked in all three).
- The quantity is a required number field with `min="1"` and a `max` that follows the stock, so a fraction fails its step; its message says the range ("Enter a quantity from 1 to 5"). Stepper buttons, if any, are named "Decrease quantity" and "Increase quantity".

The snippets in this guide are plain HTML and JavaScript; adapt them to the project's framework and its version.

```html
<form class="buy-box" id="buy-form" action="/cart" method="post">
  <input type="hidden" name="product" value="organic-tee">
  <fieldset class="option-group" aria-describedby="size-error" data-error="Choose a size">
    <legend>Size</legend>
    <p class="field-error" id="size-error" hidden></p>
    <label><input type="radio" name="size" value="s" required> S</label>
    <label><input type="radio" name="size" value="m" required disabled> M, sold out</label>
    <label><input type="radio" name="size" value="l" required> L</label>
  </fieldset>
  <label for="quantity">Quantity</label>
  <input id="quantity" name="quantity" type="number" inputmode="numeric" min="1" max="5" value="1" required
    aria-describedby="quantity-error" data-error="Enter a quantity from 1 to 5">
  <p class="field-error" id="quantity-error" hidden></p>
  <button type="submit">Add to cart</button>
</form>
<!-- The phone's purchase bar submits the same form, so the same check runs -->
<div class="purchase-bar" role="region" aria-label="Quick purchase" hidden>
  <button type="submit" form="buy-form">Add to cart</button>
</div>
```

```js
// Add to cart is never disabled. Pressed while an option group has no choice it can send, or the
// quantity breaks its rules, it shows each problem's message, moves focus to the first, and sends
// nothing. With novalidate set, this is the only check, so it covers every rule the browser would
// have; without script, the browser checks the same rules itself.
const form = document.getElementById('buy-form');
const options = (group) => [...group.querySelectorAll('input[type="radio"]')];
// A group needs a choice that can be sent (a chosen option that became unavailable can't be);
// any other field, its own rules (required, min, max, step)
const invalid = (control) => (control.matches('fieldset')
  ? !options(control).some((option) => option.checked && !option.disabled)
  : !control.validity.valid);
form.noValidate = true;

function setError(control, message) {
  const error = document.getElementById(control.getAttribute('aria-describedby'));
  error.textContent = message; // empty while hidden, so it adds nothing to the description
  error.hidden = !message;
  if (!control.matches('input')) return;
  if (message) control.setAttribute('aria-invalid', 'true');
  else control.removeAttribute('aria-invalid');
}
form.addEventListener('submit', (event) => {
  const controls = [...form.querySelectorAll('[data-error]')];
  const problems = controls.filter(invalid);
  for (const control of controls) setError(control, problems.includes(control) ? control.dataset.error : '');
  if (problems.length === 0) return; // sent as usual
  event.preventDefault();
  const first = problems[0];
  (first.matches('fieldset') ? options(first).find((option) => !option.disabled) : first)?.focus();
});
// A message goes as soon as its problem is fixed
form.addEventListener('input', (event) => {
  const control = event.target.closest('[data-error]');
  if (control && !invalid(control)) setError(control, '');
});
```

## Sending

- The cart request sends the product, the chosen options, and the quantity, never the price: the server prices the order.
- While it's out, the button keeps focus with `aria-disabled="true"` and ignores a second press. The result goes to the page's one polite status region ("Added to your cart: Organic Cotton Tee, M"), the cart's count goes in the cart link's name ("Cart, 2 items"), and a mini cart or a toast is optional.
- A request that times out may have added the item, so the outcome is unknown, not failed: read the cart again before saying anything, and send a retry with the same request id, so it can't add the item twice.
- An error that the shopper can fix points to the field it's about, as the missing choice does.

## The purchase bar on phones

- On phones, a purchase bar with the price and Add to cart appears when the buy box's button has left the window: an `IntersectionObserver` on that button decides, not a scroll handler. While it's not shown, it's `hidden` (or `inert` while it animates), not only moved off screen.
- Its button submits the same form with `form="…"`, so the same check runs (checked: the submit event names it as the submitter in Chromium, Firefox, and WebKit). It's a region named for its purpose, "Quick purchase".
- `scroll-padding-bottom` at its height, with `scroll-padding-top` at the sticky header's, keeps the focused element clear of both (WCAG 2.2 2.4.11). `env(safe-area-inset-bottom)` pads it only when the viewport meta tag has `viewport-fit=cover`.

## Details and delivery

- Delivery, returns, and pickup sit near Add to cart, in plain text that depends on the shopper's region when it differs.
- Highlights, the description, specifications (a `<dl>` or a table with row headers), fit or dimensions, materials and care, and questions. On phones, each can be a `<details>` with its heading in the `<summary>`; nothing needed to buy is inside one.

## Reviews

- A summary near the title: the stars are images, so the rating is text ("4.8 out of 5 stars, 218 reviews"), and it links to the reviews section.
- The distribution's bars have their numbers in text ("5 stars: 70%"). Filtering and sorting say how many reviews show, in the status region, as the Data Table guide's filter does.
- Review text and answers are user content: rendered as text, never as raw HTML. "Verified purchase" is text, not only an icon.
- With no reviews yet, say so, with a way to write the first.

## Recommendations

- Related products come after the decision content (details and reviews), never before the buy box, shown as the store's usual product cards.
- A horizontal rail scrolls with the keyboard (its links are in the Tab order) and shows that it scrolls, such as a part of the next card; a hidden scrollbar isn't the only cue.

## Structured data

- If the project manages structured data, render it on the server from the same data as the page: the product, its offers per option with their own prices and availability, and the rating. Don't hardcode prices into it.

## Layers

Layers, bottom to top: the page, sticky bars, dropdowns and popovers, toasts, then modals, which make the rest of the page inert. The project's layering scale wins; native `<dialog>` and the `popover` attribute use the top layer and need no z-index. The sticky header and the purchase bar are sticky bars, and the full-size gallery is a modal.

## Appearance

These are suggested defaults; the project's design and tokens win.

- The buy box is 360 to 440 px wide from 1024 px; the title 32 to 44 px (24 to 32 px on phones); the price 28 to 36 px.
- Text meets 4.5:1, and focus indicators, the chosen option's marker, and form fields' edges 3:1. A message such as "Choose a size" in `#b91c1c` on white is 6.5:1. Check the project's own colors the same way.
- Touch targets are at least 44 px, and nothing scrolls sideways at 320 px wide.
- Motion is optional: images cross-fade over 180 ms, and the purchase bar fades in. Under `prefers-reduced-motion: reduce`, nothing slides.

## Edge cases

- **Sold out entirely**: replace Add to cart with a back-in-stock signup, and say "Sold out" in text.
- **Many options**: a select or a combobox instead of radios, with the same message and focus on a missing choice.
- **No reviews yet**: say so, with a way to write the first.
- **A long title**: it wraps; the price and Add to cart stay in the first screen on phones.
- **Delivery depends on the address**: say so, and ask for a postcode only when the shopper wants the estimate.

## Acceptance checklist

- [ ] The product's title is the page's h1, and from 1024 px the gallery and the buy box share the first screen
- [ ] Gallery thumbnails are buttons named after their image, the shown one is marked, and a button opens the full-size view in a native dialog
- [ ] The first image loads at once with fetchpriority="high", the others lazily, and every image has width and height
- [ ] Each option group is a fieldset with a legend and radios, and swatches are named after their color
- [ ] A sold-out option says so in its label, and a choice that makes another one unavailable clears it and says so
- [ ] A sale price is read as "Was $58, now $48", and prices are formatted for the locale
- [ ] Add to cart is never disabled: with a missing choice or a quantity outside its rules, it sends nothing, shows each problem's message, and moves focus to the first
- [ ] Without script, the radios' required and the quantity's required, min, max, and step make the browser block the post the same way
- [ ] The cart request sends the product, the options, and the quantity, never the price
- [ ] Adding says the result in the status region; a timeout reads the cart again instead of saying it failed, and a retry can't add the item twice
- [ ] The phone's purchase bar is hidden until the buy box's button leaves the window, submits the same form, and never covers the focused element
- [ ] The rating is text ("4.8 out of 5 stars, 218 reviews"), review text is rendered as text, and filtering reviews says how many show
- [ ] Nothing scrolls sideways at 320 px wide, and touch targets are at least 44 px
- [ ] Styles come from the project's styling system and tokens

## See also

- **[Modal Dialog](/potions/components/dialog)**: the full-size gallery, as a native dialog.
- **[Select and Combobox](/potions/components/dropdown-select)**: groups with many options.
- **[Form Validation Pattern](/potions/patterns/form-validation)**: the timing and wording of the missing choice's message.
- **[Toast Notifications (Accessible) with Queue System](/potions/components/toast-notifications)**: a short confirmation after adding to the cart.
- **[Tabs Component](/potions/components/tabs)**: the details on wide screens, when they're short.
- **[Button](/potions/components/button)**: Add to cart and the other actions.

These are suggestions; the page works on its own.
