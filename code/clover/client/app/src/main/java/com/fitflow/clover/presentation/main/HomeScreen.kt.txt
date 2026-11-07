package com.fitflow.clover.presentation.main

import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.SizeTransform
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.slideInHorizontally
import androidx.compose.animation.slideOutHorizontally
import androidx.compose.animation.togetherWith
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.clipToBounds
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.fitflow.clover.R
import com.fitflow.clover.domain.modal.ProductSummaryModel
import java.text.NumberFormat
import java.util.Locale
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.tooling.preview.Preview
import coil.compose.AsyncImage
import com.fitflow.clover.mypage.mainscreen.SearchBar

private val MainGreen = Color(0xFF99DE81)
private val HeaderGreen = Color(0x3399DE81)
private val BannerGreen = Color(0xFFB0D9B1)

@Composable
fun HomeScreen(
    bodyType: String? = null,
    onClickLogo: () -> Unit,
    onClickNotification: () -> Unit,
    onClickChat: () -> Unit,
    onClickTradePost: () -> Unit,
    onClickCommunity: () -> Unit,
    onClickMyPage: () -> Unit,
    onClickSale: () -> Unit,
    onClickWrite: () -> Unit,
    onClickProductMore: () -> Unit,
    onClickBodyProductMore: () -> Unit,
    onClickDiagnosisStart: () -> Unit,
    onClickProductDetail: (Long) -> Unit,
    onClickCommunityMore: () -> Unit,
    onClickCommunityPost: (Long) -> Unit = {},
    onClickCarbonBanner: () -> Unit,
    onClickSearch:() -> Unit
) {
    MainSearchBar(
        onClickSearch = onClickSearch // 전달받은 함수 연결
    )
    val mainViewModel = remember {
        MainViewModel()
    }

    val mainUiState = mainViewModel.uiState.value
    val scrollState = rememberScrollState()
    var fabExpanded by remember { mutableStateOf(false) }

    LaunchedEffect(bodyType) {
        mainViewModel.loadMainProducts(
            bodyType = bodyType
        )
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.White)
            .statusBarsPadding()
            .navigationBarsPadding()
    ) {
        Column(
            modifier = Modifier.fillMaxSize()
        ) {
            MainHeader(
                onClickLogo = onClickLogo,
                onClickNotification = onClickNotification
            )

            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .verticalScroll(scrollState)
                    .padding(bottom = 92.dp)
            ) {
                Spacer(modifier = Modifier.height(16.dp))

                MainSearchBar(
                    onClickSearch = onClickSearch
                )

                Spacer(modifier = Modifier.height(22.dp))

                CarbonBanner(
                    onClick = onClickCarbonBanner
                )

                Spacer(modifier = Modifier.height(18.dp))

                ProductSection(
                    title = "내 체형에 추천",
                    products = mainUiState.bodyRecommendProducts,
                    emptyMessage = when {
                        mainUiState.isLoading -> {
                            "체형 추천 상품을 불러오는 중입니다."
                        }
                        !mainUiState.hasBodyDiagnosis -> {
                            "체형 진단을 완료하면\n내 체형에 맞는 추천 상품 9개를 확인할 수 있어요."
                        }
                        else -> {
                            "추천 상품이 없습니다."
                        }
                    },
                    emptyActionText = if (!mainUiState.hasBodyDiagnosis && !mainUiState.isLoading) {
                        "체형 진단하러 가기"
                    } else {
                        null
                    },
                    onClickEmptyAction = onClickDiagnosisStart,
                    onClickMore = onClickBodyProductMore,
                    onClickProduct = { product ->
                        onClickProductDetail(product.productId)
                    }
                )

                MainDivider()

                ProductSection(
                    title = "최근 등록",
                    products = mainUiState.recentProducts,
                    emptyMessage = if (mainUiState.isLoading) {
                        "최근 상품을 불러오는 중입니다."
                    } else {
                        "최근 등록된 상품이 없습니다."
                    },
                    onClickMore = onClickProductMore,
                    onClickProduct = { product ->
                        onClickProductDetail(product.productId)
                    }
                )

                MainDivider()

                CommunitySection(
                    title = "커뮤니티 최신글",
                    posts = mainViewModel.latestCommunityPosts,
                    onClickMore = onClickCommunityMore,
                    onClickPost = onClickCommunityPost
                )

                Spacer(modifier = Modifier.height(18.dp))

                CommunitySection(
                    title = "커뮤니티 인기글",
                    posts = mainViewModel.popularCommunityPosts,
                    onClickMore = onClickCommunityMore,
                    onClickPost = onClickCommunityPost
                )

                Spacer(modifier = Modifier.height(26.dp))
            }
        }

        MainFabMenu(
            expanded = fabExpanded,
            onToggle = {
                fabExpanded = !fabExpanded
            },
            onClickNotification = {
                fabExpanded = false
                onClickNotification()
            },
            onClickChat = {
                fabExpanded = false
                onClickChat()
            },
            onClickTradePost = {
                fabExpanded = false
                onClickTradePost()
            },
            onClickCommunity = {
                fabExpanded = false
                onClickCommunity()
            },
            onClickMyPage = {
                fabExpanded = false
                onClickMyPage()
            },
            onClickSale = {
                fabExpanded = false
                onClickSale()
            },
            onClickWrite = {
                fabExpanded = false
                onClickWrite()
            },
            modifier = Modifier
                .align(Alignment.BottomEnd)
                .padding(end = 10.dp, bottom = 10.dp)
        )
    }
}

