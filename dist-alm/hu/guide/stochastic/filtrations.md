# Filtrációk, adaptált folyamatok és megállási idők

Az idővel bővülő információ, adaptált és előrejelezhető folyamatok, és mikor megállási idő egy véletlen időpont.

A „Valószínűségi mezők, σ-algebrák és valószínűségi változók” című lecke egy információs állapotot σ-algebraként modellezett, és megmutatta, hogy véges eseménytéren a σ-algebra atomokra bontott partíció. Az árfolyamokat időben figyeljük meg, így az információ gyarapszik. Ez a lecke a filtrációkkal pontossá teszi ezt a gyarapodást, definiálja, mely folyamatok ismertek az adott időpontban (adaptált) vagy egy lépéssel előre (előrejelezhető), és definiálja a megállási időket, azokat a véletlen időpontokat, amelyekben a jövő ismerete nélkül lehet cselekedni. Végig egy szabályos érme háromszori feldobása lesz a példa.

## Filtrációk

Rögzítsünk egy $(\Omega, \mathcal{F}, \mathbb{P})$ valószínűségi mezőt és egy $I$ időhalmazt, amely vagy $\{0, 1, 2, \ldots\}$, vagy $[0, \infty)$. **Filtráció** σ-algebrák egy olyan $(\mathcal{F}_t)_{t \in I}$ családja, amelyre

$$
\mathcal{F}_s \subseteq \mathcal{F}_t \subseteq \mathcal{F} \qquad \text{minden } s \le t \text{ esetén}.
$$

$\mathcal{F}_t$ azoknak az eseményeknek a rendszere, amelyek bekövetkezése a $t$ időpontig eldől. A tartalmazás azt mondja, hogy információ nem vész el: ami az $s$ időpontban eldőlt, az minden későbbi időpontban is eldőlt. Az $(\Omega, \mathcal{F}, (\mathcal{F}_t), \mathbb{P})$ négyes **filtrált valószínűségi mező**.

Egy $(X_t)_{t \in I}$ folyamat **természetes filtrációja** a saját múltja által generált információ,

$$
\mathcal{F}^X_t = \sigma(X_s : s \le t),
$$

az a legszűkebb σ-algebra, amelyre minden $s \le t$ melletti $X_s$ mérhető. Egy filtráció lehet bővebb a természetesnél, például ha a befektető más eszközöket is figyel, de szűkebb nem lehet, ha a befektető látja $X$-et.

## Három pénzfeldobás

Dobjunk fel egy szabályos érmét háromszor: $\Omega = \{H, T\}^3$ (H: fej, T: írás) 8 kimenetelű, mindegyik $\tfrac18$ valószínűségű, és $\mathcal{F} = 2^\Omega$. Legyen $\xi_k(\omega)$ a $k$-adik dobás és $\mathcal{F}_k = \sigma(\xi_1, \ldots, \xi_k)$, valamint $\mathcal{F}_0 = \{\emptyset, \Omega\}$. Az előző lecke szerint minden $\mathcal{F}_k$ egy partíció. Atomjai azok a kimenetelhalmazok, amelyek az első $k$ dobásban megegyeznek: $2^k$ ilyen van, mindegyikben $2^{3-k}$ kimenetel. Az események száma tehát

$$
|\mathcal{F}_k| = 2^{2^k}: \qquad |\mathcal{F}_0| = 2,\quad |\mathcal{F}_1| = 4,\quad |\mathcal{F}_2| = 16,\quad |\mathcal{F}_3| = 256.
$$

$\mathcal{F}_k$ minden atomja két $\mathcal{F}_{k+1}$-beli atomra hasad; ez az $\mathcal{F}_k \subseteq \mathcal{F}_{k+1}$ tartalmazás a partíciók finomodásaként nézve. Jó kép erre egy bináris fa: a $k$ mélységű csúcs $\mathcal{F}_k$ egy atomja, az alatta lévő levelek pedig a benne lévő kimenetelek.

