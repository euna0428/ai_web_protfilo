package com.fitflow.clover.presentation.diagnosis

import android.Manifest
import android.content.ContentValues
import android.graphics.Bitmap
import android.graphics.ImageDecoder
import android.net.Uri
import android.os.Build
import android.provider.MediaStore
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
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
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.systemBarsPadding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlinx.coroutines.delay

private enum class BodyAnalysisStep {
    USER_INFO,
    BODY_FRONT_CAMERA,
    BODY_SIDE_CAMERA,
    BODY_RETRY,
    BODY_RESULT
}

@Composable
fun BodyAnalysisScreen(
    viewModel: DiagnosisViewModel,
    onBackToSignUp: () -> Unit,
    onMoveToPersonalColor: () -> Unit,
    onMoveToMain: () -> Unit
) {
    val uiState by viewModel.uiState

    var currentStep by remember {
        mutableStateOf(BodyAnalysisStep.USER_INFO)
    }

    var showSkipDialog by remember {
        mutableStateOf(false)
    }

    LaunchedEffect(
        uiState.isBodyAnalyzing,
        uiState.frontBodyPhotoBitmap,
        uiState.sideBodyPhotoBitmap
    ) {
        if (
            uiState.isBodyAnalyzing &&
            uiState.frontBodyPhotoBitmap != null &&
            uiState.sideBodyPhotoBitmap != null
        ) {
            delay(900)

            val success = viewModel.completeBodyAnalysis()

            currentStep = if (success) {
                BodyAnalysisStep.BODY_RESULT
            } else {
                BodyAnalysisStep.BODY_RETRY
            }
        }
    }

    when (currentStep) {
        BodyAnalysisStep.USER_INFO -> {
            BodyUserInfoContent(
                uiState = uiState,
                heightOptions = viewModel.heightOptions,
                weightOptions = viewModel.weightOptions,
                onSelectGender = viewModel::selectGender,
                onSelectHeight = viewModel::selectHeight,
                onSelectWeight = viewModel::selectWeight,
                onNext = {
                    currentStep = BodyAnalysisStep.BODY_FRONT_CAMERA
                },
                onBack = onBackToSignUp,
                onSkip = {
                    showSkipDialog = true
                }
            )
        }

        BodyAnalysisStep.BODY_FRONT_CAMERA -> {
            BodyCameraContent(
                uiState = uiState,
                headerTitle = "체형분석",
                guideMessage = "전면으로 보고 사진을 찍어주세요.\n전신이 화면 중앙에 보여야 정확하게 분석할 수 있습니다.",
                progressText = "1/2 전면 촬영",
                bitmap = uiState.frontBodyPhotoBitmap,
                isLoading = false,
                onPhotoCaptured = { bitmap ->
                    viewModel.onFrontBodyPhotoCaptured(bitmap)
                    if (bitmap != null) {
                        currentStep = BodyAnalysisStep.BODY_SIDE_CAMERA
                    }
                },
                onBack = {
                    currentStep = BodyAnalysisStep.USER_INFO
                },
                onSkip = {
                    showSkipDialog = true
                }
            )
        }

        BodyAnalysisStep.BODY_SIDE_CAMERA -> {
            BodyCameraContent(
                uiState = uiState,
                headerTitle = "체형분석",
                guideMessage = "옆면으로 서서 사진을 한 번 더 찍어주세요.\n전면 사진과 옆면 사진을 함께 분석합니다.",
                progressText = "2/2 옆면 촬영",
                bitmap = uiState.sideBodyPhotoBitmap,
                isLoading = uiState.isBodyAnalyzing,
                onPhotoCaptured = { bitmap ->
                    viewModel.onSideBodyPhotoCaptured(bitmap)
                },
                onBack = {
                    currentStep = BodyAnalysisStep.BODY_FRONT_CAMERA
                },
                onSkip = {
                    showSkipDialog = true
                }
            )
        }

        BodyAnalysisStep.BODY_RETRY -> {
            BodyRetryContent(
                message = uiState.bodyAnalysisErrorMessage
                    ?: "체형을 인식할 수 없어요. 다시 촬영해 주세요.",
                onRetry = {
                    viewModel.resetBodyPhotos()
                    currentStep = BodyAnalysisStep.BODY_FRONT_CAMERA
                },
                onSkip = {
                    showSkipDialog = true
                }
            )
        }

        BodyAnalysisStep.BODY_RESULT -> {
            BodyResultContent(
                uiState = uiState,
                onBack = {
                    currentStep = BodyAnalysisStep.BODY_SIDE_CAMERA
                },
                onMoveToPersonalColor = onMoveToPersonalColor,
                onSkip = {
                    showSkipDialog = true
                }
            )
        }
    }

    if (showSkipDialog) {
        BodySkipConfirmDialog(
            onDismiss = {
                showSkipDialog = false
            },
            onConfirm = {
                showSkipDialog = false
                onMoveToMain()
            }
        )
    }
}

