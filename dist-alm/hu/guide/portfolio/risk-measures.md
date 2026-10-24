# Kockáztatott érték (VaR) és várható veszteség (ES)

Veszteségkvantilisek, az azokon túli farokrész, normális és vastag farkú hozamok, és a négyzetgyökös időszabály.

A „Hozamok és volatilitás” című lecke a kockázatot a $\sigma$ volatilitással, a hozamok szórásával mérte. A kockázatkezelő általában másfajta választ vár: egy pénzösszeget, amelyet a pozíció elveszíthet. Ez a lecke egy hozameloszlásból két ilyen számot készít, a kockáztatott értéket és a várható veszteséget, előbb a normális modellben, majd vastag farkú eloszlással, végül portfóliókra, ami visszavezet a „Diverzifikáció és korreláció” című leckéhez.

## A veszteségeloszlás

Vegyünk egy ma $V$ értékű pozíciót, és rögzítsünk egy **időtávot**, például egy vagy tíz kereskedési napot. Legyen $R$ a pozíció egyszerű hozama ezen az időtávon. A **veszteség** az értékcsökkenés, pozitív számként:

$$
L = -(V_h - V) = -V R.
$$

A nyereség negatív veszteség. $L$ eloszlása a **veszteségeloszlás**; a kockázati mértékek ennek jobb farkából, a nagy veszteségek tartományából olvasott számok. Feltesszük, hogy a pozíció az időtáv alatt változatlan.

## Kockáztatott érték

Válasszunk egy $\alpha$ **konfidenciaszintet**, jellemzően 95%-ot vagy 99%-ot. A **kockáztatott érték** (Value at Risk, $\text{VaR}_\alpha$) a veszteségeloszlás $\alpha$-**kvantilise**: az a legkisebb $\ell$ összeg, amelynél a veszteség legalább $\alpha$ valószínűséggel nem nagyobb,

$$
\text{VaR}_\alpha = \min\{\ell : \mathbb{P}(L \le \ell) \ge \alpha\}.
$$

Az egynapos 99%-os, 28 000-es VaR jelentése: 100 napból 99-en a veszteség nem haladja meg a 28 000-et. A konvenció itt az, hogy a VaR pozitív pénzösszeg, $\alpha$ pedig közel van 1-hez.

## Várható veszteség

A VaR egy küszöb. Megmondja, milyen gyakran lépjük át, de azt nem, hogy mennyivel. Erre felel a **várható veszteség** (expected shortfall, ES): a kimenetelek legrosszabb $1-\alpha$ hányadában elszenvedett átlagos veszteség. Folytonos veszteségeloszlásnál

$$
\text{ES}_\alpha = \mathbb{E}\big[L \mid L \ge \text{VaR}_\alpha\big] = \frac{1}{1-\alpha}\int_\alpha^1 \text{VaR}_u\,du.
$$

A második alak szerint az ES az $\alpha$ fölötti összes VaR átlaga, így mindig $\text{ES}_\alpha \ge \text{VaR}_\alpha$.

## A normális modell

Tegyük fel, hogy az időtávra vett hozam normális eloszlású, $R \sim N(\mu, \sigma^2)$. Ekkor $L = V(\sigma Z - \mu)$, ahol $Z$ standard normális ($Z$ előjelét megfordítottuk, amit a normális eloszlás szimmetriája megenged). Legyen $z_\alpha = N^{-1}(\alpha)$ a standard normális kvantilis, például $z_{0{,}99} \approx 2{,}326$. Mivel $L$ a $Z$ növekvő függvénye, a kvantilise

$$
\text{VaR}_\alpha = V\,(\sigma z_\alpha - \mu).
$$

A várható veszteséghez $Z$ átlaga kell $z_\alpha$ fölött. A $\varphi(x) = e^{-x^2/2}/\sqrt{2\pi}$ standard normális sűrűségre $\varphi'(x) = -x\varphi(x)$, így $x\varphi(x)$ primitív függvénye $-\varphi(x)$:

