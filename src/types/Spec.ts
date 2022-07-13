import { Stat } from './Stat';

export interface Spec {
    /**
     * 앞 스공
     */
    statAtkLow: number;
    /**
     * 뒷 스공
     */
    statAtkHigh: number;
    /**
     * HP
     */
    hp: number;
    /**
     * MP
     */
    mp: number;
    /**
     * 힘
     */
    str: number;
    /**
     * 덱
     */
    dex: number;
    /**
     * 인
     */
    int: number;
    /**
     * 럭
     */
    luk: number;
    /**
     * 크리 데미지
     */
    critDmg: number;
    /**
     * 보스 데미지
     */
    bossDmg: number;
    /**
     * 방어율 무시
     */
    ignoreDef: number;
    /**
     * 데미지
     */
    dmg: number;
    /**
     * 상태이상 내성
     */
    resistance: number;
    /**
     * 스탠스
     */
    stance: number;
    /**
     * 방어력
     */
    def: number;
    /**
     * 이동속도
     */
    speed: number;
    /**
     * 점프력
     */
    jump: number;
    /**
     * 스타포스
     */
    starForce: number;
    /**
     * 아케인포스
     */
    arcaneForce: number;
    /**
     * @deprecated 어센틱포스 (⚠ 아직 공식 홈페이지에 추가되지 않아서 사용불가)
     */
    authenticForce: number;
    /**
     * 어빌리티
     */
    abilities: Record<Stat, number>;
    /**
     * 하이퍼스탯
     */
    hypers: Record<Stat, number>;
}