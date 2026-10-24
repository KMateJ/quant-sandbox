# Nem párhuzamos hozamgörbe-mozgások és kulcskamat-durációk

Párhuzamos eltolás, meredekedés és pillangó; a kulcskamat-durációk mint a kötvény érzékenysége a görbe egyes szakaszaira.

A „Duráció és konvexitás” egyetlen számmal mérte egy kötvény árkockázatát, és ehhez egyetlen hozamot mozgatott. Az „Azonnali kamatok, forward kamatok és a hozamgörbe” megmutatta, hogy nincs egyetlen hozam: minden lejárathoz saját zérókamat tartozik. Ez a lecke azt kérdezi, mi történik egy kötvénnyel, ha a görbe nem párhuzamosan mozdul, és hogyan mérhető külön-külön a görbe egyes szakaszaihoz tartozó kitettség.

A lecke végig évente kamatozó zérókamatokkal számol, egyetlen emelkedő görbéről leolvasva: 1 évre 3,0%, 2 évre 3,4%, 5 évre 3,9%, 10 évre 4,3% és 30 évre 4,6%, a pontok között egyenesekkel. A kötvény pénzáramok $CF_t$ halmaza, és mindegyiket a saját lejáratához tartozó zérókamattal diszkontáljuk.

## Árazás a görbéről

A kötvény ára a zérógörbén a diszkontált pénzáramok összege, mindegyik a saját $z_t$ kamatán:

$$
P = \sum_t \frac{CF_t}{(1+z_t)^t}.
$$

Vegyünk egy 5 éves kötvényt 4%-os éves kuponnal és 100-as névértékkel. Pénzáramai az 1–5. év végén 4, 4, 4, 4 és 104; mindegyiket a zérókamatával diszkontálva $P \approx 100{,}57$. A lejáratig számított hozam az öt zérókamat egyetlen átlaga; az ár megállapításához mind az öt kell.

## A görbemozgás alakjai

A görbék ritkán mozdulnak párhuzamosan. A mozgások nagy részét három egyszerű alak írja le. A **párhuzamos eltolás** minden kamatot ugyanannyival mozgat. A **meredekedés** (steepener) vagy **ellaposodás** (flattener) a meredekséget változtatja: meredekedéskor a rövid kamatok esnek a hosszúakhoz képest, ellaposodáskor emelkednek. A **pillangó** a görbületet változtatja: a görbe közepe a két vég ellen mozdul.

Az ábra pontosan a hozamgörbe-labor alakjait használja. Egy $+50$ bázispontos meredekedés az 1 éves kamatot mintegy 38 bázisponttal, az 5 évest körülbelül 16-tal, a 30 évest kevesebb mint 3 bázisponttal csökkenti: a rövid vég mozog.

## Kulcskamat-durációk

Egyetlen duráció nem mondja meg, a görbe melyik pontján van a kockázat. A **kulcskamat-duráció** igen. Válasszunk kulcslejáratokat, itt 2, 5, 10 és 30 évet. Minden kulcskamatot mozdítsunk el egy kis $\Delta y$ értékkel, a szomszédos zérókamatok kövessék lineárisan, a szomszédos kulcslejáratnál nullára csökkenve, és jegyezzük fel a relatív árváltozást:

$$
\text{KRD}_k = -\frac{1}{P}\,\frac{\Delta P}{\Delta y_k}.
$$

A súlyokat úgy építjük fel, hogy minden lejáratnál a kulcskamatok részesedései egyet adjanak. Az összes kulcskamat együttes mozgatása így egy párhuzamos eltolás, és a kulcskamat-durációk összege a zérógörbe párhuzamos mozgásával szembeni durációt adja:

$$
\sum_k \text{KRD}_k = D.
$$

Az 5 éves kötvény durációja 4,46 év. Ez így oszlik meg: $\text{KRD}_{2} = 0{,}22$, $\text{KRD}_{5} = 4{,}23$, a 10 és 30 éves kulcsnál nulla. A kockázat szinte teljesen az 5 éves pontra esik, ahogy kell, hiszen a kötvénynek nincs pénzárama az 5. év után. A görbe bármely más szakaszának mozgása alig érinti az árát.

## Bullet és barbell

Két portfólió lehet azonos árú és azonos durációjú, mégis másképp viselkedhet. Hasonlítsuk össze az 5 éves kötvényt, a **bulletet** egy **barbellel**, vagyis két zérókuponos kötvénnyel, az egyik 2, a másik 30 év múlva jár le, úgy súlyozva, hogy ára és durációja egyezzen a bulletével. A barbell értékének körülbelül 91%-a a rövid, 9%-a a hosszú zéróban van.

Mindkettő durációja 4,46 év, tehát a „Duráció és konvexitás” nem tudja megkülönböztetni őket. A kulcskamat-durációk igen: a bullet 4,23 az 5 éves kulcsnál, a barbell 1,75 a 2 éves és 2,70 a 30 éves kulcsnál, köztük semmi. $+50$ bázispontos párhuzamos mozgásnál a bullet 2,20%-ot, a barbell 2,13%-ot veszít; a kis különbség a barbell nagyobb konvexitása, amit az „Immunizáció és durációillesztés” tárgyalt. $+50$ bázispontos meredekedésnél a bullet 0,74%-ot, a barbell csak 0,59%-ot nyer, ellaposodásnál a bullet 0,74%-ot veszít a barbell 0,58%-ával szemben. A pillangónál, amely a görbe közepét emeli, a bullet 0,59%-ot, a barbell 0,32%-ot veszít. Az egyetlen duráció elrejti ezeket a különbségeket, a kulcskamat-durációk megmagyarázzák őket.

