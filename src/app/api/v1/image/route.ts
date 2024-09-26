import { AgeRating } from "@/constants/image";
import { DB } from "@/database/db-client";
import { trImage, trImageTag, trTag } from "@/database/schema";
import { DeleteImageRequestSchema, GetImageRequestSchema, InsertImageRequestSchema, UpdateImageRequestSchema } from "@/models/request/image";
import { NewGetImageResponse } from "@/models/response/image";
import { badRequestResponse, handleDataValidation, paginationResponse, successResponse, unauthorizedResponse } from "@/utilities/api";
import { arrayExcept, arrayUnion } from "@/utilities/array";
import { sqlArray } from "@/utilities/database";
import { deleteImage, getStoragePath, uploadImage } from "@/utilities/storage";
import { supabaseServer } from "@/utilities/supabase-server";
import { and, count, desc, eq, inArray, InferInsertModel, lte, not, sql } from "drizzle-orm";
import { NextRequest } from "next/server";
import { v4 as uuidv4 } from 'uuid';

export async function GET(request: NextRequest) {
  return await handleDataValidation(request, GetImageRequestSchema, async (data) => {
    const storagePath = await getStoragePath();

    // 1. Cari ImageID yang eligible
    const eligibleImageID = await DB.select({
      imageId: trImageTag.imageId
    })
      .from(trImageTag)
      .innerJoin(trTag, eq(trImageTag.tagId, trTag.id))
      .groupBy(trImageTag.imageId)
      .having(
        sql`(${data.tagAND.length} = 0 OR ARRAY_AGG(${trTag.name}) @> ${sqlArray(data.tagAND)}) AND (${data.tagOR.length} = 0 OR ARRAY_AGG(${trTag.name}) && ${sqlArray(data.tagOR)})`
    );

    // 2. Hitung data
    const dataCount = (await DB.select({
      count: count()
    }).from(trImage)
      .where(and(
        lte(trImage.ageRating, data.ageRating ?? AgeRating.GENERAL),
        inArray(trImage.id, eligibleImageID.map(x => x.imageId))
      )))[0].count;
    const totalPage = Math.floor((dataCount + data.pageSize - 1) / data.pageSize);

    // 3. Ambil gambar yang ID nya di eligible tsb
    const res = await DB.query.trImage.findMany({
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
      where: and(
        lte(trImage.ageRating, data.ageRating ?? AgeRating.GENERAL),
        inArray(trImage.id, eligibleImageID.map(x => x.imageId))
      ),
      orderBy: [desc(trImage.dateIn)],
      limit: data.pageSize,
      offset: data.pageSize * (data.currentPage - 1)
    });

    // 4. Datanya diolah
    let preliminaryResult = res.map<NewGetImageResponse>(d => ({
      id: d.id,
      name: d.name,
      ageRating: d.ageRating,
      image: `${storagePath}/${d.id}.${d.extension}`,
      source: d.source,
      tags: d.trImageTags.map(x => x.trTag.name),
      uploadDate: d.dateIn,
      description: d.description
    }));

    return paginationResponse({
      currentPage: data.currentPage,
      totalPage: totalPage,
      isLast: totalPage <= data.currentPage,
      pageSize: data.pageSize,
      data: preliminaryResult
    });
  });
}

