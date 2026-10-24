# Reálopciók: a rugalmasság értéke

A várakozás, bővítés és kilépés lehetősége mint opció, értékelése binomiális fán, és a bővített NPV.

A „Nettó jelenérték és belső megtérülési ráta” és a „Diszkontált pénzáram alapú értékelés” című lecke úgy értékelt egy projektet, mintha a terve ma rögzülne. A valódi vezetők várhatnak, bővíthetnek, visszaléphetnek vagy leállíthatják a projektet, ahogy újabb információ érkezik. Ez a lecke ennek a rugalmasságnak az értékét határozza meg a „Többlépéses fák és visszafelé indukció” lecke binomiális fájával és az „Amerikai opciók és korai lehívás” lecke korai lehívásról szóló gondolatmenetével.

## Rugalmasság a beruházási döntésekben

A statikus NPV-szabály a projekt pénzáramainak $V$ jelenértékét veti össze az $I$ beruházással, és akkor fogadja el a projektet, ha $V - I > 0$. A döntést **most vagy soha** jellegűnek tekinti: vagy ma beruházunk a jelenlegi terv szerint, vagy végleg elvetjük a projektet. A legtöbb valódi projekt nem ilyen. Egy engedély vagy telek birtokában a vállalat általában **elhalaszthatja** a beruházást, **bővítheti** a kapacitást, ha a kereslet erősnek bizonyul, **felhagyhat** a projekttel és eladhatja az eszközöket, ha rosszul alakul, vagy **válthat** az alapanyagok vagy a termékek között. Mindegyik jog kötelezettség nélkül, ezért mindegyiknek opciós kifizetésszerkezete van. A reáleszközökre szóló ilyen opciókat **reálopcióknak** nevezzük.

## Projekt mint opció

Vegyük a projektbe való beruházás jogát. A jog gyakorlása azt jelenti, hogy kifizetjük $I$-t, és egy $V$ értékű projektet kapunk, a kifizetés tehát $(V - I)^+$, egy call kifizetése. Az elemek így feleltethetők meg egymásnak:

- Alaptermék: a projekt pénzáramainak $V$ jelenértéke, vagyis az, amit egy DCF-értékelés kiszámol.
- Kötési ár: az $I$ beruházási költség.
- Lejárat ($T$): meddig áll nyitva a lehetőség (engedély időtartama, szabadalom élettartama, telekbérlet).
- Volatilitás ($\sigma$): $V$ bizonytalansága, vagyis hogy mennyit változhat a projekt értéke egy év alatt.
- Osztalékhozam ($\delta$): azok a pénzáramok $V$-hez viszonyított hozamként, amelyeket a projekt már termelne, amíg a vállalat vár. A várakozással ezek elvesznek.

Mivel a vállalat $T$-ig bármikor beruházhat, a halasztási opció egy $V$-re szóló, $I$ kötési árú **amerikai call**.

## Mikor éri meg várni

$\delta = 0$ esetén az „Amerikai opciók és korai lehívás” lecke érvelése átvihető. A $t$ időpontban beruházva $V_t - I$-t kapunk, a jog megtartása viszont legalább $V_t - Ie^{-r(T-t)}$-t ér, ami nagyobb: a várakozás későbbre tolja $I$ kifizetését, és megőrzi a védelmet $V$ esése ellen. Elmaradó pénzáramok nélkül tehát sosem optimális $T$ előtt beruházni.

$\delta > 0$ esetén a várakozásnak ára van. Egy már működő projekt évente nagyjából $\delta V$-t fizet, a váró vállalat ebből semmit sem kap meg. Ha a projekt mélyen pénzben van, $V$ csak kis eséllyel esik $I$ alá, így a védelem keveset ér, az elmaradó $\delta V$ pénzáram viszont nagy, mert $V$ nagy. Ilyenkor az azonnali beruházás jobb a várakozásnál, ahogy egy nagy osztalék is optimálissá teheti egy amerikai call korai lehívását.

## Értékelés binomiális fán

Osszuk a $[0, T]$ intervallumot $n$ darab $\Delta t = T/n$ hosszú lépésre. A „Többlépéses fák és visszafelé indukció” leckéhez hasonlóan $V$ minden lépésben $u = e^{\sigma\sqrt{\Delta t}}$-szeresére nő vagy $d = 1/u$-szorosára csökken. Az elmaradó pénzáramok $V$ kockázatsemleges növekedését $r$-ről $r - \delta$-ra csökkentik, így a kockázatsemleges valószínűség

$$
q = \frac{e^{(r-\delta)\Delta t} - d}{u - d}.
$$

Lejáratkor a lehetőség értéke $(V_T - I)^+$. Minden korábbi csomópontban a vállalat összeveti az azonnali beruházást az egy lépéssel további várakozással, és a visszafelé indukció a kettő közül a jobbat tartja meg:

$$
F = \max\Big(V - I,\; e^{-r\Delta t}\big[q\,F_{\text{fel}} + (1-q)\,F_{\text{le}}\big]\Big).
$$

