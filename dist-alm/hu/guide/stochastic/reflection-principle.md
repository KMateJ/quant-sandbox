# A tükrözési elv és az első elérési idők

Az erős Markov-tulajdonság, a futó maximum eloszlása és az első elérési idő sűrűsége.

Ez a lecke kiszámítja a Brown-mozgás futó maximumának eloszlását, valamint annak az időpontnak az eloszlását, amikor a folyamat először elér egy adott szintet. Az eszköz a tükrözési elv, amely „A Brown-mozgás tulajdonságai” című lecke erős Markov-tulajdonságán és a „Filtrációk, adaptált folyamatok és megállási idők” című lecke megállásiidő-fogalmán alapul. Az eredmények pontos, zárt alakú képletek, és ezekre épül a barrier opciók árazása.

## Futó maximum és első elérési idő

Legyen $W$ standard Brown-mozgás $(\mathcal{F}^W_t)$ természetes filtrációval, és rögzítsünk egy $a > 0$ szintet. A **futó maximum** és az **első elérési idő**

$$
M_t = \max_{0 \le s \le t} W_s, \qquad \tau_a = \inf\{t \ge 0 : W_t = a\}.
$$

A maximum létezik, mert a pálya a kompakt $[0, t]$ intervallumon folytonos. Mivel $W_0 = 0 < a$ és a pályák folytonosak, a Bolzano-tétel az alábbi eseményazonosságot adja:

$$
\{\tau_a \le t\} = \{M_t \ge a\}, \qquad W_{\tau_a} = a \ \text{ a } \{\tau_a < \infty\} \text{ eseményen}.
$$

$\tau_a$ megállási idő. A folytonosság miatt $M_t \ge a$ pontosan akkor teljesül, ha minden $n$-hez van olyan racionális $q \in [0, t]$, amelyre $W_q > a - 1/n$, ezért

$$
\{\tau_a \le t\} = \bigcap_{n \ge 1}\ \bigcup_{q \in \mathbb{Q} \cap [0,t]} \{W_q > a - 1/n\} \in \mathcal{F}^W_t,
$$

vagyis megszámlálható sok, egyenként a $t$ időpontban ismert esemény kombinációja. A rekurrencia miatt $\tau_a < \infty$ majdnem biztosan; ez az alábbi képletből is következik.

## A tükrözési érvelés

Definiáljuk a **tükrözött pályát**: kövessük $W$-t addig, amíg először eléri $a$-t, utána tükrözzük az $y = a$ egyenesre:

$$
\widetilde W_t = \begin{cases} W_t, & t \le \tau_a, \\ 2a - W_t, & t > \tau_a. \end{cases}
$$

**Állítás:** $\widetilde W$ ismét standard Brown-mozgás. Itt lép be az erős Markov-tulajdonság. A $\tau_a$ megállási időben alkalmazva azt mondja, hogy a $B_s = W_{\tau_a + s} - a$, $s \ge 0$ folyamat $\mathcal{F}_{\tau_a}$-tól független Brown-mozgás, így speciálisan független a $(W_{t \wedge \tau_a})_{t \ge 0}$ megállított pályától. A szimmetria miatt $-B$ is $\mathcal{F}_{\tau_a}$-tól független Brown-mozgás. Ezért a (megállított pálya, $B$) és a (megállított pálya, $-B$) párok együttes eloszlása azonos. $W$ az első párból úgy áll elő, hogy a megállított pályához $\tau_a$-ban hozzáragasztjuk $a + B$-t, $\widetilde W$ pedig a második párból ugyanezzel a ragasztó leképezéssel, tehát $W$ és $\widetilde W$ eloszlása megegyezik.

Mindkét feltétel lényeges. Rögzített $s$ időpontban elég volna a közönséges Markov-tulajdonság, de $\tau_a$ véletlen. Előretekintő véletlen időpontra pedig az érvelés megbukna: ha például a $[0, 1]$-en vett maximum elérésének időpontjában állnánk meg, utána a pálya kénytelen a maximuma alatt maradni, tehát nem friss Brown-mozgás.

Most számoljuk meg a pályákat. $\widetilde W$ ugyanabban a $\tau_a$ időpontban éri el $a$-t, mint $W$, és a $\{\tau_a \le t\}$ eseményen $\widetilde W_t = 2a - W_t$, így $W_t < a$ pontosan akkor, ha $\widetilde W_t > a$. Felhasználva, hogy $\widetilde W$ eloszlása $W$-éval egyezik, és hogy $\{W_t > a\} \subset \{\tau_a \le t\}$,

