---
layout: 'potion'
title: 'Pricing Table'
publicationDate: '2026-01-18'
excerpt: 'Pricing plans with a monthly or yearly billing choice: a radio group drawn as a segmented control, prices and savings worked out from each plan''s prices, and calls to action that are links.'
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
promptSubject: 'a pricing table'
useWhen: 'a product sells plans, usually two to four, with monthly and yearly prices, and needs a pricing section or page.'
specifies:
  - 'The billing choice is a radio group drawn as a segmented control, with one Tab stop and the arrows to choose.'
  - 'Savings come from the plans'' prices, rounded down, so they never claim more than a plan saves.'
  - 'Prices say "per month" in words, and after Back they still match the restored choice.'
example: 'Someone chooses Yearly, follows a link, and comes back: Yearly is still chosen, and every card shows its yearly price and its saving, such as "Save 19% compared with monthly".'
---

A pricing section answers three questions: what each plan costs, what it includes, and which one to pick. Its common mistakes are about trust: savings badges that don't match the prices, a toggle read as "switch, on", prices read as "slash mo", and three cards squeezed side by side on a tablet. This guide covers the plans, the billing choice, the prices, and the calls to action, and targets WCAG 2.2 AA.

## Start from what the project has

1. If the project has pricing cards or a plan picker, in its design system or a library it already uses, configure or extend them to meet this guide. Keep their APIs.
2. Take plans and prices from its billing system; never compute a price it doesn't charge.

Implement only what the task needs, and add no dependency without asking. The project's conventions win for styling and visual defaults. If one conflicts with an accessibility or correctness requirement here, ask instead of choosing.

## Plans

