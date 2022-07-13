export interface GeneralInformation {
    /**
     * 캐릭터 이름
     */
    name: string;
    /**
     * 월드
     */
    world: string;
    /**
     * 직업
     */
    job: string;
    /**
     * 레벨
     */
    level: number;
    /**
     * 캐릭터 이미지 url
     */
    imageUrl: string;
    /**
     * 성향
     */
    traits: Traits;
}

export interface Traits {
    /**
     * 카리스마
     */
    ambition: number;
    /**
     * 통찰력
     */
    insight: number;
    /**
     * 의지
     */
    willpower: number;
    /**
     * 손재주
     */
    diligence: number;
    /**
     * 감성
     */
    empathy: number;
    /**
     * 매력
     */
    charm: number;
}