@Composable
private fun BodyUserInfoContent(
    uiState: DiagnosisUiState,
    heightOptions: List<Int>,
    weightOptions: List<Int>,
    onSelectGender: (DiagnosisGender) -> Unit,
    onSelectHeight: (Int) -> Unit,
    onSelectWeight: (Int) -> Unit,
    onNext: () -> Unit,
    onBack: () -> Unit,
    onSkip: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.White)
            .systemBarsPadding()
            .padding(bottom = 30.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        DiagnosisHeader(
            title = "내 정보",
            onBack = onBack,
            onSkip = onSkip
        )

        Spacer(modifier = Modifier.height(40.dp))

        Text(
            text = "성별",
            color = Color.Black,
            fontSize = 18.sp,
            fontWeight = FontWeight.Medium,
            textAlign = TextAlign.Center
        )

        Spacer(modifier = Modifier.height(20.dp))

        Row(
            modifier = Modifier.fillMaxWidth(0.85f),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            GenderSelectButton(
                gender = DiagnosisGender.MALE,
                isSelected = uiState.selectedGender == DiagnosisGender.MALE,
                modifier = Modifier
                    .weight(1f)
                    .aspectRatio(0.7f),
                onClick = { onSelectGender(DiagnosisGender.MALE) }
            )

            Spacer(modifier = Modifier.width(24.dp))

            GenderSelectButton(
                gender = DiagnosisGender.FEMALE,
                isSelected = uiState.selectedGender == DiagnosisGender.FEMALE,
                modifier = Modifier
                    .weight(1f)
                    .aspectRatio(0.7f),
                onClick = { onSelectGender(DiagnosisGender.FEMALE) }
            )
        }

        Spacer(modifier = Modifier.height(50.dp))

        FigmaNumberDropdown(
            modifier = Modifier
                .fillMaxWidth(0.85f)
                .height(48.dp),
            label = "키",
            suffix = "cm",
            selectedValue = uiState.selectedHeightCm,
            options = heightOptions,
            onSelect = onSelectHeight
        )

        Spacer(modifier = Modifier.height(20.dp))

        FigmaNumberDropdown(
            modifier = Modifier
                .fillMaxWidth(0.85f)
                .height(48.dp),
            label = "몸무게",
            suffix = "kg",
            selectedValue = uiState.selectedWeightKg,
            options = weightOptions,
            onSelect = onSelectWeight
        )

        Spacer(modifier = Modifier.weight(1f))

        FigmaBottomButton(
            modifier = Modifier
                .fillMaxWidth(0.85f)
                .height(62.dp),
            text = "다음",
            enabled = uiState.isInfoCompleted,
            onClick = onNext
        )
    }
}

