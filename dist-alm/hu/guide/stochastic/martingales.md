# Feltételes várható érték és martingálok

Feltételes várható érték a múlt ismeretében, igazságos játékok, miért nem győzhető le egy martingál fogadási stratégiával, és a diszkontált árak Q alatt.

A „Valószínűségi mezők, σ-algebrák és valószínűségi változók” című lecke felépítette az $(\Omega, \mathcal{F}, \mathbb{P})$ valószínűségi mezőt, a „Filtrációk, adaptált folyamatok és megállási idők” pedig leírta, hogyan bővül az információ az időben egy $\mathbb{F} = (\mathcal{F}_n)$ filtráción keresztül. Ez a lecke mindkettőre támaszkodva definiálja a σ-algebrára vett feltételes várható értéket, kimondja a számolási szabályait, definiálja a martingált (az igazságos játék matematikai modelljét), és bebizonyítja, miért nem tehető nyereségessé egy igazságos játék semmilyen fogadási stratégiával. Végig a „Véletlen bolyongás és Brown-mozgás” című leckéből ismert $W_n$ érmedobásos bolyongás és a $W_t$ Brown-mozgás a példa.

## Feltételes várható érték egy σ-algebrára

Legyen $X$ integrálható valószínűségi változó, $\mathbb{E}|X| < \infty$, és legyen $\mathcal{G} \subseteq \mathcal{F}$ egy rész-σ-algebra: azok az események, amelyekről a $\mathcal{G}$ információ birtokában tudjuk, hogy bekövetkeztek-e. Az $\mathbb{E}[X \mid \mathcal{G}]$ **feltételes várható érték** egy olyan $Y$ valószínűségi változó, amelyre két dolog teljesül:

- $Y$ $\mathcal{G}$-mérhető: az értéke kiszámolható a $\mathcal{G}$-ben lévő információból.
- $\mathbb{E}[X\,\mathbf{1}_A] = \mathbb{E}[Y\,\mathbf{1}_A]$ minden $A \in \mathcal{G}$ eseményre: minden olyan eseményen, amelyet $\mathcal{G}$ „lát”, $Y$ átlaga megegyezik $X$ átlagával.

Ilyen $Y$ létezik (a Radon–Nikodym-tétel szerint), és egy nulla valószínűségű halmaztól eltekintve egyértelmű. Ha $X$ szórásnégyzete véges, $\mathbb{E}[X \mid \mathcal{G}]$ az a $\mathcal{G}$-mérhető valószínűségi változó, amely átlagos négyzetes értelemben a legközelebb van $X$-hez; ezért nevezzük $X$ legjobb előrejelzésének $\mathcal{G}$ alapján. Nem előre rögzített szám, hanem valószínűségi változó, mert az előrejelzés attól függ, mit figyeltünk meg.

Példa: dobjunk fel kétszer egy szabályos érmét, legyen $Y$ a fejek száma és $\mathcal{G} = \sigma(X_1)$ az első dobásból származó információ. $\mathcal{G}$ csak az „első dobás fej” és az „első dobás írás” eseményeket tartalmazza (meg $\emptyset$-t és $\Omega$-t), így $\mathbb{E}[Y \mid \mathcal{G}]$ mindkettőn állandó: fej után $1 + \tfrac12 = 1{,}5$, írás után $0 + \tfrac12 = 0{,}5$. A definiáló tulajdonság teljesül az $A = \{\text{az első dobás fej}\}$ eseményen: $\mathbb{E}[Y\,\mathbf{1}_A] = \tfrac12 \cdot 1{,}5 = 0{,}75$ mindkét oldalon.

## A feltételes várható érték szabályai

Ezek mind a definícióból következnek, és valójában ezekkel számolunk. Itt $X$ és $Z$ integrálható, $\mathcal{H} \subseteq \mathcal{G}$ pedig rész-σ-algebrák.

