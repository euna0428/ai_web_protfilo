package com.bu.jichulmate.service;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class MailService {

    private final JavaMailSender mailSender;

    // 기존 코드 - 건드리지 않음
    public void sendPasswordResetMail(String to, String resetUrl) {
        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(to);
        message.setSubject("[지출메이트] 비밀번호 재설정 안내");
        message.setText(
                "안녕하세요. 지출메이트입니다.\n\n" +
                        "비밀번호 재설정을 요청하셨습니다.\n" +
                        "아래 링크를 눌러 새 비밀번호를 설정해 주세요.\n\n" +
                        resetUrl + "\n\n" +
                        "해당 링크는 30분 동안만 사용할 수 있습니다.\n" +
                        "본인이 요청하지 않았다면 이 메일을 무시해 주세요.\n\n" +
                        "감사합니다.\n" +
                        "지출메이트 드림"
        );

        mailSender.send(message);
    }

    // 추가 - 판매자 등록 인증코드 발송
    private final Map<String, String> codeStore = new ConcurrentHashMap<>();

    public void sendVerificationCode(String to) {
        String code = String.valueOf((int)(Math.random() * 900000) + 100000);
        codeStore.put(to, code);

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("[지출메이트] 판매자 등록 이메일 인증코드");
        message.setText(
                "안녕하세요. 지출메이트입니다.\n\n" +
                        "판매자 등록 이메일 인증코드입니다.\n\n" +
                        "인증코드: " + code + "\n\n" +
                        "5분 이내에 입력해 주세요.\n\n" +
                        "감사합니다.\n" +
                        "지출메이트 드림"
        );
        mailSender.send(message);
    }

    public boolean verifyCode(String email, String code) {
        String stored = codeStore.get(email);
        if (stored != null && stored.equals(code)) {
            codeStore.remove(email);
            return true;
        }
        return false;
    }
}