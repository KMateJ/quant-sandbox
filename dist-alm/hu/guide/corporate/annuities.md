# Annuitások, örökjáradékok és hiteltörlesztés

Egyenletes kifizetések jelenértéke, növekvő örökjáradék, hiteltörlesztő részlet és a törlesztési terv.

Sok pénzügyi szerződés rendszeres időközönként ugyanakkora összeget fizet: egy nyugdíj, egy lízing, egy kötvény kuponjai, egy jelzáloghitel részletei. Kifizetésenként is értékelhetők, de ez lassú, és elfedi a szerkezetet. Ez a lecke zárt képleteket vezet le az ilyen pénzáramokra a „Kamat, kamatozás és diszkontálás” című lecke diszkontálására építve, majd alkalmazza őket egy hitel törlesztésére.

A lecke végig évi egy kifizetéssel és évente tőkésített $r$ kamatlábbal számol, és ha mást nem mondunk, az első kifizetés egy év múlva esedékes.

## Utólagos annuitás

Az **annuitás** $n$ darab egyenlő, $C$ nagyságú kifizetés az $1, 2, \dots, n$. év végén. Jelenértéke a diszkontált kifizetések összege:

$$
\text{PV} = \frac{C}{1+r} + \frac{C}{(1+r)^2} + \cdots + \frac{C}{(1+r)^n}.
$$

Ez egy mértani sor, amelynek első tagja $C/(1+r)$, hányadosa $q = 1/(1+r)$. Az $a + aq + \cdots + aq^{n-1} = a\,(1 - q^n)/(1 - q)$ összefüggést használva és egyszerűsítve

$$
\text{PV} = C \cdot \frac{1 - (1+r)^{-n}}{r}.
$$

A tört az **annuitásfaktor**: évi 1 egység $n$ éven át tartó kifizetésének jelenértéke. Ha a jelenértéket $n$ évvel előre kamatoztatjuk, megkapjuk az utolsó kifizetés napjára vonatkozó **jövőértéket**:

$$
\text{FV} = \text{PV}\,(1+r)^n = C \cdot \frac{(1+r)^n - 1}{r}.
$$

Példa: évi 1000 tíz éven át, $r = 6\%$ mellett. Az annuitásfaktor $(1 - 1{,}06^{-10})/0{,}06 \approx 7{,}3601$, így $\text{PV} \approx 7360{,}09$ és $\text{FV} \approx 13\,180{,}79$. A tíz kifizetés összesen 10 000, ma mégis csak 7360,09-et ér, mert a legtöbbjük évek múlva érkezik.

## Előleges annuitás

Ha minden kifizetés az év elején esedékes, mint például a bérleti díj, akkor **előleges annuitásról** beszélünk. Minden kifizetés egy évvel korábban érkezik, ezért minden diszkontált tag $(1+r)$-szeresére nő:

$$
\text{PV}_{\text{előleges}} = (1+r) \cdot C \cdot \frac{1 - (1+r)^{-n}}{r}.
$$

A példában $1{,}06 \times 7360{,}09 \approx 7801{,}69$.

## Örökjáradékok

Az **örökjáradék** minden évben $C$-t fizet, örökké. Az annuitásképletben $n \to \infty$ esetén $(1+r)^{-n} \to 0$, így

$$
\text{PV} = \frac{C}{r}.
$$

A **növekvő örökjáradék** egy év múlva $C$-t fizet, utána pedig állandó $g$ ütemben nő: $C$, $C(1+g)$, $C(1+g)^2$ és így tovább. A sor ismét mértani, hányadosa $(1+g)/(1+r)$, és csak $g < r$ esetén konvergens:

$$
\text{PV} = \frac{C}{r - g}, \qquad g < r.
$$

$r = 6\%$ mellett egy 1000-es örökjáradék értéke $1000/0{,}06 \approx 16\,666{,}67$. Ha a kifizetés évente 2%-kal nő, az értéke $1000/0{,}04 = 25\,000$. A növekvő örökjáradék képlete áll a vállalatértékelésben használt maradványérték mögött.

> Annuitásfaktor $(1 - (1+r)^{-n})/r$, örökjáradék $C/r$, növekvő örökjáradék $C/(r - g)$, ha $g < r$. Mindhárom diszkontált kifizetések mértani összege.

## A hitel törlesztőrészlete

Egy $L$ összegű, $n$ éves, egyenlő részletekben törlesztett hitel a hitelező szemszögéből annuitás: ma kifizet $L$-et, és $n$ egyenlő, $C$ nagyságú részletet kap. A hitel akkor van korrekt áron, ha a részletek jelenértéke éppen $L$, tehát

$$
C = \frac{L}{\dfrac{1 - (1+r)^{-n}}{r}} = \frac{L\,r}{1 - (1+r)^{-n}}.
$$

Példa: 200 000 hitel 6%-os kamattal, 10 évre. Az annuitásfaktor 7,3601, így az éves részlet $200\,000 / 7{,}3601 \approx 27\,173{,}59$. A futamidő alatt az adós $10 \times 27\,173{,}59 \approx 271\,735{,}92$-t fizet, ebből 71 735,92 a kamat.

## A törlesztési terv

Minden részlet két részre bomlik. A **kamatrész** a kamatláb szorozva az év elején még fennálló tartozással. A részlet többi része **tőketörlesztés**, és ennyivel csökken a tartozás:

$$
I_t = r\,B_{t-1}, \qquad P_t = C - I_t, \qquad B_t = B_{t-1} - P_t.
$$

