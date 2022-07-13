import axios from 'axios';
import { MAPLESTORY_RANKING_SEARCH } from '../constants/links';
import { EquipmentParser } from '../parsers/equipment';
import { GeneralInformationParser } from '../parsers/general';
import { HomePageParser } from '../parsers/homepage';
import { SpecParser } from '../parsers/spec';
import { CashEquipment, Equipment, Equipments } from '../types/Equipment';
import { Symbol } from '../types/Symbol';


export class Requester {
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

    async searchCharacter(name: string): Promise<string> {
        const rankingSearch = await axios.get<string>(`${MAPLESTORY_RANKING_SEARCH}?c=${encodeURI(name)}`);
        if (rankingSearch.status !== 200)
            throw `'${name}' 공식 홈페이지 랭킹 검색 오류`;

        const characterLink = this.homePageParser.getCharacterLink(name, rankingSearch.data);
        if (!characterLink)
            throw `'${name}' 캐릭터를 찾을 수 없습니다`;

        const characterSpecPage = await axios.get<string>(characterLink);
        if (characterSpecPage.status !== 200)
            throw `'${name}' 캐릭터 정보 페이지 열기 오류`;

        this.homePageParser.ensureIsPublic(characterSpecPage.data);

        const spec = this.specParser.parse(characterSpecPage.data);
        const generalInformation = this.generalInformationParser.parse(characterSpecPage.data);
        console.log(spec, generalInformation);

        const equipmentLink = this.homePageParser.getEquipmentPageLink(characterSpecPage.data);
        const petLink = this.homePageParser.getPetPageLink(characterSpecPage.data);

        //console.log({ characterLink, equipmentLink, petLink });

        return characterLink;
    }

    async getEquipments(equipmentLink: string): Promise<Equipments> {
        const equipmentPage = await axios.get<string>(equipmentLink);
        if (equipmentPage.status !== 200)
            throw '장비 페이지 열기 오류';
        this.homePageParser.ensureIsPublic(equipmentPage.data);

        const equipmentLinks = this.homePageParser.getEquipmentLinks(equipmentPage.data);
        const baseHtml: string[] = await this.getAllHtmls(equipmentLinks.base);
        const cashHtml: string[] = await this.getAllHtmls(equipmentLinks.cash);
        const symbolHtml: string[] = await this.getAllHtmls(equipmentLinks.symbol);

        const base: Equipment[] = baseHtml.map((html) => this.equipmentParser.parseBase(html)).filter(e => !!e) as Equipment[];
        const cash: CashEquipment[] = cashHtml.map((html) => this.equipmentParser.parseCash(html)).filter(e => !!e) as CashEquipment[];
        const symbol: Symbol[] = symbolHtml.map((html) => this.equipmentParser.parseSymbol(html)).filter(e => !!e) as Symbol[];

        return {
            base,
            cash,
            symbol,
        };
    }

    async getPetEquipments(petEquipmentLink: string): Promise<CashEquipment[]> {
        const equipmentPage = await axios.get<string>(petEquipmentLink);
        if (equipmentPage.status !== 200)
            throw '펫장비 페이지 열기 오류';

        const equipmentLinks: string[] = this.homePageParser.getPetEquipmentLinks(equipmentPage.data);
        const equipmentHtml = await this.getAllHtmls(equipmentLinks);
        return equipmentHtml.map(html => this.equipmentParser.parseCash(html)).filter(e => !!e) as CashEquipment[];
    }

    private async getAllHtmls(links: string[]): Promise<string[]> {
        const contents: string[] = [];
        const timeout = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
        const random = (min: number, max: number) => Math.floor(Math.random() * (max - min) + min);
        for (const link of links) {
            // 봇 방지, 랜덤성을 높혀야 할 수도 있음
            await timeout(random(200, 400));
            // 메이플스토리 공식 홈페이지에서 클릭으로 정보를 가져오는 링크는 헤더에 {'X-Requested-With': 'XMLHttpRequest'}를 추가 해야됩니다.
            const response = await axios.get<{ view: string }>(link, { headers: { 'X-Requested-With': 'XMLHttpRequest' } });
            if (response.status !== 200)
                continue;
            contents.push(response.data.view);
        }
        return contents;
    }
}