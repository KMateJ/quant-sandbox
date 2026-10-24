export const hedgingDeskMissionsHu = {
  hdMissionM1Title: "Fedezz egy short callt lejáratig",
  hdMissionM1Tagline: "Eladtál 10 × 100C-t. Maradj deltasemleges 63 napig.",
  hdMissionM1Brief:
    "Egy ügyfél 10 ATM callt vett tőled. A prémium és a kockázat is a tiéd. Tartsd a nettó deltát a sávban minden záráskor, amíg az opciók le nem járnak.",

  hdObjMaxBreaches: "Nettó Δ ±{{band}} db-on belül minden záráskor",
  hdObjMaxBreachesValue: "{{value}} / {{limit}} megengedett sávsértés",
  hdObjPnlWithin: "Fedezési P&L ±${{limit}}-on belül lejáratkor",
  hdObjPnlValue: "P&L {{value}}",
  hdObjCostsBelow: "Spreadköltség ${{limit}} alatt",
  hdObjCostsBelowValue: "{{value}} kifizetve",
  hdObjMaxTrades: "Legfeljebb {{limit}} kötés a futás alatt",
  hdObjMaxTradesValue: "{{value}} / {{limit}} kötés felhasználva",
  hdObjPnlAbove: "P&L ${{limit}} fölött lejáratkor",
  hdObjGammaLimitFrom: "|Γ| legfeljebb {{limit}} db/$ D{{fromDay}}-tól",
  hdObjGammaLimitFromValue: "max |Γ| {{value}} db/$",
  hdObjGapLoss: "Legfeljebb ${{limit}} veszteség az ugrás napján",
  hdObjGapLossValue: "Ugrásnapi P&L {{value}}",
  hdObjVegaLimitBy: "|Vega| legfeljebb ${{limit}}/pont D{{byDay}}-ig",
  hdObjVegaLimitByValue: "|Vega| {{value}}/pont",
  hdObjBeatPolicy: "Verd meg a {{every}} naponkénti automatikus fedezést",
  hdObjBeatPolicyValue: "{{value}} a stratégiához képest",
  hdObjFlatStock: "Ne maradjon részvény elszámolás után",
  hdObjFlatStockValue: "{{value}} db a könyvben",


  hdMissionM2Title: "Fedezés szűkös kereten",
  hdMissionM2Tagline: "Ugyanaz a short call, 15 $ kötésenként, 10 kötés.",
  hdMissionM2Brief:
    "Minden kötés 15 $-ba kerül, és összesen tízet köthetsz, csak részvényben. A napi fedezés már nem járható út: döntsd el, mikor éri meg az újrasúlyozás, és teljesíts jobban, mint az ötnaponta fedező desk.",
  hdMissionM3Title: "Gamma az ugrás előtt",
  hdMissionM3Tagline: "Short 20 × 100C. Árugrás jön D25 és D35 között.",
  hdMissionM3Brief:
    "A delta-fedezés egymagában nem véd meg egy ugrástól. Vásárolj vissza gammát opciókkal az ugrás előtt, de ne fizess túl sokat thétában.",
  hdMissionM4Title: "Volatilitási rezsimváltás",
  hdMissionM4Tagline: "Long 105C, short 95P. Az implikált vol D20-on 30%-ra ugrik.",
  hdMissionM4Brief:
    "A könyved long vega, és a desk szerint az implikált vol a 20. napon 22%-ról 30%-ra árazódik át. Addig vidd a vegát a limiten belülre, tartsd a deltát a sávban, és ne veszíts 500 $-nál többet.",
  hdMissionM5Title: "Pin-kockázat lejáratkor",
  hdMissionM5Tagline: "Short 10 × 100C, 10 nap, az árfolyam a kötési árnál.",
  hdMissionM5Brief:
    "Ezek a callok fizikai teljesítésűek: ha pénzben vannak, 1000 részvényt kell leszállítanod. Ha az árfolyam a kötési ár körül ragad, a delta az utolsó pillanatban átfordul. Zárd a futást részvény nélkül.",
};
