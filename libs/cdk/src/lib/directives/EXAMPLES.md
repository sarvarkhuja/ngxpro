# Cell and Title Directives - Visual Examples

## Example 1: User List

```typescript
@Component({
  selector: 'app-user-list-demo',
  standalone: true,
  imports: [CellDirective, TitleDirective, SubtitleDirective, CellActionsDirective],
  template: `
    <div class="space-y-2 max-w-md">
      <div nxpCell="m">
        <img src="https://i.pravatar.cc/150?img=1" class="w-10 h-10 rounded-full" alt="User" />
        <div nxpTitle>
          <div class="font-medium">Alice Johnson</div>
          <div nxpSubtitle>Senior Developer</div>
        </div>
      </div>

      <div nxpCell="m">
        <img src="https://i.pravatar.cc/150?img=2" class="w-10 h-10 rounded-full" alt="User" />
        <div nxpTitle>
          <div class="font-medium">Bob Smith</div>
          <div nxpSubtitle>Product Manager</div>
        </div>
      </div>

      <div nxpCell="m">
        <img src="https://i.pravatar.cc/150?img=3" class="w-10 h-10 rounded-full" alt="User" />
        <div nxpTitle>
          <div class="font-medium">Carol White</div>
          <div nxpSubtitle>UX Designer</div>
        </div>
      </div>
    </div>
  `,
})
export class UserListDemoComponent {}
```

## Example 2: Interactive Menu Items

```typescript
@Component({
  selector: 'app-menu-demo',
  standalone: true,
  imports: [CellDirective, TitleDirective, SubtitleDirective],
  template: `
    <nav class="w-64 bg-white dark:bg-gray-900 rounded-lg shadow-sm">
      <button nxpCell="m" class="w-full">
        <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        <div nxpTitle>
          <div class="font-medium">Dashboard</div>
          <div nxpSubtitle>Overview and stats</div>
        </div>
      </button>

      <button nxpCell="m" class="w-full">
        <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <div nxpTitle>
          <div class="font-medium">Analytics</div>
          <div nxpSubtitle>View reports</div>
        </div>
      </button>

      <button nxpCell="m" class="w-full">
        <svg class="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <div nxpTitle>
          <div class="font-medium">Settings</div>
          <div nxpSubtitle>Configure app</div>
        </div>
      </button>
    </nav>
  `,
})
export class MenuDemoComponent {}
```

## Example 3: List with Actions

```typescript
@Component({
  selector: 'app-actions-demo',
  standalone: true,
  imports: [CellDirective, TitleDirective, SubtitleDirective, CellActionsDirective],
  template: `
    <div class="space-y-2 max-w-2xl">
      @for (item of items; track item.id) {
        <div nxpCell="l">
          <div class="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
            <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>

          <div nxpTitle class="flex-1">
            <div class="font-semibold">{{ item.title }}</div>
            <div nxpSubtitle>
              <span>{{ item.description }}</span>
              <span class="text-xs">•</span>
              <span>{{ item.date }}</span>
            </div>
          </div>

          <div nxpCellActions>
            <button class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" aria-label="Download">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
            <button class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" aria-label="Share">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>
            <button class="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900 text-red-600 transition-colors" aria-label="Delete">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      }
    </div>
  `,
})
export class ActionsDemoComponent {
  items = [
    { id: 1, title: 'Q4 Report.pdf', description: 'Financial report', date: '2 days ago' },
    { id: 2, title: 'Design System.fig', description: 'Figma file', date: '1 week ago' },
    { id: 3, title: 'Meeting Notes.doc', description: 'Team meeting', date: '2 weeks ago' },
  ];
}
```

## Example 4: Compact and Spacious Heights

```typescript
@Component({
  selector: 'app-heights-demo',
  standalone: true,
  imports: [CellDirective, TitleDirective, SubtitleDirective],
  template: `
    <div class="space-y-4 max-w-md">
      <div>
        <h3 class="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">COMPACT</h3>
        <div nxpCell="m" [height]="'compact'" class="border border-gray-200 dark:border-gray-800">
          <div nxpTitle>
            <div>Compact Cell</div>
            <div nxpSubtitle>No vertical padding</div>
          </div>
        </div>
      </div>

      <div>
        <h3 class="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">NORMAL (DEFAULT)</h3>
        <div nxpCell="m" class="border border-gray-200 dark:border-gray-800">
          <div nxpTitle>
            <div>Normal Cell</div>
            <div nxpSubtitle>Standard padding</div>
          </div>
        </div>
      </div>

      <div>
        <h3 class="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">SPACIOUS</h3>
        <div nxpCell="m" [height]="'spacious'" class="border border-gray-200 dark:border-gray-800">
          <div nxpTitle>
            <div>Spacious Cell</div>
            <div nxpSubtitle>Extra vertical padding</div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class HeightsDemoComponent {}
