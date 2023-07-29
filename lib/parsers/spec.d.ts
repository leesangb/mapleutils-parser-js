import { Spec } from '../types/Spec';
export declare class SpecParser {
    /**
     * 캐릭터 정보 페이지 html에서 스펙을 파싱하여 반환
     * @param specPageHtml
     */
    parse(specPageHtml: string): Spec;
    private parseHypers;
    private parseAbilities;
}
