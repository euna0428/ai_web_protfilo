package com.fitflow.clover.presentation.product

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.wrapContentWidth
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.FavoriteBorder
import androidx.compose.material.icons.filled.KeyboardArrowDown
import androidx.compose.material.icons.filled.MoreVert
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.Icon
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.fitflow.clover.domain.modal.ProductDetailModel
import com.fitflow.clover.domain.modal.ProductImageModel
import com.fitflow.clover.domain.modal.ProductMainCategory
import com.fitflow.clover.domain.modal.ProductSubCategory
import com.fitflow.clover.domain.modal.ProductSummary
import com.fitflow.clover.domain.modal.ProductSummaryModel
import java.text.NumberFormat
import java.util.Locale

private val CloverGreen = Color(0xFF99DE81)

@Composable
fun ProductCard(
    product: ProductSummary,
    onProductClick: (Long) -> Unit,
    onMenuClick: (Long) -> Unit,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier
            .fillMaxWidth()
            .clickable(
                indication = null,
                interactionSource = remember { MutableInteractionSource() }
            ) {
                onProductClick(product.productId)
            }
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 12.dp, vertical = 10.dp),
            verticalAlignment = Alignment.Top
        ) {
            Box(
                modifier = Modifier
                    .size(80.dp)
                    .clip(RoundedCornerShape(8.dp))
                    .background(Color.LightGray)
            ) {
                AsyncImage(
                    model = product.thumbnailImageUrl,
                    contentDescription = null,
                    modifier = Modifier.fillMaxSize(),
                    contentScale = ContentScale.Crop
                )

                if (product.isSold) {
                    Box(
                        modifier = Modifier
                            .fillMaxSize()
                            .background(Color.Black.copy(alpha = 0.5f)),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = "거래완료",
                            color = Color.White,
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.width(12.dp))

            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = product.title,
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Medium,
                    color = Color.Black,
                    maxLines = 2,
                    overflow = TextOverflow.Ellipsis
                )

                Spacer(modifier = Modifier.height(4.dp))

                Text(
                    text = formatPrice(product.price),
                    fontSize = 15.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color.Black
                )

                Spacer(modifier = Modifier.height(4.dp))

                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Text(
                        text = product.createdAt,
                        fontSize = 12.sp,
                        color = Color.Gray
                    )

                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(2.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Default.FavoriteBorder,
                            contentDescription = null,
                            tint = Color.Gray,
                            modifier = Modifier.size(12.dp)
                        )

                        Text(
                            text = "${product.likeCount}",
                            fontSize = 12.sp,
                            color = Color.Gray
                        )
                    }
                }
            }

            Icon(
                imageVector = Icons.Default.MoreVert,
                contentDescription = "더보기",
                tint = Color.LightGray,
                modifier = Modifier
                    .size(20.dp)
                    .clickable(
                        indication = null,
                        interactionSource = remember { MutableInteractionSource() }
                    ) {
                        onMenuClick(product.productId)
                    }
            )
        }

        HorizontalDivider(color = Color.LightGray, thickness = 0.5.dp)
    }
}

@Composable
fun MainCategoryDropdown(
    selectedCategory: ProductMainCategory,
    isExpanded: Boolean,
    onExpandChange: (Boolean) -> Unit,
    onCategorySelect: (ProductMainCategory) -> Unit,
    modifier: Modifier = Modifier
) {
    Box(modifier = modifier) {
        Surface(
            onClick = {
                onExpandChange(!isExpanded)
            },
            shape = RoundedCornerShape(20.dp),
            border = BorderStroke(1.dp, Color.DarkGray),
            color = Color.White
        ) {
            Row(
                modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(4.dp)
            ) {
                Text(
                    text = selectedCategory.displayName,
                    fontSize = 13.sp,
                    color = Color.Black
                )

                Icon(
                    imageVector = Icons.Default.KeyboardArrowDown,
                    contentDescription = null,
                    modifier = Modifier.size(16.dp),
                    tint = Color.Black
                )
            }
        }

        DropdownMenu(
            expanded = isExpanded,
            onDismissRequest = {
                onExpandChange(false)
            },
            containerColor = Color.White
        ) {
            ProductMainCategory.entries.forEach { category ->
                DropdownMenuItem(
                    text = {
                        Text(
                            text = category.displayName,
                            fontSize = 14.sp,
                            color = Color.Black
                        )
                    },
                    onClick = {
                        onCategorySelect(category)
                        onExpandChange(false)
                    }
                )
            }
        }
    }
}

