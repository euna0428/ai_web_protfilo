package com.fitflow.clover.presentation.product

import android.Manifest
import android.content.ContentValues
import android.net.Uri
import android.provider.MediaStore
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.PickVisualMediaRequest
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
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
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.KeyboardArrowDown
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.rememberModalBottomSheetState
import androidx.compose.runtime.rememberCoroutineScope
import kotlinx.coroutines.launch
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalFocusManager
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.fitflow.clover.R
import com.fitflow.clover.domain.modal.ProductMainCategory
import com.fitflow.clover.domain.modal.ProductSubCategory

private val CloverGreen = Color(0xFF99DE81)
private const val MaxProductImageCount = 5

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ProductEditScreen(
    uiState: ProductEditUiState = ProductEditUiState(),
    onBackClick: () -> Unit = {},
    onTitleChange: (String) -> Unit = {},
    onPriceChange: (String) -> Unit = {},
    onDescriptionChange: (String) -> Unit = {},
    onTradeLocationChange: (String) -> Unit = {},
    onSizeChange: (String) -> Unit = {},
    onFitChange: (String) -> Unit = {},
    onGradeChange: (String) -> Unit = {},
    onMainCategorySelect: (ProductMainCategory) -> Unit = {},
    onMainCategoryExpandChange: (Boolean) -> Unit = {},
    onSubCategorySelect: (ProductSubCategory) -> Unit = {},
    onSubCategoryExpandChange: (Boolean) -> Unit = {},
    onImageUrisChange: (List<String>) -> Unit = {},
    onImagePickClick: () -> Unit = {},
    onSubmitClick: () -> Unit = {}
) {
    val canAddImages = uiState.imageUris.size < MaxProductImageCount
    val context = LocalContext.current
    val focusManager = LocalFocusManager.current

    val imagePickerLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.PickMultipleVisualMedia(maxItems = MaxProductImageCount),
        onResult = { selectedUris ->
            if (selectedUris.isNotEmpty()) {
                val selectedImageUris = selectedUris.map { uri -> uri.toString() }
                val mergedUris = (uiState.imageUris + selectedImageUris)
                    .distinct()
                    .take(MaxProductImageCount)

                onImageUrisChange(mergedUris)
            }
        }
    )

    var pendingCameraUri by remember {
        mutableStateOf<Uri?>(null)
    }

    val cameraLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.TakePicture(),
        onResult = { success ->
            if (success) {
                pendingCameraUri?.let { uri ->
                    val mergedUris = (uiState.imageUris + uri.toString())
                        .distinct()
                        .take(MaxProductImageCount)

                    onImageUrisChange(mergedUris)
                }
            }

            pendingCameraUri = null
        }
    )

    val cameraPermissionLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.RequestPermission(),
        onResult = { granted ->
            if (granted) {
                val values = ContentValues().apply {
                    put(MediaStore.Images.Media.DISPLAY_NAME, "product_${System.currentTimeMillis()}.jpg")
                    put(MediaStore.Images.Media.MIME_TYPE, "image/jpeg")
                }

                val uri = context.contentResolver.insert(
                    MediaStore.Images.Media.EXTERNAL_CONTENT_URI,
                    values
                )

                if (uri != null) {
                    pendingCameraUri = uri
                    cameraLauncher.launch(uri)
                }
            }
        }
    )

    fun launchCamera() {
        cameraPermissionLauncher.launch(Manifest.permission.CAMERA)
    }

    var showImageSourceDialog by remember {
        mutableStateOf(false)
    }

    if (showImageSourceDialog) {
        AlertDialog(
            onDismissRequest = {
                showImageSourceDialog = false
            },
            title = {
                Text(text = "이미지 추가")
            },
            text = {
                Text(text = "이미지를 어떻게 추가할까요?")
            },
            confirmButton = {
                TextButton(
                    onClick = {
                        showImageSourceDialog = false
                        launchCamera()
                    }
                ) {
                    Text(text = "카메라로 찍기")
                }
            },
            dismissButton = {
                TextButton(
                    onClick = {
                        showImageSourceDialog = false
                        onImagePickClick()
                        imagePickerLauncher.launch(
                            PickVisualMediaRequest(ActivityResultContracts.PickVisualMedia.ImageOnly)
                        )
                    }
                ) {
                    Text(text = "갤러리에서 선택")
                }
            }
        )
    }

    Surface(
        modifier = Modifier.fillMaxSize(),
        color = Color.White
    ) {
        Scaffold(
            containerColor = Color.White,
            topBar = {
                ProductEditTopBar(onBackClick = onBackClick)
            },
            bottomBar = {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(Color.White)
                        .navigationBarsPadding()
                        .padding(horizontal = 16.dp, vertical = 12.dp)
                ) {
                    Button(
                        onClick = onSubmitClick,
                        enabled = !uiState.isSubmitting,
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(52.dp),
                        shape = RoundedCornerShape(8.dp),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = CloverGreen,
                            contentColor = Color.Black
                        )
                    ) {
                        Text(
                            text = if (uiState.isEditMode) "수정" else "등록",
                            fontSize = 16.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            }
        ) { paddingValues ->
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(paddingValues)
                    .verticalScroll(rememberScrollState())
                    .padding(horizontal = 16.dp)
            ) {
                Spacer(modifier = Modifier.height(12.dp))

                ProductImagePickerSection(
                    imageUris = uiState.imageUris,
                    canAddImages = canAddImages,
                    onAddImageClick = {
                        showImageSourceDialog = true
                    },
                    onImageRemove = { removeUri ->
                        onImageUrisChange(
                            uiState.imageUris.filterNot { uri ->
                                uri == removeUri
                            }
                        )
                    }
                )

                uiState.errorMessage?.let { message ->
                    Spacer(modifier = Modifier.height(10.dp))

                    Text(
                        text = message,
                        color = Color(0xFFB3261E),
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Medium
                    )
                }

                Spacer(modifier = Modifier.height(16.dp))

                ProductEditLabel(text = "상품명 입력")

                OutlinedTextField(
                    value = uiState.title,
                    onValueChange = onTitleChange,
                    modifier = Modifier.fillMaxWidth(),
                    singleLine = true,
                    shape = RoundedCornerShape(8.dp),
                    colors = productTextFieldColors()
                )

                Spacer(modifier = Modifier.height(16.dp))

                var showMainCategorySheet by remember { mutableStateOf(false) }
                var showSubCategorySheet by remember { mutableStateOf(false) }

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    // 카테고리(목록) 버튼
                    Surface(
                        onClick = { showMainCategorySheet = true },
                        shape = RoundedCornerShape(8.dp),
                        border = BorderStroke(1.dp, Color.LightGray),
                        color = Color.White,
                        modifier = Modifier.weight(1f)
                    ) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(horizontal = 12.dp, vertical = 14.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text(
                                text = uiState.selectedMainCategory?.displayName ?: "카테고리(목록)",
                                fontSize = 13.sp,
                                color = if (uiState.selectedMainCategory != null) Color.Black else Color.Gray
                            )
                            Icon(
                                imageVector = Icons.Default.KeyboardArrowDown,
                                contentDescription = null,
                                tint = Color.Black,
                                modifier = Modifier.size(18.dp)
                            )
                        }
                    }

                    // 카테고리(상세) 버튼
                    Surface(
                        onClick = {
                            if (uiState.selectedMainCategory != null) {
                                showSubCategorySheet = true
                            }
                        },
                        shape = RoundedCornerShape(8.dp),
                        border = BorderStroke(
                            1.dp,
                            if (uiState.selectedMainCategory != null) Color.LightGray else Color(0xFFDDDDDD)
                        ),
                        color = Color.White,
                        modifier = Modifier.weight(1f)
                    ) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(horizontal = 12.dp, vertical = 14.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text(
                                text = uiState.selectedSubCategory?.displayName ?: "카테고리(상세)",
                                fontSize = 13.sp,
                                color = if (uiState.selectedSubCategory != null) Color.Black else Color.Gray
                            )
                            Icon(
                                imageVector = Icons.Default.KeyboardArrowDown,
                                contentDescription = null,
                                tint = if (uiState.selectedMainCategory != null) Color.Black else Color.LightGray,
                                modifier = Modifier.size(18.dp)
                            )
                        }
                    }
                }

                // 카테고리(목록) 바텀시트
                if (showMainCategorySheet) {
                    ModalBottomSheet(
                        onDismissRequest = { showMainCategorySheet = false },
                        containerColor = Color.White
                    ) {
                        Column(
                            modifier = Modifier
                                .fillMaxWidth()
                                .navigationBarsPadding()
                        ) {
                            Text(
                                text = "카테고리 선택",
                                fontSize = 16.sp,
                                fontWeight = FontWeight.Bold,
                                modifier = Modifier.padding(horizontal = 20.dp, vertical = 12.dp)
                            )
                            HorizontalDivider(color = Color.LightGray, thickness = 0.5.dp)
                            ProductMainCategory.entries
                                .filter { it != ProductMainCategory.ALL }
                                .forEach { category ->
                                    Text(
                                        text = category.displayName,
                                        fontSize = 15.sp,
                                        color = if (uiState.selectedMainCategory == category) Color(0xFF5DB846) else Color.Black,
                                        fontWeight = if (uiState.selectedMainCategory == category) FontWeight.Bold else FontWeight.Normal,
                                        modifier = Modifier
                                            .fillMaxWidth()
                                            .clickable {
                                                onMainCategorySelect(category)
                                                showMainCategorySheet = false
                                            }
                                            .padding(horizontal = 20.dp, vertical = 16.dp)
                                    )
                                    HorizontalDivider(color = Color(0xFFF0F0F0), thickness = 0.5.dp)
                                }
                            Spacer(modifier = Modifier.height(16.dp))
                        }
                    }
                }

                // 카테고리(상세) 바텀시트
                if (showSubCategorySheet) {
                    ModalBottomSheet(
                        onDismissRequest = { showSubCategorySheet = false },
                        containerColor = Color.White
                    ) {
                        Column(
                            modifier = Modifier
                                .fillMaxWidth()
                                .navigationBarsPadding()
                        ) {
                            Text(
                                text = "상세 카테고리 선택",
                                fontSize = 16.sp,
                                fontWeight = FontWeight.Bold,
                                modifier = Modifier.padding(horizontal = 20.dp, vertical = 12.dp)
                            )
                            HorizontalDivider(color = Color.LightGray, thickness = 0.5.dp)
                            uiState.subCategoryList.forEach { subCategory ->
                                Text(
                                    text = subCategory.displayName,
                                    fontSize = 15.sp,
                                    color = if (uiState.selectedSubCategory == subCategory) Color(0xFF5DB846) else Color.Black,
                                    fontWeight = if (uiState.selectedSubCategory == subCategory) FontWeight.Bold else FontWeight.Normal,
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .clickable {
                                            onSubCategorySelect(subCategory)
                                            showSubCategorySheet = false
                                        }
                                        .padding(horizontal = 20.dp, vertical = 16.dp)
                                )
                                HorizontalDivider(color = Color(0xFFF0F0F0), thickness = 0.5.dp)
                            }
                            Spacer(modifier = Modifier.height(16.dp))
                        }
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                ProductEditLabel(text = "상품 정보")

                OutlinedTextField(
                    value = uiState.description,
                    onValueChange = onDescriptionChange,
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(160.dp),
                    shape = RoundedCornerShape(8.dp),
                    colors = productTextFieldColors()
                )

                Spacer(modifier = Modifier.height(16.dp))

                ProductEditLabel(text = "판매 가격")

                OutlinedTextField(
                    value = uiState.price,
                    onValueChange = onPriceChange,
                    modifier = Modifier.fillMaxWidth(),
                    singleLine = true,
                    placeholder = {
                        Text(
                            text = "₩ 가격 입력",
                            fontSize = 14.sp,
                            color = Color.LightGray
                        )
                    },
                    shape = RoundedCornerShape(8.dp),
                    colors = productTextFieldColors(),
                    keyboardOptions = KeyboardOptions(
                        keyboardType = KeyboardType.Number,
                        imeAction = ImeAction.Done
                    ),
                    keyboardActions = KeyboardActions(
                        onDone = {
                            focusManager.clearFocus()
                        }
                    )
                )

                Spacer(modifier = Modifier.height(16.dp))

                ProductEditLabel(text = "거래 지역")

                OutlinedTextField(
                    value = uiState.tradeLocation,
                    onValueChange = onTradeLocationChange,
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(8.dp),
                    colors = productTextFieldColors(),
                    singleLine = true,
                    keyboardOptions = KeyboardOptions(
                        imeAction = ImeAction.Done
                    ),
                    keyboardActions = KeyboardActions(
                        onDone = {
                            focusManager.clearFocus()
                        }
                    )
                )

                Spacer(modifier = Modifier.height(16.dp))

                ProductEditLabel(text = "사이즈")

                var showSizeSheet by remember { mutableStateOf(false) }
                val sizeOptions = listOf("XS", "S", "M", "L", "XL", "XXL", "FREE")

                Surface(
                    onClick = { showSizeSheet = true },
                    shape = RoundedCornerShape(8.dp),
                    border = BorderStroke(1.dp, Color.LightGray),
                    color = Color.White,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 12.dp, vertical = 14.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text(
                            text = uiState.size.ifBlank { "사이즈 선택" },
                            fontSize = 14.sp,
                            color = if (uiState.size.isNotBlank()) Color.Black else Color.Gray
                        )
                        Icon(
                            imageVector = Icons.Default.KeyboardArrowDown,
                            contentDescription = null,
                            tint = Color.Black,
                            modifier = Modifier.size(18.dp)
                        )
                    }
                }

                if (showSizeSheet) {
                    ModalBottomSheet(
                        onDismissRequest = { showSizeSheet = false },
                        containerColor = Color.White
                    ) {
                        Column(
                            modifier = Modifier
                                .fillMaxWidth()
                                .navigationBarsPadding()
                                .padding(horizontal = 20.dp)
                        ) {
                            Text(
                                text = "사이즈 선택",
                                fontSize = 16.sp,
                                fontWeight = FontWeight.Bold,
                                modifier = Modifier.padding(vertical = 12.dp)
                            )
                            HorizontalDivider(color = Color.LightGray, thickness = 0.5.dp)
                            Spacer(modifier = Modifier.height(16.dp))
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.spacedBy(8.dp)
                            ) {
                                sizeOptions.forEach { size ->
                                    val isSelected = uiState.size == size
                                    Surface(
                                        onClick = {
                                            onSizeChange(size)
                                            showSizeSheet = false
                                        },
                                        shape = RoundedCornerShape(8.dp),
                                        border = BorderStroke(
                                            1.dp,
                                            if (isSelected) CloverGreen else Color.LightGray
                                        ),
                                        color = if (isSelected) CloverGreen.copy(alpha = 0.15f) else Color.White,
                                        modifier = Modifier.weight(1f)
                                    ) {
                                        Box(contentAlignment = Alignment.Center) {
                                            Text(
                                                text = size,
                                                fontSize = 13.sp,
                                                fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal,
                                                color = if (isSelected) Color(0xFF5DB846) else Color.Black,
                                                modifier = Modifier.padding(vertical = 10.dp)
                                            )
                                        }
                                    }
                                }
                            }
                            Spacer(modifier = Modifier.height(24.dp))
                        }
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                ProductEditLabel(text = "핏 선택 사항")

                var showFitSheet by remember { mutableStateOf(false) }
                val fitOptions = listOf("슬림핏", "레귤러핏", "세미오버핏", "오버핏")

                Surface(
                    onClick = { showFitSheet = true },
                    shape = RoundedCornerShape(8.dp),
                    border = BorderStroke(1.dp, Color.LightGray),
                    color = Color.White,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 12.dp, vertical = 14.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text(
                            text = uiState.fit.ifBlank { "핏 선택 (선택 사항)" },
                            fontSize = 14.sp,
                            color = if (uiState.fit.isNotBlank()) Color.Black else Color.Gray
                        )
                        Icon(
                            imageVector = Icons.Default.KeyboardArrowDown,
                            contentDescription = null,
                            tint = Color.Black,
                            modifier = Modifier.size(18.dp)
                        )
                    }
                }

                if (showFitSheet) {
                    ModalBottomSheet(
                        onDismissRequest = { showFitSheet = false },
                        containerColor = Color.White
                    ) {
                        Column(
                            modifier = Modifier
                                .fillMaxWidth()
                                .navigationBarsPadding()
                                .padding(horizontal = 20.dp)
                        ) {
                            Text(
                                text = "핏 선택",
                                fontSize = 16.sp,
                                fontWeight = FontWeight.Bold,
                                modifier = Modifier.padding(vertical = 12.dp)
                            )
                            HorizontalDivider(color = Color.LightGray, thickness = 0.5.dp)
                            Spacer(modifier = Modifier.height(12.dp))
                            fitOptions.forEach { fit ->
                                val isSelected = uiState.fit == fit
                                Text(
                                    text = fit,
                                    fontSize = 15.sp,
                                    color = if (isSelected) Color(0xFF5DB846) else Color.Black,
                                    fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal,
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .clickable {
                                            onFitChange(fit)
                                            showFitSheet = false
                                        }
                                        .padding(vertical = 16.dp)
                                )
                                HorizontalDivider(color = Color(0xFFF0F0F0), thickness = 0.5.dp)
                            }
                            Spacer(modifier = Modifier.height(24.dp))
                        }
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                ProductEditLabel(text = "상품 상태")

                var showGradeSheet by remember { mutableStateOf(false) }
                val gradeOptions = listOf("상", "중", "하")

                Surface(
                    onClick = { showGradeSheet = true },
                    shape = RoundedCornerShape(8.dp),
                    border = BorderStroke(1.dp, Color.LightGray),
                    color = Color.White,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 12.dp, vertical = 14.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text(
                            text = uiState.grade.ifBlank { "상품 상태 선택" },
                            fontSize = 14.sp,
                            color = if (uiState.grade.isNotBlank()) Color.Black else Color.Gray
                        )
                        Icon(
                            imageVector = Icons.Default.KeyboardArrowDown,
                            contentDescription = null,
                            tint = Color.Black,
                            modifier = Modifier.size(18.dp)
                        )
                    }
                }

                if (showGradeSheet) {
                    ModalBottomSheet(
                        onDismissRequest = { showGradeSheet = false },
                        containerColor = Color.White
                    ) {
                        Column(
                            modifier = Modifier
                                .fillMaxWidth()
                                .navigationBarsPadding()
                                .padding(horizontal = 20.dp)
                        ) {
                            Text(
                                text = "상품 상태 선택",
                                fontSize = 16.sp,
                                fontWeight = FontWeight.Bold,
                                modifier = Modifier.padding(vertical = 12.dp)
                            )
                            HorizontalDivider(color = Color.LightGray, thickness = 0.5.dp)
                            Spacer(modifier = Modifier.height(12.dp))
                            gradeOptions.forEach { grade ->
                                val isSelected = uiState.grade == grade
                                Text(
                                    text = grade,
                                    fontSize = 15.sp,
                                    color = if (isSelected) Color(0xFF5DB846) else Color.Black,
                                    fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal,
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .clickable {
                                            onGradeChange(grade)
                                            showGradeSheet = false
                                        }
                                        .padding(vertical = 16.dp)
                                )
                                HorizontalDivider(color = Color(0xFFF0F0F0), thickness = 0.5.dp)
                            }
                            Spacer(modifier = Modifier.height(24.dp))
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun ProductEditScreen(
    onBack: () -> Unit,
    onSubmit: (ProductEditFormState) -> Unit
) {
    var formState by remember {
        mutableStateOf(ProductEditFormState())
    }

    var validationMessage by remember {
        mutableStateOf<String?>(null)
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.White)
            .verticalScroll(rememberScrollState())
            .padding(20.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        Text(
            text = "상품 등록",
            style = MaterialTheme.typography.titleLarge,
            fontWeight = FontWeight.Bold,
            color = Color.Black
        )

        ProductTextField(
            label = "상품명",
            value = formState.name,
            onValueChange = {
                formState = formState.copy(name = it)
            },
            singleLine = true
        )

        ProductTextField(
            label = "가격",
            value = formState.price,
            onValueChange = {
                formState = formState.copy(
                    price = it.filter { char ->
                        char.isDigit()
                    }
                )
            },
            singleLine = true,
            keyboardType = KeyboardType.Number
        )

        ProductTextField(
            label = "상품 설명",
            value = formState.content,
            onValueChange = {
                formState = formState.copy(content = it)
            }
        )

        ProductTextField(
            label = "사이즈",
            value = formState.size,
            onValueChange = {
                formState = formState.copy(size = it)
            },
            singleLine = true
        )

        ProductTextField(
            label = "상품 상태",
            value = formState.grade,
            onValueChange = {
                formState = formState.copy(grade = it)
            },
            singleLine = true
        )

        ProductTextField(
            label = "거래 지역",
            value = formState.tradingArea,
            onValueChange = {
                formState = formState.copy(tradingArea = it)
            },
            singleLine = true
        )

        ProductTextField(
            label = "추천 체형",
            value = formState.recommendedType,
            onValueChange = {
                formState = formState.copy(recommendedType = it)
            },
            singleLine = true
        )

        ProductTextField(
            label = "판매 상태",
            value = formState.postStatus,
            onValueChange = {
                formState = formState.copy(postStatus = it.uppercase())
            },
            singleLine = true
        )

        ProductTextField(
            label = "카테고리 ID",
            value = formState.categoryId,
            onValueChange = {
                formState = formState.copy(
                    categoryId = it.filter { char ->
                        char.isDigit()
                    }
                )
            },
            singleLine = true,
            keyboardType = KeyboardType.Number
        )

        ProductTextField(
            label = "색상 ID",
            value = formState.colorId,
            onValueChange = {
                formState = formState.copy(
                    colorId = it.filter { char ->
                        char.isDigit()
                    }
                )
            },
            singleLine = true,
            keyboardType = KeyboardType.Number
        )

        validationMessage?.let { message ->
            Text(
                text = message,
                style = MaterialTheme.typography.bodySmall,
                color = Color(0xFFB3261E)
            )
        }

        Spacer(modifier = Modifier.height(12.dp))

        Button(
            modifier = Modifier.fillMaxWidth(),
            onClick = {
                val message = formState.validateProductForm()

                if (message != null) {
                    validationMessage = message
                    return@Button
                }

                validationMessage = null
                onSubmit(formState.normalized())
            }
        ) {
            Text(text = "등록")
        }

        Button(
            modifier = Modifier.fillMaxWidth(),
            onClick = onBack
        ) {
            Text(text = "이전")
        }
    }
}

@Composable
private fun ProductEditLabel(text: String) {
    Text(
        text = text,
        fontSize = 14.sp,
        color = Color.Black,
        fontWeight = FontWeight.Medium,
        modifier = Modifier.padding(bottom = 6.dp)
    )
}

@Composable
private fun ProductImagePickerSection(
    imageUris: List<String>,
    canAddImages: Boolean,
    onAddImageClick: () -> Unit,
    onImageRemove: (String) -> Unit
) {
    Column(modifier = Modifier.fillMaxWidth()) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(200.dp)
                .clip(RoundedCornerShape(8.dp))
                .background(Color(0xFFF5F5F5))
                .clickable(
                    enabled = canAddImages,
                    indication = null,
                    interactionSource = remember { MutableInteractionSource() }
                ) {
                    onAddImageClick()
                },
            contentAlignment = Alignment.Center
        ) {
            if (imageUris.isNotEmpty()) {
                AsyncImage(
                    model = imageUris.first(),
                    contentDescription = "대표 상품 이미지",
                    modifier = Modifier.fillMaxSize(),
                    contentScale = ContentScale.Crop
                )

                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .background(Color.Black.copy(alpha = 0.18f))
                )
            }

            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.Center
            ) {
                Icon(
                    painter = painterResource(id = android.R.drawable.ic_menu_camera),
                    contentDescription = "이미지 추가",
                    tint = if (canAddImages) Color.Gray else Color.LightGray,
                    modifier = Modifier.size(40.dp)
                )

                Spacer(modifier = Modifier.height(6.dp))

                Text(
                    text = if (canAddImages) {
                        "상품 이미지 추가"
                    } else {
                        "이미지는 최대 5장까지 가능"
                    },
                    fontSize = 13.sp,
                    color = if (canAddImages) Color.Gray else Color.LightGray,
                    fontWeight = FontWeight.Medium
                )
            }

            Text(
                text = "${imageUris.size}/$MaxProductImageCount",
                fontSize = 12.sp,
                color = Color.White,
                fontWeight = FontWeight.Bold,
                modifier = Modifier
                    .align(Alignment.BottomEnd)
                    .padding(8.dp)
                    .background(
                        color = Color.Black.copy(alpha = 0.55f),
                        shape = RoundedCornerShape(10.dp)
                    )
                    .padding(horizontal = 8.dp, vertical = 3.dp)
            )
        }

        if (imageUris.isNotEmpty()) {
            Spacer(modifier = Modifier.height(10.dp))

            LazyRow(
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                itemsIndexed(imageUris) { index, uri ->
                    ProductImageThumbnail(
                        uri = uri,
                        index = index,
                        onRemoveClick = {
                            onImageRemove(uri)
                        }
                    )
                }
            }
        }
    }
}

@Composable
private fun ProductImageThumbnail(
    uri: String,
    index: Int,
    onRemoveClick: () -> Unit
) {
    Box(
        modifier = Modifier
            .size(72.dp)
            .clip(RoundedCornerShape(8.dp))
    ) {
        AsyncImage(
            model = uri,
            contentDescription = "상품 이미지 ${index + 1}",
            modifier = Modifier.fillMaxSize(),
            contentScale = ContentScale.Crop
        )

        if (index == 0) {
            Text(
                text = "대표",
                fontSize = 10.sp,
                color = Color.White,
                fontWeight = FontWeight.Bold,
                modifier = Modifier
                    .align(Alignment.BottomStart)
                    .background(
                        color = CloverGreen.copy(alpha = 0.95f),
                        shape = RoundedCornerShape(topEnd = 6.dp)
                    )
                    .padding(horizontal = 5.dp, vertical = 2.dp)
            )
        }

        Surface(
            onClick = onRemoveClick,
            color = Color.Black.copy(alpha = 0.65f),
            shape = CircleShape,
            modifier = Modifier
                .align(Alignment.TopEnd)
                .padding(4.dp)
                .size(22.dp)
        ) {
            Icon(
                imageVector = Icons.Default.Close,
                contentDescription = "이미지 삭제",
                tint = Color.White,
                modifier = Modifier.padding(4.dp)
            )
        }
    }
}

@Composable
fun ProductEditTopBar(
    onBackClick: () -> Unit = {}
) {
    Column(modifier = Modifier.fillMaxWidth()) {
        Spacer(
            modifier = Modifier
                .fillMaxWidth()
                .statusBarsPadding()
                .background(Color.White)
        )

        Surface(
            color = Color(0xFFE8F8E0),
            modifier = Modifier
                .fillMaxWidth()
                .height(57.dp)
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 4.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(
                    painter = painterResource(id = R.drawable.back_icon),
                    contentDescription = "뒤로가기",
                    tint = Color.Unspecified,
                    modifier = Modifier
                        .padding(12.dp)
                        .size(24.dp)
                        .clickable(
                            indication = null,
                            interactionSource = remember { MutableInteractionSource() }
                        ) {
                            onBackClick()
                        }
                )

                Box(
                    modifier = Modifier.weight(1f),
                    contentAlignment = Alignment.Center
                ) {
                    Image(
                        painter = painterResource(id = R.drawable.logo),
                        contentDescription = "Clo-ver 로고",
                        modifier = Modifier
                            .width(80.dp)
                            .height(62.dp),
                        contentScale = ContentScale.Fit
                    )
                }

                Spacer(modifier = Modifier.size(48.dp))
            }
        }
    }
}

