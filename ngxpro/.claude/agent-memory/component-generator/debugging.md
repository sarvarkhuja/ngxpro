# Debugging Notes

## HostListener Event Type

**Problem**: `@HostListener('document:keydown.escape', ['$event'])` with parameter `event: KeyboardEvent`
causes TS2345 — "Argument of type 'Event' is not assignable to parameter of type 'KeyboardEvent'".

**Fix**: Always type the `@HostListener` parameter as `Event`:
```typescript
@HostListener('document:keydown.escape', ['$event'])
protected onEsc(event: Event): void {
  // Cast inside if you need KeyboardEvent-specific props
  const ke = event as KeyboardEvent;
  ...
}
```
