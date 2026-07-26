# Spec Template — Plan-Execute Router

## Purpose

A spec that a cheaper model can execute mechanically without making architectural decisions. If the executor has to guess at any of the sections below, the plan is too thin — return to Phase 2 and revise.

## Required sections

Every spec produced by this skill's Phase 2 must contain all of the following. Do not proceed to Phase 3 with any section empty.

### 1. Feature description

One paragraph. What is being built. Written for someone who understands the codebase's domain but has not seen the specific feature request.

Bad: "Add auth."
Good: "Add JWT-based session authentication for the `/api/v1/*` endpoints. Sessions live 24 hours by default, refreshable via a rotating refresh token stored in an httpOnly cookie. Existing basic-auth support stays as a fallback until the migration deadline."

### 2. Files affected

Absolute or repo-relative paths to every file that will be created, modified, or deleted. For modifications, name the specific sections or functions being changed.

Bad: "Files in the auth module."
Good:
```
CREATE: src/auth/jwt-middleware.ts
CREATE: src/auth/refresh-token-store.ts
MODIFY: src/api/router.ts       (add middleware to /api/v1/* routes; keep basic-auth fallback)
MODIFY: src/api/logout.ts       (invalidate refresh token on logout)
CREATE: tests/auth/jwt-middleware.test.ts
CREATE: tests/auth/refresh-token-store.test.ts
```

### 3. Architectural approach

How the pieces fit together. Named design patterns where applicable. Which layers touch which. Dependencies between the new components.

Bad: "Use JWTs."
Good: "The `jwt-middleware` is an Express-style middleware that reads the `Authorization: Bearer <token>` header, verifies signature using the RS256 key in `AUTH_JWT_PUBLIC_KEY`, and attaches the decoded claims to `req.user`. On failure, it delegates to the existing basic-auth handler (backward compat). The `refresh-token-store` is a small Redis-backed key-value adapter (uses the shared Redis client at `src/lib/redis.ts`) that stores refresh tokens keyed by a rotating opaque ID, TTL 7 days. Refresh flow: POST `/api/v1/auth/refresh` accepts the refresh cookie, validates against the store, rotates it (new opaque ID, new TTL), and returns a fresh access JWT."

### 4. Ordered implementation steps

Numbered steps a mechanical executor can follow. Each step is small enough that its correctness can be evaluated on its own.

Example:
```
1. Add JWT dependencies to package.json: `jsonwebtoken`, `@types/jsonwebtoken`.
2. Create `src/auth/jwt-middleware.ts` implementing the middleware described in Section 3.
3. Create `src/auth/refresh-token-store.ts` implementing the Redis adapter described in Section 3.
4. Add the middleware to `src/api/router.ts` for `/api/v1/*` routes, preserving basic-auth fallback.
5. Add refresh endpoint POST `/api/v1/auth/refresh` in `src/api/auth.ts`.
6. Update `src/api/logout.ts` to invalidate the refresh token in the store.
7. Create test files with the coverage described in Section 5.
8. Run tests locally: `npm test tests/auth/`.
```

### 5. Constraints and edge cases

Everything that must not break. Every edge case that matters. Every non-obvious constraint the executor might miss.

Example:
```
- Basic-auth fallback must continue working for non-`/api/v1/*` routes.
- Refresh tokens must be rotated on every use (single-use pattern) to prevent replay.
- httpOnly cookies must set `SameSite=Strict` and `Secure` in production.
- Redis errors on the refresh store must NOT block the login path — degrade gracefully to "session expired" and prompt re-login.
- Existing session cookies from the pre-JWT system must be invalidated cleanly, not silently dropped.
```

### 6. Acceptance criteria

How to know the implementation is done and correct. Testable statements, ideally with the specific commands that verify each.

Example:
```
- `npm test tests/auth/` passes with 100% coverage on new files.
- `curl -H "Authorization: Bearer <valid-jwt>" http://localhost:3000/api/v1/users/me` returns 200.
- `curl -H "Authorization: Bearer <expired-jwt>" http://localhost:3000/api/v1/users/me` returns 401.
- `curl http://localhost:3000/api/v1/users/me` (no header) falls back to basic-auth.
- Refresh flow: valid refresh cookie → 200 with new access token; invalid → 401; single-use enforced (second attempt with same cookie → 401).
- Redis outage simulated: login still works, refresh fails gracefully to 503.
```

## Optional sections

Add these only when the task warrants them.

### Migration notes

If the task involves data or schema migration, name the migration script, the rollback procedure, and the deployment order.

### Performance considerations

If the task has performance implications (hot path, high-volume endpoint, memory-sensitive), state the target and how to measure it.

### Rollback plan

If the task is high-stakes enough that rollback matters, name what needs to be reverted and in what order.

## Anti-patterns in specs

- **Vague acceptance criteria** ("should work correctly") — replace with testable statements and specific commands.
- **Undefined names** (referring to a "helper" or "utility" without naming which file it lives in) — always name the file.
- **Missing constraints** — if you know a constraint matters and don't write it down, the executor will violate it. If you don't know whether it matters, name it as a question in Section 5.
- **Skipped sections** — every required section must have content. If a section genuinely doesn't apply, write "N/A" with a one-line reason, not empty.

## When to revise the spec

If Phase 3's executor:
- Asks for clarification → Section is too thin. Revise it in Section 3, 4, or 5.
- Makes an architectural decision the plan should have made → Section 3 was too abstract. Revise with the concrete decision.
- Produces something that fails Section 6 → Section 6 was incomplete or Section 4's steps were wrong.

Return to Phase 2, revise the spec, save as a new version (`<timestamp>-<slug>.v2.md`), and re-run Phase 3.