$$
\mathbb{E}[Z \mid Z \ge z_\alpha] = \frac{1}{1-\alpha}\int_{z_\alpha}^{\infty} x\,\varphi(x)\,dx = \frac{1}{1-\alpha}\Big[-\varphi(x)\Big]_{z_\alpha}^{\infty} = \frac{\varphi(z_\alpha)}{1-\alpha}.
$$

Ezt $L = V(\sigma Z - \mu)$-be helyettesítve

$$
\text{ES}_\alpha = V\left(\sigma\,\frac{\varphi(z_\alpha)}{1-\alpha} - \mu\right).
$$

$\alpha = 99\%$ mellett a szorzó $\varphi(2{,}326)/0{,}01 \approx 2{,}665$, körülbelül 15%-kal nagyobb, mint $z_{0{,}99}$.

## Skálázás az időtávval

A volatilitást többnyire napi hozamokból becsüljük. Ahogy a „Hozamok és volatilitás” című lecke megmutatta, ha a napi hozamok függetlenek és azonos eloszlásúak, a varianciák napról napra összeadódnak, így $h$ napra

$$
\sigma_h = \sigma_1\sqrt{h}, \qquad \mu_h = \mu_1 h.
$$

Rövid távon $\mu$ elenyésző $\sigma$-hoz képest, ezért gyakran nullának vesszük; ekkor a VaR és az ES $\sqrt{h}$ szerint nő. A szabály három feltevésre épül: a különböző napok hozamai függetlenek, a volatilitás állandó, és a pozíció az időtáv alatt nem változik. A volatilitás csomósodása és az autokorreláció az első kettőt sérti, ezért a skálázott tíznapos szám csak közelítés.

## Számpélda

Egy $V = 1\,000\,000$ értékű pozíció napi volatilitása $\sigma = 1{,}2\%$, és $\mu = 0$. Az alábbi lépések kiszámítják az egynapos 99%-os VaR-t és ES-t, valamint a tíznapos VaR-t.

### Kidolgozott példa: Egy 1 000 000 értékű pozíció 99%-os VaR-ja és ES-e

1. Szorozzuk meg a pozíció értékét a napi volatilitással.
   $$V\sigma = 1\,000\,000 \times 0{,}012$$ → **12000**
2. Keressük meg a standard normális eloszlás 99%-os kvantilisét.
   $$z_{0{,}99} = N^{-1}(0{,}99)$$ → **2.326**
3. Az egynapos VaR $V\sigma$ és a kvantilis szorzata.
   $$\text{VaR}_{0{,}99} = V\sigma \cdot z_{0{,}99}$$ → **27916**
4. Az egynapos ES-hez a kvantilis helyett a $\varphi(z_{0{,}99})/0{,}01 \approx 2{,}665$ farokszorzó kell.
   $$\text{ES}_{0{,}99} = V\sigma \cdot \frac{\varphi(z_{0{,}99})}{0{,}01}$$ → **31983**
5. Tíz napra a volatilitás, és $\mu = 0$ mellett a VaR is, a $\sqrt{10} \approx 3{,}162$-szeresére nő.
   $$\text{VaR}^{(10)}_{0{,}99} = \text{VaR}_{0{,}99} \cdot \sqrt{10}$$ → **88279**

A tíznapos volatilitás $\sigma_{10} = 1{,}2\% \times \sqrt{10} \approx 3{,}79\%$, és a tíznapos ES ugyanígy skálázódik, körülbelül 101 138-ra.

## Vastag farok

A napi hozamok között több a szélsőséges nap, mint amennyit a normális eloszlás jósol. Egy egyszerű **vastag farkú** modell a $\nu$ szabadsági fokú **Student-féle t-eloszlás**. Ennek varianciája $\nu/(\nu-2)$, ezért $\sqrt{(\nu-2)/\nu}$-vel egységnyi varianciára skálázzuk, majd $\sigma$-val szorozzuk. Így a két modell volatilitása azonos, csak az alakjuk különbözik: a t több súlyt tesz a távoli farokba és a közepére, kevesebbet a kettő közé. Kis $\nu$ vastag farkot jelent; $\nu \to \infty$ esetén a t normálissá válik.

$\nu = 4$ mellett a $\sigma$ szorzói:

