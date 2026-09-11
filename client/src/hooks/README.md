# hooks/

This directory is reserved for custom React hooks.

## When to create a hook here

- When the same stateful logic is needed in more than one component.
- When a component's state logic becomes complex enough to warrant extraction.

## Examples of future hooks

- `useLocalStorage(key, defaultValue)` — generic localStorage state binding
- `useCropFilters()` — filtering/sorting logic for the crop list
- `useMarketData(cropName)` — fetching/selecting market data for a crop

## Convention

- Hook files are named `use<HookName>.js` (lowercase `use` prefix required by React).
- Hooks must not import page-level components. They may import from `utils/` and `context/`.
