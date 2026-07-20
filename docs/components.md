# Component Library & UI Guidelines

PalikaOS utilizes a highly customized hybrid component library. We combine the accessibility primitives of **Radix UI** with the utility styling of **Tailwind CSS**.

## Core Philosophy

1. **Accessibility First:** We NEVER build custom complex components (like Modals, Dropdowns, Tabs) using raw `<div>` tags and manual `onClick`/`onKeyDown` listeners. This leads to broken screen-reader support and poor keyboard navigation.
2. **Headless UI:** We use Radix UI (or `cmdk`) for all state management, focus trapping, and ARIA attributes.
3. **Tailwind for Design:** We style the Radix primitives directly using Tailwind CSS to maintain our exact design system requirements.

## Reusable Components

All reusable UI components are located in `src/components/`.

### 1. Data Tables (`src/components/ui/table/DataTable.tsx`)
We use `@tanstack/react-table` for our headless table logic, which is styled using our own custom Radix-inspired layout. 
- **Usage:** Create a `columnHelper` to define columns, initialize `useReactTable`, and pass the `table` instance to the `<DataTable>` component.

### 2. Form Elements (`src/components/form/`)
- **Text Inputs:** Use `<Input>` components.
- **Selects:** 
  - For standard dropdowns, use `<Select>` (built on Radix UI).
  - For multi-selects, use `<MultiSelect>` (built on Radix Popover and `cmdk`).
  - For searchable single-selects, use `<ComboboxSelect>` (built on Radix Popover and `cmdk`).
- **Toggles/Checkboxes:** Use `<Switch>` and `<Checkbox>` (both built strictly on Radix UI primitives).

### 3. Modals and Dialogs (`src/components/ui/modal/index.tsx`)
Always use our exported `Modal` component (which wraps `@radix-ui/react-dialog`). It guarantees that focus is trapped inside the modal, preventing users from accidentally tabbing out and interacting with the page behind it.

### 4. Command Palette (`src/components/ui/CommandPalette.tsx`)
Activated by pressing `Cmd + K` (or `Ctrl + K`). It is powered by `cmdk` (Command) and wrapped in a Radix Dialog. It allows users to quickly jump to any page in the application.

## Best Practices for Developers

- **Do NOT install other Headless UI libraries:** We previously used `@headlessui/react` but have standardized on Radix UI and `cmdk`. Please do not add conflicting UI libraries.
- **Do NOT manually manage "Click Outside":** If you need a dropdown that closes when a user clicks away, use a Radix `Popover` or `DropdownMenu`. Do not attach manual `document.addEventListener('mousedown')` events.
- **Icons:** We use `lucide-react` for standard icons. If a custom icon is needed, place the raw SVG component in `src/icons/`.
