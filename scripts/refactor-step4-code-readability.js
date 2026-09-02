const fs = require("fs");

const files = [
  "step4-specs-original.json",
  "step4-specs-variant.json",
  "step4-specs-new.json",
];

const overrides = {
  "counting-constellations": `function solve(input) {
  const sky = input.sky;
  const visited = new Set();
  const sideDirections = [[1, 0], [-1, 0], [0, 1], [0, -1]];

  function positionKey(row, column) {
    return row + "," + column;
  }

  function isInBounds(row, column) {
    const rowIsValid = row >= 0 && row < sky.length;
    const columnIsValid = column >= 0 && column < sky[0].length;
    return rowIsValid && columnIsValid;
  }

  function visitConstellation(row, column) {
    if (!isInBounds(row, column)) return;
    const currentPosition = positionKey(row, column);
    if (sky[row][column] !== 1 || visited.has(currentPosition)) return;

    visited.add(currentPosition);
    for (const [rowChange, columnChange] of sideDirections) {
      visitConstellation(row + rowChange, column + columnChange);
    }
  }

  let numberOfConstellations = 0;
  for (let row = 0; row < sky.length; row++) {
    for (let column = 0; column < sky[0].length; column++) {
      const currentPosition = positionKey(row, column);
      const isUnvisitedStar = sky[row][column] === 1 && !visited.has(currentPosition);
      if (isUnvisitedStar) {
        numberOfConstellations++;
        visitConstellation(row, column);
      }
    }
  }
  return numberOfConstellations;
}`,
  "nested-list-weight-sum-ii": `function depthSumInverse(nestedList) {
  function calculateWeightedSum(currentList, currentDepth) {
    let weightedSum = 0;
    for (const item of currentList) {
      if (Array.isArray(item)) {
        const innerListSum = calculateWeightedSum(item, currentDepth + 1);
        weightedSum += innerListSum;
      } else {
        weightedSum += item * currentDepth;
      }
    }
    return weightedSum;
  }

  const topLevelDepth = 1;
  return calculateWeightedSum(nestedList, topLevelDepth);
}`,
  "longest-increasing-path-in-a-matrix": `function longestIncreasingPath(matrix) {
  const numberOfRows = matrix.length;
  const numberOfColumns = matrix[0].length;
  const pathLengthFrom = Array.from(
    { length: numberOfRows },
    () => Array(numberOfColumns).fill(0),
  );
  const allowedDirections = [[1, 0], [0, 1]];

  function findPathLength(row, column) {
    if (pathLengthFrom[row][column] > 0) return pathLengthFrom[row][column];
    let longestLength = 1;
    for (const [rowChange, columnChange] of allowedDirections) {
      const nextRow = row + rowChange;
      const nextColumn = column + columnChange;
      const isInBounds = nextRow < numberOfRows && nextColumn < numberOfColumns;
      if (isInBounds && matrix[nextRow][nextColumn] > matrix[row][column]) {
        const candidateLength = 1 + findPathLength(nextRow, nextColumn);
        longestLength = Math.max(longestLength, candidateLength);
      }
    }
    pathLengthFrom[row][column] = longestLength;
    return longestLength;
  }

  let longestLength = 0;
  for (let row = 0; row < numberOfRows; row++) {
    for (let column = 0; column < numberOfColumns; column++) {
      longestLength = Math.max(longestLength, findPathLength(row, column));
    }
  }
  return longestLength;
}`,
  "number-of-increasing-paths-in-a-grid": `function countPaths(grid) {
  const remainderBase = 1000000007;
  const numberOfRows = grid.length;
  const numberOfColumns = grid[0].length;
  const pathCountFrom = Array.from(
    { length: numberOfRows },
    () => Array(numberOfColumns).fill(0),
  );
  const allowedDirections = [[1, 0], [0, 1]];

  function countPathsFrom(row, column) {
    if (pathCountFrom[row][column] > 0) return pathCountFrom[row][column];
    let numberOfPaths = 1;
    for (const [rowChange, columnChange] of allowedDirections) {
      const nextRow = row + rowChange;
      const nextColumn = column + columnChange;
      const isInBounds = nextRow < numberOfRows && nextColumn < numberOfColumns;
      if (isInBounds && grid[nextRow][nextColumn] > grid[row][column]) {
        numberOfPaths += countPathsFrom(nextRow, nextColumn);
        numberOfPaths %= remainderBase;
      }
    }
    pathCountFrom[row][column] = numberOfPaths;
    return numberOfPaths;
  }

  let totalNumberOfPaths = 0;
  for (let row = 0; row < numberOfRows; row++) {
    for (let column = 0; column < numberOfColumns; column++) {
      totalNumberOfPaths += countPathsFrom(row, column);
      totalNumberOfPaths %= remainderBase;
    }
  }
  return totalNumberOfPaths;
}`,
  "smallest-string-with-swaps": `function smallestStringWithSwaps(s, pairs) {
  const text = s;
  const neighbors = Array.from({ length: text.length }, () => []);
  for (const [firstIndex, secondIndex] of pairs) {
    neighbors[firstIndex].push(secondIndex);
  }

  const visited = new Set();
  const answerCharacters = text.split("");
  for (let startIndex = 0; startIndex < text.length; startIndex++) {
    if (visited.has(startIndex)) continue;
    const connectedIndices = [];
    const stack = [startIndex];
    visited.add(startIndex);

    while (stack.length > 0) {
      const currentIndex = stack.pop();
      connectedIndices.push(currentIndex);
      for (const nextIndex of neighbors[currentIndex]) {
        if (!visited.has(nextIndex)) {
          visited.add(nextIndex);
          stack.push(nextIndex);
        }
      }
    }

    const sortedCharacters = connectedIndices.map((index) => text[index]).sort();
    connectedIndices.sort((first, second) => first - second);
    for (let index = 0; index < connectedIndices.length; index++) {
      answerCharacters[connectedIndices[index]] = sortedCharacters[index];
    }
  }
  return answerCharacters.join("");
}`,
  "perfect-size-campsites": `function solve(input) {
  const park = input.park;
  const visited = new Set();
  const directions = [
    [1, 0], [-1, 0], [0, 1], [0, -1],
    [1, 1], [1, -1], [-1, 1], [-1, -1],
  ];

  function positionKey(row, column) {
    return row + "," + column;
  }

  function isInBounds(row, column) {
    return row >= 0 && row < park.length && column >= 0 && column < park[0].length;
  }

  function findCampsiteArea(row, column) {
    if (!isInBounds(row, column)) return 0;
    const currentPosition = positionKey(row, column);
    if (park[row][column] !== 1 || visited.has(currentPosition)) return 0;
    visited.add(currentPosition);

    let campsiteArea = 1;
    for (const [rowChange, columnChange] of directions) {
      campsiteArea += findCampsiteArea(row + rowChange, column + columnChange);
    }
    return campsiteArea;
  }

  let numberOfPerfectCampsites = 0;
  for (let row = 0; row < park.length; row++) {
    for (let column = 0; column < park[0].length; column++) {
      if (findCampsiteArea(row, column) === input.k) numberOfPerfectCampsites++;
    }
  }
  return numberOfPerfectCampsites;
}`,
};