```

## Example 5: Size Variants

```typescript
@Component({
  selector: 'app-sizes-demo',
  standalone: true,
  imports: [CellDirective, TitleDirective, SubtitleDirective],
  template: `
    <div class="space-y-2 max-w-md">
      <div nxpCell="s" class="border border-gray-200 dark:border-gray-800">
        <div class="w-6 h-6 rounded bg-green-100 dark:bg-green-900"></div>
        <div nxpTitle>
          <div class="text-sm font-medium">Small Cell</div>
          <div nxpSubtitle>40px min height</div>
        </div>
      </div>

      <div nxpCell="m" class="border border-gray-200 dark:border-gray-800">
        <div class="w-10 h-10 rounded bg-blue-100 dark:bg-blue-900"></div>
        <div nxpTitle>
          <div class="font-medium">Medium Cell</div>
          <div nxpSubtitle>52px min height</div>
        </div>
      </div>

      <div nxpCell="l" class="border border-gray-200 dark:border-gray-800">
        <div class="w-12 h-12 rounded bg-purple-100 dark:bg-purple-900"></div>
        <div nxpTitle>
          <div class="text-lg font-medium">Large Cell</div>
          <div nxpSubtitle>72px min height</div>
        </div>
      </div>
    </div>
  `,
})
export class SizesDemoComponent {}
```

## Example 6: Title Size Variants

```typescript
@Component({
  selector: 'app-title-sizes-demo',
  standalone: true,
  imports: [TitleDirective, SubtitleDirective],
  template: `
    <div class="space-y-6 max-w-md">
      <div nxpTitle="s">
        <h4 class="font-semibold">Small Title</h4>
        <p nxpSubtitle>This is a small title with subtitle</p>
      </div>

      <div nxpTitle="m">
        <h3 class="font-semibold">Medium Title</h3>
        <p nxpSubtitle>This is a medium title with subtitle</p>
      </div>

      <div nxpTitle="l">
        <h2 class="font-bold">Large Title</h2>
        <p nxpSubtitle>This is a large title with more spacing</p>
      </div>

      <div nxpTitle>
        <h2 class="font-semibold">Default Title</h2>
        <p nxpSubtitle>No size specified, inherits from parent</p>
      </div>
    </div>
  `,
})
export class TitleSizesDemoComponent {}
```

## Example 7: Real-world Notification List

```typescript
@Component({
  selector: 'app-notifications-demo',
  standalone: true,
  imports: [CellDirective, TitleDirective, SubtitleDirective],
  template: `
    <div class="max-w-md bg-white dark:bg-gray-900 rounded-lg shadow-lg">
      <div class="p-4 border-b border-gray-200 dark:border-gray-800">
        <h2 class="text-lg font-semibold">Notifications</h2>
      </div>

      <div class="divide-y divide-gray-200 dark:divide-gray-800">
        <button nxpCell="m" class="w-full">
          <div class="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0"></div>
          <div nxpTitle class="flex-1">
            <div class="font-medium">New message from Alex</div>
            <div nxpSubtitle>Hey, can we schedule a call?</div>
          </div>
          <span class="text-xs text-gray-500">2m</span>
        </button>

        <button nxpCell="m" class="w-full">
          <div class="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0"></div>
          <div nxpTitle class="flex-1">
            <div class="font-medium">Sarah commented on your post</div>
            <div nxpSubtitle>Great work on the new design!</div>
          </div>
          <span class="text-xs text-gray-500">1h</span>
        </button>

        <button nxpCell="m" class="w-full">
          <div class="w-2 h-2 rounded-full bg-transparent flex-shrink-0"></div>
          <div nxpTitle class="flex-1">
            <div class="font-medium text-gray-600 dark:text-gray-400">Project deadline reminder</div>
            <div nxpSubtitle>Due in 3 days</div>
          </div>
          <span class="text-xs text-gray-500">2d</span>
        </button>
      </div>
    </div>
  `,
})
export class NotificationsDemoComponent {}
```

## Running the Examples

To use these examples in your application:

1. Import the directives:

```typescript
import { CellDirective, TitleDirective, SubtitleDirective, CellActionsDirective } from '@nxp/cdk';
```

2. Add to your component's imports:

```typescript
@Component({
  standalone: true,
  imports: [
    CellDirective,
    TitleDirective,
    SubtitleDirective,
    CellActionsDirective
  ],
  // ...
})
```

3. Use in templates as shown in the examples above.

## Notes

- All examples use Tailwind CSS classes for styling
- Dark mode variants are included using `dark:` prefix
- Interactive elements (buttons) get automatic hover/active states
- Cell actions fade in on hover for a clean interface
- All examples are fully accessible with proper ARIA labels
