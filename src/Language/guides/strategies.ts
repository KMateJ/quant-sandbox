import type { GuideLessonContent } from "../../features/guide/guide.content.types";
import { eq, figure, h, lab, list, note, p } from "./blocks";

export const strategies: GuideLessonContent = {
  en: [
    p("This lesson combines the contracts from \"Forwards, calls and puts\" into portfolios. The only new fact is that payoffs add up; everything else follows from it. We keep the same setting: European options on a non-dividend-paying stock, all maturing at the same date $T$."),

    h("Payoffs add"),
    p("A **portfolio** is a list of positions held at the same time. Suppose it holds $n_1$ units of a contract with payoff $X_1 = f_1(S_T)$, $n_2$ units of a contract with payoff $X_2 = f_2(S_T)$, and so on. A positive $n_i$ is a long position, a negative $n_i$ a short one. At maturity each contract pays independently of the others, so the portfolio pays"),
    eq("X = n_1 f_1(S_T) + n_2 f_2(S_T) + \\dots + n_k f_k(S_T)."),
    p("Graphically, you draw each leg's payoff against $S_T$ and add the lines vertically. Each call or put payoff is made of two straight pieces joined at its strike, so a sum of them is again made of straight pieces, with a kink at every strike that appears in the portfolio."),
    p("Besides options and the stock itself (payoff $S_T$) we use a **zero-coupon bond** that pays 1 at $T$. Its payoff is the constant 1 and its price today is the discount factor $e^{-rT}$. Holding $K$ bonds pays $K$ for sure."),

    h("Payoff and profit of a portfolio"),
    p("The figure in this lesson shows payoffs only. To get the profit, subtract the cost of setting up the portfolio. If the legs cost $V_0$ in total today (premiums paid minus premiums received), the profit at maturity is"),
    eq("\\text{profit} = X - V_0\\,e^{rT}."),
    p("A portfolio with a large payoff is not automatically a good trade: in a well-functioning market a larger payoff costs more today. The examples below use rounded premiums and ignore the small factor $e^{rT}$."),

    h("Spreads"),
    p("A **bull call spread** buys a call with a low strike $K_1$ and sells a call with a higher strike $K_2$:"),
    eq("X = (S_T - K_1)^+ - (S_T - K_2)^+ = \\begin{cases} 0, & S_T \\le K_1,\\\\ S_T - K_1, & K_1 < S_T < K_2,\\\\ K_2 - K_1, & S_T \\ge K_2. \\end{cases}"),
    p("The short call gives away the upside above $K_2$, and in exchange its premium lowers the cost. Example with $K_1 = 95$ and $K_2 = 105$: if the 95 call costs 8 and the 105 call costs 3, the spread costs 5. The payoff is capped at 10, so the profit ranges from $-5$ to $+5$, and the break-even level is $S_T = 100$."),
    p("A **bear put spread** is the mirror image: buy a put with the higher strike $K_2$ and sell a put with the lower strike $K_1$. It pays $K_2 - K_1$ when the stock ends below $K_1$ and nothing above $K_2$."),

    h("Straddle and strangle"),
    p("A **straddle** buys a call and a put with the same strike $K$:"),
    eq("X = (S_T - K)^+ + (K - S_T)^+ = |S_T - K|."),
    p("The payoff is a V with its tip at $K$: the position gains from a large move in either direction and is a bet on movement, not on direction. With $K = 100$, a call at 6 and a put at 4, the straddle costs 10, so it makes a profit only if $S_T < 90$ or $S_T > 110$."),
    p("A **strangle** buys a put with strike $K_1$ and a call with a higher strike $K_2$. The payoff is zero between the strikes and rises linearly outside them. It is cheaper than a straddle because it needs a larger move to pay anything."),

    h("Butterfly"),
    p("A **butterfly** with strikes $K_1 < K_2 < K_3$, equally spaced, buys one $K_1$ call, sells two $K_2$ calls and buys one $K_3$ call:"),
    eq("X = (S_T - K_1)^+ - 2\\,(S_T - K_2)^+ + (S_T - K_3)^+."),
    p("Read it slope by slope. Below $K_1$ no option pays. Between $K_1$ and $K_2$ only the first call pays, slope $+1$. Between $K_2$ and $K_3$ the slope becomes $1 - 2 = -1$. Above $K_3$ it is $1 - 2 + 1 = 0$, and the payoff is back at zero. The result is a tent with its peak $K_2 - K_1$ at $K_2$. With strikes 90, 100, 110 the peak is 10 at $S_T = 100$, and the payoff at $S_T = 95$ is 5."),
    p("The butterfly pays only when the stock ends near the middle strike, so it is a bet that the price will stay put, the opposite of a straddle."),

    h("The synthetic forward"),
    p("Buy a call and sell a put, both with strike $K$. For any $S_T$ exactly one of the two options pays:"),
    eq("(S_T - K)^+ - (K - S_T)^+ = S_T - K."),
    p("If $S_T > K$ the call pays $S_T - K$ and the put is worthless; if $S_T < K$ the call is worthless and the short put pays $-(K - S_T) = S_T - K$. Either way the total is the payoff of a long forward with delivery price $K$. This identity is called a **synthetic forward**; it is the basis of \"Put–call parity\"."),
    p("The figure shows each leg's payoff as a thin dashed line and the total as a thick line. Pick the presets one by one and check that the thick line is the vertical sum of the dashed ones. In the synthetic forward the kinks of the two legs cancel and the total is a single straight line."),
    figure("strategy"),

    h("Building any piecewise-linear payoff"),
    p("The examples suggest a general rule. Take any payoff $f(S_T)$ made of straight pieces, with kinks at strikes $K_1 < K_2 < \\dots < K_m$. Let $f(0)$ be its value at zero, $a_0$ its slope just to the right of zero, and $c_i$ the change of slope at $K_i$ (slope after minus slope before). Then"),
    eq("f(S_T) = f(0) + a_0\\,S_T + \\sum_{i=1}^{m} c_i\\,(S_T - K_i)^+."),
    p("Each term is a traded instrument: $f(0)$ zero-coupon bonds, $a_0$ shares, and $c_i$ calls with strike $K_i$ (a negative number means a short position). The butterfly is the case $f(0) = 0$, $a_0 = 0$, $c = (1, -2, 1)$. Puts are not needed in principle, although they often give a shorter recipe."),
    note("A payoff made of straight pieces can be built exactly from bonds, the stock and calls, with one call position per kink. Its slope changes tell you how many calls to hold at each strike."),

    h("Summary"),
    list(
      "The payoff of a portfolio is the sum of its legs' payoffs, drawn by adding the lines vertically.",
      "Profit is the total payoff minus the net cost of the legs, carried to time $T$.",
      "Spreads cap gains and losses; straddles and strangles pay for large moves; a butterfly pays when the price stays near the middle strike.",
      "A long call plus a short put with the same strike pays $S_T - K$, the payoff of a forward.",
      "Any piecewise-linear payoff can be built from bonds, the stock and calls.",
    ),
    lab("/payoff", "Assemble multi-leg strategies and see their payoff and profit in the Payoff lab"),
  ],

  hu: [
    p("Ez a lecke a „Határidős ügyletek, call és put opciók” lecke szerződéseiből portfóliókat épít. Egyetlen új tényre van szükség: a kifizetések összeadódnak, minden más ebből következik. A keret változatlan: osztalékot nem fizető részvényre szóló európai opciók, amelyek mind ugyanabban a $T$ időpontban járnak le."),

    h("A kifizetések összeadódnak"),
    p("A **portfólió** egyszerre tartott pozíciók listája. Tegyük fel, hogy $n_1$ darabot tart egy $X_1 = f_1(S_T)$ kifizetésű szerződésből, $n_2$ darabot egy $X_2 = f_2(S_T)$ kifizetésűből, és így tovább. A pozitív $n_i$ hosszú, a negatív rövid pozíciót jelent. Lejáratkor minden szerződés a többitől függetlenül fizet, így a portfólió kifizetése"),
    eq("X = n_1 f_1(S_T) + n_2 f_2(S_T) + \\dots + n_k f_k(S_T)."),
    p("Grafikusan: minden láb kifizetését felrajzoljuk $S_T$ függvényében, és a vonalakat függőlegesen összeadjuk. Minden call és put kifizetése két, a kötési árban összekapcsolódó egyenes szakaszból áll, ezért az összegük is egyenes szakaszokból áll, és a portfólióban szereplő minden kötési árnál törése lehet."),
    p("Az opciókon és magán a részvényen (kifizetése $S_T$) kívül egy **zérókuponos kötvényt** is használunk, amely $T$-ben 1-et fizet. Kifizetése a konstans 1, mai ára az $e^{-rT}$ diszkontfaktor. $K$ darab kötvény biztosan $K$-t fizet."),

    h("A portfólió kifizetése és nyeresége"),
    p("A lecke ábrája csak kifizetéseket mutat. A nyereséghez le kell vonni a portfólió felépítésének költségét. Ha a lábak ma összesen $V_0$-ba kerülnek (kifizetett díjak mínusz kapott díjak), akkor a lejáratkori nyereség"),
    eq("\\text{nyereség} = X - V_0\\,e^{rT}."),
    p("A nagy kifizetésű portfólió nem feltétlenül jó üzlet: egy jól működő piacon a nagyobb kifizetés ma többe kerül. Az alábbi példák kerekített díjakkal számolnak, és elhagyják a kis $e^{rT}$ szorzót."),

    h("Spreadek"),
    p("A **bull call spread** vesz egy alacsony $K_1$ kötési árú callt, és elad egy magasabb $K_2$ kötési árú callt:"),
    eq("X = (S_T - K_1)^+ - (S_T - K_2)^+ = \\begin{cases} 0, & S_T \\le K_1,\\\\ S_T - K_1, & K_1 < S_T < K_2,\\\\ K_2 - K_1, & S_T \\ge K_2. \\end{cases}"),
    p("Az eladott call lemond a $K_2$ fölötti nyereségről, cserébe a díja csökkenti a költséget. Példa $K_1 = 95$ és $K_2 = 105$ mellett: ha a 95-ös call 8-ba, a 105-ös 3-ba kerül, a spread ára 5. A kifizetés legfeljebb 10, így a nyereség $-5$ és $+5$ között mozog, a fedezeti pont pedig $S_T = 100$."),
    p("A **bear put spread** ennek tükörképe: veszünk egy magasabb, $K_2$ kötési árú putot, és eladunk egy alacsonyabb, $K_1$ kötési árút. Ha a részvény $K_1$ alatt zár, $K_2 - K_1$-et fizet, $K_2$ fölött semmit."),

    h("Straddle és strangle"),
    p("A **straddle** egy callt és egy putot vesz ugyanazzal a $K$ kötési árral:"),
    eq("X = (S_T - K)^+ + (K - S_T)^+ = |S_T - K|."),
    p("A kifizetés V alakú, csúcsa $K$-ban van: a pozíció bármely irányú nagy elmozdulásból profitál, tehát a mozgásra fogad, nem az irányra. $K = 100$, 6-os call és 4-es put mellett a straddle 10-be kerül, így csak akkor nyereséges, ha $S_T < 90$ vagy $S_T > 110$."),
    p("A **strangle** egy $K_1$ kötési árú putot és egy magasabb, $K_2$ kötési árú callt vesz. A kifizetés a két kötési ár között nulla, azokon kívül lineárisan nő. Olcsóbb a straddle-nél, mert nagyobb elmozdulás kell ahhoz, hogy bármit fizessen."),

    h("Butterfly"),
    p("Egy egyenlő közű $K_1 < K_2 < K_3$ kötési árakkal felépített **butterfly** vesz egy $K_1$-es callt, elad két $K_2$-es callt, és vesz egy $K_3$-as callt:"),
    eq("X = (S_T - K_1)^+ - 2\\,(S_T - K_2)^+ + (S_T - K_3)^+."),
    p("Olvassuk meredekségenként. $K_1$ alatt egyik opció sem fizet. $K_1$ és $K_2$ között csak az első call fizet, a meredekség $+1$. $K_2$ és $K_3$ között a meredekség $1 - 2 = -1$. $K_3$ fölött $1 - 2 + 1 = 0$, és a kifizetés visszatér nullára. Az eredmény egy sátor, amelynek csúcsa $K_2$-ben van, magassága $K_2 - K_1$. A 90, 100, 110 kötési áraknál a csúcs 10 az $S_T = 100$ pontban, $S_T = 95$-nél pedig a kifizetés 5."),
    p("A butterfly csak akkor fizet, ha a részvény a középső kötési ár közelében zár, vagyis arra fogad, hogy az ár nem mozdul el sokat: a straddle ellentéte."),

    h("A szintetikus határidős ügylet"),
    p("Vegyünk egy callt és adjunk el egy putot, mindkettőt $K$ kötési árral. Bármely $S_T$ mellett a két opció közül pontosan egy fizet:"),
    eq("(S_T - K)^+ - (K - S_T)^+ = S_T - K."),
    p("Ha $S_T > K$, a call $S_T - K$-t fizet, a put értéktelen; ha $S_T < K$, a call értéktelen, az eladott put pedig $-(K - S_T) = S_T - K$-t fizet. Az összeg mindkét esetben egy $K$ szállítási árú hosszú határidős ügylet kifizetése. Ezt nevezzük **szintetikus határidős ügyletnek**; erre épül a „Put–call paritás” lecke."),
    p("Az ábra minden láb kifizetését vékony szaggatott vonallal, az összeget vastag vonallal mutatja. Válaszd ki egymás után az előre beállított stratégiákat, és ellenőrizd, hogy a vastag vonal a szaggatottak függőleges összege. A szintetikus határidős ügyletnél a két láb törése kioltja egymást, és az összeg egyetlen egyenes."),
    figure("strategy"),

    h("Tetszőleges szakaszonként lineáris kifizetés előállítása"),
    p("A példák általános szabályra utalnak. Vegyünk egy egyenes szakaszokból álló $f(S_T)$ kifizetést, amelynek $K_1 < K_2 < \\dots < K_m$ pontokban van törése. Legyen $f(0)$ az értéke nullában, $a_0$ a meredeksége közvetlenül nulla után, $c_i$ pedig a meredekség változása $K_i$-ben (utána mínusz előtte). Ekkor"),
    eq("f(S_T) = f(0) + a_0\\,S_T + \\sum_{i=1}^{m} c_i\\,(S_T - K_i)^+."),
    p("Minden tag egy forgalmazott termék: $f(0)$ darab zérókuponos kötvény, $a_0$ darab részvény és $c_i$ darab $K_i$ kötési árú call (a negatív szám rövid pozíciót jelent). A butterfly az $f(0) = 0$, $a_0 = 0$, $c = (1, -2, 1)$ eset. Putokra elvben nincs szükség, bár gyakran rövidebb receptet adnak."),
    note("Az egyenes szakaszokból álló kifizetés pontosan előállítható kötvényekből, a részvényből és callokból, töréspontonként egy call-pozícióval. A meredekség változásai megadják, hány callt kell tartani az egyes kötési árakon."),

    h("Összefoglalás"),
    list(
      "A portfólió kifizetése a lábak kifizetéseinek összege; a vonalak függőleges összeadásával rajzolható meg.",
      "A nyereség a teljes kifizetés mínusz a lábak $T$-re felkamatolt nettó költsége.",
      "A spreadek korlátozzák a nyereséget és a veszteséget; a straddle és a strangle nagy elmozdulásért fizet; a butterfly akkor, ha az ár a középső kötési ár közelében marad.",
      "Egy hosszú call és egy rövid put azonos kötési árral $S_T - K$-t fizet, mint egy határidős ügylet.",
      "Bármely szakaszonként lineáris kifizetés felépíthető kötvényekből, a részvényből és callokból.",
    ),
    lab("/payoff", "Rakj össze többlábú stratégiákat, és nézd meg a kifizetésüket és nyereségüket a Kifizetés laborban"),
  ],
};
