export interface PersonResponse {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  personType: 'FAMILY_MEMBER' | 'REGULAR_GUEST' | 'SERVICE_WORKER' | 'DELIVERY_PERSON' | 'MAINTENANCE' | 'VISITOR' | 'UNKNOWN';
  profileImagePath?: string;
  faceVector?: string;
  isActive: boolean;
  lastSeen?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PersonRequest {
  name: string;
  phone?: string;
  email?: string;
  personType: 'FAMILY_MEMBER' | 'REGULAR_GUEST' | 'SERVICE_WORKER' | 'DELIVERY_PERSON' | 'MAINTENANCE' | 'VISITOR' | 'UNKNOWN';
  profileImagePath?: string;
  faceVector?: string;
  isActive?: boolean;
  notes?: string;
}
