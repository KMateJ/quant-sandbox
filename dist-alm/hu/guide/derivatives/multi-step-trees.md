# Többlépéses fák és visszafelé indukció

Rekombináló fa, CRR-paraméterezés, csomópontonkénti árazás és konvergencia a Black–Scholes-árhoz.

Egyetlen felfelé vagy lefelé lépés túl durva ahhoz, hogy hónapokon át leírja egy részvény mozgását. Ez a lecke sok egylépéses modellt fűz fává, és egy opciót úgy áraz, hogy a „Kockázatsemleges valószínűségek” lecke képletét minden csomópontban alkalmazza, a lejárattól visszafelé haladva a mai napig. Felhasználja a „Véletlen bolyongás és Brown-mozgás” lecke $\sqrt{\Delta t}$-s skálázását és a „Kamat, kamatozás és diszkontálás” lecke folytonos diszkontálását is.

## A futamidő felosztása

Osszuk fel a $T$ futamidőt $n$ egyenlő lépésre, amelyek hossza

$$
\Delta t = \frac{T}{n}.
$$

Minden lépésben a részvény árát $u$-val vagy $d$-vel szorozzuk, a korábbi lépésektől függetlenül. A kockázatmentes kötvény most folytonosan kamatozik, így egy lépés alatt $e^{r\Delta t}$-szeresére nő, nem $(1+r)$-szeresére. Minden lépés az egylépéses modell egy példánya, amelyben az $1+r$ szorzó helyén $e^{r\Delta t}$ áll, ezért az arbitrázsmentességi feltétel $d < e^{r\Delta t} < u$, a felfelé lépés kockázatsemleges valószínűsége pedig

$$
q = \frac{e^{r\Delta t} - d}{u - d}.
$$

A feltevések a korábbiak: nincs osztalék, tört mennyiség is kereskedhető, nincs tranzakciós költség, és $r$ kamaton lehet hitelt felvenni és betétet elhelyezni.

## A rekombináló fa

Egy felfelé, majd egy lefelé lépés $S_0ud$-t ad, egy lefelé, majd egy felfelé lépés $S_0du$-t, ami ugyanaz a szám. Az ugyanannyi felfelé lépést tartalmazó utak ugyanabban a csomópontban végződnek. Az ilyen fát **rekombináló** fának nevezzük. $i$ lépés után csak $i+1$ különböző ár van,

$$
S_{i,j} = S_0\,u^{j}\,d^{\,i-j}, \qquad j = 0, 1, \dots, i,
$$

ahol $j$ a felfelé lépések száma. A teljes fának $(n+1)(n+2)/2$ csomópontja van, míg az utak száma $2^n$. $n = 100$ esetén ez 5151 csomópont a nagyjából $1{,}3 \cdot 10^{30}$ út helyett; ettől használható a gyakorlatban a fa.

## Az $u$ és $d$ megválasztása

Az $u$ és $d$ szorzókat úgy kell megválasztani, hogy a fában mozgó részvény úgy viselkedjen, mint egy $\sigma$ éves volatilitású részvény. A Cox–Ross–Rubinstein (CRR) választás

$$
u = e^{\sigma\sqrt{\Delta t}}, \qquad d = \frac{1}{u} = e^{-\sigma\sqrt{\Delta t}}.
$$

Minden lépés $\pm\sigma\sqrt{\Delta t}$-vel változtatja a logaritmikus árat. Ez a „Véletlen bolyongás és Brown-mozgás” lecke skálázott pénzfeldobásos bolyongása: $n$ lépés alatt a logaritmikus árváltozás varianciája közel $n\,\sigma^2\Delta t = \sigma^2 T$, ami megfelel a négyzetgyökös időszabálynak. Mivel $d = 1/u$, egy felfelé és egy lefelé lépés kioltja egymást, így a fa logaritmikus skálán $S_0$ körül szimmetrikus.

## Visszafelé indukció

Lejáratkor az opció értéke minden csomópontban a kifizetése; callnál $C_{n,j} = (S_{n,j} - K)^+$. Egy lépéssel korábban minden csomópont a két utódjával együtt egy egylépéses modell, így értéke a két utódérték diszkontált kockázatsemleges átlaga:

$$
C_{i,j} = e^{-r\Delta t}\big[q\,C_{i+1,j+1} + (1-q)\,C_{i+1,j}\big].
$$

