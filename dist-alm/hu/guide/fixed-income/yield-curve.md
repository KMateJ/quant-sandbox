# Azonnali kamatok, forward kamatok és a hozamgörbe

Zérókupon-kamatok, bootstrapping a par hozamokból, implicit forward kamatok és a görbe alakja.

A „Kötvényárak és hozamok” leckében a kötvény minden pénzáramlását egyetlen rátával, a lejáratig számított hozammal diszkontáltuk. A valódi piacon az egy évre és a tíz évre kölcsönadott pénz eltérő kamatot hoz. Ez a lecke minden lejáratnak saját rátát ad, az **azonnali kamatlábat** (spot rátát), megmutatja, hogyan olvasható ki a kötvényárakból, és levezeti a belőle következő **forward kamatlábakat**. A „Kamat, kamatozás és diszkontálás” és a „Duráció és konvexitás” leckékre épül.

## A hozam mint a ráták átlaga

Két azonos lejáratú, de eltérő kuponú kötvény lejáratig számított hozama általában különbözik, még ugyanattól a kibocsátótól is. Ennek oka, hogy a hozam átlag: az adott kötvény összes kifizetési időpontjához tartozó rátákat keveri össze, a pénzáramlásaival súlyozva. Egy első évben esedékes kuponfizetés ugyanannyit kell érnie, bármelyik kötvényből származik, ezért tisztább, ha a rátát a kifizetés **időpontjához** rendeljük, nem a kötvényhez.

## Azonnali kamatlábak és diszkontfaktorok

Az $r(t)$ **azonnali kamatláb** (zérókamat) a $t$-ben lejáró zérókuponos kötvény hozama: a mától $t$-ig tartó, egyetlen visszafizetéssel járó hitelezés kamata. Ebben a leckében az azonnali és a forward kamatlábak **folytonos kamatozásúak**, így a $t$-ben fizetett 1 mai ára, a **diszkontfaktor**:

$$
P(0,t) = e^{-r(t)\,t}, \qquad r(t) = -\frac{\ln P(0,t)}{t}.
$$

A $t \mapsto r(t)$ függvény a **hozamgörbe** (a kamatlábak lejárati szerkezete). A diszkontfaktorok ugyanezt az információt hordozzák; a rátákat csak könnyebb lejáratok között összehasonlítani.

## Kuponos kötvény árazása azonnali kamatlábakkal

A kuponos kötvény zérókuponos kötvények csomagja, minden kifizetésre egy. Ha $CF_t$ a $t$-edik évben esedékes, minden pénzáramlást a saját időpontjához tartozó azonnali kamatlábbal diszkontálunk:

$$
P = \sum_{t=1}^{T} CF_t\, e^{-r(t)\,t}.
$$

Ha a görbe vízszintes, vagyis minden $t$-re $r(t) = r$, ez egyetlen rátával való diszkontálásra egyszerűsödik, és minden kötvény hozama ugyanaz. Egyébként a kötvény lejáratig számított hozama az az egy ráta, amely ezt az árat adja vissza: az azonnali kamatlábak pénzáramlásokkal súlyozott keveréke.

## Rátakinyerés (bootstrapping)

Zérókuponos kötvény nem minden lejáratra létezik, ezért az azonnali kamatlábakat általában kuponos kötvények árából nyerjük ki, lejáratról lejáratra, a rövid végtől kezdve. Ennek neve **bootstrapping**. Éves kuponokkal ($F = 100$) dolgozunk, a diszkontfaktorokra oldjuk meg az egyenleteket, amelyek nem függenek a kamatozási konvenciótól, és csak ezután váltjuk át őket folytonos kamatozású azonnali rátákra.

Tegyük fel, hogy a piacon egy egyéves zérókuponos kötvény ára 97,00, egy kétéves, 5%-os éves kuponú kötvényé pedig 101,00.

1. Az egyéves zérókuponos kötvényből $P(0,1) = 97{,}00/100 = 0{,}9700$, így $r(1) = -\ln 0{,}97 \approx 3{,}05\%$.
2. A kétéves kötvény az első évben 5-öt, a másodikban 105-öt fizet. Az első kifizetést az 1. lépés már beárazta: $101{,}00 = 5 \cdot 0{,}9700 + 105\,P(0,2)$, így $P(0,2) = 96{,}15/105 \approx 0{,}9157$ és $r(2) = -\tfrac{1}{2}\ln 0{,}9157 \approx 4{,}40\%$.