$$
\mathbb{P}(M_t \ge a,\ W_t < a) = \mathbb{P}(\tau_a \le t,\ \widetilde W_t > a) = \mathbb{P}(\tau_a \le t,\ W_t > a) = \mathbb{P}(W_t > a).
$$

Mivel $\mathbb{P}(W_t = a) = 0$, az $\{M_t \ge a\}$ eseményt $W_t - a$ előjele szerint kettébontva kapjuk a tételt.

> Tükrözési elv: $a > 0$ és $t > 0$ esetén $\mathbb{P}(M_t \ge a) = 2\,\mathbb{P}(W_t \ge a) = 2\big(1 - \Phi(a/\sqrt{t})\big)$. Speciálisan $M_t$ eloszlása megegyezik $|W_t|$ eloszlásával.

Az utolsó állítás azért igaz, mert $a > 0$ esetén $\mathbb{P}(|W_t| \ge a) = 2\,\mathbb{P}(W_t \ge a)$. Jó kép erre egy $a$ magasságban elhelyezett tükör: minden pályának, amely megérinti $a$-t és alatta végez, van egy ugyanolyan valószínű tükörképe, amely fölötte végez, így az érintő pályák egyenlően oszlanak meg a két oldal között. A pénzfeldobásos bolyongásra ugyanez az érvelés $\pm 1$-es lépésekkel pontos, és ez André klasszikus megoldása a szavazási problémára.

## Számpélda

Legyen $a = 1$, $t = 1$. Ekkor $\mathbb{P}(W_1 \ge 1) = 1 - \Phi(1) \approx 0{,}1587$, és

$$
\mathbb{P}(M_1 \ge 1) = 2\big(1 - \Phi(1)\big) \approx 0{,}3173.
$$

Körülbelül minden harmadik pálya eléri az 1-es szintet egységnyi idő alatt, pedig csak minden hatodik végez fölötte. Mivel $M_1 \sim |W_1|$, a maximum várható értéke $\mathbb{E}[M_1] = \mathbb{E}|W_1| = \sqrt{2/\pi} \approx 0{,}7979$.

Alkalmazás: modellezzük a logárfolyamot drift nélkül, $\ln(S_t/S_0) = \sigma W_t$, ahol $S_0 = 100$ és $\sigma = 20\%$. Annak valószínűsége, hogy a részvény egy éven belül megérinti a 120-at, megegyezik annak valószínűségével, hogy $W$ a $t = 1$ időpontig eléri az $a = \ln(1{,}2)/0{,}2 \approx 0{,}9116$ szintet:

$$
\mathbb{P}\Big(\max_{s \le 1} S_s \ge 120\Big) = 2\big(1 - \Phi(0{,}9116)\big) \approx 0{,}362.
$$

Ha a logárfolyamnak $\nu$ driftje van, $X_s = \nu s + \sigma W_s$, a tükrözési elv közvetlenül nem alkalmazható, mert a driftes folyamat nem szimmetrikus. A „Mértékcsere és a Girsanov-tétel” című leckében a drift eltávolításával kapott eredmény

$$
\mathbb{P}\Big(\max_{s \le T} X_s \ge m\Big) = 1 - \Phi\Big(\frac{m - \nu T}{\sigma\sqrt{T}}\Big) + e^{2\nu m/\sigma^2}\,\Phi\Big(\frac{-m - \nu T}{\sigma\sqrt{T}}\Big).
$$

$\nu = 0$ esetén ez $2(1 - \Phi(m/(\sigma\sqrt{T})))$-re egyszerűsödik. $\nu = -\sigma^2/2 = -0{,}02$ mellett (nulla várható részvényhozam) a fenti érintési valószínűség körülbelül $0{,}330$.

Az ábra rögzíti a $T = 1$ értéket, az $a$ szint pedig 0,2 és 2,5 között állítható (alapérték 1). Egy olyan mintapályát rajzol, amely eléri $a$-t (addig sorsol újra, amíg ilyet nem talál), az $y = a$ egyenest, valamint szaggatott vonallal a pálya $\tau_a$ utáni tükörképét; az „Új pálya” gomb újat sorsol. A kijelzők 20 000, egyenként 500 lépéses szimulált pályából számolnak: azon pályák aránya, amelyek maximuma legalább $a$, a pontos $2(1 - \Phi(a))$ érték, és azon pályák aránya, amelyekre $W_1 \ge a$. Az első közel kétszerese a harmadiknak. Kissé el is marad a pontos értéktől, mert a szimulált maximumot csak az 500 rácspontban vesszük, így a rácspontok közötti átlépések rejtve maradnak; $a = 1$ esetén $0{,}317$ helyett nagyjából $0{,}30$ jön ki. „A Brown-híd” című lecke kiszámítja egy ilyen rejtett átlépés valószínűségét.

