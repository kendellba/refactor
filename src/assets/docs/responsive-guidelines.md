# Responsive Design Guidelines

## Standardized Breakpoints

Our application uses standardized breakpoints to ensure consistent responsive behavior across all components. These breakpoints are defined as CSS variables in `src/assets/global.css`:

```css
:root {
  --breakpoint-xs: 600px; /* Mobile phones */
  --breakpoint-sm: 960px; /* Tablets/small laptops */
  --breakpoint-md: 1264px; /* Desktops */
  --breakpoint-lg: 1904px; /* Large screens */
}
```

## Using Breakpoints in Media Queries

When writing media queries, always use the CSS variables instead of hardcoded pixel values:

```css
/* ❌ Don't do this */
@media (max-width: 600px) {
  /* Mobile styles */
}

/* ✅ Do this instead */
@media (max-width: var(--breakpoint-xs)) {
  /* Mobile styles */
}

/* For tablet range */
@media (min-width: calc(var(--breakpoint-xs) + 1px)) and (max-width: var(--breakpoint-sm)) {
  /* Tablet styles */
}
```

## Utility Classes

The global CSS also provides utility classes for common responsive patterns:

### Visibility Classes

- `.mobile-only` - Content only visible on mobile screens (≤ 600px)
- `.tablet-only` - Content only visible on tablet screens (601px - 960px)
- `.desktop-only` - Content only visible on desktop screens (> 960px)
- `.mobile-tablet-only` - Content visible on mobile and tablet screens (≤ 960px)
- `.tablet-desktop-only` - Content visible on tablet and desktop screens (> 600px)

### Mobile-specific Utility Classes

- `.mobile-no-padding` - Removes padding on mobile screens
- `.mobile-reduced-padding` - Applies smaller padding on mobile screens
- `.mobile-small-text` - Reduces text size on mobile screens
- `.mobile-stack` - Changes flex containers to stack vertically on mobile
- `.mobile-full-width` - Makes elements full width on mobile screens

## Example Usage

```vue
<template>
  <div>
    <!-- Element visible only on desktop -->
    <div class="desktop-only">Desktop content</div>

    <!-- Element visible only on mobile -->
    <div class="mobile-only">Mobile content</div>

    <!-- Row that stacks on mobile -->
    <div class="d-flex mobile-stack">
      <div class="mobile-full-width">Item 1</div>
      <div class="mobile-full-width">Item 2</div>
    </div>

    <!-- Element with reduced padding on mobile -->
    <div class="pa-4 mobile-reduced-padding">Content with responsive padding</div>
  </div>
</template>
```

## Demo Component

For a live example of these responsive utilities, see the `ResponsiveExampleComponent.vue` in `src/components/ui/`.

## Best Practices

1. **Consistency**: Always use the defined breakpoints for all media queries
2. **Mobile-First**: Design for mobile first, then enhance for larger screens
3. **Utility Classes**: Use the provided utility classes for common patterns
4. **Testing**: Test on all breakpoints regularly during development
5. **Documentation**: Document any component-specific responsive behavior

By following these guidelines, we ensure a consistent responsive design across the entire application.
