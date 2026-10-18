import type { GuideLessonContent } from "../../features/guide/guide.content.types";
import { eq, figure, h, lab, list, note, p } from "./blocks";

export const annuities: GuideLessonContent = {
  en: [
    p("Many financial contracts pay the same amount at regular intervals: a pension, a lease, a bond's coupons, the instalments of a mortgage. Valuing them one payment at a time works, but it is slow and hides the structure. This lesson derives closed formulas for such streams, using the discounting from \"Interest, compounding and discounting\", and applies them to the repayment of a loan."),
    p("Throughout the lesson payments are made once a year, the rate $r$ is compounded annually, and the first payment arrives one year from today unless stated otherwise."),

    h("Ordinary annuities"),
    p("An **annuity** is a stream of $n$ equal payments $C$ at the ends of years $1, 2, \\dots, n$. Its present value is the sum of the discounted payments:"),
    eq("\\text{PV} = \\frac{C}{1+r} + \\frac{C}{(1+r)^2} + \\cdots + \\frac{C}{(1+r)^n}."),
    p("This is a geometric series with first term $C/(1+r)$ and ratio $q = 1/(1+r)$. Using $a + aq + \\cdots + aq^{n-1} = a\\,(1 - q^n)/(1 - q)$ and simplifying gives"),
    eq("\\text{PV} = C \\cdot \\frac{1 - (1+r)^{-n}}{r}."),
    p("The fraction is the **annuity factor**: the present value of 1 a year for $n$ years. Compounding the present value forward by $n$ years gives the **future value** at the date of the last payment:"),
    eq("\\text{FV} = \\text{PV}\\,(1+r)^n = C \\cdot \\frac{(1+r)^n - 1}{r}."),
    p("Example: 1,000 a year for 10 years at $r = 6\\%$. The annuity factor is $(1 - 1.06^{-10})/0.06 \\approx 7.3601$, so $\\text{PV} \\approx 7{,}360.09$ and $\\text{FV} \\approx 13{,}180.79$. The ten payments add up to 10,000, but they are worth only 7,360.09 today, because most of them arrive years from now."),

    h("Annuities due"),
    p("If each payment is made at the start of the year instead of the end, as with rent, the stream is an **annuity due**. Every payment arrives one year earlier, so every discounted term is multiplied by $(1+r)$:"),
    eq("\\text{PV}_{\\text{due}} = (1+r) \\cdot C \\cdot \\frac{1 - (1+r)^{-n}}{r}."),
    p("In the example, $1.06 \\times 7{,}360.09 \\approx 7{,}801.69$."),

    h("Perpetuities"),
    p("A **perpetuity** pays $C$ every year forever. Letting $n \\to \\infty$ in the annuity formula, $(1+r)^{-n} \\to 0$, so"),
    eq("\\text{PV} = \\frac{C}{r}."),
    p("A **growing perpetuity** pays $C$ after one year and grows at the constant rate $g$ after that: $C$, $C(1+g)$, $C(1+g)^2$, and so on. The series is again geometric, with ratio $(1+g)/(1+r)$, and it converges only when $g < r$:"),
    eq("\\text{PV} = \\frac{C}{r - g}, \\qquad g < r."),
    p("At $r = 6\\%$, a perpetuity of 1,000 is worth $1{,}000/0.06 \\approx 16{,}666.67$. If the payment grows by 2% a year, it is worth $1{,}000/0.04 = 25{,}000$. The growing perpetuity is the formula behind the terminal value in company valuation."),
    note("Annuity factor $(1 - (1+r)^{-n})/r$, perpetuity $C/r$, growing perpetuity $C/(r - g)$ for $g < r$. Each is a geometric sum of discounted payments."),

    h("The payment on a loan"),
    p("A level-payment loan of amount $L$ over $n$ years is an annuity seen from the lender's side: the lender pays $L$ today and receives $n$ equal payments $C$. The loan is fairly priced when the present value of the payments equals $L$, so"),
    eq("C = \\frac{L}{\\dfrac{1 - (1+r)^{-n}}{r}} = \\frac{L\\,r}{1 - (1+r)^{-n}}."),
    p("Example: a loan of 200,000 at 6% over 10 years. The annuity factor is 7.3601, so the annual payment is $200{,}000 / 7.3601 \\approx 27{,}173.59$. Over the life of the loan the borrower pays $10 \\times 27{,}173.59 \\approx 271{,}735.92$, of which 71,735.92 is interest."),

    h("The amortization schedule"),
    p("Each payment is split in two. The **interest** part is the rate times the balance still owed at the start of the year. The rest of the payment is **principal** and reduces the balance:"),
    eq("I_t = r\\,B_{t-1}, \\qquad P_t = C - I_t, \\qquad B_t = B_{t-1} - P_t."),
    p("For the loan above, with $B_0 = 200{,}000$:"),
    list(
      "Year 1: interest $0.06 \\times 200{,}000 = 12{,}000$, principal $27{,}173.59 - 12{,}000 = 15{,}173.59$, closing balance 184,826.41.",
      "Year 2: interest $0.06 \\times 184{,}826.41 \\approx 11{,}089.58$, principal 16,084.01, closing balance 168,742.40.",
    ),
    h("Solving for the term"),
    p("The same equation can be turned around. If the borrower can afford a payment $C$, the number of years needed to repay $L$ follows from $L = C\\,(1 - (1+r)^{-n})/r$ by taking logarithms:"),
    eq("n = -\\frac{\\ln\\left(1 - \\dfrac{L\\,r}{C}\\right)}{\\ln(1+r)}."),
    p("Paying 20,000 a year on the 200,000 loan at 6% gives $n = -\\ln(1 - 0.6)/\\ln 1.06 \\approx 15.73$ years, so in practice 16 payments, the last one smaller. The formula also shows a limit: if $C \\le L\\,r = 12{,}000$, the payment does not even cover the first year's interest and the loan is never repaid. Solving for the rate instead has no closed form; it is found numerically, exactly like the internal rate of return in the next lesson."),

    h("How the payments change"),
    p("The payment stays the same, but its make-up shifts. Early on the balance is large, so most of the payment is interest; as the balance falls, the interest part shrinks and the principal part grows. By construction the balance reaches exactly zero with the last payment."),
    p("The figure draws the whole schedule. Each bar is one year's payment, split into interest (bottom) and principal (top); the dashed line is the balance left at the end of each year, on the right-hand axis. Click a year, or move to it with Tab and press Enter, to see that row of the schedule worked out below the chart. Start with year 1 at the defaults (10 years, 6%), then switch the term to 30 years: the payment falls to about 14,530, but 82.6% of the first payment is now interest, and total interest rises to more than the loan itself."),
    figure("amortization-schedule"),

    h("Summary"),
    list(
      "An annuity of $C$ for $n$ years is worth $C\\,(1 - (1+r)^{-n})/r$ today; an annuity due is worth $(1+r)$ times as much.",
      "A perpetuity is worth $C/r$, and a growing perpetuity $C/(r - g)$ as long as $g < r$.",
      "A level loan payment is the loan amount divided by the annuity factor.",
      "Each payment is interest on the opening balance plus principal; early payments are mostly interest, and longer terms shift the mix further towards interest.",
    ),
    note("The next lesson, \"Net present value and internal rate of return\", values projects whose cash flows are not level, by discounting each one separately with the same tools."),
    lab("/tvm", "Try regular contributions and compound growth in the Time Value of Money lab"),
  ],

  hu: [
    p("Sok pénzügyi szerződés rendszeres időközönként ugyanakkora összeget fizet: egy nyugdíj, egy lízing, egy kötvény kamatszelvényei, egy jelzáloghitel részletei. Kifizetésenként is értékelhetők, de ez lassú, és elfedi a szerkezetet. Ez a lecke zárt képleteket vezet le az ilyen pénzáramokra a „Kamat, kamatozás és diszkontálás” című lecke diszkontálására építve, majd alkalmazza őket egy hitel törlesztésére."),
    p("A lecke végig évi egy kifizetéssel és évente tőkésített $r$ kamatlábbal számol, és ha mást nem mondunk, az első kifizetés egy év múlva esedékes."),

    h("Utólagos annuitás"),
    p("Az **annuitás** $n$ darab egyenlő, $C$ nagyságú kifizetés az $1, 2, \\dots, n$. év végén. Jelenértéke a diszkontált kifizetések összege:"),
    eq("\\text{PV} = \\frac{C}{1+r} + \\frac{C}{(1+r)^2} + \\cdots + \\frac{C}{(1+r)^n}."),
    p("Ez egy mértani sor, amelynek első tagja $C/(1+r)$, hányadosa $q = 1/(1+r)$. Az $a + aq + \\cdots + aq^{n-1} = a\\,(1 - q^n)/(1 - q)$ összefüggést használva és egyszerűsítve"),
    eq("\\text{PV} = C \\cdot \\frac{1 - (1+r)^{-n}}{r}."),
    p("A tört az **annuitásfaktor**: évi 1 egység $n$ éven át tartó kifizetésének jelenértéke. Ha a jelenértéket $n$ évvel előre kamatoztatjuk, megkapjuk az utolsó kifizetés napjára vonatkozó **jövőértéket**:"),
    eq("\\text{FV} = \\text{PV}\\,(1+r)^n = C \\cdot \\frac{(1+r)^n - 1}{r}."),
    p("Példa: évi 1000 tíz éven át, $r = 6\\%$ mellett. Az annuitásfaktor $(1 - 1{,}06^{-10})/0{,}06 \\approx 7{,}3601$, így $\\text{PV} \\approx 7360{,}09$ és $\\text{FV} \\approx 13\\,180{,}79$. A tíz kifizetés összesen 10 000, ma mégis csak 7360,09-et ér, mert a legtöbbjük évek múlva érkezik."),

    h("Előleges annuitás"),
    p("Ha minden kifizetés az év elején esedékes, mint például a bérleti díj, akkor **előleges annuitásról** beszélünk. Minden kifizetés egy évvel korábban érkezik, ezért minden diszkontált tag $(1+r)$-szeresére nő:"),
    eq("\\text{PV}_{\\text{előleges}} = (1+r) \\cdot C \\cdot \\frac{1 - (1+r)^{-n}}{r}."),
    p("A példában $1{,}06 \\times 7360{,}09 \\approx 7801{,}69$."),

    h("Örökjáradékok"),
    p("Az **örökjáradék** minden évben $C$-t fizet, örökké. Az annuitásképletben $n \\to \\infty$ esetén $(1+r)^{-n} \\to 0$, így"),
    eq("\\text{PV} = \\frac{C}{r}."),
    p("A **növekvő örökjáradék** egy év múlva $C$-t fizet, utána pedig állandó $g$ ütemben nő: $C$, $C(1+g)$, $C(1+g)^2$ és így tovább. A sor ismét mértani, hányadosa $(1+g)/(1+r)$, és csak $g < r$ esetén konvergens:"),
    eq("\\text{PV} = \\frac{C}{r - g}, \\qquad g < r."),
    p("$r = 6\\%$ mellett egy 1000-es örökjáradék értéke $1000/0{,}06 \\approx 16\\,666{,}67$. Ha a kifizetés évente 2%-kal nő, az értéke $1000/0{,}04 = 25\\,000$. A növekvő örökjáradék képlete áll a vállalatértékelésben használt maradványérték mögött."),
    note("Annuitásfaktor $(1 - (1+r)^{-n})/r$, örökjáradék $C/r$, növekvő örökjáradék $C/(r - g)$, ha $g < r$. Mindhárom diszkontált kifizetések mértani összege."),

    h("A hitel törlesztőrészlete"),
    p("Egy $L$ összegű, $n$ éves, egyenlő részletekben törlesztett hitel a hitelező szemszögéből annuitás: ma kifizet $L$-et, és $n$ egyenlő, $C$ nagyságú részletet kap. A hitel akkor van korrekt áron, ha a részletek jelenértéke éppen $L$, tehát"),
    eq("C = \\frac{L}{\\dfrac{1 - (1+r)^{-n}}{r}} = \\frac{L\\,r}{1 - (1+r)^{-n}}."),
    p("Példa: 200 000 hitel 6%-os kamattal, 10 évre. Az annuitásfaktor 7,3601, így az éves részlet $200\\,000 / 7{,}3601 \\approx 27\\,173{,}59$. A futamidő alatt az adós $10 \\times 27\\,173{,}59 \\approx 271\\,735{,}92$-t fizet, ebből 71 735,92 a kamat."),

    h("A törlesztési terv"),
    p("Minden részlet két részre bomlik. A **kamatrész** a kamatláb szorozva az év elején még fennálló tartozással. A részlet többi része **tőketörlesztés**, és ennyivel csökken a tartozás:"),
    eq("I_t = r\\,B_{t-1}, \\qquad P_t = C - I_t, \\qquad B_t = B_{t-1} - P_t."),
    p("A fenti hitelre, $B_0 = 200\\,000$ mellett:"),
    list(
      "1. év: kamat $0{,}06 \\times 200\\,000 = 12\\,000$, tőke $27\\,173{,}59 - 12\\,000 = 15\\,173{,}59$, záró tartozás 184 826,41.",
      "2. év: kamat $0{,}06 \\times 184\\,826{,}41 \\approx 11\\,089{,}58$, tőke 16 084,01, záró tartozás 168 742,40.",
    ),
    h("A futamidő kiszámítása"),
    p("Ugyanez az egyenlet meg is fordítható. Ha az adós $C$ nagyságú részletet tud vállalni, az $L$ visszafizetéséhez szükséges évek száma az $L = C\\,(1 - (1+r)^{-n})/r$ egyenletből logaritmálással adódik:"),
    eq("n = -\\frac{\\ln\\left(1 - \\dfrac{L\\,r}{C}\\right)}{\\ln(1+r)}."),
    p("Ha a 200 000-es, 6%-os hitelre évi 20 000-et fizetünk, akkor $n = -\\ln(1 - 0{,}6)/\\ln 1{,}06 \\approx 15{,}73$ év, vagyis a gyakorlatban 16 részlet, amelyek közül az utolsó kisebb. A képletből egy korlát is kiolvasható: ha $C \\le L\\,r = 12\\,000$, a részlet még az első év kamatát sem fedezi, és a hitel soha nem fizethető vissza. A kamatlábra viszont nincs zárt képlet; azt numerikusan kell meghatározni, pontosan úgy, mint a következő lecke belső megtérülési rátáját."),

    h("A részletek összetételének változása"),
    p("A részlet ugyanakkora marad, de az összetétele eltolódik. Kezdetben nagy a tartozás, ezért a részlet nagyobbik része kamat; ahogy a tartozás csökken, a kamatrész zsugorodik, a tőkerész nő. A tartozás a szerkesztés miatt pontosan az utolsó részlettel válik nullává."),
    p("Az ábra a teljes törlesztési tervet mutatja. Minden oszlop egy év részlete, kamatra (alul) és tőkére (felül) bontva; a szaggatott vonal a jobb oldali tengelyen az egyes évek végén fennmaradó tartozás. Kattints egy évre, vagy lépj rá a Tab billentyűvel és nyomj Entert, és az ábra alatt megjelenik a törlesztési terv adott sora kiszámolva. Kezdd az 1. évvel az alapbeállításnál (10 év, 6%), majd állítsd a futamidőt 30 évre: a részlet nagyjából 14 530-ra csökken, de az első részlet 82,6%-a már kamat, és az összes kamat több lesz, mint maga a hitel."),
    figure("amortization-schedule"),

    h("Összefoglalás"),
    list(
      "Egy $n$ éves, évi $C$ nagyságú annuitás ma $C\\,(1 - (1+r)^{-n})/r$-t ér; az előleges annuitás ennek $(1+r)$-szeresét.",
      "Az örökjáradék értéke $C/r$, a növekvő örökjáradéké $C/(r - g)$, amíg $g < r$.",
      "Az egyenlő törlesztőrészlet a hitelösszeg osztva az annuitásfaktorral.",
      "Minden részlet a nyitó tartozás kamata plusz tőketörlesztés; a korai részletek nagyrészt kamatok, és hosszabb futamidőnél az arány még inkább a kamat felé tolódik.",
    ),
    note("A következő lecke, a „Nettó jelenérték és belső megtérülési ráta”, olyan projekteket értékel, amelyek pénzáramai nem egyenletesek: mindegyiket külön diszkontálja ugyanezekkel az eszközökkel."),
    lab("/tvm", "Próbáld ki a rendszeres befizetéseket és a kamatos kamatot a Pénz időértéke laborban"),
  ],
};
