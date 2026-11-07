package com.fitflow.clover.data.remote.dto

import com.google.gson.annotations.SerializedName

data class SignUpRequest(
    @SerializedName("loginId") //login_id -> loginId
    val loginId: String,

    @SerializedName("password")
    val password: String,

    @SerializedName("name")
    val name: String,

    @SerializedName("nickname")
    val nickname: String,

    @SerializedName("email")
    val email: String,

    @SerializedName("gender")
    val gender: String
)

data class SignUpResponse(
    @SerializedName(value = "member_id", alternate = ["memberId"])
    val memberId: Long? = null,

    @SerializedName(value = "login_id", alternate = ["loginId"])
    val loginId: String? = null,

    @SerializedName("name")
    val name: String? = null,

    @SerializedName("nickname")
    val nickname: String? = null,

    @SerializedName("email")
    val email: String? = null,

    @SerializedName(value = "is_email_verified", alternate = ["emailVerified", "isEmailVerified"])
    val isEmailVerified: Boolean? = null,

    @SerializedName("gender")
    val gender: String? = null,

    @SerializedName("role")
    val role: String? = null,

    @SerializedName(value = "is_deleted", alternate = ["deleted", "isDeleted"])
    val isDeleted: Boolean? = null,

    @SerializedName(value = "created_at", alternate = ["createdAt"])
    val createdAt: String? = null,

    @SerializedName(value = "updated_at", alternate = ["updatedAt"])
    val updatedAt: String? = null
)

data class LoginRequest(
    @SerializedName("loginId")
    val loginId: String,

    @SerializedName("password")
    val password: String,


    // 뷰모델에서 안 넘겨줘도 알아서 "000000"이 포장돼서 서버로 날아감
    @SerializedName("totpCode")
    val totpCode: String = "000000"
)

data class LoginResponse(
    @SerializedName(value = "access_token", alternate = ["accessToken"])
    val accessToken: String? = null,

    @SerializedName(value = "refresh_token", alternate = ["refreshToken"])
    val refreshToken: String? = null,

    @SerializedName(value = "member_id", alternate = ["memberId"])
    val memberId: Long? = null,

    @SerializedName(value = "login_id", alternate = ["loginId"])
    val loginId: String? = null,

    @SerializedName("name")
    val name: String? = null,

    @SerializedName("nickname")
    val nickname: String? = null,

    @SerializedName("email")
    val email: String? = null,

    @SerializedName("gender")
    val gender: String? = null,

    @SerializedName("role")
    val role: String? = null
)

data class TokenRefreshRequest(
    @SerializedName("refreshToken") // 💡 혹시 모를 400 에러 방지: refresh_token -> refreshToken
    val refreshToken: String
)

data class TokenRefreshResponse(
    @SerializedName(value = "access_token", alternate = ["accessToken"])
    val accessToken: String? = null,

    @SerializedName(value = "refresh_token", alternate = ["refreshToken"])
    val refreshToken: String? = null
)