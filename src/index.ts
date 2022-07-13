import { HomePageParser } from './parsers/homepage';
import { Requester } from './requester';

const homePage = new HomePageParser();
const requester = new Requester(homePage);

requester.searchCharacter('상빈')
    .then((s) => console.log(s));
