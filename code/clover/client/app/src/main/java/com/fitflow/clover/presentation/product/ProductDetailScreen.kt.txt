package com.fitflow.clover.presentation.product

import android.content.Context
import android.content.Intent
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.DpOffset
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.fitflow.clover.R
import com.fitflow.clover.domain.modal.ProductDetailModel
import com.fitflow.clover.domain.modal.ProductImageModel

private val ProductDetailHeaderGreen = Color(0xFFE8F8E0)
private val ProductDetailButtonGreen = Color(0xFF99DE81)
private const val ProductDetailMaxImageCount = 5

@Composable
fun ProductDetailScreen(
    productId: Long,
    productViewModel: ProductViewModel,
    onBack: () -> Unit,
    onClickLogo: () -> Unit = {},
    onOpenChat: (productId: Long, sellerId: Long) -> Unit,
    onOpenSellerProfile: (sellerId: Long) -> Unit = {},
    onReportProduct: (productId: Long) -> Unit = {}
) {
    val context = LocalContext.current
    val detailUiState by productViewModel.detailUiState.collectAsState()
    val wishlistUiState by productViewModel.wishlistUiState.collectAsState()

    val snackbarHostState = remember {
        SnackbarHostState()
    }

    LaunchedEffect(productId) {
        productViewModel.loadProductDetail(
            productId = productId
        )
    }

    LaunchedEffect(detailUiState.errorMessage) {
        detailUiState.errorMessage?.let { message ->
            snackbarHostState.showSnackbar(message)
            productViewModel.clearDetailError()
        }
    }

    LaunchedEffect(wishlistUiState.errorMessage) {
        wishlistUiState.errorMessage?.let { message ->
            snackbarHostState.showSnackbar(message)
            productViewModel.clearWishlistError()
        }
    }

    val product = detailUiState.product

    Scaffold(
        containerColor = Color.White,
        snackbarHost = {
            SnackbarHost(hostState = snackbarHostState)
        },
        topBar = {
            ProductDetailTopBar(
                product = product,
                onBack = onBack,
                onClickLogo = onClickLogo,
                onReportProduct = onReportProduct,
                onShareProduct = { currentProduct ->
                    shareProductDetail(
                        context = context,
                        product = currentProduct
                    )
                },
                onOpenSellerProfile = onOpenSellerProfile
            )
        },
        bottomBar = {
            product?.let { currentProduct ->
                ProductDetailBottomBarByDesign(
                    product = currentProduct,
                    isWishlistProcessing = wishlistUiState.isProcessing,
                    onClickWishlist = {
                        productViewModel.toggleWishlist()
                    },
                    onClickChat = {
                        onOpenChat(
                            currentProduct.productId,
                            currentProduct.sellerId
                        )
                    }
                )
            }
        }
    ) { innerPadding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(Color.White)
                .padding(innerPadding)
        ) {
            when {
                detailUiState.isLoading -> {
                    ProductDetailLoadingContent()
                }

                product != null -> {
                    ProductDetailContent(
                        product = product
                    )
                }

                else -> {
                    ProductDetailErrorContent(
                        message = detailUiState.errorMessage.orEmpty(),
                        onRetry = {
                            productViewModel.loadProductDetail(
                                productId = productId
                            )
                        }
                    )
                }
            }
        }
    }
}

