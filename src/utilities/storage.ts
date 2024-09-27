'use server'

import { supabaseServer } from "./supabase-server";
import { promises as fs } from 'fs';

export async function getStoragePath() {
  if (process.env.STORAGE_TYPE === "Native") return process.env.STORAGE_NATIVE_PATH;
  else {
    const client = supabaseServer();
    return client.storage.from(process.env.STORAGE_SUPABASE_BUCKET)
      .getPublicUrl("").data.publicUrl.slice(0, -1);
  }
}

export async function uploadImage(file: File, fileName: string = file.name) {
  if (process.env.STORAGE_TYPE === 'Native') {
    const buffer = (await file.stream().getReader().read()).value ?? [];
    const filePath = `${process.env.STORAGE_NATIVE_UPLOAD_PATH}/${fileName}`
    await fs.writeFile(filePath, buffer, { flag: 'w+' });
  }
  else if (process.env.STORAGE_TYPE === "Supabase") {
    const err = await supabaseServer(true).storage
      .from(process.env.STORAGE_SUPABASE_BUCKET)
      .upload(fileName, file, {
        upsert: false
      });
    if (err.error) throw new Error("Cannot insert file");
  }
  else throw new Error("Storage type not configured correctly")
}

export async function deleteImage(fileName: string) {
  if (process.env.STORAGE_TYPE === 'Native') {
    const filePath = `${process.env.STORAGE_NATIVE_UPLOAD_PATH}/${fileName}`
    await fs.unlink(filePath);
  }
  else if (process.env.STORAGE_TYPE === "Supabase") {
    await supabaseServer().storage
      .from(process.env.STORAGE_SUPABASE_BUCKET)
      .remove([fileName]);
  }
  else throw new Error("Storage type not configured correctly")
}