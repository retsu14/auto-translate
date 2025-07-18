import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function GET() {
  const filePath = path.join(process.cwd(), "lib", "properties.json");
  try {
    const fileContents = await fs.readFile(filePath, "utf-8");
    const jsonData = JSON.parse(fileContents);
    return NextResponse.json(jsonData);
  } catch (err: any) {
    return NextResponse.json(
      { message: "Failed to read properties.json", error: err.message },
      { status: 500 }
    );
  }
}
