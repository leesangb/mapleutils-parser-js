import { EquipmentParser } from './parsers/equipment';
import { HomePageParser } from './parsers/homepage';
import { SpecParser } from './parsers/spec';
import { Requester } from './requester';

const homePage = new HomePageParser();
const equipment = new EquipmentParser();
const spec = new SpecParser();
const requester = new Requester(homePage, equipment, spec);

// requester.searchCharacter('상빈')
//     .then((s) => console.log(s));

requester.searchCharacter('상빈')
    .then((links) => console.log(links.length));
