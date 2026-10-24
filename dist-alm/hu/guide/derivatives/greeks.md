# A görögök: gamma, vega, théta és rhó

Hogyan reagál az opció értéke a részvényárra, a volatilitásra, az időre és a kamatra; a gamma és a théta mint a fedezés két oldala.

A „Delta és fedezés” lecke azt mérte, hogyan reagál az opció értéke a részvényárra, és megmutatta, hogy a delta-fedezés után a gamma által meghatározott maradék hiba marad. A részvényár azonban nem az egyetlen bemenet, amely mozog. Telik az idő, változik a volatilitás és a kamatláb. Ez a lecke minden bemenethez definiál egy érzékenységet, ezek a **görögök**, és megmutatja, hogy kettőt közülük, a gammát és a thétát, összeköt az a követelmény, hogy a fedezett pozíció a kockázatmentes kamatot hozza.

## Az opció értéke mint a bemenetek függvénye

Jelölje $V(S, t, \sigma, r)$ egy opció (egy $K$ kötési árú, $T$ lejárati időpontú call vagy put) értékét, ha a részvényár $S$, az aktuális időpont $t$, a volatilitás $\sigma$ és a kockázatmentes kamatláb $r$. Az előző lecke, „A Black–Scholes-képlet”, zárt alakban adta meg $V$-t európai callra és putra. Ez a lecke azt vizsgálja, hogyan reagál ez az érték, ha az egyes bemenetek elmozdulnak; ezt mérik a parciális deriváltjai. A leckében szereplő számokat ezzel a képlettel számoltuk.

Minden görög $V$ parciális deriváltja egy bemenet szerint, a többit rögzítve:

$$
\Delta = \frac{\partial V}{\partial S}, \quad \Gamma = \frac{\partial^2 V}{\partial S^2}, \quad \Theta = \frac{\partial V}{\partial t}, \quad \mathcal{V} = \frac{\partial V}{\partial \sigma}, \quad \rho = \frac{\partial V}{\partial r}.
$$

A vega nem görög betű; a jele itt $\mathcal{V}$. A théta a $t$ naptári idő előrehaladásával járó változás, vagyis miközben a lejáratig hátralévő $T - t$ idő csökken.

## Delta és gamma

A delta a „Delta és fedezés” leckéből ismert: az $S \mapsto V$ értékgörbe meredeksége, az a részvényszám, amely lokálisan replikálja az opciót. Mértékegység nélküli (részvény per opció); callra $0 \le \Delta \le 1$, putra $-1 \le \Delta \le 0$.

A gamma ugyanennek a görbének a görbülete, vagyis az, hogy milyen gyorsan változik a delta, ha $S$ elmozdul. Mértékegysége az áregység reciproka: $\Gamma = 0{,}02$ azt jelenti, hogy $S$ minden egységnyi emelkedésére a delta kb. 0,02-dal nő. Vett callnál és putnál $\Gamma > 0$. A put–call paritásból, $C - P = S - Ke^{-r(T-t)}$, látszik, hogy az azonos kötési árú call és put gammája megegyezik, hiszen a jobb oldal $S$-ben lineáris.

A gamma a kötési ár közelében a legnagyobb, és a lejárat közeledtével nő. Lejárat előtt az értékgörbe egyre jobban megközelíti az $(S - K)^+$ megtört kifizetést, amely $K$ egyik oldalán vízszintes, a másikon 1 meredekségű. A meredekség teljes változása ekkor egy szűk sávban történik $K$ körül, ezért ott a görbület nagy, $K$-tól távol pedig nullához tart.

## Vega

A vega azt méri, mennyit változik az érték, ha a volatilitás változik. Mivel $\sigma$ egy 0,25-höz hasonló szám, $\sigma$ 1-gyel való változása óriási; a vegát ezért általában százalékpontra vetítve adják meg: $\mathcal{V}/100$ az értékváltozás, ha $\sigma$ 25%-ról 26%-ra nő.