@Composable
private fun BodyCameraContent(
    uiState: DiagnosisUiState,
    headerTitle: String,
    guideMessage: String,
    progressText: String,
    bitmap: Bitmap?,
    isLoading: Boolean,
    onPhotoCaptured: (Bitmap?) -> Unit,
    onBack: () -> Unit,
    onSkip: () -> Unit
) {
    val context = LocalContext.current

    var pendingCameraUri by remember {
        mutableStateOf<Uri?>(null)
    }

    val cameraLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.TakePicture(),
        onResult = { success ->
            val uri = pendingCameraUri

            if (success && uri != null) {
                val capturedBitmap = runCatching {
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
                        val source = ImageDecoder.createSource(
                            context.contentResolver,
                            uri
                        )

                        ImageDecoder.decodeBitmap(source) { decoder, _, _ ->
                            decoder.allocator = ImageDecoder.ALLOCATOR_SOFTWARE
                        }
                    } else {
                        @Suppress("DEPRECATION")
                        MediaStore.Images.Media.getBitmap(
                            context.contentResolver,
                            uri
                        )
                    }
                }.getOrNull()

                onPhotoCaptured(capturedBitmap)
            } else {
                onPhotoCaptured(null)
            }

            pendingCameraUri = null
        }
    )

    val cameraPermissionLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.RequestPermission(),
        onResult = { granted ->
            if (granted) {
                val values = ContentValues().apply {
                    put(
                        MediaStore.Images.Media.DISPLAY_NAME,
                        "body_${System.currentTimeMillis()}.jpg"
                    )
                    put(
                        MediaStore.Images.Media.MIME_TYPE,
                        "image/jpeg"
                    )
                }

                val uri = context.contentResolver.insert(
                    MediaStore.Images.Media.EXTERNAL_CONTENT_URI,
                    values
                )

                if (uri != null) {
                    pendingCameraUri = uri
                    cameraLauncher.launch(uri)
                } else {
                    onPhotoCaptured(null)
                }
            } else {
                onPhotoCaptured(null)
            }
        }
    )

    fun openCameraSafely() {
        cameraPermissionLauncher.launch(Manifest.permission.CAMERA)
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.White)
            .systemBarsPadding()
            .padding(bottom = 30.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        DiagnosisHeader(
            title = headerTitle,
            onBack = onBack,
            onSkip = onSkip
        )

        Spacer(modifier = Modifier.height(30.dp))

        Text(
            text = progressText,
            color = Color.Black,
            fontSize = 16.sp,
            fontWeight = FontWeight.Bold,
            textAlign = TextAlign.Center
        )

        Spacer(modifier = Modifier.height(18.dp))

        Text(
            text = guideMessage,
            color = Color(0xFFF23636),
            fontSize = 16.sp,
            fontWeight = FontWeight.Medium,
            textAlign = TextAlign.Center,
            lineHeight = 22.sp,
            modifier = Modifier.padding(horizontal = 28.dp)
        )

        Spacer(modifier = Modifier.height(34.dp))

        PhotoCaptureBox(
            modifier = Modifier
                .fillMaxWidth(0.6f)
                .aspectRatio(0.7f),
            bitmap = bitmap,
            isLoading = isLoading,
            onClick = {
                openCameraSafely()
            }
        )

        Spacer(modifier = Modifier.height(26.dp))

        if (isLoading) {
            Text(
                text = "전면과 옆면 체형 데이터를 분석하고 있어요.",
                color = Color.Black,
                fontSize = 14.sp,
                textAlign = TextAlign.Center,
                lineHeight = 20.sp,
                modifier = Modifier.padding(horizontal = 40.dp)
            )
        }

        if (uiState.bodyAnalysisErrorMessage != null) {
            Text(
                text = uiState.bodyAnalysisErrorMessage.orEmpty(),
                color = Color(0xFFF23636),
                fontSize = 14.sp,
                textAlign = TextAlign.Center,
                lineHeight = 20.sp,
                modifier = Modifier.padding(horizontal = 40.dp)
            )
        }

        Spacer(modifier = Modifier.weight(1f))
    }
}

@Composable
private fun BodyRetryContent(
    message: String,
    onRetry: () -> Unit,
    onSkip: () -> Unit
) {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.White)
            .systemBarsPadding(),
        contentAlignment = Alignment.Center
    ) {
        DiagnosisSkipTextButton(
            modifier = Modifier
                .align(Alignment.TopEnd)
                .padding(top = 28.dp, end = 20.dp),
            onClick = onSkip
        )

        Column(
            modifier = Modifier.padding(horizontal = 28.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                text = "체형을 인식할 수 없어요.",
                color = Color.Black,
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold,
                textAlign = TextAlign.Center
            )

            Spacer(modifier = Modifier.height(14.dp))

            Text(
                text = message,
                color = Color(0xFF555555),
                fontSize = 13.sp,
                textAlign = TextAlign.Center,
                lineHeight = 20.sp
            )

            Spacer(modifier = Modifier.height(36.dp))

            OutlinedButton(
                onClick = onRetry,
                colors = ButtonDefaults.outlinedButtonColors(
                    containerColor = Color.White,
                    contentColor = Color.Black
                )
            ) {
                Text(
                    text = "다시 촬영하기",
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Medium
                )
            }        }
    }
}

