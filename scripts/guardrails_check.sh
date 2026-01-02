#!/usr/bin/env bash
set -euo pipefail

echo "=========================================="
echo "Sport Insider Guardrails Check"
echo "=========================================="
echo ""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get all TypeScript/JavaScript files EXCLUDING:
# - config files
# - shadcn/ui components (they use CSS vars, which is fine)
# - node_modules
TARGETS=$(git ls-files | grep -E '\.(ts|tsx|js|jsx)$' | grep -v -E '(config|\.config\.|vite\.config|tailwind\.config|eslint\.config|next\.config|components/ui/)' || true)

if [[ -z "${TARGETS}" ]]; then
  echo -e "${YELLOW}No TS/JS files found (excluding configs and shadcn/ui).${NC}"
  exit 0
fi

FAIL=0
VIOLATIONS=0

# Check 1: Hardcoded hex colors (#fff, #ffffff, #000, #000000, etc.)
# Exclude URLs, hashes, and comments
echo "Checking for hardcoded hex colors..."
VIOLATIONS_FOUND=0
while IFS= read -r file; do
  if grep -nE '#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})\b' "$file" 2>/dev/null | grep -v -E '(url\(|hash|comment|//)' && ((VIOLATIONS_FOUND++)); then
    true
  fi
done <<< "$TARGETS"

if [[ $VIOLATIONS_FOUND -gt 0 ]]; then
  echo -e "${RED}❌ VIOLATION: Hardcoded hex colors detected (use CSS variables/tokens)${NC}"
  FAIL=1
  ((VIOLATIONS++))
fi

# Check 2: Dummy fallback numbers (|| 0, || "0", ?? 0)
# Exclude version, port, timeout, and other legitimate uses
echo ""
echo "Checking for dummy fallback numbers..."
VIOLATIONS_FOUND=0
while IFS= read -r file; do
  if grep -nE '\|\|\s*["\047]?0["\047]?|\?\?\s*["\047]?0["\047]?' "$file" 2>/dev/null | grep -v -E '(port|version|timeout|status|code|count)' && ((VIOLATIONS_FOUND++)); then
    true
  fi
done <<< "$TARGETS"

if [[ $VIOLATIONS_FOUND -gt 0 ]]; then
  echo -e "${RED}❌ VIOLATION: Dummy fallback numbers detected (use Skeleton/Empty/Error states)${NC}"
  FAIL=1
  ((VIOLATIONS++))
fi

# Check 3: Hardcoded league/team IDs as defaults
echo ""
echo "Checking for hardcoded context defaults..."
VIOLATIONS_FOUND=0
while IFS= read -r file; do
  if grep -nE '(leagueId|teamId|owner_id)\s*\|\|\s*["\047][0-9]+["\047]' "$file" 2>/dev/null && ((VIOLATIONS_FOUND++)); then
    true
  fi
done <<< "$TARGETS"

if [[ $VIOLATIONS_FOUND -gt 0 ]]; then
  echo -e "${RED}❌ VIOLATION: Hardcoded context defaults detected (use props/context)${NC}"
  FAIL=1
  ((VIOLATIONS++))
fi

# Check 4: Dummy placeholders (|| "-", || "N/A", || "--")
echo ""
echo "Checking for dummy placeholders..."
VIOLATIONS_FOUND=0
while IFS= read -r file; do
  if grep -nE '\|\|\s*["\047](-|N\/A|--|TBD|FIXME)["\047]' "$file" 2>/dev/null && ((VIOLATIONS_FOUND++)); then
    true
  fi
done <<< "$TARGETS"

if [[ $VIOLATIONS_FOUND -gt 0 ]]; then
  echo -e "${RED}❌ VIOLATION: Dummy placeholders detected (use explicit states)${NC}"
  FAIL=1
  ((VIOLATIONS++))
fi

echo ""
echo "=========================================="

if [[ "$FAIL" -eq 1 ]]; then
  echo -e "${RED}❌ Guardrails FAILED ($VIOLATIONS violations)${NC}"
  echo ""
  echo "Fix the violations above and try again."
  echo "See docs/SPEC_SportInsider.md for guidelines."
  exit 1
else
  echo -e "${GREEN}✅ Guardrails PASSED${NC}"
  echo ""
  echo "All checks passed:"
  echo "  ✓ No hardcoded hex colors"
  echo "  ✓ No dummy fallback numbers"
  echo "  ✓ No hardcoded context defaults"
  echo "  ✓ No dummy placeholders"
  exit 0
fi
