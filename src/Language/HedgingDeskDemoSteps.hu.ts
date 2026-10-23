export const hedgingDeskDemoStepsHu = {
  hdDemoWelcomeTitle: "Te vagy az árjegyző",
  hdDemoWelcomeBody:
    "Egy ügyfél épp tíz ATM vételi opciót vett tőled. Tiéd a díj és a kockázat. A jobb felső óra a lejáratig hátralévő kereskedési napokat számolja.",
  hdDemoClientFillTitle: "A nyitó kötés",
  hdDemoClientFillBody:
    "A naplóban minden esemény megjelenik. Az első sor az ügyfél kötése: tíz vételi opciót adtál el a vételi áron.",
  hdDemoPositionsTitle: "Amit tartasz",
  hdDemoPositionsBody:
    "Tíz kiírt vételi opció nagyjából ötszáz részvény short pozíciójaként viselkedik. Ez a kitettség a delta, részvényben mérve.",
  hdDemoRiskBandTitle: "A delta-sáv",
  hdDemoRiskBandBody:
    "A küldetés minden záráskor csak a sávon belül engedi a nettó deltát. Most messze kívül vagy rajta.",
  hdDemoObjectivesTitle: "Három cél",
  hdDemoObjectivesBody:
    "Kevés sávsértés, lejáratkor nullához közeli fedezeti P&L és korlátozott spreadköltség. Minden zárást ezekhez mérünk.",
  hdDemoTicketTitle: "A megbízás kitöltése",
  hdDemoTicketBody:
    "A delta semlegesítéséhez részvényt veszel: a megbízás mutatja a várható árat, a fizetendő spreadet és a kötés utáni nettó deltát.",
  hdDemoFirstFillTitle: "Az első fedezés",
  hdDemoFirstFillBody:
    "A vétel az eladási áron teljesül, így a költség azonnal látszik. Egy négyzet jelöli a kötést az árfolyamgrafikonon; a nettó delta most nulla közelében van.",
  hdDemoDayStepTitle: "Egy nappal később",
  hdDemoDayStepBody:
    "Minden lépés egy nappal viszi előre a szimulált árat. A delta az árral és az idővel együtt mozdul, így a fedezés elkopik.",
  hdDemoDriftTitle: "Öt nap fedezés nélkül",
  hdDemoDriftBody:
    "Egy hétig magára hagyva a nettó delta egy záráskor kilépett a sávból: ez sávsértés, és az első célnál számít.",
  hdDemoAutoHedgeTitle: "Automatikus fedezés",
  hdDemoAutoHedgeBody:
    "Az F4 pontosan annyi részvényt köt, amennyi a nettó deltát nullára hozza. A napló automatikusként jelöli a kötést.",
  hdDemoScenariosTitle: "Mi lenne, ha",
  hdDemoScenariosBody:
    "A mátrix árfolyam- és volatilitássokkokra értékeli újra a könyvet; a profil a P&L-t mutatja az árfolyam függvényében ma és lejáratkor.",
  hdDemoChainTitle: "Fedezés opciókkal",
  hdDemoChainBody:
    "Tőzsdei opciókkal is köthetsz. Egy kötési árra kattintva betöltődik a megbízásba; az opciók a gammát és a vegát is változtatják, nem csak a deltát.",
  hdDemoToExpiryTitle: "Lejáratig",
  hdDemoToExpiryBody:
    "Napi fedezéssel a könyv P&L-je végig nulla közelében marad, míg a fedezetlen vonal kileng. A kötések az út mentén gyűlnek.",
  hdDemoAttributionTitle: "Honnan jött a pénz",
  hdDemoAttributionBody:
    "A kapott díj, a kifizetett elszámolás, a részvény P&L, a finanszírozás és a költségek adják ki a végeredményt.",
  hdDemoPoliciesTitle: "Szabályok összevetve",
  hdDemoPoliciesBody:
    "Ugyanaz az út napi, heti, havi és fedezés nélküli szabállyal. A ritkább újrafedezés olcsóbb, de több sávsértéssel jár.",
  hdDemoYourTurnTitle: "Rajtad a sor",
  hdDemoYourTurnBody:
    "Vedd át a pultot és folytasd kézzel ezt a könyvet, nyisd meg a Küldetéseket egy új kezdéshez, vagy lépj ki a saját utadra.",
};
