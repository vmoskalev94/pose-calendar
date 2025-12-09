package com.posecalendar.storage;

import org.springframework.web.multipart.MultipartFile;

/**
 * Абстракция над файловым хранилищем.
 * <p>
 * Реализации могут быть локальными (файловая система),
 * S3-совместимыми, использовать Postgres BLOBS и т.п.
 */
public interface FileStorageService {

    /**
     * Сохранить файл в указанную "логическую" директорию.
     *
     * @param file         исходный файл (обычно из multipart-запроса)
     * @param subDirectory подкаталог относительно basePath
     * @return относительный путь (storageKey), по которому файл сохранён
     * — его мы будем хранить в БД.
     * @throws StorageException при ошибках записи файла
     */
    String save(MultipartFile file, String subDirectory);

    /**
     * Загрузить файл по относительному пути (storageKey), который хранится в БД.
     *
     * @param storagePath относительный путь / ключ файла
     * @return обёртка с данными для скачивания
     * @throws StorageException если файл не найден или недоступен
     */
    StoredFile load(String storagePath);

    /**
     * Удалить файл из хранилища.
     * <p>
     * Если файл не существует — реализация может просто
     * залогировать и ничего не делать.
     *
     * @param storagePath относительный путь / ключ файла
     * @throws StorageException при ошибке удаления
     */
    void delete(String storagePath);
}
