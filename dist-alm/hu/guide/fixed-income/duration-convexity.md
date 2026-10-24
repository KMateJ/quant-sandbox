# Duráció és konvexitás

Macaulay- és módosított duráció, a kamatérzékenység lineáris és másodrendű közelítése.

A „Kötvényárak és hozamok” leckében a kötvény ára a hozam csökkenő, konvex függvénye volt. Ez a lecke számokkal írja le ezt a görbét: a **duráció** a meredekségét, a **konvexitás** a görbületét méri. Együtt megmondják, mennyit változik a kötvény ára, ha a hozamok elmozdulnak, újraárazás nélkül. A jelölések változatlanok: $F = 100$ névérték, $c$ rátájú éves kuponok, $T$ lejárat, éves kamatozású $y$ lejáratig számított hozam, $P$ ár.

## Kamatkockázat

A kötvény pénzáramlásai rögzítettek, az ára viszont nem: ha a piaci hozamok emelkednek, ugyanazokat a pénzáramlásokat erősebben diszkontáljuk, és az ár esik. Ez a **kamatkockázat**. Két kötvény nagyon eltérően reagálhat ugyanarra a hozamváltozásra; egy 30 éves kötvény sokkal többet veszít, mint egy egyéves kincstárjegy. Egyetlen számot keresünk, amely ezt az érzékenységet megragadja.

## Macaulay-duráció

Jelölje $CF_t$ a $t$-edik év pénzáramlását (tehát $t < T$ esetén $CF_t = cF$, és $CF_T = cF + F$). Minden pénzáramlás $PV_t = CF_t/(1+y)^t$ jelenértékkel járul hozzá az árhoz, és ezek összege $P$. A **Macaulay-duráció** a kifizetési időpontok átlaga, e jelenértékekkel súlyozva:

$$
D = \sum_{t=1}^{T} t\,\frac{PV_t}{P}, \qquad PV_t = \frac{CF_t}{(1+y)^t}.
$$

Gondolj egy mérleghintára: a gerenda $t$ távolságú pontjára $PV_t$ súlyt teszünk; $D$ az a pont, ahol a gerenda egyensúlyban van. Kuponos kötvénynél a kuponok $T$ elé húzzák az egyensúlyi pontot, így $D < T$. A **zérókuponos kötvénynek** egyetlen pénzáramlása van, minden súly $T$-ben ül, ezért durációja megegyezik a lejáratával: $D = T$.

## Módosított duráció

Deriváljuk az árat a hozam szerint. Az $(1+y)^{-t}$ tag deriváltja $-t\,(1+y)^{-t-1}$, így

$$
\frac{dP}{dy} = -\sum_{t=1}^{T} t\,\frac{CF_t}{(1+y)^{t+1}} = -\frac{1}{1+y}\sum_{t=1}^{T} t\,PV_t = -\frac{D}{1+y}\,P.
$$

Az elöl álló szorzó a **módosított duráció**:

$$
D_{mod} = \frac{D}{1+y}, \qquad \frac{dP}{dy} = -D_{mod}\,P.
$$

Kis $\Delta y$ hozamváltozásra az elsőrendű Taylor-közelítés a relatív árváltozást adja:

$$
\frac{\Delta P}{P} \approx -D_{mod}\,\Delta y.
$$

Egy $D_{mod} = 7{,}7$ módosított durációjú kötvény értéke kb. 7,7%-kal csökken, ha a hozama egy százalékponttal nő. Geometriailag ez a közelítés az ár–hozam görbét a mai hozamnál húzott érintőjével helyettesíti, pontosan úgy, ahogy a „Delta és fedezés” leckében a delta az opció értékgörbéjét helyettesítette az érintőjével.

> A $D_{mod} = D/(1+y)$ módosított duráció az egységnyi hozamváltozásra jutó százalékos árváltozás: $\Delta P/P \approx -D_{mod}\,\Delta y$.

## Pénzben mért duráció

A portfóliókezelőknek gyakran nem százalékos, hanem pénzben mért változás kell. A **pénzben mért duráció** (dollar duration) $D_{mod}\,P$, az egységnyi hozamváltozásra jutó árváltozás; 10 000-rel osztva a bázispontonkénti (0,01%) változást adja, ennek szokásos neve DV01. A pénzben mért durációk pozíciók között összeadódnak, így ezekkel összesíthető és fedezhető egy kötvényportfólió kamatkockázata.