*[Interaktív ábra: key rate shocks](https://quantsandbox.dev/hu/guide/fixed-income/curve-risk)*

Az ábrán válassz alakot és méretet. A felső grafikon a zérógörbét mutatja a sokk előtt és után, az alsó a bullet és a barbell kulcskamat-durációit. A kijelzők az egyes portfóliók árváltozását és a bullet kulcskamat-durációinak összegét adják.

## A számok használata

A kulcskamat-durációk lehetővé teszik, hogy a kockázatkezelő pontosan fogalmazza meg a piaci várakozását. Aki a görbe meredekedésére számít, megválaszthatja, mely kulcskamatoknak legyen kitéve a portfólió. Fedezéskor olyan eszközöket választ, amelyek kulcskamat-durációi minden kulcspontban kioltják a portfólióét, nem csak az összeget illesztik. Ennek az ára, hogy az eredmény a választott kulcspontoktól és a sokk kulcspontok közötti elosztásától függ, így a kulcskamat-durációk a görbe egy bizonyos felbontását írják le, nem természeti törvényt.

### Kidolgozott példa: Az 5 éves kötvény árváltozása +50 bázispontos meredekedésben

1. A 4, 4, 4, 4, 104 pénzáramok árazása a görbéről.
   $$P = \sum_t \frac{CF_t}{(1+z_t)^t}$$ → **100.57**
2. A meredekedés ennyivel csökkenti a 2 éves zérókamatot (bázispontban).
   $$\Delta z_2$$ → **-29.12**
3. Ennyivel csökkenti az 5 éves zérókamatot (bázispontban).
   $$\Delta z_5$$ → **-15.84**
4. A kötvény kulcskamat-durációi a 2 és 5 éves pontnál.
   $$\text{KRD}_2,\ \text{KRD}_5 = 0{,}22,\ 4{,}23$$
5. Elsőrendű árváltozás százalékban: a kulcskamat-durációk szorozva a kamatesésekkel.
   $$\frac{\Delta P}{P} \approx -\sum_k \text{KRD}_k\,\Delta z_k$$ → **0.73%**
6. A sokkolt görbéről újraárazva 0,74%: a kis eltérés a konvexitás.
   $$\frac{P_{\text{sokk}}}{P} - 1$$ → **0.74%**

## Összefoglalás

- A kötvényt a teljes zérógörbéről árazzuk: $P = \sum_t CF_t/(1+z_t)^t$.
- A görbemozgásoknak alakjuk van: párhuzamos eltolás, meredekedés, ellaposodás és pillangó.
- A kulcskamat-durációk az egyes kulcslejáratokhoz tartozó árérzékenységet mérik; összegük a párhuzamos eltolással szembeni duráció.
- Az azonos ár és duráció nem jelent azonos kockázatot: a bullet és a barbell kulcskamat-durációi különböznek, és nem párhuzamos mozgásokra másképp reagálnak.
- A kulcskamat-durációk a választott kulcspontoktól és a sokk kulcspontok közötti elosztásától függnek.

> Egy későbbi lecke, a „Kötvényfutures és a legolcsóbban szállítható kötvény”, egy kötvénykosárra szóló szerződést árazza, ahol a görbe szintje és meredeksége dönti el, melyik kötvényt szállítják.

[Nyisd meg a Hozamgörbe labort, és sokkold magad a görbét](https://quantsandbox.dev/hu/yield-curve)

## Interaktív laborok

- [Hozamgörbe-bootstrapping, spot és forward kamatlábak](https://quantsandbox.dev/hu/yield-curve)
- [Kötvény durációja és konvexitása: közelítések](https://quantsandbox.dev/hu/duration-convexity)

## Gyakorló kérdések

### 1. Egy portfólió kulcskamat-durációi a 2, 5, 10 és 30 éves pontnál 0,30, 1,10, 2,40 és 0,90 év. Mekkora a durációja a görbe párhuzamos eltolásával szemben?

**Válasz:** 4.7 év

A kulcskamat-durációk összege a párhuzamos eltolással szembeni durációt adja: $0{,}30 + 1{,}10 + 2{,}40 + 0{,}90 = 4{,}70$ év.

### 2. Egy bullet és egy barbell ára és durációja azonos. Csak az 5 éves kamat emelkedik 10 bázisponttal, a 2 és 30 éves kamat változatlan. Melyik veszít többet?

- a) Az 5 éves bullet
- b) A 2/30 éves barbell
- c) Ugyanannyit, mert a durációjuk egyenlő

**Válasz:** a) Az 5 éves bullet

A bullet durációja az 5 éves pontnál van (kulcskamat-duráció 4,23), a barbellnek nincs kitettsége erre a kamatra. A bullet nagyjából $4{,}23 \times 0{,}10\% \approx 0{,}42\%$-ot veszít, a barbell szinte semmit.

---

Forrás: https://quantsandbox.dev/hu/guide/fixed-income/curve-risk

Előző lecke: [Azonnali kamatok, forward kamatok és a hozamgörbe](https://quantsandbox.dev/hu/guide/fixed-income/yield-curve)

Következő lecke: [Kötvényfutures és a legolcsóbban szállítható kötvény](https://quantsandbox.dev/hu/guide/fixed-income/treasury-futures)
