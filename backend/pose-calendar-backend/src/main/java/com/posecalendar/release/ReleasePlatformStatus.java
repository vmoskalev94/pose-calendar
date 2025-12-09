package com.posecalendar.release;

/**
 * Статус релиза на конкретной платформе.
 * <p>
 * PLANNED        — запланирован, но текст поста ещё не готов.
 * DRAFT_PREPARED — подготовлен черновик поста.
 * PUBLISHED      — пост опубликован.
 */
public enum ReleasePlatformStatus {

    PLANNED,
    DRAFT_PREPARED,
    PUBLISHED
}
