package com.posecalendar.security;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Data
@ConfigurationProperties(prefix = "posecalendar.security.jwt")
public class JwtProperties {

    /**
     * Секрет для подписи токенов (HS256).
     */
    private String secret;

    /**
     * Время жизни токена в минутах.
     */
    private long expirationMinutes;
}
