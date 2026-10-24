# Diszkontált pénzáram alapú értékelés

Szabad pénzáram, vállalatérték, Gordon-féle maradványérték és a saját tőke értéke.

A „Nettó jelenérték és belső megtérülési ráta” című lecke egyetlen projektet értékelt a pénzáramai diszkontálásával. Egy egész vállalat ugyanígy értékelhető: projektek összessége, amely folyamatosan pénzt termel. Ez a lecke a diszkontált pénzáram (DCF) alapú értékelést a vállalat szabad pénzáramaiból, a „Súlyozott átlagos tőkeköltség” című lecke WACC-jéből és az örökké tartó pénzáramokra vonatkozó képletből építi fel.

## Szabad pénzáram

A diszkontálandó pénzáram a **szabad pénzáram** (FCF): az a pénz, amelyet a vállalat működése egy év alatt megtermel az adók megfizetése és a további növekedéshez szükséges beruházások után, de a hitelezőknek vagy részvényeseknek teljesített kifizetések előtt. $t$ társasági adókulccsal

$$
\text{FCF} = \text{EBIT}\,(1 - t) + \text{értékcsökkenés} - \text{beruházás} - \Delta\text{NWC}.
$$

Minden tagnak megvan az oka. Az **EBIT** (kamatfizetés és adózás előtti eredmény) a működési eredmény; $\text{EBIT}(1-t)$ ez az eredmény annak az adónak a levonása után, amelyet a működés hitel nélkül fizetne, így a finanszírozás kimarad a pénzáramból, ahogy a „Súlyozott átlagos tőkeköltség” lecke megkívánta. Az **értékcsökkenés** könyvelési tétel, nem pénzkifizetés, ezért visszaadjuk. A **beruházás** új gépekre és épületekre költött pénz. A $\Delta\text{NWC}$ a nettó forgótőke (készletek plusz vevőkövetelések mínusz szállítói tartozások) növekménye, a napi működésben lekötött pénz.

Példa: 200 EBIT, $t = 25\%$, 40 értékcsökkenés, 60 beruházás és 10 forgótőke-növekmény mellett $\text{FCF} = 150 + 40 - 60 - 10 = 120$.

## Vállalatérték

A szabad pénzáram az összes befektetőt együtt illeti, a hitelezőket és a részvényeseket is. A WACC-vel diszkontálva ezért a teljes vállalat értékét kapjuk, a **vállalatértéket** (enterprise value, EV):

$$
\text{EV} = \sum_{k=1}^{\infty} \frac{\text{FCF}_k}{(1 + \text{WACC})^k}.
$$

Az összegnek nincs vége, mert egy vállalatnak nincs rögzített lejárata. A gyakorlatban két részre bontjuk: a következő néhány év, jellemzően öt év **explicit előrejelzésére**, amelyben az elemző minden pénzáramot egyenként becsül, és egy **maradványértékre**, amely minden későbbit összefoglal.

## Növekvő örökjáradék

Az előrejelzésen túli pénzáramok értékeléséhez tegyük fel, hogy egy ponttól kezdve örökké állandó $g$ ütemben nőnek: $\text{FCF}_{k+1} = \text{FCF}_k\,(1+g)$. Jelölje $W$ a WACC-t. Egy egy év múlva $\text{FCF}_1$-gyel induló ilyen pénzáram jelenértéke $(1+g)/(1+W)$ hányadosú mértani sor:

$$
\sum_{k=1}^{\infty} \frac{\text{FCF}_1 (1+g)^{k-1}}{(1+W)^k} = \frac{\text{FCF}_1}{1+W} \sum_{j=0}^{\infty} \Big(\frac{1+g}{1+W}\Big)^j = \frac{\text{FCF}_1}{W - g}.
$$

A sor csak $g < W$ esetén konvergál. Ez a **Gordon-féle növekedési képlet**. A diszkontrátával egyenlő vagy annál nagyobb növekedési ütem végtelen értéket adna, ami lehetetlen feltevésre utal: egyetlen vállalat sem nőhet örökké gyorsabban a gazdaságnál.