@Composable
private fun BodyResultContent(
    uiState: DiagnosisUiState,
    onBack: () -> Unit,
    onMoveToPersonalColor: () -> Unit,
    onSkip: () -> Unit
) {
    val result = uiState.bodyResult

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.White)
            .systemBarsPadding()
            .padding(bottom = 30.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        DiagnosisHeader(
            title = "체형분석",
            onBack = onBack,
            onSkip = onSkip
        )

        Spacer(modifier = Modifier.height(50.dp))

        Text(
            text = result?.title ?: "체형 분석이 완료되었습니다.",
            color = Color.Black,
            fontSize = 20.sp,
            fontWeight = FontWeight.Bold,
            textAlign = TextAlign.Center,
            lineHeight = 28.sp,
            modifier = Modifier.padding(horizontal = 40.dp)
        )

        Spacer(modifier = Modifier.height(34.dp))

        Text(
            text = result?.description ?: "추천 스타일 데이터를 준비했어요.",
            color = Color(0xFF555555),
            fontSize = 14.sp,
            textAlign = TextAlign.Center,
            lineHeight = 22.sp,
            modifier = Modifier.padding(horizontal = 40.dp)
        )

        Spacer(modifier = Modifier.height(20.dp))

        Text(
            text = result?.recommendMessage ?: "퍼스널 컬러 진단을 이어서 진행해 주세요.",
            color = Color(0xFF5FAE4F),
            fontSize = 14.sp,
            fontWeight = FontWeight.SemiBold,
            textAlign = TextAlign.Center,
            lineHeight = 22.sp,
            modifier = Modifier.padding(horizontal = 40.dp)
        )

        Spacer(modifier = Modifier.weight(1f))

        FigmaBottomButton(
            modifier = Modifier
                .fillMaxWidth(0.85f)
                .height(62.dp),
            text = "퍼스널 진단 하러 가기",
            enabled = uiState.isBodyResultReady,
            onClick = onMoveToPersonalColor
        )
    }
}

@Composable
private fun DiagnosisHeader(
    title: String,
    onBack: () -> Unit,
    onSkip: (() -> Unit)? = null
) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 20.dp)
            .height(60.dp)
    ) {
        Box(
            modifier = Modifier
                .align(Alignment.CenterStart)
                .size(40.dp)
                .clickable(onClick = onBack),
            contentAlignment = Alignment.Center
        ) {
            ChevronLeftIcon()
        }

        Text(
            text = title,
            modifier = Modifier.align(Alignment.Center),
            color = Color.Black,
            fontSize = 26.sp,
            fontWeight = FontWeight.Bold,
            textAlign = TextAlign.Center
        )

        if (onSkip != null) {
            DiagnosisSkipTextButton(
                modifier = Modifier.align(Alignment.CenterEnd),
                onClick = onSkip
            )
        }
    }
}

@Composable
private fun DiagnosisSkipTextButton(
    modifier: Modifier = Modifier,
    onClick: () -> Unit
) {
    Text(
        text = "건너뛰기",
        modifier = modifier
            .clickable(onClick = onClick)
            .padding(horizontal = 4.dp, vertical = 8.dp),
        color = Color(0xFF555555),
        fontSize = 14.sp,
        fontWeight = FontWeight.Medium,
        textAlign = TextAlign.Center
    )
}

@Composable
private fun BodySkipConfirmDialog(
    onDismiss: () -> Unit,
    onConfirm: () -> Unit
) {
    AlertDialog(
        onDismissRequest = onDismiss,
        title = {
            Text(
                text = "진단을 건너뛸까요?",
                fontWeight = FontWeight.Bold
            )
        },
        text = {
            Text(
                text = "건너뛰면 체형 맞춤 추천 옷을 정확하게 추천할 수 없어요. 정말로 건너뛰시겠어요?",
                lineHeight = 20.sp
            )
        },
        confirmButton = {
            TextButton(onClick = onConfirm) {
                Text(text = "확인")
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) {
                Text(text = "취소")
            }
        },
        containerColor = Color.White,
        titleContentColor = Color.Black,
        textContentColor = Color.Black
    )
}

