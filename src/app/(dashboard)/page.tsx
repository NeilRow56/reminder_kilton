import CollectionCard from "@/components/dashboard/CollectionCard";
import { CreateCollectionButton } from "@/components/dashboard/CreateCollectionButton";
import { Spinner } from "@/components/shared/Spinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import db from "@/lib/db";
import { wait } from "@/lib/wait";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function HomePage() {
  return (
    <>
      <Suspense fallback={<WelcomeMsgFallback />}>
        <WelcomeMsg />
      </Suspense>
      <Suspense fallback={<WelcomeMsgFallback />}>
        <CollectionList />
      </Suspense>
    </>
  );
}

async function WelcomeMsg() {
  const user = await currentUser();

  if (!user) {
    return <div>Error</div>;
  }

  return (
    <div className="flex w-full mb-12">
      <h1 className="text-4xl font-bold">
        Welcome, <br />
        {user.firstName} {user.lastName}
      </h1>
    </div>
  );
}

function WelcomeMsgFallback() {
  return (
    <div className="flex w-full mb-12">
      <Spinner size="lg" />
    </div>
  );
}

async function CollectionList() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const collections = await db.collection.findMany({
    include: {
      tasks: true,
    },
    where: {
      userId: user?.id,
    },
  });

  if (collections.length === 0) {
    return (
      <div className="flex flex-col gap-5">
        <Alert>
          <AlertTitle>😰 There are no collections yet!</AlertTitle>
          <AlertDescription>
            Create a collection to get started
          </AlertDescription>
        </Alert>
        <CreateCollectionButton text="Create Collection" />
      </div>
    );
  }

  return (
    <>
      <CreateCollectionButton text="Create Collection" />
      <div className="flex flex-col gap-4">
        {collections.map((collection) => (
          <CollectionCard key={collection.id} collection={collection} />
        ))}
      </div>
    </>
  );
}
