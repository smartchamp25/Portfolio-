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
3. Each act is introduced once per visit by a spoken line. Nothing is shown
   on screen: the visitor lives the moment, it is not a film with subtitles
   (Marwan's call, 2026-10-24).
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
- Audio licensing, decided by Marwan (2026-10-24): the voice is Jhin's own,
  his original in-game lines from League of Legends, used under Riot Games'
  "Legal Jibber Jabber" fan-content policy. The site stays free and
  non-commercial, and the footer carries Riot's required disclaimer. Claude
  flagged that a portfolio meant to win work is a grey area under that
  policy; Marwan chose it knowingly. The voice files are committed to the
  repo. The earlier Piper drafts (CC BY-NC-SA) are retired. The music is a
  public-domain recording (see Assets).

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
  _"And now… the curtain rises."_ plays in time with it. While the curtains are still parting (the last 1.2 s of the clip),
  the view pushes forward through the gap as the curtain dissolves, and the
  Prologue (the current hero) plays its entrance on the stage behind it, with
  the top bar arriving alongside. The page stays still and out of reach until
  that moment. In the light theme the house lights come up: the curtain
  brightens to the page as it clears. Once it is gone, the music fades in over
  about 2 seconds and loops.
- After "Enter without sound": the same curtain video plays silently.
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
  act's line starts as the light rises.
- A scene taller than the screen (Projects) scrolls within itself. The
  existing fade-up reveals inside scenes stay.
- Each scene sets its own page title, and focus moves to the scene's heading
  so screen-reader and keyboard users land in the right place.

### 4. Act lines

| Moment                     | Jhin's line                                    | Wiki voice file                 |
| -------------------------- | ---------------------------------------------- | ------------------------------- |
| Curtain opens              | "And now, the curtain rises."                  | `Jhin_Original_MoveFirst_0.ogg` |
| Act I · The Creator        | "Only to the audience do I show my true face." | `Jhin_Original_Move_44.ogg`     |
| Act II · The Arsenal       | "Every element must be in place."              | `Jhin_Original_Move_64.ogg`     |
| Act III · The Masterpieces | "The work is what matters."                    | `Jhin_Original_Move_18.ogg`     |
| Act IV · The Encore        | "My audience awaits."                          | `Jhin_Original_Move_17.ogg`     |

Chosen by Marwan from Jhin's real lines, avoiding the ones about killing and
death. The files come from the League of Legends wiki
(`wiki.leagueoflegends.com/en-us/images/<file>`). Each clip is cut 0.35 s after
its last word with a fade, removing the low reverb tail of the game recording,
then encoded with `scripts/encode-media.sh voice`. Swapping a line is a file
change: the site plays `src/assets/voice/<line id>.mp3`.

- Each line plays at most once per session per act, the first time it can be
  heard: a line missed with sound off plays on a later visit to that act once
  sound is on. The Prologue has no line of its own beyond the opening.
- No surtitles (Marwan's call, 2026-10-24): lines are voice only, with plain
  voice, no theatre echo or reverb.
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
crossfade, and the lotus does not animate. Sound behaves as normal.

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

| Asset                                                                                    | Who                                                       | Status   | For the web                                                                                       |
| ---------------------------------------------------------------------------------------- | --------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------- |
| Curtain video: crimson velvet curtain on a dark stage, opening, static camera, about 5 s | Marwan, Midjourney Animate                                | in       | MP4 (H.264), at most about 2 MB, plus a closed-curtain poster frame as WebP                       |
| Voice lines (5)                                                                          | Jhin's original in-game lines (Riot Games), see section 4 | in       | MP3 mono, about 64 kbps, 19–33 KB each                                                            |
| Music loop: Chopin, Nocturne No. 20 in C-sharp minor (B. 49), played by Frank Lévy       | Wikimedia Commons, public domain, no credit needed        | in       | MP3 stereo 128 kbps, 3.4 MB, 3:43; one steady gain, the natural ending rings out into the opening |
| Optional sound effects: curtain swoosh, audience murmur on the choice screen             | Freesound (CC0) or Pixabay                                | optional | MP3, short                                                                                        |
| Lotus layers (outer, inner, sphere)                                                      | cut out from Marwan's Midjourney image                    | made     | WebP with transparency, about 288 px square                                                       |

- The original Midjourney lotus PNG is in `C:\Users\G15 - 5511\Work\Marwan`,
  and the curtain source videos are in its `Curtian` folder.
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
- Voice and music: Jhin's real lines with Riot's disclaimer, and a
  public-domain Chopin nocturne (2026-10-24). Surtitles were dropped.
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
- The site address lives in one constant, and each scene gets its own
  canonical link built from it. The live domain is `marwan-dev.vercel.app`
  (Marwan's choice, 2026-10-24), also used in `index.html`, `sitemap.xml` and
  `robots.txt`.
