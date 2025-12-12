package com.posecalendar.pack;

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
 * Статус пака на конкретной платформе (Telegram, VK, Boosty, Tumblr).
 */
@Entity
@Table(
        name = "pack_platforms",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_pack_platform",
                        columnNames = {"pack_id", "platform"}
                )
        }
)
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PackPlatform {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Пак, к которому относится эта платформа.
     */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "pack_id", nullable = false)
    private Pack pack;

    /**
     * Платформа публикации (TELEGRAM, VK, BOOSTY, TUMBLR).
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "platform", nullable = false, length = 32)
    private Platform platform;

    /**
     * Статус публикации на платформе.
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 32)
    private PackPlatformStatus status;

    /**
     * Запланированная дата/время публикации на платформе.
     */
    @Column(name = "planned_date_time")
    private LocalDateTime plannedDateTime;

    /**
     * Фактическая дата/время публикации на платформе.
     */
    @Column(name = "published_date_time")
    private LocalDateTime publishedDateTime;

    /**
     * Дополнительные заметки по этой платформе.
     */
    @Column(name = "notes", length = 2000)
    private String notes;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;
}
