import { Effect } from "effect";
import { type Submission } from "@conform-to/react";
import { type ZodTypeAny } from "zod";
import { parse } from "@conform-to/zod";

export class FormDataError {
  readonly _tag = "FormDataError";
}

export class ValidationError {
  readonly _tag = "ValidationError";
  readonly submission: Submission<any>;
  constructor(submission: Submission<any>) {
    this.submission = submission;
  }
}

export function formData(request: Request) {
  return Effect.tryPromise({
    try: () => request.formData(),
    catch: (unknown) => new FormDataError(),
  });
}

export function parseData(formData: FormData, schema: ZodTypeAny) {
  const submission = parse(formData, { schema });
  if (!submission.value) {
    return Effect.fail(new ValidationError(submission));
  }
  return Effect.succeed(submission);
}
