package com.posecalendar.pack;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.Instant;
import java.util.UUID;

/**
 * Файл, принадлежащий паку.
 * <p>
 * В БД хранится только метаинформация + storagePath.
 * Сам файл лежит в файловом хранилище (Local/S3/Postgres и т.п.).
 */
@Entity
@Table(name = "pack_files")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PackFile {

    @Id
    @GeneratedValue
    @Column(name = "id", nullable = false, updatable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "pack_id", nullable = false)
    private Pack pack;

    @Enumerated(EnumType.STRING)
    @Column(name = "file_type", nullable = false, length = 32)
    private PackFileType fileType;

    /**
     * Относительный путь / ключ файла в хранилище.
     * Например: users/{userId}/packs/{packId}/COVER/uuid.png
     */
    @Column(name = "storage_path", nullable = false, length = 512)
    private String storagePath;

    /**
     * Оригинальное имя файла, которое загрузил пользователь.
     */
    @Column(name = "original_filename", nullable = false, length = 255)
    private String originalFilename;

    /**
     * Content-Type (MIME-тип) файла, если известен.
     */
    @Column(name = "content_type", length = 255)
    private String contentType;

    /**
     * Размер файла в байтах.
     */
    @Column(name = "size_bytes", nullable = false)
    private long sizeBytes;

    /**
     * Время создания записи в БД.
     */
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;
}
