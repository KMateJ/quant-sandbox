# Geometriai Brown-mozgás

A részvényár standard modellje: lognormális eloszlás, várható érték és medián.

Ez a lecke a részvényár szokásos folytonos idejű modelljét, a **geometriai Brown-mozgást** (GBM) építi fel. Összekapcsolja a „Véletlen bolyongás és Brown-mozgás” lecke $W_t$ folyamatát a „Hozamok és volatilitás” lecke loghozamaival és volatilitásával. A GBM egyben a „Többlépéses fák és visszafelé indukció” lecke fáinak folytonos határesete. A következő lecke Black–Scholes-képlete erre a modellre épül.

## Hozamok modellezése árak helyett

A legegyszerűbb ötlet az lenne, hogy maga az ár kövessen Brown-mozgást: $S_t = S_0 + \mu t + \sigma W_t$. Ennek két hibája van. Egyrészt $W_t$ normális eloszlású, így az ár negatívvá válhat. Másrészt egy 1 egységnyi elmozdulás egészen mást jelent egy 10-es és egy 1000-es részvénynél. Ami véletlen, és részvények között összevethető, az a **hozam**, nem az árváltozás.

Ezért egy rövid $dt$ időszak hozamát modellezzük. A feltevések:

- Az időegységre jutó várható hozam állandó, $\mu$ (a **drift**).
- A hozamok volatilitása állandó, $\sigma$.
- A hozam véletlen része Brown-mozgásból származik: nem átfedő időszakok hozamai függetlenek és normális eloszlásúak.
- A részvény nem fizet osztalékot, és ára folytonosan, ugrások nélkül mozog.

## A modell egyenlete

A feltevések képletben:

$$
\frac{dS_t}{S_t} = \mu\,dt + \sigma\,dW_t \qquad\Longleftrightarrow\qquad dS_t = \mu S_t\,dt + \sigma S_t\,dW_t.
$$

Olvasd egy kis lépés receptjeként: $dt$ alatt a hozamnak van egy determinisztikus része, $\mu\,dt$, és egy véletlen része, $\sigma\,dW_t$. Mivel $dW_t$ normális, 0 várható értékkel és $dt$ varianciával, a lépés hozamának várható értéke $\mu\,dt$, szórása $\sigma\sqrt{dt}$; ez a „Hozamok és volatilitás” lecke négyzetgyökös időszabálya. Mivel mindkét tag arányos $S_t$-vel, az ármozgások az árszinttel együtt skálázódnak.

## A megoldás

Az egyenletnek explicit megoldása van:

$$
S_T = S_0 \exp\!\left( \left(\mu - \tfrac{1}{2}\sigma^2\right) T + \sigma W_T \right).
$$

Logaritmust véve a $[0, T]$ időszak loghozama

$$
\ln\frac{S_T}{S_0} = \left(\mu - \tfrac{1}{2}\sigma^2\right) T + \sigma W_T \sim N\!\left( \left(\mu - \tfrac{1}{2}\sigma^2\right) T,\; \sigma^2 T \right).
$$

A logaritmikus ár tehát állandó driftű Brown-mozgás. Azt a valószínűségi változót, amelynek logaritmusa normális, **lognormális** eloszlásúnak nevezzük. Mivel $S_T$ az $S_0$ és egy exponenciális szorzata, mindig pozitív: a GBM kijavítja a naiv modell első hibáját.

## A volatilitás-korrekció

A logaritmikus ár driftje $\mu - \tfrac{1}{2}\sigma^2$, nem $\mu$. A korrekció a normális eloszlás egy tulajdonságából jön. Ha $Z \sim N(m, s^2)$, akkor

$$
\mathbb{E}\left[e^{Z}\right] = e^{m + \frac{1}{2}s^2}.
$$

Az exponenciális függvény konvex, ezért $Z$ nagy pozitív értékeit jobban felnagyítja, mint amennyire a negatívakat tompítja, így $e^Z$ várható értéke nagyobb $e^m$-nél. Alkalmazzuk ezt $m = (\mu - \tfrac{1}{2}\sigma^2)T$ és $s^2 = \sigma^2 T$ mellett:

$$
\mathbb{E}^{\mathbb{P}}[S_T] = S_0\, e^{(\mu - \frac{1}{2}\sigma^2)T + \frac{1}{2}\sigma^2 T} = S_0\, e^{\mu T}.
$$