@Composable
private fun ProductTextField(
    label: String,
    value: String,
    onValueChange: (String) -> Unit,
    singleLine: Boolean = false,
    keyboardType: KeyboardType = KeyboardType.Text
) {
    OutlinedTextField(
        modifier = Modifier.fillMaxWidth(),
        value = value,
        onValueChange = onValueChange,
        label = {
            Text(text = label)
        },
        singleLine = singleLine,
        keyboardOptions = KeyboardOptions(
            keyboardType = keyboardType
        )
    )
}

@Composable
private fun productTextFieldColors() = OutlinedTextFieldDefaults.colors(
    unfocusedBorderColor = Color.LightGray,
    focusedBorderColor = CloverGreen,
    unfocusedContainerColor = Color.White,
    focusedContainerColor = Color.White
)

private fun ProductEditFormState.validateProductForm(): String? {
    if (name.isBlank()) {
        return "상품명을 입력해 주세요."
    }

    if (price.isBlank()) {
        return "가격을 입력해 주세요."
    }

    val priceValue = price.trim().toIntOrNull()

    if (priceValue == null || priceValue <= 0) {
        return "가격은 1원 이상 숫자로 입력해 주세요."
    }

    if (content.isBlank()) {
        return "상품 설명을 입력해 주세요."
    }

    if (size.isBlank()) {
        return "사이즈를 입력해 주세요."
    }

    if (grade.isBlank()) {
        return "상품 상태를 입력해 주세요."
    }

    if (tradingArea.isBlank()) {
        return "거래 지역을 입력해 주세요."
    }

    if (categoryId.isBlank()) {
        return "카테고리 ID를 입력해 주세요."
    }

    if (categoryId.trim().toLongOrNull() == null) {
        return "카테고리 ID는 숫자로 입력해 주세요."
    }

    if (colorId.isNotBlank() && colorId.trim().toLongOrNull() == null) {
        return "색상 ID는 숫자로 입력해 주세요."
    }

    val safePostStatus = postStatus.trim().ifBlank {
        "ACTIVE"
    }

    val allowedStatus = setOf(
        "ACTIVE",
        "RESERVED",
        "SOLD_OUT",
        "HIDDEN"
    )

    if (safePostStatus !in allowedStatus) {
        return "판매 상태는 ACTIVE, RESERVED, SOLD_OUT, HIDDEN 중 하나로 입력해 주세요."
    }

    return null
}