@Composable
private fun ProductDetailTopBar(
    product: ProductDetailModel?,
    onBack: () -> Unit,
    onClickLogo: () -> Unit,
    onReportProduct: (productId: Long) -> Unit,
    onShareProduct: (ProductDetailModel) -> Unit,
    onOpenSellerProfile: (sellerId: Long) -> Unit
) {
    var isMoreMenuExpanded by remember {
        mutableStateOf(false)
    }

    Column(
        modifier = Modifier.fillMaxWidth()
    ) {
        Spacer(
            modifier = Modifier
                .fillMaxWidth()
                .statusBarsPadding()
                .background(Color.White)
        )

        Surface(
            color = ProductDetailHeaderGreen,
            modifier = Modifier
                .fillMaxWidth()
                .height(57.dp)
        ) {
            Box(
                modifier = Modifier.fillMaxSize()
            ) {
                Image(
                    painter = painterResource(id = R.drawable.back_icon),
                    contentDescription = "뒤로가기",
                    modifier = Modifier
                        .align(Alignment.CenterStart)
                        .padding(start = 19.dp)
                        .size(24.dp)
                        .clickable(
                            indication = null,
                            interactionSource = remember { MutableInteractionSource() }
                        ) {
                            onBack()
                        },
                    contentScale = ContentScale.Fit
                )

                Image(
                    painter = painterResource(id = R.drawable.logo),
                    contentDescription = "Clo-ver 로고",
                    modifier = Modifier
                        .align(Alignment.Center)
                        .width(80.dp)
                        .height(62.dp)
                        .clickable(
                            indication = null,
                            interactionSource = remember { MutableInteractionSource() }
                        ) {
                            onClickLogo()
                        },
                    contentScale = ContentScale.Fit
                )

                Box(
                    modifier = Modifier
                        .align(Alignment.CenterEnd)
                        .padding(end = 26.dp)
                ) {
                    Text(
                        text = "⋮",
                        color = Color.Black,
                        fontSize = 30.sp,
                        lineHeight = 30.sp,
                        textAlign = TextAlign.Center,
                        modifier = Modifier
                            .size(width = 32.dp, height = 40.dp)
                            .clickable(
                                enabled = product != null,
                                indication = null,
                                interactionSource = remember { MutableInteractionSource() }
                            ) {
                                isMoreMenuExpanded = !isMoreMenuExpanded
                            }
                    )

                    ProductDetailMoreMenu(
                        expanded = isMoreMenuExpanded && product != null,
                        onDismissRequest = {
                            isMoreMenuExpanded = false
                        },
                        onReportClick = {
                            val currentProduct = product ?: return@ProductDetailMoreMenu
                            isMoreMenuExpanded = false
                            onReportProduct(currentProduct.productId)
                        },
                        onShareClick = {
                            val currentProduct = product ?: return@ProductDetailMoreMenu
                            isMoreMenuExpanded = false
                            onShareProduct(currentProduct)
                        },
                        onProfileClick = {
                            val currentProduct = product ?: return@ProductDetailMoreMenu
                            isMoreMenuExpanded = false
                            onOpenSellerProfile(currentProduct.sellerId)
                        }
                    )
                }
            }
        }
    }
}

@Composable
private fun ProductDetailMoreMenu(
    expanded: Boolean,
    onDismissRequest: () -> Unit,
    onReportClick: () -> Unit,
    onShareClick: () -> Unit,
    onProfileClick: () -> Unit
) {
    DropdownMenu(
        expanded = expanded,
        onDismissRequest = onDismissRequest,
        offset = DpOffset(x = (-10).dp, y = 0.dp),
        containerColor = Color.White,
        shadowElevation = 8.dp,
        shape = RoundedCornerShape(8.dp),
        modifier = Modifier.width(188.dp)
    ) {
        ProductDetailMoreMenuItem(
            text = "신고 하기",
            iconType = ProductDetailMoreMenuIconType.Report,
            onClick = onReportClick
        )

        ProductDetailMoreMenuItem(
            text = "공유 하기",
            iconType = ProductDetailMoreMenuIconType.Share,
            onClick = onShareClick
        )

        ProductDetailMoreMenuItem(
            text = "프로필 보기",
            iconType = ProductDetailMoreMenuIconType.Profile,
            onClick = onProfileClick
        )
    }
}

@Composable
private fun ProductDetailMoreMenuItem(
    text: String,
    iconType: ProductDetailMoreMenuIconType,
    onClick: () -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .height(52.dp)
            .clickable(
                indication = null,
                interactionSource = remember { MutableInteractionSource() }
            ) {
                onClick()
            }
            .padding(horizontal = 16.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        ProductDetailMoreMenuIcon(
            iconType = iconType,
            modifier = Modifier.size(26.dp)
        )

        Spacer(modifier = Modifier.width(14.dp))

        Text(
            text = text,
            color = Color.Black,
            fontSize = 17.sp,
            fontWeight = FontWeight.Normal,
            lineHeight = 22.sp,
            maxLines = 1,
            overflow = TextOverflow.Clip
        )
    }
}

