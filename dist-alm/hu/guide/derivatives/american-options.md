# Amerikai opciók és korai lehívás

Korai lehívás a fában, miért nem éri meg korán lehívni az osztalékot nem fizető részvényre szóló callt, a put korai lehívási prémiuma és a lehívási határ.

Az eddig árazott opciókat csak lejáratkor lehetett lehívni. Sok kereskedett opció, köztük az egyedi részvényekre szóló opciók többsége, a lejáratig bármikor lehívható. Ez a lecke a „Többlépéses fák és visszafelé indukció” lecke fájával árazza ezt a többletjogot, megmutatja, miért értéktelen osztalékot nem fizető részvényre szóló callnál, és miért értékes putnál, végül azt, hogyan változik a „Put–call paritás”.

## Európai és amerikai lehívás

Az **európai** opció csak a $T$ lejáratkor hívható le. Az **amerikai** opció bármely $t \le T$ időpontban lehívható. Egy call lehívása a $t$ időpontban $S_t - K$-t fizet, egy puté $K - S_t$-t. Ez az összeg az opció **belső értéke** a $t$ időpontban: callnál $(S_t - K)^+$, putnál $(K - S_t)^+$.

A lecke végig osztalékot nem fizető részvényt feltételez, és $r$ a folytonos kamatozású kockázatmentes kamatláb.

A definícióból rögtön két egyenlőtlenség adódik. Az amerikai opció minden jogot megad, amit az európai, és még többet is, ezért legalább annyit ér. Az amerikai opció ráadásul bármikor azonnal lehívható, így legalább a belső értékét éri. Ha ennél olcsóbban forogna, megvenni és azonnal lehívni arbitrázs lenne.

$$
V^{\text{Am}}_t \ \ge\ V^{\text{Eu}}_t, \qquad V^{\text{Am}}_t \ \ge\ \text{belső érték } t\text{-ben}.
$$

## Visszafelé indukció korai lehívással

Egy fában az amerikai opció tulajdonosa minden csomópontban eldönti, lehív-e. A lehívás a belső értéket adja. Ha nem hív le, az opció még egy lépésig él, ennek értéke a két utód értékének diszkontált kockázatsemleges átlaga, a **továbbtartási érték**. Az észszerű tulajdonos a kettő közül a nagyobbat választja. A visszafelé indukció ezért egyetlen ponton változik:

$$
V_{i,j} = \max\Big( \underbrace{(K - S_{i,j})^+}_{\text{lehívás}},\ \underbrace{e^{-r\Delta t}\big[q\,V_{i+1,j+1} + (1-q)\,V_{i+1,j}\big]}_{\text{továbbtartás}} \Big),
$$

itt putra felírva, a korábbi $q = (e^{r\Delta t} - d)/(u - d)$ valószínűséggel. Lejáratkor az érték a kifizetés. Azok a csomópontok, ahol a lehívás értéke a nagyobb, alkotják a **lehívási tartományt**: ha az árfolyam ilyen csomópontba jut, a tulajdonos ott lehív.

> **Amerikai opció a fában.** Minden csomópontban a belső érték és a továbbtartási érték közül a nagyobbat vesszük. Ahol a belső érték nyer, ott az opciót lehívják.

## Kidolgozott példa

Vegyük a „Többlépéses fák és visszafelé indukció” lecke kétlépéses fáját: $S_0 = 100$, $T = 1$, $\sigma = 20\%$, $r = 5\%$, $n = 2$, így $u \approx 1{,}1519$, $d \approx 0{,}8681$, $q \approx 0{,}5539$, az egylépéses diszkontfaktor pedig $e^{-0{,}025} \approx 0{,}9753$. Árazzunk egy $K = 100$ kötési árú putot.

1. Lejárati árak: $100u^2 \approx 132{,}69$, $100$, $100d^2 \approx 75{,}36$. A put kifizetései: $0$, $0$, $24{,}64$.
2. Felső csomópont egy lépés után ($S \approx 115{,}19$): mindkét utód 0-t fizet, így a továbbtartási érték 0, és a belső érték is 0.
3. Alsó csomópont egy lépés után ($S \approx 86{,}81$): a továbbtartási érték $0{,}9753\,(0{,}5539\cdot 0 + 0{,}4461\cdot 24{,}64) \approx 10{,}72$. A belső érték $100 - 86{,}81 = 13{,}19$. A lehívás nyer, így a csomópont értéke $13{,}19$.
4. Gyökér, amerikai: $0{,}9753\,(0{,}5539\cdot 0 + 0{,}4461\cdot 13{,}19) \approx 5{,}74$. A gyökérben a belső érték 0, így a tulajdonos vár.
5. Gyökér, európai: ugyanez a számítás $13{,}19$ helyett $10{,}72$-vel $\approx 4{,}66$-ot ad.

A korai lehívás joga ebben a durva fában $5{,}74 - 4{,}66 = 1{,}07$-et ér. Ez teljes egészében az alsó csomópontból származik, ahol az árfolyam annyira esett, hogy a $K - S$ azonnali felvétele jobb a várakozásnál.

