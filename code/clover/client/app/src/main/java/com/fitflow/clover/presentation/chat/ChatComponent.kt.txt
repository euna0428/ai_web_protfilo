package com.fitflow.clover.presentation.chat

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.imePadding
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Divider
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.fitflow.clover.R

private val CloverGreen = Color(0xFF99DE81)
private val CloverDeepGreen = Color(0xFF79AC78)
private val CloverLightGreen = Color(0xFFEFFBEA)
private val ChatBackgroundGreen = Color(0xFFD0E7D2)
private val LineColor = Color(0xFF111111)
private val EmptyImageColor = Color(0xFFD9D9D9)

@Composable
fun ChatListContent(
    state: ChatUiState,
    onBackClick: () -> Unit,
    onLogoClick: () -> Unit,
    onFilterClick: (ChatRoomFilterUiType) -> Unit,
    onRoomClick: (Long) -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.White)
            .statusBarsPadding()
    ) {
        ChatTopBar(
            onBackClick = onBackClick,
            onLogoClick = onLogoClick
        )

        Text(
            text = "채팅 목록",
            modifier = Modifier
                .fillMaxWidth()
                .padding(top = 14.dp),
            fontSize = 22.sp,
            fontWeight = FontWeight.Bold,
            color = Color.Black,
            textAlign = TextAlign.Center
        )

        Divider(
            modifier = Modifier.padding(horizontal = 24.dp, vertical = 14.dp),
            color = LineColor,
            thickness = 1.dp
        )

        ChatFilterRow(
            selectedFilter = state.selectedFilter,
            onFilterClick = onFilterClick
        )

        Divider(
            modifier = Modifier.padding(horizontal = 24.dp, vertical = 10.dp),
            color = LineColor,
            thickness = 1.dp
        )

        Box(
            modifier = Modifier
                .weight(1f)
                .fillMaxWidth()
        ) {
            val visibleRooms = filteredChatRooms(
                rooms = state.chatRooms,
                filter = state.selectedFilter,
                currentMemberId = state.currentMemberId
            )

            when {
                state.isLoading -> {
                    Text(
                        text = "채팅 목록을 불러오는 중입니다.",
                        modifier = Modifier.align(Alignment.Center),
                        fontSize = 14.sp,
                        color = Color.Black
                    )
                }

                visibleRooms.isEmpty() -> {
                    Text(
                        text = "표시할 채팅방이 없습니다.",
                        modifier = Modifier.align(Alignment.Center),
                        fontSize = 14.sp,
                        color = Color.Black
                    )
                }

                else -> {
                    LazyColumn(
                        modifier = Modifier.fillMaxSize(),
                        contentPadding = PaddingValues(horizontal = 24.dp)
                    ) {
                        items(
                            items = visibleRooms,
                            key = { room -> room.chatRoomId }
                        ) { room ->
                            ChatRoomListItem(
                                room = room,
                                currentMemberId = state.currentMemberId,
                                onClick = { onRoomClick(room.chatRoomId) }
                            )

                            Divider(
                                color = LineColor,
                                thickness = 1.dp
                            )
                        }
                    }
                }
            }
        }

        Box(
            modifier = Modifier
                .fillMaxWidth()
                .padding(end = 12.dp, bottom = 18.dp)
                .navigationBarsPadding(),
            contentAlignment = Alignment.CenterEnd
        ) {
            Box(
                modifier = Modifier
                    .size(40.dp)
                    .clip(CircleShape)
                    .background(CloverGreen)
                    .border(1.dp, LineColor, CircleShape),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = "≡",
                    fontSize = 24.sp,
                    fontWeight = FontWeight.Bold,
                    color = LineColor,
                    textAlign = TextAlign.Center
                )
            }
        }
    }
}

