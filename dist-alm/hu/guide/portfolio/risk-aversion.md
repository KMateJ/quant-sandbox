# Kockázatkerülés és az optimális teljes portfólió

Várható érték–variancia hasznosság, közömbösségi görbék, a kockázatkerülési együttható és a tőkeallokációs egyenes legjobb pontja.

A „Hatékony front és tőkepiaci egyenes” című lecke egyetlen egyenessel zárult: minden befektetőnek ugyanazt a P kockázatos portfóliót érdemes tartania, és ezt kell kevernie a kockázatmentes eszközzel. Azt viszont nem mondta meg, mennyit tartson P-ből. Ez a befektetőn múlik, nem a piacon. Ez a lecke egyetlen számmal, a kockázatkerülési együtthatóval írja le a befektető kockázathoz való viszonyát, és ennek segítségével megkeresi az egyenes legjobb pontját.

## A nyitva maradt döntés

Tegyük a tőke $y$ hányadát P-be, $1 - y$ hányadát pedig az $r_f$ hozamú kockázatmentes eszközbe. Az előző leckéhez hasonlóan az így kapott **teljes portfólióra**

$$
\mu = r_f + y\,(\mu_P - r_f), \qquad \sigma = y\,\sigma_P.
$$

Minden $y$ érték a tőkeallokációs egyenes egy pontja. Egy óvatos befektető kis $y$-t választ, egy merész nagyot, az $y > 1$ pedig azt jelenti, hogy $r_f$ kamatra hitelt vesz fel, és a saját tőkéjénél többet fektet P-be. A pontok összevetéséhez olyan szabály kell, amely mérlegeli a várható hozamot a kockázattal szemben.

## Várható érték–variancia hasznosság

A szokásos szabály minden portfóliónak egy pontszámot ad, a **hasznosságát**:

$$
U = \mu - \tfrac{1}{2} A\,\sigma^2,
$$

ahol a hozamokat tizedes törtként írjuk. Az $A$ **kockázatkerülési együttható** azt mutatja, mennyire bünteti a befektető a varianciát. $A > 0$ esetén a befektető kockázatkerülő: két azonos $\mu$-jű portfólió közül a kisebb $\sigma$-jú kap nagyobb pontszámot. $A = 0$ esetén csak a várható hozam számít (kockázatsemlegesség). A valódi befektetői viselkedést nagyjából 2 és 6 közötti értékek írják le.

Példa: a kockázatos portfólióra $\mu_P = 11\%$ és $\sigma_P = 20\%$. Egy $A = 4$ együtthatójú befektető számára

$$
U_P = 0{,}11 - \tfrac{1}{2}\times 4 \times 0{,}20^2 = 0{,}11 - 0{,}08 = 0{,}03.
$$

## Biztos egyenérték

Egy kockázatmentes befektetésre $\sigma = 0$, így a hasznossága egyszerűen a hozama. Bármely portfólió hasznossága tehát hozamként is olvasható: ez a **biztos egyenérték**, az a biztos hozam, amelyet a befektető pontosan annyira tart vonzónak, mint a kockázatos portfóliót. A példában a befektető P-t egy biztos 3%-kal egyenértékűnek tartja. Ha a kockázatmentes kamat $r_f = 3\%$, akkor ennek a befektetőnek mindegy, hogy csak P-t vagy csak kincstárjegyet tart.

## Közömbösségi görbék

Az azonos $U$ hasznosságú portfóliókra

$$
\mu = U + \tfrac{1}{2} A\,\sigma^2.
$$

A $(\sigma, \mu)$ síkon ez egy felfelé görbülő parabola, egy **közömbösségi görbe**: a befektetőnek mindegy, melyik pontját tartja. Minden további kockázati egységért több várható hozammal kell fizetni, és ez az ár $\sigma$-val együtt nő. A feljebb fekvő görbék nagyobb hasznosságot jelentenek. Nagyobb $A$ mellett a görbék meredekebbek, mert a kockázatkerülőbb befektető ugyanakkora kockázatért több kompenzációt kér.

## Az optimális teljes portfólió

