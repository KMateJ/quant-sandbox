# Implikált volatilitás és a volatilitás-mosoly

A Black–Scholes-képlet megfordítása σ-ra, a vega, és amit a mosoly és a lejárati szerkezet elárul a modellről.

„A Black–Scholes-képlet” öt bemenetből opciós árat számol. Ez a lecke visszafelé használja a képletet: adottnak veszi a piaci árat, és azt kérdezi, milyen volatilitás adja ki. A válasz, az implikált volatilitás, a piacon az opciók jegyzésének módja, és ha kötési áronként és lejáratonként összevetjük, megmutatja, hol tér el a modell a piactól.

## Az egyetlen nem megfigyelhető bemenet

Nézzük a $C_0 = S_0N(d_1) - Ke^{-rT}N(d_2)$ call-ár bemeneteit. Az $S_0$ részvényár látszik a képernyőn, a $K$ kötési ár és a $T$ lejárat a szerződésben szerepel, az $r$ kockázatmentes kamatláb pedig leolvasható a rövid lejáratú állampapírokról. A $\sigma$ volatilitás más: azt írja le, mennyit mozog majd a részvény most és $T$ között, és ezt előre senki sem figyelheti meg. A múltbeli hozamokból becsült történeti volatilitás egy lehetséges kiindulópont, de a kereskedőknek nem kell egyetérteniük benne.

A képlet ezért fordítva is olvasható. Ha a piacon már van ára az opciónak, az egyetlen szabad bemenet $\sigma$, és erre megoldhatjuk az egyenletet.

## Az ár mint a volatilitás függvénye

Rögzítsük $S_0$-t, $K$-t, $T$-t és $r$-et, és tekintsük a call árát csak $\sigma$ függvényének. A deriváltja az opció **vegája**. A képletet deriválva ($d_1$ és $d_2$ tagjai ugyanúgy összevonódnak, mint a deltánál):

$$
\mathcal{V} = \frac{\partial C_0}{\partial \sigma} = S_0\,\varphi(d_1)\sqrt{T} > 0,
$$

ahol $\varphi$ a standard normális sűrűségfüggvény. A vega szigorúan pozitív, így az ár $\sigma$-ban szigorúan nő. A két végen: ha $\sigma \to 0$, a részvény determinisztikusan nő, és az ár $\max(S_0 - Ke^{-rT}, 0)$-ra csökken; ha $\sigma \to \infty$, a call egyre inkább maga a részvény, és az ár $S_0$-hoz tart. Ezek éppen a „Put–call paritás” lecke arbitrázsmentes korlátai:

$$
\max\left(S_0 - Ke^{-rT},\, 0\right) < C_0 < S_0.
$$

Egy folytonos, szigorúan növő függvény, amely a két korlát közötti teljes intervallumot bejárja, minden közbülső értéket pontosan egyszer vesz fel. A korlátok közé eső jegyzett ár tehát egyetlen $\sigma$-t határoz meg. A korlátokon kívüli ár arbitrázst jelent, és semmilyen volatilitás nem magyarázza.

> Egy opció **implikált volatilitása** az az egyetlen $\sigma$, amelyre a Black–Scholes-ár megegyezik a piaci árral. Akkor létezik, ha az ár szigorúan az arbitrázsmentes korlátok közé esik.

## A volatilitás kiszámítása

A képletnek nincs zárt alakú inverze, ezért az implikált volatilitást numerikusan keressük. Két módszer a szokásos.

1. **Intervallumfelezés (biszekció).** Induljunk egy alacsony $\sigma_L$-ből, amelynek ára a jegyzés alatt van, és egy magas $\sigma_H$-ból, amelynek ára fölötte. Árazzuk be a felezőpontot; ha túl drága, ez lesz az új $\sigma_H$, különben az új $\sigma_L$. Minden lépés felezi az intervallumot, így a módszer mindig konvergál, lassan, de biztosan.
2. **Newton-módszer.** Egy $\sigma_0$ kezdőértékből az árgörbe érintője mentén lépünk a jegyzett árhoz. Az érintő meredeksége a vega, így egy lépés $\sigma_{n+1} = \sigma_n - (C(\sigma_n) - C^{\text{piaci}})/\mathcal{V}(\sigma_n)$. A megoldás közelében a helyes jegyek száma lépésenként nagyjából megduplázódik.

A Newton-módszer jóval gyorsabb, de túllőhet, ha a vega kicsi; ez a pénztől távoli vagy a lejárathoz nagyon közeli opcióknál fordul elő. A gyakorlati kód gyakran kombinálja a kettőt: Newton-lépéseket tesz, és felezésre vált, ha egy lépés kivezetne a közrefogó intervallumból.

## Számpélda

Legyen $S_0 = 100$, $K = 100$, $T = 1$, $r = 5\%$, és a jegyzett call-ár 12,00. A korlátok $100 - 100e^{-0{,}05} \approx 4{,}88$ és 100, tehát a jegyzés megengedett. „A Black–Scholes-képlet” leckéből tudjuk, hogy $\sigma = 20\%$ mellett az ár 10,45, ez túl alacsony, $\sigma = 30\%$ mellett pedig 14,23, ez túl magas. Felezés a $[20\%, 30\%]$ intervallumon:

- $\sigma = 25\%$: az ár 12,34, túl magas, az intervallum $[20\%, 25\%]$ lesz.
- $\sigma = 22{,}5\%$: az ár 11,39, túl alacsony, az intervallum $[22{,}5\%, 25\%]$ lesz.
- $\sigma = 23{,}75\%$: az ár 11,86, túl alacsony, az intervallum $[23{,}75\%, 25\%]$ lesz.

A Newton-módszer $\sigma_0 = 20\%$-ból gyorsabb. Itt a vega $\mathcal{V} \approx 37{,}52$ (ár egységnyi $\sigma$-ra, vagyis volatilitáspontonként kb. 0,375):

$$
\sigma_1 = 0{,}20 - \frac{10{,}4506 - 12}{37{,}52} \approx 0{,}2413, \qquad C(\sigma_1) \approx 12{,}0066.
$$

A második lépés $\mathcal{V} \approx 37{,}81$ mellett $-0{,}0066/37{,}81 \approx -0{,}0002$-vel mozdítja $\sigma$-t, és $\sigma \approx 24{,}11\%$-nál áll meg, négy jegyre pontosan. A piac tehát úgy árazza ezt az opciót, mintha a részvény éves volatilitása 24,11% lenne.

### Kidolgozott példa: Két Newton-lépés a 9,00-es jegyzésre

1. Induljunk $\sigma_0 = 20\%$-ból, ahol az ár 10,4506, a vega 37,52. Az első lépés százalékban:
   $$\sigma_1 = 0{,}20 - \frac{10{,}4506 - 9}{37{,}52}$$ → **16.13%**
2. Az ár $\sigma_1$-nél már csak kicsivel van a jegyzés fölött:
   $$C(\sigma_1)$$ → **9.01**
3. Második lépés, $\sigma_1$-nél $\approx 36{,}96$ vegával:
   $$\sigma_2 = \sigma_1 - \frac{C(\sigma_1) - 9}{36{,}96}$$ → **16.11%**

Az ábra ugyanezt a keresést mutatja. Az $S_0 = 100$ árfolyam és az $r = 5\%$ kamat rögzített; csúszkákkal állítható a jegyzett call-ár, a $K$ kötési ár és a $T$ lejárat. A görbe a Black–Scholes call-ár $\sigma$ függvényében 1% és 100% között, a vízszintes vonal a jegyzett ár, a függőleges vonal pedig a metszéspontot jelöli: ez az implikált volatilitás. A kijelzők az implikált volatilitást, az ott vett vegát, valamint az alsó és felső arbitrázsmentes korlátot mutatják. Emeld a jegyzett árat: a metszéspont jobbra csúszik, az implikált volatilitás nő. Utána vidd az árat az alsó korlát alá: a vízszintes vonal már nem metszi a görbét, és az implikált volatilitás helyén gondolatjel áll.

