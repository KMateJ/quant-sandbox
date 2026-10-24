# Delta és fedezés

A delta mint érzékenység és mint fedezeti arány; gamma és az újrasúlyozás hibája.

„Az egylépéses binomiális modell” leckében a replikáló portfólió $\Delta$ részvényszáma két egyenlet megoldásaként jelent meg. Ez a lecke megmutatja, hogy $\Delta$ egyben érzékenység is: mennyit változik az opció értéke, ha a részvényár elmozdul. Ebből az olvasatból lesz a replikációból gyakorlati eszköz, a **fedezés**, és ebből jutunk el egy második érzékenységhez, a gammához, amely azt méri, milyen gyorsan romlik el egy fedezés. A lecke a „Többlépéses fák és visszafelé indukció” anyagára épül.

## Delta a binomiális fában

Vegyük a binomiális fa egy csomópontját. A pillanatnyi $S$ részvényárból az ár $S_u = uS$-re vagy $S_d = dS$-re lép, az opció értéke ekkor $C_u$ vagy $C_d$. A replikáló portfólió $\Delta$ darab részvényt tart, ahol

$$
\Delta = \frac{C_u - C_d}{S_u - S_d}.
$$

Ez változások hányadosa: az opció értékének változása osztva a részvényár változásával. Az egylépéses lecke példájában ($S_0 = 100$, $u = 1{,}2$, $d = 0{,}9$, $K = 100$) a call 20-at vagy 0-t fizet, a részvény 120-on vagy 90-en zár, így $\Delta = 20/30 \approx 0{,}667$. A részvény minden egységnyi elmozdulása nagyjából kétharmad egységgel mozdítja az opciót.

## Delta mint derivált

Csökkentsük a $\Delta t$ időlépést, ahogy a többlépéses fáknál. Ekkor $S_u$ és $S_d$ egyre közelebb kerül $S$-hez, és a fenti különbségi hányados deriválttá válik. Jelölje $C(S, t)$ az opció értékét a pillanatnyi részvényár és az idő függvényében. Ekkor

$$
\Delta = \frac{\partial C}{\partial S}.
$$

Geometriailag $\Delta$ az $S \mapsto C(S,t)$ görbe **meredeksége** a mai árnál. Callnál ez a görbe növekvő és konvex: mélyen a pénzen kívül lapos (az opció szinte semmit sem ér, bármit tesz a részvény), mélyen a pénzben párhuzamos az $S - Ke^{-rT}$ egyenessel. A call deltája ezért mindig 0 és 1 közé esik:

$$
0 \le \Delta_{\text{call}} \le 1.
$$

A put deltája $-1$ és $0$ között van, mert értéke csökken, ha a részvény drágul.

## A fedezett portfólió

Tegyük fel, hogy van egy callod, és meg akarod szüntetni a kis részvényár-mozgásokkal szembeni kitettségedet. Shortolj $\Delta$ darab részvényt. Az együttes pozíció

$$
\Pi = C - \Delta S.
$$

Egy rövid időszak alatt a részvényár $dS$-sel változik. Elsőrendben az opció $\Delta\,dS$-sel, a short részvénypozíció $-\Delta\,dS$-sel változik, így

$$
d\Pi \approx \Delta\,dS - \Delta\,dS = 0.
$$

Azt a pozíciót, amelynek elsőrendű érzékenysége a részvényárra nulla, **delta-semlegesnek** nevezzük. Ez a fás leckék replikáló portfóliója fordított irányból nézve: ahelyett, hogy részvényből és kötvényből rakjuk össze az opciót, az opció részvénykitettségét részvénnyel semlegesítjük.

> A $\Delta = \partial C/\partial S$ delta az a részvényszám, amely lokálisan replikálja az opciót. A $C - \Delta S$ pozíció érzéketlen a kis részvényár-mozgásokra.

## Gamma és a fedezési hiba

A fenti kioltás csak elsőrendben pontos. $C$ Taylor-sora $S$ szerint, a rövid időszak alatti időmúlást elhanyagolva:

$$
C(S + dS) \approx C(S) + \Delta\,dS + \tfrac{1}{2}\,\Gamma\,(dS)^2, \qquad \Gamma = \frac{\partial^2 C}{\partial S^2}.
$$