## Maradványérték

Alkalmazzuk a képletet az előrejelzés végén. Ha az előrejelzés az 1–5. évet fedi le, az 5. évi **maradványérték** a 6. évtől kezdődő összes pénzáram akkori értéke:

$$
\text{TV}_5 = \frac{\text{FCF}_6}{W - g}, \qquad \text{EV} = \sum_{k=1}^{5} \frac{\text{FCF}_k}{(1+W)^k} + \frac{\text{TV}_5}{(1+W)^5}.
$$

A maradványérték maga is jövőbeli összeg, ezért ugyanúgy öt évvel diszkontáljuk vissza, mint bármely más pénzáramot.

## Számpélda

Legyen $\text{FCF}_1 = 10$, amely évente örökké $g = 2\%$-kal nő, és $W = 9\%$. Az előrejelzett pénzáramok 10; 10,20; 10,40; 10,61 és 10,82; 9%-kal diszkontálva 9,17; 8,59; 8,03; 7,52 és 7,04 az értékük.

### Kidolgozott példa: Vállalatérték ötéves előrejelzéssel és maradványértékkel

1. Az öt előrejelzett év jelenértéke.
   $$\sum_{k=1}^{5} \frac{\text{FCF}_1 (1+g)^{k-1}}{(1+W)^k}$$ → **40.35**
2. Az előrejelzés utáni első pénzáram.
   $$\text{FCF}_6 = \text{FCF}_1 (1+g)^5$$ → **11.04**
3. A maradványérték az 5. évben a Gordon-képletből.
   $$\text{TV}_5 = \frac{\text{FCF}_6}{W - g}$$ → **157.73**
4. Diszkontáljuk vissza a maradványértéket öt évvel.
   $$\frac{\text{TV}_5}{(1+W)^5}$$ → **102.51**
5. Vállalatérték: az előrejelzett évek plusz a diszkontált maradványérték.
   $$\text{EV} = \sum_{k=1}^{5} \frac{\text{FCF}_k}{(1+W)^k} + \frac{\text{TV}_5}{(1+W)^5}$$ → **142.86**

Mivel itt minden évre ugyanaz a növekedési ütem vonatkozik, ez megegyezik a teljes pénzáramra alkalmazott Gordon-képlettel, $10/0{,}07 \approx 142{,}86$, ami hasznos ellenőrzés.

> A DCF-érték nagy része általában a maradványértékben van. A példában ez az összes $102{,}51/142{,}86 \approx 71{,}8\%$-a, így a $g$-re és a WACC-re vonatkozó hosszú távú feltevések többet számítanak a részletes előrejelzésnél.

## Érzékenység a feltevésekre

Mivel $W - g$ a nevezőben áll, bármelyikük kis változása nagy hatással jár. Ha $g$ 2%-ról 4%-ra nő, az érték 142,86-ról $10/0{,}05 = 200$-ra emelkedik; ha a WACC 9%-ról 8%-ra csökken, $10/0{,}06 \approx 166{,}67$-re. Az öt előrejelzett év jelenértéke egyik esetben sem mozdul lényegesen. A DCF-értékelést ezért mindig $g$- és WACC-értékek tartományával kell közölni, nem egyetlen számként.

Az ábra ezt a felbontást mutatja. A $g$ függvényében ábrázolja az 1–5. év jelenértékét, a maradványérték jelenértékét és a kettő összegét egy $\text{FCF}_1 = 10$ pénzáramú, ötéves előrejelzésű vállalatra. A csúszkák a WACC-t és $g$-t állítják; a kijelzők a választott $g$ mellett adják meg a teljes értéket, a maradványérték részarányát és az előrejelzési évek jelenértékét; $g$ legfeljebb 5%-ig, és legfeljebb egy százalékponttal a WACC alá emelhető. Az alapbeállítások (WACC 9%, $g = 2\%$) a példát adják vissza: 142,86, ebből kb. 71,8% a maradványérték. Növeld $g$-t, és figyeld, hogy a maradványérték meredeken nő, miközben az előrejelzési rész szinte vízszintes marad; a WACC-t csökkentve mindkettő nő.

