const HS_API_URL = "https://api.hubapi.com/cms/v3";

function findMatchesInRows(
  rows: any[],
  term: string | string[],
  columnId: string | string[]
) {
  const matches: string[] = [];

  rows.forEach((row) => {
    console.log("Processing row:", JSON.stringify(row, null, 2));

    // HubDB API returns values in different ways - check both values and direct access
    const rowValue =
      row.values?.[columnId as string] || row[columnId as string];

    if (!rowValue) {
      console.log(`No value found for column ${columnId} in row`);
      return;
    }

    console.log(`Found value for column ${columnId}:`, rowValue);

    // Handle both string and object types that might be returned
    const valueToProcess =
      typeof rowValue === "string" ? rowValue : String(rowValue);

    valueToProcess.split(",").forEach((value: string) => {
      if (value.toLowerCase().includes((term as string).toLowerCase())) {
        matches.push(row);
      }
    });
  });

  console.log("Final matches found:", matches);
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

  // Use GET method as per HubSpot API documentation
  // Note: HubDB API might use different filter syntax - try without deactivate filter first
  const apiUrl = `${HS_API_URL}/hubdb/tables/${tableId}/rows`;
  console.log("Making API request to:", apiUrl);

  const res = await fetch(apiUrl, {
    method: "GET", // Changed to GET as per API docs
    headers: {
      Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
  }

  const data = (await res.json()) as any;

  // Add debugging to see the actual response structure
  console.log("API Response:", JSON.stringify(data, null, 2));
  console.log("Data keys:", Object.keys(data || {}));
  console.log("Data.results:", data?.results);
  console.log("Data.total:", data?.total);

  // According to HubSpot API docs, the response should have a 'results' array
  const rows = data?.results || [];
  if (!Array.isArray(rows)) {
    console.log("Rows is not an array:", typeof rows, rows);
    return [];
  }

  console.log("Number of rows found:", rows.length);
  if (rows.length > 0) {
    console.log("First row structure:", JSON.stringify(rows[0], null, 2));
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
