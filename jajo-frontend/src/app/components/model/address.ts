export interface GetAddress {
  id: number;
  name: string;
  hierarchy: number;
  isMrMrs: boolean;
  read_only: boolean;
}

export interface PostAddress {
  id: number;
  name: string;
  hierarchy: number;
  isMrMrs: boolean;
}