@Composable
private fun MainHeader(
    onClickLogo: () -> Unit,
    onClickNotification: () -> Unit
) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .height(57.dp)
            .background(HeaderGreen)
    ) {
        Box(
            modifier = Modifier
                .align(Alignment.Center)
                .width(94.dp)
                .height(57.dp)
                .clickable(onClick = onClickLogo),
            contentAlignment = Alignment.Center
        ) {
            Image(
                painter = painterResource(id = R.drawable.main_clover_logo),
                contentDescription = "Clo-ver 메인 로고",
                modifier = Modifier
                    .width(94.dp)
                    .height(57.dp),
                contentScale = ContentScale.Fit
            )
        }

        Box(
            modifier = Modifier
                .align(Alignment.CenterEnd)
                .padding(end = 6.dp)
                .size(40.dp)
                .clickable(onClick = onClickNotification),
            contentAlignment = Alignment.Center
        ) {
            Image(
                painter = painterResource(id = R.drawable.ic_notification_bell),
                contentDescription = "알림",
                modifier = Modifier.size(32.dp),
                contentScale = ContentScale.Fit
            )
        }
    }
}

@Composable
private fun MainSearchBar(
    onClickSearch: () -> Unit
) {
    Box(
        modifier = Modifier.fillMaxWidth(),
        contentAlignment = Alignment.Center
    ) {
        Box(
            modifier = Modifier
                .width(286.dp)
                .height(29.dp)
                .border(
                    width = 1.dp,
                    color = Color.Black,
                    shape = RoundedCornerShape(5.dp)
                )
                .clickable(onClick = onClickSearch)
        ) {
            SearchIcon(
                modifier = Modifier
                    .align(Alignment.CenterEnd)
                    .padding(end = 9.dp)
                    .size(16.dp)
            )
        }
    }
}

@Composable
private fun SearchIcon(
    modifier: Modifier = Modifier
) {
    Canvas(
        modifier = modifier
    ) {
        drawCircle(
            color = Color.Black,
            radius = size.minDimension * 0.27f,
            center = Offset(size.width * 0.42f, size.height * 0.42f),
            style = Stroke(width = 1.4.dp.toPx())
        )

        drawLine(
            color = Color.Black,
            start = Offset(size.width * 0.62f, size.height * 0.62f),
            end = Offset(size.width * 0.86f, size.height * 0.86f),
            strokeWidth = 1.4.dp.toPx(),
            cap = StrokeCap.Round
        )
    }
}

