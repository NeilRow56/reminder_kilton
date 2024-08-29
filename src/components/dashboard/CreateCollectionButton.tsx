"use client";

import { Loader2 } from "lucide-react";

import { useFormStatus } from "react-dom";
import { Button } from "../ui/button";
import { useState } from "react";
import CreateCollectionSheet from "./CreateCollectionSheet";

export function CreateCollectionButton({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  const handleOpenChange = (open: boolean) => setOpen(open);
  const { pending } = useFormStatus();
  return (
    <div className="w-full rounded-md bg-primary p-[1px]">
      {pending ? (
        <Button disabled>
          <Loader2 className="mr-2 w-4 h-4 animate-spin" />
          Please wait
        </Button>
      ) : (
        <Button
          className="w-full"
          variant="outline"
          onClick={() => setOpen(true)}
        >
          {text}
        </Button>
      )}
      <CreateCollectionSheet open={open} onOpenChange={handleOpenChange} />
    </div>
  );
}
