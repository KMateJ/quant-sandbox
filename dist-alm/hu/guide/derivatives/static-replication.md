# Statikus replikáció: Breeden–Litzenberger és Carr–Madan

Kockázatsemleges sűrűség a call árakból, és tetszőleges kifizetés felépítése kötvényből, forwardból és opciókból.

Az előző leckék egy modellen belül árazták az opciókat: binomiális fában, geometriai Brown-mozgással, sztochasztikus varianciával. Ez a lecke fordítva halad. A piacon jegyzett call-árakból indul ki, és azt kérdezi, mit árulnak el ezek modell nélkül. Két eredmény ad választ. A Breeden–Litzenberger-formula a call-árakból olvassa ki $S_T$ kockázatsemleges eloszlását, a Carr–Madan-felbontás pedig bármely európai kifizetést kötvényekből, határidős ügyletből és opciókból rak össze. Mindkettő a „Pozíciók kombinálása” lecke utolsó szakaszát viszi tovább, és a „Kockázatsemleges valószínűségek” lecke árazási szabályát használja.

## Az ár mint diszkontált várható érték

Egy **európai kifizetés** csak a $T$ lejáratkor esedékes, és csak az akkori árfolyamtól függ: $X = f(S_T)$. Ilyen a call, a put, a határidős ügylet és a pillangó is. A „Kockázatsemleges valószínűségek” lecke szabálya szerint a mai ára a $\mathbb{Q}$ szerinti diszkontált várható érték. Tegyük fel, hogy $S_T$-nek $\mathbb{Q}$ alatt van egy $q(K)$ **kockázatsemleges sűrűségfüggvénye**, azaz $\mathbb{Q}(a < S_T < b) = \int_a^b q(K)\,dK$. Ekkor

$$
V_0 = e^{-rT}\,\mathbb{E}^{\mathbb{Q}}[f(S_T)] = e^{-rT}\int_0^{\infty} f(K)\,q(K)\,dK.
$$

Az integrálási változót szándékosan hívjuk $K$-nak: $S_T$ lehetséges értékein fut végig, és ezeket kötési árakkal fogjuk párba állítani. Ha ismernénk $q$-t, minden európai kifizetés árát egyetlen integrál adná meg. A kérdés az, honnan vesszük $q$-t.

## A pillangó és a sűrűség

Vegyünk három azonos lejáratú callt $K - h$, $K$ és $K + h$ kötési árral, és jelölje $C(K)$ a $K$ kötési árú call mai árát. A „Pozíciók kombinálása” lecke pillangója vesz egy $K-h$-s callt, elad két $K$-s callt és vesz egy $K+h$-s callt. Kifizetése egy $K$ körüli, $h$ magasságú sátor, amely a $(K-h, K+h)$ intervallumon kívül nulla. Osszuk el a pozíciót $h^2$-tel: a sátor magassága $1/h$, alapja $2h$, a területe tehát 1.

Ahogy $h$ csökken, a sátor egy 1 területű keskeny tüskévé válik $K$-ban. Várható kifizetése közelítőleg $q(K)$ és a terület szorzata, így a $q(K)$ sűrűséghez tart. A skálázott pillangót a fenti képlettel árazva

$$
\frac{C(K-h) - 2C(K) + C(K+h)}{h^2} \;\longrightarrow\; e^{-rT}\,q(K) \qquad (h \to 0).
$$

A bal oldal a második deriváltat közelítő centrális differencia, a határérték tehát $\partial^2 C/\partial K^2$.

## A Breeden–Litzenberger-formula

Ugyanez az eredmény a call-ár közvetlen deriválásával is kijön. Írjuk fel a call árát a sűrűséggel:

$$
C(K) = e^{-rT}\int_K^{\infty} (s - K)\,q(s)\,ds.
$$

Deriváljunk $K$ szerint. Az integrandus az $s = K$ alsó határon nulla, így csak $(s - K)$ deriváltja marad:

$$
\frac{\partial C}{\partial K} = -e^{-rT}\int_K^{\infty} q(s)\,ds = -e^{-rT}\,\mathbb{Q}(S_T > K).
$$

A call-ár kötési ár szerinti meredeksége tehát a lehívás diszkontált valószínűségének ellentettje. Még egyszer deriválva eltűnik az integrál:

