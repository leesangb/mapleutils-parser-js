export class NotValidSpecPageError extends Error {
    constructor() {
        super('올바른 캐릭터 정보 페이지가 아닙니다');
        this.name = 'InvalidSpecPageError';
    }
}
