# Ugrások és a Merton-féle ugró diffúzió

Poisson-folyamat, összetett ugrások, a Merton-modell, és hogyan okoznak az ugrások vastag farkat és mosolyt.

Ennek a résznek az eddigi modelljei mind folytonosan mozognak: a „Véletlen bolyongás és Brown-mozgás” Brown-mozgása, a rá épülő „Geometriai Brown-mozgás”, és az „Átlaghoz visszahúzó folyamatok: Ornstein–Uhlenbeck és Vasicek” folyamatai. A valódi árfolyamok néha ugranak. Egy meglepő gyorsjelentés, egy csőd vagy egy piaci összeomlás két kötés között több százalékot mozdít az áron, közbülső értékek nélkül. Ez a lecke ugrásokat ad a geometriai Brown-mozgáshoz, megnézi, mit tesznek a hozamok eloszlásával, és bemutatja a hatásukat az opcióárakra és a fedezésre.

## A Poisson-folyamat

Az ugrások véletlen időpontokban érkeznek, ezért először a számlálásukra kell modell. A **Poisson-folyamat** $N_t$ a $t$ időpontig bekövetkezett események számát adja. $N_0 = 0$-ból indul, minden eseménynél pontosan 1-gyel nő, közben állandó. Egyetlen paramétere az **intenzitás** $\lambda > 0$, az évente várható események száma. A modellfeltevések:

- Egy rövid, $dt$ hosszú intervallumban $\lambda\,dt$ valószínűséggel történik esemény, kettő vagy több pedig elhanyagolható valószínűséggel.
- Az egymást nem átfedő intervallumokban bekövetkező események száma független (**független növekmények**), mint a Brown-mozgásnál.

Ezekből a feltevésekből a $t$-ig bekövetkezett események száma Poisson-eloszlású:

$$
\Pr(N_t = n) = e^{-\lambda t}\,\frac{(\lambda t)^n}{n!}, \qquad n = 0, 1, 2, \ldots
$$

A várható értéke és a varianciája is $\lambda t$.

## Az összetett Poisson-folyamat

A puszta darabszám még nem mozgatja az árat; minden eseményhez méret is kell. Legyenek $J_1, J_2, \ldots$ független, azonos eloszlású ugrásméretek, $N$-től is függetlenek. Az **összetett Poisson-folyamat** az addig bekövetkezett ugrások összege:

$$
Y_t = \sum_{i=1}^{N_t} J_i.
$$

Gondolj egy biztosítóhoz befutó kárbejelentésekre: $N_t$ a károk száma, $J_i$ az egyes károk nagysága, $Y_t$ az összes kifizetés. Az ugrások számára feltételesen számolva, majd $N_t$ szerint átlagolva a várható érték $\mathbb{E}[Y_t] = \lambda t\,\mathbb{E}[J]$, a variancia $\operatorname{Var}(Y_t) = \lambda t\,\mathbb{E}[J^2]$.

## A Merton-féle ugró diffúzió

Merton (1976) ilyen ugrásokat ad a geometriai Brown-mozgáshoz. Az ugrások a log-árfolyamra hatnak: egy $J$ méretű ugrásnál az ár $e^J$-szeresére változik, a relatív változás tehát $e^J - 1$. Merton normális log-ugrásokat feltételez, $J \sim N(\mu_J, \sigma_J^2)$, amelyek egymástól, $N$-től és $W$-től is függetlenek. A dinamika:

$$
\frac{dS_t}{S_{t-}} = (\mu - \lambda\kappa)\,dt + \sigma\,dW_t + \big(e^{J} - 1\big)\,dN_t, \qquad \kappa = \mathbb{E}\big[e^{J} - 1\big] = e^{\mu_J + \sigma_J^2/2} - 1.
$$

$S_{t-}$ az ár közvetlenül egy esetleges ugrás előtt. Két ugrás között az ár geometriai Brown-mozgást követ, ugráskor $e^J$-szeresére változik. Az ugrótag várható értéke pillanatonként $\lambda\kappa\,dt$, ezért a driftben szereplő $-\lambda\kappa$ **kompenzátor** ezt kiegyenlíti, és a várható hozam $\mu$ marad. $\mu_J = -10\%$ és $\sigma_J = 15\%$ mellett $\kappa \approx -8{,}5\%$: egy átlagos ugrás az ár 8,5%-át viszi el, és $\lambda = 0{,}5$ mellett a kompenzátor évi nagyjából 4,25%-kal emeli a driftet.

