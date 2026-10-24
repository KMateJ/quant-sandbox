# Súlyozott átlagos tőkeköltség

A saját tőke költsége, az adózás utáni hitelköltség, a kamatadópajzs és a piaci értékű súlyok.

A „Nettó jelenérték és belső megtérülési ráta” című lecke egy $r$ rátával diszkontálta a projekt pénzáramait, de nem mondta meg, honnan származik ez a ráta. Ha a projekt ugyanolyan kockázatú, mint a vállalat egésze, a szokásos válasz a súlyozott átlagos tőkeköltség. Ez a lecke a vállalat két befektetői csoportja által elvárt hozamokból építi fel.

## Idegen tőke és saját tőke

Egy vállalat kétféle befektetőtől von be pénzt. A **hitelezők** (kötvénytulajdonosok, bankok) **idegen tőkét** adnak, $D$-t: rögzített kamatot kapnak, és csőd esetén elsőként kapják vissza a pénzüket. A **részvényesek** **saját tőkét** adnak, $E$-t: azt kapják, ami a hitelezők kifizetése után megmarad, így a hozamuk bizonytalan. A vállalat finanszírozásának teljes értéke

$$
V = D + E.
$$

Képzeljük el a vállalatot pénzáramokból álló tortaként, amelyen a két csoport osztozik. A hitelezők szelete kisebb, de biztosabb; a részvényeseké átlagosan nagyobb, de kockázatosabb.

## A saját tőke költsége

A **saját tőke költsége**, $r_E$, az az éves hozam, amelyet a részvényesek a vállalat részvényeinek tartásáért elvárnak. Senki sem jegyzi közvetlenül; a részvény kockázatából kell megbecsülni. A szokásos eszköz a tőkepiaci eszközárazási modell (CAPM), amelyet a „CAPM, béta és az értékpapír-piaci egyenes” című lecke mutat be:

$$
r_E = r_f + \beta_E\,\big(\mathbb{E}[R_m] - r_f\big),
$$

ahol $r_f$ a kockázatmentes kamatláb, $\mathbb{E}[R_m] - r_f$ a piaci kockázati prémium, $\beta_E$ pedig azt méri, mennyire erősen mozog a részvény árfolyama a piaccal. Példa: $r_f = 3\%$, $6\%$-os piaci kockázati prémium és $\beta_E = 1{,}5$ mellett $r_E = 3\% + 1{,}5 \times 6\% = 12\%$.

## Az idegen tőke költsége

Az **idegen tőke költsége**, $r_D$, a hitelezők által elvárt éves hozam, nagyjából az a hozam, amelyet a vállalat új hitelfelvételnél fizet. Alacsonyabb $r_E$-nél, mert a hitelezőket fizetik ki elsőként, és a kifizetéseik rögzítettek.

A kamatnak van egy második előnye is: levonható az adóalapból. $t$ társasági adókulcs mellett minden kifizetett kamategység $t$ egységgel csökkenti az adót. Példa: egy $D = 400$ hitellel rendelkező vállalat $r_D = 6\%$ mellett évi 24 kamatot fizet; $t = 25\%$ esetén ez $0{,}25 \times 24 = 6$ adót takarít meg. Ez a megtakarítás a **kamatadópajzs**. A hitel tényleges költsége a vállalat számára ezért az **adózás utáni hitelköltség**:

$$
r_D\,(1 - t).
$$

A példában $6\% \times (1 - 0{,}25) = 4{,}5\%$.

## A súlyozott átlag

A vállalatnak az eszközein összességében annyit kell keresnie, hogy mindkét csoportnak megadja az elvárt hozamot. Ha mindkét költséget a finanszírozásbeli arányával súlyozzuk, megkapjuk a **súlyozott átlagos tőkeköltséget** (WACC):

$$
\text{WACC} = \frac{E}{V}\,r_E + \frac{D}{V}\,r_D\,(1 - t).
$$

> A WACC az a hozam, amelyet a vállalat eszközeinek adózás után el kell érnie ahhoz, hogy a részvényesek és a hitelezők is megkapják az elvárt hozamukat. Ez a diszkontráta a vállalattal azonos kockázatú projektekhez.

Példa: $E = 600$ és $D = 400$, valamint $r_E = 12\%$, $r_D = 6\%$ és $t = 25\%$.

### Kidolgozott példa: Egy 600 saját és 400 idegen tőkéjű vállalat WACC-je

1. A saját tőke aránya a finanszírozásban, ahol $V = D + E$.
   $$E/V$$ → **60%**
2. Az idegen tőke aránya a finanszírozásban.
   $$D/V$$ → **40%**
3. Az idegen tőke adózás utáni költsége.
   $$r_D\,(1 - t)$$ → **4.5%**
4. A saját tőke hozzájárulása az átlaghoz.
   $$\frac{E}{V}\,r_E$$ → **7.2%**
5. Az idegen tőke hozzájárulása az átlaghoz.
   $$\frac{D}{V}\,r_D\,(1 - t)$$ → **1.8%**
6. Adjuk össze a két hozzájárulást.
   $$\text{WACC} = \frac{E}{V}\,r_E + \frac{D}{V}\,r_D\,(1 - t)$$ → **9%**

