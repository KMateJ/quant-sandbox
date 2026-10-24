# Kamat, kamatozás és diszkontálás

Egyszerű, kamatos és folytonos kamatozás; jelenérték és diszkontfaktor.

A pénzügyi árazási képletek szinte mindegyike különböző időpontokban esedékes pénzösszegeket hasonlít össze. Mielőtt opciókról, portfóliókról vagy kötvényekről beszélnénk, egyetlen eszközre van szükségünk: arra, hogyan visszük egy pénzösszeg értékét előre vagy hátra az időben. Ez a lecke ezt az eszközt építi fel.

## A pénz időértéke

Ha ma van 100 egységed, beteheted bankba (vagy vehetsz állampapírt), és egy év múlva lényegében kockázat nélkül több mint 100 lesz belőle. Ezért a ma kapott 100 többet ér, mint az egy év múlva ígért 100. A várakozásért kapott többlet a **kamat**, az évre vetített mértéke pedig a **kamatláb**, $r$.

A leckékben $r$ mindig a **kockázatmentes** kamatlábat jelenti: olyan hitel kamatát, amelynek visszafizetése biztos. A kockázatos hitelezés többet hoz, de ez a többlet a kockázatért jár, nem az időért.

## Egyszerű kamatozás

Egyszerű kamatozásnál csak az eredeti összeg után jár $r$ kamat. $T$ év alatt a kezdeti $B_0$ összeg erre nő:

$$
B_T = B_0\,(1 + rT).
$$

A növekedés az időben lineáris. Egyes rövid lejáratú pénzpiaci termékeket így jegyeznek, de ez a módszer figyelmen kívül hagyja, hogy a már megkapott kamat is kamatozhatna.

## Kamatos kamat

Éves kamatozásnál az első év kamatát hozzáírják az egyenleghez, így a második évben már a nagyobb összeg után kapsz kamatot. $T$ egész év után:

$$
B_T = B_0\,(1 + r)^T.
$$

Ha évente $m$-szer írják jóvá a kamatot, minden periódus $r/m$-et fizet, és összesen $mT$ periódus van:

$$
B_T = B_0\left(1 + \frac{r}{m}\right)^{mT}.
$$

Jó kép erre egy hógolyó: minél nagyobb, annál több havat szed fel fordulatonként. A gyakoribb kamatjóváírás kicsit nagyobb növekedést ad, mert a kamat hamarabb kezd maga is kamatozni.

## Folytonos kamatozás

Növeljük a kamatperiódusok $m$ számát minden határon túl. A fenti kifejezés egy exponenciálishoz tart:

$$
\lim_{m\to\infty}\left(1 + \frac{r}{m}\right)^{mT} = e^{rT}, \qquad B_T = B_0\,e^{rT}.
$$

Az opcióárazásban (Black–Scholes, sok kis lépésből álló binomiális fa) a folytonos kamatozás a szokásos konvenció, mert az exponenciálisokat könnyű szorozni és deriválni: $T_1$ ideig, majd $T_2$ ideig növekedni ugyanaz, mint $T_1 + T_2$ ideig, hiszen $e^{rT_1}e^{rT_2} = e^{r(T_1+T_2)}$.

Az ábra ugyanazon kamatláb mellett hasonlítja össze a három konvenciót. Alacsony kamatnál és rövid távon szinte egybeesnek; a különbség $r$ és $T$ növekedésével nyílik ki.

