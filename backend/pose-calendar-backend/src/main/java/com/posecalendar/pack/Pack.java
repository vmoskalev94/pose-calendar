package com.posecalendar.pack;

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
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "packs")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Pack {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Владелец пака (креатор).
     */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    /**
     * Название на русском (основное).
     */
    @Column(name = "title_ru", nullable = false, length = 255)
    private String titleRu;

    /**
     * Название на английском (опционально).
     */
    @Column(name = "title_en", length = 255)
    private String titleEn;

    /**
     * Краткое описание / атмосфера пака.
     */
    @Column(name = "description", length = 2000)
    private String description;

    /**
     * Тип пака: solo / couple / group / mixed.
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "pack_type", nullable = false, length = 32)
    private PackType packType;

    /**
     * Статус пака (enum уже лежит в com.posecalendar.user.PackStatus).
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 32)
    private PackStatus status;

    /**
     * Примерное количество поз.
     */
    @Column(name = "poses_count")
    private Integer posesCount;

    /**
     * All-in-one файл или разбито на несколько.
     */
    @Column(name = "all_in_one", nullable = false)
    private boolean allInOne;

    /**
     * Сырые хэштеги, которые пойдут в посты.
     */
    @Column(name = "hashtags", length = 2000)
    private String hashtags;

    /**
     * Требования к установке (DLC, объекты, Andrew pose player, Teleport Any Sim, и т.п.).
     * Подробная структура пойдёт отдельной сущностью позже.
     */
    @Column(name = "requirements", length = 2000)
    private String requirements;

    /**
     * Чек-лист задач для пака.
     */
    @OneToMany(
            mappedBy = "pack",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @OrderBy("orderIndex ASC")
    @Builder.Default
    private List<PackTask> tasks = new ArrayList<>();

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    // helper-методы — пригодятся потом в сервисе
    public void addTask(PackTask task) {
        tasks.add(task);
        task.setPack(this);
    }

    public void removeTask(PackTask task) {
        tasks.remove(task);
        task.setPack(null);
    }
}
