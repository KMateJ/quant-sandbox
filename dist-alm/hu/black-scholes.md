# Black–Scholes-kalkulátor és opciós görögök

Árazz európai call és put opciót a Black–Scholes-képlettel, és nézd a deltát, gammát, vegát és thétát a részvényár és a lejárat függvényében, 2D-ben és 3D-ben.

## Az eszközről

A Black–Scholes-képlet egy európai call vagy put árát adja meg a részvényárból, a kötési árból, a futamidőből, a kamatlábból és a volatilitásból. Ez a vizualizáció az árat és a görögöket — delta, gamma, vega, théta — ábrázolja különböző részvényárakon és futamidőkön, 2D görbéken és 3D felületen, így látszik, hogyan változnak az érzékenységek, ahogy az opció pénzbe kerül vagy kiesik onnan.

## Gyakori kérdések

### Mit mérnek az opciós görögök?

A delta az árváltozás a részvény egységnyi elmozdulására, a gamma a delta változási sebessége, a vega a volatilitásra való érzékenység, a théta pedig az idő múlásával elvesztett érték, minden mást változatlanul hagyva.

### Miért a kötési ár közelében legnagyobb a gamma?

Lejárat közelében egy at-the-money opció vagy értéktelenné, vagy részvényszerű kifizetéssé válik, ezért ott leng ki leggyorsabban a delta. Mélyen pénzben vagy pénzen kívül a delta már 1 vagy 0 közelében van, és alig mozdul.

## Az elmélet

- [A Black–Scholes-képlet](https://quantsandbox.dev/hu/guide/derivatives/toward-black-scholes): A képlet levezetésének logikája, d₁ és d₂ jelentése, és mit hagy figyelmen kívül a modell.
- [Delta és fedezés](https://quantsandbox.dev/hu/guide/derivatives/delta-hedging): A delta mint érzékenység és mint fedezeti arány; gamma és az újrasúlyozás hibája.
- [Put–call paritás](https://quantsandbox.dev/hu/guide/derivatives/put-call-parity): Két portfólió azonos kifizetéssel: modellfüggetlen kapcsolat a call és a put ára között.
- [Kolmogorov-egyenletek és a Feynman–Kac-formula](https://quantsandbox.dev/hu/guide/stochastic/feynman-kac): A diffúzió generátora, a visszafelé egyenlet, és hogyan lesz egy várható érték egy PDE megoldása.
- [Többlépéses fák és visszafelé indukció](https://quantsandbox.dev/hu/guide/derivatives/multi-step-trees): Rekombináló fa, CRR-paraméterezés, csomópontonkénti árazás és konvergencia a Black–Scholes-árhoz.
- [A görögök: gamma, vega, théta és rhó](https://quantsandbox.dev/hu/guide/derivatives/greeks): Hogyan reagál az opció értéke a részvényárra, a volatilitásra, az időre és a kamatra; a gamma és a théta mint a fedezés két oldala.
- [Opciók osztalékos részvényre, indexre, devizára és határidős ügyletre](https://quantsandbox.dev/hu/guide/derivatives/options-on-other-underlyings): Black–Scholes folytonos hozammal, a forward ár mint közös szál, Black-76 határidős ügyletekre és Garman–Kohlhagen devizára.
- [Implikált volatilitás és a volatilitás-mosoly](https://quantsandbox.dev/hu/guide/derivatives/implied-volatility): A Black–Scholes-képlet megfordítása σ-ra, a vega, és amit a mosoly és a lejárati szerkezet elárul a modellről.
- [Statikus replikáció: Breeden–Litzenberger és Carr–Madan](https://quantsandbox.dev/hu/guide/derivatives/static-replication): Kockázatsemleges sűrűség a call árakból, és tetszőleges kifizetés felépítése kötvényből, forwardból és opciókból.

Az interaktív eszköz megnyitása: https://quantsandbox.dev/hu/black-scholes
