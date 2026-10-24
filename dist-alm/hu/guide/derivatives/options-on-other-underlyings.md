# Opciók osztalékos részvényre, indexre, devizára és határidős ügyletre

Black–Scholes folytonos hozammal, a forward ár mint közös szál, Black-76 határidős ügyletekre és Garman–Kohlhagen devizára.

„A Black–Scholes-képlet” egy osztalékot nem fizető részvényre szóló opciót árazott. A valódi alaptermékek változatosabbak: a részvények és az indexek osztalékot fizetnek, a deviza külföldön kamatot hoz, a határidős ügylet (future) tartása pedig semmibe sem kerül. Ez a lecke megmutatja, hogy mindegyikhez ugyanaz a kis módosítás kell, és hogy ez a módosítás az „Arbitrázs és a határidős ár” leckéből ismert forward áron keresztül látszik a legjobban.

## Folytonos osztalékhozam

Tegyük fel, hogy a részvény az árának folytonos $q$ hányadát fizeti osztalékként. Egy részvény $T$ ideig tartása ekkor az osztalékot is hozza, amelyet a részvénybe visszaforgatva egy részvényből lejáratkor $e^{qT}$ részvény lesz. Hogy pontosan egy részvénnyel zárjunk, ma csak $e^{-qT}$ részvénnyel kell replikálni. A modellben tehát a még várható osztalékokkal csökkentett ár számít, $S_0 e^{-qT}$, és a képlet a régi, ezzel a behelyettesítéssel:

$$
c = S_0 e^{-qT} N(d_1) - K e^{-rT} N(d_2), \qquad p = K e^{-rT} N(-d_2) - S_0 e^{-qT} N(-d_1),
$$

$$
d_1 = \frac{\ln(S_0/K) + (r - q + \tfrac12\sigma^2)\,T}{\sigma\sqrt T}, \qquad d_2 = d_1 - \sigma\sqrt T.
$$

Csak két dolog változott: a spotot $q$-val diszkontáljuk, és $d_1$ driftje $r - q$ lett $r$ helyett. Magasabb hozam olcsóbbá teszi a callt és drágábbá a putot, mert az osztalék alacsonyabban hagyja a részvényt lejáratkor. $q = 0$ esetén pontosan az eredeti képletet kapjuk vissza.

## A forward ár mint közös szál

A részvény $T$ időpontra szóló forward ára $F = S_0 e^{(r-q)T}$, ahogy az „Arbitrázs és a határidős ár” leckében, levonva az osztalékjövedelmet. Ha az $S_0 e^{-qT} = F e^{-rT}$ összefüggést behelyettesítjük a call képletébe, a hozam eltűnik a képletből:

$$
c = e^{-rT}\,\bigl[\,F\,N(d_1) - K\,N(d_2)\,\bigr], \qquad d_1 = \frac{\ln(F/K) + \tfrac12\sigma^2 T}{\sigma\sqrt T}.
$$

Ez az egyetlen képlet áll az alábbi esetek mögött. Az opció az alaptermékről csak a forward árat, a kötési árat és a volatilitást „látja”; alaptermékenként csak az változik, hogyan áll össze $F$ a mai árból.

## Indexopciók

A tőzsdeindex sok összetevő osztalékát fizeti, amelyek együtt viszonylag egyenletes folyamot adnak. Ezt folytonos $q$ hozamként kezelni a szokásos közelítés, és a fenti képlet érvényes, ahol $S_0$ az index szintje. Egyetlen, néhány nagy osztalékot fizető részvény más eset: gyakori megoldás, hogy $S_0$ helyére a lejáratig esedékes osztalékok jelenértékével csökkentett árat írjuk, és a szokásos képletet használjuk (escrowed-dividend módszer). Ezt itt nem vezetjük le.

## Devizaopciók: Garman–Kohlhagen

Az árfolyamot belföldi pénznemben fejezzük ki egy egység külföldi pénzre, a belföldi kamatláb $r_d$, a külföldi $r_f$. A külföldi pénz birtokosa a külföldi kamatot keresi, ami pontosan az osztalékhozam szerepét tölti be: $q = r_f$. A határidős árfolyam $F = S_0 e^{(r_d - r_f)T}$, a fedezett kamatparitás, a call pedig $e^{-r_d T}[F N(d_1) - K N(d_2)]$. Ez a Garman–Kohlhagen-képlet.

## Határidős ügyletre szóló opciók: Black-76

A határidős ügylet megkötéséhez nem kell befektetés, ezért tartása sem hoz jövedelmet, sem finanszírozást nem igényel. Úgy viselkedik, mint egy olyan részvény, amelynek hozama a kamatlábbal egyenlő, $q = r$, így $F e^{-rT}$ áll $S_0 e^{-qT}$ helyén, és a kamatláb kiesik $d_1$-ből. Ha $F$ a határidős ár, a call ismét $e^{-rT}[F N(d_1) - K N(d_2)]$; ez a Black-76-képlet, amelyet széles körben használnak árutermékekre, kamatfuturesekre, és forward hozamokkal capekre és swaptionökre. Magukról a határidős ügyletekről lásd a „Kötvényfutures és a legolcsóbban szállítható kötvény” leckét.

