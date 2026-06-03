type WithUpdatedAt = { updatedAt?: string; updatedAtMs?: number };

function newer<T extends WithUpdatedAt>(local: T, remote: T): T {
  const localTime = local.updatedAt ? new Date(local.updatedAt).getTime() : local.updatedAtMs ?? 0;
  const remoteTime = remote.updatedAt ? new Date(remote.updatedAt).getTime() : remote.updatedAtMs ?? 0;
  return remoteTime > localTime ? remote : local;
}

function restrictiveBoolean(localValue: unknown, remoteValue: unknown): boolean | undefined {
  if (localValue === false || remoteValue === false) return false;
  if (localValue === true || remoteValue === true) return true;
  return undefined;
}

export function resolvePassportConflict<T extends Record<string, unknown>>(local: T, remote: T): T {
  const resolved = { ...remote, ...local } as T;
  for (const key of Object.keys({ ...local, ...remote })) {
    if (/allow|enabled|open|sync/i.test(key)) {
      const value = restrictiveBoolean(local[key], remote[key]);
      if (typeof value === "boolean") (resolved as Record<string, unknown>)[key] = value;
    }
  }
  return resolved;
}

export function resolveSettingsConflict<T extends WithUpdatedAt>(local: T, remote: T): T {
  return newer(local, remote);
}

export function resolveGenericConflict<T extends Record<string, unknown>>(local: T, remote: T, strategy: "latest" | "local" | "remote" | "private" = "latest"): T {
  if (strategy === "local") return local;
  if (strategy === "remote") return remote;
  if (strategy === "private") {
    const resolved = { ...remote, ...local } as T;
    for (const key of Object.keys(resolved)) {
      if (/shadow|legacy|export|memory|sync|public|share/i.test(key)) {
        const localValue = local[key];
        const remoteValue = remote[key];
        if (localValue === false || remoteValue === false) (resolved as Record<string, unknown>)[key] = false;
        if (localValue === "sealed" || remoteValue === "sealed") (resolved as Record<string, unknown>)[key] = "sealed";
        if (localValue === "hidden" || remoteValue === "hidden") (resolved as Record<string, unknown>)[key] = "hidden";
      }
    }
    return resolved;
  }
  return newer(local as T & WithUpdatedAt, remote as T & WithUpdatedAt) as T;
}

export function resolveOnboardingConflict<T extends { status?: string; updatedAt?: string }>(local: T, remote: T): T {
  if (local.status === "completed" || remote.status === "completed") return local.status === "completed" ? local : remote;
  if (local.status === "skipped" || remote.status === "skipped") return local.status === "skipped" ? local : remote;
  return newer(local, remote);
}