A $\mathbb{Q}$ kockázatsemleges mérték alatt a diszkontált árnak martingálnak kell lennie, ezért $\mu$ helyére $r$ kerül, a drift pedig $r - \lambda\kappa$ lesz. A „Mértékcsere és a Girsanov-tétel” lecke csak a Brown-mozgásos részt tárgyalta, ahol a mértékcsere $W$ driftjét tolja el. Ugrásokkal a $-\lambda\kappa$ kompenzátortag is kell, különben a várható ugrásveszteség miatt a diszkontált árnak driftje maradna.

„Az Itô-lemma” két ugrás között $\ln S$-re alkalmazva a megszokott $-\sigma^2/2$ korrekciót adja, minden ugrás pedig $J$-t ad a log-árhoz. A $[0, T]$ szakasz log-hozama tehát

$$
\ln\frac{S_T}{S_0} = \Big(\mu - \lambda\kappa - \frac{\sigma^2}{2}\Big)T + \sigma W_T + \sum_{i=1}^{N_T} J_i.
$$

## A log-hozam eloszlása

Rögzítsük először az ugrások számát. $N_T = n$ esetén a log-hozam egy konstans, $\sigma W_T$ és $n$ független normális ugrás összege, vagyis független normálisok összege. Az $m = (\mu - \lambda\kappa - \sigma^2/2)T$ jelöléssel

$$
\ln\frac{S_T}{S_0}\;\Big|\;N_T = n \;\sim\; N\big(m + n\mu_J,\ \sigma^2 T + n\sigma_J^2\big).
$$

$n$ szerint a Poisson-súlyokkal átlagolva a log-hozam $f$ sűrűségfüggvénye normálisok **Poisson-keveréke**:

$$
f(x) = \sum_{n=0}^{\infty} e^{-\lambda T}\frac{(\lambda T)^n}{n!}\;\varphi\big(x;\ m + n\mu_J,\ \sigma^2 T + n\sigma_J^2\big),
$$

ahol $\varphi(x; a, b)$ az $a$ várható értékű, $b$ varianciájú normális sűrűség. Minden normális komponens egy adott ugrásszámú forgatókönyv.

## Momentumok és vastag farkak

Az alakot a **kumulánsokból** a legkönnyebb leolvasni. Az első kettő a várható érték és a variancia; a harmadik és a negyedik a szórás megfelelő hatványával osztva a **ferdeséget** és a **többletcsúcsosságot** adja (a csúcsosság mínusz 3, normálisnál nulla). Független tagok összegének kumulánsai összeadódnak. A diffúziós rész normális, csak a varianciához ad hozzá, $\sigma^2 T$-t. Összetett Poisson-összeg $k$-adik kumulánsa $\lambda T\,\mathbb{E}[J^k]$. Ebből

$$
\operatorname{Var} = \sigma^2 T + \lambda T(\mu_J^2 + \sigma_J^2), \qquad c_3 = \lambda T(\mu_J^3 + 3\mu_J\sigma_J^2), \qquad c_4 = \lambda T(\mu_J^4 + 6\mu_J^2\sigma_J^2 + 3\sigma_J^4),
$$

a ferdeség $c_3/\operatorname{Var}^{3/2}$, a többletcsúcsosság $c_4/\operatorname{Var}^2$. Ha $\mu_J < 0$, $c_3$ negatív: az eloszlás bal farka hosszabb. $c_4$ mindig pozitív, tehát a farkak **vastagok**: szélsőséges hozamok valószínűbbek, mint egy azonos varianciájú normálisnál. Mindkét hatás gyengül az időtávval, mert a ferdeség $1/\sqrt{T}$, a többletcsúcsosság $1/T$ szerint skálázódik.

> A Merton-modellben a log-hozam normálisok Poisson-keveréke. Varianciája $\sigma^2T + \lambda T(\mu_J^2 + \sigma_J^2)$; negatív átlagos ugrás negatív ferdeséget ad, a többletcsúcsosság pedig mindig pozitív.

## Számpélda

Legyen $\sigma = 15\%$, $\lambda = 0{,}5$ évente, $\mu_J = -10\%$, $\sigma_J = 15\%$ és $T = 1$.

- Az ugrások száma: $\Pr(N_1 = 0) = e^{-0{,}5} \approx 60{,}65\%$, $\Pr(N_1 = 1) = 0{,}5\,e^{-0{,}5} \approx 30{,}33\%$, $\Pr(N_1 = 2) \approx 7{,}58\%$, három vagy több nagyjából 1,44%.
- Variancia: $0{,}15^2 + 0{,}5\,(0{,}01 + 0{,}0225) = 0{,}0225 + 0{,}01625 = 0{,}03875$, azaz 19,69% szórás. Az ugrások adják a variancia $0{,}01625/0{,}03875 \approx 41{,}9\%$-át.
- Ferdeség: $c_3 = 0{,}5\,(-0{,}001 - 0{,}00675) = -0{,}003875$, ezt $0{,}03875^{3/2}$-nel osztva $-0{,}51$.
- Többletcsúcsosság: $c_4 = 0{,}5\,(0{,}0001 + 0{,}00135 + 0{,}00151875) \approx 0{,}00148$, ezt $0{,}03875^2$-nel osztva $0{,}99$.
- Annak valószínűsége, hogy a log-hozam $-30\%$ alatt marad: a Merton-modellben 10,85%, az azonos várható értékű és varianciájú normálisnál 11,26%.

