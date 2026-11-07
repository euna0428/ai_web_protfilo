package com.fitflow.clover.data.remote.dto

import com.fitflow.clover.domain.modal.ChatImageModel
import com.fitflow.clover.domain.modal.ChatMessageModel
import com.fitflow.clover.domain.modal.ChatMessageType
import com.fitflow.clover.domain.modal.ChatRoomModel
import com.google.gson.annotations.SerializedName

data class ChatRoomResponse(
    @SerializedName(value = "chat_room_id", alternate = ["chatRoomId"])
    val chatRoomId: Long? = null,

    @SerializedName(value = "product_id", alternate = ["productId"])
    val productId: Long? = null,

    @SerializedName(value = "buyer_id", alternate = ["buyerId"])
    val buyerId: Long? = null,

    @SerializedName(value = "seller_id", alternate = ["sellerId"])
    val sellerId: Long? = null,

    @SerializedName(value = "created_at", alternate = ["createdAt"])
    val createdAt: String? = null,

    @SerializedName(value = "updated_at", alternate = ["updatedAt"])
    val updatedAt: String? = null
)

data class ChatMessageResponse(
    @SerializedName(value = "message_id", alternate = ["messageId"])
    val messageId: Long? = null,

    @SerializedName(value = "chat_room_id", alternate = ["chatRoomId"])
    val chatRoomId: Long? = null,

    @SerializedName(value = "sender_id", alternate = ["senderId"])
    val senderId: Long? = null,

    @SerializedName("content")
    val content: String? = null,

    @SerializedName(value = "message_type", alternate = ["messageType"])
    val messageType: String? = null,

    @SerializedName(value = "created_at", alternate = ["createdAt"])
    val createdAt: String? = null
)

data class ChatImageResponse(
    @SerializedName(value = "image_id", alternate = ["imageId"])
    val imageId: Long? = null,

    @SerializedName(value = "image_url", alternate = ["imageUrl"])
    val imageUrl: String? = null,

    @SerializedName(value = "reference_type", alternate = ["referenceType"])
    val referenceType: String? = null,

    @SerializedName(value = "reference_id", alternate = ["referenceId"])
    val referenceId: Long? = null,

    @SerializedName(value = "sort_order", alternate = ["sortOrder"])
    val sortOrder: Int? = null,

    @SerializedName(value = "created_at", alternate = ["createdAt"])
    val createdAt: String? = null
)

data class CreateProductChatRoomRequest(
    @SerializedName("product_id")
    val productId: Long,

    @SerializedName("seller_id")
    val sellerId: Long
)

data class CreateChatMessageRequest(
    @SerializedName("content")
    val content: String,

    @SerializedName("message_type")
    val messageType: String
)

fun ChatRoomResponse.toDomain(): ChatRoomModel {
    return ChatRoomModel(
        chatRoomId = chatRoomId ?: 0L,
        productId = productId ?: 0L,
        buyerId = buyerId ?: 0L,
        sellerId = sellerId ?: 0L,
        createdAt = createdAt.orEmpty(),
        updatedAt = updatedAt.orEmpty()
    )
}

fun ChatMessageResponse.toDomain(): ChatMessageModel {
    return ChatMessageModel(
        messageId = messageId ?: 0L,
        chatRoomId = chatRoomId ?: 0L,
        senderId = senderId ?: 0L,
        content = content.orEmpty(),
        messageType = ChatMessageType.from(messageType),
        createdAt = createdAt.orEmpty()
    )
}

fun ChatImageResponse.toDomain(): ChatImageModel {
    return ChatImageModel(
        imageId = imageId ?: 0L,
        imageUrl = imageUrl.orEmpty(),
        referenceType = referenceType.orEmpty(),
        referenceId = referenceId ?: 0L,
        sortOrder = sortOrder ?: 0,
        createdAt = createdAt.orEmpty()
    )
}