*[Interaktív ábra: compounding](https://quantsandbox.dev/hu/guide/corporate/interest-discounting)*

## Diszkontálás

A diszkontálás a kamatozás visszafelé. Ha egy $C$ kifizetés a $T$ időpontban érkezik, a **jelenértéke** az az összeg, amelyet ma be kellene fektetni ahhoz, hogy $T$-ben pontosan $C$ legyen belőle:

$$
\text{PV} = C\,e^{-rT} \quad\text{(folytonos)}, \qquad \text{PV} = \frac{C}{(1+r)^T} \quad\text{(éves)}.
$$

Az $e^{-rT}$ szorzó neve **diszkontfaktor**. Pozitív kamatnál mindig 0 és 1 közé esik, és annál kisebb, minél távolabbi a kifizetés.

Példa: $r = 5\%$ folytonos kamat mellett a két év múlva fizetett 100 mai értéke $100\,e^{-0{,}1} \approx 90{,}48$. Ha ma 90,48-at befektetünk 5%-on két évre, pontosan 100-at kapunk vissza.

## Átváltás a konvenciók között

Ugyanazt a növekedést különböző konvenciókban is meg lehet adni. Egy folytonos $r_c$ és egy éves $r_a$ kamatláb akkor írja le ugyanazt a növekedést, ha

$$
e^{r_c} = 1 + r_a \quad\Longleftrightarrow\quad r_c = \ln(1 + r_a).
$$

Az 5%-os folytonos kamat tehát nagyjából 5,13%-os éves kamatnak felel meg. Kamatlábak összehasonlításakor mindig nézd meg, melyik konvenció szerint értendők.

Ugyanígy váltható át egy évente $m$-szer tőkésített kamatláb az **effektív éves kamatlábra**, vagyis arra az évente tőkésített rátára, amely ugyanakkora növekedést ad: $r_{\text{eff}} = (1 + r/m)^m - 1$.

### Kidolgozott példa: Havi tőkésítésű kamatlábtól az ötéves diszkontfaktorig

1. Egy megtakarítási számla évi 6%-ot jegyez, havi tőkésítéssel. Egy év növekedése tizenkét hónap, egyenként 0,5%-kal; 1-et levonva kapjuk az effektív éves kamatlábat.
   $$r_{\text{eff}} = \left(1 + \tfrac{0{,}06}{12}\right)^{12} - 1$$ → **6.17%**
2. Öt évre diszkontálni annyi, mint elosztani öt év ilyen növekedésével, vagyis 60 havi periódussal.
   $$\left(1 + \tfrac{0{,}06}{12}\right)^{-60} = (1 + r_{\text{eff}})^{-5}$$ → **0.7414**

## Összefoglalás

- A mai pénz többet ér, mint ugyanannyi később, mert kockázatmentesen kamatozhat $r$-rel.
- A kamatozás előre viszi a pénzt: $B_T = B_0(1+r)^T$, folytonos időben $B_0e^{rT}$.
- A diszkontálás visszahozza: $\text{PV} = Ce^{-rT}$. Az $e^{-rT}$ a diszkontfaktor.

> Minden további lecke használja az $e^{-rT}$ diszkontfaktort. Valahányszor egy képlet egy jövőbeli kifizetést a mai árral vet össze, ez a szorzó hozza őket közös nevezőre.

[Számolj jelen- és jövőértéket a Pénz időértéke laborban](https://quantsandbox.dev/hu/tvm)

## Interaktív laborok

- [A pénz időértéke és kamatoskamat-kalkulátor](https://quantsandbox.dev/hu/tvm)

## Gyakorló kérdések

### 1. 100-at fektetsz be 5 évre, 6%-os jegyzett kamatláb mellett. Melyik konvencióval lesz több pénzed a végén?

- a) Éves kamatozással
- b) Folytonos kamatozással
- c) Mindkettő ugyanannyit ad
- d) A kezdőösszegtől függ

**Válasz:** b) Folytonos kamatozással

Folytonos kamatozásnál a kamat késedelem nélkül kezd kamatozni: $100\,e^{0{,}3} \approx 134{,}99$, szemben az éves kamatozás $100 \times 1{,}06^5 \approx 133{,}82$-ével.

### 2. Egy 1000-es kifizetés 5 év múlva érkezik. Évi 6%-os, évente tőkésített kamatláb mellett mennyit ér ma?

**Válasz:** 747.26

$\text{PV} = 1000/1{,}06^5 = 1000/1{,}3382 \approx 747{,}26$.

---

Forrás: https://quantsandbox.dev/hu/guide/corporate/interest-discounting

Következő lecke: [Annuitások, örökjáradékok és hiteltörlesztés](https://quantsandbox.dev/hu/guide/corporate/annuities)
