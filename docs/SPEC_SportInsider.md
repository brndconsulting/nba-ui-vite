# Sport Insider - Master Specification

**Version:** 1.0.0  
**Last Updated:** 2026-01-02  
**Status:** Active

---

## Executive Summary

Sport Insider is a **multi-user NBA Fantasy Sports dashboard** built with React 19 + Tailwind 4 + shadcn/ui. It integrates with Yahoo Fantasy Sports API via OAuth 1.0a to provide real-time league, team, and player data.

**Core Promise:** Every user sees their actual Yahoo data, never dummy values. Every UI state is intentional and validated.

---

## P0: Non-Negotiables (No Exceptions)

### 1. UI Framework & Theming
- **shadcn/ui components ONLY** for interactive elements (Button, Card, Dialog, Select, Input, etc.)
- **Token-based theming via CSS variables** (Tailwind 4 + custom theme system)
- **No hardcoded colors:** Forbidden: `text-black`, `bg-white`, `text-gray-*`, inline `style={{color: '...'}}`, `#ffffff`, `rgb(0,0,0)`
- **All colors must come from:** `bg-background`, `text-foreground`, `bg-card`, `text-card-foreground`, `bg-accent`, etc.
- **Theme selector must work:** Light, Dark, and all custom palettes must be testable in browser

### 2. Data Integrity & No Dummy Data
- **Never print fallback numbers** when data is missing:
  - ❌ `league.totalPoints || 0`
  - ❌ `team.wins ?? "0"`
  - ❌ `player.projectedPoints || "-"`
- **Instead:** Use explicit states:
  - `<Skeleton />` while loading
  - `<EmptyState />` if no data exists
  - `<ErrorState lastSyncAt={meta.last_sync_at} />` if fetch failed
- **Timestamp always visible:** Every data display shows `last_sync_at` so users know freshness

### 3. API Contract (Envelope<T>)
- **All API responses follow:**
  ```typescript
  {
    success: boolean,
    data: T,
    meta: {
      last_sync_at: ISO8601 string,
      capabilities: string[],
      errors?: string[]
    }
  }
  ```
- **Frontend validates** via Zod schema before rendering
- **Mismatch → ErrorState** (never silent failure)

### 4. Multi-Theme Validation
- **Every UI change must be tested in:**
  - Light mode
  - Dark mode
  - All available theme palettes (if any)
- **No exceptions:** If you can't test it in all themes, it's not done
- **Contrast must pass:** Text readable on all backgrounds (WCAG AA minimum)

### 5. State Completeness
- **Every component must handle:**
  - Loading state (Skeleton)
  - Success state (data + timestamp)
  - Error state (error message + retry button)
  - Empty state (no data, but not an error)
  - Stale state (data exists but last_sync_at > threshold)
- **No "undefined" renders:** If state is unclear, show ErrorState

---

## Architecture

### Frontend (nba-ui)
- **Framework:** React 19 + Wouter (client-side routing)
- **Styling:** Tailwind 4 + shadcn/ui + custom CSS variables
- **State:** React hooks + Context (no Redux unless unavoidable)
- **Data Fetching:** `useEffect` + `fetch` (or tRPC if backend available)
- **Validation:** Zod schemas for API responses

### Backend (nba-api)
- **Framework:** FastAPI (Python)
- **Database:** PostgreSQL (Railway)
- **Auth:** Yahoo OAuth 1.0a (token refresh + storage)
- **Logging:** Structured logs with request/response checksums
- **API Contract:** Envelope<T> for all endpoints

### Data Flow
```
User → Frontend (React) → Backend (FastAPI) → Yahoo API
                ↓
            PostgreSQL (tokens + cache)
```

---

## Feature Checklist

### Phase 1: MVP (Current)
- [ ] User authentication via Yahoo OAuth 1.0a
- [ ] League overview (name, season, scoring format)
- [ ] Team roster (players + stats)
- [ ] Matchup view (current week + upcoming)
- [ ] Settings page (logout, theme selector)

