package com.posecalendar.storage;

/**
 * Базовое unchecked-исключение для ошибок файлового хранилища.
 * <p>
 * Позволяет оборачивать IO-проблемы и пробрасывать их наверх,
 * где уже можно перевести в 5xx/4xx HTTP-ответ.
 */
public class StorageException extends RuntimeException {

    public StorageException(String message) {
        super(message);
    }

    public StorageException(String message, Throwable cause) {
        super(message, cause);
    }
}
