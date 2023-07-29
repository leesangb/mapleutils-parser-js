declare const statList: readonly ["str", "dex", "int", "luk", "strP", "dexP", "intP", "lukP", "hp", "hpP", "mp", "mpP", "atk", "atkP", "mAtk", "mAtkP", "def", "defP", "speed", "jump", "ignoreDef", "mobDmg", "bossDmg", "dmg", "allStat", "allStatP", "crit", "critDmg", "buff", "statusDmg", "arcane", "lvNAtk", "lvNmAtk", "lv10Str", "lv10Dex", "lv10Int", "lv10Luk", "meso", "drop", "hpHeal", "passive", "reuse"];
export declare type Stat = typeof statList[number];
export declare const STAT_MAPPING: Record<string, Stat>;
export {};
