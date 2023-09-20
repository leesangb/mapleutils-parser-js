export class RankingSearchError extends Error {
    constructor(public characterName: string) {
        super(`'${characterName}' 공식 홈페이지 랭킹 검색 오류`);
        this.name = 'RankingSearchError';
    }
}
