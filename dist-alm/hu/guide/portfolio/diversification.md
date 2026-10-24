# Diverzifikáció és korreláció

Két eszköz portfóliója, a kovariancia szerepe, és miért csökken a kockázat a korrelációval.

A „Hozamok és volatilitás” című lecke egyetlen eszközt két számmal írt le: a $\mu$ várható hozammal és a $\sigma$ volatilitással. Ez a lecke több eszközt rak egy portfólióba. A portfólió várható hozama egyszerű átlag, a volatilitása viszont nem az: attól függ, hogyan mozognak együtt az eszközök, amit a korrelációjuk mér. Ebből fakad a diverzifikáció.

## Portfóliósúlyok és portfólióhozam

Egy **portfólió** egy pénzösszeget oszt szét eszközök között. A $w_i$ **súly** az $i$-edik eszközbe fektetett pénz aránya, így a súlyok összege egy: $w_1 + \cdots + w_N = 1$. Ebben a leckében minden súly 0 és 1 közé esik, vagyis shortolást nem engedünk meg.

Hozamon itt az előző leckéből ismert egyperiódusos egyszerű hozamot értjük, $R = S_1/S_0 - 1$. Egyszerű hozamokkal a portfólió hozama pontosan az eszközhozamok súlyozott átlaga, hiszen a pénz minden része a saját tényezőjével nő:

$$
R_p = w_1 R_1 + w_2 R_2 + \cdots + w_N R_N.
$$

A loghozamokra ez nem teljesül pontosan, ezért dolgozik a portfólióelmélet egyszerű hozamokkal. Összeg várható értéke a várható értékek összege, így a portfólió várható hozama ugyanez a súlyozott átlag:

$$
\mu_p = \mathbb{E}[R_p] = \sum_{i=1}^{N} w_i\,\mu_i.
$$

## Kovariancia és korreláció

Két hozam együttmozgását a **kovariancia** írja le:

$$
\sigma_{AB} = \operatorname{Cov}(R_A, R_B) = \mathbb{E}\big[(R_A - \mu_A)(R_B - \mu_B)\big].
$$

Pozitív, ha a két hozam jellemzően egyszerre van a várható értéke fölött, és negatív, ha az egyik jellemzően akkor magas, amikor a másik alacsony. Nagysága függ a mértékegységektől és a volatilitásoktól, ezért normáljuk, és így kapjuk a **korrelációt**:

$$
\rho = \frac{\sigma_{AB}}{\sigma_A\,\sigma_B}, \qquad -1 \le \rho \le 1, \qquad \text{azaz} \quad \sigma_{AB} = \rho\,\sigma_A\sigma_B.
$$

$\rho = 1$ esetén a két hozam pontosan együtt mozog (az egyik a másik pozitív lineáris függvénye), $\rho = -1$ esetén pontosan ellentétesen, $\rho = 0$ esetén pedig nincs köztük lineáris kapcsolat. Egy eszköz önmagával vett kovarianciája a varianciája: $\sigma_{AA} = \sigma_A^2$.

## Kéteszközös portfólió varianciája

Vegyünk két eszközt, A-t és B-t, $w_A = 1 - w$ és $w_B = w$ súlyokkal. Két valószínűségi változó összegének varianciája a varianciák összege plusz a kovariancia kétszerese, a konstans szorzók pedig négyzetesen jönnek ki:

$$
\sigma_p^2 = \operatorname{Var}(w_A R_A + w_B R_B) = w_A^2\sigma_A^2 + w_B^2\sigma_B^2 + 2\,w_A w_B\,\rho\,\sigma_A\sigma_B.
$$

Az első két tag az egyes eszközök saját kockázata. A harmadik tagban jelenik meg a korreláció. Minden mást rögzítve kisebb $\rho$ kisebb portfólióvarianciát ad.

## A korreláció három esete

$\rho = 1$ esetén a kifejezés teljes négyzet:

