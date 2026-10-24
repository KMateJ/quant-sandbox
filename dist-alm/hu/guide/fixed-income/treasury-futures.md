# Kötvényfutures és a legolcsóbban szállítható kötvény

Szállítható kosár, konverziós faktor, számlázási ár, nettó szállítási költség, és miért vált a legolcsóbban szállítható kötvény a hozammal.

A kötvény-határidős ügylet (kötvényfutures) egy tőzsdén kereskedett határidős ügylet államkötvényre. Különlegessége, hogy az eladó egy listáról választhatja ki, melyik kötvényt szállítja. Ez a lecke bemutatja, hogyan teszi összehasonlíthatóvá a tőzsde a különböző kötvényeket konverziós faktorokkal, mit fizet és mit kap ténylegesen az eladó a szállításkor, és miért változik a legolcsóbban szállítható kötvény, amikor a hozamok elmozdulnak. A „Kötvényárak és hozamok”, a „Duráció és konvexitás” és az „Arbitrázs és a határidős ár” című leckékre épül.

## Kötvény-határidős ügyletek

A **kötvényfutures** arra kötelezi az eladót (a short felet), hogy egy rögzített napon, a **szállítási napon**, államkötvényt szállítson a vevőnek (a long félnek) egy ma rögzített áron. Mint minden határidős ügyletnél, a megkötéskor nem cserél gazdát semmi; a jegyzett **határidős ár** $F$ az az ár, amelyen a szállítás történik. Ebben a témakörben a kötvények névértéke 100, így $F$ itt mindig a határidős árat jelöli, 100 névértékre vetítve.

A tőzsde egyetlen részlet kivételével mindent szabványosít. Egyetlen kötvény megnevezése helyett a szerződés egy **szállítható kosarat** ad meg: minden olyan államkötvényt, amelynek hátralévő futamideje egy adott sávba esik, például 8,5 és 10,5 év közé egy tízéves szerződésnél. Hogy a kosárból melyik kötvényt szállítja, azt az eladó dönti el. Ez a választás a **szállítási opció**, és az eladót illeti.

## A névleges kötvény és a konverziós faktorok

A kosárban lévő kötvények kuponja és lejárata különbözik, ezért az áruk is nagyon eltérő. Egy 7%-os kötvény sokkal többet ér, mint egy hasonló lejáratú 3%-os. Ha mindkettőért ugyanannyit kellene fizetni, a választás triviális lenne. A tőzsde ezért egy rögzített kuponú **névleges kötvényt** határoz meg, sok szerződésnél 6%-osat, és a határidős árat úgy jegyzi, mintha ezt a kötvényt szállítanák.

Minden szállítható kötvény kap egy **konverziós faktort**, $CF$: az 1 névértékre jutó árát akkor, ha a lejáratig számított hozama pontosan a névleges 6% lenne. Éves $c$ kuponnal és a szállításkor hátralévő $T$ évvel

$$
CF = \frac{1}{100}\left( \sum_{t=1}^{T} \frac{100c}{1{,}06^t} + \frac{100}{1{,}06^T} \right).
$$

A 6%-nál nagyobb kuponú kötvényre $CF > 1$, a kisebbre $CF < 1$. A valódi tőzsdék kerekítési szabályokat is alkalmaznak (a hátralévő futamidőt lefelé kerekítik egész negyedévekre, a faktort négy tizedesjegyre); a labor egy ilyen konvenciót követ, itt egész években számolunk.

Példa: három szállítható kötvény, A, B és C.

- A: 3%-os kupon, 10 év van hátra, $CF_A = 0{,}7792$.
- B: 5%-os kupon, 15 év van hátra, $CF_B = 0{,}9029$.
- C: 7%-os kupon, 25 év van hátra, $CF_C = 1{,}1278$.

## Számlázási ár és szállítási költség

Amikor az eladó leszállít egy kötvényt, a vevő 100 névértékenként a **számlázási árat** fizeti:

$$
\text{számlázási ár} = F \cdot CF + AI,
$$

ahol $AI$ a kötvény utolsó kuponfizetése óta felhalmozott kamat. A konverziós faktor az értékesebb kötvényekre felfelé, az olcsóbbakra lefelé skálázza a határidős árat.

