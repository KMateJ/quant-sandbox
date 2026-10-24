# Faktormodellek és szisztematikus kockázat

Az egyindexes modell, a szisztematikus és egyedi variancia szétválasztása, és a többfaktoros modellek.

A „CAPM, béta és az értékpapír-piaci egyenes” című lecke egyetlen eszköz kockázatát bontotta a piac által hajtott szisztematikus és az egyedi részre. Ez a lecke ebből a felbontásból modellt épít, amely egyszerre írja le eszközök egész halmazát. A modell megmagyarázza, miért mozognak együtt a részvények, néhány számból előállítja az összes kovarianciát, és pontosan megmutatja, mennyi kockázat marad egy portfólióban, akárhány részvényt tartalmaz is.

## A paraméterek száma

A „Hatékony front és tőkepiaci egyenes” című leckéhez az eszközök teljes kovarianciamátrixára volt szükség. $N$ eszköz esetén ennek a mátrixnak a főátlójában $N$ variancia áll, azon kívül pedig $N(N-1)/2$ különböző kovariancia (a mátrix szimmetrikus, $\sigma_{ij} = \sigma_{ji}$), összesen tehát

$$
N + \frac{N(N-1)}{2} = \frac{N(N+1)}{2}
$$

különálló elemből áll. 500 részvénynél ez $500 \times 501/2 = 125\,250$ becsülendő szám. Néhány évnyi havi adatból részvényenként ennél jóval kevesebb megfigyelés van, így a becslések nagy része zaj volna. A **faktormodell** úgy csökkenti a paraméterek számát, hogy feltételezi: minden közös mozgás néhány forrásból ered.

## Az egyindexes modell

A legegyszerűbb faktormodell egyetlen faktort használ, egy széles piaci index $R_M$ hozamát, amelynek volatilitása $\sigma_M$. Minden részvény hozamát így írjuk fel:

$$
R_i = \alpha_i + \beta_i R_M + \varepsilon_i, \qquad i = 1, \dots, N.
$$

Itt $\beta_i$ az $i$-edik részvény indexre vonatkozó érzékenysége, $\alpha_i$ konstans, $\varepsilon_i$ pedig a részvény **egyedi** (specifikus) hozama, nulla várható értékkel és $\sigma_{\varepsilon,i}$ volatilitással. A modell két feltevésre épül:

- Minden $\varepsilon_i$ korrelálatlan az indexszel: $\operatorname{Cov}(\varepsilon_i, R_M) = 0$.
- A különböző részvények egyedi hozamai egymással korrelálatlanok: $\operatorname{Cov}(\varepsilon_i, \varepsilon_j) = 0$, ha $i \ne j$.

Az első feltevés csupán regressziós meredekségként definiálja $\beta_i$-t. A valódi megszorítás a második: eszerint két részvény *kizárólag* az index miatt mozog együtt.

## Varianciák és kovarianciák az indexmodellben

Vegyük $R_i$ varianciáját. Az $\alpha_i$ konstans kiesik, és mivel $\varepsilon_i$ korrelálatlan $R_M$-mel, keresztszorzat sincs:

$$
\operatorname{Var}(R_i) = \beta_i^2\sigma_M^2 + \sigma_{\varepsilon,i}^2.
$$

Két különböző részvény esetén a kovariancia mindkét változójában lineáris, így bonthatjuk a szorzatot. A $\operatorname{Cov}(R_M, \varepsilon_j)$, $\operatorname{Cov}(\varepsilon_i, R_M)$ és $\operatorname{Cov}(\varepsilon_i, \varepsilon_j)$ tag a feltevések szerint mind nulla, így marad

$$
\operatorname{Cov}(R_i, R_j) = \beta_i\beta_j\,\operatorname{Cov}(R_M, R_M) = \beta_i\beta_j\,\sigma_M^2 \qquad (i \ne j).
$$

A kovarianciamátrix minden eleme következik a bétákból, az egyedi volatilitásokból és $\sigma_M$-ből. Ha a kovarianciamátrixhoz szükséges paramétereket számoljuk össze, ez $N$ béta, $N$ egyedi volatilitás és egy piaci volatilitás: $N(N+1)/2$ helyett $2N + 1$ paraméter. Ha a várható hozamok leírásához az alfákat is beszámítjuk, $3N + 1$. 500 részvénynél ez 125 250 helyett 1001 kockázati paraméter (az alfákkal 1501).

