import type { GuideLessonContent } from "../../features/guide/guide.content.types";
import { eq, figure, h, lab, list, note, p } from "./blocks";

export const martingales: GuideLessonContent = {
  en: [
    p("The lesson \"Random walks and Brownian motion\" built the random walk $W_n$ and its continuous limit $W_t$, and computed their mean and variance as seen from time zero. In practice we forecast from wherever we are now, knowing the path so far. This lesson makes that precise with conditional expectation, defines a martingale (the mathematical model of a fair game), and shows why no betting strategy can turn a fair game into a profitable one."),

    h("Information up to time n"),
    p("Watch the coin-flip walk of the previous lesson step by step. After $n$ tosses you know the outcomes $X_1, \\dots, X_n$, and therefore the whole path $W_0, W_1, \\dots, W_n$. Call this information $\\mathcal{F}_n$, the **history up to time $n$**. It only grows: whatever you know at time $n$ you still know at time $n + 1$. In continuous time $\\mathcal{F}_t$ is the history of the Brownian path up to time $t$."),

    h("Conditional expectation"),
    p("The **conditional expectation** $\\mathbb{E}[Y \\mid \\mathcal{F}_n]$ of a random quantity $Y$ is the best forecast of $Y$ given the history up to time $n$. It is not a number fixed in advance: it is computed from the path observed so far, so it is itself random as seen from time zero."),
    p("Example: toss a fair coin twice and let $Y$ be the number of heads. Before any toss, $\\mathbb{E}[Y] = 1$. After the first toss the forecast is updated: if it was heads, $\\mathbb{E}[Y \\mid \\mathcal{F}_1] = 1 + \\tfrac12 = 1.5$; if it was tails, it is $0 + \\tfrac12 = 0.5$."),
    p("Averaging the updated forecast over the first toss gives back the original one: $\\tfrac12 \\cdot 1.5 + \\tfrac12 \\cdot 0.5 = 1$. This is the **tower property**: forecasting today what tomorrow's forecast will be gives today's forecast."),
    eq("\\mathbb{E}\\big[\\,\\mathbb{E}[Y \\mid \\mathcal{F}_{n+1}] \\mid \\mathcal{F}_n\\big] = \\mathbb{E}[Y \\mid \\mathcal{F}_n]."),

    h("Martingales"),
    p("A process $M_0, M_1, M_2, \\dots$ whose value $M_n$ is known at time $n$ is a **martingale** if the best forecast of its next value is its current value:"),
    eq("\\mathbb{E}[M_{n+1} \\mid \\mathcal{F}_n] = M_n \\quad \\text{for every } n."),
    note("A martingale is a fair game: given everything observed so far, the expected change over the next step is zero. By the tower property the same holds over any number of steps, $\\mathbb{E}[M_m \\mid \\mathcal{F}_n] = M_n$ for $m \\ge n$, and in particular $\\mathbb{E}[M_n] = M_0$."),
    p("If the forecast is at least the current value, $\\mathbb{E}[M_{n+1} \\mid \\mathcal{F}_n] \\ge M_n$, the process is a **submartingale** (a game in your favour); with $\\le$ it is a **supermartingale** (a game against you, like a casino with a house edge)."),

    h("Examples from Brownian motion"),
    list(
      "The symmetric random walk is a martingale: $\\mathbb{E}[W_{n+1} \\mid \\mathcal{F}_n] = W_n + \\mathbb{E}[X_{n+1}] = W_n$, because the next toss is independent of the past and has mean zero.",
      "Brownian motion is a martingale in continuous time: for $s < t$, $W_t = W_s + (W_t - W_s)$, and the increment is independent of the past with mean zero, so $\\mathbb{E}[W_t \\mid \\mathcal{F}_s] = W_s$.",
      "$W_t^2$ is not a martingale. Writing $W_t^2 = W_s^2 + 2W_s(W_t - W_s) + (W_t - W_s)^2$ and taking the forecast gives $\\mathbb{E}[W_t^2 \\mid \\mathcal{F}_s] = W_s^2 + (t - s)$: it drifts upward, so it is a submartingale.",
      "$W_t^2 - t$ is a martingale: subtracting the drift $t$ removes exactly the upward tendency.",
    ),
    p("Example: suppose $W_1 = 1$. The forecast of $W_4$ is still 1, but the forecast of $W_4^2$ is $1 + 3 = 4$, not 1. The spread of the path grows even though its centre does not move."),

    h("Betting strategies"),
    p("Bet on a fair coin round by round. Before round $k$ you choose a stake $H_k$, using only the history $\\mathcal{F}_{k-1}$, and win or lose it: your wealth changes by $H_k X_k$ with $X_k = \\pm 1$. After $n$ rounds"),
    eq("V_n = V_0 + \\sum_{k=1}^{n} H_k X_k, \\qquad \\mathbb{E}[V_{n+1} \\mid \\mathcal{F}_n] = V_n + H_{n+1}\\,\\mathbb{E}[X_{n+1}] = V_n."),
    p("The stake can be pulled out of the forecast because it is known at time $n$, and the coin has mean zero whatever the stake. So the wealth of every such strategy is again a martingale (a **martingale transform**), and its expected value stays at $V_0$. A strategy can change the shape of the outcome distribution, but not its mean."),
    p("The famous **doubling strategy** stakes 1, and after every loss doubles the stake, so that the first win recovers all earlier losses plus 1. Limit it to at most 5 rounds. A win in any of the first five rounds gives a net gain of 1. Losing all five rounds has probability $(\\tfrac12)^5 = \\tfrac1{32}$ and costs $1 + 2 + 4 + 8 + 16 = 31$. The expected gain is"),
    eq("\\tfrac{31}{32} \\cdot 1 + \\tfrac{1}{32} \\cdot (-31) = 0."),
    p("The strategy wins a little with probability $96.9\\%$ and loses a lot with probability $3.1\\%$. Without a round limit it needs unlimited credit: after 10 losses in a row the next stake is 512 and the losses so far are 1023."),
    p("In the figure you play this game yourself, starting from a wealth of 100. Choose a strategy: a constant stake of 1, doubling after a loss (stakes up to 64, then back to 1), or a stake of 5% of current wealth; no stake can exceed what you have. \"Flip once\" plays one round and \"Play 100 rounds\" plays a hundred, drawing your wealth as a step plot. \"Simulate 1000 players\" lets 1000 players play 100 rounds each with the chosen strategy and draws a histogram of their final wealth, with the average marked; \"Reset\" starts again with fresh coins. Compare the three strategies. The average final wealth stays near 100 in every case (the readout shows it with its 95% sampling band), but with a constant stake about 46% of players end ahead and nobody falls below about 60, with doubling about two thirds end ahead and some lose everything, and with 5% of wealth only about 38% end ahead while a few players finish with several times their starting wealth."),
    figure("martingale-betting"),

    h("Prices as martingales"),
    p("Martingales are the language of arbitrage-free pricing. In \"Risk-neutral probabilities\" the stock was expected to earn the risk-free rate under $\\mathbb{Q}$, which says exactly that the discounted price $e^{-rt}S_t$ is a martingale under $\\mathbb{Q}$. \"Change of measure and Girsanov's theorem\" shows how to move from the real-world measure $\\mathbb{P}$, under which this fails, to $\\mathbb{Q}$, under which it holds. A price is then simply the forecast of the discounted payoff."),

    h("Summary"),
    list(
      "$\\mathcal{F}_n$ is the history up to time $n$; $\\mathbb{E}[Y \\mid \\mathcal{F}_n]$ is the best forecast of $Y$ given it, and the tower property says forecasts of forecasts are forecasts.",
      "A martingale satisfies $\\mathbb{E}[M_{n+1} \\mid \\mathcal{F}_n] = M_n$: a fair game, with $\\mathbb{E}[M_n] = M_0$.",
      "$W_t$ and $W_t^2 - t$ are martingales; $W_t^2$ drifts upward and is a submartingale.",
      "Any betting strategy on a fair game, with stakes chosen from the past, keeps the expected wealth unchanged. Doubling only trades many small wins for a rare large loss.",
    ),
    note("The next lesson, \"Itô's lemma\", computes how functions of $W_t$ such as $W_t^2$ change over time, and the $t$ in $W_t^2 - t$ reappears there as the correction term."),
    lab("/brownian-motion", "Simulate Brownian paths and watch their spread grow in the Brownian motion lab"),
  ],

  hu: [
    p("A „Véletlen bolyongás és Brown-mozgás” című lecke felépítette a $W_n$ véletlen bolyongást és folytonos határértékét, a $W_t$ folyamatot, és kiszámolta a várható értéküket és szórásnégyzetüket a nulla időpontból nézve. A gyakorlatban viszont onnan becslünk előre, ahol éppen tartunk, az addigi pálya ismeretében. Ez a lecke ezt a feltételes várható értékkel teszi pontossá, definiálja a martingált (az igazságos játék matematikai modelljét), és megmutatja, miért nem tehető nyereségessé egy igazságos játék semmilyen fogadási stratégiával."),

    h("Az n-edik időpontig ismert információ"),
    p("Kövessük lépésről lépésre az előző lecke érmedobásos bolyongását. $n$ dobás után ismerjük az $X_1, \\dots, X_n$ kimeneteleket, így a teljes $W_0, W_1, \\dots, W_n$ pályát is. Ezt az információt jelöljük $\\mathcal{F}_n$-nel, ez az **$n$-edik időpontig ismert történet**. Csak bővülhet: amit az $n$-edik időpontban tudunk, azt az $(n+1)$-edikben is tudjuk. Folytonos időben $\\mathcal{F}_t$ a Brown-pálya története a $t$ időpontig."),

    h("Feltételes várható érték"),
    p("Egy $Y$ véletlen mennyiség $\\mathbb{E}[Y \\mid \\mathcal{F}_n]$ **feltételes várható értéke** az $Y$ legjobb előrejelzése az $n$-edik időpontig ismert történet alapján. Ez nem előre rögzített szám: az addig megfigyelt pályából számoljuk, így a nulla időpontból nézve maga is véletlen."),
    p("Példa: dobjunk fel kétszer egy szabályos érmét, és legyen $Y$ a fejek száma. Az első dobás előtt $\\mathbb{E}[Y] = 1$. Az első dobás után frissítjük az előrejelzést: ha fej volt, $\\mathbb{E}[Y \\mid \\mathcal{F}_1] = 1 + \\tfrac12 = 1{,}5$; ha írás, akkor $0 + \\tfrac12 = 0{,}5$."),
    p("Ha a frissített előrejelzést átlagoljuk az első dobás szerint, visszakapjuk az eredetit: $\\tfrac12 \\cdot 1{,}5 + \\tfrac12 \\cdot 0{,}5 = 1$. Ez a **toronyszabály**: ha ma előrejelezzük a holnapi előrejelzést, a mai előrejelzést kapjuk."),
    eq("\\mathbb{E}\\big[\\,\\mathbb{E}[Y \\mid \\mathcal{F}_{n+1}] \\mid \\mathcal{F}_n\\big] = \\mathbb{E}[Y \\mid \\mathcal{F}_n]."),

    h("Martingálok"),
    p("Egy $M_0, M_1, M_2, \\dots$ folyamat, amelynek $M_n$ értéke az $n$-edik időpontban ismert, **martingál**, ha a következő értékének legjobb előrejelzése a jelenlegi értéke:"),
    eq("\\mathbb{E}[M_{n+1} \\mid \\mathcal{F}_n] = M_n \\quad \\text{minden } n\\text{-re}."),
    note("A martingál igazságos játék: mindazok ismeretében, amit eddig megfigyeltünk, a következő lépés várható változása nulla. A toronyszabály miatt ugyanez igaz tetszőleges számú lépésre, $\\mathbb{E}[M_m \\mid \\mathcal{F}_n] = M_n$, ha $m \\ge n$, és speciálisan $\\mathbb{E}[M_n] = M_0$."),
    p("Ha az előrejelzés legalább a jelenlegi érték, $\\mathbb{E}[M_{n+1} \\mid \\mathcal{F}_n] \\ge M_n$, a folyamat **szubmartingál** (nekünk kedvező játék); $\\le$ esetén **szupermartingál** (ellenünk szóló játék, mint egy kaszinó, ahol a ház előnyben van)."),

    h("Példák a Brown-mozgásból"),
    list(
      "A szimmetrikus véletlen bolyongás martingál: $\\mathbb{E}[W_{n+1} \\mid \\mathcal{F}_n] = W_n + \\mathbb{E}[X_{n+1}] = W_n$, mert a következő dobás független a múlttól, és várható értéke nulla.",
      "A Brown-mozgás folytonos idejű martingál: $s < t$ esetén $W_t = W_s + (W_t - W_s)$, a növekmény független a múlttól és nulla várható értékű, így $\\mathbb{E}[W_t \\mid \\mathcal{F}_s] = W_s$.",
      "$W_t^2$ nem martingál. A $W_t^2 = W_s^2 + 2W_s(W_t - W_s) + (W_t - W_s)^2$ felbontásból az előrejelzés $\\mathbb{E}[W_t^2 \\mid \\mathcal{F}_s] = W_s^2 + (t - s)$: felfelé sodródik, tehát szubmartingál.",
      "$W_t^2 - t$ martingál: a $t$ levonása éppen a felfelé irányuló tendenciát tünteti el.",
    ),
    p("Példa: tegyük fel, hogy $W_1 = 1$. A $W_4$ előrejelzése továbbra is 1, de a $W_4^2$ előrejelzése $1 + 3 = 4$, nem pedig 1. A pálya szóródása nő, a közepe viszont nem mozdul."),

    h("Fogadási stratégiák"),
    p("Fogadjunk körről körre egy szabályos érmére. A $k$-adik kör előtt megválasztjuk a $H_k$ tétet, kizárólag az $\\mathcal{F}_{k-1}$ történet alapján, és ezt megnyerjük vagy elveszítjük: a vagyonunk $H_k X_k$-val változik, ahol $X_k = \\pm 1$. $n$ kör után"),
    eq("V_n = V_0 + \\sum_{k=1}^{n} H_k X_k, \\qquad \\mathbb{E}[V_{n+1} \\mid \\mathcal{F}_n] = V_n + H_{n+1}\\,\\mathbb{E}[X_{n+1}] = V_n."),
    p("A tét kiemelhető az előrejelzésből, mert az $n$-edik időpontban ismert, az érme várható értéke pedig a tét nagyságától függetlenül nulla. Így minden ilyen stratégia vagyona ismét martingál (**martingáltranszformált**), és a várható értéke $V_0$ marad. Egy stratégia megváltoztathatja a kimenetelek eloszlásának alakját, de a várható értékét nem."),
    p("A híres **duplázó stratégia** 1-es téttel indul, és minden vesztés után megduplázza a tétet, így az első nyerés visszahozza az összes korábbi veszteséget, és még 1-et. Korlátozzuk legfeljebb 5 körre. Ha az első öt kör bármelyikében nyerünk, a nettó nyereség 1. Mind az öt kör elvesztésének valószínűsége $(\\tfrac12)^5 = \\tfrac1{32}$, és ekkor a veszteség $1 + 2 + 4 + 8 + 16 = 31$. A várható nyereség"),
    eq("\\tfrac{31}{32} \\cdot 1 + \\tfrac{1}{32} \\cdot (-31) = 0."),
    p("A stratégia $96{,}9\\%$ valószínűséggel nyer egy keveset, és $3{,}1\\%$ valószínűséggel veszít sokat. Körkorlát nélkül korlátlan hitelre volna szükség: 10 egymást követő vesztés után a következő tét 512, az addigi veszteség pedig 1023."),
    p("Az ábrán ezt a játékot magunk játszhatjuk, 100-as kezdő vagyonnal. Válasszunk stratégiát: állandó 1-es tét, duplázás vesztés után (legfeljebb 64-es tétig, utána újra 1), vagy a pillanatnyi vagyon 5%-a; egyik tét sem lehet nagyobb, mint ami a vagyonunk. Az „Egy dobás” egy kört játszik le, a „100 kör” százat, a vagyont lépcsős grafikonon rajzolva. Az „1000 játékos szimulálása” ezer játékost játszat le 100–100 kört a választott stratégiával, és hisztogramot rajzol a végső vagyonukról, az átlagot megjelölve; az „Újrakezdés” új dobásokkal indít. Hasonlítsuk össze a három stratégiát. Az átlagos végső vagyon minden esetben 100 közelében marad (a kijelző a 95%-os mintavételi sávval együtt mutatja), de állandó tétnél a játékosok nagyjából 46%-a végez nyereségben, és senki sem esik 60 körüli szint alá; duplázásnál nagyjából kétharmaduk végez nyereségben, néhányan viszont mindent elveszítenek; a vagyon 5%-ának feltételével pedig csak nagyjából 38%-uk végez nyereségben, miközben néhányan a kezdő vagyonuk többszörösével zárnak."),
    figure("martingale-betting"),

    h("Árak mint martingálok"),
    p("A martingálok az arbitrázsmentes árazás nyelve. A „Kockázatsemleges valószínűségek” című leckében a részvény $\\mathbb{Q}$ alatt a kockázatmentes kamatot hozta várhatóan, ami pontosan azt jelenti, hogy a diszkontált $e^{-rt}S_t$ ár martingál $\\mathbb{Q}$ alatt. A „Mértékcsere és a Girsanov-tétel” megmutatja, hogyan lehet a valós $\\mathbb{P}$ mértékről, amely alatt ez nem teljesül, áttérni a $\\mathbb{Q}$ mértékre, amely alatt igen. Egy ár ekkor egyszerűen a diszkontált kifizetés előrejelzése."),

    h("Összefoglalás"),
    list(
      "$\\mathcal{F}_n$ az $n$-edik időpontig ismert történet; $\\mathbb{E}[Y \\mid \\mathcal{F}_n]$ ennek alapján az $Y$ legjobb előrejelzése, a toronyszabály szerint pedig az előrejelzések előrejelzése is előrejelzés.",
      "A martingálra $\\mathbb{E}[M_{n+1} \\mid \\mathcal{F}_n] = M_n$: igazságos játék, $\\mathbb{E}[M_n] = M_0$ értékkel.",
      "$W_t$ és $W_t^2 - t$ martingál; $W_t^2$ felfelé sodródik, szubmartingál.",
      "Igazságos játékban minden fogadási stratégia, amely a tétet a múlt alapján választja, változatlanul hagyja a várható vagyont. A duplázás csak sok kis nyereséget cserél egy ritka nagy veszteségre.",
    ),
    note("A következő lecke, „Az Itô-lemma”, kiszámolja, hogyan változnak időben a $W_t$ függvényei, például $W_t^2$, és a $W_t^2 - t$ kifejezésben szereplő $t$ ott korrekciós tagként tér vissza."),
    lab("/brownian-motion", "Szimuláljunk Brown-pályákat, és figyeljük a szóródásuk növekedését a Brown-mozgás laborban"),
  ],
};
