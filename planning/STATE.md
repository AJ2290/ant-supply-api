# API pricing build state

Updated: 2026-09-09.

## Current position

- Worktree: `/Users/jimcollinson/code/developers/.worktrees/api-pricing`; branch `feat/pricing-publication-v1`; base `b8c5fb557049d0163b99c29f23708ec02ced7255`.
- Mode: attended. Jim explicitly approved building the complete pricing feature and supply-preservation checks on isolated branches, with no deployment, activation, existing supply-calculation change or new cost.
- Coordination plan: Developers worktree `planning/pricing-launch-plan.md`; work unit1 (contract/supply safety baseline) is complete. No pricing route implementation yet; coordinator proceeds to unit2collection/evidence before the later API reader work.
- Unit1 committed/pushed head: `68a7e3decfc1bc2e00d48d4c0c77a9200f98d2b9`. [CI34391398044](https://github.com/WithAutonomi/api/actions/runs/34391398044) passed139tests and ADR checks. This was the read-only feature CI lane, not deployment. Existing Worker/legacy/runtime config/package/supply behavior remains unchanged.
- Unit1 reviews: standard **passed**, verifier **12/12passed**, adversarial **READY-WITH-NITS** (stale handoff LOW corrected by current checkpoint), Craft **PASS/zero findings** after exact-diff inspection. Same-provider independence is weaker. All new ADRs remain Proposed. Coordinator checkpoint: Developers `planning/reviews/pricing-launch-01.md`, with all three exact candidate/CI records.
- Preserve existing supply logic, wallet list, provider fallback, caches, response formats, methods/errors/preflight and health. Root may later gain additive discovery content; no hosting/DNS changes or Vercel cleanup.
- No cloud resource, secret or namespace binding ID has been created/configured. Do not guess an ID, reuse deployment credentials for publishing, or claim account-scoped KV tokens are namespace-limited.
- Do not open a partial PR. The final package is coordinated with Inventory and Developers for one owner/Hermes review; actual PR/merge/production actions remain checkpoints.

## Baseline evidence

Node22.22.3 directly imported the unchanged Worker and observed total-supply GET200 with bare1200000000, OPTIONS200 with empty body, HEAD405 with Method not allowed. This was a small read-only baseline, not a complete suite. Its typeless-module warning was not suppressed by changing package behavior. No provider request or production change occurred.

## Gates

- Unit1code/verifier/adversarial/Craft and exact-candidate CI complete; no waiver. Later runtime units need their own reviews. Integrated clean-context remains required; no full feature/PR/production readiness claim.
- No project `.gsd/gate.sh`; no gate is to be generated during execution.
- CI additions are explicitly in this approved mechanism work unit; preserve the existing deployment target/events/credentials and never deploy from the new feature-branch CI lane.
- ADR acceptance is human-only. Keep all new records Proposed and preserve original project files outside the approved scope.
