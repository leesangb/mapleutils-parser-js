import HTMLParser, { HTMLElement } from 'node-html-parser';
import { NotValidHtmlNodeError } from '../errors';
import { CashEquipment, Equipment } from '../types/Equipment';
import { Potential, POTENTIAL_GRADE_MAPPING, PotentialGrade } from '../types/Potential';
import { Stat, STAT_MAPPING, Stats } from '../types/Stat';
import { Symbol } from '../types/Symbol';

const ITEM_NAME_SELECTOR = 'div.item_memo_title > h1';
const ITEM_IMAGE_SELECTOR = 'div.item_img > img';
const ITEM_CATEGORY_SELECTOR = 'div.item_ability > div:nth-child(3) > span > em';
const ITEM_LEVEL_SELECTOR = 'div.item_ability > div:nth-child(1) > ul > li:nth-child(1) > em';
const ITEM_OPTIONS_SELECTOR = 'div.stet_info > ul > li';
const ITEM_GRADE_SELECTOR = 'div.item_title > div.item_memo > div.item_memo_sel';

type EquipmentStat = Record<'base' | 'scroll' | 'flame', Stats>;
type EquipmentOption = EquipmentStat & {
    potential?: Potential;
    additional?: Potential;
    soul?: Stats;
    scissors?: number;
};
type SymbolOption = Record<'level' | 'experience' | 'requiredExperience', number>;

export class EquipmentParser {
    /**
     * 장비 정보 html에서 장비 효과를 파싱하여 반환
     * @param equipmentHtml 장비 html
     */
    parseBase(equipmentHtml: string): Equipment {
        const node: HTMLElement = HTMLParser.parse(equipmentHtml);

        const { name, upgrade, star } = this.parseName(node, equipmentHtml);
        const level = this.parseLevel(node);
        const imageUrl = this.parseImage(node);
        const category = this.parseCategory(node);
        const { base, scroll, flame, potential, additional, soul, scissors } = this.parseOptions(node);
        const grade = this.parseGrade(node);

        return {
            name,
            level,
            imageUrl,
            category,
            upgrade,
            base,
            scroll,
            grade,
            star,
            potential,
            additional,
            flame,
            soul,
            scissors,
        };
    }

    /**
     * 장비 정보 html에서 캐시 장비 효과를 파싱하여 반환
     * @param equipmentHtml 장비 html
     */
    parseCash(equipmentHtml: string): CashEquipment {
        const node: HTMLElement = HTMLParser.parse(equipmentHtml);

        const { name, upgrade } = this.parseName(node, equipmentHtml);
        const imageUrl = this.parseImage(node);
        const category = this.parseCategory(node);
        const { base, scroll } = this.parseOptions(node);

        return {
            name,
            upgrade,
            imageUrl,
            category,
            scroll,
            base,
        };
    }

    /**
     * 장비 정보 html에서 심볼 장비 효과를 파싱하여 반환
     * @param equipmentHtml 장비 html
     */
    parseSymbol(equipmentHtml: string): Symbol {
        const node: HTMLElement = HTMLParser.parse(equipmentHtml);

        const { name } = this.parseName(node, equipmentHtml);
        const { scroll } = this.parseOptions(node);
        const rest = this.parseSymbolOptions(node);

        return {
            name: name,
            stat: scroll!,
            ...rest,
        };
    }

    private parseSymbolOptions(node: HTMLElement): SymbolOption {
        const [levelNode, experienceNode]: HTMLElement[] = node.querySelectorAll(ITEM_OPTIONS_SELECTOR);
        const level = levelNode.querySelector('div.point_td')?.text || '0';
        const experiences = experienceNode.querySelector('div.point_td')?.text;
        const [experience, requiredExperience] = experiences?.split('/') || ['0', '0'];
        return {
            level: parseInt(level),
            experience: parseInt(experience),
            requiredExperience: parseInt(requiredExperience),
        };
    }

    private parseLevel(node: HTMLElement): number {
        return Number.parseInt(node.querySelector(ITEM_LEVEL_SELECTOR)?.text.trim() ?? '0');
    }