@Composable
fun SubCategoryDropdown(
    selectedSubCategory: ProductSubCategory?,
    subCategoryList: List<ProductSubCategory>,
    isExpanded: Boolean,
    isEnabled: Boolean,
    onExpandChange: (Boolean) -> Unit,
    onSubCategorySelect: (ProductSubCategory) -> Unit,
    modifier: Modifier = Modifier
) {
    Box(modifier = modifier) {
        Surface(
            onClick = {
                if (isEnabled) {
                    onExpandChange(!isExpanded)
                }
            },
            shape = RoundedCornerShape(20.dp),
            border = BorderStroke(
                width = 1.dp,
                color = if (isEnabled) Color.DarkGray else Color.LightGray
            ),
            color = Color.White
        ) {
            Row(
                modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(4.dp)
            ) {
                Text(
                    text = selectedSubCategory?.displayName ?: "스타일",
                    fontSize = 13.sp,
                    color = if (isEnabled) Color.Black else Color.LightGray
                )

                Icon(
                    imageVector = Icons.Default.KeyboardArrowDown,
                    contentDescription = null,
                    modifier = Modifier.size(16.dp),
                    tint = if (isEnabled) Color.Black else Color.LightGray
                )
            }
        }

        DropdownMenu(
            expanded = isExpanded && isEnabled,
            onDismissRequest = {
                onExpandChange(false)
            },
            containerColor = Color.White
        ) {
            subCategoryList.forEach { subCategory ->
                DropdownMenuItem(
                    text = {
                        Text(
                            text = subCategory.displayName,
                            fontSize = 14.sp,
                            color = Color.Black
                        )
                    },
                    onClick = {
                        onSubCategorySelect(subCategory)
                        onExpandChange(false)
                    }
                )
            }
        }
    }
}

@Composable
fun TradeTabRow(
    isSellingTabSelected: Boolean,
    onSellingTabClick: () -> Unit,
    onSoldTabClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Row(
        modifier = modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 12.dp),
        horizontalArrangement = Arrangement.Center,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Surface(
            onClick = onSellingTabClick,
            shape = RoundedCornerShape(8.dp),
            border = BorderStroke(
                width = 1.dp,
                color = if (isSellingTabSelected) CloverGreen else Color.LightGray
            ),
            color = if (isSellingTabSelected) CloverGreen else Color.White,
            modifier = Modifier.weight(1f)
        ) {
            Text(
                text = "판매 중",
                fontSize = 14.sp,
                fontWeight = if (isSellingTabSelected) FontWeight.Bold else FontWeight.Normal,
                color = Color.Black,
                modifier = Modifier
                    .padding(vertical = 10.dp)
                    .wrapContentWidth(Alignment.CenterHorizontally)
            )
        }

        Spacer(modifier = Modifier.width(12.dp))

        Surface(
            onClick = onSoldTabClick,
            shape = RoundedCornerShape(8.dp),
            border = BorderStroke(
                width = 1.dp,
                color = if (!isSellingTabSelected) CloverGreen else Color.LightGray
            ),
            color = if (!isSellingTabSelected) CloverGreen else Color.White,
            modifier = Modifier.weight(1f)
        ) {
            Text(
                text = "거래 완료",
                fontSize = 14.sp,
                fontWeight = if (!isSellingTabSelected) FontWeight.Bold else FontWeight.Normal,
                color = Color.Black,
                modifier = Modifier
                    .padding(vertical = 10.dp)
                    .wrapContentWidth(Alignment.CenterHorizontally)
            )
        }
    }
}

@Composable
fun ProductSummaryCard(
    product: ProductSummaryModel,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier
            .width(103.dp)
            .clickable(onClick = onClick)
    ) {
        Box(
            modifier = Modifier
                .width(103.dp)
                .height(150.dp)
                .clip(RoundedCornerShape(8.dp))
                .background(Color(0xFFD9D9D9)),
            contentAlignment = Alignment.Center
        ) {
            if (!product.thumbnailImageUrl.isNullOrBlank()) {
                AsyncImage(
                    model = product.thumbnailImageUrl,
                    contentDescription = null,
                    modifier = Modifier.fillMaxSize(),
                    contentScale = ContentScale.Crop
                )
            } else {
                ProductImagePlaceholder(modifier = Modifier.fillMaxSize())
            }
        }

        Spacer(modifier = Modifier.height(8.dp))

        Text(
            text = "${product.name}\n${product.grade}\n${formatPrice(product.price)}",
            color = Color.Black,
            fontSize = MaterialTheme.typography.bodySmall.fontSize,
            lineHeight = MaterialTheme.typography.bodySmall.lineHeight,
            fontWeight = FontWeight.Normal,
            maxLines = 3,
            overflow = TextOverflow.Ellipsis
        )
    }
}

