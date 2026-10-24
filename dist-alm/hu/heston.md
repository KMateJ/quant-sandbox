# Heston-modell: sztochasztikus volatilitás szimulátor

Szimuláld a Heston-modellt: visszahúzó sztochasztikus variancia, vol-of-vol és korreláció, mintapályákkal és Monte Carlo-opcióárazással.

## Az eszközről

A Heston-modellben maga a volatilitás is véletlen: a variancia egy átlaghoz visszahúzó négyzetgyök-folyamatot követ, amely korrelál a részvényárral. A szimulátor ár- és varianciapályákat mutat, a visszahúzás sebességének, a hosszú távú varianciának, a vol-of-volnak és a korrelációnak a hatását, és Monte Carlo-módszerrel áraz egy európai opciót.

## Gyakori kérdések

### Miért sztochasztikus volatilitás a Black–Scholes helyett?

A piaci opciós árak különböző kötési árakra különböző implikált volatilitást adnak (volatilitás-mosoly és -ferdeség). A véletlen, korrelált volatilitás vastagabb szélű és ferde eloszlást hoz létre, amire egyetlen konstans volatilitás nem képes.

### Mit csinál a ρ korrelációs paraméter?

Negatív ρ esetén a volatilitás akkor nő, amikor az ár esik — ez a részvénypiacokon tipikus. A hozameloszlást balra ferdíti, és meredekebbé teszi az implikált volatilitás ferdeségét.

## Az elmélet

- [A Black–Scholes-képlet](https://quantsandbox.dev/hu/guide/derivatives/toward-black-scholes): A képlet levezetésének logikája, d₁ és d₂ jelentése, és mit hagy figyelmen kívül a modell.
- [Geometriai Brown-mozgás](https://quantsandbox.dev/hu/guide/derivatives/gbm): A részvényár standard modellje: lognormális eloszlás, várható érték és medián.
- [Korrelált Brown-mozgások és többeszközös modellek](https://quantsandbox.dev/hu/guide/stochastic/correlated-brownian-motions): Korrelált Brown-mozgások Cholesky-faktorral, a kétdimenziós Itô-szabály, és hol lép be a korreláció a Heston-modellbe és a kosáropciók árazásába.
- [Ugrások és a Merton-féle ugró diffúzió](https://quantsandbox.dev/hu/guide/stochastic/jump-diffusion): Poisson-folyamat, összetett ugrások, a Merton-modell, és hogyan okoznak az ugrások vastag farkat és mosolyt.
- [Implikált volatilitás és a volatilitás-mosoly](https://quantsandbox.dev/hu/guide/derivatives/implied-volatility): A Black–Scholes-képlet megfordítása σ-ra, a vega, és amit a mosoly és a lejárati szerkezet elárul a modellről.
- [Sztochasztikus volatilitás és a Heston-modell](https://quantsandbox.dev/hu/guide/derivatives/stochastic-volatility): A Heston-féle varianciafolyamat, az átlaghoz való visszatérés, a vol-of-vol, a Feller-feltétel, és hogyan alakítja a korreláció és a vol-of-vol a mosolyt.

Az interaktív eszköz megnyitása: https://quantsandbox.dev/hu/heston