- **Linearitás:** $\mathbb{E}[aX + bZ \mid \mathcal{G}] = a\,\mathbb{E}[X \mid \mathcal{G}] + b\,\mathbb{E}[Z \mid \mathcal{G}]$.
- **Toronyszabály:** $\mathbb{E}\big[\mathbb{E}[X \mid \mathcal{G}] \mid \mathcal{H}\big] = \mathbb{E}[X \mid \mathcal{H}]$. Ha kevesebb információval jelezzük előre, mit fog mondani egy jobban informált előrejelzés, a kevésbé informált előrejelzést kapjuk. $\mathcal{H} = \{\emptyset, \Omega\}$ esetén ez $\mathbb{E}\big[\mathbb{E}[X \mid \mathcal{G}]\big] = \mathbb{E}[X]$.
- **Az ismert tényező kiemelése:** ha $Z$ $\mathcal{G}$-mérhető és $ZX$ integrálható, akkor $\mathbb{E}[ZX \mid \mathcal{G}] = Z\,\mathbb{E}[X \mid \mathcal{G}]$.
- **Függetlenség:** ha $X$ független $\mathcal{G}$-től, akkor $\mathbb{E}[X \mid \mathcal{G}] = \mathbb{E}[X]$. Az $X$-szel össze nem függő információ nem változtat az előrejelzésén.

Az érmés példában a toronyszabály így szól: $\tfrac12 \cdot 1{,}5 + \tfrac12 \cdot 0{,}5 = 1 = \mathbb{E}[Y]$.

## Martingálok

Rögzítsünk egy $\mathbb{F} = (\mathcal{F}_n)_{n \ge 0}$ filtrációt. Az $X = (X_n)$ folyamat **martingál** $\mathbb{F}$-re nézve, ha

- adaptált: $X_n$ minden $n$-re $\mathcal{F}_n$-mérhető;
- integrálható: $\mathbb{E}|X_n| < \infty$ minden $n$-re;
- a következő érték legjobb előrejelzése a jelenlegi érték: $\mathbb{E}[X_{n+1} \mid \mathcal{F}_n] = X_n$.

Folytonos időben, egy $(\mathcal{F}_t)_{t \ge 0}$ filtrációval a harmadik feltétel így szól: $\mathbb{E}[X_t \mid \mathcal{F}_s] = X_s$ minden $s \le t$ esetén. Ha ehelyett $\mathbb{E}[X_{n+1} \mid \mathcal{F}_n] \ge X_n$, a folyamat **szubmartingál** (nekünk kedvező játék); $\le$ esetén **szupermartingál** (ellenünk szóló játék, mint egy kaszinó, ahol a ház előnyben van).

> A martingál igazságos játék: mindazok ismeretében, amit eddig megfigyeltünk, a következő lépés várható változása nulla. A toronyszabály miatt ugyanez igaz tetszőleges számú lépésre, $\mathbb{E}[X_m \mid \mathcal{F}_n] = X_n$, ha $m \ge n$, és speciálisan $\mathbb{E}[X_n] = \mathbb{E}[X_0]$.

## Példák a Brown-mozgásból

Használjuk a természetes filtrációt, vagyis a pálya történetét. Minden példa egy-egy sornyi számolás a fenti szabályokkal.

- A szimmetrikus véletlen bolyongás martingál: $\mathbb{E}[W_{n+1} \mid \mathcal{F}_n] = W_n + \mathbb{E}[X_{n+1} \mid \mathcal{F}_n] = W_n + \mathbb{E}[X_{n+1}] = W_n$, az ismert tényező kiemelésével, majd a függetlenséggel.
- A Brown-mozgás folytonos idejű martingál: $s < t$ esetén $W_t = W_s + (W_t - W_s)$, a növekmény független $\mathcal{F}_s$-től és nulla várható értékű, így $\mathbb{E}[W_t \mid \mathcal{F}_s] = W_s$.
- $W_t^2$ nem martingál. A $W_t^2 = W_s^2 + 2W_s(W_t - W_s) + (W_t - W_s)^2$ felbontásból tagonként előrejelezve $\mathbb{E}[W_t^2 \mid \mathcal{F}_s] = W_s^2 + 0 + (t - s)$: pozitív driftje van, tehát szubmartingál.
- $W_t^2 - t$ martingál: a $t$ levonása éppen a felfelé irányuló tendenciát tünteti el.

Példa: tegyük fel, hogy $W_1 = 1$. A $W_4$ előrejelzése továbbra is 1, de a $W_4^2$ előrejelzése $1 + 3 = 4$, nem pedig 1. A pálya szóródása nő, a közepe viszont nem mozdul.

## Fogadási stratégiák

Fogadjunk körről körre egy szabályos érmére. A $k$-adik kör előtt megválasztjuk a $H_k$ tétet, kizárólag az $\mathcal{F}_{k-1}$ történet alapján (a tét **előrejelezhető**), és ezt megnyerjük vagy elveszítjük: a vagyonunk $H_k X_k$-val változik, ahol $X_k = \pm 1$. $n$ kör után