@Composable
fun ChatRoomContent(
    state: ChatUiState,
    onBackClick: () -> Unit,
    onLogoClick: () -> Unit,
    onInputChange: (String) -> Unit,
    onSendClick: () -> Unit,
    onPlusClick: () -> Unit,
    onOpenFullGallery: () -> Unit,
    onImageClick: (String?) -> Unit
) {
    val room = state.selectedRoom ?: return

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.White)
            .statusBarsPadding()
            .imePadding()
    ) {
        ChatProductHeader(
            room = room,
            onBackClick = onBackClick,
            onLogoClick = onLogoClick
        )

        Column(
            modifier = Modifier
                .weight(1f)
                .fillMaxWidth()
                .background(ChatBackgroundGreen)
        ) {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(24.dp)
            ) {
                Text(
                    text = state.selectedDateLabel.ifBlank { "날짜" },
                    modifier = Modifier.align(Alignment.Center),
                    fontSize = 10.sp,
                    color = Color.Black
                )

                Box(
                    modifier = Modifier
                        .align(Alignment.TopEnd)
                        .width(52.dp)
                        .height(12.dp)
                        .clip(
                            RoundedCornerShape(
                                bottomStart = 6.dp,
                                bottomEnd = 6.dp
                            )
                        )
                        .background(Color.White),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = "==",
                        fontSize = 16.sp,
                        color = Color.Black,
                        lineHeight = 16.sp
                    )
                }
            }

            Box(
                modifier = Modifier
                    .weight(1f)
                    .fillMaxWidth()
            ) {
                val roomMessages = state.messages.filter { message ->
                    message.chatRoomId == room.chatRoomId
                }

                if (roomMessages.isEmpty()) {
                    Text(
                        text = "메시지를 입력하면 채팅이 시작됩니다.",
                        modifier = Modifier.align(Alignment.Center),
                        fontSize = 13.sp,
                        color = Color.Black.copy(alpha = 0.65f)
                    )
                } else {
                    LazyColumn(
                        modifier = Modifier.fillMaxSize(),
                        contentPadding = PaddingValues(
                            horizontal = 14.dp,
                            vertical = 16.dp
                        ),
                        verticalArrangement = Arrangement.spacedBy(18.dp)
                    ) {
                        items(
                            items = roomMessages,
                            key = { message -> message.messageId }
                        ) { message ->
                            ChatMessageBubble(
                                message = message,
                                currentMemberId = state.currentMemberId
                            )
                        }
                    }
                }
            }

            ChatInputBar(
                value = state.messageInput,
                onValueChange = onInputChange,
                onSendClick = onSendClick,
                onPlusClick = onPlusClick
            )

            if (state.isAttachmentPanelVisible) {
                AttachmentPreviewPanel(
                    images = state.galleryImages,
                    onOpenFullGallery = onOpenFullGallery,
                    onImageClick = onImageClick
                )
            }
        }
    }
}

@Composable
fun ChatFullGalleryContent(
    images: List<ChatGalleryImageUiModel>,
    onCloseClick: () -> Unit,
    onOpenSystemGallery: () -> Unit,
    onImageClick: (String?) -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.White)
            .statusBarsPadding()
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 9.dp, vertical = 28.dp)
                .height(63.dp)
                .clip(RoundedCornerShape(5.dp))
                .background(CloverDeepGreen),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(
                modifier = Modifier
                    .size(54.dp)
                    .clickable(onClick = onCloseClick),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = "×",
                    fontSize = 34.sp,
                    fontWeight = FontWeight.Light,
                    color = Color.White,
                    textAlign = TextAlign.Center
                )
            }

            Text(
                text = "전체 보기",
                modifier = Modifier.weight(1f),
                color = Color.White,
                fontSize = 20.sp,
                fontWeight = FontWeight.Medium,
                textAlign = TextAlign.Center
            )

            Spacer(modifier = Modifier.width(54.dp))
        }

        LazyVerticalGrid(
            columns = GridCells.Fixed(3),
            modifier = Modifier.fillMaxSize(),
            contentPadding = PaddingValues(horizontal = 9.dp, vertical = 6.dp),
            horizontalArrangement = Arrangement.spacedBy(7.dp),
            verticalArrangement = Arrangement.spacedBy(7.dp)
        ) {
            item {
                CameraTile(
                    modifier = Modifier
                        .fillMaxWidth()
                        .aspectRatio(1f)
                        .clickable { onOpenSystemGallery() }
                )
            }

            items(
                items = images,
                key = { image -> image.imageId }
            ) { image ->
                ImageBox(
                    imageUrl = image.imageUrl,
                    modifier = Modifier
                        .fillMaxWidth()
                        .aspectRatio(1f)
                        .clickable { onImageClick(image.imageUrl) },
                    showCrossWhenEmpty = true
                )
            }
        }
    }
}