Ezt lépésenként a gyökérig ismételve kapjuk a $C_0 = C_{0,0}$ árat. Minden csomópontban létezik „Az egylépéses binomiális modell” lecke replikáló portfóliója, $\Delta_{i,j} = (C_{i+1,j+1} - C_{i+1,j})/(S_{i+1,j+1} - S_{i+1,j})$ részvénnyel, így az ár egy lépésenként újrasúlyozott stratégia költsége.

> **Visszafelé indukció.** Lejáratkor az értékek a kifizetéssel egyeznek; ezután lépésenként visszafelé haladva minden csomópont értéke a két utód $q$-val súlyozott átlagának $e^{-r\Delta t}$-szerese. A gyökérben kapott érték az arbitrázsmentes ár.

## Kidolgozott példa

Legyen $S_0 = 100$, $K = 100$, $T = 1$, $\sigma = 20\%$, $r = 5\%$ és $n = 2$, tehát $\Delta t = 0{,}5$.

1. Szorzók: $u = e^{0{,}2\sqrt{0{,}5}} \approx 1{,}1519$, $d = 1/u \approx 0{,}8681$, $e^{r\Delta t} = e^{0{,}025} \approx 1{,}0253$.
2. Kockázatsemleges valószínűség: $q = \dfrac{1{,}0253 - 0{,}8681}{1{,}1519 - 0{,}8681} \approx 0{,}5539$.
3. Árak lejáratkor: $S_{2,2} = 100u^2 \approx 132{,}69$, $S_{2,1} = 100$, $S_{2,0} = 100d^2 \approx 75{,}36$.
4. Kifizetések: $C_{2,2} \approx 32{,}69$, $C_{2,1} = 0$, $C_{2,0} = 0$.
5. 1. lépés: $C_{1,1} = \dfrac{0{,}5539\cdot 32{,}69 + 0{,}4461\cdot 0}{1{,}0253} \approx 17{,}66$, és $C_{1,0} = 0$, mert mindkét utódja nulla értékű.
6. Gyökér: $C_0 = \dfrac{0{,}5539\cdot 17{,}66}{1{,}0253} \approx 9{,}54$.

Ugyanezekkel a bemenetekkel a Black–Scholes-ár, amelyet egy későbbi lecke vezet le, körülbelül 10,45. Két lépés durva közelítést ad; több lépéssel közelebb kerülünk.

### Kidolgozott példa: Ugyanez a kétlépéses fa egy putra

1. Ugyanazok a bemenetek, most egy $K = 100$ kötési árú put. A fenti $u \approx 1{,}1519$, $d = 1/u$ és $q \approx 0{,}5539$ értékekkel csak a legalsó lejárati csomópont fizet:
   $$P_{2,0} = (100 - 100d^2)^+$$ → **24.64**
2. 1. lépés, alsó csomópont: mindkét utódot súlyozzuk, de csak a lefelé utód fizet.
   $$P_{1,0} = \frac{0{,}5539 \cdot 0 + 0{,}4461 \cdot 24{,}64}{1{,}0253}$$ → **10.72**
3. 1. lépés, felső csomópont: mindkét utód nulla értékű, így $P_{1,1} = 0$. A gyökér:
   $$P_0 = \frac{0{,}5539 \cdot 0 + 0{,}4461 \cdot 10{,}72}{1{,}0253}$$ → **4.66**
4. Ellenőrzés put–call paritással, a fás 9,54-es call árral:
   $$C_0 - (S_0 - Ke^{-rT}) = 9{,}54 - 4{,}88$$ → **4.66**

## A lejárati ár eloszlása

$\mathbb{Q}$ alatt minden lépés egymástól függetlenül $q$ valószínűséggel felfelé lépés, így a lejáratig megtett felfelé lépések $j$ száma binomiális eloszlású. A $j$ csomópontba érkezés valószínűsége az odavezető utak száma szorozva egy út valószínűségével:

$$
\mathbb{Q}(S_T = S_0u^jd^{\,n-j}) = \binom{n}{j}\,q^j(1-q)^{n-j}.
$$

Európai opciónál a visszafelé indukció ezért ugyanazt adja, mint egyetlen diszkontált várható érték a lejárati csomópontokon:

$$
C_0 = e^{-rT}\sum_{j=0}^{n}\binom{n}{j}\,q^j(1-q)^{n-j}\,\big(S_0u^jd^{\,n-j} - K\big)^+.
$$

