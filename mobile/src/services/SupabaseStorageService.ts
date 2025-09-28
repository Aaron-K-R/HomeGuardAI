import { supabase } from './AuthService';

export interface ImageUploadResult {
  url: string;
  path: string;
  publicUrl: string;
}

export interface MultipleImageUploadResult {
  images: ImageUploadResult[];
  success: boolean;
  errors?: string[];
}

class SupabaseStorageService {
  private bucketName = 'person-images'; // Change this if you use a different bucket name

  /**
   * Upload a single image to Supabase storage
   */
  async uploadImage(
    personId: string, 
    imageUri: string, 
    imageName?: string
  ): Promise<ImageUploadResult> {
    try {
      // Create a unique filename
      const timestamp = Date.now();
      const fileName = imageName || `person-${personId}-${timestamp}.jpg`;
      const filePath = `persons/${personId}/${fileName}`;

      // Convert image URI to arrayBuffer for React Native
      const response = await fetch(imageUri);
      const arrayBuffer = await response.arrayBuffer();

      // Upload to Supabase storage using the arrayBuffer directly
      const { data, error } = await supabase.storage
        .from(this.bucketName)
        .upload(filePath, arrayBuffer, {
          contentType: 'image/jpeg',
          upsert: false
        });
      if (error) {
        throw new Error(`Upload failed: ${error.message}`);
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from(this.bucketName)
        .getPublicUrl(filePath);

      return {
        url: data.path,
        path: filePath,
        publicUrl: publicUrlData.publicUrl
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Upload multiple images for a person
   */
  async uploadMultipleImages(
    personId: string, 
    imageUris: string[]
  ): Promise<MultipleImageUploadResult> {
    const results: ImageUploadResult[] = [];
    const errors: string[] = [];

    // First, get existing files to determine the next available number
    let nextImageNumber = 1;
    try {
      const { data: existingFiles } = await supabase.storage
        .from(this.bucketName)
        .list(`persons/${personId}`);
      
      if (existingFiles) {
        // Find the highest image number
        const imageFiles = existingFiles.filter(file => file.name.startsWith('image-') && file.name.endsWith('.jpg'));
        if (imageFiles.length > 0) {
          const numbers = imageFiles.map(file => {
            const match = file.name.match(/image-(\d+)\.jpg/);
            return match ? parseInt(match[1]) : 0;
          });
          nextImageNumber = Math.max(...numbers) + 1;
        }
      }
    } catch (error) {
      // Continue with default numbering
    }

    for (let i = 0; i < imageUris.length; i++) {
      try {
        const result = await this.uploadImage(
          personId, 
          imageUris[i], 
          `image-${nextImageNumber + i}.jpg`
        );
        results.push(result);
      } catch (error) {
        const errorMessage = `Failed to upload image ${i + 1}: ${error}`;
        errors.push(errorMessage);
      }
    }
    return {
      images: results,
      success: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined
    };
  }

  /**
   * Delete an image from Supabase storage
   */
  async deleteImage(filePath: string): Promise<void> {
    try {
      const { error } = await supabase.storage
        .from(this.bucketName)
        .remove([filePath]);

      if (error) {
        throw new Error(`Delete failed: ${error.message}`);
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete all images for a person
   */
  async deletePersonImages(personId: string): Promise<void> {
    try {
      const { data, error } = await supabase.storage
        .from(this.bucketName)
        .list(`persons/${personId}`);

      if (error) {
        throw new Error(`List failed: ${error.message}`);
      }

      if (data && data.length > 0) {
        const filesToDelete = data.map(file => `persons/${personId}/${file.name}`);
        
        const { error: deleteError } = await supabase.storage
          .from(this.bucketName)
          .remove(filesToDelete);

        if (deleteError) {
          throw new Error(`Delete failed: ${deleteError.message}`);
        }
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get all images for a person
   */
  async getPersonImages(personId: string): Promise<ImageUploadResult[]> {
    try {
      const { data, error } = await supabase.storage
        .from(this.bucketName)
        .list(`persons/${personId}`);

      if (error) {
        throw new Error(`List failed: ${error.message}`);
      }

      if (!data || data.length === 0) {
        return [];
      }

      const imagePromises = data.map(async file => {
        const filePath = `persons/${personId}/${file.name}`;
        
        // Try to get a signed URL first (works even if bucket is not public)
        try {
          const { data: signedUrlData, error: signedError } = await supabase.storage
            .from(this.bucketName)
            .createSignedUrl(filePath, 3600); // 1 hour expiry
          
          if (signedError) {
            // Fallback to public URL
            const { data: publicUrlData } = supabase.storage
              .from(this.bucketName)
              .getPublicUrl(filePath);
            
            return {
              url: filePath,
              path: filePath,
              publicUrl: publicUrlData.publicUrl
            };
          }
          
          return {
            url: filePath,
            path: filePath,
            publicUrl: signedUrlData.signedUrl
          };
        } catch (error) {
          // Fallback to public URL
          const { data: publicUrlData } = supabase.storage
            .from(this.bucketName)
            .getPublicUrl(filePath);
          
          return {
            url: filePath,
            path: filePath,
            publicUrl: publicUrlData.publicUrl
          };
        }
      });
      
      return await Promise.all(imagePromises);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create a signed URL for temporary access
   */
  async getSignedUrl(filePath: string, expiresIn: number = 3600): Promise<string> {
    try {
      const { data, error } = await supabase.storage
        .from(this.bucketName)
        .createSignedUrl(filePath, expiresIn);

      if (error) {
        throw new Error(`Signed URL failed: ${error.message}`);
      }

      return data.signedUrl;
    } catch (error) {
      throw error;
    }
  }
}

export const supabaseStorageService = new SupabaseStorageService();
