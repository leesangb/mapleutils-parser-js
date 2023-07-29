import { Stat } from './Stat';
declare const potentialGrades: readonly ["nothing", "rare", "epic", "unique", "legendary", "special"];
export declare type PotentialGrade = typeof potentialGrades[number];
export interface Potential {
    grade: PotentialGrade;
    effects: [Stat, number][];
}
export declare const POTENTIAL_GRADE_MAPPING: Readonly<Record<string, PotentialGrade>>;
export {};