*[Interaktív ábra: reflection max](https://quantsandbox.dev/hu/guide/stochastic/reflection-principle)*

## Az első elérési idő eloszlása

Mivel $\{\tau_a \le t\} = \{M_t \ge a\}$, a tükrözési elv megadja $\tau_a$ eloszlásfüggvényét, $t$ szerint deriválva pedig (felhasználva, hogy $\tfrac{d}{dt}\,a t^{-1/2} = -\tfrac12 a t^{-3/2}$) a sűrűségfüggvényét:

$$
\mathbb{P}(\tau_a \le t) = 2\Big(1 - \Phi\Big(\frac{a}{\sqrt{t}}\Big)\Big), \qquad f_{\tau_a}(t) = \frac{a}{\sqrt{2\pi t^3}}\,e^{-a^2/(2t)}, \quad t > 0.
$$

Ez a **Lévy-eloszlás**. Két tény következik belőle:

- $\mathbb{P}(\tau_a < \infty) = \lim_{t \to \infty} 2(1 - \Phi(a/\sqrt{t})) = 2(1 - \Phi(0)) = 1$: minden szintet majdnem biztosan elér.
- $\mathbb{E}[\tau_a] = \infty$: nagy $t$-re $t\,f_{\tau_a}(t) \approx a\,(2\pi)^{-1/2}\,t^{-1/2}$, ami az $[1, \infty)$ intervallumon nem integrálható.

A szint elérése biztos, a várható várakozási idő mégis végtelen. A medián véges: $\mathbb{P}(\tau_a \le t) = \tfrac12$, ha $a/\sqrt{t} = \Phi^{-1}(0{,}75) \approx 0{,}6745$, azaz $t \approx 2{,}198\,a^2$. Az $a^2$ szorzó a skálázás következménye: $\tau_a$ eloszlása megegyezik $a^2\tau_1$ eloszlásával. Ez megvilágít egy pontot a „Feltételes várható érték és martingálok” című leckéből is: $W$ martingál $W_0 = 0$ kezdőértékkel, mégis $W_{\tau_a} = a$. A $\tau_a$-ban való megállás csak azért teszi a fair játékot biztos nyereséggé, mert $\tau_a$ nem korlátos és várható értéke végtelen, így az opcionális megállási tétel nem alkalmazható.

## A maximum és a végpont együttes eloszlása

Ugyanez a tükrözés többet is ad. Ha $a \ge 0$ és $x \le a$, akkor a $\{\tau_a \le t\}$ eseményen a $W_t \le x$ feltétel ekvivalens a $\widetilde W_t \ge 2a - x$ feltétellel, és $2a - x \ge a$ maga után vonja, hogy $\tau_a \le t$. Ezért

$$
\mathbb{P}(M_t \ge a,\ W_t \le x) = \mathbb{P}(W_t \ge 2a - x) = 1 - \Phi\Big(\frac{2a - x}{\sqrt{t}}\Big), \qquad a \ge 0,\ x \le a.
$$

$a$ és $x$ szerint deriválva kapjuk az együttes sűrűségfüggvényt:

$$
f_{M_t, W_t}(m, w) = \frac{2(2m - w)}{\sqrt{2\pi t^3}}\,\exp\Big(-\frac{(2m - w)^2}{2t}\Big), \qquad m \ge 0,\ w \le m.
$$

Például annak valószínűsége, hogy a pálya az 1-es időpontig eléri az 1-et, de legfeljebb 0-ban végez, $\mathbb{P}(W_1 \ge 2) = 1 - \Phi(2) \approx 0{,}0228$.

A barrier opciókhoz éppen erre az együttes eloszlásra van szükség. Egy felfelé kiütő (up-and-out) call csak akkor fizet $(S_T - K)^+$ összeget, ha az árfolyam a teljes $[0, T]$ időszakban a $H$ korlát alatt marad. A Black–Scholes-modellben a logárfolyam driftes Brown-mozgás, az opció ára pedig a kifizetés diszkontált integrálja a maximum és a végpont együttes sűrűségfüggvénye szerint, a fenti módon driftre korrigálva. A gyakorlatban használt zárt alakú barrier opcióárak pontosan ebből a számításból származnak.

### Kidolgozott példa: Az 1-es szint elérése

1. A standard normális eloszlásfüggvény értéke 1-ben.
   $$\Phi(1)$$ → **0.8413**
2. A tükrözési elv szerint a $t = 1$-ig vett maximum kétszer akkora valószínűséggel éri el az 1-et, mint amekkorával $W_1$ 1 fölött végez.
   $$\mathbb{P}\big(\max_{t \le 1} W_t \ge 1\big) = 2\big(1 - \Phi(1)\big)$$ → **0.3173**
3. $\{\tau_1 \le 1\}$ ugyanaz az esemény, mint $\{\max_{t \le 1} W_t \ge 1\}$, tehát a valószínűsége is ugyanannyi.
   $$\mathbb{P}(\tau_1 \le 1) = 2\big(1 - \Phi(1/\sqrt{1})\big)$$ → **0.3173**
4. Négyszer annyi idővel $\Phi$ argumentuma a felére csökken.
   $$\mathbb{P}(\tau_1 \le 4) = 2\big(1 - \Phi(1/\sqrt{4})\big)$$ → **0.6171**

## Összefoglalás

- $\tau_a = \inf\{t : W_t = a\}$ megállási idő, és $\{\tau_a \le t\} = \{M_t \ge a\}$.
- A $\tau_a$-beli erős Markov-tulajdonság miatt a $\tau_a$ után tükrözött pálya is Brown-mozgás; ebből $\mathbb{P}(M_t \ge a) = 2(1 - \Phi(a/\sqrt{t}))$ és $M_t \sim |W_t|$.
- $\tau_a$ sűrűségfüggvénye az $a(2\pi t^3)^{-1/2}e^{-a^2/(2t)}$ Lévy-sűrűség: majdnem biztosan véges, de várható értéke végtelen.
- $x \le a$ esetén $\mathbb{P}(M_t \ge a, W_t \le x) = 1 - \Phi((2a - x)/\sqrt{t})$; ezzel az együttes eloszlással árazhatók a barrier opciók.
- Diszkrét időrácson a szimulált maximum lefelé torzít, mert a rácspontok közötti átlépések kimaradnak.

[Tükrözz szimulált pályákat egy szinten a Sztochasztikus modellek stúdióban](https://quantsandbox.dev/hu/stochastic-models/reflection)

## Interaktív laborok

- [Sztochasztikus analízis kurzus: a bolyongástól a Brown-mozgásig](https://quantsandbox.dev/hu/stochastic-models)

## Gyakorló kérdések

### 1. Mennyi $\mathbb{P}(M_4 \ge 1)$, vagyis annak valószínűsége, hogy a Brown-mozgás a 4-es időpontig eléri az 1-es szintet?

**Válasz:** 0.6171

$\mathbb{P}(M_4 \ge 1) = 2\big(1 - \Phi(1/\sqrt{4})\big) = 2\big(1 - \Phi(0{,}5)\big) \approx 2 \times 0{,}3085 = 0{,}6171$.

### 2. $a > 0$ esetén melyik állítás igaz a $\tau_a = \inf\{t \ge 0 : W_t = a\}$ első elérési időre?

- a) $\mathbb{P}(\tau_a < \infty) = 1$ és $\mathbb{E}[\tau_a] = a^2$
- b) $\mathbb{P}(\tau_a < \infty) = 1$ és $\mathbb{E}[\tau_a] = \infty$
- c) $\mathbb{P}(\tau_a < \infty) = \tfrac12$ és $\mathbb{E}[\tau_a] = \infty$
- d) $\mathbb{P}(\tau_a < \infty) = 2(1 - \Phi(a))$