export async function POST(request: NextRequest) {
  return await handleDataValidation(request, InsertImageRequestSchema, async (data) => {
    const user = await supabaseServer().auth.getUser();
    const userID = user.data.user?.id
    if (!userID) return unauthorizedResponse();

    const ID = uuidv4();
    const extension = data.image.name.split('.', 2).pop() ?? "";
    const image: InferInsertModel<typeof trImage> = {
      name: data.name,
      ageRating: data.ageRating,
      id: ID,
      extension: extension,
      description: data.description,
      link: `${ID}.${extension}`,
      source: data.source ?? "",
      userIn: userID,
      dateIn: (new Date()).toUTCString(),
      deleted: false
    }

    // Tag Processed : tag yang ingin diproses
    let tagProcessed = data.tags.map(x => x.replace(' ', '_'));
    let tagInDB = await DB.select({
      id: trTag.id,
      name: trTag.name
    }).from(trTag)
      .where(inArray(trTag.name, tagProcessed));
    

    const tagNotInDB = arrayExcept(tagProcessed, tagInDB.map(x => x.name))
      .map<InferInsertModel<typeof trTag>>(x => ({
        id: uuidv4(),
        name: x,
        ageRating: AgeRating.GENERAL,
        userIn: userID,
        dateIn: (new Date()).toUTCString(),
        deleted: false
      }));
    
    const imageTag = arrayUnion(tagInDB, tagNotInDB.map(x => ({ id: x.id, name: x.name, })))
      .map<InferInsertModel<typeof trImageTag>>(x => ({
        id: uuidv4(),
        imageId: ID,
        tagId: x.id,
        userIn: userID,
        dateIn: (new Date()).toUTCString(),
        deleted: false
      }));
    
    await DB.transaction(async ctx => {
      await ctx.insert(trImage).values(image);
      await ctx.insert(trTag).values(tagNotInDB);
      await ctx.insert(trImageTag).values(imageTag);
      await uploadImage(data.image, image.link);
    });

    return successResponse("Successfully add a new reaction 😀");
  });
}

export async function PATCH(request: NextRequest) {
  return await handleDataValidation(request, UpdateImageRequestSchema, async (data) => {
    const user = await supabaseServer().auth.getUser();
    const userID = user.data.user?.id
    if (!userID) return unauthorizedResponse();
    
    const image = await DB.query.trImage.findFirst({
      with: {
        trImageTags: {
          with: {
            trTag: true
          }
        }
      },
      where: eq(trImage.id, data.id)
    });
    if (!image) return badRequestResponse("Reaction not found 🤔");
    
    // Atur tag
    const tagNew = data.tags.map(x => x.replace(" ", "_"));
    const deletedTag = image.trImageTags.filter(x => !tagNew.includes(x.trTag.name)).map(x => x.id);
    let intactTag = image.trImageTags.filter(x => tagNew.includes(x.trTag.name)).map(x => x.trTag.name);
    
    let tagInDB = await DB.select({
      id: trTag.id,
      name: trTag.name
    }).from(trTag)
      .where(and(inArray(trTag.name, tagNew), not(inArray(trTag.name, intactTag))));
    let tagInDBName = tagInDB.map(x => x.name);
    
    let tagNotInDB = tagNew.filter(x => !tagInDBName.includes(x) && !intactTag.includes(x))
      .map<InferInsertModel<typeof trTag>>(x => ({
        id: uuidv4(),
        name: x,
        ageRating: AgeRating.GENERAL,
        userIn: userID,
        dateIn: (new Date()).toISOString(),
        deleted: false
      }));
    
    const imageTag = arrayUnion(tagInDB, tagNotInDB)
      .map<InferInsertModel<typeof trImageTag>>(x => ({
        id: uuidv4(),
        imageId: image.id,
        tagId: x.id,
        userIn: userID,
        dateIn: (new Date()).toISOString(),
        deleted: false
      }));
    
    await DB.transaction(async ctx => {
      if (tagNotInDB.length > 0) await ctx.insert(trTag).values(tagNotInDB);
      if (deletedTag.length > 0) await ctx.delete(trImageTag).where(inArray(trImageTag.id, deletedTag));
      if (imageTag.length > 0) await ctx.insert(trImageTag).values(imageTag);

      await ctx.update(trImage)
        .set({
          description: data.description,
          source: data.source,
          ageRating: data.ageRating,
          name: data.name,
          dateUp: (new Date()).toISOString(),
          userUp: userID
        })
        .where(eq(trImage.id, data.id));
    });

    return successResponse("Successfully add a new reaction 😀");
  });
}

export async function DELETE(request: NextRequest) {
  return await handleDataValidation(request, DeleteImageRequestSchema, async (data) => {
    const image = await DB.query.trImage.findFirst({
      where: eq(trImage.id, data.id)
    });
    if (!image) return badRequestResponse("Reaction not found 🤔");
    const link = `${image.id}.${image.extension}`;

    await DB.delete(trImage).where(eq(trImage.id, data.id));
    await deleteImage(link);

    return successResponse("Successfully delete a reaction 😭");
  });
}