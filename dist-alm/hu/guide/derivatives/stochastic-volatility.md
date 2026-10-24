# Sztochasztikus volatilitás és a Heston-modell

A Heston-féle varianciafolyamat, az átlaghoz való visszatérés, a vol-of-vol, a Feller-feltétel, és hogyan alakítja a korreláció és a vol-of-vol a mosolyt.

Az „Implikált volatilitás és a volatilitás-mosoly” című lecke egy olyan piaci tényt írt le, amelyet „A Black–Scholes-képlet” nem tud megmagyarázni: ha minden jegyzett opcióárból visszaszámoljuk a saját $\sigma$-ját, az implikált volatilitások a kötési ár függvényében mosolyt vagy ferdeséget rajzolnak ki, nem vízszintes vonalat. Az ilyen alakot előállító modellben a volatilitásnak változnia kell. Ez a lecke a Heston-modellt építi fel, amelyben maga a variancia is véletlenszerűen mozog, és megmutatja, hogyan alakítja két paramétere a mosolyt.

## A konstans volatilitás és korlátai

A geometriai Brown-mozgásban a véletlen sokkok mérete sosem változik. A megfigyelt hozamok másként viselkednek. Nyugodt és viharos időszakok váltják egymást, vagyis a volatilitás időben csomósodik. Az árfolyam nagy esései jellemzően növekvő volatilitással járnak együtt. A hozamok eloszlásának pedig vastagabb a széle, mint a normális eloszlásé, különösen lefelé.

Konstans $\sigma$ mellett ezek egyike sem jöhet létre. A kézenfekvő megoldás az, hogy a variancia maga is véletlen folyamat legyen, egy második véletlenforrással hajtva.

## A Heston-modell

Jelölje $v_t$ a részvényhozamok pillanatnyi varianciáját, így a pillanatnyi volatilitás $\sqrt{v_t}$. A $\mathbb{Q}$ kockázatsemleges mérték alatt, osztalék nélkül a **Heston-modell**

$$
dS_t = rS_t\,dt + \sqrt{v_t}\,S_t\,dW^{(1)}_t,
$$

$$
dv_t = \kappa(\theta - v_t)\,dt + \xi\sqrt{v_t}\,dW^{(2)}_t,
$$

ahol $W^{(1)}$ és $W^{(2)}$ olyan Brown-mozgások, amelyek korrelációja $\rho$, azaz $dW^{(1)}_t\,dW^{(2)}_t = \rho\,dt$. Az első egyenlet a „Geometriai Brown-mozgás” című lecke modellje, csak $\sigma$ helyén a mozgó $\sqrt{v_t}$ áll. A második egyenlet a variancia mozgását írja le.

## A paraméterek

- $v_0$: a mai variancia. $\sqrt{v_0}$ a jelenlegi volatilitás.
- $\theta$: a hosszú távú variancia. Hosszú távon $v_t$-t a $\theta$ felé húzza a modell, így $\sqrt{\theta}$ a hosszú távú volatilitás.
- $\kappa$: az átlaghoz való visszatérés sebessége. A $\kappa(\theta - v_t)$ drift pozitív, ha a variancia $\theta$ alatt van, negatív, ha fölötte, és annál erősebb, minél nagyobb $\kappa$.
- $\xi$: a variancia volatilitása (vol-of-vol). Azt adja meg, mennyire ingadozik maga a variancia.
- $\rho$: az árfolyam és a variancia sokkjai közötti korreláció.

A véletlen tag nélkül a variancia exponenciálisan közelítene $\theta$-hoz. A véletlen tag az átlagos pályán nem változtat, így a variancia várható értéke a $t$ időpontban

$$
\mathbb{E}^{\mathbb{Q}}[v_t] = \theta + (v_0 - \theta)\,e^{-\kappa t}.
$$

A $\theta$-tól való eltérés $\ln 2/\kappa$ évenként feleződik. Ez egy varianciasokk **felezési ideje**.

