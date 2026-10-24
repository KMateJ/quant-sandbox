# Hitelkockázat: csődvalószínűség és hitelfelár

Csődintenzitás, túlélési valószínűség, megtérülési ráta, kockázatos kötvények árazása és a CDS-felár.

A pálya eddigi kötvényei mind pontosan azt fizették, amit ígértek. Egy vállalat azonban, szemben a saját devizájában eladósodó állammal, fizetésképtelenné válhat. Ez a lecke ezt a kockázatot egyetlen évre vetített számmal, a csődintenzitással modellezi, beárazza a csődbe menni képes zérókupon-kötvényt, és megmutatja, honnan ered a vállalati kötvények többlethozama, a hitelfelár. A „Kamat, kamatozás és diszkontálás” diszkontálására, a „Kötvényárak és hozamok” hozamaira és az „Azonnali kamatok, forward kamatok és a hozamgörbe” folytonos zérókupon-hozamaira épít, a végén pedig a credit default swapot (CDS) tárgyalja, amely a „Kamatswapok” szerződéseinek közeli rokona.

## Csőd és a csőd időpontja

A kibocsátó **csődbe megy** (nem teljesít), ha elmulaszt egy esedékes fizetést. A csődöt egy véletlen **csődidőponttal**, $\tau$-val írjuk le: ekkor válik a kibocsátó fizetésképtelenné. Ha $\tau > T$, a kibocsátó $T$-ben még fizet, és a $T$-ben lejáró kötvényt teljes egészében visszafizeti. Ha $\tau \le T$, a kötvényt nem fizeti vissza teljesen.

A modell három feltevésen nyugszik: a kockázatmentes $r$ kamatláb állandó és folytonos kamatozású; a csőd független a kamatlábaktól; és egyetlen paraméter, a csődintenzitás írja le, mennyire valószínű a csőd.

## Csődintenzitás és túlélési valószínűség

A **csődintenzitás** (angolul hazard rate) $\lambda$ az egységnyi időre jutó csődvalószínűség, feltéve, hogy a kibocsátó addig nem ment csődbe. Egy rövid $dt$ időszakra

$$
\mathbb{P}(t < \tau \le t + dt \mid \tau > t) = \lambda\,dt.
$$

Legyen $Q(t) = \mathbb{P}(\tau > t)$ a $t$-ig vett **túlélési valószínűség**. Ahhoz, hogy a kibocsátó $t + dt$-ig fennmaradjon, $t$-ig túl kell élnie, majd a következő $dt$ alatt sem mehet csődbe:

$$
Q(t + dt) = Q(t)\,(1 - \lambda\,dt) \quad\Longrightarrow\quad \frac{dQ}{dt} = -\lambda\,Q(t), \qquad Q(0) = 1.
$$

Állandó $\lambda$ mellett a megoldás exponenciális, a **kumulatív csődvalószínűség** pedig ennek komplementere:

$$
Q(T) = e^{-\lambda T}, \qquad \mathbb{P}(\tau \le T) = 1 - e^{-\lambda T}.
$$

Ez ugyanaz az algebra, mint a folytonos diszkontálásnál: a túlélés $\lambda$ ütemben csökken, ahogy a diszkontfaktor $r$ ütemben. Jó kép erre egy emlékezet nélküli izzó: bármilyen régóta ég, a következő órában ugyanakkora eséllyel ég ki. Kis $\lambda T$ esetén $1 - e^{-\lambda T} \approx \lambda T$, így a 2%-os csődintenzitás nagyjából évi 2% csődesélyt jelent.

## Megtérülés és csőd esetén elszenvedett veszteség

A csőd ritkán teszi teljesen értéktelenné a kötvényt. A hitelezők a kibocsátó megmaradt vagyonából általában visszakapják követelésük egy részét. A **megtérülési ráta** $R$ a névérték visszakapott hányada, $1 - R$ pedig a **csőd esetén elszenvedett veszteség** (loss given default). Elsőbbségi, fedezetlen vállalati kötvényeknél a megtérülés gyakran 40% körül van, ezért szokásos kiinduló érték az $R = 40\%$.

