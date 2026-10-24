# Pozíciók kombinálása

A kifizetések összeadódnak: spreadek, straddle, strangle, butterfly és szintetikus forward.

Ez a lecke a „Határidős ügyletek, call és put opciók” lecke szerződéseiből portfóliókat épít. Egyetlen új tényre van szükség: a kifizetések összeadódnak, minden más ebből következik. A keret változatlan: osztalékot nem fizető részvényre szóló európai opciók, amelyek mind ugyanabban a $T$ időpontban járnak le.

## A kifizetések összeadódnak

A **portfólió** egyszerre tartott pozíciók listája. Tegyük fel, hogy $n_1$ darabot tart egy $X_1 = f_1(S_T)$ kifizetésű szerződésből, $n_2$ darabot egy $X_2 = f_2(S_T)$ kifizetésűből, és így tovább. A pozitív $n_i$ long, a negatív short pozíciót jelent. Lejáratkor minden szerződés a többitől függetlenül fizet, így a portfólió kifizetése

$$
X = n_1 f_1(S_T) + n_2 f_2(S_T) + \dots + n_k f_k(S_T).
$$

Grafikusan: minden láb kifizetését felrajzoljuk $S_T$ függvényében, és a vonalakat függőlegesen összeadjuk. Minden call és put kifizetése két, a kötési árban összekapcsolódó egyenes szakaszból áll, ezért az összegük is egyenes szakaszokból áll, és a portfólióban szereplő minden kötési árnál törése lehet.

Az opciókon és magán a részvényen (kifizetése $S_T$) kívül egy **zérókuponos kötvényt** is használunk, amely $T$-ben 1-et fizet. Kifizetése a konstans 1, mai ára az $e^{-rT}$ diszkontfaktor. $K$ darab kötvény biztosan $K$-t fizet.

## A portfólió kifizetése és nyeresége

A lecke ábrája csak kifizetéseket mutat. A nyereséghez le kell vonni a portfólió felépítésének költségét. Ha a lábak ma összesen $V_0$-ba kerülnek (kifizetett díjak mínusz kapott díjak), akkor a lejáratkori nyereség

$$
\text{nyereség} = X - V_0\,e^{rT}.
$$

A nagy kifizetésű portfólió nem feltétlenül jó üzlet: egy jól működő piacon a nagyobb kifizetés ma többe kerül. Az alábbi példák kerekített díjakkal számolnak, és elhagyják a kis $e^{rT}$ szorzót.

## Spreadek

A **bull call spread** vesz egy alacsony $K_1$ kötési árú callt, és elad egy magasabb $K_2$ kötési árú callt:

$$
X = (S_T - K_1)^+ - (S_T - K_2)^+ = \begin{cases} 0, & S_T \le K_1,\\ S_T - K_1, & K_1 < S_T < K_2,\\ K_2 - K_1, & S_T \ge K_2. \end{cases}
$$

Az eladott call lemond a $K_2$ fölötti nyereségről, cserébe a díja csökkenti a költséget. Példa $K_1 = 95$ és $K_2 = 105$ mellett: ha a 95-ös call 8-ba, a 105-ös 3-ba kerül, a spread ára 5. A kifizetés legfeljebb 10, így a nyereség $-5$ és $+5$ között mozog, a fedezeti pont pedig $S_T = 100$.

A **bear put spread** ennek tükörképe: veszünk egy magasabb, $K_2$ kötési árú putot, és eladunk egy alacsonyabb, $K_1$ kötési árút. Ha a részvény $K_1$ alatt zár, $K_2 - K_1$-et fizet, $K_2$ fölött semmit.

## Straddle és strangle

A **straddle** egy callt és egy putot vesz ugyanazzal a $K$ kötési árral:

$$
X = (S_T - K)^+ + (K - S_T)^+ = |S_T - K|.
$$

A kifizetés V alakú, csúcsa $K$-ban van: a pozíció bármely irányú nagy elmozdulásból profitál, tehát a mozgásra fogad, nem az irányra. $K = 100$, 6-os call és 4-es put mellett a straddle 10-be kerül, így csak akkor nyereséges, ha $S_T < 90$ vagy $S_T > 110$.

A **strangle** egy $K_1$ kötési árú putot és egy magasabb, $K_2$ kötési árú callt vesz. A kifizetés a két kötési ár között nulla, azokon kívül lineárisan nő. Olcsóbb a straddle-nél, mert nagyobb elmozdulás kell ahhoz, hogy bármit fizessen.

## Butterfly

Egy egyenlő közű $K_1 < K_2 < K_3$ kötési árakkal felépített **butterfly** vesz egy $K_1$-es callt, elad két $K_2$-es callt, és vesz egy $K_3$-as callt:

$$
X = (S_T - K_1)^+ - 2\,(S_T - K_2)^+ + (S_T - K_3)^+.
$$

Nézzük szakaszonként a meredekséget. $K_1$ alatt egyik opció sem fizet. $K_1$ és $K_2$ között csak az első call fizet, a meredekség $+1$. $K_2$ és $K_3$ között a meredekség $1 - 2 = -1$. $K_3$ fölött $1 - 2 + 1 = 0$, és a kifizetés visszatér nullára. Az eredmény egy sátor, amelynek csúcsa $K_2$-ben van, magassága $K_2 - K_1$. A 90, 100, 110 kötési áraknál a csúcs 10 az $S_T = 100$ pontban, $S_T = 95$-nél pedig a kifizetés 5.

A butterfly csak akkor fizet, ha a részvény a középső kötési ár közelében zár, vagyis arra fogad, hogy az ár nem mozdul el sokat: a straddle ellentéte.

