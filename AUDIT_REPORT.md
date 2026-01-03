# Sport Insider - Code Audit Report
**Date:** 2026-01-03  
**Auditor:** Manus  
**Status:** CRITICAL ISSUES FOUND

---

## 1. CRITICAL VIOLATIONS (MUST FIX)

### 1.1 Hardcoded Default Values (PROHIBITED)
**Violation:** Using default values when data is missing instead of showing proper states

| File | Line | Issue | Severity |
|------|------|-------|----------|
| `ManagerComparison.tsx` | 191 | `\|\| '—'` for felo_score | HIGH |
| `ManagerComparison.tsx` | 206 | `\|\| '—'` for felo_score | HIGH |
| `ManagerComparison.tsx` | 54 | `\|\| '—'` for ranking | HIGH |
| `WeekMatchupCard.tsx` | - | `'N/A'` for category result | HIGH |
| `ProjectionComparison.tsx` | - | `"—"` and `"0"` defaults | HIGH |
| `useManagerComparison.ts` | 53 | `\|\| '0'` for wins/losses/ties | HIGH |
| `InsiderPanel.tsx` | - | `'N/A'` for last_sync_at | HIGH |

**Fix Required:** Replace ALL defaults with proper state handling:
- If data is missing → show `<MissingState />`
- If data is loading → show `<LoadingState />`
- If data is stale → show `<StaleState />`
- Never render fallback values

---

### 1.2 Missing BD Connections
**Violation:** Components rendering without fetching data from backend

| Component | Issue | Should Connect To |
|-----------|-------|-------------------|
| `ManagerComparison` | Props passed manually instead of fetching | `/v1/league-managers` + `/v1/standings` |
| `WeekMatchupCard` | Hardcoded category results | `/v1/matchups` |
| `ProjectionComparison` | No projection data source | Backend projection endpoint (if exists) |
| `InsiderPanel` | Manual sync_at instead of from DB | `/v1/sync-status` |

---

### 1.3 TypeScript Errors (BLOCKING BUILD)
```
✖ 4 errors found:
- ManagerComparison.tsx(69): Property 'managers' does not exist
- ManagerComparison.tsx(69): Property 'matchupData' does not exist  
- Matchup.tsx(121): Property 'you' does not exist
- Matchup.tsx(164): Type mismatch in props
```

**Status:** MUST RESOLVE before deployment

---

### 1.4 Lint Warnings (QUALITY ISSUES)
```
✖ 5 problems (0 errors, 5 warnings):
- ManagerComparison.tsx:77-80 - console.log statements (debug code)
- useManagerComparison.ts:53 - Type 'any' used
```

**Fix:** Remove debug logging, use proper TypeScript types

---

## 2. ARCHITECTURE VIOLATIONS

### 2.1 Yahoo API Calls in Runtime (PROHIBITED)
**Current State:** ✅ COMPLIANT  
All Yahoo calls are in sync job, not in runtime endpoints.

### 2.2 Owner-Scope Enforcement
**Status:** ⚠️ NEEDS VALIDATION
- Backend must validate `owner_id` on all endpoints
- Frontend must never expose other users' data
- Audit: Check `/v1/context`, `/v1/standings`, `/v1/matchups` for owner validation

### 2.3 Shadcn-Only UI (100% Compliance Required)
**Violations Found:**
- ✅ No custom CSS found
- ✅ No hardcoded colors found
- ✅ Using shadcn components (Card, Badge, Avatar, Separator, Progress)
- ⚠️ Some placeholder text in SelectValue (acceptable for UI hints)

---

## 3. DATA FLOW ISSUES

### 3.1 Missing Hook Implementations
| Hook | Status | Issue |
|------|--------|-------|
| `useManagerComparison` | ⚠️ BROKEN | Returns wrong interface, not fetching data |
| `useMatchups` | ✅ OK | Connects to `/v1/matchups` |
| `useStandings` | ✅ OK | Connects to `/v1/standings` |
| `useSettings` | ✅ OK | Connects to `/v1/settings` |
| `useLeagueManagers` | ✅ OK | Connects to `/v1/league-managers` |

