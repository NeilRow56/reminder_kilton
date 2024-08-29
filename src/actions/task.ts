"use server";

import db from "@/lib/db";
import { wait } from "@/lib/wait";
import {
  CreateTaskSchema,
  CreateTaskSchemaType,
  DeleteTaskSchemaType,
} from "@/schemas/task";
import { currentUser } from "@clerk/nextjs/server";

import { redirect } from "next/navigation";

export const createTask = async (values: CreateTaskSchemaType) => {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }
  const validatedFields = CreateTaskSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { content, expiresAt, collectionId } = validatedFields.data;
  // To check disabled and "spinner"
  // await wait(5000);

  return await db.task.create({
    data: {
      userId: user.id,
      content,
      expiresAt,
      collection: {
        connect: {
          id: collectionId,
        },
      },
    },
  });
};

export async function setTaskToDone(id: string) {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return await db.task.update({
    where: {
      id: id,
    },
    data: {
      done: true,
    },
  });
}