Több kötvénnyel az eljárás ugyanígy folytatódik: minden lejáratnál csak egy diszkontfaktor ismeretlen. E két azonnali kamatlábbal egy 6%-os kuponú kétéves kötvény ára csak $6 \cdot 0{,}9700 + 106 \cdot 0{,}9157 \approx 102{,}89$ lehet; bármely más árnál olcsóbban össze lehetne rakni a két jegyzett kötvényből. Lejáratig számított hozama (éves kamatozással) kb. 4,46%, a két azonnali kamatláb keveréke.

Gyakori kiindulópont a névértéken forgó kötvény, mert a kuponrátája éppen az adott lejáratra jegyzett névértékhozam (par hozam).

### Kidolgozott példa: A kétéves azonnali kamatláb kinyerése névértéken forgó kötvényből

1. Maradjunk a fenti $P(0,1) = 0{,}9700$-nál. Egy kétéves, évi 4,5%-os kuponú kötvény névértéken, 100-on forog, és 4,5-et, majd 104,5-öt fizet. Oldjuk meg az ismeretlen diszkontfaktorra.
   $$P(0,2) = \frac{100 - 4{,}5 \times 0{,}9700}{104{,}5}$$ → **0.9152**
2. Váltsuk át folytonos kamatozású azonnali kamatlábra.
   $$r(2) = -\tfrac{1}{2}\ln P(0,2)$$ → **4.43%**

## Forward kamatlábak

Az $f(t_1, t_2)$ **forward kamatláb** az a ma rögzített kamat, amelyen két jövőbeli időpont, $t_1 < t_2$ között lehet hitelt felvenni vagy nyújtani. Az arbitrázsmentesség az azonnali görbéből meghatározza. Vessünk össze két módot arra, hogy 1-et mától $t_2$-ig befektessünk:

- közvetlenül az $r_2 = r(t_2)$ azonnali kamatlábon, ami $e^{r_2 t_2}$-re nő;
- $t_1$-ig $r_1 = r(t_1)$-en, és ma megállapodunk, hogy $t_1$-től $t_2$-ig $f(t_1,t_2)$-n fektetjük újra, ami $e^{r_1 t_1}\,e^{f(t_1,t_2)(t_2 - t_1)}$-re nő.

Mindkét stratégia kockázatmentes és ma 1-be kerül, így az „Arbitrázs és a határidős ár” lecke érvelése szerint ugyanannyit kell hozniuk. A kitevőket egyenlővé téve

$$
f(t_1, t_2) = \frac{r_2 t_2 - r_1 t_1}{t_2 - t_1}.
$$

> A $t_1$ és $t_2$ közötti forward kamatláb az a ráta, amellyel a $t_1$-beli újrabefektetés egyenértékű azzal, hogy egyből $t_2$-ig fektetünk be: $f(t_1,t_2) = (r_2t_2 - r_1t_1)/(t_2 - t_1)$.

A bootstrapping példájában $f(1,2) = 2 \cdot 4{,}40\% - 3{,}05\% \approx 5{,}76\%$. Ellenőrzés: $e^{0{,}0305}e^{0{,}0576} \approx e^{2 \cdot 0{,}0440} \approx 1{,}092$.

## A pillanatnyi forward görbe

Közelítsen $t_2$ a $t_1 = t$ időponthoz. A számláló $r(t)\,t$ megváltozása, így a határérték derivált, a **pillanatnyi forward kamatláb**:

$$
f(t) = \frac{d}{dt}\big(r(t)\,t\big) = r(t) + t\,r'(t).
$$

