export class NotFoundError extends Error {
    constructor(item: string) {
        super(`캐릭터 ${item}을(를) 찾을 수 없습니다`);
        this.name = 'NotFoundError';
    }
}
