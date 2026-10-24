# CAPM-kalkulátor és értékpapír-piaci egyenes

Interaktív tőkepiaci árazási modell: béta, piaci kockázati prémium, értékpapír-piaci egyenes és Jensen-alfa egyes eszközökre.

## Az eszközről

A tőkepiaci árfolyamok modellje (CAPM) egy eszköz várható hozamát a bétájához, vagyis a piacra való érzékenységéhez köti. Az eszköz a kockázatmentes kamatlábból és a piaci kockázati prémiumból felrajzolja az értékpapír-piaci egyenest, béta szerint elhelyezi az eszközöket, és Jensen-alfaként mutatja az eszköz várható hozama és a CAPM-előrejelzés közötti rést.

## Gyakori kérdések

### Hogyan számoljuk a várható hozamot a CAPM-mel?

E[R] = r_f + β (E[R_m] − r_f): a kockázatmentes kamatláb plusz a béta szorozva a piaci kockázati prémiummal.

### Mit jelent a pozitív alfa?

Az eszköz várható hozama az értékpapír-piaci egyenes felett van — többet ígér, mint amit a CAPM a bétája alapján megkövetel —, így a modellhez képest alulárazottnak látszik.

### Mit jelent a béta a pénzügyekben?

A béta azt méri, mennyire erősen mozog egy eszköz hozama a piaccal: β = Cov(R_i, R_m) / Var(R_m). Az 1-es béta átlagosan együtt mozog a piaccal, az 1,5-es nagyjából 50%-kal erősebben, az 1 alatti kevésbé érzékeny. A CAPM-ben csak ezért a piaci kockázatért jár prémium, mert a vállalatspecifikus kockázat diverzifikálható.

### Mi az értékpapír-piaci egyenes?

Az E[R] = r_f + β (E[R_m] − r_f) egyenes, amely az elvárt hozamot a béta függvényében ábrázolja. β = 0-nál a kockázatmentes kamatlábból indul, β = 1-nél átmegy a piaci portfólión, meredeksége pedig a piaci kockázati prémium. Az egyenes feletti eszközök alfája pozitív, az alatta lévőké negatív.

## Az elmélet

- [CAPM, béta és az értékpapír-piaci egyenes](https://quantsandbox.dev/hu/guide/portfolio/capm): Szisztematikus és egyedi kockázat, a béta mint piaci érzékenység, várható hozam és alfa.
- [Hatékony front és tőkepiaci egyenes](https://quantsandbox.dev/hu/guide/portfolio/efficient-frontier): Átlag–variancia optimalizálás, minimális varianciájú portfólió, kockázatmentes eszköz és az érintőportfólió.
- [Teljesítménymutatók: Sharpe, Treynor, Jensen és információs ráta](https://quantsandbox.dev/hu/guide/portfolio/performance-measures): Kockázattal korrigált teljesítmény, melyik mutató melyik kockázatot veszi figyelembe, és miért térhetnek el a rangsorok.
- [Faktormodellek és szisztematikus kockázat](https://quantsandbox.dev/hu/guide/portfolio/factor-models): Az egyindexes modell, a szisztematikus és egyedi variancia szétválasztása, és a többfaktoros modellek.

Az interaktív eszköz megnyitása: https://quantsandbox.dev/hu/capm
