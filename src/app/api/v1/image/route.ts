'use server'

import { DB } from "@/database/drizzle";
import { trImage } from "@/database/schema";

export async function GET(request: Request) {
  let data = await(await DB()).select()
    .from(trImage);

  return Response.json(data);
}

export async function POST(request: Request) {
  
}