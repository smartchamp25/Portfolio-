# Theatre Journey Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the one-page portfolio into a theatre journey: a curtain intro with an opening line, looping music, five routed scenes joined by a lights-down/spotlight-up change, act lines with surtitles, and an arming lotus.

**Architecture:** A new `src/theatre/` module holds the journey: a scene registry, storage helpers, media discovery through `import.meta.glob` (so voice, music and curtain files are optional at build time), and three React providers (sound, surtitles, stage lights). `react-router-dom` routes each scene; `Stage` reacts to route changes (title, canonical link, focus, act line). The existing section components become scenes almost unchanged.

**Tech Stack:** React 19, TypeScript 6, Vite 8, react-router-dom 7, Vitest 4 + Testing Library (jsdom), Fourth Act design system, lucide-react, ffmpeg (media encoding only, not a dependency).

**Spec:** `docs/superpowers/specs/2026-10-23-theatre-journey-design.md`

## Global Constraints

- All work on branch `theatre-journey`, created from `main`. Never commit to `main`; merge only after Marwan's curtain video and music are in.
- Commit messages carry no Claude attribution of any kind (no `Co-Authored-By: Claude`, no "Generated with Claude Code").
- Every commit passes the pre-commit hook (ESLint + Prettier via lint-staged); never use `--no-verify`. `npm run lint`, `npm run typecheck` and `npx vitest run` pass at the end of every task.
- Piper voice files never enter git: `src/assets/voice/` is git-ignored. Builds without voice files show surtitles only.
- Lighthouse accessibility stays 100; CLS stays ≤ 0.1 (target 0) on a throttled phone; on a direct link main content appears in under 2.5 s on a throttled phone.
- New CSS uses Fourth Act tokens (`var(--…)` from `src/styles/tokens.css`), no raw hex.
- The intro is always dark: wrap it in an element with `data-theme="dark"` (tokens.css scopes dark tokens to that attribute).
- Any change under `src/components/fourth-act/` is listed in the task and in Task 10's report for Marwan (those files are generated from the design system; known so far: SkillCard `role="img"` from earlier work).
- Routes: `/` prologue, `/about`, `/skills`, `/projects`, `/contact`; anything else redirects to `/`.
- Timings and levels: lights down 350 ms, spotlight up 650 ms, reduced-motion crossfade 150 ms total; music volume 0.35, ducked 0.12 while a line plays, music fade-in 2000 ms; surtitle lingers 1000 ms after its voice ends, or shows 3500 ms when there is no voice; lotus arms 60° over 1500 ms, shown at 96 px.
- Storage keys: sessionStorage `theatre:curtain-seen` = `"1"`, `theatre:line:<lineId>` = `"1"`; localStorage `theatre:sound` = `"on"` | `"off"`. All storage access is wrapped in try/catch.
- Exact copy: buttons "Take your seat", "Enter without sound", "Skip intro", "Next act →", "Back to the beginning", "Next: Act I"; sound toggle labels "Turn sound on" / "Turn sound off".
- Line texts (exact): curtain "And now… the curtain rises." · about "Every masterpiece… begins with a single stroke." · skills "Each instrument… chosen with care." · projects "Behold. The work… speaks for itself." · contact "Every performance… deserves an encore."
- Site address lives in one constant, `SITE_URL = 'https://yourportfolio.vercel.app'` (placeholder until Marwan supplies the live domain).

## Review Focus

- Rapid repeated navigation (double-clicking an act link, holding an arrow key mid-transition) must run one transition and land on the first requested scene, never queue or flicker. Test in Task 4.
- Browser back/forward (popstate) must render the right scene, set its title and play its line once, without a lights transition. Test in Task 4.
- Storage that throws (private mode, blocked site data) must not crash: the curtain shows each load, lines may repeat, sound preference defaults to none. Test in Task 1.
- `audio.play()` rejecting (autoplay refusal, 404, decode error) must not raise an unhandled rejection or block the surtitle, and `soundOn` must stay as the visitor set it. Test in Task 5 and Task 6.
- The tab going hidden while music or a line plays must pause all audio and, on return, resume only the music and only if sound is on. Test in Task 5.

---

### Task 1: Branch, scene registry, storage and reduced-motion hook

**Files:**

- Create: `src/theatre/scenes.ts`, `src/theatre/storage.ts`, `src/hooks/usePrefersReducedMotion.ts`
- Modify: `src/hooks/index.ts` (export the new hook), `src/constants/index.ts` (add `SITE_URL`), `.gitignore` (add `src/assets/voice/`)
- Test: `src/test/__tests__/scenes.test.ts`, `src/test/__tests__/storage.test.ts`, `src/test/__tests__/usePrefersReducedMotion.test.tsx`

**Interfaces:**

- Produces (`src/theatre/scenes.ts`):
  - `type SceneId = 'prologue' | 'about' | 'skills' | 'projects' | 'contact'`
  - `type LineId = 'curtain' | 'about' | 'skills' | 'projects' | 'contact'`
  - `interface Scene { id: SceneId; path: string; label: string; act?: 'I' | 'II' | 'III' | 'IV'; title: string; headingId: string; line?: LineId }`
  - `const SCENES: readonly Scene[]` in order prologue, about, skills, projects, contact, with paths from Global Constraints, labels `'Prologue' | 'About' | 'Skills' | 'Projects' | 'Contact'`, headingIds `prologue-name`, `about-title`, `skills-title`, `projects-title`, `contact-title`, `line` equal to the id for the four acts (none for prologue), titles `'Marwan - Frontend Developer | Portfolio'`, `'Act I · About | Marwan'`, `'Act II · Skills | Marwan'`, `'Act III · Projects | Marwan'`, `'Act IV · Contact | Marwan'`
  - `sceneForPath(pathname: string): Scene` (trailing slash tolerated; unknown → prologue)
  - `nextScene(id: SceneId): Scene | undefined`, `previousScene(id: SceneId): Scene | undefined`
