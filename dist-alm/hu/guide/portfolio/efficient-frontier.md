# Hatékony front és tőkepiaci egyenes

Átlag–variancia optimalizálás, minimális varianciájú portfólió, kockázatmentes eszköz és az érintőportfólió.

A „Diverzifikáció és korreláció” című lecke megmutatta, hogyan következik egy portfólió várható hozama és volatilitása az eszközök súlyaiból, volatilitásaiból és korrelációiból. Ez a lecke azt vizsgálja, melyik portfóliókat érdemes tartani. Először jó és rossz portfóliókra osztja a kockázatos portfóliókat, majd bevezet egy kockázatmentes eszközt, amellyel a választás egyetlen egyenesre szűkül: ez a tőkepiaci egyenes.

## Várható hozam–variancia preferenciák

A lecke végig feltételezi, hogy a befektetők egy portfóliót kizárólag egy időszakra vett $\mu$ várható hozama és $\sigma$ volatilitása alapján ítélnek meg. Azonos $\sigma$ mellett a nagyobb $\mu$-t, azonos $\mu$ mellett a kisebb $\sigma$-t választják. Egy portfólió **dominál** egy másikat, ha mindkét szempontból legalább olyan jó, és legalább az egyikben szigorúan jobb. A befektetők abban különbözhetnek, mekkora többlethozamot várnak el a többletkockázatért, de dominált portfóliót senki sem tart.

## Shortolás

**Shortolás** (short selling) esetén a befektető kölcsönvesz egy eszközt, eladja, majd később visszavásárolja, hogy visszaadja. Ez negatív súlyt jelent. $w_A = -0{,}5$ és $w_B = 1{,}5$ mellett a befektető a saját tőkéje felének megfelelő A-t ad el, és a tőkéje másfélszeresét fekteti B-be. Az előző lecke képletei továbbra is érvényesek, hiszen sehol sem kötötték ki, hogy a súlyok pozitívak:

$$
\mu_p = -0{,}5 \times 6\% + 1{,}5 \times 12\% = 15\%, \qquad \sigma_p^2 = 0{,}25 \times 0{,}0225 + 2{,}25 \times 0{,}09 - 2 \times 0{,}75 \times 0{,}009 = 0{,}194625.
$$

Ez az előző lecke eszközeire vonatkozik ($\mu_A = 6\%$, $\sigma_A = 15\%$, $\mu_B = 12\%$, $\sigma_B = 30\%$, $\rho = 0{,}2$, tehát $\sigma_{AB} = 0{,}009$), és $\sigma_p \approx 44{,}1\%$-ot ad. A shortolás mindkét irányban meghosszabbítja az elérhető portfóliók görbéjét a két eszközön túl.

## Az elérhető portfóliók és a hatékony front

Ha a $w = w_B$ súlyt minden valós számon végigfuttatjuk, a $(\sigma, \mu)$ síkon egy görbét kapunk: két eszköz esetén ez az **elérhető portfóliók halmaza**. Több eszköznél tartomány lesz belőle, amelynek bal széle ugyanilyen alakú. A legbaloldalibb pont az előző leckéből ismert **minimális varianciájú portfólió**, itt $w_B^{*} \approx 0{,}143$, $\sigma \approx 14{,}34\%$ és $\mu \approx 6{,}86\%$.

A minimális varianciájú portfólió két ágra bontja a görbét. Az alsó ág minden pontját dominálja a felső ág azonos volatilitású pontja. Példa: $\sigma = 20\%$-nál az alsó ágon $w_B \approx -0{,}31$ és $\mu \approx 4{,}14\%$, a felső ágon $w_B \approx 0{,}60$ és $\mu \approx 9{,}58\%$. Az elsőt senki sem választaná.

> A **hatékony front** az elérhető halmaz felső ága a minimális varianciájú portfóliótól felfelé. Minden pontja az adott volatilitás mellett elérhető legnagyobb várható hozamot adja.

## Kockázatmentes eszköz hozzáadása

Vegyünk most hozzá egy $r_f$ hozamú **kockázatmentes eszközt**, például egy lejáratig tartott rövid állampapírt. Volatilitása nulla, és minden kockázatos eszközzel vett kovarianciája is nulla. Fektessük a pénz $y$ hányadát egy P kockázatos portfólióba, $1 - y$ hányadát a kockázatmentes eszközbe. Az előző lecke képletei szerint

$$
\mu = (1-y)\,r_f + y\,\mu_P = r_f + y\,(\mu_P - r_f), \qquad \sigma = y\,\sigma_P \quad (y \ge 0).
$$

A varianciában nincs vegyes tag, mert a kovariancia nulla. Az $y = \sigma/\sigma_P$ kiküszöbölésével a $(0, r_f)$ pontból P-n át húzott egyenest kapjuk:

