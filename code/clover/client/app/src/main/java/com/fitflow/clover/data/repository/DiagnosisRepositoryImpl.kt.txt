package com.fitflow.clover.data.repository

import android.graphics.Bitmap
import com.fitflow.clover.data.remote.api.DiagnosisApi
import com.fitflow.clover.data.remote.dto.toBodyUiModel
import com.fitflow.clover.data.remote.dto.toPersonalColorUiModel
import com.fitflow.clover.presentation.diagnosis.BodyAnalysisResult
import com.fitflow.clover.presentation.diagnosis.DiagnosisGender
import com.fitflow.clover.presentation.diagnosis.personalcolor.PersonalColorResultUiModel
import java.io.ByteArrayOutputStream
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.MultipartBody
import okhttp3.RequestBody.Companion.toRequestBody

class DiagnosisRepositoryImpl(
    private val diagnosisApi: DiagnosisApi
) {
    suspend fun analyzeBody(
        memberId: Long,
        frontBitmap: Bitmap,
        sideBitmap: Bitmap,
        gender: DiagnosisGender,
        heightCm: Int,
        weightKg: Int,
        userDisplayName: String
    ): BodyAnalysisResult {
        val response = diagnosisApi.createBodyScan(
            memberId = memberId.toString().toPlainRequestBody(),
            gender = gender.name.toPlainRequestBody(),
            height = heightCm.toString().toPlainRequestBody(),
            weight = weightKg.toString().toPlainRequestBody(),
            frontImg = frontBitmap.toImagePart(
                formName = "frontImg",
                fileName = "body_front.jpg"
            ),
            sideImg = sideBitmap.toImagePart(
                formName = "sideImg",
                fileName = "body_side.jpg"
            )
        )

        return response.toBodyUiModel(
            userDisplayName = userDisplayName
        )
    }

    suspend fun analyzePersonalColor(
        memberId: Long,
        bitmap: Bitmap,
        userDisplayName: String
    ): PersonalColorResultUiModel {
        val response = diagnosisApi.createPersonalColorScan(
            memberId = memberId.toString().toPlainRequestBody(),
            frontImg = bitmap.toImagePart(
                formName = "frontImg",
                fileName = "personal_color_front.jpg"
            )
        )

        return response.toPersonalColorUiModel(
            userDisplayName = userDisplayName
        )
    }

    private fun Bitmap.toImagePart(
        formName: String,
        fileName: String
    ): MultipartBody.Part {
        val outputStream = ByteArrayOutputStream()

        compress(
            Bitmap.CompressFormat.JPEG,
            88,
            outputStream
        )

        val requestBody = outputStream
            .toByteArray()
            .toRequestBody("image/jpeg".toMediaType())

        return MultipartBody.Part.createFormData(
            name = formName,
            filename = fileName,
            body = requestBody
        )
    }

    private fun String.toPlainRequestBody() =
        toRequestBody("text/plain".toMediaType())
}
