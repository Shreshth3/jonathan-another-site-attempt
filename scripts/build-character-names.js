const fs = require("fs");
const path = require("path");

const SOURCE = "https://raw.githubusercontent.com/hadley/data-baby-names/master/baby-names.csv";
const curated = [
  "Maya", "Theo", "Nia", "Felix", "Aisha", "Jonah", "Lena", "Mateo", "Priya", "Owen",
  "Zara", "Caleb", "Iris", "Miles", "Sofia", "Eli", "Noor", "Jasper", "Amara", "Leo",
  "Layla", "Finn", "Cleo", "Arjun", "Mina", "Ezra", "Rosa", "Kai", "Ada", "Nico",
  "Talia", "Hugo", "Imani", "Remy", "June", "Samir", "Mae", "Dante", "Anya", "Cole",
  "Lila", "Ravi", "Esme", "Beau", "Sana", "Axel", "Mira", "Dean", "Ines", "Jude",
  "Freya", "Zane", "Leila", "Otis", "Aya", "Marco", "Eden", "Rohan", "Nora", "Quinn",
  "Alma", "Kian", "Vera", "Toby", "Elena", "Micah", "Gia", "Ivan", "Mila", "Soren",
  "Dalia", "Max", "Yara", "Louis", "Ari", "Avery", "Brielle", "Cyrus", "Dev", "Elara"
];
async function main() {
  const response = await fetch(SOURCE);
  if (!response.ok) throw new Error(`Could not download name list: ${response.status}`);
  const rows = (await response.text()).split(/\r?\n/).slice(1).map(line => {
    const match = line.match(/^(\d+),"([A-Za-z]+)",[\d.]+,"(boy|girl)"$/);
    return match ? { year: Number(match[1]), name: match[2], sex: match[3] } : null;
  }).filter(Boolean).filter(row => row.year === 2008);
  const used = new Set(curated.map(name => name.toLowerCase()));
  const bySex = sex => rows.filter(row => row.sex === sex).map(row => row.name);
  const boys = bySex("boy"), girls = bySex("girl"), candidates = [];
  for (let index = 0; candidates.length < 520 && index < Math.max(boys.length, girls.length); index++) {
    for (const name of [girls[index], boys[index]]) if (name && !used.has(name.toLowerCase())) {
      used.add(name.toLowerCase());
      candidates.push(name);
    }
  }
  const names = [...curated, ...candidates.slice(0, 520)];
  if (names.length !== 600 || new Set(names.map(name => name.toLowerCase())).size !== 600) throw new Error("Expected 600 unique first names.");
  const output = `// 520 popular 2008 U.S. baby names, alternating the source's girl/boy lists, plus 80 curated names.\nwindow.DFS_CHARACTER_NAMES = ${JSON.stringify(names)};\n`;
  fs.writeFileSync(path.join(__dirname, "..", "character-names.js"), output);
  console.log(`Built ${names.length} unique character names.`);
}

main().catch(error => { console.error(error); process.exit(1); });
