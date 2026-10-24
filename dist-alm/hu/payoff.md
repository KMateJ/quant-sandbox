# Opciós kifizetési diagram és stratégiaépítő

Építs opciós stratégiákat, és lásd azonnal a kifizetési és nyereségdiagramot: call, put, fedezett call, spread, straddle, strangle, butterfly.

## Az eszközről

Az opciós kifizetésfüggvény megmutatja, mennyit ér egy pozíció lejáratkor az alaptermék minden lehetséges árán. Ebben a stratégiaépítőben callokat, putokat, részvényt, forwardot és készpénzt kombinálhatsz, a diagram pedig a kifizetést és a prémiumok utáni nyereséget is mutatja. Indulhatsz kész stratégiákból — fedezett call, védő put, bull és bear spread, straddle, strangle, butterfly —, vagy építhetsz saját többlábú stratégiát.

## Gyakori kérdések

### Mi a különbség a kifizetés és a nyereség között?

A kifizetés a pozíció értéke lejáratkor. A nyereség ebből levonja a megnyitáskor kifizetett opciós prémiumokat és hozzáadja az eladott opciókért kapottakat, így a nyereségvonal a kifizetésvonal nettó prémiummal eltolva.

### Hogyan lehet két különböző stratégiának ugyanaz a kifizetése?

Put–call paritás: egy long call és egy short put ugyanazzal a kötési árral pontosan úgy viselkedik, mint egy forward. Az azonos kifizetésű kombinációknak ma is ugyanannyiba kell kerülniük, különben arbitrázs lenne.

## Az elmélet

- [Határidős ügyletek, call és put opciók](https://quantsandbox.dev/hu/guide/derivatives/instruments): Mi a derivatíva; forward, call és put kifizetése lejáratkor; long és short pozíció.
- [Pozíciók kombinálása](https://quantsandbox.dev/hu/guide/derivatives/strategies): A kifizetések összeadódnak: spreadek, straddle, strangle, butterfly és szintetikus forward.
- [Arbitrázs és a határidős ár](https://quantsandbox.dev/hu/guide/derivatives/no-arbitrage): Az egy ár törvénye, a cash-and-carry stratégia és a fair határidős ár.
- [Put–call paritás](https://quantsandbox.dev/hu/guide/derivatives/put-call-parity): Két portfólió azonos kifizetéssel: modellfüggetlen kapcsolat a call és a put ára között.
- [Statikus replikáció: Breeden–Litzenberger és Carr–Madan](https://quantsandbox.dev/hu/guide/derivatives/static-replication): Kockázatsemleges sűrűség a call árakból, és tetszőleges kifizetés felépítése kötvényből, forwardból és opciókból.
- [Egzotikus opciók: korlátos, ázsiai és digitális opciók](https://quantsandbox.dev/hu/guide/derivatives/exotic-options): Útfüggő kifizetések, a kiütési korlát és az átlagár hatása, és miért természetes itt a Monte Carlo-árazás.

Az interaktív eszköz megnyitása: https://quantsandbox.dev/hu/payoff
