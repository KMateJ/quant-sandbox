# Delta-fedezési szimulátor opciókhoz

Szimuláld egy call opció diszkrét delta-fedezését: a replikáló portfólió szimulált árfolyampályán követi az opció értékét, a visszamaradó fedezési hibával.

## Az eszközről

A delta-fedezés úgy replikál egy opciót, hogy delta darab részvényt és egy készpénzpozíciót tartunk, és az ár mozgásával újrasúlyozunk. A szimulátor egy call opciót követ egy szimulált részvénypályán, összeveti a fedező portfóliót az opció értékével, és megmutatja a fedezési hibát, amely akkor marad, ha csak diszkrét időpontokban tudunk újrasúlyozni.

## Gyakori kérdések

### Miért nem tökéletes a delta-fedezés?

A delta folyamatosan változik, a valódi fedezést viszont csak diszkrét időpontokban igazítjuk. Két újrasúlyozás között az opció görbülete (gamma) olyan nyereséget vagy veszteséget okoz, amelyet a lineáris részvénypozíció nem tud követni.

### Mi történik, ha gyakrabban súlyozok újra?

A fedezési hiba csökken. A Black–Scholes-modellben folytonos újrasúlyozással eltűnne — pontosan ez az érvelés adja a Black–Scholes-árat.

## Az elmélet

- [Delta és fedezés](https://quantsandbox.dev/hu/guide/derivatives/delta-hedging): A delta mint érzékenység és mint fedezeti arány; gamma és az újrasúlyozás hibája.
- [Többlépéses fák és visszafelé indukció](https://quantsandbox.dev/hu/guide/derivatives/multi-step-trees): Rekombináló fa, CRR-paraméterezés, csomópontonkénti árazás és konvergencia a Black–Scholes-árhoz.
- [A görögök: gamma, vega, théta és rhó](https://quantsandbox.dev/hu/guide/derivatives/greeks): Hogyan reagál az opció értéke a részvényárra, a volatilitásra, az időre és a kamatra; a gamma és a théta mint a fedezés két oldala.

Az interaktív eszköz megnyitása: https://quantsandbox.dev/hu/delta-hedging
