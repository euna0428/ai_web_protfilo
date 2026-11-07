package com.fitflow.clover.presentation.product

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
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
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.KeyboardArrowDown
import androidx.compose.material.icons.filled.KeyboardArrowUp
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.Button
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.focus.FocusRequester
import androidx.compose.ui.focus.focusRequester
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.fitflow.clover.R
import com.fitflow.clover.domain.modal.ProductMainCategory
import com.fitflow.clover.domain.modal.ProductSubCategory
import com.fitflow.clover.domain.modal.ProductSummary
import com.fitflow.clover.domain.modal.ProductSummaryModel

private val CloverGreen = Color(0xFF99DE81)

@Composable
fun ProductListScreen(
    uiState: ProductListUiState = ProductListUiState(),
    onProductClick: (Long) -> Unit = {},
    onMenuClick: (Long) -> Unit = {},
    onMainCategorySelect: (ProductMainCategory) -> Unit = {},
    onMainCategoryExpandChange: (Boolean) -> Unit = {},
    onSubCategorySelect: (ProductSubCategory) -> Unit = {},
    onSubCategoryExpandChange: (Boolean) -> Unit = {},
    onFilterClick: () -> Unit = {},
    onSearchQueryChange: (String) -> Unit = {},
    onBackClick: () -> Unit = {},
    onLogoClick: () -> Unit = {},
    onNotificationClick: () -> Unit = {},
    onChatClick: () -> Unit = {},
    onProductListClick: () -> Unit = {},
    onCommunityClick: () -> Unit = {},
    onMyPageClick: () -> Unit = {},
    onSellClick: () -> Unit = {},
    onCommunityWriteClick: () -> Unit = {}
) {
    var isFabMenuExpanded by remember { mutableStateOf(false) }
    var isSearchActive by remember { mutableStateOf(false) }
    var searchQuery by remember { mutableStateOf("") }
    val focusRequester = remember { FocusRequester() }

    // 검색어 변경 시 외부로 전달
    LaunchedEffect(searchQuery) {
        onSearchQueryChange(searchQuery)
    }

    // 검색창 열릴 때 자동 포커스
    LaunchedEffect(isSearchActive) {
        if (isSearchActive) focusRequester.requestFocus()
    }

    Surface(
        modifier = Modifier.fillMaxSize(),
        color = Color.White
    ) {
        Scaffold(
            containerColor = Color.White,
            topBar = {
                Column(modifier = Modifier.fillMaxWidth()) {
                    ProductTopBar(
                        onBackClick = onBackClick,
                        onLogoClick = onLogoClick
                    )

                    // 검색창 or 카테고리 필터 행
                    AnimatedVisibility(
                        visible = isSearchActive,
                        enter = fadeIn(),
                        exit = fadeOut()
                    ) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(horizontal = 12.dp, vertical = 8.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            Surface(
                                modifier = Modifier.weight(1f),
                                shape = RoundedCornerShape(20.dp),
                                color = Color(0xFFF5F5F5)
                            ) {
                                Row(
                                    modifier = Modifier.padding(horizontal = 14.dp, vertical = 10.dp),
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                                ) {
                                    Icon(
                                        imageVector = Icons.Default.Search,
                                        contentDescription = null,
                                        tint = Color.Gray,
                                        modifier = Modifier.size(18.dp)
                                    )
                                    BasicTextField(
                                        value = searchQuery,
                                        onValueChange = { searchQuery = it },
                                        modifier = Modifier
                                            .weight(1f)
                                            .focusRequester(focusRequester),
                                        textStyle = TextStyle(fontSize = 14.sp, color = Color.Black),
                                        singleLine = true,
                                        decorationBox = { innerTextField ->
                                            Box {
                                                if (searchQuery.isEmpty()) {
                                                    Text(
                                                        text = "상품명, 카테고리 검색",
                                                        fontSize = 14.sp,
                                                        color = Color.LightGray
                                                    )
                                                }
                                                innerTextField()
                                            }
                                        }
                                    )
                                    if (searchQuery.isNotEmpty()) {
                                        Icon(
                                            imageVector = Icons.Default.Close,
                                            contentDescription = "검색어 지우기",
                                            tint = Color.Gray,
                                            modifier = Modifier
                                                .size(16.dp)
                                                .clickable { searchQuery = "" }
                                        )
                                    }
                                }
                            }

                            Text(
                                text = "취소",
                                fontSize = 14.sp,
                                color = Color.Gray,
                                modifier = Modifier.clickable(
                                    indication = null,
                                    interactionSource = remember { MutableInteractionSource() }
                                ) {
                                    isSearchActive = false
                                    searchQuery = ""
                                }
                            )
                        }
                    }

                    AnimatedVisibility(
                        visible = !isSearchActive,
                        enter = fadeIn(),
                        exit = fadeOut()
                    ) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(horizontal = 12.dp, vertical = 8.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            MainCategoryDropdown(
                                selectedCategory = uiState.selectedMainCategory,
                                isExpanded = uiState.isMainCategoryExpanded,
                                onExpandChange = onMainCategoryExpandChange,
                                onCategorySelect = onMainCategorySelect
                            )

                            SubCategoryDropdown(
                                selectedSubCategory = uiState.selectedSubCategory,
                                subCategoryList = uiState.subCategoryList,
                                isExpanded = uiState.isSubCategoryExpanded,
                                isEnabled = true,
                                onExpandChange = onSubCategoryExpandChange,
                                onSubCategorySelect = onSubCategorySelect
                            )

                            Spacer(modifier = Modifier.weight(1f))

                            IconButton(
                                onClick = { isSearchActive = true },
                                modifier = Modifier.size(36.dp)
                            ) {
                                Icon(
                                    imageVector = Icons.Default.Search,
                                    contentDescription = "검색",
                                    tint = Color.Black,
                                    modifier = Modifier.size(22.dp)
                                )
                            }

                            IconButton(
                                onClick = onFilterClick,
                                modifier = Modifier.size(36.dp)
                            ) {
                                Icon(
                                    painter = painterResource(id = R.drawable.filter),
                                    contentDescription = "최신순 필터",
                                    tint = Color.Unspecified,
                                    modifier = Modifier.size(22.dp)
                                )
                            }
                        }
                    }

                    HorizontalDivider(color = Color.LightGray, thickness = 0.5.dp)
                }
            }
        ) { paddingValues ->
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(paddingValues)
            ) {
                // 검색 결과 필터링
                val displayProducts = if (searchQuery.isBlank()) {
                    uiState.products
                } else {
                    uiState.products.filter { product ->
                        product.title.contains(searchQuery, ignoreCase = true) ||
                                product.mainCategory.displayName.contains(searchQuery, ignoreCase = true) ||
                                product.subCategory?.displayName?.contains(searchQuery, ignoreCase = true) == true
                    }
                }

                when {
                    uiState.isLoading -> {
                        Box(
                            modifier = Modifier.fillMaxSize(),
                            contentAlignment = Alignment.Center
                        ) {
                            CircularProgressIndicator(color = CloverGreen)
                        }
                    }

                    uiState.errorMessage != null -> {
                        Box(
                            modifier = Modifier.fillMaxSize(),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                text = uiState.errorMessage,
                                color = Color.Gray,
                                fontSize = 14.sp
                            )
                        }
                    }

                    displayProducts.isEmpty() -> {
                        Box(
                            modifier = Modifier.fillMaxSize(),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                text = if (searchQuery.isNotBlank()) "검색 결과가 없어요" else "등록된 상품이 없어요",
                                color = Color.Gray,
                                fontSize = 14.sp
                            )
                        }
                    }

                    else -> {
                        LazyVerticalGrid(
                            columns = GridCells.Fixed(2),
                            modifier = Modifier.fillMaxSize(),
                            contentPadding = PaddingValues(12.dp),
                            horizontalArrangement = Arrangement.spacedBy(12.dp),
                            verticalArrangement = Arrangement.spacedBy(12.dp)
                        ) {
                            items(displayProducts) { product ->
                                ProductGridCard(
                                    product = product,
                                    onProductClick = onProductClick
                                )
                            }
                        }
                    }
                }

                if (isFabMenuExpanded) {
                    Box(
                        modifier = Modifier
                            .fillMaxSize()
                            .clickable(
                                indication = null,
                                interactionSource = remember { MutableInteractionSource() }
                            ) { isFabMenuExpanded = false }
                    )

                    Column(
                        modifier = Modifier
                            .align(Alignment.BottomEnd)
                            .padding(end = 10.dp, bottom = 60.dp),
                        horizontalAlignment = Alignment.End,
                        verticalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        Column(
                            modifier = Modifier
                                .width(134.dp)
                                .shadow(elevation = 6.dp, shape = RoundedCornerShape(10.dp))
                                .clip(RoundedCornerShape(10.dp))
                                .background(Color.White),
                            horizontalAlignment = Alignment.CenterHorizontally,
                            verticalArrangement = Arrangement.SpaceEvenly
                        ) {
                            listOf(
                                "알림" to { isFabMenuExpanded = false; onNotificationClick() },
                                "채팅방" to { isFabMenuExpanded = false; onChatClick() },
                                "판매글" to { isFabMenuExpanded = false; onProductListClick() },
                                "커뮤니티" to { isFabMenuExpanded = false; onCommunityClick() },
                                "마이페이지" to { isFabMenuExpanded = false; onMyPageClick() }
                            ).forEach { (label, action) ->
                                Text(
                                    text = label,
                                    color = Color.Black,
                                    fontSize = 16.sp,
                                    fontWeight = FontWeight.Medium,
                                    textAlign = TextAlign.Center,
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .clickable(onClick = action)
                                        .padding(vertical = 10.dp)
                                )
                            }
                        }

                        Column(
                            modifier = Modifier
                                .width(134.dp)
                                .shadow(elevation = 6.dp, shape = RoundedCornerShape(10.dp))
                                .clip(RoundedCornerShape(10.dp))
                                .background(Color.White),
                            horizontalAlignment = Alignment.CenterHorizontally,
                            verticalArrangement = Arrangement.SpaceEvenly
                        ) {
                            listOf(
                                "판매" to { isFabMenuExpanded = false; onSellClick() },
                                "글쓰기" to { isFabMenuExpanded = false; onCommunityWriteClick() }
                            ).forEach { (label, action) ->
                                Text(
                                    text = label,
                                    color = Color.Black,
                                    fontSize = 16.sp,
                                    fontWeight = FontWeight.Medium,
                                    textAlign = TextAlign.Center,
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .clickable(onClick = action)
                                        .padding(vertical = 10.dp)
                                )
                            }
                        }
                    }
                }

                Image(
                    painter = painterResource(id = R.drawable.listbar),
                    contentDescription = "메뉴 열기",
                    contentScale = ContentScale.Fit,
                    modifier = Modifier
                        .align(Alignment.BottomEnd)
                        .padding(end = 10.dp, bottom = 10.dp)
                        .size(40.dp)
                        .clickable(
                            indication = null,
                            interactionSource = remember { MutableInteractionSource() }
                        ) { isFabMenuExpanded = !isFabMenuExpanded }
                )
            }
        }
    }
}

