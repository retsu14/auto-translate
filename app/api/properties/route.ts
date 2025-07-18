import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

// GET handler
export async function GET() {
  const filePath = path.join(process.cwd(), "lib", "properties.json");
  try {
    const fileContents = await fs.readFile(filePath, "utf-8");
    const jsonData = JSON.parse(fileContents);
    const response = NextResponse.json(jsonData);
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type");
    return response;
  } catch (err) {
    const errorResponse = NextResponse.json(
      { message: "Failed to read properties.json", error: (err as Error).message },
      { status: 500 }
    );
    errorResponse.headers.set("Access-Control-Allow-Origin", "*");
    errorResponse.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    errorResponse.headers.set("Access-Control-Allow-Headers", "Content-Type");
    return errorResponse;
  }
}

// OPTIONS handler (for CORS preflight requests)
export async function OPTIONS() {
  const response = new NextResponse(null, { status: 204 });
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return response;
}