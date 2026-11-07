package com.bu.jichulmate.dto.auth;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResetPasswordRequest {

    private String token;

    private String password;

    private String passwordConfirm;
}