@Composable
private fun CarbonBanner(
    onClick: () -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 4.dp)
            .height(153.dp)
            .background(
                color = BannerGreen,
                shape = RoundedCornerShape(5.dp)
            )
            .border(
                width = 1.dp,
                color = Color.Black,
                shape = RoundedCornerShape(5.dp)
            )
            .clickable(onClick = onClick),
        verticalAlignment = Alignment.CenterVertically
    ) {
        EarthHandImage(
            modifier = Modifier
                .width(150.dp)
                .fillMaxHeight()
        )

        Column(
            modifier = Modifier
                .weight(1f)
                .padding(end = 8.dp),
            verticalArrangement = Arrangement.Center
        ) {
            Text(
                text = "중고 거래하고\n지구도 살릴수 있다면?",
                color = Color.Black,
                fontSize = 24.sp,
                fontWeight = FontWeight.Normal,
                lineHeight = 29.sp
            )

            Spacer(modifier = Modifier.height(12.dp))

            Text(
                text = "탄소 포인트 제도 더 알아보러 가기",
                color = Color.Black,
                fontSize = 15.sp,
                fontWeight = FontWeight.Normal,
                lineHeight = 18.sp
            )
        }
    }
}

@Composable
private fun EarthHandImage(
    modifier: Modifier = Modifier
) {
    Canvas(
        modifier = modifier
    ) {
        val earthCenter = Offset(size.width * 0.52f, size.height * 0.40f)
        val earthRadius = size.width * 0.33f

        val handPath = Path().apply {
            moveTo(size.width * 0.05f, size.height * 0.78f)
            lineTo(size.width * 0.34f, size.height * 0.68f)
            quadraticBezierTo(
                size.width * 0.52f,
                size.height * 0.80f,
                size.width * 0.78f,
                size.height * 0.68f
            )
            lineTo(size.width * 0.91f, size.height * 0.74f)
            lineTo(size.width * 0.56f, size.height * 0.90f)
            lineTo(size.width * 0.20f, size.height * 0.84f)
            close()
        }

        drawPath(
            path = handPath,
            color = Color(0xFFFFD6CC)
        )

        drawLine(
            color = Color(0xFFFFBFB3),
            start = Offset(size.width * 0.42f, size.height * 0.71f),
            end = Offset(size.width * 0.68f, size.height * 0.72f),
            strokeWidth = 4.dp.toPx(),
            cap = StrokeCap.Round
        )

        drawCircle(
            color = Color(0xFF61B9E5),
            radius = earthRadius,
            center = earthCenter
        )

        val landColor = Color(0xFF4DD845)

        val landPath1 = Path().apply {
            moveTo(earthCenter.x - earthRadius * 0.55f, earthCenter.y - earthRadius * 0.70f)
            quadraticBezierTo(
                earthCenter.x - earthRadius * 0.20f,
                earthCenter.y - earthRadius * 0.95f,
                earthCenter.x + earthRadius * 0.10f,
                earthCenter.y - earthRadius * 0.55f
            )
            quadraticBezierTo(
                earthCenter.x - earthRadius * 0.10f,
                earthCenter.y - earthRadius * 0.10f,
                earthCenter.x + earthRadius * 0.38f,
                earthCenter.y + earthRadius * 0.05f
            )
            quadraticBezierTo(
                earthCenter.x + earthRadius * 0.02f,
                earthCenter.y + earthRadius * 0.38f,
                earthCenter.x - earthRadius * 0.50f,
                earthCenter.y + earthRadius * 0.12f
            )
            close()
        }

        drawPath(
            path = landPath1,
            color = landColor
        )

        val landPath2 = Path().apply {
            moveTo(earthCenter.x + earthRadius * 0.36f, earthCenter.y - earthRadius * 0.70f)
            quadraticBezierTo(
                earthCenter.x + earthRadius * 0.82f,
                earthCenter.y - earthRadius * 0.48f,
                earthCenter.x + earthRadius * 0.72f,
                earthCenter.y + earthRadius * 0.10f
            )
            quadraticBezierTo(
                earthCenter.x + earthRadius * 0.50f,
                earthCenter.y + earthRadius * 0.02f,
                earthCenter.x + earthRadius * 0.30f,
                earthCenter.y - earthRadius * 0.30f
            )
            close()
        }

        drawPath(
            path = landPath2,
            color = landColor
        )
    }
}