A szállításhoz az eladónak birtokolnia kell a kötvényt, ami a piaci (nettó) árába, $P$-be, és ugyanabba a felhalmozott kamatba kerül. A felhalmozott kamat mindkét oldalon megjelenik és kiesik, így az eladó **nettó szállítási költsége**, más néven **nettó bázisa**,

$$
\text{nettó költség} = P - F \cdot CF.
$$

Az eladó a legkisebb nettó költségű kötvényt szállítja: ez a **legolcsóbban szállítható** kötvény (cheapest-to-deliver, CTD). Másképp mondva a CTD az a kötvény, amelyre a $P/CF$ arány a legkisebb.

## A határidős ár a szállítási napon

A szállítási napon a határidős ár egyetlen kosárbeli kötvény $P/CF$ arányát sem haladhatja meg. Ha meghaladná, egy kereskedő megvehetné azt a kötvényt, eladhatná a futurest, azonnal szállíthatna, és zsebre tehetné az $F \cdot CF - P > 0$ különbséget, ami az „Arbitrázs és a határidős ár” leckében látott fajta arbitrázs. Az eladók versenye $F$-et a legkisebb ilyen arányig nyomja le:

$$
F = \min_i \frac{P_i}{CF_i}.
$$

A CTD nettó költsége ekkor pontosan nulla, minden más kötvényé pozitív. A szállítás előtt a határidős árat ugyanígy a CTD határozza meg, kiegészítve az „Arbitrázs és a határidős ár” leckében látott tartási költséggel; ez a lecke a szállítási napnál marad.

> A szállításkor $F = \min_i P_i/CF_i$. A minimumot adó kötvény a legolcsóbban szállítható, és a $P - F\cdot CF$ nettó költsége nulla.

## A legolcsóbb kötvény változása a hozammal

Ha minden kötvény hozama pontosan 6% lenne, minden ár $100 \cdot CF$ lenne, minden $P/CF$ arány 100, és minden kötvény egyformán olcsó. A konverziós faktorok csak a névleges hozamon pontosak.

Bármely más hozamon a $P/CF$ arány a kötvény árát mutatja a 6%-os hozamhoz tartozó árához képest. A „Duráció és konvexitás” leckéből tudjuk, hogy ez a relatív változás a durációtól függ. 6%-os hozamon A, B és C Macaulay-durációja körülbelül 8,59, 10,66 és 13,16 év.

- Ha a hozamok 6% fölé emelkednek, minden ár esik, és relatíve a hosszú durációjú C esik a legtöbbet. Ennek lesz a legkisebb $P/CF$ aránya, így ez lesz a CTD.
- Ha a hozamok 6% alá csökkennek, minden ár emelkedik, és a rövid durációjú A emelkedik a legkevésbé. Most ennek a legkisebb a $P/CF$ aránya, így ez lesz a CTD.

Számpélda 4%-os egységes hozamon: az árak $P_A = 91{,}89$, $P_B = 111{,}12$ és $P_C = 146{,}87$. Az arányok $91{,}89/0{,}7792 = 117{,}93$, $111{,}12/0{,}9029 = 123{,}07$ és $146{,}87/1{,}1278 = 130{,}22$. Tehát $F = 117{,}93$, és A a CTD. A nettó költségek: A-ra 0, B-re $111{,}12 - 117{,}93 \times 0{,}9029 = 4{,}64$, C-re 13,86.

8%-on megfordul a sorrend. Számoljuk végig lépésről lépésre:

### Kidolgozott példa: A legolcsóbban szállítható kötvény 8%-os egységes hozamnál

1. Az A kötvény (3%-os kupon, 10 év) ára 8%-on.
   $$P_A = \sum_{t=1}^{10} \frac{3}{1{,}08^t} + \frac{100}{1{,}08^{10}}$$ → **66.45**
2. A C kötvény (7%-os kupon, 25 év) ára 8%-on.
   $$P_C = \sum_{t=1}^{25} \frac{7}{1{,}08^t} + \frac{100}{1{,}08^{25}}$$ → **89.33**
3. Az A arányszáma. B-re ugyanezek a lépések 82,32-t adnak.
   $$P_A / CF_A$$ → **85.28**