$$
V_n = V_0 + \sum_{k=1}^{n} H_k X_k, \qquad \mathbb{E}[V_{n+1} \mid \mathcal{F}_n] = V_n + H_{n+1}\,\mathbb{E}[X_{n+1} \mid \mathcal{F}_n] = V_n.
$$

A tétet kiemeljük az előrejelzésből, mert az $n$-edik időpontban ismert, az érme feltételes várható értéke pedig nulla. Így minden ilyen stratégia vagyona ismét martingál (**martingáltranszformált**), és a várható értéke minden rögzített időpontban $V_0$ marad. Egy stratégia megváltoztathatja a kimenetelek eloszlásának alakját, de a várható értékét nem.

A híres **duplázó stratégia** 1-es téttel indul, és minden vesztés után megduplázza a tétet, így az első nyerés visszahozza az összes korábbi veszteséget, és még 1-et. Korlátozzuk legfeljebb 5 körre. Ha az első öt kör bármelyikében nyerünk, a nettó nyereség 1. Mind az öt kör elvesztésének valószínűsége $(\tfrac12)^5 = \tfrac1{32}$, és ekkor a veszteség $1 + 2 + 4 + 8 + 16 = 31$. A várható nyereség

$$
\tfrac{31}{32} \cdot 1 + \tfrac{1}{32} \cdot (-31) = 0.
$$

A stratégia $96{,}9\%$ valószínűséggel nyer egy keveset, és $3{,}1\%$ valószínűséggel veszít sokat. Körkorlát nélkül korlátlan hitelre volna szükség: 10 egymást követő vesztés után a következő tét 512, az addigi veszteség pedig 1023.

Az ábrán ezt a játékot magunk játszhatjuk, 100-as kezdő vagyonnal. Válasszunk stratégiát: állandó 1-es tét, duplázás vesztés után (legfeljebb 64-es tétig, utána újra 1), vagy a pillanatnyi vagyon 5%-a; egyik tét sem haladhatja meg a pillanatnyi vagyonunkat. Az „Egy dobás” egy kört játszik le, a „100 kör” százat, a vagyont lépcsős grafikonon rajzolva. Az „1000 játékos szimulálása” ezer játékost játszat le 100–100 kört a választott stratégiával, és hisztogramot rajzol a végső vagyonukról, az átlagot megjelölve; az „Újrakezdés” új dobásokkal indít. Hasonlítsuk össze a három stratégiát. Az átlagos végső vagyon minden esetben 100 közelében marad (a kijelző a 95%-os mintavételi sávval együtt mutatja), de állandó tétnél a játékosok nagyjából 46%-a végez nyereségben, és senki sem esik 60 körüli szint alá; duplázásnál nagyjából kétharmaduk végez nyereségben, néhányan viszont mindent elveszítenek; a vagyon 5%-át megtéve pedig csak nagyjából 38%-uk végez nyereségben, miközben néhányan a kezdő vagyonuk többszörösével zárnak.