- $\alpha = 97{,}5\%$: a VaR mindkét modellben 1,96; az ES 2,34 (normális), illetve 2,82 (t).
- $\alpha = 99\%$: a VaR 2,33, illetve 2,65 (14%-kal nagyobb); az ES 2,67, illetve 3,69 (38%-kal nagyobb).
- $\alpha = 99{,}9\%$: a VaR 3,09, illetve 5,07; az ES 3,37, illetve 6,84, nagyjából a kétszerese.

A számpéldában a vastag farkú egynapos 99%-os VaR körülbelül 31 794, az ES körülbelül 44 280. Mérsékelt konfidenciaszinten a VaR alig érzékeli a farkat; a farok fölött átlagoló ES viszont igen, és a különbség $\alpha$ növekedésével nő.

Az ábrán egy 100 értékű pozíció szerepel 1,2%-os napi volatilitással és nulla várható hozammal. A csúszkák az $\alpha$ konfidenciaszintet (90% és 99,5% között), az időtávot napokban (1 és 20 között, a volatilitás $\sqrt{h}$ szerint skálázva) és a vastag farkú modell $\nu$ szabadsági fokát (3 és 30 között) állítják. A grafikon a veszteségeloszlást mutatja a normális modellben és az azonos volatilitású Student-t modellben, a két VaR-nál függőleges vonalakkal. A kijelzők mindkét modellre megadják a VaR-t és az ES-t, 100 befektetett egységre vetítve. $\alpha = 99\%$, egy nap és $\nu = 4$ mellett az értékek 2,79 és 3,20 (normális), illetve 3,18 és 4,43 (t). Emeld $\alpha$-t 99,5% felé, és figyeld, ahogy a vastag farkú ES eltávolodik a normálistól; aztán csökkentsd $\nu$-t, és nézd, ahogy ugyanez a hatás erősödik.

