# Arbitrázs és a határidős ár

Az egy ár törvénye, a cash-and-carry stratégia és a fair határidős ár.

Ez a lecke a határidős ügylet szállítási árát határozza meg anélkül, hogy bármilyen modellt feltételeznénk a jövőbeli részvényárra. Az érvelés egyetlen feltevésre épül, hogy a piacon nincs arbitrázs, valamint a „Kamat, kamatozás és diszkontálás” lecke diszkontfaktorára. Magát a határidős ügyletet a „Határidős ügyletek, call és put opciók” lecke definiálta.

## Piaci feltevések

Idealizált piacon dolgozunk. Bárki vehet fel hitelt és helyezhet el pénzt ugyanazon az $r$ kockázatmentes (folytonos) kamatlábon. A részvény tetszőleges mennyiségben vehető és shortolható; a **shortolás** azt jelenti, hogy kölcsönveszünk egy részvényt, ma eladjuk, később visszavásároljuk és visszaadjuk. Nincsenek tranzakciós költségek, adók és osztalék, és a szerződő felek teljesítik a vállalásaikat.

## Arbitrázs

Az **arbitrázs** olyan kereskedési stratégia, amelynek felépítése semmibe sem kerül, soha nem veszít pénzt, és legalább néhány kimenetelben pozitív nyereséget hoz. Ezzel egyenértékű: olyan stratégia, amely ma pénzt hoz, és később soha nem kell fizetni miatta.

Gondolj két boltra, amelyek ugyanazt a terméket különböző áron árulják: az olcsóban veszel, a drágában eladod, és a nyereség biztos. Likvid piacon a kereskedők az ilyen réseket azonnal kihasználják, a vételeik és eladásaik pedig addig mozdítják az árakat, amíg a rés be nem zárul. Az árazáselmélet ezért feltételezi, hogy arbitrázslehetőség nincs.

## Az egy ár törvénye

A leghasznosabb következmény az **egy ár törvénye**: ha két portfólió $T$-ben minden lehetséges állapotban ugyanannyit fizet, akkor ma is ugyanannyiba kell kerülniük. Különben megvennénk az olcsóbbat és eladnánk a drágábbat: a kifizetések $T$-ben kioltják egymást, az árkülönbség pedig ma kockázatmentes nyereségként nálunk marad.

> Az arbitrázsmentességből következik az egy ár törvénye: a $T$-ben azonos kifizetésű portfóliók ára ma is azonos. A replikáláson alapuló árazás újra és újra ezt a szabályt alkalmazza.

## A cash-and-carry érvelés

A határidős ügylet arra kötelezi a long felet, hogy $T$-ben $K$ szállítási áron megvegye a részvényt. A részvényhez $T$-ben másként is hozzájuthatunk: felveszünk $S_0$ hitelt, ma megvesszük a részvényt, és megtartjuk. Hasonlítsuk össze a két pozíciót:

- **A portfólió:** long határidős ügylet $K$ szállítási árral. Mai költség 0. $T$-ben: fizetünk $K$-t, megkapjuk a részvényt.
- **B portfólió:** veszünk egy részvényt $S_0$-ért, $S_0$ hitelből finanszírozva. Mai költség 0. $T$-ben: nálunk a részvény, a hitelt kamatostul, $S_0e^{rT}$ összegben visszafizetjük.

Mindkét portfólió ingyenes, és mindkettő egy részvénnyel zárul $T$-ben. Egyetlen különbség a $T$-ben fizetett pénz: A-ban $K$, B-ben $S_0e^{rT}$. Az egy ár törvénye miatt ennek a két összegnek egyenlőnek kell lennie. A **határidős ár** $F_0$ az a szállítási ár, amely mellett egy új határidős ügylet semmibe sem kerül:

$$
F_0 = S_0\,e^{rT}.
$$