@Composable
fun ProductDetailImagePager(
    images: List<ProductImageModel>,
    modifier: Modifier = Modifier
) {
    var currentIndex by remember(images) {
        mutableIntStateOf(0)
    }

    val safeIndex = currentIndex.coerceIn(
        minimumValue = 0,
        maximumValue = (images.size - 1).coerceAtLeast(0)
    )

    val currentImageUrl = images.getOrNull(safeIndex)?.imageUrl

    Box(
        modifier = modifier
            .fillMaxWidth()
            .background(Color.White)
    ) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .aspectRatio(0.9f)
                .background(Color(0xFFEDEFF2)),
            contentAlignment = Alignment.Center
        ) {
            if (images.isEmpty()) {
                Text(
                    text = "등록된 이미지가 없습니다.",
                    style = MaterialTheme.typography.bodyMedium,
                    color = Color(0xFF777777),
                    textAlign = TextAlign.Center
                )
            } else {
                if (!currentImageUrl.isNullOrBlank()) {
                    AsyncImage(
                        model = currentImageUrl,
                        contentDescription = null,
                        modifier = Modifier.fillMaxSize(),
                        contentScale = ContentScale.Crop
                    )
                } else {
                    ProductImagePlaceholder(
                        modifier = Modifier.fillMaxSize()
                    )
                }

                Row(
                    modifier = Modifier
                        .align(Alignment.BottomCenter)
                        .padding(bottom = 16.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    OutlinedButton(
                        enabled = safeIndex > 0,
                        onClick = {
                            if (currentIndex > 0) {
                                currentIndex--
                            }
                        },
                        shape = RoundedCornerShape(999.dp)
                    ) {
                        Text(text = "‹")
                    }

                    Text(
                        modifier = Modifier
                            .padding(horizontal = 10.dp)
                            .background(
                                color = Color.Black.copy(alpha = 0.55f),
                                shape = RoundedCornerShape(999.dp)
                            )
                            .padding(horizontal = 12.dp, vertical = 8.dp),
                        text = "${safeIndex + 1} / ${images.size}",
                        style = MaterialTheme.typography.bodySmall,
                        color = Color.White
                    )

                    OutlinedButton(
                        enabled = safeIndex < images.size - 1,
                        onClick = {
                            if (currentIndex < images.size - 1) {
                                currentIndex++
                            }
                        },
                        shape = RoundedCornerShape(999.dp)
                    ) {
                        Text(text = "›")
                    }
                }
            }
        }
    }
}

@Composable
fun ProductInfoRow(
    label: String,
    value: String,
    modifier: Modifier = Modifier
) {
    Row(
        modifier = modifier
            .fillMaxWidth()
            .padding(vertical = 7.dp),
        verticalAlignment = Alignment.Top
    ) {
        Text(
            modifier = Modifier.width(92.dp),
            text = label,
            style = MaterialTheme.typography.bodyMedium,
            color = Color(0xFF777777)
        )

        Text(
            modifier = Modifier.weight(1f),
            text = value,
            style = MaterialTheme.typography.bodyMedium,
            fontWeight = FontWeight.SemiBold,
            color = Color(0xFF222222)
        )
    }
}

@Composable
fun ProductDetailBottomBar(
    product: ProductDetailModel,
    isWishlistProcessing: Boolean,
    onClickWishlist: () -> Unit,
    onClickChat: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .background(Color.White)
            .navigationBarsPadding()
    ) {
        HorizontalDivider(
            color = Color(0xFFEDEDED)
        )

        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 18.dp, vertical = 14.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(
                modifier = Modifier
                    .size(52.dp)
                    .clip(CircleShape)
                    .background(
                        if (product.isWishlisted) {
                            Color(0xFFFFE8EE)
                        } else {
                            Color(0xFFF1F3F5)
                        }
                    )
                    .clickable(
                        enabled = !isWishlistProcessing
                    ) {
                        onClickWishlist()
                    },
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = if (product.isWishlisted) "♥" else "♡",
                    style = MaterialTheme.typography.titleLarge,
                    fontWeight = FontWeight.Bold,
                    color = if (product.isWishlisted) {
                        Color(0xFFE83E65)
                    } else {
                        Color(0xFF555555)
                    }
                )
            }

            Spacer(modifier = Modifier.width(12.dp))

            Button(
                modifier = Modifier
                    .weight(1f)
                    .height(52.dp),
                onClick = onClickChat,
                shape = RoundedCornerShape(16.dp),
                colors = ButtonDefaults.buttonColors(
                    containerColor = Color(0xFF202C59),
                    contentColor = Color.White
                )
            ) {
                Text(
                    text = "채팅하기",
                    style = MaterialTheme.typography.bodyLarge,
                    fontWeight = FontWeight.Bold
                )
            }
        }
    }
}

@Composable
fun ProductImagePlaceholder(
    modifier: Modifier = Modifier
) {
    Canvas(
        modifier = modifier
            .background(Color(0xFFD9D9D9))
            .border(1.dp, Color(0xFFBFC7CC))
    ) {
        drawRect(
            color = Color(0xFFBFC7CC),
            size = size
        )

        val iconPath = Path().apply {
            moveTo(size.width * 0.28f, size.height * 0.70f)
            lineTo(size.width * 0.42f, size.height * 0.52f)
            lineTo(size.width * 0.55f, size.height * 0.64f)
            lineTo(size.width * 0.70f, size.height * 0.42f)
            lineTo(size.width * 0.86f, size.height * 0.70f)
        }

        drawPath(
            path = iconPath,
            color = Color.White,
            style = Stroke(
                width = 3.dp.toPx(),
                cap = StrokeCap.Round
            )
        )

        drawCircle(
            color = Color.White,
            radius = 8.dp.toPx(),
            center = Offset(size.width * 0.34f, size.height * 0.30f)
        )
    }
}

fun formatPrice(price: Int): String {
    return NumberFormat
        .getNumberInstance(Locale.KOREA)
        .format(price) + "원"
}