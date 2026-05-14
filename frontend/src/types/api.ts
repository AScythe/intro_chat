// api.ts
// Description: TypeScript interfaces for API request/response payloads

export interface CreateEventResponse {
  event_id: string;
  rooms: string[];
}

export interface Room {
  id: string;
  name: string;
}

export interface JoinEventResponse {
  user_id: string;
  username: string;
}

export interface QRResponse {
  qr_code: string;
}

export interface ApiSuccess {
  success: boolean;
}
