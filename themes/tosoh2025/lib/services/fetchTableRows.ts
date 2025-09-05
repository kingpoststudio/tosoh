export const fetchTableRows = async (body: {
  tableId: string;
  filters: string[];
  properties: string;
  accessLevel?: string;
  limit: number;
  pagination: number;
  offset: number;
}) => {
  try {
    const response = await fetch(
      `https://${window.location.hostname}/hs/serverless/get-table-rows`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    );
    const data = await response.json();

    // const data = mockPortalItems;

    if (!data?.error) {
      const { results, total } = data;
      return { results, total };
    }

    if (data?.error) {
      throw Error(data?.error);
    }
  } catch (error: any) {
    throw Error(error.message);
  }
};
