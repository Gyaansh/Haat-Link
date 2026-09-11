# AgriLink Frontend — Development Rules

These rules apply to all code in `client/src/`.
Follow them without exception, whether you are a human developer or an AI coding agent.

---

## Architecture

### Pages
1. **One major page per file.** Each route gets its own page component in its own folder.
   - `/dashboard` → `pages/Dashboard/DashboardPage.jsx`
   - `/crops` → `pages/Crops/CropsPage.jsx`
   - `/market` → `pages/Market/MarketPage.jsx`
   - `/buyers` → `pages/Buyers/BuyersPage.jsx`
   - `/recommendation` → `pages/Recommendation/RecommendationPage.jsx`
   - `/deals` → `pages/Deals/DealsPage.jsx`
   - `/buyer/dashboard` → `pages/buyer/BuyerDashboardPage.jsx`
   - `/buyer/requirements` → `pages/buyer/RequirementsPage.jsx`
   - `/buyer/orders` → `pages/buyer/OrdersPage.jsx`

2. **Do not place multiple unrelated page exports in one file.** The old `pages/Pages.jsx` pattern is banned.

3. **Pages orchestrate, they do not implement.** Pages compose reusable components. Complex logic lives in sub-components, hooks, or utils.

### Components
4. **Shared/reusable components go in `components/common/`.** Examples:
   - `Modal`, `PageTitle`, `StatCard`, `StatusBadge`, `FieldError`, `PriceChart`

5. **Layout components go in `components/layout/`.** Examples:
   - `Layout`, `BuyerLayout`

6. **Feature-specific components live with their page.** Example:
   - `CropCard`, `CropDetailsModal`, `CropEditModal`, `CropForm` → `pages/Crops/`

7. **Component size guideline:** aim for under ~150 lines. If a component grows larger, identify meaningful sub-sections and extract them.

8. **Do not make every HTML fragment a component.** Extract when a block is reused, has meaningful behavior, or makes a page unreadably large.

### State
9. **One source of truth.** Crop data lives in `AppContext` only. Do not copy crops into local component state independently.

10. **Use `useApp()` from `context/AppContext.jsx`** for all shared state (crops, deals, offers, requirements, role, toast).

11. **Do not introduce Redux or Zustand.** The current `AppContext` is sufficient for this prototype.

### Data
12. **Mock data belongs in `data/mockData.js`.** Do not scatter large data objects through page components.

### Utilities
13. **Business logic belongs in `utils/`, not in JSX.** Examples:
    - Validation → `utils/validation.js`
    - Recommendation scoring → `utils/recommendation.js`
    - Currency formatting → `utils/format.js`
    - Date formatting → `utils/validation.js` (or move to `utils/date.js` if it grows)

---

## Navigation
14. **Use React Router for all internal navigation.** Use `useNavigate()` or `<Link>`.
15. **Do not use `window.location.href` or `window.location.reload()` for internal navigation.**
16. **Do not use toast messages or alerts as navigation substitutes.**

---

## Forms and Validation
17. **Use proper form validation.** Use `validateCrop`, `validateOffer`, `validateRequirement` from `utils/validation.js`.
18. **Show field-level errors using `<FieldError>`.** Do not use `alert()` for validation errors.
19. **Dates must use ISO 8601 format internally (`YYYY-MM-DD`).** Use `<input type="date">`, not `<input type="text">`.
20. **Format dates for display only with `formatDate()`.** Never store display-formatted dates as application data.

---

## Placeholders and Alerts
21. **Do not use `alert()` for application workflows.** This was a known bug in the original codebase and has been fixed.
22. **Do not create placeholder buttons.** Every button must either perform its intended action or not exist.
23. **Do not add "Coming soon", "Not implemented", or "Next workflow" messages** for existing or nearly-finished features.

---

## Code Quality
24. **Never generate one-line source files.** Each file must be properly formatted and readable.
25. **Run Prettier after modifying files.**
    ```sh
    npm run format       # formats all src files
    npm run format:check # verifies formatting
    ```
26. **Prettier config** is in `client/.prettierrc`:
    - `semi: true`, `singleQuote: true`, `tabWidth: 2`, `trailingComma: 'es5'`

---

## localStorage
27. **Crops persist under the key `agrilink-crops`.** Do not change this key.
28. **All localStorage read/write goes through `AppContext`.** Do not add new `localStorage.setItem` calls outside context.
29. **Do not wipe localStorage unnecessarily.** Guard reads with try/catch (already implemented in `AppContext`).

---

## Error Handling
30. **The `ErrorBoundary` wraps the entire app.** Do not remove it.
31. **Fix root causes of errors.** Do not use `ErrorBoundary` to hide programming mistakes.
32. **Malformed localStorage data must not crash the app.** The context's `read()` function handles this — keep it.

---

## Build
33. **Run `npm run build` before considering any task complete.**
34. **Fix all compilation errors, import errors, and runtime errors before stopping.**
35. **Check the browser console for errors after making changes.**

---

## File Structure Reference

```
client/src/
  App.jsx                          — routing only
  main.jsx                         — entry point (do not modify)
  index.css                        — all styles

  components/
    common/
      FieldError.jsx
      Modal.jsx
      PageTitle.jsx
      PriceChart.jsx
      StatCard.jsx
      StatusBadge.jsx
    layout/
      Layout.jsx                   — Frame, Layout, BuyerLayout
    ErrorBoundary.jsx

  context/
    AppContext.jsx                  — AppProvider, useApp (single source of truth)

  data/
    mockData.js                    — all mock data

  pages/
    Login/
      LoginPage.jsx
    Dashboard/
      DashboardPage.jsx
    Crops/
      CropsPage.jsx
      CropCard.jsx
      CropDetailsModal.jsx
      CropEditModal.jsx
      CropForm.jsx
    Market/
      MarketPage.jsx
    Buyers/
      BuyersPage.jsx
    Recommendation/
      RecommendationPage.jsx
    Deals/
      DealsPage.jsx
    buyer/
      BuyerDashboardPage.jsx
      RequirementsPage.jsx
      OrdersPage.jsx

  utils/
    format.js                      — money() formatter
    recommendation.js              — calculateMatch, rankedBuyers
    validation.js                  — isValidIsoDate, formatDate, validateCrop,
                                     validateOffer, validateRequirement, todayIso

  hooks/                           — empty, ready for future custom hooks
```
