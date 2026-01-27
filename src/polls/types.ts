import { Request } from 'express';
export type CreatePollFields = {
  topic: string;
  votesPerVoter: number;
  name: string;
};

export type JoinPollFields = {
  pollID: string;
  name: string;
};

export type RejoinPollFields = {
  pollID: string;
  userID: string;
  name: string;
};

export type CreatePollData = {
  pollID: string;
  topic: string;
  votesPerVoter: number;
  userID: string;
};


export type AddParticipantData = {
  pollID: string;
  userID: string;
  name: string;
};

export type AddParticipantRankingsData = {
  pollID: string;
  userID: string;
  nomination: string;
  name:string
};

export type SubmitRankingsFields = {
  pollID: string;
  userID: string;
  name:string
  nomination: string;
};


export type AuthPayload = {
  userID: string;
  pollID: string;
  name: string;
};
export type RequestWithAuth = Request & AuthPayload;