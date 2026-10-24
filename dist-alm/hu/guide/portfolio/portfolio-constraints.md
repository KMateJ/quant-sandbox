# Portfóliókorlátok és a shortolás nélküli hatékony front

Miért nem követheti egy valódi portfólió a korlátozatlan frontot: shortolási tilalom, pozíciólimitek, és mennyit vesznek el a Sharpe-mutatóból.

A „Hatékony front és tőkepiaci egyenes” lecke a legjobb portfóliót keresi, ha tetszőleges súlyok megengedettek, a negatívak is. Alig van valódi befektető, aki ezt megtehetné: sok alap nem shortolhat, mások pozíciónként vagy ágazatonként korlátoznak. Ez a lecke azt kérdezi, mit tesznek az ilyen szabályok a fronttal és mibe kerülnek, a „Diverzifikáció és korreláció” kételemű képére építve.

## Mi az a korlát?

A korábbi leckékben az egyetlen korlát a költségvetés: a súlyok összege egy, $\sum_i w_i = 1$. A valódi megbízások többet is előírnak:

- **Shortolási tilalom:** minden eszközre $w_i \ge 0$. Gyakori nyugdíjalapoknál és befektetési alapoknál.
- **Pozíciókorlát:** $w_i \le \bar w$, például legfeljebb 10% egyetlen részvényben, a diverzifikáció kikényszerítésére.
- **Csoportkorlát:** legfeljebb 30% egy ágazatban vagy egy országban.

Mindegyik a súlyokra szóló feltétel, így a minimális variancia feladatát a korábbinál kisebb portfóliókészleten oldjuk meg.

## A korlátozott front

A hatékony front minden célhozamhoz a legkisebb volatilitású portfólió. Ha kisebb készleten minimalizálunk, a legjobb volatilitás legfeljebb ugyanakkora marad, vagy romlik. A korlátozott front tehát sosem esik a korlátozatlantól balra: ott érinti, ahol a szabad optimum véletlenül betartja a szabályokat, máshol belül fut.

Shortolási tilalom mellett a súlyok (három eszköznél) egy háromszögben mozognak, és a frontot a háromszög szélén és csúcsain lévő portfóliók rajzolják ki. A legegyszerűbben az ábrán látszik: három eszköz 5%, 6% és 10% várható hozammal és 10%, 18% és 24% volatilitással. A második és a harmadik eszköz erősen korrelál (0,85), ezért a szabad optimum a gyengébbet shortolná, és a pénzből többet vásárolna a jobbikból.