## Konvexitás

Az érintő nem veszi figyelembe a görbe hajlását. Még egyszer deriválva

$$
\frac{d^2P}{dy^2} = \sum_{t=1}^{T} t(t+1)\,\frac{CF_t}{(1+y)^{t+2}} > 0,
$$

a **konvexitás** pedig ez a második derivált egységnyi árra vetítve:

$$
C = \frac{1}{P}\,\frac{d^2P}{dy^2}.
$$

A másodrendű Taylor-közelítés ekkor

$$
\frac{\Delta P}{P} \approx -D_{mod}\,\Delta y + \tfrac{1}{2}\,C\,(\Delta y)^2.
$$

Ez a delta-fedezés $\tfrac{1}{2}\Gamma(dS)^2$ gammatagjának megfelelője. Mivel $C > 0$ és $(\Delta y)^2 \ge 0$, a korrekció mindig pozitív: ha a hozamok esnek, a kötvény többet nyer, mint amit a duráció jósol, ha emelkednek, kevesebbet veszít. Két azonos árú és durációjú kötvény közül a tulajdonos a nagyobb konvexitásút választja, és a piacon ezt a többletvédelmet általában valamivel alacsonyabb hozammal fizetik meg. A konvexitás nagyjából a lejárat négyzetével nő, ezért hosszú kötvényeknél és nagy hozammozgásoknál számít igazán.

## Számpélda

Legyen $c = 5\%$, $T = 10$, $y_0 = 5\%$. A kötvény névértéken forog, $P_0 = 100$. A súlyozott kifizetési időket összegezve

$$
D \approx 8{,}108, \qquad D_{mod} = \frac{8{,}108}{1{,}05} \approx 7{,}722, \qquad C \approx 75{,}0.
$$

A pénzben mért duráció kb. 772, így egy bázispont kb. 0,077-tel mozdítja az árat.

### Kidolgozott példa: 100 bázispontos emelkedés konvexitással és anélkül

1. Csak durációval: a relatív árváltozás a módosított duráció ellentettje szorozva a $\Delta y = 0{,}01$ hozamváltozással.
   $$-D_{mod}\,\Delta y = -7{,}722 \times 0{,}01$$ → **-7.72%**
2. A konvexitási korrekció a konvexitás fele szorozva a hozamváltozás négyzetével.
   $$\tfrac{1}{2}\,C\,(\Delta y)^2 = \tfrac{1}{2} \times 75{,}0 \times 0{,}0001$$ → **0.375%**
3. A kettő összege a másodrendű becslés, amely közel van a valódi $-7{,}36\%$-os változáshoz.
   $$\frac{\Delta P}{P} \approx -7{,}722\% + 0{,}375\%$$ → **-7.35%**

Most toljuk el a hozamot egy százalékponttal mindkét irányba:

- $\Delta y = +1\%$: a valódi ár 92,64, a változás $-7{,}36$. A duráció egyedül $-7{,}72$-t jósol; konvexitással $100\,(-0{,}07722 + \tfrac{1}{2}\cdot 75{,}0 \cdot 0{,}0001) \approx -7{,}35$.
- $\Delta y = -1\%$: a valódi ár 108,11, a változás $+8{,}11$. A duráció egyedül $+7{,}72$-t jósol; konvexitással $+8{,}10$.

Az érintő túlbecsüli a veszteséget és alulbecsüli a nyereséget, kb. 0,36-tal, illetve 0,39-cel; a $\tfrac{1}{2}C(\Delta y)^2 P_0 \approx 0{,}375$ konvexitási tag szinte a teljes különbséget eltünteti. Összehasonlításképp egy 10 éves zérókuponos kötvényre 5%-on $D = 10$ és $D_{mod} \approx 9{,}52$: mivel nincs kupon, amely előrébb húzná a súlypontot, érzékenyebb a kuponos kötvénynél.