*[Interaktív ábra: var es](https://quantsandbox.dev/hu/guide/portfolio/risk-measures)*

## Történeti szimuláció

Eloszlás feltételezése helyett a **történeti szimuláció** a múltat használja fel újra. Vegyük például az utolsó 500 napi hozamot, alkalmazzuk mindegyiket a mai pozícióra, így 500 hipotetikus veszteséget kapunk, és rendezzük sorba őket. A 99%-os VaR nagyjából az ötödik legnagyobb veszteség, az ES az öt legnagyobb átlaga. A módszer úgy ragadja meg a vastag farkat és a korrelációkat, ahogy azok ténylegesen előfordultak, de csak az ablakon belül: egy nyugodt időszak alacsony VaR-t ad, akár közvetlenül egy válság előtt is.

## A VaR és az ES tulajdonságai

Mivel a VaR egyetlen kvantilis, két azonos VaR-ú pozíció veszteségei a küszöb fölött nagyon különbözhetnek. Ráadásul a VaR nem **szubadditív**: egy portfólió VaR-ja nagyobb lehet a részei VaR-jainak összegénél. Példa: két független kötvény mindegyike 4% valószínűséggel 100-at veszít, egyébként semmit. Mindkettő 95%-os VaR-ja 0, hiszen veszteség 5%-nál kisebb valószínűséggel lép fel. A kettőt együtt tartva legalább egy csőd valószínűsége $1 - 0{,}96^2 = 7{,}84\%$, így a portfólió 95%-os VaR-ja 100. A VaR-ral mérve a diverzifikáció károsnak tűnik.

A várható veszteség szubadditív, $\text{ES}(L_1 + L_2) \le \text{ES}(L_1) + \text{ES}(L_2)$; a példában kötvényenként az ES 80, a párra 103,2, jóval 160 alatt. Három egyszerűbb tulajdonsággal (monotonitás, eltolás-invariancia, pozitív homogenitás) együtt ez teszi az ES-t **koherens kockázati mértékké**.

> A VaR arra felel, mekkora a veszteség egy „szokásos rossz napon”; az ES arra, hogy átlagosan mekkora, ha ezt a határt átléptük. Ezért cserélte le a bázeli szabályozás a kereskedési könyv alapvető felülvizsgálatában (FRTB) a piaci kockázati tőkekövetelményhez használt 99%-os VaR-t 97,5%-os ES-re. A normális modellben a kettő szinte egyenlő (2,326, illetve 2,338 szórásnyi); vastag farok mellett az ES nagyobb.

## Portfólió-VaR

Egy $w$ súlyú portfólióra, $\Sigma$ hozam-kovarianciamátrix mellett a „Diverzifikáció és korreláció” című lecke szerint $\sigma_p^2 = w^\top\Sigma\,w$, a normális modellben pedig $\text{VaR}_\alpha = V(\sigma_p z_\alpha - \mu_p)$. Egynél kisebb korrelációk mellett $\sigma_p$ kisebb a volatilitások súlyozott átlagánál, így a portfólió VaR-ja kisebb a külön számolt VaR-ok összegénél. Ha a fenti 1 000 000-t két 500 000-es pozícióra osztjuk, mindkettő napi volatilitása 1,2%, a korreláció 0,3, akkor $\sigma_p = 1{,}2\% \times \sqrt{0{,}65} \approx 0{,}97\%$, és a 99%-os VaR körülbelül 22 507 a 27 916 helyett.

## Összefoglalás

- Az időtávra vett veszteség $L = -VR$; a $\text{VaR}_\alpha$ ennek $\alpha$-kvantilise, pozitív pénzösszeg.
- Az $\text{ES}_\alpha$ a legrosszabb $1-\alpha$ farokban elszenvedett átlagos veszteség, és sosem kisebb a VaR-nál.
- Normális modell: $\text{VaR}_\alpha = V(\sigma z_\alpha - \mu)$, $\text{ES}_\alpha = V(\sigma\varphi(z_\alpha)/(1-\alpha) - \mu)$, ahol függetlenség és állandó volatilitás mellett $\sigma_h = \sigma_1\sqrt{h}$.
- Vastag farok mellett a VaR mérsékelten, az ES sokkal jobban nő, és ez magas konfidenciaszinten egyre erősebb.
- Az ES szubadditív és koherens, a VaR nem; a szabályozás (FRTB) 97,5%-os ES-t használ.

[Becsülj várható hozamot, volatilitást és kockázat–hozam viszonyt a Kockázat és hozam laborban](https://quantsandbox.dev/hu/risk-return)

## Interaktív laborok

- [Tőkeallokációs egyenes és Sharpe-mutató](https://quantsandbox.dev/hu/risk-return)
- [Kéteszközös portfólió: diverzifikáció és korreláció](https://quantsandbox.dev/hu/portfolio-lab)

## Gyakorló kérdések

### 1. Egy 500 000 értékű pozíció napi volatilitása $\sigma = 2\%$, és $\mu = 0$. Mekkora az egynapos 95%-os VaR a normális modellben? Használd a $z_{0{,}95} \approx 1{,}645$ értéket.

**Válasz:** 16449

$\text{VaR}_{0{,}95} = V\sigma z_{0{,}95} = 500\,000 \times 0{,}02 \times 1{,}645 \approx 16\,450$ (a pontos 1,6449-es kvantilissel 16 449). Nagyjából húsz napból egyen a veszteség meghaladja ezt az összeget.

### 2. Melyik kockázati mérték mutathat egy diverzifikált portfóliót kockázatosabbnak, mint a részeit együttvéve?

- a) A kockáztatott érték (VaR)
- b) A várható veszteség (ES)
- c) Mindkettő
- d) Egyik sem

**Válasz:** a) A kockáztatott érték (VaR)

A VaR nem szubadditív: a két kötvényes példában mindkét kötvény 95%-os VaR-ja 0, a páré viszont 100. Az ES szubadditív, így mindig teljesül $\text{ES}(L_1 + L_2) \le \text{ES}(L_1) + \text{ES}(L_2)$.

---

Forrás: https://quantsandbox.dev/hu/guide/portfolio/risk-measures

Előző lecke: [Faktormodellek és szisztematikus kockázat](https://quantsandbox.dev/hu/guide/portfolio/factor-models)

Következő lecke: [Portfóliókorlátok és a shortolás nélküli hatékony front](https://quantsandbox.dev/hu/guide/portfolio/portfolio-constraints)
