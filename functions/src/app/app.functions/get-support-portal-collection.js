"use strict";
exports.main = async (req) => {
    try {
        const GRAPHQL_ENDPOINT = "https://api.hubapi.com/collector/graphql";
        const body = req && req.body ? req.body : {};
        const limit = body.limit ? parseInt(body.limit, 10) : 12;
        const offset = body.offset ? parseInt(body.offset, 10) : 0;
        const filters = body?.filters || {};
        const createFilterConditions = () => {
            const filterConditions = [];
            if (typeof filters === "object" && Object?.keys(filters)?.length) {
                Object?.keys(filters)?.map((filterKey) => {
                    if (filters?.[filterKey]) {
                        filterConditions.push(`${filterKey}__contains: "${filters[filterKey]}"`);
                    }
                });
            }
            if (typeof filters === "object" && !Object?.keys(filters)?.length) {
                return "";
            }
            return `, filter: {${filterConditions.join(", ")}}`;
        };
        const query = `
        {
          HUBDB {
            support_portal_collection(limit: ${limit}, offset: ${offset} ${createFilterConditions()}) {
              hasMore
              items {
                deactivate
                document_category
                document_type
                document_url
                duration
                image
                internal_name
                name
                product_family
                product_type
                search_terms
                visibility
                wistia_cached_url
                wistia_video_url
                hs_path
              }
              limit
              offset
              total
            }
          }
        }
      `;
        console.log(query, "query");
        const res = await fetch(GRAPHQL_ENDPOINT, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ query }),
        });
        if (!res.ok) {
            throw new Error(`GraphQL error: ${res.statusText}`);
        }
        const json = await res.json();
        return {
            statusCode: 200,
            body: JSON.stringify(json),
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