@Composable
private fun ChevronLeftIcon() {
    Canvas(
        modifier = Modifier.size(24.dp)
    ) {
        val strokeWidth = 2.dp.toPx()
        drawLine(
            color = Color.Black,
            start = Offset(x = size.width * 0.7f, y = size.height * 0.1f),
            end = Offset(x = size.width * 0.3f, y = size.height * 0.5f),
            strokeWidth = strokeWidth,
            cap = StrokeCap.Round
        )

        drawLine(
            color = Color.Black,
            start = Offset(x = size.width * 0.3f, y = size.height * 0.5f),
            end = Offset(x = size.width * 0.7f, y = size.height * 0.9f),
            strokeWidth = strokeWidth,
            cap = StrokeCap.Round
        )
    }
}

@Composable
private fun GenderSelectButton(
    gender: DiagnosisGender,
    isSelected: Boolean,
    modifier: Modifier = Modifier,
    onClick: () -> Unit
) {
    val baseColor = if (gender == DiagnosisGender.MALE) Color(0xFF2196F3) else Color(0xFFE91E63)
    val lightBgColor = if (gender == DiagnosisGender.MALE) Color(0xFFE3F2FD) else Color(0xFFFCE4EC)

    Box(
        modifier = modifier
            .background(
                color = if (isSelected) lightBgColor else Color.Transparent,
                shape = RoundedCornerShape(8.dp)
            )
            .then(
                if (isSelected) Modifier.border(2.dp, baseColor, RoundedCornerShape(8.dp))
                else Modifier
            )
            .clickable(onClick = onClick),
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            GenderAvatar(
                gender = gender,
                modifier = Modifier
                    .fillMaxWidth(0.5f)
                    .aspectRatio(1f)
            )

            Spacer(modifier = Modifier.height(16.dp))

            Text(
                text = gender.label,
                color = if (isSelected) baseColor else Color.Black,
                fontSize = 18.sp,
                fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
                textAlign = TextAlign.Center
            )
        }
    }
}

@Composable
private fun GenderAvatar(
    gender: DiagnosisGender,
    modifier: Modifier = Modifier
) {
    val drawColor = if (gender == DiagnosisGender.MALE) Color(0xFF2196F3) else Color(0xFFE91E63)

    Canvas(modifier = modifier) {
        val centerX = size.width / 2f
        val h = size.height
        val w = size.width

        val headRadius = h / 9f
        val headCenterY = headRadius

        drawCircle(
            color = drawColor,
            radius = headRadius,
            center = Offset(x = centerX, y = headCenterY)
        )

        if (gender == DiagnosisGender.MALE) {
            drawRoundRect(
                color = drawColor,
                topLeft = Offset(x = centerX - w * 0.2f, y = h * 0.30f),
                size = Size(width = w * 0.4f, height = h * 0.38f),
                cornerRadius = CornerRadius(x = 8f, y = 8f)
            )

            drawLine(
                color = drawColor,
                start = Offset(centerX - w * 0.28f, h * 0.2f),
                end = Offset(centerX - w * 0.28f, h * 0.58f),
                strokeWidth = w * 0.08f,
                cap = StrokeCap.Round
            )
            drawLine(
                color = drawColor,
                start = Offset(centerX + w * 0.28f, h * 0.2f),
                end = Offset(centerX + w * 0.28f, h * 0.58f),
                strokeWidth = w * 0.08f,
                cap = StrokeCap.Round
            )
            drawLine(
                color = drawColor,
                start = Offset(centerX - w * 0.09f, h * 0.55f),
                end = Offset(centerX - w * 0.09f, h * 0.98f),
                strokeWidth = w * 0.1f,
                cap = StrokeCap.Round
            )
            drawLine(
                color = drawColor,
                start = Offset(centerX + w * 0.09f, h * 0.55f),
                end = Offset(centerX + w * 0.09f, h * 0.98f),
                strokeWidth = w * 0.1f,
                cap = StrokeCap.Round
            )
        } else {
            val dressPath = Path().apply {
                moveTo(centerX, h * 0.30f)
                lineTo(centerX - w * 0.35f, h * 0.62f)
                lineTo(centerX + w * 0.35f, h * 0.62f)
                close()
            }
            drawPath(path = dressPath, color = drawColor)

            drawLine(
                color = drawColor,
                start = Offset(centerX - w * 0.2f, h * 0.2f),
                end = Offset(centerX - w * 0.4f, h * 0.55f),
                strokeWidth = w * 0.07f,
                cap = StrokeCap.Round
            )
            drawLine(
                color = drawColor,
                start = Offset(centerX + w * 0.2f, h * 0.2f),
                end = Offset(centerX + w * 0.4f, h * 0.55f),
                strokeWidth = w * 0.07f,
                cap = StrokeCap.Round
            )
            drawLine(
                color = drawColor,
                start = Offset(centerX - w * 0.1f, h * 0.6f),
                end = Offset(centerX - w * 0.1f, h * 0.98f),
                strokeWidth = w * 0.09f,
                cap = StrokeCap.Round
            )
            drawLine(
                color = drawColor,
                start = Offset(centerX + w * 0.1f, h * 0.6f),
                end = Offset(centerX + w * 0.1f, h * 0.98f),
                strokeWidth = w * 0.09f,
                cap = StrokeCap.Round
            )
        }
    }
}

