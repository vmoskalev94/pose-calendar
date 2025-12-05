package com.pz4sync.posecalendar.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "release")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(of = "id")
public class Release {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "pack_id", nullable = false)
    private Pack pack;

    @Column(name = "release_date_time", nullable = false)
    private LocalDateTime releaseDateTime;

    @Column(name = "telegram_planned", nullable = false)
    private boolean telegramPlanned;

    @Column(name = "vk_planned", nullable = false)
    private boolean vkPlanned;

    @Column(name = "boosty_planned", nullable = false)
    private boolean boostyPlanned;

    @Column(name = "tumblr_planned", nullable = false)
    private boolean tumblrPlanned;
}
