# 메이플 유틸 캐릭터 정보 파싱 프로젝트 JS

## About

메이플스토리 캐릭터 장비를 가져오는 공식 API가 없어서 직접 만든 파싱 프로그램입니다. 공식 홈페이지에 정보가 공개된 캐릭터를 검색하여 해당 캐릭터의 기본정보, 기본 스펙, 장착한 장비 아이템, 펫장비, 아케인
심볼을 추출합니다. 기존에 있던 [C# 프로젝트](https://github.com/leesangb/mapleutils-parser)를 참고하여 만들었습니다.

## Usage

```js
import { MapleUtilsParser } from 'mapleutils-parser-js';

const parser = MapleUtilsParser.new();
parser.getCharacter({
    name: '상빈',
    cash: true,
    pet: true,
    equip: true,
    symbol: true
}).then((character) => console.log(character));

parser.getCharacterWithErrors({
    name: '상빈',
    cash: true,
    pet: true,
    equip: true,
    symbol: true
}).then(({data: character, errors}) => {
    console.log(character); // 캐릭터 정보
    errors?.equipments()?.then(equipments => console.log(equipments)); // 실패한 장비목록 재시도하는 콜백
    errors?.arcanes()?.then(symbols => console.log(symbols)); // 실패한 아케인심볼 목록 재시도하는 콜백
    errors?.petEquipments()?.then(petEquipments => console.log(petEquipments)); // 실패한 펫장비 목록 재시도하는 콜백
    errors?.cashEquipments()?.then(cashEquipments => console.log(cashEquipments)); // 실패한 캐시장비 목록 재시도하는 콜백
});
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

type Stat = typeof statList[number];
```

## Output 예시

```json
{
  "name": "상빈",
  "world": "크로아",
  "guild": "꿈길",
  "job": "듀얼블레이더",
  "level": 253,
  "imageUrl": "https://avatar.maplestory.nexon.com/Character/180/DIDFBINAMEPMOAFKNCMDJNDMMIDKJBHHNLKKKKKGDDKJBFKBPIKKJEHKBBEMCJPHIEINOKJNNAACNNHECPKOMHHLKDJPCNEELKAGDLLJAAHHMHMIECPIKHGDAKGHDELGKIDBPCIDABNNILCHBDGONHOPDEOILIOFPPJGECFLOHDKOBPMFIIJPJPCKEMPDBPNJCAHDMCKBKGJGJGMDKPNHPEIONFHJKCDALLEJHJJNNGKEOGKEPFGFIKAOGCNHJJO.png",
  "traits": {
    "ambition": 100,
    "insight": 100,
    "willpower": 100,
    "diligence": 100,
    "empathy": 100,
    "charm": 100
  },
  "spec": {
    "statAtkLow": 5003901,
    "statAtkHigh": 5559889,
    "hp": 45230,
    "mp": 27811,
    "str": 1781,
    "dex": 3279,
    "int": 1597,
    "luk": 23817,
    "critDmg": 56,
    "bossDmg": 272,
    "ignoreDef": 83,
    "resistance": 54,
    "stance": 100,
    "def": 31370,
    "speed": 160,
    "jump": 123,
    "starForce": 241,
    "arcaneForce": 1040,
    "hypers": {
      "atk": 24,
      "mAtk": 24,
      "luk": 210,
      "crit": 7,
      "critDmg": 11,
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
      "name": "골드 메이플리프 엠블렘",
      "level": 100,
      "imageUrl": "https://avatar.maplestory.nexon.com/ItemIcon/KEOLLEOA.png",
      "category": "엠블렘",
      "upgrade": 0,
      "base": {
        "str": 10,
        "dex": 10,
        "int": 10,
        "luk": 10,
        "atk": 2,
        "mAtk": 2
      },
      "scroll": {},
      "grade": "legendary",
      "star": 0,
      "potential": {
        "grade": "legendary",
        "effects": [
          {
            "atkP": 12
          },
          {
            "atkP": 9
          },
          {
            "dexP": 9
          }
        ]
      },
      "additional": {
        "grade": "rare",
        "effects": [
          {
            "dmg": 3
          },
          {
            "def": 50
          },
          {
            "mp": 50
          }
        ]
      },
      "flame": {}
    },
    {
      "name": "아케인셰이드 대거",
      "level": 200,
      "imageUrl": "https://avatar.maplestory.nexon.com/ItemIcon/KEMBJFHA.png",
      "category": "단검 (한손무기)",
      "upgrade": 8,
      "base": {
        "dex": 100,
        "luk": 100,
        "atk": 276,
        "bossDmg": 30,
        "ignoreDef": 20
      },
      "scroll": {
        "dex": 40,
        "luk": 64,
        "hp": 255,
        "mp": 255,
        "atk": 179
      },
      "grade": "legendary",
      "star": 15,
      "potential": {
        "grade": "legendary",
        "effects": [
          {
            "bossDmg": 35
          },
          {
            "dmg": 12
          },
          {
            "crit": 12
          }
        ]
      },
      "flame": {
        "dex": 33,
        "mp": 1800,
        "atk": 133,
        "dmg": 3
      },
      "soul": {
        "allStat": 15
      }
    }
  ],
  "arcanes": [
    {
      "name": "아케인심볼 : 소멸의 여로",
      "stat": {
        "luk": 1600
      },
      "level": 14,
      "experience": 230,
      "requiredExperience": 207
    },
    {
      "name": "아케인심볼 : 츄츄 아일랜드",
      "stat": {
        "luk": 1700
      },
      "level": 15,
      "experience": 238,
      "requiredExperience": 236
    },
    {
      "name": "아케인심볼 : 레헬른",
      "stat": {
        "luk": 1500
      },
      "level": 13,
      "experience": 43,
      "requiredExperience": 180
    },
    {
      "name": "아케인심볼 : 아르카나",
      "stat": {
        "luk": 1700
      },
      "level": 15,
      "experience": 355,
      "requiredExperience": 236
    },
    {
      "name": "아케인심볼 : 모라스",
      "stat": {
        "luk": 1800
      },
      "level": 16,
      "experience": 309,
      "requiredExperience": 267
    },
    {
      "name": "아케인심볼 : 에스페라",
      "stat": {
        "luk": 1800
      },
      "level": 16,
      "experience": 162,
      "requiredExperience": 267
    }
  ],
  "cashEquipments": [
    {
      "name": "8주년 음표 시트린",
      "upgrade": 0,
      "imageUrl": "https://avatar.maplestory.nexon.com/ItemIcon/KEPCIFLA.png",
      "category": "모자",
      "scroll": {},
      "base": {}
    },
    {
      "name": "발그레 발그레",
      "upgrade": 0,
      "imageUrl": "https://avatar.maplestory.nexon.com/ItemIcon/KEPDJEJI.png",
      "category": "얼굴장식",
      "scroll": {},
      "base": {}
    }
  ],
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

##

## 에러 목록

- `NotFoundError`: 캐릭터 또는 캐릭터 상세정보를 찾을 수 없을 때
- `NotValidHtmlNodeError`: 올바른 HTML 노드가 아닐 때
- `NotValidSpecPageError`: 올바른 스펙 페이지가 아닐 때
- `OpenPageError`: 페이지를 열 수 없을 때
- `PrivateInformationError`: 비공개 정보일 때
- `RankingSearchError`: 공식 홈페이지 랭킹 검색에 실패했을 때
- `RetryError`: 재시도를 실패했을 때