A $dW^{(2)}$ előtti $\sqrt{v_t}$ tényező miatt a sokkok kisebbek lesznek, ahogy a variancia nullához közelít. Ha az átlaghoz húzó erő elég nagy a vol-of-volhoz képest, a variancia sosem éri el a nullát. Ez a **Feller-feltétel**:

$$
2\kappa\theta \ge \xi^2.
$$

Ha nem teljesül, a variancia elérheti a nullát, majd visszapattan. A modell ekkor is használható, de a szimulációban gondosan kell kezelni a nulla környékét.

## Számpélda

Legyen $v_0 = 0{,}09$, $\theta = 0{,}04$ és $\kappa = 2$. A mai volatilitás $\sqrt{0{,}09} = 30\%$, a hosszú távú $\sqrt{0{,}04} = 20\%$. A felezési idő $\ln 2/2 \approx 0{,}35$ év, valamivel több mint négy hónap.

Fél év múlva a variancia várható értéke $0{,}04 + 0{,}05\,e^{-1} \approx 0{,}0584$, ami körülbelül 24,2% volatilitás. Egy év múlva $0{,}04 + 0{,}05\,e^{-2} \approx 0{,}0468$, körülbelül 21,6%.

A Feller-feltételhez: $2\kappa\theta = 0{,}16$. Ha $\xi = 0{,}3$, akkor $\xi^2 = 0{,}09 \le 0{,}16$, a feltétel teljesül. Ha $\xi = 0{,}5$, akkor $\xi^2 = 0{,}25 > 0{,}16$, a feltétel sérül, és a variancia elérheti a nullát.

### Kidolgozott példa: Várható variancia és a Feller-feltétel ellenőrzése

1. Legyen $v_0 = 0{,}0625$ (25%-os volatilitás), $\theta = 0{,}04$, $\kappa = 1{,}5$. Egy varianciasokk felezési ideje, években.
   $$\ln 2 / \kappa$$ → **0.4621**
2. A várható variancia egy év múlva.
   $$\theta + (v_0 - \theta)\,e^{-\kappa \cdot 1}$$ → **0.04502**
3. A megfelelő volatilitás, százalékban.
   $$\sqrt{\mathbb{E}^{\mathbb{Q}}[v_1]}$$ → **21.22%**
4. A Feller-tartalék $\xi = 0{,}35$ mellett; negatív, tehát a feltétel épp nem teljesül.
   $$2\kappa\theta - \xi^2$$ → **-0.0025**

## A korreláció és a ferdeség

Részvényeknél $\rho$ jellemzően negatív, gyakran $-0{,}5$ és $-0{,}9$ között. Negatív $\rho$ mellett az árfolyam esése általában a variancia növekedésével jár. Ez a **tőkeáttételi hatás**: ha a részvényárfolyam esik, a vállalat adóssága a saját tőkéhez képest nagyobb lesz, és a részvény kockázatosabbá válik.

Nézzük, mit jelent ez $S_T$ eloszlására. Az eső pályák varianciája nő, ezért lefelé jobban szétszóródnak. Az emelkedő pályák varianciája csökken, ezért közelebb maradnak egymáshoz. A bal oldali szél hosszabb lesz a jobb oldalinál. A pénzen kívüli putok, amelyek éppen ebben a bal szélben fizetnek, többet érnek, mint a Black–Scholes-modellben, így az implikált volatilitásuk magasabb. Az implikált volatilitás ezért a kötési ár növekedésével csökken: ez a **ferdeség** (skew).

## A vol-of-vol és a görbület

A $\xi$ paraméter szabja meg, mennyit mozog a variancia. Ha $\xi = 0$, a variancia a determinisztikus pályáját követi, a modell közel áll az időben változó volatilitású Black–Scholes-modellhez, és a mosoly szinte lapos. Nagyobb $\xi$ mellett nyugodt és nagyon viharos pályák keverednek. Az így kapott hozameloszlás csúcsa élesebb, mindkét széle vastagabb, mint az azonos varianciájú normális eloszlásé. A pénztől mindkét irányban távoli opciók értéke nő, és a mosoly mindkét végén felfelé hajlik.

