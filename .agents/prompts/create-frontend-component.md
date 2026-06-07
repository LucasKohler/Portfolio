# Create Frontend Component

## Objective

Create a reusable frontend component aligned with the current design direction.

## When To Use

Use when UI needs a reusable component or route section.

## Reusable Prompt

```txt
Create the approved frontend component in the existing Next.js structure.
Follow DESIGN.md and docs/specs/COMPONENTS.md. Prefer Server Components unless interaction
requires a Client Component. Do not introduce global state or new libraries
without justification. Validate with lint/build when possible.
```

## Checklist

- Place the component in the correct folder.
- Reuse existing UI primitives.
- Keep props typed.
- Avoid duplicated data.
- Validate responsive and accessibility basics.

## Expected Output

Component implementation, usage notes and validation results.

## Acceptance Criteria

- Component is reusable and cohesive.
- It follows the dark premium SaaS visual direction.
- No unnecessary client state or effects are introduced.