Az ábra 100-as kötési árú és 100-as spotú részvényt használ, 20%-os volatilitással és egyéves lejárattal. Az alapbeállításnál (kamat 5%, osztalékhozam 3%) a call 8,65-be kerül a hozam nélküli 10,45-tel szemben, a put 6,73, a forward pedig 102,02. Emeld a hozamot, és nézd, hogyan süllyed a call görbéje a kifizetési vonal felé; nullán a két görbe egybeesik.

*[Interaktív ábra: dividend yield price](https://quantsandbox.dev/hu/guide/derivatives/options-on-other-underlyings)*

## Put–call paritás hozammal

A „Put–call paritás” leckéből ismert összefüggés ugyanezzel a behelyettesítéssel érvényes marad: egy call mínusz egy put egy forward, mai pénzben értékelve,

$$
c - p = S_0 e^{-qT} - K e^{-rT}.
$$

Ugyanazon alaptermékre, kötési árra és lejáratra szóló call és put ezért ugyanazt mondja a hozamról.

### Kidolgozott példa: Garman–Kohlhagen-call az EUR/USD árfolyamra

1. Határidős árfolyam (spot 1,10, dollárkamat 5%, eurókamat 3%, egy év).
   $$F = S_0\,e^{(r_d - r_f)T}$$ → **1.1222**
2. 1,10-es kötési árral és 10%-os volatilitással az első normális argumentum.
   $$d_1 = \frac{\ln(F/K) + \tfrac12\sigma^2 T}{\sigma\sqrt T}$$ → **0.25**
3. A második argumentum.
   $$d_2 = d_1 - \sigma\sqrt T$$ → **0.15**
4. $N(d_1) = 0{,}5987$ és $N(d_2) = 0{,}5596$ mellett a call ára dollárban, egy euróra vetítve.
   $$c = e^{-r_d T}\,[F\,N(d_1) - K\,N(d_2)]$$ → **0.0536**

## Összefoglalás

- Folytonos $q$ hozam esetén a Black–Scholes-képletben $S_0$ helyére $S_0 e^{-qT}$ kerül; $d_1$ driftje ekkor $r - q$.
- Minden eset egyetlen képlet a forward árban: $c = e^{-rT}[F N(d_1) - K N(d_2)]$, ahol $F = S_0 e^{(r-q)T}$.
- Az index az osztalékhozamot, a deviza a külföldi kamatot (Garman–Kohlhagen), a határidős ügylet a $q = r$ értéket használja (Black-76).
- A put–call paritás $c - p = S_0 e^{-qT} - K e^{-rT}$ alakot ölt.

> Egy későbbi lecke, az „Implikált volatilitás és a volatilitás-mosoly”, megfordítja a kérdést: adott piaci árhoz milyen $\sigma$ kell a képletbe.

[Árazz callokat és putokat a Black–Scholes laborban](https://quantsandbox.dev/hu/black-scholes)

## Interaktív laborok

- [Black–Scholes-kalkulátor és opciós görögök](https://quantsandbox.dev/hu/black-scholes)

## Gyakorló kérdések

### 1. Egy 50-es árú részvény folytonos 2%-os osztalékhozamot fizet; a kockázatmentes kamatláb 4%. Egy 50-es kötési árú, féléves európai call ára 4,41. Mennyi az ugyanilyen kötési árú és lejáratú put ára?

**Válasz:** 3.92

A paritásból $p = c - S_0 e^{-qT} + K e^{-rT} = 4{,}41 - 50e^{-0{,}01} + 50e^{-0{,}02} = 4{,}41 - 49{,}50 + 49{,}01 \approx 3{,}92$.

### 2. Melyik hozam teszi az általánosított képletet a határidős árra szóló opció Black-76-képletévé?

- a) $q = 0$
- b) $q = r$
- c) $q = r_f - r$
- d) $q = \sigma$

**Válasz:** b) $q = r$

A határidős ügylet nem hoz jövedelmet és nem igényel finanszírozást, ezért úgy viselkedik, mint egy olyan eszköz, amelynek hozama a kamatlábbal egyenlő: $q = r$. Ekkor $S_0 e^{(r-q)T}$ éppen a határidős ár.

---

Forrás: https://quantsandbox.dev/hu/guide/derivatives/options-on-other-underlyings

Előző lecke: [A görögök: gamma, vega, théta és rhó](https://quantsandbox.dev/hu/guide/derivatives/greeks)

Következő lecke: [Implikált volatilitás és a volatilitás-mosoly](https://quantsandbox.dev/hu/guide/derivatives/implied-volatility)
