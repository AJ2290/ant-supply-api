# API pricing build state

Updated: 2026-09-09.

## Current position

- Worktree: `/Users/jimcollinson/code/developers/.worktrees/api-pricing`; branch `feat/pricing-publication-v1`; base `b8c5fb557049d0163b99c29f23708ec02ced7255`.
- Mode: attended. Jim explicitly approved building the complete pricing feature and supply-preservation checks on isolated branches, with no deployment, activation, existing supply-calculation change or new cost.
- Coordination plan: Developers worktree `planning/pricing-launch-plan.md`; current task is work unit1, the production contract and supply safety baseline.
- Scope now: minimal repo-local ADR bootstrap with all new records Proposed, supply-contract tests, a read-only feature-branch/PR CI lane and the same checks before existing deployment. No pricing route implementation yet; it follows the baseline and contract.
- Local output now present: two Proposed ADRs and standard files/validator, pricing HTTP contract,139offline supply tests, read-onlyCI and pre-deploy tests/governance. Orchestrator reran139tests and protected-source comparisons successfully. Added full checkout history for the best-effort ADR checker. No existing Worker/legacy/config/package change, no commit/push/deploy. Independent unit1review pending; local governance output is not full validation of uncommitted records.
- Unit1 standard review now **passed** after Inventory's confirmation/resolution contract and account-attribution wording were clarified. API tests/mechanisms and unchanged supply behavior passed review. No API runtime change was made. Independent verification/commit/CI/adversarial/Craft remain next; coordinator evidence is Developers `planning/reviews/pricing-launch-01-code-review.md`.
- Unit1 independent verifier now **passed12/12**, including139tests against this unchanged Worker and protected-file comparisons. All new ADRs remain Proposed. Next: coordinated local commit/read-only branch CI, then adversarial/Craft; no deployment or pricing activation.
- Preserve existing supply logic, wallet list, provider fallback, caches, response formats, methods/errors/preflight and health. Root may later gain additive discovery content; no hosting/DNS changes or Vercel cleanup.
- No cloud resource, secret or namespace binding ID has been created/configured. Do not guess an ID, reuse deployment credentials for publishing, or claim account-scoped KV tokens are namespace-limited.
- Do not open a partial PR. The final package is coordinated with Inventory and Developers for one owner/Hermes review; actual PR/merge/production actions remain checkpoints.

## Baseline evidence

Node22.22.3 directly imported the unchanged Worker and observed total-supply GET200 with bare1200000000, OPTIONS200 with empty body, HEAD405 with Method not allowed. This was a small read-only baseline, not a complete suite. Its typeless-module warning was not suppressed by changing package behavior. No provider request or production change occurred.

## Gates

- Code/verifier/adversarial/Craft for the new work: pending, no waiver.
- No project `.gsd/gate.sh`; no gate is to be generated during execution.
- CI additions are explicitly in this approved mechanism work unit; preserve the existing deployment target/events/credentials and never deploy from the new feature-branch CI lane.
- ADR acceptance is human-only. Keep all new records Proposed and preserve original project files outside the approved scope.
