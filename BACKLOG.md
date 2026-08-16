# Backlog

Things worth doing that are not being done yet, and why they were parked. Not a list of every idea —
only ones we have actually looked at and decided to defer, with enough context to pick up cold.

## Body type

`bio.bodyType` ("Avg & Lean", "Tall & Normal", …) is parsed on import and shown on the card, and
nothing reads it. It plausibly belongs in the model: two 175cm cards with the same agility and
strength feel different to dribble with depending on their frame.

Parked because neither of us is confident enough about what it does in FC 26 to put a number on it,
and a number we cannot defend is worse than an omission we can see. Two designs were sketched:

- **As a height correction.** Feed it into AcceleRATE alongside height — Lean reads as shorter,
  Stocky as taller. Large blast radius: it changes which archetype a card is admitted as, which is
  the one thing in this model that is a hard requirement rather than a weight.
- **As a bounded score modifier.** A ±1–2 point term on the position score: Lean suits the wide and
  attacking plans, Stocky the duelling ones. Cannot break an archetype, only order two cards that
  were already close.

The second is the safer starting point if this is picked up.

Two things to settle first: what body type actually changes in game (animation set? turn rate? the
shield?), and coverage — imported cards do not always carry the field, so the model needs a neutral
reading when it is missing.