*[Interaktív ábra: dcf terminal](https://quantsandbox.dev/hu/guide/corporate/dcf-valuation)*

## A vállalatértéktől a saját tőke értékéig

A vállalatérték a hitelezőket és a részvényeseket együtt illeti. A részvényesek része, a **saját tőke értéke**, a **nettó adósság** (adósság mínusz pénzeszközök) levonása után marad:

$$
\text{saját tőke értéke} = \text{EV} - (\text{adósság} - \text{pénzeszközök}), \qquad \text{egy részvény értéke} = \frac{\text{saját tőke értéke}}{\text{részvények száma}}.
$$

Példa: $\text{EV} = 142{,}86$, 45 adósság, 5 pénzeszköz és 10 részvény mellett a saját tőke értéke $142{,}86 - 40 = 102{,}86$, részvényenként kb. 10,29. Ezt a piaci árfolyammal összevetve dönti el az elemző, hogy egy részvény olcsónak vagy drágának tűnik.

## Összefoglalás

- A szabad pénzáram az a pénz, amelyet a működés adózás és beruházás után, a finanszírozási kifizetések előtt megtermel.
- A szabad pénzáram WACC-vel diszkontálva a vállalatértéket adja.
- Egy örökké $g < W$ ütemben növekvő pénzáram értéke $\text{FCF}_1/(W - g)$; az előrejelzés végén alkalmazva ez a maradványérték.
- Általában a maradványérték dominál, ezért az eredmény nagyon érzékeny $g$-re és a WACC-re.
- A saját tőke értéke a vállalatérték mínusz a nettó adósság.

[Építs DCF-értékelést, és teszteld a maradványérték feltevéseit az Értékelés laborban](https://quantsandbox.dev/hu/valuation)

## Interaktív laborok

- [DCF-értékelés: szabad cash flow és terminális érték](https://quantsandbox.dev/hu/valuation)

## Gyakorló kérdések

### 1. Egy vállalat EBIT-je 100, az adókulcs 20%, az értékcsökkenés 30, a beruházás 50, a nettó forgótőke pedig 5-tel nő. Mekkora a szabad pénzárama?

**Válasz:** 55

$\text{FCF} = 100 \times 0{,}8 + 30 - 50 - 5 = 55$. Az értékcsökkenést visszaadjuk, mert nem pénzkiadás; a beruházás és a forgótőke növekménye viszont elköltött pénz.

### 2. Egy táblázatkezelőben épített DCF-modell óriási vagy negatív maradványértéket ad. Az elemző az örökös növekedési ütemet, $g$-t, a WACC-vel egyenlőre vagy annál nagyobbra állította. Mit jelent ez?

- a) A vállalat rendkívül értékes, az eredményt meg kell tartani.
- b) A feltevés lehetetlen: a Gordon-képlethez $g < W$ kell.
- c) A maradványértéket a WACC helyett $g$-vel kell diszkontálni.
- d) Öt előrejelzési év túl kevés; több évvel megoldódik.

**Válasz:** b) A feltevés lehetetlen: a Gordon-képlethez $g < W$ kell.

A növekvő örökjáradék csak $g < W$ esetén konvergál. Ha $g \ge W$, a sornak nincs véges összege, így a képlet eredménye értelmetlen: egyetlen vállalat sem nőhet örökké gyorsabban a diszkontrátájánál.

---

Forrás: https://quantsandbox.dev/hu/guide/corporate/dcf-valuation

Előző lecke: [Osztalék, kifizetési politika és az osztalékdiszkont-modell](https://quantsandbox.dev/hu/guide/corporate/dividend-policy)

Következő lecke: [Relatív értékelés szorzókkal](https://quantsandbox.dev/hu/guide/corporate/valuation-multiples)