Az ábra a 8 pályát ilyen faként rajzolja meg. Léptesd a $k$ időt 0-tól 3-ig a nyilakkal, vagy nyomd meg a lejátszást: megjelennek a $k$ mélységig terjedő csúcsok, a levelek pedig $\mathcal{F}_k$ $2^k$ atomja szerint csoportosulnak. $k = 0$-nál mind a 8 levél egy blokk, $k = 3$-nál minden levél külön blokk.

*[Interaktív ábra: filtration tree](https://quantsandbox.dev/hu/guide/stochastic/filtrations)*

## Adaptált folyamatok

Egy $(X_t)$ folyamat **adaptált** az $(\mathcal{F}_t)$ filtrációhoz, ha minden $t$-re $X_t$ $\mathcal{F}_t$-mérhető: jelenlegi értéke a jelenlegi információból ismert. Az érmés eseménytéren az előző lecke Doob–Dynkin-lemmája szerint $X_k$ pontosan akkor adaptált, ha $X_k = f_k(\xi_1, \ldots, \xi_k)$ valamilyen $f_k$ függvénnyel. Az eddigi fejek száma, $S_k = \sum_{j \le k} \mathbf{1}\{\xi_j = H\}$, és a $W_k = \sum_{j \le k} (2\cdot\mathbf{1}\{\xi_j = H\} - 1)$ bolyongás adaptált. Az $Y_k = S_3$ (minden $k$-ra) folyamat, amely már a 0 időpontban elárulja a fejek végső számát, nem az: $Y_0$ nem állandó $\mathcal{F}_0$ egyetlen atomján, $\Omega$-n. Minden folyamat adaptált a saját természetes filtrációjához.

## Előrejelezhető folyamatok

Egy diszkrét idejű $(H_k)_{k \ge 1}$ folyamat **előrejelezhető** (prediktábilis), ha minden $k \ge 1$ esetén $H_k$ $\mathcal{F}_{k-1}$-mérhető: egy lépéssel az indexe által jelölt időpont előtt ismert. Egy kereskedési stratégia ilyen alakú. $H_k$ a $k-1$ és $k$ közötti időszakban tartott mennyiség, amelyet a $k-1$ időpontban választunk, így egy $W$ bolyongás tartásából származó nyereség

$$
G_n = \sum_{k=1}^{n} H_k\,(W_k - W_{k-1}).
$$

Az előrejelezhetőség teszi az ilyen játékokat igazságossá. A $W_k - W_{k-1}$ növekmény független $\mathcal{F}_{k-1}$-től és várható értéke 0, $H_k$ pedig $\mathcal{F}_{k-1}$-mérhető, így korlátos $H$ esetén minden tagra $\mathbb{E}[H_k(W_k - W_{k-1})] = \mathbb{E}[H_k]\cdot 0 = 0$, és $\mathbb{E}[G_n] = 0$. Az „írás után egy egységet tartok, fej után semmit” stratégia előrejelezhető, és átlagosan 0-t keres. A $H_k = \mathbf{1}\{\xi_k = H\}$ stratégia a $k$-adik dobás alapján dönt a $k$-adik pozícióról. Ez adaptált, de nem előrejelezhető, és minden fejjel 1-et nyer, így $\mathbb{E}[G_3] = 1{,}5$: a jövőbeli információ alapján történő kereskedés modellje.

## Megállási idők

**Megállási idő** egy olyan $\tau : \Omega \to I \cup \{\infty\}$ véletlen időpont, amelyre

$$
\{\tau \le t\} \in \mathcal{F}_t \qquad \text{minden } t \in I \text{ esetén}.
$$

Azt, hogy $\tau$ bekövetkezett-e már a $t$ időpontig, a $t$-beli információnak kell eldöntenie. A $\tau = \infty$ érték azt jelenti, hogy az időpont sosem jön el. Diszkrét időben a feltétel ekvivalens azzal, hogy minden $k$-ra $\{\tau = k\} \in \mathcal{F}_k$. Bizonyítás: ha minden $\{\tau \le k\} \in \mathcal{F}_k$, akkor $\{\tau = k\} = \{\tau \le k\} \setminus \{\tau \le k-1\}$ benne van $\mathcal{F}_k$-ban, mert $\mathcal{F}_{k-1} \subseteq \mathcal{F}_k$. Megfordítva, $\{\tau \le k\} = \bigcup_{j \le k} \{\tau = j\}$, ami $\mathcal{F}_j \subseteq \mathcal{F}_k$-beli események uniója.

> A megállási idő olyan szabály a cselekvés időpontjára, amely csak a múltat és a jelent használja: minden $t$-re $\{\tau \le t\} \in \mathcal{F}_t$. Az amerikai opciók lehívási időpontja és a stop-loss megbízás aktiválása megállási idő; az „adjuk el az év legmagasabb árán” nem az.

Néhány egyszerű tény közvetlenül következik a definícióból. A $\tau = c$ konstans megállási idő, mert $\{\tau \le t\}$ vagy $\emptyset$, vagy $\Omega$. Ha $\tau$ és $\rho$ megállási idő, akkor $\min(\tau, \rho)$ és $\max(\tau, \rho)$ is az, hiszen $\{\min(\tau,\rho) \le t\} = \{\tau \le t\} \cup \{\rho \le t\}$ és $\{\max(\tau,\rho) \le t\} = \{\tau \le t\} \cap \{\rho \le t\}$.

## Első elérési idők

Legyen $X$ adaptált és $A$ Borel-halmaz. Diszkrét időben $A$ **első elérési ideje** $\tau_A = \min\{k \ge 0 : X_k \in A\}$, és $\tau_A = \infty$, ha $X$ sosem lép $A$-ba. Ez megállási idő, mert

$$
\{\tau_A \le k\} = \bigcup_{j=0}^{k} \{X_j \in A\} \in \mathcal{F}_k,
$$

hiszen minden $\{X_j \in A\}$ benne van $\mathcal{F}_j \subseteq \mathcal{F}_k$-ban. Az érmés eseménytéren legyen $\tau$ az első fej időpontja. Ekkor $\{\tau \le 1\}$ az „első dobás H” atom, $\{\tau \le 2\}$ az $\mathcal{F}_2$ HH, HT és TH atomjainak uniója, $\{\tau \le 3\}$ pedig minden a TTT kivételével. Eloszlása $\mathbb{P}(\tau = k) = 2^{-k}$, ha $k = 1, 2, 3$, és $\mathbb{P}(\tau = \infty) = \tfrac18$, így $\mathbb{P}(\tau \le 2) = \tfrac12 + \tfrac14 = 0{,}75$.

## Utolsó kilépési idők

Legyen most $\sigma$ a három dobás közül az **utolsó** fej időpontja, amelynek nincs értéke, ha mindhárom írás. Ez nem megállási idő. $k = 1$-nél $\{\sigma \le 1\} = \{HTT\}$, ami nem $\mathcal{F}_1$-beli atomok uniója: a HTT és HTH kimenetelek az első dobásban megegyeznek, mégis $\sigma(HTT) = 1 \le 1$, míg $\sigma(HTH) = 3 > 1$. $k = 2$-nél $\{\sigma \le 2\} = \{HHT, HTT, THT\}$ kettévágja $\mathcal{F}_2$ HH, HT és TH atomjait. Ahhoz, hogy az 1 időpontban tudjuk, hogy az utolsó fej már megvolt, látnunk kellene a 2. és 3. dobást.

Az ábrán összehasonlíthatod a két szabályt. Válts a véletlen időpont két változata, az „első H” és az „utolsó H” között. Minden levél kiírja a pályájához tartozó időt, vagy azt, hogy „nincs”. Az aktuális $k$-ra a kijelző megmondja, hogy $\{\tau \le k\}$ előáll-e $\mathcal{F}_k$ atomjainak uniójaként, az „utolsó H” esetén pedig mutat egy pályapárt, amely a $k$ időpontig megegyezik, de abban eltér, hogy $\tau \le k$ teljesül-e. Lépkedj végig $k$ értékein: az „első H” minden $k$-nál megfelel, az „utolsó H” $k = 1$-nél és $k = 2$-nél elbukik.

## σ-algebra egy megállási időpontban

A $\tau$ megállási időpontban rendelkezésre álló információ a

$$
\mathcal{F}_\tau = \{A \in \mathcal{F} : A \cap \{\tau \le t\} \in \mathcal{F}_t \text{ minden } t \text{ esetén}\}
$$

σ-algebra, azoknak az eseményeknek a rendszere, amelyek bekövetkezése $\tau$ bekövetkeztekor már ismert. Ha $\tau$ az első fej, akkor a „2. dobás H” esemény csak $\tau$ ismeretével együtt tartozik $\mathcal{F}_\tau$-hoz: a $\{\tau = 1\}$ eseményen még nem dőlt el, a $\{\tau = 2\}$ eseményen már igen. Az erős Markov-tulajdonság és az opcionális megállítás tétele a későbbi leckékben $\mathcal{F}_\tau$-ra vonatkozó állítások.

## Brown-mozgás folytonos időben

A $W$ Brown-mozgás természetes filtrációja $\mathcal{F}^W_t = \sigma(W_s : s \le t)$. $W$ adaptált hozzá, és a független növekmények miatt minden jövőbeli $W_u - W_t$ növekmény ($u > t$) független $\mathcal{F}^W_t$-től. Az $a > 0$ szint $\tau_a = \inf\{t \ge 0 : W_t = a\}$ első elérési ideje megállási idő. Mivel a pályák folytonosak és $0 < a$-ból indulnak,

$$
\{\tau_a \le t\} = \Big\{\max_{s \le t} W_s \ge a\Big\} = \bigcap_{n=1}^{\infty} \; \bigcup_{s \in (\mathbb{Q} \cap [0,t]) \cup \{t\}} \Big\{W_s > a - \tfrac1n\Big\},
$$

ami csak megszámlálhatóan sok $s \le t$ időpontot használ, így $\mathcal{F}^W_t$-ben van. Nyílt halmazok elérési idejéhez és sok más konstrukcióhoz egy kissé bővített, a **szokásos feltételeket** teljesítő filtráció kell: jobbról folytonos, $\mathcal{F}_t = \bigcap_{s > t} \mathcal{F}_s$, és $\mathcal{F}_0$ tartalmazza az összes $\mathbb{P}$-nullmértékű halmazt. A későbbi leckék ezt külön említés nélkül feltételezik.

### Kidolgozott példa: Kondicionálás két dobás közül az elsőre

1. Két szabályos dobás, $X$ = a fejek száma, $\mathcal{F}_1 = \sigma(\xi_1)$. Ha az első dobás H (fej), egy fej már megvan, a második átlagosan $\tfrac12$-et ad hozzá.
   $$\mathbb{E}[X \mid \mathcal{F}_1] = 1 + \tfrac12 \quad \text{ha } \xi_1 = H$$ → **1.5**
2. Ha az első dobás T (írás), csak a második hozhat fejet.
   $$\mathbb{E}[X \mid \mathcal{F}_1] = 0 + \tfrac12 \quad \text{ha } \xi_1 = T$$ → **0.5**
3. Átlagold a két ágat a $\tfrac12$ valószínűségükkel: a toronyszabály visszaadja $\mathbb{E}[X]$-et.
   $$\mathbb{E}\big[\mathbb{E}[X \mid \mathcal{F}_1]\big] = \tfrac12(1{,}5) + \tfrac12(0{,}5)$$ → **1**

## Összefoglalás

- Az $(\mathcal{F}_t)$ filtráció σ-algebrák növekvő családja; $\mathcal{F}_t$ a $t$ időpontbeli információ, a $\sigma(X_s : s \le t)$ természetes filtráció pedig $X$ múltja.
- $n$ pénzfeldobásnál $\mathcal{F}_k$ az első $k$ dobásban megegyező kimenetelek $2^k$ atomú partíciója, $2^{2^k}$ eseménnyel.
- Adaptált: $X_t$ $\mathcal{F}_t$-mérhető; előrejelezhető: $H_k$ $\mathcal{F}_{k-1}$-mérhető, ahogy egy előre választott kereskedési pozíció.
- A megállási időre $\{\tau \le t\} \in \mathcal{F}_t$. Az első elérési idők megállási idők, az utolsó kilépési idők nem.
- Brown-mozgásnál $\mathcal{F}^W_t$ független a jövőbeli növekményektől, és az első elérési idők megállási idők.

[Léptess végig egy pénzfeldobásos bolyongást a Sztochasztikus modellek stúdióban](https://quantsandbox.dev/hu/stochastic-models/random-walk)

## Interaktív laborok

- [Sztochasztikus analízis kurzus: a bolyongástól a Brown-mozgásig](https://quantsandbox.dev/hu/stochastic-models)

## Gyakorló kérdések

### 1. Három szabályos pénzfeldobásnál, $\mathcal{F}_k = \sigma(\xi_1, \ldots, \xi_k)$ mellett hány eseményt tartalmaz $\mathcal{F}_2$?

**Válasz:** 16

$\mathcal{F}_2$-nek $2^2 = 4$ atomja van (az első két dobás lehetséges értékei: HH, HT, TH, TT), eseményei pedig az atomok összes uniója: $2^4 = 16$.

### 2. Legyen $W_k$ egy egyszerű véletlen bolyongás, amelyet $k = 0, 1, \ldots, 10$ időpontokban figyelünk meg a természetes filtrációjával. Az alábbi véletlen időpontok közül melyik megállási idő?

- a) Az első $k$, amelyre $W_k = 2$ (vagy $\infty$, ha nincs ilyen)
- b) Az a $k$, ahol $W_k$ a legnagyobb a $\{0, \ldots, 10\}$ halmazon
- c) Az utolsó $k \le 10$, amelyre $W_k = 0$
- d) Az első $k$, amelyre $W_k = W_{10}$