@Composable
private fun ProductSection(
    title: String,
    products: List<ProductSummaryModel>,
    emptyMessage: String,
    emptyActionText: String? = null,
    onClickEmptyAction: (() -> Unit)? = null,
    onClickMore: () -> Unit,
    onClickProduct: (ProductSummaryModel) -> Unit
) {
    val pageSize = 3

    val carouselProducts = products
        .distinctBy { product ->
            product.productId
        }
        .take(9)

    val pageCount = ((carouselProducts.size + pageSize - 1) / pageSize)
        .coerceAtLeast(1)

    var currentPage by remember(carouselProducts) {
        mutableIntStateOf(0)
    }

    var slideDirection by remember(carouselProducts) {
        mutableIntStateOf(1)
    }

    SectionHeader(
        title = title,
        onClickMore = onClickMore
    )

    Spacer(modifier = Modifier.height(8.dp))

    if (carouselProducts.isEmpty()) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .height(205.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Text(
                text = emptyMessage,
                color = Color(0xFF777777),
                fontSize = 12.sp,
                textAlign = TextAlign.Center,
                lineHeight = 18.sp
            )

            if (emptyActionText != null && onClickEmptyAction != null) {
                Spacer(modifier = Modifier.height(12.dp))

                Text(
                    text = emptyActionText,
                    color = Color.Black,
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Bold,
                    modifier = Modifier
                        .border(
                            width = 1.dp,
                            color = Color.Black,
                            shape = RoundedCornerShape(14.dp)
                        )
                        .clickable(onClick = onClickEmptyAction)
                        .padding(horizontal = 16.dp, vertical = 8.dp)
                )
            }
        }
        return
    }

    Box(
        modifier = Modifier
            .fillMaxWidth()
            .height(205.dp)
            .clipToBounds()
    ) {
        AnimatedContent(
            targetState = currentPage,
            modifier = Modifier
                .fillMaxWidth()
                .clipToBounds(),
            transitionSpec = {
                val direction = slideDirection

                val enterTransition = slideInHorizontally(
                    animationSpec = tween(durationMillis = 280)
                ) { fullWidth ->
                    direction * fullWidth
                } + fadeIn(
                    animationSpec = tween(durationMillis = 120)
                )

                val exitTransition = slideOutHorizontally(
                    animationSpec = tween(durationMillis = 280)
                ) { fullWidth ->
                    -direction * fullWidth
                } + fadeOut(
                    animationSpec = tween(durationMillis = 120)
                )

                enterTransition togetherWith exitTransition using SizeTransform(
                    clip = true
                )
            },
            label = "ProductSectionPageSlide"
        ) { animatedPage ->
            val visibleProducts = carouselProducts
                .drop(animatedPage * pageSize)
                .take(pageSize)

            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 23.dp),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                visibleProducts.forEach { product ->
                    ProductCard(
                        product = product,
                        onClick = {
                            onClickProduct(product)
                        }
                    )
                }

                repeat(pageSize - visibleProducts.size) {
                    Spacer(modifier = Modifier.width(103.dp))
                }
            }
        }

        if (carouselProducts.size > pageSize) {
            ChevronButton(
                isLeft = true,
                onClick = {
                    slideDirection = -1
                    currentPage = if (currentPage == 0) {
                        pageCount - 1
                    } else {
                        currentPage - 1
                    }
                },
                modifier = Modifier
                    .align(Alignment.CenterStart)
                    .padding(start = 4.dp)
            )

            ChevronButton(
                isLeft = false,
                onClick = {
                    slideDirection = 1
                    currentPage = (currentPage + 1) % pageCount
                },
                modifier = Modifier
                    .align(Alignment.CenterEnd)
                    .padding(end = 4.dp)
            )
        }
    }
}


