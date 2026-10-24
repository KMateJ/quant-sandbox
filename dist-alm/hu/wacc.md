# WACC-kalkulátor: súlyozott átlagos tőkeköltség

Számold ki a súlyozott átlagos tőkeköltséget: saját tőke költsége, adózás utáni hitelköltség, adópajzs, és hogyan mozdítja a WACC-ot a tőkeáttétel.

## Az eszközről

A súlyozott átlagos tőkeköltség (WACC) az a vegyes hozam, amelyet egy vállalatnak a tulajdonosai és hitelezői számára ki kell termelnie. A WACC-kalkulátor a saját tőke költségét és az adózás utáni hitelköltséget piaci értéksúlyokkal kombinálja, és megmutatja, hogyan mozdítja az eredményt az adópajzs és a tőkeáttétel.

## Gyakori kérdések

### Miért adózás után számoljuk a hitel költségét?

A kamatfizetés adóból leírható, így a vállalat számára a hitel tényleges költsége r_d × (1 − adókulcs).

### Mire használjuk a WACC-ot?

Ez a diszkontráta a vállalat szabad pénzáramlásaihoz a DCF-értékelésben, és az elvárt minimális hozam a vállalattal azonos kockázatú projekteknél.

### Hogyan számoljuk ki a WACC-ot adóval?

WACC = E/V × r_e + D/V × r_d × (1 − T), ahol E és D a saját tőke és az adósság piaci értéke, V = E + D, T pedig a társasági adókulcs. Például 60% saját tőke 10%-on, 40% adósság 5%-on és 25%-os adókulcs mellett 0,6 × 10% + 0,4 × 5% × 0,75 = 7,5%.

### Hogyan becsüljük meg a saját tőke költségét?

Leggyakrabban a CAPM-mel: r_e = r_f + β × piaci kockázati prémium. 3%-os kockázatmentes kamatláb, 1,2-es béta és 5%-os piaci kockázati prémium mellett r_e = 3% + 1,2 × 5% = 9%. Az adóssággal ellentétben a saját tőkének nincs kikötött kamata, ezért a költségét abból következtetjük ki, milyen hozamot várnak el a befektetők a vállalt kockázatért.

## Az elmélet

- [Súlyozott átlagos tőkeköltség](https://quantsandbox.dev/hu/guide/corporate/wacc): A saját tőke költsége, az adózás utáni hitelköltség, a kamatadópajzs és a piaci értékű súlyok.
- [Tőkeszerkezet és a Modigliani–Miller-tételek](https://quantsandbox.dev/hu/guide/corporate/capital-structure): Az MM I. és II. tétele adók nélkül, a kamatadópajzs, a tőkeáttételes saját tőke költsége és a WACC adóval.

Az interaktív eszköz megnyitása: https://quantsandbox.dev/hu/wacc
