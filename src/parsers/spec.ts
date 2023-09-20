import { NotValidSpecPageError } from '../errors';
import { Spec } from '../types/Spec';
import HTMLParser, { HTMLElement } from 'node-html-parser';
import { Stat, Stats } from '../types/Stat';

const SPEC_TABLE_DATA_SELECTOR =
    'div.con_wrap > div.contents_wrap > div > div.tab01_con_wrap > table:nth-child(4) > tbody > tr > td';

export class SpecParser {
    /**
     * 캐릭터 정보 페이지 html에서 스펙을 파싱하여 반환
     * @param specPageHtml
     */
    parse(specPageHtml: string): Spec {
        const node: HTMLElement = HTMLParser.parse(specPageHtml);
        const data = node.querySelectorAll(SPEC_TABLE_DATA_SELECTOR);
        if (!data || data.length !== 20) throw new NotValidSpecPageError();

        const [
            statAtks,
            hp,
            mp,
            str,
            dex,
            int,
            luk,
            critDmg,
            bossDmg,
            ignoreDef,
            resistance,
            stance,
            def,
            speed,
            jump,
            starForce,
            abilityPoints,
            arcaneForce,
            ability,
            hyper,
        ] = data.map((n) => {
            const isHyperOrAbility = n.childNodes[0].childNodes.length > 1;
            return isHyperOrAbility
                ? n.childNodes[0].childNodes
                      .filter((_, i) => i % 2 === 0)
                      .map((c) => c.text)
                      .join('\n')
                : n.text.replaceAll(',', '').trim();
        });
        const [statAtkLow, statAtkHigh] = statAtks.split(' ~ ');

        return {
            statAtkLow: parseInt(statAtkLow.trim()),
            statAtkHigh: parseInt(statAtkHigh.trim()),
            hp: parseInt(hp),
            mp: parseInt(mp),
            str: parseInt(str),
            dex: parseInt(dex),
            int: parseInt(int),
            luk: parseInt(luk),
            // dmg: 0, // not provided
            critDmg: parseInt(critDmg),
            bossDmg: parseInt(bossDmg),
            ignoreDef: parseInt(ignoreDef),
            resistance: parseInt(resistance),
            stance: parseInt(stance),
            def: parseInt(def),
            speed: parseInt(speed),
            jump: parseInt(jump),
            starForce: parseInt(starForce),
            arcaneForce: parseInt(arcaneForce),
            // authenticForce: 0, // not provided
            hypers: this.parseHypers(hyper),
            abilities: this.parseAbilities(ability),
        };
    }

    private parseHypers(hyper: string): Stats {
        const hypers: Stats = {};
        hyper.split('\n').forEach((line) => {
            const value = parseInt(line.replace(/[^\d]/g, ''));
            if (line.startsWith('힘')) {
                hypers.str = value;
            } else if (line.startsWith('민첩성')) {
                hypers.dex = value;
            } else if (line.startsWith('지력')) {
                hypers.int = value;
            } else if (line.startsWith('운')) {
                hypers.luk = value;
            } else if (line.startsWith('최대 HP')) {
                hypers.hpP = value;
            } else if (line.startsWith('크리티컬 확률')) {
                hypers.crit = value;
            } else if (line.startsWith('크리티컬 데미지')) {
                hypers.critDmg = value;
            } else if (line.startsWith('공격력')) {
                hypers.atk = value;
                hypers.mAtk = value;
            } else if (line.startsWith('보스')) {
                hypers.bossDmg = value;
            } else if (line.startsWith('일반')) {
                hypers.mobDmg = value;
            } else if (line.startsWith('데미지')) {
                hypers.dmg = value;
            } else if (line.startsWith('방어율')) {
                hypers.ignoreDef = value;
            } else if (line.startsWith('아케인')) {
                hypers.arcane = value;
            } else if (line.startsWith('획득 경험치')) {
                hypers.exp = value / 10;
            }
        });
        return hypers;
    }

    private parseAbilities(ability: string): Stats {
        const abilities: Stats = {};
        ability.split('\n').forEach((stat) => {
            const value = parseInt(stat.replace(/[^\d]/g, ''));
            if (stat.includes('패시브')) {
                abilities.passive = 1;
            } else if (stat.includes('보스')) {
                abilities.bossDmg = value;
            } else if (stat.includes('레벨마다 공격력')) {
                abilities.lvNAtk = value;
            } else if (stat.includes('레벨마다 마력')) {
                abilities.lvNmAtk = value;
            } else if (stat.includes('재사용 대기시간')) {
                abilities.reuse = value;
            } else if (stat.includes('AP')) {
                // FIXME: AP에 투자한 %만큼 증가
            } else if (stat.includes('공격력')) {
                abilities.atk = value;
            } else if (stat.includes('마력')) {
                abilities.mAtk = value;
            } else if (stat.includes('크리')) {
                abilities.crit = value;
            } else if (stat.includes('최대 HP')) {
                if (stat.includes('%')) {
                    abilities.hpP = value;
                } else {
                    abilities.hp = value;
                }
            } else if (stat.includes('모든 능력치')) {
                abilities.allStat = value;
            } else if (stat.includes('상태 이상에')) {
                abilities.statusDmg = value;
            } else if (stat.includes('버프')) {
                abilities.buff = value;
            } else if (stat.includes('메소')) {
                abilities.meso = value;
            } else if (stat.includes('아이템')) {
                abilities.drop = value;
            } else {
                for (const defaultStat of ['str', 'dex', 'int', 'luk'] as Stat[]) {
                    stat.split(',').forEach((line) => {
                        if (line.includes(defaultStat.toUpperCase())) {
                            const value = parseInt(line.replace(/[^\d]/g, ''));
                            abilities[defaultStat] = (abilities[defaultStat] || 0) + value;
                        }
                    });
                }
            }
        });
        return abilities;
    }
}
