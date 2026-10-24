# A várható hozam és a kovariancia becslése

Mintamomentumok, standard hibáik, miért instabil a hatékony front, és a zsugorítás (shrinkage) mint ellenszer.

A „Hatékony front és tőkepiaci egyenes” és a „Portfóliókorlátok és a shortolás nélküli hatékony front” minden optimalizálója adottnak veszi a várható hozamokat, a volatilitásokat és a korrelációkat. A gyakorlatban ezeket néhány évnyi adatból becsüljük, és a becslések zajosak. Ez a lecke megméri, mennyire, megmutatja, hogyan nagyítja fel az optimalizáló a zajt, és bevezeti a zsugorítást mint gyógymódot. A „Hozamok és volatilitás” leckére épít.

## Mintamomentumok

$n$ megfigyelt hozamból, $r_1, \dots, r_n$, a szokásos becslések a minta átlaga és a minta varianciája:

$$
\hat\mu = \frac1n\sum_{t=1}^n r_t, \qquad \hat\sigma^2 = \frac1{n-1}\sum_{t=1}^n (r_t - \hat\mu)^2.
$$

Mindkettő torzítatlan: sok minta átlagában az igazi értéket adják. Egyetlen minta viszont egy húzás, és a portfólióra vonatkozó becslés csak olyan jó, mint az a húzás.

## Mennyire tévesek a becslések

Ha a hozamok függetlenek és volatilitásuk $\sigma$, a minta átlagának standard hibája

$$
\mathrm{SE}(\hat\mu) = \frac{\sigma}{\sqrt n}, \qquad \mathrm{SE}(\hat\sigma) \approx \frac{\sigma}{\sqrt{2n}}.
$$

Ha $n$-t években mérjük és $\sigma$ éves, egy 20% volatilitású részvény átlaga 5 évnyi megfigyelés után 8,9 százalékponton belül ismert, 20 év után 4,5 ponton belül, és még 100 év után is 2,0 ponton belül. A részvénypiaci kockázati prémium maga is néhány százalékpont, így egy élet adata is alig választja szét a jó eszközt a közepestől. A gyakoribb megfigyelés az átlagon nem segít: az a minta hosszától függ, nem attól, milyen sűrűn szeleteljük. A volatilitások és a korrelációk ezzel szemben sokkal pontosabban becsülhetők, és a napi mintavétel javít rajtuk.

## A hibák maximalizálása

Az optimalizáló a becsléseket igaznak veszi, és a legnagyobb súlyt oda teszi, ahol a becsült hozam a kockázathoz képest a legmagasabb. Az az eszköz, amelyik a mintában szerencsés volt, vonzónak látszik, és az optimalizáló sokat vesz belőle; a szerencsétlent shortolja. A portfólió tehát a hibákra épül, ezért nevezik hibamaximalizálónak.

Az ábra két eszközt mutat 4% és 10% igazi várható hozammal, 10% és 20% volatilitással, korreláció nélkül és 2%-os kockázatmentes kamattal. Az igazi érintési portfólió 50-50%-ot tart. A halvány görbék 20 véletlen, 60 hónapos (5 éves) mintából becsült frontok: szélesen szórnak az igazi körül. Az 1. eszközben a becsült érintési súly középső fele 47% és 97% között van, az igazi 50% ellenében, és a becslésekből épített portfóliók átlagosan 0,160 Sharpe-mutatót veszítenek az igazi optimum 0,447-éhez képest. Vidd a mintát 600 hónapra, és a veszteség 0,020-ra esik.

