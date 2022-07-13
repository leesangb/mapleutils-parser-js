import { EquipmentParser } from './parsers/equipment';
import { HomePageParser } from './parsers/homepage';
import { Requester } from './requester';

const homePage = new HomePageParser();
const equipment = new EquipmentParser();
const requester = new Requester(homePage, equipment);

// requester.searchCharacter('상빈')
//     .then((s) => console.log(s));

requester.getEquipments('https://maplestory.nexon.com/Common/Character/Detail/%EC%83%81%EB%B9%88/Equipment?p=mikO8qgdC4hElCwBGQ6GOx8CmO11EvduZkV0bRbPAhZiOiS%2b8d6XszJu642rpuIzPU9TCkdHZxNrAcs0I4Fz2GfLN8kbuYRhVQAmM2DTrdTq5VZeAG8D0jwA1w4VDDjMIksEZVLHaU8pndsZdYFO2eS46exJfappHQ8Bd3QWa8Q%3d#a')
    .then((links) => console.log(links.base.length));