Az utolsó sor meglepőnek tűnik: $-30\%$ csak nagyjából 1,2 szórásnyira van a várható érték alatt, és ott a normálisnak valamivel több tömege van. A vastag farok távolabb mutatkozik meg. $-50\%$ alatt a valószínűségek 2,46% és 1,29%, $-60\%$ alatt 1,10% és 0,31%, vagyis több mint háromszoros a különbség. Egyhónapos távon ugyanezek a paraméterek nagyjából $-1{,}76$ ferdeséget és 11,9 többletcsúcsosságot adnak.

Az ábrán a diffúziós volatilitás $\sigma = 15\%$, az időtáv $T = 1$ év, mindkettő rögzített. Csúszkákkal a $\lambda$ ugrásintenzitás (évi 0 és 3 között, alapértéke 0,5), a $\mu_J$ átlagos log-ugrás ($-30\%$ és $+10\%$ között, alapértéke $-10\%$) és a $\sigma_J$ ugrásvolatilitás (0% és 30% között, alapértéke 15%) állítható. A grafikon az 1 éves log-hozam sűrűségét mutatja a Merton-modellben, valamint az azonos várható értékű és varianciájú normális sűrűséget, $-100\%$ és $+100\%$ közötti log-hozamokra. Az ábra az eloszlás alakjára összpontosít: a diffúziós rész középpontja $-\sigma^2/2$, a kompenzátor pedig kimarad, ez ugyanis mindkét görbét ugyanazzal a konstanssal tolná el, az alakjukon nem változtatna. A kijelzők az ugrásokból származó varianciahányadot, a ferdeséget, a többletcsúcsosságot és a $-30\%$ alatti log-hozam valószínűségét adják mindkét eloszlásra. Állítsd $\lambda$-t 0-ra: a két görbe egybeesik. Aztán tedd $\mu_J$-t erősen negatívvá, és figyeld, ahogy a Merton-sűrűség bal farka megvastagszik, a csúcsa pedig magasabb és keskenyebb lesz a normálisénál.

*[Interaktív ábra: jump density](https://quantsandbox.dev/hu/guide/stochastic/jump-diffusion)*

## Opcióárak és a mosoly

Merton feltevése szerint az ugráskockázat vállalatspecifikus és diverzifikálható, ezért az ugrásintenzitás és az ugrások eloszlása $\mathbb{Q}$ alatt ugyanaz, mint $\mathbb{P}$ alatt. $n$ ugrás feltétele mellett a $T$-beli ár lognormális, így a feltételes opcióár Black–Scholes-ár. $n$ szerint átlagolva kapjuk **Merton képletét**:

$$
C_0 = \sum_{n=0}^{\infty} e^{-\lambda' T}\frac{(\lambda' T)^n}{n!}\;C^{\text{BS}}\big(S_0, K, T, \sigma_n, r_n\big),
$$

$$
\lambda' = \lambda(1 + \kappa), \qquad \sigma_n^2 = \sigma^2 + \frac{n\sigma_J^2}{T}, \qquad r_n = r - \lambda\kappa + \frac{n\ln(1 + \kappa)}{T}.
$$

Minden tag az $n$ ugrásos forgatókönyv Black–Scholes-ára.

Váltsuk át ezeket az árakat implikált volatilitásra, ahogy az „Implikált volatilitás és a volatilitás-mosoly” leckében. Mivel a kockázatsemleges eloszlás bal farka vastag és negatívan ferde, a mélyen pénzen kívüli putok többet érnek, mint amennyit az egyetlen volatilitású Black–Scholes-modell megenged, így alacsony kötési áraknál nő az implikált volatilitás: ferde mosoly alakul ki. Mivel a ferdeség és a többletcsúcsosság az időtávval lecseng, a ferdeség rövid lejáratokon a legmeredekebb, hosszú lejáratokon ellaposodik. Egy tisztán diffúziós modell másképp viselkedik: nagyon rövid távon a log-hozama szinte normális, ezért nehezen ad meredek rövid lejáratú ferdeséget. Az ugrások az egyik magyarázatot adják a részvénypiacokon látott rövid lejáratú ferdeségre; a másik, a véletlen volatilitás, a „Sztochasztikus volatilitás és a Heston-modell” lecke témája, a gyakorlati modellek pedig gyakran mindkettőt kombinálják. Összehasonlításképp a Heston-laborban sztochasztikus volatilitás mellett árazhatsz opciókat.

