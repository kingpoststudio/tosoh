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
    const { term, tableId, columnId, accessLevel, isActivated } = body;
    if (!term || !tableId || !columnId)
        throw new Error("Make sure to include term, tableId, columnId in request body");
    const renderAccessLevel = () => {
        if (accessLevel && typeof accessLevel === "string") {
            return `&visibility__in=${accessLevel}`;
        }
        else {
            return "";
        }
    };
    console.log(accessLevel, "accessLevel");
    const deactivateQuery = isActivated ? "&deactivate__eq=false" : "";
    const apiUrl = `${HS_API_URL}/hubdb/tables/${tableId}/rows?properties=${columnId}${deactivateQuery}${renderAccessLevel()}`;
    console.log(apiUrl, "apiUrl");
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
    console.log(data, "data");
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
