## Summary
- **What changed:**
- **Why:**
- **Screens / routes touched:**

---

## Non-Negotiables (must pass before merge)

### UI Validation Matrix
- [ ] Verified in **Light mode**
- [ ] Verified in **Dark mode**
- [ ] Verified in **ALL themes/palettes** (if theme selector exists)

### Contrast & States (shadcn tokens only)
- [ ] Contrast OK: Card / Table / Badge / Alert / Skeleton / Inputs
- [ ] Focus ring visible (keyboard navigation)
- [ ] Hover/Active/Disabled/Empty/Error/Stale states OK
- [ ] **No hardcoded colors** (no `text-black`, `bg-white`, `text-gray-*`, inline styles). Tokens only.

### "No Dummy Data" Rule
- [ ] No fallback numbers like `|| 0`, `|| "0"`, `?? 0` for Yahoo-derived data
- [ ] No hardcoded context defaults (leagueId/teamId)
- [ ] If data missing → Skeleton / EmptyState / ErrorState with `last_sync_at`

### Data Contract
- [ ] API responses follow the **Envelope<T>** contract (`meta.last_sync_at` + `capabilities` always present)
- [ ] Frontend validates envelope via Zod schema and renders ErrorState on mismatch

### Code Quality
- [ ] `pnpm lint` passes (no ESLint warnings)
- [ ] `pnpm build` succeeds
- [ ] No console errors or warnings
- [ ] No unused imports or variables

## Test / QA
- [ ] Unit/contract tests updated (if applicable)
- [ ] Ran `pnpm lint` + `pnpm build` locally
- [ ] Visual check completed (Light/Dark × Themes)
- [ ] Tested on mobile/tablet (if UI change)

## Notes / Risks
- **Potential regressions:**
- **Follow-ups:**

---

### Reviewer Checklist
- [ ] Code aligns with `docs/SPEC_SportInsider.md`
- [ ] All non-negotiables are checked
- [ ] No hardcoded colors or dummy data
- [ ] States (loading/error/empty/stale) are handled
- [ ] Approved for merge

---

**See `docs/SPEC_SportInsider.md` for full specification.**
