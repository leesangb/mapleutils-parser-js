import { HTMLElement } from 'node-html-parser';
import { Equipment } from '../types/Equipment';
import { Potential, POTENTIAL_GRADE_MAPPING, PotentialGrade } from '../types/Potential';
import { Stat, STAT_MAPPING } from '../types/Stat';

const HTMLParser = require('node-html-parser');

const ITEM_NAME_SELECTOR = 'div.item_memo_title > h1';
const ITEM_IMAGE_SELECTOR = 'div.item_img > img';
const ITEM_CATEGORY_SELECTOR = 'div.item_ability > div:nth-child(3) > span > em';
const ITEM_OPTIONS_SELECTOR = 'div.stet_info > ul > li';
const ITEM_GRADE_SELECTOR = 'div.item_title > div.item_memo > div.item_memo_sel';

type EquipmentStat = Record<'base' | 'scroll' | 'flame', Partial<Record<Stat, number>>>;
type EquipmentOption = EquipmentStat & { potential?: Potential, additional?: Potential, soul?: [Stat, number] }

export class EquipmentParser {
    /**
     * 장비 정보 html에서 장비 효과를 파싱하여 반환
     * @param equipmentHtml 장비 html
     */
    parse(equipmentHtml: string): Equipment | null {
        const node: HTMLElement = HTMLParser.parse(equipmentHtml);

        const { name, upgrade, star } = this.parseName(node);
        const imageUrl = this.parseImage(node);
        const category = this.parseCategory(node);
        const { base, scroll, flame, potential, additional, soul } = this.parseOptions(node);
        const grade = this.parseGrade(node);

        return {
            name,
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
        };
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
            if (!name || name === '공격속도' || name === '기타')
                continue;

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
            if (name.startsWith('Max') && statNode.text.includes('%')) {
                const stat: Stat = name === 'MaxHP'
                    ? 'hpP'
                    : 'mpP';
                option.base[stat] = parseInt(statNode.text.trim());
                option.flame[stat] = 0;
                option.scroll[stat] = 0;
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
        return gradeText
            ? POTENTIAL_GRADE_MAPPING[gradeText] || 'nothing'
            : 'nothing';
    }

    private parseStat(name: string, node: HTMLElement): Record<'base' | 'scroll' | 'flame', [Stat, number]> {
        const stat = STAT_MAPPING[name];
        const line = node.innerText.trim();
        const parenthesisIndex = line.indexOf('(');
        if (parenthesisIndex < 0) {
            return {
                base: [stat, parseInt(line)],
                scroll: [stat, 0],
                flame: [stat, 0],
            };
        }

        const [base, flame, scroll] = line
            .substring(parenthesisIndex + 1, line.length - 1)
            .split('+')
            .map(v => parseInt(v.trim()));

        return {
            base: [stat, base || 0],
            scroll: [stat, scroll || 0],
            flame: [stat, flame || 0],
        };
    }

    private parseSoul(node: HTMLElement): [Stat, number] | undefined {
        const textNode = node.childNodes[2];
        if (!textNode)
            return;

        const option = textNode.text.split(':').map(s => s.trim());
        if (option.length !== 2)
            return;
        const [name, value] = option;
        const stat = STAT_MAPPING[name];
        if (!stat)
            return;

        return [stat, parseInt(value)];
    }

    private parsePotential(nameNode: HTMLElement, valueNode: HTMLElement): Potential | undefined {
        const gradeName = nameNode.querySelector('font')?.text;
        if (!gradeName)
            return;


        const effects = valueNode.childNodes
            .filter((_, i) => i % 2 === 0)
            .map(n => {
                const [name, value] = n.text.split(':');
                const statName = name.trim() + (value?.includes('%') ? '%' : '');

                const stat = STAT_MAPPING[statName];
                if (!stat) {
                    return null;
                }

                return [stat, parseInt(value)];
            })
            .filter(e => e) as [Stat, number][];

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

    private parseName(node: HTMLElement): { name: string, upgrade: number, star: number } {
        const h1 = node.querySelector(ITEM_NAME_SELECTOR);
        if (!h1)
            throw '올바른 html 노드가 아닙니다';

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
        const [name, upgrade] = nameNode.text
            .replaceAll('&nbsp;', '')
            .split('(+');

        return {
            name: name.trim(),
            upgrade: parseInt(upgrade?.trim() || '0'),
            star: parseInt(starNode?.text.trim() || '0'),
        };
    }
}