Meg kell mondanunk, mikor fizetik ki a megtérülést. Feltesszük, hogy **a névérték $R$ hányadát lejáratkor fizetik**: ha a kibocsátó $T$ előtt csődbe megy, a tulajdonos névértékegységenként $R$-et kap $T$-ben. Így a kifizetés egyetlen időpontra esik, és az ár könnyen felírható.

## Csődkockázatos zérókupon-kötvény árazása

Egy 1 névértékű, $T$-ben lejáró kockázatos zérókupon-kötvény 1-et fizet, ha $\tau > T$, és $R$-et, ha $\tau \le T$. Mint minden árazási feladatban, az ár a diszkontált várható kifizetés olyan valószínűségekkel, amelyek mellett az árak konzisztensek (a „Kockázatsemleges valószínűségek” kockázatsemleges valószínűségei; erről lentebb még lesz szó). Mivel a csőd független a kamatlábaktól, az $e^{-rT}$ diszkontfaktor kiemelhető a várható értékből:

$$
P_{\text{kock}} = e^{-rT}\Big[\,Q(T)\cdot 1 + \big(1 - Q(T)\big)\cdot R\,\Big] = e^{-rT}\Big[e^{-\lambda T} + \big(1 - e^{-\lambda T}\big)R\Big].
$$

Két ellenőrzés: $\lambda = 0$ mellett a kötvény sosem megy csődbe, és az ár a kockázatmentes $e^{-rT}$; $R = 1$ mellett a csőd semmibe sem kerül, és az ár ismét $e^{-rT}$.

## Hitelfelár

A kockázatos zérókupon-kötvény folytonos hozamát pontosan úgy definiáljuk, mint az „Azonnali kamatok, forward kamatok és a hozamgörbe” leckében: $y = -\ln P_{\text{kock}}/T$. A **hitelfelár** a kockázatmentes kamat feletti többlethozam:

$$
s(T) = y - r = -\frac{1}{T}\ln\Big[e^{-\lambda T} + \big(1 - e^{-\lambda T}\big)R\Big] = -\frac{1}{T}\ln\Big[1 - (1 - R)\big(1 - e^{-\lambda T}\big)\Big].
$$

A kockázatmentes kamat kiesett: e feltevések mellett a felár csak $\lambda$-tól, $R$-től és $T$-től függ. Ha $R = 0$, a zárójelben $e^{-\lambda T}$ áll, és a felár pontosan $\lambda$.

## A hitelháromszög

Kis $\lambda T$ esetén használjuk az $1 - e^{-\lambda T} \approx \lambda T$ és a kis $x$-re érvényes $\ln(1 - x) \approx -x$ közelítést:

$$
s(T) \approx -\frac{1}{T}\ln\big[1 - (1 - R)\lambda T\big] \approx \frac{(1 - R)\lambda T}{T} = \lambda\,(1 - R).
$$

Ez a **hitelháromszög** (credit triangle): felár, csődintenzitás és veszteségráta, amelyek közül bármely kettő megadja a harmadikat. Szavakkal: a felár az évi várható veszteséget fizeti meg, vagyis az évi csődesély és az elveszett hányad szorzatát. A közelítés jó, ha $\lambda T$ kicsi (néhány százalék), és pontos, ha $R = 0$; nagy csődintenzitásnál vagy hosszú lejáratnál a pontos felár $\lambda(1 - R)$ alá esik.

> Hitelháromszög: $s \approx \lambda\,(1 - R)$. A felár a várható veszteségráta: csődintenzitás szorozva a csőd esetén elszenvedett veszteséggel.

## Számpélda

Legyen $\lambda = 2\%$, $R = 40\%$, $r = 3\%$ és $T = 5$ év.

### Kidolgozott példa: Egy ötéves kockázatos zérókupon-kötvény ára és hitelfelára

1. Túlélési valószínűség öt évre.
   $$Q(5) = e^{-0{,}02 \cdot 5} = e^{-0{,}1}$$ → **0.9048**
2. Csődvalószínűség az öt év alatt, százalékban.
   $$1 - Q(5)$$ → **9.52%**
