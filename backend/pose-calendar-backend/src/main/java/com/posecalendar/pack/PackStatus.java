package com.posecalendar.pack;

public enum PackStatus {
    DRAFT,          // Черновик, в процессе
    IN_PROGRESS,    // Делается, но не готов
    READY_FOR_RELEASE, // Всё готово, ждёт релиза
    RELEASED,       // Уже релизнут
    ARCHIVED        // Убран из активного списка
}