A teljes portfóliót a hasznosságba helyettesítve csak $y$-tól függő függvényt kapunk:

$$
U(y) = r_f + y\,(\mu_P - r_f) - \tfrac{1}{2} A\,\sigma_P^2\, y^2.
$$

Ez $y$-ban lefelé nyíló parabola. Az $(\mu_P - r_f) - A\sigma_P^2\, y$ deriváltat nullával egyenlővé téve

$$
y^{*} = \frac{\mu_P - r_f}{A\,\sigma_P^2}, \qquad U^{*} = r_f + \frac{\text{SR}_P^2}{2A},
$$

ahol $\text{SR}_P = (\mu_P - r_f)/\sigma_P$ a Sharpe-mutató. Geometriailag $y^*$ az a pont, ahol egy közömbösségi görbe éppen érinti a tőkeallokációs egyenest: a magasabb görbék elkerülik az egyenest, az alacsonyabbak két pontban metszik, és mindkét pont rosszabb.

> A kockázatos portfólió optimális súlya $y^{*} = (\mu_P - r_f)/(A\sigma_P^2)$: arányos a többlethozamával, és fordítottan arányos a varianciájával és a befektető kockázatkerülésével.

## Számpélda

Legyen $\mu_P = 11\%$, $\sigma_P = 20\%$, $r_f = 3\%$ és $A = 4$. Ekkor

$$
y^{*} = \frac{0{,}08}{4 \times 0{,}04} = 0{,}5, \qquad \mu = 3\% + 0{,}5 \times 8\% = 7\%, \qquad \sigma = 0{,}5 \times 20\% = 10\%,
$$

és $U^{*} = 0{,}07 - \tfrac{1}{2}\times 4 \times 0{,}01 = 5\%$. Csak kincstárjegyet vagy csak P-t tartva a biztos egyenérték egyaránt 3%, így a fele-fele keverék mindkét végpontnál egyértelműen jobb. Egy kockázatkerülőbb, $A = 8$ együtthatójú befektető $y^* = 0{,}25$-öt tart (várható hozam 5%, szórás 5%), egy $A = 2$ együtthatójú pedig pontosan P-t ($y^* = 1$).

Egy második befektető más piacon van, $\mu_P = 10\%$, $\sigma_P = 25\%$ és $r_f = 2\%$, kockázatkerülése pedig $A = 3$.

### Kidolgozott példa: Optimális teljes portfólió egy második befektetőnek

1. Az optimális súly a kockázatos portfólióban.
   $$y^{*} = \frac{\mu_P - r_f}{A\,\sigma_P^2}$$ → **0.4267**
2. A teljes portfólió várható hozama.
   $$\mu = r_f + y^{*}(\mu_P - r_f)$$ → **5.413%**
3. A volatilitása.
   $$\sigma = y^{*}\sigma_P$$ → **10.67%**
4. A hasznossága a $\text{SR}_P = 0{,}32$ Sharpe-mutatón keresztül.
   $$U^{*} = r_f + \frac{\text{SR}_P^2}{2A}$$ → **3.707%**

## Hitelfelvétel

Az optimális súly akkor nagyobb egynél, ha $A < (\mu_P - r_f)/\sigma_P^2$, itt ha $A < 2$. $A = 1{,}6$ mellett a befektető $y^* = 0{,}08/(1{,}6 \times 0{,}04) = 1{,}25$-öt szeretne: a saját tőkéje negyedének megfelelő összeget vesz fel hitelre $r_f$ kamatra, és 125%-ot fektet P-be, 13%-os várható hozammal és 25%-os szórással. A gyakorlatban a befektetők drágábban vesznek fel hitelt, mint amennyiért kölcsönadnak, ezért az egyenes P után lefelé törik, és az optimális hitelfelvétel kisebb.

Az ábra a példa tőkeallokációs egyenesét mutatja. Húzd a pontot az egyenes mentén $y$ kiválasztásához; a ponton átmenő görbe az a közömbösségi görbe, amelyen éppen vagy, a szaggatott görbe pedig az optimumhoz tartozik. Indulj P-ből, ahol a két görbe messze van egymástól, és húzd a kockázatmentes vég felé: a hasznosság nő, amíg a pont rá nem ugrik az optimumra $y = 0{,}5$-nél, utána ismét csökken. Válts $A$-t, és figyeld meg, hogy az optimum elmozdul, az egyenes viszont a helyén marad.

