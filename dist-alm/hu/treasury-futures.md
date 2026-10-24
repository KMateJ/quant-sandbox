# Állampapír-határidős: konverziós faktor, legolcsóbban szállítható kötvény

Fedezd fel az állampapír-határidős ügyleteket: konverziós faktorok, számlázási árak, szállítható pénzáramlások, és a legolcsóbban szállítható kötvény váltása.

## Az eszközről

Az állampapír-határidős ügyleteket egy kosár bármely kötvényének leszállításával lehet teljesíteni. A konverziós faktorok közös alapra hozzák a kötvényeket, a számlázási ár határozza meg, mennyit fizet a vevő, az eladó pedig a legolcsóbban leszállítható (cheapest-to-deliver) kötvényt szállítja. A labor a konverziós faktorokat, számlázási árakat és leszállítható pénzáramlásokat mutatja, és azt, hogyan vált a CTD kötvény a hozamok mozgásával.

## Gyakori kérdések

### Mi a cheapest-to-deliver kötvény?

Az a leszállítható kötvény, amely a határidős eladónak a legolcsóbb: amelynek beszerzési költsége a kapott számlázási összeghez képest a legalacsonyabb, vagyis a legmagasabb az implikált repohozama.

### Miért változik a CTD kötvény a hozamokkal?

A konverziós faktorokat egy rögzített névleges hozamon számítják. Ha a piaci hozamok ettől eltávolodnak, a különböző durációjú kötvények relatív értéke eltolódik, és másik kötvény lesz a legolcsóbb.

### Mi a konverziós faktor az állampapír-határidős ügyletekben?

Az az egységnyi névértékre jutó ár, amelyen a szállítható kötvény akkor forogna, ha a hozama megegyezne a kontraktus névleges kuponjával (a CBOT állampapír-határidős ügyleteinél 6%). A határidős árat ezzel szorozva vesszük figyelembe, hogy a magasabb kuponú vagy hosszabb lejáratú kötvények többet érnek a standard kötvénynél.

### Hogyan számoljuk ki a számlázási árat egy állampapír-határidős szállításnál?

Számlázott összeg = határidős elszámolóár × konverziós faktor × névérték + a szállított kötvény felhalmozott kamata. Az eladó ezt az összeget kapja a kötvényért cserébe, így az a legolcsóbban szállítható kötvény, amelynek piaci ára a számlázott összeghez képest a legalacsonyabb.

## Az elmélet

- [Azonnali kamatok, forward kamatok és a hozamgörbe](https://quantsandbox.dev/hu/guide/fixed-income/yield-curve): Zérókupon-kamatok, bootstrapping a par hozamokból, implicit forward kamatok és a görbe alakja.
- [Duráció és konvexitás](https://quantsandbox.dev/hu/guide/fixed-income/duration-convexity): Macaulay- és módosított duráció, a kamatérzékenység lineáris és másodrendű közelítése.
- [Kötvényfutures és a legolcsóbban szállítható kötvény](https://quantsandbox.dev/hu/guide/fixed-income/treasury-futures): Szállítható kosár, konverziós faktor, számlázási ár, nettó szállítási költség, és miért vált a legolcsóbban szállítható kötvény a hozammal.

Az interaktív eszköz megnyitása: https://quantsandbox.dev/hu/treasury-futures