## Fedezés és nem teljes piac

A Black–Scholes-modellben a folyamatosan újrasúlyozott $\Delta$ darab részvény minden kockázatot eltávolít egy opcióból. Ugrásokkal ez nem működik. Ugráskor az opció értéke $C(S e^J) - C(S)$-sel változik, ami nem lineáris a véletlen $e^J - 1$ ugrásméretben. Egy részvénypozíció egyetlen ugrásméretre ki tudja egyenlíteni az opció változását, de egyszerre mindegyikre nem, és a folyamatos újrasúlyozás sem segít, mert az ugrás egy pillanat alatt zajlik le. Marad kockázat, és a csak részvényből és kötvényből álló piac **nem teljes**: az opció árát már nem a replikáció határozza meg, hanem az, hogyan árazza a piac az ugráskockázatot.

### Kidolgozott példa: A variancia felosztása diffúzió és ugrások között

1. A diffúziós variancia egy évre $\sigma = 15\%$ mellett.
   $$\sigma^2 T = 0{,}15^2$$ → **0.0225**
2. Az ugrásvariancia az ábra alapértékeivel: $\lambda = 0{,}5$, $\mu_J = -10\%$, $\sigma_J = 15\%$.
   $$\lambda T(\mu_J^2 + \sigma_J^2) = 0{,}5\,(0{,}01 + 0{,}0225)$$ → **0.01625**
3. A log-hozam teljes varianciája.
   $$0{,}0225 + 0{,}01625$$ → **0.03875**
4. A variancia diffúzióból származó hányada.
   $$0{,}0225 / 0{,}03875$$ → **0.5806**

## Összefoglalás

- A Poisson-folyamat $N_t$ $\lambda$ intenzitással számlálja az eseményeket: $\Pr(N_t = n) = e^{-\lambda t}(\lambda t)^n/n!$, várható értéke és varianciája $\lambda t$, növekményei függetlenek.
- A $dS/S_{-} = (\mu - \lambda\kappa)\,dt + \sigma\,dW + (e^J - 1)\,dN$ Merton-modell normális log-ugrásokat ad a geometriai Brown-mozgáshoz; a $-\lambda\kappa$ kompenzátor megtartja a várható hozamot, $\mathbb{Q}$ alatt pedig martingállá teszi a diszkontált árat.
- A log-hozam normálisok Poisson-keveréke, varianciája $\sigma^2T + \lambda T(\mu_J^2 + \sigma_J^2)$, $\mu_J < 0$ esetén negatívan ferde, a farkai vastagok, és ez rövid távon a legerősebb.
- Merton opcióára Black–Scholes-árak Poisson-súlyozott összege; az implikált volatilitás ferdesége rövid lejáratokon a legmeredekebb.
- Egy ugrás nem fedezhető delta-fedezéssel, ezért a piac nem teljes.

[Szimulálj árfolyampályákat, és árazz opciókat szimulációval a Monte Carlo laborban](https://quantsandbox.dev/hu/monte-carlo)

## Interaktív laborok

- [Monte Carlo-opcióárazó szimulátor](https://quantsandbox.dev/hu/monte-carlo)
- [Heston-modell: sztochasztikus volatilitás szimulátor](https://quantsandbox.dev/hu/heston)

## Gyakorló kérdések

### 1. Az ugrások évi $\lambda = 2$ intenzitású Poisson-folyamat szerint érkeznek. Hány ugrás várható egy év alatt?

**Válasz:** 2

$\mathbb{E}[N_t] = \lambda t = 2 \times 1 = 2$; a darabszám varianciája szintén 2.

### 2. Hogyan változtatja meg a log-hozam többletcsúcsosságát, ha normális log-ugrásokat adunk a geometriai Brown-mozgáshoz?

- a) Nulla fölé emeli.
- b) Nulla alá csökkenti.
- c) Nullán hagyja.
- d) Az előjele $\mu_J$-től függ.

**Válasz:** a) Nulla fölé emeli.

A negyedik kumuláns, $\lambda T(\mu_J^4 + 6\mu_J^2\sigma_J^2 + 3\sigma_J^4)$, $\mu_J$ előjelétől függetlenül pozitív, így a farkak vastagabbak a normálisénál. $\mu_J$ előjele a ferdeséget határozza meg, nem a csúcsosságot.

---

Forrás: https://quantsandbox.dev/hu/guide/stochastic/jump-diffusion

Előző lecke: [Átlaghoz visszahúzó folyamatok: Ornstein–Uhlenbeck és Vasicek](https://quantsandbox.dev/hu/guide/stochastic/mean-reversion)
