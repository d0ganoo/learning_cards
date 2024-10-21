export type Email = {
    confirmed: boolean;
    email: string;
    hard_bounce: boolean;
    id: string;
  };
  
  export type CustomerRole = {
    created_at: string;
    id: string;
    model_type: "role";
    name: string;
    type: string;
    updated_at: string;
  };
  
  export type UserKanbanListType = {
    demands: KanbanType;
    volunteers: KanbanType;
  };
  
  export type KanbanType = {
    columns: Array<KanbanColumnType>;
    id: string;
    type: string;
  };
  
  export type KanbanColumnType = {
    id: string;
    name: string;
    position: number;
  };
  
  export type PrimaryEmail = {
    id: string;
    email: string;
  };
  
  export type UserDataContextType =
    | {
        id: string;
        name: string;
        first_name: string;
        last_name: string;
        primary_email: PrimaryEmail;
        customer: {
          id: string;
          name: string;
          type: string;
          description: string;
          avatar: {
            id: string;
            name: string;
            url: {
              original: string;
              small: string;
              medium: string;
              large: string;
            };
          };
          cover: {
            id: string;
            name: string;
            url: {
              original: string;
              small: string;
              medium: string;
              large: string;
            };
          };
          phones: Array<{
            phone: string;
          }>;
          places: Array<any>;
          emails: Array<Email>;
          kanbans: Array<KanbansType>;
          subscription_type: string;
        };
        customer_role: CustomerRole;
        avatar: {
          id: string;
          name: string;
          url: {
            original: string;
            small: string;
            medium: string;
            large: string;
          };
        };
      }
    | undefined;
  
  export type UserContextType = {
    user: UserDataContextType;
    refreshUser: () => void;
  };