export interface userObject {
  username: string;
  id: number;
  pp: number;
}

export interface scoreType {
  user: {
    id: number;
    username: string;
  };
  score: {
    pp: number;
    title: string;
    playID: number;
    accuracy: number;
    mods: string[];
    passed: boolean;
    statistics: {
      ctMiss: number;
      ct50: number;
      ct100: number;
      ct300: number;
    };
  };
}
