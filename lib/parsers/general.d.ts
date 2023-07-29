import { GeneralInformation } from '../types/GeneralInformation';
export declare class GeneralInformationParser {
    parse(specPageHtml: string): GeneralInformation;
    private parseName;
    private parseLevel;
    private parseImageUrl;
    private parseTraits;
}