Ahogy $n$ nő, $j$ binomiális eloszlása normális eloszláshoz tart, így $\ln S_T$ normális eloszlásúvá válik. Ez a Black–Scholes mögötti lognormális modell.

## Konvergencia a Black–Scholes-árhoz

Az ábra a CRR call árát mutatja a lépésszám függvényében ($n = 1$-től 150-ig), $S_0 = 100$, $r = 5\%$ és $T = 1$ mellett, a Black–Scholes-árat pedig vízszintes egyenesként. $K = 100$ és $\sigma = 20\%$ esetén a fa $n = 1$-re 12,16-ot, $n = 2$-re 9,54-et, $n = 10$-re 10,25-öt, $n = 100$-ra 10,43-at ad, szemben a 10,45-tel. A közeledés nem sima: az ár cikcakkban ugrál páros és páratlan $n$ között, mert $n$ változásával a lejárati csomópontok elcsúsznak a kötési árhoz képest, a kifizetésnek pedig $K$-nál töréspontja van. Mozgasd $K$-t és $\sigma$-t, és figyeld meg, hogy a cikcakk mérete változik, a görbe viszont mindig a referenciavonalra áll be.

*[Interaktív ábra: tree convergence](https://quantsandbox.dev/hu/guide/derivatives/multi-step-trees)*

## Amerikai opciók

Az amerikai opció bármelyik csomópontban lehívható. A visszafelé indukció ezt egyetlen módosítással kezeli: minden csomópontban a lehívási érték és a fenti képlet szerinti továbbtartási érték közül a nagyobbat vesszük. Osztalékot nem fizető részvényre szóló callnál a korai lehívás sosem optimális, így az ára megegyezik az európaiéval. Amerikai putnál viszont lehet optimális, és árazására a fa a szokásos eszköz.

## Összefoglalás

- A többlépéses fa $T$-t $n$ darab $\Delta t = T/n$ hosszú lépésre bontja; a kötvény lépésenként $e^{r\Delta t}$-szeresére nő, és $q = (e^{r\Delta t} - d)/(u-d)$.
- A CRR-választás, $u = e^{\sigma\sqrt{\Delta t}}$, $d = 1/u$, rekombináló fát ad, amelynek logaritmikus árvarianciája $T$ alatt körülbelül $\sigma^2 T$.
- A visszafelé indukció minden csomópontban az egylépéses árazási képletet alkalmazza, a lejárattól a mai napig.
- A felfelé lépések száma $\mathbb{Q}$ alatt binomiális eloszlású, és a fa ára $n$ növelésével oszcillálva a Black–Scholes-árhoz tart.

[Építs többlépéses fákat, és kövesd a konvergenciát a Binomiális laborban](https://quantsandbox.dev/hu/binomial)

## Interaktív laborok

- [Binomiális opcióárazó fa kalkulátor](https://quantsandbox.dev/hu/binomial)
- [Black–Scholes-kalkulátor és opciós görögök](https://quantsandbox.dev/hu/black-scholes)

## Gyakorló kérdések

### 1. Egy rekombináló binomiális fának $n$ lépése van. Hány különböző részvényár van lejáratkor?

- a) $n + 1$
- b) $2n$
- c) $2^n$
- d) $(n+1)(n+2)/2$

**Válasz:** a) $n + 1$

Egy lejárati csomópontot a felfelé lépések $j = 0, 1, \dots, n$ száma határoz meg, így $n + 1$ van belőlük. $2^n$ az utak száma, $(n+1)(n+2)/2$ pedig a fa összes csomópontjáé.

### 2. $\sigma = 20\%$ volatilitás és negyedéves lépések ($\Delta t = 0{,}25$) mellett mennyi a CRR felfelé szorzó, $u$?

**Válasz:** 1.1052

$u = e^{\sigma\sqrt{\Delta t}} = e^{0{,}2 \cdot 0{,}5} = e^{0{,}1} \approx 1{,}1052$, és $d = 1/u \approx 0{,}9048$.

---

Forrás: https://quantsandbox.dev/hu/guide/derivatives/multi-step-trees

Előző lecke: [Kockázatsemleges valószínűségek](https://quantsandbox.dev/hu/guide/derivatives/risk-neutral)

Következő lecke: [Amerikai opciók és korai lehívás](https://quantsandbox.dev/hu/guide/derivatives/american-options)