@Composable
private fun FigmaNumberDropdown(
    modifier: Modifier,
    label: String,
    suffix: String,
    selectedValue: Int?,
    options: List<Int>,
    onSelect: (Int) -> Unit
) {
    var expanded by remember { mutableStateOf(false) }

    Box(modifier = modifier) {
        Row(
            modifier = Modifier
                .fillMaxSize()
                .background(Color.White, shape = RoundedCornerShape(6.dp))
                .border(
                    width = 1.dp,
                    color = Color.Black,
                    shape = RoundedCornerShape(6.dp)
                )
                .clickable { expanded = true }
                .padding(horizontal = 16.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Text(
                text = selectedValue?.let { "$it$suffix" } ?: label,
                color = Color.Black,
                fontSize = 16.sp,
                fontWeight = FontWeight.Medium
            )

            Canvas(modifier = Modifier.size(14.dp)) {
                val path = Path().apply {
                    moveTo(size.width / 2f, 0f)
                    lineTo(size.width, size.height)
                    lineTo(0f, size.height)
                    close()
                }
                drawPath(path, Color.Black)
            }
        }

        DropdownMenu(
            expanded = expanded,
            onDismissRequest = { expanded = false },
            modifier = Modifier.fillMaxWidth(0.85f)
        ) {
            options.forEach { value ->
                DropdownMenuItem(
                    text = { Text(text = "$value$suffix") },
                    onClick = {
                        onSelect(value)
                        expanded = false
                    }
                )
            }
        }
    }
}

@Composable
private fun PhotoCaptureBox(
    modifier: Modifier,
    bitmap: Bitmap?,
    isLoading: Boolean,
    onClick: () -> Unit
) {
    Box(
        modifier = modifier
            .border(
                width = 1.dp,
                color = Color.Black
            )
            .clickable(
                enabled = !isLoading,
                onClick = onClick
            ),
        contentAlignment = Alignment.Center
    ) {
        when {
            isLoading -> {
                CircularProgressIndicator(color = Color(0xFF99DE81))
            }
            bitmap != null -> {
                Image(
                    bitmap = bitmap.asImageBitmap(),
                    contentDescription = "촬영한 체형 분석 사진",
                    modifier = Modifier.fillMaxSize(),
                    contentScale = ContentScale.Crop
                )
            }
            else -> {
                PlusIcon()
            }
        }
    }
}

@Composable
private fun PlusIcon() {
    Canvas(
        modifier = Modifier.size(width = 40.dp, height = 40.dp)
    ) {
        drawLine(
            color = Color.Black,
            start = Offset(size.width / 2f, 0f),
            end = Offset(size.width / 2f, size.height),
            strokeWidth = 2.dp.toPx(),
            cap = StrokeCap.Round
        )
        drawLine(
            color = Color.Black,
            start = Offset(0f, size.height / 2f),
            end = Offset(size.width, size.height / 2f),
            strokeWidth = 2.dp.toPx(),
            cap = StrokeCap.Round
        )
    }
}

@Composable
private fun FigmaBottomButton(
    modifier: Modifier,
    text: String,
    enabled: Boolean,
    onClick: () -> Unit
) {
    Box(
        modifier = modifier
            .background(
                color = if (enabled) Color(0xFF99DE81) else Color(0xFFD9D9D9),
                shape = RoundedCornerShape(8.dp)
            )
            .border(
                width = 1.dp,
                color = Color.Black,
                shape = RoundedCornerShape(8.dp)
            )
            .clickable(
                enabled = enabled,
                onClick = onClick
            ),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = text,
            color = Color.Black,
            fontSize = 20.sp,
            fontWeight = FontWeight.Bold,
            textAlign = TextAlign.Center
        )
    }
}
