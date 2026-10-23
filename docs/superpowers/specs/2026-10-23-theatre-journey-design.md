# Theatre journey: curtain intro, sound and acts as scenes

Date: 2026-10-23 · Owner: Marwan · Status: reviewed, awaiting approval

## Intent

Marwan wants the portfolio to feel alive, like walking into a theatre and
watching a performance, instead of a page that renders and then stands still.
The site already wears a theatre theme (the Fourth Act design system: Prologue,
Acts I–IV, curtain, stage, spotlight, lotus). This design turns that theme into
an experience: a curtain that opens with a spoken line, music that plays while
you stay, and a journey through the acts as separate scenes, each introduced
by its own line.

The portfolio exists to get Marwan hired as a frontend developer, so the
experience must also prove frontend skill (motion, audio, routing, polish)
without ever getting between a recruiter and the work.

## Goals

1. An opening ritual on the home address: closed curtain, a choice to enter
   with or without sound, the curtain opens while a voice says the opening
   line, then music begins and loops.
2. The site is a sequence of scenes (Prologue, Act I About, Act II Skills,
   Act III Projects, Act IV Contact) moved between with a theatrical lighting
   change, not a long scroll.
3. Each act is introduced once per visit by a spoken line with an on-screen
   surtitle.
4. Visitors who arrive by a direct link, or who are in a hurry, reach any act
   in a couple of seconds.
5. The site stays fast, accessible and stable: these numbers are claimed on
   the site itself or were just fixed, so they must hold.

## Non-goals

- Curtain closing and reopening between acts (too slow when repeated).
- Sideways "camera pan" across one wide stage.
- Swipe gestures on touch devices; buttons and the menu are enough.
- A volume slider; sound is on or off.
- 3D or WebGL scenes.
- Writing or recording the final voice and choosing the music. Marwan sources
  those; this design defines their slots and formats.

## Anti-goals (failure even if it technically works)

- A recruiter has to sit through the intro or hunt for the projects.
- Sound plays without the visitor choosing it.
- Lines repeat and nag when someone moves back and forth between acts.
- Transitions that feel slow, stutter, or make text hard to read.
- Motion that ignores a visitor's "reduce motion" setting.

## Constraints

- Build on what exists: React 19, TypeScript, Vite 8, the Fourth Act design
  system (`src/styles/tokens.css`, `src/components/fourth-act/`), and
  `react-router-dom` 7, which is already installed but unused.
- Keep both themes (dark default, light) working. The intro itself is always
  dark: it is a darkened theatre.
- Lighthouse accessibility must stay 100: the About stats claim
  "100 Lighthouse accessibility" (`src/Data/stats.ts`).
- Layout shift (CLS) stays at or near 0 on a throttled phone; it was just
  fixed from 0.39 by removing lazy-loaded sections. Main content on a direct
  link must still appear in under 2.5 s on a throttled phone.
- Lint, typecheck (`npm run typecheck`) and all tests pass; the pre-commit
  hook (lint-staged: ESLint and Prettier) must pass on every commit.
- Deployed on Vercel from GitHub `main`. Client-side routes need a rewrite to
  `index.html`.
- Delivery (decided by Marwan): build the whole journey on its own branch,
  `theatre-journey`. The live site on `main` stays as it is until Marwan's
  curtain video and music exist; then the branch is merged once. The GitHub
  repo is public, so anything committed, even on the branch, is published.
- Audio licensing: the draft voice (Piper "Ryan") is licensed CC BY-NC-SA,
  non-commercial, so it is a placeholder only. Decided by Marwan: the Piper
  files never enter the repo. They stay on Marwan's machine for local testing
  (their folder is git-ignored), and the site plays a line only when a voice
  file for it is present in the build. Until the final voice exists, every
  build from the repo, including the merged live site, shows surtitles only. Riot's own Jhin voice or League
  music may only be used if Marwan decides so, and then with the disclaimer
  Riot's fan-content policy requires, shown in the footer.

## The experience

### 1. Arrival (home address `/` only)