## Diverzifikáció az indexmodellben

Egy $w_i$ súlyú portfólió hozama $R_p = \sum_i w_i R_i = \alpha_p + \beta_p R_M + \sum_i w_i\varepsilon_i$, ahol $\beta_p = \sum_i w_i\beta_i$ a béták súlyozott átlaga. Az egyedi hozamok korrelálatlanok az indexszel és egymással, ezért

$$
\sigma_p^2 = \beta_p^2\sigma_M^2 + \sum_{i=1}^{N} w_i^2\,\sigma_{\varepsilon,i}^2.
$$

Vegyünk most $N$ részvényt egyenlő, $w_i = 1/N$ súllyal, mindegyiket ugyanazzal a $\beta$ bétával és ugyanazzal a $\sigma_\varepsilon$ egyedi volatilitással. Az egyedi összegben $N$ darab $\sigma_\varepsilon^2/N^2$ nagyságú tag áll:

$$
\sigma_p^2 = \beta^2\sigma_M^2 + \frac{\sigma_\varepsilon^2}{N} \;\longrightarrow\; \beta^2\sigma_M^2 \quad (N \to \infty).
$$

Ez a „Diverzifikáció és korreláció” című lecke eredménye, most már konkrét szerkezettel. Ott az egyenlő súlyú portfólió varianciája az átlagos kovarianciához tartott. Az indexmodellben két különböző részvény kovarianciája mindig $\beta^2\sigma_M^2$, így az átlagos kovariancia pontosan a szisztematikus variancia, és a volatilitás soha nem eshet a $\beta\sigma_M$ **szisztematikus padló** alá.

> Az egyindexes modellben az egyenlő súlyú portfólió egyedi varianciája $\sigma_\varepsilon^2/N$, és $N$ növekedésével eltűnik. A $\beta_p^2\sigma_M^2$ szisztematikus rész egyáltalán nem függ $N$-től.

## A variancia szisztematikus hányada

Az index által magyarázott varianciahányad

$$
R^2 = \frac{\beta^2\sigma_M^2}{\beta^2\sigma_M^2 + \sigma_\varepsilon^2},
$$

ugyanaz az $R^2$, amelyet a részvény indexre futtatott regressziója mutat. Egyetlen részvénynél ez $\rho^2$, az indexszel vett korreláció négyzete, ahogy a CAPM-leckében. Egy tipikus részvénynél az $R^2$ jóval 0,5 alatt van; egy legalább 20 részvényből álló portfólióé rendszerint egyhez közeli.

### Kidolgozott példa: Egy részvény varianciájának felbontása

1. Egy részvény bétája $\beta = 1{,}2$ egy $\sigma_M = 20\%$-os indexhez képest. A szisztematikus varianciája
   $$\beta^2\sigma_M^2 = 1{,}44 \times 0{,}04$$ → **0.0576**
2. Az egyedi volatilitása $\sigma_\varepsilon = 25\%$, így az egyedi variancia
   $$\sigma_\varepsilon^2 = 0{,}25^2$$ → **0.0625**
3. A teljes variancia a kettő összege, mert a két rész korrelálatlan.
   $$\sigma^2 = 0{,}0576 + 0{,}0625$$ → **0.1201**
4. A szisztematikus hányad a részvény $R^2$-e.
   $$R^2 = \frac{0{,}0576}{0{,}1201}$$ → **47.96%**

## Az indexmodell becslése

A paraméterek abból a regresszióból adódnak, amellyel a „CAPM, béta és az értékpapír-piaci egyenes” című lecke a bétát becsülte: regresszáljuk a részvény hozamait az index hozamaira, mondjuk 60 hónapon át. A meredekség $\hat\beta_i$, a tengelymetszet $\hat\alpha_i$, a reziduumok szórása pedig $\sigma_{\varepsilon,i}$ becslése. Az a lecke többlethozamokkal dolgozott; állandó $r_f$ mellett a meredekség ugyanaz, csak a tengelymetszet változik. Az index mintabeli varianciájából kapjuk $\sigma_M$-et.

## Az indexmodell és a CAPM