@Composable
private fun ChatTopBar(
    onBackClick: () -> Unit,
    onLogoClick: () -> Unit
) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .height(57.dp)
            .background(CloverLightGreen)
    ) {
        Box(
            modifier = Modifier
                .align(Alignment.CenterStart)
                .padding(start = 12.dp)
                .size(40.dp)
                .clickable(onClick = onBackClick),
            contentAlignment = Alignment.Center
        ) {
            ChatBackChevron()
        }

        Box(
            modifier = Modifier
                .align(Alignment.Center)
                .width(94.dp)
                .height(57.dp)
                .clickable(onClick = onLogoClick),
            contentAlignment = Alignment.Center
        ) {
            ChatCloverLogo()
        }
    }
}

@Composable
private fun ChatBackChevron() {
    Canvas(
        modifier = Modifier.size(28.dp)
    ) {
        val strokeWidth = 2.2.dp.toPx()

        drawLine(
            color = Color.Black,
            start = Offset(size.width * 0.62f, size.height * 0.20f),
            end = Offset(size.width * 0.34f, size.height * 0.50f),
            strokeWidth = strokeWidth,
            cap = StrokeCap.Round
        )

        drawLine(
            color = Color.Black,
            start = Offset(size.width * 0.34f, size.height * 0.50f),
            end = Offset(size.width * 0.62f, size.height * 0.80f),
            strokeWidth = strokeWidth,
            cap = StrokeCap.Round
        )
    }
}

@Composable
private fun ChatCloverLogo() {
    Image(
        painter = painterResource(id = R.drawable.main_clover_logo),
        contentDescription = "Clo-ver 메인 로고",
        modifier = Modifier
            .width(94.dp)
            .height(57.dp),
        contentScale = ContentScale.Fit
    )
}

@Composable
private fun ChatProductHeader(
    room: ChatRoomUiModel,
    onBackClick: () -> Unit,
    onLogoClick: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .background(Color.White)
    ) {
        ChatTopBar(
            onBackClick = onBackClick,
            onLogoClick = onLogoClick
        )

        Row(
            modifier = Modifier
                .fillMaxWidth()
                .height(112.dp)
                .padding(
                    start = 9.dp,
                    top = 6.dp,
                    end = 12.dp,
                    bottom = 6.dp
                ),
            verticalAlignment = Alignment.Top
        ) {
            ImageBox(
                imageUrl = room.productImageUrl,
                modifier = Modifier
                    .width(110.dp)
                    .height(100.dp),
                showCrossWhenEmpty = false,
                emptyColor = EmptyImageColor
            )

            Spacer(modifier = Modifier.width(8.dp))

            Text(
                text = "거래 상품명 : ${room.productName}",
                modifier = Modifier.padding(top = 2.dp),
                fontSize = 14.sp,
                fontWeight = FontWeight.Medium,
                color = Color.Black,
                maxLines = 2,
                overflow = TextOverflow.Ellipsis
            )
        }
    }
}

@Composable
private fun ChatFilterRow(
    selectedFilter: ChatRoomFilterUiType,
    onFilterClick: (ChatRoomFilterUiType) -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 19.dp),
        horizontalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        ChatRoomFilterUiType.values().forEach { filter ->
            ChatFilterButton(
                text = filter.label,
                selected = selectedFilter == filter,
                modifier = Modifier.weight(1f),
                onClick = { onFilterClick(filter) }
            )
        }
    }
}

@Composable
private fun ChatFilterButton(
    text: String,
    selected: Boolean,
    modifier: Modifier = Modifier,
    onClick: () -> Unit
) {
    Button(
        onClick = onClick,
        modifier = modifier.height(35.dp),
        colors = ButtonDefaults.buttonColors(
            containerColor = if (selected) CloverGreen else Color.White,
            contentColor = Color.Black
        ),
        shape = RoundedCornerShape(10.dp),
        border = BorderStroke(1.dp, LineColor),
        contentPadding = PaddingValues(0.dp)
    ) {
        Text(
            text = text,
            fontSize = 14.sp,
            fontWeight = FontWeight.Medium
        )
    }
}

