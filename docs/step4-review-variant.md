# Variant Step 4 mistake review

Review standard: keep a mistake only when one normal-looking code change creates one wrong graph rule and a small input makes the returned value differ. Exclude syntax errors, crashes, arbitrary constants, formatting-only errors, and two-bug combinations.

| Problem | Correct-solution rule | Represented realistic mistakes | Excluded after review |
|---|---|---|---|
| who-keeps-their-job | Remove the quitter's whole manager subtree, including the quitter; return the remaining IDs sorted numerically. | selected node only; descendants but not quitter; IDs confused with array positions | string sorting (not graph reasoning) |
| busiest-shelf-level | Traverse nested arrays by depth and maximize the number of integer items on one level. | containers counted; values summed; empty intermediate level treated as the end | arbitrary level cap |
| coins-on-level-k | Start the outer list at level 1 and sum every integer exactly on level k. | level starts at 0; shallower levels included; first match only | integer overflow |
| counting-constellations | Count 8-direction connected components of star cells. | only 4 directions; stars counted instead of components; isolated stars omitted | row/column display swap |
| counting-docked-boats | Count boat components that touch any marina border. | tests only component start; tests only top border; stops after first boat | diagonal docking plus another bug |
| routes-past-the-coffee-cart | Enumerate every start-to-customer route whose path contains the checkpoint. | first route only; stops at checkpoint; shared path buffer loses routes | output-order-only differences |
| villages-without-wells | Count connected components containing no well anywhere. | tests only component start; demands a well at every node; omits isolated villages | duplicate road entries |
| gas-pocket-survey | Reveal the drilled underground component and count all 8-direction adjacent gas cells. | diagonal gas ignored; up/down only; drill cell processed twice | cosmetic reveal symbols |
| gold-and-silver-lights | Two-color the tree from gold root 0 and count gold nodes. | root starts silver; child keeps parent color; silver count returned | non-tree cycle handling |
| dungeon-gold-run | Traverse every room unlocked by initial or newly found keys and sum its gold once. | found keys ignored; keys treated as single-use; rooms counted instead of gold | key ordering only |
| flooded-campsite-trails | Search from start to finish without entering flooded nodes. | finish accepted before flood check; finish checked before flood generally; traversal allowed from flooded start | malformed node IDs |
| longest-freight-train | Find the largest 4-direction connected component of train cars. | first component returned; horizontal links only; search stops after first train | diagonal plus wraparound combination |
| one-color-metro-ride | Test reachability separately within a single track color, with no transfer. | colors erased; only last color tracked; one color change allowed | color-name casing |
| office-rumor-reach | Treat every friendship as undirected and count all people reachable from start. | listed direction only; reverse direction still omitted; direct friends only | duplicate friendships |
| package-to-the-outpost | Find minimum total road weight in the undirected network. | roads treated unweighted; fewest edges chosen; roads treated directed | equal-cost tie order |
| perfect-size-campsites | Count 4-direction grass components whose size equals k. | diagonal merging; 8-direction neighbors; first matching patch only | k outside constraints |
| count-routes-to-summit | Count distinct DAG paths from source to summit; shared suffixes may be reused by different paths. | global visited pruning; global visited variant; first summit route only | cycle defense for promised DAG |
| runes-on-the-castle-door | Build every dial choice string, forbidding only equal adjacent runes. | rune globally unique; global-used-set variant; equal prefixes merged | output ordering |
| save-the-date-phone-chain | Add each caller's wait along manager arrows and count people informed by deadline. | listener wait used; listener-delay variant; hops treated as days | timezone/date formatting |
| shut-the-garden-valve | Build feeder→sprinkler arrows and sum shutId plus every descendant by actual ID. | shut node only; direct children only; arrows reversed to ancestors; ID used as array position; shut node omitted; maximum used instead of sum; return after first child; traversal starts at main root | nonexistent shutId (guaranteed present); cycles (tree guaranteed) |
| biggest-study-group | Ignore diagonal self entries and return the largest undirected connected student group. | self entry counted; diagonal counted variant; first group only | asymmetric matrix handling |
| kth-song-in-playlist | Recursively flatten only songs, then return the 1-based kth song. | one level only; one-level variant; folders counted as songs | invalid k behavior |
| museum-vault-keyring | Repeatedly use newly found keys and count each reachable vault once. | found keys ignored (`authored-deep-case`); only first starting key used (`first-starting-key-only`); key links made two-way (`keys-made-two-way`) | duplicate starting keys; traversal order |
| top-of-the-pile | Find the minimum integer depth and sum every integer at that depth. | branch-local shallow values combined (`authored-deep-case`); deepest layer selected (`deepest-layer`); only first shallow item returned (`first-shallow-item`) | empty input is disallowed; box nodes never add weight |
| trusted-courier-networks | Connect offices when trust is at least k and count connected components. | equality rejected (`authored-deep-case`); equality required exactly (`threshold-equality-only`); secure edges counted instead of components (`counts-secure-lines`) | asymmetric scores are disallowed; DFS versus BFS |

The first authored case for every problem is preserved. Later cases use different inputs and canvases. `shut-the-garden-valve` now has eight cases covering every distinct, high-value obligation found in the correct solution.

## Fresh adversarial findings

- Fixed a blocker in `busiest-shelf-level`: the “sum labels” bug returned a label sum instead of the required level number. It now makes the wrong level choice while keeping the function's output contract.
- Replaced two repeated direction bugs in `counting-constellations` with distinct bugs: counting star cells instead of components, and omitting isolated one-star components.
- Added four missing `shut-the-garden-valve` bugs: omit the shut node, take a maximum instead of a sum, stop after the first child, and start at the main root.
- Reworked every variant snippet rejected by the readability checker. The code now uses clear names, short lines, and one visible step at a time.
- Rechecked all 25 variant problems against the source solution. No blocker or major issue remains after these fixes.
