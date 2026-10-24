# DCF-értékelés: szabad cash flow és terminális érték

Építs diszkontált cash flow-értékelést: szabad cash flow-előrejelzés, terminális érték, WACC-cal diszkontálás és vállalatérték.

## Az eszközről

A diszkontált cash flow (DCF) értékelés egy vállalatot a jövőbeli szabad pénzáramlásai jelenértékeként határoz meg. A modell előrevetíti a szabad cash flow-t, hozzáadja az előrejelzési időszakon túli évek maradványértékét, mindent a WACC-cal diszkontál, és így adja ki a vállalatértéket.

## Gyakori kérdések

### Mi a maradványérték a DCF-ben?

Az előrejelzési időszak utáni összes pénzáramlás értéke, többnyire növekvő örökjáradékként: FCF × (1 + g) / (WACC − g). Gyakran ez adja a teljes érték nagy részét.

### Miért ennyire érzékeny a DCF a WACC-ra és a növekedésre?

A maradványérték WACC − g-vel oszt. Ha a kettő közel van egymáshoz, bármelyik feltevés kis változása is nagyot mozdít az értékelésen.

### Mi a vállalati szabad pénzáramlás (FCFF)?

Az a pénz, amelyet a vállalat az adók és a működés fenntartásához, illetve a növekedéshez szükséges beruházások után megtermel, és amely a tulajdonosoké és a hitelezőké egyaránt: FCFF = EBIT × (1 − adókulcs) + értékcsökkenés − beruházás − a forgótőke növekedése. Mivel minden tőkebefektetőé, a WACC-cal diszkontáljuk.

### Mi a különbség a vállalatérték és a saját tőke értéke között?

A vállalatérték (enterprise value) a működő vállalkozás értéke az összes tőkebefektető számára; ezt adja a vállalati szabad pénzáramlás DCF-értékelése. A saját tőke értéke a tulajdonosokra jutó rész: vállalatérték mínusz nettó adósság (adósság mínusz pénzeszközök). Ezt a részvények számával osztva kapjuk az egy részvényre jutó értéket.

## Az elmélet

- [Diszkontált pénzáram alapú értékelés](https://quantsandbox.dev/hu/guide/corporate/dcf-valuation): Szabad pénzáram, vállalatérték, Gordon-féle maradványérték és a saját tőke értéke.
- [Súlyozott átlagos tőkeköltség](https://quantsandbox.dev/hu/guide/corporate/wacc): A saját tőke költsége, az adózás utáni hitelköltség, a kamatadópajzs és a piaci értékű súlyok.
- [Osztalék, kifizetési politika és az osztalékdiszkont-modell](https://quantsandbox.dev/hu/guide/corporate/dividend-policy): A Gordon-féle növekedési modell, növekedés a visszatartott nyereségből, a Modigliani–Miller-féle osztalékirrelevancia, és mikor számít mégis a kifizetés.
- [Relatív értékelés szorzókkal](https://quantsandbox.dev/hu/guide/corporate/valuation-multiples): P/E, EV/EBITDA és más szorzók, a társcégek kiválasztása, és hogyan kapcsolódnak a szorzók a DCF-értékhez.

Az interaktív eszköz megnyitása: https://quantsandbox.dev/hu/valuation