- A dark stage with the closed curtain filling the screen, the site name, and
  two choices: **"Take your seat"** (primary, enters with sound) and
  **"Enter without sound"** (quiet secondary). A small **"Skip intro"** link
  goes straight to the open stage with no curtain animation.
- Browsers forbid audio before a user gesture; the "Take your seat" click is
  that gesture.
- _Marwan's call (2026-10-24):_ no top bar while the curtain is up. It fades
  in once the curtain has fully opened, or at once after "Skip intro". A
  recruiter in a hurry uses "Skip intro" or a direct link to an act.
- _My call:_ the curtain plays once per browser session. Going back to `/`
  later in the same session (brand link, browser back) shows the Prologue
  directly.
- _My call:_ the chosen sound preference is remembered across visits. On a
  later visit the choice buttons still appear (a gesture is still needed), with
  the remembered choice as the primary button.

### 2. The opening

- After "Take your seat": the curtain video plays; the opening line
  _"And now… the curtain rises."_ plays in time with it and appears as a
  surtitle. When the curtain is fully open the site fades in on the Prologue
  (the current hero), and the music fades in over about 2 seconds and loops.
- After "Enter without sound": the same curtain video plays silently, and the
  surtitle still appears.
- A sound toggle (speaker icon, Fourth Act `IconButton`) stays in the top bar
  next to the theme toggle on every scene, including after a direct link.

### 3. Scenes and moving between them

- Each act is its own scene and address: `/` Prologue, `/about`, `/skills`,
  `/projects`, `/contact`. The existing section components keep their content
  and become the scenes. Unknown addresses go to `/`.
