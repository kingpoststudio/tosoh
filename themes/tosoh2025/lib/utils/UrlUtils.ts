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

export const setClearParams = (params: string[]) => {
  const url = new URL(window.location.href);
  params.forEach((key) => {
    url.searchParams.delete(key);
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

export const updateUrl = (e: Event) => {
  if (e) {
    const { name, value } = e?.target as HTMLSelectElement;
    const url = new URL(window.location.href);
    url.searchParams.set(name, value);
    window.location.href = url.toString();
  }
};

export const updateUrlFromCheckbox = (e: Event) => {
  if (e) {
    const { name, value } = e?.target as HTMLInputElement;
    const url = new URL(window.location.href);

    const existing = url.searchParams.get(name);
    let values = existing ? existing.split(',') : [];

    if (!(e.target as HTMLInputElement).checked) {
      values = values.filter((val) => val !== value);
    }

    if (!values.includes(value) && (e.target as HTMLInputElement).checked) {
      values.push(value);
    }

    if (!values.length) {
      url.searchParams.delete(name);
    } else {
      url.searchParams.set(name, values.join(','));
    }

    window.history.replaceState({}, '', url.toString());
  }
};

export const getUrlParam = (name: string) => {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
};

export const getPaginationParams = (
  defaultLimit: number,
  defaultPagination: number
): { limit: number; pagination: number; offset: number } => {
  const params = new URLSearchParams(window.location.search);
  const limit = parseInt(params?.get('limit') || `${defaultLimit}`);
  const pagination = parseInt(params?.get('pagination') || `${defaultPagination}`);
  const offset = limit * (pagination - 1) || 0;

  return { limit, pagination, offset };
};
