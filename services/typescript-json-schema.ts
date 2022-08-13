import { resolve } from "path";

import * as TJS from "typescript-json-schema";

const settings: TJS.PartialArgs = {
  required: true,
  strictNullChecks: true,
  uniqueNames: true,
};

// optionally pass ts compiler options
const compilerOptions: TJS.CompilerOptions = {
  strictNullChecks: true,
};

export function convertFileToSchema(id: string, typeName: string) {
  const program = TJS.getProgramFromFiles(
    [resolve("services", id + ".ts")],
    compilerOptions
  );
  return TJS.generateSchema(program, typeName, settings);
}
// We can either get the schema for one file and one type...