const sharedRenames = {
  seen: "visited", dirs: "directions", moves: "directions",
  dr: "rowChange", dc: "columnChange", nr: "nextRow", nc: "nextColumn",
  nx: "nextRow", ny: "nextColumn", dx: "xDifference", dy: "yDifference",
  R: "numberOfRows", C: "numberOfColumns", r: "row", c: "column",
  cur: "currentNode", v: "nextNode", s: "startNode",
  a: "firstValue", b: "secondValue", u: "fromNode", w: "weight",
  i: "index", j: "otherIndex", ch: "letter",
  pre: "prerequisite", d2: "distanceSquared", old: "originalColor",
  d: "distanceSquared",
  own: "currentValue", saw: "hasSeenCheckpoint", gas: "nearbyGasCount",
  sr: "startRow", sc: "startColumn", tr: "targetRow", tc: "targetColumn",
  r1: "startRow", c1: "startColumn", r2: "targetRow", c2: "targetColumn",
  x: "xCoordinate", y: "yCoordinate", dfs: "search", best: "largestValue",
};

function renameIdentifiers(code) {
  let readableCode = code
    .replace(/^  const (numberOfNodes|startRow|startColumn) = (?:n|sr|sc|\1);\n/gm, "")
    .replace(/\.numberOfNodes\b/g, ".n")
    .replace(/(?<!\.)\bn\b/g, "numberOfNodes");
  for (const [oldName, newName] of Object.entries(sharedRenames)) {
    const pattern = new RegExp(`\\b${oldName}\\b`, "g");
    readableCode = readableCode.replace(pattern, newName);
  }
  return readableCode;
}

function preservePublicParameterNames(code) {
  const functionHeader = code.match(/^(function\s+\w+\s*\()([^)]*)(\)\s*\{\n)/);
  if (!functionHeader) return code;
  const publicNames = {
    numberOfNodes: "n",
    startRow: "sr",
    startColumn: "sc",
  };
  const aliases = [];
  let readableParameters = functionHeader[2];
  for (const [readableName, publicName] of Object.entries(publicNames)) {
    if (!new RegExp(`\\b${readableName}\\b`).test(readableParameters)) continue;
    readableParameters = readableParameters.replace(new RegExp(`\\b${readableName}\\b`, "g"), publicName);
    aliases.push(`  const ${readableName} = ${publicName};\n`);
  }
  if (!aliases.length) return code;
  const originalHeader = functionHeader[0];
  const restoredHeader = functionHeader[1] + readableParameters + functionHeader[3];
  return code.replace(originalHeader, restoredHeader + aliases.join(""));
}

