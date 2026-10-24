# CAPM, béta és az értékpapír-piaci egyenes

Szisztematikus és egyedi kockázat, a béta mint piaci érzékenység, várható hozam és alfa.

A „Hatékony front és tőkepiaci egyenes” című lecke azt írta le, hogyan válasszon portfóliót egyetlen befektető. Ez a lecke feltételezi, hogy minden befektető így viselkedik, és levezeti, mi következik ebből az árakra. Az eredmény a tőkepiaci eszközárazási modell (CAPM): bármely eszköz várható hozama egyetlen számtól, a bétájától függ.

## Feltevések

A CAPM az alábbi egyszerűsítésekre épül, mindegyiket kimondva:

- A befektetőket csak portfóliójuk várható hozama és volatilitása érdekli egy közös időszakra (az előző lecke várható hozam–variancia preferenciái).
- Minden befektető ugyanazt gondolja az összes eszköz várható hozamáról, volatilitásáról és korrelációiról (homogén várakozások).
- Bárki tetszőleges összeget helyezhet el és vehet fel hitelként ugyanazon az $r_f$ kockázatmentes kamaton.
- Nincsenek adók és tranzakciós költségek, az eszközök tetszőlegesen oszthatók, a shortolás megengedett, és egyetlen befektető sem képes mozgatni az árakat.

Ezek egyike sem teljesül pontosan. A cél az, hogy lássuk, mi következne belőlük, és utána megítéljük, mennyire tér el ettől a valóság.

## A piaci portfólió

A kétalapos szétválasztás szerint minden befektető a kockázatmentes eszközt és ugyanazt a T érintési portfóliót tartja, csak eltérő mennyiségben. Adjuk össze az összes befektető állományát: a teljes kockázatos állomány T többszöröse. Ugyanakkor a teljes kockázatos állománynak meg kell egyeznie mindazzal, ami létezik, hiszen minden forgalomban lévő részvény valakinek a tulajdonában van. Egyensúlyban tehát T a **piaci portfólió**, M: minden kockázatos eszköz, a piaci értékével arányos súllyal.

Jelölje $\mathbb{E}[R_m]$ és $\sigma_m$ a piaci portfólió várható hozamát és volatilitását. A tőkepiaci egyenes ekkor

$$
\mathbb{E}[R_p] = r_f + \frac{\mathbb{E}[R_m] - r_f}{\sigma_m}\,\sigma_p,
$$

és a hatékony portfóliókra, vagyis $r_f$ és M keverékeire érvényes. Egy egyedi eszköz nem hatékony, és általában az egyenes alatt helyezkedik el, így a CML önmagában nem mondja meg, mekkora legyen a várható hozama.

## Béta

Az $i$-edik eszköz **bétája** azt méri, mennyire erősen mozog a hozama a piaccal együtt:

$$
\beta_i = \frac{\operatorname{Cov}(R_i, R_m)}{\operatorname{Var}(R_m)} = \rho_{im}\,\frac{\sigma_i}{\sigma_m}.
$$

Magának a piacnak $\beta_m = 1$, a kockázatmentes eszköznek $\beta = 0$, egy portfólió bétája pedig az eszközei bétáinak súlyozott átlaga, mert a kovariancia mindkét változójában lineáris. Az 1,3-es béta azt jelenti, hogy amikor a piac 1%-kal a várható értéke felett van, az eszköz átlagosan 1,3%-kal van a sajátja felett.

## Az értékpapír-piaci egyenes levezetése

Induljunk ki a piaci portfólióból, és tegyünk át kis $\varepsilon$ összeget a kockázatmentes eszközből az $i$-edik eszközbe. A várható hozam $\varepsilon(\mathbb{E}[R_i] - r_f)$-fel változik. A $\sigma_m^2$ variancia elsőrendben $2\varepsilon\operatorname{Cov}(R_i, R_m)$-mel változik, így a volatilitás változása

$$
d\sigma = \varepsilon\,\frac{\operatorname{Cov}(R_i, R_m)}{\sigma_m}.
$$

Mivel M az érintési portfólió, egyetlen ilyen kis lépés sem javíthat a kockázat–hozam viszonyon: a többlethozam és a többletvolatilitás arányának minden eszközre meg kell egyeznie a CML meredekségével:

$$
\frac{\mathbb{E}[R_i] - r_f}{\operatorname{Cov}(R_i, R_m)/\sigma_m} = \frac{\mathbb{E}[R_m] - r_f}{\sigma_m}.
$$

Ellenkező esetben a portfóliót az $i$-edik eszköz felé (vagy attól el) billentve M-nél nagyobb Sharpe-mutatót lehetne elérni. $\mathbb{E}[R_i]$-re rendezve kapjuk az **értékpapír-piaci egyenest** (security market line, SML):

