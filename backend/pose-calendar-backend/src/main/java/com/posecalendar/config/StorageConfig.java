package com.posecalendar.config;

import com.posecalendar.storage.StorageProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * Конфигурация для настроек файлового хранилища.
 * <p>
 * Регистрирует бин StorageProperties, считываемый из application.yml.
 */
@Configuration
@EnableConfigurationProperties(StorageProperties.class)
public class StorageConfig {
}