*[Interaktív ábra: implied vol](https://quantsandbox.dev/hu/guide/derivatives/implied-volatility)*

## Jegyzés volatilitásban

Mivel az ár és az implikált volatilitás kölcsönösen egyértelműen megfelelnek egymásnak, a kereskedők az opciókat volatilitásban jegyzik, nem pénzben. Az ok az összehasonlíthatóság. Egy 12,00-es ár keveset mond, amíg nem ismerjük a kötési árat, a lejáratot és a részvényárat; egy 24%-os implikált volatilitás viszont közvetlenül összevethető más kötési árakkal, lejáratokkal, sőt más alaptermékekkel is, és azzal a volatilitással, amelyet a részvénytől várunk. Az árat a jegyzett volatilitás képletbe helyettesítésével kapjuk vissza.

Az azonos kötési árú és lejáratú call és put implikált volatilitása ugyanaz. A $C_0 - P_0 = S_0 - Ke^{-rT}$ put–call paritás modelltől függetlenül teljesül a piaci árakra, és minden $\sigma$ mellett a Black–Scholes-árakra is. Ha $\sigma^*$ visszaadja a piaci call-árat, akkor

$$
P_0^{\text{piaci}} = C_0^{\text{piaci}} - S_0 + Ke^{-rT} = C^{\text{BS}}(\sigma^*) - S_0 + Ke^{-rT} = P^{\text{BS}}(\sigma^*).
$$

A példában a putnak $12{,}00 - (100 - 95{,}12) \approx 7{,}12$-be kell kerülnie, és implikált volatilitása szintén 24,11%.

## A volatilitás-mosoly és a ferdeség

Ha a Black–Scholes-modell helyes volna, a részvénynek egyetlen volatilitása lenne, és minden rá szóló opció ugyanazt az implikált volatilitást mutatná. A piaci adatok nem ilyenek. Rögzített lejárat mellett az implikált volatilitást a kötési ár függvényében ábrázolva görbét kapunk, nem vízszintes egyenest. Részvényindexeken a görbe lefelé lejt: az alacsony kötési árú opciók, különösen a pénzen kívüli putok implikált volatilitása jól láthatóan magasabb a pénznél lévőkénél, a magas kötési áraké pedig valamivel alacsonyabb. Ezt az alakot **ferdeségnek** (skew) nevezik. Más piacokon, például a devizapiacon, a görbe szimmetrikusabb, és mindkét oldalon emelkedik; innen ered a **volatilitás-mosoly** elnevezés.

Rögzített kötési ár mellett az implikált volatilitás a lejárattal is változik; ez a volatilitás **lejárati szerkezete**. Nyugodt piacon a rövid lejáratú volatilitás jellemzően a hosszú lejáratú alatt van, egy éles esés után a sorrend gyakran megfordul. A két hatás együtt adja a kötési ár és a lejárat fölött kifeszülő implikált volatilitási felületet.

## Mit mond a mosoly a modellről

A mosoly azt jelzi, hogy a piac nem lognormális eloszlással és állandó $\sigma$-val áraz. Az alacsony kötési árakon mért magas implikált volatilitás azt jelenti, hogy a pénzen kívüli putok drágábbak, mint amit a modell megenged, vagyis a piac a nagy esésekhez több valószínűséget rendel, mint a lognormális eloszlás: a kockázatsemleges eloszlás **bal farka vastagabb**. A lejárati szerkezet pedig azt mutatja, hogy maga a volatilitás sem rögzített szám, hanem időben mozog, és részvénypiacon jellemzően akkor emelkedik, amikor az árak esnek.

A kereskedők ennek ellenére használják a Black–Scholes-képletet, de jegyzési konvencióként, nem a részvény leírásaként. A képlet rögzített, jól ismert megfeleltetés ár és volatilitás között, a mosoly pedig rögzíti, mennyiben tér el ettől a piac. Az implikált volatilitást úgy is jellemezték, mint a rossz számot, amelyet a rossz képletbe írva a helyes árat kapjuk. Olyan modell, amelyben maga a volatilitás is véletlen, és amely magától mosolyt ad, a következő lecke témája.

## Összefoglalás

- A Black–Scholes-bemenetek közül csak $\sigma$ nem figyelhető meg; az implikált volatilitás az a $\sigma$, amely visszaadja a piaci árat.
- Az $S_0\varphi(d_1)\sqrt{T}$ vega pozitív, így az ár $\sigma$-ban szigorúan nő, és minden, a $\max(S_0 - Ke^{-rT}, 0) < C_0 < S_0$ korlátok közé eső ár pontosan egy implikált volatilitást ad.
- Kiszámítása felezéssel (biztos) vagy a vegát használó Newton-módszerrel (gyors) történik; a példában a 12,00-es ár 24,11%-ot ad.
- Az azonos $K$-jú és $T$-jű call és put implikált volatilitása a put–call paritás miatt megegyezik.
- Az implikált volatilitás függ a kötési ártól (mosoly, ferdeség) és a lejárattól (lejárati szerkezet), vagyis a piac nem egyetlen lognormális $\sigma$-val áraz.

> A Black–Scholes-modell jegyzési konvencióként él tovább. A következő lecke olyan modellt épít, amelynek árai mosolyt adnak; ehhez a Heston-labor tartozik.

[Nézd meg a Black–Scholes laborban, hogyan reagál az ár a volatilitásra](https://quantsandbox.dev/hu/black-scholes)

## Interaktív laborok

- [Black–Scholes-kalkulátor és opciós görögök](https://quantsandbox.dev/hu/black-scholes)
- [Heston-modell: sztochasztikus volatilitás szimulátor](https://quantsandbox.dev/hu/heston)

## Gyakorló kérdések

### 1. Egy call ára a $\sigma = 20\%$-kal számolt Black–Scholes-ár fölött van. Mit mondhatsz az implikált volatilitásáról?

- a) 20% fölött van
- b) 20% alatt van
- c) Pontosan 20%
- d) A valós drift ismerete nélkül semmit

**Válasz:** a) 20% fölött van

Az ár $\sigma$-ban szigorúan nő (a vega pozitív), így magasabb árhoz magasabb volatilitás kell.

### 2. Ugyanez az opció ($S_0 = K = 100$, $T = 1$, $r = 5\%$), de most a jegyzett call-ár 9,00. Mennyi az implikált volatilitása százalékban?

**Válasz:** 16.11%

20%-on az ár 10,45, túl magas, 10%-on kb. 6,80, túl alacsony. Az első felezési lépés 15%-on 8,59-et ad, túl alacsony, így a válasz a $[15\%, 20\%]$ intervallumban van; folytatva kb. 16,11% adódik.

---

Forrás: https://quantsandbox.dev/hu/guide/derivatives/implied-volatility

Előző lecke: [Opciók osztalékos részvényre, indexre, devizára és határidős ügyletre](https://quantsandbox.dev/hu/guide/derivatives/options-on-other-underlyings)

Következő lecke: [Sztochasztikus volatilitás és a Heston-modell](https://quantsandbox.dev/hu/guide/derivatives/stochastic-volatility)
