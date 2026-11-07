package com.fitflow.clover.data.remote.dto

import com.fitflow.clover.presentation.diagnosis.BodyAnalysisResult
import com.fitflow.clover.presentation.diagnosis.personalcolor.PersonalColorResultUiModel
import com.google.gson.annotations.SerializedName

data class DiagnosisApiResponse(
    @SerializedName("status")
    val status: Int? = null,

    @SerializedName("message")
    val message: String? = null,

    @SerializedName("data")
    val data: DiagnosisDataResponse? = null
)

data class DiagnosisDataResponse(
    @SerializedName("diagnosisId")
    val diagnosisId: Long? = null,

    @SerializedName("memberId")
    val memberId: Long? = null,

    @SerializedName("obesityType")
    val obesityType: String? = null,

    @SerializedName("personalColor")
    val personalColor: String? = null,

    @SerializedName("resultTitle")
    val resultTitle: String? = null
)

fun DiagnosisApiResponse.toBodyUiModel(
    userDisplayName: String
): BodyAnalysisResult {
    val data = requireNotNull(data) {
        message ?: "체형 분석 결과가 비어 있습니다."
    }

    val userName = userDisplayName
        .trim()
        .takeIf { it.isNotBlank() }
        ?: "사용자"

    val normalizedBodyType = data.obesityType.normalizeBodyRecommendedType()
    val fallback = normalizedBodyType.toBodyResultPreset(userName)
    val apiTitle = data.resultTitle
        ?.trim()
        ?.takeIf { it.isNotBlank() && it != "string" }

    return fallback.copy(
        title = apiTitle ?: fallback.title
    )
}

fun DiagnosisApiResponse.toPersonalColorUiModel(
    userDisplayName: String
): PersonalColorResultUiModel {
    val data = requireNotNull(data) {
        message ?: "퍼스널 컬러 분석 결과가 비어 있습니다."
    }

    val userName = userDisplayName
        .trim()
        .takeIf { it.isNotBlank() }
        ?: "사용자"

    val normalizedPersonalColor = data.personalColor.normalizePersonalColor()
    val fallback = normalizedPersonalColor.toPersonalColorPreset(userName)
    val apiTitle = data.resultTitle
        ?.trim()
        ?.takeIf { it.isNotBlank() && it != "string" }

    return fallback.copy(
        resultTitle = apiTitle ?: fallback.resultTitle
    )
}

private fun String?.normalizeBodyRecommendedType(): String {
    return when (
        this
            ?.trim()
            ?.uppercase()
            ?.replace("-", "_")
            ?.replace(" ", "_")
    ) {
        "TRIANGLE", "PEAR", "A_LINE" -> "TRIANGLE"
        "INVERTED_TRIANGLE", "INVERTED" -> "INVERTED_TRIANGLE"
        "OVAL", "APPLE", "ROUND" -> "OVAL"
        "HOURGLASS", "HOUR_GLASS", "HOUR_GLASS_SHAPE" -> "HOURGLASS"
        "RECTANGLE", "STRAIGHT", "LEAN_COLUMN", "COLUMN" -> "RECTANGLE"
        else -> "RECTANGLE"
    }
}

private fun String?.normalizePersonalColor(): String {
    return when (
        this
            ?.trim()
            ?.uppercase()
            ?.replace("-", "_")
            ?.replace(" ", "_")
    ) {
        "SPRING_WARM", "SPRING", "WARM_SPRING", "봄_웜톤", "봄웜톤" -> "SPRING_WARM"
        "SUMMER_COOL", "SUMMER", "COOL_SUMMER", "여름_쿨톤", "여름쿨톤" -> "SUMMER_COOL"
        "AUTUMN_WARM", "AUTUMN", "FALL_WARM", "가을_웜톤", "가을웜톤" -> "AUTUMN_WARM"
        "WINTER_COOL", "WINTER", "COOL_WINTER", "겨울_쿨톤", "겨울쿨톤" -> "WINTER_COOL"
        else -> "WINTER_COOL"
    }
}