A fenti hitelre, $B_0 = 200\,000$, $r = 6\%$ és $C = 27\,173{,}59$ mellett a törlesztési terv első két sora:

### Kidolgozott példa: A törlesztési terv első két éve

1. Az 1. év kamata: a kamatláb szorozva a nyitó tartozással.
   $$I_1 = r\,B_0$$ → **12000**
2. A részlet többi része tőketörlesztés.
   $$P_1 = C - I_1$$ → **15173.59**
3. Az 1. év végén még fennálló tartozás.
   $$B_1 = B_0 - P_1$$ → **184826.41**
4. A 2. év kamata kisebb, mert kisebb a tartozás.
   $$I_2 = r\,B_1$$ → **11089.58**
5. Így ugyanabból a részletből több jut tőkére.
   $$P_2 = C - I_2$$ → **16084.01**
6. A tartozás a 2. év végén.
   $$B_2 = B_1 - P_2$$ → **168742.4**

## A futamidő kiszámítása

Ugyanez az egyenlet meg is fordítható. Ha az adós $C$ nagyságú részletet tud vállalni, az $L$ visszafizetéséhez szükséges évek száma az $L = C\,(1 - (1+r)^{-n})/r$ egyenletből logaritmálással adódik:

$$
n = -\frac{\ln\left(1 - \dfrac{L\,r}{C}\right)}{\ln(1+r)}.
$$

Ha a 200 000-es, 6%-os hitelre évi 20 000-et fizetünk, akkor $n = -\ln(1 - 0{,}6)/\ln 1{,}06 \approx 15{,}73$ év, vagyis a gyakorlatban 16 részlet, amelyek közül az utolsó kisebb. A képletből egy korlát is kiolvasható: ha $C \le L\,r = 12\,000$, a részlet még az első év kamatát sem fedezi, és a hitel soha nem fizethető vissza. A kamatlábra viszont nincs zárt képlet; azt numerikusan kell meghatározni, pontosan úgy, mint a következő lecke belső megtérülési rátáját.

## A részletek összetételének változása

A részlet ugyanakkora marad, de az összetétele eltolódik. Kezdetben nagy a tartozás, ezért a részlet nagyobbik része kamat; ahogy a tartozás csökken, a kamatrész zsugorodik, a tőkerész nő. A tartozás a képlet felépítéséből adódóan pontosan az utolsó részlettel válik nullává.

Az ábra a teljes törlesztési tervet mutatja. Minden oszlop egy év részlete, kamatra (alul) és tőkére (felül) bontva; a szaggatott vonal a jobb oldali tengelyen az egyes évek végén fennmaradó tartozás. Kattints egy évre, vagy lépj rá a Tab billentyűvel és nyomj Entert, és az ábra alatt megjelenik a törlesztési terv adott sora kiszámolva. Kezdd az 1. évvel az alapbeállításnál (10 év, 6%), majd állítsd a futamidőt 30 évre: a részlet nagyjából 14 530-ra csökken, de az első részlet 82,6%-a már kamat, és az összes kamat több lesz, mint maga a hitel.

*[Interaktív ábra: amortization schedule](https://quantsandbox.dev/hu/guide/corporate/annuities)*

## Összefoglalás

- Egy $n$ éves, évi $C$ nagyságú annuitás ma $C\,(1 - (1+r)^{-n})/r$-t ér; az előleges annuitás ennek $(1+r)$-szeresét.
- Az örökjáradék értéke $C/r$, a növekvő örökjáradéké $C/(r - g)$, amíg $g < r$.
- Az egyenlő törlesztőrészlet a hitelösszeg osztva az annuitásfaktorral.
- Minden részlet a nyitó tartozás kamata plusz tőketörlesztés; a kezdeti részletek nagyrészt kamatból állnak, és hosszabb futamidőnél az arány még inkább a kamat felé tolódik.

> A következő lecke, a „Nettó jelenérték és belső megtérülési ráta”, olyan projekteket értékel, amelyek pénzáramai nem egyenletesek: mindegyiket külön diszkontálja ugyanezekkel az eszközökkel.

[Próbáld ki a rendszeres befizetéseket és a kamatos kamatot a Pénz időértéke laborban](https://quantsandbox.dev/hu/tvm)

## Interaktív laborok

- [A pénz időértéke és kamatoskamat-kalkulátor](https://quantsandbox.dev/hu/tvm)

## Gyakorló kérdések

### 1. Egy pénzáram egy év múlva 500-at fizet, utána pedig örökké évi 3%-kal nő. 8%-os diszkontráta mellett mennyit ér ma?

**Válasz:** 10000

A növekvő örökjáradék értéke $C/(r - g) = 500/(0{,}08 - 0{,}03) = 10\,000$. A számlálóba az első, egy év múlva esedékes kifizetés kerül, nem a mai.

### 2. Egy 100 000-es hitel kamata évi 5%. Melyik éves részlettel nem lehet soha visszafizetni, akármilyen hosszú a futamidő?

- a) 4500
- b) 6000
- c) 10 000
- d) 12 950

**Válasz:** a) 4500

Az első év kamata $L\,r = 5000$. A 4500-as részlet ezt sem fedezi, így a tartozás évről évre nő; 5000 fölötti részlettel viszont előbb-utóbb visszafizethető a hitel.

---

Forrás: https://quantsandbox.dev/hu/guide/corporate/annuities

Előző lecke: [Kamat, kamatozás és diszkontálás](https://quantsandbox.dev/hu/guide/corporate/interest-discounting)

Következő lecke: [Nettó jelenérték és belső megtérülési ráta](https://quantsandbox.dev/hu/guide/corporate/npv-irr)