Az alábbi ábra ugyanezt a fát rajzolja meg csomópontról csomópontra. Minden csomópont az $S$ árfolyamot és a put $P$ értékét mutatja; kiemelve azok a csomópontok látszanak, ahol a lehívás most jobb a várakozásnál. Válassz 2 lépést, és kattints az egy lépés utáni alsó csomópontra: a panel kiírja a továbbtartási értéket, $0{,}9753\,(0{,}5539\cdot 0 + 0{,}4461\cdot 24{,}64) \approx 10{,}72$, a $13{,}19$-es belső értéket és a kettő maximumát. Állítsd a szabályt európaira: ez a csomópont visszaesik a továbbtartási értékére, így a gyökér értéke $5{,}74$-ről $4{,}66$-ra csökken. Több lépésnél a fa alján egyre több csomópontban éri meg lehívni, és a prémium kijelzője mutatja, mennyit ér a jog az adott fán (például 3 lépésnél $0{,}33$, 4 lépésnél $0{,}79$); a durva fák értéke ugrál, mielőtt beállna, ahogy a „Többlépéses fák és visszafelé indukció” leckében is láttuk.

*[Interaktív ábra: american tree](https://quantsandbox.dev/hu/guide/derivatives/american-options)*

Ismételjük meg a számítást ugyanazon a fán magasabb, $K = 105$-ös kötési árral.

### Kidolgozott példa: Amerikai és európai put K = 105 mellett a kétlépéses fán

1. A put kifizetése a legalsó lejárati csomópontban, ahol $S = 100d^2$.
   $$K - 100d^2$$ → **29.64**
2. A felső csomópont egy lépés után: a továbbtartási érték (a belső érték 0, mert $S > K$).
   $$e^{-r\Delta t}\big[q \cdot 0 + (1-q)(K - 100)\big]$$ → **2.18**
3. Az alsó csomópont: a továbbtartási érték.
   $$e^{-r\Delta t}\big[q\,(K - 100) + (1-q)(K - 100d^2)\big]$$ → **15.6**
4. Az alsó csomópont belső értéke, amely felülmúlja a továbbtartási értéket, így ott lehívják a putot.
   $$K - 100d$$ → **18.19**
5. Az amerikai put a gyökérben (a belső érték, 5, kisebb, ezért a tulajdonos vár).
   $$e^{-r\Delta t}\big[q\,V_u + (1-q)\,V_d\big]$$ → **9.09**
6. Az európai put a gyökérben, az alsó csomópont továbbtartási értékével számolva.
   $$e^{-r\Delta t}\big[q\,C_u + (1-q)\,C_d\big]$$ → **7.96**

## A call korai lehívása nem éri meg

Osztalékot nem fizető részvényre szóló callnál a többletjog értéktelen. Az európai callt alulról a „Put–call paritás” leckében levezetett arbitrázsmentes korlát határolja:

$$
C^{\text{Eu}}_t \ \ge\ S_t - K e^{-r(T-t)} \ >\ S_t - K \qquad (r > 0,\ t < T).
$$

Tehát már az európai call is, amely $T$ előtt le sem hívható, többet ér annál az $S_t - K$-nál, amelyet a korai lehívás adna. A call eladása mindig jobb a lehívásánál, így az amerikai call ára megegyezik az európaiéval. Az ok az, hogy a korai lehívás a szükségesnél hamarabb fizeti ki $K$-t, ami kamatveszteség, és lemond arról a védelemről, amelyet az opció az árfolyam esése esetén nyújt.

Putnál a kamatérv fordítva működik. A korai lehívás hamarabb *kapja meg* $K$-t, és a pénz onnantól kamatozik. Ha az árfolyam jóval a kötési ár alatt van, $K$ kamata többet ér a további esés maradék esélyénél, és a korai lehívás optimális. A $P^{\text{Am}} - P^{\text{Eu}}$ **korai lehívási prémium** ezért putnál pozitív.

## A lehívási határ

Amerikai putnál a lehívási tartomány minden $t$ időpontban egy $S^*(t)$ kritikus szint alatti árfolyamokból áll, ez a **lehívási határ**. $S^*(t)$ fölött a tulajdonos vár, azon vagy alatta lehív. A határ $K$ alatt fekszik, és $t$ a $T$-hez közeledve $K$ felé emelkedik, mert kevés hátralévő idő mellett kevés ok van a várakozásra. Zárt képlet nem adja meg; a fa numerikusan találja meg, a lehívási és a továbbtartási csomópontok választóvonalaként.

## Put–call paritás amerikai opciókra

A $C - P = S_0 - Ke^{-rT}$ paritás azon múlik, hogy mindkét opciót lejáratig tartjuk. Korai lehívás mellett az egyenlőségből két korlát lesz. Osztalékot nem fizető részvényre

$$
S_0 - K \ \le\ C^{\text{Am}} - P^{\text{Am}} \ \le\ S_0 - K e^{-rT}.
$$

A jobb oldali egyenlőtlenség azért teljesül, mert $C^{\text{Am}} = C^{\text{Eu}}$ és $P^{\text{Am}} \ge P^{\text{Eu}}$. Példa a fenti paraméterekkel, $K = 100$ mellett, 100 lépéses fával: $C \approx 10{,}43$ és $P^{\text{Am}} \approx 6{,}08$, így $C - P^{\text{Am}} \approx 4{,}35$, ami $0$ és $100 - 100e^{-0{,}05} \approx 4{,}88$ közé esik.

## Az európai és az amerikai put összevetése

Az ábra mindkét putot 100 lépéses CRR-fán árazza, $S_0 = 100$, $r = 5\%$ és $T = 1$ mellett. Az európai és az amerikai put értékét ábrázolja az árfolyam függvényében 50 és 150 között, a $(K - S)^+$ kifizetéssel együtt, $S_0 = 100$-at pedig folytonos vonal jelöli. A csúszkák a $K$ kötési árat és a $\sigma$ volatilitást állítják. A kijelzők $S_0 = 100$-nál mutatják a két put értékét, a különbségüket és az $S^*$ **kritikus árat**: azt a legmagasabb árfolyamot, amelynél az amerikai put értéke egyenlő a kifizetésével, vagyis a mai lehívás optimális. Ez az előző szakasz $S^*(t)$ lehívási határa, mai időpontban leolvasva. Az alapbeállítással ($K = 100$, $\sigma = 20\%$) az európai put nagyjából 5,55-öt, az amerikai nagyjából 6,08-at ér, a prémium körülbelül 0,53, és $S^* \approx 81{,}6$. $S^*$ alatt az amerikai görbe a kifizetési vonalon halad, az európai görbe pedig a kifizetés alá süllyed. Emeljük $K$-t 120-ra, és figyeljük meg, hogy a prémium nagyjából 2,73-ra nő, $S^*$ pedig körülbelül 98-ra emelkedik, mert a put mélyen pénzben van, és $K$ kamata többet számít. Ha inkább $\sigma$-t növeljük, $S^*$ csökken: nagyobb volatilitás mellett többet ér kivárni egy további esést.

*[Interaktív ábra: american boundary](https://quantsandbox.dev/hu/guide/derivatives/american-options)*

## Összefoglalás

- Az amerikai opció bármikor lehívható; legalább annyit ér, mint az európai, és legalább a belső értékét.
- A fában minden csomópont a belső érték és a diszkontált kockázatsemleges továbbtartási érték közül a nagyobbat veszi fel.
- Osztalékot nem fizető részvényre szóló amerikai callt sosem éri meg korán lehívni, így ára az európaiéval egyezik; az amerikai put többet érhet az európainál.
- A put korai lehívása egy $S^*(t) < K$ lehívási határ alatt optimális, amely a lejárat felé $K$-hoz emelkedik.
- A put–call paritásból az $S_0 - K \le C^{\text{Am}} - P^{\text{Am}} \le S_0 - Ke^{-rT}$ korlátpár lesz.

[Opciók árazása többlépéses fán a Binomiális laborban](https://quantsandbox.dev/hu/binomial)

## Interaktív laborok

- [Binomiális opcióárazó fa kalkulátor](https://quantsandbox.dev/hu/binomial)

## Gyakorló kérdések

### 1. A fa egy csomópontjában $S = 80$, az amerikai put kötési ára $K = 100$, a továbbtartási érték $18{,}5$. Mennyit ér az opció ebben a csomópontban?

**Válasz:** 20

A csomópont értéke a belső érték, $100 - 80 = 20$, és a $18{,}5$-es továbbtartási érték közül a nagyobb, tehát 20, és a putot ott lehívják.

### 2. Miért nem hívják le soha korán az osztalékot nem fizető részvényre szóló amerikai callt?

- a) Mert már az európai call is legalább $S_t - Ke^{-r(T-t)} > S_t - K$ értékű, így eladni jobb, mint lehívni.
- b) Mert a callok általában kívül vannak a pénzen.
- c) Mert a szerződés tiltja a lejárat előtti lehívást.
- d) Mert a call deltája 1 alatt van.

**Válasz:** a) Mert már az európai call is legalább $S_t - Ke^{-r(T-t)} > S_t - K$ értékű, így eladni jobb, mint lehívni.

A lehívás korán fizeti ki $K$-t, ezért elvész a kamata, és elvész a zuhanás elleni védelem is. A put–call paritásból adódó arbitrázsmentes korlát miatt az élő opció többet ér $S_t - K$-nál.

---

Forrás: https://quantsandbox.dev/hu/guide/derivatives/american-options

Előző lecke: [Többlépéses fák és visszafelé indukció](https://quantsandbox.dev/hu/guide/derivatives/multi-step-trees)

Következő lecke: [Delta és fedezés](https://quantsandbox.dev/hu/guide/derivatives/delta-hedging)