- Produces (`src/theatre/storage.ts`): `hasSeenCurtain(): boolean`, `markCurtainSeen(): void`, `hasPlayedLine(id: LineId): boolean`, `markLinePlayed(id: LineId): void`, `type SoundPreference = 'on' | 'off'`, `getSoundPreference(): SoundPreference | null`, `setSoundPreference(p: SoundPreference): void`
- Produces: `usePrefersReducedMotion(): boolean` (tracks `(prefers-reduced-motion: reduce)` and its `change` event)
- Produces: `SITE_URL` in `src/constants/index.ts`

- [x] **Step 1: Create the branch and commit the approved design and this plan**

```bash
git switch -c theatre-journey main
git add docs/superpowers/specs/2026-10-23-theatre-journey-design.md docs/superpowers/plans/2026-10-23-theatre-journey.md
git commit -m "Add theatre journey design and build plan"
```

- [ ] **Step 2: Write the failing tests**

`scenes.test.ts`:

- `it('lists the five scenes in journey order')` → `SCENES.map(s => s.path)` equals `['/', '/about', '/skills', '/projects', '/contact']`.
- `it('finds a scene by path, tolerating a trailing slash')` → `sceneForPath('/projects').id === 'projects'`, `sceneForPath('/skills/').id === 'skills'`.
- `it('falls back to the prologue for unknown paths')` → `sceneForPath('/nope').id === 'prologue'`.
- `it('steps forward and back')` → `nextScene('prologue')?.id === 'about'`, `nextScene('contact') === undefined`, `previousScene('about')?.id === 'prologue'`, `previousScene('prologue') === undefined`.
- `it('gives each act a line and heading')` → about has `line: 'about'`, `headingId: 'about-title'`, `act: 'II'` belongs to skills, prologue has no `line`.

`storage.test.ts` (clear both storages in `beforeEach`):

- `it('remembers the curtain for the session')` → false, then `markCurtainSeen()`, then true; `sessionStorage.getItem('theatre:curtain-seen') === '1'`.
- `it('tracks played lines per id')` → `markLinePlayed('about')`; `hasPlayedLine('about') === true`, `hasPlayedLine('skills') === false`.
- `it('stores the sound preference')` → `getSoundPreference() === null`; after `setSoundPreference('off')` returns `'off'`; `localStorage.getItem('theatre:sound') === 'off'`.
- `it('survives storage that throws')` → `vi.spyOn(Storage.prototype, 'getItem')` and `'setItem'` throw; every function returns its default (`false`, `null`) and no call throws.

`usePrefersReducedMotion.test.tsx`:

- `it('reads the media query and follows changes')` → mock `window.matchMedia` returning an object with `matches: true` and `addEventListener` capturing the listener; `renderHook` returns `true`; invoking the captured listener with `{ matches: false }` inside `act` makes it `false`.

- [ ] **Step 3: Run the tests to verify they fail**

Run: `npx vitest run src/test/__tests__/scenes.test.ts src/test/__tests__/storage.test.ts src/test/__tests__/usePrefersReducedMotion.test.tsx`
Expected: FAIL, modules not found.

- [ ] **Step 4: Implement the three modules, `SITE_URL`, the hook export, and add `src/assets/voice/` to `.gitignore`**

- [ ] **Step 5: Run the tests, lint and typecheck**

Run: `npx vitest run && npm run lint && npm run typecheck`
Expected: all pass.

- [ ] **Step 6: Commit**

```bash
git add src/theatre src/hooks src/constants/index.ts .gitignore src/test/__tests__/scenes.test.ts src/test/__tests__/storage.test.ts src/test/__tests__/usePrefersReducedMotion.test.tsx
git commit -m "Add scene registry, journey storage and reduced-motion hook"
```

---

### Task 2: Routed scenes, navigation, titles and canonical links

**Files:**

- Create: `src/theatre/Stage.tsx`, `vercel.json`, `src/test/__tests__/App.test.tsx`
- Modify: `src/main.tsx` (wrap `App` in `BrowserRouter`), `src/App.tsx`, `src/components/layout/Navigation.tsx`, `src/components/fourth-act/index.tsx` (NavBar: optional `href` on `NavItem`, optional `brandHref` on `NavBarProps`; defaults stay `'#' + id` and `'#prologue'`), `src/hooks/useScroll.ts` (drop section tracking, keep `scrolled`), `src/hooks/index.ts`, `src/constants/index.ts` (remove `SECTIONS`, `SECTION_IDS`, `SectionId`), `public/sitemap.xml`, `src/test/__tests__/Navigation.test.tsx`
- Delete: `src/hooks/useScrollToSection.ts`

**Interfaces:**

