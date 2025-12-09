package com.posecalendar.release;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.Instant;

/**
 * Черновик поста для конкретного ReleasePlatform.
 */
@Entity
@Table(
        name = "post_drafts",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_post_draft_release_platform",
                        columnNames = {"release_platform_id"}
                )
        }
)
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostDraft {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Платформа, к которой относится черновик.
     */
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "release_platform_id", nullable = false, unique = true)
    private ReleasePlatform releasePlatform;

    /**
     * Заголовок поста (может быть пустым, если платформа не требует).
     */
    @Column(name = "title", length = 255)
    private String title;

    /**
     * Основной текст поста.
     * Без ограничения длины — мапится на TEXT/CLOB.
     */
    @Lob
    @Column(name = "body")
    private String body;

    /**
     * Хэштеги для поста (сырым текстом).
     */
    @Column(name = "hashtags", length = 2000)
    private String hashtags;

    /**
     * Язык поста (например, "ru", "en").
     */
    @Column(name = "language", length = 32)
    private String language;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;
}
