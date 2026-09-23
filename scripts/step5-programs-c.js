// Pseudocode adapted from the original variant solutions in jonathan-study-site/data/variants-final-*.json.
const fixed = (key, text) => ({key, options:[{id:'fixed',text}], correct:'fixed'});
const choice = (key, correct, good, buggy, bad, feedback) => ({key, options:[{id:correct,text:good},{id:buggy,text:bad}],correct,buggy,feedback});
const programs = {
 'package-to-the-outpost': [
  choice('direction','both','Build a road list for each warehouse. For each [a, b, hours], add a → b and b → a, each costing hours.','oneway','Build a road list for each warehouse. For each [a, b, hours], add only a → b, costing hours.','A road pair allows travel both ways. Keeping only its written direction cuts off valid routes. The search must reach the target along the unique two-way route and add its hours.'),
  fixed('setup','Start with no visited warehouses.\nFunction SEARCH(warehouse, elapsed):\n  If warehouse = target, return elapsed.\n  Mark warehouse visited.\n  For each road to an unvisited next warehouse:'),
  choice('weight','hours','    arrival ← SEARCH(next warehouse, elapsed + this road’s hours)','edges','    arrival ← SEARCH(next warehouse, elapsed + 1)','Each edge carries driving hours. Adding one measures the number of roads instead. The reachable target is the same, but the returned travel time must add the road weights.'),
  fixed('tail','    If arrival is not NONE, return arrival.\n  Return NONE.\nEnd function'),
  choice('combine','route','answer ← SEARCH(hq, 0)\nReturn answer, or −1 if answer is NONE.','all','Return the sum of the hours on every road in roads.','Only roads on the route from hq to target count. Summing every branch charges for places the truck never visits. When hq is target, the trip uses no roads and takes zero hours.')
 ],
 'gold-and-silver-lights': [
  fixed('setup','Build two-way neighbor lists from wires.\nvisited ← empty set; goldCount ← 0\nFunction PAINT(bulb, color):\n  If bulb is visited, return.\n  Mark bulb visited.\n  If color = gold, add 1 to goldCount.'),
  choice('branch','all','  For every unvisited neighbor next of bulb:','first','  For only the first unvisited neighbor next of bulb, if one exists:','The wiring can branch. Following one neighbor paints only one branch, so gold bulbs in other branches disappear from the count. Visit every unvisited neighbor.'),
  choice('paint','opposite','    PAINT(next, the opposite of color)','same','    PAINT(next, color)','Every wire joins different colors. Passing the same color along an edge turns the alternating layers into one color. Flip the color at each wire before counting gold bulbs.'),
  fixed('end','End function'),
  choice('start','gold','PAINT(0, gold)\nReturn goldCount.','silver','PAINT(0, silver)\nReturn goldCount.','The problem fixes bulb 0 as gold. Starting it silver swaps the two groups. A tree can have different group sizes, so the gold count can change even though neighboring colors still differ.')
 ],
 'save-the-date-phone-chain': [
  fixed('setup','Build listeners[p] from caller: add each person to their caller’s list, in person-number order.\ncount ← 0\nFunction INFORM(person, dayHeard):'),
  choice('deadline','inclusive','  If dayHeard ≤ deadline, add 1 to count.','strict','  If dayHeard < deadline, add 1 to count.','People who hear on the deadline still count. A strict comparison removes exactly that arrival-day boundary, including the head when the deadline is day zero.'),
  choice('branch','all','  For every listener of person:','first','  For only the first listener of person, if one exists:','A caller phones everyone they are responsible for. Following only the first listener cuts off sibling branches and misses people who would hear in time.'),
  choice('wait','caller','    INFORM(listener, dayHeard + waitDays[person])','listener','    INFORM(listener, dayHeard + waitDays[listener])','The caller waits before making the call. The listener’s own delay matters only when that listener later calls others. Using the listener’s delay changes arrival days and moves people across the deadline.'),
  fixed('end','End function\nINFORM(headId, 0)\nReturn count.')
 ],
 'count-routes-to-summit': [
  fixed('setup','summit ← number of camps − 1\nvisited ← empty set\nFunction COUNT(camp):'),
  choice('visited','perroute','  Continue even if another route has already visited camp.','global','  If camp is in visited, return 0; otherwise add camp to visited.','Two different routes can join at the same camp. A shared visited set treats the second route as already counted and removes its remaining route to the summit. Count the suffix again for each arriving route.'),
  fixed('base','  If camp = summit, return 1.\n  total ← 0'),
  choice('branch','all','  For every next camp in graph[camp]:\n    total ← total + COUNT(next camp)','first','  For only the first next camp in graph[camp], if one exists:\n    total ← total + COUNT(next camp)','Every outgoing trail can begin another route. Keeping only the first branch loses the routes that begin with other trails. Add the route counts from all next camps.'),
  fixed('end','  Return total.\nEnd function'),
  choice('count','routes','Return COUNT(0).','direct','Return how many entries in graph[0] equal summit.','A route may use several trails. Counting only a direct edge from base camp to summit ignores routes through intermediate camps. The answer counts complete routes, not just adjacent destinations.')
 ],
 'routes-past-the-coffee-cart': [
  fixed('setup','customer ← number of intersections − 1\nresult ← empty list; visited ← empty set\nFunction ROUTES(place, path):'),
  choice('visited','perroute','  Continue even if another route has already visited place.','global','  If place is in visited, return; otherwise add place to visited.','Different routes can meet at the same intersection and still count separately. A global visited set cuts off later arrivals, including valid coffee routes. Keep each route’s full sequence and explore its remaining streets.'),
  fixed('append','  extended ← path with place added at the end\n  If place = customer:'),
  choice('checkpoint','require','    If extended contains checkpoint, add extended to result.','ignore','    Add extended to result.','Reaching the customer is not enough: this exact route must include the coffee cart. Without that filter, routes bypassing the cart enter the answer.'),
  fixed('return','    Return.'),
  choice('stop','customer','  Continue exploring when place = checkpoint.','checkpoint','  If place = checkpoint, add extended to result and return.','The coffee cart is a stop along the trip, not its destination. Stopping there returns unfinished routes and misses the remaining streets to the customer.'),
  fixed('end','  For every next intersection in graph[place]:\n    ROUTES(next intersection, extended)\nEnd function\nROUTES(0, empty list)\nReturn result.')
 ],
 'runes-on-the-castle-door': [
  fixed('setup','codes ← empty list\nFunction BUILD(dialIndex, prefix):\n  If dialIndex = number of dials:\n    Add prefix to codes and return.'),
  choice('choices','all','  For every rune in dials[dialIndex]:','first','  For only the first rune in dials[dialIndex]:','Every dial offers several choices. Trying only its first rune loses codes using the other runes, and may miss all valid codes when the first rune clashes with its neighbor.'),
  choice('repeat','adjacent','    If prefix is nonempty and rune equals its last rune, skip this rune.','anywhere','    If rune occurs anywhere in prefix, skip this rune.','Only neighboring dials must differ. A rune may appear again after a different rune. Rejecting every repeated rune removes valid branches and their completed codes.'),
  fixed('end','    BUILD(dialIndex + 1, prefix followed by rune)\nEnd function\nBUILD(0, empty text)\nReturn codes.')
 ],
 'gas-pocket-survey': [
  fixed('setup','Work on a copy of cave.\nIf cave[row][col] = "G":'),
  choice('drill','rupture','  Change cave[row][col] to "X" and return cave.','safe','  Change cave[row][col] to "S" and return cave.','Drilling directly into gas ruptures it. This special starting cell must become X; a safe S wrongly reports no danger. Nothing else is revealed in this case.'),
  fixed('function','Function REVEAL(r, c):\n  If (r, c) is outside the cave or its cell is not "U", return.'),
  choice('neighbors','four','  danger ← number of "G" cells directly up, down, left, and right of (r, c)','eight','  danger ← number of "G" cells in all eight surrounding positions, including diagonals','Gas passes through flat walls only. Counting diagonals adds false danger numbers and makes those cells stop a reveal that should continue. Both the numbers and the reached boundary can change.'),
  fixed('mark','  Change this cell to the digit for danger when danger > 0; otherwise change it to "S".'),
  choice('boundary','stop','  If danger = 0:\n    REVEAL each of the four up/down/left/right neighbors.','spread','  REVEAL each of the four up/down/left/right neighbors, even when danger > 0.','A numbered cell is the edge of the automatic reveal. Spreading beyond it uncovers rock the drill should leave unexplored. Show its number and stop that branch.'),
  fixed('end','End function\nREVEAL(row, col)\nReturn cave.')
 ],
 'the-balance-lock': [
  fixed('setup','codes ← empty list\nFunction BUILD(dialIndex, code, total):\n  If dialIndex = number of dials:\n    Add code to codes and return.'),
  choice('choices','all','  For every weight in dials[dialIndex]:','first','  For only the first weight in dials[dialIndex]:','Every dial offers several weights. Trying only its first weight loses codes that use the others, and may miss every safe code when the first weight busts.'),
  choice('bust','over','    If total + weight > limit, skip this weight.','atleast','    If total + weight ≥ limit, skip this weight.','A total equal to limit is safe, like 21 in blackjack. Skipping a weight when the total reaches limit removes codes that land exactly on the limit.'),
  fixed('end','    BUILD(dialIndex + 1, code followed by weight, total + weight)\nEnd function\nBUILD(0, empty list, 0)\nReturn codes.')
 ]
};

const runeRule = programs['runes-on-the-castle-door'].find(line => line.key === 'repeat');
runeRule.options.push({id:'allow',text:'    Allow this rune even when it matches the last rune in prefix.'});
runeRule.buggy = ['anywhere', 'allow'];
runeRule.feedback = {anywhere:runeRule.feedback,allow:'Each new rune sits next to the last rune already chosen. Skipping this check keeps branches with equal neighbors, so invalid completed words enter the answer.'};
const bustRule = programs['the-balance-lock'].find(line => line.key === 'bust');
bustRule.options.push({id:'weight',text:'    If weight > limit, skip this weight.'});
bustRule.buggy = ['atleast', 'weight'];
bustRule.feedback = {atleast:bustRule.feedback,weight:'The lock adds every chosen weight. Comparing one weight with limit lets a code whose running total goes over limit survive, so busted codes enter the answer.'};
module.exports = programs;