3. Ár névértékegységenként: túléléskor 1, csődkor $R = 0{,}4$ a kifizetés lejáratkor; a diszkontfaktor $e^{-0{,}15} \approx 0{,}8607$, a kockázatmentes ár.
   $$P_{\text{kock}} = e^{-0{,}15}\,\big[Q(5) + (1 - Q(5)) \cdot 0{,}4\big]$$ → **0.8116**
4. A kockázatos zérókupon-kötvény folytonos hozama.
   $$y = -\ln P_{\text{kock}}/5$$ → **4.176%**
5. Hitelfelár a 3%-os kockázatmentes kamat fölött; bázispontban körülbelül 118.
   $$s(5) = y - r$$ → **1.176%**
6. A hitelháromszög, amely körülbelül 2,4 bázisponttal tér el a pontos felártól.
   $$\lambda(1 - R) = 0{,}02 \cdot 0{,}6$$ → **1.2%**

Ha viszont $\lambda = 10\%$, az 5 éves pontos felár nagyjából 5,39%, a háromszög pedig 6%-ot ad: $\lambda T$ növekedésével a közelítés romlik.

## A felár és a lejárat

Az ábrán csúszkával állítható a $\lambda$ csődintenzitás (0–10%, alapérték 2%), az $R$ megtérülési ráta (0–80%, alapérték 40%) és az $r$ kockázatmentes kamat (0–8%, alapérték 3%). A grafikon a kockázatmentes és a kockázatos zérókupon-hozamot mutatja a lejárat függvényében, 0,25 és 10 év között. A kijelzők az 5 éves túlélési valószínűséget, az 5 éves hitelfelárat, a $\lambda(1 - R)$ CDS-díjat és az 5 éves kockázatos zérókupon-kötvény árát mutatják; alapbeállításnál ezek 90,48%, 1,18%, 1,20% és 0,8116. Told $R$-et a maximumra, és figyeld, ahogy a rés szűkül; 100%-os megtérülésnél (a képlet határesete) a felár teljesen eltűnne. Növeld $\lambda$-t, és a kockázatos görbe felfelé tolódik. Figyeld meg azt is, hogy állandó $\lambda$ mellett a felár a lejárattól szinte független, csak hosszú lejáratnál csökken kicsit, ahol $\lambda T$ már nem kicsi.