A $-\tfrac{1}{2}\sigma^2$ tag pontosan ahhoz kell, hogy a várható ár $\mu$ ütemben nőjön, ahogy feltettük. A formális levezetés az Itô-lemmát használja, amely a Brown-mozgás függvényeire vonatkozó láncszabály, és $dS/S$-ről $d\ln S$-re áttérve hozzáadja a $-\tfrac{1}{2}\sigma^2\,dt$ tagot.

Ugyanennek a hatásnak hétköznapi változata a **volatilitási veszteség** (volatility drag). Ha egy ár 10%-ot emelkedik, majd 10%-ot esik, a végén $1{,}1 \cdot 0{,}9 = 0{,}99$-szerese a kiinduló értéknek: az átlagos hozam nulla, a kamatos növekedés mégis negatív. Minél ingadozóbbak a hozamok, annál nagyobb a rés az átlagos hozam és a ténylegesen elért növekedési ütem között.

## Várható érték és medián

Mivel az exponenciális függvény növekvő, $S_T$ mediánja a logaritmikus ár mediánjának exponenciálisa, a logaritmikus ár mediánja pedig egyenlő a várható értékével:

$$
\text{várható érték} = S_0\, e^{\mu T}, \qquad \text{medián} = S_0\, e^{(\mu - \frac{1}{2}\sigma^2) T}.
$$

A várható érték a medián fölött van: a lognormális eloszlás jobbra ferde, a nagy kimenetelek hosszú farka felhúzza az átlagot. Egy tipikus pálya a medián közelében végez, a várható érték alatt.

Példa: $S_0 = 100$, $\mu = 8\%$, $\sigma = 20\%$, $T = 1$. A várható érték $100\,e^{0{,}08} \approx 108{,}33$, a medián $100\,e^{0{,}06} \approx 106{,}18$. A loghozam $N(0{,}06;\, 0{,}2^2)$ eloszlású, így annak valószínűsége, hogy a részvény 100 alatt zár, $N(-0{,}06/0{,}2) = N(-0{,}3) \approx 38\%$, noha a várható hozam pozitív. $S_T$ 95%-os tartománya $100\,e^{0{,}06 \pm 1{,}96 \cdot 0{,}2}$, nagyjából 71,7 és 157,1 között, ami nem szimmetrikus a medián körül.

### Kidolgozott példa: Várható érték, medián és 95%-os tartomány két évre

1. Legyen $S_0 = 50$, $\mu = 10\%$, $\sigma = 30\%$ és $T = 2$. A várható érték $\mu$ ütemben nő:
   $$S_0\,e^{\mu T} = 50\,e^{0{,}2}$$ → **61.07**
2. A loghozam várható értéke $(\mu - \tfrac12\sigma^2)T = 0{,}11$, szórása $\sigma\sqrt{T} \approx 0{,}4243$. A medián
   $$S_0\,e^{(\mu - \frac12\sigma^2)T} = 50\,e^{0{,}11}$$ → **55.81**
3. A 95%-os tartomány alsó vége:
   $$50\,e^{0{,}11 - 1{,}96 \cdot 0{,}4243}$$ → **24.3**
4. A 95%-os tartomány felső vége, sokkal messzebb a mediántól, mint az alsó:
   $$50\,e^{0{,}11 + 1{,}96 \cdot 0{,}4243}$$ → **128.2**

Az ábra 20 pályát szimulál egy évre $S_0 = 100$-ból, mindegyiket sok kis lognormális lépésből, és felrajzolja az $S_0e^{\mu t}$ várhatóérték-görbét és az $S_0e^{(\mu - \sigma^2/2)t}$ mediángörbét. Növeld $\sigma$-t: a pályák szétterülnek, a medián egyre jobban a várható érték alá kerül, és több pálya végez a kiinduló érték alatt. Az „Új pályák” gombbal új mintát húzhatsz.

