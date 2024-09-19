import { DB } from "@/database/db-client";
import { trImage } from "@/database/schema";
import { GetImageByIDRequestSchema, GetImageRequestSchema } from "@/models/request/image";
import { NewGetImageResponse } from "@/models/response/image";
import { badRequestResponse, dataResponse, handleDataValidation } from "@/utilities/api";
import { getStoragePath } from "@/utilities/storage";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest, slug : { params: { id: string } }) {
  return await handleDataValidation(request, GetImageByIDRequestSchema, async (data) => {
    const storagePath = await getStoragePath();
    
    const res = await DB.query.trImage.findFirst({
      columns: {
        id: true,
        name: true,
        ageRating: true,
        source: true,
        extension: true,
        dateIn: true,
        description: true
      },
      with: {
        trImageTags: {
          columns: {},
          with: {
            trTag: {
              columns: { name: true }
            }
          }
        }
      },
      where: eq(trImage.id, data.id)
    });

    if (!res) return badRequestResponse("Image not found");

    return dataResponse({
        id: res.id,
        name: res.name,
        ageRating: res.ageRating,
        image: `${storagePath}/${res.id}.${res.extension}`,
        source: res.source,
        tags: res.trImageTags.map(x => x.trTag.name),
        uploadDate: res.dateIn,
        description: res.description
      } as NewGetImageResponse
    );
  }, { ...slug.params });
}