package com.fitflow.clover.presentation.diagnosis

import android.graphics.Bitmap
import androidx.compose.runtime.mutableStateOf
import com.fitflow.clover.data.repository.DiagnosisRepositoryImpl
import com.fitflow.clover.presentation.diagnosis.personalcolor.PersonalColorResultUiModel
import kotlin.math.pow

class DiagnosisViewModel(
    private val diagnosisRepository: DiagnosisRepositoryImpl? = null
) {

    var uiState = mutableStateOf(DiagnosisUiState())
        private set

    private var memberId: Long? = null

    val heightOptions: List<Int> = (140..200 step 5).toList()
    val weightOptions: List<Int> = (40..120 step 2).toList()

    fun setMemberProfile(
        memberId: Long?,
        displayName: String?
    ) {
        this.memberId = memberId?.takeIf { it > 0L }
        setUserDisplayName(displayName)
    }

    fun setUserDisplayName(displayName: String?) {
        val safeDisplayName = displayName
            ?.trim()
            ?.takeIf { it.isNotBlank() }
            ?: "사용자"

        uiState.value = uiState.value.copy(
            userDisplayName = safeDisplayName
        )
    }

    fun selectGender(gender: DiagnosisGender) {
        uiState.value = uiState.value.copy(
            selectedGender = gender
        )
    }

    fun selectHeight(heightCm: Int) {
        uiState.value = uiState.value.copy(
            selectedHeightCm = heightCm
        )
    }

    fun selectWeight(weightKg: Int) {
        uiState.value = uiState.value.copy(
            selectedWeightKg = weightKg
        )
    }

    fun onFrontBodyPhotoCaptured(bitmap: Bitmap?) {
        if (bitmap == null) {
            uiState.value = uiState.value.copy(
                frontBodyPhotoBitmap = null,
                isBodyAnalyzing = false,
                bodyResult = null,
                bodyAnalysisErrorMessage = "전면 사진을 가져오지 못했어요. 다시 촬영해 주세요."
            )
            return
        }

        uiState.value = uiState.value.copy(
            frontBodyPhotoBitmap = bitmap,
            sideBodyPhotoBitmap = null,
            isBodyAnalyzing = false,
            bodyResult = null,
            bodyAnalysisErrorMessage = null
        )
    }

    fun onSideBodyPhotoCaptured(bitmap: Bitmap?) {
        if (bitmap == null) {
            uiState.value = uiState.value.copy(
                sideBodyPhotoBitmap = null,
                isBodyAnalyzing = false,
                bodyResult = null,
                bodyAnalysisErrorMessage = "옆면 사진을 가져오지 못했어요. 다시 촬영해 주세요."
            )
            return
        }

        uiState.value = uiState.value.copy(
            sideBodyPhotoBitmap = bitmap,
            isBodyAnalyzing = true,
            bodyResult = null,
            bodyAnalysisErrorMessage = null
        )
    }

    fun onBodyPhotoCaptured(bitmap: Bitmap?) {
        onFrontBodyPhotoCaptured(bitmap)
    }

    suspend fun completeBodyAnalysis(): Boolean {
        val state = uiState.value
        val frontBitmap = state.frontBodyPhotoBitmap
        val sideBitmap = state.sideBodyPhotoBitmap

        if (!state.isBodyAnalyzing || frontBitmap == null || sideBitmap == null) {
            uiState.value = state.copy(
                isBodyAnalyzing = false,
                bodyResult = null,
                bodyAnalysisErrorMessage = "전면 사진과 옆면 사진이 모두 필요해요. 다시 촬영해 주세요."
            )
            return false
        }

        if (!isRecognizablePhoto(frontBitmap) || !isRecognizablePhoto(sideBitmap)) {
            uiState.value = state.copy(
                isBodyAnalyzing = false,
                bodyResult = null,
                bodyAnalysisErrorMessage = "체형을 인식할 수 없어요.\n전면과 옆면 전신이 화면 중앙에 보이도록 다시 촬영해 주세요."
            )
            return false
        }

        val fallbackResult = createBodyResult(
            state = state,
            frontBitmap = frontBitmap,
            sideBitmap = sideBitmap
        )

        val apiResult = runCatching {
            val safeMemberId = memberId ?: return@runCatching null
            val gender = state.selectedGender ?: return@runCatching null
            val heightCm = state.selectedHeightCm ?: return@runCatching null
            val weightKg = state.selectedWeightKg ?: return@runCatching null
            val repository = diagnosisRepository ?: return@runCatching null

            repository.analyzeBody(
                memberId = safeMemberId,
                frontBitmap = frontBitmap,
                sideBitmap = sideBitmap,
                gender = gender,
                heightCm = heightCm,
                weightKg = weightKg,
                userDisplayName = state.userDisplayName
            )
        }.getOrNull()

        uiState.value = state.copy(
            isBodyAnalyzing = false,
            bodyResult = apiResult ?: fallbackResult,
            bodyAnalysisErrorMessage = null
        )

        return true
    }

    fun resetBodyPhoto() {
        resetBodyPhotos()
    }

    fun resetBodyPhotos() {
        uiState.value = uiState.value.copy(
            frontBodyPhotoBitmap = null,
            sideBodyPhotoBitmap = null,
            isBodyAnalyzing = false,
            bodyResult = null,
            bodyAnalysisErrorMessage = null
        )
    }

    fun resetSideBodyPhoto() {
        uiState.value = uiState.value.copy(
            sideBodyPhotoBitmap = null,
            isBodyAnalyzing = false,
            bodyResult = null,
            bodyAnalysisErrorMessage = null
        )
    }

    fun onPersonalColorPhotoCaptured(bitmap: Bitmap?) {
        if (bitmap == null) {
            uiState.value = uiState.value.copy(
                personalColorPhotoBitmap = null,
                isPersonalColorAnalyzing = false,
                personalColorResult = null,
                personalColorAnalysisErrorMessage = "사진을 가져오지 못했어요. 다시 촬영해 주세요."
            )
            return
        }

        uiState.value = uiState.value.copy(
            personalColorPhotoBitmap = bitmap,
            isPersonalColorAnalyzing = true,
            personalColorResult = null,
            personalColorAnalysisErrorMessage = null
        )
    }

    suspend fun completePersonalColorAnalysis(): Boolean {
        val state = uiState.value
        val bitmap = state.personalColorPhotoBitmap

        if (!state.isPersonalColorAnalyzing || bitmap == null) {
            uiState.value = state.copy(
                isPersonalColorAnalyzing = false,
                personalColorResult = null,
                personalColorAnalysisErrorMessage = "분석할 사진이 없어요. 다시 촬영해 주세요."
            )
            return false
        }

        if (!isRecognizablePhoto(bitmap)) {
            uiState.value = state.copy(
                isPersonalColorAnalyzing = false,
                personalColorResult = null,
                personalColorAnalysisErrorMessage = "얼굴을 인식할 수 없어요.\n얼굴이 정면으로 잘 보이도록 다시 촬영해 주세요."
            )
            return false
        }

        val fallbackResult = createPersonalColorResult(
            bitmap = bitmap,
            userDisplayName = state.userDisplayName
        )

        val apiResult = runCatching {
            val safeMemberId = memberId ?: return@runCatching null
            val repository = diagnosisRepository ?: return@runCatching null

            repository.analyzePersonalColor(
                memberId = safeMemberId,
                bitmap = bitmap,
                userDisplayName = state.userDisplayName
            )
        }.getOrNull()

        uiState.value = state.copy(
            isPersonalColorAnalyzing = false,
            personalColorResult = apiResult ?: fallbackResult,
            personalColorAnalysisErrorMessage = null
        )

        return true
    }

    fun resetPersonalColorPhoto() {
        uiState.value = uiState.value.copy(
            personalColorPhotoBitmap = null,
            isPersonalColorAnalyzing = false,
            personalColorResult = null,
            personalColorAnalysisErrorMessage = null
        )
    }

    private fun createBodyResult(
        state: DiagnosisUiState,
        frontBitmap: Bitmap,
        sideBitmap: Bitmap
    ): BodyAnalysisResult {
        val userName = state.userDisplayName.ifBlank {
            "사용자"
        }

        val bodyType = estimateBodyType(
            state = state,
            frontBitmap = frontBitmap,
            sideBitmap = sideBitmap
        )

        return when (bodyType) {
            BodyType.LEAN_COLUMN -> {
                BodyAnalysisResult(
                    bodyType = "LEAN_COLUMN",
                    title = "${userName}님의 체형은\n마른 직선형에 가까워요.",
                    description = "전면과 옆면 이미지를 함께 확인한 결과, 전체적으로 가늘고 직선적인 실루엣이 돋보이는 체형으로 분석되었어요.",
                    recommendMessage = "너무 큰 오버핏보다는 적당한 두께감과 레이어드가 있는 스타일을 추천해요."
                )
            }

            BodyType.APPLE -> {
                BodyAnalysisResult(
                    bodyType = "APPLE",
                    title = "${userName}님의 체형은\n사과형에 가까워요.",
                    description = "전면 폭과 옆면 볼륨을 함께 확인한 결과, 상체 중심의 볼륨감이 비교적 잘 드러나는 체형으로 분석되었어요.",
                    recommendMessage = "상체는 깔끔하게 정리하고 하의나 아우터로 세로 라인을 살리는 스타일을 추천해요."
                )
            }

            BodyType.INVERTED_TRIANGLE -> {
                BodyAnalysisResult(
                    bodyType = "INVERTED_TRIANGLE",
                    title = "${userName}님의 체형은\n역삼각형에 가까워요.",
                    description = "전면 어깨 라인과 옆면 실루엣을 함께 확인한 결과, 어깨와 상체 라인이 비교적 강조되는 체형으로 분석되었어요.",
                    recommendMessage = "하의에 볼륨감을 주고 상체는 단정하게 정리하는 스타일을 추천해요."
                )
            }

            BodyType.PEAR -> {
                BodyAnalysisResult(
                    bodyType = "PEAR",
                    title = "${userName}님의 체형은\n배형에 가까워요.",
                    description = "전면 하체 라인과 옆면 실루엣을 함께 확인한 결과, 하체 라인이 비교적 안정감 있게 보이는 체형으로 분석되었어요.",
                    recommendMessage = "상체에 포인트를 주고 하의는 자연스럽게 떨어지는 핏을 추천해요."
                )
            }

            BodyType.HOUR_GLASS -> {
                BodyAnalysisResult(
                    bodyType = "HOUR_GLASS",
                    title = "${userName}님의 체형은\n모래시계형에 가까워요.",
                    description = "전면과 옆면 균형을 함께 확인한 결과, 상체와 하체의 균형이 좋고 허리 라인이 비교적 살아나는 체형으로 분석되었어요.",
                    recommendMessage = "허리선을 살릴 수 있는 상의와 자연스럽게 라인을 잡아주는 스타일을 추천해요."
                )
            }

            BodyType.RECTANGLE -> {
                BodyAnalysisResult(
                    bodyType = "RECTANGLE",
                    title = "${userName}님의 체형은\n직사각형에 가까워요.",
                    description = "전면과 옆면 이미지를 함께 확인한 결과, 상체와 하체의 폭이 비교적 일정한 직선형 실루엣으로 분석되었어요.",
                    recommendMessage = "허리선이나 어깨선에 포인트를 주는 스타일을 추천해요."
                )
            }
        }
    }

    private fun estimateBodyType(
        state: DiagnosisUiState,
        frontBitmap: Bitmap,
        sideBitmap: Bitmap
    ): BodyType {
        val heightMeter = ((state.selectedHeightCm ?: 170) / 100.0)
            .coerceAtLeast(1.0)

        val weightKg = state.selectedWeightKg ?: 60
        val bmi = weightKg / heightMeter.pow(2.0)

        val frontProfile = estimateImageProfile(frontBitmap)
        val sideProfile = estimateImageProfile(sideBitmap)
        val imageProfile = combineBodyImageProfile(
            frontProfile = frontProfile,
            sideProfile = sideProfile
        )
        val gender = state.selectedGender

        return when {
            bmi < 18.5 -> {
                BodyType.LEAN_COLUMN
            }

            bmi >= 26.0 && imageProfile.isBrightCenter -> {
                BodyType.APPLE
            }

            gender == DiagnosisGender.MALE && imageProfile.upperContrast >= imageProfile.lowerContrast + 8.0 -> {
                BodyType.INVERTED_TRIANGLE
            }

            gender == DiagnosisGender.FEMALE && imageProfile.lowerContrast >= imageProfile.upperContrast + 8.0 -> {
                BodyType.PEAR
            }

            bmi in 18.5..23.5 && imageProfile.centerContrast >= 25.0 -> {
                BodyType.HOUR_GLASS
            }

            else -> {
                BodyType.RECTANGLE
            }
        }
    }

    private fun createPersonalColorResult(
        bitmap: Bitmap,
        userDisplayName: String
    ): PersonalColorResultUiModel {
        val userName = userDisplayName.ifBlank {
            "사용자"
        }

        val seasonType = estimatePersonalColorSeason(bitmap)

        return when (seasonType) {
            PersonalColorSeason.SPRING_WARM -> {
                PersonalColorResultUiModel(
                    personalColor = "SPRING_WARM",
                    resultTitle = "${userName}님은\n봄 [웜톤] 계열이\n잘 어울리는 타입이에요!",
                    resultRecommend = "밝고 맑은 색감, 따뜻한 톤, 생기 있는 스타일이 잘 어울려요."
                )
            }

            PersonalColorSeason.SUMMER_COOL -> {
                PersonalColorResultUiModel(
                    personalColor = "SUMMER_COOL",
                    resultTitle = "${userName}님은\n여름 [쿨톤] 계열이\n잘 어울리는 타입이에요!",
                    resultRecommend = "부드럽고 차분한 색감, 맑은 쿨톤, 은은한 스타일이 잘 어울려요."
                )
            }

            PersonalColorSeason.AUTUMN_WARM -> {
                PersonalColorResultUiModel(
                    personalColor = "AUTUMN_WARM",
                    resultTitle = "${userName}님은\n가을 [웜톤] 계열이\n잘 어울리는 타입이에요!",
                    resultRecommend = "깊이 있는 색감, 따뜻한 톤, 차분하고 고급스러운 스타일이 잘 어울려요."
                )
            }

            PersonalColorSeason.WINTER_COOL -> {
                PersonalColorResultUiModel(
                    personalColor = "WINTER_COOL",
                    resultTitle = "${userName}님은\n겨울 [쿨톤] 계열이\n잘 어울리는 타입이에요!",
                    resultRecommend = "선명한 색감, 차가운 톤, 대비감이 있는 스타일이 잘 어울려요."
                )
            }
        }
    }

    private fun estimatePersonalColorSeason(bitmap: Bitmap): PersonalColorSeason {
        val stepX = (bitmap.width / 24).coerceAtLeast(1)
        val stepY = (bitmap.height / 24).coerceAtLeast(1)

        var sampleCount = 0
        var redSum = 0.0
        var blueSum = 0.0
        var brightnessSum = 0.0
        var brightnessSquareSum = 0.0

        var y = 0
        while (y < bitmap.height) {
            var x = 0
            while (x < bitmap.width) {
                val pixel = bitmap.getPixel(x, y)

                val red = (pixel shr 16) and 0xFF
                val green = (pixel shr 8) and 0xFF
                val blue = pixel and 0xFF

                val brightness = (red + green + blue) / 3.0

                redSum += red
                blueSum += blue
                brightnessSum += brightness
                brightnessSquareSum += brightness * brightness
                sampleCount++

                x += stepX
            }

            y += stepY
        }

        if (sampleCount == 0) {
            return PersonalColorSeason.WINTER_COOL
        }

        val redAverage = redSum / sampleCount
        val blueAverage = blueSum / sampleCount
        val brightnessAverage = brightnessSum / sampleCount
        val brightnessVariance =
            (brightnessSquareSum / sampleCount) - (brightnessAverage * brightnessAverage)

        val isWarm = redAverage >= blueAverage
        val isBright = brightnessAverage >= 128.0
        val isHighContrast = brightnessVariance >= 900.0

        return when {
            isWarm && isBright -> {
                PersonalColorSeason.SPRING_WARM
            }

            !isWarm && isBright -> {
                PersonalColorSeason.SUMMER_COOL
            }

            isWarm && !isBright -> {
                PersonalColorSeason.AUTUMN_WARM
            }

            !isWarm && (!isBright || isHighContrast) -> {
                PersonalColorSeason.WINTER_COOL
            }

            else -> {
                PersonalColorSeason.WINTER_COOL
            }
        }
    }

    private fun combineBodyImageProfile(
        frontProfile: BodyImageProfile,
        sideProfile: BodyImageProfile
    ): BodyImageProfile {
        return BodyImageProfile(
            upperContrast = (frontProfile.upperContrast + sideProfile.upperContrast) / 2.0,
            centerContrast = (frontProfile.centerContrast + sideProfile.centerContrast) / 2.0,
            lowerContrast = (frontProfile.lowerContrast + sideProfile.lowerContrast) / 2.0,
            isBrightCenter = frontProfile.isBrightCenter || sideProfile.isBrightCenter
        )
    }

    private fun estimateImageProfile(bitmap: Bitmap): BodyImageProfile {
        val safeHeight = bitmap.height.coerceAtLeast(1)

        val upperStartY = (safeHeight * 0.25).toInt()
        val upperEndY = (safeHeight * 0.45).toInt()

        val centerStartY = (safeHeight * 0.45).toInt()
        val centerEndY = (safeHeight * 0.65).toInt()

        val lowerStartY = (safeHeight * 0.65).toInt()
        val lowerEndY = (safeHeight * 0.85).toInt()

        val upperContrast = estimateRegionContrast(
            bitmap = bitmap,
            startY = upperStartY,
            endY = upperEndY
        )

        val centerContrast = estimateRegionContrast(
            bitmap = bitmap,
            startY = centerStartY,
            endY = centerEndY
        )

        val lowerContrast = estimateRegionContrast(
            bitmap = bitmap,
            startY = lowerStartY,
            endY = lowerEndY
        )

        val centerBrightness = estimateRegionBrightness(
            bitmap = bitmap,
            startY = centerStartY,
            endY = centerEndY
        )

        return BodyImageProfile(
            upperContrast = upperContrast,
            centerContrast = centerContrast,
            lowerContrast = lowerContrast,
            isBrightCenter = centerBrightness >= 130.0
        )
    }

    private fun estimateRegionContrast(
        bitmap: Bitmap,
        startY: Int,
        endY: Int
    ): Double {
        val safeStartY = startY.coerceIn(0, bitmap.height - 1)
        val safeEndY = endY.coerceIn(safeStartY + 1, bitmap.height)

        val stepX = (bitmap.width / 12).coerceAtLeast(1)
        val stepY = ((safeEndY - safeStartY) / 8).coerceAtLeast(1)

        var sampleCount = 0
        var brightnessSum = 0.0
        var brightnessSquareSum = 0.0

        var y = safeStartY
        while (y < safeEndY) {
            var x = 0
            while (x < bitmap.width) {
                val pixel = bitmap.getPixel(x, y)

                val red = (pixel shr 16) and 0xFF
                val green = (pixel shr 8) and 0xFF
                val blue = pixel and 0xFF

                val brightness = (red + green + blue) / 3.0

                brightnessSum += brightness
                brightnessSquareSum += brightness * brightness
                sampleCount++

                x += stepX
            }

            y += stepY
        }

        if (sampleCount == 0) {
            return 0.0
        }

        val averageBrightness = brightnessSum / sampleCount
        return (brightnessSquareSum / sampleCount) - (averageBrightness * averageBrightness)
    }

    private fun estimateRegionBrightness(
        bitmap: Bitmap,
        startY: Int,
        endY: Int
    ): Double {
        val safeStartY = startY.coerceIn(0, bitmap.height - 1)
        val safeEndY = endY.coerceIn(safeStartY + 1, bitmap.height)

        val stepX = (bitmap.width / 12).coerceAtLeast(1)
        val stepY = ((safeEndY - safeStartY) / 8).coerceAtLeast(1)

        var sampleCount = 0
        var brightnessSum = 0.0

        var y = safeStartY
        while (y < safeEndY) {
            var x = 0
            while (x < bitmap.width) {
                val pixel = bitmap.getPixel(x, y)

                val red = (pixel shr 16) and 0xFF
                val green = (pixel shr 8) and 0xFF
                val blue = pixel and 0xFF

                val brightness = (red + green + blue) / 3.0

                brightnessSum += brightness
                sampleCount++

                x += stepX
            }

            y += stepY
        }

        if (sampleCount == 0) {
            return 0.0
        }

        return brightnessSum / sampleCount
    }

    private fun isRecognizablePhoto(bitmap: Bitmap): Boolean {
        if (bitmap.width < 80 || bitmap.height < 80) {
            return false
        }

        val stepX = (bitmap.width / 20).coerceAtLeast(1)
        val stepY = (bitmap.height / 20).coerceAtLeast(1)

        var sampleCount = 0
        var brightnessSum = 0.0
        var brightnessSquareSum = 0.0

        var y = 0
        while (y < bitmap.height) {
            var x = 0
            while (x < bitmap.width) {
                val pixel = bitmap.getPixel(x, y)

                val red = (pixel shr 16) and 0xFF
                val green = (pixel shr 8) and 0xFF
                val blue = pixel and 0xFF

                val brightness = (red + green + blue) / 3.0

                brightnessSum += brightness
                brightnessSquareSum += brightness * brightness
                sampleCount++

                x += stepX
            }

            y += stepY
        }

        if (sampleCount == 0) {
            return false
        }

        val averageBrightness = brightnessSum / sampleCount
        val variance =
            (brightnessSquareSum / sampleCount) - (averageBrightness * averageBrightness)

        return averageBrightness in 35.0..225.0 && variance >= 40.0
    }

    private data class BodyImageProfile(
        val upperContrast: Double,
        val centerContrast: Double,
        val lowerContrast: Double,
        val isBrightCenter: Boolean
    )

    private enum class BodyType {
        LEAN_COLUMN,
        APPLE,
        INVERTED_TRIANGLE,
        PEAR,
        HOUR_GLASS,
        RECTANGLE
    }

    private enum class PersonalColorSeason {
        SPRING_WARM,
        SUMMER_COOL,
        AUTUMN_WARM,
        WINTER_COOL
    }
}
