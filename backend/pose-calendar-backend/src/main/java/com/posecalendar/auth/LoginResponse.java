package com.posecalendar.auth;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class LoginResponse {
    String token;
    AuthUserDto user;
}
