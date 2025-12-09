package com.posecalendar.storage;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

import java.nio.file.Path;

/**
 * Настройки файлового хранилища.
 *
 * Привязаны к префиксу `posecalendar.storage` в application.yml.
 */
@Data
@ConfigurationProperties(prefix = "posecalendar.storage")
public class StorageProperties {

    /**
     * Базовая директория для файлового хранилища.
     * Может быть абсолютным или относительным путём.
     *
     * Пример значения по умолчанию: "./storage".
     */
    private Path basePath = Path.of("storage");
}