A kettő hasonlít egymásra, de más jellegű állítást tesz. Az egyindexes modell **statisztikai** modell: azt írja le, hogyan mozognak együtt a hozamok, és fő feltevése, az egyedi hozamok korrelálatlansága, az adatokon ellenőrizhető. Arról semmit sem mond, mekkorák legyenek a várható hozamok; bármilyen $\alpha_i$ megengedett. A CAPM **egyensúlyi** modell: a befektetőkről tett feltevésekből arra jut, hogy a várható többlethozamok arányosak a bétával, vagyis a többlethozamos regresszió alfája nulla. A CAPM-nek nincs szüksége korrelálatlan egyedi hozamokra, és az indexmodell érvényességéhez sem kell a CAPM. A gyakorlatban a várható hozamokat a CAPM, a kovarianciamátrixot az indexmodell adja.

## Számpélda

Legyen minden részvényre $\sigma_M = 18\%$, $\beta = 1$ és $\sigma_\varepsilon = 30\%$. Egyetlen részvény varianciája $0{,}0324 + 0{,}09 = 0{,}1224$, volatilitása kb. $35{,}0\%$, $R^2$-e pedig $0{,}0324/0{,}1224 \approx 26{,}5\%$. 20 részvény egyenlő súlyozásával

$$
\sigma_p^2 = 0{,}0324 + \frac{0{,}09}{20} = 0{,}0369, \qquad \sigma_p \approx 19{,}21\%.
$$

A padló $\beta\sigma_M = 18\%$, a szisztematikus hányad $0{,}0324/0{,}0369 \approx 87{,}8\%$. Húsz részvény az egyedi kockázat szinte egészét eltüntette: a volatilitás 35%-ról 19,2%-ra esett, és csak 1,2 százalékpont maradt a padló felett. 100 részvénynél a teljes kovarianciamátrixnak $100 \times 101/2 = 5050$ eleme van, az indexmodellnek viszont csak $2 \times 100 + 1 = 201$ paraméter kell (az alfákkal 301).

Az ábra a piaci volatilitást $\sigma_M = 18\%$-on rögzíti, és $N$ részvényből egyenlő súlyú portfóliót épít, amelyben minden részvénynek ugyanaz a bétája és az egyedi volatilitása. A csúszkák az átlagos $\beta$ bétát (0,5 és 1,5 között, alapérték 1), az egyedi volatilitást (10% és 60% között, alapérték 30%) és a részvények $N$ számát (1 és 100 között, alapérték 20) állítják. A diagram a portfólió volatilitását mutatja $N$ függvényében 1-től 100-ig, a $\beta\sigma_M$ padlóval együtt, a választott $N$-et pedig függőleges vonal jelöli. A kijelzők a portfólió volatilitását a választott $N$-nél, a padlót, a variancia szisztematikus hányadát, valamint $N$ részvényre a teljes kovarianciamátrix és az egyindexes modell paramétereinek számát mutatják. Emeld az egyedi volatilitást 60%-ra, és figyeld meg, mennyivel több részvény kell a padló megközelítéséhez: 30%-nál nagyjából 25, 60%-nál nagyjából 98 részvény kell ahhoz, hogy a volatilitás legfeljebb egy százalékponttal legyen 18% fölött. Ezután mozgasd a $\beta$-t, és nézd, hogyan tolódik el a padló, $\beta = 1{,}3$-nál például $23{,}4\%$-ra.

