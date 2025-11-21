package se.gritacademy.backend.security;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.util.Base64;

@Component
@Converter
public class EncryptDecryptConverter implements AttributeConverter<String, String> {

    private static final String ENCRYPT_ALGO = "AES/GCM/NoPadding";
    private static final int TAG_LENGTH_BIT = 128;
    private static final int IV_LENGTH_BYTE = 12;

    private final SecretKey secretKey;
    private final SecureRandom secureRandom = new SecureRandom();

    /**
     * Initializes the converter with a 32-byte AES key from Base64.
     */
    public EncryptDecryptConverter(@Value("${chore.encrypt.key}") String base64Key) {
        byte[] decodedKey = Base64.getDecoder().decode(base64Key);
        if (decodedKey.length != 32) {
            throw new IllegalStateException("CHORE_ENCRYPT_KEY must be 32 bytes (AES-256)");
        }
        this.secretKey = new SecretKeySpec(decodedKey, "AES");
    }

    /**
     * Encrypts a string before storing it in the database.
     */
    @Override
    public String convertToDatabaseColumn(String attribute) {
        if (attribute == null) return null;

        try {
            byte[] iv = generateIv();
            Cipher cipher = initCipher(Cipher.ENCRYPT_MODE, iv);

            byte[] encrypted = cipher.doFinal(attribute.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(concatIvAndData(iv, encrypted));
        } catch (Exception e) {
            throw new RuntimeException("Error encrypting value", e);
        }
    }

    /**
     * Decrypts a string read from the database.
     */
    @Override
    public String convertToEntityAttribute(String dbData) {
        if (dbData == null) return null;

        try {
            byte[] decoded = Base64.getDecoder().decode(dbData);
            byte[] iv = extractIv(decoded);
            byte[] encrypted = extractEncrypted(decoded);

            Cipher cipher = initCipher(Cipher.DECRYPT_MODE, iv);
            return new String(cipher.doFinal(encrypted), StandardCharsets.UTF_8);
        } catch (Exception e) {
            throw new RuntimeException("Error decrypting value", e);
        }
    }

    /**
     * HELPER: Generates a random IV (Initialization Vector) for AES/GCM.
     */
    private byte[] generateIv() {
        byte[] iv = new byte[IV_LENGTH_BYTE];
        secureRandom.nextBytes(iv);
        return iv;
    }

    /**
     * HELPER: Initializes a Cipher in either ENCRYPT or DECRYPT mode with the given IV.
     */
    private Cipher initCipher(int mode, byte[] iv) throws Exception {
        Cipher cipher = Cipher.getInstance(ENCRYPT_ALGO);
        GCMParameterSpec spec = new GCMParameterSpec(TAG_LENGTH_BIT, iv);
        cipher.init(mode, secretKey, spec);
        return cipher;
    }

    /**
     * HELPER: Concatenates IV and encrypted data for storage in database.
     */
    private byte[] concatIvAndData(byte[] iv, byte[] data) {
        byte[] result = new byte[iv.length + data.length];
        System.arraycopy(iv, 0, result, 0, iv.length);
        System.arraycopy(data, 0, result, iv.length, data.length);
        return result;
    }

    /**
     * HELPER: Extracts the IV from a stored database value.
     */
    private byte[] extractIv(byte[] data) {
        byte[] iv = new byte[IV_LENGTH_BYTE];
        System.arraycopy(data, 0, iv, 0, iv.length);
        return iv;
    }

    /**
     * HELPER: Extracts the encrypted payload from a stored database value.
     */
    private byte[] extractEncrypted(byte[] data) {
        byte[] encrypted = new byte[data.length - IV_LENGTH_BYTE];
        System.arraycopy(data, IV_LENGTH_BYTE, encrypted, 0, encrypted.length);
        return encrypted;
    }
}