> A Heston-modellben $\rho$ megdönti az implikált volatilitás görbéjét (negatív $\rho$ adja a részvénypiaci ferdeséget), $\xi$ pedig meghajlítja (nagyobb vol-of-vol nagyobb görbületet ad).

Az ábra a Heston-modell implikált volatilitását mutatja a kötési ár függvényében, $S_0 = 100$, $r = 0$, $T = 1$, $v_0 = \theta = 0{,}04$ és $\kappa = 2$ mellett. Minden pont a Heston-féle call-ár Black–Scholes-implikált volatilitása az adott kötési áron; a Heston-árat az alább leírt karakterisztikus függvényből számolja az ábra. A $\sqrt{\theta} = 20\%$ szintű vízszintes vonal a Black–Scholes- (konstans volatilitású) referencia. A kijelzők az implikált volatilitást mutatják $K = 80$, $100$ és $120$ mellett, valamint a $\text{IV}(80) - \text{IV}(120)$ ferdeséget.

Az alapértelmezett $\rho = -0{,}7$, $\xi = 0{,}5$ mellett az implikált volatilitások 23,03%, 18,05% és 14,54%, a ferdeség 8,49 százalékpont. Vidd $\rho$-t $-0{,}9$ felé, és a ferdeség nő. $\rho = 0$ mellett ugyanez a három kötési ár 20,26%, 18,76% és 19,82%: nagyjából szimmetrikus mosoly, amelynek minimuma a pénz közelében van. $\xi$ növelésével a görbe egyre jobban hajlik. Figyeld meg azt is, hogy a pénzbeli implikált volatilitás 20% alatt marad, pedig a variancia $\theta$-ról indul, és oda tér vissza: a vol-of-vol a középtől a szélek felé csoportosítja át az értéket.

