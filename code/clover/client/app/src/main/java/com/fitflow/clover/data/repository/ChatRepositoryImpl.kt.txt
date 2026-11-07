package com.fitflow.clover.data.repository

import com.fitflow.clover.data.remote.api.ChatApi
import com.fitflow.clover.data.remote.dto.CreateChatMessageRequest
import com.fitflow.clover.data.remote.dto.CreateProductChatRoomRequest
import com.fitflow.clover.data.remote.dto.toDomain
import com.fitflow.clover.domain.modal.ChatMessageModel
import com.fitflow.clover.domain.modal.ChatRoomModel
import com.fitflow.clover.domain.repository.ChatRepository

class ChatRepositoryImpl(
    private val chatApi: ChatApi
) : ChatRepository {

    override suspend fun getChatRooms(filter: String?): List<ChatRoomModel> {
        return chatApi.getChatRooms(filter = filter)
            .map { response -> response.toDomain() }
    }

    override suspend fun getChatMessages(chatRoomId: Long): List<ChatMessageModel> {
        return chatApi.getChatMessages(chatRoomId = chatRoomId)
            .map { response -> response.toDomain() }
    }

    override suspend fun createOrGetProductChatRoom(
        productId: Long,
        sellerId: Long
    ): ChatRoomModel {
        return chatApi.createOrGetProductChatRoom(
            request = CreateProductChatRoomRequest(
                productId = productId,
                sellerId = sellerId
            )
        ).toDomain()
    }

    override suspend fun sendTextMessage(
        chatRoomId: Long,
        content: String
    ): ChatMessageModel {
        return chatApi.sendMessage(
            chatRoomId = chatRoomId,
            request = CreateChatMessageRequest(
                content = content,
                messageType = "TEXT"
            )
        ).toDomain()
    }

    override suspend fun sendImageMessage(
        chatRoomId: Long,
        imageUrl: String
    ): ChatMessageModel {
        return chatApi.sendMessage(
            chatRoomId = chatRoomId,
            request = CreateChatMessageRequest(
                content = imageUrl,
                messageType = "IMAGE"
            )
        ).toDomain()
    }
}
