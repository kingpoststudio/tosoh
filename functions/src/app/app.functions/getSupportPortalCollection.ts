type TableData = {
  columns: {
    name: string;
    label: string;
    id: string;
    type: "TEXT" | "MULTISELECT" | "SELECT";
  }[];
};

exports.main = async (req: any) => {
  try {
    const HUBDB_ENDPOINT =
      "https://api.hubapi.com/cms/v3/hubdb/tables/support_portal";

    const body = req && req.body ? req.body : {};

    let tableCols = [];

    const properties =
      "name,image,hs_path,product_family,product_type,,document_type,wistia_video_url,document_url";

    const limit = body.limit ? parseInt(body.limit, 10) : 12;
    const offset = body.offset ? parseInt(body.offset, 10) : 0;
    const filters = body?.filters || {};

    ///Get the table

    const tableRes = await fetch(HUBDB_ENDPOINT, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    if (!tableRes.ok) {
      throw new Error(`HubDB error: ${tableRes.statusText}`);
    }

    const tableData = await tableRes.json();
    tableCols = (tableData as TableData)?.columns;

    const createFilterConditions = () => {
      const filterConditions: any[] = [];

      if (typeof filters === "object" && Object?.keys(filters)?.length) {
        Object?.keys(filters)?.map((filterKey) => {
          tableCols?.map((column) => {
            if (column.name === filterKey && filters?.[filterKey]) {
              if (column.type === "MULTISELECT" || column.type === "TEXT") {
                filterConditions.push(
                  `${filterKey}__contains=${filters[filterKey]}`
                );
              }
              if (column.type === "SELECT") {
                `${filterKey}__in=${filters[filterKey]}`;
              }
            }
          });
        });
      }

      if (typeof filters === "object" && !Object?.keys(filters)?.length) {
        return "";
      }

      return `&${filterConditions.join("&")}`;
    };

    console.log(
      `${HUBDB_ENDPOINT}/rows?limit=${limit}&offset=${offset}&properties=${properties}${createFilterConditions()}`
    );

    const portalItemsRes = await fetch(
      `${HUBDB_ENDPOINT}/rows?limit=${limit}&offset=${offset}&properties=${properties}${createFilterConditions()}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!portalItemsRes.ok) {
      throw new Error(
        `Portal Items - HubDB Error: ${portalItemsRes.statusText}`
      );
    }

    const json = await portalItemsRes.json();

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
