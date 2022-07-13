import { Potential, PotentialGrade } from './Potential';
import { Stat } from './Stat';
import { Symbol } from './Symbol';

export interface EquipmentBase {
    /**
     * 이름
     */
    name: string;
    /**
     * 이미지 링크
     */
    imageUrl: string;
    /**
     * 종류
     */
    category: string;
    /**
     * 업그레이드 횟수
     */
    upgrade: number;
    /**
     * 기본 스탯
     */
    base: Partial<Record<Stat, number>>;
    /**
     * 작 스탯
     */
    scroll: Partial<Record<Stat, number>>;
}

export interface Equipment extends EquipmentBase {
    /**
     * 총 등급
     */
    grade: PotentialGrade;
    /**
     * 스타포스
     */
    star: number;
    /**
     * 잠재능력
     */
    potential?: Potential;
    /**
     * 에디셔널 잠재능력
     */
    additional?: Potential;
    /**
     * 추가옵션
     */
    flame: Partial<Record<Stat, number>>;
    /**
     * 소울
     */
    soul?: [Stat, number];
}

export interface CashEquipment extends Omit<EquipmentBase, 'scroll' | 'upgrade'> {
}

export interface Equipments {
    base: Equipment[];
    cash: CashEquipment[];
    symbol: Symbol[];
}