@Composable
fun ProductListScreen(
    recommendedType: String? = null,
    onBack: () -> Unit,
    onClickProduct: (Long) -> Unit
) {
    val productViewModel: ProductViewModel = viewModel()
    val listUiState by productViewModel.listUiState.collectAsState()

    LaunchedEffect(recommendedType) {
        if (recommendedType.isNullOrBlank()) {
            productViewModel.loadRecentProducts()
        } else {
            productViewModel.loadBodyRecommendedProducts(
                recommendedType = recommendedType
            )
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.White)
    ) {
        ProductRecommendedTopBar(
            title = if (recommendedType.isNullOrBlank()) {
                "최근 등록 상품"
            } else {
                "체형 추천 상품"
            },
            onBack = onBack
        )

        when {
            listUiState.isLoading -> {
                Box(
                    modifier = Modifier.fillMaxSize(),
                    contentAlignment = Alignment.Center
                ) {
                    CircularProgressIndicator(color = CloverGreen)
                }
            }

            listUiState.errorMessage != null && listUiState.productModels.isEmpty() -> {
                ProductListErrorContent(
                    message = listUiState.errorMessage ?: "상품을 불러오지 못했어요.",
                    onRetry = {
                        if (recommendedType.isNullOrBlank()) {
                            productViewModel.loadRecentProducts()
                        } else {
                            productViewModel.loadBodyRecommendedProducts(
                                recommendedType = recommendedType
                            )
                        }
                    }
                )
            }

            listUiState.productModels.isNotEmpty() -> {
                LazyColumn(
                    modifier = Modifier.fillMaxSize(),
                    contentPadding = PaddingValues(20.dp),
                    verticalArrangement = Arrangement.spacedBy(18.dp)
                ) {
                    items(listUiState.productModels) { product ->
                        ProductSummaryModelCard(
                            product = product,
                            onClick = {
                                onClickProduct(product.productId)
                            }
                        )
                    }
                }
            }

            listUiState.products.isNotEmpty() -> {
                LazyVerticalGrid(
                    columns = GridCells.Fixed(2),
                    modifier = Modifier.fillMaxSize(),
                    contentPadding = PaddingValues(12.dp),
                    horizontalArrangement = Arrangement.spacedBy(12.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    items(listUiState.products) { product ->
                        ProductGridCard(
                            product = product,
                            onProductClick = onClickProduct
                        )
                    }
                }
            }

            else -> {
                Box(
                    modifier = Modifier.fillMaxSize(),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = "등록된 상품이 없어요",
                        color = Color.Gray,
                        fontSize = 14.sp
                    )
                }
            }
        }
    }
}

