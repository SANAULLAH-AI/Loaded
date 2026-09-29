import { v2 as cloudinary } from 'cloudinary';
import { logger } from '@/lib/utils/logger';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface UploadResult {
  url: string;
  publicId: string;
  format: string;
  size: number;
  width?: number;
  height?: number;
}

export async function uploadImage(
  file: Buffer,
  folder: string = 'career-ecosystem',
  options: {
    width?: number;
    height?: number;
    crop?: string;
  } = {}
): Promise<UploadResult> {
  try {
    const result = await new Promise<UploadResult>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
          transformation: [
            ...(options.width || options.height
              ? [
                  {
                    width: options.width,
                    height: options.height,
                    crop: options.crop || 'fill',
                  },
                ]
              : []),
            { quality: 'auto', fetch_format: 'auto' },
          ],
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else if (result) {
            resolve({
              url: result.secure_url,
              publicId: result.public_id,
              format: result.format,
              size: result.bytes,
              width: result.width,
              height: result.height,
            });
          }
        }
      );

      uploadStream.end(file);
    });

    logger.info('Image uploaded successfully', { publicId: result.publicId });
    return result;
  } catch (error) {
    logger.error('Failed to upload image', error as Error);
    throw new Error('Failed to upload image');
  }
}

export async function uploadResume(
  file: Buffer,
  filename: string,
  userId: string
): Promise<UploadResult> {
  try {
    const result = await new Promise<UploadResult>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `career-ecosystem/resumes/${userId}`,
          resource_type: 'raw',
          public_id: `resume_${Date.now()}`,
          format: 'pdf',
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else if (result) {
            resolve({
              url: result.secure_url,
              publicId: result.public_id,
              format: result.format,
              size: result.bytes,
            });
          }
        }
      );

      uploadStream.end(file);
    });

    logger.info('Resume uploaded successfully', { publicId: result.publicId, userId });
    return result;
  } catch (error) {
    logger.error('Failed to upload resume', error as Error, { userId });
    throw new Error('Failed to upload resume');
  }
}

export async function deleteFile(publicId: string): Promise<boolean> {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    logger.info('File deleted successfully', { publicId, result });
    return result.result === 'ok';
  } catch (error) {
    logger.error('Failed to delete file', error as Error, { publicId });
    return false;
  }
}

export function getOptimizedImageUrl(
  publicId: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: string;
  } = {}
): string {
  const transformations = [];

  if (options.width) transformations.push(`w_${options.width}`);
  if (options.height) transformations.push(`h_${options.height}`);
  if (options.quality) transformations.push(`q_${options.quality}`);
  if (options.format) transformations.push(`f_${options.format}`);

  transformations.push('c_fill', 'g_auto');

  return cloudinary.url(publicId, {
    transformation: transformations,
    secure: true,
  });
}

export function generateAvatarUrl(name: string, size: number = 200): string {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);

  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    initials
  )}&size=${size}&background=random&color=fff&bold=true`;
}
