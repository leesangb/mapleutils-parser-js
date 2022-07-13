import axios from 'axios';
import { MAPLESTORY_RANKING_SEARCH } from '../constants/links';
import { EquipmentParser } from '../parsers/equipment';
import { EquipmentLinks, HomePageParser } from '../parsers/homepage';
import { Equipment } from '../types/Equipment';


export class Requester {
    private homePageParser: HomePageParser;
    private equipmentParser: EquipmentParser;

    constructor(homePageParser: HomePageParser, equipmentParser: EquipmentParser) {
        this.homePageParser = homePageParser;
        this.equipmentParser = equipmentParser;
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

        const equipmentLink = this.homePageParser.getEquipmentPageLink(characterSpecPage.data);
        const petLink = this.homePageParser.getPetPageLink(characterSpecPage.data);

        console.log({ characterLink, equipmentLink, petLink });

        return characterLink;
    }

    async getEquipments(equipmentLink: string): Promise<EquipmentLinks> {
        const equipmentPage = await axios.get<string>(equipmentLink);
        if (equipmentPage.status !== 200)
            throw '장비 패이지를 열기 오류';
        this.homePageParser.ensureIsPublic(equipmentPage.data);

        const equipmentLinks = this.homePageParser.getEquipmentLinks(equipmentPage.data);
        const baseHtml: string[] = await this.getAllHtmls(equipmentLinks.base);
        //const cash: string[] = await this.getAllHtmls(equipmentLinks.cash);
        //const symbols: string[] = await this.getAllHtmls(equipmentLinks.symbol);

        const base: Equipment[] = baseHtml.map(html => this.equipmentParser.parse(html)).filter(e => !!e) as Equipment[];
        console.log(base);
        return equipmentLinks;
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