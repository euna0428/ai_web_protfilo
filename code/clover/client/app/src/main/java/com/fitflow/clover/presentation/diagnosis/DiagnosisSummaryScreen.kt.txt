package com.fitflow.clover.presentation.diagnosis

import android.graphics.Bitmap
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
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
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
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
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun DiagnosisSummaryScreen(
    viewModel: DiagnosisViewModel,
    onBack: () -> Unit,
    onMoveToMain: () -> Unit
) {
    val uiState = viewModel.uiState.value
    val scrollState = rememberScrollState()

    var showSkipDialog by remember {
        mutableStateOf(false)
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.White)
            .systemBarsPadding()
            .padding(bottom = 30.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        SummaryHeader(
            onBack = onBack,
            onSkip = {
                showSkipDialog = true
            }
        )

        Column(
            modifier = Modifier
                .weight(1f)
                .verticalScroll(scrollState)
                .padding(horizontal = 24.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Spacer(modifier = Modifier.height(12.dp))

            Text(
                text = "${uiState.userDisplayName}님의 진단 결과를 정리했어요.",
                color = Color.Black,
                fontSize = 19.sp,
                fontWeight = FontWeight.Bold,
                textAlign = TextAlign.Center,
                lineHeight = 27.sp
            )

            Spacer(modifier = Modifier.height(8.dp))

            Text(
                text = "체형 분석과 퍼스널 컬러 결과를 기반으로 메인 추천 상품에 반영됩니다.",
                color = Color(0xFF555555),
                fontSize = 13.sp,
                textAlign = TextAlign.Center,
                lineHeight = 20.sp
            )

            Spacer(modifier = Modifier.height(24.dp))

            SummaryCard(
                title = "기본 정보"
            ) {
                SummaryRow(
                    label = "성별",
                    value = uiState.selectedGender?.label ?: "미선택"
                )

                SummaryRow(
                    label = "키",
                    value = uiState.selectedHeightCm?.let { height ->
                        "$height cm"
                    } ?: "미선택"
                )

                SummaryRow(
                    label = "몸무게",
                    value = uiState.selectedWeightKg?.let { weight ->
                        "$weight kg"
                    } ?: "미선택"
                )
            }

            Spacer(modifier = Modifier.height(14.dp))

            SummaryCard(
                title = "체형 분석"
            ) {
                SummaryRow(
                    label = "촬영 상태",
                    value = if (uiState.isBodyPhotoCompleted) {
                        "전면 / 옆면 완료"
                    } else {
                        "미완료"
                    }
                )

                SummaryRow(
                    label = "체형 결과",
                    value = formatBodyType(uiState.bodyResult?.bodyType)
                )

                Spacer(modifier = Modifier.height(12.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    CapturedPhotoPreview(
                        title = "전면",
                        bitmap = uiState.frontBodyPhotoBitmap,
                        modifier = Modifier.weight(1f)
                    )

                    CapturedPhotoPreview(
                        title = "옆면",
                        bitmap = uiState.sideBodyPhotoBitmap,
                        modifier = Modifier.weight(1f)
                    )
                }

                uiState.bodyResult?.let { bodyResult ->
                    Spacer(modifier = Modifier.height(14.dp))

                    Text(
                        text = bodyResult.title,
                        color = Color.Black,
                        fontSize = 15.sp,
                        fontWeight = FontWeight.Bold,
                        textAlign = TextAlign.Start,
                        lineHeight = 21.sp,
                        modifier = Modifier.fillMaxWidth()
                    )

                    Spacer(modifier = Modifier.height(10.dp))

                    Text(
                        text = bodyResult.description,
                        color = Color(0xFF555555),
                        fontSize = 12.sp,
                        lineHeight = 18.sp,
                        modifier = Modifier.fillMaxWidth()
                    )

                    Spacer(modifier = Modifier.height(8.dp))

                    Text(
                        text = bodyResult.recommendMessage,
                        color = Color(0xFF5FAE4F),
                        fontSize = 12.sp,
                        fontWeight = FontWeight.SemiBold,
                        lineHeight = 18.sp,
                        modifier = Modifier.fillMaxWidth()
                    )
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            SummaryCard(
                title = "퍼스널 컬러"
            ) {
                SummaryRow(
                    label = "촬영 상태",
                    value = if (uiState.personalColorPhotoBitmap != null) {
                        "완료"
                    } else {
                        "미완료"
                    }
                )

                SummaryRow(
                    label = "컬러 결과",
                    value = formatPersonalColor(
                        personalColor = uiState.personalColorResult?.personalColor
                    )
                )

                Spacer(modifier = Modifier.height(12.dp))

                CapturedPhotoPreview(
                    title = "얼굴",
                    bitmap = uiState.personalColorPhotoBitmap,
                    modifier = Modifier
                        .fillMaxWidth(0.48f)
                        .align(Alignment.CenterHorizontally)
                )

                uiState.personalColorResult?.let { personalColorResult ->
                    Spacer(modifier = Modifier.height(14.dp))

                    Text(
                        text = personalColorResult.resultTitle,
                        color = Color.Black,
                        fontSize = 15.sp,
                        fontWeight = FontWeight.Bold,
                        textAlign = TextAlign.Start,
                        lineHeight = 21.sp,
                        modifier = Modifier.fillMaxWidth()
                    )

                    Spacer(modifier = Modifier.height(10.dp))

                    Text(
                        text = personalColorResult.resultRecommend,
                        color = Color(0xFF5FAE4F),
                        fontSize = 12.sp,
                        fontWeight = FontWeight.SemiBold,
                        lineHeight = 18.sp,
                        modifier = Modifier.fillMaxWidth()
                    )
                }
            }

            Spacer(modifier = Modifier.height(24.dp))
        }

        SummaryBottomButton(
            modifier = Modifier
                .fillMaxWidth(0.85f)
                .height(62.dp),
            text = "메인으로 이동",
            onClick = onMoveToMain
        )
    }

    if (showSkipDialog) {
        SummarySkipConfirmDialog(
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
private fun SummaryHeader(
    onBack: () -> Unit,
    onSkip: () -> Unit
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
            SummaryChevronLeftIcon()
        }

        Text(
            text = "진단 요약",
            modifier = Modifier.align(Alignment.Center),
            color = Color.Black,
            fontSize = 26.sp,
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
private fun SummarySkipConfirmDialog(
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
private fun SummaryCard(
    title: String,
    content: @Composable ColumnScope.() -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .background(
                color = Color.White,
                shape = RoundedCornerShape(12.dp)
            )
            .border(
                width = 1.dp,
                color = Color.Black,
                shape = RoundedCornerShape(12.dp)
            )
            .padding(horizontal = 18.dp, vertical = 16.dp)
    ) {
        Text(
            text = title,
            color = Color.Black,
            fontSize = 16.sp,
            fontWeight = FontWeight.Bold
        )

        Spacer(modifier = Modifier.height(12.dp))

        content()
    }
}

@Composable
private fun SummaryRow(
    label: String,
    value: String
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 5.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(
            text = label,
            color = Color(0xFF666666),
            fontSize = 13.sp,
            modifier = Modifier.width(86.dp)
        )

        Text(
            text = value,
            color = Color.Black,
            fontSize = 14.sp,
            fontWeight = FontWeight.Medium,
            lineHeight = 20.sp,
            modifier = Modifier.weight(1f)
        )
    }
}

@Composable
private fun CapturedPhotoPreview(
    title: String,
    bitmap: Bitmap?,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .aspectRatio(0.72f)
                .border(
                    width = 1.dp,
                    color = Color.Black
                )
                .background(Color(0xFFF4F4F4)),
            contentAlignment = Alignment.Center
        ) {
            if (bitmap != null) {
                Image(
                    bitmap = bitmap.asImageBitmap(),
                    contentDescription = "$title 촬영 사진",
                    modifier = Modifier.fillMaxSize(),
                    contentScale = ContentScale.Crop
                )
            } else {
                Text(
                    text = "미촬영",
                    color = Color(0xFF777777),
                    fontSize = 12.sp,
                    textAlign = TextAlign.Center
                )
            }
        }

        Spacer(modifier = Modifier.height(6.dp))

        Text(
            text = title,
            color = Color.Black,
            fontSize = 12.sp,
            textAlign = TextAlign.Center
        )
    }
}

@Composable
private fun SummaryBottomButton(
    modifier: Modifier,
    text: String,
    onClick: () -> Unit
) {
    Box(
        modifier = modifier
            .background(
                color = Color(0xFF99DE81),
                shape = RoundedCornerShape(8.dp)
            )
            .border(
                width = 1.dp,
                color = Color.Black,
                shape = RoundedCornerShape(8.dp)
            )
            .clickable(onClick = onClick),
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

@Composable
private fun SummaryChevronLeftIcon() {
    Canvas(
        modifier = Modifier.size(24.dp)
    ) {
        val strokeWidth = 2.dp.toPx()

        drawLine(
            color = Color.Black,
            start = Offset(
                x = size.width * 0.7f,
                y = size.height * 0.1f
            ),
            end = Offset(
                x = size.width * 0.3f,
                y = size.height * 0.5f
            ),
            strokeWidth = strokeWidth,
            cap = StrokeCap.Round
        )

        drawLine(
            color = Color.Black,
            start = Offset(
                x = size.width * 0.3f,
                y = size.height * 0.5f
            ),
            end = Offset(
                x = size.width * 0.7f,
                y = size.height * 0.9f
            ),
            strokeWidth = strokeWidth,
            cap = StrokeCap.Round
        )
    }
}

private fun formatBodyType(
    bodyType: String?
): String {
    return when (bodyType) {
        "LEAN_COLUMN" -> "마른 직선형"
        "APPLE" -> "사과형"
        "INVERTED_TRIANGLE" -> "역삼각형"
        "PEAR" -> "배형"
        "HOUR_GLASS" -> "모래시계형"
        "RECTANGLE" -> "직사각형"
        else -> "미진단"
    }
}

private fun formatPersonalColor(
    personalColor: String?
): String {
    return when (personalColor) {
        "SPRING_WARM" -> "봄 웜톤 (Spring Warm)"
        "SUMMER_COOL" -> "여름 쿨톤 (Summer Cool)"
        "AUTUMN_WARM" -> "가을 웜톤 (Autumn Warm)"
        "WINTER_COOL" -> "겨울 쿨톤 (Winter Cool)"
        else -> "미진단"
    }
}