- Consumes: `SCENES`, `sceneForPath`, `SceneId`, `Scene` (Task 1), `SITE_URL`.
- Produces: `Navigation` props `{ active: SceneId; onNavigate: (id: SceneId) => void; scrolled: boolean; intro?: boolean }` (`intro` dims the bar and hides the toggles; used in Task 7).
- Produces: `Stage` (`src/theatre/Stage.tsx`) props `{ onNavigate: (id: SceneId) => void }`; renders `<Routes>` with one route per scene plus `*` → `<Navigate to="/" replace />`; on location change sets `document.title` to the scene's `title` and the `link[rel="canonical"]` href to `SITE_URL + scene.path` (`/` for the prologue).
- Produces: `useStageNavigate(): (id: SceneId) => void` exported from `Stage.tsx`, a plain `navigate(scene.path)` for now (Task 4 replaces its body with the lights transition; the signature stays).
- Fourth Act change to list for Marwan: NavBar `NavItem.href?`, `NavBarProps.brandHref?`.

- [ ] **Step 1: Write the failing tests**

`App.test.tsx` renders `<App />` inside `MemoryRouter` with `initialEntries` and the existing `ThemeProvider`; App mounts its own theatre providers as later tasks add them, so the test wrapper never changes. Seed `sessionStorage['theatre:curtain-seen'] = '1'` in `beforeEach` so the curtain (Task 7) stays out of these tests.

- `it('opens a direct link on its scene')` → at `/projects`, `getByRole('heading', { level: 2, name: /curtain call/ })` exists and no `#about` section is rendered.
- `it('renders exactly one scene at a time')` → at `/skills`, `container.querySelectorAll('main section').length === 1`.
- `it('redirects unknown addresses to the prologue')` → at `/nope`, `getByRole('heading', { level: 1, name: /Marwan/ })` exists.
- `it('sets the page title per scene')` → at `/about`, `document.title === 'Act I · About | Marwan'`.
- `it('points the canonical link at the scene')` → before render append `<link rel="canonical" href="x">` to `document.head`; at `/contact` its `href` is `'https://yourportfolio.vercel.app/contact'`.
- `it('navigates when an act link is clicked')` → at `/`, click link `Skills`; `getByRole('heading', { name: /reach/ })` appears.

`Navigation.test.tsx`: update props to `{ active: 'prologue', onNavigate: vi.fn(), scrolled: false }`; replace the scroll test with `it('calls onNavigate with the scene id')` (click `About` → `onNavigate('about')`); `it('links acts to their addresses')` → `getByRole('link', { name: 'About' })` has `href="/about"`, brand link has `href="/"`; `it('marks the current scene')` with `active="about"`; add `it('hides the toggles and dims during the intro')` → with `intro`, no button matching `/Switch to/`, and `.site-header--intro` present.

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run src/test/__tests__/App.test.tsx src/test/__tests__/Navigation.test.tsx`
Expected: FAIL (no router, old props).

- [ ] **Step 3: Implement routing**

`main.tsx`: wrap in `BrowserRouter`. `App.tsx`: render `Navigation`, `<main id="main"><Stage …/></main>`, `Footer`; the active scene comes from `sceneForPath(useLocation().pathname)`; scenes get the same data props as today. `Prologue` keeps its current props in this task (its `scrollToSection` becomes `(id) => go(id as SceneId)`; Task 3 renames it). `Navigation` builds items from the four act scenes with `href: scene.path`, passes `brandHref="/"`, maps `onNavigate` and closes the mobile menu. `vercel.json`: `{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }`. `public/sitemap.xml`: five `<url>` entries on the placeholder domain, `lastmod` `2026-10-23`. Remove the scroll-spy, `useScrollToSection` and the section constants.

- [ ] **Step 4: Run all tests, lint, typecheck and build**

Run: `npx vitest run && npm run lint && npm run typecheck && npm run build`
Expected: all pass.

- [ ] **Step 5: Check in the browser**

Start the dev server; open `/about` directly, click through the four act links and the brand, and reload on `/projects`. Expected: one scene shown at a time, title changes, reload keeps the scene.

- [ ] **Step 6: Commit**

```bash
git add -A src public/sitemap.xml vercel.json
git commit -m "Route each act as its own scene"
```

---

### Task 3: Next act, Prologue calls to action and arrow keys

**Files:**

- Create: `src/theatre/NextAct.tsx`, `src/theatre/NextAct.css`, `src/theatre/useActKeys.ts`, `src/test/__tests__/NextAct.test.tsx`, `src/test/__tests__/useActKeys.test.tsx`, `src/test/__tests__/Prologue.test.tsx`
- Modify: `src/components/sections/Prologue.tsx` (+ `Prologue.css` for the cue), `src/theatre/Stage.tsx` (render `NextAct` after the scene; mount `useActKeys`)

**Interfaces:**

- Consumes: `nextScene`, `previousScene`, `SceneId`, `useStageNavigate` (Task 2).
- Produces: `NextAct({ current: SceneId, onNavigate: (id: SceneId) => void })`: a Fourth Act `Button` (ghost, `href` of the target path, click prevents default and calls `onNavigate`), label "Next act →" (arrow via `iconEnd`), or "Back to the beginning" on the last scene, targeting the prologue.
- Produces: `useActKeys(current: SceneId, onNavigate: (id: SceneId) => void): void`
- Produces: `Prologue` props `{ onNavigate: (id: SceneId) => void }` (replaces `scrollToSection`).

- [ ] **Step 1: Write the failing tests**

`NextAct.test.tsx`:

- `it('offers the next act')` → `current="about"`: link named /Next act/ has `href="/skills"`; click → `onNavigate('skills')`.
- `it('returns to the beginning after the last act')` → `current="contact"`: link named "Back to the beginning" has `href="/"`; click → `onNavigate('prologue')`.

`useActKeys.test.tsx` (render a host component using the hook):

- `it('moves with the arrow keys')` → on `about`, `keydown` ArrowRight → `onNavigate('skills')`; ArrowLeft → `onNavigate('prologue')`.
- `it('stops at either end')` → ArrowLeft on `prologue` and ArrowRight on `contact` never call `onNavigate`.
- `it('ignores typing and modifier keys')` → keydown from a focused `<input>`, and ArrowRight with `ctrlKey`, `altKey`, `metaKey` or `shiftKey`, never call it.

`Prologue.test.tsx`:

- `it('sends "View the work" to the projects')` → link "View the work" has `href="/projects"`; click → `onNavigate('projects')`.
- `it('leads into Act I')` → button "Next: Act I" click → `onNavigate('about')`; no element with text "Scroll".

- [ ] **Step 2: Run them to verify they fail**

Run: `npx vitest run src/test/__tests__/NextAct.test.tsx src/test/__tests__/useActKeys.test.tsx src/test/__tests__/Prologue.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implement `NextAct`, `useActKeys` (window `keydown`; ignore when `event.target` is an input, textarea, select or contentEditable) and the Prologue changes; wire them in `Stage`**