*[Interaktív ábra: utility indifference](https://quantsandbox.dev/hu/guide/portfolio/risk-aversion)*

## A két döntés szétválása

Az eredmény két részre bontja a befektetési problémát. Hogy melyik kockázatos portfóliót tartsuk, csak a piacon múlik (várható hozamok, szórások, korrelációk): minden várható érték–variancia alapon döntő befektető az érintési portfóliót választja. Hogy mennyit tartsunk belőle, csak a befektető $A$ együtthatóján múlik. Ez a **két alap tétele**: bármely optimális portfólió ugyanannak a két alapnak, a kockázatmentes eszköznek és P-nek a keveréke.

## Összefoglalás

- Az $U = \mu - \tfrac{1}{2}A\sigma^2$ várható érték–variancia hasznosság pontozza a portfóliókat; $A$ a kockázatkerülés mértéke.
- Egy portfólió hasznossága a biztos egyenértéke: az a biztos hozam, amelyet a befektető ugyanannyira vonzónak tart.
- A $\mu = U + \tfrac{1}{2}A\sigma^2$ közömbösségi görbék parabolák, nagyobb $A$ mellett meredekebbek.
- A legjobb teljes portfólió $y^* = (\mu_P - r_f)/(A\sigma_P^2)$ súlyt tart P-ben; $y^* > 1$ hitelfelvételt jelent.
- Mindenki ugyanazt a kockázatos portfóliót tartja; csak ennek és a kockázatmentes eszköznek az aránya különbözik.

> A következő lecke, a „CAPM, béta és az értékpapír-piaci egyenes”, azt vizsgálja, mi történik az árakkal, ha minden befektető ugyanazt a kockázatos portfóliót tartja.

[Keverj egy kockázatos eszközt a kockázatmentes kamattal, és mozogj a tőkeallokációs egyenesen a Kockázat és hozam laborban](https://quantsandbox.dev/hu/risk-return)

## Interaktív laborok

- [Tőkeallokációs egyenes és Sharpe-mutató](https://quantsandbox.dev/hu/risk-return)
- [Hatékony front és Markowitz-optimalizálás](https://quantsandbox.dev/hu/efficient-frontier)

## Gyakorló kérdések

### 1. Egy portfólióra $\mu = 9\%$ és $\sigma = 15\%$. Mekkora a biztos egyenértéke egy $A = 4$ kockázatkerülésű befektető számára? A választ százalékban add meg.

**Válasz:** 4.5%

$U = 0{,}09 - \tfrac{1}{2}\times 4 \times 0{,}15^2 = 0{,}09 - 0{,}045 = 4{,}5\%$: a befektető a portfóliót egy biztos 4,5%-os hozammal tartja egyenértékűnek.

### 2. Egy befektető optimális súlya a kockázatos portfólióban $y^{*} = 0{,}6$. A kockázatkerülése megduplázódik, a piac változatlan. Mekkora az új optimális súly?

- a) 0,3: $y^{*}$ fordítottan arányos $A$-val
- b) 0,15: a kockázat négyzetesen szerepel
- c) 0,6: az érintési portfólió nem változik
- d) 1,2: egy óvatosabb befektetőnek nagyobb hozam kell

**Válasz:** a) 0,3: $y^{*}$ fordítottan arányos $A$-val

$y^{*} = (\mu_P - r_f)/(A\sigma_P^2)$ arányos $1/A$-val, így $A$ duplázása felezi. Maga a kockázatos portfólió nem változik, csak a tartott mennyiség.

---

Forrás: https://quantsandbox.dev/hu/guide/portfolio/risk-aversion

Előző lecke: [Hatékony front és tőkepiaci egyenes](https://quantsandbox.dev/hu/guide/portfolio/efficient-frontier)

Következő lecke: [CAPM, béta és az értékpapír-piaci egyenes](https://quantsandbox.dev/hu/guide/portfolio/capm)
