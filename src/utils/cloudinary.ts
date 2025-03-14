
import { cloudinaryConfig } from "@/lib/firebase";

export const uploadImageToCloudinary = async (file: File): Promise<string> => {
  if (!cloudinaryConfig.cloudName || !cloudinaryConfig.uploadPreset) {
    console.error("Cloudinary configuration", cloudinaryConfig);
    throw new Error("Cloudinary configuration is missing. Please check your environment variables.");
  }
  
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", cloudinaryConfig.uploadPreset);
  
  try {
    console.log(`Uploading to: ${cloudinaryConfig.apiUrl}${cloudinaryConfig.cloudName}/image/upload`);
    
    const response = await fetch(
      `${cloudinaryConfig.apiUrl}${cloudinaryConfig.cloudName}/image/upload`,
      {
        method: "POST",
        body: formData
      }
    );
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error("Cloudinary error response:", errorData);
      throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log("Upload successful:", data.secure_url);
    return data.secure_url;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw error;
  }
};