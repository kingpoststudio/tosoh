const HS_API_URL = "https://api.hubapi.com/cms/v3";

function findMatchesInRows(
  rows: any[],
  term: string | string[],
  columnId: string | string[]
) {
  const matches: string[] = [];

  rows.forEach((row) => {
    const rowValue =
      row.values?.[columnId as string] || row[columnId as string];

    if (!rowValue) {
      return;
    }

    // Handle both string and object types that might be returned
    const valueToProcess =
      typeof rowValue === "string" ? rowValue : String(rowValue);

    valueToProcess.split(",").forEach((value: string) => {
      if (value.toLowerCase().includes((term as string).toLowerCase())) {
        matches.push(row);
      }
    });
  });

  return [...new Set(matches)].sort();
}

async function fetchPartialMatchesByTerm(req: any) {
  const body = req && req.body ? req.body : {};
  const { term, tableId } = body;

  const columnId = "search_terms";
  const portalId = "145184808";

  if (!term || !tableId)
    throw new Error("Make sure to include term and tableId in request body");
  if (!portalId) throw new Error("A HubSpot account ID is required.");

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

  const data = (await res.json()) as any;

  const rows = data?.results || [];
  if (!Array.isArray(rows)) {
    return [];
  }

  const matches = findMatchesInRows(rows, term, columnId);
  return matches;
}

exports.main = async (req: any) => {
  try {
    const matchingItems = await fetchPartialMatchesByTerm(req);
    return {
      statusCode: 200,
      body: JSON.stringify({ matchingItems }),
    };
  } catch (err: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