private fun String.toBodyResultPreset(
    userName: String
): BodyAnalysisResult {
    return when (this) {
        "TRIANGLE" -> BodyAnalysisResult(
            bodyType = "TRIANGLE",
            title = "${userName}님의 체형은\n삼각형에 가까워요.",
            description = "상체보다 하체 라인이 안정감 있게 드러나는 체형으로 분석되었어요.",
            recommendMessage = "상체에 포인트를 주고 하의는 자연스럽게 떨어지는 핏을 추천해요."
        )

        "INVERTED_TRIANGLE" -> BodyAnalysisResult(
            bodyType = "INVERTED_TRIANGLE",
            title = "${userName}님의 체형은\n역삼각형에 가까워요.",
            description = "어깨와 상체 라인이 비교적 강조되는 체형으로 분석되었어요.",
            recommendMessage = "하의에 볼륨감을 주고 상체는 단정하게 정리하는 스타일을 추천해요."
        )

        "OVAL" -> BodyAnalysisResult(
            bodyType = "OVAL",
            title = "${userName}님의 체형은\n타원형에 가까워요.",
            description = "상체 중심의 부드러운 볼륨감이 비교적 잘 드러나는 체형으로 분석되었어요.",
            recommendMessage = "상체는 깔끔하게 정리하고 세로 라인을 살리는 스타일을 추천해요."
        )

        "HOURGLASS" -> BodyAnalysisResult(
            bodyType = "HOURGLASS",
            title = "${userName}님의 체형은\n모래시계형에 가까워요.",
            description = "상체와 하체의 균형이 좋고 허리 라인이 비교적 살아나는 체형으로 분석되었어요.",
            recommendMessage = "허리선을 살릴 수 있는 상의와 자연스럽게 라인을 잡아주는 스타일을 추천해요."
        )

        else -> BodyAnalysisResult(
            bodyType = "RECTANGLE",
            title = "${userName}님의 체형은\n직사각형에 가까워요.",
            description = "상체와 하체의 폭이 비교적 일정한 직선형 실루엣으로 분석되었어요.",
            recommendMessage = "허리선이나 어깨선에 포인트를 주는 스타일을 추천해요."
        )
    }
}

private fun String.toPersonalColorPreset(
    userName: String
): PersonalColorResultUiModel {
    return when (this) {
        "SPRING_WARM" -> PersonalColorResultUiModel(
            personalColor = "SPRING_WARM",
            resultTitle = "${userName}님은\n봄 웜톤 (Spring Warm)\n계열이 잘 어울리는 타입이에요!",
            resultRecommend = "밝고 맑은 색감, 따뜻한 톤, 생기 있는 스타일이 잘 어울려요."
        )

        "SUMMER_COOL" -> PersonalColorResultUiModel(
            personalColor = "SUMMER_COOL",
            resultTitle = "${userName}님은\n여름 쿨톤 (Summer Cool)\n계열이 잘 어울리는 타입이에요!",
            resultRecommend = "부드럽고 차분한 색감, 맑은 쿨톤, 은은한 스타일이 잘 어울려요."
        )

        "AUTUMN_WARM" -> PersonalColorResultUiModel(
            personalColor = "AUTUMN_WARM",
            resultTitle = "${userName}님은\n가을 웜톤 (Autumn Warm)\n계열이 잘 어울리는 타입이에요!",
            resultRecommend = "깊이 있는 색감, 따뜻한 톤, 차분하고 고급스러운 스타일이 잘 어울려요."
        )

        else -> PersonalColorResultUiModel(
            personalColor = "WINTER_COOL",
            resultTitle = "${userName}님은\n겨울 쿨톤 (Winter Cool)\n계열이 잘 어울리는 타입이에요!",
            resultRecommend = "선명한 색감, 차가운 톤, 대비감이 있는 스타일이 잘 어울려요."
        )
    }
}
