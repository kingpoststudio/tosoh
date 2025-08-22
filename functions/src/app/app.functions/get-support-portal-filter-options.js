"use strict";
exports.main = async (req) => {
    try {
        const GRAPHQL_ENDPOINT = "https://api.hubapi.com/collector/graphql";
        const data = [];
        const queryConstructor = (offset) => {
            return `
        {
          HUBDB {
            support_portal_collection(limit: 300, offset: ${offset}) {
              hasMore
              total
              items {
                document_category
                document_type
                product_family
                product_type
                search_terms
              }
              limit 
              offset
            }
          }
        }
`;
        };
        const fetchData = async (offset) => {
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
        const hasMore = (json) => {
            return json?.data?.HUBDB?.support_portal_collection?.hasMore;
        };
        const fetchAllData = async () => {
            let offset = 0;
            let hasFinished = false;
            while (!hasFinished) {
                const json = (await fetchData(offset));
                data.push(...json.data.HUBDB.support_portal_collection.items);
                offset = json.data.HUBDB.support_portal_collection.offset;
                hasFinished = !hasMore(json);
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
    }
    catch (err) {
        console.error("Error in function:", err);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: err.message }),
        };
    }
};
