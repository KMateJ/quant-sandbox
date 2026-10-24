# Valószínűségi mezők, σ-algebrák és valószínűségi változók

Eseménytér, σ-algebra, valószínűségi mérték, mérhető függvény és a változó által generált σ-algebra.

A „Véletlen bolyongás és Brown-mozgás” című lecke szabadon használta a valószínűség, a várható érték és a függetlenség fogalmát. A következő folytonos idejű modellekben ezeknek a szavaknak pontos jelentés kell, mert információról, egész pályától függő eseményekről és az ismert adatokra vett feltételes átlagokról lesz szó. Ez a lecke felépíti a mértékelméleti keretet: az eseményteret, a σ-algebrákat, a valószínűségi mértékeket és a valószínűségi változókat. Végig egy szabályos dobókocka lesz a példa, az utolsó szakasz pedig előre bemutatja a feltételes várható értéket, amely két leckével később lesz a téma.

## Eseménytér és események

Egy véletlen kísérletet egy $\Omega$ halmazzal, az **eseménytérrel** modellezünk, amelynek $\omega \in \Omega$ elemei a lehetséges kimenetelek. Egy kockadobásnál $\Omega = \{1, 2, 3, 4, 5, 6\}$. Az előző lecke $n$ dobásos pénzfeldobásos bolyongásánál $\Omega = \{H, T\}^n$ (fej, írás), és egy $\omega$ egy teljes dobássorozat. A Brown-mozgásnál egy $\omega$ egy teljes folytonos pálya.

Egy **esemény** egy $A \subseteq \Omega$ részhalmaz: az esemény bekövetkezik, ha a megvalósult $\omega$ kimenetel $A$-ba esik. „A kocka páros számot mutat” esemény a $\{2, 4, 6\}$ halmaz. A halmazműveletek a logikát fordítják le: $A \cap B$ jelentése „$A$ és $B$”, $A \cup B$ jelentése „$A$ vagy $B$”, az $A^c = \Omega \setminus A$ komplementeré „nem $A$”.

## σ-algebrák

Nem rendelünk valószínűséget $\Omega$ minden részhalmazához. Ehelyett rögzítünk részhalmazoknak egy $\mathcal{F}$ rendszerét, azokat az eseményeket, amelyekre rákérdezhetünk, és megköveteljük, hogy zárt legyen a logikai műveletekre. Az $\Omega$ részhalmazainak egy $\mathcal{F}$ rendszere **σ-algebra**, ha

$$
\text{(i) } \Omega \in \mathcal{F}, \qquad \text{(ii) } A \in \mathcal{F} \Rightarrow A^c \in \mathcal{F}, \qquad \text{(iii) } A_1, A_2, \ldots \in \mathcal{F} \Rightarrow \bigcup_{n=1}^{\infty} A_n \in \mathcal{F}.
$$

Két következmény azonnal adódik. (i)-ből és (ii)-ből $\emptyset = \Omega^c \in \mathcal{F}$. (ii)-ből, (iii)-ból és a $\bigcap_n A_n = \big(\bigcup_n A_n^c\big)^c$ De Morgan-azonosságból események megszámlálható metszete is esemény. A „σ” a (iii)-beli megszámlálható uniókra utal; ezekre végtelen sok időpontot érintő állításokhoz van szükség, például „a bolyongás valamikor 10 fölé megy”, ami a $\bigcup_{n} \{W_n > 10\}$ esemény.

A kockán három σ-algebra tér majd vissza:

- a triviális $\{\emptyset, \Omega\}$ σ-algebra, amely semmit nem árul el a dobásról;
- a paritás-σ-algebra, $\{\emptyset, \{1,3,5\}, \{2,4,6\}, \Omega\}$, amely meg tudja különböztetni a páratlant a párostól, de semmi mást;
- a $2^{\Omega}$ hatványhalmaz mind a $2^6 = 64$ részhalmazzal, amely pontosan azonosítja a dobást.

Két ok indokolja, hogy σ-algebrára szorítkozunk. Az első technikai: az $\Omega = [0, 1]$ halmazon nem lehet minden részhalmazhoz olyan „hosszt” rendelni, amely megszámlálhatóan additív és eltolásra invariáns (Vitali konstrukciója), így nem megszámlálható eseménytereken bizonyos halmazokat ki kell hagyni. A második a pénzügyekben lényeges: a $2^\Omega$-nál kisebb σ-algebra **részleges információt** modellez. Akinek az információja a paritás-σ-algebra, az meg tudja mondani, hogy páros volt-e a dobás, de azt nem, hogy 6 volt-e.

