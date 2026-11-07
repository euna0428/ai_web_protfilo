package com.fitflow.clover.data.remote.api

import com.fitflow.clover.data.remote.dto.LoginRequest
import com.fitflow.clover.data.remote.dto.LoginResponse
import com.fitflow.clover.data.remote.dto.SignUpRequest
import com.fitflow.clover.data.remote.dto.SignUpResponse
import com.fitflow.clover.data.remote.dto.TokenRefreshRequest
import com.fitflow.clover.data.remote.dto.TokenRefreshResponse
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.POST

interface AuthApi {
    @POST("api/members/signup")
    suspend fun signUp(
        @Body request: SignUpRequest
    ): SignUpResponse

    @POST("api/members/login")
    suspend fun login(
        @Body request: LoginRequest
    ): LoginResponse

    @POST("api/members/refresh")
    suspend fun refreshToken(
        @Body request: TokenRefreshRequest
    ): TokenRefreshResponse

    @POST("api/members/logout")
    suspend fun logout(): Response<Unit>
}
