# Step 6 computer-use review

Reviewed 2026-09-04 on `http://localhost:4176/museum-vault-keyring?section=6` using actual Chrome computer-use tools. Read `AGENTS.md` first. No product files changed.

## Result

Pass for the shared editor, run/submit controls, basic error messages, keyboard access, responsive layout, persistence, navigation, and reset. No blocking UI defects found.

## Directly checked

- Two labeled JSON fields match `countOpenableVaults(vaults, startKeys)`.
- Invalid `[oops]` input shows a field-specific JSON error and focuses the field.
- `const x = ;` on editor line 2 reports SyntaxError, line 2, column 13.
- `missingThing()` on editor line 3 reports ReferenceError, line 3, column 3.
- An endless loop times out without inventing a line number. Run/Submit become usable again.
- Stop cancels a second endless-loop run and shows “Stopped. You can edit and try again.”
- A working stack/Set solution returns `2` for `vaults=[[1],[]]`, `startKeys=[0]` and passes all 8 tests.
- Refresh preserves code, inputs, and saved success. Editing code clears the previous pass count.
- Step 5 then Step 6 preserves the draft and fields.
- Tab inserts two spaces. Escape then Tab moves focus from the editor to the first input.
- Restart asks “Clear your Step 6 code and inputs?”; confirming restores starter code, blank inputs, and 0/8 progress.
- Phone Problem/Lesson switches work, with readable problem text and reachable controls.

## Visual review

Captured and inspected computer-use screenshots in the review conversation: initial 500px-wide layout; 1440×1000 desktop passed-results view; 390×844 phone editor with line numbers; phone input/actions view; phone problem pane. Labels and buttons were readable, controls fit, and the bottom switcher did not prevent reaching actions. Long code lines remain inside the editor. Viewport override was reset after review.

## Scope and tool limits

This is a representative shared-UI review, not an independent run of all 25 lesson suites. The root agent separately ran the full browser validator and checked live AI help; this reviewer did not make a duplicate live AI request or inspect its network payload. No physical phone, touch keyboard, or screen reader was used.

The browser tool's `getJsDialog().accept()` timed out while the reset confirmation was open. Native Chrome computer use then clicked the visible OK button and verified the complete reset. This was a tool limitation, not a remaining product failure.
