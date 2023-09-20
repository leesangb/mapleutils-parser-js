export class RetryError extends Error {
    constructor(item: string) {
        super(`${item} 재시도를 실패 했습니다`);
        this.name = 'RetryError';
    }
}
