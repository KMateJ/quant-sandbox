# Kéteszközös portfólió: diverzifikáció és korreláció

Lásd, hogyan határozza meg a korreláció a diverzifikációt: két eszköz várható hozama, volatilitása és minimális varianciájú portfóliója interaktív görbén.

## Az eszközről

A diverzifikáció azért működik, mert az eszközök nem mozognak tökéletesen együtt. Ebben a kéteszközös portfóliólaborban beállíthatod a várható hozamokat, a volatilitásokat és a korrelációt, és nézheted, ahogy a lehetséges portfóliók görbéje meghajlik: minél kisebb a korreláció, annál több kockázat szűrhető ki, egészen a minimális varianciájú portfólióig.

## Gyakori kérdések

### Miért csökkenti a kisebb korreláció a portfólió kockázatát?

A portfólió varianciájában kovarianciatag is szerepel. Ha a korreláció 1 alatti, az egyik eszköz veszteségét részben ellensúlyozza a másik, így a portfólió volatilitása kisebb a két volatilitás súlyozott átlagánál.

### Mi a minimális varianciájú portfólió?

A két eszköz azon keveréke, amelynek a lehető legkisebb a volatilitása. Tökéletesen negatív korrelációnál akár kockázatmentes is lehet.

### Hogyan számoljuk ki egy kéteszközös portfólió volatilitását?

σ_p² = w₁²σ₁² + w₂²σ₂² + 2 w₁ w₂ ρ σ₁ σ₂, és σ_p ennek négyzetgyöke. Például 50–50% egy 20%-os és egy 30%-os volatilitású eszközben, 0,2-es korreláció mellett σ_p² = 0,01 + 0,0225 + 0,006 = 0,0385, vagyis σ_p ≈ 19,6%: kevesebb a 25%-os súlyozott átlagnál, sőt a kevésbé volatilis eszköznél is.

### Megszüntethető-e minden kockázat diverzifikációval?

Csak különleges esetekben, például két −1 korrelációjú eszköznél. Egy nagy portfólióban a vállalatspecifikus kockázat kiátlagolódik, de az összes eszközre közös piaci (szisztematikus) kockázat megmarad, akárhány eszközt tartunk.

## Az elmélet

- [Diverzifikáció és korreláció](https://quantsandbox.dev/hu/guide/portfolio/diversification): Két eszköz portfóliója, a kovariancia szerepe, és miért csökken a kockázat a korrelációval.
- [Hatékony front és tőkepiaci egyenes](https://quantsandbox.dev/hu/guide/portfolio/efficient-frontier): Átlag–variancia optimalizálás, minimális varianciájú portfólió, kockázatmentes eszköz és az érintőportfólió.
- [Faktormodellek és szisztematikus kockázat](https://quantsandbox.dev/hu/guide/portfolio/factor-models): Az egyindexes modell, a szisztematikus és egyedi variancia szétválasztása, és a többfaktoros modellek.
- [Kockáztatott érték (VaR) és várható veszteség (ES)](https://quantsandbox.dev/hu/guide/portfolio/risk-measures): Veszteségkvantilisek, az azokon túli farokrész, normális és vastag farkú hozamok, és a négyzetgyökös időszabály.
- [Portfóliókorlátok és a shortolás nélküli hatékony front](https://quantsandbox.dev/hu/guide/portfolio/portfolio-constraints): Miért nem követheti egy valódi portfólió a korlátozatlan frontot: shortolási tilalom, pozíciólimitek, és mennyit vesznek el a Sharpe-mutatóból.

Az interaktív eszköz megnyitása: https://quantsandbox.dev/hu/portfolio-lab
