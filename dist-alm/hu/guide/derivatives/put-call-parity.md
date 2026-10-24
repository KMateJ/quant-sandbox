# Put–call paritás

Két portfólió azonos kifizetéssel: modellfüggetlen kapcsolat a call és a put ára között.

Ez a lecke pontos összefüggést vezet le egy európai call és egy európai put ára között. A „Pozíciók kombinálása” lecke szintetikus határidős ügyletét kapcsolja össze az „Arbitrázs és a határidős ár” lecke egy ár törvényével. A határidős árhoz hasonlóan az eredmény semmilyen modellt nem igényel a részvény mozgására.

## A keret

Vegyünk egy európai callt és egy európai putot ugyanarra az osztalékot nem fizető részvényre, azonos $K$ kötési árral és $T$ lejárattal. Mai áruk $C_0$ és $P_0$. A részvény ára $S_0$, a folytonos kockázatmentes kamatláb $r$, így egy $T$-ben $K$-t fizető zérókuponos kötvény ma $Ke^{-rT}$-be kerül. A piaci feltevések ugyanazok, mint az „Arbitrázs és a határidős ár” leckében: nincs tranzakciós költség, $r$ kamaton lehet hitelt felvenni és pénzt elhelyezni, a shortolás megengedett.

## Két portfólió azonos kifizetéssel

A „Pozíciók kombinálása” lecke szerint egy long call és egy short put azonos kötési árral

$$
(S_T - K)^+ - (K - S_T)^+ = S_T - K
$$

összeget fizet $S_T$ bármely értéke mellett. Építsünk két portfóliót:

- **A portfólió:** veszünk egy callt és eladunk egy putot. Mai költség $C_0 - P_0$. Kifizetés $T$-ben: $S_T - K$.
- **B portfólió:** veszünk egy részvényt és felveszünk $Ke^{-rT}$ hitelt, amelyből $T$-ben $K$ tartozás lesz. Mai költség $S_0 - Ke^{-rT}$. Kifizetés $T$-ben: $S_T - K$.

A B portfólió egy $K$ szállítási árú határidős ügylet részvénnyel és hitellel való replikálása, mint a cash-and-carry érvelésben. A két portfólió $T$-ben minden állapotban pontosan ugyanannyit fizet, így az egy ár törvénye szerint ma is ugyanannyiba kerülnek:

$$
C_0 - P_0 = S_0 - K\,e^{-rT}.
$$

Ez a **put–call paritás**. $C_0 + Ke^{-rT} = P_0 + S_0$ alakban így olvasható: egy call plusz a diszkontált kötési árnyi készpénz ugyanannyit ér, mint egy put plusz a részvény. Lejáratkor mindkét oldal $\max(S_T, K)$-t fizet.

> Put–call paritás: $C_0 - P_0 = S_0 - Ke^{-rT}$ osztalékot nem fizető részvényre szóló, azonos kötési árú és lejáratú európai opciókra. Pusztán az arbitrázsmentességből következik.

## Számpélda

Legyen $S_0 = 100$, $K = 100$, $r = 5\%$, $T = 1$. A jobb oldal

$$
S_0 - K\,e^{-rT} = 100 - 100\,e^{-0{,}05} \approx 100 - 95{,}12 = 4{,}88.
$$

A Black–Scholes-képlet, amelyet „A Black–Scholes-képlet” lecke vezet le, $\sigma = 20\%$ volatilitás mellett $C_0 \approx 10{,}45$ és $P_0 \approx 5{,}57$ árat ad. A különbség $4{,}88$, ahogy a paritás előírja. Más volatilitásnál mindkét ár megváltozik, de ugyanannyival, így a különbségük 4,88 marad.

Tegyük fel, hogy egy árjegyző 11-ért kínálja a callt, a put ára pedig továbbra is 5,57. Ekkor $C_0 - P_0 = 5{,}43 > 4{,}88$, vagyis az A portfólió drága B-hez képest. Adjuk el A-t és vegyük meg B-t: eladjuk a callt, megvesszük a putot, megvesszük a részvényt és felveszünk $95{,}12$ hitelt. A mai pénzáram

$$
11 - 5{,}57 - 100 + 95{,}12 \approx 0{,}55,
$$

$T$-ben pedig a pozíciók pontosan kioltják egymást: az eladott call és a megvett put együtt $-(S_T - K)$-t fizet, a részvény és a hitel $S_T - K$-t. A 0,55 kockázat nélkül nálunk marad.

### Kidolgozott példa: A paritás ellenőrzése a szintetikus határidős ügylettel

1. A B portfólió a diszkontált kötési árat veszi fel hitelként, így $T$-ben $K$ a tartozás.
   $$K\,e^{-rT} = 100\,e^{-0{,}05}$$ → **95.12**
2. B ára egy részvény mínusz ez a hitel.
   $$S_0 - K\,e^{-rT}$$ → **4.88**
3. Az A portfólió, a 10,45-ös long call és az 5,57-es short put ára
   $$C_0 - P_0 = 10{,}45 - 5{,}57$$ → **4.88**
4. $T$-ben mindkettő $S_T - K$-t fizet. Például $S_T = 120$ mellett mindkettő ennyit:
   $$(120 - 100)^+ - (100 - 120)^+$$ → **20**