Részhalmazok tetszőleges $\mathcal{C}$ rendszerére az összes $\mathcal{C}$-t tartalmazó σ-algebra metszete szintén σ-algebra, mégpedig a legszűkebb, amely $\mathcal{C}$-t tartalmazza. Jele $\sigma(\mathcal{C})$, neve a $\mathcal{C}$ által **generált** σ-algebra. $\mathbb{R}$-en a nyílt intervallumok által generált σ-algebra a **Borel-σ-algebra**, $\mathcal{B}(\mathbb{R})$. Tartalmaz minden intervallumot, minden nyílt és zárt halmazt, és mindent, ami ezekből megszámlálható műveletekkel felépíthető; konstrukciójába nem megyünk bele.

## Valószínűségi mértékek

Az $(\Omega, \mathcal{F})$ páron értelmezett **valószínűségi mérték** egy $\mathbb{P} : \mathcal{F} \to [0, 1]$ függvény, amelyre $\mathbb{P}(\Omega) = 1$, és amely megszámlálhatóan additív: páronként diszjunkt $A_1, A_2, \ldots \in \mathcal{F}$ esetén

$$
\mathbb{P}\Big(\bigcup_{n=1}^{\infty} A_n\Big) = \sum_{n=1}^{\infty} \mathbb{P}(A_n).
$$

Az $(\Omega, \mathcal{F}, \mathbb{P})$ hármas a **valószínűségi mező**. A megszokott szabályok ebből következnek: $\mathbb{P}(A^c) = 1 - \mathbb{P}(A)$ (mert $A$ és $A^c$ diszjunkt, uniójuk $\Omega$), és $A \subseteq B$ esetén $\mathbb{P}(A) \le \mathbb{P}(B)$ (mert $B = A \cup (B \setminus A)$). A szabályos kockánál $\mathcal{F} = 2^\Omega$ és $\mathbb{P}(A) = |A|/6$. Ugyanazon a σ-algebrán több mérték is élhet; így fér meg egy eseménytéren a valós $\mathbb{P}$ és a kockázatsemleges $\mathbb{Q}$ mérték.

## Valószínűségi változók

A valószínűségi változó a kimenetel által meghatározott szám, $X : \Omega \to \mathbb{R}$, egyetlen feltétellel: minden „$X \le x$?” alakú kérdésnek eseménynek kell lennie, hogy legyen valószínűsége. Formálisan $X$ **$\mathcal{F}$-mérhető**, ha

$$
\{X \le x\} = \{\omega \in \Omega : X(\omega) \le x\} \in \mathcal{F} \quad \text{minden } x \in \mathbb{R} \text{ esetén}.
$$

Ez ekvivalens azzal, hogy minden $B$ Borel-halmazra $X^{-1}(B) \in \mathcal{F}$, mert azok a $B$ halmazok, amelyekre $X^{-1}(B) \in \mathcal{F}$, σ-algebrát alkotnak, amely tartalmazza az összes $(-\infty, x]$ félegyenest, ezek pedig generálják $\mathcal{B}(\mathbb{R})$-t.

A mérhetőség a σ-algebrától függ. Legyen a kockán $X(\omega) = \mathbf{1}\{\omega \ge 5\}$, amely $\{5, 6\}$-on 1, máshol 0. Ekkor $\{X \le 0\} = \{1,2,3,4\}$, ami nincs benne a paritás-σ-algebrában, tehát $X$ nem mérhető a paritásra: csak a paritást ismerve nem dönthető el, hogy $X = 1$-e.

## Valószínűségi változó által generált σ-algebra

Az **$X$ által generált σ-algebra** azoknak az eseményeknek a rendszere, amelyek $X$ megfigyelésével eldönthetők:

$$
\sigma(X) = \{ X^{-1}(B) : B \in \mathcal{B}(\mathbb{R}) \}.
$$

Ez a legszűkebb σ-algebra, amelyre $X$ mérhető. Olvasd úgy, mint azoknak a kérdéseknek a listáját, amelyekre $X$ választ ad. A kockán az $X(\omega) = \omega \bmod 2$ változóra $\sigma(X)$ éppen a paritás-σ-algebra. Azt, hogy $\sigma(X)$ pontosan „az $X$-ben lévő információ”, a **Doob–Dynkin-lemma** fejezi ki: egy $Y$ valószínűségi változó akkor és csak akkor $\sigma(X)$-mérhető, ha $Y = f(X)$ valamilyen $f$ Borel-függvénnyel. $\sigma(X)$ ismeretében tehát pontosan $X$ függvényei számolhatók ki.

