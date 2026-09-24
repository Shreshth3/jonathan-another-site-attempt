window.PROBLEMS = [
  {
    "id": "flood-fill",
    "title": "Flood Fill",
    "category": "new",
    "sourceName": "LeetCode",
    "sourceLink": "https://leetcode.com/problems/flood-fill/",
    "difficulty": "Easy",
    "statement": "You are given a picture as a grid of numbers called `image`, where `image[i][j]` is the color of one pixel.\n\nYou are also given a starting pixel at row `sr` and column `sc`, and a new color `color`.\n\nDo a \"paint bucket\" fill, just like in a drawing app:\n\n- Change the starting pixel to the new color.\n- Then keep spreading: any pixel that touches an already-filled pixel up, down, left, or right, AND originally had the same color as the starting pixel, also gets the new color.\n- Diagonal touching does NOT count.\n\nReturn the image after the fill is finished.",
    "examples": [
      {
        "input": "image = [[1,1,1],[1,1,0],[1,0,1]], sr = 1, sc = 1, color = 2",
        "output": "[[2,2,2],[2,2,0],[2,0,1]]",
        "explanation": "Starting at the center (row 1, col 1), every 1 you can reach by up/down/left/right steps through 1s gets painted 2. The 1 in the bottom-right corner only touches the blob diagonally, so it stays 1."
      },
      {
        "input": "image = [[0,0,0],[0,0,0]], sr = 0, sc = 0, color = 0",
        "output": "[[0,0,0],[0,0,0]]",
        "explanation": "The new color is the same as the starting pixel's color, so the image stays exactly the same."
      }
    ],
    "constraints": [
      "1 <= image.length, image[0].length <= 50",
      "0 <= image[i][j], color <= 65535",
      "0 <= sr < image.length and 0 <= sc < image[0].length"
    ],
    "functionName": "floodFill",
    "solution": "const getPositionString = (row, col) => `${row}, ${col}`;\nconst directions = [\n    [0, 1],\n    [1, 0],\n    [0, -1],\n    [-1, 0],\n];\n\nconst isInBounds = (grid, row, col) => {\n    const numRows = grid.length;\n    const numCols = grid[0].length;\n\n    const rowInBounds = row >= 0 && row < numRows;\n    const colInBounds = col >= 0 && col < numCols;\n\n    return rowInBounds && colInBounds;\n};\n\n// CONTRACT for fillConnectedPixels(image, row, col, startingColor, newColor, visited):\n//     when this call returns, the pixel at (`row`, `col`) and every\n//     pixel connected to it that had `startingColor` is repainted to\n//     `newColor` and is in the visited set.\nconst fillConnectedPixels = (image, row, col, startingColor, newColor, visited) => {\n    // Base cases\n    if (!isInBounds(image, row, col)) return;\n\n    const curPositionString = getPositionString(row, col);\n    if (visited.has(curPositionString)) return;\n\n    // Only pixels that originally matched the starting pixel's color\n    // are part of the fill region.\n    if (image[row][col] !== startingColor) return;\n\n    // Process node\n    visited.add(curPositionString);\n    image[row][col] = newColor;\n\n    // Recurse on neighbors\n    for (const direction of directions) {\n        const [rowChange, colChange] = direction;\n\n        const newRow = row + rowChange;\n        const newCol = col + colChange;\n\n        // The recursive leap of faith, one level down: this call has\n        // the SAME contract — when it returns, the neighbor pixel and\n        // everything connected to it that had `startingColor` is\n        // repainted and in the visited set. Trust it, do not trace it.\n        // This function already repainted (`row`, `col`) and put it into\n        // visited, and each neighbor's contract covers the rest —\n        // together, that is this function's full contract, kept.\n        fillConnectedPixels(image, newRow, newCol, startingColor, newColor, visited);\n    }\n};\n\nconst floodFill = (image, sr, sc, color) => {\n    const startingColor = image[sr][sc];\n\n    // If the new color equals the starting color, the fill changes nothing.\n    // Returning early also guards against re-visiting already-painted pixels.\n    if (startingColor === color) return image;\n\n    const visited = new Set();\n    // The recursive leap of faith: trust the contract. When this\n    // call returns, the starting pixel and every pixel connected to it\n    // that had `startingColor` is repainted to the new color. We do not\n    // trace inside; we just return the finished image.\n    fillConnectedPixels(image, sr, sc, startingColor, color, visited);\n\n    return image;\n};\n",
    "tests": [
      {
        "args": [
          [
            [
              1,
              1,
              1
            ],
            [
              1,
              1,
              0
            ],
            [
              1,
              0,
              1
            ]
          ],
          1,
          1,
          2
        ],
        "expected": [
          [
            2,
            2,
            2
          ],
          [
            2,
            2,
            0
          ],
          [
            2,
            0,
            1
          ]
        ]
      },
      {
        "args": [
          [
            [
              0,
              0,
              0
            ],
            [
              0,
              0,
              0
            ]
          ],
          0,
          0,
          0
        ],
        "expected": [
          [
            0,
            0,
            0
          ],
          [
            0,
            0,
            0
          ]
        ]
      },
      {
        "args": [
          [
            [
              5
            ]
          ],
          0,
          0,
          3
        ],
        "expected": [
          [
            3
          ]
        ]
      },
      {
        "args": [
          [
            [
              0,
              1
            ],
            [
              1,
              0
            ]
          ],
          0,
          0,
          7
        ],
        "expected": [
          [
            7,
            1
          ],
          [
            1,
            0
          ]
        ]
      },
      {
        "args": [
          [
            [
              2,
              2
            ],
            [
              2,
              2
            ]
          ],
          1,
          1,
          9
        ],
        "expected": [
          [
            9,
            9
          ],
          [
            9,
            9
          ]
        ]
      }
    ],
    "runner": {
      "kind": "function",
      "parameterNames": [
        "image",
        "sr",
        "sc",
        "color"
      ]
    }
  },
  {
    "id": "max-area-of-island",
    "title": "Max Area of Island",
    "category": "new",
    "sourceName": "LeetCode",
    "sourceLink": "https://leetcode.com/problems/max-area-of-island/",
    "difficulty": "Medium",
    "statement": "You are given a grid of 0s and 1s called `grid`. A `1` is land and a `0` is water.\n\nAn island is a group of land cells that are connected up, down, left, or right (not diagonally).\n\nThe area of an island is how many cells it contains.\n\nReturn the area of the biggest island in the grid. If there is no land at all, return 0.",
    "examples": [
      {
        "input": "grid = [[0,1,0,0],[1,1,0,1],[0,0,0,1],[0,1,1,1]]",
        "output": "5",
        "explanation": "There are two islands. One is the 3-cell island in the top-left (cells (0,1), (1,0), (1,1)). The other has 5 cells: (1,3), (2,3), (3,3), (3,2), (3,1). The biggest area is 5."
      },
      {
        "input": "grid = [[0,0],[0,0]]",
        "output": "0",
        "explanation": "There is no land anywhere, so the answer is 0."
      }
    ],
    "constraints": [
      "1 <= grid.length, grid[0].length <= 50",
      "grid[i][j] is 0 or 1"
    ],
    "functionName": "maxAreaOfIsland",
    "solution": "const LAND = 1;\n\nconst getPositionString = (row, col) => `${row}, ${col}`;\nconst directions = [\n    [0, 1],\n    [1, 0],\n    [0, -1],\n    [-1, 0],\n];\n\nconst isInBounds = (grid, row, col) => {\n    const numRows = grid.length;\n    const numCols = grid[0].length;\n\n    const rowInBounds = row >= 0 && row < numRows;\n    const colInBounds = col >= 0 && col < numCols;\n\n    return rowInBounds && colInBounds;\n};\n\n// CONTRACT for getIslandArea(grid, row, col, visited):\n//     when this call returns, every land cell of the island\n//     containing (`row`, `col`) is in the visited set, and the\n//     returned value is the number of cells in that island. Water,\n//     out-of-bounds, and already-visited cells return 0.\nconst getIslandArea = (grid, row, col, visited) => {\n    // Base cases\n    if (!isInBounds(grid, row, col)) return 0;\n\n    const curPositionString = getPositionString(row, col);\n    if (visited.has(curPositionString)) return 0;\n\n    if (grid[row][col] !== LAND) return 0;\n\n    // Process node\n    visited.add(curPositionString);\n\n    // This cell contributes 1 to the island's area.\n    let islandArea = 1;\n\n    // Recurse on neighbors\n    for (const direction of directions) {\n        const [rowChange, colChange] = direction;\n\n        const newRow = row + rowChange;\n        const newCol = col + colChange;\n\n        // The recursive leap of faith, one level down: this call has\n        // the SAME contract — when it returns, the neighbor's side of\n        // the island is counted and its cells are in the visited set.\n        // Trust it, do not trace it. This cell's own 1 plus each\n        // neighbor's guaranteed count add up to exactly this function's\n        // contract: the whole island, counted once.\n        islandArea += getIslandArea(grid, newRow, newCol, visited);\n    }\n\n    return islandArea;\n};\n\nconst maxAreaOfIsland = (grid) => {\n    const numRows = grid.length;\n    const numCols = grid[0].length;\n\n    let maxIslandArea = 0;\n    const visited = new Set();\n\n    for (let row = 0; row < numRows; row++) {\n        for (let col = 0; col < numCols; col++) {\n            const curPositionString = getPositionString(row, col);\n\n            if (visited.has(curPositionString)) continue;\n\n            const terrainType = grid[row][col];\n            if (terrainType !== LAND) continue;\n\n            // The recursive leap of faith: trust the contract. When this\n            // call returns, islandArea is the full size of this island and\n            // all of its cells are in the visited set, so the loop can never\n            // count this island again. We do not trace inside; we just\n            // compare it to the running maximum and move on.\n            const islandArea = getIslandArea(grid, row, col, visited);\n            maxIslandArea = Math.max(maxIslandArea, islandArea);\n        }\n    }\n\n    return maxIslandArea;\n};\n",
    "tests": [
      {
        "args": [
          [
            [
              0,
              1,
              0,
              0
            ],
            [
              1,
              1,
              0,
              1
            ],
            [
              0,
              0,
              0,
              1
            ],
            [
              0,
              1,
              1,
              1
            ]
          ]
        ],
        "expected": 5
      },
      {
        "args": [
          [
            [
              0,
              0
            ],
            [
              0,
              0
            ]
          ]
        ],
        "expected": 0
      },
      {
        "args": [
          [
            [
              1,
              1,
              0,
              0,
              0
            ],
            [
              1,
              1,
              0,
              0,
              0
            ],
            [
              0,
              0,
              0,
              1,
              1
            ],
            [
              0,
              0,
              0,
              1,
              1
            ]
          ]
        ],
        "expected": 4
      },
      {
        "args": [
          [
            [
              1
            ]
          ]
        ],
        "expected": 1
      },
      {
        "args": [
          [
            [
              1,
              1
            ],
            [
              1,
              1
            ]
          ]
        ],
        "expected": 4
      }
    ],
    "runner": {
      "kind": "function",
      "parameterNames": [
        "grid"
      ]
    }
  },
  {
    "id": "employee-importance",
    "title": "Employee Importance",
    "category": "new",
    "sourceName": "LeetCode",
    "sourceLink": "https://leetcode.com/problems/employee-importance/",
    "difficulty": "Easy",
    "statement": "A company stores its staff as an array `employees`. Each employee is an object with three fields:\n\n- `id`: the employee's unique id number\n- `importance`: that employee's importance score (it can be negative)\n- `subordinates`: an array of the ids of the people who report DIRECTLY to this employee\n\nYou are also given a number `id`.\n\nReturn the total importance of that employee PLUS everyone under them — their direct reports, their reports' reports, and so on all the way down.",
    "examples": [
      {
        "input": "employees = [{id: 1, importance: 5, subordinates: [2, 3]}, {id: 2, importance: 3, subordinates: []}, {id: 3, importance: 3, subordinates: []}], id = 1",
        "output": "11",
        "explanation": "Employee 1 has importance 5 and two direct reports, employees 2 and 3, each with importance 3. Total: 5 + 3 + 3 = 11."
      },
      {
        "input": "employees = [{id: 5, importance: -3, subordinates: [6]}, {id: 6, importance: 2, subordinates: []}], id = 5",
        "output": "-1",
        "explanation": "Employee 5 has importance -3 and one report (employee 6, importance 2). Total: -3 + 2 = -1."
      }
    ],
    "constraints": [
      "1 <= employees.length <= 2000",
      "All employee ids are unique, and id is always a real employee's id",
      "-100 <= importance <= 100",
      "The reporting structure is a tree (nobody reports to their own subordinate)"
    ],
    "functionName": "getImportance",
    "solution": "const buildEmployeeMap = (employees) => {\n    const employeeMap = {};\n\n    for (const employee of employees) {\n        employeeMap[employee.id] = employee;\n    }\n\n    return employeeMap;\n};\n\n// CONTRACT for getTotalImportance(employeeMap, employeeId, visited):\n//     when this call returns, the returned value is the importance\n//     of employee `employeeId` plus the importance of every employee\n//     below them (subordinates, their subordinates, and so on), and\n//     all of those ids are in the visited set.\n//     An id that is not in the map, or already in the visited set,\n//     returns 0.\nconst getTotalImportance = (employeeMap, employeeId, visited) => {\n    // Base cases\n    const employeeInMap = employeeMap.hasOwnProperty(employeeId);\n    if (!employeeInMap) return 0;\n\n    if (visited.has(employeeId)) return 0;\n\n    // Process node\n    visited.add(employeeId);\n\n    const employee = employeeMap[employeeId];\n    let totalImportance = employee.importance;\n\n    // Recurse on neighbors\n    // Each subordinate id is a \"neighbor\" of this employee in the\n    // reporting tree, so we add up their whole subtrees too.\n    for (const subordinateId of employee.subordinates) {\n        // The recursive leap of faith, one level down: this call has\n        // the SAME contract — when it returns, its value is the\n        // subordinate's importance plus everyone below them, and their\n        // ids are in the visited set. Trust it, do not trace it. This\n        // employee's own importance plus each subordinate's guaranteed\n        // total is exactly this function's contract, kept.\n        totalImportance += getTotalImportance(employeeMap, subordinateId, visited);\n    }\n\n    return totalImportance;\n};\n\nconst getImportance = (employees, id) => {\n    const employeeMap = buildEmployeeMap(employees);\n\n    // The hierarchy is a tree, but tracking visited ids keeps us safe\n    // even if the data accidentally contained a cycle.\n    const visited = new Set();\n\n    // The recursive leap of faith: trust the contract. When this\n    // call returns, its value is the importance of employee `id` plus\n    // the importance of everyone below them in the hierarchy. We do\n    // not trace inside; we just return that total.\n    return getTotalImportance(employeeMap, id, visited);\n};\n",
    "tests": [
      {
        "args": [
          [
            {
              "id": 1,
              "importance": 5,
              "subordinates": [
                2,
                3
              ]
            },
            {
              "id": 2,
              "importance": 3,
              "subordinates": []
            },
            {
              "id": 3,
              "importance": 3,
              "subordinates": []
            }
          ],
          1
        ],
        "expected": 11
      },
      {
        "args": [
          [
            {
              "id": 5,
              "importance": -3,
              "subordinates": [
                6
              ]
            },
            {
              "id": 6,
              "importance": 2,
              "subordinates": []
            }
          ],
          5
        ],
        "expected": -1
      },
      {
        "args": [
          [
            {
              "id": 1,
              "importance": 10,
              "subordinates": [
                2
              ]
            },
            {
              "id": 2,
              "importance": 5,
              "subordinates": [
                3
              ]
            },
            {
              "id": 3,
              "importance": 2,
              "subordinates": []
            }
          ],
          1
        ],
        "expected": 17
      },
      {
        "args": [
          [
            {
              "id": 1,
              "importance": 10,
              "subordinates": [
                2
              ]
            },
            {
              "id": 2,
              "importance": 5,
              "subordinates": [
                3
              ]
            },
            {
              "id": 3,
              "importance": 2,
              "subordinates": []
            }
          ],
          2
        ],
        "expected": 7
      },
      {
        "args": [
          [
            {
              "id": 7,
              "importance": 42,
              "subordinates": []
            }
          ],
          7
        ],
        "expected": 42
      }
    ],
    "runner": {
      "kind": "function",
      "parameterNames": [
        "employees",
        "id"
      ]
    }
  },
  {
    "id": "count-sub-islands",
    "title": "Count Sub Islands",
    "category": "new",
    "sourceName": "LeetCode",
    "sourceLink": "https://leetcode.com/problems/count-sub-islands/",
    "difficulty": "Medium",
    "statement": "You are given two grids of the same size, `grid1` and `grid2`. In both, `1` is land and `0` is water, and an island is a group of 1s connected up, down, left, or right.\n\nAn island in `grid2` is called a \"sub-island\" if EVERY one of its cells is also a land cell in `grid1` (at the same positions).\n\nReturn how many islands of `grid2` are sub-islands.",
    "examples": [
      {
        "input": "grid1 = [[1,1,0],[0,1,1],[0,0,0]], grid2 = [[1,0,0],[0,1,1],[0,1,0]]",
        "output": "1",
        "explanation": "grid2 has two islands: {(0,0)} and {(1,1), (1,2), (2,1)}. The first one sits on land in grid1 (grid1[0][0] = 1), so it is a sub-island. The second fails because grid1[2][1] = 0. Answer: 1."
      },
      {
        "input": "grid1 = [[1,1],[1,1]], grid2 = [[1,0],[0,1]]",
        "output": "2",
        "explanation": "grid2 has two single-cell islands, at (0,0) and (1,1). grid1 is all land, so both are sub-islands. Answer: 2."
      }
    ],
    "constraints": [
      "1 <= rows, cols <= 100",
      "grid1 and grid2 have the same dimensions",
      "Every cell is 0 or 1"
    ],
    "functionName": "countSubIslands",
    "solution": "const LAND = 1;\n\nconst getPositionString = (row, col) => `${row}, ${col}`;\nconst directions = [\n    [0, 1],\n    [1, 0],\n    [0, -1],\n    [-1, 0],\n];\n\nconst isInBounds = (grid, row, col) => {\n    const numRows = grid.length;\n    const numCols = grid[0].length;\n\n    const rowInBounds = row >= 0 && row < numRows;\n    const colInBounds = col >= 0 && col < numCols;\n\n    return rowInBounds && colInBounds;\n};\n\n// Returns true if every cell of this grid2 island also sits on land in grid1.\n// CONTRACT for exploreIsland(grid1, grid2, row, col, visited):\n//     when this call returns, every cell of the grid2 island\n//     containing (`row`, `col`) is in the visited set, and the\n//     returned value is true only when every one of those cells\n//     also sits on land in grid1. Water, out-of-bounds, and\n//     already-visited cells return true because they break no rule.\nconst exploreIsland = (grid1, grid2, row, col, visited) => {\n    // Base cases\n    if (!isInBounds(grid2, row, col)) return true;\n\n    const curPositionString = getPositionString(row, col);\n    if (visited.has(curPositionString)) return true;\n\n    if (grid2[row][col] !== LAND) return true;\n\n    // Process node\n    visited.add(curPositionString);\n\n    // The two grids are the same size, so we can check grid1 directly.\n    let islandIsSubIsland = grid1[row][col] === LAND;\n\n    // Recurse on neighbors\n    for (const direction of directions) {\n        const [rowChange, colChange] = direction;\n\n        const newRow = row + rowChange;\n        const newCol = col + colChange;\n\n        // The recursive leap of faith, one level down: this call has\n        // the SAME contract — when it returns, the neighbor's side of\n        // the island is in the visited set, and its answer says whether\n        // that side passes the land-in-grid1 test. Trust it, do not\n        // trace it. This cell's own check plus each neighbor's\n        // guaranteed answer combine into exactly this function's\n        // contract, kept.\n        // Recurse BEFORE checking the flag so the whole island still gets\n        // marked as visited, even after we know it fails the sub-island test.\n        const neighborSideIsSubIsland = exploreIsland(grid1, grid2, newRow, newCol, visited);\n\n        if (!neighborSideIsSubIsland) islandIsSubIsland = false;\n    }\n\n    return islandIsSubIsland;\n};\n\nconst countSubIslands = (grid1, grid2) => {\n    const numRows = grid2.length;\n    const numCols = grid2[0].length;\n\n    let numSubIslands = 0;\n    const visited = new Set();\n\n    for (let row = 0; row < numRows; row++) {\n        for (let col = 0; col < numCols; col++) {\n            const curPositionString = getPositionString(row, col);\n\n            if (visited.has(curPositionString)) continue;\n\n            const terrainType = grid2[row][col];\n            if (terrainType !== LAND) continue;\n\n            // The recursive leap of faith: trust the contract. When this\n            // call returns, the whole island is in the visited set — so the\n            // loop never sees it again — and the answer tells us whether\n            // every cell of it sits on land in grid1. We do not trace\n            // inside; we just count the island if it passed.\n            const islandIsSubIsland = exploreIsland(grid1, grid2, row, col, visited);\n            if (islandIsSubIsland) numSubIslands++;\n        }\n    }\n\n    return numSubIslands;\n};\n",
    "tests": [
      {
        "args": [
          [
            [
              1,
              1,
              0
            ],
            [
              0,
              1,
              1
            ],
            [
              0,
              0,
              0
            ]
          ],
          [
            [
              1,
              0,
              0
            ],
            [
              0,
              1,
              1
            ],
            [
              0,
              1,
              0
            ]
          ]
        ],
        "expected": 1
      },
      {
        "args": [
          [
            [
              1,
              1
            ],
            [
              1,
              1
            ]
          ],
          [
            [
              1,
              0
            ],
            [
              0,
              1
            ]
          ]
        ],
        "expected": 2
      },
      {
        "args": [
          [
            [
              1,
              1,
              1,
              0,
              0
            ],
            [
              0,
              1,
              1,
              1,
              1
            ],
            [
              0,
              0,
              0,
              0,
              0
            ],
            [
              1,
              0,
              0,
              0,
              0
            ],
            [
              1,
              1,
              0,
              1,
              1
            ]
          ],
          [
            [
              1,
              1,
              1,
              0,
              0
            ],
            [
              0,
              0,
              1,
              1,
              1
            ],
            [
              0,
              1,
              0,
              0,
              0
            ],
            [
              1,
              0,
              1,
              1,
              0
            ],
            [
              0,
              1,
              0,
              1,
              0
            ]
          ]
        ],
        "expected": 3
      },
      {
        "args": [
          [
            [
              1,
              0
            ],
            [
              0,
              0
            ]
          ],
          [
            [
              1,
              1
            ],
            [
              0,
              0
            ]
          ]
        ],
        "expected": 0
      },
      {
        "args": [
          [
            [
              1
            ]
          ],
          [
            [
              0
            ]
          ]
        ],
        "expected": 0
      }
    ],
    "runner": {
      "kind": "function",
      "parameterNames": [
        "grid1",
        "grid2"
      ]
    }
  },
  {
    "id": "maximum-number-of-fish-in-a-grid",
    "title": "Maximum Number of Fish in a Grid",
    "category": "new",
    "sourceName": "LeetCode",
    "sourceLink": "https://leetcode.com/problems/maximum-number-of-fish-in-a-grid/",
    "difficulty": "Medium",
    "statement": "You are given an `m x n` grid describing a pond. If `grid[i][j] == 0`, that cell is land and cannot be entered. If `grid[i][j] > 0`, that cell is water and currently holds exactly that many fish.\n\nA fisher chooses any water cell to start from. On each cell they visit, they catch **all** of its fish, and they may then move up, down, left, or right to a neighboring water cell and repeat.\n\nReturn the largest total number of fish the fisher can catch if they pick the best possible starting cell. If the grid has no water cells at all, return `0`.",
    "examples": [
      {
        "input": "grid = [[0,2,1,0],[4,0,0,3],[1,0,0,4],[0,3,2,0]]",
        "output": "7",
        "explanation": "The best pool of connected water cells is on the right side: the cells holding 3 and 4 fish are vertically adjacent, giving 3 + 4 = 7. The other pools total 5 (4+1 on the left), 3 (2+1 on top), and 5 (3+2 on the bottom)."
      },
      {
        "input": "grid = [[1,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,1]]",
        "output": "1",
        "explanation": "The only water cells are the two opposite corners. Each holds 1 fish and is not connected to any other water, so the best possible catch is 1."
      }
    ],
    "constraints": [
      "m == grid.length, n == grid[i].length, 1 <= m, n <= 10",
      "0 <= grid[i][j] <= 10"
    ],
    "functionName": "findMaxFish",
    "solution": "const LAND = 0;\n\nconst getPositionString = (row, col) => `${row}, ${col}`;\nconst directions = [\n    [0, 1],\n    [1, 0],\n    [0, -1],\n    [-1, 0],\n];\n\nconst isInBounds = (grid, row, col) => {\n    const numRows = grid.length;\n    const numCols = grid[0].length;\n\n    const rowInBounds = row >= 0 && row < numRows;\n    const colInBounds = col >= 0 && col < numCols;\n\n    return rowInBounds && colInBounds;\n};\n\n// CONTRACT for catchFishInPool(grid, row, col, visited):\n//     when this call returns, every water cell of the pool\n//     containing (`row`, `col`) is in the visited set, and the\n//     returned value is the total number of fish in that pool.\n//     Land, out-of-bounds, and already-visited cells return 0.\nconst catchFishInPool = (grid, row, col, visited) => {\n    // Base cases\n    if (!isInBounds(grid, row, col)) return 0;\n\n    const curPositionString = getPositionString(row, col);\n    if (visited.has(curPositionString)) return 0;\n\n    if (grid[row][col] === LAND) return 0;\n\n    // Process node\n    visited.add(curPositionString);\n\n    // Unlike a plain area count, each cell contributes its fish count.\n    let totalFishCaught = grid[row][col];\n\n    // Recurse on neighbors\n    for (const direction of directions) {\n        const [rowChange, colChange] = direction;\n\n        const newRow = row + rowChange;\n        const newCol = col + colChange;\n\n        // The recursive leap of faith, one level down: this call has\n        // the SAME contract — when it returns, the neighbor's side of\n        // the pool is in the visited set and its fish are fully counted.\n        // Trust it, do not trace it. This cell's own fish plus each\n        // neighbor's guaranteed total add up to exactly this function's\n        // contract: every fish in the pool, counted once.\n        totalFishCaught += catchFishInPool(grid, newRow, newCol, visited);\n    }\n\n    return totalFishCaught;\n};\n\nconst findMaxFish = (grid) => {\n    const numRows = grid.length;\n    const numCols = grid[0].length;\n\n    let maxFishCaught = 0;\n    const visited = new Set();\n\n    for (let row = 0; row < numRows; row++) {\n        for (let col = 0; col < numCols; col++) {\n            const curPositionString = getPositionString(row, col);\n\n            if (visited.has(curPositionString)) continue;\n\n            const terrainType = grid[row][col];\n            if (terrainType === LAND) continue;\n\n            // The recursive leap of faith: trust the contract. When this\n            // call returns, fishCaught is every fish in this pool and all of\n            // the pool's cells are in the visited set, so the loop can never\n            // count this pool again. We do not trace inside; we just compare\n            // it to the running maximum and move on.\n            const fishCaught = catchFishInPool(grid, row, col, visited);\n            maxFishCaught = Math.max(maxFishCaught, fishCaught);\n        }\n    }\n\n    return maxFishCaught;\n};\n",
    "tests": [
      {
        "args": [
          [
            [
              0,
              2,
              1,
              0
            ],
            [
              4,
              0,
              0,
              3
            ],
            [
              1,
              0,
              0,
              4
            ],
            [
              0,
              3,
              2,
              0
            ]
          ]
        ],
        "expected": 7
      },
      {
        "args": [
          [
            [
              1,
              0,
              0,
              0
            ],
            [
              0,
              0,
              0,
              0
            ],
            [
              0,
              0,
              0,
              0
            ],
            [
              0,
              0,
              0,
              1
            ]
          ]
        ],
        "expected": 1
      },
      {
        "args": [
          [
            [
              0,
              0
            ],
            [
              0,
              0
            ]
          ]
        ],
        "expected": 0
      },
      {
        "args": [
          [
            [
              1,
              2
            ],
            [
              3,
              4
            ]
          ]
        ],
        "expected": 10
      },
      {
        "args": [
          [
            [
              7
            ]
          ]
        ],
        "expected": 7
      }
    ],
    "runner": {
      "kind": "function",
      "parameterNames": [
        "grid"
      ]
    }
  },
  {
    "id": "find-all-groups-of-farmland",
    "title": "Find All Groups of Farmland",
    "category": "new",
    "sourceName": "LeetCode",
    "sourceLink": "https://leetcode.com/problems/find-all-groups-of-farmland/",
    "difficulty": "Medium",
    "statement": "You are given an `m x n` binary grid `land` where `0` is forested land and `1` is farmland. The farmland comes in **groups**: connected patches of 1s that are guaranteed to form perfect axis-aligned rectangles. Different groups never touch each other up/down/left/right.\n\nFor each group, report a 4-number array `[r1, c1, r2, c2]`, where `(r1, c1)` is the group's top-left cell and `(r2, c2)` is its bottom-right cell. Return the list of arrays for all groups, in any order.",
    "examples": [
      {
        "input": "land = [[1,0,0],[0,1,1],[0,1,1]]",
        "output": "[[0,0,0,0],[1,1,2,2]]",
        "explanation": "There are two rectangular groups: the single cell at (0,0), reported as [0,0,0,0], and the 2 x 2 patch whose top-left corner is (1,1) and bottom-right corner is (2,2), reported as [1,1,2,2]."
      },
      {
        "input": "land = [[1,1],[1,1]]",
        "output": "[[0,0,1,1]]",
        "explanation": "The entire grid is one rectangular group of farmland, stretching from corner (0,0) to corner (1,1)."
      }
    ],
    "constraints": [
      "m == land.length, n == land[i].length, 1 <= m, n <= 300",
      "land[i][j] is 0 or 1",
      "Every group of farmland is rectangular, and no two different groups are adjacent"
    ],
    "functionName": "findFarmland",
    "solution": "const FARMLAND = 1;\n\nconst getPositionString = (row, col) => `${row}, ${col}`;\nconst directions = [\n    [0, 1],\n    [1, 0],\n    [0, -1],\n    [-1, 0],\n];\n\nconst isInBounds = (grid, row, col) => {\n    const numRows = grid.length;\n    const numCols = grid[0].length;\n\n    const rowInBounds = row >= 0 && row < numRows;\n    const colInBounds = col >= 0 && col < numCols;\n\n    return rowInBounds && colInBounds;\n};\n\n// CONTRACT for exploreGroup(land, row, col, visited, boundingBox):\n//     when this call returns, every farmland cell of the group\n//     containing (`row`, `col`) is in the visited set, and\n//     `boundingBox` has been stretched to cover every one of\n//     those cells.\nconst exploreGroup = (land, row, col, visited, boundingBox) => {\n    // Base cases\n    if (!isInBounds(land, row, col)) return;\n\n    const curPositionString = getPositionString(row, col);\n    if (visited.has(curPositionString)) return;\n\n    if (land[row][col] !== FARMLAND) return;\n\n    // Process node\n    visited.add(curPositionString);\n\n    // Grow the bounding box so it covers this cell. Since each group is a\n    // perfect rectangle, the box's corners end up being the group's corners.\n    boundingBox.minRow = Math.min(boundingBox.minRow, row);\n    boundingBox.minCol = Math.min(boundingBox.minCol, col);\n    boundingBox.maxRow = Math.max(boundingBox.maxRow, row);\n    boundingBox.maxCol = Math.max(boundingBox.maxCol, col);\n\n    // Recurse on neighbors\n    for (const direction of directions) {\n        const [rowChange, colChange] = direction;\n\n        const newRow = row + rowChange;\n        const newCol = col + colChange;\n\n        // The recursive leap of faith, one level down: this call has\n        // the SAME contract — when it returns, the neighbor's side of\n        // the group is in the visited set and the box covers it. Trust\n        // it, do not trace it. This function already put (`row`, `col`)\n        // into visited and stretched the box over it, and each\n        // neighbor's contract covers the rest — together, that is this\n        // function's full contract, kept.\n        exploreGroup(land, newRow, newCol, visited, boundingBox);\n    }\n};\n\nconst findFarmland = (land) => {\n    const numRows = land.length;\n    const numCols = land[0].length;\n\n    const allGroups = [];\n    const visited = new Set();\n\n    for (let row = 0; row < numRows; row++) {\n        for (let col = 0; col < numCols; col++) {\n            const curPositionString = getPositionString(row, col);\n\n            if (visited.has(curPositionString)) continue;\n\n            const terrainType = land[row][col];\n            if (terrainType !== FARMLAND) continue;\n\n            // Start the box as just this cell; the DFS stretches it out.\n            const boundingBox = {\n                minRow: row,\n                minCol: col,\n                maxRow: row,\n                maxCol: col,\n            };\n\n            // The recursive leap of faith: trust the contract. When this\n            // call returns, the whole group is in the visited set and\n            // boundingBox holds its exact corners. We do not trace inside;\n            // we just read the corners off the box and record them.\n            exploreGroup(land, row, col, visited, boundingBox);\n\n            allGroups.push([\n                boundingBox.minRow,\n                boundingBox.minCol,\n                boundingBox.maxRow,\n                boundingBox.maxCol,\n            ]);\n        }\n    }\n\n    return allGroups;\n};\n",
    "tests": [
      {
        "args": [
          [
            [
              1,
              0,
              0
            ],
            [
              0,
              1,
              1
            ],
            [
              0,
              1,
              1
            ]
          ]
        ],
        "expected": [
          [
            0,
            0,
            0,
            0
          ],
          [
            1,
            1,
            2,
            2
          ]
        ],
        "unordered": true
      },
      {
        "args": [
          [
            [
              1,
              1
            ],
            [
              1,
              1
            ]
          ]
        ],
        "expected": [
          [
            0,
            0,
            1,
            1
          ]
        ],
        "unordered": true
      },
      {
        "args": [
          [
            [
              0
            ]
          ]
        ],
        "expected": []
      },
      {
        "args": [
          [
            [
              0,
              1
            ],
            [
              1,
              0
            ]
          ]
        ],
        "expected": [
          [
            0,
            1,
            0,
            1
          ],
          [
            1,
            0,
            1,
            0
          ]
        ],
        "unordered": true
      },
      {
        "args": [
          [
            [
              1,
              1,
              1
            ],
            [
              0,
              0,
              0
            ],
            [
              1,
              1,
              1
            ]
          ]
        ],
        "expected": [
          [
            0,
            0,
            0,
            2
          ],
          [
            2,
            0,
            2,
            2
          ]
        ],
        "unordered": true
      }
    ],
    "runner": {
      "kind": "function",
      "parameterNames": [
        "land"
      ]
    }
  },
  {
    "id": "reachable-nodes-with-restrictions",
    "title": "Reachable Nodes With Restrictions",
    "category": "new",
    "sourceName": "LeetCode",
    "sourceLink": "https://leetcode.com/problems/reachable-nodes-with-restrictions/",
    "difficulty": "Medium",
    "statement": "You have an undirected tree with `n` nodes numbered `0` to `n - 1`, described by an array `edges` where each `edges[i] = [a, b]` means there is a two-way connection between nodes `a` and `b`. (There are exactly `n - 1` edges, so everything is connected with no cycles.)\n\nYou are also given an array `restricted` of forbidden nodes. You may NEVER step on a restricted node.\n\nStarting from node 0 (which is never restricted), count how many nodes you can reach by walking along edges without ever entering a restricted node. Node 0 itself counts.\n\nReturn that count.",
    "examples": [
      {
        "input": "n = 7, edges = [[0,1],[1,2],[3,1],[4,0],[0,5],[5,6]], restricted = [4,5]",
        "output": "4",
        "explanation": "From 0 you can go to 1, then to 2 and 3. You cannot enter 4 or 5 (restricted), and 6 is only reachable through 5, so it is cut off too. Reachable nodes: {0, 1, 2, 3} — that's 4."
      },
      {
        "input": "n = 7, edges = [[0,1],[0,2],[0,5],[0,4],[3,2],[6,5]], restricted = [4,2,1]",
        "output": "3",
        "explanation": "From 0 the only allowed neighbor is 5, and from 5 you can reach 6. Nodes 1, 2, 4 are restricted and 3 is hidden behind 2. Reachable: {0, 5, 6} — that's 3."
      }
    ],
    "constraints": [
      "2 <= n <= 1000",
      "edges.length == n - 1, and the edges form a valid tree",
      "1 <= restricted.length < n, and node 0 is never restricted"
    ],
    "functionName": "countReachableNodes",
    "solution": "const START_NODE = 0;\n\nconst buildGraph = (edges) => {\n    const graph = {};\n\n    for (const edge of edges) {\n        const [nodeOne, nodeTwo] = edge;\n\n        const nodeOneInGraph = graph.hasOwnProperty(nodeOne);\n        const nodeTwoInGraph = graph.hasOwnProperty(nodeTwo);\n\n        if (!nodeOneInGraph) graph[nodeOne] = [];\n        if (!nodeTwoInGraph) graph[nodeTwo] = [];\n\n        graph[nodeOne].push(nodeTwo);\n        graph[nodeTwo].push(nodeOne);\n    }\n\n    return graph;\n};\n\n// CONTRACT for countNodesFromStart(graph, node, restrictedNodes, visited):\n//     when this call returns, `node` and every node reachable from\n//     it without stepping on a restricted node is in the visited\n//     set, and the returned value is the number of those nodes.\n//     Restricted and already-visited nodes return 0.\nconst countNodesFromStart = (graph, node, restrictedNodes, visited) => {\n    // Base cases\n    if (visited.has(node)) return 0;\n\n    // A restricted node acts like a wall: we never step on it,\n    // so anything hidden behind it stays unreachable too.\n    if (restrictedNodes.has(node)) return 0;\n\n    // Process node\n    visited.add(node);\n\n    let numReachableNodes = 1;\n\n    // Recurse on neighbors\n    const nodeInGraph = graph.hasOwnProperty(node);\n    if (!nodeInGraph) return numReachableNodes;\n\n    const neighbors = graph[node];\n\n    for (const neighbor of neighbors) {\n        // The recursive leap of faith, one level down: this call has\n        // the SAME contract — when it returns, `neighbor` and everything\n        // reachable from it (avoiding restricted nodes) is in the\n        // visited set, and its value is how many nodes that is. Trust\n        // it, do not trace it. This node's own 1 plus each neighbor's\n        // guaranteed count add up to exactly this function's contract.\n        numReachableNodes += countNodesFromStart(\n            graph,\n            neighbor,\n            restrictedNodes,\n            visited,\n        );\n    }\n\n    return numReachableNodes;\n};\n\nconst countReachableNodes = (n, edges, restricted) => {\n    const graph = buildGraph(edges);\n\n    // A Set makes \"is this node restricted?\" a fast lookup.\n    const restrictedNodes = new Set(restricted);\n    const visited = new Set();\n\n    // The recursive leap of faith: trust the contract. When this\n    // call returns, its value is the number of nodes reachable from\n    // node 0 without touching a restricted node. We do not trace\n    // inside; we just return that count.\n    return countNodesFromStart(graph, START_NODE, restrictedNodes, visited);\n};",
    "tests": [
      {
        "args": [
          7,
          [
            [
              0,
              1
            ],
            [
              1,
              2
            ],
            [
              3,
              1
            ],
            [
              4,
              0
            ],
            [
              0,
              5
            ],
            [
              5,
              6
            ]
          ],
          [
            4,
            5
          ]
        ],
        "expected": 4
      },
      {
        "args": [
          7,
          [
            [
              0,
              1
            ],
            [
              0,
              2
            ],
            [
              0,
              5
            ],
            [
              0,
              4
            ],
            [
              3,
              2
            ],
            [
              6,
              5
            ]
          ],
          [
            4,
            2,
            1
          ]
        ],
        "expected": 3
      },
      {
        "args": [
          2,
          [
            [
              0,
              1
            ]
          ],
          [
            1
          ]
        ],
        "expected": 1
      },
      {
        "args": [
          3,
          [
            [
              0,
              1
            ],
            [
              1,
              2
            ]
          ],
          [
            2
          ]
        ],
        "expected": 2
      },
      {
        "args": [
          5,
          [
            [
              0,
              1
            ],
            [
              1,
              2
            ],
            [
              2,
              3
            ],
            [
              3,
              4
            ]
          ],
          [
            1
          ]
        ],
        "expected": 1
      }
    ],
    "runner": {
      "kind": "function",
      "parameterNames": [
        "n",
        "edges",
        "restricted"
      ]
    }
  },
  {
    "id": "hackerrank-connected-cells",
    "title": "Connected Cells in a Grid",
    "category": "new",
    "sourceName": "HackerRank",
    "sourceLink": "https://www.hackerrank.com/challenges/connected-cell-in-a-grid/problem",
    "difficulty": "Medium",
    "statement": "You are given a grid of 0s and 1s called `grid`.\n\nTwo cells containing 1 belong to the same \"region\" if they touch horizontally, vertically, OR diagonally.\n\nReturn the number of cells in the largest region of 1s. If there are no 1s, return 0.",
    "examples": [
      {
        "input": "grid = [[1,1,0,0],[0,1,1,0],[0,0,1,0],[1,0,0,0]]",
        "output": "5",
        "explanation": "Cells (0,0), (0,1), (1,1), (1,2), (2,2) all connect into one region of size 5 (some touch diagonally). The lone 1 at (3,0) is a region of size 1. The largest is 5."
      },
      {
        "input": "grid = [[1,0,1],[0,1,0],[1,0,1]]",
        "output": "5",
        "explanation": "The center cell (1,1) touches all four corner 1s diagonally, so all five 1s form one region of size 5."
      }
    ],
    "constraints": [
      "1 <= rows, cols <= 50",
      "grid[i][j] is 0 or 1"
    ],
    "functionName": "maxRegion",
    "solution": "const FILLED = 1;\n\nconst getPositionString = (row, col) => `${row}, ${col}`;\n// Diagonal touches count in this problem, so every cell has up to\n// 8 neighbors instead of the usual 4.\nconst directions = [\n    [0, 1],\n    [1, 0],\n    [0, -1],\n    [-1, 0],\n    [1, 1],\n    [1, -1],\n    [-1, 1],\n    [-1, -1],\n];\n\nconst isInBounds = (grid, row, col) => {\n    const numRows = grid.length;\n    const numCols = grid[0].length;\n\n    const rowInBounds = row >= 0 && row < numRows;\n    const colInBounds = col >= 0 && col < numCols;\n\n    return rowInBounds && colInBounds;\n};\n\n// CONTRACT for getRegionSize(grid, row, col, visited):\n//     when this call returns, every filled cell of the region\n//     containing (`row`, `col`) — including diagonal touches — is\n//     in the visited set, and the returned value is the number of\n//     cells in that region. Empty, out-of-bounds, and\n//     already-visited cells return 0.\nconst getRegionSize = (grid, row, col, visited) => {\n    // Base cases\n    if (!isInBounds(grid, row, col)) return 0;\n\n    const curPositionString = getPositionString(row, col);\n    if (visited.has(curPositionString)) return 0;\n\n    if (grid[row][col] !== FILLED) return 0;\n\n    // Process node\n    visited.add(curPositionString);\n\n    let regionSize = 1;\n\n    // Recurse on potential neighbors\n    for (const direction of directions) {\n        const [rowChange, colChange] = direction;\n\n        const newRow = row + rowChange;\n        const newCol = col + colChange;\n\n        // The recursive leap of faith, one level down: this call has\n        // the SAME contract — when it returns, the neighbor's side of\n        // the region is counted and its cells are in the visited set.\n        // Trust it, do not trace it. This cell's own 1 plus each\n        // neighbor's guaranteed count add up to exactly this function's\n        // contract: the whole region, counted once.\n        regionSize += getRegionSize(grid, newRow, newCol, visited);\n    }\n\n    return regionSize;\n};\n\nconst maxRegion = (grid) => {\n    const numRows = grid.length;\n    const numCols = grid[0].length;\n\n    let largestRegionSize = 0;\n    const visited = new Set();\n\n    for (let row = 0; row < numRows; row++) {\n        for (let col = 0; col < numCols; col++) {\n            // Already-visited and empty cells return a size of 0,\n            // so they never change the running maximum.\n            // The recursive leap of faith: trust the contract. When this\n            // call returns, regionSize is the full size of the region at\n            // this cell and all of its cells are in the visited set, so no\n            // region is ever counted twice. We do not trace inside; we just\n            // compare it to the running maximum and move on.\n            const regionSize = getRegionSize(grid, row, col, visited);\n\n            largestRegionSize = Math.max(largestRegionSize, regionSize);\n        }\n    }\n\n    return largestRegionSize;\n};",
    "tests": [
      {
        "args": [
          [
            [
              1,
              1,
              0,
              0
            ],
            [
              0,
              1,
              1,
              0
            ],
            [
              0,
              0,
              1,
              0
            ],
            [
              1,
              0,
              0,
              0
            ]
          ]
        ],
        "expected": 5
      },
      {
        "args": [
          [
            [
              1,
              0,
              1
            ],
            [
              0,
              1,
              0
            ],
            [
              1,
              0,
              1
            ]
          ]
        ],
        "expected": 5
      },
      {
        "args": [
          [
            [
              0,
              0
            ],
            [
              0,
              0
            ]
          ]
        ],
        "expected": 0
      },
      {
        "args": [
          [
            [
              1
            ]
          ]
        ],
        "expected": 1
      },
      {
        "args": [
          [
            [
              1,
              1,
              1,
              0
            ],
            [
              0,
              0,
              1,
              0
            ],
            [
              0,
              0,
              0,
              1
            ]
          ]
        ],
        "expected": 5
      }
    ],
    "runner": {
      "kind": "function",
      "parameterNames": [
        "grid"
      ]
    }
  },
  {
    "id": "structy-largest-component",
    "title": "Largest Component",
    "category": "new",
    "sourceName": "structy",
    "sourceLink": "https://structy.net/problems/largest-component",
    "difficulty": "Easy",
    "statement": "You are given an undirected graph as a plain object `graph`, where each key is a node and its value is an array of that node's neighbors. A node with no connections maps to an empty array.\n\nThe graph may be split into several disconnected \"components\" — groups of nodes that can reach each other.\n\nReturn the number of nodes in the LARGEST component. If the graph is empty, return 0.",
    "examples": [
      {
        "input": "graph = { a: ['b'], b: ['a','c'], c: ['b'], d: ['e'], e: ['d'] }",
        "output": "3",
        "explanation": "There are two components: {a, b, c} with 3 nodes and {d, e} with 2 nodes. The largest has 3."
      },
      {
        "input": "graph = { x: [], y: ['z'], z: ['y'] }",
        "output": "2",
        "explanation": "Node x is alone (component of size 1), and {y, z} form a component of size 2. The largest has 2."
      }
    ],
    "constraints": [
      "0 <= number of nodes <= 1000",
      "The graph is undirected: if b appears in graph[a], then a appears in graph[b]",
      "Isolated nodes appear as keys with an empty array"
    ],
    "functionName": "largestComponent",
    "solution": "// CONTRACT for getComponentSize(graph, node, visited):\n//     when this call returns, `node` and every node reachable from\n//     it is in the visited set, and the returned value is the\n//     number of those nodes. An already-visited node returns 0.\nconst getComponentSize = (graph, node, visited) => {\n    // Object keys are always strings in JavaScript, so convert the node\n    // to a string to keep our visited checks consistent.\n    const nodeKey = String(node);\n\n    // Base case\n    if (visited.has(nodeKey)) return 0;\n\n    // Process node\n    visited.add(nodeKey);\n\n    let componentSize = 1;\n\n    // Recurse on neighbors\n    const neighbors = graph[nodeKey];\n\n    for (const neighbor of neighbors) {\n        // The recursive leap of faith, one level down: this call has\n        // the SAME contract — when it returns, `neighbor` and everything\n        // reachable from it is in the visited set, and its value is how\n        // many nodes that is. Trust it, do not trace it. This node's\n        // own 1 plus each neighbor's guaranteed count add up to exactly\n        // this function's contract: the whole component, counted once.\n        componentSize += getComponentSize(graph, neighbor, visited);\n    }\n\n    return componentSize;\n};\n\nconst largestComponent = (graph) => {\n    let largestComponentSize = 0;\n    const visited = new Set();\n\n    for (const node of Object.keys(graph)) {\n        if (visited.has(node)) continue;\n\n        // The recursive leap of faith: trust the contract. When this\n        // call returns, componentSize is the size of the whole component\n        // holding `node`, and all of its nodes are in the visited set,\n        // so the loop can never count this component again. We do not\n        // trace inside; we just compare it to the running maximum and\n        // move on.\n        const componentSize = getComponentSize(graph, node, visited);\n\n        largestComponentSize = Math.max(largestComponentSize, componentSize);\n    }\n\n    return largestComponentSize;\n};",
    "tests": [
      {
        "args": [
          {
            "a": [
              "b"
            ],
            "b": [
              "a",
              "c"
            ],
            "c": [
              "b"
            ],
            "d": [
              "e"
            ],
            "e": [
              "d"
            ]
          }
        ],
        "expected": 3
      },
      {
        "args": [
          {
            "x": [],
            "y": [
              "z"
            ],
            "z": [
              "y"
            ]
          }
        ],
        "expected": 2
      },
      {
        "args": [
          {}
        ],
        "expected": 0
      },
      {
        "args": [
          {
            "0": [
              8,
              1,
              5
            ],
            "1": [
              0
            ],
            "2": [
              3,
              4
            ],
            "3": [
              2,
              4
            ],
            "4": [
              3,
              2
            ],
            "5": [
              0,
              8
            ],
            "8": [
              0,
              5
            ]
          }
        ],
        "expected": 4
      },
      {
        "args": [
          {
            "q": []
          }
        ],
        "expected": 1
      }
    ],
    "runner": {
      "kind": "function",
      "parameterNames": [
        "graph"
      ]
    }
  },
  {
    "id": "gfg-grid-path-exists",
    "title": "Check for Path in a 2D Grid with Obstacles",
    "category": "new",
    "sourceName": "GeeksforGeeks",
    "sourceLink": "https://www.geeksforgeeks.org/problems/find-whether-path-exist5238/1",
    "difficulty": "Easy",
    "statement": "You are given a square grid `grid` of size n x n. Each cell holds one of four numbers:\n\n- `1` — the source (where you start); there is exactly one\n- `2` — the destination (where you want to go); there is exactly one\n- `3` — an open cell you may walk through\n- `0` — a wall you can never enter\n\nYou can move up, down, left, or right between non-wall cells.\n\nReturn `true` if there is any way to walk from the source to the destination, and `false` otherwise.",
    "examples": [
      {
        "input": "grid = [[1,3,0],[0,3,0],[0,3,2]]",
        "output": "true",
        "explanation": "Start at (0,0). Walk right to (0,1), down to (1,1), down to (2,1), then right to the destination at (2,2)."
      },
      {
        "input": "grid = [[1,0,3],[0,0,3],[3,3,2]]",
        "output": "false",
        "explanation": "The source at (0,0) is boxed in: its right neighbor (0,1) and lower neighbor (1,0) are both walls, so you can never leave the starting cell."
      }
    ],
    "constraints": [
      "1 <= n <= 200 (the grid is n x n)",
      "Every cell is 0, 1, 2, or 3",
      "There is exactly one source (1) and exactly one destination (2)"
    ],
    "functionName": "isPathPossible",
    "solution": "const SOURCE = 1;\nconst DESTINATION = 2;\nconst WALL = 0;\n\nconst getPositionString = (row, col) => `${row}, ${col}`;\nconst directions = [\n    [0, 1],\n    [1, 0],\n    [0, -1],\n    [-1, 0],\n];\n\nconst isInBounds = (grid, row, col) => {\n    const numRows = grid.length;\n    const numCols = grid[0].length;\n\n    const rowInBounds = row >= 0 && row < numRows;\n    const colInBounds = col >= 0 && col < numCols;\n\n    return rowInBounds && colInBounds;\n};\n\nconst findSourcePosition = (grid) => {\n    for (let row = 0; row < grid.length; row++) {\n        for (let col = 0; col < grid[0].length; col++) {\n            if (grid[row][col] === SOURCE) return [row, col];\n        }\n    }\n\n    return null;\n};\n\n// CONTRACT for canReachDestination(grid, row, col, visited):\n//     when this call returns, the returned value is true exactly\n//     when a path of non-wall cells leads from (`row`, `col`) to\n//     the destination. Every open cell it explores goes into the\n//     visited set, so no cell is ever explored twice.\nconst canReachDestination = (grid, row, col, visited) => {\n    // Base cases\n    if (!isInBounds(grid, row, col)) return false;\n\n    const curPositionString = getPositionString(row, col);\n    if (visited.has(curPositionString)) return false;\n\n    if (grid[row][col] === WALL) return false;\n\n    // Success! We only need to know a path exists, so we can stop\n    // exploring the moment we step onto the destination.\n    if (grid[row][col] === DESTINATION) return true;\n\n    // Process node\n    visited.add(curPositionString);\n\n    // Recurse on neighbors\n    for (const direction of directions) {\n        const [rowChange, colChange] = direction;\n\n        const newRow = row + rowChange;\n        const newCol = col + colChange;\n\n        // The recursive leap of faith, one level down: this call has\n        // the SAME contract — when it returns, its answer says whether\n        // the destination can be reached starting from that neighbor.\n        // Trust it, do not trace it. If any neighbor guarantees a path,\n        // this cell has a path too; if none does, no path goes through\n        // this cell — exactly this function's contract, kept.\n        if (canReachDestination(grid, newRow, newCol, visited)) return true;\n    }\n\n    return false;\n};\n\nconst isPathPossible = (grid) => {\n    const [sourceRow, sourceCol] = findSourcePosition(grid);\n    const visited = new Set();\n\n    // The recursive leap of faith: trust the contract. When this\n    // call returns, its answer says whether a path of non-wall cells\n    // leads from the source to the destination. We do not trace\n    // inside; we just return that answer.\n    return canReachDestination(grid, sourceRow, sourceCol, visited);\n};",
    "tests": [
      {
        "args": [
          [
            [
              1,
              3,
              0
            ],
            [
              0,
              3,
              0
            ],
            [
              0,
              3,
              2
            ]
          ]
        ],
        "expected": true
      },
      {
        "args": [
          [
            [
              1,
              0,
              3
            ],
            [
              0,
              0,
              3
            ],
            [
              3,
              3,
              2
            ]
          ]
        ],
        "expected": false
      },
      {
        "args": [
          [
            [
              1,
              2
            ],
            [
              0,
              0
            ]
          ]
        ],
        "expected": true
      },
      {
        "args": [
          [
            [
              1,
              0
            ],
            [
              0,
              2
            ]
          ]
        ],
        "expected": false
      },
      {
        "args": [
          [
            [
              3,
              3,
              3
            ],
            [
              3,
              1,
              3
            ],
            [
              3,
              3,
              2
            ]
          ]
        ],
        "expected": true
      }
    ],
    "runner": {
      "kind": "function",
      "parameterNames": [
        "grid"
      ]
    }
  },
  {
    "id": "usaco-milk-factory",
    "title": "Milk Factory",
    "category": "new",
    "sourceName": "USACO",
    "sourceLink": "https://usaco.org/index.php?page=viewproblem2&cpid=940",
    "difficulty": "Medium",
    "statement": "A milk factory has `n` processing stations, numbered `1` to `n`, connected by exactly `n - 1` conveyor belts. Each belt is ONE-WAY: `belts[i] = [a, b]` means a crate on station `a` can be sent to station `b` (never the other way). Ignoring direction, the belts connect all the stations.\n\nThe factory wants a single pickup station: a station that EVERY other station can send a crate to, possibly passing through several belts along the way. (A station can trivially reach itself.)\n\nReturn the smallest-numbered station that all other stations can reach. If no such station exists, return `-1`.",
    "examples": [
      {
        "input": "n = 3, belts = [[1,2],[3,2]]",
        "output": "2",
        "explanation": "Station 1 reaches 2 directly, and station 3 reaches 2 directly. Every other station can reach station 2, so the answer is 2."
      },
      {
        "input": "n = 3, belts = [[2,1],[2,3]]",
        "output": "-1",
        "explanation": "Station 1 can be reached from 2 but not from 3. Station 3 can be reached from 2 but not from 1. Station 2 cannot be reached from anyone. No station works, so the answer is -1."
      }
    ],
    "constraints": [
      "1 <= n <= 100",
      "There are exactly n - 1 one-way belts",
      "Ignoring direction, the belts connect all stations"
    ],
    "functionName": "findFactoryStation",
    "solution": "const NO_STATION_FOUND = -1;\n\nconst buildDirectedGraph = (belts) => {\n    const graph = {};\n\n    for (const belt of belts) {\n        const [fromStation, toStation] = belt;\n\n        const fromStationInGraph = graph.hasOwnProperty(fromStation);\n        if (!fromStationInGraph) graph[fromStation] = [];\n\n        // The belts are one-way, so unlike an undirected graph we only\n        // add the edge in one direction.\n        graph[fromStation].push(toStation);\n    }\n\n    return graph;\n};\n\n// CONTRACT for markReachableStations(graph, station, visited):\n//     when this call returns, `station` and every station reachable\n//     from it by following one-way belts is in the visited set.\nconst markReachableStations = (graph, station, visited) => {\n    // Base case\n    if (visited.has(station)) return;\n\n    // Process node\n    visited.add(station);\n\n    // Recurse on neighbors\n    const stationInGraph = graph.hasOwnProperty(station);\n    if (!stationInGraph) return;\n\n    const neighbors = graph[station];\n\n    for (const neighbor of neighbors) {\n        // The recursive leap of faith, one level down: this call has\n        // the SAME contract — when it returns, `neighbor` and every\n        // station reachable from it is in the visited set. Trust it, do\n        // not trace it. This function already put `station` into\n        // visited, and each neighbor's contract covers the rest —\n        // together, that is this function's full contract, kept.\n        markReachableStations(graph, neighbor, visited);\n    }\n};\n\nconst findFactoryStation = (n, belts) => {\n    const graph = buildDirectedGraph(belts);\n\n    // numSendersToStation[station] counts how many stations can send\n    // a crate to it (every station trivially reaches itself).\n    const numSendersToStation = {};\n\n    for (let startStation = 1; startStation <= n; startStation++) {\n        const visited = new Set();\n        // The recursive leap of faith: trust the contract. When this\n        // call returns, visited holds startStation and every station its\n        // crates can reach. We do not trace inside; we just walk through\n        // visited and give each reachable station one more sender.\n        markReachableStations(graph, startStation, visited);\n\n        for (const reachableStation of visited) {\n            const stationCounted =\n                numSendersToStation.hasOwnProperty(reachableStation);\n            if (!stationCounted) numSendersToStation[reachableStation] = 0;\n\n            numSendersToStation[reachableStation]++;\n        }\n    }\n\n    // Scanning stations in increasing order guarantees we return the\n    // smallest-numbered station that everyone can reach.\n    for (let station = 1; station <= n; station++) {\n        if (numSendersToStation[station] === n) return station;\n    }\n\n    return NO_STATION_FOUND;\n};",
    "tests": [
      {
        "args": [
          3,
          [
            [
              1,
              2
            ],
            [
              3,
              2
            ]
          ]
        ],
        "expected": 2
      },
      {
        "args": [
          3,
          [
            [
              2,
              1
            ],
            [
              2,
              3
            ]
          ]
        ],
        "expected": -1
      },
      {
        "args": [
          1,
          []
        ],
        "expected": 1
      },
      {
        "args": [
          4,
          [
            [
              1,
              2
            ],
            [
              2,
              3
            ],
            [
              3,
              4
            ]
          ]
        ],
        "expected": 4
      },
      {
        "args": [
          5,
          [
            [
              1,
              3
            ],
            [
              2,
              3
            ],
            [
              3,
              5
            ],
            [
              4,
              5
            ]
          ]
        ],
        "expected": 5
      }
    ],
    "runner": {
      "kind": "function",
      "parameterNames": [
        "n",
        "belts"
      ]
    }
  },
  {
    "id": "structy-minimum-island",
    "title": "Minimum Island",
    "category": "new",
    "sourceName": "structy",
    "sourceLink": "https://structy.net/problems/minimum-island",
    "difficulty": "Easy",
    "statement": "You are given a grid of characters where `'W'` is water and `'L'` is land.\n\nAn island is a group of `'L'` cells connected up, down, left, or right (not diagonally).\n\nReturn the size (number of cells) of the SMALLEST island in the grid.\n\nYou may assume the grid has at least one island.",
    "examples": [
      {
        "input": "grid = [['W','L','W'],['W','L','W'],['W','W','L']]",
        "output": "1",
        "explanation": "There are two islands: {(0,1),(1,1)} with size 2, and {(2,2)} with size 1. The smallest size is 1."
      },
      {
        "input": "grid = [['L','L'],['L','W']]",
        "output": "3",
        "explanation": "All three L cells connect into a single island of size 3, so the smallest (and only) island size is 3."
      }
    ],
    "constraints": [
      "1 <= rows, cols <= 100",
      "Every cell is 'W' or 'L'",
      "There is at least one 'L' cell"
    ],
    "functionName": "minimumIsland",
    "solution": "const LAND = 'L';\n\nconst getPositionString = (row, col) => `${row}, ${col}`;\nconst directions = [\n    [0, 1],\n    [1, 0],\n    [0, -1],\n    [-1, 0],\n];\n\nconst isInBounds = (grid, row, col) => {\n    const numRows = grid.length;\n    const numCols = grid[0].length;\n\n    const rowInBounds = row >= 0 && row < numRows;\n    const colInBounds = col >= 0 && col < numCols;\n\n    return rowInBounds && colInBounds;\n};\n\n// CONTRACT for getIslandSize(grid, row, col, visited):\n//     when this call returns, every land cell of the island\n//     containing (`row`, `col`) is in the visited set, and the\n//     returned value is the number of cells in that island. Water,\n//     out-of-bounds, and already-visited cells return 0.\nconst getIslandSize = (grid, row, col, visited) => {\n    // Base cases\n    if (!isInBounds(grid, row, col)) return 0;\n\n    const curPositionString = getPositionString(row, col);\n    if (visited.has(curPositionString)) return 0;\n\n    if (grid[row][col] !== LAND) return 0;\n\n    // Process node\n    visited.add(curPositionString);\n\n    // Count the current cell, then let each neighbor report how much\n    // of the island sits on its side.\n    let islandSize = 1;\n\n    // Recurse on neighbors\n    for (const direction of directions) {\n        const [rowChange, colChange] = direction;\n\n        const newRow = row + rowChange;\n        const newCol = col + colChange;\n\n        // The recursive leap of faith, one level down: this call has\n        // the SAME contract — when it returns, the neighbor's side of\n        // the island is counted and its cells are in the visited set.\n        // Trust it, do not trace it. This cell's own 1 plus each\n        // neighbor's guaranteed count add up to exactly this function's\n        // contract: the whole island, counted once.\n        islandSize += getIslandSize(grid, newRow, newCol, visited);\n    }\n\n    return islandSize;\n};\n\nconst minimumIsland = (grid) => {\n    const numRows = grid.length;\n    const numCols = grid[0].length;\n\n    let smallestIslandSize = Infinity;\n    const visited = new Set();\n\n    for (let row = 0; row < numRows; row++) {\n        for (let col = 0; col < numCols; col++) {\n            const curPositionString = getPositionString(row, col);\n            if (visited.has(curPositionString)) continue;\n\n            const terrainType = grid[row][col];\n            if (terrainType !== LAND) continue;\n\n            // The recursive leap of faith: trust the contract. When this\n            // call returns, islandSize is the full size of this island and\n            // all of its cells are in the visited set, so the loop can never\n            // count this island again. We do not trace inside; we just\n            // compare it to the smallest size seen so far and move on.\n            const islandSize = getIslandSize(grid, row, col, visited);\n\n            smallestIslandSize = Math.min(smallestIslandSize, islandSize);\n        }\n    }\n\n    return smallestIslandSize;\n};",
    "tests": [
      {
        "args": [
          [
            [
              "W",
              "L",
              "W"
            ],
            [
              "W",
              "L",
              "W"
            ],
            [
              "W",
              "W",
              "L"
            ]
          ]
        ],
        "expected": 1
      },
      {
        "args": [
          [
            [
              "L",
              "L"
            ],
            [
              "L",
              "W"
            ]
          ]
        ],
        "expected": 3
      },
      {
        "args": [
          [
            [
              "W",
              "L",
              "W",
              "W",
              "W"
            ],
            [
              "W",
              "L",
              "W",
              "W",
              "W"
            ],
            [
              "W",
              "W",
              "W",
              "L",
              "W"
            ],
            [
              "W",
              "W",
              "L",
              "L",
              "W"
            ],
            [
              "L",
              "W",
              "W",
              "L",
              "L"
            ],
            [
              "L",
              "L",
              "W",
              "W",
              "W"
            ]
          ]
        ],
        "expected": 2
      },
      {
        "args": [
          [
            [
              "L"
            ]
          ]
        ],
        "expected": 1
      },
      {
        "args": [
          [
            [
              "L",
              "L"
            ],
            [
              "L",
              "L"
            ]
          ]
        ],
        "expected": 4
      }
    ],
    "runner": {
      "kind": "function",
      "parameterNames": [
        "grid"
      ]
    }
  },
  {
    "id": "ladder-takahashi",
    "title": "Ladder Takahashi",
    "category": "new",
    "sourceName": "AtCoder",
    "sourceLink": "https://atcoder.jp/contests/abc277/tasks/abc277_c",
    "difficulty": "Medium",
    "statement": "You are in a skyscraper with floors numbered `1` up to `1,000,000,000` (one billion), standing on floor `1`.\n\nThe ONLY way to change floors is by ladder. You are given an array `ladders`, where each `ladders[k] = [a, b]` is a ladder connecting floor `a` and floor `b`; you can climb it in either direction. You can freely walk around on whatever floor you are on, so from one floor you may use any ladder that touches it.\n\nWrite a function `highestFloor(ladders)` that returns the highest floor number you can possibly reach starting from floor `1`. If no ladder touches floor 1, the answer is `1`.",
    "examples": [
      {
        "input": "ladders = [[1,4],[4,3],[4,10],[8,3]]",
        "output": "10",
        "explanation": "From floor 1 climb to 4. From 4 you can reach 3 and 10, and from 3 you can reach 8. Everything reachable is {1, 3, 4, 8, 10}, and the highest is 10."
      },
      {
        "input": "ladders = [[500000000,600000000],[600000000,700000000],[700000000,800000000]]",
        "output": "1",
        "explanation": "No ladder touches floor 1, so you can never leave it. The answer is 1."
      }
    ],
    "constraints": [
      "1 <= ladders.length <= 1000",
      "1 <= a, b <= 10^9 and a != b"
    ],
    "functionName": "highestFloor",
    "solution": "const START_FLOOR = 1;\n\nconst buildGraph = (edges) => {\n    const graph = {};\n\n    for (const edge of edges) {\n        const [nodeOne, nodeTwo] = edge;\n\n        const nodeOneInGraph = graph.hasOwnProperty(nodeOne);\n        const nodeTwoInGraph = graph.hasOwnProperty(nodeTwo);\n\n        if (!nodeOneInGraph) graph[nodeOne] = [];\n        if (!nodeTwoInGraph) graph[nodeTwo] = [];\n\n        graph[nodeOne].push(nodeTwo);\n        graph[nodeTwo].push(nodeOne);\n    }\n\n    return graph;\n};\n\n// CONTRACT for markReachableFloors(graph, floor, visited):\n//     when this call returns, `floor` and every floor reachable\n//     from it by ladders is in the visited set.\nconst markReachableFloors = (graph, floor, visited) => {\n    // Base case\n    if (visited.has(floor)) return;\n\n    // Process node\n    visited.add(floor);\n\n    // Recurse on neighbors\n    const floorInGraph = graph.hasOwnProperty(floor);\n    if (!floorInGraph) return;\n\n    const neighbors = graph[floor];\n    for (const neighbor of neighbors) {\n        // The recursive leap of faith, one level down: this call has\n        // the SAME contract — when it returns, `neighbor` and every\n        // floor reachable from it is in the visited set. Trust it, do\n        // not trace it. This function already put `floor` into visited,\n        // and each neighbor's contract covers the rest — together, that\n        // is this function's full contract, kept.\n        markReachableFloors(graph, neighbor, visited);\n    }\n};\n\nconst highestFloor = (ladders) => {\n    // Floor numbers go up to a billion, so the graph must be keyed by\n    // floor number (a plain object) instead of using an array slot per floor.\n    const graph = buildGraph(ladders);\n\n    const visited = new Set();\n    // The recursive leap of faith: trust the contract. When this\n    // call returns, visited holds floor 1 and every floor reachable\n    // from it by ladders. We do not trace inside; we just scan\n    // visited for the highest floor.\n    markReachableFloors(graph, START_FLOOR, visited);\n\n    let highestReachableFloor = START_FLOOR;\n\n    for (const floor of visited) {\n        if (floor <= highestReachableFloor) continue;\n\n        highestReachableFloor = floor;\n    }\n\n    return highestReachableFloor;\n};\n",
    "tests": [
      {
        "args": [
          [
            [
              1,
              4
            ],
            [
              4,
              3
            ],
            [
              4,
              10
            ],
            [
              8,
              3
            ]
          ]
        ],
        "expected": 10
      },
      {
        "args": [
          [
            [
              500000000,
              600000000
            ],
            [
              600000000,
              700000000
            ],
            [
              700000000,
              800000000
            ]
          ]
        ],
        "expected": 1
      },
      {
        "args": [
          [
            [
              1,
              2
            ]
          ]
        ],
        "expected": 2
      },
      {
        "args": [
          [
            [
              1,
              1000000000
            ]
          ]
        ],
        "expected": 1000000000
      },
      {
        "args": [
          [
            [
              2,
              3
            ],
            [
              1,
              3
            ],
            [
              3,
              999999999
            ]
          ]
        ],
        "expected": 999999999
      },
      {
        "args": [
          [
            [
              5,
              1
            ],
            [
              5,
              7
            ],
            [
              7,
              2
            ],
            [
              2,
              6
            ],
            [
              9,
              10
            ]
          ]
        ],
        "expected": 7
      }
    ],
    "runner": {
      "kind": "function",
      "parameterNames": [
        "ladders"
      ]
    }
  },
  {
    "id": "wheres-my-internet",
    "title": "Where's My Internet??",
    "category": "new",
    "sourceName": "Kattis",
    "sourceLink": "https://open.kattis.com/problems/wheresmyinternet",
    "difficulty": "Easy",
    "statement": "A brand-new town has `n` houses, numbered `1` to `n`. House `1` is the only house with a direct internet line to the outside world.\n\nSome pairs of houses are already joined by network cables, and cables carry internet in both directions. A house is online if it is house `1`, or if it is connected by a cable to a house that is already online. In other words, a house is online exactly when you can walk from it to house `1` through a chain of cables.\n\nYou are given `n` and an array `cables`, where each `cables[k] = [a, b]` means houses `a` and `b` are joined by a cable.\n\nWrite a function `findOfflineHouses(n, cables)` that returns an array of all house numbers that do NOT have internet, sorted from smallest to largest. If every house is online, return an empty array `[]`.",
    "examples": [
      {
        "input": "n = 6, cables = [[1,2],[2,3],[3,4],[5,6]]",
        "output": "[5, 6]",
        "explanation": "Houses 2, 3 and 4 are joined to house 1 by a chain of cables, so they are online. Houses 5 and 6 are only cabled to each other, so neither can reach house 1 and both are offline."
      },
      {
        "input": "n = 2, cables = [[2,1]]",
        "output": "[]",
        "explanation": "House 2 is cabled directly to house 1, so every house in town is online and the answer is an empty array."
      }
    ],
    "constraints": [
      "1 <= n <= 1000",
      "0 <= cables.length <= 2000",
      "1 <= a, b <= n and a != b",
      "Each pair of houses appears at most once in cables"
    ],
    "functionName": "findOfflineHouses",
    "solution": "const INTERNET_HOUSE = 1;\n\nconst buildGraph = (edges) => {\n    const graph = {};\n\n    for (const edge of edges) {\n        const [nodeOne, nodeTwo] = edge;\n\n        const nodeOneInGraph = graph.hasOwnProperty(nodeOne);\n        const nodeTwoInGraph = graph.hasOwnProperty(nodeTwo);\n\n        if (!nodeOneInGraph) graph[nodeOne] = [];\n        if (!nodeTwoInGraph) graph[nodeTwo] = [];\n\n        graph[nodeOne].push(nodeTwo);\n        graph[nodeTwo].push(nodeOne);\n    }\n\n    return graph;\n};\n\n// CONTRACT for markOnlineHouses(graph, house, visited):\n//     when this call returns, `house` and every house connected\n//     to it by cables is in the visited set.\nconst markOnlineHouses = (graph, house, visited) => {\n    // Base case\n    if (visited.has(house)) return;\n\n    // Process node\n    visited.add(house);\n\n    // Recurse on neighbors\n    const houseInGraph = graph.hasOwnProperty(house);\n    if (!houseInGraph) return;\n\n    const neighbors = graph[house];\n    for (const neighbor of neighbors) {\n        // The recursive leap of faith, one level down: this call has\n        // the SAME contract — when it returns, `neighbor` and every\n        // house connected to it is in the visited set. Trust it, do\n        // not trace it. This function already put `house` into visited,\n        // and each neighbor's contract covers the rest — together, that\n        // is this function's full contract, kept.\n        markOnlineHouses(graph, neighbor, visited);\n    }\n};\n\nconst findOfflineHouses = (n, cables) => {\n    const graph = buildGraph(cables);\n\n    // Every house the DFS reaches from house 1 is online.\n    const visited = new Set();\n    // The recursive leap of faith: trust the contract. When this\n    // call returns, visited holds house 1 and every house connected\n    // to it — all the online houses. We do not trace inside; we just\n    // report the houses that are missing from visited.\n    markOnlineHouses(graph, INTERNET_HOUSE, visited);\n\n    const offlineHouses = [];\n\n    // Checking houses from 1 up to n means the answer comes out already sorted.\n    for (let house = 1; house <= n; house++) {\n        if (visited.has(house)) continue;\n\n        offlineHouses.push(house);\n    }\n\n    return offlineHouses;\n};\n",
    "tests": [
      {
        "args": [
          6,
          [
            [
              1,
              2
            ],
            [
              2,
              3
            ],
            [
              3,
              4
            ],
            [
              5,
              6
            ]
          ]
        ],
        "expected": [
          5,
          6
        ]
      },
      {
        "args": [
          2,
          [
            [
              2,
              1
            ]
          ]
        ],
        "expected": []
      },
      {
        "args": [
          1,
          []
        ],
        "expected": []
      },
      {
        "args": [
          5,
          []
        ],
        "expected": [
          2,
          3,
          4,
          5
        ]
      },
      {
        "args": [
          7,
          [
            [
              2,
              3
            ],
            [
              4,
              5
            ],
            [
              6,
              7
            ]
          ]
        ],
        "expected": [
          2,
          3,
          4,
          5,
          6,
          7
        ]
      },
      {
        "args": [
          4,
          [
            [
              1,
              2
            ],
            [
              1,
              3
            ],
            [
              3,
              4
            ]
          ]
        ],
        "expected": []
      }
    ],
    "runner": {
      "kind": "function",
      "parameterNames": [
        "n",
        "cables"
      ]
    }
  },
  {
    "id": "ten-kinds-of-people",
    "title": "10 Kinds of People",
    "category": "new",
    "sourceName": "Kattis",
    "sourceLink": "https://open.kattis.com/problems/10kindsofpeople",
    "difficulty": "Medium",
    "statement": "The world's map is a rectangular grid given as an array of strings, where every character is either `'1'` or `'0'`. Decimal people may only stand on `'1'` cells, and binary people may only stand on `'0'` cells. Anyone can step up, down, left, or right to a neighboring cell of the SAME character - never diagonally, and never onto the other kind of cell.\n\nYou are given the map `grid` and a list `queries`. Each query is `[r1, c1, r2, c2]` (all 0-indexed): a starting cell `(r1, c1)` and a target cell `(r2, c2)`.\n\nWrite a function `whoCanTravel(grid, queries)` that returns an array with one answer per query, in order:\n\n- `\"decimal\"` if both cells contain `'1'` and you can walk between them stepping only on `'1'` cells,\n- `\"binary\"` if both cells contain `'0'` and you can walk between them stepping only on `'0'` cells,\n- `\"neither\"` otherwise (for example, if the two cells hold different characters, or they sit in separate regions).\n\nA query may start and end at the same cell - the person standing there can always \"travel\" to it.",
    "examples": [
      {
        "input": "grid = [\"1100\"], queries = [[0,0,0,3],[0,0,0,0]]",
        "output": "[\"neither\", \"decimal\"]",
        "explanation": "Query 1: (0,0) holds '1' but (0,3) holds '0', so no single kind of person can stand on both - \"neither\". Query 2: start and target are the same '1' cell, so a decimal person is already there - \"decimal\"."
      },
      {
        "input": "grid = [\"110\", \"010\", \"011\"], queries = [[0,0,2,2],[2,0,0,2]]",
        "output": "[\"decimal\", \"neither\"]",
        "explanation": "Query 1: the '1' path (0,0) -> (0,1) -> (1,1) -> (2,1) -> (2,2) connects the cells, so \"decimal\". Query 2: the '0' region around (2,0) is only {(2,0),(1,0)} - the DFS is blocked by '1's - and (0,2) is a separate '0' region, so \"neither\"."
      }
    ],
    "constraints": [
      "1 <= number of rows, columns <= 50",
      "grid[r][c] is '0' or '1'",
      "1 <= queries.length <= 20",
      "0 <= r1, r2 < rows and 0 <= c1, c2 < cols"
    ],
    "functionName": "whoCanTravel",
    "solution": "const DECIMAL_CELL = '1';\nconst DECIMAL_ANSWER = 'decimal';\nconst BINARY_ANSWER = 'binary';\nconst NEITHER_ANSWER = 'neither';\n\nconst getPositionString = (row, col) => `${row}, ${col}`;\nconst directions = [\n    [0, 1],\n    [1, 0],\n    [0, -1],\n    [-1, 0],\n];\n\nconst isInBounds = (grid, row, col) => {\n    const numRows = grid.length;\n    const numCols = grid[0].length;\n\n    const rowInBounds = row >= 0 && row < numRows;\n    const colInBounds = col >= 0 && col < numCols;\n\n    return rowInBounds && colInBounds;\n};\n\n// CONTRACT for labelRegion(grid, row, col, regionCellType, regionLabel, visited, regionLabels):\n//     when this call returns, every cell of the region containing\n//     (`row`, `col`) — the connected cells whose character equals\n//     `regionCellType` — is in the visited set and has\n//     `regionLabel` stored for it in `regionLabels`.\nconst labelRegion = (grid, row, col, regionCellType, regionLabel, visited, regionLabels) => {\n    // Base cases\n    if (!isInBounds(grid, row, col)) return;\n\n    const curPositionString = getPositionString(row, col);\n    if (visited.has(curPositionString)) return;\n\n    // A region only contains cells with the SAME character as its start.\n    if (grid[row][col] !== regionCellType) return;\n\n    // Process node\n    visited.add(curPositionString);\n    regionLabels.set(curPositionString, regionLabel);\n\n    // Recurse on neighbors\n    for (const direction of directions) {\n        const [rowChange, colChange] = direction;\n\n        const newRow = row + rowChange;\n        const newCol = col + colChange;\n\n        // The recursive leap of faith, one level down: this call has\n        // the SAME contract — when it returns, the neighbor's side of\n        // the region is in the visited set and labeled. Trust it, do\n        // not trace it. This function already put (`row`, `col`) into\n        // visited and labeled it, and each neighbor's contract covers\n        // the rest — together, that is this function's full contract,\n        // kept.\n        labelRegion(grid, newRow, newCol, regionCellType, regionLabel, visited, regionLabels);\n    }\n};\n\nconst whoCanTravel = (grid, queries) => {\n    const numRows = grid.length;\n    const numCols = grid[0].length;\n\n    // Label every region once up front. Two cells are connected exactly\n    // when they share a label, so each query becomes a cheap lookup\n    // instead of its own DFS.\n    const visited = new Set();\n    const regionLabels = new Map();\n    let nextRegionLabel = 0;\n\n    for (let row = 0; row < numRows; row++) {\n        for (let col = 0; col < numCols; col++) {\n            const curPositionString = getPositionString(row, col);\n            if (visited.has(curPositionString)) continue;\n\n            // The recursive leap of faith: trust the contract. When this\n            // call returns, the whole region around this cell is in the\n            // visited set and every one of its cells shares the same label.\n            // We do not trace inside; we just move on to the next unlabeled\n            // cell.\n            labelRegion(grid, row, col, grid[row][col], nextRegionLabel, visited, regionLabels);\n            nextRegionLabel++;\n        }\n    }\n\n    const answers = [];\n\n    for (const query of queries) {\n        const [startRow, startCol, targetRow, targetCol] = query;\n\n        const startLabel = regionLabels.get(getPositionString(startRow, startCol));\n        const targetLabel = regionLabels.get(getPositionString(targetRow, targetCol));\n\n        // Different labels mean different regions (or different cell types).\n        if (startLabel !== targetLabel) {\n            answers.push(NEITHER_ANSWER);\n            continue;\n        }\n\n        const cellType = grid[startRow][startCol];\n        answers.push(cellType === DECIMAL_CELL ? DECIMAL_ANSWER : BINARY_ANSWER);\n    }\n\n    return answers;\n};\n",
    "tests": [
      {
        "args": [
          [
            "1100"
          ],
          [
            [
              0,
              0,
              0,
              3
            ],
            [
              0,
              0,
              0,
              0
            ]
          ]
        ],
        "expected": [
          "neither",
          "decimal"
        ]
      },
      {
        "args": [
          [
            "110",
            "010",
            "011"
          ],
          [
            [
              0,
              0,
              2,
              2
            ],
            [
              2,
              0,
              0,
              2
            ]
          ]
        ],
        "expected": [
          "decimal",
          "neither"
        ]
      },
      {
        "args": [
          [
            "0"
          ],
          [
            [
              0,
              0,
              0,
              0
            ]
          ]
        ],
        "expected": [
          "binary"
        ]
      },
      {
        "args": [
          [
            "010"
          ],
          [
            [
              0,
              0,
              0,
              2
            ],
            [
              0,
              1,
              0,
              1
            ]
          ]
        ],
        "expected": [
          "neither",
          "decimal"
        ]
      },
      {
        "args": [
          [
            "0000",
            "1111",
            "0000"
          ],
          [
            [
              0,
              0,
              0,
              3
            ],
            [
              2,
              0,
              0,
              0
            ],
            [
              1,
              0,
              1,
              3
            ],
            [
              0,
              2,
              2,
              1
            ]
          ]
        ],
        "expected": [
          "binary",
          "neither",
          "decimal",
          "neither"
        ]
      }
    ],
    "runner": {
      "kind": "function",
      "parameterNames": [
        "grid",
        "queries"
      ]
    }
  },
  {
    "id": "transitive-closure",
    "title": "Transitive Closure of a Graph",
    "category": "new",
    "sourceName": "GeeksforGeeks",
    "sourceLink": "https://www.geeksforgeeks.org/problems/transitive-closure-of-a-graph0930/1",
    "difficulty": "Easy",
    "statement": "You are given a directed graph with `n` nodes, numbered `0` to `n - 1`, as an `n x n` matrix `graph`, where `graph[i][j] = 1` means there is a one-way road from node `i` to node `j` (and `0` means there is not).\n\nThe TRANSITIVE CLOSURE of the graph answers, for every ordered pair, the question: \"can I get from `i` to `j` by following one-way roads?\"\n\nWrite a function `transitiveClosure(graph)` that returns a new `n x n` matrix `reach`, where `reach[i][j] = 1` if node `j` can be reached from node `i` by following zero or more roads, and `0` otherwise. Every node can reach itself, so `reach[i][i]` is always `1`.",
    "examples": [
      {
        "input": "graph = [[0,1,0],[0,0,1],[0,0,0]]",
        "output": "[[1,1,1],[0,1,1],[0,0,1]]",
        "explanation": "Roads: 0 -> 1 and 1 -> 2. From node 0 you reach {0, 1, 2}; from node 1 you reach {1, 2}; from node 2 only {2}."
      },
      {
        "input": "graph = [[0,1,0,0],[1,0,1,0],[0,0,0,1],[0,0,0,0]]",
        "output": "[[1,1,1,1],[1,1,1,1],[0,0,1,1],[0,0,0,1]]",
        "explanation": "Nodes 0 and 1 point at each other (a cycle), and 1 -> 2 -> 3. So both 0 and 1 reach everything. Node 2 reaches {2, 3}, and node 3 reaches only itself. The DFS's visited set keeps the 0 <-> 1 loop from recursing forever."
      }
    ],
    "constraints": [
      "1 <= n <= 50",
      "graph[i][j] is 0 or 1"
    ],
    "functionName": "transitiveClosure",
    "solution": "const ROAD = 1;\n\n// CONTRACT for markReachableNodes(graph, node, visited):\n//     when this call returns, `node` and every node you can reach\n//     from `node` by following one-way roads is in the visited set.\nconst markReachableNodes = (graph, node, visited) => {\n    // Base case\n    if (visited.has(node)) return;\n\n    // Process node\n    visited.add(node);\n\n    // Recurse on neighbors\n    for (\n        let potentialNeighbor = 0;\n        potentialNeighbor < graph.length;\n        potentialNeighbor++\n    ) {\n        const isNeighbor = graph[node][potentialNeighbor] === ROAD;\n\n        if (!isNeighbor) continue;\n\n        // Directed graphs can still contain cycles (like 0 -> 1 -> 0),\n        // so the visited check above is what stops infinite recursion.\n        // The recursive leap of faith, one level down: this call has\n        // the SAME contract — when it returns, `potentialNeighbor` and\n        // everything reachable from it is in visited. Trust it, do not\n        // trace it. This function already put `node` into visited, and\n        // each neighbor's contract covers everything past that neighbor\n        // — together, that is this function's full contract, kept.\n        markReachableNodes(graph, potentialNeighbor, visited);\n    }\n};\n\nconst transitiveClosure = (graph) => {\n    const numNodes = graph.length;\n\n    const reach = [];\n\n    for (let startNode = 0; startNode < numNodes; startNode++) {\n        // Each row of the answer is one full DFS, so every start node\n        // gets its own fresh visited set.\n        const visited = new Set();\n        // The recursive leap of faith: trust the contract. When this\n        // call returns, `startNode` and every node reachable from it\n        // is in visited — nothing more, nothing less. We do not trace\n        // inside; we just read the finished visited set and turn it\n        // into one row of 1s and 0s.\n        markReachableNodes(graph, startNode, visited);\n\n        const reachRow = [];\n        for (let targetNode = 0; targetNode < numNodes; targetNode++) {\n            const isReachable = visited.has(targetNode);\n            reachRow.push(isReachable ? 1 : 0);\n        }\n\n        reach.push(reachRow);\n    }\n\n    return reach;\n};",
    "tests": [
      {
        "args": [
          [
            [
              0,
              1,
              0
            ],
            [
              0,
              0,
              1
            ],
            [
              0,
              0,
              0
            ]
          ]
        ],
        "expected": [
          [
            1,
            1,
            1
          ],
          [
            0,
            1,
            1
          ],
          [
            0,
            0,
            1
          ]
        ]
      },
      {
        "args": [
          [
            [
              0,
              1,
              0,
              0
            ],
            [
              1,
              0,
              1,
              0
            ],
            [
              0,
              0,
              0,
              1
            ],
            [
              0,
              0,
              0,
              0
            ]
          ]
        ],
        "expected": [
          [
            1,
            1,
            1,
            1
          ],
          [
            1,
            1,
            1,
            1
          ],
          [
            0,
            0,
            1,
            1
          ],
          [
            0,
            0,
            0,
            1
          ]
        ]
      },
      {
        "args": [
          [
            [
              0
            ]
          ]
        ],
        "expected": [
          [
            1
          ]
        ]
      },
      {
        "args": [
          [
            [
              0,
              0
            ],
            [
              0,
              0
            ]
          ]
        ],
        "expected": [
          [
            1,
            0
          ],
          [
            0,
            1
          ]
        ]
      },
      {
        "args": [
          [
            [
              0,
              1,
              0
            ],
            [
              0,
              0,
              1
            ],
            [
              1,
              0,
              0
            ]
          ]
        ],
        "expected": [
          [
            1,
            1,
            1
          ],
          [
            1,
            1,
            1
          ],
          [
            1,
            1,
            1
          ]
        ]
      }
    ],
    "runner": {
      "kind": "function",
      "parameterNames": [
        "graph"
      ]
    }
  },
  {
    "id": "moocast",
    "title": "Moocast",
    "category": "new",
    "sourceName": "USACO",
    "sourceLink": "https://usaco.org/index.php?page=viewproblem2&cpid=668",
    "difficulty": "Medium",
    "statement": "Farmer John's cows each carry a walkie-talkie. You are given an array `cows`, where `cows[i] = [x, y, p]` gives cow `i`'s position `(x, y)` and the power `p` of her walkie-talkie.\n\nCow `i` can transmit DIRECTLY to cow `j` if the distance between them is at most `p` (cow i's own power) — that is, when `(x_i - x_j)^2 + (y_i - y_j)^2 <= p_i^2`.\n\nNote that transmissions are one-way: a strong cow may reach a weak cow that cannot answer back.\n\nMessages can be relayed: if cow `i` reaches cow `j`, cow `j` can pass the message on using her own power, and so on.\n\nWrite a function `maxBroadcast(cows)` that returns the largest number of cows (counting the starting cow herself) that can receive a broadcast started by a single, best-chosen cow.",
    "examples": [
      {
        "input": "cows = [[1,3,5],[5,4,3],[7,2,1],[6,1,1]]",
        "output": "3",
        "explanation": "Cow 0 (power 5, so 25 squared) reaches cow 1 since (1-5)^2+(3-4)^2 = 17 <= 25. Cow 1 (power 3, so 9) reaches cow 2 since (5-7)^2+(4-2)^2 = 8 <= 9. Cow 2's power 1 reaches no one: her distance-squared to cow 3 is 2 > 1. Starting at cow 0 the broadcast covers cows {0, 1, 2} = 3 cows, which is the best possible."
      },
      {
        "input": "cows = [[0,0,2],[3,0,3],[5,0,1]]",
        "output": "3",
        "explanation": "Starting at cow 1 (power 3, so 9): she reaches cow 0 (distance-squared 9 <= 9) and cow 2 (distance-squared 4 <= 9). That covers all 3 cows. Starting at cow 0 covers only herself (9 > 4), and cow 2 also covers only herself (4 > 1)."
      }
    ],
    "constraints": [
      "1 <= cows.length <= 200",
      "0 <= x, y <= 25000",
      "1 <= p <= 25000",
      "All values are integers"
    ],
    "functionName": "maxBroadcast",
    "solution": "const X_COORDINATE = 0;\nconst Y_COORDINATE = 1;\nconst POWER = 2;\n\nconst buildTransmissionGraph = (cows) => {\n    const graph = {};\n\n    for (let cowIndex = 0; cowIndex < cows.length; cowIndex++) {\n        graph[cowIndex] = [];\n    }\n\n    for (let senderIndex = 0; senderIndex < cows.length; senderIndex++) {\n        for (let receiverIndex = 0; receiverIndex < cows.length; receiverIndex++) {\n            if (senderIndex === receiverIndex) continue;\n\n            const sender = cows[senderIndex];\n            const receiver = cows[receiverIndex];\n\n            const xDifference = sender[X_COORDINATE] - receiver[X_COORDINATE];\n            const yDifference = sender[Y_COORDINATE] - receiver[Y_COORDINATE];\n            const squaredDistance =\n                xDifference * xDifference + yDifference * yDifference;\n\n            // Comparing squared values avoids Math.sqrt entirely.\n            // Only the SENDER's power matters, so this edge is one-way:\n            // a strong cow may reach a weak cow that cannot answer back.\n            const senderPower = sender[POWER];\n            const canTransmit = squaredDistance <= senderPower * senderPower;\n\n            if (!canTransmit) continue;\n\n            graph[senderIndex].push(receiverIndex);\n        }\n    }\n\n    return graph;\n};\n\n// CONTRACT for markReachableCows(graph, cow, visited):\n//     when this call returns, `cow` and every cow her broadcast can\n//     reach through any chain of one-way transmissions is in the\n//     visited set.\nconst markReachableCows = (graph, cow, visited) => {\n    // Base case\n    if (visited.has(cow)) return;\n\n    // Process node\n    visited.add(cow);\n\n    // Recurse on neighbors\n    const neighbors = graph[cow];\n    for (const neighbor of neighbors) {\n        // The recursive leap of faith, one level down: this call has\n        // the SAME contract — when it returns, `neighbor` and every\n        // cow reachable from `neighbor` is in visited. Trust it, do\n        // not trace it. This function already put `cow` into visited,\n        // and each neighbor's contract covers all the cows past that\n        // neighbor — together, that is this function's full contract,\n        // kept.\n        markReachableCows(graph, neighbor, visited);\n    }\n};\n\nconst maxBroadcast = (cows) => {\n    const graph = buildTransmissionGraph(cows);\n\n    let maxCowsReached = 0;\n\n    for (let startCow = 0; startCow < cows.length; startCow++) {\n        // Edges are one-way, so each starting cow can reach a different\n        // set of cows and needs her own fresh visited set.\n        const visited = new Set();\n        // The recursive leap of faith: trust the contract. When this\n        // call returns, `startCow` and every cow she can reach is in\n        // visited — so visited.size IS her broadcast count. We do not\n        // trace inside; we just take the size and keep the biggest.\n        markReachableCows(graph, startCow, visited);\n\n        maxCowsReached = Math.max(maxCowsReached, visited.size);\n    }\n\n    return maxCowsReached;\n};",
    "tests": [
      {
        "args": [
          [
            [
              1,
              3,
              5
            ],
            [
              5,
              4,
              3
            ],
            [
              7,
              2,
              1
            ],
            [
              6,
              1,
              1
            ]
          ]
        ],
        "expected": 3
      },
      {
        "args": [
          [
            [
              0,
              0,
              2
            ],
            [
              3,
              0,
              3
            ],
            [
              5,
              0,
              1
            ]
          ]
        ],
        "expected": 3
      },
      {
        "args": [
          [
            [
              5,
              5,
              1
            ]
          ]
        ],
        "expected": 1
      },
      {
        "args": [
          [
            [
              0,
              0,
              15
            ],
            [
              10,
              10,
              1
            ]
          ]
        ],
        "expected": 2
      },
      {
        "args": [
          [
            [
              0,
              0,
              1
            ],
            [
              10,
              0,
              1
            ],
            [
              20,
              0,
              1
            ]
          ]
        ],
        "expected": 1
      },
      {
        "args": [
          [
            [
              0,
              0,
              1
            ],
            [
              1,
              0,
              1
            ],
            [
              2,
              0,
              1
            ]
          ]
        ],
        "expected": 3
      }
    ],
    "runner": {
      "kind": "function",
      "parameterNames": [
        "cows"
      ]
    }
  },
  {
    "id": "properties-graph",
    "title": "Properties Graph",
    "category": "new",
    "sourceName": "LeetCode",
    "sourceLink": "https://leetcode.com/problems/properties-graph/",
    "difficulty": "Medium",
    "statement": "You are given a 2D integer array `properties` with `n` rows (each row is a list of `m` integers) and an integer `k`.\n\nDefine `intersect(a, b)` as the number of **distinct** integers that appear in both array `a` and array `b`.\n\nBuild an undirected graph with one node per row: node `i` stands for `properties[i]`. Add an edge between node `i` and node `j` (for `i != j`) exactly when `intersect(properties[i], properties[j]) >= k`.\n\nReturn the number of connected components in this graph.",
    "examples": [
      {
        "input": "properties = [[1,2],[1,1],[3,4],[4,5],[5,6],[7,7]], k = 1",
        "output": "3",
        "explanation": "As sets of distinct values the rows are {1,2}, {1}, {3,4}, {4,5}, {5,6}, {7}. Edges (at least 1 shared value): 0-1 (share 1), 2-3 (share 4), 3-4 (share 5). That produces components {0,1}, {2,3,4}, and {5}, so there are 3 components."
      },
      {
        "input": "properties = [[1,2,3],[2,3,4],[4,3,5]], k = 2",
        "output": "1",
        "explanation": "Rows 0 and 1 share {2,3} (2 values, edge). Rows 1 and 2 share {3,4} (2 values, edge). Rows 0 and 2 share only {3}, so no direct edge, but all three nodes are still connected through node 1. One component."
      }
    ],
    "constraints": [
      "1 <= n == properties.length <= 100",
      "1 <= m == properties[i].length <= 100",
      "1 <= properties[i][j] <= 100",
      "1 <= k <= m"
    ],
    "functionName": "numberOfComponents",
    "solution": "const countSharedDistinctValues = (valueSetOne, valueSetTwo) => {\n    let sharedCount = 0;\n\n    for (const value of valueSetOne) {\n        if (valueSetTwo.has(value)) sharedCount++;\n    }\n\n    return sharedCount;\n};\n\nconst buildPropertiesGraph = (properties, minSharedValues) => {\n    const graph = {};\n\n    for (let nodeIndex = 0; nodeIndex < properties.length; nodeIndex++) {\n        graph[nodeIndex] = [];\n    }\n\n    // Turning each row into a Set up front means intersect counts\n    // DISTINCT values (duplicates collapse) and lookups are fast.\n    const distinctValueSets = properties.map((row) => new Set(row));\n\n    // n <= 100, so checking every pair of rows is perfectly fine.\n    for (let nodeOne = 0; nodeOne < properties.length; nodeOne++) {\n        for (let nodeTwo = nodeOne + 1; nodeTwo < properties.length; nodeTwo++) {\n            const sharedValues = countSharedDistinctValues(\n                distinctValueSets[nodeOne],\n                distinctValueSets[nodeTwo],\n            );\n\n            if (sharedValues < minSharedValues) continue;\n\n            graph[nodeOne].push(nodeTwo);\n            graph[nodeTwo].push(nodeOne);\n        }\n    }\n\n    return graph;\n};\n\n// CONTRACT for markComponentAsVisited(graph, node, visited):\n//     when this call returns, `node` and every node reachable\n//     from `node` is in the visited set.\nconst markComponentAsVisited = (graph, node, visited) => {\n    // Base case\n    if (visited.has(node)) return;\n\n    // Process node\n    visited.add(node);\n\n    // Recurse on neighbors\n    const neighbors = graph[node];\n    for (const neighbor of neighbors) {\n        // The recursive leap of faith, one level down: this call has\n        // the SAME contract — when it returns, `neighbor` and everything\n        // reachable from it is in visited. Trust it, do not trace it.\n        // This function already put `node` into visited, and each\n        // neighbor's contract puts everything reachable from that\n        // neighbor into visited — together, that is this function's\n        // full contract, kept.\n        markComponentAsVisited(graph, neighbor, visited);\n    }\n};\n\nconst numberOfComponents = (properties, k) => {\n    const graph = buildPropertiesGraph(properties, k);\n\n    let numConnectedComponents = 0;\n    const visited = new Set();\n\n    for (let node = 0; node < properties.length; node++) {\n        if (visited.has(node)) continue;\n\n        numConnectedComponents++;\n        // The recursive leap of faith: trust the contract. When this\n        // call returns, `node` and everything reachable from it — the\n        // entire brand-new component — is in visited, so the loop can\n        // never count this component again. We do not trace inside;\n        // we just count it and move on.\n        markComponentAsVisited(graph, node, visited);\n    }\n\n    return numConnectedComponents;\n};",
    "tests": [
      {
        "args": [
          [
            [
              1,
              2
            ],
            [
              1,
              1
            ],
            [
              3,
              4
            ],
            [
              4,
              5
            ],
            [
              5,
              6
            ],
            [
              7,
              7
            ]
          ],
          1
        ],
        "expected": 3
      },
      {
        "args": [
          [
            [
              1,
              2,
              3
            ],
            [
              2,
              3,
              4
            ],
            [
              4,
              3,
              5
            ]
          ],
          2
        ],
        "expected": 1
      },
      {
        "args": [
          [
            [
              42,
              42
            ]
          ],
          1
        ],
        "expected": 1
      },
      {
        "args": [
          [
            [
              1
            ],
            [
              2
            ],
            [
              3
            ]
          ],
          1
        ],
        "expected": 3
      },
      {
        "args": [
          [
            [
              1,
              1,
              2
            ],
            [
              1,
              2,
              2
            ]
          ],
          3
        ],
        "expected": 2
      },
      {
        "args": [
          [
            [
              1,
              2,
              3
            ],
            [
              3,
              2,
              1
            ]
          ],
          3
        ],
        "expected": 1
      }
    ],
    "runner": {
      "kind": "function",
      "parameterNames": [
        "properties",
        "k"
      ]
    }
  },
  {
    "id": "structy-tree-sum",
    "title": "Tree Sum",
    "category": "new",
    "sourceName": "structy.net",
    "sourceLink": "https://structy.net/problems/tree-sum",
    "difficulty": "Easy",
    "statement": "You're given a binary tree where every node holds a number. In this problem a tree node is just a plain JavaScript object:\n\n```js\n{ val: 3, left: <node or null>, right: <node or null> }\n```\n\nAdd up every `val` in the whole tree and return the total. If the tree is empty (`root` is `null`), return `0`.\n\n**Function signature**\n\n```js\nfunction treeSum(root) {\n  // root: a node object, or null\n  // return a number\n}\n```",
    "examples": [
      {
        "input": "const root = {\n  val: 3,\n  left: {\n    val: 11,\n    left:  { val: 4,  left: null, right: null },\n    right: { val: -2, left: null, right: null }\n  },\n  right: {\n    val: 4,\n    left: null,\n    right: { val: 1, left: null, right: null }\n  }\n};\ntreeSum(root)",
        "output": "21",
        "explanation": "The tree looks like:\n\n```\n      3\n    /   \\\n  11     4\n  / \\     \\\n 4  -2     1\n```\n\nThe values are 3, 11, 4, -2, 4, 1. Running total: 3 + 11 = 14, 14 + 4 = 18, 18 + (-2) = 16, 16 + 4 = 20, 20 + 1 = 21."
      },
      {
        "input": "const root = {\n  val: 1,\n  left:  { val: 6, left: null, right: null },\n  right: {\n    val: 0,\n    left:  { val: -4, left: null, right: null },\n    right: null\n  }\n};\ntreeSum(root)",
        "output": "3",
        "explanation": "The values are 1, 6, 0, -4. Running total: 1 + 6 = 7, 7 + 0 = 7, 7 + (-4) = 3."
      }
    ],
    "constraints": [
      "The tree has 0 to 1,000 nodes",
      "-1,000 <= node value <= 1,000",
      "root may be null (empty tree) — return 0 in that case"
    ],
    "functionName": "treeSum",
    "solution": "// CONTRACT for treeSum(root):\n//     when this call returns, the returned value equals the total of\n//     every node value in the tree whose root is `root` (an empty\n//     tree returns 0).\nconst treeSum = (root) => {\n    // Base case: an empty tree adds nothing.\n    if (root === null) return 0;\n\n    // Process node\n    const currentNodeValue = root.val;\n\n    // Recurse on children\n    // The recursive leap of faith, one level down: this call has\n    // the SAME contract — when it returns, `leftSubtreeSum` equals\n    // the total of every node value in the left subtree. Trust it,\n    // do not trace it. Own value + the two guaranteed subtree totals\n    // = exactly this function's contract.\n    const leftSubtreeSum = treeSum(root.left);\n    // Same contract, one level down — trust it.\n    const rightSubtreeSum = treeSum(root.right);\n\n    return currentNodeValue + leftSubtreeSum + rightSubtreeSum;\n};\n",
    "tests": [
      {
        "args": [
          {
            "val": 3,
            "left": {
              "val": 11,
              "left": {
                "val": 4,
                "left": null,
                "right": null
              },
              "right": {
                "val": -2,
                "left": null,
                "right": null
              }
            },
            "right": {
              "val": 4,
              "left": null,
              "right": {
                "val": 1,
                "left": null,
                "right": null
              }
            }
          }
        ],
        "expected": 21
      },
      {
        "args": [
          {
            "val": 1,
            "left": {
              "val": 6,
              "left": null,
              "right": null
            },
            "right": {
              "val": 0,
              "left": {
                "val": -4,
                "left": null,
                "right": null
              },
              "right": null
            }
          }
        ],
        "expected": 3
      },
      {
        "args": [
          null
        ],
        "expected": 0
      },
      {
        "args": [
          {
            "val": 5,
            "left": null,
            "right": null
          }
        ],
        "expected": 5
      },
      {
        "args": [
          {
            "val": -2,
            "left": {
              "val": -3,
              "left": null,
              "right": null
            },
            "right": null
          }
        ],
        "expected": -5
      }
    ],
    "runner": {
      "kind": "function",
      "parameterNames": [
        "root"
      ]
    }
  },
  {
    "id": "path-sum",
    "title": "Path Sum",
    "category": "new",
    "sourceName": "LeetCode",
    "sourceLink": "https://leetcode.com/problems/path-sum/",
    "difficulty": "Easy",
    "statement": "You are given a binary tree and a whole number `targetSum`.\n\nThe tree arrives as `root`, a plain object: every node looks like `{val, left, right}`, where `val` is a number and `left` / `right` are the child nodes, or `null` if that child is missing. If the tree is empty, `root` itself is `null`.\n\nA **leaf** is a node with no children. A **root-to-leaf path** is the chain of nodes you pass through going from the top of the tree straight down to some leaf.\n\nReturn `true` if there is at least one root-to-leaf path whose values add up to exactly `targetSum`. Otherwise return `false`. (An empty tree has no paths, so the answer is `false`.)",
    "examples": [
      {
        "input": "root = {val: 5, left: {val: 4, left: {val: 11, left: {val: 7}, right: {val: 2}}}, right: {val: 8, left: {val: 13}, right: {val: 4, right: {val: 1}}}} (children not shown are null), targetSum = 22",
        "output": "true",
        "explanation": "The four root-to-leaf paths are: 5 -> 4 -> 11 -> 7 (total 27), 5 -> 4 -> 11 -> 2 (total 22), 5 -> 8 -> 13 (total 26), and 5 -> 8 -> 4 -> 1 (total 18). The second path adds up to exactly 22, so the answer is true."
      },
      {
        "input": "root = {val: 1, left: {val: 2}, right: {val: 3}}, targetSum = 5",
        "output": "false",
        "explanation": "There are two root-to-leaf paths: 1 -> 2 (total 3) and 1 -> 3 (total 4). Neither equals 5, so the answer is false."
      }
    ],
    "constraints": [
      "the number of nodes is in the range [0, 5000] (root may be null)",
      "-1000 <= node value <= 1000",
      "-1000 <= targetSum <= 1000",
      "the tree is given as plain nested objects {val, left, right}; missing children are null"
    ],
    "functionName": "hasPathSum",
    "solution": "// CONTRACT for hasPathSum(root, targetSum):\n//     when this call returns, the returned value is true exactly\n//     when some root-to-leaf path in the tree whose root is `root`\n//     adds up to `targetSum`, and false otherwise.\nconst hasPathSum = (root, targetSum) => {\n    // Base case: an empty tree has no root-to-leaf paths at all.\n    if (root === null) return false;\n\n    // Process node: this node uses up part of the target.\n    const remainingSum = targetSum - root.val;\n\n    // A path is only complete at a leaf, so only a leaf may declare success.\n    const isLeaf = root.left === null && root.right === null;\n    if (isLeaf) return remainingSum === 0;\n\n    // Recurse on children\n    // The recursive leap of faith, one level down: each of these two\n    // calls has the SAME contract — when it returns, its value is true\n    // exactly when that child's subtree has a root-to-leaf path adding\n    // up to `remainingSum`. Trust them, do not trace them. This node\n    // already used up its own value, so left-answer OR right-answer is\n    // exactly this function's contract.\n    return (\n        hasPathSum(root.left, remainingSum) ||\n        hasPathSum(root.right, remainingSum)\n    );\n};\n",
    "tests": [
      {
        "args": [
          {
            "val": 5,
            "left": {
              "val": 4,
              "left": {
                "val": 11,
                "left": {
                  "val": 7,
                  "left": null,
                  "right": null
                },
                "right": {
                  "val": 2,
                  "left": null,
                  "right": null
                }
              },
              "right": null
            },
            "right": {
              "val": 8,
              "left": {
                "val": 13,
                "left": null,
                "right": null
              },
              "right": {
                "val": 4,
                "left": null,
                "right": {
                  "val": 1,
                  "left": null,
                  "right": null
                }
              }
            }
          },
          22
        ],
        "expected": true
      },
      {
        "args": [
          {
            "val": 1,
            "left": {
              "val": 2,
              "left": null,
              "right": null
            },
            "right": {
              "val": 3,
              "left": null,
              "right": null
            }
          },
          5
        ],
        "expected": false
      },
      {
        "args": [
          null,
          0
        ],
        "expected": false
      },
      {
        "args": [
          {
            "val": 7,
            "left": null,
            "right": null
          },
          7
        ],
        "expected": true
      },
      {
        "args": [
          {
            "val": -2,
            "left": null,
            "right": {
              "val": -3,
              "left": null,
              "right": null
            }
          },
          -5
        ],
        "expected": true
      },
      {
        "args": [
          {
            "val": 1,
            "left": {
              "val": 2,
              "left": null,
              "right": null
            },
            "right": null
          },
          1
        ],
        "expected": false
      }
    ],
    "runner": {
      "kind": "function",
      "parameterNames": [
        "root",
        "targetSum"
      ]
    }
  },
  {
    "id": "structy-max-root-to-leaf-path-sum",
    "title": "Max Root-to-Leaf Path Sum",
    "category": "new",
    "sourceName": "structy.net",
    "sourceLink": "https://structy.net/problems/max-root-to-leaf-path-sum",
    "difficulty": "Easy",
    "statement": "You're given a non-empty binary tree where every node holds a number. Each node is a plain JavaScript object:\n\n```js\n{ val: 3, left: <node or null>, right: <node or null> }\n```\n\nA **root-to-leaf path** starts at the root and repeatedly steps to a child until it reaches a **leaf** — a node with no children (`left` and `right` both `null`). The path's sum is the total of all `val`s along it, including the root's and the leaf's.\n\nReturn the largest sum among all root-to-leaf paths. Watch out: values can be negative, and a path is only allowed to stop at a leaf.\n\n**Function signature**\n\n```js\nfunction maxPathSum(root) {\n  // root: a node object (never null)\n  // return a number\n}\n```",
    "examples": [
      {
        "input": "const root = {\n  val: 3,\n  left: {\n    val: 11,\n    left:  { val: 4,  left: null, right: null },\n    right: { val: -2, left: null, right: null }\n  },\n  right: {\n    val: 4,\n    left: null,\n    right: { val: 1, left: null, right: null }\n  }\n};\nmaxPathSum(root)",
        "output": "18",
        "explanation": "The tree looks like:\n\n```\n      3\n    /   \\\n  11     4\n  / \\     \\\n 4  -2     1\n```\n\nEvery root-to-leaf path: 3 -> 11 -> 4 sums to 18, 3 -> 11 -> -2 sums to 12, 3 -> 4 -> 1 sums to 8. The biggest is 18."
      },
      {
        "input": "const root = {\n  val: 2,\n  left: {\n    val: -1,\n    left:  { val: 4, left: null, right: null },\n    right: { val: 7, left: null, right: null }\n  },\n  right: { val: 10, left: null, right: null }\n};\nmaxPathSum(root)",
        "output": "12",
        "explanation": "The paths are 2 -> -1 -> 4 = 5, 2 -> -1 -> 7 = 8, and 2 -> 10 = 12. The node 10 has no children, so it is a leaf and the path may stop there. The biggest sum is 12."
      }
    ],
    "constraints": [
      "The tree has 1 to 1,000 nodes (it is never empty)",
      "-1,000 <= node value <= 1,000 (negative values happen)",
      "A path must end at a leaf — it cannot stop partway down"
    ],
    "functionName": "maxPathSum",
    "solution": "// CONTRACT for maxPathSum(root):\n//     when this call returns, the returned value equals the largest\n//     possible total of node values on any path from `root` down to\n//     a leaf. `root` here means whatever node this call was handed —\n//     each recursive call gets its own.\nconst maxPathSum = (root) => {\n    // Base case: a path may only stop at a leaf, so a leaf's best path\n    // is simply its own value.\n    const isLeaf = root.left === null && root.right === null;\n    if (isLeaf) return root.val;\n\n    // Process node\n\n    // Recurse on children\n    // Values can be negative, so a missing child is skipped entirely\n    // rather than treated as a 0-valued path.\n    const childPathSums = [];\n\n    // The recursive leap of faith, one level down: this call has\n    // the SAME contract — when it returns, its value equals the best\n    // root-to-leaf total inside the left subtree. Trust it, do not\n    // trace it. Own value + the best of the children's guaranteed\n    // totals = exactly this function's contract.\n    if (root.left !== null) childPathSums.push(maxPathSum(root.left));\n    // Same contract, one level down — trust it.\n    if (root.right !== null) childPathSums.push(maxPathSum(root.right));\n\n    return root.val + Math.max(...childPathSums);\n};\n",
    "tests": [
      {
        "args": [
          {
            "val": 3,
            "left": {
              "val": 11,
              "left": {
                "val": 4,
                "left": null,
                "right": null
              },
              "right": {
                "val": -2,
                "left": null,
                "right": null
              }
            },
            "right": {
              "val": 4,
              "left": null,
              "right": {
                "val": 1,
                "left": null,
                "right": null
              }
            }
          }
        ],
        "expected": 18
      },
      {
        "args": [
          {
            "val": 2,
            "left": {
              "val": -1,
              "left": {
                "val": 4,
                "left": null,
                "right": null
              },
              "right": {
                "val": 7,
                "left": null,
                "right": null
              }
            },
            "right": {
              "val": 10,
              "left": null,
              "right": null
            }
          }
        ],
        "expected": 12
      },
      {
        "args": [
          {
            "val": -7,
            "left": null,
            "right": null
          }
        ],
        "expected": -7
      },
      {
        "args": [
          {
            "val": 1,
            "left": {
              "val": -5,
              "left": {
                "val": 20,
                "left": null,
                "right": null
              },
              "right": null
            },
            "right": {
              "val": 2,
              "left": null,
              "right": null
            }
          }
        ],
        "expected": 16
      },
      {
        "args": [
          {
            "val": 2,
            "left": null,
            "right": {
              "val": -1,
              "left": null,
              "right": {
                "val": 3,
                "left": null,
                "right": null
              }
            }
          }
        ],
        "expected": 4
      }
    ],
    "runner": {
      "kind": "function",
      "parameterNames": [
        "root"
      ]
    }
  },
  {
    "id": "evaluate-boolean-binary-tree",
    "title": "Evaluate Boolean Binary Tree",
    "category": "new",
    "sourceName": "LeetCode",
    "sourceLink": "https://leetcode.com/problems/evaluate-boolean-binary-tree/",
    "difficulty": "Easy",
    "statement": "You are given a special binary tree as `root` (plain objects `{val, left, right}`, with `null` for missing children). In this tree, every node has either exactly two children or none at all.\n\n- A node with **no children** holds `0` (meaning **false**) or `1` (meaning **true**).\n- A node with **two children** holds `2` (meaning **OR**) or `3` (meaning **AND**).\n\nEvery node has a true/false value:\n\n- A childless node's value is simply its own meaning: `0` is false, `1` is true.\n- An OR node (holding `2`) is true when **at least one** of its two children's values is true.\n- An AND node (holding `3`) is true only when **both** of its children's values are true.\n\nReturn the true/false value of the root node as a boolean.",
    "examples": [
      {
        "input": "root = {val: 2, left: {val: 1}, right: {val: 3, left: {val: 0}, right: {val: 1}}}",
        "output": "true",
        "explanation": "The right child holds 3 (AND) and its children are 0 (false) and 1 (true): false AND true = false. The root holds 2 (OR) and its children's values are true (the left leaf holding 1) and false (the AND result): true OR false = true."
      },
      {
        "input": "root = {val: 0}",
        "output": "false",
        "explanation": "The root has no children, so its value is its own meaning: 0 means false."
      }
    ],
    "constraints": [
      "the number of nodes is in the range [1, 1000]",
      "every node has either 0 or 2 children",
      "childless nodes hold 0 or 1; nodes with children hold 2 or 3",
      "the tree is given as plain nested objects {val, left, right}; missing children are null"
    ],
    "functionName": "evaluateTree",
    "solution": "const TRUE_NODE = 1;\nconst OR_NODE = 2;\nconst AND_NODE = 3;\n\n// CONTRACT for evaluateTree(root):\n//     when this call returns, the returned value is the single\n//     true/false answer that the whole tree under `root` boils\n//     down to. `root` here means whatever node this call was\n//     handed — each recursive call gets its own.\nconst evaluateTree = (root) => {\n    // Base case: a childless node's true/false value is its own meaning.\n    const isLeaf = root.left === null && root.right === null;\n    if (isLeaf) return root.val === TRUE_NODE;\n\n    // Process node: a parent's value names the operator it applies.\n    const isAndNode = root.val === AND_NODE;\n\n    // Recurse on children\n    // The recursive leap of faith, one level down: this call has\n    // the SAME contract — when it returns, `leftChildValue` is the\n    // true/false answer of the entire left subtree. Trust it, do not\n    // trace it. This node's operator applied to the two guaranteed\n    // child answers = exactly this function's contract.\n    const leftChildValue = evaluateTree(root.left);\n    // Same contract, one level down — trust it.\n    const rightChildValue = evaluateTree(root.right);\n\n    // An AND node needs both children true; an OR node needs at least one.\n    if (isAndNode) return leftChildValue && rightChildValue;\n\n    return leftChildValue || rightChildValue;\n};\n",
    "tests": [
      {
        "args": [
          {
            "val": 2,
            "left": {
              "val": 1,
              "left": null,
              "right": null
            },
            "right": {
              "val": 3,
              "left": {
                "val": 0,
                "left": null,
                "right": null
              },
              "right": {
                "val": 1,
                "left": null,
                "right": null
              }
            }
          }
        ],
        "expected": true
      },
      {
        "args": [
          {
            "val": 0,
            "left": null,
            "right": null
          }
        ],
        "expected": false
      },
      {
        "args": [
          {
            "val": 1,
            "left": null,
            "right": null
          }
        ],
        "expected": true
      },
      {
        "args": [
          {
            "val": 3,
            "left": {
              "val": 1,
              "left": null,
              "right": null
            },
            "right": {
              "val": 1,
              "left": null,
              "right": null
            }
          }
        ],
        "expected": true
      },
      {
        "args": [
          {
            "val": 2,
            "left": {
              "val": 0,
              "left": null,
              "right": null
            },
            "right": {
              "val": 0,
              "left": null,
              "right": null
            }
          }
        ],
        "expected": false
      },
      {
        "args": [
          {
            "val": 3,
            "left": {
              "val": 2,
              "left": {
                "val": 0,
                "left": null,
                "right": null
              },
              "right": {
                "val": 0,
                "left": null,
                "right": null
              }
            },
            "right": {
              "val": 1,
              "left": null,
              "right": null
            }
          }
        ],
        "expected": false
      }
    ],
    "runner": {
      "kind": "function",
      "parameterNames": [
        "root"
      ]
    }
  },
  {
    "id": "codewars-array-deep-count",
    "title": "Array Deep Count",
    "category": "new",
    "sourceName": "Codewars",
    "sourceLink": "https://www.codewars.com/kata/596f72bbe7cd7296d1000029",
    "difficulty": "Easy",
    "statement": "You're given an array that can hold numbers, strings, booleans — and other arrays, nested as deep as you like.\n\nCount how many elements the array holds **in total, at every level**. An inner array counts as one element itself, and then everything inside it gets counted as well.\n\nReturn the total count. An empty array holds 0 elements.\n\n**Function signature**\n\n```js\nfunction deepCount(arr) {\n  // arr: an array (possibly containing nested arrays)\n  // return a number\n}\n```",
    "examples": [
      {
        "input": "deepCount([1, 2, [3, 4, [5]]])",
        "output": "7",
        "explanation": "The outer array holds 3 elements: 1, 2, and the array [3, 4, [5]]. That inner array holds 3 more: 3, 4, and [5]. And [5] holds 1 more: 5. Total: 3 + 3 + 1 = 7."
      },
      {
        "input": "deepCount([\"x\", \"y\", [\"z\"]])",
        "output": "4",
        "explanation": "The outer array holds 3 elements: \"x\", \"y\", and [\"z\"]. The inner array [\"z\"] holds 1 element: \"z\". Total: 3 + 1 = 4."
      }
    ],
    "constraints": [
      "Elements are numbers, strings, booleans, or arrays of these",
      "Total number of elements (all levels combined) <= 10,000",
      "Nesting depth <= 100",
      "deepCount([]) is 0"
    ],
    "functionName": "deepCount",
    "solution": "// CONTRACT for countElementDeep(element):\n//     when this call returns, the returned value equals the count of\n//     `element` itself plus everything nested anywhere inside it\n//     (a plain non-array value counts as exactly 1).\nconst countElementDeep = (element) => {\n    // Base case: a non-array element (number, string, boolean) counts as one.\n    if (!Array.isArray(element)) return 1;\n\n    // Process node: an inner array counts as one element itself...\n    let totalCount = 1;\n\n    // Recurse on neighbors: ...and then everything inside it counts too.\n    for (const innerElement of element) {\n        // The recursive leap of faith, one level down: this call has\n        // the SAME contract — when it returns, its value counts\n        // `innerElement` plus everything nested inside it. Trust it,\n        // do not trace it. The 1 for this array + the guaranteed\n        // counts of its contents = exactly this function's contract.\n        totalCount += countElementDeep(innerElement);\n    }\n\n    return totalCount;\n};\n\nconst deepCount = (arr) => {\n    // The outermost array is the container we are counting inside of,\n    // so it contributes 0 on its own -- only its contents count.\n    let totalCount = 0;\n\n    for (const element of arr) {\n        // The recursive leap of faith: trust the contract. When this\n        // call returns, its value is the complete count of `element`\n        // and everything nested inside it, however deep. We do not\n        // trace inside; we just add it to the running total.\n        totalCount += countElementDeep(element);\n    }\n\n    return totalCount;\n};",
    "tests": [
      {
        "args": [
          [
            1,
            2,
            [
              3,
              4,
              [
                5
              ]
            ]
          ]
        ],
        "expected": 7
      },
      {
        "args": [
          [
            "x",
            "y",
            [
              "z"
            ]
          ]
        ],
        "expected": 4
      },
      {
        "args": [
          []
        ],
        "expected": 0
      },
      {
        "args": [
          [
            []
          ]
        ],
        "expected": 1
      },
      {
        "args": [
          [
            true,
            false,
            [
              "a",
              [
                1
              ]
            ]
          ]
        ],
        "expected": 6
      },
      {
        "args": [
          [
            [
              [
                [
                  [
                    1
                  ]
                ]
              ]
            ]
          ]
        ],
        "expected": 5
      }
    ],
    "runner": {
      "kind": "function",
      "parameterNames": [
        "arr"
      ]
    }
  },
  {
    "id": "usaco-fence-planning",
    "title": "Fence Planning",
    "category": "new",
    "sourceName": "USACO",
    "sourceLink": "https://usaco.org/index.php?page=viewproblem2&cpid=944",
    "difficulty": "Medium",
    "statement": "Farmer John's `N` cows are numbered `0` to `N - 1`, and cow `i` is standing at position `positions[i] = [x, y]` in the pasture (all positions are distinct).\n\nCows chat by mooing. `pairs[j] = [a, b]` means cows `a` and `b` moo back and forth with each other. Cows form **herds**: two cows belong to the same herd if they moo with each other directly, or are linked through a chain of mooing pairs. Every cow moos with at least one other cow.\n\nFarmer John wants to build **one** rectangular fence, with sides parallel to the x- and y-axes, that contains every cow of **at least one entire herd** (cows from other herds may happen to end up inside too — that's fine). A cow standing exactly on the fence line counts as inside, and the rectangle is allowed to have zero width or zero height. A fence spanning width `w` and height `h` has perimeter `2 * (w + h)`.\n\nReturn the smallest perimeter Farmer John can get away with.\n\n**Function signature**\n\n```js\nfunction minFencePerimeter(positions, pairs) {\n  // positions: array of [x, y] integer pairs\n  // pairs: array of [a, b] cow-number pairs\n  // return a number\n}\n```",
    "examples": [
      {
        "input": "minFencePerimeter(\n  [[0, 0], [3, 1], [1, 2], [10, 10], [12, 11]],\n  [[0, 1], [1, 2], [3, 4]]\n)",
        "output": "6",
        "explanation": "Cows 0, 1, 2 form one herd (0 moos with 1, and 1 moos with 2). Cows 3 and 4 form another. Herd {0, 1, 2}: x runs 0 to 3 (width 3), y runs 0 to 2 (height 2), perimeter 2 * (3 + 2) = 10. Herd {3, 4}: x runs 10 to 12 (width 2), y runs 10 to 11 (height 1), perimeter 2 * (2 + 1) = 6. The smaller option is 6."
      },
      {
        "input": "minFencePerimeter(\n  [[2, 5], [2, 9], [7, 5], [4, 4], [6, 6]],\n  [[0, 2], [1, 3], [3, 4]]\n)",
        "output": "10",
        "explanation": "The herds are {0, 2} and {1, 3, 4}. Herd {0, 2}: cows at [2, 5] and [7, 5], so width 5 and height 0 — a zero-height fence is allowed — perimeter 2 * (5 + 0) = 10. Herd {1, 3, 4}: x runs 2 to 6 (width 4), y runs 4 to 9 (height 5), perimeter 2 * (4 + 5) = 18. Answer: 10."
      }
    ],
    "constraints": [
      "2 <= N <= 5,000 cows; 1 <= number of pairs <= 5,000",
      "0 <= x, y <= 1,000,000 (integers); all positions distinct",
      "Each pair links two different cows; every cow appears in at least one pair"
    ],
    "functionName": "minFencePerimeter",
    "solution": "const buildGraph = (edges) => {\n    const graph = {};\n\n    for (const edge of edges) {\n        const [nodeOne, nodeTwo] = edge;\n\n        const nodeOneInGraph = graph.hasOwnProperty(nodeOne);\n        const nodeTwoInGraph = graph.hasOwnProperty(nodeTwo);\n\n        if (!nodeOneInGraph) graph[nodeOne] = [];\n        if (!nodeTwoInGraph) graph[nodeTwo] = [];\n\n        graph[nodeOne].push(nodeTwo);\n        graph[nodeTwo].push(nodeOne);\n    }\n\n    return graph;\n};\n\n// CONTRACT for markHerdAsVisited(graph, cow, visited, herdCows):\n//     when this call returns, `cow` and every cow connected to her\n//     through any chain of friendships is in the visited set AND in\n//     the `herdCows` list.\nconst markHerdAsVisited = (graph, cow, visited, herdCows) => {\n    // Base case\n    if (visited.has(cow)) return;\n\n    // Process node\n    visited.add(cow);\n    herdCows.push(cow);\n\n    // Recurse on neighbors\n    const cowInGraph = graph.hasOwnProperty(cow);\n    if (!cowInGraph) return;\n\n    const neighbors = graph[cow];\n\n    for (const neighbor of neighbors) {\n        // The recursive leap of faith, one level down: this call has\n        // the SAME contract — when it returns, `neighbor` and every\n        // cow connected to `neighbor` is in visited and in `herdCows`.\n        // Trust it, do not trace it. This function already put `cow`\n        // into both, and each neighbor's contract covers the rest of\n        // the herd — together, that is this function's full contract,\n        // kept.\n        markHerdAsVisited(graph, neighbor, visited, herdCows);\n    }\n};\n\nconst getHerdFencePerimeter = (positions, herdCows) => {\n    let minX = Infinity;\n    let maxX = -Infinity;\n    let minY = Infinity;\n    let maxY = -Infinity;\n\n    for (const cow of herdCows) {\n        const [x, y] = positions[cow];\n\n        minX = Math.min(minX, x);\n        maxX = Math.max(maxX, x);\n        minY = Math.min(minY, y);\n        maxY = Math.max(maxY, y);\n    }\n\n    // A cow standing exactly on the fence line still counts as inside,\n    // so the tightest fence runs right through the outermost cows.\n    const width = maxX - minX;\n    const height = maxY - minY;\n\n    return 2 * (width + height);\n};\n\nconst minFencePerimeter = (positions, pairs) => {\n    const graph = buildGraph(pairs);\n    const numCows = positions.length;\n\n    let smallestPerimeter = Infinity;\n    const visited = new Set();\n\n    for (let cow = 0; cow < numCows; cow++) {\n        if (visited.has(cow)) continue;\n\n        // Every cow we have not seen yet starts a brand new herd.\n        const herdCows = [];\n        // The recursive leap of faith: trust the contract. When this\n        // call returns, `herdCows` holds the complete herd around\n        // `cow`, and every one of those cows is in visited, so no\n        // herd is ever built twice. We do not trace inside; we just\n        // measure the finished herd's fence and keep the smallest.\n        markHerdAsVisited(graph, cow, visited, herdCows);\n\n        const herdPerimeter = getHerdFencePerimeter(positions, herdCows);\n        smallestPerimeter = Math.min(smallestPerimeter, herdPerimeter);\n    }\n\n    return smallestPerimeter;\n};",
    "tests": [
      {
        "args": [
          [
            [
              0,
              0
            ],
            [
              3,
              1
            ],
            [
              1,
              2
            ],
            [
              10,
              10
            ],
            [
              12,
              11
            ]
          ],
          [
            [
              0,
              1
            ],
            [
              1,
              2
            ],
            [
              3,
              4
            ]
          ]
        ],
        "expected": 6
      },
      {
        "args": [
          [
            [
              2,
              5
            ],
            [
              2,
              9
            ],
            [
              7,
              5
            ],
            [
              4,
              4
            ],
            [
              6,
              6
            ]
          ],
          [
            [
              0,
              2
            ],
            [
              1,
              3
            ],
            [
              3,
              4
            ]
          ]
        ],
        "expected": 10
      },
      {
        "args": [
          [
            [
              3,
              3
            ],
            [
              3,
              8
            ]
          ],
          [
            [
              0,
              1
            ]
          ]
        ],
        "expected": 10
      },
      {
        "args": [
          [
            [
              0,
              0
            ],
            [
              5,
              0
            ],
            [
              0,
              5
            ]
          ],
          [
            [
              0,
              1
            ],
            [
              1,
              2
            ]
          ]
        ],
        "expected": 20
      },
      {
        "args": [
          [
            [
              4,
              7
            ],
            [
              0,
              0
            ],
            [
              10,
              0
            ]
          ],
          [
            [
              1,
              2
            ]
          ]
        ],
        "expected": 0
      }
    ],
    "runner": {
      "kind": "function",
      "parameterNames": [
        "positions",
        "pairs"
      ]
    }
  },
  {
    "id": "kattis-getting-gold",
    "title": "Getting Gold",
    "category": "new",
    "sourceName": "Kattis",
    "sourceLink": "https://open.kattis.com/problems/gold",
    "difficulty": "Medium",
    "statement": "You're writing the scoring screen for a text-based treasure game. The dungeon map is a rectangular grid, given to you as an array of strings — one string per row. Each character is one of:\n\n- `P` — the explorer's starting square (exactly one on the map)\n- `G` — a piece of gold\n- `T` — a hidden trap\n- `#` — a wall\n- `.` — open floor\n\nThe outer border of the map is always solid wall.\n\nThe explorer moves one square at a time — up, down, left, or right, never diagonally, and never into a wall. She automatically picks up the gold on any square she stands on (including her starting square, if it had gold).\n\nShe can't see traps. But while standing on a square, she **feels a draft** if one or more traps sit directly next to her (up, down, left, or right). She plays it perfectly safe:\n\n- On a square with **no draft**, every neighboring non-wall square is guaranteed trap-free, so she can step onto any of them.\n- On a square **with a draft**, she can't tell which neighbor hides a trap, so she will never step onto a square she hasn't already stood on. She can only retrace her steps back the way she came.\n\nReturn the number of gold pieces she can collect while playing this cautiously.\n\n**Function signature**\n\n```js\nfunction collectSafeGold(grid) {\n  // grid: array of equal-length strings\n  // return a number\n}\n```",
    "examples": [
      {
        "input": "collectSafeGold([\n  \"#######\",\n  \"#P.GTG#\",\n  \"#..TGG#\",\n  \"#######\"\n])",
        "output": "1",
        "explanation": "She starts at row 1, col 1 (no draft there). The floor at row 1, col 2 has no draft, so she can move through it to the gold at row 1, col 3. Standing on that gold she feels a draft (trap at row 1, col 4), so she takes it and backs out. The floor at row 2, col 2 has a draft too (trap at row 2, col 3), so she can stand there but go no further. All remaining gold lies past trap-guarded squares, so she collects just 1 piece."
      },
      {
        "input": "collectSafeGold([\n  \"########\",\n  \"#...GTG#\",\n  \"#..PG.G#\",\n  \"#...G#G#\",\n  \"#..TG.G#\",\n  \"########\"\n])",
        "output": "4",
        "explanation": "From P at row 2, col 3 she steps onto the gold at row 2, col 4 (no draft) and continues to the gold at row 3, col 4 (also no draft). From those safe squares she can grab the gold at row 1, col 4 (draft — trap at row 1, col 5) and at row 4, col 4 (draft — trap at row 4, col 3), backing out each time. That's 4 pieces. The three gold pieces in the rightmost open column are only reachable through draft squares like row 2, col 5, so she can never get them."
      }
    ],
    "constraints": [
      "3 <= grid width, height <= 50",
      "All rows have the same length, and the border is entirely `#`",
      "Exactly one `P` on the map",
      "Characters are only `P`, `G`, `T`, `#`, `.`"
    ],
    "functionName": "collectSafeGold",
    "solution": "const GOLD = 'G';\nconst TRAP = 'T';\nconst WALL = '#';\nconst EXPLORER_START = 'P';\n\nconst getPositionString = (row, col) => `${row}, ${col}`;\nconst directions = [\n    [0, 1],\n    [1, 0],\n    [0, -1],\n    [-1, 0],\n];\n\nconst isInBounds = (grid, row, col) => {\n    const numRows = grid.length;\n    const numCols = grid[0].length;\n\n    const rowInBounds = row >= 0 && row < numRows;\n    const colInBounds = col >= 0 && col < numCols;\n\n    return rowInBounds && colInBounds;\n};\n\nconst findStartPosition = (grid) => {\n    for (let row = 0; row < grid.length; row++) {\n        for (let col = 0; col < grid[row].length; col++) {\n            if (grid[row][col] === EXPLORER_START) return [row, col];\n        }\n    }\n};\n\nconst feelsDraft = (grid, row, col) => {\n    for (const direction of directions) {\n        const [rowChange, colChange] = direction;\n\n        const neighborRow = row + rowChange;\n        const neighborCol = col + colChange;\n\n        if (!isInBounds(grid, neighborRow, neighborCol)) continue;\n\n        if (grid[neighborRow][neighborCol] === TRAP) return true;\n    }\n\n    return false;\n};\n\n// CONTRACT for countGoldFromPosition(grid, row, col, visited):\n//     when this call returns, every safe square the explorer can\n//     reach from (`row`, `col`) that was not already in the visited\n//     set is now in it, and the returned value equals the gold\n//     sitting on those newly added squares.\nconst countGoldFromPosition = (grid, row, col, visited) => {\n    // Base cases\n    if (!isInBounds(grid, row, col)) return 0;\n\n    const curPositionString = getPositionString(row, col);\n    if (visited.has(curPositionString)) return 0;\n\n    if (grid[row][col] === WALL) return 0;\n\n    // Process node\n    visited.add(curPositionString);\n\n    let goldCollected = grid[row][col] === GOLD ? 1 : 0;\n\n    // A draft means a trap could hide on ANY neighbor she has not stood on,\n    // so she grabs this square's gold and only retraces her steps back out.\n    if (feelsDraft(grid, row, col)) return goldCollected;\n\n    // Recurse on neighbors\n    // No draft here means every non-wall neighbor is guaranteed trap-free.\n    for (const direction of directions) {\n        const [rowChange, colChange] = direction;\n\n        const newRow = row + rowChange;\n        const newCol = col + colChange;\n\n        // The recursive leap of faith, one level down: this call has\n        // the SAME contract — when it returns, every new safe square\n        // reachable from this neighbor is in visited, and the call\n        // returns the gold on exactly those squares. Trust it, do not\n        // trace it. This square's own gold + each neighbor's guaranteed\n        // gold = exactly this function's contract.\n        goldCollected += countGoldFromPosition(grid, newRow, newCol, visited);\n    }\n\n    return goldCollected;\n};\n\nconst collectSafeGold = (grid) => {\n    const [startRow, startCol] = findStartPosition(grid);\n\n    const visited = new Set();\n\n    // The recursive leap of faith: trust the contract. When this\n    // call returns, its value is ALL the gold the explorer can safely\n    // collect from her starting square. We do not trace inside; we\n    // just return that number as the answer.\n    return countGoldFromPosition(grid, startRow, startCol, visited);\n};",
    "tests": [
      {
        "args": [
          [
            "#######",
            "#P.GTG#",
            "#..TGG#",
            "#######"
          ]
        ],
        "expected": 1
      },
      {
        "args": [
          [
            "########",
            "#...GTG#",
            "#..PG.G#",
            "#...G#G#",
            "#..TG.G#",
            "########"
          ]
        ],
        "expected": 4
      },
      {
        "args": [
          [
            "#####",
            "#PG.#",
            "#####"
          ]
        ],
        "expected": 1
      },
      {
        "args": [
          [
            "######",
            "#P.TG#",
            "######"
          ]
        ],
        "expected": 0
      },
      {
        "args": [
          [
            "#####",
            "#PT.#",
            "#G..#",
            "#####"
          ]
        ],
        "expected": 0
      }
    ],
    "runner": {
      "kind": "function",
      "parameterNames": [
        "grid"
      ]
    }
  },
  {
    "id": "battleships-in-a-board",
    "title": "Battleships in a Board",
    "category": "original",
    "section": "Traversing connected components",
    "difficulty": "Medium",
    "sourceName": "LeetCode",
    "sourceLink": "https://leetcode.com/problems/battleships-in-a-board/",
    "statement": "You are given an `m x n` grid called `board` where every cell is one of two characters:\n\n- `'X'` — part of a battleship\n- `'.'` — empty water\n\nReturn the number of battleships on the board.\n\nEach battleship is a straight line of one or more `'X'` cells, placed either fully horizontally (all in one row) or fully vertically (all in one column). Ships never touch each other: between any two different battleships there is always at least one cell of empty water, even diagonally-adjacent ships never share an edge.",
    "examples": [
      {
        "input": "board = [[\"X\",\".\",\".\",\"X\"],[\".\",\".\",\".\",\"X\"],[\".\",\".\",\".\",\"X\"]]",
        "output": "2",
        "explanation": "There is a 1-cell ship in the top-left corner and a vertical 3-cell ship in the last column."
      },
      {
        "input": "board = [[\".\"]]",
        "output": "0",
        "explanation": "The board is all water, so there are no battleships."
      }
    ],
    "constraints": [
      "m == board.length",
      "n == board[i].length",
      "1 <= m, n <= 200",
      "board[i][j] is either '.' or 'X'"
    ],
    "functionName": "countBattleships",
    "solution": "const SHIP = 'X';\n\nconst getPositionString = (row, col) => `${row}, ${col}`;\nconst directions = [\n    [0, 1],\n    [1, 0],\n    [0, -1],\n    [-1, 0],\n];\n\nconst isInBounds = (board, row, col) => {\n    const numRows = board.length;\n    const numCols = board[0].length;\n\n    const rowInBounds = row >= 0 && row < numRows;\n    const colInBounds = col >= 0 && col < numCols;\n\n    return rowInBounds && colInBounds;\n};\n\n// CONTRACT for markShipAsVisited(board, row, col, visited):\n//     when this call returns, if the cell at `row`,`col` is part of a\n//     ship, that cell and every connected cell of the same ship is in\n//     the visited set. (Water or out-of-bounds cells change nothing.)\nconst markShipAsVisited = (board, row, col, visited) => {\n    // Base cases\n    if (!isInBounds(board, row, col)) return;\n\n    const curPositionString = getPositionString(row, col);\n    if (visited.has(curPositionString)) return;\n\n    if (board[row][col] !== SHIP) return;\n\n    // Process node\n    visited.add(curPositionString);\n\n    // Recurse on potential neighbors\n    for (const direction of directions) {\n        const [rowChange, colChange] = direction;\n\n        const newRow = row + rowChange;\n        const newCol = col + colChange;\n\n        // The recursive leap of faith, one level down: this call has\n        // the SAME contract — when it returns, the neighbor cell (if it\n        // is part of the ship) and every ship cell connected to it is\n        // in visited. Trust it, do not trace it. This function already\n        // put `row`,`col` into visited, and each neighbor's contract\n        // covers the rest of the ship — together, that is this\n        // function's full contract, kept.\n        markShipAsVisited(board, newRow, newCol, visited);\n    }\n};\n\nconst countBattleships = (board) => {\n    const numRows = board.length;\n    const numCols = board[0].length;\n\n    let numBattleships = 0;\n    const visited = new Set();\n\n    for (let row = 0; row < numRows; row++) {\n        for (let col = 0; col < numCols; col++) {\n            const curPositionString = getPositionString(row, col);\n\n            if (visited.has(curPositionString)) continue;\n\n            const cellType = board[row][col];\n            if (cellType !== SHIP) continue;\n\n            // An unvisited 'X' cell must be the start of a brand new ship,\n            // because we already marked every cell of the ships we found.\n            numBattleships++;\n\n            // The recursive leap of faith: trust the contract. When this\n            // call returns, every cell of this newly found ship is in\n            // visited, so the loops can never count the same ship again.\n            // We do not trace inside; we just count the ship and move on.\n            markShipAsVisited(board, row, col, visited);\n        }\n    }\n\n    return numBattleships;\n};\n",
    "tests": [
      {
        "args": [
          [
            [
              "X",
              ".",
              ".",
              "X"
            ],
            [
              ".",
              ".",
              ".",
              "X"
            ],
            [
              ".",
              ".",
              ".",
              "X"
            ]
          ]
        ],
        "expected": 2
      },
      {
        "args": [
          [
            [
              "."
            ]
          ]
        ],
        "expected": 0
      },
      {
        "args": [
          [
            [
              "X"
            ]
          ]
        ],
        "expected": 1
      },
      {
        "args": [
          [
            [
              "X",
              "X",
              "X"
            ]
          ]
        ],
        "expected": 1
      },
      {
        "args": [
          [
            [
              "X",
              ".",
              "X"
            ],
            [
              ".",
              ".",
              "."
            ],
            [
              "X",
              ".",
              "X"
            ]
          ]
        ],
        "expected": 4
      }
    ],
    "curriculumOrder": 3,
    "runner": {
      "kind": "function",
      "parameterNames": [
        "board"
      ]
    }
  },
  {
    "id": "detonate-the-maximum-bombs",
    "title": "Detonate the Maximum Bombs",
    "category": "original",
    "section": "Traversing connected components",
    "difficulty": "Medium",
    "sourceName": "LeetCode",
    "sourceLink": "https://leetcode.com/problems/detonate-the-maximum-bombs/",
    "statement": "You are given a list of bombs sitting on a 2D plane. Each bomb has a position and a circular blast range: `bombs[i] = [xi, yi, ri]` means bomb `i` sits at the point `(xi, yi)` and its explosion reaches every point within distance `ri` of that point.\n\nWhen a bomb explodes, it sets off every other bomb whose **center** lies inside (or exactly on the edge of) its blast circle. Each bomb that gets set off then explodes with its **own** range, possibly triggering even more bombs — a chain reaction.\n\nYou are allowed to detonate **exactly one** bomb of your choice by hand. Return the largest total number of bombs that can end up exploding (including the one you detonate).",
    "examples": [
      {
        "input": "bombs = [[2,1,3],[6,1,4]]",
        "output": "2",
        "explanation": "The bombs are 4 units apart. Bomb 0 (range 3) cannot reach bomb 1, but bomb 1 (range 4) reaches bomb 0. Detonating bomb 1 sets off both bombs."
      },
      {
        "input": "bombs = [[1,1,5],[10,10,5]]",
        "output": "1",
        "explanation": "The two bombs are too far apart to reach each other, so detonating either one only explodes that single bomb."
      },
      {
        "input": "bombs = [[1,2,3],[2,3,1],[3,4,2],[4,5,3],[5,6,4]]",
        "output": "5",
        "explanation": "Detonating bomb 0 sets off bombs 1 and 2. Bomb 2 sets off bomb 3, and bomb 3 sets off bomb 4, so all 5 bombs explode."
      }
    ],
    "constraints": [
      "1 <= bombs.length <= 100",
      "bombs[i].length == 3",
      "1 <= xi, yi, ri <= 10^5"
    ],
    "functionName": "maximumDetonation",
    "solution": "const buildGraph = (bombs) => {\n    const graph = {};\n\n    for (let bomb = 0; bomb < bombs.length; bomb++) {\n        graph[bomb] = [];\n    }\n\n    for (let bomb = 0; bomb < bombs.length; bomb++) {\n        const [bombX, bombY, bombRadius] = bombs[bomb];\n\n        for (let otherBomb = 0; otherBomb < bombs.length; otherBomb++) {\n            if (otherBomb === bomb) continue;\n\n            const [otherBombX, otherBombY] = bombs[otherBomb];\n\n            const xDistance = bombX - otherBombX;\n            const yDistance = bombY - otherBombY;\n\n            // Compare squared distances so we never need a square root.\n            const squaredDistance = xDistance * xDistance + yDistance * yDistance;\n            const squaredRadius = bombRadius * bombRadius;\n\n            // This graph is DIRECTED: a bomb with a big radius can set off\n            // a bomb with a small radius without the reverse being true.\n            const canDetonateOtherBomb = squaredDistance <= squaredRadius;\n            if (!canDetonateOtherBomb) continue;\n\n            graph[bomb].push(otherBomb);\n        }\n    }\n\n    return graph;\n};\n\n// CONTRACT for markDetonatedBombs(graph, bomb, visited):\n//     when this call returns, `bomb` and every bomb reachable from\n//     `bomb` through the chain reaction is in the visited set.\nconst markDetonatedBombs = (graph, bomb, visited) => {\n    // Base case\n    if (visited.has(bomb)) return;\n\n    // Process node\n    visited.add(bomb);\n\n    // Recurse on neighbors\n    const neighbors = graph[bomb];\n\n    for (const neighbor of neighbors) {\n        // The recursive leap of faith, one level down: this call has\n        // the SAME contract — when it returns, `neighbor` and every\n        // bomb reachable from it is in visited. Trust it, do not trace\n        // it. This function already put `bomb` into visited, and each\n        // neighbor's contract covers every bomb its explosion can\n        // reach — together, that is this function's full contract,\n        // kept.\n        markDetonatedBombs(graph, neighbor, visited);\n    }\n};\n\nconst maximumDetonation = (bombs) => {\n    const graph = buildGraph(bombs);\n\n    let maxDetonatedBombs = 0;\n\n    for (let startBomb = 0; startBomb < bombs.length; startBomb++) {\n        // Each starting bomb gets a fresh visited set because we are\n        // measuring each chain reaction separately.\n        const visited = new Set();\n\n        // The recursive leap of faith: trust the contract. When this\n        // call returns, `startBomb` and every bomb its chain reaction\n        // sets off is in visited. We do not trace inside; we just read\n        // visited.size to see how many bombs exploded.\n        markDetonatedBombs(graph, startBomb, visited);\n\n        maxDetonatedBombs = Math.max(maxDetonatedBombs, visited.size);\n    }\n\n    return maxDetonatedBombs;\n};\n",
    "tests": [
      {
        "args": [
          [
            [
              2,
              1,
              3
            ],
            [
              6,
              1,
              4
            ]
          ]
        ],
        "expected": 2
      },
      {
        "args": [
          [
            [
              1,
              1,
              5
            ],
            [
              10,
              10,
              5
            ]
          ]
        ],
        "expected": 1
      },
      {
        "args": [
          [
            [
              1,
              2,
              3
            ],
            [
              2,
              3,
              1
            ],
            [
              3,
              4,
              2
            ],
            [
              4,
              5,
              3
            ],
            [
              5,
              6,
              4
            ]
          ]
        ],
        "expected": 5
      },
      {
        "args": [
          [
            [
              1,
              1,
              1
            ]
          ]
        ],
        "expected": 1
      },
      {
        "args": [
          [
            [
              0,
              0,
              1
            ],
            [
              1,
              0,
              1
            ],
            [
              2,
              0,
              1
            ]
          ]
        ],
        "expected": 3
      }
    ],
    "curriculumOrder": 4,
    "runner": {
      "kind": "function",
      "parameterNames": [
        "bombs"
      ]
    }
  },
  {
    "id": "keys-and-rooms",
    "title": "Keys and Rooms",
    "category": "original",
    "section": "Exploring a graph with DFS",
    "difficulty": "Medium",
    "sourceName": "LeetCode",
    "sourceLink": "https://leetcode.com/problems/keys-and-rooms/",
    "statement": "You are given `n` rooms labeled from `0` to `n - 1`. Every room is locked except room `0`, which is where you start.\n\nInside each room there is a set of keys lying on the floor. `rooms[i]` is the list of keys found in room `i`, and each key is just a room number: a key with the number `j` on it lets you open room `j` whenever you want.\n\nYou can walk between rooms freely — the only thing stopping you is a locked door. When you enter a room, you pick up all of its keys and can then use them to open more rooms.\n\nReturn `true` if you can eventually enter every room, and `false` otherwise.",
    "examples": [
      {
        "input": "rooms = [[1],[2],[3],[]]",
        "output": "true",
        "explanation": "Start in room 0 and grab the key to room 1. In room 1 grab the key to room 2, and in room 2 grab the key to room 3. Every room gets visited."
      },
      {
        "input": "rooms = [[1,3],[3,0,1],[2],[0]]",
        "output": "false",
        "explanation": "The only key to room 2 is sitting inside room 2 itself, so we can never get in."
      }
    ],
    "constraints": [
      "n == rooms.length",
      "2 <= n <= 1000",
      "0 <= rooms[i].length <= 1000",
      "1 <= sum(rooms[i].length) <= 3000",
      "0 <= rooms[i][j] < n",
      "All the values of rooms[i] are unique"
    ],
    "functionName": "canVisitAllRooms",
    "solution": "const START_ROOM = 0;\n\n// CONTRACT for visitRooms(rooms, curRoom, visited):\n//     when this call returns, `curRoom` and every room whose door we\n//     can eventually open starting from `curRoom` is in the visited set.\nconst visitRooms = (rooms, curRoom, visited) => {\n    // Base case\n    // Two different rooms can hold keys to the same room, so we could\n    // see a room twice. We track visited rooms to avoid infinite loops.\n    if (visited.has(curRoom)) return;\n\n    // Process node\n    visited.add(curRoom);\n\n    // Recurse on neighbors\n    const keysInRoom = rooms[curRoom];\n\n    for (const key of keysInRoom) {\n        // The recursive leap of faith, one level down: this call has\n        // the SAME contract — when it returns, the room this key opens\n        // and every room reachable from it is in visited. Trust it, do\n        // not trace it. This function already put `curRoom` into\n        // visited, and each key's contract covers all the rooms behind\n        // it — together, that is this function's full contract, kept.\n        visitRooms(rooms, key, visited);\n    }\n};\n\nconst canVisitAllRooms = (rooms) => {\n    const visited = new Set();\n\n    // The recursive leap of faith: trust the contract. When this\n    // call returns, room 0 and every room we can possibly enter is\n    // in visited. We do not trace inside; we just compare\n    // visited.size to the total number of rooms.\n    visitRooms(rooms, START_ROOM, visited);\n\n    // We succeed only if every single room was reachable from room 0.\n    return visited.size === rooms.length;\n};\n",
    "tests": [
      {
        "args": [
          [
            [
              1
            ],
            [
              2
            ],
            [
              3
            ],
            []
          ]
        ],
        "expected": true
      },
      {
        "args": [
          [
            [
              1,
              3
            ],
            [
              3,
              0,
              1
            ],
            [
              2
            ],
            [
              0
            ]
          ]
        ],
        "expected": false
      },
      {
        "args": [
          [
            [
              2
            ],
            [],
            [
              1
            ]
          ]
        ],
        "expected": true
      },
      {
        "args": [
          [
            [
              1,
              2
            ],
            [
              0
            ],
            [
              0
            ],
            []
          ]
        ],
        "expected": false
      },
      {
        "args": [
          [
            [],
            [
              0
            ]
          ]
        ],
        "expected": false
      }
    ],
    "curriculumOrder": 5,
    "runner": {
      "kind": "function",
      "parameterNames": [
        "rooms"
      ]
    }
  },
  {
    "id": "time-needed-to-inform-all-employees",
    "title": "Time Needed to Inform All Employees",
    "category": "original",
    "section": "Exploring a graph with DFS",
    "difficulty": "Medium",
    "sourceName": "LeetCode",
    "sourceLink": "https://leetcode.com/problems/time-needed-to-inform-all-employees/",
    "statement": "A company has `n` employees, labeled from `0` to `n - 1`. The head of the company is employee `headID`.\n\nYou are given an array `manager` where `manager[i]` is the direct manager of employee `i`. The head has no manager, so `manager[headID] == -1`. These manager relationships form a tree with the head at the root.\n\nThe head wants to share an urgent piece of news with everyone. Spreading works like this: when employee `i` learns the news, it takes them `informTime[i]` minutes to tell **all** of their direct reports, and all of those reports hear it **at the same moment**. Employees with no reports have `informTime[i] == 0`.\n\nReturn the total number of minutes until every employee in the company has heard the news.",
    "examples": [
      {
        "input": "n = 1, headID = 0, manager = [-1], informTime = [0]",
        "output": "0",
        "explanation": "The head is the only employee, so everyone already knows the news."
      },
      {
        "input": "n = 6, headID = 2, manager = [2,2,-1,2,2,2], informTime = [0,0,1,0,0,0]",
        "output": "1",
        "explanation": "Employee 2 manages everyone else and needs 1 minute to inform them all at once."
      },
      {
        "input": "n = 7, headID = 6, manager = [1,2,3,4,5,6,-1], informTime = [0,6,5,4,3,2,1]",
        "output": "21",
        "explanation": "The employees form a single chain, so the news travels one link at a time: 1 + 2 + 3 + 4 + 5 + 6 = 21 minutes."
      }
    ],
    "constraints": [
      "1 <= n <= 10^5",
      "0 <= headID < n",
      "manager.length == n",
      "0 <= manager[i] < n",
      "manager[headID] == -1",
      "informTime.length == n",
      "0 <= informTime[i] <= 1000",
      "informTime[i] == 0 if employee i has no subordinates",
      "It is guaranteed that all the employees can be informed"
    ],
    "functionName": "numOfMinutes",
    "solution": "const NO_MANAGER = -1;\n\nconst buildGraph = (manager) => {\n    const graph = {};\n\n    for (let employee = 0; employee < manager.length; employee++) {\n        const employeeManager = manager[employee];\n\n        // The head of the company has no manager.\n        if (employeeManager === NO_MANAGER) continue;\n\n        const managerInGraph = graph.hasOwnProperty(employeeManager);\n        if (!managerInGraph) graph[employeeManager] = [];\n\n        graph[employeeManager].push(employee);\n    }\n\n    return graph;\n};\n\n// CONTRACT for getTimeToInformSubtree(graph, employee, informTime):\n//     returns the number of minutes between the moment `employee`\n//     hears the news and the moment every person below `employee`\n//     in the tree has heard it.\nconst getTimeToInformSubtree = (graph, employee, informTime) => {\n    // The hierarchy is a tree, so there are no cycles and we do not\n    // need a visited set.\n\n    // Base case\n    const employeeHasSubordinates = graph.hasOwnProperty(employee);\n    if (!employeeHasSubordinates) return 0;\n\n    // Process node\n    let maxTimeToInformSubordinateSubtree = 0;\n\n    // Recurse on neighbors\n    const subordinates = graph[employee];\n\n    for (const subordinate of subordinates) {\n        // The recursive leap of faith, one level down: this call has\n        // the SAME contract — it returns how long the news takes to\n        // reach everyone below `subordinate`. Trust it, do not trace\n        // it. Our own inform time plus the slowest subordinate's\n        // guaranteed time is exactly this function's contract, kept.\n        const timeToInformSubordinateSubtree = getTimeToInformSubtree(\n            graph,\n            subordinate,\n            informTime,\n        );\n\n        // All subordinates hear the news at the same time (in parallel),\n        // so we only wait for the SLOWEST branch to finish.\n        maxTimeToInformSubordinateSubtree = Math.max(\n            maxTimeToInformSubordinateSubtree,\n            timeToInformSubordinateSubtree,\n        );\n    }\n\n    return informTime[employee] + maxTimeToInformSubordinateSubtree;\n};\n\nconst numOfMinutes = (n, headID, manager, informTime) => {\n    const graph = buildGraph(manager);\n\n    // The recursive leap of faith: trust the contract. This call\n    // returns the minutes needed for the news to travel from the\n    // head to every employee in the company. We do not trace\n    // inside; we just return that number.\n    return getTimeToInformSubtree(graph, headID, informTime);\n};\n",
    "tests": [
      {
        "args": [
          1,
          0,
          [
            -1
          ],
          [
            0
          ]
        ],
        "expected": 0
      },
      {
        "args": [
          6,
          2,
          [
            2,
            2,
            -1,
            2,
            2,
            2
          ],
          [
            0,
            0,
            1,
            0,
            0,
            0
          ]
        ],
        "expected": 1
      },
      {
        "args": [
          7,
          6,
          [
            1,
            2,
            3,
            4,
            5,
            6,
            -1
          ],
          [
            0,
            6,
            5,
            4,
            3,
            2,
            1
          ]
        ],
        "expected": 21
      },
      {
        "args": [
          4,
          0,
          [
            -1,
            0,
            0,
            1
          ],
          [
            1,
            2,
            0,
            0
          ]
        ],
        "expected": 3
      },
      {
        "args": [
          8,
          0,
          [
            -1,
            0,
            0,
            1,
            1,
            2,
            2,
            2
          ],
          [
            4,
            3,
            2,
            0,
            0,
            0,
            0,
            0
          ]
        ],
        "expected": 7
      }
    ],
    "curriculumOrder": 6,
    "runner": {
      "kind": "function",
      "parameterNames": [
        "n",
        "headID",
        "manager",
        "informTime"
      ]
    }
  },
  {
    "id": "kill-process",
    "title": "Kill Process",
    "category": "original",
    "section": "Exploring a graph with DFS",
    "difficulty": "Medium",
    "sourceName": "LeetCode",
    "sourceLink": "https://leetcode.com/problems/kill-process/",
    "statement": "Your computer is running `n` processes that form a tree. You are given two equal-length arrays: `pid[i]` is the ID of the `i`-th process, and `ppid[i]` is the ID of its **parent** process. Exactly one process is the root of the tree, and its parent ID is `0` (meaning it has no parent).\n\nWhen you kill a process, every one of its child processes gets killed too — and their children, and so on, all the way down the tree.\n\nGiven an integer `kill` (guaranteed to be one of the IDs in `pid`), return a list of the IDs of **all** processes that end up killed when you kill process `kill`. The IDs may be returned in any order.",
    "examples": [
      {
        "input": "pid = [1,3,10,5], ppid = [3,0,5,3], kill = 5",
        "output": "[5,10]",
        "explanation": "Process 3 is the root with children 1 and 5, and process 5 has child 10. Killing 5 also kills 10."
      },
      {
        "input": "pid = [1], ppid = [0], kill = 1",
        "output": "[1]",
        "explanation": "There is only one process, so killing it kills just itself."
      }
    ],
    "constraints": [
      "n == pid.length == ppid.length",
      "1 <= n <= 5 * 10^4",
      "1 <= pid[i] <= 5 * 10^4",
      "0 <= ppid[i] <= 5 * 10^4",
      "Only one process has ppid[i] == 0 (the root)",
      "All the values of pid are unique",
      "kill is guaranteed to be in pid"
    ],
    "functionName": "killProcess",
    "solution": "const ROOT_PARENT_ID = 0;\n\nconst buildGraph = (pid, ppid) => {\n    const graph = {};\n\n    for (let index = 0; index < pid.length; index++) {\n        const curProcess = pid[index];\n        const parentProcess = ppid[index];\n\n        // The root process has no parent, so it is nobody's child.\n        if (parentProcess === ROOT_PARENT_ID) continue;\n\n        const parentInGraph = graph.hasOwnProperty(parentProcess);\n        if (!parentInGraph) graph[parentProcess] = [];\n\n        graph[parentProcess].push(curProcess);\n    }\n\n    return graph;\n};\n\n// CONTRACT for collectKilledProcesses(graph, curProcess, killedProcesses):\n//     when this call returns, `curProcess` and every process below it\n//     in the tree has been added to the `killedProcesses` list.\nconst collectKilledProcesses = (graph, curProcess, killedProcesses) => {\n    // The processes form a tree, so there are no cycles and we do not\n    // need a visited set.\n\n    // Process node\n    killedProcesses.push(curProcess);\n\n    // Recurse on neighbors\n    // Base case: a process with no children has nothing to recurse on.\n    const processHasChildren = graph.hasOwnProperty(curProcess);\n    if (!processHasChildren) return;\n\n    const childProcesses = graph[curProcess];\n\n    for (const childProcess of childProcesses) {\n        // The recursive leap of faith, one level down: this call has\n        // the SAME contract — when it returns, `childProcess` and\n        // every process below it has been added to the list. Trust it,\n        // do not trace it. This function already added `curProcess`,\n        // and each child's contract covers its whole subtree —\n        // together, that is this function's full contract, kept.\n        collectKilledProcesses(graph, childProcess, killedProcesses);\n    }\n};\n\nconst killProcess = (pid, ppid, kill) => {\n    const graph = buildGraph(pid, ppid);\n\n    const killedProcesses = [];\n\n    // The recursive leap of faith: trust the contract. When this\n    // call returns, `kill` and every process underneath it is in\n    // the killedProcesses list. We do not trace inside; we just\n    // return the list.\n    collectKilledProcesses(graph, kill, killedProcesses);\n\n    return killedProcesses;\n};\n",
    "tests": [
      {
        "args": [
          [
            1,
            3,
            10,
            5
          ],
          [
            3,
            0,
            5,
            3
          ],
          5
        ],
        "expected": [
          5,
          10
        ],
        "unordered": true
      },
      {
        "args": [
          [
            1
          ],
          [
            0
          ],
          1
        ],
        "expected": [
          1
        ],
        "unordered": true
      },
      {
        "args": [
          [
            1,
            3,
            10,
            5
          ],
          [
            3,
            0,
            5,
            3
          ],
          3
        ],
        "expected": [
          3,
          1,
          5,
          10
        ],
        "unordered": true
      },
      {
        "args": [
          [
            2,
            4,
            6,
            8,
            10
          ],
          [
            0,
            2,
            2,
            4,
            4
          ],
          4
        ],
        "expected": [
          4,
          8,
          10
        ],
        "unordered": true
      },
      {
        "args": [
          [
            2,
            4,
            6,
            8,
            10
          ],
          [
            0,
            2,
            2,
            4,
            4
          ],
          6
        ],
        "expected": [
          6
        ],
        "unordered": true
      }
    ],
    "curriculumOrder": 7,
    "runner": {
      "kind": "function",
      "parameterNames": [
        "pid",
        "ppid",
        "kill"
      ]
    }
  },
  {
    "id": "network-delay-time",
    "title": "Network Delay Time",
    "category": "original",
    "section": "Exploring a graph with DFS",
    "difficulty": "Medium",
    "sourceName": "LeetCode",
    "sourceLink": "https://leetcode.com/problems/network-delay-time/",
    "statement": "You have a network of `n` nodes, labeled from `1` to `n`. You are given a list `times`, where each entry `times[i] = [ui, vi, wi]` describes a **one-way** wire: a signal sent from node `ui` reaches node `vi` after `wi` units of time.\n\nAt time `0`, a signal is sent out from node `k`. The signal travels along every outgoing wire at once, and a node passes the signal along the moment it receives it.\n\nReturn the time at which **all** `n` nodes have received the signal. If some node can never receive it, return `-1`.",
    "examples": [
      {
        "input": "times = [[2,1,1],[2,3,1],[3,4,1]], n = 4, k = 2",
        "output": "2",
        "explanation": "Nodes 1 and 3 hear the signal at time 1, and node 4 hears it at time 2 (through node 3). Everyone has it by time 2."
      },
      {
        "input": "times = [[1,2,1]], n = 2, k = 1",
        "output": "1",
        "explanation": "The signal travels from node 1 to node 2 in 1 unit of time."
      },
      {
        "input": "times = [[1,2,1]], n = 2, k = 2",
        "output": "-1",
        "explanation": "The only wire points INTO node 2, so a signal starting at node 2 can never reach node 1."
      }
    ],
    "constraints": [
      "1 <= k <= n <= 100",
      "1 <= times.length <= 6000",
      "times[i].length == 3",
      "1 <= ui, vi <= n",
      "ui != vi",
      "0 <= wi <= 100",
      "All the pairs (ui, vi) are unique (no duplicate wires)"
    ],
    "functionName": "networkDelayTime",
    "solution": "const START_TIME = 0;\n\nconst buildGraph = (times) => {\n    const graph = {};\n\n    for (const time of times) {\n        const [sourceNode, targetNode, travelTime] = time;\n\n        const sourceInGraph = graph.hasOwnProperty(sourceNode);\n        if (!sourceInGraph) graph[sourceNode] = [];\n\n        graph[sourceNode].push([targetNode, travelTime]);\n    }\n\n    return graph;\n};\n\n// CONTRACT for recordArrivalTimes(graph, curNode, curArrivalTime, arrivalTimes):\n//     when this call returns, `curNode` and every node reachable from\n//     it has an entry in `arrivalTimes` at least as fast as any route\n//     that starts by reaching `curNode` at time `curArrivalTime`.\nconst recordArrivalTimes = (graph, curNode, curArrivalTime, arrivalTimes) => {\n    // Base case\n    // Instead of a plain visited set, we remember the best-known arrival\n    // time for each node. We only continue when we just arrived FASTER\n    // than every previous visit, so slower paths get pruned away.\n    const nodeHasArrivalTime = arrivalTimes.hasOwnProperty(curNode);\n    const bestKnownArrivalTime = nodeHasArrivalTime\n        ? arrivalTimes[curNode]\n        : Infinity;\n\n    if (curArrivalTime >= bestKnownArrivalTime) return;\n\n    // Process node\n    arrivalTimes[curNode] = curArrivalTime;\n\n    // Recurse on neighbors\n    const nodeInGraph = graph.hasOwnProperty(curNode);\n    if (!nodeInGraph) return;\n\n    const neighbors = graph[curNode];\n\n    for (const neighbor of neighbors) {\n        const [neighborNode, travelTime] = neighbor;\n\n        // The recursive leap of faith, one level down: this call has\n        // the SAME contract — when it returns, the neighbor and every\n        // node past it have arrival times at least as fast as this\n        // route offers. Trust it, do not trace it. This function\n        // already recorded `curNode`'s time, and each neighbor's\n        // contract covers the rest — together, that is this function's\n        // full contract, kept.\n        recordArrivalTimes(\n            graph,\n            neighborNode,\n            curArrivalTime + travelTime,\n            arrivalTimes,\n        );\n    }\n};\n\nconst networkDelayTime = (times, n, k) => {\n    const graph = buildGraph(times);\n\n    const arrivalTimes = {};\n\n    // The recursive leap of faith: trust the contract. When this\n    // call returns, every node the signal can reach from node `k`\n    // has its fastest arrival time recorded in arrivalTimes. We do\n    // not trace inside; we just scan those times for the largest\n    // one.\n    recordArrivalTimes(graph, k, START_TIME, arrivalTimes);\n\n    // The whole network is covered once the LAST node hears the signal,\n    // so the answer is the largest arrival time.\n    let maxArrivalTime = 0;\n\n    for (let node = 1; node <= n; node++) {\n        const nodeWasReached = arrivalTimes.hasOwnProperty(node);\n        if (!nodeWasReached) return -1;\n\n        maxArrivalTime = Math.max(maxArrivalTime, arrivalTimes[node]);\n    }\n\n    return maxArrivalTime;\n};\n",
    "tests": [
      {
        "args": [
          [
            [
              2,
              1,
              1
            ],
            [
              2,
              3,
              1
            ],
            [
              3,
              4,
              1
            ]
          ],
          4,
          2
        ],
        "expected": 2
      },
      {
        "args": [
          [
            [
              1,
              2,
              1
            ]
          ],
          2,
          1
        ],
        "expected": 1
      },
      {
        "args": [
          [
            [
              1,
              2,
              1
            ]
          ],
          2,
          2
        ],
        "expected": -1
      },
      {
        "args": [
          [
            [
              1,
              2,
              10
            ],
            [
              1,
              3,
              1
            ],
            [
              3,
              2,
              1
            ]
          ],
          3,
          1
        ],
        "expected": 2
      },
      {
        "args": [
          [
            [
              1,
              2,
              1
            ],
            [
              2,
              3,
              2
            ],
            [
              3,
              1,
              4
            ],
            [
              3,
              4,
              1
            ]
          ],
          4,
          1
        ],
        "expected": 4
      }
    ],
    "curriculumOrder": 9,
    "runner": {
      "kind": "function",
      "parameterNames": [
        "times",
        "n",
        "k"
      ]
    }
  },
  {
    "id": "find-if-path-exists-in-graph",
    "title": "Find if Path Exists in Graph",
    "category": "original",
    "section": "Working with paths",
    "difficulty": "Easy",
    "sourceName": "LeetCode",
    "sourceLink": "https://leetcode.com/problems/find-if-path-exists-in-graph/",
    "statement": "You are given a graph with `n` vertices labeled from `0` to `n - 1`. The graph is **undirected**: each entry `edges[i] = [ui, vi]` is a two-way connection between vertex `ui` and vertex `vi`. Every pair of vertices is connected by at most one edge, and no vertex has an edge to itself.\n\nYou are also given two vertices, `source` and `destination`.\n\nReturn `true` if there is any path from `source` to `destination` (a walk along edges that starts at `source` and ends at `destination`), and `false` otherwise. Note that a path of length zero counts: if `source` and `destination` are the same vertex, the answer is `true`.",
    "examples": [
      {
        "input": "n = 3, edges = [[0,1],[1,2],[2,0]], source = 0, destination = 2",
        "output": "true",
        "explanation": "There are two ways to get from 0 to 2: go 0 -> 1 -> 2, or go 0 -> 2 directly."
      },
      {
        "input": "n = 6, edges = [[0,1],[0,2],[3,5],[5,4],[4,3]], source = 0, destination = 5",
        "output": "false",
        "explanation": "The graph splits into two separate pieces: {0, 1, 2} and {3, 4, 5}. There is no way to cross between them."
      }
    ],
    "constraints": [
      "1 <= n <= 2 * 10^5",
      "0 <= edges.length <= 2 * 10^5",
      "edges[i].length == 2",
      "0 <= ui, vi <= n - 1",
      "ui != vi",
      "0 <= source, destination <= n - 1",
      "There are no duplicate edges and no self edges"
    ],
    "functionName": "validPath",
    "solution": "const buildGraph = (edges) => {\n    const graph = {};\n\n    for (const edge of edges) {\n        const [nodeOne, nodeTwo] = edge;\n\n        const nodeOneInGraph = graph.hasOwnProperty(nodeOne);\n        const nodeTwoInGraph = graph.hasOwnProperty(nodeTwo);\n\n        if (!nodeOneInGraph) graph[nodeOne] = [];\n        if (!nodeTwoInGraph) graph[nodeTwo] = [];\n\n        graph[nodeOne].push(nodeTwo);\n        graph[nodeTwo].push(nodeOne);\n    }\n\n    return graph;\n};\n\n// CONTRACT for canReachDestination(graph, curNode, destination, visited):\n//     returns true if there is a path from `curNode` to `destination`\n//     that avoids the nodes already in the visited set, and false\n//     otherwise.\nconst canReachDestination = (graph, curNode, destination, visited) => {\n    // Base cases\n    if (curNode === destination) return true;\n\n    // This is an undirected graph, so it can have cycles. We track\n    // visited nodes so we never walk in circles forever.\n    if (visited.has(curNode)) return false;\n\n    // Process node\n    visited.add(curNode);\n\n    // Recurse on neighbors\n    const nodeInGraph = graph.hasOwnProperty(curNode);\n    if (!nodeInGraph) return false;\n\n    const neighbors = graph[curNode];\n\n    for (const neighbor of neighbors) {\n        // The recursive leap of faith, one level down: this call has\n        // the SAME contract — it returns true exactly when\n        // `destination` can be reached from this neighbor. Trust it,\n        // do not trace it. If any neighbor can reach the destination,\n        // then so can `curNode` — which is exactly this function's\n        // contract, kept.\n        const pathExistsThroughNeighbor = canReachDestination(\n            graph,\n            neighbor,\n            destination,\n            visited,\n        );\n\n        if (pathExistsThroughNeighbor) return true;\n    }\n\n    return false;\n};\n\nconst validPath = (n, edges, source, destination) => {\n    const graph = buildGraph(edges);\n\n    const visited = new Set();\n\n    // The recursive leap of faith: trust the contract. This call\n    // returns true exactly when some path leads from `source` to\n    // `destination`. We do not trace inside; we just return its\n    // answer.\n    return canReachDestination(graph, source, destination, visited);\n};\n",
    "tests": [
      {
        "args": [
          3,
          [
            [
              0,
              1
            ],
            [
              1,
              2
            ],
            [
              2,
              0
            ]
          ],
          0,
          2
        ],
        "expected": true
      },
      {
        "args": [
          6,
          [
            [
              0,
              1
            ],
            [
              0,
              2
            ],
            [
              3,
              5
            ],
            [
              5,
              4
            ],
            [
              4,
              3
            ]
          ],
          0,
          5
        ],
        "expected": false
      },
      {
        "args": [
          1,
          [],
          0,
          0
        ],
        "expected": true
      },
      {
        "args": [
          10,
          [
            [
              0,
              7
            ],
            [
              0,
              8
            ],
            [
              6,
              1
            ],
            [
              2,
              0
            ],
            [
              0,
              4
            ],
            [
              5,
              8
            ],
            [
              4,
              7
            ],
            [
              1,
              3
            ],
            [
              3,
              5
            ],
            [
              6,
              5
            ]
          ],
          7,
          5
        ],
        "expected": true
      },
      {
        "args": [
          4,
          [
            [
              0,
              1
            ],
            [
              2,
              3
            ]
          ],
          0,
          3
        ],
        "expected": false
      }
    ],
    "curriculumOrder": 10,
    "runner": {
      "kind": "function",
      "parameterNames": [
        "n",
        "edges",
        "source",
        "destination"
      ]
    }
  },
  {
    "id": "evaluate-division",
    "title": "Evaluate Division",
    "category": "original",
    "section": "Working with paths",
    "difficulty": "Medium",
    "sourceName": "LeetCode",
    "sourceLink": "https://leetcode.com/problems/evaluate-division/",
    "statement": "You are given a list of known division facts. Each fact is a pair of variable names `equations[i] = [A, B]` together with a number `values[i]`, which tells you that `A / B = values[i]`. For example, `[\"a\", \"b\"]` with the value `2.0` means `a / b = 2.0`.\n\nYou are also given a list of `queries`, where each query `[C, D]` asks: what is `C / D`?\n\nReturn an array with the answer to every query. If an answer cannot be figured out from the known facts (for example, one of the variables was never mentioned), answer `-1.0` for that query.\n\n**Note:** the input is always valid. You will never divide by zero, and the given facts never contradict each other.",
    "examples": [
      {
        "input": "equations = [[\"a\",\"b\"],[\"b\",\"c\"]], values = [2.0,3.0], queries = [[\"a\",\"c\"],[\"b\",\"a\"],[\"a\",\"e\"],[\"a\",\"a\"],[\"x\",\"x\"]]",
        "output": "[6.00000,0.50000,-1.00000,1.00000,-1.00000]",
        "explanation": "We know a / b = 2.0 and b / c = 3.0. So a / c = (a / b) * (b / c) = 6.0, and b / a = 1 / 2.0 = 0.5. The variables e and x were never mentioned, so those queries (and any query involving them) answer -1.0. a / a = 1.0 because a is a known variable."
      },
      {
        "input": "equations = [[\"a\",\"b\"],[\"b\",\"c\"],[\"bc\",\"cd\"]], values = [1.5,2.5,5.0], queries = [[\"a\",\"c\"],[\"c\",\"b\"],[\"bc\",\"cd\"],[\"cd\",\"bc\"]]",
        "output": "[3.75000,0.40000,5.00000,0.20000]",
        "explanation": "a / c = 1.5 * 2.5 = 3.75, c / b = 1 / 2.5 = 0.4, and cd / bc is the reciprocal of bc / cd."
      },
      {
        "input": "equations = [[\"a\",\"b\"]], values = [0.5], queries = [[\"a\",\"b\"],[\"b\",\"a\"],[\"a\",\"c\"],[\"x\",\"y\"]]",
        "output": "[0.50000,2.00000,-1.00000,-1.00000]",
        "explanation": "There is no path from a to c, and neither x nor y is a known variable."
      }
    ],
    "constraints": [
      "1 <= equations.length <= 20",
      "equations[i].length == 2",
      "1 <= equations[i][0].length, equations[i][1].length <= 5",
      "values.length == equations.length",
      "0.0 < values[i] <= 20.0",
      "1 <= queries.length <= 20",
      "Variable names are strings of lowercase English letters and digits."
    ],
    "functionName": "calcEquation",
    "solution": "const NO_ANSWER = -1;\n\nconst buildGraph = (equations, values) => {\n    const graph = {};\n\n    for (let i = 0; i < equations.length; i++) {\n        const [numeratorVariable, denominatorVariable] = equations[i];\n        const ratio = values[i];\n\n        const numeratorInGraph = graph.hasOwnProperty(numeratorVariable);\n        const denominatorInGraph = graph.hasOwnProperty(denominatorVariable);\n\n        if (!numeratorInGraph) graph[numeratorVariable] = [];\n        if (!denominatorInGraph) graph[denominatorVariable] = [];\n\n        // If a / b = 2, then walking the edge from a to b multiplies our\n        // running product by 2, and walking from b to a multiplies it by 1 / 2.\n        graph[numeratorVariable].push([denominatorVariable, ratio]);\n        graph[denominatorVariable].push([numeratorVariable, 1 / ratio]);\n    }\n\n    return graph;\n};\n\n// CONTRACT for getRatioToTarget(graph, curVariable, targetVariable, visited):\n//     returns the value of `curVariable` divided by `targetVariable`\n//     if a chain of known facts connects them (avoiding variables\n//     already in the visited set), and NO_ANSWER (-1) otherwise.\nconst getRatioToTarget = (graph, curVariable, targetVariable, visited) => {\n    // Base case\n    if (curVariable === targetVariable) return 1;\n\n    // Process node\n    visited.add(curVariable);\n\n    // Recurse on neighbors\n    const neighbors = graph[curVariable];\n\n    for (const neighbor of neighbors) {\n        const [neighborVariable, ratioToNeighbor] = neighbor;\n\n        if (visited.has(neighborVariable)) continue;\n\n        // The recursive leap of faith, one level down: this call has\n        // the SAME contract — it returns the neighbor divided by the\n        // target, or NO_ANSWER if no chain connects them. Trust it, do\n        // not trace it. Our known ratio to the neighbor times the\n        // neighbor's guaranteed ratio to the target is exactly this\n        // function's contract, kept.\n        const ratioFromNeighborToTarget = getRatioToTarget(\n            graph,\n            neighborVariable,\n            targetVariable,\n            visited,\n        );\n\n        if (ratioFromNeighborToTarget === NO_ANSWER) continue;\n\n        // Multiplying the ratios along the path gives the overall ratio:\n        // (a / b) * (b / c) = a / c.\n        return ratioToNeighbor * ratioFromNeighborToTarget;\n    }\n\n    return NO_ANSWER;\n};\n\nconst calcEquation = (equations, values, queries) => {\n    const graph = buildGraph(equations, values);\n\n    const answers = [];\n\n    for (const query of queries) {\n        const [startVariable, targetVariable] = query;\n\n        const startInGraph = graph.hasOwnProperty(startVariable);\n        const targetInGraph = graph.hasOwnProperty(targetVariable);\n\n        // A variable we have never seen has no known relationships.\n        if (!startInGraph || !targetInGraph) {\n            answers.push(NO_ANSWER);\n            continue;\n        }\n\n        const visited = new Set();\n\n        // The recursive leap of faith: trust the contract. This call\n        // returns the value of startVariable divided by\n        // targetVariable, or NO_ANSWER if the facts cannot connect\n        // them. We do not trace inside; we just push the answer.\n        answers.push(getRatioToTarget(graph, startVariable, targetVariable, visited));\n    }\n\n    return answers;\n};",
    "tests": [
      {
        "args": [
          [
            [
              "a",
              "b"
            ],
            [
              "b",
              "c"
            ]
          ],
          [
            2,
            3
          ],
          [
            [
              "a",
              "c"
            ],
            [
              "b",
              "a"
            ],
            [
              "a",
              "e"
            ],
            [
              "a",
              "a"
            ],
            [
              "x",
              "x"
            ]
          ]
        ],
        "expected": [
          6,
          0.5,
          -1,
          1,
          -1
        ],
        "float": true
      },
      {
        "args": [
          [
            [
              "a",
              "b"
            ],
            [
              "b",
              "c"
            ],
            [
              "bc",
              "cd"
            ]
          ],
          [
            1.5,
            2.5,
            5
          ],
          [
            [
              "a",
              "c"
            ],
            [
              "c",
              "b"
            ],
            [
              "bc",
              "cd"
            ],
            [
              "cd",
              "bc"
            ]
          ]
        ],
        "expected": [
          3.75,
          0.4,
          5,
          0.2
        ],
        "float": true
      },
      {
        "args": [
          [
            [
              "a",
              "b"
            ]
          ],
          [
            0.5
          ],
          [
            [
              "a",
              "b"
            ],
            [
              "b",
              "a"
            ],
            [
              "a",
              "c"
            ],
            [
              "x",
              "y"
            ]
          ]
        ],
        "expected": [
          0.5,
          2,
          -1,
          -1
        ],
        "float": true
      },
      {
        "args": [
          [
            [
              "x1",
              "x2"
            ],
            [
              "x2",
              "x3"
            ],
            [
              "x3",
              "x4"
            ],
            [
              "x4",
              "x5"
            ]
          ],
          [
            3,
            4,
            5,
            6
          ],
          [
            [
              "x1",
              "x5"
            ],
            [
              "x5",
              "x2"
            ],
            [
              "x2",
              "x4"
            ],
            [
              "x2",
              "x2"
            ],
            [
              "x2",
              "x9"
            ],
            [
              "x9",
              "x9"
            ]
          ]
        ],
        "expected": [
          360,
          0.008333333333333333,
          20,
          1,
          -1,
          -1
        ],
        "float": true
      },
      {
        "args": [
          [
            [
              "m",
              "n"
            ],
            [
              "m",
              "p"
            ],
            [
              "p",
              "q"
            ]
          ],
          [
            2,
            4,
            5
          ],
          [
            [
              "n",
              "q"
            ],
            [
              "q",
              "n"
            ],
            [
              "p",
              "n"
            ],
            [
              "n",
              "n"
            ],
            [
              "z",
              "m"
            ]
          ]
        ],
        "expected": [
          10,
          0.1,
          0.5,
          1,
          -1
        ],
        "float": true
      }
    ],
    "hint": "If you know `a / b` and `b / c`, how could you work out `a / c`?",
    "curriculumOrder": 12,
    "runner": {
      "kind": "function",
      "parameterNames": [
        "equations",
        "values",
        "queries"
      ]
    }
  },
  {
    "id": "flatten-nested-list-iterator",
    "title": "Flatten Nested List Iterator",
    "category": "original",
    "section": "DFS on arrays",
    "difficulty": "Medium",
    "sourceName": "LeetCode",
    "sourceLink": "https://leetcode.com/problems/flatten-nested-list-iterator/",
    "statement": "You are given a nested list of integers called `nestedList`. Each element is either a plain integer or another list, whose elements can also be integers or even more lists. For example, `[[1, 1], 2, [1, 1]]` has two inner lists and one plain integer at the top level.\n\nYour job is to build an iterator class that hands the integers back one at a time, in left-to-right order, as if the whole structure were flattened into a single flat list.\n\nImplement the `NestedIterator` class:\n\n- `constructor(nestedList)` — sets up the iterator with the nested list.\n- `next()` — returns the next integer in the flattened order.\n- `hasNext()` — returns `true` if there are still integers left to return, and `false` otherwise.\n\nCode that uses your class will repeatedly call `hasNext()` and `next()` until every integer has been returned. For `[[1, 1], 2, [1, 1]]`, the integers should come back in the order `1, 1, 2, 1, 1`.\n\n**Note:** on LeetCode this problem uses a NestedInteger interface; here we use plain nested arrays to keep things simple. You can check whether an element is a list with `Array.isArray(element)`.",
    "examples": [
      {
        "input": "nestedList = [[1,1],2,[1,1]]",
        "output": "[1,1,2,1,1]",
        "explanation": "Repeatedly calling hasNext and next returns the integers in flattened left-to-right order."
      },
      {
        "input": "nestedList = [1,[4,[6]]]",
        "output": "[1,4,6]",
        "explanation": "The 1 sits at the top level, the 4 is one level down, and the 6 is two levels down, but flattening ignores depth and keeps left-to-right order."
      }
    ],
    "constraints": [
      "1 <= nestedList.length <= 500",
      "Each integer value is between -10^6 and 10^6.",
      "Elements can be nested arbitrarily deep."
    ],
    "functionName": "NestedIterator",
    "solution": "// CONTRACT for flattenNestedList(nestedList, flattenedIntegers):\n//     when this call returns, every integer anywhere inside\n//     `nestedList` — no matter how deeply nested — has been pushed\n//     onto `flattenedIntegers` in left-to-right order.\nconst flattenNestedList = (nestedList, flattenedIntegers) => {\n    for (const element of nestedList) {\n        // Base case: a plain integer goes straight into the flattened list.\n        if (!Array.isArray(element)) {\n            flattenedIntegers.push(element);\n            continue;\n        }\n\n        // Recurse on the inner list\n        // The recursive leap of faith, one level down: this call has\n        // the SAME contract — when it returns, every integer inside\n        // `element` has been pushed in left-to-right order. Trust it,\n        // do not trace it. The loop pushes plain integers itself, and\n        // each inner list's contract covers everything inside it —\n        // together, that is this function's full contract, kept.\n        flattenNestedList(element, flattenedIntegers);\n    }\n};\n\nclass NestedIterator {\n    constructor(nestedList) {\n        // Flattening everything up front keeps next and hasNext simple:\n        // they just walk an ordinary array with an index.\n        this.flattenedIntegers = [];\n        this.curIndex = 0;\n\n        // The recursive leap of faith: trust the contract. When this\n        // call returns, this.flattenedIntegers holds every integer in\n        // the whole structure, flattened left to right. We do not\n        // trace inside; next and hasNext just walk this flat array.\n        flattenNestedList(nestedList, this.flattenedIntegers);\n    }\n\n    next() {\n        const nextInteger = this.flattenedIntegers[this.curIndex];\n\n        this.curIndex++;\n\n        return nextInteger;\n    }\n\n    hasNext() {\n        return this.curIndex < this.flattenedIntegers.length;\n    }\n}",
    "tests": [
      {
        "args": [
          [
            [
              1,
              1
            ],
            2,
            [
              1,
              1
            ]
          ]
        ],
        "expected": [
          1,
          1,
          2,
          1,
          1
        ],
        "harness": "iterator"
      },
      {
        "args": [
          [
            1,
            [
              4,
              [
                6
              ]
            ]
          ]
        ],
        "expected": [
          1,
          4,
          6
        ],
        "harness": "iterator"
      },
      {
        "args": [
          [
            [
              [],
              [
                3
              ]
            ],
            [],
            5,
            [
              [
                6,
                [
                  7
                ]
              ]
            ]
          ]
        ],
        "expected": [
          3,
          5,
          6,
          7
        ],
        "harness": "iterator"
      },
      {
        "args": [
          [
            []
          ]
        ],
        "expected": [],
        "harness": "iterator"
      },
      {
        "args": [
          [
            0,
            [
              -1,
              [
                2,
                []
              ]
            ],
            3,
            [
              [],
              4
            ]
          ]
        ],
        "expected": [
          0,
          -1,
          2,
          3,
          4
        ],
        "harness": "iterator"
      }
    ],
    "curriculumOrder": 13,
    "runner": {
      "kind": "iterator",
      "parameterNames": [
        "nestedList"
      ]
    }
  },
  {
    "id": "nested-list-weight-sum",
    "title": "Nested List Weight Sum",
    "category": "original",
    "section": "DFS on arrays",
    "difficulty": "Medium",
    "sourceName": "LeetCode",
    "sourceLink": "https://leetcode.com/problems/nested-list-weight-sum/",
    "statement": "You are given a nested list of integers called `nestedList`. Each element is either a plain integer or another list, whose elements can also be integers or more lists.\n\nEvery integer sits at some **depth**: integers in the top-level list have depth 1, integers one list deeper have depth 2, and so on. In `[[1, 1], 2, [1, 1]]`, the number `2` has depth 1 and the four `1`s have depth 2.\n\nReturn the sum of every integer multiplied by its depth.\n\n**Note:** on LeetCode this problem uses a NestedInteger interface; here we use plain nested arrays to keep things simple. You can check whether an element is a list with `Array.isArray(element)`.",
    "examples": [
      {
        "input": "nestedList = [[1,1],2,[1,1]]",
        "output": "10",
        "explanation": "Four 1s at depth 2 and one 2 at depth 1: 4 * 1 * 2 + 1 * 2 * 1 = 10."
      },
      {
        "input": "nestedList = [1,[4,[6]]]",
        "output": "27",
        "explanation": "One 1 at depth 1, one 4 at depth 2, and one 6 at depth 3: 1 * 1 + 4 * 2 + 6 * 3 = 27."
      },
      {
        "input": "nestedList = [0]",
        "output": "0"
      }
    ],
    "constraints": [
      "1 <= nestedList.length <= 50",
      "Each integer value is between -100 and 100.",
      "The maximum depth of any integer is at most 50."
    ],
    "functionName": "depthSum",
    "solution": "const TOP_LEVEL_DEPTH = 1;\n\n// CONTRACT for getSumAtDepth(nestedList, depth):\n//     returns the sum of every integer inside `nestedList` times that\n//     integer's depth, where `nestedList` itself sits at level `depth`.\nconst getSumAtDepth = (nestedList, depth) => {\n    let totalSum = 0;\n\n    for (const element of nestedList) {\n        // Base case: a plain integer contributes its value times its depth.\n        if (!Array.isArray(element)) {\n            totalSum += element * depth;\n            continue;\n        }\n\n        // Recurse on the inner list, which sits one level deeper.\n        // The recursive leap of faith, one level down: this call has\n        // the SAME contract — it returns the weighted sum of\n        // everything inside `element`, counted at depth + 1. Trust it,\n        // do not trace it. The integers this loop handles directly\n        // plus each inner list's guaranteed sum add up to exactly this\n        // function's contract, kept.\n        totalSum += getSumAtDepth(element, depth + 1);\n    }\n\n    return totalSum;\n};\n\n// The recursive leap of faith: trust the contract. This call returns\n// the depth-weighted sum of the entire structure, starting the top\n// level at depth 1. We do not trace inside; we just return its\n// answer.\nconst depthSum = (nestedList) => getSumAtDepth(nestedList, TOP_LEVEL_DEPTH);",
    "tests": [
      {
        "args": [
          [
            [
              1,
              1
            ],
            2,
            [
              1,
              1
            ]
          ]
        ],
        "expected": 10
      },
      {
        "args": [
          [
            1,
            [
              4,
              [
                6
              ]
            ]
          ]
        ],
        "expected": 27
      },
      {
        "args": [
          [
            0
          ]
        ],
        "expected": 0
      },
      {
        "args": [
          [
            [
              [
                [
                  7
                ]
              ]
            ],
            1
          ]
        ],
        "expected": 29
      },
      {
        "args": [
          [
            2,
            [
              -1,
              [
                4
              ]
            ],
            3
          ]
        ],
        "expected": 15
      }
    ],
    "curriculumOrder": 14,
    "runner": {
      "kind": "function",
      "parameterNames": [
        "nestedList"
      ]
    }
  },
  {
    "id": "nested-list-weight-sum-ii",
    "title": "Nested List Weight Sum II",
    "category": "original",
    "section": "DFS on arrays",
    "difficulty": "Medium",
    "sourceName": "LeetCode",
    "sourceLink": "https://leetcode.com/problems/nested-list-weight-sum-ii/",
    "statement": "You are given a nested list of integers called `nestedList`. Each element is either a plain integer or another list, whose elements can also be integers or more lists.\n\nEvery integer sits at some **depth**: integers in the top-level list have depth 1, integers one list deeper have depth 2, and so on. Let `maxDepth` be the depth of the deepest integer anywhere in the structure.\n\nAn integer at depth `depth` has **weight** `maxDepth - depth + 1`. So the deepest integers get weight 1, and the integers at the top level get the biggest weight, `maxDepth`.\n\nReturn the sum of every integer multiplied by its weight.\n\n**Note:** on LeetCode this problem uses a NestedInteger interface; here we use plain nested arrays to keep things simple. You can check whether an element is a list with `Array.isArray(element)`.",
    "examples": [
      {
        "input": "nestedList = [[1,1],2,[1,1]]",
        "output": "8",
        "explanation": "maxDepth is 2. The four 1s are at depth 2, so their weight is 2 - 2 + 1 = 1. The 2 is at depth 1, so its weight is 2 - 1 + 1 = 2. Total: 4 * 1 * 1 + 1 * 2 * 2 = 8."
      },
      {
        "input": "nestedList = [1,[4,[6]]]",
        "output": "17",
        "explanation": "maxDepth is 3. The 1 has weight 3, the 4 has weight 2, and the 6 has weight 1: 1 * 3 + 4 * 2 + 6 * 1 = 17."
      }
    ],
    "constraints": [
      "1 <= nestedList.length <= 50",
      "Each integer value is between -100 and 100.",
      "The maximum depth of any integer is at most 50."
    ],
    "functionName": "depthSumInverse",
    "solution": "const TOP_LEVEL_DEPTH = 1;\n\n// CONTRACT for getMaxDepth(nestedList, depth):\n//     returns the deepest LEVEL any list inside `nestedList` reaches,\n//     counting `nestedList` itself at `depth`.\nconst getMaxDepth = (nestedList, depth) => {\n    let maxDepth = depth;\n\n    for (const element of nestedList) {\n        // Only inner lists can push the nesting deeper.\n        if (!Array.isArray(element)) continue;\n\n        // The recursive leap of faith, one level down: trust it — this\n        // call returns the deepest level any list inside `element`\n        // reaches, counting `element` itself at `depth + 1`. Keeping\n        // the biggest of these keeps this function's own contract.\n        const maxDepthOfInnerList = getMaxDepth(element, depth + 1);\n\n        maxDepth = Math.max(maxDepth, maxDepthOfInnerList);\n    }\n\n    return maxDepth;\n};\n\n// CONTRACT for getWeightedSum(nestedList, depth, maxDepth):\n//     returns the sum of every integer inside `nestedList` times that\n//     integer's weight, where `nestedList` itself sits at level `depth`.\nconst getWeightedSum = (nestedList, depth, maxDepth) => {\n    let totalSum = 0;\n\n    for (const element of nestedList) {\n        // Base case: the weights are flipped, so integers at the deepest\n        // level get weight 1 and integers at the top get weight maxDepth.\n        if (!Array.isArray(element)) {\n            const weight = maxDepth - depth + 1;\n\n            totalSum += element * weight;\n            continue;\n        }\n\n        // Recurse on the inner list\n        // The recursive leap of faith, one level down: this call has\n        // the SAME contract — it returns the weighted sum of\n        // everything inside `element`, one level deeper. Trust it, do\n        // not trace it. The integers this loop weighs directly plus\n        // each inner list's guaranteed sum add up to exactly this\n        // function's contract, kept.\n        totalSum += getWeightedSum(element, depth + 1, maxDepth);\n    }\n\n    return totalSum;\n};\n\nconst depthSumInverse = (nestedList) => {\n    // First DFS finds how deep the list goes, second DFS adds everything\n    // up with the flipped weights.\n    const maxDepth = getMaxDepth(nestedList, TOP_LEVEL_DEPTH);\n\n    // The recursive leap of faith: trust both contracts.\n    // getMaxDepth handed us the deepest level, and this call\n    // returns the full weighted sum of the structure. We do not\n    // trace inside either one; we just return the answer.\n    return getWeightedSum(nestedList, TOP_LEVEL_DEPTH, maxDepth);\n};",
    "tests": [
      {
        "args": [
          [
            [
              1,
              1
            ],
            2,
            [
              1,
              1
            ]
          ]
        ],
        "expected": 8
      },
      {
        "args": [
          [
            1,
            [
              4,
              [
                6
              ]
            ]
          ]
        ],
        "expected": 17
      },
      {
        "args": [
          [
            1,
            2,
            3
          ]
        ],
        "expected": 6
      },
      {
        "args": [
          [
            [
              3
            ],
            [
              [
                8
              ]
            ]
          ]
        ],
        "expected": 14
      },
      {
        "args": [
          [
            2,
            [
              -1,
              [
                4
              ]
            ],
            3
          ]
        ],
        "expected": 17
      }
    ],
    "curriculumOrder": 15,
    "runner": {
      "kind": "function",
      "parameterNames": [
        "nestedList"
      ]
    }
  },
  {
    "id": "minesweeper",
    "title": "Minesweeper",
    "category": "original",
    "section": "Optional extra problems",
    "difficulty": "Medium",
    "sourceName": "LeetCode",
    "sourceLink": "https://leetcode.com/problems/minesweeper/",
    "statement": "You are playing Minesweeper on a grid called `board`, where each square holds one character:\n\n- `'M'` — a hidden mine.\n- `'E'` — an empty square that has not been revealed yet.\n- `'B'` — a revealed blank square with **no** mines in any of its 8 surrounding squares.\n- `'1'` to `'8'` — a revealed square showing how many of its 8 surrounding squares contain mines.\n- `'X'` — a mine that was clicked (game over).\n\nYou are given the board and a `click` position `[clickRow, clickCol]`, which is guaranteed to be either `'M'` or `'E'`. Return the board after applying the click, using these rules:\n\n1. If the click lands on a mine (`'M'`), change it to `'X'` — the game is over.\n2. If the click lands on an unrevealed empty square (`'E'`) that has at least one mine around it, change it to a digit showing the number of surrounding mines. The reveal stops there.\n3. If the click lands on an `'E'` square with **no** mines around it, change it to `'B'` and automatically reveal all 8 of its neighbors the same way, spreading outward like clicking each of them. This is why one click on an open area clears out a whole region.\n\nOnly apply one click, then return the board.",
    "examples": [
      {
        "input": "board = [[\"E\",\"E\",\"E\",\"E\",\"E\"],[\"E\",\"E\",\"M\",\"E\",\"E\"],[\"E\",\"E\",\"E\",\"E\",\"E\"],[\"E\",\"E\",\"E\",\"E\",\"E\"]], click = [3,0]",
        "output": "[[\"B\",\"1\",\"E\",\"1\",\"B\"],[\"B\",\"1\",\"M\",\"1\",\"B\"],[\"B\",\"1\",\"1\",\"1\",\"B\"],[\"B\",\"B\",\"B\",\"B\",\"B\"]]",
        "explanation": "The click lands on an empty square with no mines around it, so the reveal spreads outward. Squares touching the mine become \"1\" and stop the spread; the square directly above the mine stays \"E\" because the reveal never crosses the ring of numbered squares."
      },
      {
        "input": "board = [[\"B\",\"1\",\"E\",\"1\",\"B\"],[\"B\",\"1\",\"M\",\"1\",\"B\"],[\"B\",\"1\",\"1\",\"1\",\"B\"],[\"B\",\"B\",\"B\",\"B\",\"B\"]], click = [1,2]",
        "output": "[[\"B\",\"1\",\"E\",\"1\",\"B\"],[\"B\",\"1\",\"X\",\"1\",\"B\"],[\"B\",\"1\",\"1\",\"1\",\"B\"],[\"B\",\"B\",\"B\",\"B\",\"B\"]]",
        "explanation": "The click lands directly on a mine, so it becomes \"X\" and nothing else changes."
      },
      {
        "input": "board = [[\"E\",\"M\"]], click = [0,0]",
        "output": "[[\"1\",\"M\"]]",
        "explanation": "The clicked square touches one mine, so it shows \"1\"."
      }
    ],
    "constraints": [
      "1 <= number of rows, number of columns <= 50",
      "board[i][j] is one of \"M\", \"E\", \"B\", \"X\", or a digit from \"1\" to \"8\".",
      "click.length == 2, and the click position is inside the board.",
      "The clicked square is always \"M\" or \"E\"."
    ],
    "functionName": "updateBoard",
    "solution": "const MINE = 'M';\nconst UNREVEALED_EMPTY = 'E';\nconst REVEALED_BLANK = 'B';\nconst HIT_MINE = 'X';\n\nconst getPositionString = (row, col) => `${row}, ${col}`;\n\n// Minesweeper counts all 8 surrounding squares, including diagonals.\nconst directions = [\n    [0, 1],\n    [1, 0],\n    [0, -1],\n    [-1, 0],\n    [1, 1],\n    [1, -1],\n    [-1, 1],\n    [-1, -1],\n];\n\nconst isInBounds = (grid, row, col) => {\n    const numRows = grid.length;\n    const numCols = grid[0].length;\n\n    const rowInBounds = row >= 0 && row < numRows;\n    const colInBounds = col >= 0 && col < numCols;\n\n    return rowInBounds && colInBounds;\n};\n\nconst countAdjacentMines = (board, row, col) => {\n    let numAdjacentMines = 0;\n\n    for (const direction of directions) {\n        const [rowChange, colChange] = direction;\n\n        const newRow = row + rowChange;\n        const newCol = col + colChange;\n\n        if (!isInBounds(board, newRow, newCol)) continue;\n\n        if (board[newRow][newCol] === MINE) numAdjacentMines++;\n    }\n\n    return numAdjacentMines;\n};\n\n// CONTRACT for revealSquares(board, row, col, visited):\n//     when this call returns, if the square at `row`,`col` was an\n//     unrevealed empty square, it is now revealed — and if it touched\n//     no mines, the whole open region around it (plus its numbered\n//     border) is revealed too. Every square revealed this way goes\n//     into the visited set.\nconst revealSquares = (board, row, col, visited) => {\n    // Base cases\n    if (!isInBounds(board, row, col)) return;\n\n    const curPositionString = getPositionString(row, col);\n    if (visited.has(curPositionString)) return;\n\n    if (board[row][col] !== UNREVEALED_EMPTY) return;\n\n    // Process node\n    visited.add(curPositionString);\n\n    const numAdjacentMines = countAdjacentMines(board, row, col);\n\n    // A square touching at least one mine shows its count, and the reveal\n    // stops here so we never uncover squares right next to mines.\n    if (numAdjacentMines > 0) {\n        board[row][col] = String(numAdjacentMines);\n        return;\n    }\n\n    board[row][col] = REVEALED_BLANK;\n\n    // Recurse on neighbors\n    for (const direction of directions) {\n        const [rowChange, colChange] = direction;\n\n        const newRow = row + rowChange;\n        const newCol = col + colChange;\n\n        // The recursive leap of faith, one level down: this call has\n        // the SAME contract — when it returns, the neighbor square and\n        // any open region connected to it is revealed and in visited.\n        // Trust it, do not trace it. This function already revealed\n        // `row`,`col`, and each neighbor's contract covers the rest of\n        // the region — together, that is this function's full\n        // contract, kept.\n        revealSquares(board, newRow, newCol, visited);\n    }\n};\n\nconst updateBoard = (board, click) => {\n    const [clickRow, clickCol] = click;\n\n    // Clicking a mine ends the game immediately.\n    if (board[clickRow][clickCol] === MINE) {\n        board[clickRow][clickCol] = HIT_MINE;\n        return board;\n    }\n\n    const visited = new Set();\n\n    // The recursive leap of faith: trust the contract. When this\n    // call returns, the clicked square — and, if it touched no\n    // mines, the whole open region around it — is revealed on the\n    // board. We do not trace inside; we just return the updated\n    // board.\n    revealSquares(board, clickRow, clickCol, visited);\n\n    return board;\n};",
    "tests": [
      {
        "args": [
          [
            [
              "E",
              "E",
              "E",
              "E",
              "E"
            ],
            [
              "E",
              "E",
              "M",
              "E",
              "E"
            ],
            [
              "E",
              "E",
              "E",
              "E",
              "E"
            ],
            [
              "E",
              "E",
              "E",
              "E",
              "E"
            ]
          ],
          [
            3,
            0
          ]
        ],
        "expected": [
          [
            "B",
            "1",
            "E",
            "1",
            "B"
          ],
          [
            "B",
            "1",
            "M",
            "1",
            "B"
          ],
          [
            "B",
            "1",
            "1",
            "1",
            "B"
          ],
          [
            "B",
            "B",
            "B",
            "B",
            "B"
          ]
        ]
      },
      {
        "args": [
          [
            [
              "B",
              "1",
              "E",
              "1",
              "B"
            ],
            [
              "B",
              "1",
              "M",
              "1",
              "B"
            ],
            [
              "B",
              "1",
              "1",
              "1",
              "B"
            ],
            [
              "B",
              "B",
              "B",
              "B",
              "B"
            ]
          ],
          [
            1,
            2
          ]
        ],
        "expected": [
          [
            "B",
            "1",
            "E",
            "1",
            "B"
          ],
          [
            "B",
            "1",
            "X",
            "1",
            "B"
          ],
          [
            "B",
            "1",
            "1",
            "1",
            "B"
          ],
          [
            "B",
            "B",
            "B",
            "B",
            "B"
          ]
        ]
      },
      {
        "args": [
          [
            [
              "E",
              "M"
            ]
          ],
          [
            0,
            0
          ]
        ],
        "expected": [
          [
            "1",
            "M"
          ]
        ]
      },
      {
        "args": [
          [
            [
              "E",
              "E"
            ],
            [
              "E",
              "E"
            ]
          ],
          [
            0,
            0
          ]
        ],
        "expected": [
          [
            "B",
            "B"
          ],
          [
            "B",
            "B"
          ]
        ]
      },
      {
        "args": [
          [
            [
              "M",
              "E",
              "M"
            ],
            [
              "E",
              "E",
              "E"
            ],
            [
              "M",
              "E",
              "M"
            ]
          ],
          [
            1,
            1
          ]
        ],
        "expected": [
          [
            "M",
            "E",
            "M"
          ],
          [
            "E",
            "4",
            "E"
          ],
          [
            "M",
            "E",
            "M"
          ]
        ]
      }
    ],
    "curriculumOrder": 16,
    "runner": {
      "kind": "function",
      "parameterNames": [
        "board",
        "click"
      ]
    }
  },
  {
    "id": "smallest-string-with-swaps",
    "title": "Smallest String With Swaps",
    "category": "original",
    "section": "Optional extra problems",
    "difficulty": "Medium",
    "sourceName": "LeetCode",
    "sourceLink": "https://leetcode.com/problems/smallest-string-with-swaps/",
    "statement": "You are given a string `s` and a list of index pairs called `pairs`, where each `pairs[i] = [a, b]` names two positions in the string (0-indexed).\n\nYou may swap the characters at the two positions of any pair, and you may do this **as many times as you like**, in any order, reusing pairs freely.\n\nReturn the lexicographically smallest string you can end up with. (\"Lexicographically smallest\" means the string that would come first in a dictionary.)",
    "examples": [
      {
        "input": "s = \"dcab\", pairs = [[0,3],[1,2]]",
        "output": "\"bacd\"",
        "explanation": "Swap indexes 0 and 3 to get \"bcad\", then swap indexes 1 and 2 to get \"bacd\". Indexes {0, 3} form one group and {1, 2} form another, so the two groups sort their letters separately."
      },
      {
        "input": "s = \"dcab\", pairs = [[0,3],[1,2],[0,2]]",
        "output": "\"abcd\"",
        "explanation": "The extra pair [0,2] links the two groups into one connected group {0, 1, 2, 3}, so all four letters can be fully sorted."
      },
      {
        "input": "s = \"cba\", pairs = [[0,1],[1,2]]",
        "output": "\"abc\"",
        "explanation": "Indexes 0, 1, and 2 are all connected through chains of pairs, so the whole string can be sorted."
      }
    ],
    "constraints": [
      "1 <= s.length <= 10^5",
      "0 <= pairs.length <= 10^5",
      "pairs[i].length == 2",
      "0 <= pairs[i][0], pairs[i][1] < s.length",
      "s contains only lowercase English letters."
    ],
    "functionName": "smallestStringWithSwaps",
    "solution": "const buildGraph = (edges) => {\n    const graph = {};\n\n    for (const edge of edges) {\n        const [nodeOne, nodeTwo] = edge;\n\n        const nodeOneInGraph = graph.hasOwnProperty(nodeOne);\n        const nodeTwoInGraph = graph.hasOwnProperty(nodeTwo);\n\n        if (!nodeOneInGraph) graph[nodeOne] = [];\n        if (!nodeTwoInGraph) graph[nodeTwo] = [];\n\n        graph[nodeOne].push(nodeTwo);\n        graph[nodeTwo].push(nodeOne);\n    }\n\n    return graph;\n};\n\n// CONTRACT for collectComponentIndices(graph, curIndex, visited, componentIndices):\n//     when this call returns, `curIndex` and every index connected to\n//     it through chains of pairs is in the visited set and has been\n//     added to `componentIndices`.\nconst collectComponentIndices = (graph, curIndex, visited, componentIndices) => {\n    // Base case\n    if (visited.has(curIndex)) return;\n\n    // Process node\n    visited.add(curIndex);\n    componentIndices.push(curIndex);\n\n    // Recurse on neighbors\n    const indexInGraph = graph.hasOwnProperty(curIndex);\n    if (!indexInGraph) return;\n\n    const neighbors = graph[curIndex];\n\n    for (const neighbor of neighbors) {\n        // The recursive leap of faith, one level down: this call has\n        // the SAME contract — when it returns, `neighbor` and every\n        // index connected to it is in visited and in the list. Trust\n        // it, do not trace it. This function already added `curIndex`,\n        // and each neighbor's contract covers the rest of the group —\n        // together, that is this function's full contract, kept.\n        collectComponentIndices(graph, neighbor, visited, componentIndices);\n    }\n};\n\nconst smallestStringWithSwaps = (s, pairs) => {\n    const graph = buildGraph(pairs);\n\n    const resultChars = s.split('');\n    const visited = new Set();\n\n    for (let startIndex = 0; startIndex < s.length; startIndex++) {\n        if (visited.has(startIndex)) continue;\n\n        const componentIndices = [];\n\n        // The recursive leap of faith: trust the contract. When this\n        // call returns, componentIndices holds every index in this\n        // group, and they are all in visited. We do not trace inside;\n        // we just sort this group's letters into place.\n        collectComponentIndices(graph, startIndex, visited, componentIndices);\n\n        // Within one connected component we can swap letters into any\n        // arrangement, so we greedily place the smallest letters at the\n        // smallest indices.\n        componentIndices.sort((indexA, indexB) => indexA - indexB);\n\n        const componentChars = componentIndices.map((index) => s[index]);\n        componentChars.sort();\n\n        for (let i = 0; i < componentIndices.length; i++) {\n            resultChars[componentIndices[i]] = componentChars[i];\n        }\n    }\n\n    return resultChars.join('');\n};",
    "tests": [
      {
        "args": [
          "dcab",
          [
            [
              0,
              3
            ],
            [
              1,
              2
            ]
          ]
        ],
        "expected": "bacd"
      },
      {
        "args": [
          "dcab",
          [
            [
              0,
              3
            ],
            [
              1,
              2
            ],
            [
              0,
              2
            ]
          ]
        ],
        "expected": "abcd"
      },
      {
        "args": [
          "cba",
          [
            [
              0,
              1
            ],
            [
              1,
              2
            ]
          ]
        ],
        "expected": "abc"
      },
      {
        "args": [
          "dcab",
          []
        ],
        "expected": "dcab"
      },
      {
        "args": [
          "zyxw",
          [
            [
              0,
              2
            ],
            [
              1,
              3
            ]
          ]
        ],
        "expected": "xwzy"
      }
    ],
    "hint": "With pairs `[0,1]` and `[1,2]`, which arrangements of the letters at positions 0, 1, and 2 can you actually reach?",
    "curriculumOrder": 17,
    "runner": {
      "kind": "function",
      "parameterNames": [
        "s",
        "pairs"
      ]
    }
  },
  {
    "id": "water-and-jug-problem",
    "title": "Water and Jug Problem",
    "category": "original",
    "section": "Optional extra problems",
    "difficulty": "Medium",
    "sourceName": "LeetCode",
    "sourceLink": "https://leetcode.com/problems/water-and-jug-problem/",
    "statement": "You have two water jugs with capacities of `jug1Capacity` and `jug2Capacity` liters. There is an unlimited water supply, but the jugs have no measurement markings. Both jugs start empty.\n\nAt any point you may do one of these moves:\n\n- **Fill** either jug completely to the top.\n- **Empty** either jug completely.\n- **Pour** water from one jug into the other, until either the source jug is empty or the destination jug is full.\n\nReturn `true` if it is possible to reach a moment where the water you are holding measures exactly `targetCapacity` liters — either inside one jug, or as the combined total in both jugs. Otherwise return `false`.",
    "examples": [
      {
        "input": "jug1Capacity = 3, jug2Capacity = 5, targetCapacity = 4",
        "output": "true",
        "explanation": "Fill the 5-liter jug, pour it into the 3-liter jug (leaving 2), empty the 3-liter jug, pour the 2 liters in, fill the 5-liter jug again, and top off the 3-liter jug. That pours off exactly 1 liter, leaving 4 liters in the 5-liter jug."
      },
      {
        "input": "jug1Capacity = 2, jug2Capacity = 6, targetCapacity = 5",
        "output": "false",
        "explanation": "Every reachable amount is a multiple of 2, so 5 liters is impossible."
      },
      {
        "input": "jug1Capacity = 1, jug2Capacity = 2, targetCapacity = 3",
        "output": "true",
        "explanation": "Fill both jugs; together they hold exactly 3 liters."
      }
    ],
    "constraints": [
      "1 <= jug1Capacity, jug2Capacity, targetCapacity <= 10^6"
    ],
    "functionName": "canMeasureWater",
    "solution": "const getStateString = (amountInJug1, amountInJug2) => `${amountInJug1}, ${amountInJug2}`;\n\nconst getNextStates = (amountInJug1, amountInJug2, jug1Capacity, jug2Capacity) => {\n    // Pouring moves water until the source jug is empty or the\n    // destination jug is full, whichever happens first.\n    const amountPouredIntoJug2 = Math.min(amountInJug1, jug2Capacity - amountInJug2);\n    const amountPouredIntoJug1 = Math.min(amountInJug2, jug1Capacity - amountInJug1);\n\n    return [\n        [jug1Capacity, amountInJug2],\n        [amountInJug1, jug2Capacity],\n        [0, amountInJug2],\n        [amountInJug1, 0],\n        [amountInJug1 - amountPouredIntoJug2, amountInJug2 + amountPouredIntoJug2],\n        [amountInJug1 + amountPouredIntoJug1, amountInJug2 - amountPouredIntoJug1],\n    ];\n};\n\nconst canMeasureWater = (jug1Capacity, jug2Capacity, targetCapacity) => {\n    // The two jugs can never hold more water than their combined capacity.\n    if (targetCapacity > jug1Capacity + jug2Capacity) return false;\n\n    // This is DFS with an explicit stack instead of recursion, because large\n    // capacities create chains of states deep enough to overflow the call stack.\n    const visited = new Set();\n    const stack = [[0, 0]]; // <- leap of faith: we hand the whole sweep to the loop and just read its verdict.\n\n    // CONTRACT for this sweep: every state reachable from (0, 0) by\n    // legal moves gets popped and checked (repeat copies are discarded\n    // by the visited check). If any of them hits targetCapacity we\n    // return true; if the stack empties first, no reachable state ever\n    // could — so false.\n    while (stack.length > 0) {\n        const [amountInJug1, amountInJug2] = stack.pop();\n\n        // Base cases\n        if (amountInJug1 === targetCapacity) return true;\n        if (amountInJug2 === targetCapacity) return true;\n        if (amountInJug1 + amountInJug2 === targetCapacity) return true;\n\n        const curStateString = getStateString(amountInJug1, amountInJug2);\n        if (visited.has(curStateString)) continue;\n\n        // Process node\n        visited.add(curStateString);\n\n        // Traverse neighbors\n        const nextStates = getNextStates(\n            amountInJug1,\n            amountInJug2,\n            jug1Capacity,\n            jug2Capacity,\n        );\n\n        for (const nextState of nextStates) {\n            const [nextAmountInJug1, nextAmountInJug2] = nextState;\n\n            const nextStateString = getStateString(nextAmountInJug1, nextAmountInJug2);\n            if (visited.has(nextStateString)) continue;\n\n            // The leap of faith, one move down: pushing a state hands\n            // it the SAME contract — everything reachable from it will\n            // be swept too. Trust it, do not trace it.\n            stack.push(nextState);\n        }\n    }\n\n    return false;\n};",
    "tests": [
      {
        "args": [
          3,
          5,
          4
        ],
        "expected": true
      },
      {
        "args": [
          2,
          6,
          5
        ],
        "expected": false
      },
      {
        "args": [
          1,
          2,
          3
        ],
        "expected": true
      },
      {
        "args": [
          4,
          6,
          8
        ],
        "expected": true
      },
      {
        "args": [
          999,
          1000,
          1
        ],
        "expected": true
      }
    ],
    "hint": "What pair of numbers completely describes your situation at any moment, and how does each move change it?",
    "curriculumOrder": 18,
    "runner": {
      "kind": "function",
      "parameterNames": [
        "jug1Capacity",
        "jug2Capacity",
        "targetCapacity"
      ]
    }
  },
  {
    "id": "number-of-increasing-paths-in-a-grid",
    "title": "Number of Increasing Paths in a Grid",
    "category": "original",
    "section": "Optional extra problems",
    "difficulty": "Hard",
    "sourceName": "LeetCode",
    "sourceLink": "https://leetcode.com/problems/number-of-increasing-paths-in-a-grid/",
    "statement": "You are given an `m x n` grid of integers called `grid`. Starting from any cell, you may move up, down, left, or right — but only onto a cell whose value is **strictly greater** than the value of the cell you are standing on.\n\nCount how many different **strictly increasing paths** exist in the grid. A path can start at any cell and end at any cell. Even a single cell all by itself counts as a path (a path of length 1).\n\nTwo paths are considered different if they do not visit the exact same sequence of cells.\n\nBecause the answer can get astronomically large, return it **modulo** `10^9 + 7` (that is, return the remainder after dividing by `1000000007`).",
    "examples": [
      {
        "input": "grid = [[1,1],[3,4]]",
        "output": "8",
        "explanation": "There are 4 paths with one cell: [1], [1], [3], and [4]. There are 3 paths with two cells: [1,3], [1,4], and [3,4]. There is 1 path with three cells: [1,3,4]. In total that is 4 + 3 + 1 = 8 paths."
      },
      {
        "input": "grid = [[1],[2]]",
        "output": "3",
        "explanation": "There are 2 paths with one cell: [1] and [2]. There is 1 path with two cells: [1,2]. In total that is 2 + 1 = 3 paths."
      },
      {
        "input": "grid = [[5]]",
        "output": "1",
        "explanation": "A single cell is itself a path of length 1."
      }
    ],
    "constraints": [
      "m == grid.length",
      "n == grid[i].length",
      "1 <= m, n <= 1000",
      "1 <= m * n <= 10^5",
      "1 <= grid[i][j] <= 10^5"
    ],
    "functionName": "countPaths",
    "solution": "const MOD = 1000000007;\n\nconst getPositionString = (row, col) => `${row}, ${col}`;\nconst directions = [\n    [0, 1],\n    [1, 0],\n    [0, -1],\n    [-1, 0],\n];\n\nconst isInBounds = (grid, row, col) => {\n    const numRows = grid.length;\n    const numCols = grid[0].length;\n\n    const rowInBounds = row >= 0 && row < numRows;\n    const colInBounds = col >= 0 && col < numCols;\n\n    return rowInBounds && colInBounds;\n};\n\n// CONTRACT for countPathsStartingAt(grid, row, col, memo):\n//     returns the number of strictly increasing paths that start at\n//     the cell `row`,`col` (modulo 10^9 + 7), and saves that answer\n//     in `memo` so it never has to be computed again.\nconst countPathsStartingAt = (grid, row, col, memo) => {\n    // Base case\n    // Our real base case is handled automatically: when no neighbor is\n    // strictly larger than the current cell, the loop below adds nothing\n    // and the count stays at 1 (the cell by itself).\n    const curPositionString = getPositionString(row, col);\n    if (memo.hasOwnProperty(curPositionString)) return memo[curPositionString];\n\n    // Process node\n    // Every cell counts as an increasing path of length 1 by itself.\n    let numPathsFromCur = 1;\n\n    // Recurse on neighbors\n    for (const direction of directions) {\n        const [rowChange, colChange] = direction;\n\n        const newRow = row + rowChange;\n        const newCol = col + colChange;\n\n        if (!isInBounds(grid, newRow, newCol)) continue;\n\n        // Paths must be strictly increasing, so we only step onto larger\n        // values. This also means a path can never loop back on itself,\n        // which is why we do not need a visited set.\n        if (grid[newRow][newCol] <= grid[row][col]) continue;\n\n        // The recursive leap of faith, one level down: this call has\n        // the SAME contract — it returns the number of increasing\n        // paths starting at the larger neighbor. Trust it, do not\n        // trace it. Every path from this cell is either the cell alone\n        // or a step onto a larger neighbor followed by a path from\n        // there, so 1 plus the neighbors' guaranteed counts is exactly\n        // this function's contract, kept.\n        const numPathsFromNeighbor = countPathsStartingAt(grid, newRow, newCol, memo);\n        numPathsFromCur = (numPathsFromCur + numPathsFromNeighbor) % MOD;\n    }\n\n    memo[curPositionString] = numPathsFromCur;\n\n    return numPathsFromCur;\n};\n\nconst countPaths = (grid) => {\n    const numRows = grid.length;\n    const numCols = grid[0].length;\n\n    let totalNumPaths = 0;\n    const memo = {};\n\n    // Every cell can be the start of a path, so we sum the counts\n    // from every starting cell.\n    for (let row = 0; row < numRows; row++) {\n        for (let col = 0; col < numCols; col++) {\n            // The recursive leap of faith: trust the contract. This call\n            // returns the number of increasing paths starting at this\n            // cell. We do not trace inside; we just add it to the running\n            // total.\n            const numPathsFromCell = countPathsStartingAt(grid, row, col, memo);\n            totalNumPaths = (totalNumPaths + numPathsFromCell) % MOD;\n        }\n    }\n\n    return totalNumPaths;\n};\n",
    "tests": [
      {
        "args": [
          [
            [
              1,
              1
            ],
            [
              3,
              4
            ]
          ]
        ],
        "expected": 8
      },
      {
        "args": [
          [
            [
              1
            ],
            [
              2
            ]
          ]
        ],
        "expected": 3
      },
      {
        "args": [
          [
            [
              5
            ]
          ]
        ],
        "expected": 1
      },
      {
        "args": [
          [
            [
              1,
              2
            ],
            [
              3,
              4
            ]
          ]
        ],
        "expected": 10
      },
      {
        "args": [
          [
            [
              9,
              9,
              4
            ],
            [
              6,
              6,
              8
            ],
            [
              2,
              1,
              1
            ]
          ]
        ],
        "expected": 23
      }
    ],
    "curriculumOrder": 19,
    "runner": {
      "kind": "function",
      "parameterNames": [
        "grid"
      ]
    }
  },
  {
    "id": "course-schedule",
    "title": "Course Schedule",
    "category": "original",
    "section": "Advanced DFS",
    "difficulty": "Medium",
    "sourceName": "LeetCode",
    "sourceLink": "https://leetcode.com/problems/course-schedule/",
    "statement": "You are given `numCourses` courses, labeled from `0` to `numCourses - 1`, and an array `prerequisites` where each entry `prerequisites[i] = [a, b]` means: **before you can take course `a`, you must first take course `b`**.\n\nReturn `true` if it is possible to finish every course, and `false` otherwise.",
    "examples": [
      {
        "input": "numCourses = 2, prerequisites = [[1,0]]",
        "output": "true",
        "explanation": "There are 2 courses. To take course 1 you must first take course 0. So take course 0, then course 1. Everything can be finished."
      },
      {
        "input": "numCourses = 2, prerequisites = [[1,0],[0,1]]",
        "output": "false",
        "explanation": "Course 1 requires course 0, but course 0 also requires course 1. Neither can be taken first, so it is impossible to finish."
      },
      {
        "input": "numCourses = 3, prerequisites = [[1,0],[2,1]]",
        "output": "true",
        "explanation": "Take course 0, then course 1, then course 2."
      }
    ],
    "constraints": [
      "1 <= numCourses <= 2000",
      "0 <= prerequisites.length <= 5000",
      "prerequisites[i].length == 2",
      "0 <= a, b < numCourses",
      "All the pairs prerequisites[i] are unique."
    ],
    "functionName": "canFinish",
    "solution": "const VISITING = 1;\nconst VISITED = 2;\n\nconst buildGraph = (prerequisites) => {\n    const graph = {};\n\n    for (const prerequisite of prerequisites) {\n        const [course, requiredCourse] = prerequisite;\n\n        const courseInGraph = graph.hasOwnProperty(course);\n        const requiredCourseInGraph = graph.hasOwnProperty(requiredCourse);\n\n        if (!courseInGraph) graph[course] = [];\n        if (!requiredCourseInGraph) graph[requiredCourse] = [];\n\n        // This is a directed graph, so the edge only goes one way:\n        // from the required course to the course that needs it.\n        graph[requiredCourse].push(course);\n    }\n\n    return graph;\n};\n\n// CONTRACT for hasCycle(graph, course, courseStates):\n//     returns true if a cycle can be reached from `course`, and false\n//     otherwise. When it returns false, `course` and everything\n//     reachable from it is marked VISITED — fully explored,\n//     cycle-free.\nconst hasCycle = (graph, course, courseStates) => {\n    // Base cases\n    // A VISITING course is still on our current DFS path, so seeing it\n    // again means we looped back around: that is a cycle.\n    if (courseStates[course] === VISITING) return true;\n\n    // A VISITED course was fully explored earlier and led to no cycle,\n    // so we can safely skip it. This is why we need three states instead\n    // of a plain visited set: in a directed graph, reaching an already\n    // seen node is only a cycle if that node is on our CURRENT path.\n    if (courseStates[course] === VISITED) return false;\n\n    // Process node\n    courseStates[course] = VISITING;\n\n    // Recurse on neighbors\n    const neighbors = graph[course];\n    for (const neighbor of neighbors) {\n        // The recursive leap of faith, one level down: this call has\n        // the SAME contract — it returns true exactly when a cycle can\n        // be reached from `neighbor`. Trust it, do not trace it. If no\n        // neighbor leads to a cycle, then no cycle is reachable from\n        // `course` either — which is exactly this function's contract,\n        // kept.\n        if (hasCycle(graph, neighbor, courseStates)) return true;\n    }\n\n    courseStates[course] = VISITED;\n\n    return false;\n};\n\nconst canFinish = (numCourses, prerequisites) => {\n    const graph = buildGraph(prerequisites);\n\n    const courseStates = {};\n\n    for (let course = 0; course < numCourses; course++) {\n        // Courses with no prerequisites and no dependents are always fine.\n        const courseInGraph = graph.hasOwnProperty(course);\n        if (!courseInGraph) continue;\n\n        // We can finish every course as long as no cycle exists.\n        // The recursive leap of faith: trust the contract. This call\n        // returns true exactly when a cycle can be reached from\n        // `course`. We do not trace inside; we just return false the\n        // moment any cycle is found.\n        if (hasCycle(graph, course, courseStates)) return false;\n    }\n\n    return true;\n};\n",
    "tests": [
      {
        "args": [
          2,
          [
            [
              1,
              0
            ]
          ]
        ],
        "expected": true
      },
      {
        "args": [
          2,
          [
            [
              1,
              0
            ],
            [
              0,
              1
            ]
          ]
        ],
        "expected": false
      },
      {
        "args": [
          5,
          []
        ],
        "expected": true
      },
      {
        "args": [
          4,
          [
            [
              1,
              0
            ],
            [
              2,
              1
            ],
            [
              3,
              2
            ]
          ]
        ],
        "expected": true
      },
      {
        "args": [
          3,
          [
            [
              0,
              1
            ],
            [
              1,
              2
            ],
            [
              2,
              0
            ]
          ]
        ],
        "expected": false
      }
    ],
    "curriculumOrder": 20,
    "runner": {
      "kind": "function",
      "parameterNames": [
        "numCourses",
        "prerequisites"
      ]
    }
  },
  {
    "id": "is-graph-bipartite",
    "title": "Is Graph Bipartite?",
    "category": "original",
    "section": "Advanced DFS",
    "difficulty": "Medium",
    "sourceName": "LeetCode",
    "sourceLink": "https://leetcode.com/problems/is-graph-bipartite/",
    "statement": "You are given an undirected graph with `n` nodes, labeled from `0` to `n - 1`. The graph is described by an adjacency list `graph`, where `graph[u]` is the array of all nodes connected to node `u` by an edge. The graph may be disconnected, and no node has an edge to itself.\n\nA graph is **bipartite** if you can split its nodes into two groups so that **every edge connects a node from one group to a node from the other group**. In other words: no edge is allowed to connect two nodes in the same group.\n\nReturn `true` if the graph is bipartite, and `false` otherwise.",
    "examples": [
      {
        "input": "graph = [[1,3],[0,2],[1,3],[0,2]]",
        "output": "true",
        "explanation": "Put nodes 0 and 2 in one group and nodes 1 and 3 in the other. Every edge connects the two groups, so the graph is bipartite."
      },
      {
        "input": "graph = [[1,2,3],[0,2],[0,1,3],[0,2]]",
        "output": "false",
        "explanation": "Nodes 0, 1, and 2 form a triangle. With only two groups, two of those three nodes must share a group, but every pair of them is connected. There is no valid split."
      }
    ],
    "constraints": [
      "graph.length == n",
      "1 <= n <= 100",
      "0 <= graph[u].length < n",
      "0 <= graph[u][i] <= n - 1",
      "graph[u] does not contain u.",
      "All the values of graph[u] are unique.",
      "If graph[u] contains v, then graph[v] contains u."
    ],
    "functionName": "isBipartite",
    "solution": "const RED = 1;\nconst BLUE = -1;\nconst UNCOLORED = 0;\n\n// CONTRACT for canColorFrom(graph, node, color, nodeColors):\n//     returns true if `node` can take the color `color` and everything\n//     reachable from `node` can be colored so neighbors always get\n//     opposite colors — filling those colors into `nodeColors` as it\n//     goes. Returns false if that is impossible.\nconst canColorFrom = (graph, node, color, nodeColors) => {\n    // Base case\n    // If this node already has a color, we just check that it matches the\n    // color we wanted to paint it. A mismatch means two neighbors were\n    // forced into the same color, so the graph is not bipartite.\n    if (nodeColors[node] !== UNCOLORED) return nodeColors[node] === color;\n\n    // Process node\n    nodeColors[node] = color;\n\n    // Recurse on neighbors\n    // Every neighbor must get the opposite color. Multiplying by -1\n    // flips RED to BLUE and BLUE to RED.\n    const oppositeColor = color * -1;\n\n    const neighbors = graph[node];\n    for (const neighbor of neighbors) {\n        // The recursive leap of faith, one level down: this call has\n        // the SAME contract — it returns true exactly when the\n        // neighbor (and everything past it) can be colored with the\n        // opposite color. Trust it, do not trace it. This function\n        // already colored `node`, and each neighbor's contract covers\n        // the rest — together, that is this function's full contract,\n        // kept.\n        if (!canColorFrom(graph, neighbor, oppositeColor, nodeColors)) return false;\n    }\n\n    return true;\n};\n\nconst isBipartite = (graph) => {\n    const numNodes = graph.length;\n    const nodeColors = new Array(numNodes).fill(UNCOLORED);\n\n    // The graph might be disconnected, so we start a fresh coloring from\n    // every node that has not been colored yet.\n    for (let node = 0; node < numNodes; node++) {\n        if (nodeColors[node] !== UNCOLORED) continue;\n\n        // The recursive leap of faith: trust the contract. This call\n        // returns true exactly when this whole piece of the graph can\n        // be split into two color groups. We do not trace inside; we\n        // just return false the moment any piece fails.\n        if (!canColorFrom(graph, node, RED, nodeColors)) return false;\n    }\n\n    return true;\n};\n",
    "tests": [
      {
        "args": [
          [
            [
              1,
              3
            ],
            [
              0,
              2
            ],
            [
              1,
              3
            ],
            [
              0,
              2
            ]
          ]
        ],
        "expected": true
      },
      {
        "args": [
          [
            [
              1,
              2,
              3
            ],
            [
              0,
              2
            ],
            [
              0,
              1,
              3
            ],
            [
              0,
              2
            ]
          ]
        ],
        "expected": false
      },
      {
        "args": [
          [
            [],
            [],
            []
          ]
        ],
        "expected": true
      },
      {
        "args": [
          [
            [
              1
            ],
            [
              0
            ],
            [
              3
            ],
            [
              2
            ]
          ]
        ],
        "expected": true
      },
      {
        "args": [
          [
            [
              4
            ],
            [],
            [
              4
            ],
            [
              4
            ],
            [
              0,
              2,
              3
            ]
          ]
        ],
        "expected": true
      }
    ],
    "curriculumOrder": 21,
    "runner": {
      "kind": "function",
      "parameterNames": [
        "graph"
      ]
    }
  },
  {
    "id": "possible-bipartition",
    "title": "Possible Bipartition",
    "category": "original",
    "section": "Advanced DFS",
    "difficulty": "Medium",
    "sourceName": "LeetCode",
    "sourceLink": "https://leetcode.com/problems/possible-bipartition/",
    "statement": "You are given `n` people, labeled from `1` to `n`, and you want to split all of them into **two groups** (the groups can be any size).\n\nYou are also given an array `dislikes`, where each entry `dislikes[i] = [a, b]` means person `a` and person `b` dislike each other and are **not allowed to be in the same group**.\n\nReturn `true` if it is possible to split everyone into two groups this way, and `false` otherwise.",
    "examples": [
      {
        "input": "n = 4, dislikes = [[1,2],[1,3],[2,4]]",
        "output": "true",
        "explanation": "Put people 1 and 4 in the first group, and people 2 and 3 in the second group. No two people in the same group dislike each other."
      },
      {
        "input": "n = 3, dislikes = [[1,2],[1,3],[2,3]]",
        "output": "false",
        "explanation": "All three people dislike each other. With only two groups, some two of them must end up together, so no valid split exists."
      },
      {
        "input": "n = 5, dislikes = [[1,2],[2,3],[3,4],[4,5],[1,5]]",
        "output": "false",
        "explanation": "The five people form a cycle of dislikes with an odd length. Going around the cycle alternating groups, person 5 would need to be in both groups at once — impossible."
      }
    ],
    "constraints": [
      "1 <= n <= 2000",
      "0 <= dislikes.length <= 10^4",
      "dislikes[i].length == 2",
      "1 <= a < b <= n",
      "All the pairs of dislikes are unique."
    ],
    "functionName": "possibleBipartition",
    "solution": "const RED = 1;\nconst BLUE = -1;\nconst UNCOLORED = 0;\n\nconst buildGraph = (dislikes) => {\n    const graph = {};\n\n    for (const dislike of dislikes) {\n        const [personOne, personTwo] = dislike;\n\n        const personOneInGraph = graph.hasOwnProperty(personOne);\n        const personTwoInGraph = graph.hasOwnProperty(personTwo);\n\n        if (!personOneInGraph) graph[personOne] = [];\n        if (!personTwoInGraph) graph[personTwo] = [];\n\n        // Disliking is mutual, so this is an undirected graph.\n        graph[personOne].push(personTwo);\n        graph[personTwo].push(personOne);\n    }\n\n    return graph;\n};\n\n// CONTRACT for canColorFrom(graph, person, color, personColors):\n//     returns true if `person` can go into the group `color` and\n//     everyone connected to `person` through dislikes can be split so\n//     that two people who dislike each other never share a group —\n//     filling those groups into `personColors` as it goes. Returns\n//     false if that is impossible.\n//     If `person` already has a group, it returns true exactly when\n//     that group is `color` — an earlier call already placed them.\nconst canColorFrom = (graph, person, color, personColors) => {\n    // Base case\n    // If this person already has a group color, we just check that it\n    // matches the color we wanted to give them. A mismatch means two\n    // people who dislike each other were forced into the same group.\n    if (personColors[person] !== UNCOLORED) return personColors[person] === color;\n\n    // Process node\n    personColors[person] = color;\n\n    // Recurse on neighbors\n    // Everyone this person dislikes must go in the other group.\n    // Multiplying by -1 flips RED to BLUE and BLUE to RED.\n    const oppositeColor = color * -1;\n\n    const personInGraph = graph.hasOwnProperty(person);\n    if (!personInGraph) return true;\n\n    const dislikedPeople = graph[person];\n    for (const dislikedPerson of dislikedPeople) {\n        // The recursive leap of faith, one level down: this call has\n        // the SAME contract — it returns true exactly when the\n        // disliked person (and everyone connected to them) can be\n        // placed in the opposite group. Trust it, do not trace it.\n        // This function already placed `person`, and each disliked\n        // person's contract covers the rest — together, that is this\n        // function's full contract, kept.\n        if (!canColorFrom(graph, dislikedPerson, oppositeColor, personColors)) {\n            return false;\n        }\n    }\n\n    return true;\n};\n\nconst possibleBipartition = (n, dislikes) => {\n    const graph = buildGraph(dislikes);\n\n    // People are numbered 1 through n, so we make the array one slot\n    // bigger and simply never use index 0.\n    const personColors = new Array(n + 1).fill(UNCOLORED);\n\n    // The dislike graph might be disconnected, so we start a fresh\n    // coloring from every person who has not been placed in a group yet.\n    for (let person = 1; person <= n; person++) {\n        if (personColors[person] !== UNCOLORED) continue;\n\n        // The recursive leap of faith: trust the contract. This call\n        // returns true exactly when this whole cluster of people can\n        // be split into two groups. We do not trace inside; we just\n        // return false the moment any cluster fails.\n        if (!canColorFrom(graph, person, RED, personColors)) return false;\n    }\n\n    return true;\n};\n",
    "tests": [
      {
        "args": [
          4,
          [
            [
              1,
              2
            ],
            [
              1,
              3
            ],
            [
              2,
              4
            ]
          ]
        ],
        "expected": true
      },
      {
        "args": [
          3,
          [
            [
              1,
              2
            ],
            [
              1,
              3
            ],
            [
              2,
              3
            ]
          ]
        ],
        "expected": false
      },
      {
        "args": [
          5,
          [
            [
              1,
              2
            ],
            [
              2,
              3
            ],
            [
              3,
              4
            ],
            [
              4,
              5
            ],
            [
              1,
              5
            ]
          ]
        ],
        "expected": false
      },
      {
        "args": [
          10,
          [
            [
              1,
              2
            ],
            [
              3,
              4
            ],
            [
              5,
              6
            ]
          ]
        ],
        "expected": true
      },
      {
        "args": [
          1,
          []
        ],
        "expected": true
      }
    ],
    "curriculumOrder": 22,
    "runner": {
      "kind": "function",
      "parameterNames": [
        "n",
        "dislikes"
      ]
    }
  },
  {
    "id": "word-search",
    "title": "Word Search",
    "category": "original",
    "section": "Advanced DFS",
    "difficulty": "Medium",
    "sourceName": "LeetCode",
    "sourceLink": "https://leetcode.com/problems/word-search/",
    "statement": "You are given an `m x n` grid of letters called `board` and a string `word`. Return `true` if `word` can be spelled out by walking through the grid, and `false` otherwise.\n\nThe rules for spelling the word:\n\n- You may start at any cell.\n- Each next letter must come from a cell that is **directly next to** the previous one (up, down, left, or right — no diagonals).\n- You may **not** use the same cell twice in one word.",
    "examples": [
      {
        "input": "board = [['A','B','C','E'],['S','F','C','S'],['A','D','E','E']], word = 'ABCCED'",
        "output": "true",
        "explanation": "Start at the 'A' in the top-left corner, walk right to 'B', right to 'C', down to 'C', down to 'E', then left to 'D'."
      },
      {
        "input": "board = [['A','B','C','E'],['S','F','C','S'],['A','D','E','E']], word = 'SEE'",
        "output": "true",
        "explanation": "Start at the 'S' in the top-right area, then walk down to 'E' and left to 'E'."
      },
      {
        "input": "board = [['A','B','C','E'],['S','F','C','S'],['A','D','E','E']], word = 'ABCB'",
        "output": "false",
        "explanation": "The only way to spell 'ABCB' would reuse the 'B' cell, which is not allowed."
      }
    ],
    "constraints": [
      "m == board.length",
      "n == board[i].length",
      "1 <= m, n <= 6",
      "1 <= word.length <= 15",
      "board and word consist of only lowercase and uppercase English letters."
    ],
    "functionName": "exist",
    "solution": "const getPositionString = (row, col) => `${row}, ${col}`;\nconst directions = [\n    [0, 1],\n    [1, 0],\n    [0, -1],\n    [-1, 0],\n];\n\nconst isInBounds = (board, row, col) => {\n    const numRows = board.length;\n    const numCols = board[0].length;\n\n    const rowInBounds = row >= 0 && row < numRows;\n    const colInBounds = col >= 0 && col < numCols;\n\n    return rowInBounds && colInBounds;\n};\n\n// CONTRACT for canFindWordFrom(board, row, col, word, wordIndex, visited):\n//     returns true if the rest of the word — from position `wordIndex`\n//     to the end — can be spelled starting at the cell `row`,`col`,\n//     stepping only onto side-by-side cells and never reusing a cell\n//     already in the visited set. When it returns false, the visited\n//     set is back to exactly what it was before the call.\nconst canFindWordFrom = (board, row, col, word, wordIndex, visited) => {\n    // Base cases\n    if (!isInBounds(board, row, col)) return false;\n\n    // Each cell can only be used once per word, so cells already on our\n    // current path are off limits.\n    const curPositionString = getPositionString(row, col);\n    if (visited.has(curPositionString)) return false;\n\n    if (board[row][col] !== word[wordIndex]) return false;\n\n    // We just matched the last letter, so the whole word exists.\n    if (wordIndex === word.length - 1) return true;\n\n    // Process node\n    visited.add(curPositionString);\n\n    // Recurse on neighbors\n    for (const direction of directions) {\n        const [rowChange, colChange] = direction;\n\n        const newRow = row + rowChange;\n        const newCol = col + colChange;\n\n        // The recursive leap of faith, one level down: this call has\n        // the SAME contract — it returns true exactly when the rest of\n        // the word, starting at the next letter, can be spelled from\n        // the neighbor cell. Trust it, do not trace it. This cell\n        // matched its own letter, and the neighbor's contract covers\n        // the remaining letters — together, that is this function's\n        // full contract, kept.\n        if (canFindWordFrom(board, newRow, newCol, word, wordIndex + 1, visited)) {\n            return true;\n        }\n    }\n\n    // Backtrack: this path failed, so we free up the cell. A different\n    // path might still need to walk through it later.\n    visited.delete(curPositionString);\n\n    return false;\n};\n\nconst exist = (board, word) => {\n    const numRows = board.length;\n    const numCols = board[0].length;\n\n    const visited = new Set();\n\n    // The word could start at any cell, so we try them all.\n    for (let row = 0; row < numRows; row++) {\n        for (let col = 0; col < numCols; col++) {\n            // The recursive leap of faith: trust the contract. This call\n            // returns true exactly when the whole word can be spelled\n            // starting at this cell. We do not trace inside; we just\n            // return true the moment any starting cell works.\n            if (canFindWordFrom(board, row, col, word, 0, visited)) return true;\n        }\n    }\n\n    return false;\n};\n",
    "tests": [
      {
        "args": [
          [
            [
              "A",
              "B",
              "C",
              "E"
            ],
            [
              "S",
              "F",
              "C",
              "S"
            ],
            [
              "A",
              "D",
              "E",
              "E"
            ]
          ],
          "ABCCED"
        ],
        "expected": true
      },
      {
        "args": [
          [
            [
              "A",
              "B",
              "C",
              "E"
            ],
            [
              "S",
              "F",
              "C",
              "S"
            ],
            [
              "A",
              "D",
              "E",
              "E"
            ]
          ],
          "SEE"
        ],
        "expected": true
      },
      {
        "args": [
          [
            [
              "A",
              "B",
              "C",
              "E"
            ],
            [
              "S",
              "F",
              "C",
              "S"
            ],
            [
              "A",
              "D",
              "E",
              "E"
            ]
          ],
          "ABCB"
        ],
        "expected": false
      },
      {
        "args": [
          [
            [
              "A"
            ]
          ],
          "A"
        ],
        "expected": true
      },
      {
        "args": [
          [
            [
              "A",
              "A"
            ]
          ],
          "AAA"
        ],
        "expected": false
      }
    ],
    "curriculumOrder": 23,
    "runner": {
      "kind": "function",
      "parameterNames": [
        "board",
        "word"
      ]
    }
  },
  {
    "id": "longest-increasing-path-in-a-matrix",
    "title": "Longest Increasing Path in a Matrix",
    "category": "original",
    "section": "Advanced DFS",
    "difficulty": "Hard",
    "sourceName": "LeetCode",
    "sourceLink": "https://leetcode.com/problems/longest-increasing-path-in-a-matrix/",
    "statement": "You are given an `m x n` grid of integers called `matrix`. Starting from any cell, you may move up, down, left, or right (no diagonals, and no wrapping around the edges) — but only onto a cell whose value is **strictly greater** than the value of the cell you are standing on.\n\nReturn the length of the **longest strictly increasing path** in the matrix, measured in number of cells. A single cell by itself counts as a path of length 1.",
    "examples": [
      {
        "input": "matrix = [[9,9,4],[6,6,8],[2,1,1]]",
        "output": "4",
        "explanation": "The longest increasing path is [1, 2, 6, 9], which has 4 cells."
      },
      {
        "input": "matrix = [[3,4,5],[3,2,6],[2,2,1]]",
        "output": "4",
        "explanation": "The longest increasing path is [3, 4, 5, 6]. Diagonal moves are not allowed."
      },
      {
        "input": "matrix = [[1]]",
        "output": "1",
        "explanation": "A single cell is a path of length 1."
      }
    ],
    "constraints": [
      "m == matrix.length",
      "n == matrix[i].length",
      "1 <= m, n <= 200",
      "0 <= matrix[i][j] <= 2^31 - 1"
    ],
    "functionName": "longestIncreasingPath",
    "solution": "const getPositionString = (row, col) => `${row}, ${col}`;\nconst directions = [\n    [0, 1],\n    [1, 0],\n    [0, -1],\n    [-1, 0],\n];\n\nconst isInBounds = (matrix, row, col) => {\n    const numRows = matrix.length;\n    const numCols = matrix[0].length;\n\n    const rowInBounds = row >= 0 && row < numRows;\n    const colInBounds = col >= 0 && col < numCols;\n\n    return rowInBounds && colInBounds;\n};\n\n// CONTRACT for getLongestPathFrom(matrix, row, col, memo):\n//     returns the number of cells in the longest strictly increasing\n//     path that starts at the cell `row`,`col`, and saves that answer\n//     in `memo` so it never has to be computed again.\nconst getLongestPathFrom = (matrix, row, col, memo) => {\n    // Base case\n    // Our real base case is handled automatically: when no neighbor is\n    // strictly larger than the current cell, the loop below never recurses\n    // and the answer stays at 1 (the cell by itself).\n    const curPositionString = getPositionString(row, col);\n    if (memo.hasOwnProperty(curPositionString)) return memo[curPositionString];\n\n    // Process node\n    // Every cell is an increasing path of length 1 by itself.\n    let longestPathFromCur = 1;\n\n    // Recurse on neighbors\n    for (const direction of directions) {\n        const [rowChange, colChange] = direction;\n\n        const newRow = row + rowChange;\n        const newCol = col + colChange;\n\n        if (!isInBounds(matrix, newRow, newCol)) continue;\n\n        // We only step onto strictly larger values, so a path can never\n        // loop back on itself. That is why we do not need a visited set.\n        if (matrix[newRow][newCol] <= matrix[row][col]) continue;\n\n        // The recursive leap of faith, one level down: this call has\n        // the SAME contract — it returns the length of the longest\n        // increasing path starting at the larger neighbor. Trust it,\n        // do not trace it. The best path from this cell is this cell\n        // plus the best guaranteed path from some larger neighbor —\n        // exactly this function's contract, kept.\n        const longestPathFromNeighbor = getLongestPathFrom(matrix, newRow, newCol, memo);\n        longestPathFromCur = Math.max(longestPathFromCur, 1 + longestPathFromNeighbor);\n    }\n\n    memo[curPositionString] = longestPathFromCur;\n\n    return longestPathFromCur;\n};\n\nconst longestIncreasingPath = (matrix) => {\n    const numRows = matrix.length;\n    const numCols = matrix[0].length;\n\n    let longestPathLength = 0;\n    const memo = {};\n\n    // The best path could start at any cell, so we try them all. The memo\n    // makes this fast: each cell is fully solved only once.\n    for (let row = 0; row < numRows; row++) {\n        for (let col = 0; col < numCols; col++) {\n            // The recursive leap of faith: trust the contract. This call\n            // returns the longest increasing path starting at this cell.\n            // We do not trace inside; we just keep the biggest answer seen\n            // so far.\n            const longestPathFromCell = getLongestPathFrom(matrix, row, col, memo);\n            longestPathLength = Math.max(longestPathLength, longestPathFromCell);\n        }\n    }\n\n    return longestPathLength;\n};\n",
    "tests": [
      {
        "args": [
          [
            [
              9,
              9,
              4
            ],
            [
              6,
              6,
              8
            ],
            [
              2,
              1,
              1
            ]
          ]
        ],
        "expected": 4
      },
      {
        "args": [
          [
            [
              3,
              4,
              5
            ],
            [
              3,
              2,
              6
            ],
            [
              2,
              2,
              1
            ]
          ]
        ],
        "expected": 4
      },
      {
        "args": [
          [
            [
              1
            ]
          ]
        ],
        "expected": 1
      },
      {
        "args": [
          [
            [
              1,
              2,
              3
            ],
            [
              6,
              5,
              4
            ],
            [
              7,
              8,
              9
            ]
          ]
        ],
        "expected": 9
      },
      {
        "args": [
          [
            [
              7,
              7
            ],
            [
              7,
              7
            ]
          ]
        ],
        "expected": 1
      }
    ],
    "curriculumOrder": 24,
    "runner": {
      "kind": "function",
      "parameterNames": [
        "matrix"
      ]
    }
  },
  {
    "id": "number-of-connected-components-in-an-undirected-graph",
    "title": "Number of Connected Components in an Undirected Graph",
    "category": "original",
    "section": "Traversing connected components",
    "difficulty": "Medium",
    "sourceName": "LeetCode",
    "sourceLink": "https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/",
    "statement": "You are given an undirected graph with `n` nodes, labeled from `0` to `n - 1`. You are also given a list `edges`, where each entry `edges[i] = [a, b]` means there is an edge connecting node `a` and node `b` (you can travel across it in either direction).\n\nA **connected component** is a group of nodes where every node can reach every other node in the group by walking along edges. A node with no edges at all forms a connected component all by itself.\n\nReturn the number of connected components in the graph.",
    "examples": [
      {
        "input": "n = 5, edges = [[0,1],[1,2],[3,4]]",
        "output": "2",
        "explanation": "Nodes 0, 1, and 2 are all linked together, forming one component. Nodes 3 and 4 form a second component."
      },
      {
        "input": "n = 5, edges = [[0,1],[1,2],[2,3],[3,4]]",
        "output": "1",
        "explanation": "Every node can reach every other node through the chain 0-1-2-3-4, so the whole graph is one component."
      },
      {
        "input": "n = 4, edges = []",
        "output": "4",
        "explanation": "There are no edges, so each of the 4 nodes is its own separate component."
      }
    ],
    "constraints": [
      "1 <= n <= 2000",
      "0 <= edges.length <= 5000",
      "edges[i].length == 2",
      "0 <= a, b < n",
      "a != b",
      "There are no repeated edges."
    ],
    "functionName": "countComponents",
    "solution": "const buildGraph = (edges) => {\n    const graph = {};\n\n    for (const edge of edges) {\n        const [nodeOne, nodeTwo] = edge;\n\n        const nodeOneInGraph = graph.hasOwnProperty(nodeOne);\n        const nodeTwoInGraph = graph.hasOwnProperty(nodeTwo);\n\n        if (!nodeOneInGraph) graph[nodeOne] = [];\n        if (!nodeTwoInGraph) graph[nodeTwo] = [];\n\n        graph[nodeOne].push(nodeTwo);\n        graph[nodeTwo].push(nodeOne);\n    }\n\n    return graph;\n};\n\n// CONTRACT for markComponentAsVisited(graph, node, visited):\n//     when this call returns, `node` and every node reachable\n//     from `node` is in the visited set.\nconst markComponentAsVisited = (graph, node, visited) => {\n    // Base cases\n    if (visited.has(node)) return;\n\n    // Process node\n    visited.add(node);\n\n    // Add neighbors\n    const nodeInGraph = graph.hasOwnProperty(node);\n    if (!nodeInGraph) return;\n\n    const neighbors = graph[node];\n\n    for (const neighbor of neighbors) {\n        // The recursive leap of faith, one level down: this call has\n        // the SAME contract — when it returns, `neighbor` and everything\n        // reachable from it is in visited. Trust it, do not trace it.\n        // This function already put `node` into visited, and each\n        // neighbor's contract puts everything reachable from that\n        // neighbor into visited — together, that is this function's\n        // full contract, kept.\n        markComponentAsVisited(graph, neighbor, visited);\n    }\n};\n\nconst countComponents = (numNodes, edges) => {\n    const graph = buildGraph(edges);\n\n    let numConnectedComponents = 0;\n    const visited = new Set();\n\n    for (let node = 0; node < numNodes; node++) {\n        if (visited.has(node)) continue;\n\n        numConnectedComponents++;\n\n        // The recursive leap of faith: trust the contract. When this\n        // call returns, `node` and everything reachable from it — the\n        // entire brand-new component — is in visited, so the loop can\n        // never count this component again. We do not trace inside;\n        // we just count it and move on.\n        markComponentAsVisited(graph, node, visited);\n    }\n\n    return numConnectedComponents;\n};\n",
    "tests": [
      {
        "args": [
          5,
          [
            [
              0,
              1
            ],
            [
              1,
              2
            ],
            [
              3,
              4
            ]
          ]
        ],
        "expected": 2
      },
      {
        "args": [
          5,
          [
            [
              0,
              1
            ],
            [
              1,
              2
            ],
            [
              2,
              3
            ],
            [
              3,
              4
            ]
          ]
        ],
        "expected": 1
      },
      {
        "args": [
          4,
          []
        ],
        "expected": 4
      },
      {
        "args": [
          6,
          [
            [
              0,
              5
            ],
            [
              1,
              2
            ],
            [
              2,
              3
            ]
          ]
        ],
        "expected": 3
      },
      {
        "args": [
          1,
          []
        ],
        "expected": 1
      }
    ],
    "curriculumOrder": 0,
    "runner": {
      "kind": "function",
      "parameterNames": [
        "numNodes",
        "edges"
      ]
    }
  },
  {
    "id": "number-of-provinces",
    "title": "Number of Provinces",
    "category": "original",
    "section": "Traversing connected components",
    "difficulty": "Medium",
    "sourceName": "LeetCode",
    "sourceLink": "https://leetcode.com/problems/number-of-provinces/",
    "statement": "You are given `n` cities. Some pairs of cities are directly connected to each other, and connection is a two-way street: if city `a` is connected to city `b`, then city `b` is connected to city `a`. Cities can also be connected *indirectly* — if `a` connects to `b` and `b` connects to `c`, then `a` and `c` are in the same group even though they have no direct link.\n\nA **province** is a group of cities that are all connected to each other, directly or indirectly, with no connections to any city outside the group.\n\nThe connections are described by an `n x n` matrix `isConnected`, where `isConnected[i][j] = 1` means city `i` and city `j` are directly connected, and `isConnected[i][j] = 0` means they are not. Every city is considered connected to itself, so `isConnected[i][i]` is always `1`.\n\nReturn the total number of provinces.",
    "examples": [
      {
        "input": "isConnected = [[1,1,0],[1,1,0],[0,0,1]]",
        "output": "2",
        "explanation": "Cities 0 and 1 are directly connected, so they form one province. City 2 is on its own, forming a second province."
      },
      {
        "input": "isConnected = [[1,0,0],[0,1,0],[0,0,1]]",
        "output": "3",
        "explanation": "No city is connected to any other, so each of the 3 cities is its own province."
      },
      {
        "input": "isConnected = [[1,0,0,1],[0,1,1,0],[0,1,1,1],[1,0,1,1]]",
        "output": "1",
        "explanation": "City 0 connects to city 3, city 3 connects to city 2, and city 2 connects to city 1 — so every city ends up in one big province."
      }
    ],
    "constraints": [
      "1 <= n <= 200",
      "n == isConnected.length",
      "n == isConnected[i].length",
      "isConnected[i][j] is 1 or 0.",
      "isConnected[i][i] == 1",
      "isConnected[i][j] == isConnected[j][i]"
    ],
    "functionName": "findCircleNum",
    "solution": "const CONNECTED = 1;\n\n// CONTRACT for markProvinceAsVisited(visited, city, isConnected):\n//     when this call returns, `city` and every city connected to it —\n//     directly or through chains of connections — is in the visited\n//     set.\nconst markProvinceAsVisited = (visited, city, isConnected) => {\n    // For this problem, our base case in automatically handled\n    // (our base case occurs when the current city has 0 unvisited\n    // neighbor cities).\n\n    // Process node\n    visited.add(city);\n\n    // Recurse on neighbors\n    for (\n        let potentialNeighborCity = 0;\n        potentialNeighborCity < isConnected.length;\n        potentialNeighborCity++\n    ) {\n        const isNeighbor =\n            isConnected[city][potentialNeighborCity] === CONNECTED;\n\n        if (!isNeighbor) continue;\n\n        // This is an undirected graph. If we can go from city 0 to city 1,\n        // then we can go from city 1 to city 0.\n        // Thus, this graph CAN have cycles (all undirected graphs can have cycles),\n        // so we must tracked visited nodes to prevent infinite loops.\n        if (visited.has(potentialNeighborCity)) continue;\n\n        // The recursive leap of faith, one level down: this call has\n        // the SAME contract — when it returns, the neighbor city and\n        // every city connected to it is in visited. Trust it, do not\n        // trace it. This function already put `city` into visited, and\n        // each neighbor's contract covers the rest of the province —\n        // together, that is this function's full contract, kept.\n        markProvinceAsVisited(visited, potentialNeighborCity, isConnected);\n    }\n};\n\nconst findCircleNum = (isConnected) => {\n    const numCities = isConnected.length;\n\n    let numProvinces = 0;\n    const visited = new Set();\n\n    for (let startCity = 0; startCity < numCities; startCity++) {\n        if (visited.has(startCity)) continue;\n\n        numProvinces++;\n\n        // The recursive leap of faith: trust the contract. When this\n        // call returns, every city in this newly found province is in\n        // visited, so the loop can never count this province again. We\n        // do not trace inside; we just count it and move on.\n        markProvinceAsVisited(visited, startCity, isConnected);\n    }\n\n    return numProvinces;\n};\n",
    "tests": [
      {
        "args": [
          [
            [
              1,
              1,
              0
            ],
            [
              1,
              1,
              0
            ],
            [
              0,
              0,
              1
            ]
          ]
        ],
        "expected": 2
      },
      {
        "args": [
          [
            [
              1,
              0,
              0
            ],
            [
              0,
              1,
              0
            ],
            [
              0,
              0,
              1
            ]
          ]
        ],
        "expected": 3
      },
      {
        "args": [
          [
            [
              1,
              0,
              0,
              1
            ],
            [
              0,
              1,
              1,
              0
            ],
            [
              0,
              1,
              1,
              1
            ],
            [
              1,
              0,
              1,
              1
            ]
          ]
        ],
        "expected": 1
      },
      {
        "args": [
          [
            [
              1
            ]
          ]
        ],
        "expected": 1
      },
      {
        "args": [
          [
            [
              1,
              1,
              0,
              0,
              0
            ],
            [
              1,
              1,
              1,
              0,
              0
            ],
            [
              0,
              1,
              1,
              0,
              0
            ],
            [
              0,
              0,
              0,
              1,
              1
            ],
            [
              0,
              0,
              0,
              1,
              1
            ]
          ]
        ],
        "expected": 2
      }
    ],
    "curriculumOrder": 1,
    "runner": {
      "kind": "function",
      "parameterNames": [
        "isConnected"
      ]
    }
  },
  {
    "id": "number-of-islands",
    "title": "Number of Islands",
    "category": "original",
    "section": "Traversing connected components",
    "difficulty": "Medium",
    "sourceName": "LeetCode",
    "sourceLink": "https://leetcode.com/problems/number-of-islands/",
    "statement": "You are given a 2D grid of characters where `'1'` represents land and `'0'` represents water.\n\nAn **island** is a patch of land cells that are joined together up/down/left/right (diagonal touches do not count). You can assume everything beyond the edges of the grid is water, so islands are always fully surrounded by water.\n\nReturn how many islands are in the grid.",
    "examples": [
      {
        "input": "grid = [[\"1\",\"1\",\"1\",\"1\",\"0\"],[\"1\",\"1\",\"0\",\"1\",\"0\"],[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"0\",\"0\",\"0\",\"0\",\"0\"]]",
        "output": "1",
        "explanation": "All the land cells touch each other through their sides, so they form a single island."
      },
      {
        "input": "grid = [[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"0\",\"0\",\"1\",\"0\",\"0\"],[\"0\",\"0\",\"0\",\"1\",\"1\"]]",
        "output": "3",
        "explanation": "There are three separate patches of land: the 2x2 block in the top-left, the single cell in the middle, and the pair of cells in the bottom-right."
      },
      {
        "input": "grid = [[\"1\",\"0\",\"1\"],[\"0\",\"1\",\"0\"],[\"1\",\"0\",\"1\"]]",
        "output": "5",
        "explanation": "The five land cells only touch diagonally, and diagonals do not connect land — so each cell is its own island."
      }
    ],
    "constraints": [
      "m == grid.length",
      "n == grid[i].length",
      "1 <= m, n <= 300",
      "grid[i][j] is '0' or '1'."
    ],
    "functionName": "numIslands",
    "solution": "const LAND = '1';\n\nconst getPositionString = (row, col) => `${row}, ${col}`;\nconst directions = [\n    [0, 1],\n    [1, 0],\n    [0, -1],\n    [-1, 0],\n];\n\nconst isInBounds = (grid, row, col) => {\n    const numRows = grid.length;\n    const numCols = grid[0].length;\n\n    const rowInBounds = row >= 0 && row < numRows;\n    const colInBounds = col >= 0 && col < numCols;\n\n    return rowInBounds && colInBounds;\n};\n\n// CONTRACT for markIslandAsVisited(grid, row, col, visited):\n//     when this call returns, if the cell at `row`,`col` is land,\n//     that cell and every land cell of the same island is in the\n//     visited set. (Water or out-of-bounds cells change nothing.)\nconst markIslandAsVisited = (grid, row, col, visited) => {\n    // Base case\n    if (!isInBounds(grid, row, col)) return;\n\n    const curPositionString = getPositionString(row, col);\n    if (visited.has(curPositionString)) return;\n\n    if (grid[row][col] !== LAND) return;\n\n    // Process node\n    visited.add(curPositionString);\n\n    // Recurse on potential neighbors\n    for (const direction of directions) {\n        const [rowChange, colChange] = direction;\n\n        const newRow = row + rowChange;\n        const newCol = col + colChange;\n\n        // The recursive leap of faith, one level down: this call has\n        // the SAME contract — when it returns, the neighbor cell (if\n        // it is land) and every land cell connected to it is in\n        // visited. Trust it, do not trace it. This function already\n        // put `row`,`col` into visited, and each neighbor's contract\n        // covers the rest of the island — together, that is this\n        // function's full contract, kept.\n        markIslandAsVisited(grid, newRow, newCol, visited);\n    }\n};\n\nconst numIslands = (grid) => {\n    const numRows = grid.length;\n    const numCols = grid[0].length;\n\n    let numberOfIslands = 0;\n    const visited = new Set();\n\n    for (let row = 0; row < numRows; row++) {\n        for (let col = 0; col < numCols; col++) {\n            const curPositionString = getPositionString(row, col);\n\n            if (visited.has(curPositionString)) continue;\n\n            const terrainType = grid[row][col];\n            if (terrainType !== LAND) continue;\n\n            numberOfIslands++;\n\n            // The recursive leap of faith: trust the contract. When this\n            // call returns, every cell of this newly found island is in\n            // visited, so the loops can never count the same island again.\n            // We do not trace inside; we just count it and move on.\n            markIslandAsVisited(grid, row, col, visited);\n        }\n    }\n\n    return numberOfIslands;\n};\n",
    "tests": [
      {
        "args": [
          [
            [
              "1",
              "1",
              "1",
              "1",
              "0"
            ],
            [
              "1",
              "1",
              "0",
              "1",
              "0"
            ],
            [
              "1",
              "1",
              "0",
              "0",
              "0"
            ],
            [
              "0",
              "0",
              "0",
              "0",
              "0"
            ]
          ]
        ],
        "expected": 1
      },
      {
        "args": [
          [
            [
              "1",
              "1",
              "0",
              "0",
              "0"
            ],
            [
              "1",
              "1",
              "0",
              "0",
              "0"
            ],
            [
              "0",
              "0",
              "1",
              "0",
              "0"
            ],
            [
              "0",
              "0",
              "0",
              "1",
              "1"
            ]
          ]
        ],
        "expected": 3
      },
      {
        "args": [
          [
            [
              "1",
              "0",
              "1"
            ],
            [
              "0",
              "1",
              "0"
            ],
            [
              "1",
              "0",
              "1"
            ]
          ]
        ],
        "expected": 5
      },
      {
        "args": [
          [
            [
              "0",
              "0"
            ],
            [
              "0",
              "0"
            ]
          ]
        ],
        "expected": 0
      },
      {
        "args": [
          [
            [
              "1"
            ]
          ]
        ],
        "expected": 1
      }
    ],
    "curriculumOrder": 2,
    "runner": {
      "kind": "function",
      "parameterNames": [
        "grid"
      ]
    }
  },
  {
    "id": "letter-combinations-of-a-phone-number",
    "title": "Letter Combinations of a Phone Number",
    "category": "original",
    "section": "Exploring a graph with DFS",
    "difficulty": "Medium",
    "sourceName": "LeetCode",
    "sourceLink": "https://leetcode.com/problems/letter-combinations-of-a-phone-number/",
    "statement": "You are given a string `digits` containing digits from `2` through `9`.\n\nOn an old-school phone keypad, each digit maps to a few letters:\n\n- `2` -> a, b, c\n- `3` -> d, e, f\n- `4` -> g, h, i\n- `5` -> j, k, l\n- `6` -> m, n, o\n- `7` -> p, q, r, s\n- `8` -> t, u, v\n- `9` -> w, x, y, z\n\nReturn every possible string you could spell by picking one letter for each digit, in order. You may return the answers in any order. If `digits` is empty, return an empty list.",
    "examples": [
      {
        "input": "digits = \"23\"",
        "output": "[\"ad\",\"ae\",\"af\",\"bd\",\"be\",\"bf\",\"cd\",\"ce\",\"cf\"]",
        "explanation": "The first character comes from 2 (a, b, or c) and the second from 3 (d, e, or f). That gives 3 x 3 = 9 combinations."
      },
      {
        "input": "digits = \"\"",
        "output": "[]",
        "explanation": "There are no digits, so there are no combinations to build."
      },
      {
        "input": "digits = \"2\"",
        "output": "[\"a\",\"b\",\"c\"]",
        "explanation": "A single 2 can be any one of its three letters."
      }
    ],
    "constraints": [
      "0 <= digits.length <= 4",
      "digits[i] is a digit in the range ['2', '9']."
    ],
    "functionName": "letterCombinations",
    "solution": "const numberToLettersMap = {\n    1: [],\n    2: ['a', 'b', 'c'],\n    3: ['d', 'e', 'f'],\n    4: ['g', 'h', 'i'],\n    5: ['j', 'k', 'l'],\n    6: ['m', 'n', 'o'],\n    7: ['p', 'q', 'r', 's'],\n    8: ['t', 'u', 'v'],\n    9: ['w', 'x', 'y', 'z'],\n};\n\n// CONTRACT for generateCombinations(digits, location, stringSoFar, allCombinations):\n//     when this call returns, every full combination that begins with\n//     `stringSoFar` and continues with one letter for each digit from\n//     position `location` onward has been pushed onto\n//     `allCombinations`.\nconst generateCombinations = (digits, location, stringSoFar, allCombinations) => {\n    // Base case\n    if (location === digits.length) {\n        allCombinations.push(stringSoFar);\n        return;\n    }\n\n    // Process node\n\n    // Traverse neighbors\n    const curDigit = digits[location];\n    const chars = numberToLettersMap[curDigit];\n\n    for (const char of chars) {\n        // The recursive leap of faith, one level down: this call has\n        // the SAME contract — when it returns, every combination that\n        // begins with `stringSoFar` + `char` and covers the remaining\n        // digits has been pushed. Trust it, do not trace it. Doing\n        // this once for each letter of the current digit covers every\n        // way to continue — exactly this function's contract, kept.\n        generateCombinations(digits, location + 1, stringSoFar + char, allCombinations);\n    }\n};\n\nconst letterCombinations = (digits) => {\n    if (digits.length === 0) return [];\n\n    const allCombinations = [];\n\n    // The recursive leap of faith: trust the contract. When this\n    // call returns, allCombinations holds every string that picks\n    // one letter per digit, from the first digit to the last. We\n    // do not trace inside; we just return the finished list.\n    generateCombinations(digits, 0, '', allCombinations);\n\n    return allCombinations;\n};\n",
    "tests": [
      {
        "args": [
          "23"
        ],
        "expected": [
          "ad",
          "ae",
          "af",
          "bd",
          "be",
          "bf",
          "cd",
          "ce",
          "cf"
        ],
        "unordered": true
      },
      {
        "args": [
          ""
        ],
        "expected": [],
        "unordered": true
      },
      {
        "args": [
          "2"
        ],
        "expected": [
          "a",
          "b",
          "c"
        ],
        "unordered": true
      },
      {
        "args": [
          "79"
        ],
        "expected": [
          "pw",
          "px",
          "py",
          "pz",
          "qw",
          "qx",
          "qy",
          "qz",
          "rw",
          "rx",
          "ry",
          "rz",
          "sw",
          "sx",
          "sy",
          "sz"
        ],
        "unordered": true
      },
      {
        "args": [
          "234"
        ],
        "expected": [
          "adg",
          "adh",
          "adi",
          "aeg",
          "aeh",
          "aei",
          "afg",
          "afh",
          "afi",
          "bdg",
          "bdh",
          "bdi",
          "beg",
          "beh",
          "bei",
          "bfg",
          "bfh",
          "bfi",
          "cdg",
          "cdh",
          "cdi",
          "ceg",
          "ceh",
          "cei",
          "cfg",
          "cfh",
          "cfi"
        ],
        "unordered": true
      }
    ],
    "curriculumOrder": 8,
    "runner": {
      "kind": "function",
      "parameterNames": [
        "digits"
      ]
    }
  },
  {
    "id": "all-paths-from-source-to-target",
    "title": "All Paths From Source to Target",
    "category": "original",
    "section": "Working with paths",
    "difficulty": "Medium",
    "sourceName": "LeetCode",
    "sourceLink": "https://leetcode.com/problems/all-paths-from-source-to-target/",
    "statement": "You are given a **directed acyclic graph** (a graph with one-way edges and no cycles) with `n` nodes labeled from `0` to `n - 1`.\n\nThe graph is given as an adjacency list: `graph[i]` is the list of nodes you can travel to directly from node `i` (an edge points from `i` to each node in `graph[i]`).\n\nFind **every possible path** that starts at node `0` and ends at node `n - 1`, and return them as a list of paths. Each path is the list of nodes it visits, in order. You may return the paths in any order.",
    "examples": [
      {
        "input": "graph = [[1,2],[3],[3],[]]",
        "output": "[[0,1,3],[0,2,3]]",
        "explanation": "From node 0 you can go to node 1 or node 2, and both of those lead to node 3. So there are two paths: 0 -> 1 -> 3 and 0 -> 2 -> 3."
      },
      {
        "input": "graph = [[4,3,1],[3,2,4],[3],[4],[]]",
        "output": "[[0,4],[0,3,4],[0,1,3,4],[0,1,2,3,4],[0,1,4]]",
        "explanation": "There are five different ways to travel from node 0 to node 4."
      },
      {
        "input": "graph = [[1],[]]",
        "output": "[[0,1]]",
        "explanation": "The only path is the single edge from node 0 straight to node 1."
      }
    ],
    "constraints": [
      "n == graph.length",
      "2 <= n <= 15",
      "0 <= graph[i][j] < n",
      "graph[i][j] != i (no self-loops)",
      "All the elements of graph[i] are unique.",
      "The input graph is guaranteed to be a DAG (it has no cycles)."
    ],
    "functionName": "allPathsSourceTarget",
    "solution": "const START_NODE = 0;\n\n// CONTRACT for getPathsFromNodeToTarget(graph, curNode, targetNode):\n//     returns a list of every path from `curNode` to `targetNode`,\n//     where each path is the list of nodes it visits, in order.\nconst getPathsFromNodeToTarget = (graph, curNode, targetNode) => {\n    // Base cases\n    if (curNode === targetNode) return [[curNode]];\n\n    // Process node\n    const allPathsFromNodeToTarget = [];\n\n    // Recurse on neighbors\n    const neighbors = graph[curNode];\n    for (const neighbor of neighbors) {\n        // The recursive leap of faith, one level down: this call has\n        // the SAME contract — it returns every path from `neighbor` to\n        // the target. Trust it, do not trace it. Sticking `curNode` on\n        // the front of each neighbor's guaranteed paths, for every\n        // neighbor, builds every path from `curNode` — exactly this\n        // function's contract, kept.\n        const pathsFromNeighborToTarget = getPathsFromNodeToTarget(\n            graph,\n            neighbor,\n            targetNode,\n        );\n\n        for (const path of pathsFromNeighborToTarget) {\n            const pathFromCurToTarget = [curNode, ...path];\n\n            allPathsFromNodeToTarget.push(pathFromCurToTarget);\n        }\n    }\n\n    return allPathsFromNodeToTarget;\n};\n\nconst allPathsSourceTarget = (graph) => {\n    const targetNode = graph.length - 1;\n\n    // The recursive leap of faith: trust the contract. This call\n    // returns every path from node 0 to the target node. We do not\n    // trace inside; we just return that list.\n    return getPathsFromNodeToTarget(graph, START_NODE, targetNode);\n};\n",
    "tests": [
      {
        "args": [
          [
            [
              1,
              2
            ],
            [
              3
            ],
            [
              3
            ],
            []
          ]
        ],
        "expected": [
          [
            0,
            1,
            3
          ],
          [
            0,
            2,
            3
          ]
        ],
        "unordered": true
      },
      {
        "args": [
          [
            [
              4,
              3,
              1
            ],
            [
              3,
              2,
              4
            ],
            [
              3
            ],
            [
              4
            ],
            []
          ]
        ],
        "expected": [
          [
            0,
            4
          ],
          [
            0,
            3,
            4
          ],
          [
            0,
            1,
            3,
            4
          ],
          [
            0,
            1,
            2,
            3,
            4
          ],
          [
            0,
            1,
            4
          ]
        ],
        "unordered": true
      },
      {
        "args": [
          [
            [
              1
            ],
            []
          ]
        ],
        "expected": [
          [
            0,
            1
          ]
        ],
        "unordered": true
      },
      {
        "args": [
          [
            [
              2
            ],
            [
              3
            ],
            [
              1,
              3
            ],
            []
          ]
        ],
        "expected": [
          [
            0,
            2,
            1,
            3
          ],
          [
            0,
            2,
            3
          ]
        ],
        "unordered": true
      },
      {
        "args": [
          [
            [
              1,
              2,
              3
            ],
            [
              4
            ],
            [
              4
            ],
            [
              5
            ],
            [
              5
            ],
            []
          ]
        ],
        "expected": [
          [
            0,
            1,
            4,
            5
          ],
          [
            0,
            2,
            4,
            5
          ],
          [
            0,
            3,
            5
          ]
        ],
        "unordered": true
      }
    ],
    "curriculumOrder": 11,
    "runner": {
      "kind": "function",
      "parameterNames": [
        "graph"
      ]
    }
  },
  {
    "id": "counting-constellations",
    "title": "Counting Constellations",
    "category": "variant",
    "difficulty": "Easy",
    "statement": "You are studying a photo of the night sky, stored as a grid of numbers. `sky[r][c]` is `1` if there is a star at that spot and `0` if that spot is empty.\n\nAstronomers in your club draw lines between stars that are **next to each other in any of the 8 directions**: up, down, left, right, or any of the 4 diagonals. A **constellation** is a group of stars where you can travel from any star to any other star by repeatedly stepping to a neighboring star (using those 8 directions). A single star with no neighbors is its own constellation.\n\nWrite a function `countConstellations(sky)` that returns the number of constellations in the photo.",
    "examples": [
      {
        "input": "sky = [[1,0,0,1],[0,1,0,0],[0,0,0,0],[1,0,0,1]]",
        "output": "4",
        "explanation": "The stars at (0,0) and (1,1) touch diagonally, so they form ONE constellation together. The stars at (0,3), (3,0), and (3,3) each have no neighbors at all, so each is its own constellation. Total: 4."
      },
      {
        "input": "sky = [[1,1,0],[0,0,1],[0,0,0]]",
        "output": "1",
        "explanation": "(0,0) and (0,1) are side by side. (0,1) and (1,2) touch diagonally. So all three stars are one single constellation."
      }
    ],
    "constraints": [
      "1 <= number of rows, number of columns <= 50",
      "sky[r][c] is either 0 or 1"
    ],
    "functionName": "countConstellations",
    "solution": "const STAR = 1;\n\nconst getPositionString = (row, col) => `${row}, ${col}`;\n\n// Unlike most grid problems, diagonal neighbors count as connected here,\n// so we check all 8 directions instead of the usual 4.\nconst directions = [\n    [0, 1],\n    [1, 0],\n    [0, -1],\n    [-1, 0],\n    [1, 1],\n    [1, -1],\n    [-1, 1],\n    [-1, -1],\n];\n\nconst isInBounds = (grid, row, col) => {\n    const numRows = grid.length;\n    const numCols = grid[0].length;\n\n    const rowInBounds = row >= 0 && row < numRows;\n    const colInBounds = col >= 0 && col < numCols;\n\n    return rowInBounds && colInBounds;\n};\n\n// CONTRACT for markConstellationAsVisited(sky, row, col, visited):\n//     when this call returns, the star at (`row`, `col`) and every\n//     star connected to it through any chain of 8-direction neighbors\n//     is in the visited set. If (`row`, `col`) is not a fresh star,\n//     nothing new goes in.\nconst markConstellationAsVisited = (sky, row, col, visited) => {\n    // Base cases\n    if (!isInBounds(sky, row, col)) return;\n\n    const curPositionString = getPositionString(row, col);\n    if (visited.has(curPositionString)) return;\n\n    if (sky[row][col] !== STAR) return;\n\n    // Process node\n    visited.add(curPositionString);\n\n    // Recurse on potential neighbors\n    for (const direction of directions) {\n        const [rowChange, colChange] = direction;\n\n        const newRow = row + rowChange;\n        const newCol = col + colChange;\n\n        // The recursive leap of faith, one level down: this call has\n        // the SAME contract — when it returns, the neighboring square and\n        // every star connected to it is in the visited set. Trust it, do\n        // not trace it. This function already put (`row`, `col`) into\n        // visited, and each direction's contract covers the rest of the\n        // constellation — together, that is this function's full contract, kept.\n        markConstellationAsVisited(sky, newRow, newCol, visited);\n    }\n};\n\nconst countConstellations = (sky) => {\n    const numRows = sky.length;\n    const numCols = sky[0].length;\n\n    let numberOfConstellations = 0;\n    const visited = new Set();\n\n    for (let row = 0; row < numRows; row++) {\n        for (let col = 0; col < numCols; col++) {\n            const curPositionString = getPositionString(row, col);\n\n            if (visited.has(curPositionString)) continue;\n\n            if (sky[row][col] !== STAR) continue;\n\n            numberOfConstellations++;\n            // The recursive leap of faith: trust the contract. When this\n            // call returns, this star and its whole constellation are in\n            // visited, so the loop can never count this constellation again.\n            // We do not trace inside; we just count it and move on.\n            markConstellationAsVisited(sky, row, col, visited);\n        }\n    }\n\n    return numberOfConstellations;\n};",
    "tests": [
      {
        "args": [
          [
            [
              1,
              0,
              0,
              1
            ],
            [
              0,
              1,
              0,
              0
            ],
            [
              0,
              0,
              0,
              0
            ],
            [
              1,
              0,
              0,
              1
            ]
          ]
        ],
        "expected": 4
      },
      {
        "args": [
          [
            [
              1,
              1,
              0
            ],
            [
              0,
              0,
              1
            ],
            [
              0,
              0,
              0
            ]
          ]
        ],
        "expected": 1
      },
      {
        "args": [
          [
            [
              0,
              0
            ],
            [
              0,
              0
            ]
          ]
        ],
        "expected": 0
      },
      {
        "args": [
          [
            [
              1
            ]
          ]
        ],
        "expected": 1
      },
      {
        "args": [
          [
            [
              1,
              0,
              1
            ],
            [
              0,
              1,
              0
            ],
            [
              1,
              0,
              1
            ]
          ]
        ],
        "expected": 1
      },
      {
        "args": [
          [
            [
              1,
              0,
              1,
              0,
              1
            ]
          ]
        ],
        "expected": 3
      }
    ],
    "runner": {
      "kind": "function",
      "parameterNames": [
        "sky"
      ]
    }
  },
  {
    "id": "one-color-metro-ride",
    "title": "No Transfers, Please",
    "category": "variant",
    "difficulty": "Medium",
    "statement": "A city metro has `n` stations, numbered `0` to `n - 1`. The list `tracks` describes the tracks: `tracks[i] = [u, v]` is a two-way track between stations `u` and `v`, and `colors[i]` is either `\"red\"` or `\"blue\"`, telling you which line that track belongs to.\n\nYou hate transferring between lines. Your whole trip, from start to end, must use tracks of **one single color**: either every track you ride is red, or every track you ride is blue.\n\nReturn `true` if you can travel from station `source` to station `destination` this way, and `false` otherwise. If `source` and `destination` are the same station, return `true`.",
    "examples": [
      {
        "input": "n = 4, tracks = [[0,1],[1,3],[0,2],[2,3]], colors = [\"red\",\"red\",\"blue\",\"red\"], source = 0, destination = 3",
        "output": "true",
        "explanation": "Using only red tracks, you can ride 0 -> 1 -> 3. So the trip works without ever touching a blue track."
      },
      {
        "input": "n = 3, tracks = [[0,1],[1,2]], colors = [\"red\",\"blue\"], source = 0, destination = 2",
        "output": "false",
        "explanation": "Red tracks alone only reach stations 0 and 1. Blue tracks alone leave you stuck at station 0. Reaching station 2 would require mixing colors, which is not allowed."
      }
    ],
    "constraints": [
      "1 <= n <= 100",
      "0 <= tracks.length <= 200",
      "tracks.length == colors.length",
      "0 <= u, v <= n - 1",
      "colors[i] is either \"red\" or \"blue\"",
      "0 <= source, destination <= n - 1"
    ],
    "functionName": "canRideOneColor",
    "solution": "const TRACK_COLORS = ['red', 'blue'];\n\nconst buildGraphForColor = (tracks, colors, targetColor) => {\n    const graph = {};\n\n    for (let trackIndex = 0; trackIndex < tracks.length; trackIndex++) {\n        if (colors[trackIndex] !== targetColor) continue;\n\n        const [stationOne, stationTwo] = tracks[trackIndex];\n\n        const stationOneInGraph = graph.hasOwnProperty(stationOne);\n        const stationTwoInGraph = graph.hasOwnProperty(stationTwo);\n\n        if (!stationOneInGraph) graph[stationOne] = [];\n        if (!stationTwoInGraph) graph[stationTwo] = [];\n\n        graph[stationOne].push(stationTwo);\n        graph[stationTwo].push(stationOne);\n    }\n\n    return graph;\n};\n\n// CONTRACT for canReachStation(graph, curStation, destination, visited):\n//     when this call returns, it returns true if the search can get\n//     from `curStation` to `destination` along this graph's tracks,\n//     and false otherwise. Every station it explores goes into the\n//     visited set, so no station is ever explored twice.\n//     If `curStation` is already in the visited set it returns false —\n//     an earlier call is already exploring from there.\nconst canReachStation = (graph, curStation, destination, visited) => {\n    // Base cases\n    if (curStation === destination) return true;\n\n    if (visited.has(curStation)) return false;\n\n    // Process node\n    visited.add(curStation);\n\n    // Recurse on neighbors\n    const stationInGraph = graph.hasOwnProperty(curStation);\n    if (!stationInGraph) return false;\n\n    const neighbors = graph[curStation];\n\n    for (const neighbor of neighbors) {\n        // The recursive leap of faith, one level down: this call has\n        // the SAME contract — when it returns, it tells us whether\n        // `destination` can be reached from `neighbor`. Trust it, do not\n        // trace it. If any neighbor's answer is true, a path through that\n        // neighbor exists, so returning true keeps this function's\n        // contract; if every answer is false, returning false keeps it too.\n        const reachable = canReachStation(graph, neighbor, destination, visited);\n\n        if (reachable) return true;\n    }\n\n    return false;\n};\n\nconst canRideOneColor = (n, tracks, colors, source, destination) => {\n    if (source === destination) return true;\n\n    // The whole trip must stay on one line, so we try each color as\n    // its own separate graph and check reachability inside it.\n    for (const color of TRACK_COLORS) {\n        const graph = buildGraphForColor(tracks, colors, color);\n        const visited = new Set();\n\n        // The recursive leap of faith: trust the contract. When this\n        // call returns, `reachable` tells us whether `destination` can be\n        // reached from `source` using only this color's tracks. We do not\n        // trace inside; we just use the answer, then try the other color\n        // if needed.\n        const reachable = canReachStation(graph, source, destination, visited);\n\n        if (reachable) return true;\n    }\n\n    return false;\n};",
    "tests": [
      {
        "args": [
          4,
          [
            [
              0,
              1
            ],
            [
              1,
              3
            ],
            [
              0,
              2
            ],
            [
              2,
              3
            ]
          ],
          [
            "red",
            "red",
            "blue",
            "red"
          ],
          0,
          3
        ],
        "expected": true
      },
      {
        "args": [
          3,
          [
            [
              0,
              1
            ],
            [
              1,
              2
            ]
          ],
          [
            "red",
            "blue"
          ],
          0,
          2
        ],
        "expected": false
      },
      {
        "args": [
          1,
          [],
          [],
          0,
          0
        ],
        "expected": true
      },
      {
        "args": [
          3,
          [
            [
              0,
              1
            ],
            [
              1,
              2
            ]
          ],
          [
            "blue",
            "blue"
          ],
          0,
          2
        ],
        "expected": true
      },
      {
        "args": [
          2,
          [],
          [],
          0,
          1
        ],
        "expected": false
      },
      {
        "args": [
          5,
          [
            [
              0,
              4
            ]
          ],
          [
            "blue"
          ],
          4,
          0
        ],
        "expected": true
      }
    ],
    "runner": {
      "kind": "function",
      "parameterNames": [
        "n",
        "tracks",
        "colors",
        "source",
        "destination"
      ]
    }
  },
  {
    "id": "villages-without-wells",
    "title": "Dig New Wells",
    "category": "variant",
    "difficulty": "Medium",
    "statement": "A valley has `n` villages, numbered `0` to `n - 1`. You are given a list `paths`, where each entry `[a, b]` is a two-way footpath between villages `a` and `b`. You are also given a list `wells` of village numbers that already have a water well.\n\nVillagers can fetch water from a well in their own village **or** in any village they can reach by walking along footpaths (through as many villages as needed).\n\nA group of villages that are all reachable from each other is called a **cluster**. If a cluster contains no well at all, the government must dig exactly **one** new well somewhere in that cluster.\n\nWrite a function `countWellsToDig(n, paths, wells)` that returns how many new wells must be dug so that every village can reach water.",
    "examples": [
      {
        "input": "n = 6, paths = [[0,1],[1,2],[3,4]], wells = [1]",
        "output": "2",
        "explanation": "The clusters are {0,1,2}, {3,4}, and {5}. Cluster {0,1,2} contains the well at village 1, so it is fine. Clusters {3,4} and {5} have no well, so each needs one new well. Answer: 2."
      },
      {
        "input": "n = 4, paths = [[0,1],[2,3]], wells = [0,3]",
        "output": "0",
        "explanation": "The clusters are {0,1} and {2,3}. The first contains the well at 0, the second contains the well at 3. Nobody needs a new well."
      }
    ],
    "constraints": [
      "1 <= n <= 100",
      "0 <= paths.length <= 500",
      "paths[i] = [a, b] with 0 <= a, b < n and a != b",
      "0 <= wells.length <= n",
      "All values in wells are distinct village numbers"
    ],
    "functionName": "countWellsToDig",
    "solution": "const buildGraph = (edges) => {\n    const graph = {};\n\n    for (const edge of edges) {\n        const [nodeOne, nodeTwo] = edge;\n\n        const nodeOneInGraph = graph.hasOwnProperty(nodeOne);\n        const nodeTwoInGraph = graph.hasOwnProperty(nodeTwo);\n\n        if (!nodeOneInGraph) graph[nodeOne] = [];\n        if (!nodeTwoInGraph) graph[nodeTwo] = [];\n\n        graph[nodeOne].push(nodeTwo);\n        graph[nodeTwo].push(nodeOne);\n    }\n\n    return graph;\n};\n\n// CONTRACT for clusterContainsWell(graph, village, visited, villagesWithWells):\n//     when this call returns, `village` and every village reachable\n//     from it is in the visited set, and the returned value is true\n//     if any village in that group has a well, false otherwise.\nconst clusterContainsWell = (graph, village, visited, villagesWithWells) => {\n    // Base cases\n    if (visited.has(village)) return false;\n\n    // Process node\n    visited.add(village);\n\n    let foundWell = villagesWithWells.has(village);\n\n    // Recurse on neighbors\n    const villageInGraph = graph.hasOwnProperty(village);\n    if (!villageInGraph) return foundWell;\n\n    const neighbors = graph[village];\n\n    for (const neighbor of neighbors) {\n        // We keep walking even after finding a well so the whole\n        // cluster gets marked visited exactly once.\n        // The recursive leap of faith, one level down: this call has\n        // the SAME contract — when it returns, `neighbor` and everything\n        // reachable from it is in visited, and it reports whether it found\n        // a well there. Trust it, do not trace it. This function already\n        // put `village` into visited and checked it for a well; each\n        // neighbor's guaranteed answer covers the rest of the cluster —\n        // exactly this function's contract, kept.\n        const wellInNeighborArea = clusterContainsWell(\n            graph,\n            neighbor,\n            visited,\n            villagesWithWells,\n        );\n\n        if (wellInNeighborArea) foundWell = true;\n    }\n\n    return foundWell;\n};\n\nconst countWellsToDig = (n, paths, wells) => {\n    const graph = buildGraph(paths);\n    const villagesWithWells = new Set(wells);\n\n    let wellsToDig = 0;\n    const visited = new Set();\n\n    for (let village = 0; village < n; village++) {\n        if (visited.has(village)) continue;\n\n        // The recursive leap of faith: trust the contract. When this\n        // call returns, this entire cluster is in visited — the loop can\n        // never start here again — and `clusterHasWell` tells us if the\n        // cluster already has a well. We do not trace inside; we just use\n        // the answer to decide whether one new well is needed.\n        const clusterHasWell = clusterContainsWell(\n            graph,\n            village,\n            visited,\n            villagesWithWells,\n        );\n\n        if (clusterHasWell) continue;\n\n        wellsToDig++;\n    }\n\n    return wellsToDig;\n};",
    "tests": [
      {
        "args": [
          6,
          [
            [
              0,
              1
            ],
            [
              1,
              2
            ],
            [
              3,
              4
            ]
          ],
          [
            1
          ]
        ],
        "expected": 2
      },
      {
        "args": [
          4,
          [
            [
              0,
              1
            ],
            [
              2,
              3
            ]
          ],
          [
            0,
            3
          ]
        ],
        "expected": 0
      },
      {
        "args": [
          1,
          [],
          []
        ],
        "expected": 1
      },
      {
        "args": [
          5,
          [],
          [
            0,
            1,
            2,
            3,
            4
          ]
        ],
        "expected": 0
      },
      {
        "args": [
          3,
          [
            [
              0,
              1
            ],
            [
              1,
              2
            ]
          ],
          [
            2
          ]
        ],
        "expected": 0
      },
      {
        "args": [
          4,
          [],
          []
        ],
        "expected": 4
      }
    ],
    "runner": {
      "kind": "function",
      "parameterNames": [
        "n",
        "paths",
        "wells"
      ]
    }
  },
  {
    "id": "coins-on-level-k",
    "title": "Coins on Level K",
    "category": "variant",
    "difficulty": "Easy",
    "statement": "A shipping company packs coins inside boxes, and boxes inside bigger boxes. This is written as a **nested array**: each element is either an integer (a coin's value) or another array (a smaller box).\n\nThe **depth** of an element works like this: elements sitting directly in the top-level array are at depth `1`. Every time you open a box and look inside, the depth goes up by `1`. For example, in `[3, [4, [5]]]`, the coin `3` is at depth 1, the coin `4` is at depth 2, and the coin `5` is at depth 3.\n\nCustoms only wants to tax the coins at one specific packing level.\n\nWrite a function `sumAtDepth(items, k)` that returns the **sum of all coin values at exactly depth `k`**. If there are no coins at depth `k`, return `0`.",
    "examples": [
      {
        "input": "items = [[3,2],5,[[4]]], k = 2",
        "output": "5",
        "explanation": "The coins 3 and 2 are at depth 2 (inside one box). The coin 5 is at depth 1 and the coin 4 is at depth 3, so they are ignored. 3 + 2 = 5."
      },
      {
        "input": "items = [1,[4,[6]]], k = 3",
        "output": "6",
        "explanation": "Only the coin 6 sits at depth 3. The coin 1 is at depth 1 and the coin 4 is at depth 2."
      }
    ],
    "constraints": [
      "1 <= total number of integers and arrays <= 1000",
      "Nesting depth is at most 50",
      "Coin values are integers between -100 and 100",
      "1 <= k <= 50"
    ],
    "functionName": "sumAtDepth",
    "solution": "const TOP_LEVEL_DEPTH = 1;\n\n// CONTRACT for sumCoinsAtDepth(boxContents, curDepth, targetDepth):\n//     when this call returns, the returned value equals the sum of\n//     every coin inside `boxContents` (however deeply packed) that\n//     sits at exactly depth `targetDepth`, where the items directly\n//     inside `boxContents` sit at depth `curDepth`.\nconst sumCoinsAtDepth = (boxContents, curDepth, targetDepth) => {\n    // Base case: once we are deeper than the target, every coin\n    // inside is too deep to count, so there is no reason to keep opening boxes.\n    if (curDepth > targetDepth) return 0;\n\n    // Process node\n    let coinSum = 0;\n\n    // Recurse on neighbors\n    for (const item of boxContents) {\n        const isSmallerBox = Array.isArray(item);\n\n        if (isSmallerBox) {\n            // The recursive leap of faith, one level down: this call has\n            // the SAME contract — when it returns, it hands back the sum of\n            // every coin at exactly depth `targetDepth` inside this smaller\n            // box. Trust it, do not trace it. The coins counted at this level\n            // + each smaller box's guaranteed sum = exactly this function's\n            // contract.\n            coinSum += sumCoinsAtDepth(item, curDepth + 1, targetDepth);\n            continue;\n        }\n\n        // The item is a coin. It only counts if it sits at exactly\n        // the depth customs cares about.\n        if (curDepth !== targetDepth) continue;\n\n        coinSum += item;\n    }\n\n    return coinSum;\n};\n\nconst sumAtDepth = (items, k) => {\n    // The recursive leap of faith: trust the contract. When this\n    // call returns, its value is the sum of every coin at exactly\n    // depth `k` in the whole shipment. We do not trace inside; we\n    // just return that value.\n    return sumCoinsAtDepth(items, TOP_LEVEL_DEPTH, k);\n};",
    "tests": [
      {
        "args": [
          [
            [
              3,
              2
            ],
            5,
            [
              [
                4
              ]
            ]
          ],
          2
        ],
        "expected": 5
      },
      {
        "args": [
          [
            1,
            [
              4,
              [
                6
              ]
            ]
          ],
          3
        ],
        "expected": 6
      },
      {
        "args": [
          [
            1,
            [
              4,
              [
                6
              ]
            ]
          ],
          1
        ],
        "expected": 1
      },
      {
        "args": [
          [
            1,
            2,
            3
          ],
          5
        ],
        "expected": 0
      },
      {
        "args": [
          [
            [
              -1,
              [
                2
              ]
            ],
            [
              3
            ]
          ],
          2
        ],
        "expected": 2
      },
      {
        "args": [
          [
            [
              []
            ]
          ],
          3
        ],
        "expected": 0
      }
    ],
    "runner": {
      "kind": "function",
      "parameterNames": [
        "items",
        "k"
      ]
    }
  },
  {
    "id": "museum-vault-keyring",
    "title": "The Night Guard's Keyring",
    "category": "variant",
    "difficulty": "Easy",
    "statement": "You are the night guard at a museum with `n` vaults, numbered `0` to `n - 1`. Vault `i` can only be opened with key number `i`.\n\nYou start your shift holding a small keyring: the list `startKeys` tells you which key numbers you already have. Inside each vault there may be more keys lying around: `vaults[i]` is the list of key numbers found inside vault `i`. The moment you open a vault, you pick up every key inside it and may use those keys right away.\n\nYou can walk between vaults freely and open them in any order, as long as you have the matching key.\n\nReturn the total number of **different** vaults you are able to open.",
    "examples": [
      {
        "input": "vaults = [[1],[2],[],[0]], startKeys = [0]",
        "output": "3",
        "explanation": "You start with key 0, so you open vault 0 and find key 1. With key 1 you open vault 1 and find key 2. With key 2 you open vault 2, which is empty. Key 3 does not exist anywhere, so vault 3 stays shut. You opened vaults 0, 1, and 2, which is 3 vaults."
      },
      {
        "input": "vaults = [[],[0],[],[]], startKeys = [3]",
        "output": "1",
        "explanation": "You start with key 3 and open vault 3, which is empty. Key 0 is locked inside vault 1, but you never find key 1, so you can never get it. Only 1 vault gets opened."
      }
    ],
    "constraints": [
      "n == vaults.length, 1 <= n <= 100",
      "0 <= vaults[i].length <= n",
      "0 <= vaults[i][j] <= n - 1, and all keys inside one vault are different",
      "0 <= startKeys.length <= n, and all keys on the keyring are different"
    ],
    "functionName": "countOpenableVaults",
    "solution": "// CONTRACT for openVault(vaults, vaultNumber, openedVaults):\n//     when this call returns, vault `vaultNumber` and every vault\n//     that can be opened by following the keys found inside it is in\n//     the openedVaults set.\nconst openVault = (vaults, vaultNumber, openedVaults) => {\n    // Base case\n    if (openedVaults.has(vaultNumber)) return;\n\n    // Process node\n    openedVaults.add(vaultNumber);\n\n    // Recurse on neighbors\n    // Every key inside this vault unlocks the vault with the same\n    // number, so keys are the edges of our graph.\n    const keysInside = vaults[vaultNumber];\n\n    for (const key of keysInside) {\n        // The recursive leap of faith, one level down: this call has\n        // the SAME contract — when it returns, vault `key` and every\n        // vault reachable from its keys is in the openedVaults set.\n        // Trust it, do not trace it. This function already put\n        // `vaultNumber` into openedVaults, and each key's contract\n        // covers everything reachable beyond it — together, that is\n        // this function's full contract, kept.\n        openVault(vaults, key, openedVaults);\n    }\n};\n\nconst countOpenableVaults = (vaults, startKeys) => {\n    const openedVaults = new Set();\n\n    for (const key of startKeys) {\n        // The recursive leap of faith: trust the contract. When this\n        // call returns, every vault this starting key can lead to —\n        // directly or through keys picked up along the way — is in\n        // the openedVaults set. We do not trace inside; we just move\n        // on to the next starting key and count the set at the end.\n        openVault(vaults, key, openedVaults);\n    }\n\n    return openedVaults.size;\n};",
    "tests": [
      {
        "args": [
          [
            [
              1
            ],
            [
              2
            ],
            [],
            [
              0
            ]
          ],
          [
            0
          ]
        ],
        "expected": 3
      },
      {
        "args": [
          [
            [],
            [
              0
            ],
            [],
            []
          ],
          [
            3
          ]
        ],
        "expected": 1
      },
      {
        "args": [
          [
            [],
            [],
            []
          ],
          []
        ],
        "expected": 0
      },
      {
        "args": [
          [
            [
              1
            ],
            [
              0
            ]
          ],
          [
            0
          ]
        ],
        "expected": 2
      },
      {
        "args": [
          [
            [],
            [],
            [],
            []
          ],
          [
            0,
            2
          ]
        ],
        "expected": 2
      },
      {
        "args": [
          [
            [
              1,
              2,
              3
            ],
            [],
            [],
            []
          ],
          [
            0
          ]
        ],
        "expected": 4
      }
    ],
    "runner": {
      "kind": "function",
      "parameterNames": [
        "vaults",
        "startKeys"
      ]
    }
  },
  {
    "id": "save-the-date-phone-chain",
    "title": "Save the Date",
    "category": "variant",
    "difficulty": "Easy",
    "statement": "A family of `n` people, numbered `0` to `n - 1`, is planning a reunion. Person `headId` starts spreading the news, so the head already knows on day `0`.\n\nThe news travels along a fixed phone chain shaped like a family tree: `caller[i]` is the person whose job is to call person `i`. For the head, `caller[headId] = -1`, because nobody calls the head. Every other person is called by exactly one person, and the chain never loops.\n\nPeople are a little slow. After person `p` hears the news, they wait `waitDays[p]` days and then call **everyone they are responsible for**, all on that same day. So person `i` hears the news on day `(day caller[i] heard) + waitDays[caller[i]]`.\n\nThe reunion is on day `deadline`. Return how many people know the news on or before day `deadline`. The head counts too.",
    "examples": [
      {
        "input": "n = 6, headId = 0, caller = [-1,0,0,1,1,2], waitDays = [2,3,1,0,0,0], deadline = 4",
        "output": "4",
        "explanation": "Person 0 knows on day 0. Person 0 waits 2 days, so persons 1 and 2 hear on day 2. Person 1 waits 3 days, so persons 3 and 4 hear on day 5. Person 2 waits 1 day, so person 5 hears on day 3. By day 4, persons 0, 1, 2, and 5 know: that is 4 people."
      },
      {
        "input": "n = 3, headId = 2, caller = [2,2,-1], waitDays = [0,0,5], deadline = 3",
        "output": "1",
        "explanation": "Person 2 knows on day 0 but waits 5 days, so persons 0 and 1 only hear on day 5. By day 3, only person 2 knows."
      }
    ],
    "constraints": [
      "1 <= n <= 100",
      "0 <= headId <= n - 1",
      "caller.length == waitDays.length == n",
      "caller[headId] == -1, and every other person is called by exactly one person (the chain forms a tree)",
      "0 <= waitDays[i] <= 100",
      "0 <= deadline <= 10000"
    ],
    "functionName": "countInformedByDeadline",
    "solution": "const NO_CALLER = -1;\nconst STARTING_DAY = 0;\n\nconst buildCallTree = (caller) => {\n    const callTree = {};\n\n    for (let person = 0; person < caller.length; person++) {\n        const personCaller = caller[person];\n\n        if (personCaller === NO_CALLER) continue;\n\n        const callerInTree = callTree.hasOwnProperty(personCaller);\n        if (!callerInTree) callTree[personCaller] = [];\n\n        callTree[personCaller].push(person);\n    }\n\n    return callTree;\n};\n\n// CONTRACT for countInformedInTime(callTree, waitDays, person, dayHeard, deadline):\n//     when this call returns, the returned value is how many people\n//     in `person`'s branch of the call tree (including `person`) hear\n//     the news on or before day `deadline`, given that `person` hears\n//     it on day `dayHeard`.\nconst countInformedInTime = (callTree, waitDays, person, dayHeard, deadline) => {\n    // Base case: wait times are never negative, so if this person is\n    // already past the deadline, everyone further down the chain is too.\n    if (dayHeard > deadline) return 0;\n\n    // Process node\n    let informedCount = 1;\n\n    // Recurse on neighbors\n    const personMakesCalls = callTree.hasOwnProperty(person);\n    if (!personMakesCalls) return informedCount;\n\n    const dayOfCalls = dayHeard + waitDays[person];\n    const listeners = callTree[person];\n\n    for (const listener of listeners) {\n        // The recursive leap of faith, one level down: this call has\n        // the SAME contract — when it returns, it hands back how many\n        // people in `listener`'s branch hear the news by the deadline.\n        // Trust it, do not trace it. The 1 counted for `person` + each\n        // listener's guaranteed count = exactly this function's contract.\n        informedCount += countInformedInTime(\n            callTree,\n            waitDays,\n            listener,\n            dayOfCalls,\n            deadline,\n        );\n    }\n\n    return informedCount;\n};\n\nconst countInformedByDeadline = (n, headId, caller, waitDays, deadline) => {\n    const callTree = buildCallTree(caller);\n\n    // The recursive leap of faith: trust the contract. When this\n    // call returns, its value is how many people in the whole family\n    // hear the news on or before day `deadline`. We do not trace\n    // inside; we just return that number.\n    return countInformedInTime(callTree, waitDays, headId, STARTING_DAY, deadline);\n};",
    "tests": [
      {
        "args": [
          6,
          0,
          [
            -1,
            0,
            0,
            1,
            1,
            2
          ],
          [
            2,
            3,
            1,
            0,
            0,
            0
          ],
          4
        ],
        "expected": 4
      },
      {
        "args": [
          3,
          2,
          [
            2,
            2,
            -1
          ],
          [
            0,
            0,
            5
          ],
          3
        ],
        "expected": 1
      },
      {
        "args": [
          1,
          0,
          [
            -1
          ],
          [
            0
          ],
          0
        ],
        "expected": 1
      },
      {
        "args": [
          6,
          0,
          [
            -1,
            0,
            0,
            1,
            1,
            2
          ],
          [
            2,
            3,
            1,
            0,
            0,
            0
          ],
          100
        ],
        "expected": 6
      },
      {
        "args": [
          4,
          1,
          [
            1,
            -1,
            1,
            1
          ],
          [
            5,
            1,
            5,
            5
          ],
          0
        ],
        "expected": 1
      },
      {
        "args": [
          4,
          0,
          [
            -1,
            0,
            1,
            2
          ],
          [
            1,
            1,
            1,
            1
          ],
          2
        ],
        "expected": 3
      }
    ],
    "runner": {
      "kind": "function",
      "parameterNames": [
        "n",
        "headId",
        "caller",
        "waitDays",
        "deadline"
      ]
    }
  },
  {
    "id": "biggest-study-group",
    "title": "The Biggest Study Group",
    "category": "variant",
    "difficulty": "Medium",
    "statement": "There are `n` students in a coding bootcamp, numbered `0` to `n - 1`. You are given an `n x n` matrix `worked`, where `worked[i][j] = 1` means student `i` and student `j` did a project together, and `worked[i][j] = 0` means they did not. The matrix is symmetric (`worked[i][j] = worked[j][i]`), and `worked[i][i]` is always `1`.\n\nStudents form **study groups** through chains of teammates: if `A` worked with `B`, and `B` worked with `C`, then `A`, `B`, and `C` all end up in the same study group — even if `A` and `C` never worked together directly.\n\nWrite a function `largestStudyGroup(worked)` that returns the number of students in the **largest** study group.",
    "examples": [
      {
        "input": "worked = [[1,1,0],[1,1,0],[0,0,1]]",
        "output": "2",
        "explanation": "Students 0 and 1 worked together, forming a group of 2. Student 2 is alone in a group of 1. The largest group has 2 students."
      },
      {
        "input": "worked = [[1,1,0,0],[1,1,1,0],[0,1,1,0],[0,0,0,1]]",
        "output": "3",
        "explanation": "Student 0 worked with 1, and 1 worked with 2, so {0, 1, 2} form one group of 3. Student 3 is alone. The largest group has 3 students."
      }
    ],
    "constraints": [
      "1 <= n <= 100",
      "worked[i][j] is 0 or 1",
      "worked[i][i] = 1",
      "worked[i][j] = worked[j][i]"
    ],
    "functionName": "largestStudyGroup",
    "solution": "const WORKED_TOGETHER = 1;\n\n// CONTRACT for getStudyGroupSize(worked, student, visited):\n//     when this call returns, `student` and every student connected\n//     to them through chains of teammates is in the visited set, and\n//     the returned value is how many students this call put into\n//     visited (the whole group's size when we start on a fresh student).\nconst getStudyGroupSize = (worked, student, visited) => {\n    // Base case\n    if (visited.has(student)) return 0;\n\n    // Process node\n    visited.add(student);\n    let groupSize = 1;\n\n    // Recurse on neighbors\n    for (let teammate = 0; teammate < worked.length; teammate++) {\n        const isTeammate = worked[student][teammate] === WORKED_TOGETHER;\n\n        if (!isTeammate) continue;\n\n        // Every student we reach through a chain of teammates joins\n        // this group, so we add their whole sub-count to our size.\n        // The recursive leap of faith, one level down: this call has\n        // the SAME contract — when it returns, `teammate` and everyone\n        // reachable from them is in visited, and it hands back how many\n        // students it put there. Trust it, do not trace it. The 1 for\n        // `student` + each teammate call's guaranteed count = exactly\n        // this function's contract.\n        groupSize += getStudyGroupSize(worked, teammate, visited);\n    }\n\n    return groupSize;\n};\n\nconst largestStudyGroup = (worked) => {\n    const numStudents = worked.length;\n\n    let largestGroupSize = 0;\n    const visited = new Set();\n\n    for (let student = 0; student < numStudents; student++) {\n        if (visited.has(student)) continue;\n\n        // The recursive leap of faith: trust the contract. When this\n        // call returns, this whole study group is in visited — the loop\n        // can never count it again — and `groupSize` is the number of\n        // students in it. We do not trace inside; we just compare it to\n        // the biggest size seen so far.\n        const groupSize = getStudyGroupSize(worked, student, visited);\n\n        largestGroupSize = Math.max(largestGroupSize, groupSize);\n    }\n\n    return largestGroupSize;\n};",
    "tests": [
      {
        "args": [
          [
            [
              1,
              1,
              0
            ],
            [
              1,
              1,
              0
            ],
            [
              0,
              0,
              1
            ]
          ]
        ],
        "expected": 2
      },
      {
        "args": [
          [
            [
              1,
              1,
              0,
              0
            ],
            [
              1,
              1,
              1,
              0
            ],
            [
              0,
              1,
              1,
              0
            ],
            [
              0,
              0,
              0,
              1
            ]
          ]
        ],
        "expected": 3
      },
      {
        "args": [
          [
            [
              1
            ]
          ]
        ],
        "expected": 1
      },
      {
        "args": [
          [
            [
              1,
              0,
              0
            ],
            [
              0,
              1,
              0
            ],
            [
              0,
              0,
              1
            ]
          ]
        ],
        "expected": 1
      },
      {
        "args": [
          [
            [
              1,
              1,
              1
            ],
            [
              1,
              1,
              1
            ],
            [
              1,
              1,
              1
            ]
          ]
        ],
        "expected": 3
      },
      {
        "args": [
          [
            [
              1,
              0,
              1,
              0
            ],
            [
              0,
              1,
              0,
              1
            ],
            [
              1,
              0,
              1,
              0
            ],
            [
              0,
              1,
              0,
              1
            ]
          ]
        ],
        "expected": 2
      }
    ],
    "runner": {
      "kind": "function",
      "parameterNames": [
        "worked"
      ]
    }
  },
  {
    "id": "longest-freight-train",
    "title": "Longest Freight Train",
    "category": "variant",
    "difficulty": "Easy",
    "statement": "A rail yard is shown as a grid. `yard[r][c]` is `\"T\"` if a train car sits on that square and `\".\"` if the square is empty track.\n\nEach **train** is a straight line of one or more cars, laid out either **horizontally** (all in one row) or **vertically** (all in one column), and always exactly one square wide. You are guaranteed the yard is valid: **no two different trains touch each other**, not even at a corner — there is always at least one empty square between them.\n\nWrite a function `longestTrain(yard)` that returns the number of cars in the **longest** train. If the yard has no train cars at all, return `0`.",
    "examples": [
      {
        "input": "yard = [[\"T\",\"T\",\"T\",\".\"],[\".\",\".\",\".\",\".\"],[\"T\",\".\",\".\",\"T\"],[\"T\",\".\",\".\",\".\"]]",
        "output": "3",
        "explanation": "There are three trains: a horizontal one with 3 cars in the top row, a vertical one with 2 cars on the left, and a single 1-car train at (2,3). The longest has 3 cars."
      },
      {
        "input": "yard = [[\"T\",\".\"],[\".\",\".\"],[\"T\",\".\"]]",
        "output": "1",
        "explanation": "There are two separate trains, each with just 1 car (they do not touch, so they cannot be one train). The longest has 1 car."
      }
    ],
    "constraints": [
      "1 <= number of rows, number of columns <= 50",
      "yard[r][c] is \"T\" or \".\"",
      "Trains are straight horizontal or vertical lines, one square wide",
      "No two trains are adjacent, even diagonally"
    ],
    "functionName": "longestTrain",
    "solution": "const TRAIN_CAR = 'T';\n\nconst getPositionString = (row, col) => `${row}, ${col}`;\nconst directions = [\n    [0, 1],\n    [1, 0],\n    [0, -1],\n    [-1, 0],\n];\n\nconst isInBounds = (grid, row, col) => {\n    const numRows = grid.length;\n    const numCols = grid[0].length;\n\n    const rowInBounds = row >= 0 && row < numRows;\n    const colInBounds = col >= 0 && col < numCols;\n\n    return rowInBounds && colInBounds;\n};\n\n// CONTRACT for getTrainLength(yard, row, col, visited):\n//     when this call returns, every train car connected to\n//     (`row`, `col`) is in the visited set, and the returned value is\n//     how many cars this call put there. If (`row`, `col`) is not a\n//     fresh train car, it returns 0 and nothing new goes in.\nconst getTrainLength = (yard, row, col, visited) => {\n    // Base cases\n    if (!isInBounds(yard, row, col)) return 0;\n\n    const curPositionString = getPositionString(row, col);\n    if (visited.has(curPositionString)) return 0;\n\n    if (yard[row][col] !== TRAIN_CAR) return 0;\n\n    // Process node\n    visited.add(curPositionString);\n    let trainLength = 1;\n\n    // Recurse on potential neighbors\n    // Because trains never touch each other, everything connected\n    // to this car belongs to the same train, so a plain flood fill\n    // counts exactly one train's cars.\n    for (const direction of directions) {\n        const [rowChange, colChange] = direction;\n\n        const newRow = row + rowChange;\n        const newCol = col + colChange;\n\n        // The recursive leap of faith, one level down: this call has\n        // the SAME contract — when it returns, every car connected to the\n        // neighboring square is in visited, and it hands back how many it\n        // added. Trust it, do not trace it. The 1 for this car + each\n        // direction's guaranteed count = exactly this function's contract.\n        trainLength += getTrainLength(yard, newRow, newCol, visited);\n    }\n\n    return trainLength;\n};\n\nconst longestTrain = (yard) => {\n    const numRows = yard.length;\n    const numCols = yard[0].length;\n\n    let longestTrainLength = 0;\n    const visited = new Set();\n\n    for (let row = 0; row < numRows; row++) {\n        for (let col = 0; col < numCols; col++) {\n            const curPositionString = getPositionString(row, col);\n\n            if (visited.has(curPositionString)) continue;\n\n            if (yard[row][col] !== TRAIN_CAR) continue;\n\n            // The recursive leap of faith: trust the contract. When this\n            // call returns, this whole train is in visited — the loop can\n            // never count it again — and `trainLength` is its number of cars.\n            // We do not trace inside; we just compare it to the longest so far.\n            const trainLength = getTrainLength(yard, row, col, visited);\n\n            longestTrainLength = Math.max(longestTrainLength, trainLength);\n        }\n    }\n\n    return longestTrainLength;\n};",
    "tests": [
      {
        "args": [
          [
            [
              "T",
              "T",
              "T",
              "."
            ],
            [
              ".",
              ".",
              ".",
              "."
            ],
            [
              "T",
              ".",
              ".",
              "T"
            ],
            [
              "T",
              ".",
              ".",
              "."
            ]
          ]
        ],
        "expected": 3
      },
      {
        "args": [
          [
            [
              "T",
              "."
            ],
            [
              ".",
              "."
            ],
            [
              "T",
              "."
            ]
          ]
        ],
        "expected": 1
      },
      {
        "args": [
          [
            [
              ".",
              "."
            ],
            [
              ".",
              "."
            ]
          ]
        ],
        "expected": 0
      },
      {
        "args": [
          [
            [
              "T"
            ],
            [
              "T"
            ],
            [
              "T"
            ],
            [
              "T"
            ]
          ]
        ],
        "expected": 4
      },
      {
        "args": [
          [
            [
              "T",
              "T",
              "T",
              "T",
              "T"
            ]
          ]
        ],
        "expected": 5
      }
    ],
    "runner": {
      "kind": "function",
      "parameterNames": [
        "yard"
      ]
    }
  },
  {
    "id": "kth-song-in-playlist",
    "title": "The K-th Song",
    "category": "variant",
    "difficulty": "Easy",
    "statement": "Your music app stores a playlist as a **nested array**. Each element is either an integer (a song ID) or another array (a folder that contains more songs and folders). Folders can be nested inside folders, and some folders may be empty.\n\nWhen you press play, the app plays the songs in the order you would read them left to right, diving into each folder the moment it reaches it. For example, `[[1,2],[3,[4,5]]]` plays in the order `1, 2, 3, 4, 5`.\n\nWrite a function `kthSong(playlist, k)` that returns the ID of the `k`-th song played (`k` is 1-indexed, so `k = 1` means the very first song). If the playlist contains fewer than `k` songs in total, return `-1`.",
    "examples": [
      {
        "input": "playlist = [[1,2],[3,[4,5]]], k = 4",
        "output": "4",
        "explanation": "The play order is 1, 2, 3, 4, 5. The 4th song played has ID 4."
      },
      {
        "input": "playlist = [7,[[]],[8,[9]]], k = 5",
        "output": "-1",
        "explanation": "The empty folder contributes nothing, so the play order is just 7, 8, 9 — only 3 songs. There is no 5th song, so we return -1."
      }
    ],
    "constraints": [
      "1 <= total number of integers and arrays <= 1000",
      "Nesting depth is at most 50",
      "Song IDs are integers between 0 and 100000",
      "1 <= k <= 1000"
    ],
    "functionName": "kthSong",
    "solution": "const NOT_FOUND = -1;\n\n// CONTRACT for flattenPlaylist(nestedPlaylist, flatSongIds):\n//     when this call returns, every song id inside `nestedPlaylist` —\n//     including songs buried in folders within folders — has been\n//     appended to `flatSongIds`, in exact play order.\nconst flattenPlaylist = (nestedPlaylist, flatSongIds) => {\n    for (const element of nestedPlaylist) {\n        // Base case: a plain integer is a song, so record it in play order.\n        if (typeof element === 'number') {\n            flatSongIds.push(element);\n            continue;\n        }\n\n        // Recurse on neighbors: an array is a folder, so dive inside it\n        // the moment we reach it (this matches the play order).\n        // The recursive leap of faith, one level down: this call has\n        // the SAME contract — when it returns, every song inside this\n        // folder has been appended to `flatSongIds` in play order. Trust\n        // it, do not trace it. Songs recorded directly here + each\n        // folder's guaranteed songs, all in the order we meet them —\n        // exactly this function's contract, kept.\n        flattenPlaylist(element, flatSongIds);\n    }\n};\n\nconst kthSong = (playlist, k) => {\n    const flatSongIds = [];\n\n    // The recursive leap of faith: trust the contract. When this\n    // call returns, `flatSongIds` holds every song in the whole\n    // playlist in play order. We do not trace inside; we just read\n    // off the k-th entry.\n    flattenPlaylist(playlist, flatSongIds);\n\n    // Empty folders contribute nothing, so the playlist can hold\n    // fewer than k songs.\n    if (k > flatSongIds.length) return NOT_FOUND;\n\n    // k is 1-indexed, so the k-th song lives at index k - 1.\n    return flatSongIds[k - 1];\n};",
    "tests": [
      {
        "args": [
          [
            [
              1,
              2
            ],
            [
              3,
              [
                4,
                5
              ]
            ]
          ],
          4
        ],
        "expected": 4
      },
      {
        "args": [
          [
            7,
            [
              []
            ],
            [
              8,
              [
                9
              ]
            ]
          ],
          5
        ],
        "expected": -1
      },
      {
        "args": [
          [
            [
              [
                42
              ]
            ]
          ],
          1
        ],
        "expected": 42
      },
      {
        "args": [
          [
            10,
            20,
            30
          ],
          3
        ],
        "expected": 30
      },
      {
        "args": [
          [
            [
              []
            ],
            [
              []
            ]
          ],
          1
        ],
        "expected": -1
      }
    ],
    "runner": {
      "kind": "function",
      "parameterNames": [
        "playlist",
        "k"
      ]
    }
  },
  {
    "id": "shut-the-garden-valve",
    "title": "Shut the Valve",
    "category": "variant",
    "difficulty": "Easy",
    "statement": "A garden watering system has several sprinklers, described by three lists of the same length. `ids[i]` is the ID of a sprinkler, `feeds[i]` is the ID of the sprinkler that passes water along to it, and `liters[i]` is how many liters of water sprinkler `ids[i]` sprays per hour. A sprinkler with `feeds[i] = 0` gets its water straight from the main line. Every other sprinkler receives water through exactly one other sprinkler, and the piping never loops, so it forms a tree. All IDs are unique positive numbers.\n\nIf you shut off sprinkler `shutId`, it stops spraying, and so does every sprinkler that receives its water through it (directly or through a chain of other sprinklers).\n\nReturn the total number of liters per hour you save by shutting off sprinkler `shutId`.",
    "examples": [
      {
        "input": "ids = [1,2,3,4], feeds = [0,1,1,2], liters = [5,10,20,40], shutId = 2",
        "output": "50",
        "explanation": "Sprinkler 2 feeds sprinkler 4. Shutting 2 stops sprinklers 2 and 4, saving 10 + 40 = 50 liters per hour."
      },
      {
        "input": "ids = [1,2,3,4], feeds = [0,1,1,2], liters = [5,10,20,40], shutId = 1",
        "output": "75",
        "explanation": "Sprinkler 1 feeds 2 and 3, and 2 feeds 4, so shutting 1 stops everything: 5 + 10 + 20 + 40 = 75 liters per hour."
      }
    ],
    "constraints": [
      "1 <= ids.length <= 100",
      "ids.length == feeds.length == liters.length",
      "All IDs are unique integers between 1 and 10000",
      "1 <= liters[i] <= 1000",
      "The piping forms a tree, and shutId is guaranteed to be one of the IDs in ids"
    ],
    "functionName": "litersSaved",
    "solution": "const buildChildrenGraph = (ids, feeds) => {\n    const childrenGraph = {};\n\n    for (let index = 0; index < ids.length; index++) {\n        const sprinklerId = ids[index];\n        const feederId = feeds[index];\n\n        const feederInGraph = childrenGraph.hasOwnProperty(feederId);\n        if (!feederInGraph) childrenGraph[feederId] = [];\n\n        childrenGraph[feederId].push(sprinklerId);\n    }\n\n    return childrenGraph;\n};\n\n// CONTRACT for sumSubtreeLiters(childrenGraph, litersById, sprinklerId):\n//     when this call returns, the returned value equals the liters\n//     used by `sprinklerId` plus the liters used by every sprinkler\n//     fed through it, all the way down.\nconst sumSubtreeLiters = (childrenGraph, litersById, sprinklerId) => {\n    // Base case is automatic: a sprinkler that feeds no other\n    // sprinklers has no children to recurse on.\n\n    // Process node\n    let totalLiters = litersById[sprinklerId];\n\n    // Recurse on neighbors\n    const sprinklerInGraph = childrenGraph.hasOwnProperty(sprinklerId);\n    if (!sprinklerInGraph) return totalLiters;\n\n    const childIds = childrenGraph[sprinklerId];\n    for (const childId of childIds) {\n        // The recursive leap of faith, one level down: this call has\n        // the SAME contract — when it returns, it hands back the total\n        // liters for `childId` and everything fed through it. Trust it,\n        // do not trace it. This sprinkler's own liters + each child's\n        // guaranteed total = exactly this function's contract.\n        totalLiters += sumSubtreeLiters(childrenGraph, litersById, childId);\n    }\n\n    return totalLiters;\n};\n\nconst litersSaved = (ids, feeds, liters, shutId) => {\n    // The piping is a tree, so shutting one sprinkler cuts off exactly\n    // the subtree rooted at it.\n    const childrenGraph = buildChildrenGraph(ids, feeds);\n\n    const litersById = {};\n    for (let index = 0; index < ids.length; index++) {\n        litersById[ids[index]] = liters[index];\n    }\n\n    // The recursive leap of faith: trust the contract. When this\n    // call returns, its value is the total liters used by `shutId`\n    // and every sprinkler fed through it. We do not trace inside; we\n    // just return that total.\n    return sumSubtreeLiters(childrenGraph, litersById, shutId);\n};",
    "tests": [
      {
        "args": [
          [
            1,
            2,
            3,
            4
          ],
          [
            0,
            1,
            1,
            2
          ],
          [
            5,
            10,
            20,
            40
          ],
          2
        ],
        "expected": 50
      },
      {
        "args": [
          [
            1,
            2,
            3,
            4
          ],
          [
            0,
            1,
            1,
            2
          ],
          [
            5,
            10,
            20,
            40
          ],
          1
        ],
        "expected": 75
      },
      {
        "args": [
          [
            1,
            2,
            3,
            4
          ],
          [
            0,
            1,
            1,
            2
          ],
          [
            5,
            10,
            20,
            40
          ],
          3
        ],
        "expected": 20
      },
      {
        "args": [
          [
            1,
            2,
            3,
            4
          ],
          [
            0,
            1,
            1,
            2
          ],
          [
            5,
            10,
            20,
            40
          ],
          4
        ],
        "expected": 40
      },
      {
        "args": [
          [
            9
          ],
          [
            0
          ],
          [
            7
          ],
          9
        ],
        "expected": 7
      }
    ],
    "runner": {
      "kind": "function",
      "parameterNames": [
        "ids",
        "feeds",
        "liters",
        "shutId"
      ]
    }
  },
  {
    "id": "count-routes-to-summit",
    "title": "Routes to the Summit",
    "category": "variant",
    "difficulty": "Medium",
    "statement": "A mountain has `n` camps, numbered `0` to `n - 1`. Camp `0` is base camp and camp `n - 1` is the summit.\n\nThe trails between camps are one-way and always lead uphill: `graph[i]` is the list of camps you can walk to directly from camp `i`. Because every trail goes uphill, you can never walk in a circle back to a camp you already visited.\n\nTwo routes are different if the sequence of camps they visit is different.\n\nReturn the number of different routes from base camp `0` to the summit `n - 1`.",
    "examples": [
      {
        "input": "graph = [[1,2],[3],[3],[]]",
        "output": "2",
        "explanation": "The routes are 0 -> 1 -> 3 and 0 -> 2 -> 3. That makes 2 routes."
      },
      {
        "input": "graph = [[1,2,3],[3],[3],[]]",
        "output": "3",
        "explanation": "The routes are 0 -> 1 -> 3, 0 -> 2 -> 3, and the direct trail 0 -> 3. That makes 3 routes."
      }
    ],
    "constraints": [
      "n == graph.length, 2 <= n <= 10",
      "0 <= graph[i].length <= n - 1",
      "graph[i] never contains i, and all values in graph[i] are different",
      "The trails never form a cycle (they always lead uphill)"
    ],
    "functionName": "countSummitRoutes",
    "solution": "const BASE_CAMP = 0;\n\n// CONTRACT for countRoutesFromCamp(graph, curCamp, summitCamp):\n//     when this call returns, the returned value equals the number of\n//     different trail routes that lead from `curCamp` all the way to\n//     `summitCamp`.\nconst countRoutesFromCamp = (graph, curCamp, summitCamp) => {\n    // Base case: reaching the summit completes exactly one route.\n    if (curCamp === summitCamp) return 1;\n\n    // Process node\n    let routeCount = 0;\n\n    // Recurse on neighbors\n    const neighborCamps = graph[curCamp];\n    for (const neighborCamp of neighborCamps) {\n        // The recursive leap of faith, one level down: this call has\n        // the SAME contract — when it returns, it hands back the number\n        // of routes from `neighborCamp` to the summit. Trust it, do not\n        // trace it. Every route out of `curCamp` starts by stepping to\n        // some neighbor, so adding up each neighbor's guaranteed count\n        // gives exactly this function's contract.\n        routeCount += countRoutesFromCamp(graph, neighborCamp, summitCamp);\n    }\n\n    return routeCount;\n};\n\nconst countSummitRoutes = (graph) => {\n    const summitCamp = graph.length - 1;\n\n    // Every trail leads uphill, so the graph has no cycles and we\n    // never need a visited set.\n    // The recursive leap of faith: trust the contract. When this\n    // call returns, its value is the number of routes from base camp\n    // to the summit. We do not trace inside; we just return it.\n    return countRoutesFromCamp(graph, BASE_CAMP, summitCamp);\n};",
    "tests": [
      {
        "args": [
          [
            [
              1,
              2
            ],
            [
              3
            ],
            [
              3
            ],
            []
          ]
        ],
        "expected": 2
      },
      {
        "args": [
          [
            [
              1,
              2,
              3
            ],
            [
              3
            ],
            [
              3
            ],
            []
          ]
        ],
        "expected": 3
      },
      {
        "args": [
          [
            [
              1
            ],
            [],
            []
          ]
        ],
        "expected": 0
      },
      {
        "args": [
          [
            [
              1,
              2
            ],
            [
              2,
              3
            ],
            [
              3
            ],
            []
          ]
        ],
        "expected": 3
      },
      {
        "args": [
          [
            [
              1
            ],
            []
          ]
        ],
        "expected": 1
      }
    ],
    "runner": {
      "kind": "function",
      "parameterNames": [
        "graph"
      ]
    }
  },
  {
    "id": "package-to-the-outpost",
    "title": "Package to the Outpost",
    "category": "variant",
    "difficulty": "Easy",
    "statement": "A delivery company has `n` warehouses, numbered `0` to `n - 1`, connected by two-way roads. `roads[i] = [a, b, hours]` means there is a road between warehouse `a` and warehouse `b` that takes `hours` hours to drive.\n\nThere are exactly `n - 1` roads and every warehouse can be reached from every other one. That means there are no shortcut loops: between any two warehouses there is exactly **one** possible route.\n\nA truck starts at warehouse `hq` and drives to warehouse `target` along that one route. Return the total number of hours the drive takes. If `hq` and `target` are the same warehouse, return `0`.",
    "examples": [
      {
        "input": "n = 5, roads = [[0,1,4],[1,2,3],[0,3,2],[3,4,7]], hq = 0, target = 4",
        "output": "9",
        "explanation": "The only route from 0 to 4 is 0 -> 3 -> 4, which takes 2 + 7 = 9 hours."
      },
      {
        "input": "n = 3, roads = [[1,0,5],[1,2,1]], hq = 2, target = 0",
        "output": "6",
        "explanation": "The only route from 2 to 0 is 2 -> 1 -> 0, which takes 1 + 5 = 6 hours."
      }
    ],
    "constraints": [
      "1 <= n <= 100",
      "roads.length == n - 1, and every warehouse is reachable from every other (the roads form a tree)",
      "0 <= a, b <= n - 1",
      "1 <= hours <= 100",
      "0 <= hq, target <= n - 1"
    ],
    "functionName": "deliveryHours",
    "solution": "const buildWeightedGraph = (roads) => {\n    const graph = {};\n\n    for (const road of roads) {\n        const [warehouseOne, warehouseTwo, hours] = road;\n\n        const warehouseOneInGraph = graph.hasOwnProperty(warehouseOne);\n        const warehouseTwoInGraph = graph.hasOwnProperty(warehouseTwo);\n\n        if (!warehouseOneInGraph) graph[warehouseOne] = [];\n        if (!warehouseTwoInGraph) graph[warehouseTwo] = [];\n\n        // Roads are two-way, so add each road in both directions.\n        graph[warehouseOne].push([warehouseTwo, hours]);\n        graph[warehouseTwo].push([warehouseOne, hours]);\n    }\n\n    return graph;\n};\n\n// CONTRACT for recordArrivalHours(graph, warehouse, hoursSoFar, bestKnownHours):\n//     when this call returns, `bestKnownHours` has an entry for\n//     `warehouse` and for every warehouse reachable from it, holding\n//     the fewest driving hours needed to arrive there.\nconst recordArrivalHours = (graph, warehouse, hoursSoFar, bestKnownHours) => {\n    // Base case: if we already reached this warehouse at least as fast,\n    // this route cannot improve anything (this also stops us from\n    // driving back and forth forever).\n    const warehouseHasBestTime = bestKnownHours.hasOwnProperty(warehouse);\n    if (warehouseHasBestTime && bestKnownHours[warehouse] <= hoursSoFar) return;\n\n    // Process node\n    bestKnownHours[warehouse] = hoursSoFar;\n\n    // Recurse on neighbors\n    const warehouseInGraph = graph.hasOwnProperty(warehouse);\n    if (!warehouseInGraph) return;\n\n    const neighborRoads = graph[warehouse];\n    for (const neighborRoad of neighborRoads) {\n        const [neighborWarehouse, roadHours] = neighborRoad;\n\n        // The recursive leap of faith, one level down: this call has\n        // the SAME contract — when it returns, `bestKnownHours` has the\n        // fewest hours for `neighborWarehouse` and everything reachable\n        // beyond it. Trust it, do not trace it. This function already\n        // recorded `warehouse`'s time, and each neighbor's contract covers\n        // the warehouses past it — together, that is this function's full\n        // contract, kept.\n        recordArrivalHours(\n            graph,\n            neighborWarehouse,\n            hoursSoFar + roadHours,\n            bestKnownHours,\n        );\n    }\n};\n\nconst deliveryHours = (n, roads, hq, target) => {\n    const graph = buildWeightedGraph(roads);\n\n    // Track the best-known driving time from hq to every warehouse,\n    // then read off the answer for the target. The roads form a tree,\n    // so the one route the DFS finds is THE route.\n    const bestKnownHours = {};\n    // The recursive leap of faith: trust the contract. When this\n    // call returns, `bestKnownHours` holds the driving time from `hq`\n    // to every reachable warehouse. We do not trace inside; we just\n    // read off the entry for `target`.\n    recordArrivalHours(graph, hq, 0, bestKnownHours);\n\n    return bestKnownHours[target];\n};",
    "tests": [
      {
        "args": [
          5,
          [
            [
              0,
              1,
              4
            ],
            [
              1,
              2,
              3
            ],
            [
              0,
              3,
              2
            ],
            [
              3,
              4,
              7
            ]
          ],
          0,
          4
        ],
        "expected": 9
      },
      {
        "args": [
          3,
          [
            [
              1,
              0,
              5
            ],
            [
              1,
              2,
              1
            ]
          ],
          2,
          0
        ],
        "expected": 6
      },
      {
        "args": [
          4,
          [
            [
              0,
              1,
              1
            ],
            [
              1,
              2,
              1
            ],
            [
              2,
              3,
              1
            ]
          ],
          2,
          2
        ],
        "expected": 0
      },
      {
        "args": [
          1,
          [],
          0,
          0
        ],
        "expected": 0
      },
      {
        "args": [
          4,
          [
            [
              0,
              1,
              2
            ],
            [
              1,
              2,
              3
            ],
            [
              2,
              3,
              4
            ]
          ],
          0,
          3
        ],
        "expected": 9
      }
    ],
    "runner": {
      "kind": "function",
      "parameterNames": [
        "n",
        "roads",
        "hq",
        "target"
      ]
    }
  },
  {
    "id": "gold-and-silver-lights",
    "title": "Gold and Silver Lights",
    "category": "variant",
    "difficulty": "Easy",
    "statement": "You are decorating with a set of `n` connected light bulbs, numbered `0` to `n - 1`. The list `wires` contains pairs `[a, b]` meaning bulbs `a` and `b` are joined by a wire. There are exactly `n - 1` wires and every bulb is connected to the rest, so the wiring forms a tree: there is exactly one way to travel between any two bulbs, and there are no loops.\n\nYou will paint every bulb either **gold** or **silver**, following two rules:\n\n1. Bulb `0` must be gold.\n2. Any two bulbs joined by a wire must be different colors.\n\nBecause the wiring is a tree, there is exactly one way to paint everything. Return how many bulbs end up **gold**.",
    "examples": [
      {
        "input": "n = 4, wires = [[0,1],[0,2],[1,3]]",
        "output": "2",
        "explanation": "Bulb 0 is gold, so bulbs 1 and 2 must be silver. Bulb 3 is wired to silver bulb 1, so bulb 3 is gold. Gold bulbs: 0 and 3, which is 2."
      },
      {
        "input": "n = 5, wires = [[0,1],[1,2],[2,3],[3,4]]",
        "output": "3",
        "explanation": "The bulbs form a chain, so the colors alternate: gold, silver, gold, silver, gold. Bulbs 0, 2, and 4 are gold, which is 3."
      }
    ],
    "constraints": [
      "1 <= n <= 100",
      "wires.length == n - 1",
      "0 <= a, b <= n - 1",
      "The wires connect all bulbs and form a tree (no loops)"
    ],
    "functionName": "countGoldBulbs",
    "solution": "const ROOT_BULB = 0;\n\nconst buildGraph = (edges) => {\n    const graph = {};\n\n    for (const edge of edges) {\n        const [nodeOne, nodeTwo] = edge;\n\n        const nodeOneInGraph = graph.hasOwnProperty(nodeOne);\n        const nodeTwoInGraph = graph.hasOwnProperty(nodeTwo);\n\n        if (!nodeOneInGraph) graph[nodeOne] = [];\n        if (!nodeTwoInGraph) graph[nodeTwo] = [];\n\n        graph[nodeOne].push(nodeTwo);\n        graph[nodeTwo].push(nodeOne);\n    }\n\n    return graph;\n};\n\n// CONTRACT for countGoldFromBulb(graph, bulb, isGold, visited):\n//     when this call returns, `bulb` and every bulb reachable from it\n//     is in the visited set, and the returned value is how many of\n//     the bulbs this call put into visited are gold (with `bulb`\n//     itself being gold exactly when `isGold` is true).\nconst countGoldFromBulb = (graph, bulb, isGold, visited) => {\n    // Base case\n    if (visited.has(bulb)) return 0;\n\n    // Process node\n    visited.add(bulb);\n\n    // Neighbors must alternate colors, so a bulb's color depends only\n    // on how many wires away from bulb 0 it is: even = gold, odd = silver.\n    let goldCount = isGold ? 1 : 0;\n\n    // Recurse on neighbors\n    const bulbInGraph = graph.hasOwnProperty(bulb);\n    if (!bulbInGraph) return goldCount;\n\n    const neighbors = graph[bulb];\n    for (const neighbor of neighbors) {\n        // The recursive leap of faith, one level down: this call has\n        // the SAME contract — when it returns, `neighbor` and everything\n        // reachable from it is in visited, and it hands back the number\n        // of gold bulbs it put there (the neighbor's color is the\n        // opposite of ours). Trust it, do not trace it. This bulb's own\n        // 1 or 0 + each neighbor call's guaranteed count = exactly this\n        // function's contract.\n        goldCount += countGoldFromBulb(graph, neighbor, !isGold, visited);\n    }\n\n    return goldCount;\n};\n\nconst countGoldBulbs = (n, wires) => {\n    const graph = buildGraph(wires);\n    const visited = new Set();\n\n    // The recursive leap of faith: trust the contract. When this\n    // call returns, its value is the total number of gold bulbs in\n    // the whole string of lights (bulb 0 is gold). We do not trace\n    // inside; we just return that number.\n    return countGoldFromBulb(graph, ROOT_BULB, true, visited);\n};",
    "tests": [
      {
        "args": [
          4,
          [
            [
              0,
              1
            ],
            [
              0,
              2
            ],
            [
              1,
              3
            ]
          ]
        ],
        "expected": 2
      },
      {
        "args": [
          5,
          [
            [
              0,
              1
            ],
            [
              1,
              2
            ],
            [
              2,
              3
            ],
            [
              3,
              4
            ]
          ]
        ],
        "expected": 3
      },
      {
        "args": [
          1,
          []
        ],
        "expected": 1
      },
      {
        "args": [
          2,
          [
            [
              0,
              1
            ]
          ]
        ],
        "expected": 1
      },
      {
        "args": [
          4,
          [
            [
              0,
              1
            ],
            [
              0,
              2
            ],
            [
              0,
              3
            ]
          ]
        ],
        "expected": 1
      }
    ],
    "runner": {
      "kind": "function",
      "parameterNames": [
        "n",
        "wires"
      ]
    }
  },
  {
    "id": "top-of-the-pile",
    "title": "Top of the Pile",
    "category": "variant",
    "difficulty": "Medium",
    "statement": "A moving company stacks boxes inside boxes. The load is written as a **nested array**: each element is either an integer (the weight of a loose item) or another array (a box containing more things).\n\nElements directly in the top-level array are at depth `1`; each layer of nesting adds `1`. For example, in `[[9],5]`, the item `5` is at depth 1 and the item `9` is at depth 2.\n\nWhen unloading the truck, workers only grab the items that are the **least buried** — the items at the smallest depth where any loose item exists at all. Everything deeper stays in its boxes for now.\n\nWrite a function `topLayerSum(items)` that finds the **smallest depth containing at least one integer** and returns the **sum of all integers at that depth**. You are guaranteed the nested array contains at least one integer.",
    "examples": [
      {
        "input": "items = [[[5,6]],7,[8]]",
        "output": "7",
        "explanation": "Depth 1 contains the integer 7, so depth 1 is the least-buried level with any items. Only 7 is at depth 1 (5, 6 are at depth 3 and 8 is at depth 2), so the answer is 7."
      },
      {
        "input": "items = [[[2,3]],[[4],[5,[6]]]]",
        "output": "14",
        "explanation": "Depths 1 and 2 contain only arrays, no integers. The shallowest integers appear at depth 3: 2, 3, 4, and 5. (The 6 is at depth 4.) 2 + 3 + 4 + 5 = 14."
      }
    ],
    "constraints": [
      "1 <= total number of integers and arrays <= 1000",
      "Nesting depth is at most 50",
      "Item weights are integers between -100 and 100",
      "At least one integer is present"
    ],
    "functionName": "topLayerSum",
    "solution": "const TOP_DEPTH = 1;\n\n// CONTRACT for findShallowestItemDepth(items, curDepth):\n//     when this call returns, the returned value equals the depth of\n//     the shallowest integer anywhere inside `items`, where the\n//     elements directly inside sit at depth `curDepth` (Infinity if\n//     there are no integers at all).\nconst findShallowestItemDepth = (items, curDepth) => {\n    let shallowestDepth = Infinity;\n\n    for (const element of items) {\n        // Base case: an integer sits at the current depth.\n        if (typeof element === 'number') {\n            shallowestDepth = Math.min(shallowestDepth, curDepth);\n            continue;\n        }\n\n        // Recurse on neighbors: dive one box deeper.\n        // The recursive leap of faith, one level down: this call has\n        // the SAME contract — when it returns, it hands back the depth of\n        // the shallowest integer inside this box. Trust it, do not trace\n        // it. The shallowest of the integers seen right here and each\n        // box's guaranteed answer = exactly this function's contract.\n        const depthInsideBox = findShallowestItemDepth(element, curDepth + 1);\n        shallowestDepth = Math.min(shallowestDepth, depthInsideBox);\n    }\n\n    return shallowestDepth;\n};\n\n// CONTRACT for sumItemsAtDepth(items, curDepth, targetDepth):\n//     when this call returns, the returned value equals the sum of\n//     every integer inside `items` that sits at exactly depth\n//     `targetDepth`, where the elements directly inside sit at depth\n//     `curDepth`.\nconst sumItemsAtDepth = (items, curDepth, targetDepth) => {\n    let itemSum = 0;\n\n    for (const element of items) {\n        // Base case: an integer only counts if it sits at the target depth.\n        if (typeof element === 'number') {\n            if (curDepth === targetDepth) itemSum += element;\n            continue;\n        }\n\n        // Recurse on neighbors\n        // The recursive leap of faith, one level down: same contract —\n        // this call hands back the sum of this box's integers at exactly\n        // `targetDepth`. Trust it, do not trace it. Integers counted here\n        // + each box's guaranteed sum = exactly this function's contract.\n        itemSum += sumItemsAtDepth(element, curDepth + 1, targetDepth);\n    }\n\n    return itemSum;\n};\n\nconst topLayerSum = (items) => {\n    // Pass 1: discover the shallowest depth that holds any integer.\n    // The recursive leap of faith: trust the contract. When this\n    // call returns, `shallowestDepth` is the depth of the shallowest\n    // integer in the whole pile. We do not trace inside; we just use\n    // that depth as the target for pass 2.\n    const shallowestDepth = findShallowestItemDepth(items, TOP_DEPTH);\n\n    // Pass 2: sum only the integers sitting at that depth.\n    // The recursive leap of faith again: when this call returns, its\n    // value is the sum of every integer at that depth. We do not\n    // trace inside; we just return it.\n    return sumItemsAtDepth(items, TOP_DEPTH, shallowestDepth);\n};",
    "tests": [
      {
        "args": [
          [
            [
              [
                5,
                6
              ]
            ],
            7,
            [
              8
            ]
          ]
        ],
        "expected": 7
      },
      {
        "args": [
          [
            [
              [
                2,
                3
              ]
            ],
            [
              [
                4
              ],
              [
                5,
                [
                  6
                ]
              ]
            ]
          ]
        ],
        "expected": 14
      },
      {
        "args": [
          [
            1,
            2,
            3
          ]
        ],
        "expected": 6
      },
      {
        "args": [
          [
            [],
            [
              10
            ],
            []
          ]
        ],
        "expected": 10
      },
      {
        "args": [
          [
            [
              [
                8
              ]
            ],
            [
              -3
            ],
            [
              [
                2,
                2
              ]
            ]
          ]
        ],
        "expected": -3
      }
    ],
    "runner": {
      "kind": "function",
      "parameterNames": [
        "items"
      ]
    }
  },
  {
    "id": "gas-pocket-survey",
    "title": "Gas Pocket Survey",
    "category": "variant",
    "difficulty": "Medium",
    "statement": "You are surveying a cave system shown as a grid. `cave[r][c]` is one of:\n\n- `\"U\"` — unexplored rock\n- `\"G\"` — a hidden gas pocket (dangerous!)\n\nYou drill into one cell, given by `row` and `col`. Gas seeps only through the four flat walls of a cell, so in this problem **only the 4 orthogonal neighbors matter** — up, down, left, and right. Diagonal cells are NOT neighbors.\n\nApply these rules, then return the updated grid:\n\n1. If you drill into a gas pocket (`\"G\"`), it ruptures: change that cell to `\"X\"` and stop.\n2. Otherwise, count the gas pockets among the cell's **4 orthogonal neighbors**.\n   - If the count is 1 or more, change the cell to that count as a digit character (`\"1\"`, `\"2\"`, `\"3\"`, or `\"4\"`) and stop expanding from this cell.\n   - If the count is 0, change the cell to `\"S\"` (safe) and automatically reveal **each of its 4 orthogonal neighbors** the same way (this can keep spreading).\n\nCells that are never revealed stay exactly as they were.\n\nWrite a function `surveyCave(cave, row, col)` that returns the final grid. The drilled cell is guaranteed to be `\"U\"` or `\"G\"`.",
    "examples": [
      {
        "input": "cave = [[\"U\",\"U\",\"U\"],[\"U\",\"U\",\"U\"],[\"U\",\"G\",\"U\"]], row = 0, col = 0",
        "output": "[[\"S\",\"S\",\"S\"],[\"S\",\"1\",\"S\"],[\"1\",\"G\",\"1\"]]",
        "explanation": "The gas pocket is at (2,1). Cell (1,1) has it directly below, so it shows \"1\". Cells (2,0) and (2,2) have it directly beside them, so they show \"1\". Cells like (1,0) and (1,2) only touch the gas DIAGONALLY, which does not count in this problem, so they are safe \"S\" and keep spreading the reveal. The pocket itself is never drilled, so it stays \"G\"."
      },
      {
        "input": "cave = [[\"G\",\"U\"],[\"U\",\"U\"]], row = 0, col = 0",
        "output": "[[\"X\",\"U\"],[\"U\",\"U\"]]",
        "explanation": "You drilled straight into the gas pocket. It becomes \"X\" and nothing else changes."
      }
    ],
    "constraints": [
      "1 <= number of rows, number of columns <= 50",
      "cave[r][c] is \"U\" or \"G\"",
      "0 <= row < number of rows, 0 <= col < number of columns",
      "cave[row][col] is \"U\" or \"G\""
    ],
    "functionName": "surveyCave",
    "solution": "const GAS_POCKET = 'G';\nconst RUPTURED = 'X';\nconst SAFE = 'S';\n\nconst getPositionString = (row, col) => `${row}, ${col}`;\nconst directions = [\n    [0, 1],\n    [1, 0],\n    [0, -1],\n    [-1, 0],\n];\n\nconst isInBounds = (grid, row, col) => {\n    const numRows = grid.length;\n    const numCols = grid[0].length;\n\n    const rowInBounds = row >= 0 && row < numRows;\n    const colInBounds = col >= 0 && col < numCols;\n\n    return rowInBounds && colInBounds;\n};\n\nconst countNeighborGasPockets = (cave, row, col) => {\n    // Gas only seeps through the four flat walls, so only the\n    // 4 orthogonal neighbors count (no diagonals!).\n    let gasCount = 0;\n\n    for (const direction of directions) {\n        const [rowChange, colChange] = direction;\n\n        const newRow = row + rowChange;\n        const newCol = col + colChange;\n\n        if (!isInBounds(cave, newRow, newCol)) continue;\n\n        if (cave[newRow][newCol] === GAS_POCKET) gasCount++;\n    }\n\n    return gasCount;\n};\n\n// CONTRACT for revealCell(cave, row, col, visited):\n//     when this call returns, (`row`, `col`) is revealed and in the\n//     visited set, and if it touches no gas the reveal has spread:\n//     every square reachable from it through gas-free squares is\n//     revealed too. Squares off the board or already in visited are\n//     left unchanged.\nconst revealCell = (cave, row, col, visited) => {\n    // Base cases\n    if (!isInBounds(cave, row, col)) return;\n\n    const curPositionString = getPositionString(row, col);\n    if (visited.has(curPositionString)) return;\n\n    // Process node\n    visited.add(curPositionString);\n\n    const neighborGasCount = countNeighborGasPockets(cave, row, col);\n\n    // A cell next to gas shows its danger count and stops the spread.\n    if (neighborGasCount > 0) {\n        cave[row][col] = String(neighborGasCount);\n        return;\n    }\n\n    cave[row][col] = SAFE;\n\n    // Recurse on neighbors\n    for (const direction of directions) {\n        const [rowChange, colChange] = direction;\n\n        const newRow = row + rowChange;\n        const newCol = col + colChange;\n\n        // The recursive leap of faith, one level down: this call has\n        // the SAME contract — when it returns, the neighboring square\n        // (and, if it is gas-free, everything reachable beyond it) is\n        // revealed and in visited. Trust it, do not trace it. This\n        // function already revealed (`row`, `col`); each direction's\n        // contract reveals the rest of the safe area — together, that is\n        // this function's full contract, kept.\n        revealCell(cave, newRow, newCol, visited);\n    }\n};\n\nconst surveyCave = (cave, row, col) => {\n    // Drilling straight into gas ruptures the pocket and nothing spreads.\n    if (cave[row][col] === GAS_POCKET) {\n        cave[row][col] = RUPTURED;\n        return cave;\n    }\n\n    const visited = new Set();\n    // The recursive leap of faith: trust the contract. When this\n    // call returns, the drilled square and the whole safe area\n    // connected to it are revealed, with danger counts on the edge.\n    // We do not trace inside; we just return the updated cave.\n    revealCell(cave, row, col, visited);\n\n    return cave;\n};",
    "tests": [
      {
        "args": [
          [
            [
              "U",
              "U",
              "U"
            ],
            [
              "U",
              "U",
              "U"
            ],
            [
              "U",
              "G",
              "U"
            ]
          ],
          0,
          0
        ],
        "expected": [
          [
            "S",
            "S",
            "S"
          ],
          [
            "S",
            "1",
            "S"
          ],
          [
            "1",
            "G",
            "1"
          ]
        ]
      },
      {
        "args": [
          [
            [
              "G",
              "U"
            ],
            [
              "U",
              "U"
            ]
          ],
          0,
          0
        ],
        "expected": [
          [
            "X",
            "U"
          ],
          [
            "U",
            "U"
          ]
        ]
      },
      {
        "args": [
          [
            [
              "U",
              "G"
            ],
            [
              "U",
              "U"
            ]
          ],
          0,
          0
        ],
        "expected": [
          [
            "1",
            "G"
          ],
          [
            "U",
            "U"
          ]
        ]
      },
      {
        "args": [
          [
            [
              "U"
            ]
          ],
          0,
          0
        ],
        "expected": [
          [
            "S"
          ]
        ]
      },
      {
        "args": [
          [
            [
              "U",
              "U",
              "U",
              "U"
            ]
          ],
          0,
          3
        ],
        "expected": [
          [
            "S",
            "S",
            "S",
            "S"
          ]
        ]
      }
    ],
    "runner": {
      "kind": "function",
      "parameterNames": [
        "cave",
        "row",
        "col"
      ]
    }
  },
  {
    "id": "runes-on-the-castle-door",
    "title": "Runes on the Castle Door",
    "category": "variant",
    "difficulty": "Medium",
    "statement": "A castle door is locked by a row of spinning dials. Dial `i` can be turned to show any one of the runes (lowercase letters) in the string `dials[i]`.\n\nTo try a code, you set every dial to one rune and read the runes from left to right to form a word. But the door's magic fizzles if two dials that sit **next to each other** show the **same** rune, so in a valid code, every pair of neighboring runes must be different.\n\nReturn a list of **all** valid codes you could set. You may return them in any order. If no valid code exists, return an empty list.",
    "examples": [
      {
        "input": "dials = [\"ab\",\"b\",\"ac\"]",
        "output": "[\"aba\",\"abc\"]",
        "explanation": "Dial 0 can show a or b, dial 1 only b, dial 2 a or c. Starting with b is invalid because dial 1 is also b. Starting with a gives \"ab\", then dial 2 can be a or c (both differ from b), giving \"aba\" and \"abc\"."
      },
      {
        "input": "dials = [\"xy\",\"x\"]",
        "output": "[\"yx\"]",
        "explanation": "\"xx\" is invalid because the two neighboring dials would match. \"yx\" is the only valid code."
      }
    ],
    "constraints": [
      "1 <= dials.length <= 6",
      "1 <= dials[i].length <= 4",
      "dials[i] contains only lowercase English letters, all different within one dial"
    ],
    "functionName": "allRuneCodes",
    "solution": "// CONTRACT for generateCodes(dials, dialIndex, codeSoFar, allCodes):\n//     when this call returns, every valid full code that starts with\n//     `codeSoFar` and continues with runes from dial `dialIndex`\n//     onward has been appended to `allCodes`.\nconst generateCodes = (dials, dialIndex, codeSoFar, allCodes) => {\n    // Base case\n    if (dialIndex === dials.length) {\n        allCodes.push(codeSoFar);\n        return;\n    }\n\n    // Process node\n    const previousRune = codeSoFar[codeSoFar.length - 1];\n\n    // Traverse neighbors\n    const runes = dials[dialIndex];\n\n    for (const rune of runes) {\n        // Two neighboring dials may never show the same rune, so skip\n        // any rune that matches the dial to our left.\n        if (rune === previousRune) continue;\n\n        // The recursive leap of faith, one level down: this call has\n        // the SAME contract — when it returns, every valid code that\n        // starts with `codeSoFar` plus `rune` has been appended to\n        // `allCodes`. Trust it, do not trace it. Trying every allowed\n        // rune on this dial, each with its guaranteed completions, covers\n        // every valid code that starts with `codeSoFar` — exactly this\n        // function's contract, kept.\n        generateCodes(dials, dialIndex + 1, codeSoFar + rune, allCodes);\n    }\n};\n\nconst allRuneCodes = (dials) => {\n    const allCodes = [];\n\n    // The recursive leap of faith: trust the contract. When this\n    // call returns, `allCodes` holds every valid code built from dial\n    // 0 onward — the complete answer. We do not trace inside; we just\n    // return the list.\n    generateCodes(dials, 0, '', allCodes);\n\n    return allCodes;\n};",
    "tests": [
      {
        "args": [
          [
            "ab",
            "b",
            "ac"
          ]
        ],
        "expected": [
          "aba",
          "abc"
        ],
        "unordered": true
      },
      {
        "args": [
          [
            "xy",
            "x"
          ]
        ],
        "expected": [
          "yx"
        ],
        "unordered": true
      },
      {
        "args": [
          [
            "a",
            "a"
          ]
        ],
        "expected": [],
        "unordered": true
      },
      {
        "args": [
          [
            "abc"
          ]
        ],
        "expected": [
          "a",
          "b",
          "c"
        ],
        "unordered": true
      },
      {
        "args": [
          [
            "ab",
            "ab"
          ]
        ],
        "expected": [
          "ab",
          "ba"
        ],
        "unordered": true
      }
    ],
    "runner": {
      "kind": "function",
      "parameterNames": [
        "dials"
      ]
    }
  },
  {
    "id": "perfect-size-campsites",
    "title": "Perfect-Size Campsites",
    "category": "variant",
    "difficulty": "Easy",
    "statement": "A national park gives you a map as a grid. `park[r][c]` is `1` if that square is open grass and `0` if it is forest (you cannot camp in forest).\n\nA **campsite** is a group of grass squares that are connected **up, down, left, or right** (diagonal squares are NOT connected). Every grass square belongs to exactly one campsite.\n\nA scout troop needs a campsite made of **exactly `k` grass squares** — no more, no less — so their tents fit snugly.\n\nWrite a function `countPerfectCampsites(park, k)` that returns how many campsites have exactly `k` squares.",
    "examples": [
      {
        "input": "park = [[1,1,0,1],[0,1,0,1],[0,0,0,0],[1,1,0,0]], k = 2",
        "output": "2",
        "explanation": "There are three campsites: {(0,0),(0,1),(1,1)} with 3 squares, {(0,3),(1,3)} with 2 squares, and {(3,0),(3,1)} with 2 squares. Exactly two of them have size 2."
      },
      {
        "input": "park = [[1,0,1],[0,0,0],[1,1,1]], k = 1",
        "output": "2",
        "explanation": "The campsites are {(0,0)} (size 1), {(0,2)} (size 1), and the bottom row {(2,0),(2,1),(2,2)} (size 3). Two campsites have exactly 1 square."
      }
    ],
    "constraints": [
      "1 <= number of rows, number of columns <= 50",
      "park[r][c] is either 0 or 1",
      "1 <= k <= 2500"
    ],
    "functionName": "countPerfectCampsites",
    "solution": "const GRASS = 1;\n\nconst getPositionString = (row, col) => `${row}, ${col}`;\nconst directions = [\n    [0, 1],\n    [1, 0],\n    [0, -1],\n    [-1, 0],\n];\n\nconst isInBounds = (grid, row, col) => {\n    const numRows = grid.length;\n    const numCols = grid[0].length;\n\n    const rowInBounds = row >= 0 && row < numRows;\n    const colInBounds = col >= 0 && col < numCols;\n\n    return rowInBounds && colInBounds;\n};\n\n// CONTRACT for getCampsiteSize(park, row, col, visited):\n//     when this call returns, every grass square connected to\n//     (`row`, `col`) is in the visited set, and the returned value is\n//     how many squares this call put there. If (`row`, `col`) is not\n//     a fresh grass square, it returns 0 and nothing new goes in.\nconst getCampsiteSize = (park, row, col, visited) => {\n    // Base cases\n    if (!isInBounds(park, row, col)) return 0;\n\n    const curPositionString = getPositionString(row, col);\n    if (visited.has(curPositionString)) return 0;\n\n    if (park[row][col] !== GRASS) return 0;\n\n    // Process node\n    visited.add(curPositionString);\n\n    // This square contributes 1 to the campsite, plus every connected\n    // grass square we discover from here.\n    let campsiteSize = 1;\n\n    // Recurse on potential neighbors\n    for (const direction of directions) {\n        const [rowChange, colChange] = direction;\n\n        const newRow = row + rowChange;\n        const newCol = col + colChange;\n\n        // The recursive leap of faith, one level down: this call has\n        // the SAME contract — when it returns, every grass square\n        // connected to the neighboring square is in visited, and it hands\n        // back how many it added. Trust it, do not trace it. The 1 for\n        // this square + each direction's guaranteed count = exactly this\n        // function's contract.\n        campsiteSize += getCampsiteSize(park, newRow, newCol, visited);\n    }\n\n    return campsiteSize;\n};\n\nconst countPerfectCampsites = (park, k) => {\n    const numRows = park.length;\n    const numCols = park[0].length;\n\n    let numPerfectCampsites = 0;\n    const visited = new Set();\n\n    for (let row = 0; row < numRows; row++) {\n        for (let col = 0; col < numCols; col++) {\n            const curPositionString = getPositionString(row, col);\n\n            if (visited.has(curPositionString)) continue;\n\n            const terrainType = park[row][col];\n            if (terrainType !== GRASS) continue;\n\n            // One DFS measures this entire campsite, so we can compare\n            // its full size against k before moving on.\n            // The recursive leap of faith: trust the contract. When this\n            // call returns, this whole campsite is in visited — the loop can\n            // never count it again — and `campsiteSize` is its exact number\n            // of squares. We do not trace inside; we just compare it to k.\n            const campsiteSize = getCampsiteSize(park, row, col, visited);\n\n            if (campsiteSize === k) numPerfectCampsites++;\n        }\n    }\n\n    return numPerfectCampsites;\n};",
    "tests": [
      {
        "args": [
          [
            [
              1,
              1,
              0,
              1
            ],
            [
              0,
              1,
              0,
              1
            ],
            [
              0,
              0,
              0,
              0
            ],
            [
              1,
              1,
              0,
              0
            ]
          ],
          2
        ],
        "expected": 2
      },
      {
        "args": [
          [
            [
              1,
              0,
              1
            ],
            [
              0,
              0,
              0
            ],
            [
              1,
              1,
              1
            ]
          ],
          1
        ],
        "expected": 2
      },
      {
        "args": [
          [
            [
              0,
              0
            ],
            [
              0,
              0
            ]
          ],
          1
        ],
        "expected": 0
      },
      {
        "args": [
          [
            [
              1
            ]
          ],
          1
        ],
        "expected": 1
      },
      {
        "args": [
          [
            [
              1,
              1,
              1
            ],
            [
              1,
              1,
              1
            ]
          ],
          6
        ],
        "expected": 1
      },
      {
        "args": [
          [
            [
              1,
              1
            ],
            [
              1,
              1
            ]
          ],
          3
        ],
        "expected": 0
      }
    ],
    "runner": {
      "kind": "function",
      "parameterNames": [
        "park",
        "k"
      ]
    }
  },
  {
    "id": "office-rumor-reach",
    "title": "Office Rumor",
    "category": "variant",
    "difficulty": "Easy",
    "statement": "An office has `n` employees, numbered `0` to `n - 1`. You are given a list `friendships`, where each entry `[a, b]` means employees `a` and `b` are friends (friendship goes both ways).\n\nOne morning, employee `start` hears a juicy rumor. Every employee who hears the rumor immediately tells **all of their friends**, who then tell all of *their* friends, and so on until no new person can hear it.\n\nWrite a function `countWhoHear(n, friendships, start)` that returns the total number of employees who end up hearing the rumor, **including** the employee who started it.",
    "examples": [
      {
        "input": "n = 6, friendships = [[0,1],[1,2],[3,4]], start = 0",
        "output": "3",
        "explanation": "Employee 0 tells friend 1, and 1 tells friend 2. Employees 3, 4, and 5 are not connected to 0 by any chain of friends, so they never hear it. In total 3 people (0, 1, 2) hear the rumor."
      },
      {
        "input": "n = 4, friendships = [[1,2]], start = 0",
        "output": "1",
        "explanation": "Employee 0 has no friends, so the rumor stops immediately. Only 1 person (employee 0) ever hears it."
      }
    ],
    "constraints": [
      "1 <= n <= 100",
      "0 <= friendships.length <= 500",
      "friendships[i] = [a, b] with 0 <= a, b < n and a != b",
      "0 <= start < n",
      "There is at most one friendship entry per pair"
    ],
    "functionName": "countWhoHear",
    "solution": "const buildGraph = (edges) => {\n    const graph = {};\n\n    for (const edge of edges) {\n        const [nodeOne, nodeTwo] = edge;\n\n        const nodeOneInGraph = graph.hasOwnProperty(nodeOne);\n        const nodeTwoInGraph = graph.hasOwnProperty(nodeTwo);\n\n        if (!nodeOneInGraph) graph[nodeOne] = [];\n        if (!nodeTwoInGraph) graph[nodeTwo] = [];\n\n        graph[nodeOne].push(nodeTwo);\n        graph[nodeTwo].push(nodeOne);\n    }\n\n    return graph;\n};\n\n// CONTRACT for spreadRumor(graph, employee, visited):\n//     when this call returns, `employee` and every employee reachable\n//     from them through chains of friendships is in the visited set.\nconst spreadRumor = (graph, employee, visited) => {\n    // Base cases\n    if (visited.has(employee)) return;\n\n    // Process node\n    visited.add(employee);\n\n    // Recurse on neighbors\n    const employeeInGraph = graph.hasOwnProperty(employee);\n    if (!employeeInGraph) return;\n\n    const friends = graph[employee];\n\n    for (const friend of friends) {\n        // The recursive leap of faith, one level down: this call has\n        // the SAME contract — when it returns, `friend` and everyone\n        // reachable from them is in the visited set. Trust it, do not\n        // trace it. This function already put `employee` into visited,\n        // and each friend's contract covers everyone reachable beyond\n        // them — together, that is this function's full contract, kept.\n        spreadRumor(graph, friend, visited);\n    }\n};\n\nconst countWhoHear = (n, friendships, start) => {\n    const graph = buildGraph(friendships);\n\n    // Everyone the DFS reaches hears the rumor, so the visited set ends\n    // up holding exactly the employees in start's chain of friends.\n    const visited = new Set();\n\n    // The recursive leap of faith: trust the contract. When this\n    // call returns, `start` and everyone reachable from them is in\n    // the visited set. We do not trace inside; we just return the\n    // size of the set.\n    spreadRumor(graph, start, visited);\n\n    return visited.size;\n};",
    "tests": [
      {
        "args": [
          6,
          [
            [
              0,
              1
            ],
            [
              1,
              2
            ],
            [
              3,
              4
            ]
          ],
          0
        ],
        "expected": 3
      },
      {
        "args": [
          4,
          [
            [
              1,
              2
            ]
          ],
          0
        ],
        "expected": 1
      },
      {
        "args": [
          5,
          [
            [
              0,
              1
            ],
            [
              1,
              2
            ],
            [
              2,
              3
            ],
            [
              3,
              4
            ]
          ],
          2
        ],
        "expected": 5
      },
      {
        "args": [
          1,
          [],
          0
        ],
        "expected": 1
      },
      {
        "args": [
          7,
          [
            [
              0,
              1
            ],
            [
              2,
              3
            ],
            [
              3,
              4
            ],
            [
              5,
              6
            ]
          ],
          3
        ],
        "expected": 3
      }
    ],
    "runner": {
      "kind": "function",
      "parameterNames": [
        "n",
        "friendships",
        "start"
      ]
    }
  },
  {
    "id": "busiest-shelf-level",
    "title": "Busiest Shelf Level",
    "category": "variant",
    "difficulty": "Easy",
    "statement": "A warehouse inventory is written as a **nested array**: each element is either an integer (an item ID) or another array (a container holding more stuff).\n\nElements directly in the top-level array are at depth `1`; each layer of nesting adds `1` to the depth. For example, in `[[1,2],3]`, the item `3` is at depth 1 and the items `1` and `2` are at depth 2.\n\nThe manager wants to know which nesting level is the most crowded.\n\nWrite a function `busiestDepth(items)` that returns the depth that contains the **largest number of items** (integers). If two or more depths are tied for the most items, return the **smallest** of those depths. You are guaranteed the nested array contains at least one integer.",
    "examples": [
      {
        "input": "items = [[1,2],[3,[4,5]],6]",
        "output": "2",
        "explanation": "Depth 1 holds one item (6). Depth 2 holds three items (1, 2, 3). Depth 3 holds two items (4, 5). Depth 2 is the busiest."
      },
      {
        "input": "items = [[7],8]",
        "output": "1",
        "explanation": "Depth 1 holds one item (8) and depth 2 holds one item (7). It is a tie, so we return the smaller depth: 1."
      }
    ],
    "constraints": [
      "1 <= total number of integers and arrays <= 1000",
      "Nesting depth is at most 50",
      "Item IDs are integers between -1000 and 1000",
      "At least one integer is present"
    ],
    "functionName": "busiestDepth",
    "solution": "const TOP_LEVEL_DEPTH = 1;\n\n// CONTRACT for countItemsAtEachDepth(items, depth, itemCountsByDepth):\n//     when this call returns, every item inside `items` — however\n//     deeply nested — has been counted in `itemCountsByDepth` under\n//     its own depth, where the elements directly inside sit at depth\n//     `depth`.\nconst countItemsAtEachDepth = (items, depth, itemCountsByDepth) => {\n    // Base case: an empty container is handled automatically\n    // (the loop below never runs, so the recursion stops).\n\n    for (const element of items) {\n        const elementIsItem = !Array.isArray(element);\n\n        // Process node\n        if (elementIsItem) {\n            const depthHasCount = itemCountsByDepth.hasOwnProperty(depth);\n            if (!depthHasCount) itemCountsByDepth[depth] = 0;\n\n            itemCountsByDepth[depth]++;\n            continue;\n        }\n\n        // Recurse on neighbors\n        // Opening a container pushes everything inside one level deeper.\n        // The recursive leap of faith, one level down: this call has\n        // the SAME contract — when it returns, every item inside this\n        // container has been counted under its correct depth. Trust it,\n        // do not trace it. Items counted directly here + each container's\n        // guaranteed counts = exactly this function's contract.\n        countItemsAtEachDepth(element, depth + 1, itemCountsByDepth);\n    }\n};\n\nconst busiestDepth = (items) => {\n    const itemCountsByDepth = {};\n\n    // The recursive leap of faith: trust the contract. When this\n    // call returns, `itemCountsByDepth` holds a complete tally: how\n    // many items sit at every depth of the shelf. We do not trace\n    // inside; we just scan the tally for the busiest depth.\n    countItemsAtEachDepth(items, TOP_LEVEL_DEPTH, itemCountsByDepth);\n\n    const allDepths = Object.keys(itemCountsByDepth)\n        .map(Number)\n        .sort((depthA, depthB) => depthA - depthB);\n\n    let busiestDepthSoFar = 0;\n    let mostItemsSoFar = 0;\n\n    // Scanning depths from shallowest to deepest means a strict '>'\n    // comparison automatically breaks ties in favor of the smaller depth.\n    for (const depth of allDepths) {\n        const itemsAtDepth = itemCountsByDepth[depth];\n\n        if (itemsAtDepth > mostItemsSoFar) {\n            mostItemsSoFar = itemsAtDepth;\n            busiestDepthSoFar = depth;\n        }\n    }\n\n    return busiestDepthSoFar;\n};",
    "tests": [
      {
        "args": [
          [
            [
              1,
              2
            ],
            [
              3,
              [
                4,
                5
              ]
            ],
            6
          ]
        ],
        "expected": 2
      },
      {
        "args": [
          [
            [
              7
            ],
            8
          ]
        ],
        "expected": 1
      },
      {
        "args": [
          [
            5
          ]
        ],
        "expected": 1
      },
      {
        "args": [
          [
            [
              [
                1,
                2,
                3
              ]
            ]
          ]
        ],
        "expected": 3
      },
      {
        "args": [
          [
            1,
            [
              2
            ],
            [
              3,
              [
                4
              ]
            ]
          ]
        ],
        "expected": 2
      },
      {
        "args": [
          [
            [
              1
            ],
            [
              [
                2
              ]
            ]
          ]
        ],
        "expected": 2
      }
    ],
    "runner": {
      "kind": "function",
      "parameterNames": [
        "items"
      ]
    }
  },
  {
    "id": "dungeon-gold-run",
    "title": "Gold in the Locked Dungeon",
    "category": "variant",
    "difficulty": "Easy",
    "statement": "You are exploring a dungeon with `n` rooms numbered `0` to `n - 1`. Every room is locked except room `0`, which is where you start.\n\n`rooms[i]` is the list of keys lying in room `i`. A key with number `k` opens room `k`. Room `i` also holds `gold[i]` gold coins. When you enter a room, you take **all** of its keys and **all** of its gold.\n\nYou may walk back and forth between rooms as much as you like, and you may enter any room whose key you are carrying.\n\nReturn the total number of gold coins you can collect.",
    "examples": [
      {
        "input": "rooms = [[1],[2],[]], gold = [5,3,10]",
        "output": "18",
        "explanation": "Start in room 0 (5 coins) and grab key 1. Enter room 1 (3 coins) and grab key 2. Enter room 2 (10 coins). Total: 5 + 3 + 10 = 18."
      },
      {
        "input": "rooms = [[1],[],[1]], gold = [2,7,50]",
        "output": "9",
        "explanation": "Start in room 0 (2 coins) and grab key 1. Enter room 1 (7 coins), which has no keys. No key 2 exists anywhere, so the 50 coins in room 2 are out of reach. Total: 2 + 7 = 9."
      }
    ],
    "constraints": [
      "n == rooms.length == gold.length, 1 <= n <= 100",
      "0 <= rooms[i].length <= n",
      "0 <= rooms[i][j] <= n - 1, and all keys in one room are different",
      "0 <= gold[i] <= 1000"
    ],
    "functionName": "totalGoldCollected",
    "solution": "const START_ROOM = 0;\n\n// CONTRACT for collectGold(rooms, gold, room, visited):\n//     when this call returns, `room` and every room reachable through\n//     keys from it is in the visited set, and the returned value is\n//     the total gold from the rooms this call put into visited.\nconst collectGold = (rooms, gold, room, visited) => {\n    // Base cases\n    if (visited.has(room)) return 0;\n\n    // Process node\n    // The visited set guarantees each room's gold is taken exactly once,\n    // even if several rooms hold a key to it.\n    visited.add(room);\n\n    let goldCollected = gold[room];\n\n    // Recurse on neighbors\n    const keysInRoom = rooms[room];\n\n    for (const key of keysInRoom) {\n        // The recursive leap of faith, one level down: this call has\n        // the SAME contract — when it returns, room `key` and everything\n        // reachable from it is in visited, and it hands back the gold it\n        // collected there. Trust it, do not trace it. This room's own\n        // gold + each key call's guaranteed haul = exactly this\n        // function's contract.\n        goldCollected += collectGold(rooms, gold, key, visited);\n    }\n\n    return goldCollected;\n};\n\nconst totalGoldCollected = (rooms, gold) => {\n    const visited = new Set();\n\n    // The recursive leap of faith: trust the contract. When this\n    // call returns, its value is all the gold reachable from room 0.\n    // We do not trace inside; we just return that total.\n    return collectGold(rooms, gold, START_ROOM, visited);\n};",
    "tests": [
      {
        "args": [
          [
            [
              1
            ],
            [
              2
            ],
            []
          ],
          [
            5,
            3,
            10
          ]
        ],
        "expected": 18
      },
      {
        "args": [
          [
            [
              1
            ],
            [],
            [
              1
            ]
          ],
          [
            2,
            7,
            50
          ]
        ],
        "expected": 9
      },
      {
        "args": [
          [
            []
          ],
          [
            42
          ]
        ],
        "expected": 42
      },
      {
        "args": [
          [
            [
              1,
              2
            ],
            [
              0
            ],
            [
              0,
              1
            ]
          ],
          [
            1,
            2,
            3
          ]
        ],
        "expected": 6
      },
      {
        "args": [
          [
            [
              0
            ],
            [
              2
            ],
            [
              1
            ]
          ],
          [
            9,
            4,
            4
          ]
        ],
        "expected": 9
      },
      {
        "args": [
          [
            [
              2
            ],
            [
              0
            ],
            []
          ],
          [
            0,
            5,
            7
          ]
        ],
        "expected": 7
      }
    ],
    "runner": {
      "kind": "function",
      "parameterNames": [
        "rooms",
        "gold"
      ]
    }
  },
  {
    "id": "flooded-campsite-trails",
    "title": "Hiking Around the Flood",
    "category": "variant",
    "difficulty": "Easy",
    "statement": "A national park has `n` campsites, numbered `0` to `n - 1`, connected by two-way trails. `trails[i] = [a, b]` means you can hike directly between campsites `a` and `b`.\n\nA storm has flooded some campsites. The list `flooded` contains the numbers of the flooded campsites, and you cannot set foot in a flooded campsite at all, not even to pass through.\n\nReturn `true` if you can hike from campsite `start` to campsite `finish` while stepping only on dry campsites, and `false` otherwise. If `start` or `finish` is itself flooded, return `false`.",
    "examples": [
      {
        "input": "n = 5, trails = [[0,1],[1,2],[2,4],[0,3],[3,4]], flooded = [2], start = 0, finish = 4",
        "output": "true",
        "explanation": "The route 0 -> 1 -> 2 -> 4 is blocked because campsite 2 is flooded, but the route 0 -> 3 -> 4 stays dry the whole way."
      },
      {
        "input": "n = 4, trails = [[0,1],[1,3],[0,2],[2,3]], flooded = [1,2], start = 0, finish = 3",
        "output": "false",
        "explanation": "Every trail out of campsite 0 leads to a flooded campsite (1 or 2), so there is no dry route to campsite 3."
      }
    ],
    "constraints": [
      "1 <= n <= 100",
      "0 <= trails.length <= 200",
      "0 <= a, b <= n - 1",
      "0 <= flooded.length <= n, and all values in flooded are different",
      "0 <= start, finish <= n - 1"
    ],
    "functionName": "canReachFinish",
    "solution": "const buildGraph = (edges) => {\n    const graph = {};\n\n    for (const edge of edges) {\n        const [nodeOne, nodeTwo] = edge;\n\n        const nodeOneInGraph = graph.hasOwnProperty(nodeOne);\n        const nodeTwoInGraph = graph.hasOwnProperty(nodeTwo);\n\n        if (!nodeOneInGraph) graph[nodeOne] = [];\n        if (!nodeTwoInGraph) graph[nodeTwo] = [];\n\n        graph[nodeOne].push(nodeTwo);\n        graph[nodeTwo].push(nodeOne);\n    }\n\n    return graph;\n};\n\n// CONTRACT for canReachTarget(graph, campsite, target, floodedSet, visited):\n//     when this call returns, it returns true if the search can walk\n//     from `campsite` to `target` without stepping into a flooded\n//     campsite, and false otherwise. Every campsite it explores goes\n//     into the visited set, so none is explored twice.\nconst canReachTarget = (graph, campsite, target, floodedSet, visited) => {\n    // Base cases\n    if (campsite === target) return true;\n\n    if (visited.has(campsite)) return false;\n\n    // Process node\n    visited.add(campsite);\n\n    // Recurse on neighbors\n    const campsiteInGraph = graph.hasOwnProperty(campsite);\n    if (!campsiteInGraph) return false;\n\n    const neighbors = graph[campsite];\n\n    for (const neighbor of neighbors) {\n        // A flooded campsite is off-limits even as a pass-through,\n        // so the DFS refuses to step into it at all.\n        if (floodedSet.has(neighbor)) continue;\n\n        // The recursive leap of faith, one level down: this call has\n        // the SAME contract — when it returns, it tells us whether\n        // `target` can be reached from `neighbor` on dry trails. Trust\n        // it, do not trace it. If any neighbor's answer is true, a route\n        // through that neighbor exists, so returning true keeps this\n        // function's contract; if every answer is false, returning false\n        // keeps it too.\n        const foundTarget = canReachTarget(\n            graph,\n            neighbor,\n            target,\n            floodedSet,\n            visited,\n        );\n\n        if (foundTarget) return true;\n    }\n\n    return false;\n};\n\nconst canReachFinish = (n, trails, flooded, start, finish) => {\n    const floodedSet = new Set(flooded);\n\n    // A hike cannot begin or end underwater.\n    if (floodedSet.has(start)) return false;\n    if (floodedSet.has(finish)) return false;\n\n    const graph = buildGraph(trails);\n    const visited = new Set();\n\n    // The recursive leap of faith: trust the contract. When this\n    // call returns, its value tells us whether `finish` can be\n    // reached from `start` while avoiding every flooded campsite. We\n    // do not trace inside; we just return the answer.\n    return canReachTarget(graph, start, finish, floodedSet, visited);\n};",
    "tests": [
      {
        "args": [
          5,
          [
            [
              0,
              1
            ],
            [
              1,
              2
            ],
            [
              2,
              4
            ],
            [
              0,
              3
            ],
            [
              3,
              4
            ]
          ],
          [
            2
          ],
          0,
          4
        ],
        "expected": true
      },
      {
        "args": [
          4,
          [
            [
              0,
              1
            ],
            [
              1,
              3
            ],
            [
              0,
              2
            ],
            [
              2,
              3
            ]
          ],
          [
            1,
            2
          ],
          0,
          3
        ],
        "expected": false
      },
      {
        "args": [
          3,
          [
            [
              0,
              1
            ],
            [
              1,
              2
            ]
          ],
          [
            0
          ],
          0,
          2
        ],
        "expected": false
      },
      {
        "args": [
          4,
          [],
          [
            1
          ],
          2,
          2
        ],
        "expected": true
      },
      {
        "args": [
          2,
          [
            [
              0,
              1
            ]
          ],
          [
            1
          ],
          1,
          1
        ],
        "expected": false
      },
      {
        "args": [
          4,
          [
            [
              0,
              1
            ],
            [
              2,
              3
            ]
          ],
          [],
          0,
          3
        ],
        "expected": false
      }
    ],
    "runner": {
      "kind": "function",
      "parameterNames": [
        "n",
        "trails",
        "flooded",
        "start",
        "finish"
      ]
    }
  },
  {
    "id": "routes-past-the-coffee-cart",
    "title": "Detour for Coffee",
    "category": "variant",
    "difficulty": "Medium",
    "statement": "A courier works in a city with `n` intersections, numbered `0` to `n - 1`. All streets are one-way: `graph[i]` is the list of intersections you can drive to directly from intersection `i`. The streets are laid out so you can never drive in a circle back to an intersection you already visited (there are no cycles).\n\nThe courier starts at the depot, intersection `0`, and must end at the customer, intersection `n - 1`. On the way, they insist on passing the coffee cart at intersection `checkpoint`.\n\nReturn a list of **all** routes from `0` to `n - 1` that pass through `checkpoint`. Each route is the list of intersections visited, in order. You may return the routes in any order. If no such route exists, return an empty list.",
    "examples": [
      {
        "input": "graph = [[1,2],[3],[3],[]], checkpoint = 1",
        "output": "[[0,1,3]]",
        "explanation": "The two routes from 0 to 3 are [0,1,3] and [0,2,3]. Only [0,1,3] passes through intersection 1."
      },
      {
        "input": "graph = [[1,2],[2,3],[3],[]], checkpoint = 2",
        "output": "[[0,1,2,3],[0,2,3]]",
        "explanation": "The routes from 0 to 3 are [0,1,2,3], [0,1,3], and [0,2,3]. The route [0,1,3] skips the coffee cart at 2, so only the other two count."
      }
    ],
    "constraints": [
      "n == graph.length, 2 <= n <= 10",
      "0 <= graph[i].length <= n - 1",
      "graph[i] never contains i, and all values in graph[i] are different",
      "The streets never form a cycle",
      "1 <= checkpoint <= n - 2 (the checkpoint is never the depot or the customer)"
    ],
    "functionName": "routesThroughCheckpoint",
    "solution": "const START_NODE = 0;\n\n// CONTRACT for getPathsFromNodeToTarget(graph, curNode, targetNode):\n//     when this call returns, the returned list holds every possible\n//     path from `curNode` to `targetNode`, each written as the full\n//     list of intersections along the way.\nconst getPathsFromNodeToTarget = (graph, curNode, targetNode) => {\n    // Base cases\n    if (curNode === targetNode) return [[curNode]];\n\n    // Process node\n    const allPathsFromNodeToTarget = [];\n\n    // Recurse on neighbors\n    // The streets form a DAG (no cycles), so we can never drive back to\n    // an intersection already on our path — that is why no visited set\n    // is needed for this traversal.\n    const neighbors = graph[curNode];\n    for (const neighbor of neighbors) {\n        // The recursive leap of faith, one level down: this call has\n        // the SAME contract — when it returns, it hands back every path\n        // from `neighbor` to the target. Trust it, do not trace it. Every\n        // path from `curNode` starts by stepping to some neighbor, so\n        // putting `curNode` in front of each neighbor's guaranteed paths\n        // builds exactly this function's contract.\n        const pathsFromNeighborToTarget = getPathsFromNodeToTarget(\n            graph,\n            neighbor,\n            targetNode,\n        );\n\n        for (const path of pathsFromNeighborToTarget) {\n            const pathFromCurToTarget = [curNode, ...path];\n\n            allPathsFromNodeToTarget.push(pathFromCurToTarget);\n        }\n    }\n\n    return allPathsFromNodeToTarget;\n};\n\nconst routesThroughCheckpoint = (graph, checkpoint) => {\n    const targetNode = graph.length - 1;\n\n    // The recursive leap of faith: trust the contract. When this\n    // call returns, `allRoutes` holds every route from the start to\n    // the last intersection. We do not trace inside; we just filter\n    // the routes for the ones passing the checkpoint.\n    const allRoutes = getPathsFromNodeToTarget(graph, START_NODE, targetNode);\n\n    // Keep only the routes that stop by the coffee cart.\n    return allRoutes.filter((route) => route.includes(checkpoint));\n};",
    "tests": [
      {
        "args": [
          [
            [
              1,
              2
            ],
            [
              3
            ],
            [
              3
            ],
            []
          ],
          1
        ],
        "expected": [
          [
            0,
            1,
            3
          ]
        ],
        "unordered": true
      },
      {
        "args": [
          [
            [
              1,
              2
            ],
            [
              2,
              3
            ],
            [
              3
            ],
            []
          ],
          2
        ],
        "expected": [
          [
            0,
            1,
            2,
            3
          ],
          [
            0,
            2,
            3
          ]
        ],
        "unordered": true
      },
      {
        "args": [
          [
            [
              1,
              2
            ],
            [
              3
            ],
            [],
            []
          ],
          2
        ],
        "expected": [],
        "unordered": true
      },
      {
        "args": [
          [
            [
              1
            ],
            [
              2
            ],
            [
              3
            ],
            []
          ],
          2
        ],
        "expected": [
          [
            0,
            1,
            2,
            3
          ]
        ],
        "unordered": true
      },
      {
        "args": [
          [
            [
              1,
              2
            ],
            [
              3
            ],
            [
              3
            ],
            [
              4
            ],
            []
          ],
          3
        ],
        "expected": [
          [
            0,
            1,
            3,
            4
          ],
          [
            0,
            2,
            3,
            4
          ]
        ],
        "unordered": true
      },
      {
        "args": [
          [
            [
              1
            ],
            [],
            []
          ],
          1
        ],
        "expected": [],
        "unordered": true
      }
    ],
    "runner": {
      "kind": "function",
      "parameterNames": [
        "graph",
        "checkpoint"
      ]
    }
  },
  {
    "id": "trusted-courier-networks",
    "title": "Trusted Courier Networks",
    "category": "variant",
    "difficulty": "Medium",
    "statement": "A delivery company has `n` offices, numbered `0` to `n - 1`. You are given an `n x n` matrix `trust`, where `trust[i][j]` is a **trust score** between office `i` and office `j`, from `0` (strangers) to `10` (fully trusted). The matrix is symmetric (`trust[i][j] = trust[j][i]`), and `trust[i][i]` is always `10`.\n\nTwo offices open a **direct secure line** only if their trust score is **at least `k`**.\n\nOffices belong to the same **network** if you can get from one to the other through a chain of direct secure lines (possibly passing through other offices along the way). An office with no secure lines is a network all by itself.\n\nWrite a function `countSecureNetworks(trust, k)` that returns how many separate networks there are.",
    "examples": [
      {
        "input": "trust = [[10,5,1],[5,10,7],[1,7,10]], k = 5",
        "output": "1",
        "explanation": "Offices 0 and 1 have score 5 (>= 5), so they link. Offices 1 and 2 have score 7 (>= 5), so they link. Offices 0 and 2 only score 1, but they are still in the same network through office 1. Everyone is connected: 1 network."
      },
      {
        "input": "trust = [[10,5,1],[5,10,7],[1,7,10]], k = 8",
        "output": "3",
        "explanation": "With k = 8, no pair reaches a score of 8, so no secure lines exist at all. Each office is its own network: 3 networks."
      }
    ],
    "constraints": [
      "1 <= n <= 100",
      "0 <= trust[i][j] <= 10",
      "trust[i][i] = 10",
      "trust[i][j] = trust[j][i]",
      "1 <= k <= 10"
    ],
    "functionName": "countSecureNetworks",
    "solution": "// CONTRACT for markNetworkAsVisited(visited, office, trust, minTrust):\n//     when this call returns, `office` and every office reachable\n//     from it through secure lines (trust scores of `minTrust` or\n//     more) is in the visited set.\nconst markNetworkAsVisited = (visited, office, trust, minTrust) => {\n    // For this problem, our base case is automatically handled\n    // (our base case occurs when the current office has 0 unvisited\n    // neighbor offices).\n\n    // Process node\n    visited.add(office);\n\n    // Recurse on neighbors\n    for (\n        let potentialNeighborOffice = 0;\n        potentialNeighborOffice < trust.length;\n        potentialNeighborOffice++\n    ) {\n        // A direct secure line only exists when the trust score reaches\n        // the threshold — a lower score means there is no edge at all.\n        const isNeighbor =\n            trust[office][potentialNeighborOffice] >= minTrust;\n\n        if (!isNeighbor) continue;\n\n        // Trust scores are symmetric, so this is an undirected graph.\n        // Undirected graphs can have cycles, so we must track visited\n        // offices to prevent infinite loops.\n        if (visited.has(potentialNeighborOffice)) continue;\n\n        // The recursive leap of faith, one level down: this call has\n        // the SAME contract — when it returns, this neighbor office and\n        // everything reachable from it is in the visited set. Trust it,\n        // do not trace it. This function already put `office` into\n        // visited, and each neighbor's contract covers the offices beyond\n        // it — together, that is this function's full contract, kept.\n        markNetworkAsVisited(visited, potentialNeighborOffice, trust, minTrust);\n    }\n};\n\nconst countSecureNetworks = (trust, k) => {\n    const numOffices = trust.length;\n\n    let numNetworks = 0;\n    const visited = new Set();\n\n    for (let startOffice = 0; startOffice < numOffices; startOffice++) {\n        if (visited.has(startOffice)) continue;\n\n        numNetworks++;\n        // The recursive leap of faith: trust the contract. When this\n        // call returns, `startOffice` and its entire secure network are\n        // in visited, so the loop can never count this network again. We\n        // do not trace inside; we just count it and move on.\n        markNetworkAsVisited(visited, startOffice, trust, k);\n    }\n\n    return numNetworks;\n};",
    "tests": [
      {
        "args": [
          [
            [
              10,
              5,
              1
            ],
            [
              5,
              10,
              7
            ],
            [
              1,
              7,
              10
            ]
          ],
          5
        ],
        "expected": 1
      },
      {
        "args": [
          [
            [
              10,
              5,
              1
            ],
            [
              5,
              10,
              7
            ],
            [
              1,
              7,
              10
            ]
          ],
          8
        ],
        "expected": 3
      },
      {
        "args": [
          [
            [
              10
            ]
          ],
          10
        ],
        "expected": 1
      },
      {
        "args": [
          [
            [
              10,
              9,
              0,
              0
            ],
            [
              9,
              10,
              0,
              0
            ],
            [
              0,
              0,
              10,
              6
            ],
            [
              0,
              0,
              6,
              10
            ]
          ],
          6
        ],
        "expected": 2
      },
      {
        "args": [
          [
            [
              10,
              4,
              4
            ],
            [
              4,
              10,
              4
            ],
            [
              4,
              4,
              10
            ]
          ],
          4
        ],
        "expected": 1
      },
      {
        "args": [
          [
            [
              10,
              3
            ],
            [
              3,
              10
            ]
          ],
          4
        ],
        "expected": 2
      }
    ],
    "runner": {
      "kind": "function",
      "parameterNames": [
        "trust",
        "k"
      ]
    }
  },
  {
    "id": "who-keeps-their-job",
    "title": "After the Big Resignation",
    "category": "variant",
    "difficulty": "Easy",
    "statement": "A company keeps its org chart as two lists of the same length. `ids[i]` is the ID of an employee, and `bosses[i]` is the ID of that employee's direct boss. Exactly one employee has `bosses[i] = 0`, meaning they have no boss (they run the company). Every other employee has exactly one boss, and the chart never loops, so it forms a tree. All IDs are unique positive numbers.\n\nEmployee `quitId` suddenly quits. Company tradition says that when someone quits, every employee below them also leaves: their direct reports, their reports' reports, and so on all the way down.\n\nReturn a list of the IDs of the employees who **still work** at the company, sorted from smallest to largest. If everyone leaves, return an empty list.",
    "examples": [
      {
        "input": "ids = [1,3,10,5], bosses = [0,1,1,3], quitId = 3",
        "output": "[1,10]",
        "explanation": "Employee 1 runs the company and manages 3 and 10. Employee 3 manages 5. When 3 quits, 5 leaves too. Employees 1 and 10 remain, sorted: [1,10]."
      },
      {
        "input": "ids = [7,2,9], bosses = [0,7,7], quitId = 7",
        "output": "[]",
        "explanation": "Employee 7 runs the company and manages 2 and 9. When 7 quits, everyone below leaves, so nobody remains."
      }
    ],
    "constraints": [
      "1 <= ids.length <= 100",
      "ids.length == bosses.length",
      "All IDs are unique integers between 1 and 10000",
      "Exactly one employee has boss 0, and the chart forms a tree",
      "quitId is guaranteed to be one of the IDs in ids"
    ],
    "functionName": "remainingEmployees",
    "solution": "const NO_BOSS = 0;\n\nconst buildReportsGraph = (ids, bosses) => {\n    const reportsGraph = {};\n\n    for (let i = 0; i < ids.length; i++) {\n        const employeeId = ids[i];\n        const bossId = bosses[i];\n\n        if (bossId === NO_BOSS) continue;\n\n        const bossInGraph = reportsGraph.hasOwnProperty(bossId);\n        if (!bossInGraph) reportsGraph[bossId] = [];\n\n        reportsGraph[bossId].push(employeeId);\n    }\n\n    return reportsGraph;\n};\n\n// CONTRACT for markSubtreeAsLeaving(reportsGraph, employeeId, leaving):\n//     when this call returns, `employeeId` and every employee below\n//     them in the reporting tree — reports, reports of reports, and\n//     so on — is in the leaving set.\nconst markSubtreeAsLeaving = (reportsGraph, employeeId, leaving) => {\n    // Base cases\n    if (leaving.has(employeeId)) return;\n\n    // Process node\n    leaving.add(employeeId);\n\n    // Recurse on neighbors (the employee's direct reports)\n    const hasReports = reportsGraph.hasOwnProperty(employeeId);\n    if (!hasReports) return;\n\n    const reports = reportsGraph[employeeId];\n\n    for (const reportId of reports) {\n        // The recursive leap of faith, one level down: this call has\n        // the SAME contract — when it returns, `reportId` and everyone\n        // below them is in the leaving set. Trust it, do not trace it.\n        // This function already put `employeeId` into leaving, and each\n        // report's contract covers that report's whole branch — together,\n        // that is this function's full contract, kept.\n        markSubtreeAsLeaving(reportsGraph, reportId, leaving);\n    }\n};\n\nconst remainingEmployees = (ids, bosses, quitId) => {\n    const reportsGraph = buildReportsGraph(ids, bosses);\n\n    // Everyone in the quitter's subtree leaves; everyone else stays.\n    const leaving = new Set();\n    // The recursive leap of faith: trust the contract. When this\n    // call returns, the quitter and everyone below them in the tree\n    // is in the leaving set. We do not trace inside; we just keep the\n    // employees who are not in the set.\n    markSubtreeAsLeaving(reportsGraph, quitId, leaving);\n\n    const remaining = ids.filter((employeeId) => !leaving.has(employeeId));\n\n    // Sort as numbers — the default sort would compare IDs as strings.\n    remaining.sort((idOne, idTwo) => idOne - idTwo);\n\n    return remaining;\n};",
    "tests": [
      {
        "args": [
          [
            1,
            3,
            10,
            5
          ],
          [
            0,
            1,
            1,
            3
          ],
          3
        ],
        "expected": [
          1,
          10
        ]
      },
      {
        "args": [
          [
            7,
            2,
            9
          ],
          [
            0,
            7,
            7
          ],
          7
        ],
        "expected": []
      },
      {
        "args": [
          [
            5
          ],
          [
            0
          ],
          5
        ],
        "expected": []
      },
      {
        "args": [
          [
            4,
            8,
            6
          ],
          [
            0,
            4,
            4
          ],
          8
        ],
        "expected": [
          4,
          6
        ]
      },
      {
        "args": [
          [
            100,
            20,
            3
          ],
          [
            0,
            100,
            100
          ],
          3
        ],
        "expected": [
          20,
          100
        ]
      },
      {
        "args": [
          [
            2,
            4,
            6,
            8
          ],
          [
            0,
            2,
            4,
            6
          ],
          4
        ],
        "expected": [
          2
        ]
      }
    ],
    "runner": {
      "kind": "function",
      "parameterNames": [
        "ids",
        "bosses",
        "quitId"
      ]
    }
  },
  {
    "id": "counting-docked-boats",
    "title": "Counting Docked Boats",
    "category": "variant",
    "difficulty": "Medium",
    "statement": "A marina is shown as a grid. `marina[r][c]` is `\"B\"` if a boat occupies that square and `\".\"` if it is open water.\n\nEach **boat** is a straight line of one or more squares, laid out either **horizontally** or **vertically**, exactly one square wide. The layout is guaranteed valid: **no two different boats touch each other**, not even diagonally.\n\nA boat is **docked** if at least one of its squares lies on the **border** of the grid — that is, in the first row, the last row, the first column, or the last column. Boats that touch no border square are anchored out in open water.\n\nWrite a function `countDockedBoats(marina)` that returns how many boats are docked.",
    "examples": [
      {
        "input": "marina = [[\".\",\".\",\".\",\".\"],[\".\",\"B\",\"B\",\".\"],[\".\",\".\",\".\",\".\"],[\"B\",\".\",\".\",\".\"]]",
        "output": "1",
        "explanation": "There are two boats. The horizontal boat at (1,1)-(1,2) sits entirely in the middle, so it is not docked. The 1-square boat at (3,0) is in the last row (and first column), so it is docked. Answer: 1."
      },
      {
        "input": "marina = [[\"B\",\"B\",\".\",\".\",\".\"],[\".\",\".\",\".\",\"B\",\".\"],[\".\",\".\",\".\",\"B\",\".\"],[\".\",\".\",\".\",\"B\",\".\"],[\"B\",\".\",\".\",\".\",\".\"]]",
        "output": "2",
        "explanation": "Three boats: the horizontal boat at (0,0)-(0,1) touches the top row (docked), the vertical boat at (1,3)-(3,3) touches no border row or column (not docked), and the 1-square boat at (4,0) is on the bottom row (docked). Answer: 2."
      }
    ],
    "constraints": [
      "1 <= number of rows, number of columns <= 50",
      "marina[r][c] is \"B\" or \".\"",
      "Boats are straight horizontal or vertical lines, one square wide",
      "No two boats are adjacent, even diagonally"
    ],
    "functionName": "countDockedBoats",
    "solution": "const BOAT = 'B';\n\nconst getPositionString = (row, col) => `${row}, ${col}`;\nconst directions = [\n    [0, 1],\n    [1, 0],\n    [0, -1],\n    [-1, 0],\n];\n\nconst isInBounds = (grid, row, col) => {\n    const numRows = grid.length;\n    const numCols = grid[0].length;\n\n    const rowInBounds = row >= 0 && row < numRows;\n    const colInBounds = col >= 0 && col < numCols;\n\n    return rowInBounds && colInBounds;\n};\n\nconst isOnBorder = (grid, row, col) => {\n    const numRows = grid.length;\n    const numCols = grid[0].length;\n\n    const onBorderRow = row === 0 || row === numRows - 1;\n    const onBorderCol = col === 0 || col === numCols - 1;\n\n    return onBorderRow || onBorderCol;\n};\n\n// CONTRACT for boatTouchesBorder(marina, row, col, visited):\n//     when this call returns, every boat square connected to\n//     (`row`, `col`) is in the visited set, and the returned value is\n//     true if any square of that boat sits on the border of the grid.\n//     If (`row`, `col`) is not a fresh boat square, it returns false\n//     and nothing new goes in.\nconst boatTouchesBorder = (marina, row, col, visited) => {\n    // Base cases\n    if (!isInBounds(marina, row, col)) return false;\n\n    const curPositionString = getPositionString(row, col);\n    if (visited.has(curPositionString)) return false;\n\n    if (marina[row][col] !== BOAT) return false;\n\n    // Process node\n    visited.add(curPositionString);\n\n    let touchesBorder = isOnBorder(marina, row, col);\n\n    // Recurse on potential neighbors\n    for (const direction of directions) {\n        const [rowChange, colChange] = direction;\n\n        const newRow = row + rowChange;\n        const newCol = col + colChange;\n\n        // Always recurse — even after finding a border square — so the\n        // whole boat gets marked as visited exactly once.\n        // The recursive leap of faith, one level down: this call has\n        // the SAME contract — when it returns, everything connected to\n        // the neighboring square is in visited, and it reports whether it\n        // found a border square. Trust it, do not trace it. This square's\n        // own border check + each direction's guaranteed answer = exactly\n        // this function's contract.\n        const neighborTouchesBorder = boatTouchesBorder(\n            marina,\n            newRow,\n            newCol,\n            visited,\n        );\n\n        if (neighborTouchesBorder) touchesBorder = true;\n    }\n\n    return touchesBorder;\n};\n\nconst countDockedBoats = (marina) => {\n    const numRows = marina.length;\n    const numCols = marina[0].length;\n\n    let numDockedBoats = 0;\n    const visited = new Set();\n\n    for (let row = 0; row < numRows; row++) {\n        for (let col = 0; col < numCols; col++) {\n            const curPositionString = getPositionString(row, col);\n            if (visited.has(curPositionString)) continue;\n\n            if (marina[row][col] !== BOAT) continue;\n\n            // Boats never touch each other (not even diagonally), so a\n            // 4-directional DFS from here covers exactly one boat.\n            // The recursive leap of faith: trust the contract. When this\n            // call returns, this whole boat is in visited — the loop can\n            // never see it again — and `isDocked` tells us whether the boat\n            // touches the border. We do not trace inside; we just count it if\n            // it is docked.\n            const isDocked = boatTouchesBorder(marina, row, col, visited);\n            if (isDocked) numDockedBoats++;\n        }\n    }\n\n    return numDockedBoats;\n};",
    "tests": [
      {
        "args": [
          [
            [
              ".",
              ".",
              ".",
              "."
            ],
            [
              ".",
              "B",
              "B",
              "."
            ],
            [
              ".",
              ".",
              ".",
              "."
            ],
            [
              "B",
              ".",
              ".",
              "."
            ]
          ]
        ],
        "expected": 1
      },
      {
        "args": [
          [
            [
              "B",
              "B",
              ".",
              ".",
              "."
            ],
            [
              ".",
              ".",
              ".",
              "B",
              "."
            ],
            [
              ".",
              ".",
              ".",
              "B",
              "."
            ],
            [
              ".",
              ".",
              ".",
              "B",
              "."
            ],
            [
              "B",
              ".",
              ".",
              ".",
              "."
            ]
          ]
        ],
        "expected": 2
      },
      {
        "args": [
          [
            [
              ".",
              "."
            ],
            [
              ".",
              "."
            ]
          ]
        ],
        "expected": 0
      },
      {
        "args": [
          [
            [
              "B"
            ]
          ]
        ],
        "expected": 1
      },
      {
        "args": [
          [
            [
              ".",
              ".",
              "."
            ],
            [
              ".",
              "B",
              "."
            ],
            [
              ".",
              ".",
              "."
            ]
          ]
        ],
        "expected": 0
      },
      {
        "args": [
          [
            [
              "B",
              ".",
              ".",
              ".",
              "B"
            ],
            [
              "B",
              ".",
              ".",
              ".",
              "B"
            ],
            [
              ".",
              ".",
              "B",
              ".",
              "."
            ],
            [
              ".",
              ".",
              ".",
              ".",
              "."
            ],
            [
              ".",
              ".",
              ".",
              ".",
              "."
            ]
          ]
        ],
        "expected": 2
      }
    ],
    "runner": {
      "kind": "function",
      "parameterNames": [
        "marina"
      ]
    }
  },
  {
    "id": "the-balance-lock",
    "title": "The Balance Lock",
    "category": "variant",
    "difficulty": "Medium",
    "statement": "Past the rune door, the castle treasury is sealed by a balance lock: a row of dials. Dial `i` can be turned to show any one of the weights in `dials[i]`, a list of different positive whole numbers.\n\nTo try a code, you set every dial to one weight and read them from left to right. The lock works like a hand of blackjack: the weights add up, and if the total goes **over** `limit`, the lock busts. A code whose total is **at most** `limit` is safe.\n\nReturn a list of **all** safe codes. Each code is a list of the chosen weights, in dial order. You may return the codes in any order. If no code is safe, return an empty list.",
    "examples": [
      {
        "input": "dials = [[4,9],[2,7],[5]], limit = 12",
        "output": "[[4,2,5]]",
        "explanation": "4+2+5 = 11 is safe. 4,7 totals 11 after two dials, but the last dial adds 5 for 16, which busts. 9,2,5 also reaches 16. 9,7 totals 16 after two dials, so that branch busts early and the last dial is never tried."
      },
      {
        "input": "dials = [[3,8],[6,1]], limit = 9",
        "output": "[[3,6],[3,1],[8,1]]",
        "explanation": "3+6 = 9 and 8+1 = 9 land exactly on the limit, which is still safe. 3+1 = 4 is safe too. Only 8+6 = 14 goes over and busts."
      }
    ],
    "constraints": [
      "1 <= dials.length <= 6",
      "1 <= dials[i].length <= 4",
      "dials[i] contains different whole numbers from 1 to 50",
      "1 <= limit <= 300"
    ],
    "functionName": "allSafeCodes",
    "solution": "// CONTRACT for collectCodes(dials, limit, dialIndex, codeSoFar, totalSoFar, safeCodes):\n//     when this call returns, every safe full code that starts with\n//     `codeSoFar` (whose weights add up to `totalSoFar`) and continues\n//     with weights from dial `dialIndex` onward has been appended to\n//     `safeCodes`.\nconst collectCodes = (dials, limit, dialIndex, codeSoFar, totalSoFar, safeCodes) => {\n    // Base case\n    if (dialIndex === dials.length) {\n        safeCodes.push(codeSoFar);\n        return;\n    }\n\n    // Traverse neighbors\n    const weights = dials[dialIndex];\n\n    for (const weight of weights) {\n        // Like going over 21 in blackjack: a total over the limit busts.\n        // Every weight is positive, so later dials can only add more.\n        // Prune this branch now instead of finishing a doomed code.\n        const newTotal = totalSoFar + weight;\n        if (newTotal > limit) continue;\n\n        // The recursive leap of faith, one level down: this call has\n        // the SAME contract — when it returns, every safe code that\n        // starts with `codeSoFar` plus `weight` has been appended to\n        // `safeCodes`. Trust it, do not trace it. Trying every weight\n        // that does not bust, each with its guaranteed completions,\n        // covers every safe code that starts with `codeSoFar` —\n        // exactly this function's contract, kept.\n        collectCodes(dials, limit, dialIndex + 1, [...codeSoFar, weight], newTotal, safeCodes);\n    }\n};\n\nconst allSafeCodes = (dials, limit) => {\n    const safeCodes = [];\n\n    // The recursive leap of faith: trust the contract. When this\n    // call returns, `safeCodes` holds every safe code built from dial\n    // 0 onward, starting from total 0 — the complete answer.\n    collectCodes(dials, limit, 0, [], 0, safeCodes);\n\n    return safeCodes;\n};",
    "tests": [
      {
        "args": [
          [
            [
              4,
              9
            ],
            [
              2,
              7
            ],
            [
              5
            ]
          ],
          12
        ],
        "expected": [
          [
            4,
            2,
            5
          ]
        ],
        "unordered": true
      },
      {
        "args": [
          [
            [
              3,
              8
            ],
            [
              6,
              1
            ]
          ],
          9
        ],
        "expected": [
          [
            3,
            6
          ],
          [
            3,
            1
          ],
          [
            8,
            1
          ]
        ],
        "unordered": true
      }
    ],
    "runner": {
      "kind": "function",
      "parameterNames": [
        "dials",
        "limit"
      ]
    }
  },
  {
    "id": "under-the-limit",
    "title": "Under the Limit",
    "category": "variant",
    "difficulty": "Easy",
    "statement": "You are given a list `nums` of different positive whole numbers and a number `limit`.\n\nA **combination** is any group of numbers from `nums`, each used at most once. The empty combination `[]` counts too.\n\nReturn **all** combinations whose sum is **at most** `limit`. You may return the combinations in any order, and the numbers inside each combination in any order.",
    "examples": [
      {
        "input": "nums = [2,3,5], limit = 6",
        "output": "[[],[2],[2,3],[3],[5]]",
        "explanation": "Each single number is at most 6, and so is 2+3 = 5. The empty combination has sum 0, so it counts too. 2+5 = 7, 3+5 = 8, and 2+3+5 = 10 go over."
      },
      {
        "input": "nums = [4,1], limit = 5",
        "output": "[[],[4],[4,1],[1]]",
        "explanation": "4+1 = 5 lands exactly on the limit, which still counts."
      },
      {
        "input": "nums = [7], limit = 3",
        "output": "[[]]",
        "explanation": "7 is over the limit, so only the empty combination is left."
      }
    ],
    "constraints": [
      "1 <= nums.length <= 6",
      "nums contains different whole numbers from 1 to 50",
      "1 <= limit <= 300"
    ],
    "functionName": "combosUnderLimit",
    "solution": "// CONTRACT for collectCombos(nums, limit, startIndex, comboSoFar, sumSoFar, combos):\n//     when this call returns, `comboSoFar` and every longer combination\n//     that adds only numbers from index `startIndex` onward and keeps its\n//     sum at most `limit` have been appended to `combos`.\nconst collectCombos = (nums, limit, startIndex, comboSoFar, sumSoFar, combos) => {\n    // Process node: every combination we reach is under the limit, so it\n    // is an answer — including the empty combination at the root.\n    combos.push(comboSoFar);\n\n    // Traverse neighbors: add one later number at a time. There is no\n    // separate base case: when no later number fits, the loop adds nothing.\n    for (let i = startIndex; i < nums.length; i++) {\n        const newSum = sumSoFar + nums[i];\n        if (newSum > limit) continue;\n\n        // The recursive leap of faith, one level down: this call has the\n        // SAME contract — when it returns, the combination with nums[i]\n        // added and all of its longer combinations are in `combos`.\n        // Trust it, do not trace it. Only adding later numbers means each\n        // combination is built exactly once.\n        collectCombos(nums, limit, i + 1, [...comboSoFar, nums[i]], newSum, combos);\n    }\n};\n\nconst combosUnderLimit = (nums, limit) => {\n    const combos = [];\n\n    // The recursive leap of faith: trust the contract. Starting from the\n    // empty combination at index 0 collects every combination that fits.\n    collectCombos(nums, limit, 0, [], 0, combos);\n\n    return combos;\n};",
    "tests": [
      {
        "args": [
          [
            2,
            3,
            5
          ],
          6
        ],
        "expected": [
          [],
          [
            2
          ],
          [
            2,
            3
          ],
          [
            3
          ],
          [
            5
          ]
        ],
        "unordered": true
      },
      {
        "args": [
          [
            4,
            1
          ],
          5
        ],
        "expected": [
          [],
          [
            4
          ],
          [
            4,
            1
          ],
          [
            1
          ]
        ],
        "unordered": true
      },
      {
        "args": [
          [
            7
          ],
          3
        ],
        "expected": [
          []
        ],
        "unordered": true
      }
    ],
    "runner": {
      "kind": "function",
      "parameterNames": [
        "nums",
        "limit"
      ]
    }
  }
];