@Composable
private fun ProductMenuItem(
    text: String,
    onClick: () -> Unit
) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onClick() }
            .padding(vertical = 10.dp, horizontal = 16.dp),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = text,
            fontSize = 14.sp,
            fontWeight = FontWeight.Medium,
            color = Color.Black
        )
    }
}

@Composable
private fun MainCategoryDropdown(
    selectedCategory: ProductMainCategory,
    isExpanded: Boolean,
    onExpandChange: (Boolean) -> Unit,
    onCategorySelect: (ProductMainCategory) -> Unit
) {
    Box {
        CategoryChip(
            text = selectedCategory.displayName,
            isExpanded = isExpanded,
            onClick = { onExpandChange(!isExpanded) }
        )
        DropdownMenu(
            expanded = isExpanded,
            onDismissRequest = { onExpandChange(false) },
            containerColor = Color.White
        ) {
            ProductMainCategory.values().forEach { category ->
                DropdownMenuItem(
                    text = { Text(text = category.displayName, fontSize = 14.sp, color = Color.Black) },
                    onClick = { onCategorySelect(category); onExpandChange(false) }
                )
            }
        }
    }
}

@Composable
private fun SubCategoryDropdown(
    selectedSubCategory: ProductSubCategory?,
    subCategoryList: List<ProductSubCategory>,
    isExpanded: Boolean,
    isEnabled: Boolean,
    onExpandChange: (Boolean) -> Unit,
    onSubCategorySelect: (ProductSubCategory) -> Unit
) {
    val enabled = isEnabled && subCategoryList.isNotEmpty()
    Box {
        CategoryChip(
            text = selectedSubCategory?.displayName ?: "종류",
            isExpanded = isExpanded,
            enabled = enabled,
            onClick = { if (enabled) onExpandChange(!isExpanded) }
        )
        DropdownMenu(
            expanded = isExpanded && enabled,
            onDismissRequest = { onExpandChange(false) },
            containerColor = Color.White
        ) {
            subCategoryList.forEach { subCategory ->
                DropdownMenuItem(
                    text = { Text(text = subCategory.displayName, fontSize = 14.sp, color = Color.Black) },
                    onClick = { onSubCategorySelect(subCategory); onExpandChange(false) }
                )
            }
        }
    }
}