- [ ] **Step 4: Run all tests, lint and typecheck**

Run: `npx vitest run && npm run lint && npm run typecheck`
Expected: all pass.

- [ ] **Step 5: Commit**

```bash
git add src
git commit -m "Add next-act button, arrow keys and Prologue links"
```

---

### Task 4: Stage lights between scenes

**Files:**

- Create: `src/theatre/lights.tsx`, `src/theatre/lights.css`, `src/test/__tests__/lights.test.tsx`
- Modify: `src/theatre/Stage.tsx` (`useStageNavigate` delegates to `useGoToScene`; heading focus after in-app navigation), `src/App.tsx` (wrap in `LightsProvider`, render `StageLights`)

**Interfaces:**

- Consumes: `SCENES`, `SceneId`, `usePrefersReducedMotion` (Task 1).
- Produces: `LIGHTS_DOWN_MS = 350`, `SPOTLIGHT_UP_MS = 650`, `REDUCED_FADE_MS = 150`; `type LightsPhase = 'idle' | 'down' | 'up'`; `LightsProvider({ children })`; `useGoToScene(): (id: SceneId) => void`; `useLightsPhase(): LightsPhase`; `StageLights()` renders `<div className={'stage-lights stage-lights--' + phase} aria-hidden="true" />`.
- Behaviour: `goTo(id)` is a no-op when `id` is the current scene or a transition is running. Otherwise: phase `down` for 350 ms → `navigate(path)` and `window.scrollTo(0, 0)` → phase `up` for 650 ms → `idle`. With reduced motion the two phases take 75 ms each. After an in-app navigation, Stage focuses `#${scene.headingId}` once phase `up` begins, first setting `tabindex="-1"` on that element in the DOM (no design-system change, since `ActHeading` has no `tabIndex` prop); it does not move focus on the first page load or on back/forward.
- Visuals (`lights.css`): fixed full-screen layer above content, below the nav. `down`: `var(--void)` fading to opaque. `up`: a `radial-gradient` mask whose transparent centre grows from 0 to beyond the viewport corners (`mask-size` animated), so the spotlight opens from the centre. Reduced motion: plain opacity fade.

- [ ] **Step 1: Write the failing tests** (`vi.useFakeTimers()`, render inside `MemoryRouter` + `LightsProvider` with a probe showing `useLocation().pathname` and `useLightsPhase()`):
- `it('dims, changes scene, then opens the spotlight')` → `goTo('about')`; phase `down` and path `/`; advance 350 ms → path `/about`, phase `up`; advance 650 ms → phase `idle`.
- `it('ignores repeated requests mid-transition')` → `goTo('about')`, advance 100 ms, `goTo('skills')`; after 1000 ms path is `/about`.
- `it('does nothing for the current scene')` → at `/about`, `goTo('about')` leaves phase `idle`.
- `it('uses a quick fade when motion is reduced')` → matchMedia `matches: true`; path changes at 75 ms, phase `idle` at 150 ms.
- `it('focuses the new heading after navigating')` → with `App` at `/about`, click `Skills`, run timers → `document.activeElement.id === 'skills-title'`.
- `it('handles back and forward without the lights')` → `createMemoryRouter`/`MemoryRouter` with entries `['/about', '/skills']` at index 1; `navigate(-1)` → `/about` heading shown, `document.title === 'Act I · About | Marwan'`, phase stays `idle`.

- [ ] **Step 2: Run them to verify they fail**

