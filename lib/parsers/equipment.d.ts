import { CashEquipment, Equipment } from '../types/Equipment';
import { Symbol } from '../types/Symbol';
export declare class EquipmentParser {
    /**
     * 장비 정보 html에서 장비 효과를 파싱하여 반환
     * @param equipmentHtml 장비 html
     */
    parseBase(equipmentHtml: string): Equipment;
    /**
     * 장비 정보 html에서 캐시 장비 효과를 파싱하여 반환
     * @param equipmentHtml 장비 html
     */
    parseCash(equipmentHtml: string): CashEquipment;
    /**
     * 장비 정보 html에서 심볼 장비 효과를 파싱하여 반환
     * @param equipmentHtml 장비 html
     */
    parseSymbol(equipmentHtml: string): Symbol;
    private parseSymbolOptions;
    private parseOptions;
    private parseGrade;
    private parseStat;
    private parseSoul;
    private parsePotential;
    private parseCategory;
    private parseImage;
    private parseName;
}
