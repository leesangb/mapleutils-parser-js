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

// requester.searchCharacter('상빈')
//     .then((links) => console.log(links.length));

requester.getEquipments('https://maplestory.nexon.com/Common/Character/Detail/Lilly/Equipment?p=mikO8qgdC4hElCwBGQ6GOx8CmO11EvduZkV0bRbPAhb4ju7wDUqT65UjguKUmknr6Yq8PucaLHcF0AHbQqMu0Fa8vQ2Mz%2fQEUjH5HNWhFNd5oZIZUW7AXfwY8QRBl69KsBHINBfoz6laVZGWio2nbapFdzburV3LlcLbUtnJiD0k1dpZTEbsifmHYvhfkpZ3#a')
    .then((e) => {
        console.log(e.base, e.cash, e.symbol);
    });