Callra és putra egyaránt $\mathcal{V} > 0$: az opció tulajdonosa **a volatilitás emelkedésén nyer**. Ennek oka a kifizetés alakja. Nagyobb volatilitás mellett $S_T$ lehetséges értékei mindkét irányban jobban szóródnak. Callnál a nagyobb felfelé mozgás korlátlanul növeli a kifizetést, a nagyobb lefelé mozgás viszont semmibe sem kerül, ha már $S_T < K$, mert a kifizetés alulról 0-nál korlátos. A konvex kifizetés átlagosan nyer a nagyobb szóródáson. A put–call paritás szerint a call és a put vegája megegyezik, mert $S - Ke^{-r(T-t)}$ nem függ $\sigma$-tól.

## Théta és rhó

A théta az értékváltozás egységnyi naptári idő alatt, minden mást rögzítve. Évre vetítve adják meg; 365-tel osztva a napi változást kapjuk. Vett callnál $\Theta < 0$: a lejárat közeledtével kevesebb idő marad arra, hogy a részvény a tulajdonos javára mozduljon, és az érték a kifizetés felé kopik. Ez az **időbeli értékvesztés**. Mélyen pénzben lévő put thétája pozitív is lehet, mert a várakozással a kötési ár megkapása közelebb kerül, és diszkontált értéke nő.

A rhó az értékváltozás, ha $r$ változik; a vegához hasonlóan százalékpontra vetítve adják meg. Callnál $\rho > 0$: a tulajdonos csak lejáratkor fizeti ki $K$-t, és magasabb kamat mellett ennek $Ke^{-r(T-t)}$ jelenértéke kisebb. Ugyanezért a put rhója negatív. Rövid lejáratú részvényopcióknál a rhó általában a legkevésbé fontos görög.

## Az opció értékének Taylor-sora

Egy rövid $dt$ időszak alatt a bemenetek $dS$-sel, $d\sigma$-val és $dr$-rel változnak. $V$-t $S$-ben másodrendig, a többi bemenetben elsőrendig kifejtve:

$$
dV \approx \Delta\,dS + \tfrac{1}{2}\,\Gamma\,(dS)^2 + \Theta\,dt + \mathcal{V}\,d\sigma + \rho\,dr.
$$

A $(dS)^2$ tagot azért tartjuk meg, mert a részvényár rövid idő alatti elmozdulása $\sqrt{dt}$ nagyságrendű, ahogy a „Véletlen bolyongás és Brown-mozgás” leckében láttuk, így $(dS)^2$ nagyságrendje $dt$, ugyanakkora, mint a théta-tagé. A többi változás négyzete sokkal kisebb, ezeket elhagyjuk.

## Gamma és théta a fedezett pozícióban

Tartsunk egy opciót és $\Delta$ darab shortolt részvényt, és finanszírozzuk a pozíciót kockázatmentes kamaton, így a $V - \Delta S$ nettó érték $r$-rel kamatozik. Egy $dt$ időszak alatt, rögzített $\sigma$ és $r$ mellett a $\Delta\,dS$ tagok kiesnek, és a kamat feletti nyereség

$$
d\Pi - r(V - \Delta S)\,dt \approx \tfrac{1}{2}\,\Gamma\,(dS)^2 + \big(\Theta - rV + rS\Delta\big)\,dt.
$$

Most tegyünk egy modellfeltevést: rövid időszak alatt a $dS/S$ hozam varianciája $\sigma^2 dt$, így $(dS)^2$ átlagosan $\sigma^2 S^2 dt$. Ha a fedezett pozíció várható többletnyeresége nem nulla volna, a folytonosan újrasúlyozott fedezés kockázatmentes nyereséget vagy veszteséget adna, amit az arbitrázsmentesség kizár. A többletnyereséget $(dS)^2 = \sigma^2 S^2 dt$ mellett nullának véve

$$
\Theta + \tfrac{1}{2}\,\sigma^2 S^2\,\Gamma + rS\,\Delta - rV = 0.
$$

Ez a Black–Scholes-egyenlet, itt annak feltételeként megfogalmazva, hogy a delta-fedezett opció pontosan a kockázatmentes kamatot hozza. Visszahelyettesítve a fedezett pozíció $dt$ alatti eredménye

$$
\text{P\&L} \approx \tfrac{1}{2}\,\Gamma\,\big((dS)^2 - \sigma^2 S^2\,dt\big).
$$

