# Korrelált Brown-mozgások és többeszközös modellek

Korrelált Brown-mozgások Cholesky-faktorral, a kétdimenziós Itô-szabály, és hol lép be a korreláció a Heston-modellbe és a kosáropciók árazásába.

Eddig mindig egyetlen Brown-mozgással dolgoztunk. A valódi modellek ritkán elégednek meg eggyel. A részvény és a volatilitása együtt mozog, egy kosáropció egyszerre több eszköztől függ, egy portfólió pedig éppen az a helyzet, amelyről a „Diverzifikáció és korreláció” szól. A lecke két, tetszőleges korrelációjú Brown-mozgást épít fel „A Brown-mozgás tulajdonságai” leckében szereplő tulajdonságokból, megmutatja, hogyan terjed ki az eljárás sok eszközre, és kimondja az „Az Itô-lemma” szabályának kétdimenziós változatát. Azt is elmondja, hol jelenik meg a korreláció az árazási modellekben, és hogyan szimuláljuk az „SDE-k szimulációja: az Euler–Maruyama-séma” módszerével.

## Két Brown-mozgás ρ korrelációval

Két standard Brown-mozgásnak, $W_1$-nek és $W_2$-nek $\rho \in [-1, 1]$ a **korrelációja**, ha a növekményeik korrelációja egy rövid $dt$ szakaszon $\rho$. A kvadratikus variáció nyelvén ez egyetlen szabály a keresztszorzatra:

$$
d\langle W_1, W_2 \rangle_t = \rho\,dt, \qquad d\langle W_i \rangle_t = dt.
$$

Ilyen párt könnyű építeni két **független** Brown-mozgásból, $W_1$-ből és $W_\perp$-ből. A $W_1$-et megtartjuk, a másikat belekeverjük:

$$
W_2 = \rho\,W_1 + \sqrt{1 - \rho^2}\;W_\perp.
$$

Ekkor $W_2$ növekményei függetlenek és normálisak $(\rho^2 + 1 - \rho^2)\,dt = dt$ szórásnégyzettel, tehát önmagában is standard Brown-mozgás, a növekménye pedig $\rho\,dt$-vel kovariál a $W_1$ növekményével. $\rho = 0$-nál a két mozgás független, $\rho = \pm 1$-nél ugyanaz a pálya vagy annak tükörképe. Az ábra mindkét pályát ugyanabból a véletlen sorozatból rajzolja, és a $\rho$-t mozgathatod. Indulj az alapértelmezett $\rho = -0{,}7$-ről, és nézd, hogyan tükrözik nagyjából egymást a pályák; a növekmények mintakorrelációja egy mindössze 250 lépéses pályán zajos, de a konstrukció pontosan rögzíti, hogy $\langle W_1, W_2 \rangle_T = \rho\,T$, ami $T = 1$-re $-0{,}70$.

