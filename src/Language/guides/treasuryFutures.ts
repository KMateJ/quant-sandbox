import type { GuideLessonContent } from "../../features/guide/guide.content.types";
import { eq, figure, h, lab, list, note, p } from "./blocks";

export const treasuryFutures: GuideLessonContent = {
  en: [
    p("A bond future is a forward contract on a government bond, traded on an exchange. Its twist is that the seller may choose which bond to deliver from a list. This lesson explains how the exchange makes different bonds comparable with conversion factors, what the seller actually pays and receives at delivery, and why the cheapest bond to deliver changes when yields move. It builds on \"Bond prices and yields\", \"Duration and convexity\" and \"Arbitrage and the forward price\"."),

    h("Bond futures"),
    p("A **bond future** obliges the seller (the short) to deliver a government bond to the buyer (the long) at a fixed date, the **delivery date**, for a price agreed today. As with any forward, nothing changes hands when the contract is opened; the quoted **futures price** $F$ is the price at which delivery will take place. Throughout this track bonds have face value 100, so $F$ here always means the futures price, quoted per 100 of face."),
    p("Exchanges standardise everything except one detail. Instead of naming a single bond, the contract lists a **deliverable basket**: every government bond within a range of remaining maturities, say 8.5 to 10.5 years for a ten-year contract. The seller decides which bond in the basket to deliver. This choice is the **delivery option**, and it belongs to the seller."),

    h("The notional bond and conversion factors"),
    p("The bonds in the basket have different coupons and maturities, so they have very different prices. A 7% bond is worth far more than a 3% bond of similar maturity. Paying the same amount for either would make the choice trivial. The exchange therefore defines a **notional bond** with a fixed coupon, 6% for many contracts, and quotes the futures price as if that bond were delivered."),
    p("Each deliverable bond receives a **conversion factor** $CF$: its price per 1 of face if its yield to maturity were exactly the notional 6%. With annual coupons $c$ and $T$ years left at delivery,"),
    eq("CF = \\frac{1}{100}\\left( \\sum_{t=1}^{T} \\frac{100c}{1{.}06^t} + \\frac{100}{1{.}06^T} \\right)."),
    p("A bond with a coupon above 6% has $CF > 1$, one below 6% has $CF < 1$. Real exchanges add rounding rules (remaining maturity rounded down to whole quarters, the factor to four decimals); the lab follows one such convention, here we keep whole years."),
    p("Example: three deliverable bonds, called A, B and C."),
    list(
      "A: 3% coupon, 10 years left, $CF_A = 0{.}7792$.",
      "B: 5% coupon, 15 years left, $CF_B = 0{.}9029$.",
      "C: 7% coupon, 25 years left, $CF_C = 1{.}1278$.",
    ),

    h("Invoice price and delivery cost"),
    p("When the seller delivers a bond, the buyer pays the **invoice price** per 100 of face:"),
    eq("\\text{invoice} = F \\cdot CF + AI,"),
    p("where $AI$ is the accrued interest the bond has built up since its last coupon. The conversion factor scales the futures price up for valuable bonds and down for cheap ones."),
    p("To deliver, the seller must own the bond, which costs its market (clean) price $P$ plus the same accrued interest. Accrued interest appears on both sides and cancels, so the seller's **net delivery cost**, also called the **net basis**, is"),
    eq("\\text{net cost} = P - F \\cdot CF."),
    p("The seller delivers the bond with the smallest net cost: the **cheapest-to-deliver** bond, or CTD. Equivalently, the CTD is the bond with the lowest ratio $P/CF$."),

    h("The futures price at delivery"),
    p("At the delivery date the futures price cannot exceed $P/CF$ for any bond in the basket. If it did, a trader could buy that bond, sell the future, deliver at once and keep $F \\cdot CF - P > 0$, an arbitrage of the kind in \"Arbitrage and the forward price\". Competition among sellers pushes $F$ down to the lowest such ratio:"),
    eq("F = \\min_i \\frac{P_i}{CF_i}."),
    p("The CTD then has a net cost of exactly zero and every other bond a positive one. Before delivery the futures price is set by the CTD in the same way, plus the carry from \"Arbitrage and the forward price\"; this lesson stays at the delivery date."),
    note("At delivery $F = \\min_i P_i/CF_i$. The bond that attains the minimum is the cheapest-to-deliver, and its net cost $P - F\\cdot CF$ is zero."),

    h("The cheapest bond and the yield level"),
    p("If all bonds yielded exactly 6%, every price would equal $100 \\cdot CF$, every ratio $P/CF$ would be 100, and all bonds would be equally cheap. The conversion factors are exact only at the notional yield."),
    p("At any other yield the ratio $P/CF$ is the bond's price relative to its price at 6%. From \"Duration and convexity\", that relative change depends on duration. At a 6% yield the Macaulay durations of A, B and C are about 8.59, 10.66 and 13.16 years."),
    list(
      "When yields rise above 6%, all prices fall, and the long-duration bond C falls the most in relative terms. It has the lowest $P/CF$ and becomes the CTD.",
      "When yields fall below 6%, all prices rise, and the short-duration bond A rises the least. It now has the lowest $P/CF$ and becomes the CTD.",
    ),
    p("Worked example at a flat yield of 4%: the prices are $P_A = 91{.}89$, $P_B = 111{.}12$ and $P_C = 146{.}87$. The ratios are $91{.}89/0{.}7792 = 117{.}93$, $111{.}12/0{.}9029 = 123{.}07$ and $146{.}87/1{.}1278 = 130{.}22$. So $F = 117{.}93$ and A is the CTD. The net costs are 0 for A, $111{.}12 - 117{.}93 \\times 0{.}9029 = 4{.}64$ for B and 13.86 for C."),
    p("At 8% the order reverses: $F = 79{.}20$, C is the CTD, and the net costs are 4.74 for A, 2.81 for B and 0 for C."),
    p("The figure plots the net delivery cost $P - F\\cdot CF$ of A, B and C against a flat market yield from 2% to 10%, with a line at the chosen yield. The readouts show the CTD, the futures price $F$, and each bond's conversion factor and net cost. Start at 6%, where all three costs are zero, then move the yield down and up and watch the CTD switch from A to C."),
    figure("ctd-switch"),

    h("The value of the delivery option"),
    p("Because the seller always picks the cheapest bond, the futures price is lower than it would be for any single named bond. The buyer accepts this in exchange for a liquid, standardised contract. The further yields move from 6%, the more the bonds' costs spread out, and the more the choice is worth to the seller. Traders who hedge with bond futures must therefore track which bond is the CTD: the future's price sensitivity follows the duration of the CTD, and it jumps when the CTD switches."),

    h("Summary"),
    list(
      "A bond future lets the seller deliver any bond from a basket; this is the delivery option.",
      "The conversion factor of a bond is its price per 1 of face at the notional 6% yield. The invoice price is $F\\cdot CF + AI$.",
      "The net delivery cost is $P - F\\cdot CF$. At delivery $F = \\min_i P_i/CF_i$, and the bond attaining it is the cheapest-to-deliver.",
      "Below the notional yield the lowest-duration bond tends to be the CTD, above it the highest-duration bond.",
    ),
    lab("/treasury-futures", "Compute conversion factors, invoice prices and the cheapest-to-deliver bond in the Treasury Futures lab"),
  ],

  hu: [
    p("A kötvény-határidős ügylet (kötvényfutures) egy tőzsdén kereskedett határidős ügylet államkötvényre. Különlegessége, hogy az eladó egy listáról választhatja ki, melyik kötvényt szállítja. Ez a lecke bemutatja, hogyan teszi összehasonlíthatóvá a tőzsde a különböző kötvényeket konverziós faktorokkal, mit fizet és mit kap ténylegesen az eladó a szállításkor, és miért változik a legolcsóbban szállítható kötvény, amikor a hozamok elmozdulnak. A „Kötvényárak és hozamok”, a „Duráció és konvexitás” és az „Arbitrázs és a határidős ár” című leckékre épül."),

    h("Kötvény-határidős ügyletek"),
    p("A **kötvényfutures** arra kötelezi az eladót (a short felet), hogy egy rögzített napon, a **szállítási napon**, államkötvényt szállítson a vevőnek (a long félnek) egy ma rögzített áron. Mint minden határidős ügyletnél, a megkötéskor nem cserél gazdát semmi; a jegyzett **határidős ár** $F$ az az ár, amelyen a szállítás történik. Ebben a témakörben a kötvények névértéke 100, így $F$ itt mindig a határidős árat jelöli, 100 névértékre vetítve."),
    p("A tőzsde egyetlen részlet kivételével mindent szabványosít. Egyetlen kötvény megnevezése helyett a szerződés egy **szállítható kosarat** ad meg: minden olyan államkötvényt, amelynek hátralévő futamideje egy adott sávba esik, például 8,5 és 10,5 év közé egy tízéves szerződésnél. Hogy a kosárból melyik kötvényt szállítja, azt az eladó dönti el. Ez a választás a **szállítási opció**, és az eladót illeti."),

    h("A névleges kötvény és a konverziós faktorok"),
    p("A kosárban lévő kötvények kuponja és lejárata különbözik, ezért az áruk is nagyon eltérő. Egy 7%-os kötvény sokkal többet ér, mint egy hasonló lejáratú 3%-os. Ha mindkettőért ugyanannyit kellene fizetni, a választás triviális lenne. A tőzsde ezért egy rögzített kuponú **névleges kötvényt** határoz meg, sok szerződésnél 6%-osat, és a határidős árat úgy jegyzi, mintha ezt a kötvényt szállítanák."),
    p("Minden szállítható kötvény kap egy **konverziós faktort**, $CF$: az 1 névértékre jutó árát akkor, ha a lejáratig számított hozama pontosan a névleges 6% lenne. Éves $c$ kuponnal és a szállításkor hátralévő $T$ évvel"),
    eq("CF = \\frac{1}{100}\\left( \\sum_{t=1}^{T} \\frac{100c}{1{,}06^t} + \\frac{100}{1{,}06^T} \\right)."),
    p("A 6%-nál nagyobb kuponú kötvényre $CF > 1$, a kisebbre $CF < 1$. A valódi tőzsdék kerekítési szabályokat is alkalmaznak (a hátralévő futamidőt lefelé kerekítik egész negyedévekre, a faktort négy tizedesjegyre); a labor egy ilyen konvenciót követ, itt egész években számolunk."),
    p("Példa: három szállítható kötvény, A, B és C."),
    list(
      "A: 3%-os kupon, 10 év van hátra, $CF_A = 0{,}7792$.",
      "B: 5%-os kupon, 15 év van hátra, $CF_B = 0{,}9029$.",
      "C: 7%-os kupon, 25 év van hátra, $CF_C = 1{,}1278$.",
    ),

    h("Számlázási ár és szállítási költség"),
    p("Amikor az eladó leszállít egy kötvényt, a vevő 100 névértékenként a **számlázási árat** fizeti:"),
    eq("\\text{számlázási ár} = F \\cdot CF + AI,"),
    p("ahol $AI$ a kötvény utolsó kuponfizetése óta felhalmozott kamat. A konverziós faktor az értékesebb kötvényekre felfelé, az olcsóbbakra lefelé skálázza a határidős árat."),
    p("A szállításhoz az eladónak birtokolnia kell a kötvényt, ami a piaci (nettó) árába, $P$-be, és ugyanabba a felhalmozott kamatba kerül. A felhalmozott kamat mindkét oldalon megjelenik és kiesik, így az eladó **nettó szállítási költsége**, más néven **nettó bázisa**,"),
    eq("\\text{nettó költség} = P - F \\cdot CF."),
    p("Az eladó a legkisebb nettó költségű kötvényt szállítja: ez a **legolcsóbban szállítható** kötvény (cheapest-to-deliver, CTD). Másképp mondva a CTD az a kötvény, amelyre a $P/CF$ arány a legkisebb."),

    h("A határidős ár a szállítási napon"),
    p("A szállítási napon a határidős ár egyetlen kosárbeli kötvény $P/CF$ arányát sem haladhatja meg. Ha meghaladná, egy kereskedő megvehetné azt a kötvényt, eladhatná a futurest, azonnal szállíthatna, és zsebre tehetné az $F \\cdot CF - P > 0$ különbséget, ami az „Arbitrázs és a határidős ár” leckében látott fajta arbitrázs. Az eladók versenye $F$-et a legkisebb ilyen arányig nyomja le:"),
    eq("F = \\min_i \\frac{P_i}{CF_i}."),
    p("A CTD nettó költsége ekkor pontosan nulla, minden más kötvényé pozitív. A szállítás előtt a határidős árat ugyanígy a CTD határozza meg, kiegészítve az „Arbitrázs és a határidős ár” leckében látott tartási költséggel; ez a lecke a szállítási napnál marad."),
    note("A szállításkor $F = \\min_i P_i/CF_i$. A minimumot adó kötvény a legolcsóbban szállítható, és a $P - F\\cdot CF$ nettó költsége nulla."),

    h("A legolcsóbb kötvény változása a hozammal"),
    p("Ha minden kötvény hozama pontosan 6% lenne, minden ár $100 \\cdot CF$ lenne, minden $P/CF$ arány 100, és minden kötvény egyformán olcsó. A konverziós faktorok csak a névleges hozamon pontosak."),
    p("Bármely más hozamon a $P/CF$ arány a kötvény árát mutatja a 6%-os hozamhoz tartozó árához képest. A „Duráció és konvexitás” leckéből tudjuk, hogy ez a relatív változás a durációtól függ. 6%-os hozamon A, B és C Macaulay-durációja körülbelül 8,59, 10,66 és 13,16 év."),
    list(
      "Ha a hozamok 6% fölé emelkednek, minden ár esik, és relatíve a hosszú durációjú C esik a legjobban. Neki lesz a legkisebb $P/CF$ aránya, így ő lesz a CTD.",
      "Ha a hozamok 6% alá csökkennek, minden ár emelkedik, és a rövid durációjú A emelkedik a legkevésbé. Most neki a legkisebb a $P/CF$ aránya, így ő lesz a CTD.",
    ),
    p("Számpélda 4%-os egységes hozamon: az árak $P_A = 91{,}89$, $P_B = 111{,}12$ és $P_C = 146{,}87$. Az arányok $91{,}89/0{,}7792 = 117{,}93$, $111{,}12/0{,}9029 = 123{,}07$ és $146{,}87/1{,}1278 = 130{,}22$. Tehát $F = 117{,}93$, és A a CTD. A nettó költségek: A-ra 0, B-re $111{,}12 - 117{,}93 \\times 0{,}9029 = 4{,}64$, C-re 13,86."),
    p("8%-on megfordul a sorrend: $F = 79{,}20$, C a CTD, a nettó költségek pedig A-ra 4,74, B-re 2,81, C-re 0."),
    p("Az ábra A, B és C $P - F\\cdot CF$ nettó szállítási költségét mutatja a 2% és 10% közötti egységes piaci hozam függvényében, a választott hozamnál egy függőleges vonallal. A kijelzők a CTD-t, az $F$ határidős árat, valamint minden kötvény konverziós faktorát és nettó költségét mutatják. Kezdd 6%-on, ahol mindhárom költség nulla, majd mozgasd a hozamot lefelé és felfelé, és figyeld, ahogy a CTD A-ról C-re vált."),
    figure("ctd-switch"),

    h("A szállítási opció értéke"),
    p("Mivel az eladó mindig a legolcsóbb kötvényt választja, a határidős ár alacsonyabb, mint bármely egyetlen, megnevezett kötvényre szóló ügylet ára lenne. A vevő ezt egy likvid, szabványosított szerződésért cserébe elfogadja. Minél messzebb kerülnek a hozamok a 6%-tól, annál jobban szétválnak a kötvények költségei, és annál többet ér a választás az eladónak. Aki kötvényfuturesszel fedez, annak ezért követnie kell, melyik kötvény a CTD: a futures árérzékenysége a CTD durációját követi, és ugrik, amikor a CTD vált."),

    h("Összefoglalás"),
    list(
      "A kötvényfutures eladója egy kosárból bármelyik kötvényt szállíthatja; ez a szállítási opció.",
      "Egy kötvény konverziós faktora az 1 névértékre jutó ára a névleges 6%-os hozamon. A számlázási ár $F\\cdot CF + AI$.",
      "A nettó szállítási költség $P - F\\cdot CF$. A szállításkor $F = \\min_i P_i/CF_i$, és a minimumot adó kötvény a legolcsóbban szállítható.",
      "A névleges hozam alatt jellemzően a legkisebb, felette a legnagyobb durációjú kötvény a CTD.",
    ),
    lab("/treasury-futures", "Számold ki a konverziós faktorokat, a számlázási árakat és a legolcsóbban szállítható kötvényt a Treasury Futures laborban"),
  ],
};
