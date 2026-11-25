/* Kotten och kroppen – människans organsystem, biologi åk 4–6.

   Lgr22 BI.4-6.2.1: "Människans organsystem. Några organs namn, utseende, placering,
   funktion och samverkan."

   Kroppen ritas i kod (SVG) med åtta organ på sina platser. Barnet pekar på organet som
   frågan gäller – tryckytan är organets egen form, inte en ruta. Nivå 1 frågar efter namnet,
   nivå 2 efter funktionen, nivå 3 efter samverkan (matens väg genom kroppen och par av organ
   som arbetar ihop). Fel svar kostar inget.

   Fakta: organens funktioner är skrivna efter Skolverkets kursplan och Läkartidningens/
   Vårdguidens beskrivningar av organsystemen (se INSKICK.md). Inga påhittade siffror. */

(function () {
  "use strict";

  /* ================================================================== *
   * DATA – ren data, kontrollerad av verify.mjs                          *
   * ================================================================== */
  var VARLD = { b: 1000, h: 660 };

  /* Varje organ: bestämd form (används i frågor och tal), funktion i en mening,
     och placering som en kort rad (används i återkopplingen). */
  var ORG = {
    hjärna: {
      namn: "hjärnan", farg: "#e3a8c0",
      funktion: "Hjärnan styr kroppen: den tar emot intryck, tänker, minns och skickar signaler till musklerna.",
      plats: "i huvudet, skyddad av skallbenet"
    },
    lungor: {
      namn: "lungorna", farg: "#f0b3ab",
      funktion: "Lungorna tar upp syre från luften du andas in och lämnar koldioxid när du andas ut.",
      plats: "i bröstkorgen, ett på varje sida om hjärtat"
    },
    hjärta: {
      namn: "hjärtat", farg: "#c8473c",
      funktion: "Hjärtat pumpar blodet runt i kroppen så att syre och näring når alla celler.",
      plats: "mitt i bröstkorgen, mellan lungorna"
    },
    matstrupe: {
      namn: "matstrupen", farg: "#cf9a68",
      funktion: "Matstrupen är ett rör som för maten från munnen ner till magsäcken.",
      plats: "från halsen ner till magsäcken"
    },
    lever: {
      namn: "levern", farg: "#96543a",
      funktion: "Levern renar blodet från slaggprodukter och bildar galla som hjälper till att bryta ner fett.",
      plats: "högt upp i magen"
    },
    magsäck: {
      namn: "magsäcken", farg: "#dd9f43",
      funktion: "Magsäcken blandar maten med magsaft och börjar bryta ner den till en gröt.",
      plats: "under lungorna, bredvid levern"
    },
    tunntarm: {
      namn: "tunntarmen", farg: "#e0907c",
      funktion: "I tunntarmen tas näringen från maten upp i blodet.",
      plats: "längst ner i magen, hopringlad"
    },
    tjocktarm: {
      namn: "tjocktarmen", farg: "#c58a5f",
      funktion: "Tjocktarmen tar upp vatten ur matresterna och bildar avföring.",
      plats: "runt tunntarmen"
    }
  };

  var ORGAN_ID = ["hjärna", "lungor", "hjärta", "matstrupe", "lever", "magsäck", "tjocktarm", "tunntarm"];

  /* Nivå 1: bara namnet. Fyra organ, alla andra syns också i kroppen som lockbeten. */
  var NAMN = [
    { ratt: ["hjärna"], fraga: "Peka på hjärnan." },
    { ratt: ["lungor"], fraga: "Peka på lungorna." },
    { ratt: ["hjärta"], fraga: "Peka på hjärtat." },
    { ratt: ["magsäck"], fraga: "Peka på magsäcken." },
    { ratt: ["lever"], fraga: "Peka på levern." },
    { ratt: ["tunntarm"], fraga: "Peka på tunntarmen." }
  ];

  /* Nivå 2: funktionen, aldrig namnet i frågan. */
  var FUNKTION = [
    { ratt: ["hjärna"], fraga: "Vilket organ styr kroppen så att du kan tänka, minnas och röra dig?" },
    { ratt: ["lungor"], fraga: "Vilket organ tar upp syre från luften du andas in?" },
    { ratt: ["hjärta"], fraga: "Vilket organ pumpar blodet runt i kroppen?" },
    { ratt: ["matstrupe"], fraga: "Vilket rör för maten från munnen ner till magsäcken?" },
    { ratt: ["lever"], fraga: "Vilket organ renar blodet och bildar galla som bryter ner fett?" },
    { ratt: ["magsäck"], fraga: "Vilket organ blandar maten med magsaft och börjar bryta ner den?" },
    { ratt: ["tunntarm"], fraga: "Var tas näringen från maten upp i blodet?" },
    { ratt: ["tjocktarm"], fraga: "Vilket organ tar upp vatten ur matresterna och bildar avföring?" }
  ];

  /* Nivå 3: samverkan – matens väg genom kroppen, och par av organ som arbetar ihop. */
  var SAMVERKAN = [
    { ratt: ["matstrupe"], fraga: "Maten har just lämnat munnen. Vilket organ kommer den till först?" },
    { ratt: ["magsäck"], fraga: "Maten har kommit ner genom matstrupen. Var hamnar den nu?" },
    { ratt: ["tunntarm"], fraga: "Magsäcken har gjort maten till gröt. Vart kommer gröten sedan?" },
    { ratt: ["tjocktarm"], fraga: "Tunntarmen har tagit upp näringen. Vart tar matresterna vägen sedan?" },
    {
      ratt: ["lungor", "hjärta"],
      fraga: "När du springer behöver musklerna mer syre. Vilka två organ arbetar extra då?",
      forklaring: "Lungorna fyller blodet med syre och hjärtat pumpar det vidare ut till musklerna."
    },
    {
      ratt: ["magsäck", "tunntarm"],
      fraga: "Vilka två organ arbetar ihop när maten ska brytas ner och näringen tas upp?",
      forklaring: "Magsäcken mosar maten till gröt och tunntarmen tar upp näringen ur gröten."
    },
    {
      ratt: ["hjärna", "lungor"],
      fraga: "Vilka två organ ser till att du andas även när du sover?",
      forklaring: "Hjärnan styr andningen utan att du tänker på det, och lungorna gör själva bytet av luft."
    }
  ];

  var NIVAA = { 1: NAMN, 2: FUNKTION, 3: SAMVERKAN };
  var RUNDA = 6;

  var KEDJA = ["magsäck", "tunntarm", "tjocktarm"];

  function organ(id) { return ORG[id] || null; }

  function uppgift(niva, forra) {
    niva = niva === 2 || niva === 3 ? niva : 1;
    var lista = NIVAA[niva], val = lista[0], försök = 0;
    do {
      val = lista[Math.floor(Math.random() * lista.length)];
      försök++;
    } while (lista.length > 1 && forra && val.ratt.join("+") === forra && försök < 60);
    var namn = val.ratt.map(function (id) { return ORG[id].namn; });
    var text;
    if (val.ratt.length === 1) {
      text = capital(namn[0]) + " " + ORG[val.ratt[0]].funktion;
    } else {
      text = capital(namn[0]) + " och " + namn[1] + " arbetar ihop. " + val.forklaring;
    }
    return {
      niva: niva, ratt: val.ratt.slice(), fraga: val.fraga, text: text,
      forklaring: val.forklaring || "", nyckel: val.ratt.join("+")
    };
  }

  function capital(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  /* ================================================================== *
   * SLUT DATA                                                            *
   * ================================================================== */

  /* ------------------------------------------------------------------ *
   * 2. Kotten (samma figur som i familjen, fem uttryck)                  *
   * ------------------------------------------------------------------ */
  function kottenInner(uttryck) {
    var F = "#b07d4b", M = "#8a5f36", O = "#2b2118", mun, ogen = "", extra = "";
    if (uttryck === "hejar") { mun = '<path d="M22 36 q8 8 16 0" fill="none" stroke="' + O + '" stroke-width="2.4" stroke-linecap="round"/>'; }
    else if (uttryck === "firar") {
      mun = '<path d="M21 34 q9 12 18 0" fill="#fff"/><path d="M21 34 q9 12 18 0" fill="none" stroke="' + O + '" stroke-width="2.4" stroke-linecap="round"/>';
      extra = '<path d="M10 12 l3 6M50 12 l-3 6M30 6 v5" stroke="#e8a33d" stroke-width="2.2" stroke-linecap="round" fill="none"/>';
    }
    else if (uttryck === "tanker") { mun = '<path d="M24 37 h11" stroke="' + O + '" stroke-width="2.4" stroke-linecap="round" fill="none"/>'; ogen = '<circle cx="46" cy="24" r="4" fill="none" stroke="' + M + '" stroke-width="1.6" opacity=".5"/>'; }
    else if (uttryck === "funderar") { mun = '<path d="M22 38 q8 -6 16 0" fill="none" stroke="' + O + '" stroke-width="2.4" stroke-linecap="round"/>'; }
    else { mun = '<path d="M22 34 q8 8 16 0" fill="none" stroke="' + O + '" stroke-width="2.4" stroke-linecap="round"/>'; }
    var oga = '<circle cx="23" cy="24" r="5.2" fill="#fff"/><circle cx="37" cy="24" r="5.2" fill="#fff"/>' +
      '<circle cx="24" cy="24.6" r="2.5" fill="' + O + '"/><circle cx="36" cy="24.6" r="2.5" fill="' + O + '"/>';
    return extra +
      '<path d="M30 6 q9 4 12 12 q9 12 4 24 q-4 12 -16 14 q-12 -2 -16 -14 q-5 -12 4 -24 q3 -8 12 -12z" fill="' + F + '"/>' +
      '<path d="M19 20 q11 -5 22 0M16 30 q14 -5 28 0M16 40 q14 -4 28 0" stroke="' + M + '" stroke-width="1.7" fill="none" opacity=".85" stroke-linecap="round"/>' +
      oga + ogen + mun;
  }
  function kottenSvg(uttryck, klass) {
    return '<svg class="' + (klass || "") + '" viewBox="0 0 60 60" aria-hidden="true">' + kottenInner(uttryck) + '</svg>';
  }

  /* ------------------------------------------------------------------ *
   * 3. Ljud – WebAudio och talsyntes, skapas vid första gesten           *
   * ------------------------------------------------------------------ */
  var ac = null, ljudPa = true;
  function ljud(frekvens, langd, typ) {
    if (!ljudPa) return;
    try {
      if (!ac) ac = new (window.AudioContext || window.webkitAudioContext)();
      var o = ac.createOscillator(), g = ac.createGain();
      o.type = typ || "sine"; o.frequency.value = frekvens;
      g.gain.value = 0.001; o.connect(g); g.connect(ac.destination);
      var t = ac.currentTime;
      g.gain.exponentialRampToValueAtTime(0.11, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.001, t + langd);
      o.start(t); o.stop(t + langd + 0.02);
    } catch (e) { }
  }
  function sag(text) {
    if (!ljudPa) return;
          try { if (window.__rost && window.__rost(text, true)) return; } catch (e) { }
    try {
      if (!("speechSynthesis" in window) || !text) return;
      var u = new SpeechSynthesisUtterance(text);
      u.lang = "sv-SE"; u.rate = 0.95; u.volume = 0.9;
      window.speechSynthesis.cancel(); window.speechSynthesis.speak(u);
    } catch (e) { }
  }
  function spar(namn, varde) { try { if (window.skolappar && window.skolappar.event) window.skolappar.event(namn, varde); } catch (e) { } }

  /* ------------------------------------------------------------------ *
   * 4. Kroppen och organen, ritade i kod                                 *
   * ------------------------------------------------------------------ */
  function kroppen() {
    return '<g aria-hidden="true">' +
      /* armar och ben bakom bålen */
      '<rect x="300" y="292" width="64" height="216" rx="32" fill="var(--hud)" stroke="var(--hud-kant)" stroke-width="3"/>' +
      '<rect x="636" y="292" width="64" height="216" rx="32" fill="var(--hud)" stroke="var(--hud-kant)" stroke-width="3"/>' +
      '<rect x="404" y="556" width="78" height="100" rx="30" fill="var(--hud)" stroke="var(--hud-kant)" stroke-width="3"/>' +
      '<rect x="518" y="556" width="78" height="100" rx="30" fill="var(--hud)" stroke="var(--hud-kant)" stroke-width="3"/>' +
      '<rect x="472" y="222" width="56" height="48" rx="16" fill="var(--hud)" stroke="var(--hud-kant)" stroke-width="3"/>' +
      /* bål */
      '<rect x="358" y="252" width="284" height="330" rx="104" fill="var(--hud)" stroke="var(--hud-kant)" stroke-width="3"/>' +
      /* huvud */
      '<circle cx="500" cy="150" r="84" fill="var(--hud)" stroke="var(--hud-kant)" stroke-width="3"/>' +
      /* ansikte: två ögon och ett leende, så kroppen känns vänlig */
      '<circle cx="474" cy="140" r="6" fill="#8a7a68"/><circle cx="526" cy="140" r="6" fill="#8a7a68"/>' +
      '<path d="M480 168 q20 14 40 0" fill="none" stroke="#8a7a68" stroke-width="4" stroke-linecap="round"/>' +
      '</g>';
  }

  /* Varje organ ritas i sin egen form. Tryckytan är samma form med osynlig,
     extra tjock kant – så pekar barnet på organet, inte på en ruta bredvid. */
  var FORM = {
    hjärna: {
      syn: '<ellipse cx="500" cy="148" rx="60" ry="50" fill="#e3a8c0"/>' +
        '<path d="M500 100 v96M462 112 q-14 20 0 36 q-12 18 4 34M538 112 q14 20 0 36 q12 18 -4 34" fill="none" stroke="#c984a3" stroke-width="5" stroke-linecap="round"/>',
      hit: '<ellipse cx="500" cy="148" rx="60" ry="50" fill="transparent" stroke="transparent" stroke-width="26"/>'
    },
    lungor: {
      syn: '<path d="M470 286 q-56 10 -62 70 q-6 56 26 76 q28 18 40 -6 q8 -18 6 -66 q-2 -54 -10 -74z" fill="#f0b3ab"/>' +
        '<path d="M530 286 q56 10 62 70 q6 56 -26 76 q-28 18 -40 -6 q-8 -18 -6 -66 q2 -54 10 -74z" fill="#f0b3ab"/>' +
        '<path d="M500 268 v46M500 300 l-24 18M500 300 l24 18" stroke="#d98d84" stroke-width="7" fill="none" stroke-linecap="round"/>',
      hit: '<path d="M470 286 q-56 10 -62 70 q-6 56 26 76 q28 18 40 -6 q8 -18 6 -66 q-2 -54 -10 -74z" fill="transparent" stroke="transparent" stroke-width="24"/>' +
        '<path d="M530 286 q56 10 62 70 q6 56 -26 76 q-28 18 -40 -6 q-8 -18 -6 -66 q2 -54 10 -74z" fill="transparent" stroke="transparent" stroke-width="24"/>'
    },
    hjärta: {
      syn: '<path d="M466 352 q0 -26 24 -26 q26 0 26 28 q0 34 -30 58 q-30 -24 -30 -58 q0 -28 26 -28 q24 0 24 26z" fill="#c8473c" transform="translate(4 6)"/>',
      hit: '<path d="M466 352 q0 -26 24 -26 q26 0 26 28 q0 34 -30 58 q-30 -24 -30 -58 q0 -28 26 -28 q24 0 24 26z" fill="transparent" stroke="transparent" stroke-width="34" transform="translate(4 6)"/>'
    },
    matstrupe: {
      syn: '<path d="M500 268 v56 q0 44 34 62 l30 16" fill="none" stroke="#cf9a68" stroke-width="16" stroke-linecap="round"/>',
      hit: '<path d="M500 268 v56 q0 44 34 62 l30 16" fill="none" stroke="transparent" stroke-width="30" stroke-linecap="round"/>'
    },
    lever: {
      syn: '<path d="M390 404 q46 -22 104 -6 q10 34 -8 62 q-52 16 -92 -6 q-14 -26 -4 -50z" fill="#96543a"/>' +
        '<path d="M404 418 q40 -10 78 0" fill="none" stroke="#7c412c" stroke-width="4" stroke-linecap="round"/>',
      hit: '<path d="M390 404 q46 -22 104 -6 q10 34 -8 62 q-52 16 -92 -6 q-14 -26 -4 -50z" fill="transparent" stroke="transparent" stroke-width="22"/>'
    },
    magsäck: {
      syn: '<path d="M566 400 q34 4 34 34 q0 30 -26 40 q-30 10 -36 -16 q-6 -24 6 -40 q8 -14 22 -18z" fill="#dd9f43"/>' +
        '<path d="M556 412 q22 8 20 32" fill="none" stroke="#bb8031" stroke-width="4" stroke-linecap="round"/>',
      hit: '<path d="M566 400 q34 4 34 34 q0 30 -26 40 q-30 10 -36 -16 q-6 -24 6 -40 q8 -14 22 -18z" fill="transparent" stroke="transparent" stroke-width="24"/>'
    },
    tunntarm: {
      syn: '<path d="M452 520 q20 -24 40 0 q20 24 40 0 q18 -22 34 0 q6 20 -12 20 h-96 q-18 0 -6 -20z" fill="none" stroke="#e0907c" stroke-width="17" stroke-linejoin="round" stroke-linecap="round"/>' +
        '<path d="M466 552 q18 -18 36 0 q18 18 34 0" fill="none" stroke="#e0907c" stroke-width="15" stroke-linecap="round"/>',
      hit: '<path d="M452 520 q20 -24 40 0 q20 24 40 0 q18 -22 34 0 q6 20 -12 20 h-96 q-18 0 -6 -20z" fill="none" stroke="transparent" stroke-width="26" stroke-linejoin="round"/>' +
        '<path d="M466 552 q18 -18 36 0 q18 18 34 0" fill="none" stroke="transparent" stroke-width="26" stroke-linecap="round"/>'
    },
    tjocktarm: {
      syn: '<path d="M418 492 h164 q14 0 14 16 v66 q0 14 -14 14 h-164 q-14 0 -14 -14 v-66 q0 -16 14 -16z" fill="none" stroke="#c58a5f" stroke-width="17" stroke-linejoin="round"/>' +
        '<path d="M470 580 v-14M530 580 v-14" stroke="#c58a5f" stroke-width="14" stroke-linecap="round"/>',
      hit: '<path d="M418 492 h164 q14 0 14 16 v66 q0 14 -14 14 h-164 q-14 0 -14 -14 v-66 q0 -16 14 -16z" fill="none" stroke="transparent" stroke-width="22" stroke-linejoin="round"/>' +
        '<path d="M470 578 v-12M530 578 v-12" stroke="transparent" stroke-width="24" stroke-linecap="round"/>'
    }
  };

  function organRit() {
    var h = [], i, id, f;
    for (i = 0; i < ORGAN_ID.length; i++) {
      id = ORGAN_ID[i]; f = FORM[id];
      h.push('<g class="organ" data-id="' + id + '" role="button" tabindex="0" aria-label="' + ORG[id].namn + '">' +
        '<g class="syn">' + f.syn + '</g>' +
        '<g class="tryck" pointer-events="all">' + f.hit + '</g>' +
        '</g>');
    }
    return h.join("");
  }

  /* ------------------------------------------------------------------ *
   * 5. Ritningen                                                        *
   * ------------------------------------------------------------------ */
  var S = {
    skarm: "start", niva: 1, item: 0, svarRatt: 0, stjarnor: 0,
    fel: 0, p: null, valda: [], uttryck: "glad", klar: false, visaRatt: false
  };

  function ritaScen() {
    var el = document.getElementById("scen");
    if (!el) return;
    el.innerHTML = kroppen() + organRit();
    /* Stående skärm: beskära sidorna så att kroppen fyller ytan och organen blir stora nog
       att peka på med en tumme. Liggande: hela världen. */
    var ruta = el.getBoundingClientRect();
    var smal = ruta.height > 0 && ruta.width / ruta.height < 1;
    el.setAttribute("viewBox", smal ? "284 34 432 620" : "0 0 " + VARLD.b + " " + VARLD.h);
    if (S.p) {
      for (var i = 0; i < S.p.ratt.length; i++) markera(S.p.ratt[i], S.visaRatt ? "ratt" : "vald");
    }
  }

  function markera(id, klass) {
    var g = document.querySelector('.organ[data-id="' + id + '"]');
    if (g) g.classList.add(klass);
  }

  function ritaFraga() {
    document.getElementById("fraga").textContent = S.p ? S.p.fraga : "";
  }
  function ritaSvar(text) {
    document.getElementById("svar").textContent = text || "";
  }
  function ritaPrickar() {
    var h = "", i;
    for (i = 0; i < RUNDA; i++) h += '<i class="' + (i < S.item ? "klar" : "") + '"></i>';
    document.getElementById("prickar").innerHTML = h;
  }
  function ritaStjarnor() {
    document.getElementById("stjarnor").textContent = "★".repeat(Math.min(S.stjarnor, 12)) + (S.stjarnor > 12 ? "+" : "");
  }
  function kottenByt(uttryck) {
    S.uttryck = uttryck;
    var el = document.getElementById("kotten");
    if (el) el.innerHTML = kottenSvg(uttryck);
  }

  /* ------------------------------------------------------------------ *
   * 6. Spelflöde                                                        *
   * ------------------------------------------------------------------ */
  var idleTimer = null;
  function startIdle() {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(function () {
      if (S.skarm === "spel" && !S.klar) { sag(S.p.fraga); spar("hint"); }
    }, 16000);
  }

  function nyUppgift() {
    S.p = uppgift(S.niva, S.p ? S.p.nyckel : null);
    S.klar = false; S.fel = 0; S.visaRatt = false; S.valda = [];
    kottenByt("glad");
    ritaScen(); ritaPrickar(); ritaFraga(); ritaSvar("");
    sag(S.p.fraga);
    startIdle();
  }

  function valj(id) {
    if (S.skarm !== "spel" || S.klar || !S.p || !organ(id)) return;
    clearTimeout(idleTimer);
    var ratt = S.p.ratt.indexOf(id) >= 0;

    if (ratt) {
      if (S.p.ratt.length > 1) {
        if (S.valda.indexOf(id) < 0) S.valda.push(id);
        markera(id, "vald");
        ljud(620, 0.09, "sine");
        sag(ORG[id].namn);
        if (S.valda.length < S.p.ratt.length) {
          ritaSvar(ORG[id].namn + " – och vilket mer?");
          startIdle();
          return;
        }
      }
      S.klar = true; S.visaRatt = true; S.item++; S.svarRatt++; S.stjarnor++;
      kottenByt("firar");
      ritaScen(); ritaPrickar(); ritaStjarnor(); ritaSvar(S.p.text);
      ljud(520, 0.12, "square");
      setTimeout(function () { ljud(780, 0.14, "sine"); }, 130);
      setTimeout(function () { ljud(1040, 0.18, "sine"); }, 260);
      sag(S.p.text);
      setTimeout(function () {
        if (S.skarm !== "spel") return;
        kottenByt("glad");
        if (S.item >= RUNDA) rundaKlar(); else nyUppgift();
      }, 3200);
      return;
    }

    /* Fel organ. Inget går förlorat – Kotten funderar och barnet får en ny chans. */
    S.fel++;
    ljud(240, 0.14, "triangle");
    setTimeout(function () { ljud(190, 0.16, "triangle"); }, 130);
    kottenByt("funderar");
    var g = document.querySelector('.organ[data-id="' + id + '"]');
    if (g) { g.classList.add("fel"); setTimeout(function () { g.classList.remove("fel"); }, 420); }
    ritaSvar("Nästan! " + (S.p.ratt.length > 1 ? "Du ska hitta två organ." : "Titta på kroppen och tänk igen."));
    if (S.fel >= 2) {
      S.visaRatt = true; S.klar = true;
      S.valda = S.p.ratt.slice();
      ritaScen();
      ritaSvar("Här är det: " + S.p.text);
      sag("Titta här. " + S.p.text);
      kottenByt("tanker");
      setTimeout(function () {
        if (S.skarm !== "spel") return;
        S.item++; S.klar = true;
        kottenByt("glad");
        if (S.item >= RUNDA) rundaKlar(); else nyUppgift();
      }, 4800);
    } else {
      sag("Tänk efter. " + S.p.fraga);
      spar("hint");
      setTimeout(function () { if (!S.klar) kottenByt("glad"); }, 900);
      startIdle();
    }
  }

  function rundaKlar() {
    S.skarm = "overlagg";
    var procent = Math.round(100 * S.svarRatt / RUNDA);
    spar("round_done", procent);
    sag("Rundan är klar. " + S.svarRatt + " av " + RUNDA + " rätt.");
    var stegUpp = S.svarRatt >= 4 && S.niva < 3;
    visaOverlay(S.svarRatt >= 4 ? "firar" : "hejar", "Rundan är klar!",
      S.svarRatt + " av " + RUNDA + " rätt. " + S.stjarnor + " stjärnor totalt." +
      (stegUpp ? " Nu blir det svårare!" : ""),
      "En runda till →", function () {
        if (stegUpp) { S.niva++; spar("level", S.niva); }
        startaRunda(S.niva);
      }, true);
  }

  function visaOverlay(uttryck, titel, text, knapptext, vidare, medNiva) {
    var ov = document.getElementById("overlay");
    document.getElementById("ov-bild").innerHTML = kottenSvg(uttryck);
    document.getElementById("ov-titel").textContent = titel;
    document.getElementById("ov-text").textContent = text;
    var b = document.getElementById("ov-nasta");
    b.textContent = knapptext;
    b.onclick = function () { ov.hidden = true; vidare(); };
    var n = document.getElementById("ov-niva");
    n.hidden = !medNiva;
    n.onclick = function () {
      ov.hidden = true;
      S.niva = S.niva >= 3 ? 1 : S.niva + 1;
      startaRunda(S.niva);
    };
    ov.hidden = false;
  }

  function startaRunda(niva) {
    S.niva = niva; S.skarm = "spel"; S.item = 0; S.svarRatt = 0; S.fel = 0; S.p = null; S.valda = [];
    document.getElementById("startskarm").hidden = true;
    document.getElementById("spel").hidden = false;
    document.getElementById("overlay").hidden = true;
    ritaStjarnor(); kottenByt("glad"); ritaPrickar(); ritaSvar("");
    spar("round_start"); spar("level", niva);
    if (niva === 2) setTimeout(function () { sag("Nu får du höra vad organet gör i stället för vad det heter."); }, 2800);
    if (niva === 3) setTimeout(function () { sag("Nu handlar det om hur organen hjälps åt."); }, 2800);
    nyUppgift();
  }

  function tipsa() {
    if (S.skarm !== "spel" || S.klar || !S.p) return;
    sag(S.p.fraga);
    spar("hint");
    kottenByt("tanker");
    setTimeout(function () { if (!S.klar) kottenByt("glad"); }, 2200);
  }

  /* ------------------------------------------------------------------ *
   * 7. Händelser och start                                              *
   * ------------------------------------------------------------------ */
  function ritaLjudIkon() {
    document.getElementById("ljudikon").innerHTML = ljudPa
      ? '<path d="M4 9h3l4-3v12l-4-3H4z"/><path d="M15 8a5 5 0 0 1 0 8"/>'
      : '<path d="M4 9h3l4-3v12l-4-3H4z"/><path d="M15 9l5 6M20 9l-5 6"/>';
  }

  function bind() {
    var scen = document.getElementById("scen");
    scen.addEventListener("pointerdown", function (e) {
      var g = e.target.closest(".organ");
      if (g) { e.preventDefault(); valj(g.dataset.id); }
    });
    scen.addEventListener("keydown", function (e) {
      if (e.key !== "Enter" && e.key !== " ") return;
      var g = e.target.closest(".organ");
      if (g) { e.preventDefault(); valj(g.dataset.id); }
    });
    document.getElementById("spela").addEventListener("click", function () { ljud(600, 0.1); startaRunda(1); });
    document.getElementById("hjalp").addEventListener("click", tipsa);
    document.getElementById("ljud").addEventListener("click", function () {
      ljudPa = !ljudPa;
      if (!ljudPa && "speechSynthesis" in window) { try { window.speechSynthesis.cancel(); } catch (e) { } }
      ritaLjudIkon(); spar("sound_off");
    });
    document.addEventListener("keydown", function (e) {
      if (S.skarm !== "spel" || S.klar || !S.p) return;
      if (e.key >= "1" && e.key <= "8") {
        var id = ORGAN_ID[Number(e.key) - 1];
        if (id) valj(id);
      }
      if (e.key === "h" || e.key === "?") tipsa();
    });
    window.addEventListener("resize", function () { if (S.p) ritaScen(); });
  }

  function init() {
    bind(); ritaLjudIkon(); ritaStjarnor(); ritaPrickar();
    kottenByt("glad");
    window.__game = {
      S: S, uppgift: uppgift, ORG: ORG, ORGAN_ID: ORGAN_ID, NIVAA: NIVAA,
      RUNDA: RUNDA, valj: valj, startaRunda: startaRunda, nyUppgift: nyUppgift,
      tipsa: tipsa, ritaScen: ritaScen, VARLD: VARLD, FORM: FORM, KEDJA: KEDJA
    };
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();