- Ways to move: the act links in the top bar (I · II · III · IV, already in
  the design system's `NavBar`), a **"Next act →"** button at the end of each
  scene (the last one becomes "Back to the beginning"), and the left and right
  arrow keys (ignored while typing in a field or with modifier keys held).
  The Prologue's "View the work" goes to `/projects`; its scroll cue becomes
  "Next: Act I".
- The lighting change, about one second in total: the current scene dims to
  black (about 350 ms), the new scene is swapped in at its top, then a
  spotlight opens from the centre and widens to reveal it (about 650 ms). The
  act's line and surtitle start as the light rises.
- A scene taller than the screen (Projects) scrolls within itself. The
  existing fade-up reveals inside scenes stay.
- Each scene sets its own page title, and focus moves to the scene's heading
  so screen-reader and keyboard users land in the right place.

### 4. Act lines and surtitles

| Moment                     | Line (draft)                                      |
| -------------------------- | ------------------------------------------------- |
| Curtain opens              | "And now… the curtain rises."                     |
| Act I · The Creator        | "Every masterpiece… begins with a single stroke." |
| Act II · The Arsenal       | "Each instrument… chosen with care."              |
| Act III · The Masterpieces | "Behold. The work… speaks for itself."            |
| Act IV · The Encore        | "Every performance… deserves an encore."          |

An alternative original opening line was also drafted: "Take your seat. The
performance… begins." Marwan may swap it in later; it is a text and file change.

- Each line plays at most once per session per act. The Prologue has no line
  of its own beyond the opening.
- Surtitles are real text, shown whether or not sound is on, styled like
  theatre surtitles (Fourth Act display serif, italic), announced politely to
  screen readers, and gone after the line ends plus about a second.
- While a line plays, the music dips to about a third of its volume, then
  returns.

### 5. Sound behaviour

- Music loops seamlessly at a gentle volume. All sound pauses when the tab is
  hidden and resumes when it returns (if sound is on).
- Sound off mutes everything at once; sound on resumes the music and plays no
  missed lines.
- On a direct link the site starts with sound off; turning it on starts the
  music at once (the toggle click is the gesture).
- Audio files load only after the visitor chooses sound (or turns it on), so
  they never slow the first view.

### 6. Reduced motion

With "reduce motion" set on the device: no curtain animation (the choice
screen fades straight to the Prologue), scene changes become a quick
crossfade, and the lotus does not animate. Sound and surtitles behave as
normal.

### 7. The lotus trap (also in scope)

The quote in Act I gets Marwan's Midjourney lotus in place of the current
drawn bud, shown at about 96 px, realistic, background removed, working on
both themes.

- It is three layers: outer petals, inner petals, and the centre sphere.
- The first time it comes into view it "arms": the inner petals turn 60°
  clockwise while the outer petals turn 60° counter-clockwise over about 1.5 s
  with an ease-out, then stop. The sphere stays still. Because the flower has
  six-fold symmetry, it ends exactly as it started. Hovering it replays the
  movement. With reduced motion it does not move.
- Where the inner petals used to cover the outer ones, the outer layer is
  backed with dark enamel so the gap reads as a recess on both themes.

## Assets

| Asset                                                                                    | Who                                                                            | Status                 | For the web                                                                 |
| ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ | ---------------------- | --------------------------------------------------------------------------- |
| Curtain video: crimson velvet curtain on a dark stage, opening, static camera, about 5 s | Marwan, Midjourney Animate                                                     | to make                | MP4 (H.264), at most about 2 MB, plus a closed-curtain poster frame as WebP |
| Voice lines (6)                                                                          | Piper drafts now; final voice later (ElevenLabs, own recording or voice actor) | drafts made, see below | MP3 mono, about 64 kbps, about 30 KB each                                   |
| Music loop, 1–3 min, theatre mood (dark waltz, piano, strings)                           | Marwan (Pixabay Music, Musopen or other licensed source)                       | to source              | MP3 stereo 128 kbps, at most about 3 MB, loop point crossfaded              |
| Optional sound effects: curtain swoosh, audience murmur on the choice screen             | Freesound (CC0) or Pixabay                                                     | optional               | MP3, short                                                                  |
| Lotus layers (outer, inner, sphere)                                                      | cut out from Marwan's Midjourney image                                         | made                   | WebP with transparency, about 288 px square                                 |

- Draft voice files (theatre-processed WAV) currently live in the session
  scratchpad (`voice-drafts/theatre/`); the lotus master and layers in
  `lotus/`; the original Midjourney lotus PNG in `C:\Users\G15 - 5511\Work\Marwan`.
  The builder copies what is needed into the project.
- Converting audio and video uses ffmpeg (Marwan approved installing it).
- While the curtain video and music don't exist yet, the branch uses
  stand-ins: a code-drawn curtain so the flow can be built and tested, and
  missing music is skipped without errors. The branch is only merged once the
  real curtain video and music are in.

## Decided by Marwan

- Curtain opening with a spoken opening line, then music that keeps playing.
- Each act introduced by its own line.
- A journey of scenes rather than one long scroll; moving between acts uses
  Claude's recommendation (lighting change, own address per act, direct links
  skip the intro).
- Voice and music: Marwan sources the final assets; Piper drafts are fine as
  local placeholders, kept out of the public repo, with surtitles only in
  any build from the repo until the final voice exists.
- Build on a branch and merge once the curtain video and music exist.
- ffmpeg may be installed for converting audio and video.
- A realistic lotus made in Midjourney (the arming movement was recommended;
  Marwan asked for the site to feel alive and accepted the recommendations).

## Left to the builder

- How the scene transition is built (for example the View Transitions API with
  a CSS fallback, or a small animation layer), as long as it meets the timing
  and reduced-motion rules above.
- Audio implementation (HTML audio elements or Web Audio) and where audio and
  video files live (`public/` or imported assets).
- How the lotus replaces the Quote's built-in drawing (for example a new
  `mark` prop on Quote, or turning the built-in lotus off and placing the
  image). Any change to `src/components/fourth-act/` must be listed for
  Marwan, because those files are generated from the design system and the
  same change has to go into its source.
- Whether the `NavBar` gets real `href` paths instead of `#id` anchors, so
  opening an act in a new tab works.
- Updating the sitemap, adding per-scene page titles, the Vercel rewrite, and
  updating tests that assume one scrolling page.
- _My call:_ the live domain is not known yet (`index.html`, `sitemap.xml` and
  `robots.txt` still use the placeholder `yourportfolio.vercel.app`). Keep the
  site address in one constant, give each scene its own canonical link built
  from it, and swap in the real domain when Marwan provides it.