private fun ProductEditFormState.normalized(): ProductEditFormState {
    return copy(
        name = name.trim(),
        price = price.trim(),
        content = content.trim(),
        size = size.trim(),
        grade = grade.trim(),
        tradingArea = tradingArea.trim(),
        recommendedType = recommendedType.trim(),
        postStatus = postStatus.trim().ifBlank {
            "ACTIVE"
        },
        categoryId = categoryId.trim(),
        colorId = colorId.trim()
    )
}

@Preview(showBackground = true, showSystemUi = true)
@Composable
fun ProductRegisterPreview() {
    var uiState by remember {
        mutableStateOf(ProductEditUiState(isEditMode = false))
    }

    ProductEditScreen(
        uiState = uiState,
        onTitleChange = {
            uiState = uiState.copy(title = it)
        },
        onPriceChange = {
            uiState = uiState.copy(price = it)
        },
        onDescriptionChange = {
            uiState = uiState.copy(description = it)
        },
        onTradeLocationChange = {
            uiState = uiState.copy(tradeLocation = it)
        },
        onSizeChange = {
            uiState = uiState.copy(size = it)
        },
        onFitChange = {
            uiState = uiState.copy(fit = it)
        },
        onGradeChange = {
            uiState = uiState.copy(grade = it)
        },
        onMainCategorySelect = { category ->
            uiState = uiState.copy(
                selectedMainCategory = category,
                isMainCategoryExpanded = false,
                subCategoryList = ProductSubCategory.getByMainCategory(category),
                selectedSubCategory = null
            )
        },
        onMainCategoryExpandChange = {
            uiState = uiState.copy(isMainCategoryExpanded = it)
        },
        onSubCategorySelect = { subCategory ->
            uiState = uiState.copy(
                selectedSubCategory = subCategory,
                isSubCategoryExpanded = false
            )
        },
        onSubCategoryExpandChange = {
            uiState = uiState.copy(isSubCategoryExpanded = it)
        },
        onImageUrisChange = { imageUris ->
            uiState = uiState.copy(imageUris = imageUris)
        }
    )
}

