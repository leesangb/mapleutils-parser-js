import HTMLParser, { HTMLElement as NhpHTMLElement } from 'node-html-parser';
import { MAPLESTORY_HOME } from '../constants/links';

const CHARACTER_LINKS_SELECTOR = 'div.rank_table_wrap > table > tbody > tr > td.left > dl > dt > a';
const EQUIPMENT_LINK_SELECTOR = '#container > div.con_wrap > div.lnb_wrap > ul > li:nth-child(3) > a';
const PET_LINK_SELECTOR = '#container > div.con_wrap > div.lnb_wrap > ul > li:nth-child(10) > a';

const BASE_EQUIPMENT_LINKS_SELECTOR = '#container > div.con_wrap > div.contents_wrap > div > div.tab01_con_wrap > div.weapon_wrap > ul > li a';
const CASH_EQUIPMENT_LINKS_SELECTOR = '#container > div.con_wrap > div.contents_wrap > div > div.tab02_con_wrap > div.cash_weapon_wrap > ul > li a';
const SYMBOL_EQUIPMENT_LINKS_SELECTOR = '#container > div.con_wrap > div.contents_wrap > div > div.tab03_con_wrap > div.arcane_weapon_wrap > ul > li a';
const PET_EQUIPMENT_LINKS_SELECTOR = '#container > div.con_wrap > div.contents_wrap > div > div.tab02_con_wrap > div > ul > li > h2 > span > a';

export interface EquipmentLinks {
    base: string[];
    cash: string[];
    symbol: string[];
}

/**
 * 공식 홈페이지 html에서 링크 파싱
 */
export class HomePageParser {
    /**
     * 공식홈페이지 랭킹페이지에서 캐릭터를 검색하고 찾으면 해당 캐릭터 링크를 반환
     * @param name 검색할 캐릭터 닉네임 (영어가 포함된 경우 대소문자를 구분하지 않음)
     * @param rankingPageHtml 열려있는 랭킹 페이지 html
     */
    getCharacterLink(name: string, rankingPageHtml: string): string {
        const node = HTMLParser.parse(rankingPageHtml);
        const links: NhpHTMLElement[] = node.querySelectorAll(CHARACTER_LINKS_SELECTOR);
        const link = links.find((linkNode: NhpHTMLElement) => linkNode.innerText.toLowerCase() === name.toLowerCase());
        if (!link)
            throw '올바른 랭킹 링크가 아니거나 캐릭터를 찾을 수 없습니다';
        return `${MAPLESTORY_HOME}${link.attrs['href']}`;
    }

    /**
     * 정보가 비공개일시 에러를 던짐
     * @param html 열려있는 페이지 html
     */
    ensureIsPublic(html: string, scope: string) {
        const node = HTMLParser.parse(html);
        const privateDiv: NhpHTMLElement | null = node.querySelector('div.private2');
        if (privateDiv)
            throw `캐릭터 정보가 비공개입니다 (${scope})`;
    }

    /**
     * 캐릭터 정보 페이지에서 장비 링크를 반환
     * @param characterLinkPageHtml 캐릭터 정보 페이지 html
     */
    getEquipmentPageLink(characterLinkPageHtml: string): string {
        const node = HTMLParser.parse(characterLinkPageHtml);
        const link = node.querySelector(EQUIPMENT_LINK_SELECTOR);
        if (!link)
            throw '올바른 캐릭터 정보 페이지가 아닙니다';
        return `${MAPLESTORY_HOME}${link.attrs['href']}`;
    }

    /**
     * 캐릭터 정보 페이지에서 펫 링크를 반환
     * @param characterLinkPageHtml 캐릭터 정보 페이지 html
     */
    getPetPageLink(characterLinkPageHtml: string): string {
        const node = HTMLParser.parse(characterLinkPageHtml);
        const link = node.querySelector(PET_LINK_SELECTOR);
        if (!link)
            throw '올바른 캐릭터 정보 페이지가 아닙니다';
        return `${MAPLESTORY_HOME}${link.attrs['href']}`;
    }

    /**
     * 장비 정보 페이지에서 착용중인 기본 아이템, 캐시 아이템, 아케인 심볼 링크들을 반환
     * @param equipmentPageHtml 캐릭터 장비 정보 페이지 html
     */
    getEquipmentLinks(equipmentPageHtml: string): EquipmentLinks {
        const node = HTMLParser.parse(equipmentPageHtml);
        const baseLinks: NhpHTMLElement[] = node.querySelectorAll(BASE_EQUIPMENT_LINKS_SELECTOR);
        const cashLinks: NhpHTMLElement[] = node.querySelectorAll(CASH_EQUIPMENT_LINKS_SELECTOR);
        const symbolLinks: NhpHTMLElement[] = node.querySelectorAll(SYMBOL_EQUIPMENT_LINKS_SELECTOR);

        return {
            base: baseLinks.map(e => `${MAPLESTORY_HOME}${e.attrs['href']}`).filter(url => url !== MAPLESTORY_HOME),
            cash: cashLinks.map(e => `${MAPLESTORY_HOME}${e.attrs['href']}`).filter(url => url !== MAPLESTORY_HOME),
            symbol: symbolLinks.map(e => `${MAPLESTORY_HOME}${e.attrs['href']}`).filter(url => url !== MAPLESTORY_HOME),
        };
    }

    /**
     * 펫 장비 정보 페이지에서 착용중인 펫장비 아이템 링크들을 반환
     * @param petEquipmentPageHtml 펫 정보 페이지 html
     */
    getPetEquipmentLinks(petEquipmentPageHtml: string): string[] {
        const node = HTMLParser.parse(petEquipmentPageHtml);
        const links: NhpHTMLElement[] = node.querySelectorAll(PET_EQUIPMENT_LINKS_SELECTOR);
        return links.map(e => `${MAPLESTORY_HOME}${e.attrs['href']}`).filter(url => url !== MAPLESTORY_HOME);
    }
}