**Válasz:** a) Az első $k$, amelyre $W_k = 2$ (vagy $\infty$, ha nincs ilyen)

Egy rögzített szint első elérési idejére $\{\tau \le k\} = \bigcup_{j \le k}\{W_j = 2\} \in \mathcal{F}_k$. A másik háromhoz a bolyongás $k$ utáni értékei kellenek annak eldöntéséhez, hogy $\tau \le k$-e.

### 3. Három szabályos pénzfeldobás; $\tau$ az első fej időpontja ($\infty$, ha nincs fej). Mennyi $\mathbb{P}(\tau \le 2)$?

**Válasz:** 0.75

$\{\tau \le 2\}$ az $\mathcal{F}_2$ HH, HT és TH atomjainak uniója, mindegyik $\tfrac14$ valószínűségű, így a valószínűség $\tfrac34 = 0{,}75$. Másképp: $1 - \mathbb{P}(\text{TT}) = 1 - \tfrac14$.

---

Forrás: https://quantsandbox.dev/hu/guide/stochastic/filtrations

Előző lecke: [Valószínűségi mezők, σ-algebrák és valószínűségi változók](https://quantsandbox.dev/hu/guide/stochastic/probability-spaces)

Következő lecke: [Feltételes várható érték és martingálok](https://quantsandbox.dev/hu/guide/stochastic/martingales)