### 3.2 Envelope Validation
**Status:** ⚠️ NEEDS REVIEW
- Backend responses should follow envelope pattern
- Frontend should validate: `{ data, meta, error }`
- Check: `/v1/context`, `/v1/sync-status` responses

---

## 4. STATE MANAGEMENT ISSUES

### 4.1 Loading States
**Status:** ✅ IMPLEMENTED
- ManagerComparison has loading skeleton
- WeekMatchupCard has loading state
- All hooks return `loading` boolean

### 4.2 Error States
**Status:** ✅ IMPLEMENTED
- ErrorState component exists
- ErrorBoundary wraps app
- All hooks return `error` string

### 4.3 Empty/Missing/Stale States
**Status:** ⚠️ INCOMPLETE
- EmptyState component exists
- StaleState component exists
- Missing proper integration in all components

---

## 5. CODE QUALITY CHECKLIST

| Item | Status | Notes |
|------|--------|-------|
| No console.log in production | ❌ FAIL | Remove debug logging |
| No hardcoded values | ❌ FAIL | Replace with state handling |
| No CSS custom | ✅ PASS | 100% shadcn/ui |
| No dummy data | ❌ FAIL | Multiple '—' and 'N/A' defaults |
| TypeScript strict | ❌ FAIL | 4 errors, 1 'any' type |
| All data from BD | ❌ FAIL | Some props passed manually |
| Owner-scope enforced | ⚠️ NEEDS AUDIT | Backend validation needed |

---

## 6. DEPLOYMENT READINESS

**Overall Status:** 🔴 NOT READY

### Blockers:
1. ✋ TypeScript compilation errors (4 errors)
2. ✋ Hardcoded default values throughout
3. ✋ useManagerComparison hook broken
4. ✋ Missing BD connections in components

### Must Fix Before Deploy:
- [ ] Resolve all TypeScript errors
- [ ] Remove all hardcoded defaults (replace with states)
- [ ] Fix useManagerComparison hook interface
- [ ] Ensure all data flows from BD
- [ ] Remove debug console.log statements
- [ ] Validate owner-scope on backend
- [ ] Test all error/loading/empty/stale states

---

## 7. SPECIFIC FIXES REQUIRED

### Fix 1: ManagerComparison.tsx
```typescript
// BEFORE (WRONG):
{you?.felo_score || '—'}

// AFTER (CORRECT):
{you?.felo_score ? (
  <span>{you.felo_score}</span>
) : (
  <MissingState reason="felo_score_not_available" />
)}
```

### Fix 2: useManagerComparison Hook
```typescript
// BEFORE (WRONG):
interface UseManagerComparisonResult {
  you: Manager | null;
  opponent: Manager | null;
}

// AFTER (CORRECT):
interface UseManagerComparisonResult {
  managers: Manager[] | null;
  matchupData: MatchupData | null;
  loading: boolean;
  error: string | null;
}
```

### Fix 3: Matchup.tsx Props
```typescript
// BEFORE (WRONG):
<ManagerComparison you={you} opponent={opponent} />

// AFTER (CORRECT):
<ManagerComparison 
  leagueKey={leagueKey}
  teamKey={teamKey}
  opponentTeamKey={opponentTeamKey}
/>
```

---

## 8. RECOMMENDATIONS

### Immediate (Before Deploy):
1. Fix all TypeScript errors
2. Remove hardcoded defaults
3. Fix hook interfaces
4. Run full build test

### Short Term (Next Sprint):
1. Add owner-scope validation tests
2. Implement envelope validation tests
3. Add state transition tests
4. Document all API contracts

### Long Term:
1. Set up code review checklist automation
2. Add linting rules for hardcoded values
3. Create component library documentation
4. Set up E2E tests for data flows

---

## 9. SIGN-OFF

**Audit Completed:** ✅  
**Issues Found:** 15+  
**Severity:** CRITICAL  
**Recommendation:** DO NOT DEPLOY - Fix critical issues first

**Next Steps:**
1. Developer fixes issues per this report
2. Re-run audit
3. Code review with checklist
4. Deploy only after all items resolved
