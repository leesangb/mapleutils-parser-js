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
    'lv10Str', // lv10당힘N
    'lv10Dex', // lv10당덱N
    'lv10Int', // lv10당인N
    'lv10Luk', // lv10당럭N
    'meso', // 메소획득량
    'drop', // 아이템드롭률
    'hpHeal', // 회복
    'passive', // 패시브1렙
] as const;

export type Stat = typeof statList[number];