A gamma és a théta ugyanannak a cserének a két oldala. A vett opció gammája pozitív, minden nagy mozgáson nyer, iránytól függetlenül, és ezért a thétán keresztül naponta fizet. Akkor nyer, ha a ténylegesen megvalósult négyzetes elmozdulás nagyobb $\sigma^2 S^2 dt$-nél, és veszít, ha a részvény kevesebbet mozog. Az opció kiírója az ellenkező oldalon áll: egyenletes théta-bevétel, veszteség a nagy mozgásokon.

> Delta-fedezett opcióra $\Theta + \tfrac{1}{2}\sigma^2 S^2 \Gamma + rS\Delta - rV = 0$. A pozitív gammát negatív thétával fizetjük meg; a fedezés akkor nullszaldós, ha a részvény kb. $\sigma S\sqrt{dt}$-vel mozdul el.

## Számpélda

Vegyünk egy callt, ahol $S = 100$, $K = 100$, $T - t = 0{,}5$ év, $r = 5\%$ és $\sigma = 25\%$. A Black–Scholes-képlet szerint az érték $V \approx 8{,}26$, továbbá

- $\Delta \approx 0{,}591$ és $\Gamma \approx 0{,}0220$;
- $\mathcal{V} \approx 27{,}47$, azaz $\sigma$ minden százalékpontjára 0,275;
- $\Theta \approx -9{,}41$ évente, azaz $-9{,}41/365 \approx -0{,}0258$ naponta;
- $\rho \approx 25{,}41$, azaz $r$ minden százalékpontjára 0,254.

Ellenőrizzük az összefüggést: $\tfrac{1}{2}\sigma^2 S^2 \Gamma = \tfrac{1}{2} \cdot 0{,}0625 \cdot 10\,000 \cdot 0{,}02198 \approx 6{,}87$, $rS\Delta \approx 2{,}95$ és $rV \approx 0{,}41$, így $-9{,}41 + 6{,}87 + 2{,}95 - 0{,}41 = 0$.

Teljen el egy nap, miközben a részvény 102-re, a volatilitás 26%-ra emelkedik. A Taylor-sor $0{,}591 \cdot 2 + \tfrac{1}{2} \cdot 0{,}0220 \cdot 4 - 0{,}0258 + 0{,}275 \approx 1{,}475$ változást jósol; a képlettel újraárazva a változás 1,470. A delta-fedezett pozíció (változatlan $\sigma$ mellett) napi nullszaldós elmozdulása $\sigma S \sqrt{1/365} \approx 1{,}31$. Egy 2 egységnyi mozgás opciónként $\tfrac{1}{2} \cdot 0{,}0220 \cdot (4 - 1{,}71) \approx 0{,}025$ nyereséget hoz; 1,31-nél kisebb mozgás veszteséget.

### Kidolgozott példa: Egyszerre csak egy görög, a pontos újraárazással összevetve

1. Ugyanez a call, értéke 8,26. Csak a volatilitás nő 25%-ról 26%-ra; a vega ezt jósolja:
   $$\mathcal{V}\,d\sigma = 27{,}47 \cdot 0{,}01$$ → **0.2747**
2. $\sigma = 26\%$-on újraárazva szinte ugyanennyi a változás, mert a pénznél az ár $\sigma$-ban közel lineáris:
   $$V(26\%) - V(25\%)$$ → **0.2748**
3. Most csak egy nap telik el, $S$ és $\sigma$ rögzített. A théta ezt jósolja:
   $$\Theta\,dt = -9{,}41 / 365$$ → **-0.0258**
4. Újraárazás $T - t = 0{,}5 - 1/365$ mellett:
   $$V(0{,}5 - \tfrac{1}{365}) - V(0{,}5)$$ → **-0.0258**

## A görögök a részvényár függvényében

