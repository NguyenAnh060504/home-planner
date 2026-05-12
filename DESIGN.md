# Room Manager Game — Design Brief

## Tone & Differentiation
Bright, playful game interface. Maximalist color palette with per-room gradients. High-energy, anti-minimalist. Emoji-driven tactile UX with drag-and-drop interaction.

## Color Palette
| Token | OKLCH | Use |
|-------|-------|-----|
| Primary | 65 0.25 25 | Buttons, active tabs, highlights |
| Secondary | 55 0.22 25 | Secondary actions, accents |
| Accent | 65 0.28 30 | Interactive feedback, hover states |
| Destructive | 50 0.25 20 | Delete, remove actions |
| Background | 98 0.02 0 | White page base |
| Foreground | 20 0.02 0 | Text, dark elements |
| Muted | 88 0.04 0 | Disabled, subtle text |
| Border | 80 0.06 0 | Dividers, outlines |

## Room Gradients
| Room | Gradient |
|------|----------|
| Living Room (Phòng khách) | Warm orange (55→35→45 hue) |
| Bedroom (Phòng ngủ) | Cool purple (290→280→295 hue) |
| Kitchen (Bếp) | Fresh green (130→120→135 hue) |
| Bathroom (Phòng tắm) | Teal cyan (190→180→200 hue) |

## Typography
| Role | Family | Weight | Use |
|------|--------|--------|-----|
| Display | Nunito | 700 | Headers, room tabs, buttons |
| Body | Nunito | 400 | Body text, labels, Vietnamese UI |
| Mono | JetBrainsMono | 400 | Debug, admin text |

## Structural Zones
| Zone | Treatment |
|------|----------|
| Header | Solid bg-card with border-b, room tabs, title |
| Content Grid | Room gradient background, 4×4 draggable item cells |
| Item Card | White bg-white, 2px border, rounded-2xl, 40-60px emoji center |
| Feedback | Drag-over zone: bg-accent/20 + border-accent |

## Spacing & Rhythm
Gap: 1rem between items. Padding: 1.5rem rooms, 1rem cards. Rounded: 1rem default, 2xl cards.

## Motion & Interactions
| Animation | Duration | Trigger |
|-----------|----------|----------|
| scale-bounce | 300ms | Item placement, button click |
| fade-in-up | 400ms | Room/item load |
| Drag visual | Live | Opacity 75%, shadow-2xl, grab cursor |
| Drop zone | Live | bg-accent/20 border highlight |

## Component Patterns
Room tab: `.room-tab.active` = bg-primary text-white. Item card: `.item-card` with `.item-emoji` (40-60px), hover shadow. Drop zone: `.drop-zone.drag-over` feedback.

## Signature Detail
Colorful per-room gradient backgrounds paired with large readable emojis on white cards. High contrast, high saturation — visual joy without clutter.
