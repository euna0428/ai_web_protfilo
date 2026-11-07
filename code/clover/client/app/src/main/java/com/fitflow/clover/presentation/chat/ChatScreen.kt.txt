package com.fitflow.clover.presentation.chat

import androidx.activity.compose.BackHandler
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember

@Composable
fun ChatScreen(
    onBackClick: () -> Unit = {},
    onLogoClick: () -> Unit = {},
    viewModel: ChatViewModel? = null,
    openProductChatOnStart: Boolean = false,
    productId: Long? = null,
    sellerId: Long? = null
) {
    val chatViewModel = viewModel ?: remember {
        ChatViewModel()
    }

    val state by chatViewModel.uiState.collectAsState()

    LaunchedEffect(
        openProductChatOnStart,
        productId,
        sellerId
    ) {
        if (openProductChatOnStart && productId != null && sellerId != null) {
            chatViewModel.openProductChatRoom(
                productId = productId,
                sellerId = sellerId
            )
        }
    }

    val backFromRoom: () -> Unit = {
        if (openProductChatOnStart) {
            onBackClick()
        } else {
            chatViewModel.backToChatList()
        }
    }

    BackHandler {
        when {
            state.isFullGalleryVisible -> {
                chatViewModel.closeFullGallery()
            }

            state.selectedRoom != null -> {
                backFromRoom()
            }

            else -> {
                onBackClick()
            }
        }
    }

    when {
        state.isFullGalleryVisible -> {
            ChatFullGalleryContent(
                images = state.galleryImages,
                onCloseClick = {
                    chatViewModel.closeFullGallery()
                },
                onOpenSystemGallery = {
                },
                onImageClick = { imageUrl ->
                    chatViewModel.sendImageMessage(imageUrl)
                }
            )
        }

        state.selectedRoom != null -> {
            ChatRoomContent(
                state = state,
                onBackClick = backFromRoom,
                onLogoClick = onLogoClick,
                onInputChange = { value ->
                    chatViewModel.updateMessageInput(value)
                },
                onSendClick = {
                    chatViewModel.sendTextMessage()
                },
                onPlusClick = {
                    chatViewModel.toggleAttachmentPanel()
                },
                onOpenFullGallery = {
                    chatViewModel.openFullGallery()
                },
                onImageClick = { imageUrl ->
                    chatViewModel.sendImageMessage(imageUrl)
                }
            )
        }

        else -> {
            ChatListContent(
                state = state,
                onBackClick = onBackClick,
                onLogoClick = onLogoClick,
                onFilterClick = { filter ->
                    chatViewModel.changeFilter(filter)
                },
                onRoomClick = { chatRoomId ->
                    chatViewModel.selectChatRoom(chatRoomId)
                }
            )
        }
    }
}