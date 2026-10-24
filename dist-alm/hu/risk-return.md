# Tőkeallokációs egyenes és Sharpe-mutató

Kombinálj kockázatos eszközt a kockázatmentes kamatlábbal: várható hozam, volatilitás, Sharpe-mutató és tőkeáttétel a tőkeallokációs egyenesen.

## Az eszközről

Egy kockázatos portfólió és egy kockázatmentes eszköz kombinációi kirajzolják a tőkeallokációs egyenest. Az eszköz megmutatja, hogyan változik a várható hozam és a volatilitás, ahogy a súlyt a kettő között tologatod, hogyan hosszabbítja meg az egyenest a tőkeáttétel, és hogyan adja meg a meredekségét a Sharpe-mutató — az egységnyi kockázatra jutó többlethozam.

## Gyakori kérdések

### Mi a Sharpe-mutató?

A várható hozam és a kockázatmentes kamatláb különbsége osztva a volatilitással. Ez a tőkeallokációs egyenes meredeksége, és a kockázatos eszköz minden készpénzes keverékére ugyanannyi.

### Mit csinál a tőkeáttétel a tőkeallokációs egyenesen?

Ha a kockázatmentes kamaton hitelt veszel fel, és 100%-nál többet tartasz a kockázatos eszközben, ugyanazon az egyenesen haladsz tovább: magasabb várható hozam és arányosan magasabb volatilitás.

### Mi számít jó Sharpe-mutatónak?

Ez a befektetési időtávtól és az eszközosztálytól függ, ezért csak hasonlót hasonlóval érdemes összevetni. Éves adatokra durva iránymutatásként: a széles részvénypiaci indexek Sharpe-mutatója történetileg nagyjából 0,3–0,5 volt, az 1 fölötti érték nagyon jónak számít, a tartósan sokkal magasabb érték pedig ok arra, hogy rejtett kockázatokat keressünk.

### Hogyan számoljuk ki egy kockázatmentes eszközt is tartalmazó portfólió hozamát és kockázatát?

Ha w súly kerül a kockázatos portfólióba és 1 − w a kockázatmentes eszközbe, a várható hozam r_f + w (E[R] − r_f), a volatilitás pedig w σ, mert a kockázatmentes eszköznek nincs varianciája. Például 60% egy 8% várható hozamú, 20% volatilitású portfólióban, r_f = 2% mellett 5,6% várható hozamot és 12% volatilitást ad.

## Az elmélet

- [Hozamok és volatilitás](https://quantsandbox.dev/hu/guide/portfolio/returns-volatility): Egyszerű és logaritmikus hozam, szórás, évesítés és a négyzetgyök-szabály.
- [Diverzifikáció és korreláció](https://quantsandbox.dev/hu/guide/portfolio/diversification): Két eszköz portfóliója, a kovariancia szerepe, és miért csökken a kockázat a korrelációval.
- [Kockázatkerülés és az optimális teljes portfólió](https://quantsandbox.dev/hu/guide/portfolio/risk-aversion): Várható érték–variancia hasznosság, közömbösségi görbék, a kockázatkerülési együttható és a tőkeallokációs egyenes legjobb pontja.
- [Teljesítménymutatók: Sharpe, Treynor, Jensen és információs ráta](https://quantsandbox.dev/hu/guide/portfolio/performance-measures): Kockázattal korrigált teljesítmény, melyik mutató melyik kockázatot veszi figyelembe, és miért térhetnek el a rangsorok.
- [Kockáztatott érték (VaR) és várható veszteség (ES)](https://quantsandbox.dev/hu/guide/portfolio/risk-measures): Veszteségkvantilisek, az azokon túli farokrész, normális és vastag farkú hozamok, és a négyzetgyökös időszabály.
- [A várható hozam és a kovariancia becslése](https://quantsandbox.dev/hu/guide/portfolio/input-estimation): Mintamomentumok, standard hibáik, miért instabil a hatékony front, és a zsugorítás (shrinkage) mint ellenszer.

Az interaktív eszköz megnyitása: https://quantsandbox.dev/hu/risk-return