*[Interaktív ábra: credit spread](https://quantsandbox.dev/hu/guide/fixed-income/credit-risk)*

## Kockázatsemleges és historikus csődvalószínűség

A háromszöget visszafelé olvasva egy piaci $s$ felárból és egy feltételezett $R$ megtérülésből a $\lambda = s/(1 - R)$ implikált csődintenzitás adódik. Ez **kockázatsemleges** csődintenzitás: az, amelyikkel a képlet visszaadja a piaci árakat. Jellemzően jóval magasabb a hasonló kibocsátóknál megfigyelt **historikus** csődgyakoriságnál. A felár ugyanis nemcsak a várható veszteséget tartalmazza: a befektetők prémiumot kérnek a csődkockázat viseléséért, mert a csődök jellemzően akkor halmozódnak, amikor mindenkinek rosszul megy, és azért is, mert ezeket a kötvényeket nehezebb eladni, mint az állampapírokat (likviditási prémium). Árazáshoz és fedezéshez az implikált $\lambda$ kell, a tényleges veszteségek előrejelzéséhez a historikus gyakoriság.

## Credit default swap (CDS)

A **credit default swap** (CDS) egy referencia-kibocsátó csődje elleni biztosítás. A **védelem vevője** évente rögzített $s_{\text{CDS}}$ díjat fizet egy névleges összeg után a lejáratig vagy a csődig, amelyik előbb bekövetkezik. Csőd esetén a **védelem eladója** névleges egységenként $1 - R$-et fizet. Ahogy a „Kamatswapok” swapjainál, a méltányos díj a két láb jelenértékét teszi egyenlővé. Folytonos díjfizetéssel, állandó $\lambda$-val és $r$-rel, és ha a védelmet a csőd pillanatában fizetik ki:

$$
s_{\text{CDS}}\int_0^T e^{-(r+\lambda)t}\,dt = (1 - R)\int_0^T \lambda\,e^{-(r+\lambda)t}\,dt \quad\Longrightarrow\quad s_{\text{CDS}} = \lambda\,(1 - R).
$$

Itt $e^{-\lambda t}$ annak valószínűsége, hogy $t$-ben még fizetik a díjat, $\lambda e^{-\lambda t}\,dt$ pedig annak, hogy a csőd a $[t, t + dt]$ intervallumba esik. Ebben a keretben a háromszög a CDS-re pontosan teljesül; a példa kötvényének 1,176%-os felára azért tér el kissé, mert ott a megtérülést lejáratkor fizetik, nem a csőd pillanatában. A gyakorlatban több lejáratra jegyzett CDS-díjakból lejáratonként, egymás után haladva (bootstrapping) építik fel a csődintenzitások lejárati szerkezetét, ahogy az azonnali kamatokat is a kötvényárakból nyertük ki.

## Összefoglalás

- A $\lambda$ csődintenzitás a túlélés feltétele melletti, egységnyi időre jutó csődvalószínűség; állandó $\lambda$ mellett a túlélési valószínűség $e^{-\lambda T}$.
- Ha a névérték $R$ hányadát lejáratkor fizetik meg, $P_{\text{kock}} = e^{-rT}[e^{-\lambda T} + (1 - e^{-\lambda T})R]$.
- A hitelfelár közelítőleg $\lambda(1 - R)$, ami kis $\lambda T$ mellett pontos; $\lambda = 2\%$, $R = 40\%$ esetén az 5 éves felár 1,176%, szemben az 1,20%-kal.
- Az implikált (kockázatsemleges) csődintenzitás meghaladja a historikus csődgyakoriságot, mert a felár kockázati és likviditási prémiumot is tartalmaz.
- A CDS egy díjat cserél csőd esetén fizetett $1 - R$ összegre; méltányos díja körülbelül $\lambda(1 - R)$.

[Árazz kötvényeket és hasonlíts össze hozamokat a Kötvényárazás laborban](https://quantsandbox.dev/hu/bond-pricing)

## Interaktív laborok

- [Kötvényárazó kalkulátor és ár–hozam görbe](https://quantsandbox.dev/hu/bond-pricing)
- [Hozamgörbe-bootstrapping, spot és forward kamatlábak](https://quantsandbox.dev/hu/yield-curve)

## Gyakorló kérdések

### 1. Egy kötvény hitelfelára 150 bázispont. 40%-os megtérülési rátát feltételezve mekkora csődintenzitást ad a hitelháromszög? A választ évi százalékban add meg.

**Válasz:** 2.5%

$\lambda \approx s/(1 - R) = 1{,}5\%/0{,}6 = 2{,}5\%$ évente. Öt évre ez $1 - e^{-0{,}125} \approx 11{,}75\%$ csődvalószínűséget jelent.

### 2. A piaci felárakból implikált csődintenzitás általában jóval magasabb a hasonló kibocsátók historikus csődgyakoriságánál. Miért?

- a) A historikus adatok mindig kevesebb csődöt rögzítenek.
- b) A felár a csődkockázat viseléséért és a gyengébb likviditásért is fizet a befektetőknek.
- c) A hitelháromszög $R > 0$ esetén mindig túlbecsüli $\lambda$-t.
- d) A kockázatsemleges valószínűségek nem veszik figyelembe a megtérülést.

**Válasz:** b) A felár a csődkockázat viseléséért és a gyengébb likviditásért is fizet a befektetőknek.

A felár a várható veszteségen felül kockázati prémiumot (a csődök rossz időkben halmozódnak) és likviditási prémiumot is tartalmaz. Ha a teljes felárat osztjuk $1 - R$-rel, a historikus csődgyakoriságnál nagyobb, kockázatsemleges $\lambda$-t kapunk.

---

Forrás: https://quantsandbox.dev/hu/guide/fixed-income/credit-risk

Előző lecke: [Visszahívható kötvények és negatív konvexitás](https://quantsandbox.dev/hu/guide/fixed-income/callable-bonds)

Következő lecke: [Reálkamat, infláció és inflációkövető kötvények](https://quantsandbox.dev/hu/guide/fixed-income/real-rates-inflation)
