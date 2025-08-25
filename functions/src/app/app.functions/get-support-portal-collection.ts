exports.main = async (req: any) => {
  try {
    const GRAPHQL_ENDPOINT = "https://api.hubapi.com/collector/graphql";

    const body = req && req.body ? req.body : {};

    const limit = body.limit ? parseInt(body.limit, 10) : 12;
    const offset = body.offset ? parseInt(body.offset, 10) : 0;
    const productFamily = body.product_family || undefined;
    const productType = body.product_type || undefined;
    const documentCategory = body.document_category || undefined;
    const documentType = body.document_type || undefined;
    const searchTerm = body.search_term || undefined;

    const createFilterConditions = () => {
      const filterConditions = [];

      if (
        !productFamily &&
        !productType &&
        !documentCategory &&
        !documentType &&
        !searchTerm
      ) {
        return "";
      }
      if (productFamily) {
        filterConditions.push(`product_family__contains: "${productFamily}"`);
      }
      if (productType) {
        filterConditions.push(`product_type__contains: "${productType}"`);
      }
      if (documentCategory) {
        filterConditions.push(
          `document_category__contains: "${documentCategory}"`
        );
      }
      if (documentType) {
        filterConditions.push(`document_type__contains: "${documentType}"`);
      }
      if (searchTerm) {
        filterConditions.push(`search_terms__contains: "${searchTerm}"`);
      }
      return `, filter: {${filterConditions.join(", ")}}`;
    };

    console.log(createFilterConditions());
    const query = `
        {
          HUBDB {
            support_portal_collection(limit: ${limit}, offset: ${offset} ${createFilterConditions()}) {
              hasMore
              items {
                deactivate
                document_category
                document_type
                document_url
                duration
                image
                internal_name
                name
                product_family
                product_type
                search_terms
                visibility
                wistia_cached_url
                wistia_video_url
                hs_path
              }
              limit
              offset
              total
            }
          }
        }
      `;

    const res = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
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
