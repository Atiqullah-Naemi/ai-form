"use server";

import { currentUser } from "@clerk/nextjs";
import db from "@/lib/db";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateForm(
  prevState: {
    message: string;
  },
  formData: FormData
) {
  const user = await currentUser();
  if (!user) throw new Error("Please login to proceed");

  const promptExplanation =
    "Based on the description, generate a survey object with 3 fields: name(string) for the form, description(string) of the form and a questions array where every element has 3 fields: label and the fieldType and fieldType can be of these options RadioGroup, Select, Input, Textarea, Switch; and return it in json format. For RadioGroup, and Select types also return fieldOptions array with label and value fields. For example, for RadioGroup, and Select types, the field options array can be [{label: 'Yes', value: 'yes'}, {label: 'No', value: 'no'}] and for Input, Textarea, and Switch types, the fieldOptions array can be empty. For example, for Input, Textarea, and Switch types, the fieldOptions array can be [] and Input should also have type and it should be either text, email, or passsord and Input should not have field options";
  const formDescription = formData.get("description");

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `${formDescription} ${promptExplanation}`,
        },
      ],
    });

    const responseObj = JSON.parse(response.choices[0].message.content!);

    const { name, description } = responseObj;

    const newElements = responseObj.questions.map((q: any) => {
      return {
        id: `${Math.floor(1000 + Math.random() * 9000)}`,
        extraAttributes: {
          label: q.label,
          placeHolder: q.label,
          helperText: "",
          required: false,
        },
        type:
          q.fieldType === "Checkbox"
            ? "CheckboxField"
            : q.fieldType === "Textarea"
            ? "TextAreaField"
            : "TextField",
      };
    });

    const form = await db.form.create({
      data: {
        userId: user.id,
        name,
        description,
        content: JSON.stringify(newElements),
      },
    });

    if (!form) {
      throw new Error("something went wrong");
    }

    return {
      message: "success",
      formId: form.id,
    };
  } catch (e) {
    console.log({ e });
    return {
      message: "Failed to create form",
    };
  }
}

export async function createFormManully(data: {
  name: string;
  description: string;
}) {
  const user = await currentUser();
  if (!user) throw new Error("Please login to proceed");

  const { name, description } = data;

  const form = await db.form.create({
    data: {
      userId: user.id,
      name,
      description,
    },
  });

  if (!form) {
    throw new Error("something went wrong");
  }

  return form.id;
}

export async function getForms() {
  const user = await currentUser();
  if (!user) throw new Error("Please login to proceed");

  return await db.form.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getFormById(id: number) {
  const user = await currentUser();
  if (!user) {
    throw new Error();
  }

  return await db.form.findUnique({
    where: {
      userId: user.id,
      id,
    },
  });
}

export async function updateFormContent(id: number, jsonContent: string) {
  const user = await currentUser();
  if (!user) {
    throw new Error();
  }

  return await db.form.update({
    where: {
      userId: user.id,
      id,
    },
    data: {
      content: jsonContent,
    },
  });
}

export async function publishForm(id: number) {
  const user = await currentUser();
  if (!user) {
    throw new Error();
  }

  return await db.form.update({
    data: {
      published: true,
    },
    where: {
      userId: user.id,
      id,
    },
  });
}

export async function getFormContentByUrl(formUrl: string) {
  return await db.form.findUnique({
    where: {
      shareURL: formUrl,
    },
  });
}

export async function submitForm(formUrl: string, content: string) {
  const res = await db.form.update({
    data: {
      submissions: {
        increment: 1,
      },
      FormSubmissions: {
        create: {
          content,
        },
      },
    },
    where: {
      shareURL: formUrl,
      published: true,
    },
  });

  return res;
}

export async function getFormWithSubmissions(id: number) {
  const user = await currentUser();
  if (!user) {
    throw new Error();
  }

  return await db.form.findUnique({
    where: {
      userId: user.id,
      id,
    },
    include: {
      FormSubmissions: true,
    },
  });
}