A határidős ár tehát a mai részvényár a kockázatmentes kamattal előrevetítve. Érdemes megnézni, mi hiányzik belőle: a részvény várható hozama, a volatilitása és bárki véleménye $S_T$-ről. A részvényt eltérően megítélő befektetőknek is ugyanabban az $F_0$-ban kell megegyezniük.

## Ha a jegyzett határidős ár eltér

Tegyük fel, hogy egy árjegyző $S_0e^{rT}$-től eltérő $F^{\text{q}}$ szállítási árat jegyez.

**Túl magas jegyzés**, $F^{\text{q}} > S_0e^{rT}$: **cash-and-carry** ügylet. Felveszünk $S_0$ hitelt, megvesszük a részvényt, és eladunk egy határidős ügyletet $F^{\text{q}}$ áron. $T$-ben leszállítjuk a részvényt, megkapjuk $F^{\text{q}}$-t, és visszafizetünk $S_0e^{rT}$-t. A nyereség

$$
F^{\text{q}} - S_0\,e^{rT} > 0,
$$

bármi lett is $S_T$: a részvényláb és a határidős láb pontosan kioltja egymást.

**Túl alacsony jegyzés**, $F^{\text{q}} < S_0e^{rT}$: **fordított cash-and-carry**. Shortoljuk a részvényt, a kapott $S_0$-t elhelyezzük $r$ kamaton, és veszünk egy határidős ügyletet $F^{\text{q}}$ áron. $T$-ben a befektetés $S_0e^{rT}$-re nőtt; $F^{\text{q}}$-t fizetünk a részvényért, és visszaadjuk a kölcsönadónak. A nyereség $S_0e^{rT} - F^{\text{q}} > 0$.

Példa: $S_0 = 100$, $r = 5\%$, $T = 1$. A fair határidős ár $100\,e^{0{,}05} \approx 105{,}13$. Ha a jegyzés 108, a cash-and-carry lejáratkor $108 - 105{,}13 = 2{,}87$ nyereséget rögzít. Ha a jegyzés 103, a fordított ügylet $105{,}13 - 103 = 2{,}13$-at.

### Kidolgozott példa: Cash-and-carry egy 52-es jegyzéssel szemben

1. $S_0 = 50$, $r = 4\%$ és $T = 0{,}5$ mellett a részvény megvételéhez felvett hitel ennyire nő:
   $$S_0\,e^{rT} = 50\,e^{0{,}02}$$ → **51.01**
2. Az 52-es jegyzés ennél magasabb, ezért felveszel 50 hitelt, megveszed a részvényt, és eladod a határidős ügyletet 52-n. $T$-ben leszállítod a részvényt, megkapod az 52-t, és visszafizeted a hitelt.
   $$F^{\text{q}} - S_0\,e^{rT} = 52 - 51{,}01$$ → **0.99**
3. Ugyanez a nyereség mai pénzben a különbség visszadiszkontálva.
   $$(52 - 51{,}01)\,e^{-0{,}02}$$ → **0.97**

Az ábra $S_0 = 100$-zal számol. Állítsd be $r$-t és $T$-t, majd told el a jegyzett határidős árat a fair értéktől. A kijelzők megnevezik a rést kihasználó stratégiát. A grafikon $S_T$ függvényében mutatja a részvény-plusz-hitel láb, a határidős láb és az összegük kifizetését. A két láb egymás tükörképe, így az összeg vízszintes: a nyereség nem függ $S_T$-től. Nullára csökken, amikor a jegyzés éppen $S_0e^{rT}$.

