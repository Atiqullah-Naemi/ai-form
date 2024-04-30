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
  const promptExplanation =
    "Based on the description, generate a survey object with 3 fields: name(string) for the form, description(string) of the form and a questions array where every element has 3 fields: label and the fieldType and fieldType can be of these options RadioGroup, Select, Input, Textarea, Switch; and return it in json format. For RadioGroup, and Select types also return fieldOptions array with label and value fields. For example, for RadioGroup, and Select types, the field options array can be [{label: 'Yes', value: 'yes'}, {label: 'No', value: 'no'}] and for Input, Textarea, and Switch types, the fieldOptions array can be empty. For example, for Input, Textarea, and Switch types, the fieldOptions array can be [] and Input should also have type and it should be either text, email, or passsord and Input should not have field options";
  const description = formData.get("description");

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `${description} ${promptExplanation}`,
        },
      ],
    });

    const responseObj = JSON.parse(response.choices[0].message.content!);

    return {
      message: "success",
      data: responseObj,
      rowData: response,
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
