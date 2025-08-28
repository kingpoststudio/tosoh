export const deleteMultipleSearchParams = (paramNames: string[]) => {
  const url = new URL(window.location.href);
  paramNames.forEach((paramName) => {
    url.searchParams.delete(paramName);
  });
  window.history.replaceState({}, '', url.toString());
};

export const setSearchParams = (params: Record<string, string>) => {
  const url = new URL(window.location.href);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });
  window.history.replaceState({}, '', url.toString());
};

export const clearParams = (filters: string[]) => {
  const params = new URLSearchParams(window.location.search);

  filters?.map((column) => {
    params.delete(column);
  });

  window.location.search = params?.toString();
};
