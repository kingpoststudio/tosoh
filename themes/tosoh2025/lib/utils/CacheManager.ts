const CACHE_TTL_60_MINUTES = 60 * 60 * 1000; // 60 minutes

//Cache key should be passed by the caller
//Cache time should be passed opionally by the caller, default is 5 minutes

export const useCachedData = (
  cacheKey: string,
  checkTime: boolean = true,
  expirationTimeInMs?: number
) => {
  const now = Date.now();

  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    const { data, timestamp } = JSON.parse(cached);
    if (now - timestamp < (expirationTimeInMs || CACHE_TTL_60_MINUTES) || !checkTime) {
      return data;
    }
  }
};

export const cacheResponse = (cacheKey: string, data: any) => {
  const now = Date.now();

  localStorage.setItem(
    cacheKey,
    JSON.stringify({
      data,
      timestamp: now,
    })
  );
};
