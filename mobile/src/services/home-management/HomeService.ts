import { API_CONFIG } from '../../config/api';

export interface HomeRequest {
  name: string;
  address: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  homeType?: string;
  isPrimary?: boolean;
  description?: string;
  securitySystemType?: string;
}

export interface HomeResponse {
  id: string;
  name: string;
  address: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  homeType?: string;
  isPrimary: boolean;
  isActive: boolean;
  description?: string;
  securitySystemType?: string;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
  ownerName?: string;
  ownerEmail?: string;
  fullAddress: string;
  deviceCount: number;
  userCount: number;
  hasCoordinates: boolean;
}

class HomeService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_CONFIG.SPRING_API_BASE_URL}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
      // Add authentication header if needed
      // 'Authorization': `Bearer ${token}`,
    };

    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Create a new home
  async createHome(ownerId: string, homeData: HomeRequest): Promise<HomeResponse> {
    return this.makeRequest<HomeResponse>(`${API_CONFIG.ENDPOINTS.HOMES}/owner/${ownerId}`, {
      method: 'POST',
      body: JSON.stringify(homeData),
    });
  }

  // Get home by ID
  async getHomeById(id: string): Promise<HomeResponse> {
    return this.makeRequest<HomeResponse>(`${API_CONFIG.ENDPOINTS.HOMES}/${id}`);
  }

  // Get all homes for an owner
  async getHomesByOwnerId(ownerId: string): Promise<HomeResponse[]> {
    return this.makeRequest<HomeResponse[]>(`${API_CONFIG.ENDPOINTS.HOMES}/owner/${ownerId}`);
  }

  // Get primary home for an owner
  async getPrimaryHomeByOwnerId(ownerId: string): Promise<HomeResponse> {
    return this.makeRequest<HomeResponse>(`${API_CONFIG.ENDPOINTS.HOMES}/owner/${ownerId}/primary`);
  }

  // Get all homes
  async getAllHomes(): Promise<HomeResponse[]> {
    return this.makeRequest<HomeResponse[]>(`${API_CONFIG.ENDPOINTS.HOMES}`);
  }

  // Get homes by city
  async getHomesByCity(city: string): Promise<HomeResponse[]> {
    return this.makeRequest<HomeResponse[]>(`${API_CONFIG.ENDPOINTS.HOMES}/city/${city}`);
  }

  // Get homes by state
  async getHomesByState(state: string): Promise<HomeResponse[]> {
    return this.makeRequest<HomeResponse[]>(`${API_CONFIG.ENDPOINTS.HOMES}/state/${state}`);
  }

  // Get homes by type
  async getHomesByHomeType(homeType: string): Promise<HomeResponse[]> {
    return this.makeRequest<HomeResponse[]>(`${API_CONFIG.ENDPOINTS.HOMES}/type/${homeType}`);
  }

  // Update home
  async updateHome(id: string, homeData: Partial<HomeRequest>): Promise<HomeResponse> {
    return this.makeRequest<HomeResponse>(`${API_CONFIG.ENDPOINTS.HOMES}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(homeData),
    });
  }

  // Delete home
  async deleteHome(id: string): Promise<void> {
    return this.makeRequest<void>(`${API_CONFIG.ENDPOINTS.HOMES}/${id}`, {
      method: 'DELETE',
    });
  }

  // Set home as primary
  async setPrimaryHome(id: string): Promise<HomeResponse> {
    return this.makeRequest<HomeResponse>(`${API_CONFIG.ENDPOINTS.HOMES}/${id}/primary`, {
      method: 'PATCH',
    });
  }

  // Activate home
  async activateHome(id: string): Promise<HomeResponse> {
    return this.makeRequest<HomeResponse>(`${API_CONFIG.ENDPOINTS.HOMES}/${id}/activate`, {
      method: 'PATCH',
    });
  }

  // Deactivate home
  async deactivateHome(id: string): Promise<HomeResponse> {
    return this.makeRequest<HomeResponse>(`${API_CONFIG.ENDPOINTS.HOMES}/${id}/deactivate`, {
      method: 'PATCH',
    });
  }

  // Helper method to validate home data
  validateHomeData(homeData: HomeRequest): string[] {
    const errors: string[] = [];

    if (!homeData.name || homeData.name.trim().length === 0) {
      errors.push('Home name is required');
    }

    if (!homeData.address || homeData.address.trim().length === 0) {
      errors.push('Address is required');
    }

    if (homeData.name && homeData.name.length > 200) {
      errors.push('Home name must be 200 characters or less');
    }

    if (homeData.address && homeData.address.length > 500) {
      errors.push('Address must be 500 characters or less');
    }

    if (homeData.city && homeData.city.length > 100) {
      errors.push('City must be 100 characters or less');
    }

    if (homeData.state && homeData.state.length > 50) {
      errors.push('State must be 50 characters or less');
    }

    if (homeData.zipCode && homeData.zipCode.length > 20) {
      errors.push('Zip code must be 20 characters or less');
    }

    if (homeData.country && homeData.country.length > 100) {
      errors.push('Country must be 100 characters or less');
    }

    if (homeData.description && homeData.description.length > 1000) {
      errors.push('Description must be 1000 characters or less');
    }

    if (homeData.securitySystemType && homeData.securitySystemType.length > 100) {
      errors.push('Security system type must be 100 characters or less');
    }

    return errors;
  }
}

export const homeService = new HomeService();
export default homeService;
