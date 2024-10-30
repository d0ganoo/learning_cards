export type AuthStatus =
  | "authenticated"
  | "anonymous"
  | "authenticating"
  | "loading";

export type TokenType = {
  accessToken: string;
  refreshToken: string;
  expiredAt: Date;
};

export type TokenStoreType = {
  get: () => string | null;
  set: (val: string) => void;
  clear: () => void;
};

// Mise à jour du ClientContextType pour correspondre au nouveau contexte avec promesses
export type ClientContextType = {
  status: AuthStatus;
  login: <R = any>(
    path: string,
    body: { username: string; password: string }
  ) => Promise<R>; // Renvoie une promesse avec le type de retour générique R
  get: <R = any>(
    path: string,
    toJson?: boolean
  ) => Promise<R>; // Renvoie une promesse avec le type de retour générique R
  post: <R = any>(
    path: string,
    data: {}
  ) => Promise<R>; // Renvoie une promesse avec le type de retour générique R
  put: <R = any>(
    path: string,
    data: {}
  ) => Promise<R>; // Renvoie une promesse avec le type de retour générique R
  patch: <R = any>(
    path: string,
    data: {}
  ) => Promise<R>; // Renvoie une promesse avec le type de retour générique R
  deletion: (path: string) => Promise<void>; // Renvoie une promesse pour les suppressions, qui n’a pas de retour spécifique
  setStatus: (status: AuthStatus) => void;
  refreshTokenStore: TokenStoreType;
};

// Mise à jour de ProviderStateType pour inclure les états du fournisseur
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

// Type pour les messages d'erreurs de validation
export type ValidationErrorMessage = {
  message: string;
  parameters: {
    value: any;
  };
};

// Définition des erreurs de validation
export type ValidationError = {
  message: string;
};

export type ValidationErrors = {
  [key: string]: ValidationError[];
};

// Types des corps de requêtes pour des actions spécifiques (comme enregistrement, réinitialisation du mot de passe, etc.)
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