*[Interaktív ábra: factor variance](https://quantsandbox.dev/hu/guide/portfolio/factor-models)*

## Többfaktoros modellek

Egyetlen index ritkán magyarázza az összes közös mozgást: a bankok a bankokkal, a kis cégek a kis cégekkel mozognak együtt, így a rokon részvények egyedi hozamai korrelálnak, ami ellentmond a második feltevésnek. A **többfaktoros modell** további közös forrásokat vesz fel, $F_1, \dots, F_K$-t:

$$
R_i = \alpha_i + \sum_{k=1}^{K}\beta_{ik}F_k + \varepsilon_i,
$$

ismét úgy, hogy az egyedi hozamok korrelálatlanok a faktorokkal és egymással. Gyűjtsük a $\beta_{ik}$ faktorsúlyokat egy $N \times K$-s $B$ mátrixba, a faktorok kovarianciáit egy $K \times K$-s $\Sigma_F$ mátrixba, az egyedi varianciákat pedig egy $D$ diagonális mátrixba. A fentivel azonos kifejtés adja a hozamok kovarianciamátrixát:

$$
\Sigma = B\,\Sigma_F\,B^{\top} + D,
$$

$NK + K(K+1)/2 + N$ paraméterrel; 500 részvényre és 3 faktorra ez 2006. A legismertebbek Fama és French faktorai: a piac mellett a **méret** (a kis cégek hozama mínusz a nagyoké) és az **érték** (a magas könyv szerinti és piaci érték arányú cégek hozama mínusz az alacsonyaké). Carhart ehhez a **momentumot** tette hozzá, a közelmúlt nyerteseinek hozama mínusz a veszteseké. Minden ilyen faktor maga is egy long–short portfólió hozama. Vitatott, hogy ezek a faktorok kockázatért járó jutalmat vagy tartós félreárazást tükröznek; a kovarianciák leírására mindenesetre jól beválnak.

## Összefoglalás

- $N$ eszköz teljes kovarianciamátrixának $N(N+1)/2$ eleme van; a faktormodellek ezt eszközönként néhány paraméterrel helyettesítik.
- Egyindexes modell: $R_i = \alpha_i + \beta_i R_M + \varepsilon_i$, amiből $\operatorname{Var}(R_i) = \beta_i^2\sigma_M^2 + \sigma_{\varepsilon,i}^2$ és $\operatorname{Cov}(R_i, R_j) = \beta_i\beta_j\sigma_M^2$ következik, $2N + 1$ kockázati paraméterrel (az alfákkal $3N + 1$).
- A portfólió varianciája $\beta_p^2\sigma_M^2 + \sum_i w_i^2\sigma_{\varepsilon,i}^2$; egyenlő súlyoknál az egyedi rész $\sigma_\varepsilon^2/N$, és a volatilitás a $\beta_p\sigma_M$ padló felé csökken.
- Az indexmodell a kovarianciák statisztikai leírása; a CAPM egyensúlyi állítás a várható hozamokról.
- A többfaktoros modellek (piac, méret, érték, momentum) kovarianciamátrixa $\Sigma = B\Sigma_F B^{\top} + D$.

> A következő lecke, a „Kockáztatott érték (VaR) és várható veszteség (ES)”, a portfólió volatilitásából veszteségszintet számol, és nagy portfólióknál ezt a volatilitást rendszerint faktoros kovarianciamátrixból kapjuk.

[Becsülj bétát, és válaszd szét a szisztematikus és az egyedi kockázatot a CAPM laborban](https://quantsandbox.dev/hu/capm)

## Interaktív laborok

- [CAPM-kalkulátor és értékpapír-piaci egyenes](https://quantsandbox.dev/hu/capm)
- [Kéteszközös portfólió: diverzifikáció és korreláció](https://quantsandbox.dev/hu/portfolio-lab)

## Gyakorló kérdések

### 1. Az egyindexes modellben az A részvényre $\beta_A = 1{,}2$, a B részvényre $\beta_B = 0{,}8$, az index volatilitása $\sigma_M = 20\%$. Mennyi $\operatorname{Cov}(R_A, R_B)$ tizedes törtként?

**Válasz:** 0.0384

$\operatorname{Cov}(R_A, R_B) = \beta_A\beta_B\sigma_M^2 = 1{,}2 \times 0{,}8 \times 0{,}04 = 0{,}0384$. Az egyedi volatilitások nem szerepelnek: ebben a modellben csak az index köti össze a két részvényt.

### 2. Egy egyenlő súlyú portfólió egyre több részvényt tartalmaz, mindegyik bétája $\beta$, egyedi volatilitása $\sigma_\varepsilon$. Mihez tart a portfólió volatilitása?

- a) Nullához
- b) $\beta\sigma_M$-hez
- c) $\sigma_\varepsilon$-hoz
- d) $\sqrt{\beta^2\sigma_M^2 + \sigma_\varepsilon^2}$-hez, egyetlen részvény volatilitásához

**Válasz:** b) $\beta\sigma_M$-hez

Az egyedi rész, $\sigma_\varepsilon^2/N$, eltűnik, a szisztematikus $\beta^2\sigma_M^2$ rész megmarad, így a volatilitás a $\beta\sigma_M$ alsó korlátig csökken.

---

Forrás: https://quantsandbox.dev/hu/guide/portfolio/factor-models

Előző lecke: [Teljesítménymutatók: Sharpe, Treynor, Jensen és információs ráta](https://quantsandbox.dev/hu/guide/portfolio/performance-measures)

Következő lecke: [Kockáztatott érték (VaR) és várható veszteség (ES)](https://quantsandbox.dev/hu/guide/portfolio/risk-measures)
