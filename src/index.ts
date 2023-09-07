import { MAPLESTORY_RANKING_SEARCH } from './constants/links';
import { EquipmentParser } from './parsers/equipment';
import { GeneralInformationParser } from './parsers/general';
import { HomePageParser } from './parsers/homepage';
import { SpecParser } from './parsers/spec';
import { Character } from './types/Character';
import { CashEquipment, Equipment, Equipments } from './types/Equipment';
import { Symbol } from './types/Symbol';

type EquipmentsResult = {
    success: Equipments;
    error: { [key in keyof Equipments]?: () => Promise<NonNullable<Equipments[key]>> };
};

type CashEquipmentsResult = {
    success: CashEquipment[];
    error?: () => Promise<CashEquipment[]>;
};

export class MapleUtilsParser {
    private homePageParser: HomePageParser;
    private equipmentParser: EquipmentParser;
    private specParser: SpecParser;
    private generalInformationParser: GeneralInformationParser;

    constructor(
        homePageParser: HomePageParser,
        equipmentParser: EquipmentParser,
        specParser: SpecParser,
        generalInformationParser: GeneralInformationParser
    ) {
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

    private async getCharacterInfo({
        name,
        cash,
        pet,
        equip,
        symbol,
    }: {
        name: string;
        cash: boolean;
        pet: boolean;
        equip: boolean;
        symbol: boolean;
    }) {
        console.log(`${name} --> ranking search`);
        const characterLink = await this.getCharacterLink(name);

        console.log(`${name} --> character page`);
        const characterSpecPage = await this.getSpecPage(characterLink);

        const spec = this.specParser.parse(characterSpecPage);
        const generalInformation = this.generalInformationParser.parse(characterSpecPage);

        const equipmentLink = this.homePageParser.getEquipmentPageLink(characterSpecPage);
        const petLink = this.homePageParser.getPetPageLink(characterSpecPage);

        console.log(`${name} --> equipments`);
        const [equipments, petEquipments] = await Promise.all([
            this.getEquipments(equipmentLink, equip, cash, symbol),
            pet ? this.getPetEquipments(petLink) : undefined,
        ]);

        return {
            spec,
            generalInformation,
            equipments,
            petEquipments,
        };
    }

    async getCharacter({
        name,
        cash = true,
        pet = true,
        equip = true,
        symbol = true,
    }: {
        name: string;
        cash?: boolean;
        pet?: boolean;
        equip?: boolean;
        symbol?: boolean;
    }): Promise<Character> {
        const { spec, generalInformation, equipments, petEquipments } = await this.getCharacterInfo({
            name,
            cash,
            pet,
            equip,
            symbol,
        });

        return {
            ...generalInformation,
            spec,
            equipments: equipments?.success.base,
            arcanes: equipments?.success.symbol,
            cashEquipments: equipments?.success.cash,
            // authentics: [],
            petEquipments: petEquipments?.success,
        };
    }

    async getCharacterWithErrors({
        name,
        cash = true,
        pet = true,
        equip = true,
        symbol = true,
    }: {
        name: string;
        cash?: boolean;
        pet?: boolean;
        equip?: boolean;
        symbol?: boolean;
    }) {
        const { spec, generalInformation, equipments, petEquipments } = await this.getCharacterInfo({
            name,
            cash,
            pet,
            equip,
            symbol,
        });

        const hasError = [
            equipments?.error?.base,
            equipments?.error?.symbol,
            equipments?.error?.cash,
            petEquipments?.error,
        ].some((e) => !!e);

        return {
            data: {
                ...generalInformation,
                spec,
                equipments: equipments?.success.base,
                arcanes: equipments?.success.symbol,
                cashEquipments: equipments?.success.cash,
                // authentics: [],
                petEquipments: petEquipments?.success,
            },
            errors: hasError
                ? {
                      equipments: equipments?.error?.base,
                      arcanes: equipments?.error?.symbol,
                      cashEquipments: equipments?.error?.cash,
                      petEquipments: petEquipments?.error,
                  }
                : undefined,
        };
    }

    private async getCharacterLink(name: string): Promise<string> {
        const rankingSearch = await fetch(`${MAPLESTORY_RANKING_SEARCH}?c=${encodeURI(name)}`);
        if (rankingSearch.status !== 200) throw `'${name}' 공식 홈페이지 랭킹 검색 오류`;

        const searchData = await rankingSearch.text();
        let characterLink = '';
        try {
            characterLink = this.homePageParser.getCharacterLink(name, searchData);
        } catch (e) {
            const rebootSearch = await fetch(`${MAPLESTORY_RANKING_SEARCH}?c=${encodeURI(name)}&w=254`);
            if (rankingSearch.status !== 200) throw `'${name}' 공식 홈페이지 랭킹 검색 오류`;
            const rebootSearchData = await rebootSearch.text();
            characterLink = this.homePageParser.getCharacterLink(name, rebootSearchData);
        }
        return characterLink;
    }

    private async getSpecPage(characterLink: string): Promise<string> {
        const characterSpecPage = await fetch(characterLink);
        if (characterSpecPage.status !== 200) throw '캐릭터 정보 페이지 열기 오류';

        const specPageData = await characterSpecPage.text();
        this.homePageParser.ensureIsPublic(specPageData, '기본 정보');

        return specPageData;
    }

    private async getEquipments(equipmentLink: string, e: boolean, c: boolean, s: boolean): Promise<EquipmentsResult> {
        const equipmentPage = await fetch(equipmentLink);
        if (equipmentPage.status !== 200) throw '장비 페이지 열기 오류';
        const equipmentPageData = await equipmentPage.text();
        this.homePageParser.ensureIsPublic(equipmentPageData, '장비');

        const equipmentLinks = this.homePageParser.getEquipmentLinks(equipmentPageData);
        const [baseHtml, cashHtml, symbolHtml] = await Promise.all([
            e ? this.getAllHtmls(equipmentLinks.base) : undefined,
            c ? this.getAllHtmls(equipmentLinks.cash) : undefined,
            s ? this.getAllHtmls(equipmentLinks.symbol) : undefined,
        ]);

        const failedBaseLinks = baseHtml?.error;
        const failedCashLinks = cashHtml?.error;
        const failedSymbolLinks = symbolHtml?.error;

        const base: Equipment[] | undefined = baseHtml?.success
            ?.map((html) => this.equipmentParser.parseBase(html))
            .filter((e) => !!e);
        const cash: CashEquipment[] | undefined = cashHtml?.success
            ?.map((html) => this.equipmentParser.parseCash(html))
            .filter((e) => !!e);
        const symbol: Symbol[] | undefined = symbolHtml?.success
            ?.map((html) => this.equipmentParser.parseSymbol(html))
            .filter((e) => !!e);

        return {
            success: {
                base,
                cash,
                symbol,
            },
            error: {
                base: failedBaseLinks?.length
                    ? () =>
                          this.getAllHtmls(failedBaseLinks).then(({ success, error }) => {
                              if (error.length) {
                                  throw 'base 재시도 실패';
                              }
                              return success.map(this.equipmentParser.parseBase);
                          })
                    : undefined,
                cash: failedCashLinks?.length
                    ? () =>
                          this.getAllHtmls(failedCashLinks).then(({ success, error }) => {
                              if (error.length) {
                                  throw 'cash 재시도 실패';
                              }
                              return success.map(this.equipmentParser.parseCash);
                          })
                    : undefined,
                symbol: failedSymbolLinks?.length
                    ? () =>
                          this.getAllHtmls(failedSymbolLinks).then(({ success, error }) => {
                              if (error.length) {
                                  throw 'symbol 재시도 실패';
                              }
                              return success.map(this.equipmentParser.parseSymbol);
                          })
                    : undefined,
            },
        };
    }

    private async getPetEquipments(petEquipmentLink: string): Promise<CashEquipmentsResult> {
        const equipmentPage = await fetch(petEquipmentLink);
        if (equipmentPage.status !== 200) throw '펫장비 페이지 열기 오류';

        const equipmentPageData = await equipmentPage.text();
        this.homePageParser.ensureIsPublic(equipmentPageData, '펫');

        const equipmentLinks: string[] = this.homePageParser.getPetEquipmentLinks(equipmentPageData);
        const equipmentHtml = await this.getAllHtmls(equipmentLinks);

        return {
            success: equipmentHtml.success.map((html) => this.equipmentParser.parseCash(html)).filter((e) => !!e),
            error: equipmentHtml.error?.length
                ? () =>
                      this.getAllHtmls(equipmentHtml.error).then(({ success, error }) => {
                          if (error.length) {
                              throw '펫 장비 재시도 실패';
                          }
                          return success.map(this.equipmentParser.parseCash);
                      })
                : undefined,
        };
    }

    private async getAllHtmls(links: string[]): Promise<{ success: string[]; error: string[] }> {
        const failedLinks: string[] = links;
        const htmls: string[] = [];

        let count = 0;

        while (failedLinks.length > 0 && count < 5) {
            if (count) {
                console.log(`시도 횟수: ${count}, 남은 링크 수: ${failedLinks.length} ${count}초후 재시도`);
                await new Promise((resolve) => setTimeout(resolve, 1000 * count));
            }

            const requests = failedLinks.map((link) =>
                fetch(link, { headers: { 'X-Requested-With': 'XMLHttpRequest' } })
                    .then((response) => {
                        if (response.status !== 200) {
                            console.log(`'${link}' 정보를 가져오는데 실패했습니다`, response.status);
                            throw null;
                        }
                        return response.json();
                    })
                    .then((data) => {
                        if (!data.view) {
                            return;
                        }
                        htmls.push(data.view);
                        failedLinks.splice(failedLinks.indexOf(link), 1);
                    })
            );

            await Promise.allSettled(requests);
            count++;
        }

        return { success: htmls, error: failedLinks };
    }
}
