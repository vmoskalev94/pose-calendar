package com.posecalendar.pack;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum PackTaskType {

    IDEA_AND_REFERENCES("Собрать идею и референсы"),
    POSES_DONE("Сделать все позы"),
    POSES_TESTED_IN_GAME("Проверить позы в игре"),
    SCREENSHOTS_MADE("Сделать скриншоты"),
    COVER_READY("Сделать обложку"),
    POST_TEXTS_WRITTEN("Подготовить тексты постов"),
    TAGS_PREPARED("Подготовить хэштеги"),
    FILES_PACKED("Собрать файлы пака"),
    DESCRIPTION_ON_SITES("Заполнить описания на площадках"),
    PUBLISHED_EVERYWHERE("Опубликовать на всех площадках");

    private final String defaultTitle;
}
