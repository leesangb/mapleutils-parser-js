import { Stats } from './Stat';

const potentialGrades = ['nothing', 'rare', 'epic', 'unique', 'legendary', 'special'] as const;

export type PotentialGrade = (typeof potentialGrades)[number];

export interface Potential {
    grade: PotentialGrade;
    effects: Stats[];
}

export const POTENTIAL_GRADE_MAPPING: Readonly<Record<string, PotentialGrade>> = {
    ['레어아이템']: 'rare',
    ['에픽아이템']: 'epic',
    ['유니크아이템']: 'unique',
    ['레전드리아이템']: 'legendary',
    ['스페셜아이템']: 'special',
    ['레어']: 'rare',
    ['에픽']: 'epic',
    ['유니크']: 'unique',
    ['레전드리']: 'legendary',
    ['스페셜']: 'special',
};
