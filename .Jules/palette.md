## 2024-05-23 - Modal Accessibility Wins
**Learning:** Adding `aria-label` and `Escape` key support to a central `Modal` component is a high-leverage micro-improvement. It fixes accessibility and usability across dozens of instances (ConfirmModal, Edit forms, etc.) with a single file change.
**Action:** Always check the core UI components (`Modal`, `Button`, `Input`) first for missing accessibility attributes before fixing individual page instances.