@Composable
private fun SectionHeader(
    title: String,
    onClickMore: () -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 24.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(
            text = title,
            color = Color.Black,
            fontSize = 10.sp,
            fontWeight = FontWeight.Normal
        )

        Spacer(modifier = Modifier.weight(1f))

        Text(
            text = "전체보기",
            color = Color.Black,
            fontSize = 10.sp,
            fontWeight = FontWeight.Normal,
            modifier = Modifier.clickable(onClick = onClickMore)
        )
    }
}

@Composable
private fun ProductCard(
    product: ProductSummaryModel,
    onClick: () -> Unit
) {
    Column(
        modifier = Modifier
            .width(103.dp)
            .clickable(onClick = onClick)
    ) {
        Box(
            modifier = Modifier
                .width(103.dp)
                .height(150.dp)
                .clip(RoundedCornerShape(0.dp))
                .background(Color(0xFFD9D9D9)),
            contentAlignment = Alignment.Center
        ) {
            if (!product.thumbnailImageUrl.isNullOrBlank()) {
                AsyncImage(
                    model = product.thumbnailImageUrl,
                    contentDescription = product.name,
                    modifier = Modifier.fillMaxSize(),
                    contentScale = ContentScale.Crop
                )
            } else {
                ProductImagePlaceholder(
                    modifier = Modifier.fillMaxSize()
                )
            }
        }

        Spacer(modifier = Modifier.height(8.dp))

        Text(
            text = buildString {
                append(product.name)
                append("\n")
                append(product.grade.ifBlank { "브랜드" })
                append("\n")
                append(formatMainPrice(product.price))
            },
            color = Color.Black,
            fontSize = 10.sp,
            lineHeight = 12.sp,
            fontWeight = FontWeight.Normal,
            maxLines = 3,
            overflow = TextOverflow.Ellipsis
        )
    }
}


@Composable
private fun ProductImagePlaceholder(
    modifier: Modifier = Modifier
) {
    Canvas(
        modifier = modifier.background(Color(0xFFD9D9D9))
    ) {
        drawRect(
            color = Color(0xFFD9D9D9),
            size = size
        )

        drawRoundRect(
            color = Color(0xFFEFEFEF),
            topLeft = Offset(size.width * 0.22f, size.height * 0.10f),
            size = Size(size.width * 0.56f, size.height * 0.42f),
            cornerRadius = CornerRadius(8.dp.toPx(), 8.dp.toPx())
        )

        drawRoundRect(
            color = Color(0xFF222222),
            topLeft = Offset(size.width * 0.34f, size.height * 0.38f),
            size = Size(size.width * 0.34f, size.height * 0.50f),
            cornerRadius = CornerRadius(4.dp.toPx(), 4.dp.toPx())
        )
    }
}

@Composable
private fun ChevronButton(
    isLeft: Boolean,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Canvas(
        modifier = modifier
            .size(width = 18.dp, height = 44.dp)
            .clickable(onClick = onClick)
    ) {
        val startX = if (isLeft) size.width * 0.65f else size.width * 0.35f
        val midX = if (isLeft) size.width * 0.25f else size.width * 0.75f

        drawLine(
            color = Color.Black,
            start = Offset(startX, size.height * 0.20f),
            end = Offset(midX, size.height * 0.50f),
            strokeWidth = 2.dp.toPx(),
            cap = StrokeCap.Round
        )

        drawLine(
            color = Color.Black,
            start = Offset(midX, size.height * 0.50f),
            end = Offset(startX, size.height * 0.80f),
            strokeWidth = 2.dp.toPx(),
            cap = StrokeCap.Round
        )
    }
}

@Composable
private fun MainDivider() {
    Spacer(modifier = Modifier.height(10.dp))

    Box(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 27.dp)
            .height(1.dp)
            .background(Color.Black)
    )

    Spacer(modifier = Modifier.height(18.dp))
}

