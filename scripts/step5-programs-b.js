// Each editable block is one algorithm rule. Each challenge changes one rule.
const fixed = (key, text) => ({ key, correct: 'fixed', options: [{ id: 'fixed', text }] });
const rule = (key, correct, correctText, buggy, buggyText, feedback, witness) => ({ key, correct, buggy, options: [{ id: correct, text: correctText }, { id: buggy, text: buggyText }], feedback, witness });
module.exports = {
  'museum-vault-keyring': [
    rule('direction', 'forward', 'FOR each key k inside vault v:\n  add an arrow v → k', 'both', 'FOR each key k inside vault v:\n  add arrows v → k and k → v', 'A key inside vault v opens k; opening k does not give you the key to v. Follow only the arrow from the vault holding a key to the vault it unlocks.', { vaults: [[], [0]], startKeys: [0] }),
    rule('starts', 'all', 'pending ← every key in startKeys', 'first', 'pending ← only the first key in startKeys (or empty if none)', 'Every key on the starting keyring can open a vault. Starting from just one key misses separate chains of vaults.', { vaults: [[], []], startKeys: [0, 1] }),
    fixed('setup', 'opened ← empty set\nWHILE pending is not empty:\n  take a vault v from pending\n  IF v is already in opened: continue\n  add v to opened'),
    rule('keys', 'all', '  add every outgoing neighbor of v to pending', 'first', '  add only the first outgoing neighbor of v to pending (if any)', 'Pick up every key in each opened vault. One key chain can branch; following only its first key leaves other reachable vaults locked.', { vaults: [[1, 2], [], []], startKeys: [0] }),
    fixed('return', 'RETURN the number of vaults in opened')
  ],
  'dungeon-gold-run': [
    rule('direction', 'forward', 'FOR each key k in room v:\n  add an arrow v → k', 'both', 'FOR each key k in room v:\n  add arrows v → k and k → v', 'A key opens the room whose number it carries. It does not let you walk backward into the room that holds it. Adding reverse arrows can collect gold from locked rooms.', { rooms: [[], [0]], gold: [2, 9] }),
    fixed('setup', 'pending ← [0]\nopened ← empty set\nWHILE pending is not empty:\n  take a room v from pending\n  IF v is already in opened: continue\n  add v to opened'),
    rule('keys', 'all', '  add every outgoing neighbor of v to pending', 'first', '  add only the first outgoing neighbor of v to pending (if any)', 'Take every key from an opened room. Choosing just the first key misses branches and the gold in their rooms.', { rooms: [[1, 2], [], []], gold: [1, 2, 8] }),
    rule('collect', 'gold', 'RETURN the sum of gold[v] for each different room v in opened', 'count', 'RETURN the number of different rooms in opened', 'The question asks for coins, not room count. Once you know which rooms open, add their gold amounts exactly once.', { rooms: [[]], gold: [7] })
  ],
  'office-rumor-reach': [
    rule('direction', 'both', 'FOR each friendship [a, b]:\n  add arrows a → b and b → a', 'oneway', 'FOR each friendship [a, b]:\n  add only the arrow a → b', 'Friendship goes both ways. The order of the two IDs in a friendship must not decide which person can hear the rumor.', { n: 2, friendships: [[0, 1]], start: 1 }),
    fixed('setup', 'heard ← empty set\npending ← [(start, 0)]\nWHILE pending is not empty:\n  take (person, steps) from pending\n  IF person is already in heard: continue\n  add person to heard'),
    rule('walk', 'all', '  FOR each neighbor of person:\n    add (neighbor, steps + 1) to pending', 'direct', '  IF steps = 0:\n    FOR each neighbor of person:\n      add (neighbor, steps + 1) to pending', 'Everyone who hears the rumor passes it on. Stopping after the starter’s friends misses people farther along a friendship chain.', { n: 3, friendships: [[0, 1], [1, 2]], start: 0 }),
    rule('include', 'keep', 'RETURN the number of people in heard', 'omit', 'RETURN the number of people in heard minus 1', 'The starter already knows the rumor and must count. With no friendships, the answer is still one person.', { n: 1, friendships: [], start: 0 })
  ],
  'flooded-campsite-trails': [
    rule('direction', 'both', 'FOR each trail [a, b]:\n  add arrows a → b and b → a', 'oneway', 'FOR each trail [a, b]:\n  add only the arrow a → b', 'A trail can be walked in either direction. Reversing your journey must not make a dry two-way trail disappear.', { n: 2, trails: [[0, 1]], flooded: [], start: 1, finish: 0 }),
    rule('block', 'all', 'blocked ← every campsite in flooded', 'finishallowed', 'blocked ← every campsite in flooded except finish', 'The finish is still a campsite: you cannot enter it when flooded. Checking arrival before checking flooding would wrongly allow that final step.', { n: 2, trails: [[0, 1]], flooded: [1], start: 0, finish: 1 }),
    fixed('setup', 'visited ← empty set\npending ← [(start, 0)]\nWHILE pending is not empty:\n  take (camp, steps) from pending\n  IF camp is blocked or already visited: continue\n  add camp to visited'),
    rule('walk', 'all', '  FOR each neighbor of camp:\n    add (neighbor, steps + 1) to pending', 'direct', '  IF steps = 0:\n    FOR each neighbor of camp:\n      add (neighbor, steps + 1) to pending', 'A safe route may use several dry campsites. Continue the search from every dry campsite you reach, not only from the start.', { n: 3, trails: [[0, 1], [1, 2]], flooded: [], start: 0, finish: 2 }),
    fixed('return', 'RETURN whether finish is in visited')
  ],
  'one-color-metro-ride': [
    fixed('setup', 'visited ← empty set'),
    rule('lines', 'both', 'FOR color IN [red, blue]:', 'red', 'FOR color IN [red]:', 'Either color can make a valid trip. A failed red search says nothing about a route that uses only blue tracks.', { n: 2, tracks: [[0, 1]], colors: ['blue'], source: 0, destination: 1 }),
    rule('filter', 'single', '  build a two-way graph using only tracks with this color', 'mixed', '  build a two-way graph using all tracks, whatever their color', 'Each search must keep just one track color. Mixing colors can join two partial routes into a trip that needs a forbidden transfer.', { n: 3, tracks: [[0, 1], [1, 2]], colors: ['red', 'blue'], source: 0, destination: 2 }),
    rule('visited', 'fresh', '  visited ← empty set', 'shared', '  keep visited from the previous color search', 'A station visited using red tracks still needs to be explored using blue tracks. Reset visited between the two separate searches.', { n: 2, tracks: [[0, 1]], colors: ['blue'], source: 0, destination: 1 }),
    fixed('search', '  pending ← [source]\n  WHILE pending is not empty:\n    take station from pending\n    IF station is in visited: continue\n    add station to visited\n    IF station = destination: RETURN true\n    add every neighbor of station to pending\nRETURN false')
  ],
  'villages-without-wells': [
    fixed('graph', 'FOR each path [a, b]:\n  add arrows a → b and b → a\nvisited ← empty set\nanswer ← 0\nFOR village FROM 0 TO n − 1:\n  IF village is in visited: continue\n  cluster ← all villages reachable from village\n  add every village in cluster to visited'),
    rule('isolated', 'keep', '  consider this cluster, even if it has one village', 'skip', '  IF cluster has only one village: continue', 'An isolated village is a whole cluster. If it has no well, it still needs one; no footpaths does not mean no water problem.', { n: 1, paths: [], wells: [] }),
    rule('well', 'any', '  IF no village in cluster is in wells:\n    answer ← answer + 1', 'root', '  IF village is not in wells:\n    answer ← answer + 1', 'One well anywhere in a cluster supplies every village in it. Checking only the first village can demand an unnecessary new well.', { n: 2, paths: [[0, 1]], wells: [1] }),
    fixed('return', 'RETURN answer')
  ],
  'biggest-study-group': [
    fixed('graph', 'FOR each pair of different students a, b:\n  IF worked[a][b] = 1: add an arrow a → b\nvisited ← empty set\nsizes ← empty list\nFOR student FROM 0 TO number of students − 1:\n  IF student is in visited: continue'),
    rule('walk', 'all', '  group ← all students reachable from student, including student\n  remove students already in visited from group', 'direct', '  group ← student and only their direct neighbors\n  remove students already in visited from group', 'A study group follows chains of teammates. A row of the matrix lists only direct teammates, so it can miss students in the same group.', { worked: [[1, 1, 0], [1, 1, 1], [0, 1, 1]] }),
    fixed('count', '  add all students in group to visited\n  append the number of students in group to sizes'),
    rule('combine', 'max', 'RETURN the largest value in sizes', 'last', 'RETURN the last value in sizes', 'Keep the largest group size seen so far. Replacing it with each new group returns the last group, which can be smaller.', { worked: [[1, 1, 0], [1, 1, 0], [0, 0, 1]] })
  ],
  'trusted-courier-networks': [
    rule('threshold', 'inclusive', 'FOR each pair of different offices a, b:\n  IF trust[a][b] ≥ k: add an arrow a → b', 'strict', 'FOR each pair of different offices a, b:\n  IF trust[a][b] > k: add an arrow a → b', 'At least k includes exactly k. Using a strict comparison removes valid secure lines and can split one network into several.', { trust: [[10, 5], [5, 10]], k: 5 }),
    fixed('setup', 'visited ← empty set\nsizes ← empty list\nFOR office FROM 0 TO number of offices − 1:\n  IF office is in visited: continue'),
    rule('walk', 'all', '  network ← all offices reachable from office, including office\n  remove offices already in visited from network', 'direct', '  network ← office and only its direct neighbors\n  remove offices already in visited from network', 'A secure network can use a chain of secure lines. Stopping at direct neighbors can count a distant member as a separate network.', { trust: [[10, 5, 0], [5, 10, 5], [0, 5, 10]], k: 5 }),
    fixed('count', '  add all offices in network to visited\n  append the number of offices in network to sizes'),
    rule('isolated', 'keep', 'RETURN the number of entries in sizes', 'skip', 'RETURN the number of entries in sizes that are greater than 1', 'An office with no secure line is its own network. A one-office group must count even though it has no connection to another office.', { trust: [[10]], k: 5 })
  ]
};
