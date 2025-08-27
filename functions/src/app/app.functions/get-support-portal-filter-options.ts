exports.main = async (req: any) => {
  try {
    const HUBDB_API =
      "https://api.hubapi.com/cms/v3/hubdb/tables/support_portal/rows?limit=10000";
    const body = req && req.body ? req.body : {};

    const filters = body.filters || [];

    console.log(filters, "filters");

    const data: any[] = [];

    const constructFilterConditions = () => {
      return filters.map((filter: string) => filter).join(",");
    };

    const constructProperties = () => {
      return `&properties=${constructFilterConditions()}`;
    };

    const res = await fetch(`${HUBDB_API}${constructProperties()}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`GraphQL error: ${res.statusText}`);
    }

    const json = await res.json();

    return {
      statusCode: 200,
      body: JSON.stringify(json),
    };
  } catch (err: any) {
    console.error("Error in function:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