*[Interaktív ábra: gbm paths](https://quantsandbox.dev/hu/guide/derivatives/gbm)*

## Kapcsolat a binomiális fával

Egy $u = e^{\sigma\sqrt{\Delta t}}$, $d = 1/u$ paraméterű CRR-fában minden lépés $\pm\sigma\sqrt{\Delta t}$-t ad a logaritmikus árhoz. Ez a „Véletlen bolyongás és Brown-mozgás” lecke skálázott pénzfeldobásos bolyongása. A lépésszám növelésével a logaritmikus ár egy $\sigma$ volatilitású, driftes Brown-mozgáshoz tart, a lejáratkori részvényár pedig lognormálissá válik. A GBM az a modell, amelyet a fák közelítenek; ezért konvergálnak a fás árak $n$ növelésével.

## A kockázatsemleges változat

A „Kockázatsemleges valószínűségek” lecke megmutatta, hogy árazáshoz azt a $\mathbb{Q}$ mértéket használjuk, amely alatt a részvény a kockázatmentes kamatlábat hozza. GBM-ben ez azt jelenti, hogy $\mu$ helyére $r$ kerül, $W$ helyére pedig egy $\mathbb{Q}$ alatti $W^{\mathbb{Q}}$ Brown-mozgás:

$$
dS_t = r S_t\,dt + \sigma S_t\,dW_t^{\mathbb{Q}}, \qquad S_T = S_0 \exp\!\left( \left(r - \tfrac{1}{2}\sigma^2\right) T + \sigma W_T^{\mathbb{Q}} \right).
$$

A $\sigma$ volatilitás nem változik, csak a drift. Ekkor $\mathbb{E}^{\mathbb{Q}}[S_T] = S_0 e^{rT}$, a diszkontált $e^{-rt}S_t$ ár pedig martingál $\mathbb{Q}$ alatt, pontosan úgy, mint az egylépéses fában. A valódi $\mu$ drift kiesik az opcióárakból, ahogy a valódi $p$ valószínűség is kiesett.

## Összefoglalás

- A GBM a hozamokat modellezi: $dS_t = \mu S_t\,dt + \sigma S_t\,dW_t$, állandó $\mu$ drifttel és $\sigma$ volatilitással.
- Megoldása $S_T = S_0\exp((\mu - \tfrac{1}{2}\sigma^2)T + \sigma W_T)$: lognormális és mindig pozitív.
- A $-\tfrac{1}{2}\sigma^2$ tag miatt a várható érték $S_0e^{\mu T}$; az $S_0e^{(\mu - \sigma^2/2)T}$ medián ennél kisebb.
- Árazáshoz $\mu$ helyére $r$ kerül; a volatilitás változatlan.

> $\mathbb{Q}$ alatt $\ln S_T \sim N\big(\ln S_0 + (r - \tfrac{1}{2}\sigma^2)T,\; \sigma^2 T\big)$. A következő lecke a call kifizetését erre az eloszlásra integrálja, és így kapja meg a Black–Scholes-képletet.

[Szimulálj árpályákat és eloszlásukat a Geometriai Brown-mozgás laborban](https://quantsandbox.dev/hu/gbm)

## Interaktív laborok

- [Geometriai Brown-mozgás (GBM) szimulátor](https://quantsandbox.dev/hu/gbm)
- [Monte Carlo-opcióárazó szimulátor](https://quantsandbox.dev/hu/monte-carlo)

## Gyakorló kérdések

### 1. Geometriai Brown-mozgás esetén milyen eloszlású $\ln S_T$?

- a) Normális
- b) Lognormális
- c) Egyenletes
- d) Exponenciális

**Válasz:** a) Normális

$\ln S_T = \ln S_0 + (\mu - \tfrac12\sigma^2)T + \sigma W_T$ egy konstans és egy normális változó összege, tehát normális. Maga $S_T$ a lognormális.

### 2. Egy részvény GBM-et követ, $S_0 = 100$, $\mu = 8\%$, $\sigma = 20\%$. Mennyi $S_T$ mediánja $T = 1$-nél?

**Válasz:** 106.18

A medián $S_0e^{(\mu - \frac12\sigma^2)T} = 100\,e^{0{,}08 - 0{,}02} = 100\,e^{0{,}06} \approx 106{,}18$, a $100\,e^{0{,}08} \approx 108{,}33$ várható érték alatt.

---

Forrás: https://quantsandbox.dev/hu/guide/derivatives/gbm

Előző lecke: [Delta és fedezés](https://quantsandbox.dev/hu/guide/derivatives/delta-hedging)

Következő lecke: [A Black–Scholes-képlet](https://quantsandbox.dev/hu/guide/derivatives/toward-black-scholes)
