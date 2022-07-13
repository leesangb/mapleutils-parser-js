import axios from 'axios';
import { MAPLESTORY_RANKING_SEARCH } from '../constants/links';
import { HomePageParser } from '../parsers/homepage';


export class Requester {
    private homePageParser: HomePageParser;

    constructor(homePageParser: HomePageParser) {
        this.homePageParser = homePageParser;
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
            throw `${name} 캐릭터 정보 페이지 열기 오류`;

        this.homePageParser.ensureIsPublic(characterSpecPage.data);

        const equipmentLink = this.homePageParser.getEquipmentLink(characterSpecPage.data);
        const petLink = this.homePageParser.getPetLink(characterSpecPage.data);

        console.log({ characterLink, equipmentLink, petLink });

        return characterLink;
    }
}