$$
\sigma_p^2 = (w_A\sigma_A + w_B\sigma_B)^2 \quad\Rightarrow\quad \sigma_p = w_A\sigma_A + w_B\sigma_B.
$$

A volatilitás ekkor a két volatilitás súlyozott átlaga, éppúgy, mint a várható hozam. A keverés semmilyen kockázatcsökkenést nem hoz.

$\rho < 1$ esetén a vegyes tag kisebb, mint a teljes négyzetnél, ezért

$$
\sigma_p < w_A\sigma_A + w_B\sigma_B \qquad (0 < w < 1).
$$

A portfólió kevésbé kockázatos, mint a részei átlaga, a várható hozama viszont továbbra is az átlag. Ez a különbség a **diverzifikáció** haszna.

$\rho = -1$ esetén a kifejezés ismét négyzet, $\sigma_p = |w_A\sigma_A - w_B\sigma_B|$, és ez nulla, ha $w_A\sigma_A = w_B\sigma_B$, vagyis $w_B = \sigma_A/(\sigma_A + \sigma_B)$ mellett. Két tökéletesen ellentétes eszközből kockázatmentes portfólió rakható össze. Jó kép erre egy esernyőárus és egy fagylaltos ugyanazon a strandon: bármilyen is az idő, egyiküknek jó napja van.

### Kidolgozott példa: Egy 50/50-es portfólió három korrelációval

1. Legyen $\sigma_A = 15\%$, $\sigma_B = 30\%$, a súlyok egyenlők. $\rho = 1$ mellett a volatilitás a súlyozott átlag.
   $$\sigma_p = 0{,}5 \times 15\% + 0{,}5 \times 30\%$$ → **22.5%**
2. $\rho = 0$ mellett a vegyes tag eltűnik, csak a két saját kockázati tag marad.
   $$\sigma_p = \sqrt{0{,}25 \times 0{,}0225 + 0{,}25 \times 0{,}09}$$ → **16.77%**
3. $\rho = -1$ mellett a volatilitás a különbség abszolút értéke. Itt nem nulla, mert egyenlő súlyokkal nem teljesül $w_A\sigma_A = w_B\sigma_B$.
   $$\sigma_p = |0{,}5 \times 15\% - 0{,}5 \times 30\%|$$ → **7.5%**

## A minimális varianciájú portfólió

A és B összes keveréke közül van egy, amelynek a legkisebb a varianciája. Írjuk fel $\sigma_p^2$-et $w = w_B$ függvényeként, és tegyük a deriváltját nullával egyenlővé:

$$
\frac{d\sigma_p^2}{dw} = -2(1-w)\sigma_A^2 + 2w\sigma_B^2 + 2(1-2w)\sigma_{AB} = 0.
$$

A $w$-s tagokat összegyűjtve kapjuk a **minimális varianciájú súlyt**:

$$
w_B^{*} = \frac{\sigma_A^2 - \sigma_{AB}}{\sigma_A^2 + \sigma_B^2 - 2\sigma_{AB}}, \qquad w_A^{*} = 1 - w_B^{*}.
$$

Ha a képlet $[0, 1]$-en kívüli értéket ad, akkor shortolás nélkül a minimum a közelebbi végpontban van, vagyis egyetlen eszközben. Ez történik például $\rho = 1$ mellett, ahol a legkevésbé kockázatos választás csak a kisebb volatilitású eszközt tartani. Az alábbi két eszköznél ez minden $\rho > \sigma_A/\sigma_B = 0{,}5$ esetén így van.

## Számpélda

Az A eszközre $\mu_A = 6\%$ és $\sigma_A = 15\%$, a B eszközre $\mu_B = 12\%$ és $\sigma_B = 30\%$, a korreláció $\rho = 0{,}2$. A kovariancia $\sigma_{AB} = 0{,}2 \times 0{,}15 \times 0{,}30 = 0{,}009$.

Az 50/50-es portfólióra $\mu_p = 9\%$ és

