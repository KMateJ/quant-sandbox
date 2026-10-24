# Sztochasztikus analízis kurzus: a bolyongástól a Brown-mozgásig

Interaktív leckék: véletlen bolyongás, centrális határeloszlás-tétel, Wiener-folyamat, tükrözési elv és első elérési idők, kísérletezve megtanulva.

## Az eszközről

Gyakorlati kurzus sztochasztikus folyamatokból és sztochasztikus analízisből. Minden lecke feltesz egy kérdést, és kísérlettel válaszolhatsz rá: a szimmetrikus véletlen sétától és a √t skálázástól a centrális határeloszlás-tételen és a Donsker-tételen át a Wiener-folyamatig, a növekményeiig és a kovarianciájáig, a futó maximumig, a tükrözési elvig és az első elérési időkig.

## Gyakori kérdések

### Kell előre ismernem a sztochasztikus analízist?

Nem. A leckék pénzfeldobásból indulnak és lépésről lépésre építkeznek; mindegyiknek van egy kísérletező „Felfedezés” és egy pontos állításokat tartalmazó „Matematika” füle.

### Miért √t szerint skálázódik a Brown-mozgás?

Diszjunkt intervallumokon a növekményei függetlenek, így a varianciák összeadódnak. A variancia ezért lineárisan nő az idővel, a tipikus eltérés — a szórás — pedig √t szerint.

### Mi a Wiener-folyamat?

A standard Brown-mozgás matematikai neve: 0-ból induló, folytonos véletlen pálya független növekményekkel, amelynek t hosszú időszakra vett növekménye 0 várható értékű, t varianciájú normális eloszlású. Az átskálázott véletlen bolyongás határértékeként adódik (Donsker-tétel), és a legtöbb folytonos idejű pénzügyi modellben ez a véletlen forrása.

### Mi a tükrözési elv?

A 0-ból induló Brown-mozgásnál egy a > 0 szintet elérő minden pálya tükrözhető az első elérési idő után, ebből P(W maximuma [0, t]-n ≥ a) = 2 P(W_t ≥ a). Ez adja a futó maximum és az első elérési idők eloszlását, amelyeket a barrier opciók árazásában használnak.

## Az elmélet

- [A nagy számok törvénye és a centrális határeloszlás-tétel](https://quantsandbox.dev/hu/guide/stochastic/law-of-large-numbers-clt): Miért állnak be az átlagok, milyen gyorsan, és miért bukkan fel a normális eloszlás: a Monte Carlo és a Brown-határátmenet mögötti két tétel.
- [Valószínűségi mezők, σ-algebrák és valószínűségi változók](https://quantsandbox.dev/hu/guide/stochastic/probability-spaces): Eseménytér, σ-algebra, valószínűségi mérték, mérhető függvény és a változó által generált σ-algebra.
- [Filtrációk, adaptált folyamatok és megállási idők](https://quantsandbox.dev/hu/guide/stochastic/filtrations): Az idővel bővülő információ, adaptált és előrejelezhető folyamatok, és mikor megállási idő egy véletlen időpont.
- [A Brown-mozgás tulajdonságai](https://quantsandbox.dev/hu/guide/stochastic/brownian-properties): Definíció, Gauss-folyamat jellemzés, skálázás, időinverzió, Markov-tulajdonság, kvadratikus variáció és a pályák szabálytalansága.
- [A tükrözési elv és az első elérési idők](https://quantsandbox.dev/hu/guide/stochastic/reflection-principle): Az erős Markov-tulajdonság, a futó maximum eloszlása és az első elérési idő sűrűsége.
- [A Brown-híd](https://quantsandbox.dev/hu/guide/stochastic/brownian-bridge): Brown-mozgás rögzített végponttal: konstrukció, kovariancia, függetlenség és alkalmazások.

Az interaktív eszköz megnyitása: https://quantsandbox.dev/hu/stochastic-models
