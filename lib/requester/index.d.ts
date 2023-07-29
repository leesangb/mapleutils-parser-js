import { EquipmentParser } from '../parsers/equipment';
import { GeneralInformationParser } from '../parsers/general';
import { HomePageParser } from '../parsers/homepage';
import { SpecParser } from '../parsers/spec';
import { Character } from '../types/Character';
import { CashEquipment, Equipments } from '../types/Equipment';
export declare class MapleUtilsParser {
    private homePageParser;
    private equipmentParser;
    private specParser;
    private generalInformationParser;
    constructor(homePageParser: HomePageParser, equipmentParser: EquipmentParser, specParser: SpecParser, generalInformationParser: GeneralInformationParser);
    static new(): MapleUtilsParser;
    getCharacter(name: string): Promise<Character>;
    getEquipments(equipmentLink: string): Promise<Equipments>;
    getPetEquipments(petEquipmentLink: string): Promise<CashEquipment[]>;
    private getAllHtmls;
}
