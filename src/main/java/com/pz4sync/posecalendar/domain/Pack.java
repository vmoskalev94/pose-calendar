package com.pz4sync.posecalendar.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "pack")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(of = "id")
public class Pack {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name_ru", nullable = false, length = 255)
    private String nameRu;

    @Column(name = "name_en", length = 255)
    private String nameEn;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false, length = 50)
    private PackType type;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 50)
    private PackStatus status;

    @Column(name = "poses_count")
    private Integer posesCount;

    @Column(name = "couple_poses_count")
    private Integer couplePosesCount;

    @Column(name = "tags", length = 512)
    private String tags;

    @Column(name = "description", length = 2048)
    private String description;

    @Column(name = "source_dir", length = 1024)
    private String sourceDir;

    @Column(name = "screens_dir", length = 1024)
    private String screensDir;

    @Column(name = "cover_file", length = 1024)
    private String coverFile;

    @Column(name = "package_file", length = 1024)
    private String packageFile;

    @Column(name = "created_at")
    private Instant createdAt;

    @Column(name = "updated_at")
    private Instant updatedAt;
}