@Preview(showBackground = true, showSystemUi = true)
@Composable
fun ProductEditPreview() {
    var uiState by remember {
        mutableStateOf(
            ProductEditUiState(
                isEditMode = true,
                title = "나이키 후드",
                price = "39800",
                description = "깨끗하게 입었습니다",
                tradeLocation = "서울 강남구",
                size = "M",
                fit = "오버핏",
                selectedMainCategory = ProductMainCategory.TOP,
                subCategoryList = ProductSubCategory.getByMainCategory(ProductMainCategory.TOP),
                selectedSubCategory = ProductSubCategory.HOODIE
            )
        )
    }

    ProductEditScreen(
        uiState = uiState,
        onTitleChange = {
            uiState = uiState.copy(title = it)
        },
        onPriceChange = {
            uiState = uiState.copy(price = it)
        },
        onDescriptionChange = {
            uiState = uiState.copy(description = it)
        },
        onTradeLocationChange = {
            uiState = uiState.copy(tradeLocation = it)
        },
        onSizeChange = {
            uiState = uiState.copy(size = it)
        },
        onFitChange = {
            uiState = uiState.copy(fit = it)
        },
        onGradeChange = {
            uiState = uiState.copy(grade = it)
        },
        onMainCategorySelect = { category ->
            uiState = uiState.copy(
                selectedMainCategory = category,
                isMainCategoryExpanded = false,
                subCategoryList = ProductSubCategory.getByMainCategory(category),
                selectedSubCategory = null
            )
        },
        onMainCategoryExpandChange = {
            uiState = uiState.copy(isMainCategoryExpanded = it)
        },
        onSubCategorySelect = { subCategory ->
            uiState = uiState.copy(
                selectedSubCategory = subCategory,
                isSubCategoryExpanded = false
            )
        },
        onSubCategoryExpandChange = {
            uiState = uiState.copy(isSubCategoryExpanded = it)
        },
        onImageUrisChange = { imageUris ->
            uiState = uiState.copy(imageUris = imageUris)
        }
    )
}