Az ábra a valódi árat mutatja $y_0$ körül ±4 százalékponton belüli hozamokra, a $P_0(1 - D_{mod}\Delta y)$ durációs (érintő) és a $P_0(1 - D_{mod}\Delta y + \tfrac{1}{2}C\Delta y^2)$ durációs-konvexitási közelítéssel együtt. A kijelzők $D$-t, $D_{mod}$-ot, $C$-t, valamint $\Delta y = \pm 1\%$ esetén a valódi árváltozást és mellette a két közelítést mutatják. Figyeld meg, hogy az érintő mindig a valódi görbe alatt marad. Növeld $T$-t: a duráció és a konvexitás nő, az érintő gyorsabban távolodik a görbétől; csökkentsd $c$-t 0 felé, és a Macaulay-duráció $T$-hez közelít.

*[Interaktív ábra: duration convexity](https://quantsandbox.dev/hu/guide/fixed-income/duration-convexity)*

## A duráció mint egyensúlyi pont

Tegyük minden pénzáramot egy mérlegrúdra a kifizetés időpontjába, a jelenértékével megegyező súllyal. A Macaulay-duráció az a pont, ahol a rúd egyensúlyban van, hiszen ez a jelenértékkel súlyozott átlagos idő. Az ábrán emeld a hozamot, és figyeld, ahogy az alátámasztási pont a jelen felé csúszik: a távoli kifizetéseket erősebben diszkontáljuk, így kisebb a súlyuk. Állítsd a kupont nullára: az alátámasztás pontosan a lejáratnál van, ahogy minden zérókuponos kötvénynél.

*[Interaktív ábra: duration balance](https://quantsandbox.dev/hu/guide/fixed-income/duration-convexity)*

## Összefoglalás

- A $D$ Macaulay-duráció a kötvény pénzáramlásainak jelenértékkel súlyozott átlagos időpontja; zérókuponos kötvényre a lejárattal egyenlő.
- A $D_{mod} = D/(1+y)$ módosított duráció az elsőrendű árváltozást adja, $\Delta P/P \approx -D_{mod}\Delta y$: ez az ár–hozam görbe érintője.
- A $C = P^{-1}\,d^2P/dy^2$ konvexitás hozzáadja a $\tfrac{1}{2}C(\Delta y)^2$ másodrendű tagot, amely mindig a tulajdonosnak kedvez.
- A $D_{mod}P$ pénzben mért duráció az egységnyi hozamváltozásra jutó kockázatot méri, és portfólión belül összeadódik.

> A duráció minden pénzáramlást ugyanazzal a hozammal diszkontál, ezért párhuzamos eltolódást mér. A következő lecke minden lejáratnak saját kamatlábat ad.

[Hasonlítsd össze a valódi árváltozást a közelítésekkel a Duráció és konvexitás laborban](https://quantsandbox.dev/hu/duration-convexity)

## Interaktív laborok

- [Kötvény durációja és konvexitása: közelítések](https://quantsandbox.dev/hu/duration-convexity)
- [Kötvényárazó kalkulátor és ár–hozam görbe](https://quantsandbox.dev/hu/bond-pricing)

## Gyakorló kérdések

### 1. Egy kötvény Macaulay-durációja 4,2 év, hozama évi 5% éves kamatozással. Mekkora a módosított durációja?

**Válasz:** 4

$D_{mod} = D/(1+y) = 4{,}2/1{,}05 = 4{,}0$. Egy százalékpontos hozamemelkedés kb. 4%-kal csökkenti az árat.

### 2. A hozamok nagyot mozdulnak, felfelé vagy lefelé. A csak durációs becsléshez képest hol van egy egyszerű fix kamatozású kötvény valódi ára?

- a) Mindig fölötte
- b) Mindig alatta
- c) Hozamesésnél fölötte, hozamemelkedésnél alatta
- d) Pontosan egyenlő vele

**Válasz:** a) Mindig fölötte

Az $\tfrac{1}{2}C(\Delta y)^2$ konvexitási tag $\Delta y$ bármely előjelénél pozitív, ezért a valódi ár az érintő fölött van: hozamesésnél a kötvény többet nyer, hozamemelkedésnél kevesebbet veszít, mint a becslés.

---

Forrás: https://quantsandbox.dev/hu/guide/fixed-income/duration-convexity

Előző lecke: [Kötvényárak és hozamok](https://quantsandbox.dev/hu/guide/fixed-income/bond-pricing)

Következő lecke: [Immunizáció és durációillesztés](https://quantsandbox.dev/hu/guide/fixed-income/immunization)
