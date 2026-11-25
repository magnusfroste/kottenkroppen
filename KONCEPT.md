# Kotten och kroppen – organen och deras uppgifter

**Mål (en sak per app):** barnet ska kunna peka ut åtta organ i kroppen, säga vad de gör och
förstå hur de hjälps åt. Inget annat finns i appen.

**Målgrupp:** biologi åk 4–6 (10–12 år). Läskunniga, men frågan läses ändå upp – en elev som
har svårt att läsa ska kunna spela.

**Kärnmekanik (touch först):** kroppen står på skärmen med organen utritade på sina platser.
Kotten frågar, barnet pekar på organet. Tryckytan är organets egen form (med osynlig, tjock
kant), inte en ruta bredvid – det är placeringen och utseendet som tränas, inte att hitta en
knapp.

- Nivå 1: namnet – "Peka på magsäcken."
- Nivå 2: funktionen – "Vilket organ pumpar blodet runt i kroppen?"
- Nivå 3: samverkan – matens väg (matstrupe → magsäck → tunntarm → tjocktarm) och par som
  arbetar ihop (lungorna + hjärtat, magsäcken + tunntarmen, hjärnan + lungorna).

**5-minuterssession:** sex frågor per runda, ca 3–4 minuter, "En runda till →" och "Byt nivå".

**Belöning barnet kan berätta om:** stjärnor för varje svar som gick rätt på första försöket,
och att det kan namnge organen och säga vad de gör hemma.

**Vad barnet lär:** organens namn, utseende, placering och funktion, samt grundläggande
samverkan (matens väg, blodets syre). Fakta i en mening per organ, skrivna efter Skolverkets
kursplan och allmänna beskrivningar av organsystemen.

**Lgr22:** BI.4-6.2.1 – "Människans organsystem. Några organs namn, utseende, placering,
funktion och samverkan." (citat ordagrant ur get_curriculum)

**Varför det funkar på iPad:** en enda bild utan scroll, stora tryckytor (52–166 px uppmätta),
ingen text som måste läsas, inget som tar slut och inget som straffar ett fel svar. Kroppen
beskärs i stående läge ("284 34 432 620") så att organen blir stora nog för en tumme.

## Testplan (mätbara krav)

1. `node verify.mjs` – 0 fel: alla organ har namn/funktion/plats, varje organ är rätt svar
   minst en gång, nivå 2 avslöjar aldrig namnet, paren har två olika organ och en förklaring,
   matens väg är i rätt ordning, 30 000 dragningar ur uppgiftsgeneratorn utan fel.
2. 0 px scroll i 1024×768, 768×1024, 390×844 och 1440×900, både på startskärmen och i spelet.
3. Varje organ måste ha en egen, nåbar tryckyta – mätt med `document.elementFromPoint` över
   hela ytan, inte genom att titta på bilden.
4. En hel runda ska gå att spela med pekdon på den driftsatta adressen, med poäng, prickar,
   återkoppling och slutskärm.
5. Par-frågan ska kräva båda organen och förklara samverkan när båda är valda.
6. Fel svar: ingen förlust, frågan läses upp igen, efter två försök lyser rätt organ.
7. `check_app` 15/15.

## Testresultat (2026-11-25)

- `node verify.mjs`: **OK – 8 organ, 21 uppgifter, 30 000 dragningar utan fel.**
- Scroll: 0 px i alla fyra storlekar (både startskärm och spel). Minsta tryckyta 52 px på
  1024×768, 63 px på 1440×900, 79 px på 768×1024 och 46 px på 390×844 (tunntarmen; hjärtat
  52×74, magsäcken 55×66).
- **Fel som mätningen hittade och som rättades:** tunntarmen hade **noll** nåbar yta – tjocktarmens
  osynliga tryckkant (40 enheter) låg ovanpå hela tarmpaketet, så ett tryck på tunntarmen valde
  tjocktarmen. Tjocktarmens tryckyta är nu 22 enheter, tunntarmen ritas efter tjocktarmen och
  tryckytorna mäts om: tunntarmen 104×46 px på telefon, 8 av 8 organ nåbara.
- **Rättat efter mätning:** tjocktarmens två ändar stack ut nedanför bålen och ritades över benen
  (y 588 → 580).
- Spelat på https://kottenkroppen.shipholm.dev med `Input.dispatchTouchEvent`? Nej – touch-anropet
  svarade inte i den här körningen (`Input.dispatchTouchEvent timed out after 5s`), så rundan
  spelades med riktiga `Input.dispatchMouseEvent`-klick på organens koordinater. Det bevisar
  pointer-handlern och hela flödet, men inte multitouch. Provat: en hel runda nivå 1 till
  slutskärmen ("5 av 6 rätt. 5 stjärnor totalt. Nu blir det svårare!"), par-frågan på nivå 3
  ("lungorna – och vilket mer?" → båda valda → förklaringen skrevs ut), och ett avsiktligt fel
  svar som inte flyttade uppgiften vidare.
- `check_app`: **15/15, 0 varningar.**

## Nästa körning

Biologi 4–6 har nu två appar (Fotosyntesfabriken + denna). Kvar: BI.4-6.2.2 (sjukdomar, sömn,
kost, hygien), BI.4-6.2.3 (pubertet – känsligt, kräver omsorg), BI.4-6.3 (systematiska
undersökningar) och hela engelska 4–6. Kotten-tänk 3 ("Åt vilket håll?") är fortfarande obyggd.