$$
\mathbb{E}[R_i] = r_f + \beta_i\,\big(\mathbb{E}[R_m] - r_f\big).
$$

> CAPM: bármely eszköz várható többlethozama a bétájának és az $\mathbb{E}[R_m] - r_f$ **piaci kockázati prémiumnak** a szorzata.

## Szisztematikus és egyedi kockázat

Bontsuk az $i$-edik eszköz többlethozamát a piac által magyarázott részre és egy maradékra:

$$
R_i - r_f = \alpha_i + \beta_i\,(R_m - r_f) + \varepsilon_i, \qquad \operatorname{Cov}(\varepsilon_i, R_m) = 0.
$$

Varianciát véve

$$
\sigma_i^2 = \beta_i^2\sigma_m^2 + \sigma_{\varepsilon}^2.
$$

Az első tag a **szisztematikus**, a második az **egyedi** (vállalatspecifikus) kockázat. A „Diverzifikáció és korreláció” című lecke megmutatta, hogy nagy portfólióban a vállalatspecifikus varianciák eltűnnek, a közös mozgások viszont megmaradnak. A piacot tartó befektető ezért csak szisztematikus kockázatot visel, és az SML szerint csak ez a rész jár prémiummal. Az egyedi kockázatot a piac nem árazza, mert költség nélkül eltüntethető.

Példa: egy $\sigma_i = 35\%$-os eszköz, amely $0{,}6$-os korrelációban áll egy $\sigma_m = 20\%$-os piaccal, bétája $\beta = 0{,}6 \times 0{,}35 / 0{,}20 = 1{,}05$. Szisztematikus varianciája $1{,}05^2 \times 0{,}04 = 0{,}0441$ a $0{,}1225$-ös teljesből: mindössze 36% (vagyis $\rho^2$). A maradék 64%, 28%-os reziduális volatilitás, egyedi kockázat, és nem jár érte prémium.

## Számpélda

Legyen $r_f = 3\%$, $\mathbb{E}[R_m] = 8\%$ és $\beta = 1{,}3$. A piaci kockázati prémium $8\% - 3\% = 5\%$. Az eszköz elvárt hozama

$$
\mathbb{E}[R_i] = 3\% + 1{,}3 \times 5\% = 9{,}5\%,
$$

a kockázati prémiuma tehát $6{,}5\%$. Egy $\beta = 0{,}5$-ös eszköztől csak $5{,}5\%$ volna elvárható, akármilyen volatilis is önmagában.

Az ábra a várható hozamot mutatja a béta függvényében 0 és 2 között. Az SML $\beta = 0$-nál $r_f$-ből indul, és $\beta = 1$-nél átmegy a piacon; egy második jelölő mutatja az eszközt. Növeld az $\mathbb{E}[R_m]$-et, és figyeld meg, hogy az egyenes a rögzített $(0, r_f)$ pont körül meredekebbé válik. Mozgasd a $\beta$-t, és figyeld meg, hogy az eszköz az egyenes mentén csúszik. A kijelzők a piaci kockázati prémiumot, az eszköz elvárt hozamát és kockázati prémiumát mutatják.