@Composable
private fun ChatRoomListItem(
    room: ChatRoomUiModel,
    currentMemberId: Long,
    onClick: () -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .height(95.dp)
            .clickable { onClick() },
        verticalAlignment = Alignment.CenterVertically
    ) {
        ImageBox(
            imageUrl = room.productImageUrl,
            modifier = Modifier.size(80.dp),
            showCrossWhenEmpty = false,
            emptyColor = EmptyImageColor
        )

        Spacer(modifier = Modifier.width(12.dp))

        Column(
            modifier = Modifier.weight(1f),
            verticalArrangement = Arrangement.Center
        ) {
            Text(
                text = room.productName,
                fontSize = 14.sp,
                fontWeight = FontWeight.Bold,
                color = Color.Black,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis
            )

            Spacer(modifier = Modifier.height(5.dp))

            Text(
                text = room.opponentNickname(currentMemberId),
                fontSize = 12.sp,
                color = Color.Black.copy(alpha = 0.8f),
                maxLines = 1,
                overflow = TextOverflow.Ellipsis
            )

            Spacer(modifier = Modifier.height(3.dp))

            Text(
                text = room.lastMessage.ifBlank { "최근 메시지가 없습니다." },
                fontSize = 12.sp,
                color = Color.Black.copy(alpha = 0.65f),
                maxLines = 1,
                overflow = TextOverflow.Ellipsis
            )
        }

        Text(
            text = room.lastMessageTime.toShortDateText(),
            fontSize = 10.sp,
            color = Color.Black.copy(alpha = 0.65f)
        )
    }
}

@Composable
private fun ChatMessageBubble(
    message: ChatMessageUiModel,
    currentMemberId: Long
) {
    val isMine = message.isMine(currentMemberId)
    val isImageMessage = message.messageType == ChatMessageType.IMAGE

    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = if (isMine) Arrangement.End else Arrangement.Start,
        verticalAlignment = Alignment.Top
    ) {
        if (!isMine) {
            ImageBox(
                imageUrl = message.senderProfileImageUrl,
                modifier = Modifier.size(50.dp),
                showCrossWhenEmpty = true
            )

            Spacer(modifier = Modifier.width(7.dp))
        }

        if (isImageMessage) {
            ImageBox(
                imageUrl = message.imageUrl ?: message.content,
                modifier = Modifier
                    .width(170.dp)
                    .height(120.dp),
                showCrossWhenEmpty = true
            )
        } else {
            Box(
                modifier = Modifier
                    .widthIn(max = 250.dp)
                    .heightIn(min = 30.dp)
                    .clip(RoundedCornerShape(5.dp))
                    .background(Color.White)
                    .border(1.dp, LineColor, RoundedCornerShape(5.dp))
                    .padding(horizontal = 12.dp, vertical = 7.dp)
            ) {
                Text(
                    text = message.content,
                    fontSize = 14.sp,
                    color = Color.Black,
                    lineHeight = 19.sp
                )
            }
        }

        if (isMine) {
            Spacer(modifier = Modifier.width(7.dp))

            ImageBox(
                imageUrl = message.senderProfileImageUrl,
                modifier = Modifier.size(50.dp),
                showCrossWhenEmpty = true
            )
        }
    }
}

@Composable
private fun ChatInputBar(
    value: String,
    onValueChange: (String) -> Unit,
    onSendClick: () -> Unit,
    onPlusClick: () -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(
                start = 13.dp,
                end = 14.dp,
                top = 7.dp,
                bottom = 8.dp
            )
            .navigationBarsPadding(),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Box(
            modifier = Modifier
                .size(30.dp)
                .clip(CircleShape)
                .background(Color.White)
                .border(1.dp, LineColor, CircleShape)
                .clickable { onPlusClick() },
            contentAlignment = Alignment.Center
        ) {
            Text(
                text = "+",
                fontSize = 24.sp,
                fontWeight = FontWeight.Normal,
                color = LineColor,
                textAlign = TextAlign.Center
            )
        }

        Spacer(modifier = Modifier.width(14.dp))

        Row(
            modifier = Modifier
                .weight(1f)
                .height(40.dp)
                .clip(RoundedCornerShape(5.dp))
                .background(Color.White)
                .border(1.dp, LineColor, RoundedCornerShape(5.dp))
                .padding(start = 14.dp, end = 8.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            BasicTextField(
                value = value,
                onValueChange = onValueChange,
                modifier = Modifier.weight(1f),
                textStyle = TextStyle(
                    color = Color.Black,
                    fontSize = 14.sp
                ),
                singleLine = true,
                decorationBox = { innerTextField ->
                    if (value.isBlank()) {
                        Text(
                            text = "메시지 입력",
                            fontSize = 14.sp,
                            color = Color.Black.copy(alpha = 0.65f)
                        )
                    }

                    innerTextField()
                }
            )

            TextButton(
                onClick = onSendClick,
                contentPadding = PaddingValues(horizontal = 4.dp, vertical = 0.dp)
            ) {
                Text(
                    text = "보내기",
                    color = Color.Black,
                    fontSize = 14.sp
                )
            }
        }
    }
}

