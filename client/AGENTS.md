# HaatLink Frontend — Development Rules

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
9. **One source of truth.** Business data lives in `AppContext` only. Do not copy data into local component state independently.

10. **Use `useApp()` from `context/AppContext.jsx`** for all shared state (crops, deals, offers, requirements, role, toast).

11. **Do not introduce Redux or Zustand.** The current `AppContext` is sufficient for this prototype.

---

## Data Sources (PERMANENT RULES)

12. **All application/business data comes from MongoDB via the Express API.** This includes crops, buyers, deals, requirements, offers, market data, notifications, and dashboard stats.

13. **Do not hard-code application/business data in components or pages.** This includes fake arrays of crops, buyers, deals, or any other records.

14. **Do not use localStorage for business data.** localStorage is only for UI preferences:
    - `agrilink-role` — current role (farmer/buyer)
    - `agrilink-selected-crop` — transient UI state

15. **Use the services layer for all backend calls.** Never write `fetch('http://localhost:5000/...')` in a component directly.
16. **Buyer requirements are MongoDB-backed marketplace records and must be visible to farmers through the backend API. Farmer and Buyer perspectives must never maintain separate hard-coded copies of marketplace data.**
17. **The `services/` directory is the only place that communicates with the API.**

### Service Layer
17. `client/src/services/api.js` — base fetch wrapper (single source for BASE_URL, credentials: 'include')
18. `client/src/services/authService.js` — register, login, logout, me
19. `client/src/services/cropService.js` — crop CRUD & getCropTypes
20. `client/src/services/buyerService.js` — buyer fetching
21. `client/src/services/marketService.js` — market data
22. `client/src/services/requirementService.js` — requirement CRUD
23. `client/src/services/dealService.js` — deal creation and fetching
24. `client/src/services/offerService.js` — offer creation and fetching
25. `client/src/services/dashboardService.js` — aggregated dashboard stats
26. `client/src/services/notificationService.js` — notifications

---

## API-Backed UI Requirements

26. **Every page/component backed by an API call must handle all four states:**
    - Loading state (show "Loading…")
    - Success state (show the data)
    - Empty state (show a meaningful message)
    - Error state (show the error message, do not fall back to hard-coded data)

27. **Do not show fake data while the API is loading.**
28. **Do not silently fall back to hard-coded data when the API fails.**

---

## MongoDB Object IDs

29. **MongoDB documents use `_id` (not `id`).** Always use `c._id`, `d._id`, `r._id` etc. when identifying records.
30. **Do not generate client-side IDs for business data.** IDs are assigned by MongoDB.

---

## Mutations

31. **All create/update/delete operations must go through the API.** The flow is:
    - React form → AppContext mutation → service function → POST/PUT/DELETE /api/... → MongoDB
32. **After a successful mutation, update local React state from the API response.** Do not reload the page.
33. **Show a loading/disabled state on submit buttons during API calls.**
34. **Show API error messages to the user if a mutation fails.**

---

## Navigation
35. **Use React Router for all internal navigation.** Use `useNavigate()` or `<Link>`.
36. **Do not use `window.location.href` or `window.location.reload()` for internal navigation.**
37. **Do not use toast messages or alerts as navigation substitutes.**

---

## Forms and Validation
38. **Use proper form validation.** Use `validateCrop`, `validateOffer`, `validateRequirement` from `utils/validation.js`.
39. **Show field-level errors using `<FieldError>`.** Do not use `alert()` for validation errors.
40. **Dates must use ISO 8601 format internally (`YYYY-MM-DD`).** Use `<input type="date">`.
41. **Format dates for display only with `formatDate()`.** Never store display-formatted dates as application data.

---

## Placeholders and Alerts
42. **Do not use `alert()` for application workflows.**
43. **Do not create placeholder buttons.** Every button must either perform its intended action or not exist.
44. **Do not add "Coming soon", "Not implemented", or "Next workflow" messages** for existing or nearly-finished features.

---

## Code Quality
45. **Never generate one-line source files.** Each file must be properly formatted and readable.
46. **Run Prettier after modifying files.**
    ```sh
    npm run format       # formats all src files
    npm run format:check # verifies formatting
    ```
47. **Prettier config** is in `client/.prettierrc`:
    - `semi: true`, `singleQuote: true`, `tabWidth: 2`, `trailingComma: 'es5'`

---

## Error Handling
48. **The `ErrorBoundary` wraps the entire app.** Do not remove it.
49. **Fix root causes of errors.** Do not use `ErrorBoundary` to hide programming mistakes.

---

## Build
50. **Run `npm run build` before considering any task complete.**
51. **Fix all compilation errors, import errors, and runtime errors before stopping.**
52. **Check the browser console for errors after making changes.**

---

## Price Chart Exception
53. **The price chart is the ONLY allowed use of hard-coded business data.**
    - Chart history lives in `client/src/data/mockData.js` (`chartHistory`) and is referenced inline in `DashboardPage` and `MarketPage`.
    - This is explicitly isolated so it can be replaced with a real API later.
    - Do NOT add any other business data to `mockData.js`.

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
    AuthContext.jsx                 — AuthProvider, useAuth (session, login, register, logout)
    AppContext.jsx                  — AppProvider, useApp
                                     Fetches: crops, deals, offers, requirements
                                     Persists in localStorage: role, selected-crop (UI prefs only)

  data/
    mockData.js                    — chartHistory ONLY (price chart exception)

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

  services/                        — API layer (all backend communication goes here)
    api.js                         — base URL + fetch wrapper
    cropService.js
    buyerService.js
    marketService.js
    requirementService.js
    dealService.js
    offerService.js
    dashboardService.js
    notificationService.js

  utils/
    format.js                      — money() formatter
    recommendation.js              — calculateMatch, rankedBuyers
    validation.js                  — isValidIsoDate, formatDate, validateCrop,
                                     validateOffer, validateRequirement, todayIso

  hooks/                           — ready for future custom hooks
```
