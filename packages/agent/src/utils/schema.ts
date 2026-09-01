import { SchemaValidationError } from "../core/errors";
import type { JsonSchema, JsonValue } from "../core/types";

/**
 * Validates common JSON Schema fields used by SDK tools and commands.
 *
 * Example:
 * ```ts
 * validateJsonSchema({ type: "object", required: ["id"] }, { id: "42" });
 * ```
 */
export function validateJsonSchema(schema: JsonSchema | undefined, value: unknown): void {
  if (!schema) {
    return;
  }

  validateValue(schema, value, "$");
}

/**
 * Parses a JSON object from model text and optionally validates it.
 *
 * Example:
 * ```ts
 * parseStructuredOutput('{"ok":true}', { type: "object" });
 * ```
 */
export function parseStructuredOutput<T = unknown>(text: string, schema?: JsonSchema): T {
  const jsonText = extractJsonText(text);
  let parsed: unknown;

  try {
    parsed = JSON.parse(jsonText);
  } catch (error) {
    throw new SchemaValidationError(
      `Model output is not valid JSON: ${error instanceof Error ? error.message : String(error)}`,
    );
  }

  validateJsonSchema(schema, parsed);
  return parsed as T;
}

function validateValue(schema: JsonSchema, value: unknown, path: string): void {
  if (schema.enum && !schema.enum.some((item) => deepEqual(item, value))) {
    throw new SchemaValidationError(`${path} must be one of ${JSON.stringify(schema.enum)}.`);
  }

  if (schema.type) {
    validateType(schema.type, value, path);
  }

  if (schema.type === "object" || schema.properties || schema.required) {
    validateObject(schema, value, path);
  }

  if (schema.type === "array" || schema.items) {
    validateArray(schema, value, path);
  }
}

function validateType(type: JsonSchema["type"], value: unknown, path: string): void {
  const actual = Array.isArray(value) ? "array" : value === null ? "null" : typeof value;

  if (type === "integer") {
    if (typeof value !== "number" || !Number.isInteger(value)) {
      throw new SchemaValidationError(`${path} must be an integer.`);
    }
    return;
  }

  if (type && actual !== type) {
    throw new SchemaValidationError(`${path} must be ${type}, received ${actual}.`);
  }
}

function validateObject(schema: JsonSchema, value: unknown, path: string): void {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new SchemaValidationError(`${path} must be an object.`);
  }

  const record = value as Record<string, unknown>;
  for (const key of schema.required ?? []) {
    if (!(key in record)) {
      throw new SchemaValidationError(`${path}.${key} is required.`);
    }
  }

  for (const [key, childSchema] of Object.entries(schema.properties ?? {})) {
    if (key in record) {
      validateValue(childSchema, record[key], `${path}.${key}`);
    }
  }

  if (schema.additionalProperties === false) {
    const allowed = new Set(Object.keys(schema.properties ?? {}));
    for (const key of Object.keys(record)) {
      if (!allowed.has(key)) {
        throw new SchemaValidationError(`${path}.${key} is not allowed.`);
      }
    }
  }
}

function validateArray(schema: JsonSchema, value: unknown, path: string): void {
  if (!Array.isArray(value)) {
    throw new SchemaValidationError(`${path} must be an array.`);
  }

  if (schema.items) {
    value.forEach((item, index) => validateValue(schema.items as JsonSchema, item, `${path}[${index}]`));
  }
}

function extractJsonText(text: string): string {
  const trimmed = text.trim();
  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    return trimmed;
  }

  // Models sometimes wrap JSON with prose. Pull the broadest JSON-looking range.
  const objectStart = trimmed.indexOf("{");
  const objectEnd = trimmed.lastIndexOf("}");
  if (objectStart >= 0 && objectEnd > objectStart) {
    return trimmed.slice(objectStart, objectEnd + 1);
  }

  const arrayStart = trimmed.indexOf("[");
  const arrayEnd = trimmed.lastIndexOf("]");
  if (arrayStart >= 0 && arrayEnd > arrayStart) {
    return trimmed.slice(arrayStart, arrayEnd + 1);
  }

  return trimmed;
}

function deepEqual(a: JsonValue, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}