@Composable
private fun ProductDetailMoreMenuIcon(
    iconType: ProductDetailMoreMenuIconType,
    modifier: Modifier = Modifier
) {
    Canvas(
        modifier = modifier
    ) {
        val strokeWidth = 2.4.dp.toPx()
        val center = Offset(size.width / 2f, size.height / 2f)
        val radius = size.minDimension * 0.36f

        when (iconType) {
            ProductDetailMoreMenuIconType.Report -> {
                drawCircle(
                    color = Color.Black,
                    radius = radius,
                    center = center,
                    style = Stroke(width = strokeWidth)
                )
                drawLine(
                    color = Color.Black,
                    start = Offset(size.width * 0.27f, size.height * 0.27f),
                    end = Offset(size.width * 0.73f, size.height * 0.73f),
                    strokeWidth = strokeWidth,
                    cap = StrokeCap.Round
                )
            }

            ProductDetailMoreMenuIconType.Share -> {
                val left = Offset(size.width * 0.25f, size.height * 0.55f)
                val rightTop = Offset(size.width * 0.72f, size.height * 0.28f)
                val rightBottom = Offset(size.width * 0.72f, size.height * 0.75f)

                drawLine(Color.Black, left, rightTop, strokeWidth, StrokeCap.Round)
                drawLine(Color.Black, left, rightBottom, strokeWidth, StrokeCap.Round)
                drawCircle(Color.White, radius = 4.8.dp.toPx(), center = left)
                drawCircle(Color.Black, radius = 4.8.dp.toPx(), center = left, style = Stroke(strokeWidth))
                drawCircle(Color.White, radius = 4.8.dp.toPx(), center = rightTop)
                drawCircle(Color.Black, radius = 4.8.dp.toPx(), center = rightTop, style = Stroke(strokeWidth))
                drawCircle(Color.White, radius = 4.8.dp.toPx(), center = rightBottom)
                drawCircle(Color.Black, radius = 4.8.dp.toPx(), center = rightBottom, style = Stroke(strokeWidth))
            }

            ProductDetailMoreMenuIconType.Profile -> {
                drawCircle(
                    color = Color.Black,
                    radius = radius,
                    center = center,
                    style = Stroke(width = strokeWidth)
                )
                drawCircle(
                    color = Color.Black,
                    radius = size.minDimension * 0.12f,
                    center = Offset(size.width * 0.50f, size.height * 0.42f),
                    style = Stroke(width = strokeWidth)
                )
                drawArc(
                    color = Color.Black,
                    startAngle = 205f,
                    sweepAngle = 130f,
                    useCenter = false,
                    topLeft = Offset(size.width * 0.31f, size.height * 0.50f),
                    size = androidx.compose.ui.geometry.Size(size.width * 0.38f, size.height * 0.30f),
                    style = Stroke(width = strokeWidth, cap = StrokeCap.Round)
                )
            }
        }
    }
}

@Composable
private fun ProductDetailLoadingContent() {
    Box(
        modifier = Modifier.fillMaxSize(),
        contentAlignment = Alignment.Center
    ) {
        CircularProgressIndicator(
            color = ProductDetailButtonGreen
        )
    }
}

@Composable
private fun ProductDetailErrorContent(
    message: String,
    onRetry: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 32.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text(
            text = message.ifBlank { "상품 정보를 불러오지 못했습니다." },
            color = Color(0xFF777777),
            fontSize = 16.sp,
            textAlign = TextAlign.Center
        )

        Spacer(modifier = Modifier.height(18.dp))

        Button(
            onClick = onRetry,
            colors = ButtonDefaults.buttonColors(
                containerColor = Color(0xFF6F50B5),
                contentColor = Color.White
            ),
            shape = RoundedCornerShape(999.dp)
        ) {
            Text(
                text = "다시 불러오기",
                fontSize = 16.sp,
                fontWeight = FontWeight.Bold
            )
        }
    }
}

