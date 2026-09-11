# HaatLink — Project Development Rules

These rules apply to all code in this repository.
They must be followed by every developer and AI coding agent.

---

## General

1. **Inspect before modifying.** Read the existing code in any file or feature before making changes. Do not assume it is empty or broken.
2. **Preserve existing functionality during refactoring.** A refactor that breaks features is not acceptable.
3. **Do not rewrite unrelated code.** If fixing a bug in Crops, do not touch Buyers unless it is directly required.
4. **Do not introduce new libraries without a clear reason.** Justify new dependencies in a comment or PR description.
5. **Stop and report if a change requires architectural changes outside the task scope.**
6. **Inspect existing architecture before modifying it.**
7. **Do not create duplicate sources of truth.**

---

## Data Architecture (PERMANENT RULES)

8. **MongoDB is the source of truth for all application/business data.**
9. **React must never directly access MongoDB.**
10. **Business data must flow: MongoDB → Model → Controller → Route → API → React.**
11. **Do not hard-code application/business data in React components or pages.**
12. **Do not create frontend mock data as a substitute for backend data.**
13. **Do not create server-side mock/fake data when MongoDB is available.**
14. **Do not use localStorage as the primary database for business data.** localStorage is only for UI preferences (role, selected-crop) and session concerns.
15. **Mutations must persist to MongoDB.** CRUD operations must call the backend API and update MongoDB.
16. **Never hard-code MongoDB credentials.** Keep secrets in `.env`. Never commit `.env`.
17. **Never drop/drop collections/delete all documents/reset MongoDB as part of a normal coding task.**
18. **Do not replace existing MongoDB data with fake data.**
19. **Buyer requirements are MongoDB-backed marketplace records and must be visible to farmers through the backend API. Farmer and Buyer perspectives must never maintain separate hard-coded copies of marketplace data.**

---

## Backend Architecture (PERMANENT RULES)

The backend follows this strict pattern:

```
REQUEST
   ↓
app.js
   ↓
routes
   ↓
controllers
   ↓
models
   ↓
MongoDB
```

19. **`app.js` handles Express application setup and route registration only.** No business logic in app.js.
20. **Routes map HTTP endpoints to controllers and should contain minimal logic.** No MongoDB queries in routes.
21. **Controllers contain request handling and business logic.** They receive req/res, validate input, call models, and return responses.
22. **Models handle MongoDB data access and schema definition.**
23. **`req/` is reserved for request-related middleware/validation and must not contain business logic.**
24. **Do not introduce a service layer on the backend unless genuinely necessary.**

---

## Frontend Architecture (PERMANENT RULES)

The frontend follows this strict pattern:

```
React
   ↓
services/ (API layer)
   ↓
Express API
   ↓
Routes → Controllers → Models → MongoDB
```

25. **Use the frontend API/service layer (`client/src/services/`) for all backend communication.** Never scatter localhost URLs throughout components.
26. **Centralize the API base URL in `client/src/services/api.js`.**
27. **Pages remain separate files.** See `client/AGENTS.md` for page locations.
28. **Pages should be composed of smaller focused components.**
29. **Do not put large amounts of business logic into JSX.**
30. **Every API-backed UI must handle loading, success, empty, and error states.**

---

## Code Quality (PERMANENT RULES)

31. **Do not use `alert()` as the primary application workflow.**
32. **Do not use `window.location.reload()` for normal application workflows.**
33. **Do not leave placeholders for existing functionality.**
34. **Format all modified files.** Run `npm run format` in the client directory.
35. **Never generate huge one-line source files.**
36. **Run `npm run build` before completing frontend changes.** Fix all compilation errors.
37. **Do not introduce unnecessary dependencies.**

---

## Price Chart Exception

38. **The price chart is currently allowed to use isolated hard-coded illustrative data.**
    - The 7-day price history arrays in `client/src/data/mockData.js` (`chartHistory`) and within page files are intentionally isolated.
    - This is the ONLY intentional business-data exception.
    - Do NOT connect other business data to this exception.
    - When a real historical price API is built, replace these arrays without touching anything else.

---

## Frontend (React)

See [`client/AGENTS.md`](client/AGENTS.md) for frontend-specific rules.

---

## Backend

- The backend lives in `/server`.
- Do not modify backend code unless the task explicitly requires it.
- Authentication uses JWT in HttpOnly cookies (`/api/auth/register`, `/api/auth/login`, `/api/auth/logout`, `/api/auth/me`).
- Do not build ML models in the prototype phase.

---

## Git

- Do not run destructive git commands (`reset --hard`, `clean -fd`, etc.).
- Do not overwrite uncommitted user work.
- Check `git status` before starting a refactor.

---

## Build

- Run `npm run build` before considering any task complete.
- Fix all compilation errors before stopping.
- Do not leave the build in a broken state.
