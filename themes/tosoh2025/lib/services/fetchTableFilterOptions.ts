export const getTableFilterOptions = async (body: any) => {
  try {
    const response = await fetch(
      `https://${window.location.hostname}/hs/serverless/get-table-filter-options`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    );
    const data = await response?.json();

    if (!data?.error) {
      const allRows = data.results;
      return allRows;
    }

    if (data?.error) {
      throw Error(data?.error);
    }
  } catch (error: any) {
    throw Error(error);
  }
};
