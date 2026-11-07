package com.fitflow.clover.data.remote.api

import com.fitflow.clover.data.remote.dto.ChatMessageResponse
import com.fitflow.clover.data.remote.dto.ChatRoomResponse
import com.fitflow.clover.data.remote.dto.CreateChatMessageRequest
import com.fitflow.clover.data.remote.dto.CreateProductChatRoomRequest
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Path
import retrofit2.http.Query

interface ChatApi {
    @GET("api/chat/rooms")
    suspend fun getChatRooms(
        @Query("filter") filter: String? = null
    ): List<ChatRoomResponse>

    @GET("api/chat/rooms/{chat_room_id}/messages")
    suspend fun getChatMessages(
        @Path("chat_room_id") chatRoomId: Long
    ): List<ChatMessageResponse>

    @POST("api/chat/rooms/product")
    suspend fun createOrGetProductChatRoom(
        @Body request: CreateProductChatRoomRequest
    ): ChatRoomResponse

    @POST("api/chat/rooms/{chat_room_id}/messages")
    suspend fun sendMessage(
        @Path("chat_room_id") chatRoomId: Long,
        @Body request: CreateChatMessageRequest
    ): ChatMessageResponse
}
