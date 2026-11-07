package com.fitflow.clover.presentation.main

import androidx.compose.runtime.Composable

@Composable
fun MainScreen(
    bodyType: String? = null,
    onClickLogo: () -> Unit = {},
    onClickNotification: () -> Unit = {},
    onClickChat: () -> Unit = {},
    onClickTradePost: () -> Unit = {},
    onClickCommunity: () -> Unit = {},
    onClickMyPage: () -> Unit = {},
    onClickSale: () -> Unit = {},
    onClickWrite: () -> Unit = {},
    onClickProductMore: () -> Unit = {},
    onClickBodyProductMore: () -> Unit = {},
    onClickDiagnosisStart: () -> Unit = {},
    onClickProductDetail: (Long) -> Unit = {},
    onClickCommunityMore: () -> Unit = {},

    onClickCommunityPost: (Long) -> Unit = {},
    onClickCarbonBanner: () -> Unit = {},
    onClickSearch: () -> Unit

) {
    HomeScreen(
        bodyType = bodyType,
        onClickLogo = onClickLogo,
        onClickNotification = onClickNotification,
        onClickChat = onClickChat,
        onClickTradePost = onClickTradePost,
        onClickCommunity = onClickCommunity,
        onClickMyPage = onClickMyPage,
        onClickSale = onClickSale,
        onClickWrite = onClickWrite,
        onClickProductMore = onClickProductMore,
        onClickBodyProductMore = onClickBodyProductMore,
        onClickDiagnosisStart = onClickDiagnosisStart,
        onClickProductDetail = onClickProductDetail,
        onClickCommunityMore = onClickCommunityMore,
        onClickCommunityPost = onClickCommunityPost,
        onClickCarbonBanner = onClickCarbonBanner,
        onClickSearch = onClickSearch
    )
}