*[Interaktív ábra: vol smile](https://quantsandbox.dev/hu/guide/derivatives/stochastic-volatility)*

A fenti mosoly egy egész **implikált volatilitási felület** egyetlen, $T = 1$-hez tartozó metszete: a felület minden kötési árhoz és minden lejárathoz megad egy implikált volatilitást. A következő ábra ezt a felületet rajzolja meg 70 és 130 közötti kötési árakra és 3 hónap és 2 év közötti lejáratokra, a fentivel azonos paraméterekkel. Húzással forgatható, görgetéssel nagyítható. A $\rho$ és a $\xi$ a gombokkal választható. Alapbeállítással ($\rho = -0{,}7$, $\xi = 0{,}5$) a $\text{IV}(80) - \text{IV}(120)$ ferdeség 3 hónapra 11,53, 1 évre 8,49, 2 évre 5,76 százalékpont: a ferdeség a lejárattal laposodik. Hosszabb távon a variancia több időt kap, hogy visszatérjen $\theta$-hoz, ezért a loghozam eloszlása közelebb kerül a normálishoz. $\rho = 0$ mellett a felület csaknem szimmetrikus völgy, $\rho = +0{,}3$ mellett a dőlés megfordul.

*[Interaktív ábra: iv surface](https://quantsandbox.dev/hu/guide/derivatives/stochastic-volatility)*

## Árazás a Heston-modellben

Egy európai call ára továbbra is a diszkontált kockázatsemleges várható érték, $C_0 = e^{-rT}\,\mathbb{E}^{\mathbb{Q}}[(S_T - K)^+]$. A Black–Scholes-képlethez hasonló rövid képlet nincs, de két bevett út létezik.

Az első a szimuláció, mint a „Monte Carlo-opcióárazás” című leckében. Osszuk fel $[0, T]$-t kis $\Delta t$ lépésekre. Minden lépésben sorsoljunk két független standard normális $Z_1, Z_2$ értéket, legyen $\varepsilon_1 = Z_1$ és $\varepsilon_2 = \rho Z_1 + \sqrt{1-\rho^2}\,Z_2$, így a két sokk korrelációja $\rho$, majd frissítsünk:

$$
v_{t+\Delta t} = v_t + \kappa(\theta - v_t)\,\Delta t + \xi\sqrt{v_t^+}\,\sqrt{\Delta t}\,\varepsilon_2,
$$

$$
S_{t+\Delta t} = S_t\exp\Big(\big(r - \tfrac{1}{2}v_t^+\big)\Delta t + \sqrt{v_t^+}\,\sqrt{\Delta t}\,\varepsilon_1\Big).
$$

Itt $v_t^+ = \max(v_t, 0)$ kiszűri azokat a kis negatív értékeket, amelyeket egy diszkrét lépés előállíthat. A diszkontált kifizetést sok pályán átlagolva kapjuk az árat, a „Monte Carlo-opcióárazás” leckéből ismert standard hibával.

A második út félig analitikus. Heston megmutatta, hogy $\ln S_T$ karakterisztikus függvénye zárt alakban felírható. A call ára ekkor $S_0P_1 - Ke^{-rT}P_2$ alakú, ugyanolyan szerkezetű, mint a Black–Scholes-képlet, ahol $P_1$ és $P_2$ egydimenziós numerikus integrállal számolt valószínűségek. Ez elég gyors ahhoz, hogy az öt paramétert egy teljes piaci árfelülethez illesszük.

## Összefoglalás

- A Heston-modellben a $v_t$ variancia saját, átlaghoz visszatérő véletlen folyamatot követ, amely korrelál az árfolyammal.
- $v_0$ a mai variancia, $\theta$ a hosszú távú szint, $\kappa$ a visszatérés sebessége ($\ln 2/\kappa$ felezési idővel), $\xi$ a vol-of-vol, $\rho$ a korreláció.
- A $2\kappa\theta \ge \xi^2$ Feller-feltétel távol tartja a varianciát a nullától.
- Negatív $\rho$ adja a részvénypiaci ferdeséget, nagyobb $\xi$ erősebben hajló mosolyt.
- Az árak szimulációból vagy a karakterisztikus függvény numerikus integráljából adódnak.

[Szimulálj árfolyam- és variancia-pályákat, és árazz opciókat a Heston-laborban](https://quantsandbox.dev/hu/heston)

## Interaktív laborok

- [Heston-modell: sztochasztikus volatilitás szimulátor](https://quantsandbox.dev/hu/heston)

## Gyakorló kérdések

### 1. A Heston-modellben a variancia $\kappa = 4$ sebességgel tér vissza az átlaghoz. Hány év egy varianciasokk felezési ideje?

**Válasz:** 0.1733 év

A $\theta$-tól való eltérés $e^{-\kappa t}$ szerint csökken, így $\ln 2/\kappa = 0{,}693/4 \approx 0{,}173$ év alatt feleződik, ami nagyjából két hónap.

### 2. $\rho = -0{,}7$ mellett melyik opciók implikált volatilitása magasabb a pénzen lévőkénél?

- a) Az alacsony kötési árú (pénzen kívüli) putoké
- b) A magas kötési árú (pénzen kívüli) calloké
- c) Minden kötési áron ugyanannyi
- d) Egyiké sem: $\rho$ csak a szintet tolja el

**Válasz:** a) Az alacsony kötési árú (pénzen kívüli) putoké

A negatív $\rho$ a zuhanó pályákon növeli a varianciát, és megnyújtja a bal farkat, ezért az alacsony kötési árak drágábbak lesznek, mint a Black–Scholes-modellben: ez a részvénypiaci ferdeség.

---

Forrás: https://quantsandbox.dev/hu/guide/derivatives/stochastic-volatility

Előző lecke: [Implikált volatilitás és a volatilitás-mosoly](https://quantsandbox.dev/hu/guide/derivatives/implied-volatility)

Következő lecke: [Statikus replikáció: Breeden–Litzenberger és Carr–Madan](https://quantsandbox.dev/hu/guide/derivatives/static-replication)
