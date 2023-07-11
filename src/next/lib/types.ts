export type SearchParams = {
  service: string;
  exploit: string;
  team: string;
  status: string;
  flag: string;
  tick: number;
  since: string;
  until: string;
  checksystem_response: string;
};

export type SearchValues = { services: string[]; exploits: string[]; teams: string[]; statuses: string[] };

export type GameInfo = { flagFormat: string };
