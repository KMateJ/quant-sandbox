# Binomiális opcióárazó fa kalkulátor

Árazz opciót interaktív binomiális fán: kockázatsemleges valószínűségek, visszafelé indukció és a replikáló portfólió minden csomópontban.

## Az eszközről

A binomiális modell úgy áraz egy opciót, hogy az alaptermék diszkrét lépésekben rögzített szorzókkal fel vagy le mozdulhat. A lejárati kifizetésekből visszafelé haladva, kockázatsemleges valószínűségekkel minden csúcsban megkapjuk az opció értékét. Az interaktív fa minden lépésben a replikáló portfóliót is mutatja: azt a részvény–kötvény kombinációt, amely előállítja az opciót.

## Gyakori kérdések

### Mi a kockázatsemleges valószínűség?

Az a q = (1 + r − d) / (u − d) valószínűség, amely mellett a részvény várható hozama a kockázatmentes kamatláb. Nem előrejelzés, hanem az a súly, amellyel a diszkontált árak arbitrázsmentesen konzisztensek.

### Hogyan kapcsolódik a binomiális fa a Black–Scholes-modellhez?

Ha a lépések száma nő, és a fel/le szorzókat a volatilitáshoz illesztjük, egy európai opció binomiális ára a Black–Scholes-árhoz konvergál.

## Az elmélet

- [Az egylépéses binomiális modell](https://quantsandbox.dev/hu/guide/derivatives/one-step-binomial): A részvény fel- vagy lemegy; a call replikálása részvényből és kötvényből.
- [Kockázatsemleges valószínűségek](https://quantsandbox.dev/hu/guide/derivatives/risk-neutral): A replikációs ár mint diszkontált várható érték a q súlyokkal; a P és a Q mérték szerepe.
- [Többlépéses fák és visszafelé indukció](https://quantsandbox.dev/hu/guide/derivatives/multi-step-trees): Rekombináló fa, CRR-paraméterezés, csomópontonkénti árazás és konvergencia a Black–Scholes-árhoz.
- [Amerikai opciók és korai lehívás](https://quantsandbox.dev/hu/guide/derivatives/american-options): Korai lehívás a fában, miért nem éri meg korán lehívni az osztalékot nem fizető részvényre szóló callt, a put korai lehívási prémiuma és a lehívási határ.
- [Visszahívható kötvények és negatív konvexitás](https://quantsandbox.dev/hu/guide/fixed-income/callable-bonds): A kibocsátó visszahívási opciója, az ár összenyomódása a visszahívási ár közelében, a visszahívásig számított hozam és a negatív konvexitás.

Az interaktív eszköz megnyitása: https://quantsandbox.dev/hu/binomial