4. A C arányszáma. Ez a legkisebb a három közül, így C a CTD, és az arányszáma a határidős ár.
   $$F = P_C / CF_C$$ → **79.2**
5. Az A nettó szállítási költsége (B-é 2,81, C-é 0).
   $$P_A - F \cdot CF_A$$ → **4.74**

Az ábra A, B és C $P - F\cdot CF$ nettó szállítási költségét mutatja a 2% és 10% közötti egységes piaci hozam függvényében, a választott hozamnál egy függőleges vonallal. A kijelzők a CTD-t, az $F$ határidős árat, valamint minden kötvény konverziós faktorát és nettó költségét mutatják. Kezdd 6%-on, ahol mindhárom költség nulla, majd mozgasd a hozamot lefelé és felfelé, és figyeld, ahogy a CTD A-ról C-re vált.

*[Interaktív ábra: ctd switch](https://quantsandbox.dev/hu/guide/fixed-income/treasury-futures)*

## A szállítási opció értéke

Mivel az eladó mindig a legolcsóbb kötvényt választja, a határidős ár alacsonyabb, mint bármely egyetlen, megnevezett kötvényre szóló ügylet ára lenne. A vevő ezt egy likvid, szabványosított szerződésért cserébe elfogadja. Minél messzebb kerülnek a hozamok a 6%-tól, annál jobban szétválnak a kötvények költségei, és annál többet ér a választás az eladónak. Aki kötvényfuturesszel fedez, annak ezért követnie kell, melyik kötvény a CTD: a futures árérzékenysége a CTD durációját követi, és ugrik, amikor a CTD vált.

## Összefoglalás

- A kötvényfutures eladója egy kosárból bármelyik kötvényt szállíthatja; ez a szállítási opció.
- Egy kötvény konverziós faktora az 1 névértékre jutó ára a névleges 6%-os hozamon. A számlázási ár $F\cdot CF + AI$.
- A nettó szállítási költség $P - F\cdot CF$. A szállításkor $F = \min_i P_i/CF_i$, és a minimumot adó kötvény a legolcsóbban szállítható.
- A névleges hozam alatt jellemzően a legkisebb, felette a legnagyobb durációjú kötvény a CTD.

[Számold ki a konverziós faktorokat, a számlázási árakat és a legolcsóbban szállítható kötvényt a Treasury Futures laborban](https://quantsandbox.dev/hu/treasury-futures)

## Interaktív laborok

- [Állampapír-határidős: konverziós faktor, legolcsóbban szállítható kötvény](https://quantsandbox.dev/hu/treasury-futures)

## Gyakorló kérdések

### 1. Szállításkor a határidős ár $F = 95$. Egy szállítható kötvény konverziós faktora $CF = 1{,}10$, nettó árfolyama 106,00. Mekkora a nettó szállítási költsége 100 névértékre?

**Válasz:** 1.5

Nettó költség $= P - F \cdot CF = 106{,}00 - 95 \times 1{,}10 = 1{,}50$. A felhalmozott kamat kiesik: az eladó a számlázási árban megkapja, a kötvény vételekor pedig kifizette.

### 2. A hozamok 6%-ról 3%-ra esnek. A három kötvény közül melyik lesz a legolcsóbban szállítható?

- a) A, a legrövidebb durációjú 3%-os kötvény
- b) C, a leghosszabb durációjú 7%-os kötvény
- c) B, a középső kötvény
- d) Egyik sem: mindhárom ugyanolyan olcsó marad

**Válasz:** a) A, a legrövidebb durációjú 3%-os kötvény

A névleges 6% alatt minden ár emelkedik, relatíve a rövid durációjú kötvényé a legkevésbé, így A-nak a legkisebb a $P/CF$ aránya. Az egyenlő költség csak pontosan 6%-on áll fenn.

---

Forrás: https://quantsandbox.dev/hu/guide/fixed-income/treasury-futures

Előző lecke: [Nem párhuzamos hozamgörbe-mozgások és kulcskamat-durációk](https://quantsandbox.dev/hu/guide/fixed-income/curve-risk)

Következő lecke: [Kamatswapok](https://quantsandbox.dev/hu/guide/fixed-income/interest-rate-swaps)