@Composable
private fun CommunitySection(
    title: String,
    posts: List<MainCommunityPostUiModel>,
    onClickMore: () -> Unit,
    onClickPost: (Long) -> Unit = {}
) {
    SectionHeader(
        title = title,
        onClickMore = onClickMore
    )

    Spacer(modifier = Modifier.height(8.dp))

    Column(
        modifier = Modifier.padding(horizontal = 27.dp),
        verticalArrangement = Arrangement.spacedBy(11.dp)
    ) {
        posts.forEach { post ->
            CommunityPostRow(
                post = post,
                onClickPost = onClickPost
            )
        }
    }
}

@Composable
private fun CommunityPostRow(
    post: MainCommunityPostUiModel,
    onClickPost: (Long) -> Unit = {}
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .height(37.dp)
            .border(1.dp, Color.Black)
            .clickable { onClickPost(post.id) },
        verticalAlignment = Alignment.CenterVertically
    ) {
        CommunityThumb()

        Column(
            modifier = Modifier
                .weight(1f)
                .padding(start = 6.dp, end = 4.dp)
        ) {
            Text(
                text = post.title,
                color = Color.Black,
                fontSize = 10.sp,
                lineHeight = 12.sp,
                maxLines = 1
            )

            Spacer(modifier = Modifier.height(7.dp))

            Row(
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = post.nickname,
                    color = Color.Black,
                    fontSize = 7.sp,
                    lineHeight = 8.sp
                )

                Spacer(modifier = Modifier.width(10.dp))

                Text(
                    text = post.date,
                    color = Color.Black,
                    fontSize = 7.sp,
                    lineHeight = 8.sp
                )

                Spacer(modifier = Modifier.width(10.dp))

                Text(
                    text = "조회 ${post.viewCount}",
                    color = Color.Black,
                    fontSize = 7.sp,
                    lineHeight = 8.sp
                )

                Spacer(modifier = Modifier.width(8.dp))

                Text(
                    text = "댓글 ${post.commentCount}",
                    color = Color.Black,
                    fontSize = 7.sp,
                    lineHeight = 8.sp
                )

                Spacer(modifier = Modifier.width(8.dp))

                HeartIcon()

                Spacer(modifier = Modifier.width(3.dp))

                Text(
                    text = "${post.likeCount}",
                    color = Color.Black,
                    fontSize = 7.sp,
                    lineHeight = 8.sp
                )
            }
        }

        MoreVerticalIcon(
            modifier = Modifier
                .padding(end = 6.dp)
                .size(24.dp)
        )
    }
}

@Composable
private fun CommunityThumb() {
    Box(
        modifier = Modifier
            .size(37.dp)
            .border(1.dp, Color.Black),
        contentAlignment = Alignment.Center
    ) {
        Image(
            painter = painterResource(id = R.drawable.main_clover_logo),
            contentDescription = "커뮤니티 로고",
            modifier = Modifier.size(32.dp),
            contentScale = ContentScale.Fit
        )
    }
}

@Composable
private fun HeartIcon() {
    Canvas(
        modifier = Modifier.size(10.dp)
    ) {
        val path = Path().apply {
            moveTo(size.width * 0.50f, size.height * 0.82f)
            cubicTo(
                size.width * 0.10f,
                size.height * 0.55f,
                size.width * 0.08f,
                size.height * 0.25f,
                size.width * 0.32f,
                size.height * 0.20f
            )
            cubicTo(
                size.width * 0.43f,
                size.height * 0.18f,
                size.width * 0.50f,
                size.height * 0.28f,
                size.width * 0.50f,
                size.height * 0.28f
            )
            cubicTo(
                size.width * 0.50f,
                size.height * 0.28f,
                size.width * 0.57f,
                size.height * 0.18f,
                size.width * 0.68f,
                size.height * 0.20f
            )
            cubicTo(
                size.width * 0.92f,
                size.height * 0.25f,
                size.width * 0.90f,
                size.height * 0.55f,
                size.width * 0.50f,
                size.height * 0.82f
            )
            close()
        }

        drawPath(
            path = path,
            color = Color.Black,
            style = Stroke(width = 1.3.dp.toPx())
        )
    }
}

