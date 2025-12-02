package se.gritacademy.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import javax.imageio.IIOImage;
import javax.imageio.ImageIO;
import javax.imageio.ImageWriteParam;
import javax.imageio.ImageWriter;
import javax.imageio.stream.MemoryCacheImageOutputStream;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Iterator;
import java.util.UUID;

@Service
public class SupabaseStorageService {

    @Value("${SUPABASE_URL}")
    private String supabaseUrl;

    @Value("${SUPABASE_SERVICE_ROLE_KEY}")
    private String serviceRoleKey;

    @Value("${SUPABASE_BUCKET}")
    private String bucketName;

    /**
     * Uploads a file to Supabase Storage. Images are compressed/resized and converted to JPEG if needed.
     * Returns the publicly accessible URL for the uploaded file.
     */
    public String uploadFile(MultipartFile file) {
        try {
            boolean isImage = isImage(file);
            MultipartFile processedFile = file;

            if (isImage) {
                processedFile = compressImageToJpeg(file, 0.7f, 1024, 1024);
            }

            String uniqueFilename = generateUniqueFilename(processedFile.getOriginalFilename(), isImage);
            uploadToSupabase(processedFile, uniqueFilename);

            return getPublicUrl(uniqueFilename);
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Failed to process/upload file: " + e.getMessage());
        }
    }

    /**
     * Checks if the MultipartFile is an image (PNG, JPEG, GIF, etc.)
     */
    private boolean isImage(MultipartFile file) {
        if (file == null || file.isEmpty() || file.getContentType() == null) return false;
        String contentType = file.getContentType().toLowerCase();
        return contentType.startsWith("image/");
    }

    /**
     * Compresses, resizes, and converts any image to JPEG with white background if transparency exists.
     */
    private MultipartFile compressImageToJpeg(MultipartFile file, float quality, int maxWidth, int maxHeight) throws IOException {
        BufferedImage originalImage = ImageIO.read(file.getInputStream());
        if (originalImage == null) return file;

        BufferedImage resizedImage = resizeImageKeepingAspectRatio(originalImage, maxWidth, maxHeight);
        BufferedImage rgbImage = convertToRGBWithWhiteBackground(resizedImage);

        byte[] jpegBytes = writeJpegToBytes(rgbImage, quality);
        return createMultipartFileFromBytes(file, jpegBytes, "image/jpeg");
    }

    /**
     * Converts any image to RGB with white background to handle transparency.
     */
    private BufferedImage convertToRGBWithWhiteBackground(BufferedImage image) {
        if (image.getType() == BufferedImage.TYPE_INT_RGB) return image;

        BufferedImage newImage = new BufferedImage(image.getWidth(), image.getHeight(), BufferedImage.TYPE_INT_RGB);
        Graphics2D g = newImage.createGraphics();
        g.setColor(Color.WHITE);
        g.fillRect(0, 0, image.getWidth(), image.getHeight());
        g.drawImage(image, 0, 0, null);
        g.dispose();
        return newImage;
    }

    /**
     * Resizes an image while keeping its aspect ratio.
     */
    private BufferedImage resizeImageKeepingAspectRatio(BufferedImage original, int maxWidth, int maxHeight) {
        int width = original.getWidth();
        int height = original.getHeight();
        double scale = Math.min((double) maxWidth / width, (double) maxHeight / height);
        if (scale >= 1) return original;

        int newWidth = (int) (width * scale);
        int newHeight = (int) (height * scale);
        return scaleImage(original, newWidth, newHeight);
    }

    /**
     * Scales an image to new dimensions using smooth interpolation.
     */
    private BufferedImage scaleImage(BufferedImage original, int newWidth, int newHeight) {
        Image tmp = original.getScaledInstance(newWidth, newHeight, Image.SCALE_SMOOTH);
        BufferedImage resized = new BufferedImage(newWidth, newHeight, BufferedImage.TYPE_INT_RGB);
        Graphics2D g2d = resized.createGraphics();
        g2d.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BILINEAR);
        g2d.drawImage(tmp, 0, 0, null);
        g2d.dispose();
        return resized;
    }

    /**
     * Writes a BufferedImage to JPEG byte array with given quality.
     */
    private byte[] writeJpegToBytes(BufferedImage image, float quality) throws IOException {
        ByteArrayOutputStream os = new ByteArrayOutputStream();
        Iterator<ImageWriter> writers = ImageIO.getImageWritersByFormatName("jpg");
        if (!writers.hasNext()) throw new IllegalStateException("No writers found for JPG");

        ImageWriter writer = writers.next();
        ImageWriteParam param = writer.getDefaultWriteParam();
        param.setCompressionMode(ImageWriteParam.MODE_EXPLICIT);
        param.setCompressionQuality(quality);

        writer.setOutput(new MemoryCacheImageOutputStream(os));
        writer.write(null, new IIOImage(image, null, null), param);
        writer.dispose();

        return os.toByteArray();
    }

    /**
     * Creates a MultipartFile from byte array with specified content type.
     */
    private MultipartFile createMultipartFileFromBytes(MultipartFile originalFile, byte[] bytes, String contentType) {
        return new MultipartFile() {
            @Override
            public String getName() { return originalFile.getName(); }
            @Override
            public String getOriginalFilename() { return originalFile.getOriginalFilename(); }
            @Override
            public String getContentType() { return contentType; }
            @Override
            public boolean isEmpty() { return bytes.length == 0; }
            @Override
            public long getSize() { return bytes.length; }
            @Override
            public byte[] getBytes() { return bytes; }
            @Override
            public InputStream getInputStream() { return new ByteArrayInputStream(bytes); }
            @Override
            public void transferTo(java.io.File dest) throws IOException {
                try (var os = java.nio.file.Files.newOutputStream(dest.toPath())) {
                    os.write(bytes);
                }
            }
        };
    }

    /**
     * Generates a unique filename preserving original extension.
     */
    private String generateUniqueFilename(String originalFilename, boolean forceJpg) {
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        if (forceJpg) {
            extension = ".jpg"; // tvinga JPG
        }
        return UUID.randomUUID() + extension;
    }

    /**
     * Uploads a file to Supabase Storage using PUT request.
     * Sets the appropriate Content-Type.
     */
    private void uploadToSupabase(MultipartFile file, String filename) {
        try {
            String uploadUrl = supabaseUrl + "/storage/v1/object/" + bucketName + "/" + filename;
            HttpURLConnection connection = (HttpURLConnection) new URL(uploadUrl).openConnection();
            connection.setRequestMethod("PUT");
            connection.setRequestProperty("Authorization", "Bearer " + serviceRoleKey);
            connection.setRequestProperty("Content-Type", file.getContentType() != null ? file.getContentType() : "application/octet-stream");
            connection.setDoOutput(true);

            file.getInputStream().transferTo(connection.getOutputStream());

            int responseCode = connection.getResponseCode();
            if (responseCode < 200 || responseCode >= 300) {
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                        "Failed to upload file. HTTP code: " + responseCode);
            }
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Failed to upload file: " + e.getMessage());
        }
    }

    /**
     * Returns a public URL for a file in Supabase Storage bucket.
     */
    private String getPublicUrl(String filename) {
        return supabaseUrl + "/storage/v1/object/public/" + bucketName + "/" + filename;
    }
}