### Kidolgozott példa: A 90/100/110-es butterfly

1. $S_T = 95$ mellett csak a 90-es call fizet.
   $$(95 - 90)^+ - 2\,(95 - 100)^+ + (95 - 110)^+$$ → **5**
2. $S_T = 100$ mellett a kifizetés eléri a $K_2 - K_1$ csúcsot.
   $$(100 - 90)^+ - 2\,(100 - 100)^+ + (100 - 110)^+$$ → **10**
3. $S_T = 105$ mellett a két eladott call visszahúzza a kifizetést.
   $$15 - 2 \cdot 5 + 0$$ → **5**
4. Tegyük fel, hogy a 90-es, 100-as és 110-es call ára 13, 6,5 és 2,5. A nettó költség
   $$13 - 2 \cdot 6{,}5 + 2{,}5$$ → **2.5**
5. A legjobb nyereség, $S_T = 100$-nál, a csúcs mínusz a költség.
   $$10 - 2{,}5$$ → **7.5**

## A szintetikus határidős ügylet

Vegyünk egy callt és adjunk el egy putot, mindkettőt $K$ kötési árral. Bármely $S_T$ mellett a két opció közül pontosan egy fizet:

$$
(S_T - K)^+ - (K - S_T)^+ = S_T - K.
$$

Ha $S_T > K$, a call $S_T - K$-t fizet, a put értéktelen; ha $S_T < K$, a call értéktelen, az eladott put pedig $-(K - S_T) = S_T - K$-t fizet. Az összeg mindkét esetben egy $K$ szállítási árú long határidős ügylet kifizetése. Ezt nevezzük **szintetikus határidős ügyletnek**; erre épül a „Put–call paritás” lecke.

Az ábra minden láb kifizetését vékony szaggatott vonallal, az összeget vastag vonallal mutatja. Válaszd ki egymás után az előre beállított stratégiákat, és ellenőrizd, hogy a vastag vonal a szaggatottak függőleges összege. A szintetikus határidős ügyletnél a két láb törése kioltja egymást, és az összeg egyetlen egyenes.

*[Interaktív ábra: strategy](https://quantsandbox.dev/hu/guide/derivatives/strategies)*

## Tetszőleges szakaszonként lineáris kifizetés előállítása

A példák általános szabályra utalnak. Vegyünk egy egyenes szakaszokból álló $f(S_T)$ kifizetést, amelynek $K_1 < K_2 < \dots < K_m$ pontokban van törése. Legyen $f(0)$ az értéke nullában, $a_0$ a meredeksége közvetlenül nulla után, $c_i$ pedig a meredekség változása $K_i$-ben (utána mínusz előtte). Ekkor

$$
f(S_T) = f(0) + a_0\,S_T + \sum_{i=1}^{m} c_i\,(S_T - K_i)^+.
$$

Minden tag egy forgalmazott termék: $f(0)$ darab zérókuponos kötvény, $a_0$ darab részvény és $c_i$ darab $K_i$ kötési árú call (a negatív szám short pozíciót jelent). A butterfly az $f(0) = 0$, $a_0 = 0$, $c = (1, -2, 1)$ eset. Putokra elvben nincs szükség, bár gyakran rövidebb receptet adnak.

> Az egyenes szakaszokból álló kifizetés pontosan előállítható kötvényekből, a részvényből és callokból, töréspontonként egy call-pozícióval. A meredekség változásai megadják, hány callt kell tartani az egyes kötési árakon.

## Összefoglalás

- A portfólió kifizetése a lábak kifizetéseinek összege; a vonalak függőleges összeadásával rajzolható meg.
- A nyereség a teljes kifizetés mínusz a lábak $T$-re felkamatolt nettó költsége.
- A spreadek korlátozzák a nyereséget és a veszteséget; a straddle és a strangle nagy elmozdulásért fizet; a butterfly akkor, ha az ár a középső kötési ár közelében marad.
- Egy long call és egy short put azonos kötési árral $S_T - K$-t fizet, mint egy határidős ügylet.
- Bármely szakaszonként lineáris kifizetés felépíthető kötvényekből, a részvényből és callokból.

[Rakj össze többlábú stratégiákat, és nézd meg a kifizetésüket és nyereségüket a Kifizetés laborban](https://quantsandbox.dev/hu/payoff)

## Interaktív laborok

- [Opciós kifizetési diagram és stratégiaépítő](https://quantsandbox.dev/hu/payoff)

## Gyakorló kérdések

### 1. Veszel egy 100/110-es kötési árú bull call spreadet 4 nettó díjért. Legfeljebb mekkora nyereséget hozhat lejáratkor?

**Válasz:** 6

A kifizetés felső korlátja $K_2 - K_1 = 10$, ezt $S_T \ge 110$ mellett éri el. A költséget levonva $10 - 4 = 6$.

### 2. Egy $K$ kötési árú straddle-t lejáratig tartasz. Mennyit fizet, ha a részvény pontosan $S_T = K$-n zár?

- a) Semmit: ez a V alja
- b) A call díját
- c) A két díj összegét
- d) $K$-t

**Válasz:** a) Semmit: ez a V alja

A kifizetés $|S_T - K|$, ami $S_T = K$-nál nulla. Ez a tulajdonos legrosszabb esete: mindkét díjat elveszíti.

---

Forrás: https://quantsandbox.dev/hu/guide/derivatives/strategies

Előző lecke: [Határidős ügyletek, call és put opciók](https://quantsandbox.dev/hu/guide/derivatives/instruments)

Következő lecke: [Arbitrázs és a határidős ár](https://quantsandbox.dev/hu/guide/derivatives/no-arbitrage)
