exports.main = async (req: any) => {
  try {
    const body = req && req.body ? req.body : {};

    const tableId = body?.tableId;
    const filters = body.filters || [];
    const accessLevel = body.accessLevel || "Customer";

    if (!tableId) {
      throw new Error("Make sure to include tableId in request body");
    }

    const HUBDB_API = `https://api.hubapi.com/cms/v3/hubdb/tables/${tableId}/rows?limit=10000&deactivate__eq=false`;

    console.log(filters, "filters");

    const constructFilterConditions = () => {
      return filters.map((filter: string) => filter).join(",");
    };

    const constructProperties = () => {
      if (filters) {
        return `&properties=${constructFilterConditions()}`;
      }
      return "";
    };

    const constructAccessLevelQuery = () => {
      if (accessLevel && typeof accessLevel == "string") {
        return `&visibility__in=${accessLevel}`;
      }

      return "";
    };

    const res = await fetch(
      `${HUBDB_API}${constructProperties()}${constructAccessLevelQuery()}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

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
