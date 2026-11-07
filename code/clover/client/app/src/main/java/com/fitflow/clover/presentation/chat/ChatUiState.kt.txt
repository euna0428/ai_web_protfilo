package com.fitflow.clover.presentation.chat

import androidx.compose.runtime.Immutable

@Immutable
data class ChatUiState(
    val isLoading: Boolean = false,
    val isMessageLoading: Boolean = false,
    val errorMessage: String? = null,

    val currentMemberId: Long = 1L,

    val selectedFilter: ChatRoomFilterUiType = ChatRoomFilterUiType.ALL,

    val chatRooms: List<ChatRoomUiModel> = emptyList(),
    val selectedRoom: ChatRoomUiModel? = null,
    val messages: List<ChatMessageUiModel> = emptyList(),

    val messageInput: String = "",
    val selectedDateLabel: String = "",

    val isAttachmentPanelVisible: Boolean = false,
    val isFullGalleryVisible: Boolean = false,

    val galleryImages: List<ChatGalleryImageUiModel> = emptyList()
)

enum class ChatRoomFilterUiType(
    val label: String
) {
    ALL("전체"),
    SELLING("판매"),
    BUYING("구매")
}

@Immutable
data class ChatRoomUiModel(
    val chatRoomId: Long,
    val productId: Long,

    val productName: String,
    val productImageUrl: String?,

    val sellerId: Long,
    val sellerNickname: String,
    val sellerProfileImageUrl: String?,

    val buyerId: Long,
    val buyerNickname: String,
    val buyerProfileImageUrl: String?,

    val lastMessage: String,
    val lastMessageTime: String,
    val unreadCount: Int = 0
) {
    fun opponentNickname(currentMemberId: Long): String {
        return if (currentMemberId == sellerId) {
            buyerNickname
        } else {
            sellerNickname
        }
    }

    fun opponentProfileImageUrl(currentMemberId: Long): String? {
        return if (currentMemberId == sellerId) {
            buyerProfileImageUrl
        } else {
            sellerProfileImageUrl
        }
    }
}

@Immutable
data class ChatMessageUiModel(
    val messageId: Long,
    val chatRoomId: Long,
    val senderId: Long,
    val senderNickname: String,
    val senderProfileImageUrl: String?,
    val content: String,
    val imageUrl: String? = null,
    val messageType: ChatMessageType,
    val createdAt: String
) {
    fun isMine(currentMemberId: Long): Boolean {
        return senderId == currentMemberId
    }
}

enum class ChatMessageType {
    TEXT,
    IMAGE,
    FILE
}

@Immutable
data class ChatGalleryImageUiModel(
    val imageId: Long,
    val imageUrl: String?,
    val sortOrder: Int
)