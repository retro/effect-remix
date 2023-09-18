import { useForm } from "@conform-to/react";
import { parse } from "@conform-to/zod";
import {
  json,
  type ActionFunctionArgs,
  type MetaFunction,
  redirect,
} from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import * as PostSchemas from "~/schemas/post";
import { Effect } from "effect";
import * as Post from "~/domain/post.server";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export async function action({ request }: ActionFunctionArgs) {
  /*const formData = await request.formData();
  console.log(formData);

  const submission = parse(formData, { schema: PostSchemas.Post });

  console.log(submission);

  if (!submission.value || submission.intent !== "submit") {
    return json(submission);
  }

  return redirect("/");*/
  const program = Effect.gen(function* ($) {
    const formData = yield* $(Post.formData(request));
    const parsedData = yield* $(Post.parseData(formData, PostSchemas.Post));
    return parsedData;
  });
  return Effect.runPromise(
    Effect.match(program, {
      onSuccess: (value) => value,
      onFailure: (error) => {
        if (error._tag === "ValidationError") {
          return json(error.submission);
        } else {
          return json({}, { status: 500 });
        }
      },
    })
  );
}

export default function Index() {
  const lastSubmission = useActionData<typeof action>();
  const [form, { title, lead }] = useForm({
    lastSubmission,
    onValidate({ formData }) {
      return parse(formData, { schema: PostSchemas.Post });
    },
  });
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <Form method="post" {...form.props}>
        <div>
          <label>Title</label>
          <input name={title.name} />
          <div>{title.error}</div>
        </div>
        <div>
          <label>Lead</label>
          <textarea name={lead.name} />
          <div>{lead.error}</div>
        </div>
        <button>Post</button>
      </Form>
    </div>
  );
}
