// Kontrollerar organdata och uppgifterna i public/app.js:
//  – alla åtta organ har bestämd form, funktion i en mening och en plats,
//  – varje organ är rätt svar någon gång (annars lär sig barnet aldrig organet),
//  – nivå 2-frågan avslöjar aldrig organets namn,
//  – par-uppgifterna har två olika organ och en förklaring,
//  – matens väg genom kroppen stämmer (matstrupe → magsäck → tunntarm → tjocktarm),
//  – uppgiftsgeneratorn väljer bara rätt svar som finns, rätt nivå och aldrig samma två gånger i rad.
//   node verify.mjs
import { readFileSync } from "node:fs";

const src = readFileSync(new URL("./public/app.js", import.meta.url), "utf8");
const start = src.indexOf("var VARLD =");
const slut = src.indexOf("SLUT DATA");
if (start < 0 || slut < 0) throw new Error("hittar inte den rena datadelen i app.js");
const ren = src.slice(start, src.lastIndexOf("/*", slut));
const G = eval("(function(){" + ren + "\nreturn {VARLD, ORG, ORGAN_ID, NAMN, FUNKTION, SAMVERKAN, NIVAA, RUNDA, KEDJA, uppgift, organ};})()");

let seed = 20261125;
Math.random = function () { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };

let fel = 0;
const kolla = (c, m, p) => { if (!c) { fel++; if (fel <= 30) console.log("FEL", m, JSON.stringify(p)); } };

const ids = G.ORGAN_ID;
kolla(ids.length === 8, "antal organ", ids.length);
kolla(new Set(ids).size === ids.length, "dubblett i ORGAN_ID", ids);

for (const id of ids) {
  const o = G.ORG[id];
  kolla(!!o, "organ saknas i ORG", id);
  if (!o) continue;
  kolla(typeof o.namn === "string" && o.namn.length > 3, "dåligt namn", id);
  kolla(/^(hjärnan|lungorna|hjärtat|matstrupen|levern|magsäcken|tunntarmen|tjocktarmen)$/.test(o.namn), "namnet ska stå i bestämd form", o.namn);
  kolla(/\.$/.test(o.funktion), "funktionen ska vara en hel mening", o.funktion);
  kolla(o.funktion.length > 40 && o.funktion.length < 200, "funktionens längd", o.funktion.length);
  kolla(typeof o.plats === "string" && o.plats.length > 8, "platsen saknas", o.plats);
  kolla(/^#[0-9a-f]{6}$/i.test(o.farg), "färg", o.farg);
}
kolla(Object.keys(G.ORG).length === ids.length, "ORG har organ som inte finns i ORGAN_ID", Object.keys(G.ORG));

// rätt svar måste finnas, och varje organ måste vara rätt svar minst en gång
const seddaSvar = new Set();
for (const niva of [1, 2, 3]) {
  const lista = G.NIVAA[niva];
  kolla(Array.isArray(lista) && lista.length >= 4, "för få uppgifter på nivån", { niva, n: lista && lista.length });
  for (const u of lista) {
    kolla(Array.isArray(u.ratt) && u.ratt.length >= 1, "uppgift utan svar", u);
    kolla(new Set(u.ratt).size === u.ratt.length, "samma organ två gånger i svaret", u);
    for (const id of u.ratt) kolla(!!G.ORG[id], "svaret finns inte i kroppen", { niva, id, fraga: u.fraga });
    kolla(typeof u.fraga === "string" && u.fraga.length > 10 && /\?$|\.$/.test(u.fraga), "dålig fråga", u.fraga);
    if (u.ratt.length === 1) seddaSvar.add(u.ratt[0]);
    if (u.ratt.length === 2) {
      kolla(typeof u.forklaring === "string" && u.forklaring.length > 30, "par-uppgift utan förklaring", u.fraga);
      kolla(/två/.test(u.fraga), "par-frågan ska säga att det är två organ", u.fraga);
    }
  }
}
for (const id of ids) kolla(seddaSvar.has(id), "organet är aldrig rätt svar", id);

// nivå 2 får inte avslöja namnet
for (const u of G.FUNKTION) {
  const rot = G.ORG[u.ratt[0]].namn.replace(/(an|en|at|orna|na|t)$/, "");
  kolla(!u.fraga.toLowerCase().includes(rot.toLowerCase()), "nivå 2-frågan avslöjar namnet", { fraga: u.fraga, rot });
}

// matens väg genom kroppen: kedjefrågorna måste följa ordningen
kolla(G.KEDJA.join(",") === "magsäck,tunntarm,tjocktarm", "KEDJA", G.KEDJA);
const ordning = [];
for (const u of G.SAMVERKAN) {
  if (u.ratt.length === 1 && ["matstrupe", "magsäck", "tunntarm", "tjocktarm"].includes(u.ratt[0])) ordning.push(u.ratt[0]);
}
kolla(ordning.join(",") === "matstrupe,magsäck,tunntarm,tjocktarm", "kedjan i nivå 3 är inte i ordning", ordning);

// generatorn
let forra = null;
const setts = { 1: new Set(), 2: new Set(), 3: new Set() };
for (let k = 0; k < 30000; k++) {
  for (const niva of [1, 2, 3]) {
    const p = G.uppgift(niva, forra);
    setts[niva].add(p.nyckel);
    kolla(p.niva === niva, "fel nivå", p.niva);
    kolla(p.ratt.length >= 1 && p.ratt.length <= 2, "fel antal svar", p);
    for (const id of p.ratt) kolla(!!G.ORG[id], "svaret finns inte", p);
    kolla(typeof p.fraga === "string" && p.fraga.length > 10, "frågan saknas", p);
    kolla(p.text.length > p.fraga.length * 0.4, "återkopplingen är för kort", p.text);
    kolla(p.nyckel === p.ratt.join("+"), "nyckeln stämmer inte", p);
    if (forra) kolla(p.nyckel !== forra, "samma uppgift två gånger i rad", p);
    forra = p.nyckel;
  }
}
for (const niva of [1, 2, 3]) {
  kolla(setts[niva].size === G.NIVAA[niva].length, "generatorn når inte alla uppgifter", { niva, sedda: setts[niva].size, alla: G.NIVAA[niva].length });
}

kolla(G.RUNDA >= 5 && G.RUNDA <= 8, "rundans längd", G.RUNDA);
kolla(G.VARLD.b === 1000 && G.VARLD.h === 660, "världens mått", G.VARLD);

console.log(fel === 0 ? "OK – " + ids.length + " organ, " + (G.NAMN.length + G.FUNKTION.length + G.SAMVERKAN.length) + " uppgifter, 30 000 dragningar utan fel" : fel + " fel");
process.exit(fel === 0 ? 0 : 1);