package com.bu.jichulmate.repository;

import com.bu.jichulmate.domain.Attachment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AttachmentRepository extends JpaRepository<Attachment, Long> {

    List<Attachment> findByRefTableAndRefId(String refTable, Long refId);

    List<Attachment> findByRefTableAndRefIdOrderByFileIdAsc(String refTable, Long refId);

    void deleteByRefTableAndRefId(String refTable, Long refId);
}