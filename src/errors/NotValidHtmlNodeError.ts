import HTMLParser, { HTMLElement } from 'node-html-parser';

export class NotValidHtmlNodeError extends Error {
    constructor(public node: HTMLElement, public selector: string) {
        super('올바른 HTML 노드가 아닙니다');
        this.name = 'NotValidHtmlNodeError';
    }
}
