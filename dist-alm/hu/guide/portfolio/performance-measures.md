# Teljesítménymutatók: Sharpe, Treynor, Jensen és információs ráta

Kockázattal korrigált teljesítmény, melyik mutató melyik kockázatot veszi figyelembe, és miért térhetnek el a rangsorok.

Egy alap, amely tavaly 14%-ot hozott, jobban teljesített annál, amelyik 9%-ot, hacsak nem vállalt ehhez sokkal nagyobb kockázatot. Ez a lecke számokká alakítja ezt a megérzést. A „Hatékony front és tőkepiaci egyenes” tőkepiaci egyenesére, valamint a „CAPM, béta és az értékpapír-piaci egyenes” bétájára és értékpapír-piaci egyenesére építve négy szokásos, kockázattal korrigált teljesítménymutatót vezet be, és megmutatja, miért rangsorolhatják ugyanazokat az alapokat eltérő sorrendben.

## Többlethozam

Minden mutató a $\mu - r_f$ **többlethozamból** indul: abból, amennyit a portfólió a kockázatmentes kamat fölött keresett, vagyis a kockázatvállalás jutalmából. A mutatók abban térnek el, hogy mivel osztják vagy mivel vetik össze, azaz hogy melyik kockázatért számolnak fel árat. A leckében $\mu$, $\sigma$ és $\beta$ múltbeli hozamokból becsült egyéves átlagok, a piaci index jellemzői pedig $\mu_M$ és $\sigma_M$.

## A Sharpe-mutató

A **Sharpe-mutató** a többlethozamot a teljes szórással osztja:

$$
\text{SR} = \frac{\mu - r_f}{\sigma}.
$$

A $(\sigma, \mu)$ síkon ez a kockázatmentes pontból a portfólióba húzott egyenes meredeksége. Ha egy portfólió meredekebb a tőkepiaci egyenesnél, amelynek meredeksége a piac Sharpe-mutatója, akkor teljes kockázategységre vetítve legyőzte a piacot. A teljes kockázat akkor a helyes mérce, ha a befektető csak ezt a portfóliót tartja.

## M²

Egy 0,44-es Sharpe-mutatót nehéz átérezni. Az **M²** (Modigliani a négyzeten) hozammá fordítja. Keverjük a portfóliót a kockázatmentes eszközzel, amíg a szórása meg nem egyezik a piac $\sigma_M$ szórásával; ennek a keveréknek a várható hozama mínusz a piacé:

$$
M^2 = r_f + \text{SR}\,\sigma_M - \mu_M.
$$

Pontosan úgy rangsorol, mint a Sharpe-mutató, csak piaci kockázat mellett elért hozam-százalékpontban.

## A Treynor-ráta

Aki már jól diverzifikált portfóliót tart, annak egy alapnál az számít, mennyivel járul hozzá a portfólió kockázatához, ez pedig a bétája, nem a teljes szórása. A **Treynor-ráta** a többlethozamot a bétával osztja:

$$
\text{TR} = \frac{\mu - r_f}{\beta}.
$$

A $(\beta, \mu)$ síkon ez a kockázatmentes pontból az alapba húzott egyenes meredeksége. Magára a piacra $\beta = 1$, így Treynor-rátája a $\mu_M - r_f$ piaci kockázati prémium; az ennél nagyobb értékű alap szisztematikus kockázategységre vetítve legyőzte a piacot.

## Jensen-alfa

A **Jensen-alfa** ugyanezt az összevetést hozamként fejezi ki: megmutatja, milyen messze van az alap az értékpapír-piaci egyenes fölött,

$$
\alpha = \mu - \big[r_f + \beta\,(\mu_M - r_f)\big].
$$

A zárójelben az a hozam áll, amelyet a CAPM az alap bétájához megkövetel, így $\alpha$ a szisztematikus kockázat által indokolt hozamon felül elért többlet. A pozitív alfájú alap Treynor-rátája egyben a piacénál nagyobb, így a két mutató mindig egyetért abban, hogy egy alap legyőzte-e a piacot, és itt ugyanabban a sorrendben is rangsorolják az alapokat.

## Követési hiba és információs ráta

Az alfa nem árulja el, mekkora kockázattal érték el. Írjuk az alap hozamát a piaci hozam $\beta$-szorosának és egy attól független $\varepsilon$ maradéknak az összegeként, ahogy a CAPM-lecke egyindexes szemlélete teszi. A maradék szórása a bétához igazított indexhez mért **követési hiba**:

$$
\sigma(\varepsilon) = \sqrt{\sigma^2 - \beta^2 \sigma_M^2}.
$$

Az **információs ráta** az alfát ezzel osztja, $\text{IR} = \alpha / \sigma(\varepsilon)$: ez az indextől való eltéréssel vállalt kockázat egységére jutó többlethozam. Akkor számít, ha egy alapot egy referenciaindexhez mérnek, és ez dönti el, mekkora súlyt érdemel egy aktívan kezelt alap egy indexalap mellett.

