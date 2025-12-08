package com.posecalendar.auth;

import com.posecalendar.user.UserRole;
import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class AuthUserDto {
    Long id;
    String username;
    String displayName;
    UserRole role;
}
