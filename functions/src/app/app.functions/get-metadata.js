"use strict";
exports.main = async () => {
    try {
        const GRAPHQL_ENDPOINT = "https://api.hubapi.com/collector/graphql";
        // GraphQL query
        const query = `
      {
        HUBDB {
    support_portal_collection(limit: 500, offset: 1500) {
      total
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