> A Sharpe-mutató és az M² a teljes kockázatért, a Treynor-ráta és az alfa a szisztematikus kockázatért, az információs ráta az aktív (egyedi) kockázatért számol fel árat. Hogy melyik a helyes, azon múlik, mit tart még a befektető.

## Számpélda

Vegyünk négy kitalált alapot, egy $\mu_M = 10\%$ és $\sigma_M = 18\%$ jellemzőjű piaci indexet, és legyen $r_f = 3\%$:

- A: $\mu = 12\%$, $\sigma = 24\%$, $\beta = 1{,}20$.
- B: $\mu = 9\%$, $\sigma = 12\%$, $\beta = 0{,}60$.
- C: $\mu = 14\%$, $\sigma = 30\%$, $\beta = 1{,}05$.
- D: $\mu = 11\%$, $\sigma = 18\%$, $\beta = 0{,}95$.

A piac Sharpe-mutatója $0{,}07/0{,}18 \approx 0{,}389$, Treynor-rátája 7%. A C alapra

$$
\text{SR}_C = \frac{0{,}11}{0{,}30} \approx 0{,}367, \qquad \text{TR}_C = \frac{0{,}11}{1{,}05} \approx 10{,}48\%, \qquad \alpha_C = 14\% - (3\% + 1{,}05 \times 7\%) = 3{,}65\%,
$$

az egyedi kockázata $\sqrt{0{,}09 - 1{,}05^2 \times 0{,}0324} \approx 23{,}3\%$, így $\text{IR}_C \approx 0{,}0365/0{,}233 \approx 0{,}157$. A visszafogott B alapra $\text{SR}_B = 0{,}06/0{,}12 = 0{,}5$, $\alpha_B = 9\% - (3\% + 0{,}6 \times 7\%) = 1{,}8\%$, az egyedi kockázat $\sqrt{0{,}0144 - 0{,}36 \times 0{,}0324} \approx 5{,}23\%$, és $\text{IR}_B \approx 0{,}344$. Mind a négy alapra elvégezve ugyanezt, ezek a rangsorok adódnak:

- Sharpe (és M²): B 0,500, D 0,444, A 0,375, C 0,367.
- Treynor és alfa: C (10,48%, 3,65%), B (10,00%, 1,80%), D (8,42%, 1,35%), A (7,50%, 0,60%).
- Információs ráta: B 0,344, D 0,240, C 0,157, A 0,057.

Most értékeljünk egy ötödik, E alapot, $\mu = 10\%$, $\sigma = 16\%$ és $\beta = 0{,}70$ értékekkel, ugyanazzal a piaccal szemben.

### Kidolgozott példa: Az összes mutató az E alapra

1. Sharpe-mutató.
   $$\text{SR}_E = \frac{\mu_E - r_f}{\sigma_E}$$ → **0.4375**
2. Treynor-ráta.
   $$\text{TR}_E = \frac{\mu_E - r_f}{\beta_E}$$ → **10%**
3. Jensen-alfa.
   $$\alpha_E = \mu_E - \big[r_f + \beta_E(\mu_M - r_f)\big]$$ → **2.1%**
4. Reziduális kockázat (követési hiba).
   $$\sigma(\varepsilon_E) = \sqrt{\sigma_E^2 - \beta_E^2\sigma_M^2}$$ → **9.86%**
5. Információs ráta.
   $$\text{IR}_E = \alpha_E/\sigma(\varepsilon_E)$$ → **0.213**
6. M², a piaci kockázat melletti hozam mínusz a piacé.
   $$M^2_E = r_f + \text{SR}_E\,\sigma_M - \mu_M$$ → **0.875%**

E 2,1%-os alfája csak C-é mögött marad, a Sharpe-mutatója épp D alá sorolná, az információs rátája pedig B és D alatt van: ugyanaz az alap a mércétől függően jónak vagy átlagosnak látszik.

## Miért térnek el a rangsorok

A C alapnak a legnagyobb az alfája, mégis a legkisebb a Sharpe-mutatója, kisebb a piacénál is ($M^2_C \approx -0{,}40\%$). 30%-os szórásának nagy része egyedi kockázat. Ha önmagában tartják, ez a kockázat teljes egészében a befektetőt terheli, és teljes kockázategységre vetítve C rosszabbul teljesített egy indexalapnál. Ha egy nagy, diverzifikált portfólió kis szeleteként tartják, egyedi kockázata a többi befektetéssel szemben nagyrészt kioltódik, csak a bétája számít, és 3,65%-os alfája valódi nyereség. B ennek az ellentéte: szerény alfa nagyon kis egyedi kockázattal, ami a legjobb Sharpe- és információs rátát adja neki.

