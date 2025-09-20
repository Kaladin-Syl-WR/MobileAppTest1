# Gameplay Phase Roadmap

This document tracks the expansion ideas for future Snake phases and the workflow for delivering them. Mark the status of each task as you plan, start, and complete the work.

## Workflow Overview
- **Branch naming:** use `feature/phase-<nn>-<slug>` (e.g. `feature/phase-06-day-night`) per mechanic or closely-related feature set.
- **One feature per branch:** keep PRs focused; merge back to `main` once the phase is stable and tested.
- **Tracking status:** update the checkboxes in this file during planning (✅ done, 🚧 in progress, ⏳ blocked, ⬜ todo). Optional notes can capture test coverage, open questions, or dependencies.
- **Testing expectation:** before merging, run unit tests, simulator playtests, and add new automated coverage when feasible (e.g. reducer tests for new mechanics).

## Task Tracker

### Temporal & Environmental Shifts
- ⬜ Phase: Day/Night cycle with shrinking visibility cone and light-based hazards.
- ⬜ Phase: Gravity pulses that drift the snake diagonally unless counter-steered.
- ⬜ Phase: Weather events (ice, sandstorm, lightning flashes) that alter movement or visibility.

### Board Topology Changes
- ⬜ Phase: Portal gates with cooldowns; include “glitch” gates that scramble controls briefly.
- ⬜ Phase: Mutating board rows/columns that slide like conveyor belts.
- ⬜ Phase: Rotating laser/beam obstacles that sweep the board on a timer.

### Power-Ups & Consumables
- ⬜ Phase: Consumable power-ups (ghost mode, mini mode, tail-clearing bomb) with timers.
- ⬜ Phase: Currency pickups plus between-phase shop for buying upgrades (extra life, sonar).
- ⬜ Phase: Rhythm/combo system that rewards on-beat eating or color sequences.

### Dynamic Obstacles & Enemies
- ⬜ Phase: Patrolling enemy snake/boss that damages tail segments instead of instant loss.
- ⬜ Phase: Adaptive AI snake that mirrors the player’s last moves to box them in.
- ⬜ Phase: Obstacles that grow/shrink over time or crumble if hit while highlighted.

### Alternate Objectives & Terrain
- ⬜ Phase: Escort or herd mini-snakes/pellets into exits before a timer expires.
- ⬜ Phase: Terrain variety (water slows, trampolines launch, mud blocks boosts).
- ⬜ Phase: Direction-locked or control-inverted zones that require route planning.

### Health & Progression Systems
- ⬜ Phase: Segment health/heart system with limited healing pickups.
- ⬜ Phase: Hunger timer mechanic that inflicts damage if food isn’t reached in time.
- ⬜ Phase: Currency-backed meta progression (unlock cosmetics, persistent upgrades).

## Implementation Notes
- When starting a phase, add a short summary beneath the task with:
  - Planned approach and key reducer/UI changes.
  - Test/update checklist (unit, integration, manual).
  - Cross-cutting concerns (performance, accessibility, localization).
- After merging, mark the task as ✅ and link to the PR/commit.