A **gamma** ($\Gamma$) az értékgörbe görbülete: azt méri, milyen gyorsan változik maga a delta, ha $S$ elmozdul. A fedezett portfólióba helyettesítve a lineáris tagok kiesnek, és ez marad:

$$
d\Pi \approx \tfrac{1}{2}\,\Gamma\,(dS)^2.
$$

A call tulajdonosánál $\Gamma > 0$, így a fedezett pozíció minden nagy mozgáson nyer egy keveset, akár felfelé, akár lefelé. A hiba a mozgás négyzetével nő: kétszer akkora mozgásnál négyszer akkora. A gamma a pénz körüli, lejárathoz közeli opcióknál a legnagyobb, ahol az értékgörbe a legélesebben hajlik.

Az ábra a call értékét mutatja $S$ függvényében ($K = 100$, $r = 5\%$), a mai $S_0$ árhoz húzott érintővel együtt; az érintő meredeksége $\Delta$. A szaggatott vonal a lejáratkori kifizetés. A görbe és az érintő közti függőleges távolság éppen a fedezési hiba; a kijelzők ezt 10 egységnyi emelkedésre és esésre mutatják. Mozgasd $S_0$-t, és figyeld, ahogy $\Delta$ közel 0-ról közel 1-re nő; csökkentsd $T$-t vagy $\sigma$-t, és látni fogod, hogy a görbe szorosabban simul a kifizetéshez, a $K$-nál lévő törés élesebb lesz, és a kötési ár körül nő $\Gamma$.

