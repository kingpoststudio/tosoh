exports.main = async (req: any) => {
  try {
    const GRAPHQL_ENDPOINT = "https://api.hubapi.com/collector/graphql";
    const body = req && req.body ? req.body : {};

    const filters = body.filters || [];

    console.log(filters, "filters");

    const data: any[] = [];

    const constructFilterConditions = () => {
      return filters.map((filter: string) => filter).join(" ");
    };

    const queryConstructor = (offset: number) => {
      return `
        {
          HUBDB {
            support_portal_collection(limit: 300, offset: ${offset}) {
              hasMore
              total
              items {
                ${constructFilterConditions()}
              }
              limit 
              offset
            }
          }
        }
`;
    };

    console.log("query", queryConstructor(0));

    const fetchData = async (
      offset: number
    ): Promise<
      | {
          data: {
            HUBDB: {
              support_portal_collection: {
                hasMore: boolean;
                total: number;
                items: any[];
                limit: number;
                offset: number;
              };
            };
          };
        }
      | unknown
    > => {
      const res = await fetch(GRAPHQL_ENDPOINT, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: queryConstructor(offset) }),
      });

      if (!res.ok) {
        throw new Error(`GraphQL error: ${res.statusText}`);
      }

      const json = await res.json();

      return json;
    };

    const hasMore = (json: any) => {
      return json?.data?.HUBDB?.support_portal_collection?.hasMore;
    };

    const fetchAllData = async () => {
      let offset = 0;
      let hasFinished = false;

      while (!hasFinished) {
        const json = (await fetchData(offset)) as any;
        console.log(json, "response");
        if (json?.data?.HUBDB?.support_portal_collection?.items) {
          data.push(...json.data.HUBDB.support_portal_collection.items);
          offset = json.data.HUBDB.support_portal_collection.offset;
          hasFinished = !hasMore(json);
        } else {
          hasFinished = true;
        }
      }
    };

    await fetchAllData();

    return {
      statusCode: 200,
      body: JSON.stringify({
        data: {
          HUBDB: {
            support_portal_collection: {
              items: data,
            },
          },
        },
      }),
    };
  } catch (err: any) {
    console.error("Error in function:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
