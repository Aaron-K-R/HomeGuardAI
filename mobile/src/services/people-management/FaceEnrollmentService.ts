import { personService } from './PersonService';
import { supabaseStorageService } from '../storage/SupabaseStorageService';

export interface FaceEnrollmentResult {
  success: boolean;
  personId: string;
  uploadedImages: string[];
  faceEmbeddingsGenerated: boolean;
  error?: string;
}

class FaceEnrollmentService {
  /**
   * Complete face enrollment process:
   * 1. Upload images to Supabase storage
   * 2. Generate face embeddings using ML service
   * 
   * @param personId The person's ID
   * @param imageUris Array of local image URIs
   * @returns FaceEnrollmentResult with success status and details
   */
  async enrollPersonFaces(personId: string, imageUris: string[]): Promise<FaceEnrollmentResult> {
    try {
      console.log(`Starting face enrollment for person ${personId} with ${imageUris.length} images`);

      // Step 1: Upload images to Supabase storage
      console.log('Uploading images to Supabase storage...');
      const uploadResult = await supabaseStorageService.uploadMultipleImages(personId, imageUris);
      
      if (!uploadResult.success) {
        return {
          success: false,
          personId,
          uploadedImages: [],
          faceEmbeddingsGenerated: false,
          error: `Image upload failed: ${uploadResult.errors?.join(', ')}`
        };
      }

      const uploadedImages = uploadResult.images.map(img => img.publicUrl);
      console.log(`Successfully uploaded ${uploadedImages.length} images`);

      // Step 2: Generate face embeddings using ML service
      console.log('Generating face embeddings...');
      try {
        const personResponse = await personService.generateFaceEmbeddings(personId, uploadedImages);
        
        console.log('Face enrollment completed successfully');
        return {
          success: true,
          personId,
          uploadedImages,
          faceEmbeddingsGenerated: true
        };
      } catch (embeddingError) {
        console.warn('Face embedding generation failed, but images were uploaded:', embeddingError);
        return {
          success: true, // Images were uploaded successfully
          personId,
          uploadedImages,
          faceEmbeddingsGenerated: false,
          error: `Images uploaded but face embedding failed: ${embeddingError}`
        };
      }

    } catch (error) {
      console.error('Face enrollment failed:', error);
      return {
        success: false,
        personId,
        uploadedImages: [],
        faceEmbeddingsGenerated: false,
        error: `Face enrollment failed: ${error}`
      };
    }
  }

  /**
   * Create a person with face images and automatically generate embeddings
   * This is the new integrated approach that handles everything in one call
   * 
   * @param personData Person data for creation
   * @param imageUris Array of local image URIs
   * @returns FaceEnrollmentResult with success status and details
   */
  async createPersonWithFaces(personData: any, imageUris: string[]): Promise<FaceEnrollmentResult> {
    try {
      console.log(`Creating person with ${imageUris.length} face images`);

      // Step 1: Create person first to get the real person ID
      console.log('Creating person...');
      const person = await personService.createPerson(personData);
      const personId = person.id;
      console.log(`Person created with ID: ${personId}`);

      // Step 2: Upload images to Supabase storage with the real person ID
      console.log('Uploading images to Supabase storage...');
      const uploadResult = await supabaseStorageService.uploadMultipleImages(
        personId, // Use the real person ID
        imageUris
      );
      
      if (!uploadResult.success) {
        // If image upload fails, we still have the person created
        console.warn('Image upload failed, but person was created');
        return {
          success: true,
          personId: personId,
          uploadedImages: [],
          faceEmbeddingsGenerated: false,
          error: `Person created but image upload failed: ${uploadResult.errors?.join(', ')}`
        };
      }

      const uploadedImages = uploadResult.images.map(img => img.publicUrl);
      console.log(`Successfully uploaded ${uploadedImages.length} images`);
      console.log('Generated URLs:', uploadedImages);

      // Step 3: Update person with profile image and generate face embeddings
      const updatedPerson = await personService.updatePerson(personId, {
        profileImagePath: uploadedImages[0] // Use first image as profile image
      });

      // Step 4: Generate face embeddings
      console.log('Generating face embeddings...');
      const embeddingsResult = await personService.generateFaceEmbeddings(personId, uploadedImages);
      
      console.log('Person created successfully with face embeddings');
      return {
        success: true,
        personId: personId,
        uploadedImages,
        faceEmbeddingsGenerated: true
      };

    } catch (error) {
      console.error('Failed to create person with faces:', error);
      return {
        success: false,
        personId: '',
        uploadedImages: [],
        faceEmbeddingsGenerated: false,
        error: `Failed to create person: ${error}`
      };
    }
  }

  /**
   * Re-enroll faces for an existing person
   * This will upload new images and regenerate face embeddings
   * 
   * @param personId The person's ID
   * @param imageUris Array of local image URIs
   * @returns FaceEnrollmentResult with success status and details
   */
  async reEnrollPersonFaces(personId: string, imageUris: string[]): Promise<FaceEnrollmentResult> {
    try {
      // Delete existing images first (optional - you might want to keep them)
      // await this.deletePersonImages(personId);
      
      // Enroll new faces
      return await this.enrollPersonFaces(personId, imageUris);
    } catch (error) {
      console.error('Failed to re-enroll person faces:', error);
      return {
        success: false,
        personId,
        uploadedImages: [],
        faceEmbeddingsGenerated: false,
        error: `Failed to re-enroll faces: ${error}`
      };
    }
  }

  /**
   * Delete all images for a person
   * 
   * @param personId The person's ID
   * @returns Promise<boolean> Success status
   */
  async deletePersonImages(personId: string): Promise<boolean> {
    try {
      await supabaseStorageService.deletePersonImages(personId);
      return true;
    } catch (error) {
      console.error('Failed to delete person images:', error);
      return false;
    }
  }

  /**
   * Get all images for a person
   * 
   * @param personId The person's ID
   * @returns Promise<string[]> Array of image URLs
   */
  async getPersonImages(personId: string): Promise<string[]> {
    try {
      const images = await supabaseStorageService.getPersonImages(personId);
      return images.map(img => img.publicUrl);
    } catch (error) {
      console.error('Failed to get person images:', error);
      return [];
    }
  }
}

export const faceEnrollmentService = new FaceEnrollmentService();
