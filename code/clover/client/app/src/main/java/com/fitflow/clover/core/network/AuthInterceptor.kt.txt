package com.fitflow.clover.core.network

import com.fitflow.clover.data.local.TokenDataStore
import kotlinx.coroutines.runBlocking
import okhttp3.Interceptor
import okhttp3.Response

class AuthInterceptor(
    private val tokenDataStore: TokenDataStore
) : Interceptor {

    override fun intercept(chain: Interceptor.Chain): Response {
        val originalRequest = chain.request()
        val path = originalRequest.url.encodedPath

        if (shouldSkipAuth(path)) {
            return chain.proceed(originalRequest)
        }

        if (originalRequest.header(NetworkConstants.HEADER_AUTHORIZATION) != null) {
            return chain.proceed(originalRequest)
        }

        val accessToken = runBlocking {
            tokenDataStore.getAccessToken()
        }

        val request = if (accessToken.isNullOrBlank()) {
            originalRequest
        } else {
            originalRequest.newBuilder()
                .addHeader(
                    NetworkConstants.HEADER_AUTHORIZATION,
                    "${NetworkConstants.BEARER_PREFIX} $accessToken"
                )
                .build()
        }

        return chain.proceed(request)
    }

    private fun shouldSkipAuth(path: String): Boolean {
        return path == "/api/health" ||
                path.contains("/login") ||
                path.contains("/signup") ||
                path.contains("/sign-up") ||
                path.contains("/refresh") ||
                path.contains("/reissue")
    }
}
