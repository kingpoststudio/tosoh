"use strict";
exports.main = async (req) => {
    try {
        const GRAPHQL_ENDPOINT = "https://api.hubapi.com/collector/graphql";
        const { limit = 500, offset = 0 } = typeof req !== "undefined" && req.body ? req.body : {};
        // GraphQL query
        const query = `
        {
          HUBDB {
            support_portal_collection(limit: ${limit}, offset: ${offset}) {
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
              }
              limit
              offset
            }
          }
        }
      `;
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
        // Return the JSON response directly
        return {
            statusCode: 200,
            body: JSON.stringify(json),
        };
    }
    catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: err.message }),
        };
    }
};
