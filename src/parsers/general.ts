import HTMLParser, { HTMLElement } from 'node-html-parser';
import { NotValidSpecPageError, NotFoundError } from '../errors';
import { GeneralInformation, Traits } from '../types/GeneralInformation';

const CHARACTER_TABLE_DATA_SELECTOR =
    'div.con_wrap > div.contents_wrap > div > div.tab01_con_wrap > table:nth-child(2) > tbody > tr > td';
const CHARACTER_NAME_SELECTOR = 'div.char_info_top > div.char_name > span';
const CHARACTER_LEVEL_SELECTOR = 'div.char_info_top > div.char_info > dl:nth-child(1) > dd';
const CHARACTER_IMAGE_SELECTOR = 'div.char_info_top > div.char_info > div.char_img > div > img';
const CHARACTER_TRAITS_SELECTOR =
    'div.con_wrap > div.contents_wrap > div > div.tab02_con_wrap > div > ul > li > div > div.graph_wrap > div > span';

export class GeneralInformationParser {
    parse(specPageHtml: string): GeneralInformation {
        const node: HTMLElement = HTMLParser.parse(specPageHtml);
        const data = node.querySelectorAll(CHARACTER_TABLE_DATA_SELECTOR);
        if (!data || data.length !== 6) throw new NotValidSpecPageError();

        const [
            world,
            job,
            popularity,
            guild,
            // meso,
            // maplePoint,
        ] = data.map((n) => n.text.replaceAll(',', '').trim());

        return {
            name: this.parseName(node),
            world,
            guild,
            job: job.split('/')[1].trim(),
            level: this.parseLevel(node),
            imageUrl: this.parseImageUrl(node),
            traits: this.parseTraits(node),
        };
    }

    private parseName(node: HTMLElement): string {
        const name = node.querySelector(CHARACTER_NAME_SELECTOR)?.text;
        if (!name) throw new NotFoundError('이름');
        return name.substring(0, name.length - 1);
    }

    private parseLevel(node: HTMLElement): number {
        const level = node.querySelector(CHARACTER_LEVEL_SELECTOR)?.text.replace(/[^\d]/g, '');
        if (!level) throw new NotFoundError('레벨');
        return parseInt(level);
    }

    private parseImageUrl(node: HTMLElement): string {
        const imageUrl = node.querySelector(CHARACTER_IMAGE_SELECTOR)?.attrs['src'];
        if (!imageUrl) throw new NotFoundError('이미지');
        return imageUrl;
    }

    private parseTraits(node: HTMLElement): Traits {
        const traitNodes = node.querySelectorAll(CHARACTER_TRAITS_SELECTOR);
        if (traitNodes.length !== 6) throw new NotFoundError('성향');

        const [ambition, insight, willpower, diligence, empathy, charm] = traitNodes.map((n) => parseInt(n.text));
        return {
            ambition,
            insight,
            willpower,
            diligence,
            empathy,
            charm,
        };
    }
}
