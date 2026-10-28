import type { GuideLessonContent } from "../../features/guide/guide.content.types";
import { eq, figure, h, lab, list, note, p } from "./blocks";

export const systemicContagion: GuideLessonContent = {
  en: [
    p("\"Value at Risk and expected shortfall\" measured the tail losses of one portfolio, and \"Diversification and correlation\" showed how holding many assets reduces risk when they do not move together. Both treat the rest of the market as given. In a financial crisis that assumption breaks: banks hold claims on each other and the same assets, so the failure of one changes the losses of the others. This lesson builds that interaction from a single balance sheet up to a network, and shows how a shock to one bank can grow into a system-wide crisis."),

    h("Systemic risk"),
    p("Systemic risk is the risk that losses spread from one institution to many, so that the financial system as a whole stops working: payments freeze, credit stops and healthy firms are hit by losses they did not take on directly. It differs from the risk of a single bank in that the loss is not the sum of separate losses. A bank can be well capitalised on its own and still fail because its counterparties fail. The spreading of losses from one institution to others is called contagion. Three channels carry it: direct exposures between banks, fire sales of common assets and runs on short-term funding."),

    h("A bank balance sheet"),
    p("A bank's assets are loans to firms and households, securities, and loans to other banks (interbank assets). Its liabilities are deposits, bonds and borrowing from other banks. Equity is what remains:"),
    eq("E = A - L."),
    p("Equity is the buffer that absorbs losses. A loss of $\\ell$ on the assets reduces equity one for one, $E' = E - \\ell$, while the liabilities stay the same. When losses exceed equity, $\\ell > E$, the assets no longer cover the liabilities and the bank defaults. With an equity ratio of 6% of assets, a loss of just over 6% of the balance sheet is enough."),
    p("The interbank market links these balance sheets. If bank $i$ has lent $X_{ij}$ to bank $j$, that loan is an asset of $i$ and a liability of $j$. Drawing every bank as a node and every loan as an arrow from lender to borrower gives an exposure network."),

    h("Default cascades"),
    p("Suppose bank $j$ defaults. Its creditors get back only a share $R$ of their claims, the recovery rate, so creditor $i$ loses"),
    eq("\\ell_i = X_{ij}\\,(1 - R)."),
    p("If this loss exceeds the creditor's equity, the creditor defaults too, and its own creditors take losses in the next round. This is the sequential default algorithm used by Furfine to stress-test interbank exposures: shock one bank, find which banks fail in round one, charge their creditors, find the next failures, and repeat until a round produces no new defaults. Writing $D_{t}$ for the set of banks that have defaulted by round $t$, bank $i$ defaults in round $t + 1$ when"),
    eq("\\sum_{j \\in D_t} X_{ij}\\,(1 - R) > E_i."),
    p("The Eisenberg–Noe model refines this by solving for all payments at once: each bank pays what it can out of what it receives, and the recovery rate comes out of the calculation rather than being fixed. The sequential version is enough to see the mechanism."),
    {
      kind: "worked",
      title: "A cascade among four banks",
      steps: [
        { text: "Banks A, B, C and D have equity of 5, 4, 3 and 10 (in bn). B has lent 10 to A, C has lent 8 to B, D has lent 6 to C and 4 to A. The recovery rate is 40%. A loses 12 on its loans to firms, more than its equity of 5, so A defaults in round one. In round two B loses its claim on A times $1 - R$:", tex: "10 \\cdot (1 - 0.4)", result: { value: 6, tolerance: 0.001 } },
        { text: "That is more than B's equity of 4, so B defaults. D also loses on its claim on A:", tex: "4 \\cdot 0.6", result: { value: 2.4, tolerance: 0.001 } },
        { text: "D survives with 7.6 of equity left. In round three C loses on its claim on B:", tex: "8 \\cdot 0.6", result: { value: 4.8, tolerance: 0.001 } },
        { text: "C's equity is 3, so C defaults. In round four D loses on its claim on C:", tex: "6 \\cdot 0.6", result: { value: 3.6, tolerance: 0.001 } },
        { text: "D's total loss is now", tex: "2.4 + 3.6", result: { value: 6, tolerance: 0.001 } },
        { text: "That is below D's equity of 10, so the cascade stops: three banks failed after a shock to one. The equity wiped out is 5 + 4 + 3 + 6 = 18 of the system's 22, as a share:", tex: "18 / 22", result: { value: 0.8182, tolerance: 0.0005 } },
      ],
    },
    p("The initial loss of 12 fell on A alone; the cascade destroyed 82% of the system's equity. C never dealt with A, yet it failed because it had lent to a bank that had."),
    {
      kind: "check",
      id: "systemic-contagion/creditor-loss",
      prompt: "A bank has lent 50 bn to a counterparty that defaults, and the recovery rate is 30%. How large is its loss, in bn?",
      answer: { type: "number", value: 35, tolerance: 0.01 },
      explain: "The loss is the exposure times one minus the recovery rate: $50 \\cdot (1 - 0.3) = 35$ bn.",
    },

    h("Fire sales"),
    p("Direct exposures are not the only link. A bank in trouble sells assets to raise cash or to cut its balance sheet, and large sales push prices down. With a linear price impact, selling a quantity $q$ moves the price to"),
    eq("P = P_0\\,(1 - \\lambda\\,q),"),
    p("where $\\lambda$ measures how illiquid the asset is. Every bank that holds the asset marks it at the new price, so a holder of $h$ units loses $h\\,P_0\\,\\lambda\\,q$ even though it never traded with the seller. Those losses can force more sales, which lower the price again. Fire sales spread losses through common holdings rather than through loans, which is why banks that look diversified can fail together when they all hold the same assets."),

    h("Funding runs"),
    p("Banks finance long-term loans with short-term money: deposits, repurchase agreements and short interbank loans. If lenders fear that a bank is weak, they refuse to roll over this funding. The bank must repay at once, and since its loans cannot be called in quickly, it has to sell assets, often at fire-sale prices. A run can therefore bring down a bank that was solvent before it started, and the fire sales it causes pass the losses on to other holders."),

    h("Network structure"),
    p("How far a cascade goes depends on the shape of the network. If each bank spreads its interbank lending over many borrowers, each claim is small, and the failure of one borrower costs every creditor a little, less than its equity. Losses are shared and absorbed. If each bank lends to only one or two others, each claim is large, and one failure can wipe out a creditor's equity on its own. In that sense more connections make a network safer."),
    p("The same connections have a second effect. When a shock is large enough, or hits several banks at once, a dense network passes losses to every bank, and the whole system can fail together. Gai and Kapadia, and Acemoglu, Ozdaglar and Tahbaz-Salehi, call this robust yet fragile: a highly connected network absorbs small shocks but transmits large ones everywhere. Concentration matters too. A bank that many others have lent to is too interconnected to fail, because its default would start a cascade whatever its size."),
    p("The figure places eight banks on a circle. Each has 100 units of assets, lends 20 of them to the banks that follow it, and holds equity of 6% of assets. Start at the defaults: a two-neighbour network, a 50% shock to bank A's external assets and no recovery. Each claim is 10, more than the equity of 6, so press Next round and watch the failures spread backwards around the circle until all 8 banks have defaulted after 5 default rounds and 100% of the system's equity is lost. Now switch to the complete network: each claim falls to 2.86, only A defaults and losses are 54.2% of equity. Back on two neighbours, raise the recovery rate to 50% and the cascade stops at A with 33.3% of equity lost. Then lower the equity buffer, or pick another bank to shock."),
    figure("contagion-cascade"),
    {
      kind: "check",
      id: "systemic-contagion/connectivity",
      prompt: "Each bank spreads the same total interbank lending over more borrowers. What happens to the damage from the failure of one bank after a small shock?",
      answer: { type: "choice", options: ["It shrinks, because each creditor loses less", "It grows, because more banks are exposed", "It is unchanged, because total lending is the same", "It depends only on the recovery rate"], correct: 0 },
      explain: "Each claim is smaller, so each creditor's loss $X_{ij}(1-R)$ is more likely to stay below its equity. Large shocks are different: then the dense network spreads losses to every bank.",
    },

    h("Measuring systemic importance"),
    p("Regulators want to know which institutions matter most for the system, not only which are riskiest on their own. A direct measure is the one the figure computes: the losses the failure of a given bank causes to the others. Two market-based measures are widely used. CoVaR is the Value at Risk of the financial system conditional on a given institution being in distress; the difference from its value in normal times, ΔCoVaR, is the institution's contribution. SRISK is the capital a firm would need to raise in a severe market decline to keep its equity at a prudent share of its assets."),
    note("Buffers and recovery work against the same multiplication: a larger equity buffer lets a bank absorb a creditor loss, and a higher recovery rate makes the loss smaller. That is why capital rules and central clearing both aim at contagion."),

    h("Summary"),
    list(
      "Systemic risk is the risk that losses spread from one institution to many; contagion travels through direct exposures, fire sales of common assets and funding runs.",
      "A bank defaults when its losses exceed its equity, $\\ell > E$; a creditor of a defaulted bank loses $X_{ij}(1 - R)$.",
      "Sequential default repeats this round by round until no new bank fails, and a shock to one bank can destroy most of the system's equity.",
      "Spreading exposures over many counterparties absorbs small shocks, but dense networks transmit large shocks everywhere: robust yet fragile.",
      "Systemic importance is measured by the losses a failure causes to others, and by market measures such as ΔCoVaR and SRISK.",
    ),
    lab("/systemic-risk", "Open the Systemic Risk lab"),
  ],
  hu: [
    p("„Kockáztatott érték (VaR) és várható veszteség (ES)” egyetlen portfólió farokveszteségeit mérte, a „Diverzifikáció és korreláció” pedig megmutatta, hogyan csökken a kockázat sok eszköz tartásával, ha azok nem együtt mozognak. Mindkettő adottnak veszi a piac többi részét. Pénzügyi válságban ez a feltevés összeomlik: a bankok egymással szemben és ugyanazokban az eszközökben tartanak követeléseket, így az egyik bukása megváltoztatja a többiek veszteségét. Ez a lecke egyetlen mérlegtől egy hálózatig építi fel ezt a kölcsönhatást, és megmutatja, hogyan nőhet egy bankot érő sokk rendszerszintű válsággá."),

    h("A rendszerkockázat"),
    p("A rendszerkockázat annak a kockázata, hogy a veszteségek egy intézménytől sokra terjednek át, és a pénzügyi rendszer egésze leáll: a fizetések elakadnak, a hitelezés megszűnik, és egészséges cégeket is olyan veszteségek érnek, amelyeket közvetlenül nem vállaltak. Egyetlen bank kockázatától abban különbözik, hogy a veszteség nem különálló veszteségek összege. Egy bank önmagában lehet jól tőkésített, és mégis csődbe mehet, mert a partnerei csődbe mennek. A veszteségek egyik intézményről a másikra terjedését fertőzésnek hívjuk. Három csatornán halad: a bankok közötti közvetlen kitettségeken, a közösen tartott eszközök tűzeladásán és a rövid lejáratú finanszírozás elleni bankrohamon."),

    h("Egy bank mérlege"),
    p("Egy bank eszközei a cégeknek és háztartásoknak nyújtott hitelek, az értékpapírok és a más bankoknak adott hitelek (bankközi eszközök). Forrásai a betétek, a kötvények és a más bankoktól felvett hitelek. A sajáttőke a kettő különbsége:"),
    eq("E = A - L."),
    p("A sajáttőke az a puffer, amely a veszteségeket elnyeli. Egy $\\ell$ nagyságú eszközveszteség egy az egyben csökkenti, $E' = E - \\ell$, miközben a források nem változnak. Ha a veszteség meghaladja a sajáttőkét, $\\ell > E$, az eszközök már nem fedezik a forrásokat, és a bank csődbe megy. Az eszközök 6%-ának megfelelő sajáttőke mellett ehhez a mérleg alig több mint 6%-ának elvesztése is elég."),
    p("A bankközi piac köti össze ezeket a mérlegeket. Ha az $i$ bank $X_{ij}$ összeget hitelezett a $j$ banknak, ez a hitel $i$ eszköze és $j$ forrása. Ha minden bankot csomópontként, minden hitelt pedig a hitelezőtől az adós felé mutató nyílként rajzolunk, megkapjuk a kitettségi hálózatot."),

    h("Csődláncolatok"),
    p("Tegyük fel, hogy a $j$ bank csődbe megy. A hitelezői követelésüknek csak egy $R$ hányadát kapják vissza, ez a megtérülési ráta, így az $i$ hitelező vesztesége"),
    eq("\\ell_i = X_{ij}\\,(1 - R)."),
    p("Ha ez a veszteség meghaladja a hitelező sajáttőkéjét, a hitelező is csődbe megy, és a következő körben a saját hitelezői szenvednek veszteséget. Ez a szekvenciális csődalgoritmus, amellyel Furfine a bankközi kitettségeket stressztesztelte: sokkolj egy bankot, nézd meg, melyik bank bukik el az első körben, terheld a veszteséget a hitelezőikre, keresd meg a következő bukásokat, és ismételd, amíg egy kör már nem hoz új csődöt. Ha $D_{t}$ a $t$-edik körig csődbe ment bankok halmaza, az $i$ bank a $t + 1$-edik körben megy csődbe, ha"),
    eq("\\sum_{j \\in D_t} X_{ij}\\,(1 - R) > E_i."),
    p("Az Eisenberg–Noe-modell ezt úgy finomítja, hogy az összes kifizetést egyszerre határozza meg: minden bank annyit fizet, amennyit a neki befolyó összegekből tud, és a megtérülési ráta a számítás eredménye, nem rögzített. A mechanizmus megértéséhez elég a szekvenciális változat."),
    {
      kind: "worked",
      title: "Csődlánc négy bank között",
      steps: [
        { text: "Az A, B, C és D bank sajáttőkéje 5, 4, 3 és 10 (milliárdban). B 10-et hitelezett A-nak, C 8-at B-nek, D 6-ot C-nek és 4-et A-nak. A megtérülési ráta 40%. A 12-t veszít a cégeknek adott hitelein, többet, mint az 5-ös sajáttőkéje, így az első körben csődbe megy. A második körben B elveszíti az A-val szembeni követelése $1 - R$ részét:", tex: "10 \\cdot (1 - 0{,}4)", result: { value: 6, tolerance: 0.001 } },
        { text: "Ez több B 4-es sajáttőkéjénél, így B csődbe megy. D is veszít az A-val szembeni követelésén:", tex: "4 \\cdot 0{,}6", result: { value: 2.4, tolerance: 0.001 } },
        { text: "D 7{,}6 sajáttőkével túlél. A harmadik körben C veszít a B-vel szembeni követelésén:", tex: "8 \\cdot 0{,}6", result: { value: 4.8, tolerance: 0.001 } },
        { text: "C sajáttőkéje 3, így C csődbe megy. A negyedik körben D veszít a C-vel szembeni követelésén:", tex: "6 \\cdot 0{,}6", result: { value: 3.6, tolerance: 0.001 } },
        { text: "D teljes vesztesége most", tex: "2{,}4 + 3{,}6", result: { value: 6, tolerance: 0.001 } },
        { text: "Ez a 10-es sajáttőkéje alatt marad, így a lánc megáll: egy bankot ért sokk után három bank ment csődbe. A megsemmisült sajáttőke 5 + 4 + 3 + 6 = 18 a rendszer 22-jéből, arányként:", tex: "18 / 22", result: { value: 0.8182, tolerance: 0.0005 } },
      ],
    },
    p("A 12-es kezdeti veszteség egyedül A-t érte; a csődlánc a rendszer sajáttőkéjének 82%-át semmisítette meg. C sosem állt kapcsolatban A-val, mégis csődbe ment, mert olyan banknak hitelezett, amelyik igen."),
    {
      kind: "check",
      id: "systemic-contagion/creditor-loss",
      prompt: "Egy bank 50 milliárdot hitelezett egy partnernek, amely csődbe megy, a megtérülési ráta 30%. Hány milliárd a vesztesége?",
      answer: { type: "number", value: 35, tolerance: 0.01 },
      explain: "A veszteség a kitettség szorozva eggyel mínusz a megtérülési rátával: $50 \\cdot (1 - 0{,}3) = 35$ milliárd.",
    },

    h("Tűzeladások"),
    p("A közvetlen kitettség nem az egyetlen kapcsolat. A bajba jutott bank eszközöket ad el, hogy készpénzhez jusson vagy csökkentse a mérlegét, és a nagy eladások lenyomják az árakat. Lineáris árhatás mellett $q$ mennyiség eladása után az ár"),
    eq("P = P_0\\,(1 - \\lambda\\,q),"),
    p("ahol $\\lambda$ az eszköz illikviditását méri. Minden bank, amely tartja az eszközt, az új áron értékeli, így egy $h$ egységet tartó bank $h\\,P_0\\,\\lambda\\,q$ veszteséget szenved, pedig sosem kötött az eladóval. Ezek a veszteségek újabb eladásokat kényszeríthetnek ki, amelyek tovább nyomják az árat. A tűzeladások nem hiteleken, hanem közös állományokon terjesztik a veszteséget, ezért bukhatnak el együtt diverzifikáltnak látszó bankok, ha mind ugyanazokat az eszközöket tartják."),

    h("Bankrohamok"),
    p("A bankok hosszú lejáratú hiteleket rövid lejáratú pénzből finanszíroznak: betétekből, repóügyletekből és rövid bankközi hitelekből. Ha a hitelezők attól tartanak, hogy egy bank gyenge, nem újítják meg ezt a finanszírozást. A banknak azonnal fizetnie kell, és mivel a hiteleit nem tudja gyorsan visszahívni, eszközöket kell eladnia, gyakran tűzeladási áron. A bankroham így olyan bankot is megbuktathat, amely előtte fizetőképes volt, az általa kiváltott tűzeladások pedig az eszköz többi tulajdonosára hárítják a veszteséget."),

    h("A hálózat szerkezete"),
    p("Hogy meddig jut egy csődlánc, a hálózat alakjától függ. Ha minden bank sok adós között osztja szét a bankközi hitelezését, minden követelés kicsi, és egy adós bukása minden hitelezőnek csak keveset, a sajáttőkéjénél kevesebbet okoz. A veszteség megoszlik és elnyelődik. Ha minden bank csak egy-két másiknak hitelez, minden követelés nagy, és egyetlen bukás magában eltüntetheti egy hitelező sajáttőkéjét. Ebben az értelemben a több kapcsolat biztonságosabbá teszi a hálózatot."),
    p("Ugyanezeknek a kapcsolatoknak van egy második hatása is. Ha a sokk elég nagy, vagy egyszerre több bankot ér, a sűrű hálózat minden bankhoz eljuttatja a veszteséget, és az egész rendszer együtt bukhat el. Gai és Kapadia, illetve Acemoglu, Ozdaglar és Tahbaz-Salehi ezt robusztus, mégis törékeny viselkedésnek nevezi: az erősen összekötött hálózat elnyeli a kis sokkokat, a nagyokat viszont mindenhová továbbítja. A koncentráció is számít. Az a bank, amelynek sokan hiteleztek, túl összekapcsolt ahhoz, hogy elbukjon, mert a csődje a méretétől függetlenül csődláncot indítana."),
    p("Az ábra nyolc bankot helyez egy körre. Mindegyiknek 100 egységnyi eszköze van, ebből 20-at az utána következő bankoknak hitelez, a sajáttőkéje pedig az eszközök 6%-a. Indulj az alapbeállításból: két szomszédos hálózat, 50%-os sokk az A bank külső eszközein és nulla megtérülés. Minden követelés 10, több a 6-os sajáttőkénél, ezért nyomd meg a Következő kör gombot, és figyeld, ahogy a csődök visszafelé terjednek a körön, amíg 5 csődkör után mind a 8 bank csődbe megy, és a rendszer sajáttőkéjének 100%-a elvész. Most válts a teljes hálózatra: minden követelés 2{,}86-ra csökken, csak A megy csődbe, a veszteség a sajáttőke 54{,}2%-a. A két szomszédos hálózatban emeld a megtérülési rátát 50%-ra, és a lánc A-nál megáll, 33{,}3%-os sajáttőke-veszteséggel. Ezután csökkentsd a sajáttőke-puffert, vagy válassz másik bankot a sokkhoz."),
    figure("contagion-cascade"),
    {
      kind: "check",
      id: "systemic-contagion/connectivity",
      prompt: "Minden bank ugyanakkora teljes bankközi hitelezést több adós között oszt szét. Mi történik egy kis sokk után egy bank bukásának kárával?",
      answer: { type: "choice", options: ["Csökken, mert minden hitelező kevesebbet veszít", "Nő, mert több bank kitett", "Nem változik, mert a teljes hitelezés ugyanaz", "Csak a megtérülési rátától függ"], correct: 0 },
      explain: "Minden követelés kisebb, így minden hitelező $X_{ij}(1-R)$ vesztesége nagyobb eséllyel marad a sajáttőkéje alatt. Nagy sokknál más a helyzet: akkor a sűrű hálózat minden bankhoz eljuttatja a veszteséget.",
    },

    h("A rendszerszintű jelentőség mérése"),
    p("A felügyeletek azt akarják tudni, melyik intézmény a legfontosabb a rendszer szempontjából, nem csak azt, melyik a legkockázatosabb önmagában. Közvetlen mérőszám az, amit az ábra is számol: mekkora veszteséget okoz a többieknek egy adott bank bukása. Két piaci alapú mérőszám is elterjedt. A CoVaR a pénzügyi rendszer kockáztatott értéke azzal a feltétellel, hogy egy adott intézmény bajban van; a normál időszakbeli értékétől vett különbsége, a ΔCoVaR, az intézmény hozzájárulása. Az SRISK az a tőke, amelyet egy cégnek egy súlyos piaci esés során be kellene vonnia ahhoz, hogy a sajáttőkéje az eszközei megfontolt hányada maradjon."),
    note("A puffer és a megtérülés ugyanaz ellen a sokszorozódás ellen dolgozik: nagyobb sajáttőke-pufferrel a bank elnyeli a hitelezői veszteséget, magasabb megtérülési rátával pedig a veszteség kisebb. Ezért céloz a fertőzésre a tőkeszabályozás és a központi elszámolás is."),

    h("Összefoglalás"),
    list(
      "A rendszerkockázat annak a kockázata, hogy a veszteségek egy intézménytől sokra terjednek át; a fertőzés közvetlen kitettségeken, közös eszközök tűzeladásán és bankrohamokon keresztül halad.",
      "Egy bank csődbe megy, ha a vesztesége meghaladja a sajáttőkéjét, $\\ell > E$; egy csődbe ment bank hitelezője $X_{ij}(1 - R)$-t veszít.",
      "A szekvenciális csődalgoritmus ezt körről körre ismétli, amíg nem bukik el új bank, és egyetlen bankot ért sokk a rendszer sajáttőkéjének nagy részét megsemmisítheti.",
      "A sok partnerre szétosztott kitettség elnyeli a kis sokkokat, de a sűrű hálózat a nagy sokkokat mindenhová továbbítja: robusztus, mégis törékeny.",
      "A rendszerszintű jelentőséget a bukás által másoknak okozott veszteség, illetve piaci mérőszámok, például a ΔCoVaR és az SRISK mérik.",
    ),
    lab("/systemic-risk", "Nyisd meg a rendszerkockázat labort"),
  ],
};
