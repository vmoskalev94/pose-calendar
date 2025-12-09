package com.posecalendar.release;

import com.posecalendar.platform.Platform;
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
import java.time.LocalDateTime;

/**
 * Статус релиза на конкретной платформе (Telegram, VK, Boosty, Tumblr).
 */
@Entity
@Table(
        name = "release_platforms",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_release_platform",
                        columnNames = {"release_id", "platform"}
                )
        }
)
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReleasePlatform {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Родительский релиз.
     */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "release_id", nullable = false)
    private Release release;

    /**
     * Платформа (TG, VK, Boosty, Tumblr).
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "platform", nullable = false, length = 32)
    private Platform platform;

    /**
     * Статус релиза на платформе.
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 32)
    private ReleasePlatformStatus status;

    /**
     * Запланированная дата/время публикации на платформе
     * (может отличаться от общего releaseDateTime или быть пустой).
     */
    @Column(name = "planned_date_time")
    private LocalDateTime plannedDateTime;

    /**
     * Фактическое время публикации (если уже опубликовано).
     */
    @Column(name = "published_date_time")
    private LocalDateTime publishedDateTime;

    /**
     * Локальные заметки по конкретной платформе.
     */
    @Column(name = "notes", length = 2000)
    private String notes;

    /**
     * Связанный черновик поста.
     * 0..1 на каждую платформу (ограничивается уникальным FK в PostDraft).
     */
    @OneToOne(mappedBy = "releasePlatform", fetch = FetchType.LAZY)
    private PostDraft postDraft;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;
}
