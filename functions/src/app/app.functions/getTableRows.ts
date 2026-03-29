type ForeignIdEntry = {
  id: string;
  name: string;
  type: string;
};

type ColumnDef = {
  name: string;
  label: string;
  id: string;
  type: "TEXT" | "MULTISELECT" | "SELECT" | "FOREIGN_ID";
  foreignTableId?: number;
  foreignColumnId?: number;
  foreignIds?: ForeignIdEntry[];
};

type TableData = {
  columns: ColumnDef[];
};

exports.main = async (req: any) => {
  try {
    const body = req && req.body ? req.body : {};

    let tableCols = [];

    const tableId = body?.tableId;
    const properties = body?.properties;
    const sort = body?.sort;
    const accessLevel = body?.accessLevel;
    const limit = body?.limit ? parseInt(body.limit, 10) : 12;
    const offset = body?.offset ? parseInt(body.offset, 10) : 0;
    const filters = body?.filters || {};
    const isActivated = body?.isActivated;
    const numericComparisonFilters = body?.numericComparisonFilters || [];

    const HUBDB_ENDPOINT = `https://api.hubapi.com/cms/v3/hubdb/tables/${tableId}`;

    if (!tableId || !properties) {
      throw new Error(
        "Make sure to include tableId and properties in request body",
      );
    }

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

    const resolveForeignIdFilters = () => {
      const foreignIdCols = tableCols?.filter(
        (col: ColumnDef) =>
          col.type === "FOREIGN_ID" &&
          col.foreignIds?.length &&
          filters?.[col.name],
      );

      for (const col of foreignIdCols || []) {
        try {
          const decoded = decodeURIComponent(filters[col.name]);
          const decodedLower = decoded.trim().toLowerCase();

          const matchingIds = (col.foreignIds || [])
            .filter(
              (entry) => entry.name?.trim().toLowerCase() === decodedLower,
            )
            .map((entry) => String(entry.id));

          if (matchingIds.length > 0) {
            filters[col.name] = matchingIds.join(",");
          } else {
            delete filters[col.name];
          }
        } catch {
          continue;
        }
      }
    };

    resolveForeignIdFilters();

    const createFilterConditions = () => {
      const filterConditions: any[] = [];

      if (typeof filters === "object" && Object?.keys(filters)?.length) {
        Object?.keys(filters)?.map((filterKey) => {
          tableCols?.map((column: ColumnDef) => {
            if (column.name === filterKey && filters?.[filterKey]) {
              if (column.type === "MULTISELECT" || column.type === "TEXT") {
                filterConditions.push(
                  `${filterKey}__contains=${filters[filterKey]}`,
                );
              }
              if (column.type === "SELECT" || column.type === "FOREIGN_ID") {
                filterConditions.push(`${filterKey}__in=${filters[filterKey]}`);
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

    const createNumericComparisonFilters = () => {
      const numericComparisonFilterConditions: any[] = [];

      if (
        Array.isArray(numericComparisonFilters) &&
        numericComparisonFilters?.length
      ) {
        numericComparisonFilters?.map(
          (filterObj: {
            columnId: string;
            comparison: "lt" | "gt" | "lte" | "gte";
            value: number;
          }) => {
            const { columnId, comparison, value } = filterObj;

            numericComparisonFilterConditions.push(
              `${columnId}__${comparison}=${value}`,
            );
          },
        );

        return `&${numericComparisonFilterConditions.join("&")}`;
      }

      return "";
    };

    const createAccessLevelQuery = () => {
      if (accessLevel && typeof accessLevel === "string") {
        return `&visibility__in=${accessLevel}`;
      } else {
        return "";
      }
    };
    const createSortQuery = () => {
      if (sort && typeof sort === "string") {
        return `&sort=${sort}`;
      } else {
        return "";
      }
    };

    const createDeactivateQuery = () => {
      if (isActivated) {
        return `&deactivate__eq=false`;
      }
      return "";
    };

    const finalQueryUrl = `${HUBDB_ENDPOINT}/rows?limit=${limit}&offset=${offset}&properties=${properties}${createFilterConditions()}${createNumericComparisonFilters()}${createAccessLevelQuery()}${createSortQuery()}${createDeactivateQuery()}`;

    const portalItemsRes = await fetch(finalQueryUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    if (!portalItemsRes.ok) {
      throw new Error(
        `Portal Items - HubDB Error: ${portalItemsRes.statusText}`,
      );
    }

    const json: any = await portalItemsRes.json();

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
