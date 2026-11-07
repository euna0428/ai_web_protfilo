package com.fitflow.clover.core.network

import com.fitflow.clover.data.local.TokenDataStore
import kotlinx.coroutines.runBlocking
import okhttp3.Authenticator
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import okhttp3.Response
import okhttp3.Route
import org.json.JSONObject

class TokenAuthenticator(
    private val tokenDataStore: TokenDataStore
) : Authenticator {

    override fun authenticate(
        route: Route?,
        response: Response
    ): Request? {
        // 1️⃣ [무한 루프 방지] 재발급 받았는데도 또 401이 뜨면? 2번 이상 시도 안 함!
        if (responseCount(response) >= 2) {
            return null
        }

        // 2️⃣ 기존 요청에 토큰이 없던 거면 그냥 실패 처리 (로그인 안 한 상태니까)
        val hasToken = response.request.header("Authorization") != null
        if (!hasToken) {
            return null
        }

        // 3️⃣ 금고(DataStore)에서 리프레시 토큰 꺼내오기 (동기 처리)
        val refreshToken = runBlocking {
            // 형의 TokenDataStore 구현에 맞게 메서드명 수정해서 써!
            // ex) tokenDataStore.getRefreshToken().firstOrNull()
            tokenDataStore.getRefreshToken()
        }

        // 리프레시 토큰조차 없으면 얄짤없이 비우고 로그아웃
        if (refreshToken.isNullOrEmpty()) {
            runBlocking { tokenDataStore.clearTokens() }
            return null
        }

        // 4️⃣ [핵심] 리프레시 토큰을 들고 스웨거 명세에 맞게 /api/members/refresh 찌르기!
        // (주의: 여기서 쓰이는 OkHttpClient는 새로 하나 파야 무한 루프가 안 생겨!)
        val refreshRequest = Request.Builder()
            .url("https://clo-ver.shop/api/members/refresh") // 👈 백엔드 운영 서버 URL
            .post("".toRequestBody(null)) // 빈 바디 전송
            .addHeader("Authorization-Refresh", refreshToken) // 스웨거 명세에 맞춘 헤더
            .build()

        val refreshClient = OkHttpClient()
        val refreshResponse = refreshClient.newCall(refreshRequest).execute()

        // 5️⃣ [재발급 성공!]
        if (refreshResponse.isSuccessful) {
            val responseBody = refreshResponse.body?.string()
            if (responseBody != null) {
                try {
                    // 백엔드가 준 JSON 뜯어서 새 토큰 뽑아내기
                    val jsonObject = JSONObject(responseBody)
                    // 스웨거 명세에 TokenResponse 필드명이 accessToken, refreshToken 이니까 그대로 추출
                    val newAccessToken = jsonObject.getString("accessToken")
                    val newRefreshToken = jsonObject.getString("refreshToken")

                    // 새 토큰들 금고에 다시 안전하게 보관!
                    runBlocking {
                        tokenDataStore.saveTokens(newAccessToken, newRefreshToken)
                    }

                    // 6️⃣ 실패했던 원래 통신에 새 엑세스 토큰 달아서 다시 쏴줌! (심폐소생술 성공)
                    return response.request.newBuilder()
                        .header("Authorization", "Bearer $newAccessToken")
                        .build()

                } catch (e: Exception) {
                    e.printStackTrace()
                }
            }
        }

        // 7️⃣ [재발급 실패] (리프레시 토큰도 2주 지나서 죽었거나 서버 에러 났을 때)
        // 금고 싹 비우고 null 리턴 -> 이러면 앱에서 "다시 로그인하세요" 에러 처리 됨
        runBlocking {
            tokenDataStore.clearTokens()
        }
        return null
    }

    // 통신 몇 번 실패했는지 카운트 세는 함수 (기존 형 코드 그대로)
    private fun responseCount(response: Response): Int {
        var count = 1
        var priorResponse = response.priorResponse
        while (priorResponse != null) {
            count++
            priorResponse = priorResponse.priorResponse
        }
        return count
    }
}