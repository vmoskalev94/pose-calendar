package com.pz4sync.posecalendar.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "checklist_item")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(of = "id")
public class ChecklistItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "pack_id", nullable = false)
    private Pack pack;

    @Column(name = "title", nullable = false, length = 255)
    private String title;

    @Column(name = "done", nullable = false)
    private boolean done;

    @Column(name = "order_index", nullable = false)
    private Integer orderIndex;
}
