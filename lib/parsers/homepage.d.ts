export interface EquipmentLinks {
    base: string[];
    cash: string[];
    symbol: string[];
}
/**
 * 공식 홈페이지 html에서 링크 파싱
 */
export declare class HomePageParser {
    /**
     * 공식홈페이지 랭킹페이지에서 캐릭터를 검색하고 찾으면 해당 캐릭터 링크를 반환
     * @param name 검색할 캐릭터 닉네임 (영어가 포함된 경우 대소문자를 구분하지 않음)
     * @param rankingPageHtml 열려있는 랭킹 페이지 html
     */
    getCharacterLink(name: string, rankingPageHtml: string): string;
    /**
     * 정보가 비공개일시 에러를 던짐
     * @param html 열려있는 페이지 html
     */
    ensureIsPublic(html: string): void;
    /**
     * 캐릭터 정보 페이지에서 장비 링크를 반환
     * @param characterLinkPageHtml 캐릭터 정보 페이지 html
     */
    getEquipmentPageLink(characterLinkPageHtml: string): string;
    /**
     * 캐릭터 정보 페이지에서 펫 링크를 반환
     * @param characterLinkPageHtml 캐릭터 정보 페이지 html
     */
    getPetPageLink(characterLinkPageHtml: string): string;
    /**
     * 장비 정보 페이지에서 착용중인 기본 아이템, 캐시 아이템, 아케인 심볼 링크들을 반환
     * @param equipmentPageHtml 캐릭터 장비 정보 페이지 html
     */
    getEquipmentLinks(equipmentPageHtml: string): EquipmentLinks;
    /**
     * 펫 장비 정보 페이지에서 착용중인 펫장비 아이템 링크들을 반환
     * @param petEquipmentPageHtml 펫 정보 페이지 html
     */
    getPetEquipmentLinks(petEquipmentPageHtml: string): string[];
}
