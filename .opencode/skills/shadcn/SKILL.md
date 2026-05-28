---
name: shadcn
description: 'Select, add, compose, and style shadcn/ui components following a design spec. Use after `frontend-design` has produced a design spec, or for trivial mechanical changes where no design decision is needed. Handles component imports, composition, accessibility, and shadcn CLI operations. For trivial mechanical changes (no aesthetic decision required), may run without a prior design spec.'
---

## What I Do

Implement frontend components using shadcn/ui. Component structure and composition follow shadcn conventions; visual style defers to the `frontend-design` spec.

## Boundaries

- **Component structure** — use shadcn patterns for imports, composition, accessibility
- **Visual deferral** — colors, typography, spacing, motion come from the design spec; never let shadcn defaults override intentional design decisions
- **No design decisions** — if no design spec exists and the change is non-trivial, raise: "No design spec found, run frontend-design first"

## When to Use

Invoke after `frontend-design` has produced a spec, when:
- Selecting and adding shadcn components
- Writing or refactoring component code
- Implementing component structure, imports, and composition

**Trivial-change carveout:** For purely mechanical changes (no aesthetic decision needed), may run without a prior design spec. When in doubt, ask for the spec first.

## Conflict Resolution

When both `frontend-design` and `shadcn` are active:

| Owned by shadcn | Owned by frontend-design |
|------------------|---------------------------|
| Component selection, imports, composition, accessibility | Color, typography, spacing, motion, aesthetics |
| API patterns, responsive breakpoints | Visual hierarchy and layout philosophy |
| Component structure and variant usage | Design tokens (CSS variable values) |

**Rule:** Design spec wins for visual style. shadcn wins for API/composition. Never let shadcn's defaults override an intentional design decision.

## Project Context

Always check the current project context first. Run:
```bash
npx shadcn@latest info --json
```

This gives you: aliases, isRSC, tailwindVersion, tailwindCssFile, style, base (radix or base), iconLibrary, resolvedPaths, framework, packageManager, preset.

## Essential Rules

### Styling & Tailwind
- Use semantic colors (`bg-primary`, `text-muted-foreground`) — never raw values like `bg-blue-500`
- No `space-x-*` or `space-y-*` — use `flex` with `gap-*`
- Use `size-*` when width and height are equal (`size-10` not `w-10 h-10`)
- Use `truncate` shorthand, not `overflow-hidden text-ellipsis whitespace-nowrap`
- No manual `dark:` overrides — use semantic tokens
- Use `cn()` for conditional classes, not manual ternaries
- No manual `z-index` on overlay components (Dialog, Sheet, Popover handle their own)

### Forms & Inputs
- Forms use `FieldGroup` + `Field` — never raw `div space-y-*` layouts
- `InputGroup` uses `InputGroupInput`/`InputGroupTextarea` — never raw `Input` inside `InputGroup`
- Option sets (2–7) use `ToggleGroup` — don't loop `Button` with manual active state
- `FieldSet` + `FieldLegend` for related checkboxes/radios
- Validation: `data-invalid` on `Field`, `aria-invalid` on the control

### Component Structure
- Items always inside their Group: `SelectItem` → `SelectGroup`, `DropdownMenuItem` → `DropdownMenuGroup`
- Dialog/Sheet/Drawer always need a Title (`className="sr-only"` if visually hidden)
- Full Card composition: `CardHeader`/`CardTitle`/`CardDescription`/`CardContent`/`CardFooter`
- `Avatar` always needs `AvatarFallback`
- `TabsTrigger` must be inside `TabsList`
- Button has no `isPending` — compose with `Spinner` + `data-icon` + `disabled`

### Use Components, Not Custom Markup
- Callouts → `Alert`
- Empty states → `Empty`
- Toast → `sonner`'s `toast()`
- Separator → `Separator` (not `<hr>` or `border-t`)
- Loading placeholders → `Skeleton`
- Badges → `Badge`

### Icons
- Icons in `Button` use `data-icon="inline-start"` or `data-icon="inline-end"` — no sizing classes on icons inside components
- Pass icons as objects, not string keys: `icon={CheckIcon}`

## Key Patterns

```tsx
// Form layout
<FieldGroup>
  <Field>
    <FieldLabel htmlFor="email">Email</FieldLabel>
    <Input id="email" />
  </Field>
</FieldGroup>

// Icons in buttons
<Button>
  <SearchIcon data-icon="inline-start" />
  Search
</Button>

// Spacing: gap, not space
<div className="flex flex-col gap-4">

// Equal dimensions
<Avatar className="size-10">

// Semantic colors
<Badge variant="secondary">+20.1%</Badge>
```

## Component Selection

| Need | Use |
|------|-----|
| Button/action | `Button` with appropriate variant |
| Form inputs | `Input`, `Select`, `Combobox`, `Switch`, `Checkbox`, `RadioGroup`, `Textarea` |
| Toggle 2-5 options | `ToggleGroup` + `ToggleGroupItem` |
| Data display | `Table`, `Card`, `Badge`, `Avatar` |
| Navigation | `Sidebar`, `NavigationMenu`, `Breadcrumb`, `Tabs`, `Pagination` |
| Overlays | `Dialog` (modal), `Sheet` (side panel), `Drawer` (bottom sheet) |
| Feedback | `sonner` (toast), `Alert`, `Progress`, `Skeleton`, `Spinner` |
| Charts | `Chart` (wraps Recharts) |
| Empty states | `Empty` |
| Menus | `DropdownMenu`, `ContextMenu`, `Menubar` |
| Tooltips | `Tooltip`, `HoverCard`, `Popover` |

## Upstream Reference

For the full rulebook covering edge cases, see the official shadcn skill:
- `skills.sh/shadcn/ui/shadcn` — complete rules for styling, forms, composition, icons, CLI
- Detailed rule files: `styling.md`, `forms.md`, `composition.md`, `icons.md`, `base-vs-radix.md`, `cli.md`

Run `npx shadcn@latest docs <component>` and fetch the URLs for component-specific API reference.

## Workflow

### Step 0: Parse Design Spec & Extract Tokens

If a design spec exists from `frontend-design`, read the spec's **Design Token Mapping** table. Extract every token and its target:

- Colors → note hex values and their target config keys
- Font → note the font name and fallback stack
- Border radius, spacing, shadows → note exact values
- Motion timing, container width → note CSS variable names

If no spec exists and the change is non-trivial, raise: "No design spec found, run frontend-design first." For trivial mechanical changes, proceed with shadcn defaults.

### Steps 1-7

1. Get project context: `npx shadcn@latest info --json`
2. Check installed components (list `resolvedPaths.ui` directory)
3. **Apply design tokens** — write the extracted tokens into:
   - `tailwind.config.js` `theme.extend.{colors,fontFamily,borderRadius,spacing,boxShadow,maxWidth}`
   - `global.css` CSS variable layer (semantic tokens referencing the config)
4. Find/add components: `npx shadcn@latest search` / `npx shadcn@latest add`
5. Get docs: `npx shadcn@latest docs <component>` → fetch URLs
6. Import and compose following the rules above
7. Override default variants/colors to match the design spec

### Post-Install Verification

After all components are installed and styled, verify no default shadcn colors leaked through:

```bash
# Check for default shadcn raw colors in source files (these should be overridden by design spec tokens)
grep -rn "bg-blue-\|bg-purple-\|bg-zinc-\|bg-slate-\|text-blue-\|text-purple-" --include="*.tsx" --include="*.ts" frontend/src/
```

Any matches mean shadcn defaults surfaced where design spec tokens should be used. Fix by replacing raw color classes with semantic tokens from the spec.