*[Interaktív ábra: martingale betting](https://quantsandbox.dev/hu/guide/stochastic/martingales)*

Ugyanez a számítás hosszabb korláttal megmutatja, hogy több kör csak egy ritkább, de nagyobb veszteségbe tolja át a kockázatot.

### Kidolgozott példa: A duplázó stratégia legfeljebb hat körrel

1. Annak valószínűsége, százalékban, hogy mind a hat kört elveszíted.
   $$\left(\tfrac12\right)^6$$ → **1.5625%**
2. A teljes veszteség, ha mind a hat kör elvész.
   $$1 + 2 + 4 + 8 + 16 + 32$$ → **63**
3. Az 1 egységnyi nettó nyereség valószínűsége, százalékban.
   $$1 - \left(\tfrac12\right)^6$$ → **98.4375%**
4. A stratégia várható nyeresége.
   $$\left(1 - \tfrac{1}{64}\right) \cdot 1 + \tfrac{1}{64} \cdot (-63)$$ → **0**

## Megállás és az opcionális megállítás tétele

Egy játékos ritkán játszik rögzített számú kört; akkor áll meg, amikor valami történik. A $\tau$ **megállási idő** olyan véletlen időpont, amelynél a döntés arról, hogy az $n$-edik időpontig megállunk-e, csak az addigi információt használja: $\{\tau \le n\} \in \mathcal{F}_n$ minden $n$-re. Az „állj meg az első nyerésnél” megállási idő; az „állj meg közvetlenül a legnagyobb veszteség előtt” nem az, mert a jövőt kellene hozzá ismerni.

Egy martingált megállási időnél megállítva ismét martingált kapunk: az $X_{\tau \wedge n}$ megállított folyamat martingál, így minden rögzített $n$-re $\mathbb{E}[X_{\tau \wedge n}] = \mathbb{E}[X_0]$. Az $n \to \infty$ határátmenethez viszont feltétel kell. Az **opcionális megállítás tétele** szerint ha $X$ martingál és $\tau$ megállási idő, akkor

$$
\mathbb{E}[X_\tau] = \mathbb{E}[X_0]
$$

teljesül az alábbi feltételek bármelyike mellett:

- $\tau$ korlátos: $\tau \le N$ egy rögzített $N$ számra;
- $\tau < \infty$ majdnem biztosan, és a megállított folyamat dominált: $|X_{\tau \wedge n}| \le K$ minden $n$-re, egy rögzített $K$-val (általánosabban: az $X_{\tau \wedge n}$ család egyenletesen integrálható);
- $\mathbb{E}[\tau] < \infty$, és a növekmények korlátosak: $|X_{n+1} - X_n| \le c$.

Példa (a játékos csődje): egy szimmetrikus bolyongás 0-ból indul, és a $\tau$ időpontban áll meg, amikor először eléri a $+2$-t vagy a $-3$-at. A megállított bolyongás $-3$ és $+2$ között marad, így a második feltétel teljesül, és $0 = \mathbb{E}[W_\tau] = 2\pi + (-3)(1 - \pi)$, ahol $\pi$ annak valószínűsége, hogy előbb a $+2$-t éri el. Innen $\pi = 3/5 = 0{,}6$, kombinatorika nélkül.

A körkorlát nélküli duplázó stratégia megmutatja, miért számítanak a feltételek. Legyen $\tau$ az első nyerés időpontja. Ez megállási idő, 1 valószínűséggel véges, és $V_\tau = V_0 + 1$, így $\mathbb{E}[V_\tau] = V_0 + 1 \ne V_0$. Ez nem mond ellent a tételnek: $\tau$ nem korlátos, és a nyerés előtti $V_0 - (2^k - 1)$ vagyon alulról nem korlátos, így egyik feltétel sem teljesül. Az ötkörös korláttal $\tau \wedge 5$ korlátos, és a várható nyereség 0, ahogy fent kiszámoltuk.

## Doob maximálegyenlőtlensége

Egy martingál nemcsak azt korlátozza, hol ér véget, hanem azt is, milyen messzire kalandozhat el a pályája az $n$-edik időpontig. Egy $X$ martingálra és tetszőleges $\lambda > 0$-ra **Doob maximálegyenlőtlensége** szerint

$$
\mathbb{P}\Big(\max_{k \le n} |X_k| \ge \lambda\Big) \le \frac{\mathbb{E}|X_n|}{\lambda}, \qquad \mathbb{E}\Big[\max_{k \le n} X_k^2\Big] \le 4\,\mathbb{E}[X_n^2].
$$

A második alak az $L^2$-változat. Mindkettő érvényes folytonos pályájú martingálokra, például a Brown-mozgásra is, a maximum helyett a $[0, t]$-n vett szuprémummal. Példa: az érmedobásos bolyongásra $n = 100$ mellett $\mathbb{E}|W_{100}| \le \sqrt{\mathbb{E}[W_{100}^2]} = 10$, így annak valószínűsége, hogy a bolyongás 100 lépésen belül valaha 30 távolságra kerül a kiindulóponttól, legfeljebb $10/30 = 1/3$, és $\mathbb{E}[\max_{k \le 100} W_k^2] \le 400$. Az ilyen egyenlőtlenségek teszik jól kezelhetővé a martingálok határértékeit, később pedig az Itô-integrált.

## Árak mint martingálok

A martingálok az arbitrázsmentes árazás nyelve. A „Kockázatsemleges valószínűségek” című leckében a részvény $\mathbb{Q}$ alatt a kockázatmentes kamatot hozta várhatóan, ami pontosan azt jelenti, hogy a diszkontált $e^{-rt}S_t$ ár martingál $\mathbb{Q}$ alatt. Egy későbbi, a mértékcseréről szóló lecke ugyanebben a témakörben megmutatja, hogyan lehet a valós $\mathbb{P}$ mértékről, amely alatt ez nem teljesül, áttérni a $\mathbb{Q}$ mértékre, amely alatt igen. Egy ár ekkor egyszerűen a diszkontált kifizetés feltételes várható értéke.

## Összefoglalás

- $\mathbb{E}[X \mid \mathcal{G}]$ az a $\mathcal{G}$-mérhető valószínűségi változó, amelynek átlaga minden $\mathcal{G}$-beli eseményen megegyezik $X$ átlagával; érvényes rá a linearitás, a toronyszabály, az ismert tényező kiemelése és a függetlenségi szabály.
- Az $\mathbb{F}$-re nézve martingál adaptált, integrálható, és $\mathbb{E}[X_{n+1} \mid \mathcal{F}_n] = X_n$ (folytonos időben $\mathbb{E}[X_t \mid \mathcal{F}_s] = X_s$). $W_t$ és $W_t^2 - t$ martingál.
- Igazságos játékon előrejelezhető tétekkel fogadva martingáltranszformáltat kapunk: a várható vagyon rögzített időpontban sosem változik.
- Az opcionális megállításhoz, $\mathbb{E}[X_\tau] = \mathbb{E}[X_0]$, korlátos megállási idő, dominált megállított folyamat, vagy $\mathbb{E}[\tau] < \infty$ és korlátos növekmények kellenek; a korlátlan duplázás mindhármat megsérti.
- Doob maximálegyenlőtlensége az egész pályát korlátozza: $\mathbb{P}(\max_{k \le n}|X_k| \ge \lambda) \le \mathbb{E}|X_n|/\lambda$.

> A következő lecke, „A Brown-mozgás tulajdonságai”, részletesen vizsgálja a $W_t$ pályáit, az itt talált $W_t$ és $W_t^2 - t$ martingálok segítségével.

[Szimulálj Brown-pályákat, és figyeld a szóródásuk növekedését a Brown-mozgás laborban](https://quantsandbox.dev/hu/brownian-motion)

## Interaktív laborok

- [Brown-mozgás szimulátor drifttel és volatilitással](https://quantsandbox.dev/hu/brownian-motion)

## Gyakorló kérdések

### 1. Dobj fel egy szabályos érmét háromszor, és legyen $Y$ a fejek száma. Az első dobás fej. Mennyi $\mathbb{E}[Y \mid \mathcal{F}_1]$?

**Válasz:** 2

Egy fej már ismert, a hátralévő két dobás pedig átlagosan $\tfrac12$-del növeli a számot: $1 + 2 \cdot \tfrac12 = 2$. Az első dobásra átlagolva $\tfrac12 \cdot 2 + \tfrac12 \cdot 1 = 1{,}5 = \mathbb{E}[Y]$, ahogy a toronyszabály mondja.

### 2. Az alábbi folyamatok közül melyik martingál?

- a) $W_t^2$
- b) $W_t^2 - t$
- c) $W_t + t$
- d) $e^{W_t}$

