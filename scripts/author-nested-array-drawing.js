const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');

// These are teaching rules, not answer keys. Keep input paths only in hidden models.
const rules = {
  'flatten-nested-list-iterator': { min: -1000000, max: 1000000, ordered: true, rule: 'Visit each Array’s children in input order. Finish an inner Array before moving to the next child. Output only numbers.' },
  'nested-list-weight-sum': { min: -100, max: 100, rule: 'The outer Array is depth 0; each arrow adds 1. Multiply each number by its depth, then add the results.' },
  'nested-list-weight-sum-ii': { min: -100, max: 100, rule: 'The outer Array is depth 0; each arrow adds 1. Use the deepest number’s depth for maxDepth. Each number’s weight is maxDepth − depth + 1. Empty arrays do not increase maxDepth.' },
  'busiest-shelf-level': { min: -1000, max: 1000, rule: 'The outer Array is depth 0. Each arrow adds 1 to the depth. Count only number nodes; ties go to the smaller depth.' },
  'coins-on-level-k': { min: -100, max: 100, rule: 'The outer Array is depth 0; each arrow adds 1. Add only the numbers at depth k. If there are none, return 0.' },
  'kth-song-in-playlist': { min: 0, max: 100000, ordered: true, rule: 'Visit each Array’s children in input order. Finish an inner Array before moving on. Count only numbers (songs), starting at 1. Return the k-th song, or −1 if it does not exist.' },
  'top-of-the-pile': { min: -100, max: 100, rule: 'The outer Array is depth 0; each arrow adds 1. Find the shallowest depth with any numbers and add those numbers. A sum of 0 still counts as an occupied depth.' },
  'codewars-array-deep-count': { valueKind: 'literal', rule: 'Count every node except the outer Array. Inner arrays count too, even when empty. Value nodes may contain numbers, quoted text, true, or false.' }
};

for (const group of ['original', 'variant', 'new']) {
  const specsPath = path.join(root, `visual-specs-${group}.json`);
  const lessonsPath = path.join(root, `visual-lessons-${group}.json`);
  const specs = JSON.parse(fs.readFileSync(specsPath));
  const lessons = JSON.parse(fs.readFileSync(lessonsPath));
  for (const spec of specs.filter(p => p.visualKind === 'nested')) {
    const config = rules[spec.id];
    if (!config) throw new Error(`Missing nested-array teaching rule: ${spec.id}`);
    const valueWord = config.valueKind === 'literal' ? 'value' : 'number';
    spec.step1Drawing = {
      mode: 'array-number',
      valueKind: config.valueKind || 'integer',
      ...(config.min === undefined ? {} : { min: config.min, max: config.max }),
      ordered: Boolean(config.ordered),
      instructions: [
        `Make one Array node for every array, including the outer array and empty arrays. Make one ${valueWord} node for each ${valueWord}. Repeated values need separate nodes.`,
        'Draw an arrow from each Array to every element directly inside it. An element can be another Array or a value.',
        config.rule,
        ...(config.ordered ? ['For each Array, draw its arrows in the input’s left-to-right order. Arrow numbers show that order. To fix the order, delete those arrows and reconnect them.'] : [])
      ]
    };
    const lesson = lessons.find(p => p.id === spec.id);
    if (!lesson) throw new Error(`Missing lesson: ${spec.id}`);
    lesson.drawingEditor = structuredClone(spec.step1Drawing);
    if (['nested-list-weight-sum', 'nested-list-weight-sum-ii'].includes(spec.id)) {
      // This edge-count repair previously used 101 despite the stated −100…100 limit.
      const task = lesson.conceptTasks[2];
      task.remedial = JSON.parse(JSON.stringify(task.remedial).replace(/\b101\b/g, '91'));
    }
    for (const task of lesson.conceptTasks) {
      task.input = task.input.replace(/\nFocus on one listed relation\.$/, '');
      for (const choice of task.choices) {
        // Feedback must describe the same nodes that students see.
        choice.feedback = choice.feedback
          .replace(/(?:root)?(?:\[\d+\])*=\[\]|outer array|(?:\[\d+\])+ array/g, 'Array')
          .replace(/(?:root)?(?:\[\d+\])+=(-?\d+|"(?:[^"\\]|\\.)*"|true|false)/g, '$1');
        if (choice.id === 'missing-edge' && /\[\d+\]/.test(choice.feedback)) {
          choice.feedback = 'An arrow from an Array to one of its direct children is missing. Connect every element to the Array directly containing it.';
        }
      }
    }
    const nodeCheck = lesson.conceptTasks.find(t => t.id === 'node-rule');
    if (nodeCheck) {
      nodeCheck.choices.find(c => c.id === 'correct').label = 'Every Array and every separate value.';
      nodeCheck.choices.find(c => c.id === 'wrong').label = 'Every separate value, but no Array nodes.';
    }
    if (spec.id === 'coins-on-level-k') {
      for (const question of [...spec.pictureQuestions, ...lesson.conceptTasks]) {
        if (!question.input?.includes('[[2,[3]],[[5],7],1]')) continue;
        const through = question.choices.find(c => ['six', 'through-k'].includes(c.id));
        if (through) Object.assign(through, { id: 'through-k', label: '`10`', feedback: 'This adds coins from every level up to k: 1 + 2 + 7. Only coins at exactly level 2 belong in this sum.', misconception: 'sum-through-k' });
        const deeper = question.choices.find(c => c.id === 'eight');
        if (deeper) Object.assign(deeper, { feedback: 'This adds 3 and 5 at level 3, one level deeper than k = 2.', misconception: 'off-by-one-deep' });
      }
    }
    if (spec.id === 'kth-song-in-playlist') {
      const positionChoice = lesson.conceptTasks.find(t => t.id === 'concept-bug').choices.find(c => c.id === 'one');
      positionChoice.feedback = 'This returns the position k = 1 instead of the song ID at that position. The first song is 2.';
      positionChoice.misconception = 'return-position-instead-of-song';
    }
    if (spec.id === 'busiest-shelf-level') {
      lesson.conceptTasks.find(t => t.id === 'concept-counterexample').choices.find(c => c.id === 'three').feedback = 'There are no numbers at depth 3. An empty Array adds no items to the count.';
    }
  }
  fs.writeFileSync(specsPath, JSON.stringify(specs, null, 2) + '\n');
  fs.writeFileSync(lessonsPath, JSON.stringify(lessons, null, 2) + '\n');
}
console.log(`Authored Array / value drawing for ${Object.keys(rules).length} nested-array lessons.`);