A gyökérben kapott $F_0$ a beruházási lehetőség értéke, a **kiterjesztett NPV**. Egy most-vagy-soha döntés $\max(V_0 - I, 0)$-t ér, hiszen a negatív NPV-jű projektet egyszerűen elvetjük. A kettő különbsége a rugalmasság értéke.

> Kiterjesztett NPV = most-vagy-soha érték + a rugalmasság értéke, ahol a most-vagy-soha érték $\max(V_0 - I, 0)$. Egyes tankönyvek a kiterjesztett NPV = statikus NPV + opciós prémium alakot használják; negatív statikus NPV esetén ez a prémium a nulla alatti hiányt is fedezi.

## Számpélda

Legyen $V_0 = 100$, $I = 105$, $\sigma = 30\%$, $r = 5\%$, $\delta = 4\%$ és $T = 3$ év, évente egy lépéssel ($\Delta t = 1$). Ekkor $u = e^{0{,}3} \approx 1{,}3499$, $d \approx 0{,}7408$, az egylépéses diszkontfaktor $e^{-0{,}05} \approx 0{,}9512$, és

$$
q = \frac{e^{0{,}01} - 0{,}7408}{1{,}3499 - 0{,}7408} \approx 0{,}4421.
$$

A statikus NPV $100 - 105 = -5$, a most-vagy-soha szabály tehát elveti a projektet. A fa mást mutat.

- 3. év: $V$ értéke 245,96, 134,99, 74,08 vagy 40,66. A lehetőség $(V - 105)^+$-t ér: 140,96, 29,99, 0 és 0.
- 2. év, $V = 182{,}21$: a várakozás értéke $0{,}9512\,(0{,}4421 \cdot 140{,}96 + 0{,}5579 \cdot 29{,}99) \approx 75{,}19$, az azonnali beruházás 77,21-et ad. **Beruházunk.** Az utolsó évben elmaradó pénzáram, nagyjából $182{,}21\,(1 - e^{-0{,}04}) \approx 7{,}14$, több, mint az $I$ halasztásán megtakarított kamat, ami körülbelül 5,12.
- 2. év, $V = 100$: a várakozás 12,61-et ér, szemben a mostani $-5$-tel, tehát várunk. $V = 54{,}88$ mellett a lehetőség értéktelen.
- 1. év, $V = 134{,}99$: a várakozás $0{,}9512\,(0{,}4421 \cdot 77{,}21 + 0{,}5579 \cdot 12{,}61) \approx 39{,}16$, a mostani beruházás 29,99, tehát várunk. $V = 74{,}08$ mellett a várakozás 5,30-at ér, várunk.
- 0. év: a várakozás $0{,}9512\,(0{,}4421 \cdot 39{,}16 + 0{,}5579 \cdot 5{,}30) \approx 19{,}28$, a mostani beruházás $-5$, tehát várunk.

A kiterjesztett NPV 19,28. Az a projekt, amelyet a statikus szabály elvet, értékes lehetőség, feltéve, hogy a vállalat megtartja a várakozás jogát. A teljes 19,28 a rugalmasság értéke.

### Kidolgozott példa: A fa bemenetei és a kiterjesztett NPV

1. A felfelé szorzó egyéves lépésekre, $\sigma = 30\%$ mellett.
   $$u = e^{0{,}3}$$ → **1.3499**
2. A lefelé szorzó, ennek reciproka.
   $$d = 1/u$$ → **0.7408**
3. A kockázatsemleges valószínűség; $V$ növekedését a $\delta = 4\%$-os elmaradó hozam csökkenti.
   $$q = \frac{e^{0{,}05 - 0{,}04} - d}{u - d}$$ → **0.4421**
4. A 3. évtől visszafelé haladva, minden csúcsban a beruházás és a várakozás közül a nagyobbat megtartva, megkapjuk a gyökér értékét.
   $$F_0 = \max\big(V_0 - I,\; e^{-r}[q\,F_{\text{fel}} + (1-q)\,F_{\text{le}}]\big)$$ → **19.28**

Az ábra ugyanezt a helyzetet mutatja: $V_0 = 100$, $r = 5\%$, háromlépéses fa $T = 3$ évre. A csúszkák az $I$ beruházási költséget (60 és 140 között), a $\sigma$ volatilitást (10% és 60% között) és az elmaradó pénzáramok $\delta$ hozamát (0% és 10% között) állítják. A grafikon a $V_0 - I$ statikus NPV-t és a kiterjesztett NPV-t mutatja $I$ függvényében 60 és 140 között, a választott $I$-nél függőleges vonallal. A kijelzők a statikus NPV-t, a kiterjesztett NPV-t, a rugalmasság értékét (a kiterjesztett NPV mínusz $\max(V_0 - I, 0)$) és a mai döntést mutatják. Állítsd $\delta$-t nullára, és figyeld meg, hogy a kiterjesztett NPV minden $I$ mellett a statikus fölött marad, vagyis a várakozásnak mindig van értéke. Növeld $\delta$-t és csökkentsd $I$-t, hogy megtaláld azt a tartományt, ahol az azonnali beruházás az optimális. Növeld $\sigma$-t, és nézd, hogyan emelkedik el a kiterjesztett NPV görbéje a statikus egyenestől.

