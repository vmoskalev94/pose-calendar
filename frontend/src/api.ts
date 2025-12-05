// frontend/src/api.ts

import type {
  PackDto,
  ChecklistItemDto,
  ReleaseDto,
  CalendarEventDto,
  PackStatus,
  PackType,
} from "./types";

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init);

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`HTTP ${response.status}${text ? `: ${text}` : ""}`);
  }

  if (response.status === 204) {
    // нет тела
    return undefined as T;
  }

  return (await response.json()) as T;
}

function buildUrl(
  path: string,
  params?: Record<string, string | number | undefined>
): string {
  const url = new URL(path, window.location.origin);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    });
  }
  return url.pathname + url.search;
}

async function getPacks(status?: PackStatus): Promise<PackDto[]> {
  const url = status
    ? buildUrl("/api/packs", { status })
    : "/api/packs";
  return request<PackDto[]>(url);
}

async function createPack(payload: {
  nameRu: string;
  nameEn: string | null;
  type: PackType;
  posesCount: number | null;
  couplePosesCount: number | null;
  tags: string | null;
  description: string | null;
  sourceDir: string | null;
  screensDir: string | null;
  coverFile: string | null;
  packageFile: string | null;
}): Promise<PackDto> {
  return request<PackDto>("/api/packs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

async function getChecklist(packId: number): Promise<ChecklistItemDto[]> {
  return request<ChecklistItemDto[]>(`/api/packs/${packId}/checklist`);
}

async function toggleChecklistItemDone(
  itemId: number,
  done: boolean
): Promise<ChecklistItemDto> {
  return request<ChecklistItemDto>(`/api/checklist-items/${itemId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ done }),
  });
}

async function createRelease(params: {
  packId: number;
  releaseDateTimeIso: string;
  telegramPlanned: boolean;
  vkPlanned: boolean;
  boostyPlanned: boolean;
  tumblrPlanned: boolean;
}): Promise<ReleaseDto> {
  const { packId, releaseDateTimeIso, telegramPlanned, vkPlanned, boostyPlanned, tumblrPlanned } =
    params;

  return request<ReleaseDto>(`/api/packs/${packId}/releases`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      releaseDateTime: releaseDateTimeIso,
      telegramPlanned,
      vkPlanned,
      boostyPlanned,
      tumblrPlanned,
    }),
  });
}

async function getReleasesForPack(packId: number): Promise<ReleaseDto[]> {
  return request<ReleaseDto[]>(`/api/packs/${packId}/releases`);
}

async function getCalendarEvents(
  fromIso: string,
  toIso: string
): Promise<CalendarEventDto[]> {
  const url = buildUrl("/api/calendar", { from: fromIso, to: toIso });
  return request<CalendarEventDto[]>(url);
}

export const Api = {
  getPacks,
  getChecklist,
  toggleChecklistItemDone,
  getReleasesForPack,
  getCalendarEvents,
  createPack,
  createRelease,
};