@Composable
private fun CategoryChip(
    text: String,
    isExpanded: Boolean,
    enabled: Boolean = true,
    onClick: () -> Unit
) {
    Surface(
        shape = RoundedCornerShape(18.dp),
        color = if (enabled) Color(0xFFF7F7F7) else Color(0xFFEDEDED),
        tonalElevation = 0.dp,
        shadowElevation = 0.dp,
        modifier = Modifier
            .height(36.dp)
            .clickable(enabled = enabled, indication = null, interactionSource = remember { MutableInteractionSource() }) { onClick() }
    ) {
        Row(
            modifier = Modifier.padding(horizontal = 12.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(4.dp)
        ) {
            Text(text = text, fontSize = 13.sp, color = if (enabled) Color.Black else Color.Gray, fontWeight = FontWeight.Medium)
            Icon(
                imageVector = if (isExpanded) Icons.Default.KeyboardArrowUp else Icons.Default.KeyboardArrowDown,
                contentDescription = null,
                tint = if (enabled) Color.Black else Color.Gray,
                modifier = Modifier.size(18.dp)
            )
        }
    }
}

@Composable
fun ProductGridCard(
    product: ProductSummary,
    onProductClick: (Long) -> Unit,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier
            .fillMaxWidth()
            .clickable(indication = null, interactionSource = remember { MutableInteractionSource() }) { onProductClick(product.productId) }
    ) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .aspectRatio(1f)
                .clip(RoundedCornerShape(12.dp))
                .background(Color(0xFFEEEEEE))
        ) {
            if (product.thumbnailImageUrl != null) {
                coil.compose.AsyncImage(
                    model = product.thumbnailImageUrl,
                    contentDescription = null,
                    modifier = Modifier.fillMaxSize(),
                    contentScale = ContentScale.Crop
                )
            }
            if (product.isSold) {
                Box(
                    modifier = Modifier.fillMaxSize().background(Color.Black.copy(alpha = 0.5f)),
                    contentAlignment = Alignment.Center
                ) {
                    Text(text = "거래완료", color = Color.White, fontSize = 13.sp, fontWeight = FontWeight.Bold)
                }
            }
        }
        Spacer(modifier = Modifier.height(6.dp))
        Column(modifier = Modifier.fillMaxWidth()) {
            Text(text = product.title, fontSize = 13.sp, color = Color.Black, maxLines = 2, minLines = 2, overflow = TextOverflow.Ellipsis)
            Spacer(modifier = Modifier.height(2.dp))
            Text(text = formatProductListPrice(product.price), fontSize = 14.sp, fontWeight = FontWeight.Bold, color = Color.Black)
            Spacer(modifier = Modifier.height(2.dp))
            Row(modifier = Modifier.fillMaxWidth(), verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.SpaceBetween) {
                Text(text = product.createdAt, fontSize = 11.sp, color = Color.Gray, modifier = Modifier.weight(1f), maxLines = 1, overflow = TextOverflow.Ellipsis)
                Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(2.dp)) {
                    Icon(imageVector = Icons.Default.Favorite, contentDescription = null, tint = Color.Red, modifier = Modifier.size(11.dp))
                    Text(text = "${product.likeCount}", fontSize = 11.sp, color = Color.Gray)
                }
            }
        }
    }
}

