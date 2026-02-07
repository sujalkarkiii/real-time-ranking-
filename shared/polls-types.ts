export type Participants = {
    [participantID: string]: string;
}

export type Nominations = string[];
export type Rankings = {
    [userID: string]: number;
};

export type Results = Array<{
  nomination: string
    score: number,
}>;



export type Poll = {
    id: string;
    topic: string;
    votesPerVoter: number;
    participants: Participants;
    adminID: string;
    nominations: Nominations;
    rankings: Rankings;
    to_vote:string[]
    results: Results;
    hasStarted: boolean;
}