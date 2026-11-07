package com.fitflow.clover.presentation.main

import androidx.compose.runtime.State
import androidx.compose.runtime.mutableStateOf
import com.fitflow.clover.data.remote.api.ProductApi
import com.fitflow.clover.data.repository.ProductRepositoryImpl
import com.fitflow.clover.di.NetworkModule
import com.fitflow.clover.domain.modal.ProductSummaryModel
import com.fitflow.clover.domain.usecase.ProductUseCase
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.launch

data class MainUiState(
    val isLoading: Boolean = false,
    val hasBodyDiagnosis: Boolean = false,
    val recentProducts: List<ProductSummaryModel> = emptyList(),
    val bodyRecommendProducts: List<ProductSummaryModel> = emptyList(),
    val errorMessage: String? = null
)

data class MainCommunityPostUiModel(
    val id: Long,
    val title: String,
    val nickname: String,
    val date: String,
    val viewCount: Int,
    val commentCount: Int,
    val likeCount: Int
)

class MainViewModel(
    private val productUseCase: ProductUseCase = ProductUseCase(
        productRepository = ProductRepositoryImpl(
            productApi = NetworkModule.createApi<ProductApi>()
        )
    )
) {
    private val viewModelScope = CoroutineScope(
        SupervisorJob() + Dispatchers.Main.immediate
    )

    private val _uiState = mutableStateOf(MainUiState())
    val uiState: State<MainUiState> = _uiState

    val latestCommunityPosts: List<MainCommunityPostUiModel> = listOf(
        MainCommunityPostUiModel(
            id = 1L,
            title = "한정판 콜라보 티셔츠 솔직한 후기",
            nickname = "닉네임",
            date = "2026-04-24",
            viewCount = 120,
            commentCount = 4,
            likeCount = 20
        ),
        MainCommunityPostUiModel(
            id = 2L,
            title = "중고 거래할 때 확인해야 할 점",
            nickname = "클로버",
            date = "2026-04-25",
            viewCount = 98,
            commentCount = 3,
            likeCount = 15
        ),
        MainCommunityPostUiModel(
            id = 3L,
            title = "데님 자켓 코디 추천 받아요",
            nickname = "스타일러",
            date = "2026-04-26",
            viewCount = 210,
            commentCount = 8,
            likeCount = 31
        )
    )

    val popularCommunityPosts: List<MainCommunityPostUiModel> = listOf(
        MainCommunityPostUiModel(
            id = 4L,
            title = "겨울 쿨톤에게 잘 맞는 색상 정리",
            nickname = "톤잘알",
            date = "2026-04-24",
            viewCount = 340,
            commentCount = 12,
            likeCount = 45
        ),
        MainCommunityPostUiModel(
            id = 5L,
            title = "체형별 아우터 고르는 방법",
            nickname = "핏마스터",
            date = "2026-04-25",
            viewCount = 286,
            commentCount = 9,
            likeCount = 38
        ),
        MainCommunityPostUiModel(
            id = 6L,
            title = "중고 의류 판매 사진 잘 찍는 팁",
            nickname = "클로버가이드",
            date = "2026-04-26",
            viewCount = 254,
            commentCount = 7,
            likeCount = 34
        )
    )

    fun loadMainProducts(
        bodyType: String?,
        size: Int = 9
    ) {
        val recommendedType = normalizeBodyTypeOrNull(bodyType)
        val hasBodyDiagnosis = recommendedType != null

        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(
                isLoading = true,
                hasBodyDiagnosis = hasBodyDiagnosis,
                errorMessage = null
            )

            runCatching {
                val recentProducts = productUseCase.getRecentProducts(
                    size = size
                )

                val bodyRecommendProducts = if (recommendedType == null) {
                    emptyList()
                } else {
                    productUseCase.getBodyRecommendedProducts(
                        recommendedType = recommendedType,
                        size = 9
                    )
                }

                recentProducts to bodyRecommendProducts
            }.onSuccess { result ->
                val recentProducts = fillMainProducts(
                    source = result.first,
                    fallback = mainSampleProducts
                )

                val bodyRecommendProducts = if (recommendedType == null) {
                    emptyList()
                } else {
                    fillMainProducts(
                        source = result.second,
                        fallback = mainSampleProducts,
                        preferredRecommendedType = recommendedType
                    )
                }

                _uiState.value = MainUiState(
                    isLoading = false,
                    hasBodyDiagnosis = hasBodyDiagnosis,
                    recentProducts = recentProducts,
                    bodyRecommendProducts = bodyRecommendProducts,
                    errorMessage = null
                )
            }.onFailure { throwable ->
                _uiState.value = MainUiState(
                    isLoading = false,
                    hasBodyDiagnosis = hasBodyDiagnosis,
                    recentProducts = mainSampleProducts,
                    bodyRecommendProducts = if (recommendedType == null) {
                        emptyList()
                    } else {
                        fillMainProducts(
                            source = emptyList(),
                            fallback = mainSampleProducts,
                            preferredRecommendedType = recommendedType
                        )
                    },
                    errorMessage = throwable.message
                )
            }
        }
    }

    fun clearError() {
        _uiState.value = _uiState.value.copy(
            errorMessage = null
        )
    }

    private fun normalizeBodyTypeOrNull(bodyType: String?): String? {
        return when (
            bodyType
                ?.trim()
                ?.uppercase()
                ?.replace("-", "_")
                ?.replace(" ", "_")
        ) {
            "TRIANGLE", "PEAR", "A_LINE" -> "TRIANGLE"
            "INVERTED_TRIANGLE", "INVERTED" -> "INVERTED_TRIANGLE"
            "OVAL", "APPLE", "ROUND" -> "OVAL"
            "HOURGLASS", "HOUR_GLASS" -> "HOURGLASS"
            "RECTANGLE", "LEAN_COLUMN", "COLUMN", "STRAIGHT" -> "RECTANGLE"
            else -> null
        }
    }
}

