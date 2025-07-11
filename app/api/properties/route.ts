import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const baseUrl = "https://islandproperty.haspcms.net/api/contents/properties/entries";
  let allData: any[] = [];
  let page = 1;
  let condition = true;

  while (condition) {
    const url = `${baseUrl}?page%5Bnumber%5D=${page}`;
    console.log(`📡 Fetching page ${page}...`);

    try {
      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(`HTTP ${res.status} on page ${page}`);
      }

      const json = await res.json();
      const entries = json.data;

      if (!entries || entries.length === 0) {
        console.log("🚧 No more entries. Stopping.");
        break;
      }

      allData.push(...entries);
      page++;
    } catch (err: any) {
      console.error(`❌ Error fetching page ${page}:`, err.message);
      const errorResponse = NextResponse.json(
        { message: "Failed to fetch all properties", error: err.message },
        { status: 500 }
      );

      errorResponse.headers.set("Access-Control-Allow-Origin", "*");
      errorResponse.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
      errorResponse.headers.set("Access-Control-Allow-Headers", "Content-Type");

      return errorResponse;
    }
  }

  console.log(`✅ Fetched total ${allData.length} entries.`);
  const response = NextResponse.json({ data: allData });

  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");

  return response;
}

export async function OPTIONS() {
  const response = new NextResponse(null, { status: 204 });

  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");

  return response;
}