Ebből adódik az ökölszabály. Ha a portfólió a befektető teljes vagyona, a Sharpe-mutatóval vagy az M²-tel érdemes megítélni. Ha sok befektetés egyike, a Treynor-rátával vagy az alfával. Ha egy aktív alapkezelőt egy referenciaindexhez mérnek, az információs rátával.

Az ábra a négy alapot és a piacot sorolja fel. Kattints egy mutató oszlopfejlécére, hogy a szerint rangsorolj, és figyeld, ahogy a sorok átrendeződnek. A táblázat melletti szórásdiagram arra a tengelypárra vált, amelyen az adott mutató látható: a $(\sigma, \mu)$ síkra a tőkepiaci egyenessel a Sharpe-mutatónál, a $(\beta, \mu)$ síkra az értékpapír-piaci egyenessel a Treynor-rátánál és az alfánál, az információs rátánál pedig az egyedi kockázat–alfa síkra. Vidd az egeret egy alapra, és a mutatója meredekségként, az alfa esetén pedig az egyenestől mért függőleges távolságként jelenik meg. Hasonlítsd össze a C alapot a Sharpe-mutató és az alfa szerint.

*[Interaktív ábra: performance ranking](https://quantsandbox.dev/hu/guide/portfolio/performance-measures)*

## A mutatók korlátai

Mind a négy mutató néhány év adataiból becsült érték, nagy mintavételi hibával: egy évi 2%-os alfa 10%-os egyedi kockázat mellett évtizedes adatsort igényel, mire statisztikailag megkülönböztethető a nullától. A béta és az alfa attól is függ, melyik indexet tekintjük piacnak. A rosszul teljesítő alapok pedig hajlamosak megszűnni és eltűnni az adatbázisokból, így a megmaradt alapok jobbnak tűnnek, mint amilyen az átlagos alap volt.

## Összefoglalás

- Minden mutató a $\mu - r_f$ többlethozamból indul, és egy bizonyos fajta kockázatért számol fel árat.
- A $(\mu - r_f)/\sigma$ Sharpe-mutató és az M² a teljes kockázatot használja: önmagában tartott portfólióhoz illik.
- A $(\mu - r_f)/\beta$ Treynor-ráta és a Jensen-alfa a szisztematikus kockázatot használja: egy diverzifikált portfólió egyik eleméhez illik.
- Az $\alpha/\sigma(\varepsilon)$ információs ráta a referenciaindexhez képest vállalt aktív kockázatot árazza.
- Egy nagy alfájú, de nagy egyedi kockázatú alap az egyik mutató szerint első, egy másik szerint utolsó lehet.

> A következő lecke, a „Faktormodellek és szisztematikus kockázat”, az egyetlen piaci faktort több faktorra cseréli, és a portfólió varianciáját szisztematikus és egyedi részre bontja.

[Helyezd el az eszközöket az értékpapír-piaci egyeneshez képest, és olvasd le a bétájukat és alfájukat a CAPM laborban](https://quantsandbox.dev/hu/capm)

## Interaktív laborok

- [CAPM-kalkulátor és értékpapír-piaci egyenes](https://quantsandbox.dev/hu/capm)
- [Tőkeallokációs egyenes és Sharpe-mutató](https://quantsandbox.dev/hu/risk-return)

## Gyakorló kérdések

### 1. $r_f = 3\%$ és $\mu_M = 10\%$ mellett egy $\beta = 1{,}4$ bétájú alap $\mu = 13\%$-ot hozott. Mekkora a Jensen-alfája? A választ százalékban add meg.

**Válasz:** 0.2%

A CAPM ehhez a bétához $3\% + 1{,}4 \times 7\% = 12{,}8\%$-ot vár el, így $\alpha = 13\% - 12{,}8\% = 0{,}2\%$. A magas hozam nagyrészt a magas bétából is fakadhat.

### 2. Egy alap egy nagy, jól diverzifikált nyugdíjportfólió kis szelete lesz. Melyik mutató döntsön arról, hogy bekerüljön-e?

- a) A Treynor-ráta vagy a Jensen-alfa
- b) A Sharpe-mutató
- c) Az alap saját benchmarkjához mért információs ráta
- d) A nyers átlaghozam

**Válasz:** a) A Treynor-ráta vagy a Jensen-alfa

Egy diverzifikált portfólióban az alap reziduális kockázata nagyrészt kiesik, így csak a szisztematikus kockázata, a béta számít: a Treynor-ráta vagy az alfa. A Sharpe-mutató olyan portfólióhoz illik, amely a befektető teljes vagyona.

---

Forrás: https://quantsandbox.dev/hu/guide/portfolio/performance-measures

Előző lecke: [CAPM, béta és az értékpapír-piaci egyenes](https://quantsandbox.dev/hu/guide/portfolio/capm)

Következő lecke: [Faktormodellek és szisztematikus kockázat](https://quantsandbox.dev/hu/guide/portfolio/factor-models)
