import jsf, { Schema } from "json-schema-faker";

export function getData(val: Schema) {
  const syncValue = jsf.generate(val);
  return syncValue;
}