Az ábra a call egy-egy görögjét mutatja a részvényár függvényében, $S$ 40 és 160 között, rögzített $K = 100$ és $r = 5\%$ mellett. Egy kapcsolóval választható a delta, a gamma, a vega vagy a théta, a csúszkák a lejáratig hátralévő $T$ időt (0,05 és 2 év között) és a $\sigma$ volatilitást állítják. A kijelzők $S = 100$-nál mutatják a deltát, a gammát, a vegát, a thétát és a $\Theta + \tfrac{1}{2}\sigma^2 S^2 \Gamma + rS\Delta - rV$ kifejezés értékét, amely minden beállításnál nulla marad. Válaszd a gammát, és csökkentsd $T$-t: a kötési árnál lévő csúcs erősen megnő (25%-os $\sigma$ mellett $T = 2$-nél kb. 0,010, $T = 0{,}05$-nél 0,071), a théta a kötési árnál pedig $-9{,}41$-ről kb. $-24{,}8$-ra csökken évente. Ezután válaszd a vegát, és figyeld meg, hogy a kötési ár közelében a legnagyobb, és $T$-vel nő.

*[Interaktív ábra: greeks profile](https://quantsandbox.dev/hu/guide/derivatives/greeks)*

## Összefoglalás

- A görögök az opció értékének parciális deriváltjai: $\Delta$ és $\Gamma$ $S$ szerint, $\Theta$ az idő szerint, a $\mathcal{V}$ vega $\sigma$ szerint, $\rho$ pedig $r$ szerint.
- A gamma az értékgörbe görbülete; a kötési ár közelében a legnagyobb, és a lejárat közeledtével nő. Az azonos kötési árú call és put gammája és vegája megegyezik.
- Az opció tulajdonosa a volatilitás emelkedésén nyer ($\mathcal{V} > 0$), mert a kifizetés konvex; a vett call értéke az idővel csökken ($\Theta < 0$).
- Másodrendig $dV \approx \Delta\,dS + \tfrac{1}{2}\Gamma(dS)^2 + \Theta\,dt + \mathcal{V}\,d\sigma$.
- A delta-fedezett opció eredménye $\tfrac{1}{2}\Gamma((dS)^2 - \sigma^2S^2dt)$; abból a követelményből, hogy a kockázatmentes kamatot hozza, $\Theta + \tfrac{1}{2}\sigma^2S^2\Gamma + rS\Delta - rV = 0$ adódik.

> Egy későbbi lecke, az „Implikált volatilitás és a volatilitás-mosoly”, megfordítja a kérdést: adott piaci árhoz milyen $\sigma$ kell a képletbe, és miért függ ez a szám a kötési ártól.

[Vizsgáld a görögök felületeit a részvényár és a lejárat függvényében a Black–Scholes laborban](https://quantsandbox.dev/hu/black-scholes)

## Interaktív laborok

- [Black–Scholes-kalkulátor és opciós görögök](https://quantsandbox.dev/hu/black-scholes)
- [Delta-fedezési szimulátor opciókhoz](https://quantsandbox.dev/hu/delta-hedging)

## Gyakorló kérdések

### 1. Egy pénznél lévő (at-the-money) európai call van nálad. Ha semmi más nem változik, mi történik az értékével egy nap alatt?

- a) Csökken: a théta negatív
- b) Nő: a théta pozitív
- c) Változatlan: a théta nulla
- d) A gamma előjelétől függ

**Válasz:** a) Csökken: a théta negatív

A long call a lejárat közeledtével elveszíti időértékét, így $\Theta < 0$. A pénznél a leggyorsabb az értékvesztés, mert ott van az érték a legmesszebb a kifizetés fölött.

### 2. A fenti callnál ($S = K = 100$, $T - t = 0{,}5$, $r = 5\%$, $\sigma = 25\%$) elsőrendben mennyit változik az érték, ha $\sigma$ egy százalékponttal nő?

**Válasz:** 0.275

A vega $\mathcal{V} = S\varphi(d_1)\sqrt{T - t} \approx 27{,}47$ $\sigma$ egységére. Egy százalékpont $d\sigma = 0{,}01$, így a változás kb. $0{,}275$.

---

Forrás: https://quantsandbox.dev/hu/guide/derivatives/greeks

Előző lecke: [A Black–Scholes-képlet](https://quantsandbox.dev/hu/guide/derivatives/toward-black-scholes)

Következő lecke: [Opciók osztalékos részvényre, indexre, devizára és határidős ügyletre](https://quantsandbox.dev/hu/guide/derivatives/options-on-other-underlyings)
