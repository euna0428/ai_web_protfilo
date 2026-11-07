package com.fitflow.clover.presentation.auth

import android.widget.Toast
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.Image
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.focus.onFocusChanged
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.PlatformTextStyle
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavController
import com.fitflow.clover.R
import com.fitflow.clover.core.component.CloverTextField
import com.fitflow.clover.core.component.CustomCheckBoxRow
import com.fitflow.clover.core.navigation.ScreenRoute

val CloverGreen = Color(0xFF99DE81)

@Composable
fun LoginMain(navController: NavController, viewModel: AuthViewModel) {
    val id by viewModel.id
    val pw by viewModel.pw
    var isPwVisible by remember { mutableStateOf(false) }

    Surface(
        modifier = Modifier.fillMaxSize(),
        color = Color.White
    ) {
        // 다시 형의 원래 구조(통짜 스크롤)로 원상복구!
        // 대신 weight 폭탄만 height로 싹 바꿨음 ㅋㅋㅋ
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(horizontal = 24.dp)
                .verticalScroll(rememberScrollState()),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {

            // 피그마 상단 여백 (알맞게 조절해!)
            Spacer(modifier = Modifier.height(100.dp))

            Image(
                painter = painterResource(id = R.drawable.frame_31),
                contentDescription = "Clover Main Logo",
                modifier = Modifier.size(287.dp)
            )

            // 로고랑 ID 입력창 사이 여백
            Spacer(modifier = Modifier.height(30.dp))

            Column(modifier = Modifier.fillMaxWidth()) {
                Text(
                    text = "ID",
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Normal,
                    color = Color.Black,
                    modifier = Modifier.padding(start = 6.dp, bottom = 4.dp)
                )

                var isIdFocused by remember { mutableStateOf(false) }
                BasicTextField(
                    value = id,
                    onValueChange = { viewModel.onIdChange(it) },
                    textStyle = TextStyle(
                        color = Color.Black,
                        fontSize = 14.sp,
                        platformStyle = PlatformTextStyle(includeFontPadding = false)
                    ),
                    singleLine = true,
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(42.dp)
                        .onFocusChanged { isIdFocused = it.isFocused }
                        .border(
                            border = BorderStroke(
                                width = 1.dp,
                                color = if (isIdFocused) Color.Black else Color.LightGray
                            ),
                            shape = RoundedCornerShape(5.dp)
                        ),
                    decorationBox = { innerTextField ->
                        Box(
                            modifier = Modifier
                                .fillMaxSize()
                                .padding(horizontal = 12.dp),
                            contentAlignment = Alignment.CenterStart
                        ) {
                            innerTextField()
                        }
                    }
                )
            }

            Spacer(modifier = Modifier.height(15.dp))

            // Password 입력란 영역
            Column(modifier = Modifier.fillMaxWidth()) {
                Text(
                    text = "Password",
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Normal,
                    color = Color.Black,
                    modifier = Modifier.padding(start = 6.dp, bottom = 4.dp)
                )

                var isPwFocused by remember { mutableStateOf(false) }
                BasicTextField(
                    value = pw,
                    onValueChange = { viewModel.onPwChange(it) },
                    visualTransformation = if (isPwVisible) androidx.compose.ui.text.input.VisualTransformation.None else PasswordVisualTransformation(),
                    textStyle = TextStyle(
                        color = Color.Black,
                        fontSize = 14.sp,
                        platformStyle = PlatformTextStyle(includeFontPadding = false)
                    ),
                    singleLine = true,
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(42.dp)
                        .onFocusChanged { isPwFocused = it.isFocused }
                        .border(
                            border = BorderStroke(
                                width = 1.dp,
                                color = if (isPwFocused) Color.Black else Color.LightGray
                            ),
                            shape = RoundedCornerShape(5.dp)
                        ),
                    decorationBox = { innerTextField ->
                        Row(
                            modifier = Modifier
                                .fillMaxSize()
                                .padding(horizontal = 12.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Box(modifier = Modifier.weight(1f), contentAlignment = Alignment.CenterStart) {
                                innerTextField()
                            }

                            IconButton(
                                onClick = { isPwVisible = !isPwVisible },
                                modifier = Modifier.size(24.dp)
                            ) {
                                Icon(
                                    painter = painterResource(
                                        id = if (isPwVisible) R.drawable.eye else R.drawable.eyeinvisibleoutlined
                                    ),
                                    contentDescription = "비밀번호 보이기 토글",
                                    modifier = Modifier.size(20.dp),
                                    tint = Color.Gray
                                )
                            }
                        }
                    }
                )
            }

            // PW창이랑 로그인 버튼 사이 여백
            Spacer(modifier = Modifier.height(35.dp))

            Button(
                onClick = {
                    if (id.isNotBlank() && pw.isNotBlank()) {
                        val isFirstLogin = true

                        viewModel.login(
                            onSuccess = { isFirstLogin ->
                                if (isFirstLogin) {
                                    navController.navigate(ScreenRoute.BodyAnalysis.route) {
                                        popUpTo("login") { inclusive = true }
                                        launchSingleTop = true
                                    }
                                } else {
                                    navController.navigate(ScreenRoute.Main.route) {
                                        popUpTo("login") { inclusive = true }
                                        launchSingleTop = true
                                    }
                                }
                            },
                            onError = {
                                // TODO: 로그인 실패 시 에러 메시지 띄우기 (나중에 처리)
                            }
                        )
                    }
                },
                enabled = true,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(52.dp),
                colors = ButtonDefaults.buttonColors(containerColor = CloverGreen),
                shape = RoundedCornerShape(5.dp),
                elevation = null
            ) {
                Text(
                    text = "로그인",
                    color = Color.Black,
                    fontSize = 24.sp,
                    fontWeight = FontWeight.Medium
                )
            }

            // 로그인 버튼이랑 하단 텍스트 사이 여백
            Spacer(modifier = Modifier.height(20.dp))

            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 6.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "아이디/비밀번호 찾기",
                    modifier = Modifier.clickable { navController.navigate("find_id_pw") },
                    color = Color.Gray,
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Normal
                )
                Text(
                    text = "아직 회원이 아니신가요?",
                    modifier = Modifier.clickable { navController.navigate("join_terms") },
                    color = Color.Gray,
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Normal,
                    textAlign = TextAlign.End
                )
            }

            // 맨 밑에 하단 여백 넉넉하게
            Spacer(modifier = Modifier.height(100.dp))
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun JoinDetail(navController: NavController, viewModel: AuthViewModel) {
    var name by remember { mutableStateOf("") }

    var isPwVisible by remember { mutableStateOf(false) }
    var isPwConfirmVisible by remember { mutableStateOf(false) }

    // 💡 개별 중복 검사용 상태 변수들
    var id by remember { mutableStateOf("") }
    var isIdChecked by remember { mutableStateOf(false) }
    var isIdAvailable by remember { mutableStateOf(false) }

    var email by remember { mutableStateOf("") }
    var isEmailChecked by remember { mutableStateOf(false) }
    var isEmailAvailable by remember { mutableStateOf(false) }

    var nickname by remember { mutableStateOf("") }
    var isNicknameChecked by remember { mutableStateOf(false) }
    var isNicknameAvailable by remember { mutableStateOf(false) }

    var pw by remember { mutableStateOf("") }
    var pwConfirm by remember { mutableStateOf("") }

    var gender by remember { mutableStateOf("MALE") }

    // 다이얼로그 띄우기용 상태 변수
    var showEmailSentDialog by remember { mutableStateOf(false) }

    // 🌟 가입 완료 버튼 활성화 조건 (중복확인 3대장 다 통과해야 됨!)
    val isJoinEnabled = name.isNotBlank() &&
            id.isNotBlank() && isIdChecked && isIdAvailable &&
            email.isNotBlank() && isEmailChecked && isEmailAvailable &&
            nickname.isNotBlank() && isNicknameChecked && isNicknameAvailable &&
            pw.isNotBlank() && pwConfirm.isNotBlank() && (pw == pwConfirm)

    val context = LocalContext.current

    Scaffold(
        containerColor = Color.White
    ) { paddingValues ->
        // 팝업창 (다이얼로그) 띄우는 로직
        if (showEmailSentDialog) {
            AlertDialog(
                onDismissRequest = { /* 바깥 영역 터치로 꺼지는 거 방지 */ },
                containerColor = Color.White,
                title = {
                    Text(text = "가입 신청 완료", fontWeight = FontWeight.Bold)
                },
                text = {
                    Text(text = "입력하신 이메일로 인증 링크가 발송되었습니다.\n이메일 확인 후 로그인해주세요.")
                },
                confirmButton = {
                    TextButton(
                        onClick = {
                            showEmailSentDialog = false
                            // 팝업 확인 누르면 로그인 화면으로 쫓아냄!
                            navController.navigate("login") {
                                popUpTo("login") { inclusive = true }
                            }
                        }
                    ) {
                        Text("확인", color = Color.Black, fontWeight = FontWeight.Bold)
                    }
                }
            )
        }

        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .padding(horizontal = 24.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            // 상단 스크롤 폼 영역
            Column(
                modifier = Modifier
                    .weight(1f)
                    .fillMaxWidth()
                    .verticalScroll(rememberScrollState()),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Spacer(modifier = Modifier.height(60.dp))

                Image(
                    painter = painterResource(id = R.drawable.frame_31),
                    contentDescription = null,
                    modifier = Modifier.size(200.dp)
                )

                Spacer(modifier = Modifier.height(30.dp))

                Column(modifier = Modifier.width(309.dp), horizontalAlignment = Alignment.CenterHorizontally) {
                    // 1. 이름
                    CloverTextField(value = name, onValueChange = { name = it }, label = "이름", modifier = Modifier.height(40.dp))
                    Spacer(modifier = Modifier.height(15.dp))

                    Column(modifier = Modifier.fillMaxWidth()) {
                        Text(
                            text = "성별",
                            fontSize = 12.sp,
                            color = Color.Black,
                            modifier = Modifier.padding(start = 6.dp, bottom = 4.dp)
                        )
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                RadioButton(
                                    selected = (gender == "MALE"),
                                    onClick = { gender = "MALE" },
                                    colors = RadioButtonDefaults.colors(selectedColor = CloverGreen)
                                )
                                Text(text = "남성", fontSize = 14.sp)
                            }
                            Spacer(modifier = Modifier.width(16.dp))
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                RadioButton(
                                    selected = (gender == "FEMALE"),
                                    onClick = { gender = "FEMALE" },
                                    colors = RadioButtonDefaults.colors(selectedColor = CloverGreen)
                                )
                                Text(text = "여성", fontSize = 14.sp)
                            }
                        }
                    }
                    Spacer(modifier = Modifier.height(15.dp))

                    // 2. ID (중복확인)
                    Row(modifier = Modifier.fillMaxWidth(), verticalAlignment = Alignment.CenterVertically) {
                        CloverTextField(
                            value = id,
                            onValueChange = { id = it; isIdChecked = false; isIdAvailable = false },
                            label = "ID",
                            modifier = Modifier.weight(1f).height(40.dp)
                        )
                        Spacer(modifier = Modifier.width(7.dp))

                        if (isIdChecked && isIdAvailable) {
                            Image(
                                painter = painterResource(id = R.drawable.check),
                                contentDescription = "사용 가능",
                                modifier = Modifier.size(28.dp)
                            )
                        } else {
                            Button(
                                onClick = {
                                    // TODO: 나중에 여기서 ID 중복검사 API(Swagger) 호출!
                                    isIdChecked = true
                                    isIdAvailable = id.isNotBlank() && id != "test"
                                },
                                colors = ButtonDefaults.buttonColors(
                                    containerColor = if (isIdChecked && !isIdAvailable) Color(0xFFFF6B6B) else CloverGreen
                                ),
                                shape = RoundedCornerShape(5.dp),
                                elevation = null,
                                modifier = Modifier.width(60.dp).height(40.dp),
                                contentPadding = PaddingValues(0.dp)
                            ) {
                                Text(
                                    text = if (isIdChecked && !isIdAvailable) "불가" else "중복확인",
                                    color = if (isIdChecked && !isIdAvailable) Color.White else Color.Black,
                                    fontSize = 12.sp,
                                    fontWeight = FontWeight.Medium
                                )
                            }
                        }
                    }

                    if (isIdChecked && !isIdAvailable) {
                        Text(
                            text = "이미 사용 중이거나 유효하지 않은 아이디입니다.",
                            color = Color.Red,
                            fontSize = 12.sp,
                            modifier = Modifier.fillMaxWidth().padding(start = 4.dp, top = 4.dp)
                        )
                    }

                    Spacer(modifier = Modifier.height(15.dp))

                    // 3. 비밀번호
                    // 🔒 3. 비밀번호 (프라이빗 모드 ON!)
                    Column(modifier = Modifier.fillMaxWidth()) {
                        Text(
                            text = "Password",
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Normal,
                            color = Color.Black,
                            modifier = Modifier.padding(start = 6.dp, bottom = 4.dp)
                        )
                        var isPwFocused by remember { mutableStateOf(false) }
                        BasicTextField(
                            value = pw,
                            onValueChange = { pw = it },
                            visualTransformation = if (isPwVisible) VisualTransformation.None else PasswordVisualTransformation(),
                            textStyle = TextStyle(color = Color.Black, fontSize = 14.sp, platformStyle = PlatformTextStyle(includeFontPadding = false)),
                            singleLine = true,
                            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(40.dp) // 다른 칸들이랑 똑같이 40dp로 맞춤!
                                .onFocusChanged { isPwFocused = it.isFocused }
                                .border(
                                    border = BorderStroke(1.dp, if (isPwFocused) Color.Black else Color.LightGray),
                                    shape = RoundedCornerShape(5.dp)
                                ),
                            decorationBox = { innerTextField ->
                                Row(
                                    modifier = Modifier.fillMaxSize().padding(horizontal = 12.dp),
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Box(modifier = Modifier.weight(1f), contentAlignment = Alignment.CenterStart) { innerTextField() }
                                    IconButton(onClick = { isPwVisible = !isPwVisible }, modifier = Modifier.size(24.dp)) {
                                        Icon(
                                            painter = painterResource(id = if (isPwVisible) R.drawable.eye else R.drawable.eyeinvisibleoutlined),
                                            contentDescription = "비밀번호 보이기",
                                            modifier = Modifier.size(20.dp),
                                            tint = Color.Gray
                                        )
                                    }
                                }
                            }
                        )
                    }

                    Spacer(modifier = Modifier.height(15.dp))

                    // 🔒 3-1. 비밀번호 재입력 (여기도 프라이빗!)
                    Column(modifier = Modifier.fillMaxWidth()) {
                        Text(
                            text = "Password 재입력",
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Normal,
                            color = Color.Black,
                            modifier = Modifier.padding(start = 6.dp, bottom = 4.dp)
                        )
                        var isPwConfirmFocused by remember { mutableStateOf(false) }
                        BasicTextField(
                            value = pwConfirm,
                            onValueChange = { pwConfirm = it },
                            visualTransformation = if (isPwConfirmVisible) VisualTransformation.None else PasswordVisualTransformation(),
                            textStyle = TextStyle(color = Color.Black, fontSize = 14.sp, platformStyle = PlatformTextStyle(includeFontPadding = false)),
                            singleLine = true,
                            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(40.dp)
                                .onFocusChanged { isPwConfirmFocused = it.isFocused }
                                .border(
                                    border = BorderStroke(1.dp, if (isPwConfirmFocused) Color.Black else Color.LightGray),
                                    shape = RoundedCornerShape(5.dp)
                                ),
                            decorationBox = { innerTextField ->
                                Row(
                                    modifier = Modifier.fillMaxSize().padding(horizontal = 12.dp),
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Box(modifier = Modifier.weight(1f), contentAlignment = Alignment.CenterStart) { innerTextField() }
                                    IconButton(onClick = { isPwConfirmVisible = !isPwConfirmVisible }, modifier = Modifier.size(24.dp)) {
                                        Icon(
                                            painter = painterResource(id = if (isPwConfirmVisible) R.drawable.eye else R.drawable.eyeinvisibleoutlined),
                                            contentDescription = "비밀번호 보이기",
                                            modifier = Modifier.size(20.dp),
                                            tint = Color.Gray
                                        )
                                    }
                                }
                            }
                        )
                    }

                    // 🎯 비밀번호 일치/불일치 텍스트
                    if (pw.isNotEmpty() && pwConfirm.isNotEmpty()) {
                        Text(
                            text = if (pw == pwConfirm) "비밀번호가 일치합니다." else "비밀번호가 일치하지 않습니다.",
                            color = if (pw == pwConfirm) Color(0xFF4CAF50) else Color.Red,
                            fontSize = 12.sp,
                            modifier = Modifier.fillMaxWidth().padding(start = 4.dp, top = 4.dp)
                        )
                    }

                    // 4. 이메일 (타이머 삭제! 중복확인 버튼으로 통일)
                    Row(modifier = Modifier.fillMaxWidth(), verticalAlignment = Alignment.CenterVertically) {
                        CloverTextField(
                            value = email,
                            onValueChange = { email = it; isEmailChecked = false; isEmailAvailable = false },
                            label = "이메일",
                            modifier = Modifier.weight(1f).height(40.dp)
                        )
                        Spacer(modifier = Modifier.width(7.dp))

                        if (isEmailChecked && isEmailAvailable) {
                            Image(
                                painter = painterResource(id = R.drawable.check),
                                contentDescription = "사용 가능",
                                modifier = Modifier.size(28.dp)
                            )
                        } else {
                            Button(
                                onClick = {
                                    // TODO: 나중에 여기서 이메일 중복검사 API 호출!
                                    isEmailChecked = true
                                    isEmailAvailable = email.isNotBlank() && email != "test@test.com"
                                },
                                enabled = email.isNotBlank(),
                                colors = ButtonDefaults.buttonColors(
                                    containerColor = if (isEmailChecked && !isEmailAvailable) Color(0xFFFF6B6B)
                                    else if (email.isNotBlank()) CloverGreen else Color(0xFFC8E6C9)
                                ),
                                shape = RoundedCornerShape(5.dp),
                                elevation = null,
                                modifier = Modifier.width(60.dp).height(40.dp),
                                contentPadding = PaddingValues(0.dp)
                            ) {
                                Text(
                                    text = if (isEmailChecked && !isEmailAvailable) "불가" else "중복확인",
                                    color = if (isEmailChecked && !isEmailAvailable) Color.White
                                    else if (email.isNotBlank()) Color.Black else Color.Gray,
                                    fontSize = 12.sp,
                                    fontWeight = FontWeight.Medium
                                )
                            }
                        }
                    }

                    if (isEmailChecked && !isEmailAvailable) {
                        Text(
                            text = "이미 가입된 이메일입니다.",
                            color = Color.Red,
                            fontSize = 12.sp,
                            modifier = Modifier.fillMaxWidth().padding(start = 4.dp, top = 4.dp)
                        )
                    }

                    Spacer(modifier = Modifier.height(15.dp))

                    // 5. 닉네임 (중복확인)
                    Row(modifier = Modifier.fillMaxWidth(), verticalAlignment = Alignment.CenterVertically) {
                        CloverTextField(
                            value = nickname,
                            onValueChange = { nickname = it; isNicknameChecked = false; isNicknameAvailable = false },
                            label = "닉네임",
                            modifier = Modifier.weight(1f).height(40.dp)
                        )
                        Spacer(modifier = Modifier.width(7.dp))

                        if (isNicknameChecked && isNicknameAvailable) {
                            Image(
                                painter = painterResource(id = R.drawable.check),
                                contentDescription = "사용 가능",
                                modifier = Modifier.size(28.dp)
                            )
                        } else {
                            Button(
                                onClick = {
                                    // TODO: 나중에 여기서 닉네임 중복검사 API 호출!
                                    isNicknameChecked = true
                                    isNicknameAvailable = nickname.isNotBlank() && nickname != "test"
                                },
                                enabled = nickname.isNotBlank(),
                                colors = ButtonDefaults.buttonColors(
                                    containerColor = if (isNicknameChecked && !isNicknameAvailable) Color(0xFFFF6B6B)
                                    else if (nickname.isNotBlank()) CloverGreen else Color(0xFFC8E6C9)
                                ),
                                shape = RoundedCornerShape(5.dp),
                                elevation = null,
                                modifier = Modifier.width(60.dp).height(40.dp),
                                contentPadding = PaddingValues(0.dp)
                            ) {
                                Text(
                                    text = if (isNicknameChecked && !isNicknameAvailable) "불가" else "중복확인",
                                    color = if (isNicknameChecked && !isNicknameAvailable) Color.White
                                    else if (nickname.isNotBlank()) Color.Black else Color.Gray,
                                    fontSize = 12.sp,
                                    fontWeight = FontWeight.Medium
                                )
                            }
                        }
                    }

                    if (isNicknameChecked && !isNicknameAvailable) {
                        Text(
                            text = "이미 사용 중인 닉네임입니다.",
                            color = Color.Red,
                            fontSize = 12.sp,
                            modifier = Modifier.fillMaxWidth().padding(start = 4.dp, top = 4.dp)
                        )
                    }

                    Spacer(modifier = Modifier.height(45.dp))

                    Text(
                        text = "이미 계정이 있으신가요?",
                        fontSize = 16.sp,
                        color = Color.Black,
                        modifier = Modifier.clickable { navController.navigate("login") { popUpTo("login") { inclusive = true } } }
                    )

                    Spacer(modifier = Modifier.height(40.dp))
                }
            }

            // 🎯 하단 버튼 (모든 검사 통과 시 활성화)
            Spacer(modifier = Modifier.height(16.dp))
            Button(
                onClick = {
                    if (isJoinEnabled) {
                        viewModel.signUp(
                            loginId = id,
                            password = pw,
                            name = name,
                            nickname = nickname,
                            email = email,
                            gender = gender,
                            onSuccess = {
                                // 통신 성공 시 이메일 인증 안내 다이얼로그 띄우기
                                showEmailSentDialog = true
                            },
                            onError = {
                                Toast.makeText(context, "회원가입 실패! Android Studio Logcat을 확인하세요.", Toast.LENGTH_SHORT).show()                            }
                        )
                    }
                },
                enabled = isJoinEnabled,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(63.dp),
                colors = ButtonDefaults.buttonColors(
                    containerColor = CloverGreen,
                    disabledContainerColor = Color(0xFFC8E6C9)
                ),
                shape = RoundedCornerShape(5.dp),
                elevation = null
            ) {
                Text(
                    text = "완료",
                    color = Color.Black,
                    fontWeight = FontWeight.Medium,
                    fontSize = 24.sp
                )
            }
            Spacer(modifier = Modifier.height(16.dp))
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun JoinTerms(navController: NavController) {
    var term1 by remember { mutableStateOf(false) }
    var term2 by remember { mutableStateOf(false) }
    var term3 by remember { mutableStateOf(false) }
    val isAllChecked = term1 && term2 && term3

    Scaffold(
        containerColor = Color.White,
        topBar = {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .statusBarsPadding()
                    .padding(top = 15.dp)
                    .height(48.dp)
            ) {
                IconButton(
                    onClick = { navController.popBackStack() },
                    modifier = Modifier
                        .padding(start = 24.dp)
                        .size(40.dp)
                        .align(Alignment.CenterStart)
                ) {
                    Image(
                        painter = painterResource(id = R.drawable.back),
                        contentDescription = "뒤로가기",
                        modifier = Modifier.fillMaxSize()
                    )
                }

                Text(
                    text = "약관 동의",
                    fontSize = 28.sp,
                    fontWeight = FontWeight.Medium,
                    color = Color.Black,
                    modifier = Modifier.align(Alignment.Center)
                )
            }
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(horizontal = 24.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Column(
                modifier = Modifier
                    .weight(1f)
                    .fillMaxWidth()
                    .verticalScroll(rememberScrollState()),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Spacer(modifier = Modifier.height(60.dp))

                Image(
                    painter = painterResource(id = R.drawable.frame_31),
                    contentDescription = null,
                    modifier = Modifier.size(180.dp)
                )

                Spacer(modifier = Modifier.height(12.dp))

                Text(
                    text = "회원님 환영합니다!",
                    fontWeight = FontWeight.Medium,
                    fontSize = 28.sp,
                    color = Color.Black
                )

                Spacer(modifier = Modifier.height(50.dp))

                CustomCheckBoxRow("약관 전체 동의", isAllChecked, { val t = !isAllChecked; term1 = t; term2 = t; term3 = t })
                HorizontalDivider(modifier = Modifier.padding(vertical = 12.dp), thickness = 1.dp, color = Color.LightGray)

                CustomCheckBoxRow("이용약관 동의(필수)", term1, { term1 = it }, { navController.navigate("term_detail_1") })
                CustomCheckBoxRow("개인정보 수집 및 이용동의(필수)", term2, { term2 = it }, { navController.navigate("term_detail_2") })
                CustomCheckBoxRow("가입 시 알림 동의(선택)", term3, { term3 = it })

                Spacer(modifier = Modifier.height(40.dp))
            }

            Spacer(modifier = Modifier.height(16.dp))
            Button(
                onClick = { navController.navigate("join_detail") },
                enabled = term1 && term2,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(63.dp),
                colors = ButtonDefaults.buttonColors(
                    containerColor = CloverGreen,
                    disabledContainerColor = Color(0xFFC8E6C9)
                ),
                shape = RoundedCornerShape(5.dp),
                elevation = null
            ) {
                Text(
                    text = "다음",
                    color = Color.Black,
                    fontWeight = FontWeight.Medium,
                    fontSize = 24.sp
                )
            }
            Spacer(modifier = Modifier.height(16.dp))
        }
    }
}