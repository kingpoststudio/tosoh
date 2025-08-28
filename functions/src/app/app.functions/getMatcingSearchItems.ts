const HS_API_URL = "https://api.hubapi.com/cms/v3";

function findMatchesInRows(
  rows: any[],
  term: string | string[],
  columnId: string | string[]
) {
  const matches: string[] = [];

  rows.forEach((row) => {
    if (!row.values[columnId as string]) return;

    row.values[columnId as string].split(",").forEach((value: string) => {
      if (value.toLowerCase().includes((term as string).toLowerCase())) {
        matches.push(value.trim());
      }
    });
  });

  return [...new Set(matches)].sort();
}

async function fetchPartialMatchesByTerm(req: any) {
  const body = req && req.body ? req.body : {};
  const { term, tableId, columnId } = body;

  if (!term || !tableId || !columnId)
    throw new Error(
      "Make sure to include term, tableId, columnId in request body"
    );

  const apiUrl = `${HS_API_URL}/hubdb/tables/${tableId}/rows?properties=${columnId}&deactivate__eq=false`;

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

  console.log(data, "data");
  const matches = findMatchesInRows(rows, term, columnId);
  return matches;
}

exports.main = async (req: any) => {
  try {
    const matchingTerms = await fetchPartialMatchesByTerm(req);
    return {
      statusCode: 200,
      body: JSON.stringify({ matchingTerms }),
    };
  } catch (err: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