Ebből látszik, hogyan helyezkedik el egymáshoz képest a két görbe. Ahol az azonnali görbe emelkedik ($r'(t) > 0$), ott a forward görbe **fölötte** halad; ahol csökken, ott alatta; ahol vízszintes, ott egybeesnek. Jó kép erre a kumulált átlag: az $r(t)$ azonnali kamatláb a 0 és $t$ közötti forward kamatlábak átlaga, ezért csak akkor nő, ha az újonnan hozzávett ráta az addigi átlag fölött van.

## A hozamgörbe alakjai

- **Emelkedő** (normál): a hosszú kamatok a rövidek fölött vannak. Ez a leggyakoribb alak.
- **Vízszintes**: minden lejáratra nagyjából ugyanaz a kamat; ez a „Kötvényárak és hozamok” lecke egyhozamú világa.
- **Inverz**: a rövid kamatok a hosszúak fölött vannak, gyakran akkor, ha a piac kamatcsökkentést vár.
- **Púpos**: a kamatok az első néhány évben emelkednek, aztán visszaesnek.

Az ábra egy sima, háromparaméteres (folytonos kamatozású) azonnali görbét rajzol 0-tól 30 évig, a belőle következő pillanatnyi forward görbével együtt. A **szint** az a hosszú távú kamat, amelyhez a görbe beáll, a **meredekség** azt adja meg, mennyivel van a rövid vég e szint alatt (negatív) vagy fölött (pozitív), a **púp** pedig a középső lejáratoknál ad egy kidudorodást. A kijelzők a 2, 10 és 30 éves azonnali kamatlábat és a 10 éves mínusz 2 éves különbözetet mutatják. Alapbeállításban a görbe emelkedő: 2 évre kb. 3,00%, 10 évre 3,79%, 30 évre 3,93%, a különbözet kb. 79 bázispont, és a forward görbe az azonnali fölött fut. Tedd pozitívvá a meredekséget, hogy a görbe inverz legyen, és figyeld meg, hogy a forward görbe az azonnali alá kerül; a meredekséget és a púpot 0-ra állítva a két görbe egybeesik.

*[Interaktív ábra: spot forward](https://quantsandbox.dev/hu/guide/fixed-income/yield-curve)*

## Összefoglalás

- Az $r(t)$ azonnali kamatláb a $t$-ig tartó zérókuponos hitel kamata; folytonos kamatozással a diszkontfaktor $e^{-r(t)t}$.
- A kuponos kötvényt úgy árazzuk, hogy minden pénzáramlását a saját időpontjához tartozó azonnali kamatlábbal diszkontáljuk; lejáratig számított hozama ezek keveréke.
- A bootstrapping a kuponos kötvények árából lejáratról lejáratra nyeri ki a diszkontfaktorokat.
- Az arbitrázsmentességből $f(t_1,t_2) = (r_2t_2 - r_1t_1)/(t_2 - t_1)$; a forward görbe ott van az azonnali fölött, ahol az emelkedik, és ott alatta, ahol csökken.

[Illessz és alakíts hozamgörbét a Hozamgörbe laborban](https://quantsandbox.dev/hu/yield-curve)

## Interaktív laborok

- [Hozamgörbe-bootstrapping, spot és forward kamatlábak](https://quantsandbox.dev/hu/yield-curve)
- [Állampapír-határidős: konverziós faktor, legolcsóbban szállítható kötvény](https://quantsandbox.dev/hu/treasury-futures)

## Gyakorló kérdések

### 1. A folytonos kamatozású azonnali kamatlábak $r(1) = 3\%$ és $r(2) = 4\%$. Mekkora az $f(1,2)$ forward kamatláb, százalékban?

**Válasz:** 5%

$f(1,2) = (2 \times 4\% - 1 \times 3\%)/(2 - 1) = 5\%$. Két év 4%-on ugyanannyi, mint egy év 3%-on, majd egy év 5%-on.

### 2. Egy lejárati tartományban a pillanatnyi forward görbe az azonnali görbe fölött halad. Hogyan viselkedik ott az azonnali görbe?

- a) Emelkedik
- b) Csökken
- c) Vízszintes
- d) A forwardokból nem állapítható meg

**Válasz:** a) Emelkedik

$f(t) = r(t) + t\,r'(t)$, így $f(t) > r(t)$ pontosan akkor, ha $r'(t) > 0$: az azonnali kamatláb, a forwardok kumulált átlaga, akkor nő, ha az új forward fölötte van.

---

Forrás: https://quantsandbox.dev/hu/guide/fixed-income/yield-curve

Előző lecke: [Immunizáció és durációillesztés](https://quantsandbox.dev/hu/guide/fixed-income/immunization)

Következő lecke: [Nem párhuzamos hozamgörbe-mozgások és kulcskamat-durációk](https://quantsandbox.dev/hu/guide/fixed-income/curve-risk)
