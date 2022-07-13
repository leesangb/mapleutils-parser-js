import { HTMLElement } from 'node-html-parser';
import { Equipment } from '../types/Equipment';
import { Potential } from '../types/Potential';
import { Stat, STAT_MAPPING } from '../types/Stat';

const HTMLParser = require('node-html-parser');

const ITEM_NAME_SELECTOR = 'div.item_memo_title > h1';
const ITEM_IMAGE_SELECTOR = 'div.item_img > img';
const ITEM_CATEGORY_SELECTOR = 'div.item_ability > div:nth-child(3) > span > em';
const ITEM_OPTIONS_SELECTOR = 'div.stet_info > ul > li';

type EquipmentStat = Record<'base' | 'scroll' | 'flame', Partial<Record<Stat, number>>>;
type EquipmentOption = EquipmentStat & { potential?: Potential, additional?: Potential, soul?: [Stat, number] }

export class EquipmentParser {
    parse(equipmentHtml: string): Partial<Equipment> | null {
        const node: HTMLElement = HTMLParser.parse(equipmentHtml);

        const { name, upgrade, star } = this.parseName(node);
        const imageUrl = this.parseImage(node);
        const category = this.parseCategory(node);
        const { base, scroll, flame, potential, additional, soul } = this.parseOptions(node);

        return {
            name,
            imageUrl,
            category,
            upgrade,
            base,
            scroll,
            //     grade,
            star,
            //     potential,
            //     additional,
            flame,
            //     soul,
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
            const name = optionNode.querySelector('div.stet_th')?.text.trim();
            if (!name || name === '공격속도' || name === '기타')
                continue;

            const statNode = optionNode.querySelector('div.point_td')!;

            if (name.startsWith('잠재')) {
                option.potential = this.parsePotential(statNode);
                continue;
            }
            if (name.startsWith('에디')) {
                option.additional = this.parsePotential(statNode);
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

    private parseSoul(node: HTMLElement): [Stat, number] {
        return ['str', 0];
    }

    private parsePotential(node: HTMLElement): Potential {
        return {
            grade: 'nothing',
            effects: [],
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
        const e = node.querySelector(ITEM_NAME_SELECTOR);
        const text = e?.innerText || '';

        let name = text;
        let star = '0';
        let upgrade = '0';

        const starForceIndex = text.lastIndexOf('성 강화');
        if (starForceIndex > 0) {
            name = text.substring(0, starForceIndex - 2);
            star = text.substring(starForceIndex - 2, starForceIndex);
        }

        const upgradeIndex = text.lastIndexOf('(+');
        if (upgradeIndex > 0) {
            name = text.substring(0, upgradeIndex - 1);
            upgrade = text.substring(upgradeIndex + 2, text.lastIndexOf(')'));
        }

        return {
            name: name.replaceAll('&nbsp;', '').trim(),
            upgrade: parseInt(upgrade.trim()),
            star: parseInt(star.trim()),
        };
    }
}