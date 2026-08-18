# Cyclotron & Lorentz Force — Interactive Demo

An educational, interactive demo that visualizes how a charged particle moves inside a magnetic field (Lorentz force) and demonstrates the basic idea behind a cyclotron.

Table of contents
- [Features](#features)
- [Tech stack](#tech-stack)
- [Quick start](#quick-start)
- [Development tasks & tips](#development-tasks--tips)
- [Project structure](#project-structure)
- [How it works (overview)](#how-it-works-overview)
- [Customization & theming](#customization--theming)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Features
- Real-time simulation canvas with motion trails
- Velocity and force vectors rendered on the canvas
- Dual-charge comparison mode to contrast positive vs negative charge motion
- Dark and light themes (toggle in the controls)
- Informational panels: quick rules, guided challenge, notes, and FAQ

## Tech stack
# Cyclotron & Lorentz Force — Interactive Demo

An interactive React + Vite demo that visualizes how a charged particle moves inside a uniform magnetic field (B along +z). This README is derived directly from the project's source and documents what is implemented, how it maps to the physics, the pedagogical design, and how to run or extend the project.

## Submission

- Live Demo: https://cyclotron.pages.dev/
- Source repository: https://github.com/nannapucharanraju/internship-project

## Overview

This application shows the motion of a single charged particle in a plane subject to a uniform magnetic field pointing perpendicular to that plane. The simulation uses an analytical (closed-form) solution for particle motion so the orbit radius and timing remain exact (no numerical integration drift).

Key implemented pieces (evidence in source):
- Physics engine: `src/physics/cyclotronPhysics.js` (analytical formulas and `stateAtTime`).
- Interactive canvas: `src/components/SimulationCanvas.jsx` (draws field, trails, particle, velocity & force arrows).
- Controls: `src/components/ControlPanel.jsx` (sliders for `charge`, `mass`, `speed`, `angleDeg`, `Bz`, compare-mode toggle, Reset button).
- Guided learning: `src/components/GuidedChallenge.jsx`, `src/components/ConceptNotes.jsx`, `src/components/LiveInsightPanel.jsx` and other panels for explanation and hints.
- Graph: `src/components/VelocityGraph.jsx` (Recharts) showing vx/vy over time.

## Pedagogical Design & "Aha!" Moment

Pedagogical goal: make the relationship between motion, sideways magnetic force, and circular motion intuitive through direct manipulation and observation.

Central idea (what learners should understand): a moving charged particle in a perpendicular magnetic field experiences a sideways force that continuously changes the particle's direction, producing circular motion when the force is always perpendicular to the velocity.

Intended "Aha!" moment:
- When learners increase speed or mass they see the orbit widen; when they increase charge magnitude or magnetic field they see the orbit tighten. Observing the live radius and period readouts while changing a single parameter helps them link algebraic formulas to observable behavior.

Why interaction helps more than equations alone:
- Manipulation lets learners form causal links: change one parameter and immediately observe the trajectory, the trail, the direction of the yellow force arrow, and the numeric readouts (circle size, period, angular frequency). The Guided Challenge asks learners to predict arrow direction before revealing it, reinforcing active reasoning.

How controls support learning (actual implemented controls):
- `charge` (slider): sets particle charge (can be negative). Changing its sign reverses curvature direction; changing magnitude changes how strongly the trajectory bends.
- `mass` (slider): heavier particles bend less (larger radius for same speed and B).
- `speed` (slider): faster particles travel farther between sideways pushes, producing a larger radius.
- `angleDeg` (slider): launch angle of initial velocity; changes initial direction of motion and thus where the force initially points.
- `Bz` (slider): magnetic field strength and sign (positive = out of page; negative = into page). Increasing |B| tightens the orbit; reversing sign flips curvature direction.
- `Show opposite charge` (toggle): renders a second particle trajectory with opposite sign charge for direct comparison.
- `Reset` button: returns parameters to defaults.

Guided experiments (how to perform them with the implemented UI):
1. Set `charge` to +1, `mass` to 1, `speed` to 4, `Bz` to 1. Observe the trajectory and readouts. Note the radius and period.
2. Increase `speed` while keeping other parameters fixed — observe the radius increase and the Live Insight explanation updating.
3. Flip `charge` sign — observe the trajectory reverse orientation while radius magnitude remains governed by |q|.
4. Enable `Show opposite charge` to compare two trajectories simultaneously.

Observations learners should make and outcomes:
- Changing `speed` or `mass` increases the radius; changing |q| or |Bz| decreases radius. Learners should be able to predict direction of initial magnetic force using right-hand rule and verify with the Guided Challenge.

Learning outcomes (explicit):
- Explain qualitatively why a magnetic field causes circular motion.
- Predict how changing each control affects radius and rotation direction.
- Compute the expected radius and period using formulas implemented in the physics engine and verify against the simulation's readouts.

## Features (implemented)

- Analytic physics model (closed-form) for particle motion (no numeric integrator drift).
- Interactive canvas with motion trails, particle glow, concentric field rings, and a subtle grid.
- Velocity (blue) and force (yellow) arrows drawn on the canvas.
- Dual-charge comparison mode (toggle) to compare opposite charges.
- Guided challenge that asks learners to predict first force direction before revealing it.
- Live explanatory panel that summarizes circle size, period, and dominant parameter effect.
- Velocity vs time graph for vx and vy using `recharts`.
- Responsive, high‑DPI canvas (ResizeObserver + devicePixelRatio) for crisp rendering on retina displays.

## Scientific & Mathematical Model

All core physics is implemented in `src/physics/cyclotronPhysics.js`. The implementation uses closed-form analytical solutions for uniform magnetic field along the z-axis and a non-relativistic, point-particle approximation.

Key implemented relations (names and where implemented):
- Cyclotron angular frequency: implemented in `computeCyclotronParams`
	$$\omega = \frac{q\,B}{m}$$
	where $q$ is the particle charge (units: charge units used by the app), $B$ is the magnetic field (T), and $m$ is mass (mass units used by the app). The code uses a constant `Q_UNIT = 1` so charge values are directly used as $q$.

- Cyclotron radius (implemented in `computeRadius`):
	$$r = \frac{m\,v}{|q|\,|B|}$$
	where $v$ is the particle speed (app units), and $|\cdot|$ denotes absolute value. The function returns `Infinity` when $q=0$ or $B=0` (straight-line motion case).

- Cyclotron period (implemented in `computePeriod`):
	$$T = \frac{2\pi m}{|q|\,|B|}$$

- Exact state-by-time solution (implemented in `stateAtTime`): the code computes position $(x,y)$ and velocity $(v_x,v_y)$ at elapsed time $t$ using an analytic closed-form solution for motion under constant $B$ (see `stateAtTime` in `cyclotronPhysics.js`). The implementation explicitly handles the small-$\omega$ limit (when $q$ or $B$ is zero) by returning straight-line kinematics:
	$$x(t)=x_0+v_{x0}t,\quad y(t)=y_0+v_{y0}t$$

Force calculation used for drawing (in `SimulationCanvas.jsx`): the canvas draws force vector components computed as
	$$F_x = q B \; v_y,\quad F_y = -q B \; v_x$$
which is equivalent to $\mathbf{F}=q\,\mathbf{v}\times\mathbf{B}$ for $\mathbf{B}=B\hat{z}$. The magnitude used to gate drawing is $|q B v|$.

Units & mapping: the code uses unit-less numeric sliders (application units). Interpretations:
- `charge`: unitless multiplier of `Q_UNIT` (code sets `Q_UNIT = 1`). Sign matters.
- `mass`: unitless mass parameter used consistently by formulas.
- `speed`: unitless speed value used in the $r$ and $T$ formulas above.
- `Bz`: unitless magnetic field parameter; sign indicates direction (positive = out of page; negative = into page).

The `SimulationCanvas` maps the physics coordinates to pixels using `CANVAS_SCALE` (see `cyclotronPhysics.js`). Observed radii on-screen follow $r\times\text{CANVAS_SCALE}$.

## Physics Implementation (detailed)

- `computeCyclotronParams({charge, mass, Bz})` returns $\omega = qB/m$ (signed). Implementation uses `Q_UNIT = 1`.
- `computeRadius({charge, mass, Bz, speed})` computes $r = m v / (|q| |B|)`. If `charge === 0` or `Bz === 0`, it returns `Infinity` (meaning straight line).
- `computePeriod({charge, mass, Bz})` computes $T = 2\pi m / (|q| |B|)$ and returns `Infinity` in the zero-force case.
- `stateAtTime({x0,y0,vx0,vy0,charge,mass,Bz,t})` computes $(x,y,v_x,v_y)$ using an analytical solution. The function handles $|\omega|<1\times10^{-9}$ as the straight-line limit to avoid division by zero. See source `src/physics/cyclotronPhysics.js` for the exact expressions used.
- The canvas converts positions via `px = cx + x*CANVAS_SCALE`, `py = cy - y*CANVAS_SCALE` where `cx,cy` are canvas center coordinates.
- Force arrow computation (in `SimulationCanvas.jsx`) uses $F_x = qB v_y$, $F_y = -qB v_x$ and normalizes to draw an arrow of fixed visual length.

## Scientific Validation

Ways to verify implementation vs physical formulas (all implemented):

1. Compute expected radius from $r = m v / (|q||B|)$ with current slider values and compare to the `ReadoutPanel` output (component: `src/components/ReadoutPanel.jsx`).

2. Change `speed` while holding other parameters constant: radius should scale linearly with $v$ (doubling $v$ should double the radius).

3. Change `mass` while holding other parameters constant: radius should scale linearly with $m$.

4. Change `|q|` or $|B|$: radius should decrease inversely with either parameter.

5. Period $T = 2\pi m/(|q||B|)$ is independent of $v$ — you can verify by varying `speed` and observing the period readout.

These checks are directly possible using the `ReadoutPanel` and the `LiveInsightPanel` which displays computed radius and period.

## Physical Assumptions & Limitations

- Uniform magnetic field along z-axis only (no spatial variation). (See `drawFieldIndicator` and physics functions.)
- Non-relativistic regime: no relativistic mass or gamma factor is used; speed is treated as classical.
- Single particle, point-like; no particle-particle interactions.
- No electric fields, no radiation losses, and no friction or other forces are modeled.
- Charge and mass are unitless numeric parameters inside the app; mapping to SI units is left to the teacher/learner.

## UI / UX & Responsiveness (what is actually implemented)

- Layout: `src/App.jsx` implements a two-column layout: a main column containing the `lab-stage` with the canvas and several explanatory panels, and a right-side `aside` with controls and readouts.
- Controls: `src/components/ControlPanel.jsx` provides sliders for `charge`, `mass`, `speed`, `angleDeg`, and `Bz`, plus a `Show opposite charge` toggle and a `Reset` button (with inline SVG icon). Each slider shows a numeric readout beside its label.
- Canvas behavior: `src/components/SimulationCanvas.jsx` draws concentric rings, a grid, fading trails (controlled by `TRAIL_LENGTH`), particle glow and core, velocity arrow (blue), and force arrow (yellow) when enabled. The canvas is now responsive and supports high-DPI rendering (ResizeObserver + devicePixelRatio).
- Graphs: `src/components/VelocityGraph.jsx` uses `recharts` to plot `v_x` and `v_y` over a short time span (data computed using `stateAtTime`).
- Guided learning: `src/components/GuidedChallenge.jsx` provides step-by-step prompts, a prediction interface (Up/Right/Down/Left), and reveal/reset flows.
- Visual feedback: LiveInsightPanel computes human-readable summaries (dominant parameter effect, circle size, period, direction). `ConceptNotes.jsx` contains short notes and key formulas for quick reference.
- Accessibility: basic semantic elements and button labels exist; there is no dedicated a11y auditing or ARIA beyond simple labels in place (e.g., `aria-label` for reset). Color contrast and keyboard navigation were not exhaustively verified in code.

## AI Usage & Critical Verification

- Repository evidence: there are no explicit markers in the source files that document whether AI tools produced particular commits. (No automatic claim is made about repo history.)
- During the current development session, automated assistance was used to propose UI and stylistic changes. All changes to physics code were verified against the analytical formulas implemented in `src/physics/cyclotronPhysics.js`.
- Verification methodology used here:
	1. Read and reproduce the exact formulas present in `cyclotronPhysics.js`.
 2. Trace how `SimulationCanvas.jsx` maps physics state to drawing coordinates and arrows.
 3. Confirm readouts (radius, period, omega) are computed from the same functions used for rendering and present in `ReadoutPanel` and `LiveInsightPanel`.
 4. Run a local build (`npm run build`) to ensure code compiles and UI changes do not break functionality.
- If AI-suggested code was applied, it was treated as a draft and cross-checked with the math and canvas visuals; no unverified physics changes were introduced.

## Tech Stack

- React 19 + Vite
- Recharts for plotting
- Plain CSS with CSS custom properties

## Project Structure (selected files)

- `index.html` — HTML entry (loads Google font)
- `package.json` — scripts and dependencies
- `vite.config.js` — Vite config (React plugin)
- `src/main.jsx` — React entry (renders `App`)
- `src/App.jsx` — main layout and application state (params, compare toggle, showForce)
- `src/App.css` — primary styles and micro-animations
- `src/index.css` — global styles (currently empty)
- `src/physics/cyclotronPhysics.js` — physics core (analytical formulas)
- `src/components/SimulationCanvas.jsx` — canvas rendering loop and drawing helpers
- `src/components/ControlPanel.jsx` — sliders, compare toggle, reset button
- `src/components/ReadoutPanel.jsx` — numeric readouts (radius, period, omega)
- `src/components/GuidedChallenge.jsx` — interactive prediction exercise
- `src/components/VelocityGraph.jsx` — vx/vy plot (Recharts)

## How It Works (runtime)

1. `App.jsx` holds simulation parameters in React state and passes them to `SimulationCanvas` and other panels.
2. `SimulationCanvas` uses `performance.now()` (elapsed time) and `stateAtTime` from `cyclotronPhysics.js` to compute the particle state at the current elapsed time. Trails are accumulated and drawn as fading lines.
3. The force and velocity vectors are computed from the instantaneous velocity returned by `stateAtTime` and drawn as arrows on the canvas.
4. `ReadoutPanel` and `LiveInsightPanel` call the same physics helpers to compute radius, period and qualitative insight so numeric and textual outputs match the drawing.

## Quick Start (from `package.json`)

Install dependencies:

```bash
npm install
```

Run development server (hot reload):

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview production build locally:

```bash
npm run preview
```

Notes about these commands:
- `dev` — starts Vite dev server (see `src/main.jsx` entry). Opens at `http://localhost:5173/` by default.
- `build` — runs `vite build` and outputs static files to `dist/` (Vite default).
- `preview` — serves the `dist/` build locally using Vite's preview server.

## Development

- The canvas drawing constants to tune: `TRAIL_LENGTH`, `CANVAS_SCALE`, and arrow lengths inside `src/components/SimulationCanvas.jsx`.
- The physics core is in `src/physics/cyclotronPhysics.js` — change formulas there only if you understand the analytic solution.

## Production Build

- Build artifacts are produced in `dist/` (Vite default). Use `npm run build` to produce them.

## Deployment

- The `dist/` directory can be deployed to any static hosting (Netlify, Vercel, GitHub Pages). Provide your Live Demo URL in the top section.

## Troubleshooting

- If the dev server fails: verify Node and npm versions, reinstall dependencies, and check console errors.
- If the canvas looks blurry on retina displays, the app already applies a devicePixelRatio transform; ensure your browser supports devicePixelRatio.

## Future Improvements (accurate, not invented)

- Make the canvas fully resizable or full-bleed and provide export/screenshot for frames.
- Add explicit SI unit mapping and unit labels to sliders for experiments mapped to real physical values.
- Add keyboard accessibility improvements and ARIA labels for controls.

## License

- (Add your preferred license here, e.g. MIT)


---

