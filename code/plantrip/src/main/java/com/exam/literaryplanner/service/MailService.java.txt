package com.exam.literaryplanner.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class MailService {

    private final JavaMailSender mailSender;

    @Value("${app.mail.from:}")
    private String from;

    public MailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendPasswordResetMail(String to, String resetLink) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo(to);

        // from을 설정하지 않으면 SMTP 계정 기본값으로 나가는 경우가 많음
        if (from != null && !from.isBlank()) {
            msg.setFrom(from);
        }

        msg.setSubject("[여행 플래너] 비밀번호 재설정 링크");
        msg.setText(
                "안녕하세요. 여행 플래너입니다.\n\n" +
                "아래 링크를 클릭하여 비밀번호를 재설정해 주세요.\n" +
                resetLink + "\n\n" +
                "※ 이 링크는 15분 동안만 유효합니다.\n" +
                "본인이 요청하지 않았다면 이 메일을 무시하셔도 됩니다.\n"
        );

        mailSender.send(msg);
    }

    public void sendFindIdMail(String to, String memberId) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo(to);
        if (from != null && !from.isBlank()) {
            msg.setFrom(from);
        }

        msg.setSubject("[여행 플래너] 아이디 안내");
        msg.setText(
                "안녕하세요. 여행 플래너입니다.\n\n" +
                "요청하신 아이디는 아래와 같습니다.\n" +
                "아이디: " + memberId + "\n\n" +
                "본인이 요청하지 않았다면 이 메일을 무시하셔도 됩니다.\n"
        );

        mailSender.send(msg);
    }
}
