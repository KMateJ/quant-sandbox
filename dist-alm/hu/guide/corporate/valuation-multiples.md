# Relatív értékelés szorzókkal

P/E, EV/EBITDA és más szorzók, a társcégek kiválasztása, és hogyan kapcsolódnak a szorzók a DCF-értékhez.

A „Diszkontált pénzáram alapú értékelés” egy vállalatot a saját előrejelzett pénzáramaiból értékel. A gyakorlatban az elemzők szinte mindig összevetik ezt az értéket egy másodikkal: azzal, amennyit hasonló vállalatokért a piac fizet. Ez a lecke a szorzókkal történő relatív értékelést mutatja be: hogyan kell egy szorzót helyesen alkalmazni, és hogyan kapcsolódik a szorzó az előző lecke diszkontálásához.

## Mi a szorzó

A **szorzó** egy piaci érték osztva a vállalat méretének vagy teljesítményének valamely mérőszámával. Ha a hasonló vállalatok nagyjából a nyereségük 15-szörösén forognak, egy részvényenként 4 nyereséget termelő hasonló vállalat részvényenként nagyjából $15 \times 4 = 60$-at érhet. A szorzó az egyik vállalat piaci árát olyan arányszámmá alakítja, amely egy másik vállalatra is alkalmazható.

A szokásos szorzók két családba tartoznak aszerint, hogy a számláló kinek a követelését méri:

- A **saját tőkére vonatkozó szorzók** számlálójában a részvények értéke áll: árfolyam/nyereség (P/E), árfolyam/saját tőke könyv szerinti értéke (P/B). A nevezőnek is a részvényesekhez kell tartoznia: adózott eredmény, könyv szerinti saját tőke.
- A **vállalatértékre vonatkozó szorzók** számlálójában a **vállalatérték** (enterprise value) áll, a teljes üzlet értéke minden befektető számára, $\text{EV} = \text{saját tőke értéke} + \text{nettó adósság}$. A nevezőnek a hitelezőknek járó kifizetések előtt kell keletkeznie: EBITDA (kamat, adó és értékcsökkenés előtti eredmény), EBIT vagy árbevétel.

A két család összekeverése a leggyakoribb hiba. Az EBITDA-t a hitelezők és a részvényesek együtt kapják, ezért ha az árfolyamot EBITDA-val osztjuk, egy részt hasonlítunk az egészhez, és az eredmény attól függ, mennyi adóssága van a vállalatnak, nem attól, mennyire jól működik.

> A számlálónak és a nevezőnek ugyanazokhoz a befektetőkhöz kell tartoznia: a saját tőke értéke az adózott eredménnyel vagy a könyv szerinti saját tőkével, a vállalatérték az EBITDA-val, az EBIT-tel vagy az árbevétellel.

## A szorzótól az értékig

Egy vállalatérték-szorzó alkalmazása vállalatértéket ad; a saját tőke értéke ebből a nettó adósság levonásával adódik, pontosan úgy, mint egy DCF-értékelés végén:

$$
\text{EV}_{\text{cél}} = m \cdot \text{EBITDA}_{\text{cél}}, \qquad \text{Saját tőke}_{\text{cél}} = \text{EV}_{\text{cél}} - \text{nettó adósság}.
$$

Példa: egy célvállalat EBITDA-ja 50, nettó adóssága 120 (millió). Az EBITDA tízszeresén értékelve $\text{EV} = 500$, a saját tőke értéke pedig $500 - 120 = 380$. Ha az 500-at a saját tőke értékének vennénk, a teljes adóssággal túlbecsülnénk.

## A hasonló vállalatok kiválasztása

Egy szorzó csak annyira jó, amennyire a vállalatok, amelyekből származik. A **hasonló vállalatoknak** (társcégeknek) abban kell hasonlítaniuk a célvállalatra, ami az értéket hajtja: ugyanaz az iparág és üzleti modell, hasonló növekedés, hasonló kockázat és hasonló árrés. Tökéletes társcég ritkán van, ezért az elemző több cég szorzóját foglalja össze.

Számpélda: öt társcég P/E-je 14, 16, 15, 22 és 13, a célvállalat részvényenként 4 nyereséget termel. A **medián** a sorba rendezés (13, 14, 15, 16, 22) utáni középső érték.

### Kidolgozott példa: Öt társcég P/E-jének átlaga és mediánja

1. Az öt társcég szorzójának átlaga.
   $$\bar m = \frac{1}{5}\sum_{i=1}^{5} m_i$$ → **16**
2. A medián: a rendezett sor középső eleme.
   $$\tilde m = m_{(3)}$$ → **15**
3. Részvényenkénti érték az átlaggal.
   $$P = \bar m \cdot E$$ → **64**
4. Részvényenkénti érték a mediánnal.
   $$P = \tilde m \cdot E$$ → **60**

Az egyetlen magas, 22-es érték felhúzza az átlagot, a mediánt viszont nem mozdítja el; ezért a medián a szokásos összefoglaló.

## Szorzók és növekedés

A társcégek ritkán nőnek ugyanolyan ütemben, és a gyorsabban növekvő vállalatok magasabb szorzót érdemelnek. Egyszerű megoldás, ha a társcégek szorzóit a várt növekedésük függvényében ábrázoljuk, és a legkisebb négyzetek módszerével egyenest illesztünk rájuk, $m = a + b \cdot g$. A célvállalat szorzóját ezután a saját várt növekedésénél olvassuk le az egyenesről, ahelyett hogy nála gyorsabban vagy lassabban növekvő cégek mediánját vennénk.