A vállalat egy átlagos kockázatú projektjét tehát $r = 9\%$-os diszkontrátával számolt NPV alapján kell értékelni.

## Piaci érték, nem könyv szerinti érték

Az $E/V$ és $D/V$ súlyokat **piaci értéken** kell számolni: a részvényárfolyam szorozva a részvények számával, illetve a hitel piaci értéke. A mérleg **könyv szerinti értékeket** mutat, amelyek azt rögzítik, mennyit fizettek a múltban, és messze eshetnek attól, amennyit a befektetők ma fizetnének.

Példa: tegyük fel, hogy a fenti vállalat könyv szerinti saját tőkéje csak 250, miközben a részvényei 600-at érnek a piacon. $250/650$ és $400/650$ könyv szerinti súlyokkal a WACC kb. $7{,}38\%$ lenne $9\%$ helyett. Ezzel az alacsonyabb rátával diszkontálva túl sok projekt tűnne jövedelmezőnek. Az $r_E$ és $r_D$ hozamot a befektetők arra várják el, amit a követelésük ma ér, ezért a súlyokat is így kell mérni.

## Mikor alkalmazható a WACC

A WACC-vel való diszkontálás feltevésekre épül, amelyeket érdemes kimondani:

- A projekt üzleti kockázata megegyezik a vállalat meglévő eszközeiével. Kockázatosabb projekthez magasabb, biztonságosabbhoz alacsonyabb ráta kell.
- A projektet ugyanolyan hitel–saját tőke arányban finanszírozzák, mint a vállalatot, és ez az arány nagyjából állandó marad.
- A diszkontált pénzáramok a projekt hitelezőknek történő kifizetések előtti pénzáramai; a finanszírozás csak a rátán keresztül jelenik meg.

Az a vállalat, amely minden projekthez ugyanazt a vállalati szintű WACC-t használja, hajlamos elfogadni olyan kockázatos projekteket, amelyeket el kellene utasítania, és elutasítani olyan biztonságosakat, amelyeket el kellene fogadnia.

## Összefoglalás

- A vállalatot $D$ idegen tőke és $E$ saját tőke finanszírozza, összértéke $V = D + E$.
- A saját tőke költségét, $r_E$-t, a részvény kockázatából becsüljük, jellemzően CAPM-mel; az idegen tőke költsége, $r_D$, a hitelezők elvárt hozama.
- A kamat levonható az adóalapból, így a hitel tényleges költsége $r_D(1 - t)$.
- $\text{WACC} = (E/V)\,r_E + (D/V)\,r_D(1 - t)$, piaci értékű súlyokkal; ez az átlagos kockázatú projektek diszkontrátája.

> A következő lecke, „Tőkeszerkezet és a Modigliani–Miller-tételek”, azt vizsgálja, hogy a hitel és a saját tőke arányának megváltoztatása módosítja-e magát a WACC-t.

[Változtasd a tőkeköltségeket, az adókulcsot és az eladósodottságot a WACC laborban](https://quantsandbox.dev/hu/wacc)

## Interaktív laborok

- [WACC-kalkulátor: súlyozott átlagos tőkeköltség](https://quantsandbox.dev/hu/wacc)

## Gyakorló kérdések

### 1. A kockázatmentes kamatláb 2%, a piaci kockázati prémium 5%, a vállalat saját tőkéjének bétája 1,2. Mekkora lesz a saját tőke költsége a CAPM szerint?

**Válasz:** 8%

$r_E = r_f + \beta_E\,(\mathbb{E}[R_m] - r_f) = 2\% + 1{,}2 \times 5\% = 8\%$. A béta a piaci kockázati prémiumot skálázza, nem a teljes piaci hozamot.

### 2. Miért piaci értékkel, és nem a mérleg szerinti (könyv szerinti) értékkel kell számolni a WACC súlyait?

- a) Mert a könyv szerinti értékeket nem auditálják, ezért megbízhatatlanok.
- b) Mert a befektetők arra várnak el hozamot, amit a követelésük ma ér, ez pedig a piaci érték.
- c) Mert a könyv szerinti súlyok mindig magasabb WACC-t adnak, és így jó projekteket utasítanánk el.
- d) Mert a piaci érték csak a társasági adót fizető vállalatoknál számít.

**Válasz:** b) Mert a befektetők arra várnak el hozamot, amit a követelésük ma ér, ez pedig a piaci érték.

Az $r_E$ és az $r_D$ a részvények és az adósság mai értékére elvárt hozam, ezért a súlyoknak is ugyanezt az értéket kell mérniük. A könyv szerinti érték múltbeli árakat rögzít, és bármelyik irányba eltérítheti a WACC-t; a példában kb. $7{,}38\%$-ra csökkentette.

---

Forrás: https://quantsandbox.dev/hu/guide/corporate/wacc

Előző lecke: [Projektkockázat: érzékenység, forgatókönyvek és Monte Carlo NPV](https://quantsandbox.dev/hu/guide/corporate/capital-budgeting-risk)

Következő lecke: [Tőkeszerkezet és a Modigliani–Miller-tételek](https://quantsandbox.dev/hu/guide/corporate/capital-structure)