**Válasz:** b) $\mathbb{P}(\tau_a < \infty) = 1$ és $\mathbb{E}[\tau_a] = \infty$

A $2(1 - \Phi(a/\sqrt{t}))$ kifejezésben $t \to \infty$ határátmenettel 1 adódik, a Lévy-sűrűség viszont csak $t^{-3/2}$ ütemben csökken, így $t\,f_{\tau_a}(t)$ nem integrálható, és a várható érték végtelen. A $2(1 - \Phi(a))$ érték $\mathbb{P}(\tau_a \le 1)$.

### 3. Számítsd ki $\mathbb{P}(M_1 \ge 1,\ W_1 \le 0)$ értékét.

**Válasz:** 0.0228

$a = 1$, $x = 0$ mellett $\mathbb{P}(M_1 \ge 1,\ W_1 \le 0) = \mathbb{P}(W_1 \ge 2a - x) = \mathbb{P}(W_1 \ge 2) = 1 - \Phi(2) \approx 0{,}0228$.

---

Forrás: https://quantsandbox.dev/hu/guide/stochastic/reflection-principle

Előző lecke: [A Brown-mozgás tulajdonságai](https://quantsandbox.dev/hu/guide/stochastic/brownian-properties)

Következő lecke: [A Brown-híd](https://quantsandbox.dev/hu/guide/stochastic/brownian-bridge)