### Phase 2: Enhanced
- [ ] Trade analyzer
- [ ] Waiver wire recommendations
- [ ] Historical stats (season trends)
- [ ] Multi-league support

### Phase 3: Advanced
- [ ] Real-time notifications
- [ ] Mobile app (React Native)
- [ ] AI-powered recommendations

---

## Code Standards

### Naming Conventions
- **Components:** PascalCase (`LeagueOverview.tsx`)
- **Hooks:** camelCase with `use` prefix (`useLeagueData`)
- **Types:** PascalCase (`LeagueData`, `PlayerStats`)
- **Constants:** UPPER_SNAKE_CASE (`MAX_ROSTER_SIZE`)

### File Structure
```
client/
  src/
    pages/        ← Page-level components
    components/   ← Reusable UI (shadcn + custom)
    hooks/        ← Custom React hooks
    lib/          ← Utilities (Zod schemas, API client)
    contexts/     ← React Context
    index.css     ← Global theme + tokens
```

### Imports
- **Relative paths for local code:** `import { LeagueCard } from '@/components/LeagueCard'`
- **Absolute paths:** Use `@/` alias (configured in `tsconfig.json`)
- **shadcn imports:** `import { Button } from '@/components/ui/button'`

### Component Template
```tsx
import { FC } from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface Props {
  leagueId: string;
}

export const LeagueOverview: FC<Props> = ({ leagueId }) => {
  // 1. State
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 2. Effects
  useEffect(() => {
    fetchLeague(leagueId);
  }, [leagueId]);

  // 3. Handlers
  const handleRetry = () => {
    setError(null);
    fetchLeague(leagueId);
  };

  // 4. Render states
  if (loading) return <Skeleton className="h-48" />;
  if (error) return <ErrorState message={error} onRetry={handleRetry} />;
  if (!data) return <EmptyState />;

  // 5. Main render
  return (
    <Card className="p-4">
      <h2 className="text-2xl font-bold text-foreground">{data.name}</h2>
      <p className="text-sm text-muted-foreground">
        Last updated: {new Date(data.meta.last_sync_at).toLocaleString()}
      </p>
    </Card>
  );
};
```

---

## Testing & QA

### Unit Tests
- [ ] Zod schema validation (API responses)
- [ ] Hook logic (data fetching, state management)
- [ ] Utility functions (formatters, validators)

### Visual Tests
- [ ] Light mode (all pages)
- [ ] Dark mode (all pages)
- [ ] All theme palettes (if applicable)
- [ ] Responsive design (mobile, tablet, desktop)

### Integration Tests
- [ ] OAuth flow (login → token storage → logout)
- [ ] Data fetching (success, error, empty, stale)
- [ ] State transitions (loading → success → error)

### Manual QA
- [ ] Keyboard navigation (Tab, Enter, Escape)
- [ ] Focus rings visible
- [ ] No console errors
- [ ] No hardcoded colors in DevTools

---

## Deployment Checklist

- [ ] All tests passing
- [ ] No console warnings
- [ ] No hardcoded credentials
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] Monitoring/logging enabled
- [ ] Rollback plan documented

---

## Glossary

| Term | Definition |
|------|-----------|
| **Envelope<T>** | Standard API response wrapper with `success`, `data`, `meta` |
| **last_sync_at** | ISO 8601 timestamp of last successful Yahoo API call |
| **Skeleton** | Loading placeholder (shimmer effect) |
| **EmptyState** | UI when data exists but is empty (e.g., no players) |
| **ErrorState** | UI when fetch/parse fails, with retry option |
| **StaleState** | UI when data is old (> threshold), with refresh button |
| **Token** | CSS variable (e.g., `bg-background`) |
| **Theme** | Complete color palette (Light, Dark, Custom) |

---

## Contact & Escalation

- **Questions:** Check this spec first
- **Conflicts:** Propose alternative, document decision
- **Bugs:** Create issue with reproduction steps
- **Feature requests:** File as enhancement, link to spec section

---

**This document is the source of truth. All code must align with it.**