Run: `npx vitest run src/test/__tests__/lights.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implement `lights.tsx`, `lights.css` and the Stage changes**

- [ ] **Step 4: Run all tests, lint and typecheck**

Run: `npx vitest run && npm run lint && npm run typecheck`
Expected: all pass.

- [ ] **Step 5: Check in the browser**

Click through the acts on a desktop and a 375 px viewport, and with "reduce motion" emulated. Expected: one-second dim and spotlight, no flash of the old scene after the swap, page starts at the top, reduced motion gives a short fade.

- [ ] **Step 6: Commit**

```bash
git add src
git commit -m "Change scenes with lights down and a spotlight"
```

---

### Task 5: Sound system and sound toggle

**Files:**

- Create: `src/theatre/media.ts`, `src/theatre/sound.tsx`, `src/theatre/SoundToggle.tsx`, `src/test/__tests__/media.test.ts`, `src/test/__tests__/sound.test.tsx`
- Modify: `src/App.tsx` (wrap in `SoundProvider`), `src/components/layout/Navigation.tsx` (actions: `SoundToggle` then `ThemeToggle`), `src/test/setup.ts` (stub `HTMLMediaElement.prototype.play` to resolve and `pause` to no-op)

**Interfaces:**

- Produces (`media.ts`): `pickFile(files: Record<string, string>, name: string): string | undefined` (matches a path whose basename without extension equals `name`); `voiceUrl(id: LineId): string | undefined` over `import.meta.glob('/src/assets/voice/*.mp3', { eager: true, query: '?url', import: 'default' })`; `musicUrl: string | undefined` (first file of `/src/assets/music/*.mp3`); `curtainVideo: { src: string; poster?: string } | undefined` (`/src/assets/curtain/curtain.mp4`, poster `curtain-poster.webp`).
- Produces (`sound.tsx`): `MUSIC_VOLUME = 0.35`, `MUSIC_DUCKED = 0.12`, `MUSIC_FADE_MS = 2000`; `SoundProvider({ children, musicSrc = musicUrl })`; `useSound(): { soundOn: boolean; setSoundOn(on: boolean): void; startMusic(): void; playVoice(url: string): Promise<number | null> }`.
- Behaviour: `soundOn` starts `false` on every load. `setSoundOn(on)` also calls `setSoundPreference`; turning on plays the music if `startMusic()` has been called (the stage is open); turning off pauses music and any voice. `startMusic()` records that the stage is open and the music is wanted; with sound on and a `musicSrc` it creates a looping `Audio` (once), plays it and ramps volume 0 → 0.35 over 2000 ms; with sound off it waits for `setSoundOn(true)`; without `musicSrc` it does nothing. `playVoice(url)` returns `null` when sound is off or `play()` rejects; otherwise ducks music to 0.12 while the voice plays, restores 0.35 on `ended`, and resolves with the voice duration in ms. `visibilitychange` to hidden pauses everything; back to visible resumes only the music and only if `soundOn`.
- Produces: `SoundToggle()`: `IconButton size="sm"` with lucide `Volume2` / `VolumeX`, label "Turn sound off" / "Turn sound on".

- [ ] **Step 1: Write the failing tests**

`media.test.ts`:

- `it('picks a file by basename')` → `pickFile({ '/src/assets/voice/about.mp3': '/a.mp3' }, 'about') === '/a.mp3'`; `pickFile({}, 'about') === undefined`; `pickFile({ '/x/about-2.mp3': 'y' }, 'about') === undefined`.

`sound.test.tsx` (fake timers; spy on `HTMLMediaElement.prototype.play`/`pause`):

- `it('stays silent until sound is turned on, then starts the music')` → `startMusic()` with `musicSrc="/m.mp3"` → `play` not called; then `setSoundOn(true)` → `play` called once.
- `it('fades the music in')` → `setSoundOn(true)`, `startMusic()` → `play` called once, element `loop === true`; after 2000 ms volume is `0.35`.
- `it('ducks the music while a voice plays')` → during `playVoice('/v.mp3')` music volume `0.12`; dispatch `ended` on the voice → `0.35`.
- `it('reports no voice when sound is off or playback fails')` → sound off → `playVoice` resolves `null`; sound on with `play` rejecting → resolves `null`, no unhandled rejection, `soundOn` still `true`.
- `it('pauses when the tab is hidden and resumes only the music')` → set `document.visibilityState` to `hidden`, dispatch `visibilitychange` → `pause` called; back to `visible` → music `play` called again, voice not.
- `it('skips music when there is no file')` → `musicSrc` undefined, `startMusic()` → no throw, `play` not called.
- `it('toggles from the top bar')` → render `SoundToggle` in the provider; button "Turn sound on" → click → button "Turn sound off"; `localStorage['theatre:sound'] === 'on'`.

- [ ] **Step 2: Run them to verify they fail**

Run: `npx vitest run src/test/__tests__/media.test.ts src/test/__tests__/sound.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implement `media.ts`, `sound.tsx`, `SoundToggle.tsx`, the setup stubs and the Navigation actions**

- [ ] **Step 4: Run all tests, lint and typecheck**

Run: `npx vitest run && npm run lint && npm run typecheck`
Expected: all pass.

- [ ] **Step 5: Commit**

```bash
git add src
git commit -m "Add sound system with music, ducking and a sound toggle"
```

---

### Task 6: Act lines and surtitles

**Files:**

- Create: `src/theatre/lines.ts`, `src/theatre/surtitles.tsx`, `src/theatre/surtitles.css`, `src/theatre/useLine.ts`, `src/test/__tests__/surtitles.test.tsx`, `src/test/__tests__/useLine.test.tsx`
- Modify: `src/App.tsx` (wrap in `SurtitleProvider`, render `Surtitles`), `src/theatre/Stage.tsx` (play the scene's line on entry)

**Interfaces:**

- Consumes: `LineId`, `hasPlayedLine`, `markLinePlayed` (Task 1); `useSound().playVoice`, `voiceUrl` (Task 5); `useLightsPhase` (Task 4).
- Produces: `LINES: Record<LineId, string>` with the exact texts from Global Constraints.
- Produces: `SURTITLE_LINGER_MS = 1000`, `SURTITLE_READ_MS = 3500`; `SurtitleProvider({ children })`; `useSurtitles(): { show(text: string, ms: number): void }`; `Surtitles()` renders a `div` with `aria-live="polite"` and class `surtitles` holding the current text (empty when none). Styled with `var(--font-display)`, italic, centred near the bottom of the viewport, above content, below the nav.
- Produces: `useLine(resolveVoice: (id: LineId) => string | undefined = voiceUrl): (id: LineId) => void`. Calling it for an already-played line does nothing. Otherwise it marks the line played, shows the text immediately, and if a voice URL exists and sound is on, plays it; the surtitle stays for the voice duration + 1000 ms, or 3500 ms when no voice played.
- Stage: when the scene changes (including the first load and back/forward), if the scene has a `line`, call the line when the lights phase is not `down` (immediately on first load or back/forward; at the start of `up` after an in-app move).

- [ ] **Step 1: Write the failing tests** (fake timers)

`surtitles.test.tsx`:

- `it('shows text in a live region and clears it')` → `show('Hello', 2000)`; `getByText('Hello')` inside `[aria-live="polite"]`; after 2000 ms the text is gone.

`useLine.test.tsx` (providers: Sound with no music, Surtitles):

- `it('shows the line once per session')` → call `say('about')` twice; text `LINES.about` shown once; `sessionStorage['theatre:line:about'] === '1'`.
- `it('shows a surtitle without sound')` → sound off, resolver returns `'/v.mp3'` → text visible, `play` not called, gone after 3500 ms.
- `it('plays the voice when sound is on')` → sound on → `play` called; text still visible right after the voice's `ended` and gone 1000 ms later.
- `it('falls back to text when the voice fails')` → sound on, `play` rejects → text visible, gone after 3500 ms, no unhandled rejection.
- `it('plays the act line on arrival')` → `App` at `/skills` (curtain seen) → `getByText(LINES.skills)`.
- `it('does not repeat a line on back and forward')` → `App` in `MemoryRouter` with entries `['/about', '/skills']` at index 0; run timers until the about line clears; go forward to `/skills` and back to `/about` via router history → `queryByText(LINES.about)` is null.

- [ ] **Step 2: Run them to verify they fail**

Run: `npx vitest run src/test/__tests__/surtitles.test.tsx src/test/__tests__/useLine.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implement `lines.ts`, `surtitles.tsx` + css, `useLine.ts` and the Stage wiring**

- [ ] **Step 4: Run all tests, lint and typecheck**

Run: `npx vitest run && npm run lint && npm run typecheck`
Expected: all pass.

- [ ] **Step 5: Commit**

```bash
git add src
git commit -m "Introduce each act with its line and a surtitle"
```

---

### Task 7: Curtain intro

**Files:**

- Create: `src/theatre/Curtain.tsx`, `src/theatre/Curtain.css`, `src/test/__tests__/Curtain.test.tsx`
- Modify: `src/App.tsx` (show the curtain on `/` when `!hasSeenCurtain()`, pass `intro` to `Navigation`), `src/components/layout/Navigation.tsx` (`intro` styles in `Navigation.css`: bar at reduced opacity, full on `:hover`/`:focus-within`, toggles hidden)

**Interfaces:**

- Consumes: `hasSeenCurtain`, `markCurtainSeen`, `getSoundPreference` (Task 1); `useSound` (Task 5); `useLine` (Task 6); `curtainVideo` (Task 5); `usePrefersReducedMotion` (Task 1).
- Produces: `CURTAIN_OPEN_MS = 3200`, `CURTAIN_FADE_MS = 600`; `Curtain({ onEnter(withSound: boolean): void; onSkip(): void; onOpened(): void; video?: { src: string; poster?: string } })`.
- Behaviour:
  - Phase `closed` shows the site name, "Take your seat" and "Enter without sound" (the one matching `getSoundPreference()` is `variant="primary"`; with no preference "Take your seat" is primary), and a quiet "Skip intro". The primary button is focused on mount. The whole curtain sits in a `data-theme="dark"` container, `position: fixed; inset: 0`, under the nav.
  - A choice calls `onEnter(withSound)` synchronously in the click handler, so App can turn sound on within the user gesture, then moves to `opening`. App's `onEnter` calls `setSoundOn`, `markCurtainSeen()` and the `curtain` line, and mounts the Prologue behind the curtain.
  - `opening` plays `video` (muted, `playsInline`) and waits for `ended`; without a video, or if `play()` rejects, it runs the code-drawn curtain: two velvet halves made with tokens (`--crimson`, `--crimson-soft`, `--void`) sliding and gathering outward over `CURTAIN_OPEN_MS`. Then it fades out over `CURTAIN_FADE_MS` and calls `onOpened()`, where App calls `startMusic()`.
  - With reduced motion, a choice goes straight to `onOpened()`, with no opening animation.
  - "Skip intro" calls `onSkip()`: App marks the curtain seen and shows the Prologue with sound off, without the curtain line.
  - Clicking an act link in the dimmed top bar during the curtain navigates directly (sound off), marks the curtain seen, and the curtain unmounts.
  - Whenever the stage opens without the curtain (direct link, "Skip intro", act link over the curtain), App calls `startMusic()` too, so turning sound on later starts the music at once.

- [ ] **Step 1: Write the failing tests** (fake timers; matchMedia `matches: false` unless stated)

`Curtain.test.tsx`:

- `it('offers both ways in and a skip')` → buttons "Take your seat", "Enter without sound", "Skip intro"; "Take your seat" has class `fa-btn--primary` and has focus.
- `it('makes the remembered choice primary')` → `localStorage['theatre:sound'] = 'off'` → "Enter without sound" has `fa-btn--primary`.
- `it('reports the choice, then opens')` → click "Take your seat" → `onEnter(true)`; without `video`, after 3200 + 600 ms `onOpened` called once.
- `it('opens straight away with reduced motion')` → matchMedia `matches: true`; click "Enter without sound" → `onEnter(false)` and `onOpened` called with no timers advanced.
- `it('skips')` → click "Skip intro" → `onSkip` called, `onEnter` not.
- `it('falls back to the drawn curtain when the video cannot play')` → `video={{ src: '/c.mp4' }}`, `play` rejects → after 3800 ms `onOpened` called.

`App.test.tsx` additions (do not pre-seed `theatre:curtain-seen` in these):

- `it('shows the curtain on a first visit to the home page')` → at `/`: "Take your seat" visible, `.site-header--intro` present.
- `it('skips the curtain on a direct link')` → at `/about`: no "Take your seat"; `sessionStorage` unchanged.
- `it('shows the curtain once per session')` → enter, run timers, re-render App at `/` → no curtain.
- `it('lets an act link bypass the intro')` → at `/`, click `Projects` in the top bar → projects heading shown, no curtain, sound toggle shows "Turn sound on".
- `it('starts the music when sound is turned on after a direct link')` → `App` at `/about` with a music file stubbed via `SoundProvider`'s `musicSrc` (render App's tree with the provider prop, or mock `musicUrl`), click "Turn sound on" → `play` called on the looping element.
- `it('plays the opening line on entry')` → click "Enter without sound" → `getByText(LINES.curtain)`.

- [ ] **Step 2: Run them to verify they fail**

Run: `npx vitest run src/test/__tests__/Curtain.test.tsx src/test/__tests__/App.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implement `Curtain.tsx`, `Curtain.css` and the App and Navigation wiring**

- [ ] **Step 4: Run all tests, lint, typecheck and build**

Run: `npx vitest run && npm run lint && npm run typecheck && npm run build`
Expected: all pass.

- [ ] **Step 5: Check in the browser**

Fresh session at `/`: take a seat, then reload (no curtain this session); new session, enter without sound; new session, Skip intro; new session, click "III Projects" over the curtain. Check light theme too (curtain stays dark) and a 375 px viewport.

- [ ] **Step 6: Commit**

```bash
git add src
git commit -m "Open the site with a curtain and the opening line"
```

---

### Task 8: The lotus trap

**Files:**

- Create: `src/assets/lotus/outer.webp`, `src/assets/lotus/inner.webp`, `src/assets/lotus/sphere.webp`, `src/components/ui/LotusTrap.tsx`, `src/components/ui/LotusTrap.css`, `src/test/__tests__/LotusTrap.test.tsx`
- Modify: `src/components/fourth-act/index.tsx` (Quote: optional `mark?: React.ReactNode`; when given it renders `<div className="fa-quote__mark" aria-hidden="true">{mark}</div>` in place of the drawn lotus), `src/components/sections/AboutSection.tsx` (pass `mark={<LotusTrap />}`)

**Interfaces:**

- Consumes: `usePrefersReducedMotion` (Task 1).
- Produces: `LOTUS_ARM_MS = 1500`, `LOTUS_TURN_DEG = 60`; `LotusTrap({ className?: string })`: a 96 px square `span.lotus-trap` stacking three `img` (`alt=""`, `decoding="async"`, `width`/`height` 96): outer, inner, sphere. It adds class `is-arming` the first time the element is 60% visible (IntersectionObserver, `threshold: 0.6`) and on `mouseenter` when not already arming; it removes the class on the inner layer's `animationend`. Reduced motion: never adds the class. CSS keyframes: outer `rotate(0)` → `rotate(-60deg)`, inner `rotate(0)` → `rotate(60deg)`, both `var(--ease-stage)` over 1500 ms; sphere static.
- Fourth Act change to list for Marwan: Quote `mark?`.

- [ ] **Step 1: Make the three layers**

From the scratchpad master `lotus/lotus-master-1024.png` (cut out from `C:\Users\G15 - 5511\Work\Marwan\m2a-100_top-down_view_of_an_ornate_metal_lotus_flower_trap_five_6d43b5c8-28c1-45be-961e-05230e922ec8.png`), adapt the scratchpad script `lotus_layers.py`. Inner-petal profile (radius, half-width) in master pixels around centre (512, 512): `(0,0) (40,75) (90,74) (140,70) (185,62) (230,46) (272,26) (312,0)`, mirrored and rotated to 90°, 150°, 210°, 270°, 330°, 30°. Sphere: circle radius 86. Inner layer = petals minus the sphere; sphere layer = the circle; outer layer = everything else, backed with `rgb(26, 12, 24)` under the full silhouette. Mask edges blurred 1.5 px. Export each at 288 × 288 WebP with alpha, quality 86. Expected: three files of roughly 5–15 KB; stacked, they reproduce the original.

- [ ] **Step 2: Write the failing tests**

`LotusTrap.test.tsx` (capture the IntersectionObserver callback via a `vi.fn` mock in the test):

- `it('stacks three decorative layers')` → three `img` with `alt=""`, container `.lotus-trap`.
- `it('arms when it comes into view')` → invoke the observer callback with `isIntersecting: true` → `.lotus-trap` has `is-arming`; dispatch `animationend` on the inner layer → class removed.
- `it('replays on hover')` → `mouseEnter` → `is-arming`.
- `it('stays still with reduced motion')` → matchMedia `matches: true`; intersect and hover → never `is-arming`.
- `it('replaces the drawn lotus in the quote')` → render `Quote` with `mark={<span data-testid="m" />}` → `getByTestId('m')` present, no `svg.fa-quote__lotus`.

- [ ] **Step 3: Run them to verify they fail**

Run: `npx vitest run src/test/__tests__/LotusTrap.test.tsx`
Expected: FAIL.

- [ ] **Step 4: Implement `LotusTrap`, its CSS, the Quote `mark` prop and the About wiring**

- [ ] **Step 5: Run all tests, lint and typecheck; check About in the browser on both themes**

Run: `npx vitest run && npm run lint && npm run typecheck`
Expected: all pass; in the browser the lotus arms once on arrival, replays on hover, and shows no seams on light or dark.

- [ ] **Step 6: Commit**

```bash
git add src
git commit -m "Arm a realistic lotus trap above the quote"
```

---

### Task 9: Media encoding script and local voice drafts

**Files:**

- Create: `scripts/encode-media.sh`
- Local only (git-ignored, never committed): `src/assets/voice/{curtain,about,skills,projects,contact}.mp3`

**Interfaces:**

- Produces: `scripts/encode-media.sh` (bash, requires `ffmpeg` and `ffprobe` on PATH) with three commands:
  - `voice <in-audio> <lineId>` → `src/assets/voice/<lineId>.mp3`: mono, `loudnorm=I=-16:TP=-1.5:LRA=11`, MP3 64 kbps.
  - `music <in-audio> [crossfadeSeconds=3]` → `src/assets/music/theatre-loop.mp3`: stereo, `loudnorm=I=-20:TP=-1.5`, MP3 128 kbps, loop point crossfaded by splitting the track into A = [0, L−N] and B = [L−N, L] and outputting `B` crossfaded into `A` (`acrossfade=d=N`), so the file's end flows into its start.
  - `curtain <in-video>` → `src/assets/curtain/curtain.mp4` (H.264, `scale=1280:-2`, no audio, `-movflags +faststart`; start at `-crf 28` and raise CRF until the file is at most 2 MB) and `src/assets/curtain/curtain-poster.webp` (first frame).
  - Each command prints the output path, size and duration.

- [ ] **Step 1: Confirm ffmpeg is installed**

Run: `ffmpeg -version | head -1 && ffprobe -version | head -1`
Expected: version lines for both (installed for this user with winget; a new shell may be needed for PATH).

- [ ] **Step 2: Write the script**

- [ ] **Step 3: Encode the Piper drafts**

Run `voice` for each scratchpad draft in `voice-drafts/theatre/`: `00-curtain.wav → curtain`, `01-about.wav → about`, `02-skills.wav → skills`, `03-projects.wav → projects`, `04-contact.wav → contact`.
Expected: five files, each mono MP3 ~64 kbps and under 50 KB (`ffprobe -show_streams`).

- [ ] **Step 4: Prove the music and curtain commands on throwaway inputs**

Generate a 20 s test tone (`ffmpeg -f lavfi -i sine=frequency=220:duration=20`) and a 5 s test video (`-f lavfi -i testsrc=size=1920x1080:duration=5`) in the scratchpad, run `music` and `curtain` on them, check the outputs with `ffprobe` (music duration ≈ 17 s, curtain ≤ 2 MB with a poster), then delete those outputs from `src/assets/music/` and `src/assets/curtain/`.

- [ ] **Step 5: Check the voice is local only, and that lines play**

Run: `git status --short src/assets` → no voice files listed. In the browser with sound on, the act lines play with surtitles.

- [ ] **Step 6: Commit**

```bash
git add scripts/encode-media.sh
git commit -m "Add media encoding script for voice, music and curtain"
```

---

### Task 10: Whole-journey verification and hand-off

**Files:**

- None created; fixes go to the task they belong to, as new commits.

- [ ] **Step 1: Full checks**

Run: `npx vitest run && npm run lint && npm run typecheck && npm run build`
Expected: all pass.

- [ ] **Step 2: Lighthouse and layout shift on the production build**

Serve the build (`npx vite preview`), then run Lighthouse (mobile) on `/` and `/projects`, and a throttled-phone performance trace (Fast 4G, 4× CPU) on `/projects` and on `/` through the curtain.
Expected: accessibility 100 on both; CLS ≤ 0.1; main content on `/projects` under 2.5 s.

- [ ] **Step 3: Walk the journey in the browser**

Desktop and 375 px, dark and light, sound on and off, reduced motion on and off: curtain → Prologue → each act by link, button and arrow keys → back/forward → reload on an act → direct link. Expected: every Global Constraint holds; screenshots of the curtain, a transition mid-way, a surtitle, and the lotus.

- [ ] **Step 4: Report to Marwan**

List: the Fourth Act changes to copy into the design system's source (SkillCard `role="img"`, NavBar `href`/`brandHref`, Quote `mark`); that the branch is ready for his curtain video and music, which run through `scripts/encode-media.sh curtain …` and `music …`; that the live domain and final voice are still pending. Ask before pushing the branch to GitHub (the repo is public). The merge into `main` waits for the curtain video and music.
