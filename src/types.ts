export interface RoomDto {
    roomCode: string
    auserName: string | null
    buserName: string | null
    judgeUserName: string | null
}

export interface SpecialMoveDeckDto {
    id: number;
    userId: string;
    deckId: number;
    spName: string;
    furigana: string;
    heading: string;
    description: string;
    imageName: string;
    registedTime: string;
    battleCount: number;
    winCount: number;
    loseCount: number;
}

export interface SpecialMoveDto {
    id: number;
    userId: string;
    spName: string;
    furigana: string;
    heading: string;
    description: string;
    imageName: string;
    registedTime: string;
    battleCount: number;
    winCount: number;
    loseCount: number;
}