*[Interaktív ábra: security market line](https://quantsandbox.dev/hu/guide/portfolio/capm)*

Az SML és a CML két különböző egyenes. A CML vízszintes tengelyén a volatilitás áll, és csak hatékony portfóliókra érvényes. Az SML vízszintes tengelyén a béta áll, és minden eszközre és portfólióra érvényes.

## Alfa

Egy eszköz **alfája** a ténylegesen előre jelzett várható hozam és az SML által megkövetelt hozam különbsége:

$$
\alpha_i = \mathbb{E}[R_i] - \big(r_f + \beta_i(\mathbb{E}[R_m] - r_f)\big).
$$

Ha egy elemző 11%-ot vár a fenti eszköztől, az alfája $11\% - 9{,}5\% = 1{,}5\%$: az SML felett helyezkedik el, és a kockázatához képest olcsónak tűnik. A CAPM világában ez a különbség nem maradhat fenn. A befektetők megvennék az eszközt, az ára emelkedne, a várható hozama pedig csökkenne, amíg $\alpha = 0$ nem lesz. Egy mért alfa tehát vagy félreárazás, vagy a CAPM-ből kimaradó kockázatért járó jutalom, vagy becslési zaj.

## A béta becslése

A gyakorlatban a bétát legkisebb négyzetes regresszióval becsülik: az eszköz többlethozamait egy széles index többlethozamaira regresszálják, jellemzően 60 havi vagy 2 évnyi heti megfigyelésből. A regressziós meredekség a mintabeli kovariancia osztva az index mintabeli varianciájával. Példa: ha a havi hozamok mintabeli kovarianciája $0{,}0018$, az index havi varianciája $0{,}0016$, akkor $\hat\beta = 0{,}0018/0{,}0016 = 1{,}125$. A tengelymetszet az alfát becsli.

### Kidolgozott példa: A mintabeli kovarianciától az elvárt hozamig

1. A regressziós meredekség az indexszel vett mintabeli kovariancia osztva az index varianciájával.
   $$\hat\beta = \frac{0{,}0018}{0{,}0016}$$ → **1.125**
2. $r_f = 3\%$ és $\mathbb{E}[R_m] = 8\%$ mellett a piaci kockázati prémium 5%, az SML pedig megadja az elvárt hozamot.
   $$\mathbb{E}[R_i] = 3\% + 1{,}125 \times 5\%$$ → **8.625%**

Ezek a becslések zajosak, változnak a vállalat tevékenységével és tőkeáttételével, és függenek az indextől és a hozamok gyakoriságától. Emiatt a gyakorlatban a nyers becsléseket gyakran 1 felé húzzák.

## Korlátok

- A valódi piaci portfólió minden kockázatos eszközt tartalmaz, az ingatlanokat és a humán tőkét is. Nem figyelhető meg, ezért minden teszt valamilyen helyettesítő indexet használ.
- Empirikusan az SML laposabb a vártnál: az alacsony bétájú részvények többet, a magas bétájúak kevesebbet hoznak, mint amit a modell mond.
- Más jellemzők, például a vállalatméret és a könyv szerinti és piaci érték aránya, olyan átlagos hozamokat magyaráznak, amelyeket a béta nem. A többfaktoros modellek ezeket további kockázati tényezőként veszik fel.
- A modell egyetlen időszakot ír le, és figyelmen kívül hagyja az adókat, a kereskedési költségeket és a hitelfelvételi korlátokat.

Ennek ellenére a CAPM az elvárt hozam szokásos első becslése, például a sajáttőke-költségé a vállalati pénzügyekben.

## Összefoglalás

- Ha minden befektető azonos bemenetekkel végez várható hozam–variancia elemzést, az érintési portfólió a piaci portfólió.
- A $\beta_i = \operatorname{Cov}(R_i, R_m)/\operatorname{Var}(R_m)$ béta az eszköz piaci mozgásokkal szembeni kitettségét méri.
- Csak a $\beta_i^2\sigma_m^2$ szisztematikus kockázatot árazza a piac; az egyedi kockázat kidiverzifikálható, és nem jár érte prémium.
- Értékpapír-piaci egyenes: $\mathbb{E}[R_i] = r_f + \beta_i(\mathbb{E}[R_m] - r_f)$; az alfa az ettől való eltérés.
- A bétát az index többlethozamaira futtatott regresszióval becsüljük; a modell hasznos viszonyítási alap, ismert empirikus gyengeségekkel.

[Becsülj bétát, és vesd össze az eszközöket az értékpapír-piaci egyenessel a CAPM laborban](https://quantsandbox.dev/hu/capm)

## Interaktív laborok

- [CAPM-kalkulátor és értékpapír-piaci egyenes](https://quantsandbox.dev/hu/capm)

## Gyakorló kérdések

### 1. Egy eszköz bétája $\beta = 1{,}3$. A kockázatmentes kamatláb 2%, a piac várható hozama 8%. Mekkora hozamot követel meg a CAPM, százalékban?

**Válasz:** 9.8%

$\mathbb{E}[R_i] = 2\% + 1{,}3 \times (8\% - 2\%) = 2\% + 7{,}8\% = 9{,}8\%$.

### 2. Egy elemző előrejelzése szerint egy eszköz az értékpapír-piaci egyenes felett van, tehát pozitív az alfája. Mit mond ez a CAPM szerint az eszközről?

- a) A kockázatához képest túlárazott
- b) A kockázatához képest alulárazott
- c) Túl magas a bétája
- d) Nincs szisztematikus kockázata

**Válasz:** b) A kockázatához képest alulárazott

A pozitív alfa azt jelenti, hogy az előre jelzett hozam több, mint amit az SML a bétájához megkövetel, vagyis az eszköz olcsónak tűnik. A vásárlások addig emelnék az árát, amíg $\alpha = 0$ nem lesz.

---

Forrás: https://quantsandbox.dev/hu/guide/portfolio/capm

Előző lecke: [Kockázatkerülés és az optimális teljes portfólió](https://quantsandbox.dev/hu/guide/portfolio/risk-aversion)

Következő lecke: [Teljesítménymutatók: Sharpe, Treynor, Jensen és információs ráta](https://quantsandbox.dev/hu/guide/portfolio/performance-measures)
