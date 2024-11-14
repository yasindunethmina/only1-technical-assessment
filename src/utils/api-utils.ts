export const buildQueryString = (params: Record<string, unknown>): string => {
  const filteredParams = Object.entries(params)
    .filter(([_, value]) => value != null)
    .reduce(
      (acc, [key, value]) => {
        acc[key] = String(value);
        return acc;
      },
      {} as Record<string, string>
    );

  return new URLSearchParams(filteredParams).toString();
};

export const createBaseQueryParams = (params: Record<string, unknown>) => ({
  ...params,
});

export const createEntityTimestamps = (isUpdate = false) => ({
  ...(isUpdate ? { updatedAt: new Date().toISOString() } : {}),
  ...(!isUpdate
    ? {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: null,
      }
    : {}),
});