$$
\mu = r_f + \frac{\mu_P - r_f}{\sigma_P}\,\sigma.
$$

A $(0, r_f)$ és P közötti pontok $r_f$ kamatú betételhelyezést jelentenek ($0 \le y \le 1$). A P-n túli pontok azt, hogy a befektető $r_f$ kamatra hitelt vesz fel, és a saját tőkéjénél többet fektet P-be ($y > 1$); itt feltesszük, hogy ugyanazon a kamaton lehet hitelt felvenni.

## A Sharpe-mutató és az érintési portfólió

Az egyenes meredeksége P **Sharpe-mutatója**:

$$
\text{SR}_P = \frac{\mu_P - r_f}{\sigma_P},
$$

vagyis az $r_f$ feletti többlethozam egységnyi volatilitásra vetítve. Meredekebb egyenes minden volatilitásszinten nagyobb várható hozamot ad, ezért a befektető a legnagyobb Sharpe-mutatójú kockázatos portfóliót keresi. Ha az egyenest a $(0, r_f)$ pont körül felfelé forgatjuk, az utolsó elérhető portfólió, amelyet még eltalál, az a pont, ahol az egyenes érinti a hatékony frontot. Ez a T **érintési portfólió**.

Jelölje $e_i = \mu_i - r_f$ a többlethozamokat. A Sharpe-mutatót a súlyok szerint maximalizálva (a $w_B$ szerinti deriváltat nullával egyenlővé téve) a súlyok arányosak lesznek ezekkel:

$$
w_A \propto \sigma_B^2\, e_A - \sigma_{AB}\, e_B, \qquad w_B \propto \sigma_A^2\, e_B - \sigma_{AB}\, e_A,
$$

úgy skálázva, hogy összegük egy legyen. $N$ eszközre ugyanez $w \propto \Sigma^{-1}(\mu - r_f\mathbf{1})$ alakú, ahol $\Sigma$ a kovarianciamátrix.

## Számpélda

Vegyük a fenti eszközöket $r_f = 2\%$ mellett, így $e_A = 0{,}04$ és $e_B = 0{,}10$:

$$
w_A \propto 0{,}09 \times 0{,}04 - 0{,}009 \times 0{,}10 = 0{,}0027, \qquad w_B \propto 0{,}0225 \times 0{,}10 - 0{,}009 \times 0{,}04 = 0{,}00189.
$$

Normálva $w_B = 0{,}00189 / 0{,}00459 \approx 0{,}412$ és $w_A \approx 0{,}588$. Az érintési portfólióra

$$
\mu_T \approx 0{,}588 \times 6\% + 0{,}412 \times 12\% \approx 8{,}47\%, \qquad \sigma_T = \sqrt{0{,}027405} \approx 16{,}55\%,
$$

a Sharpe-mutató pedig $(8{,}47\% - 2\%)/16{,}55\% \approx 0{,}391$. Ez mindkét eszközt külön-külön felülmúlja: A-é $0{,}04/0{,}15 \approx 0{,}267$, B-é $0{,}10/0{,}30 \approx 0{,}333$.

Az ábra a kéteszközös görbét mutatja $-0{,}5$ és $1{,}5$ közötti B-súlyokra, vagyis a short pozíciókat is beleértve, és a $(0, r_f)$ pontból az érintési portfólión át húzott egyenest. Jelölők mutatják A-t, B-t, a minimális varianciájú és az érintési portfóliót. Növeld az $r_f$-et, és figyeld meg, hogy az érintési pont felfelé csúszik a fronton B felé. Csökkentsd a $\rho$-t, és figyeld meg, hogy a görbe balra tolódik, a kijelzett Sharpe-mutató pedig nő.

