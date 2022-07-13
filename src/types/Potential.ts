import { Stat } from './Stat';

const potentialGrades = [
    'nothing',
    'rare',
    'epic',
    'unique',
    'legendary',
    'special',
] as const;

export type PotentialGrade = typeof potentialGrades[number];

export interface Potential {
    grade: PotentialGrade;
    effects: [Stat, number][];
}