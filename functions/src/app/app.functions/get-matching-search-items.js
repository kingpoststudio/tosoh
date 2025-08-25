"use strict";
const HS_API_URL = "https://api.hubapi.com/cms/v3";
function findMatchesInRows(rows, term, columnId) {
    const matches = [];
    rows.forEach((row) => {
        if (!row.values[columnId])
            return;
        row.values[columnId].split(",").forEach((value) => {
            if (value.toLowerCase().includes(term.toLowerCase())) {
                matches.push(value.trim());
            }
        });
    });
    return [...new Set(matches)].sort();
}
async function fetchPartialMatchesByTerm(req) {
    const body = req && req.body ? req.body : {};
    const { term, tableId } = body;
    const columnId = "search_terms";
    const portalId = "145184808";
    if (!term || !tableId)
        throw new Error("Make sure to include term and tableId in request body");
    if (!portalId)
        throw new Error("A HubSpot account ID is required.");
    const apiUrl = `${HS_API_URL}/hubdb/tables/${tableId}/rows`;
    const res = await fetch(apiUrl, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
        },
    });
    if (!res.ok) {
        throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
    }
    const data = (await res.json());
    const rows = data?.results || [];
    if (!Array.isArray(rows)) {
        return [];
    }
    const matches = findMatchesInRows(rows, term, columnId);
    return matches;
}
exports.main = async (req) => {
    try {
        const matchingTerms = await fetchPartialMatchesByTerm(req);
        return {
            statusCode: 200,
            body: JSON.stringify({ matchingTerms }),
        };
    }
    catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: err.message }),
        };
    }
};