@Composable
private fun ProductSummaryModelCard(product: ProductSummaryModel, onClick: () -> Unit) {
    Surface(
        modifier = Modifier.fillMaxWidth().clickable { onClick() },
        shape = RoundedCornerShape(16.dp),
        color = Color(0xFFF7F7F7),
        shadowElevation = 1.dp
    ) {
        Row(modifier = Modifier.fillMaxWidth().padding(14.dp), verticalAlignment = Alignment.CenterVertically) {
            Box(modifier = Modifier.size(76.dp).clip(RoundedCornerShape(12.dp)).background(Color(0xFFE5E5E5)), contentAlignment = Alignment.Center) {
                if (product.thumbnailImageUrl != null) {
                    coil.compose.AsyncImage(model = product.thumbnailImageUrl, contentDescription = null, modifier = Modifier.fillMaxSize(), contentScale = ContentScale.Crop)
                } else {
                    Text(text = "Clo-ver", fontSize = 11.sp, color = Color.Gray)
                }
            }
            Spacer(modifier = Modifier.width(14.dp))
            Column(modifier = Modifier.weight(1f)) {
                Text(text = product.name, color = Color.Black, fontSize = 15.sp, fontWeight = FontWeight.Bold, maxLines = 1, overflow = TextOverflow.Ellipsis)
                Spacer(modifier = Modifier.height(4.dp))
                Text(text = formatProductListPrice(product.price), color = Color.Black, fontSize = 14.sp, fontWeight = FontWeight.SemiBold)
                Spacer(modifier = Modifier.height(4.dp))
                Text(text = product.tradingArea.ifBlank { product.createdAt }, color = Color.Gray, fontSize = 12.sp, maxLines = 1, overflow = TextOverflow.Ellipsis)
                if (!product.recommendedType.isNullOrBlank()) {
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(text = "추천 타입: ${product.recommendedType}", color = Color(0xFF4C9A2A), fontSize = 12.sp, fontWeight = FontWeight.Medium)
                }
            }
        }
    }
}

