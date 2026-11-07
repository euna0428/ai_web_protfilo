package com.fitflow.clover.presentation.diagnosis

import android.graphics.Bitmap
import com.fitflow.clover.presentation.diagnosis.personalcolor.PersonalColorResultUiModel

data class DiagnosisUiState(
    val userDisplayName: String = "사용자",

    val selectedGender: DiagnosisGender? = null,
    val selectedHeightCm: Int? = null,
    val selectedWeightKg: Int? = null,

    val frontBodyPhotoBitmap: Bitmap? = null,
    val sideBodyPhotoBitmap: Bitmap? = null,
    val isBodyAnalyzing: Boolean = false,
    val bodyResult: BodyAnalysisResult? = null,
    val bodyAnalysisErrorMessage: String? = null,

    val personalColorPhotoBitmap: Bitmap? = null,
    val isPersonalColorAnalyzing: Boolean = false,
    val personalColorResult: PersonalColorResultUiModel? = null,
    val personalColorAnalysisErrorMessage: String? = null
) {
    val bodyPhotoBitmap: Bitmap?
        get() = frontBodyPhotoBitmap ?: sideBodyPhotoBitmap

    val isInfoCompleted: Boolean
        get() {
            return selectedGender != null &&
                    selectedHeightCm != null &&
                    selectedWeightKg != null
        }

    val isBodyPhotoCompleted: Boolean
        get() {
            return frontBodyPhotoBitmap != null && sideBodyPhotoBitmap != null
        }

    val isBodyResultReady: Boolean
        get() {
            return bodyResult != null
        }

    val isPersonalColorResultReady: Boolean
        get() {
            return personalColorResult != null
        }
}

enum class DiagnosisGender(
    val label: String
) {
    MALE(
        label = "남자"
    ),
    FEMALE(
        label = "여자"
    )
}

data class BodyAnalysisResult(
    val bodyType: String,
    val title: String,
    val description: String,
    val recommendMessage: String
)
