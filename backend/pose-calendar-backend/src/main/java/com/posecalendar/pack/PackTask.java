package com.posecalendar.pack;

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

@Entity
@Table(name = "pack_tasks")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PackTask {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * К какому паку относится задача.
     */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "pack_id", nullable = false)
    private Pack pack;

    /**
     * Тип задачи (используется для автогенерации дефолтного чек-листа).
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "task_type", nullable = false, length = 64)
    private PackTaskType taskType;

    /**
     * Заголовок задачи (может отличаться от дефолтного текста в PackTaskType).
     */
    @Column(name = "title", nullable = false, length = 255)
    private String title;

    /**
     * Порядок сортировки в чек-листе.
     */
    @Column(name = "order_index", nullable = false)
    private int orderIndex;

    /**
     * Выполнена задача или нет.
     */
    @Column(name = "completed", nullable = false)
    private boolean completed;

    /**
     * Когда задача была выполнена (для истории/аналитики).
     */
    @Column(name = "completed_at")
    private Instant completedAt;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;
}