**Válasz:** b) $W_t^2 - t$

$\mathbb{E}[W_t^2 \mid \mathcal{F}_s] = W_s^2 + (t - s)$, így $t$ levonása eltünteti a driftet. $W_t^2$ és $W_t + t$ driftje pozitív, és $e^{W_t}$ is szubmartingál: martingállá csak az $e^{-t/2}$ szorzóval válik.

### 3. A korlátlan duplázó stratégia az első nyerésnél áll meg, ami 1 valószínűséggel bekövetkezik, és ekkor pontosan 1-et nyert. Miért nem mond ez ellent az opcionális megállítás tételének?

- a) Az első nyerés nem megállási idő.
- b) A megállási idő nem korlátos, és a megállás előtti vagyon alulról nem korlátos, így a tétel egyik feltétele sem teljesül.
- c) A tét duplázása után az érme már nem szabályos.
- d) Az első nyerés pozitív valószínűséggel soha nem következik be.

**Válasz:** b) A megállási idő nem korlátos, és a megállás előtti vagyon alulról nem korlátos, így a tétel egyik feltétele sem teljesül.

Az „állj meg az első nyerésnél” csak a múltat használja, tehát megállási idő, és majdnem biztosan véges. A korlátosság hiányzik: $\tau$-nak nincs felső korlátja, a nyerés előtti $2^k - 1$ veszteség pedig nem dominált, így $\mathbb{E}[V_\tau] = \mathbb{E}[V_0]$ nem kell, hogy teljesüljön.

---

Forrás: https://quantsandbox.dev/hu/guide/stochastic/martingales

Előző lecke: [Filtrációk, adaptált folyamatok és megállási idők](https://quantsandbox.dev/hu/guide/stochastic/filtrations)

Következő lecke: [A Brown-mozgás tulajdonságai](https://quantsandbox.dev/hu/guide/stochastic/brownian-properties)