## Véges eseményterek és partíciók

Véges $\Omega$ esetén minden σ-algebra egyszerű szerkezetű. $\omega \in \Omega$ esetén legyen $A(\omega)$ a $\mathcal{G}$ összes $\omega$-t tartalmazó eseményének metszete; ez véges metszet, így $A(\omega) \in \mathcal{G}$. Ezek a halmazok a $\mathcal{G}$ **atomjai**. Két atom vagy egyenlő, vagy diszjunkt: ha $\omega' \notin A(\omega)$, akkor van olyan $C \in \mathcal{G}$, amely $\omega$-t tartalmazza, $\omega'$-t nem, így $C^c$ tartalmazza $\omega'$-t, és $A(\omega') \subseteq C^c$ diszjunkt az $A(\omega) \subseteq C$ halmaztól. Az atomok tehát partícionálják $\Omega$-t, és $\mathcal{G}$ minden eseménye a pontjai atomjainak uniója.

> Véges $\Omega$ esetén egy $\mathcal{G}$ σ-algebra ugyanaz, mint $\Omega$ egy $m$ atomból álló partíciója: $\mathcal{G}$ eseményei pontosan az atomok uniói, így $2^m$ darab van belőlük. Egy valószínűségi változó akkor és csak akkor $\mathcal{G}$-mérhető, ha minden atomon állandó.

A paritás-σ-algebra atomjai $\{1,3,5\}$ és $\{2,4,6\}$, így $2^2 = 4$ eseménye van. Az $\{1,2\}, \{3,4\}, \{5,6\}$ párokra bontás $2^3 = 8$ eseményt ad, és $\mathbf{1}\{\omega \ge 5\}$ erre mérhető, hiszen minden páron állandó. A hatványhalmaznak hat atomja és $2^6 = 64$ eseménye van.

## Függetlenség

Két esemény független, ha $\mathbb{P}(A \cap B) = \mathbb{P}(A)\,\mathbb{P}(B)$. Két σ-algebra, $\mathcal{G}$ és $\mathcal{H}$, **független**, ha ez minden $A \in \mathcal{G}$ és minden $B \in \mathcal{H}$ esetén teljesül, az $X$ és $Y$ valószínűségi változók pedig függetlenek, ha $\sigma(X)$ és $\sigma(Y)$ az. Szavakkal: bármely $X$-re vonatkozó kérdés válaszának megismerése nem változtat egyetlen $Y$-ra vonatkozó kérdés valószínűségén sem.

Példa a szabályos kockán. A paritás és $\sigma(\mathbf{1}\{\omega \ge 5\})$ független: a négy nem triviális párra

$$
\mathbb{P}(\{1,3,5\} \cap \{5,6\}) = \tfrac16 = \tfrac12 \cdot \tfrac13, \qquad \mathbb{P}(\{1,3,5\} \cap \{1,2,3,4\}) = \tfrac13 = \tfrac12 \cdot \tfrac23,
$$

és ugyanez a páros számokra, az $\emptyset$-t vagy $\Omega$-t tartalmazó párokra pedig triviálisan teljesül. A paritás és az alacsony–magas felbontás nem független: $\mathbb{P}(\{1,3,5\} \cap \{1,2,3\}) = \tfrac13$, de $\tfrac12 \cdot \tfrac12 = \tfrac14$.

## Várható érték

Véges eseménytéren a **várható érték** a valószínűségekkel súlyozott átlag, $\mathbb{E}[X] = \sum_{\omega} X(\omega)\,\mathbb{P}(\{\omega\})$. Általános eseménytéren ez az $\mathbb{E}[X] = \int_\Omega X\, d\mathbb{P}$ Lebesgue-integrál, amelyet először véges sok értéket felvevő változókra, majd monoton határátmenettel definiálunk; a megszokott szabályok megmaradnak: linearitás, $\mathbb{E}[\mathbf{1}_A] = \mathbb{P}(A)$, és független, integrálható $X, Y$ esetén $\mathbb{E}[XY] = \mathbb{E}[X]\,\mathbb{E}[Y]$. A kockán $X(\omega) = \omega$ esetén

$$
\mathbb{E}[X] = \frac{1 + 2 + \cdots + 6}{6} = 3{,}5, \qquad \mathbb{E}[X^2] = \frac{91}{6}, \qquad \operatorname{Var}(X) = \frac{91}{6} - 3{,}5^2 = \frac{35}{12} \approx 2{,}917.
$$

## Feltételes várható érték mint blokkátlag

