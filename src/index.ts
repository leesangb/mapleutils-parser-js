import { MAPLESTORY_RANKING_SEARCH } from './constants/links';
import { EquipmentParser } from './parsers/equipment';
import { GeneralInformationParser } from './parsers/general';
import { HomePageParser } from './parsers/homepage';
import { SpecParser } from './parsers/spec';
import { Character } from './types/Character';
import { CashEquipment, Equipment, Equipments } from './types/Equipment';
import { Symbol } from './types/Symbol';

export class MapleUtilsParser {
    private homePageParser: HomePageParser;
    private equipmentParser: EquipmentParser;
    private specParser: SpecParser;
    private generalInformationParser: GeneralInformationParser;

    constructor(homePageParser: HomePageParser,
        equipmentParser: EquipmentParser,
        specParser: SpecParser,
        generalInformationParser: GeneralInformationParser) {
        this.homePageParser = homePageParser;
        this.equipmentParser = equipmentParser;
        this.specParser = specParser;
        this.generalInformationParser = generalInformationParser;
    }

    static new(): MapleUtilsParser {
        const homePage = new HomePageParser();
        const equipment = new EquipmentParser();
        const spec = new SpecParser();
        const generalInformation = new GeneralInformationParser();
        return new MapleUtilsParser(homePage, equipment, spec, generalInformation);
    }

    async getCharacter({
        name, cash = true, pet = true, equip = true, symbol = true,
    }: { name: string, cash: boolean, pet: boolean, equip: boolean, symbol: boolean }): Promise<Character> {
        console.log(`${name} --> ranking search`);
        const rankingSearch = await fetch(`${MAPLESTORY_RANKING_SEARCH}?c=${encodeURI(name)}`);
        if (rankingSearch.status !== 200)
            throw `'${name}' 공식 홈페이지 랭킹 검색 오류`;

        const searchData = await rankingSearch.text();

        let characterLink  = '';

        try {
            characterLink = this.homePageParser.getCharacterLink(name, searchData);
        } catch (e) {
            const rebootSearch = await fetch(`${MAPLESTORY_RANKING_SEARCH}?c=${encodeURI(name)}&w=254`);
            if (rankingSearch.status !== 200)
                throw `'${name}' 공식 홈페이지 랭킹 검색 오류`;
            const rebootSearchData = await rebootSearch.text();
            characterLink = this.homePageParser.getCharacterLink(name, rebootSearchData);
        }

        console.log(`${name} --> character page`);
        const characterSpecPage = await fetch(characterLink);
        if (characterSpecPage.status !== 200)
            throw `'${name}' 캐릭터 정보 페이지 열기 오류`;

        const specPageData = await characterSpecPage.text();
        this.homePageParser.ensureIsPublic(specPageData, '기본 정보');

        const spec = this.specParser.parse(specPageData);
        const generalInformation = this.generalInformationParser.parse(specPageData);

        const equipmentLink = this.homePageParser.getEquipmentPageLink(specPageData);
        const petLink = this.homePageParser.getPetPageLink(specPageData);

        console.log(`${name} --> equipments`);
        const [equipments, petEquipments] = await Promise.all([
            this.getEquipments(equipmentLink, equip, cash, symbol),
            pet ? this.getPetEquipments(petLink) : undefined
        ]);

        return {
            ...generalInformation,
            spec,
            equipments: equipments.base,
            arcanes: equipments.symbol,
            cashEquipments: equipments.cash,
            // authentics: [],
            petEquipments,
        };
    }

    async getEquipments(equipmentLink: string, e: boolean, c: boolean, s: boolean): Promise<Equipments> {
        const equipmentPage = await fetch(equipmentLink);
        if (equipmentPage.status !== 200)
            throw '장비 페이지 열기 오류';
        const equipmentPageData = await equipmentPage.text();
        this.homePageParser.ensureIsPublic(equipmentPageData, '장비');

        const equipmentLinks = this.homePageParser.getEquipmentLinks(equipmentPageData);
        const [baseHtml, cashHtml, symbolHtml] = await Promise.all([
            e ? this.getAllHtmls(equipmentLinks.base) : undefined,
            c ? this.getAllHtmls(equipmentLinks.cash) : undefined,
            s ? this.getAllHtmls(equipmentLinks.symbol) : undefined,
        ]);

        const base: Equipment[] | undefined = baseHtml?.map((html) => this.equipmentParser.parseBase(html)).filter(e => !!e);
        const cash: CashEquipment[] | undefined = cashHtml?.map((html) => this.equipmentParser.parseCash(html)).filter(e => !!e);
        const symbol: Symbol[] | undefined = symbolHtml?.map((html) => this.equipmentParser.parseSymbol(html)).filter(e => !!e);

        return {
            base,
            cash,
            symbol,
        };
    }

    async getPetEquipments(petEquipmentLink: string): Promise<CashEquipment[]> {
        const equipmentPage = await fetch(petEquipmentLink);
        if (equipmentPage.status !== 200)
            throw '펫장비 페이지 열기 오류';

        const equipmentPageData = await equipmentPage.text();
        this.homePageParser.ensureIsPublic(equipmentPageData, '펫');

        const equipmentLinks: string[] = this.homePageParser.getPetEquipmentLinks(equipmentPageData);
        const equipmentHtml = await this.getAllHtmls(equipmentLinks);
        return equipmentHtml.map(html => this.equipmentParser.parseCash(html)).filter(e => !!e) as CashEquipment[];
    }

    private async getAllHtmls(links: string[]): Promise<string[]> {
        const htmls = await Promise.all(links.map(link => {
            return fetch(link, { headers: { 'X-Requested-With': 'XMLHttpRequest' } })
                .then(response => {
                    if (response.status !== 200) {
                        console.log(`'${link}' 정보를 가져오는데 실패했습니다`, response.status);
                        throw null;
                    }
                    return response.json();
                })
                .then((data) => {
                    if (!data.view) {
                        console.log(`'${link}' 정보를 가져오는데 실패했습니다`, data);
                    }
                    return data.view;
                })
                .catch(() => null);
        }));
        return htmls.filter(Boolean);
    }
}