*[Interaktív ábra: real option tree](https://quantsandbox.dev/hu/guide/corporate/real-options)*

## Bővítési opció

Tegyük fel, hogy egy további $I_e$ kifizetésével a vállalat $x$ hányaddal növelheti a projektet, így $V$-ből $(1 + x)V$ lesz. Egy olyan időpontban, amikor az opció lehívható, a projekt az opcióval együtt $\max\big(V,\,(1+x)V - I_e\big) = V + (xV - I_e)^+$-t ér. A bővítés joga tehát egy $xV$-re szóló, $I_e$ kötési árú call, amely ugyanazon a fán értékelhető úgy, hogy a döntési csomópontokban hozzáadjuk ezt a tagot. Pontosan azokban az állapotokban fizet, ahol a kereslet erősnek bizonyult.

## Felhagyási opció

Ha a vállalat leállíthatja a projektet, és $A$ **likvidációs értékért** eladhatja az eszközeit, akkor minden döntési időpontban a projekt értéke $\max(V, A) = V + (A - V)^+$. A felhagyás joga tehát egy $V$-re szóló, $A$ kötési árú **put**. A lefelé irányuló kockázatot korlátozza: rossz állapotokban a vállalat $A$-val távozik ahelyett, hogy egy kevesebbet érő projektet tartana meg. A fán minden csomópont a továbbvitel értékének és $A$-nak a nagyobbikát veszi.

## Az analógia korlátai

Az opcióárazás a replikáláson alapul: az opció kifizetése lemásolható az alaptermékkel kereskedve, és ez rögzíti az árat. A projekt $V$ értékével viszont nem kereskednek, így ilyen portfólió általában nem létezik. A fenti kockázatsemleges értékelés ezért közelítés, amely akkor indokolt, ha van olyan kereskedett eszköz (nyersanyag, azonos ágazatban működő tőzsdei cég), amely szorosan együtt mozog $V$-vel. A bemenetek is nehezebben becsülhetők, mint egy részvényopciónál: $\sigma$-t és $\delta$-t előrejelzésekből kell kikövetkeztetni, és a versenytársak $T$ előtt elvihetik a lehetőséget.

## Összefoglalás

- A statikus NPV most-vagy-soha döntést feltételez; a halasztás, bővítés, felhagyás vagy váltás joga a projekt $V$ értékére szóló opció.
- A halasztási opció $V$-re szóló, $I$ kötési árú amerikai call; az elmaradó pénzáramok $\delta$ hozama az osztalékhozam szerepét játssza.
- $\delta = 0$ mellett a korai beruházás sosem optimális; $\delta > 0$ mellett mélyen pénzben lévő projektnél az azonnali beruházás lehet optimális.
- A $q = (e^{(r-\delta)\Delta t} - d)/(u - d)$ valószínűségű binomiális fán minden csomópont az azonnali beruházás és a várakozás maximumát veszi; a gyökérbeli érték a kiterjesztett NPV.
- A bővítés call, a felhagyás put $V$-re; mivel $V$-vel nem kereskednek, az értékelés közelítés.

[Értékeld egy projekt bővítési opcióját az NPV és IRR labor Reálopciók lapján](https://quantsandbox.dev/hu/npv-irr)

## Interaktív laborok

- [NPV- és IRR-kalkulátor NPV-profillal](https://quantsandbox.dev/hu/npv-irr)

## Gyakorló kérdések

### 1. Egy vállalat hároméves engedéllyel rendelkezik egy üzem megépítésére. A várakozás nem jár elmaradó pénzárammal ($\delta = 0$), és ma $V > I$. Mikor érdemes beruháznia?

- a) Most, mert a statikus NPV pozitív.
- b) Az engedély lejárta előtt nem; akkor pedig, ha $V_T > I$.
- c) Amint $V$ legalább $\sigma V$-vel meghaladja $I$-t.
- d) Soha: $\delta = 0$ mellett az opció értéktelen.

**Válasz:** b) Az engedély lejárta előtt nem; akkor pedig, ha $V_T > I$.

$\delta = 0$ mellett a halasztási opció olyan, mint egy osztalékot nem fizető részvényre szóló amerikai call. A jog megtartása legalább $V_t - Ie^{-r(T-t)}$-t ér, többet, mint a mostani beruházás $V_t - I$ értéke, így $T$ előtt sosem optimális beruházni.

### 2. Évente egy lépéses fán $\sigma = 25\%$, $r = 5\%$ és $\delta = 1\%$. Mekkora a felfelé lépés $q$ kockázatsemleges valószínűsége?

**Válasz:** 0.5186

$u = e^{0{,}25} \approx 1{,}2840$ és $d = 1/u \approx 0{,}7788$, így $q = (e^{0{,}04} - 0{,}7788)/(1{,}2840 - 0{,}7788) \approx 0{,}2620/0{,}5052 \approx 0{,}519$.

---

Forrás: https://quantsandbox.dev/hu/guide/corporate/real-options

Előző lecke: [Relatív értékelés szorzókkal](https://quantsandbox.dev/hu/guide/corporate/valuation-multiples)
