export type AuthStatus =
  | "authenticated"
  | "anonymous"
  | "authenticating"
  | "loading";

type TokenType = {
  accessToken: string;
  refreshToken: string;
  expiredAt: Date;
};

type TokenStoreType = {
  get: () => string | null;
  set: (val: string) => void;
  clear: () => void;
};

export type ClientContextType = {
  status: AuthStatus;
  login: <R>(
    path: string,
    body: { username: string; password: string },
    successCallback: (returnValue: R) => void,
    failureCallback?: () => void
  ) => void;
  get: <R>(
    path: string,
    successCallback: (returnValue: R) => void,
    toJson?: boolean,
    failureCallback?: () => void
  ) => () => void;
  post: (
    path: string,
    data: {},
    successCallback: ((createdId: string) => void) | (() => void),
    failureCallback: () => void
  ) => () => void;
  put: (
    path: string,
    data: {},
    successCallback: () => void,
    failureCallback: () => void
  ) => () => void;
  patch: (
    path: string,
    data: {},
    successCallback: () => void,
    failureCallback: () => void
  ) => () => void;
  deletion: (
    path: string,
    data: {},
    successCallback: () => void,
    failureCallback: (errorMessage: string) => void
  ) => () => void;
  setStatus: (status: AuthStatus) => void;
  refreshTokenStore: TokenStoreType;
};

export type ProviderStateType =
  | {
      status: "authenticated";
    }
  | {
      status: "anonymous";
      hasError: boolean;
    }
  | {
      status: "authenticating";
    }
  | {
      status: "loading";
    };

export type ValidationErrorMessage = {
  message: string;
  parameters: {
    value: any;
  };
};

export type ValidationError = {
  message: string;
};

export type ValidationErrors = {
  [key: string]: ValidationError[];
};

export type RegisterBodyType = {
  customer_name: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  conversation_id: string | null;
};

export type ForgotPasswordType = {
  email: string;
};

export type ResetPasswordType = {
  password: string;
};