@Composable
private fun ProductDetailContent(
    product: ProductDetailModel
) {
    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        contentPadding = androidx.compose.foundation.layout.PaddingValues(
            top = 36.dp,
            start = 31.dp,
            end = 24.dp,
            bottom = 36.dp
        )
    ) {
        item {
            ProductDetailImageSection(
                images = product.images
            )
        }

        item {
            Spacer(modifier = Modifier.height(35.dp))

            Text(
                text = "상품명: ${product.name}\n가격: ${formatPrice(product.price)}",
                color = Color.Black,
                fontSize = 20.sp,
                fontWeight = FontWeight.Normal,
                lineHeight = 24.sp
            )

            Spacer(modifier = Modifier.height(27.dp))

            HorizontalDivider(
                modifier = Modifier.fillMaxWidth(),
                color = Color.Black,
                thickness = 1.dp
            )

            Spacer(modifier = Modifier.height(31.dp))

            ProductDetailAttributeSection(
                product = product
            )

            Spacer(modifier = Modifier.height(37.dp))

            HorizontalDivider(
                modifier = Modifier.fillMaxWidth(),
                color = Color.Black,
                thickness = 1.dp
            )

            Spacer(modifier = Modifier.height(30.dp))

            ProductDetailDescriptionSection(
                content = product.content
            )

            Spacer(modifier = Modifier.height(36.dp))
        }
    }
}

@Composable
private fun ProductDetailImageSection(
    images: List<ProductImageModel>
) {
    var currentIndex by remember(images) {
        mutableIntStateOf(0)
    }

    val visibleImages = images.take(ProductDetailMaxImageCount)
    val safeIndex = currentIndex.coerceIn(
        minimumValue = 0,
        maximumValue = (visibleImages.size - 1).coerceAtLeast(0)
    )
    val imageUrl = visibleImages.getOrNull(safeIndex)?.imageUrl

    Box(
        modifier = Modifier
            .fillMaxWidth()
            .height(196.dp)
            .clip(RoundedCornerShape(5.dp))
            .background(Color(0xFFD9D9D9))
            .clickable(
                enabled = visibleImages.size > 1,
                indication = null,
                interactionSource = remember { MutableInteractionSource() }
            ) {
                currentIndex = (safeIndex + 1) % visibleImages.size
            }
    ) {
        if (!imageUrl.isNullOrBlank()) {
            AsyncImage(
                model = imageUrl,
                contentDescription = null,
                modifier = Modifier.fillMaxSize(),
                contentScale = ContentScale.Crop
            )
        }

        Text(
            text = "${safeIndex + 1}/$ProductDetailMaxImageCount",
            color = Color.Black,
            fontSize = 10.sp,
            lineHeight = 12.sp,
            modifier = Modifier
                .align(Alignment.BottomEnd)
                .padding(end = 8.dp, bottom = 8.dp)
        )
    }
}

@Composable
private fun ProductDetailAttributeSection(
    product: ProductDetailModel
) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        verticalAlignment = Alignment.Top
    ) {
        Column(
            modifier = Modifier.width(157.dp),
            verticalArrangement = Arrangement.spacedBy(20.dp)
        ) {
            ProductDetailAttributeLabel(text = "사이즈")
            ProductDetailAttributeLabel(text = "핏")
            ProductDetailAttributeLabel(text = "카테고리")
            ProductDetailAttributeLabel(text = "거래 지역/ 거래 방식")
        }

        Column(
            modifier = Modifier.weight(1f),
            verticalArrangement = Arrangement.spacedBy(20.dp)
        ) {
            ProductDetailAttributeValue(text = product.size.ifBlank { "-" })
            ProductDetailAttributeValue(text = product.grade.ifBlank { "-" })
            ProductDetailAttributeValue(text = productCategoryDisplayText(product))
            ProductDetailAttributeValue(text = productTradingDisplayText(product))
        }
    }
}

@Composable
private fun ProductDetailAttributeLabel(
    text: String
) {
    Text(
        text = text,
        color = Color.Black,
        fontSize = 16.sp,
        fontWeight = FontWeight.Normal,
        lineHeight = 19.sp
    )
}

@Composable
private fun ProductDetailAttributeValue(
    text: String
) {
    Text(
        text = text,
        color = Color.Black,
        fontSize = 16.sp,
        fontWeight = FontWeight.Normal,
        lineHeight = 19.sp
    )
}

