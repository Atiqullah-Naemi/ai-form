import { getFormContentByUrl } from "@/app/actions/form";
import { FormElementInstance } from "@/components/form-elements";
import FormSubmitComponent from "@/components/form-submit-component";
import React from "react";

async function SubmitPage({
  params,
}: {
  params: {
    formUrl: string;
  };
}) {
  const form = await getFormContentByUrl(params.formUrl);

  if (!form) {
    throw new Error("form not found");
  }

  const formContent = JSON.parse(
    form.content as string
  ) as FormElementInstance[];

  return <FormSubmitComponent formUrl={params.formUrl} content={formContent} />;
}

export default SubmitPage;
