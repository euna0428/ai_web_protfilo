package com.fitflow.clover.core.navigation

import android.net.Uri

sealed class ScreenRoute(val route: String) {

    data object Splash : ScreenRoute("splash")
    data object Auth : ScreenRoute("auth")
    data object BodyAnalysis : ScreenRoute("body_analysis")
    data object PersonalColorQuestion : ScreenRoute("personal_color_question")
    data object PersonalColorResult : ScreenRoute("personal_color_result")
    data object PersonalColorRetry : ScreenRoute("personal_color_retry")

    data object Main : ScreenRoute("main")
    data object Home : ScreenRoute("home")
    data object Notification : ScreenRoute("notification")

    data object ProductList : ScreenRoute("product_list") {
        const val routeWithRecommendedType: String =
            "product_list?recommendedType={recommendedType}"

        fun createRoute(recommendedType: String? = null): String {
            return if (recommendedType.isNullOrBlank()) {
                route
            } else {
                "product_list?recommendedType=${Uri.encode(recommendedType)}"
            }
        }
    }

    data object ProductDetail : ScreenRoute("product_detail/{productId}") {
        fun createRoute(productId: Long): String {
            return "product_detail/$productId"
        }
    }

    data object ProductEdit : ScreenRoute("product_edit")

    data object Community : ScreenRoute("community")
    data object CommunityList : ScreenRoute("community_list")
    data object CommunityWrite : ScreenRoute("community_write")

    data object CommunityDetail : ScreenRoute("community_detail/{postId}") {
        fun createRoute(postId: Long): String {
            return "community_detail/$postId"
        }
    }

    data object CommunityEdit : ScreenRoute("community_edit/{postId}") {
        fun createRoute(postId: Long): String {
            return "community_edit/$postId"
        }
    }

    data object Chat : ScreenRoute("chat")

    data object ChatRoom : ScreenRoute(
        "chat_room?productId={productId}&sellerId={sellerId}&chatRoomId={chatRoomId}"
    ) {
        fun createRoute(
            productId: Long? = null,
            sellerId: Long? = null,
            chatRoomId: Long? = null
        ): String {
            val params = buildList {
                productId?.let { add("productId=$it") }
                sellerId?.let { add("sellerId=$it") }
                chatRoomId?.let { add("chatRoomId=$it") }
            }

            return if (params.isEmpty()) {
                "chat_room"
            } else {
                "chat_room?${params.joinToString("&")}"
            }
        }
    }

    data object TradePost : ScreenRoute("trade_post")
    data object MyPage : ScreenRoute("my_page")
    data object Sale : ScreenRoute("sale")
    data object SearchBar : ScreenRoute("searchbar")

    data object Report : ScreenRoute("report?targetType={targetType}&targetId={targetId}") {
        fun createRoute(
            targetType: String = "PRODUCT",
            targetId: Long = 0L
        ): String {
            return "report?targetType=${Uri.encode(targetType)}&targetId=$targetId"
        }
    }

    data object SellerProfile : ScreenRoute("seller_profile/{sellerId}") {
        fun createRoute(sellerId: Long): String {
            return "seller_profile/$sellerId"
        }
    }

    data object CarbonPoint : ScreenRoute("carbon_point")
}