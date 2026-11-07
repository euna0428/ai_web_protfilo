package com.fitflow.clover.presentation.diagnosis

import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.remember
import androidx.compose.ui.platform.LocalContext
import com.fitflow.clover.core.network.NetworkModule
import com.fitflow.clover.data.repository.DiagnosisRepositoryImpl
import com.google.gson.JsonElement
import com.google.gson.JsonObject

@Composable
fun rememberDiagnosisViewModel(
    memberId: Long?,
    displayName: String?
): DiagnosisViewModel {
    val context = LocalContext.current

    val networkModule = remember(context) {
        NetworkModule(context)
    }

    val viewModel = remember(context) {
        DiagnosisViewModel(
            diagnosisRepository = DiagnosisRepositoryImpl(
                diagnosisApi = networkModule.diagnosisApi
            )
        )
    }

    LaunchedEffect(memberId, displayName) {
        viewModel.setMemberProfile(
            memberId = memberId,
            displayName = displayName
        )

        if (memberId == null || memberId <= 0L) {
            runCatching {
                val payload = networkModule.userApi.getMyInfo().payloadObject()
                val currentMemberId = payload.longOrNull("memberId", "member_id", "id")
                val currentDisplayName = displayName
                    ?: payload.stringOrNull("nickname")
                    ?: payload.stringOrNull("name")
                    ?: payload.stringOrNull("loginId", "login_id")

                viewModel.setMemberProfile(
                    memberId = currentMemberId,
                    displayName = currentDisplayName
                )
            }
        }
    }

    return viewModel
}

private fun JsonObject.payloadObject(): JsonObject {
    val data = get("data")
    return if (data != null && !data.isJsonNull && data.isJsonObject) {
        data.asJsonObject
    } else {
        this
    }
}

private fun JsonObject.stringOrNull(vararg keys: String): String? {
    for (key in keys) {
        val value = get(key).asStringOrNull()
        if (!value.isNullOrBlank()) return value
    }
    return null
}

private fun JsonObject.longOrNull(vararg keys: String): Long? {
    for (key in keys) {
        val value = get(key) ?: continue
        if (value.isJsonNull) continue
        runCatching { value.asLong }.getOrNull()?.let { return it }
        value.asStringOrNull()?.toLongOrNull()?.let { return it }
    }
    return null
}

private fun JsonElement?.asStringOrNull(): String? {
    if (this == null || isJsonNull) return null
    return runCatching { asString }.getOrNull()
}
