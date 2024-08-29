"use server";

import db from "@/lib/db";
import { wait } from "@/lib/wait";
import {
  CreateCollectionSchema,
  CreateCollectionSchemaType,
  DeleteCollectionSchemaType,
} from "@/schemas/collection";
import { currentUser } from "@clerk/nextjs/server";

import { redirect } from "next/navigation";

export const createCollection = async (values: CreateCollectionSchemaType) => {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }
  const validatedFields = CreateCollectionSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { name, color } = validatedFields.data;
  // To check disabled and "spinner"
  // await wait(5000);

  await db.collection.create({
    data: {
      userId: user.id,
      name,
      color,
    },
  });

  return { success: "Collection created successfully!" };
};

export async function deleteCollection(id: string) {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  // To check disabled and "deleting..."
  // await wait(5000);

  return await db.collection.delete({
    where: {
      id: id,
    },
  });
}
