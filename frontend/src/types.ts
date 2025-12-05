// frontend/src/types.ts

// Тип пака (как в enum PackType на backend)
export type PackType =
  | "FREE"
  | "SUBSCRIPTION_L1"
  | "SUBSCRIPTION_L2"
  | "EXCLUSIVE"
  | "EARLY_ACCESS";

// Статус пака (как в enum PackStatus на backend)
export type PackStatus =
  | "IDEA"
  | "IN_PROGRESS"
  | "READY"
  | "SCHEDULED"
  | "PUBLISHED";

// DTO пака
export interface PackDto {
  id: number;
  nameRu: string;
  nameEn: string | null;
  type: PackType;
  status: PackStatus;
  posesCount: number | null;
  couplePosesCount: number | null;
  tags: string | null;
  description: string | null;
  sourceDir: string | null;
  screensDir: string | null;
  coverFile: string | null;
  packageFile: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

// DTO пункта чек-листа
export interface ChecklistItemDto {
  id: number;
  packId: number;
  title: string;
  done: boolean;
  orderIndex: number;
}

// DTO релиза
export interface ReleaseDto {
  id: number;
  packId: number;
  releaseDateTime: string; // ISO-строка
  telegramPlanned: boolean;
  vkPlanned: boolean;
  boostyPlanned: boolean;
  tumblrPlanned: boolean;
}

// DTO события календаря
export interface CalendarEventDto {
  releaseId: number;
  packId: number;
  packNameRu: string;
  packNameEn: string | null;
  packType: PackType;
  packStatus: PackStatus;
  releaseDateTime: string; // ISO-строка
  telegramPlanned: boolean;
  vkPlanned: boolean;
  boostyPlanned: boolean;
  tumblrPlanned: boolean;
}
