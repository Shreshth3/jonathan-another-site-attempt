/* Safe rule interpreter for the displayed Step 5 pseudocode. No student code is evaluated. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.DFS_STEP5 = api;
})(typeof window === 'object' ? window : globalThis, function () {
  'use strict';
  let authored = null;
  const clone = value => JSON.parse(JSON.stringify(value));
  const fail = message => { throw new Error(message); };
  const need = (condition, message) => { if (!condition) fail(message); };
  const integer = (value, low, high) => Number.isInteger(value) && value >= low && value <= high;
  const distinct = values => new Set(values).size === values.length;
  function gridGroups(grid, target, diagonal = false, horizontal = false) {
    const seen = new Set(), groups = [];
    for (let row = 0; row < grid.length; row++) for (let col = 0; col < grid[0].length; col++) {
      const key = row + ',' + col;
      if (grid[row][col] !== target || seen.has(key)) continue;
      const group = [], stack = [[row, col]]; seen.add(key);
      while (stack.length) {
        const [r, c] = stack.pop(); group.push([r, c]);
        for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
          if (!dr && !dc || horizontal && dr || !diagonal && Math.abs(dr) + Math.abs(dc) !== 1) continue;
          const nr = r + dr, nc = c + dc, next = nr + ',' + nc;
          if (grid[nr]?.[nc] === target && !seen.has(next)) { seen.add(next); stack.push([nr, nc]); }
        }
      }
      groups.push(group);
    }
    return groups;
  }
  function adjacency(n, edges, directed = false) {
    const graph = Array.from({ length: n }, () => []);
    for (const [a, b, weight = 1] of edges) { graph[a].push([b, weight]); if (!directed) graph[b].push([a, weight]); }
    return graph;
  }
  function reach(graph, starts, { blocked = [], direct = false, first = false } = {}) {
    const seen = new Set(), forbidden = new Set(blocked), stack = starts.map(v => [v, 0]);
    while (stack.length) {
      const [v, depth] = stack.pop();
      if (seen.has(v) || forbidden.has(v)) continue;
      seen.add(v);
      if (!direct || depth === 0) for (const entry of (first ? graph[v].slice(0, 1) : graph[v])) stack.push([Array.isArray(entry) ? entry[0] : entry, depth + 1]);
    }
    return seen;
  }
  function components(graph, direct = false) {
    const seen = new Set(), groups = [];
    for (let node = 0; node < graph.length; node++) if (!seen.has(node)) {
      const group = [...reach(graph, [node], { direct })].filter(v => !seen.has(v));
      group.forEach(v => seen.add(v)); groups.push(group);
    }
    return groups;
  }
  function nestedEntries(items, depth = 1, result = []) {
    for (const item of items) {
      if (Array.isArray(item)) { result.push({ box: true, value: 0, depth }); nestedEntries(item, depth + 1, result); }
      else result.push({ box: false, value: item, depth });
    }
    return result;
  }
  function validate(id, input) {
    need(input && typeof input === 'object' && !Array.isArray(input), 'Use a JSON object with the named input fields.');
    need(JSON.stringify(input).length <= 100000, 'Please use a smaller input (under 100,000 characters).');
    const num = (key, low = 0, high = 100) => need(integer(input[key], low, high), key + ' must be a whole number from ' + low + ' to ' + high + '.');
    const list = key => { need(Array.isArray(input[key]), key + ' must be a list.'); return input[key]; };
    const nodes = (key, n) => { const values = list(key); need(values.length <= n && distinct(values) && values.every(v => integer(v, 0, n - 1)), key + ' must contain distinct valid node numbers.'); };
    const edgeList = (key, n, weighted = false) => {
      const edges = list(key), allowsSelf = key === 'tracks' || key === 'trails', limit = allowsSelf ? 200 : 500;
      need(edges.length <= limit, 'Use at most ' + limit + ' connections.');
      need(edges.every(e => Array.isArray(e) && e.length === (weighted ? 3 : 2) && integer(e[0], 0, n - 1) && integer(e[1], 0, n - 1) && (allowsSelf || e[0] !== e[1]) && (!weighted || integer(e[2], 1, 100))), key + ' needs valid ' + (weighted ? '[from, to, hours]' : '[from, to]') + ' connections.');
      return edges;
    };
    const tree = (n, edges) => need(edges.length === n - 1 && reach(adjacency(n, edges), [0]).size === n, 'The connections must form one tree: connected, with no loops.');
    const grid = (key, allowed) => {
      const value = list(key);
      need(value.length >= 1 && value.length <= 50 && value.every(row => Array.isArray(row) && row.length === value[0].length && row.length >= 1 && row.length <= 50 && row.every(cell => allowed.includes(cell))), key + ' must be a rectangular grid (1–50 rows and columns) containing only ' + allowed.join(', ') + '.');
      return value;
    };
    const nested = (key, min, max, requireNumber = false) => {
      list(key); let count = 0, numbers = 0;
      function walk(items, depth) { need(depth <= 50, 'Use at most 50 nesting levels.'); for (const item of items) { count++; need(count <= 1000, 'Use at most 1,000 items and boxes.'); if (Array.isArray(item)) walk(item, depth + 1); else { need(integer(item, min, max), 'Every loose item must be a whole number from ' + min + ' to ' + max + '.'); numbers++; } } }
      walk(input[key], 1); need(!requireNumber || numbers > 0, 'Include at least one integer item.');
    };
    if (['counting-constellations', 'perfect-size-campsites', 'gas-pocket-survey', 'counting-docked-boats', 'longest-freight-train'].includes(id)) {
      const key = { 'counting-constellations':'sky', 'perfect-size-campsites':'park', 'gas-pocket-survey':'cave', 'counting-docked-boats':'marina', 'longest-freight-train':'yard' }[id];
      const value = grid(key, key === 'sky' || key === 'park' ? [0, 1] : key === 'cave' ? ['U', 'G'] : [key === 'yard' ? 'T' : 'B', '.']);
      if (key === 'park') num('k', 1, 2500);
      if (key === 'cave') { num('row', 0, value.length - 1); num('col', 0, value[0].length - 1); }
      if (key === 'yard' || key === 'marina') {
        const groups = gridGroups(value, key === 'yard' ? 'T' : 'B', true);
        need(groups.every(g => g.every(p => p[0] === g[0][0]) || g.every(p => p[1] === g[0][1])), 'Each boat/train must be straight and one square wide. Different boats/trains cannot touch, even diagonally.');
      }
    } else if (['coins-on-level-k', 'kth-song-in-playlist', 'busiest-shelf-level', 'top-of-the-pile'].includes(id)) {
      nested(id === 'kth-song-in-playlist' ? 'playlist' : 'items', id === 'kth-song-in-playlist' ? 0 : id === 'busiest-shelf-level' ? -1000 : -100, id === 'kth-song-in-playlist' ? 100000 : id === 'busiest-shelf-level' ? 1000 : 100, ['busiest-shelf-level', 'top-of-the-pile'].includes(id));
      if (id === 'coins-on-level-k') num('k', 1, 50);
      if (id === 'kth-song-in-playlist') num('k', 1, 1000);
    } else if (['biggest-study-group', 'trusted-courier-networks'].includes(id)) {
      const key = id === 'biggest-study-group' ? 'worked' : 'trust', matrix = list(key), max = key === 'worked' ? 1 : 10;
      need(matrix.length >= 1 && matrix.length <= 100 && matrix.every(row => Array.isArray(row) && row.length === matrix.length), key + ' must be a square matrix, with 1–100 rows.');
      need(matrix.every((row, r) => row.every((value, c) => integer(value, 0, max) && matrix[c][r] === value) && row[r] === max), key + ' must be symmetric, with diagonal values ' + max + '.');
      if (key === 'trust') num('k', 1, 10);
    } else if (['who-keeps-their-job', 'shut-the-garden-valve'].includes(id)) {
      const ids = list('ids'), parents = list(id === 'who-keeps-their-job' ? 'bosses' : 'feeds');
      need(ids.length >= 1 && ids.length <= 100 && distinct(ids) && ids.every(v => integer(v, 1, 10000)), 'ids must contain 1–100 distinct positive IDs (at most 10000).');
      need(parents.length === ids.length && parents.filter(v => v === 0).length === 1 && parents.every(v => v === 0 || ids.includes(v)), 'Use one parent per ID and exactly one root with parent 0.');
      tree(ids.length, parents.flatMap((p, i) => p === 0 ? [] : [[ids.indexOf(p), i]]));
      const start = id === 'who-keeps-their-job' ? 'quitId' : 'shutId'; need(ids.includes(input[start]), start + ' must be one of the IDs.');
      if (start === 'shutId') need(list('liters').length === ids.length && input.liters.every(v => integer(v, 1, 1000)), 'liters needs one whole number from 1–1000 per sprinkler.');
    } else if (['museum-vault-keyring', 'dungeon-gold-run', 'count-routes-to-summit', 'routes-past-the-coffee-cart'].includes(id)) {
      const key = id === 'museum-vault-keyring' ? 'vaults' : id === 'dungeon-gold-run' ? 'rooms' : 'graph', graph = list(key), dag = key === 'graph';
      need(graph.length >= (dag ? 2 : 1) && graph.length <= (dag ? 10 : 100), key + ' has an invalid number of nodes.');
      need(graph.every((row, i) => Array.isArray(row) && distinct(row) && row.length <= graph.length && row.every(v => integer(v, 0, graph.length - 1) && (!dag || v !== i))), key + ' must list distinct valid neighbor/key numbers for each node.');
      if (dag) {
        const status = Array(graph.length).fill(0);
        function visit(v) { need(status[v] !== 1, 'Trails/streets must not form a cycle.'); if (status[v] === 2) return; status[v] = 1; graph[v].forEach(visit); status[v] = 2; }
        graph.forEach((_, i) => visit(i));
      }
      if (id === 'museum-vault-keyring') nodes('startKeys', graph.length);
      if (id === 'dungeon-gold-run') need(list('gold').length === graph.length && input.gold.every(v => integer(v, 0, 1000)), 'gold needs one whole number from 0–1000 per room.');
      if (id === 'routes-past-the-coffee-cart') num('checkpoint', 1, graph.length - 2);
    } else if (id === 'under-the-limit') {
      const nums = list('nums'); need(nums.length >= 1 && nums.length <= 6 && distinct(nums) && nums.every(v => integer(v, 1, 50)), 'nums must have 1–6 different whole numbers from 1 to 50.');
      num('limit', 1, 300);
    } else if (id === 'the-balance-lock') {
      const dials = list('dials'); need(dials.length >= 1 && dials.length <= 6 && dials.every(v => Array.isArray(v) && v.length >= 1 && v.length <= 4 && distinct(v) && v.every(w => integer(w, 1, 50))), 'Use 1–6 dials, each with 1–4 different whole numbers from 1 to 50.');
      num('limit', 1, 300);
    } else if (id === 'runes-on-the-castle-door') {
      const dials = list('dials'); need(dials.length >= 1 && dials.length <= 6 && dials.every(v => typeof v === 'string' && /^[a-z]{1,4}$/.test(v) && distinct([...v])), 'Use 1–6 dials, each with 1–4 distinct lowercase letters.');
    } else {
      num('n', 1, 100);
      if (id === 'save-the-date-phone-chain') {
        num('headId', 0, input.n - 1); num('deadline', 0, 10000);
        const callers = list('caller'); need(callers.length === input.n && callers[input.headId] === -1 && callers.every((v, i) => i === input.headId ? v === -1 : integer(v, 0, input.n - 1)), 'caller must name one head (-1) and a valid caller for everyone else.');
        tree(input.n, callers.flatMap((v, i) => v === -1 ? [] : [[v, i]]));
        need(list('waitDays').length === input.n && input.waitDays.every(v => integer(v, 0, 100)), 'waitDays needs one whole number from 0–100 per person.');
      } else {
        const key = { 'one-color-metro-ride':'tracks', 'villages-without-wells':'paths', 'flooded-campsite-trails':'trails', 'office-rumor-reach':'friendships', 'package-to-the-outpost':'roads', 'gold-and-silver-lights':'wires' }[id];
        need(key, 'Unknown Step 5 problem.'); const edges = edgeList(key, input.n, key === 'roads');
        if (key === 'roads' || key === 'wires') tree(input.n, edges);
        for (const parameter of { tracks:['source','destination'], paths:[], trails:['start','finish'], friendships:['start'], roads:['hq','target'], wires:[] }[key]) num(parameter, 0, input.n - 1);
        if (key === 'tracks') need(list('colors').length === edges.length && input.colors.every(v => ['red','blue'].includes(v)), 'colors needs one red or blue entry per track.');
        if (key === 'paths') nodes('wells', input.n);
        if (key === 'trails') nodes('flooded', input.n);
        if (key === 'friendships') need(distinct(edges.map(e => e.slice().sort((a,b)=>a-b).join(','))), 'List each friendship only once.');
      }
    }
    return input;
  }
  function execute(id, input, rules) {
    const i = clone(input), r = rules;
    const sum = values => values.reduce((a, b) => a + b, 0);
    if (id === 'counting-constellations') {
      const groups = gridGroups(i.sky, 1, r.neighbors === 'eight');
      return sum(groups.map(g => r.isolated === 'skip' && g.length === 1 ? 0 : r.count === 'stars' ? g.length : 1));
    }
    if (id === 'perfect-size-campsites') {
      const groups = gridGroups(i.park, 1, r.neighbors === 'eight');
      return sum(groups.filter(g => r.size === 'atleast' ? g.length >= i.k : g.length === i.k).map(g => r.count === 'squares' ? g.length : 1));
    }
    if (id === 'counting-docked-boats') {
      const groups = gridGroups(i.marina, 'B');
      const border = ([row,col]) => r.border === 'top' ? row === 0 : row === 0 || col === 0 || row === i.marina.length - 1 || col === i.marina[0].length - 1;
      return sum(groups.map(g => (r.inspect === 'first' ? [g[0]] : g).some(border) ? r.count === 'squares' ? g.length : 1 : 0));
    }
    if (id === 'longest-freight-train') {
      const lengths = gridGroups(i.yard, 'T', false, r.neighbors === 'horizontal').map(g => g.length);
      if (!lengths.length) return 0;
      return r.combine === 'sum' ? sum(lengths) : r.combine === 'last' ? lengths[lengths.length-1] : Math.max(...lengths);
    }
    if (['coins-on-level-k','busiest-shelf-level','top-of-the-pile','kth-song-in-playlist'].includes(id)) {
      let entries = nestedEntries(id === 'kth-song-in-playlist' ? i.playlist : i.items, r.depth === 'zero' ? 0 : 1);
      if (id === 'coins-on-level-k') { let values = entries.filter(e => !e.box && (r.level === 'through' ? e.depth <= i.k : e.depth === i.k)).map(e => e.value); return r.combine === 'first' ? values[0] || 0 : sum(values); }
      if (id === 'busiest-shelf-level') {
        const totals = new Map();
        for (const e of entries) if (!e.box || r.items === 'boxes') totals.set(e.depth, (totals.get(e.depth) || 0) + (r.count === 'values' ? e.value : 1));
        const levels = [...totals.keys()].sort((a,b)=>a-b); let best = levels[0];
        for (const depth of levels) if (totals.get(depth) > totals.get(best) || r.tie === 'deep' && totals.get(depth) === totals.get(best)) best = depth;
        return best;
      }
      if (id === 'top-of-the-pile') {
        entries = entries.filter(e=>!e.box); const depth = r.level === 'deepest' ? Math.max(...entries.map(e=>e.depth)) : Math.min(...entries.map(e=>e.depth));
        let values = entries.filter(e=>r.select === 'all' || e.depth === depth).map(e=>e.value);
        return r.combine === 'first' ? values[0] : sum(values);
      }
      let songs;
      if (r.order === 'breadth') songs = entries.filter(e=>!e.box && (r.open === 'one' ? e.depth <= 2 : true)).sort((a,b)=>a.depth-b.depth).map(e=>e.value);
      else songs = entries.filter(e=>!e.box && (r.open === 'one' ? e.depth <= 2 : true)).map(e=>e.value);
      return songs[i.k - (r.index === 'zero' ? 0 : 1)] ?? -1;
    }
    if (id === 'who-keeps-their-job' || id === 'shut-the-garden-valve') {
      const parents = id === 'who-keeps-their-job' ? i.bosses : i.feeds;
      const startId = id === 'who-keeps-their-job' ? i.quitId : i.shutId;
      const edges = parents.flatMap((p,index)=>p === 0 ? [] : [[i.ids.indexOf(p),index]]);
      const graph = adjacency(i.ids.length, r.direction === 'upstream' ? edges.map(([a,b])=>[b,a]) : edges, true);
      const selected = reach(graph,[i.ids.indexOf(startId)],{direct:r.walk === 'direct'});
      if (r.include === 'omit') selected.delete(i.ids.indexOf(startId));
      if (id === 'who-keeps-their-job') return i.ids.filter((_, index)=>!selected.has(index)).sort((a,b)=>a-b);
      return sum([...selected].map(index=>r.lookup === 'id' ? i.liters[i.ids[index]] || 0 : i.liters[index]));
    }
    if (id === 'museum-vault-keyring' || id === 'dungeon-gold-run') {
      const graph = id === 'museum-vault-keyring' ? i.vaults : i.rooms;
      const starts = id === 'museum-vault-keyring' ? i.startKeys : [0];
      const selected = reach(r.direction === 'both' ? adjacency(graph.length,graph.flatMap((keys,from)=>keys.map(to=>[from,to]))) : graph, r.starts === 'first' ? starts.slice(0,1) : starts, {direct:r.keys === 'starting',first:r.keys === 'first'});
      if (id === 'museum-vault-keyring') return selected.size;
      return r.collect === 'count' ? selected.size : sum([...selected].map(v=>i.gold[v]));
    }
    if (id === 'office-rumor-reach') {
      const seen=reach(adjacency(i.n,i.friendships,r.direction==='oneway'),[i.start],{direct:r.walk==='direct'});
      return seen.size - (r.include === 'omit' ? 1 : 0);
    }
    if (id === 'flooded-campsite-trails') {
      const blocked = r.block === 'finishallowed' ? i.flooded.filter(v=>v!==i.finish) : i.flooded;
      return reach(adjacency(i.n,i.trails,r.direction==='oneway'),[i.start],{blocked, direct:r.walk==='direct'}).has(i.finish);
    }
    if (id === 'one-color-metro-ride') {
      let seen = new Set();
      const colors = r.lines === 'red' ? ['red'] : ['red','blue'];
      for (const color of colors) {
        const graph = adjacency(i.n,i.tracks.filter((_,j)=>r.filter==='mixed'||i.colors[j]===color));
        if (r.visited === 'fresh') seen = new Set();
        const stack = [i.source];
        while(stack.length) {const v=stack.pop(); if(seen.has(v))continue; seen.add(v); if(v===i.destination)return true; for(const [to]of graph[v])stack.push(to);}
      }
      return false;
    }
    if (id === 'villages-without-wells') {
      const graph=adjacency(i.n,i.paths), groups=components(graph);
      return groups.filter(g=>!(r.isolated==='skip'&&g.length===1)).filter(g=>r.well==='root' ? !i.wells.includes(g[0]) : r.well==='every' ? !g.every(v=>i.wells.includes(v)) : !g.some(v=>i.wells.includes(v))).length;
    }
    if (id === 'biggest-study-group' || id === 'trusted-courier-networks') {
      const matrix=id === 'biggest-study-group' ? i.worked : i.trust;
      const graph=matrix.map((row,from)=>row.flatMap((v,to)=>from!==to&&(id==='biggest-study-group'?v===1:r.threshold==='strict'?v>i.k:r.threshold==='equal'?v===i.k:v>=i.k)?[to]:[]));
      let groups=components(graph,r.walk==='direct');
      if(id==='trusted-courier-networks')return r.isolated==='skip'?groups.filter(g=>g.length>1).length:groups.length;
      const sizes=groups.map(g=>g.length*(r.diagonal==='double'?2:1));
      return r.combine==='last'?sizes[sizes.length-1]:Math.max(...sizes);
    }
    if (id === 'package-to-the-outpost') {
      const graph=adjacency(i.n,i.roads,r.direction==='oneway'), seen=new Set();
      function walk(v,total){ if(v===i.target)return total; seen.add(v); for(const [to,hours]of graph[v])if(!seen.has(to)){const found=walk(to,total+(r.weight==='edges'?1:hours));if(found!==null)return found;}return null; }
      if(r.combine==='all')return sum(i.roads.map(e=>e[2]));
      return walk(i.hq,0) ?? -1;
    }
    if (id === 'gold-and-silver-lights') {
      const graph=adjacency(i.n,i.wires), seen=new Set();let gold=0;
      function walk(v,isGold){if(seen.has(v))return;seen.add(v);if(isGold)gold++;const next=graph[v].filter(([to])=>!seen.has(to));for(const [to]of(r.branch==='first'?next.slice(0,1):next))walk(to,r.paint==='same'?isGold:!isGold);}
      walk(0,r.start==='gold');return gold;
    }
    if (id === 'save-the-date-phone-chain') {
      const graph=adjacency(i.n,i.caller.flatMap((v,to)=>v===-1?[]:[[v,to]]),true);let count=0;
      function walk(v,day){if(r.deadline==='strict'?day<i.deadline:day<=i.deadline)count++;for(const [to]of(r.branch==='first'?graph[v].slice(0,1):graph[v]))walk(to,day+i.waitDays[r.wait==='listener'?to:v]);}
      walk(i.headId,0);return count;
    }
    if (id === 'count-routes-to-summit' || id === 'routes-past-the-coffee-cart') {
      const paths=[], seen=new Set();
      function walk(v,path){if(r.visited==='global'&&seen.has(v))return;seen.add(v);const next=[...path,v];
        if(v===i.graph.length-1){if(id==='count-routes-to-summit'||(r.checkpoint==='ignore'||next.includes(i.checkpoint)))paths.push(next);return;}
        if(id==='routes-past-the-coffee-cart'&&r.stop==='checkpoint'&&v===i.checkpoint){paths.push(next);return;}
        for(const to of(r.branch==='first'?i.graph[v].slice(0,1):i.graph[v]))walk(to,next);
      }
      walk(0,[]);return id==='count-routes-to-summit'?(r.count==='direct'?i.graph[0].filter(v=>v===i.graph.length-1).length:paths.length):paths;
    }
    if (id === 'runes-on-the-castle-door') {
      const result=[];
      function walk(prefix,index){if(index===i.dials.length){result.push(prefix);return;}for(const char of(r.choices==='first'?i.dials[index].slice(0,1):i.dials[index])){if(r.repeat==='anywhere'?prefix.includes(char):r.repeat==='allow'?false:prefix.endsWith(char))continue;walk(prefix+char,index+1);}}
      walk('',0);return r.finish==='short'?result.map(word=>word.slice(0,-1)):result;
    }
    if (id === 'under-the-limit') {
      const result=[];
      function walk(start,combo,total){if(r.record==='always'||combo.length)result.push(combo);for(let index=r.loop==='all'?0:start;index<i.nums.length;index++){const number=i.nums[index];if(r.loop==='all'&&combo.includes(number))continue;if(r.bust==='atleast'?total+number>=i.limit:total+number>i.limit)continue;walk(index+1,[...combo,number],total+number);}}
      walk(0,[],0);return result;
    }
    if (id === 'the-balance-lock') {
      const result=[];
      function walk(code,total,index){if(index===i.dials.length){result.push(code);return;}for(const weight of(r.choices==='first'?i.dials[index].slice(0,1):i.dials[index])){if(r.bust==='atleast'?total+weight>=i.limit:r.bust==='weight'?weight>i.limit:total+weight>i.limit)continue;walk([...code,weight],total+weight,index+1);}}
      walk([],0,0);return result;
    }
    if (id === 'gas-pocket-survey') {
      const cave=i.cave, seen=new Set();
      const neighbors=(row,col,diagonal)=>{const result=[];for(let dr=-1;dr<=1;dr++)for(let dc=-1;dc<=1;dc++)if((dr||dc)&&(diagonal||Math.abs(dr)+Math.abs(dc)===1)&&cave[row+dr]?.[col+dc]!==undefined)result.push([row+dr,col+dc]);return result;};
      if(cave[i.row][i.col]==='G'){cave[i.row][i.col]=r.drill==='safe'?'S':'X';return cave;}
      const stack=[[i.row,i.col]];
      while(stack.length){const [row,col]=stack.pop(),key=row+','+col;if(seen.has(key)||cave[row][col]!=='U')continue;seen.add(key);const count=neighbors(row,col,r.neighbors==='eight').filter(([a,b])=>cave[a][b]==='G').length;cave[row][col]=count?String(count):'S';if(!count||r.boundary==='spread')stack.push(...neighbors(row,col,false));}
      return cave;
    }
    fail('Unknown Step 5 problem.');
  }
  function specFor(id) {
    if (authored) return authored.find(s=>s.id===id);
    return (typeof window==='object'?window.DFS_VISUAL_DATA?.problems:[])?.find(p=>p.id===id)?.debuggingLesson;
  }
  function equal(id, a, b) {
    // Neither the combinations' order nor the numbers' order inside one matters; repeats still do.
    if (id === 'under-the-limit' && Array.isArray(a) && Array.isArray(b)) { const key = list => JSON.stringify(list.map(v => Array.isArray(v) ? JSON.stringify([...v].sort((x, y) => x - y)) : JSON.stringify(v)).sort()); return key(a) === key(b); }
    if (['routes-past-the-coffee-cart','runes-on-the-castle-door','the-balance-lock'].includes(id) && Array.isArray(a) && Array.isArray(b)) return JSON.stringify(a.map(v=>JSON.stringify(v)).sort())===JSON.stringify(b.map(v=>JSON.stringify(v)).sort());
    return JSON.stringify(a)===JSON.stringify(b);
  }
  function getRules(challenge, selected) {
    need(Array.isArray(selected) && selected.length === challenge.lines.length, 'Choose one rule for every pseudocode line.');
    return Object.fromEntries(challenge.lines.map((line,index)=>{need(line.options.some(o=>o.id===selected[index]), 'One pseudocode rule is invalid.');return [line.key,selected[index]];}));
  }
  function grade(id, caseId, inputText, correctText, buggyText, selectedLines) {
    try {
      const spec=specFor(id);need(spec,'Step 5 is unavailable for this problem.');const challenge=spec.cases.find(c=>c.id===caseId);need(challenge,'Unknown challenge.');
      let input, correctGuess, buggyGuess;
      try{input=JSON.parse(inputText);}catch{fail('Your input is not valid JSON yet. Use double quotes around field names and text.');}
      validate(id,input);
      try{correctGuess=JSON.parse(correctText);}catch{fail('Write the correct answer as JSON: a number, true/false, or a list.');}
      try{buggyGuess=JSON.parse(buggyText);}catch{fail('Write this code’s answer as JSON: a number, true/false, or a list.');}
      const buggyRules=getRules(challenge,challenge.lines.map(l=>l.selected)), repairedRules=getRules(challenge,selectedLines);
      const correctOutput=execute(id,input,spec.correctRules), buggyOutput=execute(id,input,buggyRules);
      const checks={counterexample:!equal(id,correctOutput,buggyOutput),correctPrediction:equal(id,correctGuess,correctOutput),buggyPrediction:equal(id,buggyGuess,buggyOutput),repair:true};
      for(const test of [input,...spec.tests.map(t=>t.input)])if(!equal(id,execute(id,test,spec.correctRules),execute(id,test,repairedRules))){checks.repair=false;break;}
      const ok=Object.values(checks).every(Boolean);
      let feedback;
      if(!checks.counterexample)feedback='This input gives the same answer in both programs. Try an input where the changed rule matters.';
      else if(!checks.correctPrediction||!checks.buggyPrediction)feedback='Your input exposes the bug. Recheck what each program returns, then update your predictions.';
      else if(!checks.repair)feedback='Your input and both answers are right. The edited code still fails another valid input. Keep working on the repair.';
      else feedback='You found a working counterexample and repaired the code. '+challenge.feedback;
      return {ok,feedback,checks,correctOutput,buggyOutput};
    }catch(error){return {ok:false,feedback:error.message,checks:{}};}
  }
  function gradeEvidence(id, caseId, input, correctGuess, buggyGuess) {
    const spec = specFor(id), challenge = spec?.cases.find(c => c.id === caseId);
    if (!challenge) return {ok:false, feedback:'Unknown challenge.'};
    const result = grade(id, caseId, JSON.stringify(input), JSON.stringify(correctGuess), JSON.stringify(buggyGuess), challenge.lines.map(line => spec.correctRules[line.key]));
    if (result.ok) result.feedback = 'Your input exposes the mistake, and both outputs are right.';
    return result;
  }
  return {gradeEvidence,setSpecs(specs){authored=specs;},validate,execute,equal,grade,getRules};
});
