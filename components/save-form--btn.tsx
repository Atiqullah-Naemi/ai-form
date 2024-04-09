import React, { useTransition } from "react";
import { Button } from "./ui/button";
import { SaveIcon } from "lucide-react";
import useDesigner from "../hooks/useDesigner";
import { updateFormContent } from "@/app/actions/form";
import { toast } from "./ui/use-toast";
import { LoaderCircle } from "lucide-react";

function SaveFormBtn({ id }: { id: number }) {
  const { elements } = useDesigner();
  const [loading, startTransition] = useTransition();

  const onUpdateFormContent = async () => {
    try {
      const jsonElements = JSON.stringify(elements);
      await updateFormContent(id, jsonElements);
      toast({
        title: "Success",
        description: "Your form has been saved",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    }
  };
  return (
    <Button
      variant={"outline"}
      className="gap-2"
      disabled={loading}
      onClick={() => {
        startTransition(onUpdateFormContent);
      }}
    >
      <SaveIcon className="h-4 w-4" />
      Save
      {loading && <LoaderCircle className="animate-spin" />}
    </Button>
  );
}

export default SaveFormBtn;