Ha egy véges $\Omega$-n adott $\mathcal{G}$ σ-algebra minden atomja pozitív valószínűségű, akkor az $\mathbb{E}[X \mid \mathcal{G}]$ **feltételes várható érték** az a valószínűségi változó, amely minden $A$ atomon $X$-nek az $A$-ra vett átlagával egyenlő:

$$
\mathbb{E}[X \mid \mathcal{G}](\omega) = \frac{\mathbb{E}[X\,\mathbf{1}_A]}{\mathbb{P}(A)} \quad \text{ha } \omega \in A.
$$

Ez $X$ legjobb becslése annak, aki tudja, melyik atom következett be. $\mathcal{G}$-mérhető, és $\mathcal{G}$ minden eseményén ugyanaz az átlaga, mint $X$-nek: $A \in \mathcal{G}$ esetén $\mathbb{E}\big[\mathbb{E}[X \mid \mathcal{G}]\,\mathbf{1}_A\big] = \mathbb{E}[X\,\mathbf{1}_A]$. Általános eseménytéren ez a két tulajdonság a definíció, ezzel foglalkozik a „Feltételes várható érték és martingálok” című lecke. A blokkokon belüli átlagolás eltünteti a szóródás egy részét, és a teljes variancia tétele ezt pontossá teszi:

$$
\operatorname{Var}(X) = \operatorname{Var}\big(\mathbb{E}[X \mid \mathcal{G}]\big) + \mathbb{E}\big[\operatorname{Var}(X \mid \mathcal{G})\big] \;\ge\; \operatorname{Var}\big(\mathbb{E}[X \mid \mathcal{G}]\big).
$$

Kidolgozott példa $X(\omega) = \omega$ esetén. Paritás-információval $\mathbb{E}[X \mid \mathcal{G}]$ a páratlan számokon $3$, a párosakon $4$, így varianciája $0{,}25$. Alacsony–magas felbontással értéke $2$ vagy $5$, varianciája $2{,}25$. Párokkal $1{,}5$, $3{,}5$ vagy $5{,}5$, varianciája $8/3 \approx 2{,}667$. Teljes információval maga $X$, varianciája $35/12$; információ nélkül a $3{,}5$ konstans, varianciája $0$.

Az ábra a hat kimenetelt csempékként mutatja, a választott $\mathcal{G}$ információ atomjai szerint színezve; minden csempén $\omega$, $X(\omega)$ és az $\mathbb{E}[X \mid \mathcal{G}](\omega)$ blokkátlag látható. Válaszd ki az információt (nincs, paritás, alacsony–magas, párok, teljes) és a valószínűségi változót ($\omega$, $\omega^2$ vagy $\mathbf{1}\{\omega \ge 5\}$). A kijelzők mutatják az események $2^{\text{blokkok}}$ számát, valamint $\mathbb{E}[X]$, $\operatorname{Var}(X)$ és $\operatorname{Var}(\mathbb{E}[X \mid \mathcal{G}])$ értékét. Ellenőrizd, hogy az utolsó soha nem nagyobb $\operatorname{Var}(X)$-nél, és teljes információnál egyenlő vele. $\mathbf{1}\{\omega \ge 5\}$ és paritás mellett $0$: az információ független $X$-től, és nem javít a becslésen.

