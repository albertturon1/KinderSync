import { z } from 'zod';

export interface KnownError<E extends string> {
  type: E;
  raw: unknown;
}

export interface UnknownError {
  type: 'unknown';
  message: string;
  raw: unknown;
}

export type ExtractorSchema = z.ZodType<string>;

export const defaultErrorExtractor = z.object({ code: z.string() }).transform((o) => o.code);

export type NormalizedError<E extends string> = KnownError<E> | UnknownError;

export function createErrorExtractorNormalizer<
  Extractor extends ExtractorSchema
>(extract: Extractor) {
  return function normalize<Errors extends readonly string[]>(
    e: unknown,
    knownErrors: Errors
  ): NormalizedError<Errors[number]> {
    const result = extract.safeParse(e);
    const code = result.success ? result.data : undefined;

    if (code && knownErrors.includes(code as Errors[number])) {
      return {
        type: code as Errors[number],
        raw: e
      };
    }

    return {
      type: "unknown",
      message: code ? `Unexpected error: ${code}` : "Non-standard error thrown",
      raw: e
    };
  };
}