@Composable
private fun ProductDetailDescriptionSection(
    content: String
) {
    Text(
        text = "상품 설명",
        color = Color.Black,
        fontSize = 20.sp,
        fontWeight = FontWeight.Normal,
        lineHeight = 24.sp
    )

    Spacer(modifier = Modifier.height(19.dp))

    Text(
        text = content.ifBlank { "상품 설명이 없습니다." },
        color = Color.Black,
        fontSize = 16.sp,
        fontWeight = FontWeight.Normal,
        lineHeight = 19.sp
    )
}

@Composable
private fun ProductDetailBottomBarByDesign(
    product: ProductDetailModel,
    isWishlistProcessing: Boolean,
    onClickWishlist: () -> Unit,
    onClickChat: () -> Unit
) {
    Surface(
        color = Color.White,
        shape = RoundedCornerShape(topStart = 15.dp, topEnd = 15.dp),
        border = BorderStroke(1.dp, Color.Black),
        modifier = Modifier
            .fillMaxWidth()
            .navigationBarsPadding()
            .height(69.dp)
    ) {
        Row(
            modifier = Modifier
                .fillMaxSize()
                .padding(start = 33.dp, end = 7.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = if (product.isWishlisted) "♥" else "♡",
                color = Color.Black,
                fontSize = 38.sp,
                lineHeight = 38.sp,
                textAlign = TextAlign.Center,
                modifier = Modifier
                    .size(width = 54.dp, height = 48.dp)
                    .clickable(
                        enabled = !isWishlistProcessing,
                        indication = null,
                        interactionSource = remember { MutableInteractionSource() }
                    ) {
                        onClickWishlist()
                    }
            )

            Spacer(modifier = Modifier.width(21.dp))

            Surface(
                color = ProductDetailButtonGreen,
                shape = RoundedCornerShape(5.dp),
                border = BorderStroke(1.dp, Color.Black),
                modifier = Modifier
                    .weight(1f)
                    .height(42.dp)
                    .clickable(
                        indication = null,
                        interactionSource = remember { MutableInteractionSource() }
                    ) {
                        onClickChat()
                    }
            ) {
                Box(
                    modifier = Modifier.fillMaxSize(),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = "채팅",
                        color = Color.Black,
                        fontSize = 20.sp,
                        fontWeight = FontWeight.Normal,
                        lineHeight = 24.sp
                    )
                }
            }
        }
    }
}

private fun productCategoryDisplayText(
    product: ProductDetailModel
): String {
    val mainCategory = when (product.categoryId) {
        1L -> "상의"
        2L -> "바지"
        3L -> "아우터"
        4L -> "원피스/스커트"
        else -> "카테고리 미입력"
    }

    val detailCategory = when {
        product.name.contains("데님") -> "데님"
        product.name.contains("후드") -> "후드"
        product.name.contains("니트") -> "니트"
        product.name.contains("티셔츠") || product.name.contains("이너") -> "티셔츠"
        product.name.contains("팬츠") || product.name.contains("바지") -> "팬츠"
        product.name.contains("스커트") -> "스커트"
        product.name.contains("블루종") -> "블루종"
        else -> ""
    }

    return if (detailCategory.isBlank()) {
        mainCategory
    } else {
        "$mainCategory > $detailCategory"
    }
}

private fun productTradingDisplayText(
    product: ProductDetailModel
): String {
    val tradingArea = product.tradingArea.ifBlank {
        "거래 지역 미입력"
    }

    return "$tradingArea / 직거래"
}

private fun shareProductDetail(
    context: Context,
    product: ProductDetailModel
) {
    val shareText = buildString {
        append(product.name)
        append("\n")
        append(formatPrice(product.price))
        if (product.content.isNotBlank()) {
            append("\n\n")
            append(product.content)
        }
    }

    val shareIntent = Intent(Intent.ACTION_SEND).apply {
        type = "text/plain"
        putExtra(Intent.EXTRA_TEXT, shareText)
    }

    context.startActivity(
        Intent.createChooser(
            shareIntent,
            "상품 공유하기"
        )
    )
}

private enum class ProductDetailMoreMenuIconType {
    Report,
    Share,
    Profile
}