*[Interaktív ábra: forward arbitrage](https://quantsandbox.dev/hu/guide/derivatives/no-arbitrage)*

## Határidős ár és a határidős szerződés értéke

Két mennyiséget könnyű összekeverni. A **határidős ár** $F_t$ az a szállítási ár, amely mellett egy $t$-ben kötött *új* határidős ügylet értéke nulla; a fenti érvelés szerint $F_t = S_te^{r(T-t)}$. Egy rögzített $K$ szállítási árú, *már meglévő* határidős ügylet **értéke** viszont a részvénnyel együtt mozog.

Az értékét $t$-ben ugyanazzal a replikálással kapjuk. A long határidős ügylet $T$-ben $S_T$ értékű részvényt ad $K$-ért cserébe. Ugyanezt fizeti, ha ma tartunk egy részvényt, és $T$-ben $K$-val tartozunk; a $T$-beli $K$ tartozás mai értéke $-Ke^{-r(T-t)}$. Tehát

$$
f_t = S_t - K\,e^{-r(T-t)}.
$$

Megkötéskor $K = F_0 = S_0e^{rT}$ és $f_0 = 0$, ahogy kell. Példa: egy egyéves határidős ügyletet $K = 105{,}13$ áron kötöttünk. Fél év múlva a részvény 110-en áll, így

$$
f_{0{,}5} = 110 - 105{,}13\,e^{-0{,}05\cdot 0{,}5} \approx 110 - 102{,}53 = 7{,}47.
$$

A long fél szerződése 7,47-et ér, noha az új, féléves határidős ügyleteket már $110\,e^{0{,}025} \approx 112{,}78$ áron kötik, nem 105,13-on.

## Összefoglalás

- Az arbitrázs ingyenes, soha nem veszít, és néha nyer; az árazáselmélet feltételezi, hogy nincs ilyen.
- Az arbitrázsmentességből következik az egy ár törvénye: $T$-ben azonos kifizetés, ma azonos ár.
- A határidős ügylet részvénnyel és hitellel replikálva $F_0 = S_0e^{rT}$-t ad, függetlenül attól, mit gondolunk $S_T$-ről.
- Az $F_0$ feletti jegyzést cash-and-carry, az alattit fordított cash-and-carry használja ki; a rögzített nyereség nem függ $S_T$-től.
- Egy meglévő, $K$ szállítási árú határidős ügylet értéke $f_t = S_t - Ke^{-r(T-t)}$.

> A „Put–call paritás” lecke ugyanezt a replikációs érvelést alkalmazza opciókra: a callt és a putot egy határidős ügylettel veti össze, és nincs szükség modellre a részvényárra.

[Hasonlítsd össze a határidős és opciós kifizetéseket a Kifizetés laborban](https://quantsandbox.dev/hu/payoff)

## Interaktív laborok

- [Opciós kifizetési diagram és stratégiaépítő](https://quantsandbox.dev/hu/payoff)

## Gyakorló kérdések

### 1. Egy részvény ára $S_0 = 50$, a folytonos kamatláb $r = 4\%$, a határidős ügylet $T = 0{,}5$ év múlva jár le. Mennyi a határidős ár?

**Válasz:** 51.01

$F_0 = S_0e^{rT} = 50\,e^{0{,}02} \approx 51{,}01$. Sem a részvény várható hozama, sem a volatilitása nem szerepel benne.

### 2. Egy árjegyző $S_0e^{rT}$ fölötti határidős árat jegyez. Melyik ügylet rögzít kockázatmentes nyereséget?

- a) Megveszed a határidős ügyletet és shortolod a részvényt
- b) Eladod a határidős ügyletet, hitelt veszel fel és megveszed a részvényt
- c) Megveszed a határidős ügyletet és a részvényt is
- d) Egyik sem: a jegyzés $S_T$ előrejelzése

**Válasz:** b) Eladod a határidős ügyletet, hitelt veszel fel és megveszed a részvényt

A határidős ügylet drága, ezért eladod, a long oldalt pedig olcsón replikálod: felveszel $S_0$ hitelt és megveszed a részvényt. $T$-ben a nyereség $F^{\text{q}} - S_0e^{rT}$, bármi is $S_T$.

---

Forrás: https://quantsandbox.dev/hu/guide/derivatives/no-arbitrage

Előző lecke: [Pozíciók kombinálása](https://quantsandbox.dev/hu/guide/derivatives/strategies)

Következő lecke: [Put–call paritás](https://quantsandbox.dev/hu/guide/derivatives/put-call-parity)