*[Interaktív ábra: delta tangent](https://quantsandbox.dev/hu/guide/derivatives/delta-hedging)*

## Számpélda

Legyen $S_0 = 100$, $K = 100$, $r = 5\%$, $\sigma = 20\%$, $T = 1$. A call értéke kb. 10,45, $\Delta \approx 0{,}637$ és $\Gamma \approx 0{,}0188$. Egy árjegyző, aki 100 callt adott el, nagyjából 63,7 részvény megvételével fedez.

Ha a részvény 110-re ugrik, az érintő $10{,}45 + 0{,}637 \cdot 10 \approx 16{,}82$ opcióértéket jósol, a valódi érték viszont kb. 17,66. A különbség opciónként kb. 0,84. 90-re eséskor a különbség kb. 1,01. A gammából adódó becslés $\tfrac{1}{2} \cdot 0{,}0188 \cdot 10^2 \approx 0{,}94$, a kettő között. Mindössze 1 egységnyi mozgásnál a hiba kb. 0,009, százszor kisebb, ahogy a négyzetes szabály mondja.

### Kidolgozott példa: Egy újrasúlyozási lépés a 102-re ugrás után

1. Induljunk ugyanabból a callból ($S_0 = K = 100$, $r = 5\%$, $\sigma = 20\%$, $T = 1$), amelyben long pozíciót tartunk, és $\Delta = N(d_1)$ részvény shortolásával fedezünk:
   $$\Delta = N(0{,}35)$$ → **0.6368**
2. A gamma ugyanitt:
   $$\Gamma = \frac{\varphi(d_1)}{S_0\,\sigma\sqrt{T}}$$ → **0.01876**
3. A részvény 102-re ugrik. A gammatag megjósolja a fedezett pozíció nyereségét:
   $$\tfrac{1}{2}\,\Gamma\,(dS)^2 = \tfrac{1}{2} \cdot 0{,}01876 \cdot 2^2$$ → **0.0375**
4. Ha a callt 102-nél pontosan újraárazzuk, és levonjuk a részvényláb változását, majdnem ugyanezt kapjuk:
   $$C(102) - C(100) - \Delta \cdot 2$$ → **0.0368**
5. Az új delta nagyobb, ezért az újrasúlyozáskor további részvényeket kell shortolni:
   $$N\!\left(\frac{\ln 1{,}02 + 0{,}07}{0{,}2}\right)$$ → **0.6733**

## Újrasúlyozás

A delta változik, valahányszor $S$ vagy $t$ változik, ezért a ma beállított fedezés csak ma pontos. A delta-semlegesség fenntartása **újrasúlyozást** igényel: rendszeres időközönként újraszámoljuk $\Delta$-t, és igazítjuk a részvényállományt. A fában ez minden csomópontban megtörténik, pontosan ezt írja elő a visszafelé indukció.

A gyakorlatban az újrasúlyozás diszkrét, mondjuk naponta egyszer. Két igazítás között a részvény véges mértékben mozdul el, és a $\tfrac{1}{2}\Gamma(dS)^2$ fedezési hiba felhalmozódik. Gyakoribb újrasúlyozással az egyes hibák kisebbek (a részvényár-elmozdulás négyzetével arányosak), viszont a kereskedési költség a tranzakciók számával nő. Gondolj az autóvezetésre: a kicsi, gyakori kormánykorrekciók a sávban tartanak, de mindegyik egy kis erőfeszítésbe kerül. Az opcióárazásban feltételezett tökéletes replikáció a folytonos, költségmentes újrasúlyozásnak felel meg.

## Egy szimulált fedezés

Az ábra egy eladott callt követ három hónapon át ($S_0 = K = 100$, $\sigma = 20\%$, $r = 5\%$) egy szimulált pályán. A fedezett könyv $\Delta$ darab részvényt tart, és 1, 5 vagy 21 kereskedési naponként igazít; a fedezetlen könyv csak a díjat tartja. Nyomd meg a Lejátszás gombot, és figyeld napról napra mindkettőt. A fedezetlen eredmény a részvénnyel együtt leng, a fedezett a nulla közelében marad. A kijelzők 200 pálya végeredményének szórását mutatják: ez nagyjából az újrasúlyozási időköz négyzetgyökével nő, ahogy a $\tfrac12\Gamma(dS)^2$ hiba alapján várható.

*[Interaktív ábra: hedge simulation](https://quantsandbox.dev/hu/guide/derivatives/delta-hedging)*

## Összefoglalás

- A fában $\Delta = (C_u - C_d)/(S_u - S_d)$ egyszerre a replikáló részvényszám és az opció részvényárra vett érzékenysége.
- Folytonos határesetben $\Delta = \partial C/\partial S$, az értékgörbe meredeksége; callra $0 \le \Delta \le 1$.
- A $C - \Delta S$ portfólió delta-semleges; a megmaradó változása $\tfrac{1}{2}\Gamma(dS)^2$, ahol a gamma a görbület.
- A fedezést újra kell súlyozni; diszkrét újrasúlyozásnál intervallumonként kb. $\tfrac{1}{2}\Gamma(dS)^2$ hiba marad, amely rövidebb intervallumoknál kisebb.

> A következő leckék a fát a részvény folytonos modelljével váltják fel. Abban a modellben a call deltájának zárt alakja van: $N(d_1)$.

[Futtass lépésről lépésre delta-fedezést a Delta-fedezés laborban](https://quantsandbox.dev/hu/delta-hedging)

## Interaktív laborok

- [Delta-fedezési szimulátor opciókhoz](https://quantsandbox.dev/hu/delta-hedging)
- [Black–Scholes-kalkulátor és opciós görögök](https://quantsandbox.dev/hu/black-scholes)

## Gyakorló kérdések

### 1. Egy árjegyző 100 callt adott el, mindegyik deltája $\Delta = 0{,}6$. Hány részvényt kell vennie, hogy delta-semleges legyen?

**Válasz:** 60

Az eladott callok együttes deltája $-100 \cdot 0{,}6 = -60$, így 60 részvény megvételével a pozíció deltája nulla lesz.

### 2. Milyen előjelű egy long call gammája?

- a) Pozitív
- b) Negatív
- c) Nulla
- d) A kötési ár alatt pozitív, fölötte negatív

**Válasz:** a) Pozitív

A call értékgörbéje $S$-ben konvex, így a második deriváltja, $\Gamma$, mindenhol pozitív. A delta-fedezett long call ezért bármelyik irányú nagy mozgáson nyer.

---

Forrás: https://quantsandbox.dev/hu/guide/derivatives/delta-hedging

Előző lecke: [Amerikai opciók és korai lehívás](https://quantsandbox.dev/hu/guide/derivatives/american-options)

Következő lecke: [Geometriai Brown-mozgás](https://quantsandbox.dev/hu/guide/derivatives/gbm)