$$
\sigma_p^2 = 0{,}25 \times 0{,}0225 + 0{,}25 \times 0{,}09 + 2 \times 0{,}25 \times 0{,}009 = 0{,}032625, \qquad \sigma_p \approx 18{,}06\%.
$$

A volatilitások súlyozott átlaga $22{,}5\%$, vagyis a diverzifikáció kb. 4,4 százalékpontnyi volatilitást tüntet el anélkül, hogy a várható hozamból bármit feladnánk.

A minimális varianciájú súly

$$
w_B^{*} = \frac{0{,}0225 - 0{,}009}{0{,}0225 + 0{,}09 - 0{,}018} = \frac{0{,}0135}{0{,}0945} \approx 0{,}143.
$$

Ennek a portfóliónak $\mu_p \approx 6{,}86\%$ és $\sigma_p \approx 14{,}34\%$. Ha az A-hoz egy kevés, kockázatosabb B-t keverünk, a volatilitás az A önmagában vett volatilitása *alá* csökken, miközben a várható hozam nő.

Az ábra A és B összes, 0 és 1 közötti súlyú keverékét mutatja a várható hozam és a volatilitás síkján, a választott korreláció mellett (vastag görbe). A szaggatott egyenes a $\rho = 1$, a pontozott V alak a $\rho = -1$ esete; jelölők mutatják A-t és B-t. Mozgasd a korreláció csúszkáját, és figyeld meg, hogy $\rho$ csökkenésével a görbe egyre jobban balra hajlik, $\rho = -1$-nél pedig eléri a függőleges tengelyt. A kijelzők a minimális varianciájú súlyt B-ben, a minimális volatilitást, az 50/50-es portfólió volatilitását és várható hozamát, valamint összehasonlításként a két volatilitás 22,5%-os átlagát mutatják. $\rho = 0{,}5$ fölött a súly kijelzője negatívba fordul, a kijelzett minimális volatilitás pedig ilyenkor az A eszközé önmagában.