$$
\frac{\partial^2 C}{\partial K^2} = e^{-rT}\,q(K) \quad\Longleftrightarrow\quad q(K) = e^{rT}\,\frac{\partial^2 C}{\partial K^2}.
$$

> **Breeden–Litzenberger:** $S_T$ kockázatsemleges sűrűsége $q(K) = e^{rT}\,\partial^2 C/\partial K^2$. Közvetlenül a különböző kötési árú call-árakból olvasható ki, az árfolyam mozgására vonatkozó modell nélkül.

## Az implikált sűrűség és a ferdeség

„A Black–Scholes-képlet” leckében egyetlen $\sigma$ adja az összes call-árat, és a belőlük kiolvasott sűrűség a geometriai Brown-mozgás lognormális sűrűsége. Az „Implikált volatilitás és a volatilitás-mosoly” lecke megmutatta, hogy a piac minden kötési árhoz más implikált volatilitást jegyez, jellemzően magasabbat az alacsony kötési áraknál. Ha ilyen árakat teszünk a Breeden–Litzenberger-formulába, a sűrűség már nem lognormális: a drágább alacsony kötési árú opciók nagy esések nagyobb kockázatsemleges valószínűségét jelentik, vagyis a bal oldali szél vastagabb.

Egy példa: $S_0 = 100$, $r = 5\%$, $T = 1$ és állandó $\sigma = 20\%$ mellett $\mathbb{Q}(S_T < 80)$ körülbelül 10,0%. Ha viszont az implikált volatilitás $\sigma(K) = 0{,}2 - 0{,}2\ln(K/F)$, ahol $F = S_0e^{rT}$ a határidős árfolyam, akkor az árakból kiolvasott sűrűség körülbelül 11,9%-ot ad.

Az ábrán $S_0 = 100$, $r = 5\%$ és $T = 1$ rögzített. A csúszkák a $\sigma$ volatilitást, egy ferdeséget (az implikált volatilitás $\ln(K/F)$-ben lineárisan változik; 0 az állandó volatilitású Black–Scholes-eset), valamint egy pillangó $K$ középpontját és $h$ félszélességét állítják. A grafikon a call-árakból kiolvasott $q(K)$ sűrűséget mutatja; nem nulla ferdeségnél összehasonlításként az állandó volatilitású modell lognormális sűrűsége is látszik. A kijelzők a $h^2$-tel osztott pillangóárat, az általa közelített pontos $e^{-rT}q(K)$ értéket és a teljes $\int q\,dK$ tömeget mutatják, amely 1 közelében marad. Csökkentsd $h$-t, és figyeld, ahogy a pillangó a sűrűség értékéhez közelít; utána állíts negatív ferdeséget, és nézd, ahogy a bal oldali szél megvastagszik.