Az ábra ezt mutatja hat kitalált, de életszerű társcéggel (A–F) EV/EBITDA alapon, a fenti példa célvállalatával (EBITDA 50, nettó adósság 120). Húzd oldalra a rombuszt, vagy jelöld ki és használd a nyílbillentyűket, hogy beállítsd a célvállalat várt növekedését; a rombusz az illesztett egyenesen csúszik, a kijelzők pedig az egyenesen leolvasott szorzót, az implikált vállalatértéket és az implikált saját tőkét mutatják. Egy társcégre kattintva kiveheted az illesztésből, újabb kattintással visszateheted. Alapbeállításnál, mind a hat társcéggel és 7%-os növekedéssel, az egyenes az EBITDA 11,38-szorosát és 449,2-es saját tőke értéket ad. Az F társcég felvásárlási hírek miatt 16,5-szörösön forog; ha kiveszed, az egyenes 10,30-szorost és 394,8-as saját tőke értéket ad, a medián pedig 10,35-ről 9,9-re esik. Egyetlen szokatlan társcég több mint 10%-kal mozdítja el az eredményt.

*[Interaktív ábra: multiples peers](https://quantsandbox.dev/hu/guide/corporate/valuation-multiples)*

## Az indokolt szorzó

A szorzó nem csak piaci konvenció; az előző leckék diszkontálásából le is vezethető. Tegyük fel, hogy egy vállalat nyereségének állandó $b$ hányadát fizeti ki osztalékként, és a nyereség és az osztalék örökké $g$ ütemben nő. A Gordon-képlettel és $r$ elvárt hozammal a mai árfolyam

$$
P_0 = \frac{D_1}{r - g} = \frac{b\,E_0\,(1 + g)}{r - g}, \qquad \frac{P_0}{E_0} = \frac{b\,(1 + g)}{r - g}.
$$

Ez az **indokolt P/E** megmutatja, mit kódol egy szorzó: a növekedéssel és a kifizetési aránnyal nő, a kockázattal csökken. $b = 60\%$, $r = 9\%$ és $g = 3\%$ mellett az indokolt P/E $0{,}6 \times 1{,}03 / 0{,}06 = 10{,}3$. Ha a társcégek a nyereségük 15-szörösén forognak, akkor a piac vagy nagyobb növekedést, vagy kisebb kockázatot vár, mint ezek a feltevések, vagy a társcégek drágák. A szorzó tehát egy összesűrített DCF: ugyanazokat a feltevéseket rejti, csak nem mondja ki őket.

## Összefoglalás

- A szorzó egy piaci értéket oszt egy méret- vagy teljesítménymutatóval; a társcégek piaci árát viszi át a célvállalatra.
- A saját tőke értéke saját tőkére vonatkozó mutatóval (P/E, P/B), a vállalatérték működési mutatóval (EV/EBITDA, EV/árbevétel) párosul; a saját tőke értéke az EV mínusz a nettó adósság.
- A társcégek szorzóit szokás a mediánnal összefoglalni, mert egyetlen kiugró érték az átlagot elmozdítja, a mediánt nem.
- A növekedésbeli különbségek kezelhetők, ha a szorzókat a növekedésre regresszáljuk, és a célvállalat szorzóját az egyenesről olvassuk le.
- Az indokolt P/E, $b(1+g)/(r-g)$, ugyanazokhoz a bemenetekhez köti a szorzót, mint egy DCF-értékelés.

> A következő lecke, a „Reálopciók: a rugalmasság értéke”, azt teszi hozzá, amit sem a DCF, sem a szorzók nem ragadnak meg jól: annak értékét, hogy egy projektet el lehet halasztani, bővíteni vagy le lehet állítani.

[Vesd össze a szorzó alapú értéket egy teljes DCF-fel az Értékelés laborban](https://quantsandbox.dev/hu/valuation)

## Interaktív laborok

- [DCF-értékelés: szabad cash flow és terminális érték](https://quantsandbox.dev/hu/valuation)

## Gyakorló kérdések

### 1. Az alábbi szorzók közül melyikben tartozik a számláló és a nevező ugyanazokhoz a befektetőkhöz?

- a) Árfolyam / EBITDA
- b) Vállalatérték / adózott eredmény
- c) Vállalatérték / EBITDA
- d) Árfolyam / árbevétel

**Válasz:** c) Vállalatérték / EBITDA

Az EBITDA-t a hitelezőknek és a részvényeseknek együtt termeli a vállalat, ezért a vállalatértékhez illik. Az árfolyam az EBITDA-val vagy az árbevétellel, illetve a vállalatérték az adózott eredménnyel részt állít szembe az egésszel, és az eredmény a vállalat adósságától függ.

### 2. A társcégek az EBITDA nyolcszorosán forognak. A célvállalat EBITDA-ja 80, nettó adóssága 200. Mennyi a saját tőkéjének implikált értéke?

**Válasz:** 440

A vállalatérték-szorzóból $\text{EV} = 8 \times 80 = 640$; a nettó adósság levonása után $640 - 200 = 440$ marad a részvényeseknek.

---

Forrás: https://quantsandbox.dev/hu/guide/corporate/valuation-multiples

Előző lecke: [Diszkontált pénzáram alapú értékelés](https://quantsandbox.dev/hu/guide/corporate/dcf-valuation)

Következő lecke: [Reálopciók: a rugalmasság értéke](https://quantsandbox.dev/hu/guide/corporate/real-options)