Az ábra rögzíti az $S_0 = 100$ és $r = 5\%$ értékeket, és $K$, $\sigma$, $T$ állítható. A grafikon egy long call és egy short put együttes kifizetését rajzolja rá az $S_T - K$ határidős kifizetésre; a két vonal minden kötési árnál egybeesik. A kijelzők a $C_0$ és $P_0$ Black–Scholes-árat, a különbségüket és $S_0 - Ke^{-rT}$-t mutatják. Változtasd $\sigma$-t, és figyeld meg, hogy $C_0$ és $P_0$ is mozog, $C_0 - P_0$ viszont nem; az csak $K$-val és $T$-vel változik.

*[Interaktív ábra: put call parity](https://quantsandbox.dev/hu/guide/derivatives/put-call-parity)*

## Mit mond meg a paritás, és mit nem

A paritás **modellfüggetlen**: $S_T$ eloszlásától függetlenül érvényes, mert az érvelés sehol sem használ valószínűségeket. Összeköti a két árat, így az egyikből megkapjuk a másikat. Aki callokat áraz, az putokat is áraz: a put ára $P_0 = C_0 - S_0 + Ke^{-rT}$.

Azt viszont nem mondja meg, mekkora bármelyik ár. A $C_0 - P_0$ különbséget rögzíti, de hogy mindkettő mekkora, azt a részvény volatilitása határozza meg. Ehhez már modell kell a részvényárra, amely „Az egylépéses binomiális modell” leckében kezdődik.

Az eredmény a feltevéseire épül. Osztalék esetén a részvénylábat csökkenteni kell az osztalékok jelenértékével. Amerikai opcióknál a korai lehívás lehetősége megszünteti a pontos egyenlőséget, és csak egyenlőtlenségek maradnak.

## Egyszerű arbitrázsmentes korlátok

Ugyanez a gondolatmenet modell nélkül is korlátozza a call árát. Felső korlát: a call sosem fizet többet a részvénynél, hiszen $K \ge 0$ esetén $(S_T - K)^+ \le S_T$. Ami mindig kevesebbet fizet, az nem kerülhet többe, tehát $C_0 \le S_0$.

Alsó korlát: a call kifizetése sosem negatív, így $C_0 \ge 0$. Továbbá $(S_T - K)^+ \ge S_T - K$, tehát a call legalább annyit ér, mint a határidős jellegű B portfólió, amely $S_0 - Ke^{-rT}$-be kerül. Együtt:

$$
\max\left(S_0 - K\,e^{-rT},\,0\right) \le C_0 \le S_0.
$$

Az alsó korlát a paritásból is adódik: mivel $P_0 \ge 0$, $C_0 = P_0 + S_0 - Ke^{-rT} \ge S_0 - Ke^{-rT}$. A példában a call ára 4,88 és 100 közé kell esnie. Ezek a korlátok tágak: kizárják az abszurd árakat, a tényleges szintet azonban a modellre hagyják.

## Összefoglalás

- Egy long call és egy short put azonos kötési árral és lejárattal $S_T - K$-t fizet, ugyanannyit, mint egy $Ke^{-rT}$ hitelből vett részvény.
- Az egy ár törvénye szerint $C_0 - P_0 = S_0 - Ke^{-rT}$.
- A paritás modellfüggetlen: összeköti a call és a put árát, de a szintjüket nem rögzíti.
- Modell nélkül a call ára csak korlátozható: $\max(S_0 - Ke^{-rT}, 0) \le C_0 \le S_0$.

> A tényleges opciós ár meghatározásához a következő leckék modellt adnak a részvényárra, kezdve egyetlen fel- vagy lefelé lépéssel.

[Rakj össze callokból és putokból szintetikus határidős ügyletet a Kifizetés laborban](https://quantsandbox.dev/hu/payoff)

## Interaktív laborok

- [Opciós kifizetési diagram és stratégiaépítő](https://quantsandbox.dev/hu/payoff)
- [Black–Scholes-kalkulátor és opciós görögök](https://quantsandbox.dev/hu/black-scholes)

## Gyakorló kérdések

### 1. Egy $K = 100$ kötési árú, $T = 1$ lejáratú európai call ára 7,2. A részvény $S_0 = 100$, $r = 5\%$. Mennyibe kell kerülnie az azonos kötési árú és lejáratú putnak?

**Válasz:** 2.32

$P_0 = C_0 - S_0 + Ke^{-rT} = 7{,}2 - 100 + 100\,e^{-0{,}05} \approx 7{,}2 - 4{,}88 = 2{,}32$.

### 2. Mely opciókra érvényes pontosan a $C_0 - P_0 = S_0 - Ke^{-rT}$ egyenlőség?

- a) Osztalékot nem fizető részvényre szóló európai opciókra
- b) Osztalékot nem fizető részvényre szóló amerikai opciókra
- c) Bármilyen opcióra, lehívási módtól függetlenül
- d) Csak at-the-money opciókra

**Válasz:** a) Osztalékot nem fizető részvényre szóló európai opciókra

Az érvelés mindkét portfóliót $T$-ig tartja. Az amerikai opciók korai lehívása ezt megtöri, és csak egyenlőtlenségek maradnak; az osztalék a részvénylábat változtatja meg.

---

Forrás: https://quantsandbox.dev/hu/guide/derivatives/put-call-parity

Előző lecke: [Arbitrázs és a határidős ár](https://quantsandbox.dev/hu/guide/derivatives/no-arbitrage)

Következő lecke: [Az egylépéses binomiális modell](https://quantsandbox.dev/hu/guide/derivatives/one-step-binomial)