*[Interaktív ábra: bl density](https://quantsandbox.dev/hu/guide/derivatives/static-replication)*

$\sigma = 20\%$, nulla ferdeség és 100-as középpont mellett a pontos érték $e^{-rT}q(100) \approx 0{,}01876$. A $h = 5$ félszélességű pillangó 0,01867-et, a $h = 1$-es 0,01876-ot ad.

## A kifeszítési (spanning) képlet

A Breeden–Litzenberger-formula call-árakból sűrűséget készít. A Carr–Madan-felbontás a fordítottját teszi: egy kifizetést opciók kifizetéseinek kombinációjaként ír fel. Legyen $f$ kétszer differenciálható, és rögzítsünk egy tetszőleges $a > 0$ szintet, a horgonyt. Az integrál alakú maradéktagos Taylor-formula (egyetlen parciális integrálás) $S > a$ esetén ezt adja:

$$
f(S) = f(a) + f'(a)(S - a) + \int_a^S f''(K)\,(S - K)\,dK.
$$

Ha $S > a$, az integrálon belül $(S - K)$ pozitív, $K > S$ esetén pedig $(S-K)^+ = 0$, így az integrál egyenlő $\int_a^{\infty} f''(K)(S-K)^+\,dK$-val. Az $S < a$ eset ennek tükörképe, és putokat ad. A két eset együtt:

$$
f(S) = f(a) + f'(a)(S - a) + \int_0^a f''(K)\,(K - S)^+\,dK + \int_a^{\infty} f''(K)\,(S - K)^+\,dK.
$$

Tagonként olvasva: $f(a)$ darab zérókuponos kötvény, $f'(a)$ darab $a$ szállítási árú határidős ügylet, és minden $K$ kötési árnál $f''(K)\,dK$ mennyiségű opció, a horgony alatt put, fölötte call. Mindkét oldal árát véve, $P(K)$-val jelölve a put árát:

$$
V_0 = e^{-rT}f(a) + e^{-rT}f'(a)(F - a) + \int_0^a f''(K)\,P(K)\,dK + \int_a^{\infty} f''(K)\,C(K)\,dK.
$$

Az $a = F$ választásnál a határidős ügylet semmibe sem kerül, és a portfólió minden opciója pénzen kívüli: $F$ alatt putok, fölötte callok. A varianciaswap mögötti log-szerződést pontosan így lehet replikálni, $f''(K) = 1/K^2$ súlyokkal.

## Szakaszonként lineáris kifizetések

Ha $f$ egyenes szakaszokból áll, $f''$ a töréspontokon kívül mindenhol nulla. Egy $K_i$ töréspontban a meredekség $c_i$-vel ugrik (utána mínusz előtte), és $f''$ ott egy $c_i$ nagyságú pontszerű tömegként viselkedik. Az integrálok összegekké válnak, a portfólió véges sok opciót tartalmaz, minden töréspontban $c_i$ darabot. Az $a = 0$ választásnál nincs put, és visszakapjuk a „Pozíciók kombinálása” lecke kötvény-részvény-call receptjét; ha $a$ az utolsó töréspont fölött van, csak putok maradnak.

> **Carr–Madan:** tetszőleges $a$ horgonyra egy kifizetés $f(a)$ kötvény, $f'(a)$ darab $a$ árú határidős ügylet, $a$ alatt putok és fölötte callok, a $K$ kötési árnál $f''(K)\,dK$ opcióval. Minden $a$ ugyanazt fizeti $T$-ben, ezért arbitrázsmentes piacon mindegyik ugyanannyiba kerül.

## Számpélda

Vegyük azt a kifizetést, amely 90 alatt 0, 90 és 100 között 1-es meredekséggel nő, 100 fölött pedig 10. Töréspontjai 90-nél ($+1$ meredekségváltozás) és 100-nál ($-1$) vannak. Legyen $S_0 = 100$, $r = 5\%$, $T = 1$, és számoljunk $\sigma = 20\%$-os Black–Scholes-árakkal, így $F = 100e^{0{,}05} \approx 105{,}13$.

- Callokkal ($a = 0$): $f(0) = 0$ és $f'(0) = 0$, tehát egy vett 90-es és egy eladott 100-as call, vagyis bull call spread. Ára $16{,}70 - 10{,}45 = 6{,}25$.
- $F$ körül ($a = F$): $f(F) = 10$ és $f'(F) = 0$; mindkét töréspont $F$ alatt van, ezért putok lesznek belőlük. 10 kötvény, egy vett 90-es put és egy eladott 100-as put. Ára $10 \cdot 0{,}9512 + 2{,}31 - 5{,}57 = 6{,}25$.

Ellenőrizzük a második portfóliót $S_T = 95$-nél: $10 + 0 - 5 = 5$, épp a célérték. A két portfólió minden $S_T$-re ugyanannyit fizet, ezért az áruk is azonos; ez az egyezés a töréspontonként alkalmazott put–call paritás. Egy $F$ fölötti töréspontot callal replikáltunk volna.

### Kidolgozott példa: Egy bull spread replikálása a határidős ár körül

1. Cél: a 100/110-es bull call spread, 100 és 110 között 1-es meredekséggel. Ugyanaz a piac, így $F \approx 105{,}13$. Az $a = F$ horgonynál a kifizetés
   $$f(F) = F - 100$$ → **5.13**
2. Tartsunk $f(F)$ zérókuponos kötvényt és $f'(F) = 1$ darab $F$ szállítási árú határidős ügyletet, amely ingyenes. A kötvények ára
   $$e^{-rT}f(F)$$ → **4.88**
3. A 100-as töréspont $F$ alatt van ($+1$ meredekségváltozás), ezért veszünk egy 100-as putot:
   $$P(100)$$ → **5.57**
4. A 110-es töréspont $F$ fölött van ($-1$ meredekségváltozás), ezért eladunk egy 110-es callt:
   $$C(110)$$ → **6.04**
5. Az $F$ körüli portfólió teljes költsége:
   $$4{,}88 + 5{,}57 - 6{,}04$$ → **4.41**
6. Megegyezik a csak callokból álló ($a = 0$) recepttel, ahogy kell:
   $$C(100) - C(110) = 10{,}45 - 6{,}04$$ → **4.41**

## Véges sok kötési ár

Tőzsdén csak egy rácson, például ötösével jegyeznek kötési árakat. A rácspontok közé eső töréspontú vagy görbe szakaszokat tartalmazó kifizetés ezért csak közelítőleg replikálható: a portfólió $f$-nek a szomszédos kötési árak közötti lineáris interpolációját követi. Ugyanez a korlát érinti a sűrűséget is, mert $\partial^2 C/\partial K^2$-t véges sok árból kell becsülni, és a szélek, ahol kevés kötési árat jegyeznek, a legkevésbé megbízhatók.

## Összefoglalás

- Egy $f(S_T)$ európai kifizetés ára $e^{-rT}\int f(K)\,q(K)\,dK$, ahol $q$ a kockázatsemleges sűrűség.
- Az $1/h^2$-tel skálázott pillangó egy keskeny tüskét áraz; a határértékben $q(K) = e^{rT}\,\partial^2 C/\partial K^2$, továbbá $\partial C/\partial K = -e^{-rT}\mathbb{Q}(S_T > K)$.
- Negatív ferdeség mellett az implikált sűrűség bal oldali széle vastagabb a lognormálisnál.
- A Carr–Madan-felbontás bármely kifizetést kötvényekből, határidős ügyletből és $f''$-vel súlyozott opciókból rak össze; szakaszonként lineáris kifizetésnél töréspontonként egy opciópozíció, a meredekségváltozásnyi mennyiséggel.
- Különböző horgonyok különböző portfóliókat adnak ugyanazzal a kifizetéssel, tehát ugyanazzal az árral; véges kötésiár-rácson a replikáció közelítő.

[Rajzolj kifizetést, és hasonlítsd össze a három replikáló portfóliót a Payoff labor Payoff replikálás lapján](https://quantsandbox.dev/hu/payoff?lab=replicate)

## Interaktív laborok

- [Opciós kifizetési diagram és stratégiaépítő](https://quantsandbox.dev/hu/payoff)
- [Black–Scholes-kalkulátor és opciós görögök](https://quantsandbox.dev/hu/black-scholes)

## Gyakorló kérdések

### 1. Melyik azonosság a Breeden–Litzenberger-formula?

- a) $\partial^2 C/\partial K^2 = e^{-rT}q(K)$
- b) $\partial C/\partial K = e^{-rT}q(K)$
- c) $\partial^2 C/\partial S^2 = e^{-rT}q(K)$
- d) $\partial C/\partial K = N(d_1)$

**Válasz:** a) $\partial^2 C/\partial K^2 = e^{-rT}q(K)$

A kötési ár szerinti első derivált $-e^{-rT}\mathbb{Q}(S_T > K)$; még egyszer deriválva a diszkontált sűrűséget kapjuk. Az $S$ szerinti második derivált a gamma, az más mennyiség.

### 2. A fenti, állandó 20%-os árakkal a 95/100/105-ös pillangó ára $C(95) - 2C(100) + C(105) \approx 0{,}4667$. Milyen becslést ad a $q(100)$ kockázatsemleges sűrűségre?

**Válasz:** 0.01963

$h^2 = 25$-tel osztva $0{,}01867 \approx e^{-rT}q(100)$, majd a diszkontálást visszafordítva $q(100) \approx e^{0{,}05} \cdot 0{,}01867 \approx 0{,}0196$.

---

Forrás: https://quantsandbox.dev/hu/guide/derivatives/static-replication

Előző lecke: [Sztochasztikus volatilitás és a Heston-modell](https://quantsandbox.dev/hu/guide/derivatives/stochastic-volatility)

Következő lecke: [Egzotikus opciók: korlátos, ázsiai és digitális opciók](https://quantsandbox.dev/hu/guide/derivatives/exotic-options)
