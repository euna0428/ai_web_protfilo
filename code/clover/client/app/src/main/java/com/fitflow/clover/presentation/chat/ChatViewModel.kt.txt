package com.fitflow.clover.presentation.chat

import androidx.lifecycle.ViewModel
import com.fitflow.clover.data.remote.api.ChatApi
import com.fitflow.clover.data.repository.ChatRepositoryImpl
import com.fitflow.clover.di.NetworkModule
import com.fitflow.clover.domain.modal.ChatMessageModel
import com.fitflow.clover.domain.modal.ChatRoomModel
import com.fitflow.clover.domain.usecase.ChatUseCase
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.cancel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

class ChatViewModel(
    private val chatUseCase: ChatUseCase = ChatUseCase(
        chatRepository = ChatRepositoryImpl(
            chatApi = NetworkModule.createApi<ChatApi>()
        )
    )
) : ViewModel() {

    private val viewModelScope = CoroutineScope(
        SupervisorJob() + Dispatchers.Main.immediate
    )

    private val _uiState = MutableStateFlow(ChatUiState())
    val uiState: StateFlow<ChatUiState> = _uiState

    private var savedChatRooms: List<ChatRoomUiModel> = emptyList()
    private var savedMessagesByRoomId: Map<Long, List<ChatMessageUiModel>> = emptyMap()

    init {
        loadChatRooms()
    }

    override fun onCleared() {
        super.onCleared()
        viewModelScope.cancel()
    }

    fun loadChatRooms() {
        viewModelScope.launch {
            _uiState.update {
                it.copy(
                    isLoading = true,
                    errorMessage = null
                )
            }

            runCatching {
                chatUseCase.getChatRooms(
                    filter = null
                )
            }.onSuccess { rooms ->
                val serverRooms = rooms.map { room ->
                    room.toUiModel()
                }

                _uiState.update {
                    it.copy(
                        isLoading = false,
                        chatRooms = mergeChatRooms(
                            first = savedChatRooms,
                            second = serverRooms
                        ),
                        errorMessage = null
                    )
                }
            }.onFailure {
                _uiState.update {
                    it.copy(
                        isLoading = false,
                        chatRooms = mergeChatRooms(
                            first = savedChatRooms,
                            second = it.chatRooms
                        ),
                        errorMessage = null
                    )
                }
            }
        }
    }

    fun openProductChatRoom(
        productId: Long,
        sellerId: Long
    ) {
        viewModelScope.launch {
            _uiState.update {
                it.copy(
                    isLoading = true,
                    isMessageLoading = true,
                    errorMessage = null
                )
            }

            runCatching {
                val room = chatUseCase.createOrGetProductChatRoom(
                    productId = productId,
                    sellerId = sellerId
                )

                val messages = chatUseCase.getChatMessages(
                    chatRoomId = room.chatRoomId
                )

                room to messages
            }.onSuccess { result ->
                val room = result.first
                val serverMessages = result.second.map { message ->
                    message.toUiModel()
                }
                val savedMessages = savedMessagesByRoomId[room.chatRoomId].orEmpty()
                val visibleMessages = mergeChatMessages(
                    first = serverMessages,
                    second = savedMessages
                )
                val roomUiModel = room.toUiModel().withLastMessage(
                    messages = visibleMessages
                )

                _uiState.update {
                    it.copy(
                        isLoading = false,
                        isMessageLoading = false,
                        selectedRoom = roomUiModel,
                        chatRooms = upsertChatRoom(
                            rooms = it.chatRooms,
                            room = roomUiModel
                        ),
                        messages = visibleMessages,
                        messageInput = "",
                        selectedDateLabel = visibleMessages.lastOrNull()?.createdAt.orEmpty(),
                        isAttachmentPanelVisible = false,
                        isFullGalleryVisible = false,
                        errorMessage = null
                    )
                }
            }.onFailure {
                openSavedProductChatRoom(
                    productId = productId,
                    sellerId = sellerId
                )
            }
        }
    }

    private fun openSavedProductChatRoom(
        productId: Long,
        sellerId: Long
    ) {
        val currentMemberId = _uiState.value.currentMemberId
        val safeSellerId = if (sellerId == currentMemberId) {
            sellerId + 1000L
        } else {
            sellerId
        }
        val chatRoomId = productId * 100000L + safeSellerId
        val savedMessages = savedMessagesByRoomId[chatRoomId].orEmpty()

        val savedRoom = savedChatRooms.firstOrNull { room ->
            room.chatRoomId == chatRoomId
        } ?: _uiState.value.chatRooms.firstOrNull { room ->
            room.chatRoomId == chatRoomId
        }

        val roomUiModel = (savedRoom ?: ChatRoomUiModel(
            chatRoomId = chatRoomId,
            productId = productId,
            productName = "상품 번호 $productId",
            productImageUrl = null,
            sellerId = safeSellerId,
            sellerNickname = "판매자 $safeSellerId",
            sellerProfileImageUrl = null,
            buyerId = currentMemberId,
            buyerNickname = "구매자 $currentMemberId",
            buyerProfileImageUrl = null,
            lastMessage = "",
            lastMessageTime = "",
            unreadCount = 0
        )).withLastMessage(
            messages = savedMessages
        )

        saveChatRoom(roomUiModel)

        _uiState.update {
            it.copy(
                isLoading = false,
                isMessageLoading = false,
                selectedRoom = roomUiModel,
                chatRooms = upsertChatRoom(
                    rooms = it.chatRooms,
                    room = roomUiModel
                ),
                messages = savedMessages,
                messageInput = "",
                selectedDateLabel = savedMessages.lastOrNull()?.createdAt.orEmpty(),
                isAttachmentPanelVisible = false,
                isFullGalleryVisible = false,
                errorMessage = null
            )
        }
    }

    fun selectChatRoom(chatRoomId: Long) {
        val selectedRoom = _uiState.value.chatRooms.firstOrNull { room ->
            room.chatRoomId == chatRoomId
        } ?: savedChatRooms.firstOrNull { room ->
            room.chatRoomId == chatRoomId
        } ?: return

        viewModelScope.launch {
            _uiState.update {
                it.copy(
                    isMessageLoading = true,
                    errorMessage = null
                )
            }

            runCatching {
                chatUseCase.getChatMessages(
                    chatRoomId = chatRoomId
                )
            }.onSuccess { messages ->
                val serverMessages = messages.map { message ->
                    message.toUiModel()
                }
                val savedMessages = savedMessagesByRoomId[chatRoomId].orEmpty()
                val visibleMessages = mergeChatMessages(
                    first = serverMessages,
                    second = savedMessages
                )
                val updatedRoom = selectedRoom.withLastMessage(
                    messages = visibleMessages
                )

                if (savedMessages.isNotEmpty()) {
                    saveChatRoom(updatedRoom)
                }

                _uiState.update {
                    it.copy(
                        isMessageLoading = false,
                        selectedRoom = updatedRoom,
                        chatRooms = upsertChatRoom(
                            rooms = it.chatRooms,
                            room = updatedRoom
                        ),
                        messages = visibleMessages,
                        messageInput = "",
                        selectedDateLabel = visibleMessages.lastOrNull()?.createdAt.orEmpty(),
                        isAttachmentPanelVisible = false,
                        isFullGalleryVisible = false,
                        errorMessage = null
                    )
                }
            }.onFailure {
                openSavedChatRoom(
                    selectedRoom = selectedRoom
                )
            }
        }
    }

    private fun openSavedChatRoom(
        selectedRoom: ChatRoomUiModel
    ) {
        val savedMessages = savedMessagesByRoomId[selectedRoom.chatRoomId].orEmpty()
        val updatedRoom = selectedRoom.withLastMessage(
            messages = savedMessages
        )

        if (savedMessages.isNotEmpty()) {
            saveChatRoom(updatedRoom)
        }

        _uiState.update {
            it.copy(
                isMessageLoading = false,
                selectedRoom = updatedRoom,
                chatRooms = upsertChatRoom(
                    rooms = it.chatRooms,
                    room = updatedRoom
                ),
                messages = savedMessages,
                messageInput = "",
                selectedDateLabel = savedMessages.lastOrNull()?.createdAt.orEmpty(),
                isAttachmentPanelVisible = false,
                isFullGalleryVisible = false,
                errorMessage = null
            )
        }
    }

    fun backToChatList() {
        _uiState.update {
            it.copy(
                selectedRoom = null,
                messages = emptyList(),
                messageInput = "",
                selectedDateLabel = "",
                isAttachmentPanelVisible = false,
                isFullGalleryVisible = false,
                errorMessage = null
            )
        }

        loadChatRooms()
    }

    fun changeFilter(filter: ChatRoomFilterUiType) {
        _uiState.update {
            it.copy(
                selectedFilter = filter,
                selectedRoom = null,
                messages = emptyList(),
                messageInput = "",
                selectedDateLabel = "",
                isAttachmentPanelVisible = false,
                isFullGalleryVisible = false,
                errorMessage = null
            )
        }
    }

    fun updateMessageInput(value: String) {
        _uiState.update {
            it.copy(
                messageInput = value
            )
        }
    }

    fun toggleAttachmentPanel() {
        _uiState.update {
            it.copy(
                isAttachmentPanelVisible = !it.isAttachmentPanelVisible
            )
        }
    }

    fun openFullGallery() {
        _uiState.update {
            it.copy(
                isFullGalleryVisible = true
            )
        }
    }

    fun closeFullGallery() {
        _uiState.update {
            it.copy(
                isFullGalleryVisible = false
            )
        }
    }

    fun setGalleryImages(imageUris: List<String>) {
        _uiState.update {
            it.copy(
                galleryImages = imageUris.mapIndexed { index, uri ->
                    ChatGalleryImageUiModel(
                        imageId = index.toLong() + 1L,
                        imageUrl = uri,
                        sortOrder = index
                    )
                }
            )
        }
    }

    fun sendTextMessage() {
        val state = _uiState.value
        val room = state.selectedRoom ?: return
        val input = state.messageInput.trim()

        if (input.isEmpty()) return

        viewModelScope.launch {
            runCatching {
                chatUseCase.sendTextMessage(
                    chatRoomId = room.chatRoomId,
                    content = input
                )
            }.onSuccess {
                appendSavedMessage(
                    room = room,
                    content = input,
                    imageUrl = null,
                    messageType = ChatMessageType.TEXT
                )
            }.onFailure {
                appendSavedMessage(
                    room = room,
                    content = input,
                    imageUrl = null,
                    messageType = ChatMessageType.TEXT
                )
            }
        }
    }

    fun sendImageMessage(imageUrl: String?) {
        val state = _uiState.value
        val room = state.selectedRoom ?: return
        val safeImageUrl = imageUrl?.trim().orEmpty()

        if (safeImageUrl.isBlank()) return

        viewModelScope.launch {
            runCatching {
                chatUseCase.sendImageMessage(
                    chatRoomId = room.chatRoomId,
                    imageUrl = safeImageUrl
                )
            }.onSuccess {
                appendSavedMessage(
                    room = room,
                    content = safeImageUrl,
                    imageUrl = safeImageUrl,
                    messageType = ChatMessageType.IMAGE
                )
            }.onFailure {
                appendSavedMessage(
                    room = room,
                    content = safeImageUrl,
                    imageUrl = safeImageUrl,
                    messageType = ChatMessageType.IMAGE
                )
            }
        }
    }

    private fun appendSavedMessage(
        room: ChatRoomUiModel,
        content: String,
        imageUrl: String?,
        messageType: ChatMessageType
    ) {
        val state = _uiState.value
        val savedMessages = savedMessagesByRoomId[room.chatRoomId].orEmpty()
        val localMessage = ChatMessageUiModel(
            messageId = generateLocalMessageId(
                roomId = room.chatRoomId
            ),
            chatRoomId = room.chatRoomId,
            senderId = state.currentMemberId,
            senderNickname = "사용자 ${state.currentMemberId}",
            senderProfileImageUrl = null,
            content = content,
            imageUrl = imageUrl,
            messageType = messageType,
            createdAt = "방금 전"
        )
        val updatedSavedMessages = savedMessages + localMessage
        val updatedVisibleMessages = mergeChatMessages(
            first = state.messages,
            second = listOf(localMessage)
        )
        val updatedRoom = room.withLastMessage(
            messages = updatedSavedMessages
        )

        savedMessagesByRoomId = savedMessagesByRoomId + (
                room.chatRoomId to updatedSavedMessages
                )
        saveChatRoom(updatedRoom)

        _uiState.update {
            it.copy(
                selectedRoom = updatedRoom,
                chatRooms = upsertChatRoom(
                    rooms = it.chatRooms,
                    room = updatedRoom
                ),
                messages = updatedVisibleMessages,
                messageInput = "",
                selectedDateLabel = localMessage.createdAt,
                isAttachmentPanelVisible = false,
                isFullGalleryVisible = false,
                errorMessage = null
            )
        }
    }

    private fun generateLocalMessageId(
        roomId: Long
    ): Long {
        val savedMessageCount = savedMessagesByRoomId[roomId]?.size ?: 0
        return roomId * 100000L + savedMessageCount + 1L
    }

    private fun saveChatRoom(
        room: ChatRoomUiModel
    ) {
        savedChatRooms = upsertChatRoom(
            rooms = savedChatRooms,
            room = room
        )
    }

    private fun upsertChatRoom(
        rooms: List<ChatRoomUiModel>,
        room: ChatRoomUiModel
    ): List<ChatRoomUiModel> {
        val filteredRooms = rooms.filterNot { existingRoom ->
            existingRoom.chatRoomId == room.chatRoomId
        }

        return listOf(room) + filteredRooms
    }

    private fun mergeChatRooms(
        first: List<ChatRoomUiModel>,
        second: List<ChatRoomUiModel>
    ): List<ChatRoomUiModel> {
        return (first + second).distinctBy { room ->
            room.chatRoomId
        }
    }

    private fun mergeChatMessages(
        first: List<ChatMessageUiModel>,
        second: List<ChatMessageUiModel>
    ): List<ChatMessageUiModel> {
        return (first + second).distinctBy { message ->
            message.messageId
        }
    }

    private fun ChatRoomUiModel.withLastMessage(
        messages: List<ChatMessageUiModel>
    ): ChatRoomUiModel {
        val lastMessage = messages.lastOrNull() ?: return this

        return copy(
            lastMessage = if (lastMessage.messageType == ChatMessageType.IMAGE) {
                "사진을 보냈습니다."
            } else {
                lastMessage.content
            },
            lastMessageTime = lastMessage.createdAt
        )
    }

    private fun ChatRoomModel.toUiModel(
        messages: List<ChatMessageModel> = emptyList()
    ): ChatRoomUiModel {
        val lastMessage = messages.lastOrNull()

        return ChatRoomUiModel(
            chatRoomId = chatRoomId,
            productId = productId,
            productName = "상품 번호 $productId",
            productImageUrl = null,
            sellerId = sellerId,
            sellerNickname = "판매자 $sellerId",
            sellerProfileImageUrl = null,
            buyerId = buyerId,
            buyerNickname = "구매자 $buyerId",
            buyerProfileImageUrl = null,
            lastMessage = lastMessage?.content.orEmpty(),
            lastMessageTime = lastMessage?.createdAt.orEmpty(),
            unreadCount = 0
        )
    }

    private fun ChatMessageModel.toUiModel(): ChatMessageUiModel {
        return ChatMessageUiModel(
            messageId = messageId,
            chatRoomId = chatRoomId,
            senderId = senderId,
            senderNickname = "사용자 $senderId",
            senderProfileImageUrl = null,
            content = content,
            imageUrl = if (messageType.name == "IMAGE") {
                content
            } else {
                null
            },
            messageType = when (messageType.name) {
                "IMAGE" -> ChatMessageType.IMAGE
                "FILE" -> ChatMessageType.FILE
                else -> ChatMessageType.TEXT
            },
            createdAt = createdAt
        )
    }
}
