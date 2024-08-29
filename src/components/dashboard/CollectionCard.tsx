"use client";

import { Collection, Task } from "@prisma/client";
import React, { useMemo, useState, useTransition } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "../ui/button";
import { CollectionColor, CollectionColors } from "@/lib/constants";
import { cn } from "@/lib/utils";
import {
  ArrowBigDown,
  ArrowBigUp,
  Divide,
  PlusIcon,
  Trash,
} from "lucide-react";
import { Progress } from "../ui/progress";
import { Separator } from "../ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { deleteCollection } from "@/actions/collection";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import CreateTaskDialog from "./CreateTaskDialog";
import TaskCard from "./TaskCard";

interface CollectionCardProps {
  collection: Collection & {
    tasks: Task[];
  };
}

export default function CollectionCard({ collection }: CollectionCardProps) {
  const [isLoading, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();

  const [showCreateModal, setShowCreateModal] = useState(false);

  const removeCollection = async () => {
    try {
      await deleteCollection(collection.id);
      toast.success("Collection deleted");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const totalTasks = collection.tasks.length;

  const tasksDone = useMemo(() => {
    return collection.tasks.filter((task) => task.done).length;
  }, [collection.tasks]);

  const progress = totalTasks === 0 ? 0 : (tasksDone / totalTasks) * 100;

  return (
    <>
      <CreateTaskDialog
        open={showCreateModal}
        setOpen={setShowCreateModal}
        collection={collection}
      />
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <div
            className={cn(
              "flex w-full justify-between p-6 rounded-lg my-2 text-white font-bold",
              isOpen && "rounded-b-none",
              CollectionColors[collection.color as CollectionColor]
            )}
          >
            <span>{collection.name}</span>
            {!isOpen && <ArrowBigDown className="size=6" />}
            {isOpen && <ArrowBigUp className="size=6" />}
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="flex rounded-b-md flex-col shadow-lg ">
          {collection.tasks.length === 0 && (
            <Button
              variant="ghost"
              className="flex items-center justify-center gap-1 px-8 py-12 rounded-none"
              onClick={() => setShowCreateModal(true)}
            >
              <p>
                There are no tasks yet:
                <span
                  className={cn(
                    "text-sm bg-clip-text text-transparent ml-1",
                    CollectionColors[collection.color as CollectionColor]
                  )}
                >
                  Create one
                </span>
              </p>
            </Button>
          )}
          {collection.tasks.length > 0 && (
            <>
              <Progress className="rounded-none " value={progress} />
              <div className="p-4 gap-3 flex flex-col">
                {collection.tasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </>
          )}
          <Separator />
          <footer className="h-[40px] p-[2px] text-xs text-neutral-500 flex justify-between items-center">
            <p>
              Created At: {collection.createdAt.toLocaleDateString("en-GB")}
            </p>
            {isLoading && <div>Deleting...</div>}
            {!isLoading && (
              <div>
                <Button
                  onClick={() => setShowCreateModal(true)}
                  size="icon"
                  variant="ghost"
                >
                  <PlusIcon className="size-4 text-primary" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="icon" variant="ghost">
                      <Trash className="size-4 text-red-500" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your account and remove your data from our
                        servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => {
                          startTransition(removeCollection);
                        }}
                      >
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </footer>
        </CollapsibleContent>
      </Collapsible>
    </>
  );
}
