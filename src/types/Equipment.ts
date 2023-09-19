import { Potential, PotentialGrade } from './Potential';
import { Stats } from './Stat';
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
    base: Stats;
    /**
     * 작 스탯
     */
    scroll: Stats;
    /**
     * 가위 사용 가능 횟수
     */
    scissors?: number;
}

export interface Equipment extends EquipmentBase {
    /**
     * 레벨제한
     */
    level: number;
    /**
     * 총 등급
     */
    grade: PotentialGrade;
    /**
     * 스타포스
     */
    star?: number;
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
    flame: Stats;
    /**
     * 소울
     */
    soul?: Stats;
}

export interface CashEquipment extends EquipmentBase {}

export interface Equipments {
    base?: Equipment[];
    cash?: CashEquipment[];
    symbol?: Symbol[];
}