*[Interaktív ábra: constrained frontier](https://quantsandbox.dev/hu/guide/portfolio/portfolio-constraints)*

2%-os kockázatmentes kamatnál a szabad érintési portfólió súlyai 80%, $-$50% és 70%: a második eszközben a vagyon felének megfelelő short pozíciót tart. A shortolási tilalom alatti front ezt nem teheti meg, így az érintési portfóliója 67%, 0% és 33%. A két front ott esik egybe, ahol nincs szükség short pozícióra, és a célhozam emelkedésével válnak szét. Növeld az ábrán a kockázatmentes kamatot, és a rés nő, mert az érintési portfólió kijjebb kerül, ahol a shortolás többet számít.

## A korlát ára

Mivel a legjobb Sharpe-mutató a fronton érhető el, egy szabály ára azzal mérhető, mennyi Sharpe-mutatót vesz el. Az ábrán az alapbeállításnál a szabad érintési portfólió Sharpe-mutatója 0,416, a tilalom alattié 0,394, vagyis a veszteség 0,023, nagyjából 5%. Ennyibe kerül a tilalom ezen az eszközkészleten; gyengén korreláló eszközöknél a szabad optimumnak nincs szüksége short pozícióra, és az ár nulla.

Egy figyelmeztetés: a nagy short pozíciókat tartalmazó szabad optimum a bemenő adatok hibáira is a legérzékenyebb. A shortolás nélküli portfólió elméleti Sharpe-mutatóból enged, de mintán kívül gyakran kevésbé téved; ezt a következő lecke fejti ki.

### Kidolgozott példa: Mibe kerül a shortolási tilalom az ábra alapbeállításánál

1. Szabad érintési portfólió: várható hozam 8,00%, volatilitás 14,41%, kockázatmentes kamat 2%.
   $$S_{\text{szabad}} = \frac{\mu - r_f}{\sigma}$$ → **0.4164**
2. Érintési portfólió shortolási tilalommal: várható hozam 6,65%, volatilitás 11,81%.
   $$S_{\text{tiltott}} = \frac{\mu - r_f}{\sigma}$$ → **0.3938**
3. A tilalom ára Sharpe-mutatóban.
   $$S_{\text{szabad}} - S_{\text{tiltott}}$$ → **0.0226**
4. A szabad Sharpe-mutató százalékában.
   $$100\,\frac{S_{\text{szabad}} - S_{\text{tiltott}}}{S_{\text{szabad}}}$$ → **5.4**

## A korlátok mint vélemények

A shortolási tilalom egy nyers vélemény: egyetlen eszköztől sem várunk olyan rossz teljesítményt, hogy negatív súlyt érdemeljen. Így nézve a súlyok enyhe zsugorításaként működik. A finomabb módszerek, például a Black–Litterman-modell, a befektető véleményét a várható hozamokba építik be, de az elv ugyanaz: megakadályozni, hogy az optimalizáló szélsőséges inputok alapján cselekedjen.

## Összefoglalás

- A korlátok (shortolási tilalom, pozíciókorlát, csoportkorlát) a súlyokat a portfóliók kisebb készletére szorítják.
- A korlátozott front sosem jobb a szabadnál: ott érinti, ahol a szabad optimum megengedett, máshol belül fut.
- A szabály ára a Sharpe-mutató, amelyet elvesz: az ábra alapbeállításánál 0,023, nagyjából 5%.
- A korlátok a szélsőséges súlyokat is fékezik, ami bizonytalan inputoknál számít.

> A következő lecke („A várható hozam és a kovariancia becslése”) megmutatja, mennyire bizonytalanok ezek az inputok, és miért nagyítja fel az optimalizáló a hibákat.

[Rajzolj ki egy frontot a Hatékony front laborban, és változtasd a korlátokat](https://quantsandbox.dev/hu/efficient-frontier)

## Interaktív laborok

- [Hatékony front és Markowitz-optimalizálás](https://quantsandbox.dev/hu/efficient-frontier)
- [Kéteszközös portfólió: diverzifikáció és korreláció](https://quantsandbox.dev/hu/portfolio-lab)

## Gyakorló kérdések

### 1. Melyik állítás igaz mindig a shortolási tilalom melletti front esetén?

- a) Sosem esik a korlátozatlan front fölé
- b) Egyenes
- c) Nagyobb a legjobb Sharpe-mutatója
- d) Háromnál több eszköz kell hozzá

**Válasz:** a) Sosem esik a korlátozatlan front fölé

A korlát szűkíti a megengedett portfóliók készletét, így az adott hozamhoz tartozó legkisebb volatilitás legfeljebb ugyanakkora marad vagy nő. A legjobb Sharpe-mutató ezért sem javulhat.

### 2. Két eszköz tökéletesen korrelál ($\rho = 1$), volatilitásuk 10% és 20%. Korlát nélkül a minimális varianciájú portfólió 200%-ot tart az első és $-$100%-ot a második eszközben. Hány százalékot tart az első eszközben a shortolás nélküli minimális varianciájú portfólió?

**Válasz:** 100

Tilalommal a súly 0 és 1 között marad. A volatilitás csökken, ahogy a súly a kisebb volatilitású első eszközbe tolódik, így a legjobb megengedett portfólió a sarokban van: 100% az 1. eszközben.

---

Forrás: https://quantsandbox.dev/hu/guide/portfolio/portfolio-constraints

Előző lecke: [Kockáztatott érték (VaR) és várható veszteség (ES)](https://quantsandbox.dev/hu/guide/portfolio/risk-measures)

Következő lecke: [A várható hozam és a kovariancia becslése](https://quantsandbox.dev/hu/guide/portfolio/input-estimation)