*[Interaktív ábra: correlated paths](https://quantsandbox.dev/hu/guide/stochastic/correlated-brownian-motions)*

## A Cholesky-felbontás

A fenti konstrukció egy mátrixszorzat. Írjuk egy lépés független sokkjait $\varepsilon = (\varepsilon_1, \varepsilon_2)$ standard normális vektorként, a korreláltakat pedig $Z = L\,\varepsilon$ alakban:

$$
L = \begin{pmatrix} 1 & 0 \\ \rho & \sqrt{1 - \rho^2} \end{pmatrix}, \qquad L L^{\top} = \begin{pmatrix} 1 & \rho \\ \rho & 1 \end{pmatrix}.
$$

Ez az $L$ a korrelációs mátrix **Cholesky-felbontása**. $n$ eszközre, $C$ korrelációs mátrixszal ugyanez a gondolat működik: keressünk olyan alsó háromszögmátrixot, amelyre $L L^{\top} = C$, és legyen $Z = L\,\varepsilon$ független $\varepsilon$-ra. Ilyen $L$ pontosan akkor létezik, ha $C$ **pozitív definit**, ami valódi megszorítás. A páronkénti korrelációk egymástól független megválasztása, például $\rho_{12} = \rho_{13} = 0{,}9$ és $\rho_{23} = -0{,}9$, megbukhat rajta, és akkor semmilyen valószínűségi változó-rendszernek sincsenek ezek a korrelációi. Az algoritmus akkor jelzi a hibát, amikor nem pozitív szám négyzetgyökére lenne szükség; az ábra $\sqrt{1 - \rho^2}$ kijelzője két eszköznél éppen ez a négyzetgyök, és $\rho = \pm 1$-nél eltűnik.

## A kétdimenziós Itô-szabály

Legyen $dX = \mu_1\,dt + \sigma_1\,dW_1$ és $dY = \mu_2\,dt + \sigma_2\,dW_2$, ahol $d\langle W_1, W_2 \rangle = \rho\,dt$. Egy sima $f(t, x, y)$ függvényre „Az Itô-lemma” egyetlen taggal bővül, a keresztaggal, mert $dX\,dY = \rho\,\sigma_1 \sigma_2\,dt$:

$$
df = f_t\,dt + f_x\,dX + f_y\,dY + \tfrac{1}{2} f_{xx}\,\sigma_1^2\,dt + \tfrac{1}{2} f_{yy}\,\sigma_2^2\,dt + f_{xy}\,\rho\,\sigma_1 \sigma_2\,dt.
$$

Az $f(x, y) = x\,y$ függvénnyel ez a korrelált folyamatok **szorzatszabálya**:

$$
d(XY) = X\,dY + Y\,dX + \rho\,\sigma_1 \sigma_2\,dt.
$$

Magukra a Brown-mozgásokra ($X = W_1$, $Y = W_2$, $\sigma_1 = \sigma_2 = 1$) a pótlólagos tag $\rho\,dt$. A $W_1 W_2$ szorzat ezért nem martingál; a driftje $\rho$, és a várható értéket véve $E[W_1(T)\,W_2(T)] = \rho\,T$.

## Hol jelenik meg a korreláció

A „Sztochasztikus volatilitás és a Heston-modell” leckében az árfolyamot és a varianciát $\rho$ korrelációjú Brown-mozgások hajtják:

$$
dS = \mu S\,dt + \sqrt{v}\,S\,dW_1, \qquad dv = \kappa(\theta - v)\,dt + \xi\sqrt{v}\,dW_2, \qquad d\langle W_1, W_2 \rangle = \rho\,dt.
$$

A részvényindexek esnek, amikor a volatilitás nő, ezért a kalibrált $\rho$ negatív, jellemzően $-0{,}5$ és $-0{,}9$ között. Ez a negatív előjel ferdíti el az implikált volatilitási mosolyt. A korreláció hajtja a **kosár- és spread opciókat** is, amelyek kifizetése több eszköztől függ: egy súlyozott összeg szórásnégyzetében ott vannak a $2\,w_i w_j\,\rho_{ij}\,\sigma_i \sigma_j$ tagok, pontosan úgy, mint a portfólió szórásnégyzetében. Egy kopula azt is megengedné, hogy a függőség eltérjen ettől a lineáris alaktól; itt erre nem lesz szükségünk.

## Korrelált eszközök szimulációja

Az Euler-sémában csak a sokk változik. Minden lépésben húzzunk független standard normális $\varepsilon_1, \varepsilon_2$ értékeket, és a két független sokk helyett használjuk a $Z_1 = \varepsilon_1$, $Z_2 = \rho\,\varepsilon_1 + \sqrt{1 - \rho^2}\,\varepsilon_2$ párt. Minden más, a „Monte Carlo-opcióárazás” árazó átlagával együtt, ugyanaz marad.

### Kidolgozott példa: Korrelált sokkok ρ = −0,7 esetén, és a szorzatszabály

1. A független sokk súlya a Cholesky-felbontás második eleme.
   $$L_{22} = \sqrt{1 - (-0{,}7)^2}$$ → **0.7141**
2. Húzzuk $\varepsilon_1 = 0{,}8$-at és $\varepsilon_2 = -0{,}3$-at. Az első korrelált sokk $Z_1 = \varepsilon_1 = 0{,}8$; a második mindkettőt keveri.
   $$Z_2 = \rho\,\varepsilon_1 + L_{22}\,\varepsilon_2 = -0{,}7 \times 0{,}8 + 0{,}7141 \times (-0{,}3)$$ → **-0.7742**
3. A szorzatszabály szerint $d(W_1 W_2) = W_2\,dW_1 + W_1\,dW_2 + \rho\,dt$. A két sztochasztikus integrál várható értéke nulla, így a szorzat várható értéke $T = 1$ után $\rho T$.
   $$E[W_1(1)\,W_2(1)] = \rho \cdot 1$$ → **-0.7**

## Összefoglalás

- Két Brown-mozgás korrelációja $\rho$, ha $d\langle W_1, W_2 \rangle = \rho\,dt$; építsd őket $W_2 = \rho W_1 + \sqrt{1 - \rho^2}\,W_\perp$ alakban.
- $n$ eszköznél a korrelált sokkok $Z = L\varepsilon$, ahol $L L^{\top} = C$ a Cholesky-felbontás, amely pontosan akkor létezik, ha $C$ pozitív definit.
- A kétdimenziós Itô-szabály az $f_{xy}\,\rho\,\sigma_1 \sigma_2\,dt$ keresztaggal bővül, ebből $d(XY) = X\,dY + Y\,dX + \rho\,\sigma_1 \sigma_2\,dt$.
- A korreláció hajtja a Heston-modell ferdeségét (részvényeknél $\rho < 0$), valamint a kosár- és spread opciók árát.

> A következő lecke, az „Átlaghoz visszahúzó folyamatok: Ornstein–Uhlenbeck és Vasicek”, visszatér az egydimenziós modellekhez, és egy hosszú távú szint felé húzó erőt ad hozzá.

[Nézd meg az ár–variancia korreláció hatását a Heston-laborban](https://quantsandbox.dev/hu/heston)

## Interaktív laborok

- [Heston-modell: sztochasztikus volatilitás szimulátor](https://quantsandbox.dev/hu/heston)
- [Monte Carlo-opcióárazó szimulátor](https://quantsandbox.dev/hu/monte-carlo)

## Gyakorló kérdések

### 1. Két Brown-mozgás korrelációja $\rho = 0{,}6$. A $W_2 = \rho W_1 + \sqrt{1-\rho^2}\,W_\perp$ konstrukcióban mekkora a független $W_\perp$ mozgás súlya?

**Válasz:** 0.8

A súly $\sqrt{1 - \rho^2} = \sqrt{1 - 0{,}36} = \sqrt{0{,}64} = 0{,}8$. Vedd észre, hogy $0{,}6^2 + 0{,}8^2 = 1$, így a szórásnégyzet 1 marad.

### 2. A Heston-modellben az árfolyam- és a varianciasokk $\rho$ korrelációjának melyik előjele adja a részvényekre jellemző ferdeséget, vagyis az alacsony kötési árfolyamok magasabb implikált volatilitását?

- a) Negatív
- b) Nulla
- c) Pozitív
- d) Az előjel nem számít

**Válasz:** a) Negatív

Negatív $\rho$ azt jelenti, hogy a volatilitás hajlamos nőni, amikor az árfolyam esik. A lefelé mozgásokat így nagyobb kilengések kísérik, az alacsony kötési árfolyamú opciók többet érnek, és ez a megfigyelt ferdeség.

---

Forrás: https://quantsandbox.dev/hu/guide/stochastic/correlated-brownian-motions

Előző lecke: [SDE-k szimulációja: az Euler–Maruyama-séma](https://quantsandbox.dev/hu/guide/stochastic/sde-simulation)

Következő lecke: [Átlaghoz visszahúzó folyamatok: Ornstein–Uhlenbeck és Vasicek](https://quantsandbox.dev/hu/guide/stochastic/mean-reversion)