- Plans and prices come from the project's billing system (Stripe, Paddle, the app's own), with each price in the currency's smallest unit, such as cents. Prices are rendered on the server.
- Each plan is an `<article>` named by its heading (`<h3>` under the section's `<h2>`), with its price, a sentence on who it's for, one call to action, and what it includes.
- A "Most popular" badge is plain text, not a live region, and only on a plan that is the most popular. On phones, a plan shown first is first in the page too, not moved with CSS `order`, so the reading and focus order match what's shown.

## The billing choice

- Two options, Monthly and Yearly, are one choice: a radio group (`<fieldset>` with the `<legend>` "Billing"), drawn as a segmented control. The radios stay real: the group is one Tab stop, the arrows choose, and screen readers say something like "Yearly, radio button, 2 of 2". A switch would be read as "on" or "off" and can only name one side.
- Monthly is chosen by default, or whichever period the server renders. The Yearly option's label says the best saving ("Save up to 19%"), or the one saving when every plan saves the same ("Save 17%").
- Without script the choice can't change the prices, so the server renders one period's prices and the script shows the choice.
- After Back, the browser restores the checked option without an input or change event, and Chromium does it only after the page's scripts and DOMContentLoaded have run (checked in Chromium, Firefox, and WebKit). Work the prices out from the checked option when the script runs and again on `pageshow`.
- The focused option shows a focus ring on `:focus`: WebKit doesn't match `:focus-visible` on a radio the arrows moved to (checked). In forced colors, which replace backgrounds, the chosen option takes the system's `Highlight`.
- Choosing needs no announcement: the radio says its new state, and the prices change where people read them next.

The snippets in this guide are plain HTML, CSS, and JavaScript; adapt them to the project's framework and its version.

```html
<!-- Prices are in cents. The server renders monthly prices and links; the script shows the choice. -->
<fieldset class="billing" hidden>
  <legend>Billing</legend>
  <div class="billing-options">
    <label><input type="radio" name="billing" value="monthly" checked> Monthly</label>
    <label><input type="radio" name="billing" value="yearly"> Yearly <span class="billing-saving"></span></label>
  </div>
</fieldset>
<div class="plans">
  <article class="plan" aria-labelledby="plan-starter" data-monthly="900" data-yearly="8900">
    <h3 id="plan-starter">Starter</h3>
    <p><span class="plan-amount">$9</span> <span class="plan-period">per month</span></p>
    <p class="plan-saving"></p>
    <a href="/signup?plan=starter&amp;billing=monthly">Get started<span class="visually-hidden"> with Starter</span></a>
  </article>
  <article class="plan" aria-labelledby="plan-pro" data-monthly="2900" data-yearly="27900">
    <p class="plan-badge">Most popular</p>
    <h3 id="plan-pro">Professional</h3>
    <p><span class="plan-amount">$29</span> <span class="plan-period">per month</span></p>
    <p class="plan-saving"></p>
    <a href="/signup?plan=pro&amp;billing=monthly">Get started<span class="visually-hidden"> with Professional</span></a>
  </article>
  <!-- more plans the same way; one without data-monthly (Contact sales) is left alone -->
</div>
```

```css
/* The billing choice is a radio group drawn as a segmented control: the radios stay real, so
   the arrows move between them, and each label shows the state. */
.billing {
  border: 0;
  margin: 0;
  padding: 0;
}
.billing-options {
  border: 1px solid var(--control-border); /* 3:1 against the page */
  border-radius: 999px;
  display: inline-flex;
  padding: 4px;
}
.billing-options label {
  border-radius: 999px;
  cursor: pointer;
  padding: 8px 16px;
  position: relative;
}
.billing-options input {
  inset: 0;
  margin: 0;
  opacity: 0;
  position: absolute;
}
.billing-options label:has(input:checked) {
  background: var(--selected-background);
  color: var(--selected-text);
}
/* :focus, not :focus-visible: WebKit doesn't match :focus-visible on a radio the arrows moved to */
.billing-options label:has(input:focus) {
  outline: 2px solid var(--focus-ring);
  outline-offset: 2px;
}
/* Forced colors replace backgrounds, so the chosen option takes the system's highlight */
@media (forced-colors: active) {
  .billing-options label:has(input:checked) {
    background: Highlight;
    color: HighlightText;
    forced-color-adjust: none;
  }
}
/* Cards wrap to two and one columns on their own, never narrower than 16rem */
.plans {
  display: grid;
  gap: 24px;
  grid-template-columns: repeat(auto-fit, minmax(min(16rem, 100%), 1fr));
}
```

```js
// Prices and savings come from each plan's prices, so "Save 19%" can't drift from them. Amounts
// are whole cents, which keeps the percentages exact, and savings round down, so they never
// claim more than a plan saves. A free plan has nothing to save, so it's left out of them.
const billing = document.querySelector('.billing');
const plans = [...document.querySelectorAll('.plan[data-monthly]')];
const money = new Intl.NumberFormat(document.documentElement.lang || undefined, { style: 'currency', currency: 'USD', trailingZeroDisplay: 'stripIfInteger' });
const perUnit = 10 ** money.resolvedOptions().maximumFractionDigits;
const saving = (plan) => Math.floor(((plan.dataset.monthly * 12 - plan.dataset.yearly) * 100) / (plan.dataset.monthly * 12));

function render() {
  const period = billing.querySelector('input:checked')?.value === 'yearly' ? 'yearly' : 'monthly';
  for (const plan of plans) {
    plan.querySelector('.plan-amount').textContent = money.format(plan.dataset[period] / perUnit);
    plan.querySelector('.plan-period').textContent = period === 'yearly' ? 'per year' : 'per month';
    plan.querySelector('.plan-saving').textContent = period === 'yearly' && saving(plan) > 0 ? `Save ${saving(plan)}% compared with monthly` : '';
    // The call to action takes the chosen period to signup
    const link = plan.querySelector('a[href]');
    const query = new URLSearchParams(link.search);
    query.set('billing', period);
    link.search = query;
  }
  const savings = plans.filter((plan) => plan.dataset.monthly > 0).map(saving);
  const best = Math.max(0, ...savings);
  billing.querySelector('.billing-saving').textContent = best === 0 ? '' : savings.every((s) => s === best) ? `Save ${best}%` : `Save up to ${best}%`;
}
billing.hidden = false;
billing.addEventListener('change', render);
// After Back, the browser restores the checked option without a change event, and Chromium
// does it only after this script has run
addEventListener('pageshow', render);
render();
```

## Prices and savings

- Prices are formatted with `Intl.NumberFormat` for the currency and the page's language; `trailingZeroDisplay: "stripIfInteger"` shows "$29" and "$9.99" (checked in Chromium, Firefox, and WebKit).
- The period is written out, "per month" or "per year"; abbreviations are read letter by letter or as "slash mo". Say whether tax is included where that's required.
- Savings are claims, so they come from the prices: (12 × monthly − yearly) ÷ (12 × monthly), worked out in the smallest unit, so a plan that saves exactly 20% says 20 (in floating point it comes out at 19.999…%), and rounded down, so they never claim more than a plan saves. The example plans save 17.6%, 19.8%, and 16.7%: "Save 17%", "Save 19%", and "Save 16%". Don't store a separate discount figure that can drift from the prices.
- A plan without a fixed price ("Contact sales") is left out of the calculation, and so is a free plan, which has nothing to save: dividing by its monthly price of 0 made the label "Save up to NaN%" (checked).

## Calls to action

- Calls to action go to signup or checkout pages, so they're links, with no loading or disabled state of their own. The highlighted plan's is the primary one.
- They take the chosen period to signup: the script sets `billing=yearly` or `billing=monthly` on each plan's link (or the billing system's price id for that period), and the server renders the default period's links. Otherwise signup can't tell which price was chosen.
- Their visible text comes first in their name: "Get started", with "with Professional" visually hidden after it, so voice control users can say what they see (WCAG 2.5.3) and screen readers can tell them apart.
- "Start free trial" only on a plan with a trial; otherwise "Get started" or "Contact sales".