*[Interaktív ábra: estimation noise](https://quantsandbox.dev/hu/guide/portfolio/input-estimation)*

## Zsugorítás

Egy gyógymód, hogy a zajos becsléseket egy értelmes cél felé húzzuk. A várható hozamoknál a legegyszerűbb cél az összes eszköz átlaga, $\bar\mu$:

$$
\tilde\mu_i = (1 - k)\,\hat\mu_i + k\,\bar\mu, \qquad 0 \le k \le 1.
$$

$k = 0$ esetén semmi sem változik, $k = 1$ esetén minden eszköz ugyanazt a várható hozamot kapja. Másik cél a „CAPM, béta és az értékpapír-piaci egyenes” leckéből következő prior, amelyben a várható hozamok csak a bétán keresztül különböznek. A zsugorítás kis torzítást visz be, de sok varianciát elvesz. 60 hónapnál $k = 0{,}5$ az ábrán az átlagos Sharpe-veszteséget 0,160-ról 0,097-re vágja.

## A kovarianciák könnyebbek

A volatilitásbecslés relatív hibája $\mathrm{SE}(\hat\sigma)/\sigma = 1/\sqrt{2n}$: 240 havi megfigyelésnél ez körülbelül 4,6%, szemben egy átlaggal, amelynek bizonytalansága a saját nagyságrendjét is elérheti. A kovarianciáknál a nehézség más, a számuk: $N$ eszköznek $N(N+1)/2$ varianciája és kovarianciája van, így néhány évnyi minta több száz részvénynél nem határozza meg őket megbízhatóan. A faktorszerkezet kikötése, ahogy a „Faktormodellek és szisztematikus kockázat” leckében, a legtöbbjüket néhány paraméterrel helyettesíti, ami a zsugorítás egy másik formája.

### Kidolgozott példa: Milyen hosszú minta kell az átlaghoz

1. Egy 20% volatilitású eszköz átlagának standard hibája 5 év után, százalékpontban.
   $$\mathrm{SE} = \frac{\sigma}{\sqrt n}$$ → **8.94**
2. 20 év után.
   $$\mathrm{SE} = \frac{20\%}{\sqrt{20}}$$ → **4.47**
3. A 95%-os sáv a becslés körül körülbelül 1,96 standard hiba mindkét irányban; a félszélessége százalékpontban 20 év után.
   $$1{,}96\cdot\mathrm{SE}$$ → **8.76**
4. Hány év adat kell ahhoz, hogy a standard hiba 1 százalékpontra csökkenjen?
   $$n = \left(\frac{\sigma}{\mathrm{SE}}\right)^2$$ → **400**

## Összefoglalás

- A mintamomentumok torzítatlanok, de zajosak: az átlag standard hibája $\sigma/\sqrt n$, és gyakoribb adattal sem javul.
- Az optimalizáló a szerencsés mintájú eszközöket túlsúlyozza, így a becslésből épített front instabil, és a valóságban Sharpe-mutatót veszít.
- Az átlagok közös cél felé zsugorítása kis torzítást visz be, és sok varianciát elvesz.
- A kovarianciák jobban becsülhetők az átlagoknál; náluk a számuk a gond, amit faktorszerkezettel kezelünk.

> A sztochasztikus modulban később a Monte Carlo-leckék a standard hiba ugyanezen gondolatát használják a szimulált átlagokra.

[Becsülj frontot mintából a Hatékony front laborban](https://quantsandbox.dev/hu/efficient-frontier)

## Interaktív laborok

- [Hatékony front és Markowitz-optimalizálás](https://quantsandbox.dev/hu/efficient-frontier)
- [Tőkeallokációs egyenes és Sharpe-mutató](https://quantsandbox.dev/hu/risk-return)

## Gyakorló kérdések

### 1. Egy eszköz éves volatilitása 15%. Mekkora a hozama átlagának standard hibája százalékpontban, ha 25 év adatából becsüljük?

**Válasz:** 3

$\mathrm{SE} = \sigma/\sqrt n = 15\% / \sqrt{25} = 3$ százalékpont.

### 2. Melyik bemenetet a legnehezebb pontosan megbecsülni egy átlag–variancia optimalizálásban a múltbeli adatokból?

- a) A várható hozamokat
- b) A volatilitásokat
- c) A korrelációkat
- d) Az eszközök számát

**Válasz:** a) A várható hozamokat

Az átlag standard hibája $\sigma/\sqrt n$, és csak a minta hosszával csökken, így magához az átlaghoz képest nagy. A varianciák és a korrelációk sokkal pontosabban becsülhetők, és a gyakoribb mintavétel javít rajtuk.

---

Forrás: https://quantsandbox.dev/hu/guide/portfolio/input-estimation

Előző lecke: [Portfóliókorlátok és a shortolás nélküli hatékony front](https://quantsandbox.dev/hu/guide/portfolio/portfolio-constraints)
