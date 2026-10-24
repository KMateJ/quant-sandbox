# Hozamgörbe-bootstrapping, spot és forward kamatlábak

Alakíts par hozamgörbét szinttel, meredekséggel és görbülettel, bootstrappeld a spot görbét, és olvasd le interaktívan a forward kamatlábakat.

## Az eszközről

A hozamgörbe a kamatlábakat mutatja különböző lejáratokra. Ebben az eszközben szint-, meredekség- és görbületfaktorral alakíthatsz egy par hozamgörbét, ebből bootstrappinggel előállíthatod a zérókupon spot görbét, és kiolvashatod a jövőbeli időpontok közötti implikált forward kamatlábakat.

## Gyakori kérdések

### Mit jelent a hozamgörbe bootstrappingje?

A zérókupon (spot) kamatlábak lejáratonkénti kinyerését: minden par kötvény ára meghatározza a következő spot kamatlábat, a korábbi kuponjaihoz már megtalált spot kamatlábak ismeretében.

### Mit jelent az inverz hozamgörbe?

A rövid kamatok a hosszúak felett vannak. A görbe ekkor csökkenő forward kamatlábakat implikál, amit a piac gyakran a jövőbeli kamatok csökkenésére vonatkozó várakozásként olvas.

### Mi a különbség az azonnali (spot) és a határidős (forward) kamatlábak között?

Az azonnali kamatláb egy adott időpontban lejáró elemi (zérókupon) kötvény mai hozama. A határidős kamatláb két jövőbeli időpont közötti hitelezésre ma rögzíthető kamat, amelyet a spot görbe határoz meg: (1 + s₂)² = (1 + s₁)(1 + f₁,₂). Ha az egyéves spot kamatláb 3%, a kétéves 4%, akkor az egy év múlva induló egyéves kamatláb körülbelül 5,0%.

### Mit jelent a hozamgörbe szintje, meredeksége és görbülete?

Ez a görbe három jellemző mozgása. A szint az összes kamatlábat együtt tolja fel vagy le, a meredekség a hosszú és rövid kamatok különbségét változtatja (meredekedés vagy laposodás), a görbület pedig a középső lejáratokat hajlítja el a két véghez képest. Együtt az állampapír-hozamgörbék napi mozgásának nagy részét megmagyarázzák.

## Az elmélet

- [Azonnali kamatok, forward kamatok és a hozamgörbe](https://quantsandbox.dev/hu/guide/fixed-income/yield-curve): Zérókupon-kamatok, bootstrapping a par hozamokból, implicit forward kamatok és a görbe alakja.
- [Kötvényárak és hozamok](https://quantsandbox.dev/hu/guide/fixed-income/bond-pricing): Kötvény mint pénzáramlások sora, lejáratig számított hozam, par, prémium és diszkont.
- [Átlaghoz visszahúzó folyamatok: Ornstein–Uhlenbeck és Vasicek](https://quantsandbox.dev/hu/guide/stochastic/mean-reversion): Hosszú távú szinthez húzott folyamat, egzakt megoldása és stacionárius eloszlása, valamint a rövid kamat a Vasicek-modellben.
- [Nem párhuzamos hozamgörbe-mozgások és kulcskamat-durációk](https://quantsandbox.dev/hu/guide/fixed-income/curve-risk): Párhuzamos eltolás, meredekedés és pillangó; a kulcskamat-durációk mint a kötvény érzékenysége a görbe egyes szakaszaira.
- [Kamatswapok](https://quantsandbox.dev/hu/guide/fixed-income/interest-rate-swaps): Fix és változó láb, a swap mint két kötvény, a par swapráta a diszkontfaktorokból, egy meglévő swap értéke és a DV01.
- [Hitelkockázat: csődvalószínűség és hitelfelár](https://quantsandbox.dev/hu/guide/fixed-income/credit-risk): Csődintenzitás, túlélési valószínűség, megtérülési ráta, kockázatos kötvények árazása és a CDS-felár.

Az interaktív eszköz megnyitása: https://quantsandbox.dev/hu/yield-curve
