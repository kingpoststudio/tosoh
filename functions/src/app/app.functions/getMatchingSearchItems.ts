// Types
interface FetchMatchesRequest {
  term: string;
  tableId: string;
  columnIds: string[];
  accessLevel?: string;
  isActivated?: boolean;
}

interface MatchResult {
  value: string;
  columnId: string;
}

interface HubDBRow {
  values: Record<string, unknown>;
}

interface HubDBResponse {
  results: HubDBRow[];
}

interface ColumnMetadata {
  id: string;
  name: string;
  type: "TEXT" | "MULTISELECT" | "SELECT" | "FOREIGN_ID";
}

interface TableSchema {
  columns: ColumnMetadata[];
}

// Constants
const HS_API_URL = "https://api.hubapi.com/cms/v3";

const QUERY_PARAMS = {
  VISIBILITY: "visibility__in",
  DEACTIVATE: "deactivate__eq",
  PROPERTIES: "properties",
} as const;

const HTTP_STATUS = {
  OK: 200,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// Type guards
function isValidRequestBody(body: unknown): body is FetchMatchesRequest {
  if (!body || typeof body !== "object") return false;

  const { term, tableId, columnIds } = body as Partial<FetchMatchesRequest>;

  return (
    typeof term === "string" &&
    typeof tableId === "string" &&
    Array.isArray(columnIds) &&
    columnIds.length > 0 &&
    columnIds.every((id) => typeof id === "string")
  );
}

function isValidHubDBResponse(data: unknown): data is HubDBResponse {
  return (
    typeof data === "object" &&
    data !== null &&
    "results" in data &&
    Array.isArray((data as HubDBResponse).results)
  );
}

// Pure utility functions
function extractSearchableText(value: unknown, columnType: string): string[] {
  if (!value) return [];

  switch (columnType) {
    case "FOREIGN_ID":
    case "MULTISELECT":
      // Array of {id, name, type} objects
      if (Array.isArray(value)) {
        return value.map((item) => item?.name || "").filter(Boolean);
      }
      return [];

    case "SELECT":
      // Single {id, name, label, type} object
      return [(value as any)?.name || (value as any)?.label || ""].filter(
        Boolean
      );

    default:
      // TEXT
      if (typeof value !== "string") return [];
      return value.split(",").map((s) => s.trim());
  }
}

function findMatchesInValue(
  value: unknown,
  searchTerm: string,
  columnType: string
): string[] {
  const searchableTexts = extractSearchableText(value, columnType);
  return searchableTexts.filter((text) =>
    text.toLowerCase().includes(searchTerm.toLowerCase())
  );
}

function findMatchesInRows(
  rows: HubDBRow[],
  searchTerm: string,
  columnIds: string[],
  columnMetadata: Map<string, ColumnMetadata>
): MatchResult[] {
  const matchesMap = new Map<string, MatchResult>();

  rows.forEach((row) => {
    columnIds.forEach((columnId) => {
      const columnValue = row.values[columnId];
      if (!columnValue) return;

      const columnType = columnMetadata.get(columnId)?.type || "TEXT";
      const valueMatches = findMatchesInValue(
        columnValue,
        searchTerm,
        columnType
      );

      valueMatches.forEach((match) => {
        // Create a unique key combining value and columnId
        const key = `${match}::${columnId}`;
        if (!matchesMap.has(key)) {
          matchesMap.set(key, {
            value: match,
            columnId: columnId,
          });
        }
      });
    });
  });

  return Array.from(matchesMap.values());
}

function buildQueryParams(request: FetchMatchesRequest): URLSearchParams {
  const params = new URLSearchParams();
  const { columnIds, isActivated, accessLevel } = request;

  columnIds.forEach((columnId) => {
    params.append(QUERY_PARAMS.PROPERTIES, columnId);
  });

  if (isActivated) {
    params.append(QUERY_PARAMS.DEACTIVATE, "false");
  }

  if (accessLevel && typeof accessLevel === "string") {
    params.append(QUERY_PARAMS.VISIBILITY, accessLevel);
  }

  return params;
}

function buildApiUrl(tableId: string, queryParams: URLSearchParams): string {
  return `${HS_API_URL}/hubdb/tables/${tableId}/rows?${queryParams.toString()}`;
}

// API functions for schema
async function fetchTableSchema(tableId: string): Promise<ColumnMetadata[]> {
  const response = await fetch(`${HS_API_URL}/hubdb/tables/${tableId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch table schema: ${response.status} ${response.statusText}`
    );
  }

  const data = await response.json();
  return (data as TableSchema)?.columns || [];
}

function validateRequestBody(body: unknown): FetchMatchesRequest {
  if (!isValidRequestBody(body)) {
    const errors: string[] = [];
    const bodyObj = (body as Partial<FetchMatchesRequest>) || {};

    // Check if body exists and is an object
    if (!body || typeof body !== "object") {
      throw new Error("Request body must be a valid object");
    }

    // Validate term
    if (!bodyObj.term) {
      errors.push("term is required");
    } else if (typeof bodyObj.term !== "string") {
      errors.push("term must be a string");
    }

    // Validate tableId
    if (!bodyObj.tableId) {
      errors.push("tableId is required");
    } else if (typeof bodyObj.tableId !== "string") {
      errors.push("tableId must be a string");
    }

    // Validate columnIds
    if (!bodyObj.columnIds) {
      errors.push("columnIds is required");
    } else if (!Array.isArray(bodyObj.columnIds)) {
      errors.push("columnIds must be an array");
    } else if (bodyObj.columnIds.length === 0) {
      errors.push("columnIds must not be empty");
    } else if (!bodyObj.columnIds.every((id) => typeof id === "string")) {
      errors.push("all columnIds must be strings");
    }

    throw new Error(`Invalid request body: ${errors.join(", ")}`);
  }

  return body;
}

// API functions
async function fetchHubDBRows(apiUrl: string): Promise<HubDBRow[]> {
  const response = await fetch(apiUrl, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch HubDB data: ${response.status} ${response.statusText}`
    );
  }

  const data = await response.json();

  if (!isValidHubDBResponse(data)) {
    return [];
  }

  return data.results;
}

async function fetchPartialMatchesByTerm(
  request: FetchMatchesRequest
): Promise<MatchResult[]> {
  const { tableId, term, columnIds } = request;

  // Fetch table schema to get column types
  const columns = await fetchTableSchema(tableId);
  const columnMetadata = new Map(columns.map((col) => [col.name, col]));

  const queryParams = buildQueryParams(request);
  const apiUrl = buildApiUrl(tableId, queryParams);

  const rows = await fetchHubDBRows(apiUrl);
  const results = findMatchesInRows(rows, term, columnIds, columnMetadata);

  // Sort by value first, then by columnId for consistent ordering
  return results.sort((a, b) => {
    const valueCompare = a.value.localeCompare(b.value);
    if (valueCompare !== 0) return valueCompare;
    return a.columnId.localeCompare(b.columnId);
  });
}

exports.main = async (req: any) => {
  try {
    const body = req?.body || {};
    const validatedRequest = validateRequestBody(body);
    const matches = await fetchPartialMatchesByTerm(validatedRequest);

    return {
      statusCode: HTTP_STATUS.OK,
      body: JSON.stringify({ matches }),
    };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    return {
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      body: JSON.stringify({ error: errorMessage }),
    };
  }
};