*[Interaktív ábra: sigma partition](https://quantsandbox.dev/hu/guide/stochastic/probability-spaces)*

### Kidolgozott példa: Egy σ-algebra és egy várható érték négy ponton

1. Legyen $\Omega = \{1, 2, 3, 4\}$ és $A = \{1, 2\}$. Az $A$ által generált σ-algebrának tartalmaznia kell $A$-t, a komplementerét, valamint $\emptyset$-t és $\Omega$-t; számold meg a halmazait.
   $$\sigma(A) = \{\emptyset,\ \{1,2\},\ \{3,4\},\ \Omega\}$$ → **4**
2. Legyen a mérték a négy ponton $\mathbb{P}(\{\omega\}) = 0{,}1;\ 0{,}2;\ 0{,}3;\ 0{,}4$. Az $A$ valószínűsége:
   $$\mathbb{P}(A) = 0{,}1 + 0{,}2$$ → **0.3**
3. Legyen $X(\omega) = \omega$. A várható értéke a valószínűségekkel súlyozott összeg.
   $$\mathbb{E}[X] = 1(0{,}1) + 2(0{,}2) + 3(0{,}3) + 4(0{,}4)$$ → **3**
4. A $\sigma(A)$-ra vett feltételes várható érték $A$-n állandó: $X$ átlaga $A$-n.
   $$\mathbb{E}[X \mid \sigma(A)](\omega) = \frac{1(0{,}1) + 2(0{,}2)}{0{,}3}, \quad \omega \in A$$ → **1.667**
5. És $A^c$-n:
   $$\mathbb{E}[X \mid \sigma(A)](\omega) = \frac{3(0{,}3) + 4(0{,}4)}{0{,}7}, \quad \omega \in A^c$$ → **3.571**

## Összefoglalás

- Egy $(\Omega, \mathcal{F}, \mathbb{P})$ valószínűségi mező a kimenetelekből, a komplementerre és megszámlálható unióra zárt események σ-algebrájából és egy $\mathbb{P}(\Omega) = 1$ tulajdonságú, megszámlálhatóan additív mértékből áll.
- A valószínűségi változó $\mathcal{F}$-mérhető leképezés: minden $\{X \le x\}$ esemény $\mathcal{F}$-ben van. A generált $\sigma(X)$ σ-algebra azokat a kérdéseket gyűjti össze, amelyekre $X$ választ ad, és a $\sigma(X)$-mérhető változók pontosan $X$ függvényei.
- Véges $\Omega$-n egy σ-algebra egy $m$ atomú partíció $2^m$ eseménnyel, és a mérhetőség az atomokon való állandóságot jelenti.
- σ-algebrák függetlensége azt jelenti, hogy az egyik minden eseménye független a másik minden eseményétől.
- Partíción a feltételes várható érték a blokkátlag; ez durvább változó, és $\operatorname{Var}(\mathbb{E}[X \mid \mathcal{G}]) \le \operatorname{Var}(X)$.

> A következő lecke, a „Filtrációk, adaptált folyamatok és megállási idők”, az időben bővülő σ-algebrával modellezi az árfolyamok megfigyelésével gyűlő információt.

[Fedezd fel a véletlen bolyongást és a Brown-mozgást a Sztochasztikus modellek stúdióban](https://quantsandbox.dev/hu/stochastic-models)

## Interaktív laborok

- [Sztochasztikus analízis kurzus: a bolyongástól a Brown-mozgásig](https://quantsandbox.dev/hu/stochastic-models)

## Gyakorló kérdések

### 1. A kockán, $\Omega = \{1, \ldots, 6\}$, hány eseményt tartalmaz az $\{1,2\}, \{3,4\}, \{5,6\}$ partíció által generált σ-algebra?

**Válasz:** 8

Az események pontosan az atomok uniói. A 3 atom mindegyike vagy benne van az unióban, vagy nincs, ez $2^3 = 8$ esemény, beleértve $\emptyset$-t és $\Omega$-t.

### 2. A kockán melyik σ-algebrára mérhető az $X(\omega) = \mathbf{1}\{\omega \ge 5\}$ változó?

- a) Paritás: $\{1,3,5\}, \{2,4,6\}$
- b) Alacsony–magas: $\{1,2,3\}, \{4,5,6\}$
- c) Párok: $\{1,2\}, \{3,4\}, \{5,6\}$
- d) A triviális $\{\emptyset, \Omega\}$ σ-algebra

**Válasz:** c) Párok: $\{1,2\}, \{3,4\}, \{5,6\}$

$X$ akkor és csak akkor mérhető, ha minden atomon állandó. Csak a párokra bontás tartja együtt $\{5,6\}$-ot és választja el $\{1,2,3,4\}$-től; minden más választásnál van olyan atom, amelyben $X = 0$ és $X = 1$ értékű pont is van.

### 3. A szabályos kockán legyen $X(\omega) = \omega$, és $\mathcal{G}$-t generálja az $\{1,2,3\}, \{4,5,6\}$ partíció. Mennyi $\operatorname{Var}(\mathbb{E}[X \mid \mathcal{G}])$?

**Válasz:** 2.25

A blokkátlagok $\{1,2,3\}$-on $2$, $\{4,5,6\}$-on $5$, mindkettő $\tfrac12$ valószínűséggel. Átlaguk $3{,}5$, mindkettő $1{,}5$-tel tér el tőle, így a variancia $1{,}5^2 = 2{,}25$, kisebb, mint $\operatorname{Var}(X) = 35/12 \approx 2{,}917$.

---

Forrás: https://quantsandbox.dev/hu/guide/stochastic/probability-spaces

Előző lecke: [A nagy számok törvénye és a centrális határeloszlás-tétel](https://quantsandbox.dev/hu/guide/stochastic/law-of-large-numbers-clt)

Következő lecke: [Filtrációk, adaptált folyamatok és megállási idők](https://quantsandbox.dev/hu/guide/stochastic/filtrations)
