package com.fitflow.clover.core.network

import android.content.Context
import android.content.pm.ApplicationInfo
import android.util.Log
import com.fitflow.clover.data.local.TokenDataStore
import com.fitflow.clover.data.remote.api.AuthApi
import com.fitflow.clover.data.remote.api.ChatApi
import com.fitflow.clover.data.remote.api.CommunityApi
import com.fitflow.clover.data.remote.api.DiagnosisApi
import com.fitflow.clover.data.remote.api.HealthApi
import com.fitflow.clover.data.remote.api.ProductApi
import com.fitflow.clover.data.remote.api.UserApi
import com.google.gson.Gson
import com.google.gson.GsonBuilder
import okhttp3.Interceptor
import okhttp3.OkHttpClient
import okhttp3.Response
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit
import kotlinx.coroutines.runBlocking // 💡 DataStore 비동기 값을 동기적으로 뽑아오기 위해 필요해!

class NetworkModule(
    context: Context
) {
    private val appContext = context.applicationContext

    val tokenDataStore: TokenDataStore by lazy {
        TokenDataStore(appContext)
    }

    private val gson: Gson by lazy {
        GsonBuilder()
            .setLenient()
            .create()
    }

    private val authInterceptor: AuthInterceptor by lazy {
        AuthInterceptor(tokenDataStore)
    }

    private val isDebuggable: Boolean by lazy {
        (appContext.applicationInfo.flags and ApplicationInfo.FLAG_DEBUGGABLE) != 0
    }

    private val networkLogInterceptor: Interceptor by lazy {
        Interceptor { chain ->
            val request = chain.request()

            if (isDebuggable) {
                Log.d(NETWORK_LOG_TAG, "--> ${request.method} ${request.url}")
            }

            val startedAt = System.currentTimeMillis()
            val response = chain.proceed(request)
            val elapsedMs = System.currentTimeMillis() - startedAt

            if (isDebuggable) {
                Log.d(NETWORK_LOG_TAG, "<-- ${response.code} ${request.method} ${request.url} (${elapsedMs}ms)")
            }

            response
        }
    }

    val okHttpClient: OkHttpClient by lazy {
        OkHttpClient.Builder()
            .connectTimeout(NetworkConstants.CONNECT_TIMEOUT_SECONDS, TimeUnit.SECONDS)
            .readTimeout(NetworkConstants.READ_TIMEOUT_SECONDS, TimeUnit.SECONDS)
            .writeTimeout(NetworkConstants.WRITE_TIMEOUT_SECONDS, TimeUnit.SECONDS)
            .addInterceptor(authInterceptor)
            .addInterceptor(networkLogInterceptor)
            .build()
    }

    val retrofit: Retrofit by lazy {
        Retrofit.Builder()
            .baseUrl(NetworkConstants.BASE_URL)
            .client(okHttpClient)
            .addConverterFactory(GsonConverterFactory.create(gson))
            .build()
    }

    val authApi: AuthApi by lazy {
        retrofit.create(AuthApi::class.java)
    }

    val healthApi: HealthApi by lazy {
        retrofit.create(HealthApi::class.java)
    }

    val chatApi: ChatApi by lazy {
        retrofit.create(ChatApi::class.java)
    }

    val communityApi: CommunityApi by lazy {
        retrofit.create(CommunityApi::class.java)
    }

    val productApi: ProductApi by lazy {
        retrofit.create(ProductApi::class.java)
    }

    val diagnosisApi: DiagnosisApi by lazy {
        retrofit.create(DiagnosisApi::class.java)
    }

    val userApi: UserApi by lazy {
        retrofit.create(UserApi::class.java)
    }

    companion object {
        private const val NETWORK_LOG_TAG = "CloverNetwork"
    }
}