*[Interaktív ábra: two asset frontier](https://quantsandbox.dev/hu/guide/portfolio/diversification)*

## Sok eszköz és a szisztematikus kockázat

Vegyünk most $N$ eszközt egyenlő, $w_i = 1/N$ súllyal. A portfólió varianciája az összes páron vett összeg:

$$
\sigma_p^2 = \sum_{i=1}^{N}\sum_{j=1}^{N} w_i w_j\,\sigma_{ij} = \frac{1}{N^2}\sum_{i=1}^{N}\sigma_i^2 + \frac{1}{N^2}\sum_{i \ne j}\sigma_{ij}.
$$

$N$ darab variancia- és $N(N-1)$ darab kovarianciatag van. Jelölje $\overline{\sigma^2}$ az átlagos varianciát, $\overline{\sigma}_{ij}$ pedig a különböző eszközök közötti átlagos kovarianciát. Ekkor

$$
\sigma_p^2 = \frac{1}{N}\,\overline{\sigma^2} + \Big(1 - \frac{1}{N}\Big)\overline{\sigma}_{ij} \;\longrightarrow\; \overline{\sigma}_{ij} \quad (N \to \infty).
$$

Az egyedi varianciák kidiverzifikálódnak, az átlagos kovariancia viszont megmarad. Példa: minden eszközre $\sigma = 30\%$, minden párra $\rho = 0{,}3$, így $\overline{\sigma}_{ij} = 0{,}3 \times 0{,}09 = 0{,}027$. Egy eszköz volatilitása 30%, tíz eszközé kb. 18,2%, száz eszközé kb. 16,6%, a határérték pedig $\sqrt{0{,}027} \approx 16{,}4\%$.

> Az egyes eszközökre jellemző egyedi kockázat egy nagy portfólióban eltűnik. A közös mozgásokból eredő, az átlagos kovarianciával mért kockázat megmarad. Ezt a megmaradó részt **szisztematikus** (piaci) kockázatnak nevezzük.

## A két eszköz mozgatása

Az alábbi ábrán te helyezed el a két eszközt. Húzd az A vagy a B pontot a kockázat–hozam sík bármely pontjára, és válassz korrelációt. $\rho = 0{,}9$ mellett a keverékek a két pontot összekötő egyenes közelében maradnak, a keverés alig csökkenti a kockázatot. $\rho = -0{,}5$ mellett a görbe mindkét eszköztől messze balra hajlik. Húzd B-t egyenesen felfelé: a minimális varianciájú súly nem változik, mert csak a volatilitásoktól és a korrelációtól függ, a várható hozamoktól nem.

*[Interaktív ábra: drag assets](https://quantsandbox.dev/hu/guide/portfolio/diversification)*

## Összefoglalás

- A portfólió hozama az eszközhozamok súlyozott átlaga: $\mu_p = \sum_i w_i\mu_i$.
- A portfólió varianciája a kovarianciáktól függ: $\sigma_p^2 = w_A^2\sigma_A^2 + w_B^2\sigma_B^2 + 2w_Aw_B\rho\sigma_A\sigma_B$.
- $\rho = 1$ mellett a volatilitás a súlyozott átlag, $\rho < 1$ mellett kisebb annál, $\rho = -1$ mellett akár nulla is lehet.
- A minimális varianciájú súly $w_B^{*} = (\sigma_A^2 - \sigma_{AB})/(\sigma_A^2 + \sigma_B^2 - 2\sigma_{AB})$.
- Nagy, egyenlő súlyú portfólióban a variancia az átlagos kovarianciához tart: a szisztematikus kockázat nem diverzifikálható.

> A következő lecke („Hatékony front és tőkepiaci egyenes”) megengedi a shortolást, bevezet egy kockázatmentes eszközt, és azt vizsgálja, melyik portfóliót érdemes ezek közül ténylegesen választani.

[Kombinálj eszközöket, és kövesd a portfólió volatilitásának változását a Portfólió laborban](https://quantsandbox.dev/hu/portfolio-lab)

## Interaktív laborok

- [Kéteszközös portfólió: diverzifikáció és korreláció](https://quantsandbox.dev/hu/portfolio-lab)
- [Tőkeallokációs egyenes és Sharpe-mutató](https://quantsandbox.dev/hu/risk-return)

## Gyakorló kérdések

### 1. Két eszközre $\sigma_1 = 20\%$ és $\sigma_2 = 30\%$, a korreláció $\rho = 0{,}2$. Mekkora egy 50/50-es portfólió volatilitása, százalékban?

**Válasz:** 19.62%

$\sigma_p^2 = 0{,}25 \times 0{,}04 + 0{,}25 \times 0{,}09 + 2 \times 0{,}25 \times 0{,}2 \times 0{,}2 \times 0{,}3 = 0{,}0385$, így $\sigma_p \approx 19{,}62\%$, a két volatilitás 25%-os átlaga alatt.

### 2. Milyen korreláció mellett lehet két kockázatos eszközből, shortolás nélkül, nulla volatilitású portfóliót összerakni?

- a) $\rho = 1$
- b) $\rho = 0$
- c) $\rho = -0{,}5$
- d) $\rho = -1$

**Válasz:** d) $\rho = -1$

Csak $\rho = -1$ mellett teljes négyzet a variancia, $\sigma_p = |w_A\sigma_A - w_B\sigma_B|$, ami $w_B = \sigma_A/(\sigma_A + \sigma_B)$-nél nulla. Bármely $\rho > -1$ esetén minden súlynál marad valamennyi kockázat.

---

Forrás: https://quantsandbox.dev/hu/guide/portfolio/diversification

Előző lecke: [Hozamok és volatilitás](https://quantsandbox.dev/hu/guide/portfolio/returns-volatility)

Következő lecke: [Hatékony front és tőkepiaci egyenes](https://quantsandbox.dev/hu/guide/portfolio/efficient-frontier)
