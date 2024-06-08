import { createCanvas, loadImage } from 'canvas';

/**
 * This function takes an image source, the crop area in pixels, and creates a new cropped image from it.
 * @param {string} imageSrc - The source of the image to be cropped.
 * @param {Object} pixelCrop - The crop area with x, y, width, and height properties.
 * @returns {Promise<{file: Blob, url: string}>} - The cropped image as a Blob and its URL.
 */
export default async function getCroppedImg(imageSrc, pixelCrop) {
  const image = await loadImage(imageSrc);
  const canvas = createCanvas(pixelCrop.width, pixelCrop.height);
  const ctx = canvas.getContext('2d');

  // Ensure the drawn image is not blurry by setting the correct canvas size
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  // Convert canvas to blob
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Canvas is empty'));
        return;
      }
      const fileUrl = URL.createObjectURL(blob);
      resolve({ file: blob, url: fileUrl });
    }, 'image/jpeg');
  });
}