@Composable
fun ProductTopBar(onBackClick: () -> Unit = {}, onLogoClick: () -> Unit = {}) {
    Column(modifier = Modifier.fillMaxWidth()) {
        Spacer(modifier = Modifier.fillMaxWidth().statusBarsPadding().background(Color.White))
        Surface(color = Color(0xFFE8F8E0), modifier = Modifier.fillMaxWidth().height(57.dp)) {
            Row(modifier = Modifier.fillMaxWidth().padding(horizontal = 4.dp), verticalAlignment = Alignment.CenterVertically) {
                Icon(
                    painter = painterResource(id = R.drawable.back_icon),
                    contentDescription = "뒤로가기",
                    tint = Color.Unspecified,
                    modifier = Modifier.padding(12.dp).size(24.dp).clickable(indication = null, interactionSource = remember { MutableInteractionSource() }) { onBackClick() }
                )
                Box(modifier = Modifier.weight(1f), contentAlignment = Alignment.Center) {
                    Image(
                        painter = painterResource(id = R.drawable.logo),
                        contentDescription = "Clo-ver 로고",
                        modifier = Modifier.width(80.dp).height(62.dp).clickable(indication = null, interactionSource = remember { MutableInteractionSource() }) { onLogoClick() },
                        contentScale = ContentScale.Fit
                    )
                }
                Spacer(modifier = Modifier.size(48.dp))
            }
        }
    }
}

@Composable
private fun ProductRecommendedTopBar(title: String, onBack: () -> Unit) {
    Row(modifier = Modifier.fillMaxWidth().statusBarsPadding().padding(horizontal = 16.dp, vertical = 14.dp), verticalAlignment = Alignment.CenterVertically) {
        Button(onClick = onBack) { Text(text = "이전") }
        Spacer(modifier = Modifier.width(12.dp))
        Text(text = title, style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold, color = Color.Black)
    }
}

@Composable
private fun ProductListErrorContent(message: String, onRetry: () -> Unit) {
    Column(modifier = Modifier.fillMaxSize().padding(horizontal = 24.dp), horizontalAlignment = Alignment.CenterHorizontally, verticalArrangement = Arrangement.Center) {
        Text(text = message, style = MaterialTheme.typography.bodyMedium, color = Color(0xFF777777))
        Spacer(modifier = Modifier.height(16.dp))
        Button(onClick = onRetry) { Text(text = "다시 불러오기") }
    }
}

private fun formatProductListPrice(price: Int): String = "%,d원".format(price)

private val previewProducts = listOf(
    ProductSummary(productId = 1L, title = "나이키 후드", price = 38900, thumbnailImageUrl = null, mainCategory = ProductMainCategory.TOP, subCategory = ProductSubCategory.HOODIE, likeCount = 15, createdAt = "1분전", isSold = false),
    ProductSummary(productId = 2L, title = "꾸안꾸 티셔츠", price = 10000, thumbnailImageUrl = null, mainCategory = ProductMainCategory.TOP, subCategory = ProductSubCategory.SHORT_SLEEVE, likeCount = 15, createdAt = "5분전", isSold = false),
    ProductSummary(productId = 3L, title = "폴로 니트", price = 40000, thumbnailImageUrl = null, mainCategory = ProductMainCategory.TOP, subCategory = ProductSubCategory.KNIT_SWEATER, likeCount = 15, createdAt = "10분전", isSold = false),
    ProductSummary(productId = 4L, title = "진청 반바지", price = 15000, thumbnailImageUrl = null, mainCategory = ProductMainCategory.PANTS, subCategory = ProductSubCategory.SHORT_PANTS, likeCount = 15, createdAt = "15분전", isSold = true)
)

@Preview(showBackground = true, showSystemUi = true)
@Composable
fun ProductListPreview() {
    ProductListScreen(uiState = ProductListUiState(products = previewProducts))
}