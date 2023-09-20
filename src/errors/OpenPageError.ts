export class OpenPageError extends Error {
    constructor(title: string) {
        super(`${title} 페이지 열기 오류`);
        this.name = 'OpenPageError';
    }
}
