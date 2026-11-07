package com.fitflow.clover.presentation.diagnosis.personalcolor

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
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.systemBarsPadding
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.CircularProgressIndicator
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
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.fitflow.clover.presentation.diagnosis.DiagnosisViewModel
import kotlinx.coroutines.delay

@Composable
fun PersonalColorScreen(
    viewModel: DiagnosisViewModel,
    onBack: () -> Unit,
    onSkip: () -> Unit,
    onMoveToResult: () -> Unit
) {
    val uiState by viewModel.uiState

    val context = LocalContext.current

    var pendingCameraUri by remember {
        mutableStateOf<Uri?>(null)
    }

    var showSkipDialog by remember {
        mutableStateOf(false)
    }

    val cameraLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.TakePicture(),
        onResult = { success ->
            val uri = pendingCameraUri

            if (success && uri != null) {
                val bitmap = runCatching {
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

                viewModel.onPersonalColorPhotoCaptured(bitmap)
            } else {
                viewModel.onPersonalColorPhotoCaptured(null)
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
                        "personal_color_${System.currentTimeMillis()}.jpg"
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
                    viewModel.onPersonalColorPhotoCaptured(null)
                }
            } else {
                viewModel.onPersonalColorPhotoCaptured(null)
            }
        }
    )

    fun openCameraSafely() {
        cameraPermissionLauncher.launch(Manifest.permission.CAMERA)
    }

    LaunchedEffect(uiState.isPersonalColorAnalyzing, uiState.personalColorPhotoBitmap) {
        if (uiState.isPersonalColorAnalyzing && uiState.personalColorPhotoBitmap != null) {
            delay(900)

            val success = viewModel.completePersonalColorAnalysis()

            if (success) {
                onMoveToResult()
            }
        }
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.White)
            .systemBarsPadding()
    ) {
        PersonalColorHeader(
            onBack = onBack,
            onSkip = {
                showSkipDialog = true
            }
        )

        Text(
            text = "전면으로 보고 사진을 찍어주세요.\n아닐 시 정확하지 않을 수 있습니다.",
            modifier = Modifier
                .align(Alignment.TopCenter)
                .padding(top = 160.dp),
            color = Color(0xFFF23636),
            fontSize = 16.sp,
            fontWeight = FontWeight.Medium,
            textAlign = TextAlign.Center,
            lineHeight = 22.sp
        )

        PersonalColorPhotoCaptureBox(
            modifier = Modifier
                .align(Alignment.TopCenter)
                .padding(top = 260.dp)
                .fillMaxWidth(0.6f)
                .aspectRatio(228f / 325f),
            bitmap = uiState.personalColorPhotoBitmap,
            isLoading = uiState.isPersonalColorAnalyzing,
            onClick = {
                openCameraSafely()
            }
        )

        if (uiState.isPersonalColorAnalyzing) {
            Text(
                text = "퍼스널 컬러 데이터를 분석하고 있어요.",
                modifier = Modifier
                    .align(Alignment.TopCenter)
                    .padding(top = 620.dp),
                color = Color.Black,
                fontSize = 13.sp,
                textAlign = TextAlign.Center
            )
        }

        if (uiState.personalColorAnalysisErrorMessage != null) {
            Text(
                text = uiState.personalColorAnalysisErrorMessage.orEmpty(),
                modifier = Modifier
                    .align(Alignment.TopCenter)
                    .padding(top = 620.dp),
                color = Color(0xFFF23636),
                fontSize = 13.sp,
                textAlign = TextAlign.Center,
                lineHeight = 20.sp
            )
        }
    }

    if (showSkipDialog) {
        PersonalColorSkipConfirmDialog(
            onDismiss = {
                showSkipDialog = false
            },
            onConfirm = {
                showSkipDialog = false
                onSkip()
            }
        )
    }
}

@Composable
private fun PersonalColorHeader(
    onBack: () -> Unit,
    onSkip: () -> Unit
) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .height(100.dp)
            .padding(horizontal = 16.dp)
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
            text = "퍼스널 컬러",
            modifier = Modifier.align(Alignment.Center),
            color = Color.Black,
            fontSize = 28.sp,
            fontWeight = FontWeight.Bold,
            textAlign = TextAlign.Center
        )

        Text(
            text = "건너뛰기",
            modifier = Modifier
                .align(Alignment.CenterEnd)
                .clickable(onClick = onSkip)
                .padding(horizontal = 4.dp, vertical = 8.dp),
            color = Color(0xFF555555),
            fontSize = 14.sp,
            fontWeight = FontWeight.Medium,
            textAlign = TextAlign.Center
        )
    }
}

@Composable
private fun PersonalColorSkipConfirmDialog(
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
private fun PersonalColorPhotoCaptureBox(
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
                CircularProgressIndicator(
                    color = Color(0xFF99DE81)
                )
            }

            bitmap != null -> {
                Image(
                    bitmap = bitmap.asImageBitmap(),
                    contentDescription = "촬영한 퍼스널 컬러 진단 사진",
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
        modifier = Modifier.size(40.dp)
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