    private parseOptions(node: HTMLElement): EquipmentOption {
        const optionNodes: HTMLElement[] = node.querySelectorAll(ITEM_OPTIONS_SELECTOR);

        const option: EquipmentOption = {
            base: {},
            scroll: {},
            flame: {},
        };
        for (const optionNode of optionNodes) {
            const nameNode = optionNode.querySelector('div.stet_th')!;
            const name = nameNode.text.trim();
            if (!name || name === '공격속도' || name === '기타') continue;

            const statNode = optionNode.querySelector('div.point_td')!;

            if (name.startsWith('잠재')) {
                option.potential = this.parsePotential(nameNode, statNode);
                continue;
            }
            if (name.startsWith('에디')) {
                option.additional = this.parsePotential(nameNode, statNode);
                continue;
            }
            if (name.startsWith('소울')) {
                option.soul = this.parseSoul(statNode);
                continue;
            }
            if (name.startsWith('가위 사용')) {
                option.scissors = parseInt(statNode.text.trim());
                continue;
            }
            if (name.startsWith('Max') && statNode.text.includes('%')) {
                const stat: Stat = name === 'MaxHP' ? 'hpP' : 'mpP';
                option.base[stat] = parseInt(statNode.text.trim());
                continue;
            }
            if (name.startsWith('올') && statNode.text.includes('%')) {
                const { base, scroll, flame } = this.parseStat(name, statNode);
                option.base.allStatP = base[1];
                option.scroll.allStatP = scroll[1];
                option.flame.allStatP = flame[1];
                continue;
            }
            if (STAT_MAPPING[name]) {
                const { base, scroll, flame } = this.parseStat(name, statNode);
                option.base[base[0]] = base[1];
                option.scroll[scroll[0]] = scroll[1];
                option.flame[flame[0]] = flame[1];
            }
        }

        return option;
    }

    private parseGrade(node: HTMLElement): PotentialGrade {
        const gradeText = node.querySelector(ITEM_GRADE_SELECTOR)?.text.trim();
        return gradeText ? POTENTIAL_GRADE_MAPPING[gradeText] || 'nothing' : 'nothing';
    }

    private parseStat(
        name: string,
        node: HTMLElement
    ): Record<'base' | 'scroll' | 'flame', [Stat, number | undefined]> {
        const stat = STAT_MAPPING[name];
        const line = node.innerText.trim();
        const parenthesisIndex = line.indexOf('(');
        if (parenthesisIndex < 0) {
            return {
                base: [stat, parseInt(line)],
                scroll: [stat, undefined],
                flame: [stat, undefined],
            };
        }

        const [base, flame, scroll] = line
            .substring(parenthesisIndex + 1, line.length - 1)
            .split('+')
            .map((v: string) => parseInt(v.trim()));

        return {
            base: [stat, base || undefined],
            scroll: [stat, scroll || undefined],
            flame: [stat, flame || undefined],
        };
    }

    private parseSoul(node: HTMLElement): Stats | undefined {
        const textNode = node.childNodes[2];
        if (!textNode) return;

        const option = textNode.text.split(':').map((s: string) => s.trim());
        if (option.length !== 2) return;
        const [name, value] = option;
        const stat = STAT_MAPPING[name];
        if (!stat) return;

        return { [stat]: parseInt(value) };
    }

    private parsePotential(nameNode: HTMLElement, valueNode: HTMLElement): Potential | undefined {
        const gradeName = nameNode.querySelector('font')?.text;
        if (!gradeName) return;

        const effects = valueNode.childNodes
            .filter((_: any, i: number) => i % 2 === 0)
            .map((n: { text: string }) => {
                const [name, value] = n.text.split(':');
                const statName = name.trim() + (value?.includes('%') ? '%' : '');

                const stat = STAT_MAPPING[statName];
                if (!stat) {
                    return null;
                }

                return { [stat]: parseInt(value) };
            })
            .filter((e: any) => e) as Record<Stat, number>[];

        return {
            grade: POTENTIAL_GRADE_MAPPING[gradeName] || 'nothing',
            effects,
        };
    }

    private parseCategory(node: HTMLElement): string {
        const categoryNode = node.querySelector(ITEM_CATEGORY_SELECTOR);
        return categoryNode?.text?.trim() || '';
    }

    private parseImage(node: HTMLElement): string {
        const imageNode = node.querySelector(ITEM_IMAGE_SELECTOR);
        return imageNode?.attrs['src'] || '';
    }

    private parseName(node: HTMLElement, html: string): { name: string; upgrade: number; star: number } {
        const h1 = node.querySelector(ITEM_NAME_SELECTOR);
        if (!h1) {
            console.log(html);
            throw new NotValidHtmlNodeError(node, ITEM_NAME_SELECTOR);
        }

        const hasSoulWeapon = h1.childNodes.length > 3;
        if (hasSoulWeapon) {
            // remove blank
            h1.childNodes.shift();
            // remove soul weapon name
            h1.childNodes.shift();
            // remove blank
            h1.childNodes.shift();
        }
        const [nameNode, starNode] = h1.childNodes;
        const [name, upgrade] = nameNode.text.replaceAll('&nbsp;', '').split('(+');

        return {
            name: name.trim(),
            upgrade: parseInt(upgrade?.trim() || '0'),
            star: parseInt(starNode?.text.trim() || '0'),
        };
    }
}
