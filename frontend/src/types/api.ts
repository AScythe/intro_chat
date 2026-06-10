// api.ts
// Description: TypeScript interfaces for API request/response payloads

export interface CreateEventResponse {
  event_id: string;
  rooms: string[];
}

export interface Room {
  id: string;
  name: string;
  selected: boolean;
  is_default: boolean;
}

export interface Topic {
  id: string;
  name: string;
  selected: boolean;
  is_default: boolean;
}

export interface EventConfigResponse {
  rooms: Room[];
  topics: Topic[];
}

export interface JoinEventResponse {
  user_id: string;
  username: string;
}

export interface QRResponse {
  qr_code: string;
}

export interface UserData {
  id?: string;
  name: string;
  available: boolean;
  status: string;
  linkedin_url?: string;
  slack_handle?: string;
  is_sample: boolean;
}

export interface RoomUsersResponse {
  users: UserData[];
}

export interface RequestChatResponse {
  accepted: boolean | null;
  match_id?: string;
  status?: string;
  message?: string;
}

export interface SaveEventConfigResponse {
  success: boolean;
  rooms_filled: string[];
}