function removeHiddenBoundsChecks(code) {
  if (!code.includes("?.")) return code;
  let explicitCode = code.replace(
    /board\[row\]\?\.\[column\] !== "E"/g,
    '!isInBounds(board, row, column) || board[row][column] !== "E"',
  );
  explicitCode = explicitCode.replace(
    /(\w+)\[([^\]\n]+)\]\?\.\[([^\]\n]+)\]\s*===\s*("[^"]+"|\d+|[A-Za-z_$][\w$]*)/g,
    "(isInBounds($1, $2, $3) && $1[$2][$3] === $4)",
  );
  explicitCode = explicitCode.replace(
    /(\w+)\[([^\]\n]+)\]\?\.\[([^\]\n]+)\]\s*>\s*(\d+)/g,
    "(isInBounds($1, $2, $3) && $1[$2][$3] > $4)",
  );
  explicitCode = explicitCode.replace(
    /(\w+)\[([^\]\n]+)\]\?\.\[([^\]\n]+)\]\s*!==\s*undefined/g,
    "isInBounds($1, $2, $3)",
  );
  const helper = `  function isInBounds(matrix, row, column) {
    const rowIsValid = row >= 0 && row < matrix.length;
    const columnIsValid = column >= 0 && column < matrix[0].length;
    return rowIsValid && columnIsValid;
  }

`;
  return explicitCode.replace(/^(function\s+\w+\s*\([^)]*\)\s*\{\n)/, "$1" + helper);
}

function removeRecursiveReduce(problemId, code) {
  if (problemId !== "longest-freight-train") return code;
  return code.replace(
    /return \(\n\s*1 \+\n\s*directions\.reduce\(\n\s*\(sum, \[rowChange, columnChange\]\) =>\n\s*sum \+ size\(row \+ rowChange, column \+ columnChange\),\n\s*0,\n\s*\)\n\s*\);/,
    `let trainSize = 1;
    for (const [rowChange, columnChange] of directions) {
      trainSize += size(row + rowChange, column + columnChange);
    }
    return trainSize;`,
  );
}

const boundsHelper = `  function isInBounds(matrix, row, column) {
    const rowIsValid = row >= 0 && row < matrix.length;
    const columnIsValid = column >= 0 && column < matrix[0].length;
    return rowIsValid && columnIsValid;
  }

`;

function removeDuplicateBoundsHelpers(code) {
  const firstHelper = code.indexOf(boundsHelper);
  if (firstHelper === -1) return code;
  let deduplicatedCode = code;
  let duplicateHelper = deduplicatedCode.indexOf(
    boundsHelper,
    firstHelper + boundsHelper.length,
  );
  while (duplicateHelper !== -1) {
    deduplicatedCode =
      deduplicatedCode.slice(0, duplicateHelper) +
      deduplicatedCode.slice(duplicateHelper + boundsHelper.length);
    duplicateHelper = deduplicatedCode.indexOf(
      boundsHelper,
      firstHelper + boundsHelper.length,
    );
  }
  return deduplicatedCode;
}

function addKattisBoundsCheck(problemId, code) {
  if (problemId !== "kattis-getting-gold") return code;
  let safeCode = removeDuplicateBoundsHelpers(code);
  if (!safeCode.includes("function isInBounds(")) {
    safeCode = safeCode.replace(
      /^(function\s+\w+\s*\([^)]*\)\s*\{\n)/,
      "$1" + boundsHelper,
    );
  }
  return safeCode.replace(
    /if \(\n\s*grid\[nextRow\]\[nextColumn\] !== "#"/g,
    'if (\n        isInBounds(grid, nextRow, nextColumn) &&\n        grid[nextRow][nextColumn] !== "#"',
  );
}

function fixReviewerNames(problemId, code) {
  if (problemId === "detonate-the-maximum-bombs") {
    return code.replace(/\bnumberOfNodes\b/g, "nextBomb");
  }
  if (problemId === "usaco-fence-planning") {
    return code.replace(/\blargestValue\b/g, "smallestPerimeter");
  }
  if (problemId === "number-of-islands") {
    return code
      .replace(/\bxCoordinate\b/g, "currentRow")
      .replace(/\byCoordinate\b/g, "currentColumn")
      .replace(/\bxDifference\b/g, "rowChange")
      .replace(/\byDifference\b/g, "columnChange");
  }
  return code;
}

for (const file of files) {
  const problems = JSON.parse(fs.readFileSync(file, "utf8"));
  for (const problem of problems) {
    for (const lessonCase of problem.cases) {
      if (typeof lessonCase.code !== "string") continue;
      const refactored = overrides[problem.id] || renameIdentifiers(lessonCase.code);
      const publicApiCode = preservePublicParameterNames(refactored);
      const explicitBoundsCode = removeHiddenBoundsChecks(publicApiCode);
      const simpleTraversalCode = removeRecursiveReduce(problem.id, explicitBoundsCode);
      const safeKattisCode = addKattisBoundsCheck(problem.id, simpleTraversalCode);
      const namedCode = fixReviewerNames(problem.id, safeKattisCode);
      lessonCase.code = removeDuplicateBoundsHelpers(namedCode);
    }
  }
  fs.writeFileSync(file, JSON.stringify(problems, null, 2) + "\n");
}

console.log("Refactored Step 4 code for beginner readability.");