private fun fillMainProducts(
    source: List<ProductSummaryModel>,
    fallback: List<ProductSummaryModel>,
    preferredRecommendedType: String? = null
): List<ProductSummaryModel> {
    val normalizedPreferredType = preferredRecommendedType
        ?.trim()
        ?.uppercase()

    val preferredFallback = fallback.filter { product ->
        product.recommendedType
            ?.trim()
            ?.uppercase() == normalizedPreferredType
    }

    return (source + preferredFallback + fallback)
        .distinctBy { product ->
            product.productId
        }
        .take(9)
}

private val mainSampleProducts = listOf(
    ProductSummaryModel(
        productId = 1L,
        sellerId = 1L,
        categoryId = 3L,
        colorId = null,
        name = "데님 워싱 자켓",
        price = 39800,
        content = "가볍게 걸치기 좋은 데님 워싱 자켓입니다.",
        size = "M",
        grade = "브랜드",
        tradingArea = "서울 강남구",
        recommendedType = "BALANCED",
        postStatus = "ACTIVE",
        viewCount = 12,
        wishlistCount = 4,
        createdAt = "방금 전",
        updatedAt = "방금 전",
        thumbnailImageUrl = null
    ),
    ProductSummaryModel(
        productId = 2L,
        sellerId = 1L,
        categoryId = 3L,
        colorId = null,
        name = "화이트 셔츠 자켓",
        price = 42000,
        content = "깔끔한 무드의 셔츠형 아우터입니다.",
        size = "L",
        grade = "브랜드",
        tradingArea = "서울 마포구",
        recommendedType = "RECTANGLE",
        postStatus = "ACTIVE",
        viewCount = 18,
        wishlistCount = 6,
        createdAt = "3분 전",
        updatedAt = "3분 전",
        thumbnailImageUrl = null
    ),
    ProductSummaryModel(
        productId = 3L,
        sellerId = 1L,
        categoryId = 1L,
        colorId = null,
        name = "블랙 이너 티셔츠",
        price = 19800,
        content = "어디에나 받쳐 입기 좋은 기본 티셔츠입니다.",
        size = "M",
        grade = "브랜드",
        tradingArea = "서울 성동구",
        recommendedType = "INVERTED_TRIANGLE",
        postStatus = "ACTIVE",
        viewCount = 25,
        wishlistCount = 9,
        createdAt = "8분 전",
        updatedAt = "8분 전",
        thumbnailImageUrl = null
    ),
    ProductSummaryModel(
        productId = 4L,
        sellerId = 1L,
        categoryId = 2L,
        colorId = null,
        name = "카고 와이드 팬츠",
        price = 35000,
        content = "활동성이 좋은 와이드 카고 팬츠입니다.",
        size = "M",
        grade = "브랜드",
        tradingArea = "경기 수원시",
        recommendedType = "TRIANGLE",
        postStatus = "ACTIVE",
        viewCount = 31,
        wishlistCount = 11,
        createdAt = "15분 전",
        updatedAt = "15분 전",
        thumbnailImageUrl = null
    ),
    ProductSummaryModel(
        productId = 5L,
        sellerId = 1L,
        categoryId = 2L,
        colorId = null,
        name = "데님 스트레이트 팬츠",
        price = 29000,
        content = "데일리로 입기 좋은 스트레이트 데님 팬츠입니다.",
        size = "L",
        grade = "브랜드",
        tradingArea = "인천 부평구",
        recommendedType = "BALANCED",
        postStatus = "ACTIVE",
        viewCount = 40,
        wishlistCount = 13,
        createdAt = "20분 전",
        updatedAt = "20분 전",
        thumbnailImageUrl = null
    ),
    ProductSummaryModel(
        productId = 6L,
        sellerId = 1L,
        categoryId = 3L,
        colorId = null,
        name = "라이트 후드 집업",
        price = 27000,
        content = "간절기에 입기 좋은 후드 집업입니다.",
        size = "M",
        grade = "브랜드",
        tradingArea = "대전 서구",
        recommendedType = "OVAL",
        postStatus = "ACTIVE",
        viewCount = 44,
        wishlistCount = 15,
        createdAt = "30분 전",
        updatedAt = "30분 전",
        thumbnailImageUrl = null
    ),
    ProductSummaryModel(
        productId = 7L,
        sellerId = 1L,
        categoryId = 1L,
        colorId = null,
        name = "그레이 니트",
        price = 33000,
        content = "부드러운 착용감의 그레이 니트입니다.",
        size = "FREE",
        grade = "브랜드",
        tradingArea = "서울 송파구",
        recommendedType = "RECTANGLE",
        postStatus = "ACTIVE",
        viewCount = 52,
        wishlistCount = 18,
        createdAt = "45분 전",
        updatedAt = "45분 전",
        thumbnailImageUrl = null
    ),
    ProductSummaryModel(
        productId = 8L,
        sellerId = 1L,
        categoryId = 4L,
        colorId = null,
        name = "미니멀 스커트",
        price = 24000,
        content = "차분한 분위기의 미니멀 스커트입니다.",
        size = "S",
        grade = "브랜드",
        tradingArea = "부산 해운대구",
        recommendedType = "HOURGLASS",
        postStatus = "ACTIVE",
        viewCount = 61,
        wishlistCount = 21,
        createdAt = "1시간 전",
        updatedAt = "1시간 전",
        thumbnailImageUrl = null
    ),
    ProductSummaryModel(
        productId = 9L,
        sellerId = 1L,
        categoryId = 3L,
        colorId = null,
        name = "크롭 블루종",
        price = 46000,
        content = "핏이 예쁜 크롭 블루종 아우터입니다.",
        size = "M",
        grade = "브랜드",
        tradingArea = "광주 서구",
        recommendedType = "BALANCED",
        postStatus = "ACTIVE",
        viewCount = 73,
        wishlistCount = 25,
        createdAt = "2시간 전",
        updatedAt = "2시간 전",
        thumbnailImageUrl = null
    )
)