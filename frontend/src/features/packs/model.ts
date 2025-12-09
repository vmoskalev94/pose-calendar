// src/features/packs/model.ts

export type PackStatus =
    | 'DRAFT'
    | 'IN_PROGRESS'
    | 'READY_FOR_RELEASE'
    | 'RELEASED'
    | 'ARCHIVED';

export type PackType = 'SOLO' | 'COUPLE' | 'GROUP' | 'MIXED';

export type PackTaskType =
    | 'IDEA_AND_REFERENCES'
    | 'POSES_DONE'
    | 'POSES_TESTED_IN_GAME'
    | 'SCREENSHOTS_MADE'
    | 'COVER_READY'
    | 'POST_TEXTS_WRITTEN'
    | 'TAGS_PREPARED'
    | 'FILES_PACKED'
    | 'DESCRIPTION_ON_SITES'
    | 'PUBLISHED_EVERYWHERE';

export interface PackTask {
    id: number;
    taskType: PackTaskType;
    title: string;
    orderIndex: number;
    completed: boolean;
    completedAt: string | null;
}

export interface PackShort {
    id: number;
    titleRu: string;
    titleEn: string | null;
    packType: PackType;
    status: PackStatus;
    posesCount: number | null;
    allInOne: boolean;
    createdAt: string;
    updatedAt: string;
    completedTasks: number;
    totalTasks: number;
}

export interface PackDetails extends PackShort {
    description: string | null;
    hashtags: string | null;
    requirements: string | null;
    // backend может вернуть задачи и в деталях
    tasks?: PackTask[];
}

export interface PackCreateRequest {
    titleRu: string;
    titleEn?: string;
    description?: string;
    packType: PackType;
    posesCount?: number;
    allInOne?: boolean;
    hashtags?: string;
    requirements?: string;
}

export interface PackUpdateRequest extends PackCreateRequest {
    status: PackStatus;
    allInOne: boolean;
}

export interface PackTaskUpdateRequest {
    title?: string;
    completed?: boolean;
}
