/**
 * Resizes an image file to fit within maxWidth and maxHeight while preserving aspect ratio.
 * Returns a new File object in JPEG format with quality 0.8.
 * If the image cannot be loaded, resolves with the original file.
 */
export const resizeImageFile = (file, maxWidth = 800, maxHeight = 800) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      let { width, height } = img;
      const ratio = Math.min(maxWidth / width, maxHeight / height, 1);
      width = width * ratio;
      height = height * ratio;

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => resolve(new File([blob], file.name, { type: "image/jpeg" })),
        "image/jpeg",
        0.8
      );
    };

  /**
    * If image fails to load, fallback to returning the original file
    */
    img.onerror = () => {
      resolve(file); 
    };
  });
};
