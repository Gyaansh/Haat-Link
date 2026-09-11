# AgriLink — Project Development Rules

These rules apply to all code in this repository.
They must be followed by every developer and AI coding agent.

---

## General

1. **Inspect before modifying.** Read the existing code in any file or feature before making changes. Do not assume it is empty or broken.
2. **Preserve existing functionality during refactoring.** A refactor that breaks features is not acceptable.
3. **Do not rewrite unrelated code.** If fixing a bug in Crops, do not touch Buyers unless it is directly required.
4. **Do not introduce new libraries without a clear reason.** Justify new dependencies in a comment or PR description.
5. **Stop and report if a change requires architectural changes outside the task scope.**

---

## Frontend (React)

See [`client/AGENTS.md`](client/AGENTS.md) for frontend-specific rules.

---

## Backend

- The backend lives in `/server`.
- Do not modify backend code unless the task explicitly requires it.
- Do not build ML models, databases, or real authentication in the prototype phase.

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
