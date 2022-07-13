const HTMLParser = require('node-html-parser');
import { HTMLElement as NhpHTMLElement } from 'node-html-parser';
import { MAPLESTORY_HOME } from '../constants/links';

const CHARACTER_LINKS_SELECTOR = 'div.rank_table_wrap > table > tbody > tr > td.left > dl > dt > a';
const EQUIPMENT_LINK_SELECTOR = '#container > div.con_wrap > div.lnb_wrap > ul > li:nth-child(3) > a';
const PET_LINK_SELECTOR = '#container > div.con_wrap > div.lnb_wrap > ul > li:nth-child(10) > a';

/**
 * 공식 홈페이지 html에서 링크 파싱
 */
export class HomePageParser {
    /**
     * 공식홈페이지 랭킹페이지에서 캐릭터를 검색하고 찾으면 해당 캐릭터 링크를 반환
     * @param name 검색할 캐릭터 닉네임 (영어가 포함된 경우 대소문자를 구분하지 않음)
     * @param rankingPageHtml 열려있는 랭킹 페이지 html
     */
    getCharacterLink(name: string, rankingPageHtml: string): string | null {
        const node = HTMLParser.parse(rankingPageHtml);
        const links: NhpHTMLElement[] = node.querySelectorAll(CHARACTER_LINKS_SELECTOR);
        const link = links.find((linkNode: NhpHTMLElement) => linkNode.innerText.toLowerCase() === name.toLowerCase());
        return link
            ? `${MAPLESTORY_HOME}${link.attrs['href']}`
            : null;
    }

    /**
     * 정보가 비공개일시 에러를 던짐
     * @param html 열려있는 페이지 html
     */
    ensureIsPublic(html: string) {
        const node = HTMLParser.parse(html);
        const privateDiv: NhpHTMLElement | null = node.querySelector('div.private2');
        if (privateDiv)
            throw `캐릭터 정보가 비공개입니다`;
    }

    /**
     * 캐릭터 정보 페이지에서 장비 링크를 반환
     * @param characterLinkPageHtml 캐릭터 정보 페이지 html
     */
    getEquipmentLink(characterLinkPageHtml: string): string | null {
        const node = HTMLParser.parse(characterLinkPageHtml);
        const link = node.querySelector(EQUIPMENT_LINK_SELECTOR);
        return link
            ? `${MAPLESTORY_HOME}${link.attrs['href']}`
            : null;
    }

    /**
     * 캐릭터 정보 페이지에서 펫 링크를 반환
     * @param characterLinkPageHtml 캐릭터 정보 페이지 html
     */
    getPetLink(characterLinkPageHtml: string): string | null {
        const node = HTMLParser.parse(characterLinkPageHtml);
        const link = node.querySelector(PET_LINK_SELECTOR);
        return link
            ? `${MAPLESTORY_HOME}${link.attrs['href']}`
            : null;
    }
}