@Composable
private fun AttachmentPreviewPanel(
    images: List<ChatGalleryImageUiModel>,
    onOpenFullGallery: () -> Unit,
    onImageClick: (String?) -> Unit
) {
    LazyVerticalGrid(
        columns = GridCells.Fixed(4),
        modifier = Modifier
            .fillMaxWidth()
            .height(165.dp)
            .background(Color.White)
            .border(1.dp, LineColor),
        contentPadding = PaddingValues(horizontal = 20.dp, vertical = 8.dp),
        horizontalArrangement = Arrangement.spacedBy(20.dp),
        verticalArrangement = Arrangement.spacedBy(11.dp)
    ) {
        item {
            Box(
                modifier = Modifier
                    .size(70.dp)
                    .clip(RoundedCornerShape(10.dp))
                    .background(CloverDeepGreen)
                    .clickable { onOpenFullGallery() },
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = "+",
                    fontSize = 42.sp,
                    fontWeight = FontWeight.Light,
                    color = Color.White,
                    textAlign = TextAlign.Center
                )
            }
        }

        items(
            items = images.take(11),
            key = { image -> image.imageId }
        ) { image ->
            ImageBox(
                imageUrl = image.imageUrl,
                modifier = Modifier
                    .size(70.dp)
                    .clickable { onImageClick(image.imageUrl) },
                showCrossWhenEmpty = true
            )
        }
    }
}

@Composable
private fun CameraTile(
    modifier: Modifier = Modifier
) {
    Box(
        modifier = modifier
            .background(Color.White)
            .border(1.dp, LineColor, RoundedCornerShape(5.dp)),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = "카메라 아이콘",
            fontSize = 10.sp,
            color = Color.Black
        )
    }
}

@Composable
private fun ImageBox(
    imageUrl: String?,
    modifier: Modifier = Modifier,
    showCrossWhenEmpty: Boolean,
    emptyColor: Color = Color.White
) {
    Box(
        modifier = modifier
            .background(emptyColor)
            .border(1.dp, LineColor),
        contentAlignment = Alignment.Center
    ) {
        if (showCrossWhenEmpty || !imageUrl.isNullOrBlank()) {
            CrossLine()
        }
    }
}

@Composable
private fun CrossLine() {
    Canvas(
        modifier = Modifier.fillMaxSize()
    ) {
        drawLine(
            color = LineColor,
            start = Offset(0f, 0f),
            end = Offset(size.width, size.height),
            strokeWidth = 2f
        )

        drawLine(
            color = LineColor,
            start = Offset(size.width, 0f),
            end = Offset(0f, size.height),
            strokeWidth = 2f
        )
    }
}

private fun filteredChatRooms(
    rooms: List<ChatRoomUiModel>,
    filter: ChatRoomFilterUiType,
    currentMemberId: Long
): List<ChatRoomUiModel> {
    return when (filter) {
        ChatRoomFilterUiType.ALL -> rooms

        ChatRoomFilterUiType.SELLING -> {
            rooms.filter { room ->
                room.sellerId == currentMemberId
            }
        }

        ChatRoomFilterUiType.BUYING -> {
            rooms.filter { room ->
                room.buyerId == currentMemberId
            }
        }
    }
}

private fun String.toShortDateText(): String {
    if (isBlank()) return ""

    return take(10)
        .replace("-", ".")
        .removeSuffix(".")
}