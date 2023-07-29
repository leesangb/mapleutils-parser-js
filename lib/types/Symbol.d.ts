import { Stat } from './Stat';
export interface Symbol {
    /**
     * 심볼 이름
     */
    name: string;
    /**
     * 스탯 목록
     */
    stat: Partial<Record<Stat, number>>;
    /**
     * 레벨
     */
    level: number;
    /**
     * 현제 경험치
     */
    experience: number;
    /**
     * 레벨업에 필요한 경험치
     */
    requiredExperience: number;
}
