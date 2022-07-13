# 메이플 유틸 캐릭터 정보 파싱 프로젝트 JS

## About

메이플스토리 캐릭터 장비를 가져오는 공식 API가 없어서 직접 만든 파싱 프로그램입니다. 공식 홈페이지에 정보가 공개된 캐릭터를 검색하여 해당 캐릭터의 기본정보, 기본 스펙, 장착한 장비 아이템, 펫장비, 아케인
심볼을 추출합니다. 기존에 있던 [C# 프로젝트](https://github.com/leesangb/mapleutils-parser)를 참고하여 만들었습니다.

## Usage

```js
const { MapleUtilsParser } = require('mapleutils-parser-js');

const parser = MapleUtilsParser.new();
parser.getCharacter('상빈')
    .then((character) => console.log(character));
```

## 파싱되는 스탯

```ts
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
    'reuse', // 재사용
] as const;

type Stat = typeof statList[number];
```

## Output 예시

```json
{
  "name": "상빈",
  "world": "크로아",
  "job": "듀얼블레이더",
  "level": 250,
  "imageUrl": "https://avatar.maplestory.nexon.com/Character/180/POIGMFLMLHDCIPIDGELEJEIKMHAFLCIJPPNEAJDOLBCOPABCKGKDOACCMFANHCDGFKKIMLBPFIEKIAONCPJDEMBCKHNMFAFAKDOAGGOFLPNBLKLIFIKHLLCEBKGEJLJKFAHKENMADKIJBPIICELDDDKMMJFDKCAAPMHFEONOBODENBIDLNCCBGKFODONDEJHKNAPBEOMDGFOEDKNNCFCIMBDNLLFELFICHGKDIOFCFHKCLEKFELIEOHDONFALJLK.png",
  "traits": {
    "ambition": 100,
    "insight": 100,
    "willpower": 100,
    "diligence": 100,
    "empathy": 100,
    "charm": 100
  },
  "spec": {
    "statAtkLow": 5321602,
    "statAtkHigh": 5912890,
    "hp": 41465,
    "mp": 27002,
    "str": 1640,
    "dex": 3184,
    "int": 1566,
    "luk": 23612,
    "dmg": 0,
    "critDmg": 65,
    "bossDmg": 268,
    "ignoreDef": 87,
    "resistance": 54,
    "stance": 100,
    "def": 30358,
    "speed": 160,
    "jump": 123,
    "starForce": 215,
    "arcaneForce": 1010,
    "authenticForce": 0,
    "hypers": {
      "atk": 24,
      "mAtk": 24,
      "luk": 180,
      "crit": 5,
      "critDmg": 10,
      "ignoreDef": 30,
      "dmg": 33,
      "bossDmg": 39
    },
    "abilities": {
      "bossDmg": 20,
      "reuse": 10,
      "statusDmg": 7
    }
  },
  "equipments": [
    {
      "name": "아케인셰이드 대거",
      "imageUrl": "https://avatar.maplestory.nexon.com/ItemIcon/KEMBJFHA.png",
      "category": "단검 (한손무기)",
      "upgrade": 8,
      "base": {
        "dex": 100,
        "luk": 100,
        "hp": 0,
        "mp": 0,
        "atk": 276,
        "ignoreDef": 20,
        "dmg": 0
      },
      "scroll": {
        "dex": 40,
        "luk": 64,
        "hp": 255,
        "mp": 255,
        "atk": 179,
        "ignoreDef": 0,
        "dmg": 0
      },
      "grade": "legendary",
      "star": 15,
      "potential": {
        "grade": "legendary",
        "effects": [
          [
            "bossDmg",
            35
          ],
          [
            "dmg",
            12
          ],
          [
            "crit",
            12
          ]
        ]
      },
      "flame": {
        "dex": 33,
        "luk": 0,
        "hp": 0,
        "mp": 1800,
        "atk": 133,
        "ignoreDef": 0,
        "dmg": 3
      },
      "soul": [
        "allStat",
        15
      ]
    }
  ],
  "arcanes": [
    {
      "name": "아케인심볼 : 소멸의 여로",
      "stat": {
        "luk": 1600
      },
      "level": 14,
      "experience": 130,
      "requiredExperience": 207
    }
  ],
  "cashEquipments": [
    {
      "name": "소원 배달원 유니폼 (남)",
      "upgrade": 0,
      "imageUrl": "https://avatar.maplestory.nexon.com/ItemIcon/KEPHLCPH.png",
      "category": "한벌옷",
      "scroll": {},
      "base": {}
    }
  ],
  "authentics": [],
  "petEquipments": [
    {
      "name": "노란색 모자",
      "upgrade": 0,
      "imageUrl": "https://avatar.maplestory.nexon.com/ItemIcon/KEHCJHOA.png",
      "category": "펫장비",
      "scroll": {},
      "base": {}
    }
  ]
}
```