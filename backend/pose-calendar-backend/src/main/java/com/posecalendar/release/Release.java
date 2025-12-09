package com.posecalendar.release;

import com.posecalendar.pack.Pack;
import com.posecalendar.user.User;
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
import java.util.ArrayList;
import java.util.List;

/**
 * Релиз пака в календаре (одно событие на конкретный день/время).
 * Привязан к одному Pack и к владельцу (User).
 */
@Entity
@Table(name = "releases")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Release {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Владелец релиза (креатор).
     * Обычно совпадает с owner пака.
     */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    /**
     * Пак, к которому относится релиз.
     */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "pack_id", nullable = false)
    private Pack pack;

    /**
     * Название релиза.
     * Например: "Winter Skating Poses — public release".
     */
    @Column(name = "title", nullable = false, length = 255)
    private String title;

    /**
     * Основная дата и время релиза (для календаря).
     */
    @Column(name = "release_date_time", nullable = false)
    private LocalDateTime releaseDateTime;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 32)
    private ReleaseStatus status;

    /**
     * Дополнительные заметки (свободный текст).
     */
    @Column(name = "notes", length = 2000)
    private String notes;

    /**
     * Платформенные статусы (TG / VK / Boosty / Tumblr и т.п.).
     */
    @OneToMany(
            mappedBy = "release",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @OrderBy("id ASC")
    @Builder.Default
    private List<ReleasePlatform> platforms = new ArrayList<>();

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    // ------------------------------------------------------------------------
    // helper-методы
    // ------------------------------------------------------------------------

    public void addPlatform(ReleasePlatform platform) {
        platforms.add(platform);
        platform.setRelease(this);
    }

    public void removePlatform(ReleasePlatform platform) {
        platforms.remove(platform);
        platform.setRelease(null);
    }
}