## Features

- Each plan's features are a list. A feature it doesn't include says so in text, such as a visually hidden "Not included:" before it, or the list holds only what's included, starting with "Everything in Starter, plus:".
- Check and cross icons are `aria-hidden="true"` and meet 3:1: a `#047857` check is 5.5:1 on white and a `#6b7280` cross 4.8:1, where `#10b981` and `#9ca3af` are 2.5:1.

## Layout

- The cards wrap on their own with `repeat(auto-fit, minmax(min(16rem, 100%), 1fr))`: three or four side by side on wide screens, two on a tablet, one on a phone, without a breakpoint. Three fixed columns at 768 px would leave cards about 230 px wide.
- Rows that line up across cards (the price, the call to action, the features) can use `grid-template-rows: subgrid`; it's optional.
- A full comparison is a real `<table>` with a column per plan and a row header per feature, as in the Data Table guide.

## Motion

- Motion is optional: prices can fade over 150 ms when they change, and cards can lift on hover. Under `prefers-reduced-motion: reduce`, nothing moves; prices change at once.

## Appearance

These are suggested defaults; the project's design and tokens win.

- Cards with 24 to 40 px of padding and a 12 to 16 px radius; the plan's name 20 to 28 px; the price 40 to 56 px.
- Colors: `#111827` text (17.7:1 on white), `#4b5563` muted text (7.6:1); a primary call to action in `#2563eb` with white text (5.2:1), since `#3b82f6` is only 3.7:1; the segmented control's edge `#6b7280` (4.8:1), the chosen option `#111827` with white text, and a `#2563eb` focus ring. Check the project's own colors the same way.

## Edge cases

- A plan without a fixed price ("Contact sales") is left out of the prices and the savings
- A free plan (0 and 0) has nothing to save and is left out of the savings
- Prices with cents keep them ("$9.99"); whole prices drop ".00"
- Every plan saves the same: the Yearly label says "Save 17%", not "up to"
- Two or four plans: the grid wraps on its own
- A currency without cents (JPY): the smallest unit is the whole yen, which the formatter's fraction digits give
- No yearly prices at all: leave the billing choice out
- A promotion that ends: say its end date in text, with no countdown that pressures

## Acceptance checklist

- [ ] Each plan is an article named by its heading, with its price, what it includes, and one call to action
- [ ] The billing choice is a fieldset with a legend and two radios, drawn as a segmented control: one Tab stop, the arrows choose, and the focused option shows a focus ring in every browser
- [ ] Without script, the page shows one period's prices and no choice
- [ ] Choosing Yearly updates every plan's price and period at once; a plan without a fixed price is left alone
- [ ] Prices are formatted for the currency and the locale, and periods are written out ("per month"), not abbreviated
- [ ] Savings are worked out from the prices in the currency's smallest unit and rounded down, leaving out free plans; the Yearly label says "Save up to" the best one, or "Save" when all are equal
- [ ] After Back, the prices and the links match the restored choice
- [ ] Calls to action are links whose names start with their visible text, with the plan's name added out of sight, and they take the chosen period to signup
- [ ] Included and not included features say so in text, and their icons are hidden from screen readers and meet 3:1
- [ ] A "Most popular" badge is plain text, is true, and is not a live region
- [ ] Cards wrap to fewer columns on their own, a plan shown first on phones comes first in the page, and nothing scrolls sideways at 320 px wide
- [ ] In forced colors, the chosen billing option is still visible
- [ ] Text meets 4.5:1, and the segmented control's edge and focus ring 3:1
- [ ] Styles come from the project's styling system and tokens

## See also

- **[Button](/potions/components/button)**: the calls to action's styles and states.
- **[Landing Page Layout (Marketing)](/potions/layouts/landing-page)**: the marketing page a pricing section usually sits in.
- **[Data Table (Sortable, Paginated, Filterable)](/potions/components/data-table)**: a full comparison as a table.

These are suggestions; the pricing table works on its own.