@Composable
private fun MoreVerticalIcon(
    modifier: Modifier = Modifier
) {
    Canvas(
        modifier = modifier
    ) {
        drawCircle(
            color = Color.Black,
            radius = 2.dp.toPx(),
            center = Offset(size.width / 2f, size.height * 0.25f)
        )
        drawCircle(
            color = Color.Black,
            radius = 2.dp.toPx(),
            center = Offset(size.width / 2f, size.height * 0.50f)
        )
        drawCircle(
            color = Color.Black,
            radius = 2.dp.toPx(),
            center = Offset(size.width / 2f, size.height * 0.75f)
        )
    }
}

@Composable
private fun MainFabMenu(
    expanded: Boolean,
    onToggle: () -> Unit,
    onClickNotification: () -> Unit,
    onClickChat: () -> Unit,
    onClickTradePost: () -> Unit,
    onClickCommunity: () -> Unit,
    onClickMyPage: () -> Unit,
    onClickSale: () -> Unit,
    onClickWrite: () -> Unit,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier,
        horizontalAlignment = Alignment.End
    ) {
        if (expanded) {
            FabMenuBox(
                height = 184.dp,
                items = listOf(
                    "알림" to onClickNotification,
                    "채팅방" to onClickChat,
                    "판매글" to onClickTradePost,
                    "커뮤니티" to onClickCommunity,
                    "마이 페이지" to onClickMyPage
                )
            )

            Spacer(modifier = Modifier.height(10.dp))

            FabMenuBox(
                height = 67.dp,
                items = listOf(
                    "판매" to onClickSale,
                    "글쓰기" to onClickWrite
                )
            )

            Spacer(modifier = Modifier.height(12.dp))
        }

        FloatingMenuButton(
            onClick = onToggle
        )
    }
}

@Composable
private fun FabMenuBox(
    height: androidx.compose.ui.unit.Dp,
    items: List<Pair<String, () -> Unit>>
) {
    Column(
        modifier = Modifier
            .width(134.dp)
            .height(height)
            .shadow(
                elevation = 6.dp,
                shape = RoundedCornerShape(10.dp)
            )
            .clip(RoundedCornerShape(10.dp))
            .background(Color.White),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.SpaceEvenly
    ) {
        items.forEach { item ->
            Text(
                text = item.first,
                color = Color.Black,
                fontSize = 16.sp,
                fontWeight = FontWeight.Medium,
                textAlign = TextAlign.Center,
                modifier = Modifier
                    .fillMaxWidth()
                    .clickable(onClick = item.second)
            )
        }
    }
}

@Composable
private fun FloatingMenuButton(
    onClick: () -> Unit
) {
    Box(
        modifier = Modifier
            .size(40.dp)
            .background(
                color = MainGreen,
                shape = CircleShape
            )
            .border(
                width = 1.dp,
                color = Color.Black,
                shape = CircleShape
            )
            .clickable(onClick = onClick),
        contentAlignment = Alignment.Center
    ) {
        HamburgerIcon()
    }
}

@Composable
private fun HamburgerIcon() {
    Canvas(
        modifier = Modifier.size(24.dp)
    ) {
        val strokeWidth = 2.dp.toPx()

        drawLine(
            color = Color.Black,
            start = Offset(size.width * 0.22f, size.height * 0.32f),
            end = Offset(size.width * 0.78f, size.height * 0.32f),
            strokeWidth = strokeWidth,
            cap = StrokeCap.Round
        )

        drawLine(
            color = Color.Black,
            start = Offset(size.width * 0.22f, size.height * 0.50f),
            end = Offset(size.width * 0.78f, size.height * 0.50f),
            strokeWidth = strokeWidth,
            cap = StrokeCap.Round
        )

        drawLine(
            color = Color.Black,
            start = Offset(size.width * 0.22f, size.height * 0.68f),
            end = Offset(size.width * 0.78f, size.height * 0.68f),
            strokeWidth = strokeWidth,
            cap = StrokeCap.Round
        )
    }
}

private fun formatMainPrice(price: Int): String {
    return NumberFormat
        .getNumberInstance(Locale.KOREA)
        .format(price) + "원"
}
