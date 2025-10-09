import { API_CONFIG } from '../../config/api';
import { supabaseStorageService, ImageUploadResult } from '../storage/SupabaseStorageService';

export interface PersonRequest {
  name: string;
  phone?: string;
  email?: string;
  personType: 'FAMILY_MEMBER' | 'REGULAR_GUEST' | 'SERVICE_WORKER' | 'DELIVERY_PERSON' | 'MAINTENANCE' | 'VISITOR' | 'UNKNOWN';
  profileImagePath?: string;
  faceVector?: number[];
  isActive?: boolean;
  notes?: string;
  faceImageUrls?: string[]; // Supabase image URLs for face embedding generation
}

export interface PersonResponse {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  personType: 'FAMILY_MEMBER' | 'REGULAR_GUEST' | 'SERVICE_WORKER' | 'DELIVERY_PERSON' | 'MAINTENANCE' | 'VISITOR' | 'UNKNOWN';
  profileImagePath?: string;
  faceVector?: number[];
  isActive: boolean;
  lastSeen?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  rfidCards?: {
    id: string;
    cardNumber: string;
    isActive: boolean;
  }[];
}

class PersonService {
  private baseUrl = API_CONFIG.SPRING_API_BASE_URL;
  private endpoint = API_CONFIG.ENDPOINTS.PERSONS;

  /**
   * Create a new person
   */
  async createPerson(person: PersonRequest): Promise<PersonResponse> {
    try {
      const response = await fetch(`${this.baseUrl}${this.endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(person),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get person by ID
   */
  async getPersonById(id: string): Promise<PersonResponse> {
    try {
      const response = await fetch(`${this.baseUrl}${this.endpoint}/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get all active persons
   */
  async getAllActivePersons(): Promise<PersonResponse[]> {
    try {
      const response = await fetch(`${this.baseUrl}${this.endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update a person
   */
  async updatePerson(id: string, person: Partial<PersonRequest>): Promise<PersonResponse> {
    try {
      const response = await fetch(`${this.baseUrl}${this.endpoint}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(person),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete a person
   */
  async deletePerson(id: string): Promise<void> {
    try {
      // First, delete all photos from Supabase storage
      const { supabaseStorageService } = await import('../storage/SupabaseStorageService');
      await supabaseStorageService.deletePersonImages(id);
      
      // Then delete the person from the backend
      const response = await fetch(`${this.baseUrl}${this.endpoint}/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * Upload image for a person using Supabase storage
   */
  async uploadPersonImage(id: string, imageUri: string): Promise<ImageUploadResult> {
    try {
      return await supabaseStorageService.uploadImage(id, imageUri);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Upload multiple images for a person using Supabase storage
   */
  async uploadMultiplePersonImages(id: string, imageUris: string[]): Promise<ImageUploadResult[]> {
    try {
      const result = await supabaseStorageService.uploadMultipleImages(id, imageUris);
      return result.images;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Generate face embeddings for a person from their uploaded images
   */
  async generateFaceEmbeddings(id: string, imageUrls: string[]): Promise<PersonResponse> {
    try {
      const response = await fetch(`${this.baseUrl}${this.endpoint}/${id}/generate-embeddings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(imageUrls),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get all images for a person from Supabase storage
   */
  async getPersonImages(id: string): Promise<ImageUploadResult[]> {
    try {
      return await supabaseStorageService.getPersonImages(id);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete person images from Supabase storage
   */
  async deletePersonImages(id: string): Promise<void> {
    try {
      return await supabaseStorageService.deletePersonImages(id);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get persons by home ID
   */
  async getPersonsByHomeId(homeId: string): Promise<PersonResponse[]> {
    try {
      const response = await fetch(`${this.baseUrl}${this.endpoint}/home/${homeId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }
}

export const personService = new PersonService();