*[Interaktív ábra: capital market line](https://quantsandbox.dev/hu/guide/portfolio/efficient-frontier)*

## A tőkepiaci egyenes

Az érintési portfólión átmenő egyenes a **tőkepiaci egyenes** (capital market line, CML):

$$
\mu = r_f + \frac{\mu_T - r_f}{\sigma_T}\,\sigma.
$$

A T pontot kivéve a hatékony front felett halad. Ha van kockázatmentes eszköz, a T-n kívül minden csak kockázatos eszközökből álló portfóliót dominál a CML valamelyik pontja. $\sigma = 20\%$-nál például a CML $2\% + 0{,}391 \times 20\% \approx 9{,}82\%$-ot ad, többet, mint az azonos volatilitású frontportfólió $9{,}58\%$-a.

## Kétalapos szétválasztás

Minden hatékony választás tehát két alap keveréke: a kockázatmentes eszközé és az érintési portfólióé. A befektetők csak az $y$ arányban különböznek, a kockázatos részük összetételében nem. Ez a **kétalapos szétválasztás** (two-fund separation) tétele. Gondolj egy konyhára, amely egyféle levest szolgál fel különböző adagokban, ízlés szerint vízzel hígítva: a recept mindenkinek ugyanaz.

A fenti számokkal egy óvatos befektető, aki $\sigma = 10\%$-ot vállal, $y = 10/16{,}55 \approx 0{,}604$ részt tart T-ben és $0{,}396$ részt a kockázatmentes eszközben, $\mu \approx 5{,}91\%$ várható hozammal. Kockázatmentes eszköz nélkül ez a volatilitás el sem érhető, hiszen a minimum 14,34%. Egy bátrabb befektető, aki $\sigma = 20\%$-ot vállal, $y \approx 1{,}208$-at tart, vagyis tőkéje kb. 20,8%-át $r_f$ kamatra hitelből fedezi, és $\mu \approx 9{,}82\%$-ot vár. Mindketten 58,8 : 41,2 arányban tartják A-t és B-t.

### Kidolgozott példa: Az óvatos befektető pontja a tőkepiaci egyenesen

1. A CML meredeksége az érintési portfólió Sharpe-mutatója.
   $$\text{SR}_T = \frac{8{,}47\% - 2\%}{16{,}55\%}$$ → **0.391**
2. A 10%-os célvolatilitás meghatározza a T-ben tartott hányadot.
   $$y = \frac{10\%}{16{,}55\%}$$ → **0.604**
3. A várható hozamot a CML-ről olvassuk le $\sigma = 10\%$-nál.
   $$\mu = r_f + \text{SR}_T \times 10\%$$ → **5.91%**

## Összefoglalás

- Shortolást megengedve az elérhető portfóliók görbét alkotnak, amelynek a minimális varianciájú portfóliótól felfelé tartó ága a hatékony front.
- Egy P kockázatos portfóliót kockázatmentes eszközzel keverve a $(0, r_f)$ pontból P-n át húzott egyenest kapjuk, amelynek meredeksége a $(\mu_P - r_f)/\sigma_P$ Sharpe-mutató.
- Az érintési portfólió maximalizálja a Sharpe-mutatót; a példában $w_B \approx 0{,}412$, $\mu_T \approx 8{,}47\%$, $\sigma_T \approx 16{,}55\%$, $\text{SR} \approx 0{,}391$.
- A $\mu = r_f + \text{SR}_T\,\sigma$ tőkepiaci egyenes minden más kockázatos portfóliót dominál.
- Kétalapos szétválasztás: minden befektető a kockázatmentes eszközt és az érintési portfóliót tartja, csak eltérő arányban.

> A következő lecke („Kockázatkerülés és az optimális teljes portfólió”) megmutatja, melyik pontot választja egy adott befektető a tőkepiaci egyenesen. Utána a „CAPM, béta és az értékpapír-piaci egyenes” feltételezi, hogy minden befektető így gondolkodik, és levezeti, mit jelent ez az egyes eszközök várható hozamára.

[Építs hatékony frontot sok eszközből a Hatékony front laborban](https://quantsandbox.dev/hu/efficient-frontier)

## Interaktív laborok

- [Hatékony front és Markowitz-optimalizálás](https://quantsandbox.dev/hu/efficient-frontier)
- [Kéteszközös portfólió: diverzifikáció és korreláció](https://quantsandbox.dev/hu/portfolio-lab)

## Gyakorló kérdések

### 1. Egy portfólióra $\mu = 9\%$ és $\sigma = 15\%$, a kockázatmentes kamatláb $r_f = 2\%$. Mekkora a Sharpe-mutatója?

**Válasz:** 0.467

$\text{SR} = (9\% - 2\%)/15\% = 7/15 \approx 0{,}467$.

### 2. Melyik mennyiséget maximalizálja az érintési portfólió az összes kockázatos portfólió közül?

- a) A várható hozamot
- b) A Sharpe-mutatót
- c) A volatilitást
- d) A kockázatosabb eszköz súlyát

**Válasz:** b) A Sharpe-mutatót

Az érintési portfólió ott van, ahol a $(0, r_f)$ pontból húzott legmeredekebb egyenes érinti a frontot, így neki a legnagyobb a $(\mu_P - r_f)/\sigma_P$ meredeksége, vagyis a Sharpe-mutatója.

---

Forrás: https://quantsandbox.dev/hu/guide/portfolio/efficient-frontier

Előző lecke: [Diverzifikáció és korreláció](https://quantsandbox.dev/hu/guide/portfolio/diversification)

Következő lecke: [Kockázatkerülés és az optimális teljes portfólió](https://quantsandbox.dev/hu/guide/portfolio/risk-aversion)
