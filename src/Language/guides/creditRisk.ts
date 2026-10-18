import type { GuideLessonContent } from "../../features/guide/guide.content.types";
import { eq, figure, h, lab, list, note, p } from "./blocks";

export const creditRisk: GuideLessonContent = {
  en: [
    p("Every bond in this track so far was assumed to pay exactly what it promised. A company, unlike a government that borrows in its own currency, can fail to pay. This lesson models that risk with one number per year, the hazard rate, prices a zero-coupon bond that may default, and shows where the extra yield on corporate bonds, the credit spread, comes from. It uses the discounting of \"Interest, compounding and discounting\", the yields of \"Bond prices and yields\" and the continuously compounded zero yields of \"Spot rates, forward rates and the yield curve\", and ends with the credit default swap, a close relative of the contracts in \"Interest rate swaps\"."),

    h("Default and the default time"),
    p("An issuer **defaults** when it misses a payment it owes. We describe default by a random **default time** $\\tau$: the date at which the issuer fails. If $\\tau > T$, the issuer is still paying at $T$ and a bond maturing at $T$ is repaid in full. If $\\tau \\le T$, the bond is not repaid in full."),
    p("The model rests on three assumptions, stated once here: the risk-free rate $r$ is constant and continuously compounded; default is independent of interest rates; and a single parameter, the hazard rate, describes how likely default is."),

    h("Hazard rate and survival probability"),
    p("The **hazard rate** (or **default intensity**) $\\lambda$ is the probability of default per unit of time, given that the issuer has survived so far. Over a short interval $dt$,"),
    eq("\\mathbb{P}(t < \\tau \\le t + dt \\mid \\tau > t) = \\lambda\\,dt."),
    p("Let $Q(t) = \\mathbb{P}(\\tau > t)$ be the **survival probability** up to $t$. To survive until $t + dt$, the issuer must survive until $t$ and then not default in the next $dt$:"),
    eq("Q(t + dt) = Q(t)\\,(1 - \\lambda\\,dt) \\quad\\Longrightarrow\\quad \\frac{dQ}{dt} = -\\lambda\\,Q(t), \\qquad Q(0) = 1."),
    p("For a constant $\\lambda$ the solution is an exponential, and the **cumulative default probability** is its complement:"),
    eq("Q(T) = e^{-\\lambda T}, \\qquad \\mathbb{P}(\\tau \\le T) = 1 - e^{-\\lambda T}."),
    p("This is the same algebra as continuous discounting: survival decays at rate $\\lambda$ just as a discount factor decays at rate $r$. A fair picture is a light bulb with no memory: whatever its age, the chance it fails in the next hour is the same. For small $\\lambda T$, $1 - e^{-\\lambda T} \\approx \\lambda T$, so a hazard rate of 2% means roughly a 2% chance of default per year."),

    h("Recovery and loss given default"),
    p("Default rarely wipes out a bond. Creditors usually recover part of what they are owed from the issuer's remaining assets. The **recovery rate** $R$ is the fraction of face value recovered, and $1 - R$ is the **loss given default**. Recovery for senior unsecured corporate bonds is often around 40%, which is why $R = 40\\%$ is a common default value."),
    p("We need to say when the recovery is paid. Here we assume **recovery of face paid at maturity**: if the issuer defaults before $T$, the holder receives $R$ per unit of face at $T$. This keeps the payoff on a single date and makes the price easy to write down."),

    h("Pricing a defaultable zero-coupon bond"),
    p("A risky zero-coupon bond with face 1 maturing at $T$ pays 1 if $\\tau > T$ and $R$ if $\\tau \\le T$. As in every pricing problem, the price is the discounted expected payoff with probabilities that make prices consistent (the risk-neutral probabilities of \"Risk-neutral probabilities\"; more on this below). Because default is independent of rates, the discount factor $e^{-rT}$ comes out of the expectation:"),
    eq("P_{\\text{risky}} = e^{-rT}\\Big[\\,Q(T)\\cdot 1 + \\big(1 - Q(T)\\big)\\cdot R\\,\\Big] = e^{-rT}\\Big[e^{-\\lambda T} + \\big(1 - e^{-\\lambda T}\\big)R\\Big]."),
    p("Two checks: with $\\lambda = 0$ the bond never defaults and the price is the risk-free $e^{-rT}$; with $R = 1$ default costs nothing and the price is again $e^{-rT}$."),

    h("Credit spread"),
    p("The continuously compounded yield of the risky zero is defined exactly as in \"Spot rates, forward rates and the yield curve\": $y = -\\ln P_{\\text{risky}}/T$. The **credit spread** is the extra yield over the risk-free rate:"),
    eq("s(T) = y - r = -\\frac{1}{T}\\ln\\Big[e^{-\\lambda T} + \\big(1 - e^{-\\lambda T}\\big)R\\Big] = -\\frac{1}{T}\\ln\\Big[1 - (1 - R)\\big(1 - e^{-\\lambda T}\\big)\\Big]."),
    p("The risk-free rate has dropped out: under these assumptions the spread depends only on $\\lambda$, $R$ and $T$. If $R = 0$, the bracket is $e^{-\\lambda T}$ and the spread is exactly $\\lambda$."),

    h("The credit triangle"),
    p("For small $\\lambda T$, use $1 - e^{-\\lambda T} \\approx \\lambda T$ and $\\ln(1 - x) \\approx -x$ for small $x$:"),
    eq("s(T) \\approx -\\frac{1}{T}\\ln\\big[1 - (1 - R)\\lambda T\\big] \\approx \\frac{(1 - R)\\lambda T}{T} = \\lambda\\,(1 - R)."),
    p("This is the **credit triangle**: spread, hazard rate and loss given default, any two of which give the third. In words, the spread pays for the expected loss per year: the chance of default per year times the fraction lost. The approximation is good when $\\lambda T$ is small (a few percent) and exact when $R = 0$; for high hazard rates or long maturities the exact spread falls below $\\lambda(1 - R)$."),
    note("Credit triangle: $s \\approx \\lambda\\,(1 - R)$. The spread is the expected loss rate: hazard rate times loss given default."),

    h("Worked example"),
    p("Take $\\lambda = 2\\%$, $R = 40\\%$, $r = 3\\%$ and $T = 5$ years."),
    list(
      "Survival probability: $Q(5) = e^{-0.02 \\cdot 5} = e^{-0.1} \\approx 0.9048$, so the 5-year default probability is about 9.52%.",
      "Risky zero price: $e^{-0.15}\\,[0.9048 + 0.0952 \\cdot 0.4] \\approx 0.8607 \\cdot 0.9429 \\approx 0.8116$ per unit of face, against the risk-free $e^{-0.15} \\approx 0.8607$.",
      "Yield: $y = -\\ln(0.8116)/5 \\approx 4.176\\%$, so the exact spread is $s(5) \\approx 1.176\\%$, or about 118 basis points.",
      "Credit triangle: $\\lambda(1 - R) = 0.02 \\cdot 0.6 = 1.20\\%$, within about 2.4 basis points of the exact value.",
    ),
    p("With $\\lambda = 10\\%$ instead, the 5-year exact spread is about 5.39% while the triangle gives 6%: the approximation degrades as $\\lambda T$ grows."),

    h("Spread against maturity"),
    p("The figure has sliders for the hazard rate $\\lambda$ (0% to 10%, default 2%), the recovery rate $R$ (0% to 80%, default 40%) and the risk-free rate $r$ (0% to 8%, default 3%). It plots the risk-free zero yield and the risky zero yield against maturity from 0.25 to 10 years. The readouts show the 5-year survival probability, the 5-year credit spread, the CDS premium $\\lambda(1 - R)$ and the 5-year risky zero-coupon price; at the defaults these are 90.48%, 1.18%, 1.20% and 0.8116. Set $R$ to its maximum and note how the gap narrows; a recovery of 100% (the formula's limit) would remove the spread entirely. Raise $\\lambda$ and the risky curve moves up. Note also that for a constant $\\lambda$ the spread is nearly flat in maturity, drifting down slightly at long maturities where $\\lambda T$ is no longer small."),
    figure("credit-spread"),

    h("Risk-neutral and historical default probabilities"),
    p("Reading the triangle backwards, a market spread $s$ and an assumed recovery $R$ imply a hazard rate $\\lambda = s/(1 - R)$. This implied $\\lambda$ is a **risk-neutral** default intensity: the one that makes the formula match market prices. It is typically well above the **historical** default rate observed for similar issuers. The spread is not only expected loss: investors also demand a premium for bearing default risk, which tends to strike in bad times for everyone, and for holding bonds that are harder to sell than government bonds (a liquidity premium). For pricing and hedging, use the implied $\\lambda$; for forecasting actual losses, use historical rates."),

    h("Credit default swaps"),
    p("A **credit default swap** (CDS) is insurance against the default of a reference issuer. The **protection buyer** pays a fixed premium $s_{\\text{CDS}}$ per year on a notional until maturity or default, whichever comes first. If the issuer defaults, the **protection seller** pays $1 - R$ per unit of notional. Like the swaps of \"Interest rate swaps\", the fair premium sets the present values of the two legs equal. With continuous premium payments, constant $\\lambda$ and $r$, and the protection paid at the moment of default:"),
    eq("s_{\\text{CDS}}\\int_0^T e^{-(r+\\lambda)t}\\,dt = (1 - R)\\int_0^T \\lambda\\,e^{-(r+\\lambda)t}\\,dt \\quad\\Longrightarrow\\quad s_{\\text{CDS}} = \\lambda\\,(1 - R)."),
    p("Here $e^{-\\lambda t}$ is the probability the premium is still being paid at $t$, and $\\lambda e^{-\\lambda t}\\,dt$ the probability of default in $[t, t + dt]$. In this setting the triangle holds exactly for the CDS; the bond spread of 1.176% in the example differs slightly because its recovery is paid at maturity rather than at default. In practice, CDS premiums quoted for several maturities are turned into a term structure of hazard rates by bootstrapping, one maturity at a time, just as spot rates were extracted from bond prices."),

    h("Summary"),
    list(
      "The hazard rate $\\lambda$ is the default probability per unit time given survival; for constant $\\lambda$ the survival probability is $e^{-\\lambda T}$.",
      "With recovery $R$ of face paid at maturity, $P_{\\text{risky}} = e^{-rT}[e^{-\\lambda T} + (1 - e^{-\\lambda T})R]$.",
      "The credit spread is approximately $\\lambda(1 - R)$, accurate when $\\lambda T$ is small; at $\\lambda = 2\\%$, $R = 40\\%$ the 5-year spread is 1.176% against 1.20%.",
      "Implied (risk-neutral) hazard rates exceed historical default rates because spreads also contain risk and liquidity premia.",
      "A CDS exchanges a premium for a payment of $1 - R$ on default; its fair premium is about $\\lambda(1 - R)$.",
    ),
    lab("/bond-pricing", "Price bonds and compare yields in the Bond Pricing lab"),
  ],

  hu: [
    p("A pálya eddigi kötvényei mind pontosan azt fizették, amit ígértek. Egy vállalat azonban, szemben a saját devizájában eladósodó állammal, fizetésképtelenné válhat. Ez a lecke ezt a kockázatot egyetlen évre vetített számmal, a csődintenzitással modellezi, beárazza a csődbe menni képes zérókupon-kötvényt, és megmutatja, honnan ered a vállalati kötvények többlethozama, a hitelfelár. A „Kamat, kamatozás és diszkontálás” diszkontálására, a „Kötvényárak és hozamok” hozamaira és az „Azonnali kamatok, forward kamatok és a hozamgörbe” folytonos zérókupon-hozamaira épít, a végén pedig a hitel-nemteljesítési csereügyletet tárgyalja, amely a „Kamatcsereügyletek” szerződéseinek közeli rokona."),

    h("Csőd és a csőd időpontja"),
    p("A kibocsátó **csődbe megy** (nem teljesít), ha elmulaszt egy esedékes fizetést. A csődöt egy véletlen **csődidőponttal**, $\\tau$-val írjuk le: ekkor válik a kibocsátó fizetésképtelenné. Ha $\\tau > T$, a kibocsátó $T$-ben még fizet, és a $T$-ben lejáró kötvényt teljes egészében visszafizeti. Ha $\\tau \\le T$, a kötvényt nem fizeti vissza teljesen."),
    p("A modell három feltevésen nyugszik: a kockázatmentes $r$ kamatláb állandó és folytonos kamatozású; a csőd független a kamatlábaktól; és egyetlen paraméter, a csődintenzitás írja le, mennyire valószínű a csőd."),

    h("Csődintenzitás és túlélési valószínűség"),
    p("A **csődintenzitás** (angolul hazard rate) $\\lambda$ az egységnyi időre jutó csődvalószínűség, feltéve, hogy a kibocsátó addig nem ment csődbe. Egy rövid $dt$ időszakra"),
    eq("\\mathbb{P}(t < \\tau \\le t + dt \\mid \\tau > t) = \\lambda\\,dt."),
    p("Legyen $Q(t) = \\mathbb{P}(\\tau > t)$ a $t$-ig vett **túlélési valószínűség**. Ahhoz, hogy a kibocsátó $t + dt$-ig fennmaradjon, $t$-ig túl kell élnie, majd a következő $dt$ alatt sem mehet csődbe:"),
    eq("Q(t + dt) = Q(t)\\,(1 - \\lambda\\,dt) \\quad\\Longrightarrow\\quad \\frac{dQ}{dt} = -\\lambda\\,Q(t), \\qquad Q(0) = 1."),
    p("Állandó $\\lambda$ mellett a megoldás exponenciális, a **kumulatív csődvalószínűség** pedig ennek komplementere:"),
    eq("Q(T) = e^{-\\lambda T}, \\qquad \\mathbb{P}(\\tau \\le T) = 1 - e^{-\\lambda T}."),
    p("Ez ugyanaz az algebra, mint a folytonos diszkontálásnál: a túlélés $\\lambda$ ütemben csökken, ahogy a diszkontfaktor $r$ ütemben. Jó kép erre egy emlékezet nélküli izzó: bármilyen régóta ég, a következő órában ugyanakkora eséllyel ég ki. Kis $\\lambda T$ esetén $1 - e^{-\\lambda T} \\approx \\lambda T$, így a 2%-os csődintenzitás nagyjából évi 2% csődesélyt jelent."),

    h("Megtérülés és csőd esetén elszenvedett veszteség"),
    p("A csőd ritkán teszi teljesen értéktelenné a kötvényt. A hitelezők a kibocsátó megmaradt vagyonából általában visszakapják követelésük egy részét. A **megtérülési ráta** $R$ a névérték visszakapott hányada, $1 - R$ pedig a **csőd esetén elszenvedett veszteség** (loss given default). Elsőbbségi, fedezetlen vállalati kötvényeknél a megtérülés gyakran 40% körül van, ezért szokásos kiinduló érték az $R = 40\\%$."),
    p("Meg kell mondanunk, mikor fizetik ki a megtérülést. Feltesszük, hogy **a névérték $R$ hányadát lejáratkor fizetik**: ha a kibocsátó $T$ előtt csődbe megy, a tulajdonos névértékegységenként $R$-et kap $T$-ben. Így a kifizetés egyetlen időpontra esik, és az ár könnyen felírható."),

    h("Csődkockázatos zérókupon-kötvény árazása"),
    p("Egy 1 névértékű, $T$-ben lejáró kockázatos zérókupon-kötvény 1-et fizet, ha $\\tau > T$, és $R$-et, ha $\\tau \\le T$. Mint minden árazási feladatban, az ár a diszkontált várható kifizetés olyan valószínűségekkel, amelyek mellett az árak konzisztensek (a „Kockázatsemleges valószínűségek” kockázatsemleges valószínűségei; erről lentebb még lesz szó). Mivel a csőd független a kamatlábaktól, az $e^{-rT}$ diszkontfaktor kiemelhető a várható értékből:"),
    eq("P_{\\text{kock}} = e^{-rT}\\Big[\\,Q(T)\\cdot 1 + \\big(1 - Q(T)\\big)\\cdot R\\,\\Big] = e^{-rT}\\Big[e^{-\\lambda T} + \\big(1 - e^{-\\lambda T}\\big)R\\Big]."),
    p("Két ellenőrzés: $\\lambda = 0$ mellett a kötvény sosem megy csődbe, és az ár a kockázatmentes $e^{-rT}$; $R = 1$ mellett a csőd semmibe sem kerül, és az ár ismét $e^{-rT}$."),

    h("Hitelfelár"),
    p("A kockázatos zérókupon-kötvény folytonos hozamát pontosan úgy definiáljuk, mint az „Azonnali kamatok, forward kamatok és a hozamgörbe” leckében: $y = -\\ln P_{\\text{kock}}/T$. A **hitelfelár** a kockázatmentes kamat feletti többlethozam:"),
    eq("s(T) = y - r = -\\frac{1}{T}\\ln\\Big[e^{-\\lambda T} + \\big(1 - e^{-\\lambda T}\\big)R\\Big] = -\\frac{1}{T}\\ln\\Big[1 - (1 - R)\\big(1 - e^{-\\lambda T}\\big)\\Big]."),
    p("A kockázatmentes kamat kiesett: e feltevések mellett a felár csak $\\lambda$-tól, $R$-től és $T$-től függ. Ha $R = 0$, a zárójelben $e^{-\\lambda T}$ áll, és a felár pontosan $\\lambda$."),

    h("A hitelháromszög"),
    p("Kis $\\lambda T$ esetén használjuk az $1 - e^{-\\lambda T} \\approx \\lambda T$ és a kis $x$-re érvényes $\\ln(1 - x) \\approx -x$ közelítést:"),
    eq("s(T) \\approx -\\frac{1}{T}\\ln\\big[1 - (1 - R)\\lambda T\\big] \\approx \\frac{(1 - R)\\lambda T}{T} = \\lambda\\,(1 - R)."),
    p("Ez a **hitelháromszög** (credit triangle): felár, csődintenzitás és veszteségráta, amelyek közül bármely kettő megadja a harmadikat. Szavakkal: a felár az évi várható veszteséget fizeti meg, vagyis az évi csődesély és az elveszett hányad szorzatát. A közelítés jó, ha $\\lambda T$ kicsi (néhány százalék), és pontos, ha $R = 0$; nagy csődintenzitásnál vagy hosszú lejáratnál a pontos felár $\\lambda(1 - R)$ alá esik."),
    note("Hitelháromszög: $s \\approx \\lambda\\,(1 - R)$. A felár a várható veszteségráta: csődintenzitás szorozva a csőd esetén elszenvedett veszteséggel."),

    h("Számpélda"),
    p("Legyen $\\lambda = 2\\%$, $R = 40\\%$, $r = 3\\%$ és $T = 5$ év."),
    list(
      "Túlélési valószínűség: $Q(5) = e^{-0{,}02 \\cdot 5} = e^{-0{,}1} \\approx 0{,}9048$, így az 5 éves csődvalószínűség körülbelül 9,52%.",
      "A kockázatos zérókupon-kötvény ára: $e^{-0{,}15}\\,[0{,}9048 + 0{,}0952 \\cdot 0{,}4] \\approx 0{,}8607 \\cdot 0{,}9429 \\approx 0{,}8116$ névértékegységenként, szemben a kockázatmentes $e^{-0{,}15} \\approx 0{,}8607$-tel.",
      "Hozam: $y = -\\ln(0{,}8116)/5 \\approx 4{,}176\\%$, a pontos felár tehát $s(5) \\approx 1{,}176\\%$, azaz körülbelül 118 bázispont.",
      "Hitelháromszög: $\\lambda(1 - R) = 0{,}02 \\cdot 0{,}6 = 1{,}20\\%$, ez körülbelül 2,4 bázisponttal tér el a pontos értéktől.",
    ),
    p("Ha viszont $\\lambda = 10\\%$, az 5 éves pontos felár nagyjából 5,39%, a háromszög pedig 6%-ot ad: $\\lambda T$ növekedésével a közelítés romlik."),

    h("A felár és a lejárat"),
    p("Az ábrán csúszkával állítható a $\\lambda$ csődintenzitás (0–10%, alapérték 2%), az $R$ megtérülési ráta (0–80%, alapérték 40%) és az $r$ kockázatmentes kamat (0–8%, alapérték 3%). A grafikon a kockázatmentes és a kockázatos zérókupon-hozamot mutatja a lejárat függvényében, 0,25 és 10 év között. A kijelzők az 5 éves túlélési valószínűséget, az 5 éves hitelfelárat, a $\\lambda(1 - R)$ CDS-díjat és az 5 éves kockázatos zérókupon-kötvény árát mutatják; alapbeállításnál ezek 90,48%, 1,18%, 1,20% és 0,8116. Told $R$-et a maximumra, és figyeld, ahogy a rés szűkül; 100%-os megtérülésnél (a képlet határesete) a felár teljesen eltűnne. Növeld $\\lambda$-t, és a kockázatos görbe felfelé tolódik. Figyeld meg azt is, hogy állandó $\\lambda$ mellett a felár a lejárattól szinte független, csak hosszú lejáratnál csökken kicsit, ahol $\\lambda T$ már nem kicsi."),
    figure("credit-spread"),

    h("Kockázatsemleges és historikus csődvalószínűség"),
    p("A háromszöget visszafelé olvasva egy piaci $s$ felárból és egy feltételezett $R$ megtérülésből a $\\lambda = s/(1 - R)$ implikált csődintenzitás adódik. Ez **kockázatsemleges** csődintenzitás: az, amelyikkel a képlet visszaadja a piaci árakat. Jellemzően jóval magasabb a hasonló kibocsátóknál megfigyelt **historikus** csődgyakoriságnál. A felár ugyanis nemcsak a várható veszteséget tartalmazza: a befektetők prémiumot kérnek a csődkockázat viseléséért, mert a csődök jellemzően akkor halmozódnak, amikor mindenkinek rosszul megy, és azért is, mert ezeket a kötvényeket nehezebb eladni, mint az állampapírokat (likviditási prémium). Árazáshoz és fedezéshez az implikált $\\lambda$ kell, a tényleges veszteségek előrejelzéséhez a historikus gyakoriság."),

    h("Hitel-nemteljesítési csereügyletek"),
    p("A **hitel-nemteljesítési csereügylet** (credit default swap, CDS) egy referencia-kibocsátó csődje elleni biztosítás. A **védelem vevője** évente rögzített $s_{\\text{CDS}}$ díjat fizet egy névleges összeg után a lejáratig vagy a csődig, amelyik előbb bekövetkezik. Csőd esetén a **védelem eladója** névleges egységenként $1 - R$-et fizet. Ahogy a „Kamatcsereügyletek” swapjainál, a méltányos díj a két láb jelenértékét teszi egyenlővé. Folytonos díjfizetéssel, állandó $\\lambda$-val és $r$-rel, és ha a védelmet a csőd pillanatában fizetik ki:"),
    eq("s_{\\text{CDS}}\\int_0^T e^{-(r+\\lambda)t}\\,dt = (1 - R)\\int_0^T \\lambda\\,e^{-(r+\\lambda)t}\\,dt \\quad\\Longrightarrow\\quad s_{\\text{CDS}} = \\lambda\\,(1 - R)."),
    p("Itt $e^{-\\lambda t}$ annak valószínűsége, hogy $t$-ben még fizetik a díjat, $\\lambda e^{-\\lambda t}\\,dt$ pedig annak, hogy a csőd a $[t, t + dt]$ intervallumba esik. Ebben a keretben a háromszög a CDS-re pontosan teljesül; a példa kötvényének 1,176%-os felára azért tér el kissé, mert ott a megtérülést lejáratkor fizetik, nem a csőd pillanatában. A gyakorlatban több lejáratra jegyzett CDS-díjakból lejáratonként, egymás után haladva (bootstrapping) építik fel a csődintenzitások lejárati szerkezetét, ahogy az azonnali kamatokat is a kötvényárakból nyertük ki."),

    h("Összefoglalás"),
    list(
      "A $\\lambda$ csődintenzitás a túlélés feltétele melletti, egységnyi időre jutó csődvalószínűség; állandó $\\lambda$ mellett a túlélési valószínűség $e^{-\\lambda T}$.",
      "Ha a névérték $R$ hányadát lejáratkor fizetik meg, $P_{\\text{kock}} = e^{-rT}[e^{-\\lambda T} + (1 - e^{-\\lambda T})R]$.",
      "A hitelfelár közelítőleg $\\lambda(1 - R)$, ami kis $\\lambda T$ mellett pontos; $\\lambda = 2\\%$, $R = 40\\%$ esetén az 5 éves felár 1,176%, szemben az 1,20%-kal.",
      "Az implikált (kockázatsemleges) csődintenzitás meghaladja a historikus csődgyakoriságot, mert a felár kockázati és likviditási prémiumot is tartalmaz.",
      "A CDS egy díjat cserél csőd esetén fizetett $1 - R$ összegre; méltányos díja körülbelül $\\lambda(1 - R)$.",
    ),
    lab("/bond-pricing", "Árazz kötvényeket és hasonlíts össze hozamokat a Kötvényárazás laborban"),
  ],
};
