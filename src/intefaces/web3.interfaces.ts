export interface EtherMailSignInOnSuccessEvent extends Event {
  detail: {
    token: string;
  };
}

export interface EtherMailTokenErrorEvent extends Event {
  detail: {
    type: "expired" | "permissions";
  };
}

export interface Chain {
  name: string;
  chainId: number;
}

export type SSOPermissionType = "write" | "read" | "none";