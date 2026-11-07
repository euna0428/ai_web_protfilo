package com.fitflow.clover

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.ui.Modifier
import com.fitflow.clover.core.navigation.CloverNavHost
import com.fitflow.clover.core.network.NetworkModule
import com.fitflow.clover.presentation.auth.AuthViewModel

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        enableEdgeToEdge()

        // 백엔드 연결 테스트 (백엔드 연결 시 주석 해제)
//        lifecycleScope.launch {
//            BackendConnectionTester(this@MainActivity).run(
//                loginId = "test01",
//                password = "1234"
//            )
//        }

        val networkModule = NetworkModule(this)
        val authViewModel = AuthViewModel(networkModule)

        setContent {
            MaterialTheme {
                Surface(
                    modifier = Modifier.fillMaxSize()
                ) {
                    CloverNavHost(authViewModel = authViewModel)
                }
            }
        }
    }
}