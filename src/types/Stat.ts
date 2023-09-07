const statList = [
    'str', // 힘
    'dex', // 덱
    'int', // 인
    'luk', // 럭
    'strP', // 힘퍼
    'dexP', // 덱퍼
    'intP', // 인퍼
    'lukP', // 럭퍼
    'hp', // hp
    'hpP', // hp퍼
    'mp', // mp
    'mpP', // mp퍼
    'atk', // 공격력
    'atkP', // 공격력퍼
    'mAtk', // 마력
    'mAtkP', // 마력퍼
    'def', // 물리방어력
    'defP', // 물리방어력%
    'speed', // 이동속도
    'jump', // 점프력
    'ignoreDef', // 방어율무시%
    'mobDmg', // 일반몬스터데미지%
    'bossDmg', // 보스몬스터데미지%
    'dmg', // 데미지%
    'allStat', // 올스탯
    'allStatP', // 올스탯%
    'crit', // 크리티컬확률
    'critDmg', // 크리티컬데미지%
    'buff', // 버프지속시간
    'statusDmg', // 상태이상데미지
    'arcane', // 아케인포스
    'lvNAtk', // lvN당공1
    'lvNmAtk', // lvN당마1
    'lv9Str', // lv9당힘N
    'lv9Dex', // lv9당덱N
    'lv9Int', // lv9당인N
    'lv9Luk', // lv9당럭N
    'meso', // 메소획득량
    'drop', // 아이템드롭률
    'hpHeal', // 회복
    'passive', // 패시브1렙
    'reuse', // 재사용
    'exp', // 획득 경험치
] as const;

export type Stat = (typeof statList)[number];

export type Stats = Partial<Record<Stat, number>>;

export const STAT_MAPPING: Record<string, Stat> = {
    ['STR']: 'str',
    ['DEX']: 'dex',
    ['INT']: 'int',
    ['LUK']: 'luk',
    ['힘']: 'str',
    ['민첩']: 'dex',
    ['민첩성']: 'dex',
    ['지력']: 'int',
    ['운']: 'luk',
    ['행운']: 'luk',
    ['MaxHP']: 'hp',
    ['최대 HP']: 'hp',
    ['MaxMP']: 'mp',
    ['최대 MP']: 'mp',
    ['STR%']: 'strP',
    ['DEX%']: 'dexP',
    ['INT%']: 'intP',
    ['LUK%']: 'lukP',
    ['MaxHP%']: 'hpP',
    ['최대 HP%']: 'hpP',
    ['MaxMP%']: 'mpP',
    ['최대 MP%']: 'mpP',
    ['공격력']: 'atk',
    ['마력']: 'mAtk',
    ['공격력%']: 'atkP',
    ['마력%']: 'mAtkP',
    ['물리방어력']: 'def',
    ['방어력']: 'def',
    ['물리방어력%']: 'defP',
    ['방어력%']: 'defP',
    ['이동속도']: 'speed',
    ['점프력']: 'jump',
    ['몬스터 방어력 무시']: 'ignoreDef',
    ['몬스터 방어력 무시%']: 'ignoreDef',
    ['몬스터 방어율 무시']: 'ignoreDef',
    ['몬스터 방어율 무시%']: 'ignoreDef',
    ['보스 몬스터공격 시 데미지']: 'bossDmg',
    ['보스 몬스터 공격 시 데미지']: 'bossDmg',
    ['보스 몬스터 공격 시 데미지%']: 'bossDmg',
    ['데미지']: 'dmg',
    ['데미지%']: 'dmg',
    ['올스탯']: 'allStat',
    ['올스탯%']: 'allStatP',
    ['크리티컬 확률']: 'crit',
    ['크리티컬 확률%']: 'crit',
    ['크리티컬 데미지']: 'critDmg',
    ['크리티컬 데미지%']: 'critDmg',
    ['캐릭터 기준 9레벨 당 STR']: 'lv9Str',
    ['캐릭터 기준 9레벨 당 DEX']: 'lv9Dex',
    ['캐릭터 기준 9레벨 당 INT']: 'lv9Int',
    ['캐릭터 기준 9레벨 당 LUK']: 'lv9Luk',
    ['메소 획득량']: 'meso',
    ['메소 획득량%']: 'meso',
    ['아이템 드롭률']: 'drop',
    ['아이템 드롭률%']: 'drop',
    ['HP 회복 아이템 및 회복 스킬 효율']: 'hpHeal',
    ['HP 회복 아이템 및 회복 스킬 효율%']: 'hpHeal',
};
