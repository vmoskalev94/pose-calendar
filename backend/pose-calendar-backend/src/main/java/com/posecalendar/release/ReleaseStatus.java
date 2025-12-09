package com.posecalendar.release;

/**
 * Общий статус релиза (в целом по паку).
 * <p>
 * PLANNED       — запланирован, контент ещё может быть не готов.
 * CONTENT_READY — все материалы готовы, ждём публикации.
 * POSTED        — релиз уже произошёл.
 * CANCELLED     — релиз отменён.
 */
public enum ReleaseStatus {

    PLANNED,
    CONTENT_READY,
    POSTED,
    CANCELLED
}
