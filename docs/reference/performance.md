# Performance Cheat Sheet

> 5 rules for fast apps.

## 1. Dynamic Import Heavy Components

```tsx
import dynamic from 'next/dynamic';

const Chart = dynamic(() => import('@/components/Chart'), {
  loading: () => <Skeleton />,
});
```

## 2. Disable Prefetch on Heavy Routes

```tsx
<Link href="/reports" prefetch={false}>
  Reports
</Link>
```

## 3. Always Use next/image

```tsx
import Image from 'next/image';

<Image src="/photo.jpg" width={400} height={300} alt="..." />;
```

## 4. Don't Import Heavy Libs in Layout

```tsx
// ❌ Bad - loaded on every page
import { Chart } from 'heavyweight-lib';

// ✅ Good - only where needed
const Chart = dynamic(() => import('heavyweight-lib').then((m) => m.Chart));
```

## 5. Analyze Your Bundle

```bash
pnpm analyze
```

---

_Keep it fast. Ship it clean._
