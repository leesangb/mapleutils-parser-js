import { EquipmentParser } from './parsers/equipment';
import { GeneralInformationParser } from './parsers/general';
import { HomePageParser } from './parsers/homepage';
import { SpecParser } from './parsers/spec';
import { Requester } from './requester';

const homePage = new HomePageParser();
const equipment = new EquipmentParser();
const spec = new SpecParser();
const generalInformation = new GeneralInformationParser();
const requester = new Requester(homePage, equipment, spec, generalInformation);

// requester.searchCharacter('상빈')
//     .then((s) => console.log(s));

requester.searchCharacter('상빈')
    .then((links) => console.log(links.length));
