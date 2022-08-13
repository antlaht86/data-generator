// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Schema } from "json-schema-faker";
import type { NextApiRequest, NextApiResponse } from "next";
import { getData } from "../../services/json-schema-faker";
import { convertFileToSchema } from "../../services/typescript-json-schema";
import fs from "fs";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.body.value && req.body.id && req.body.typeName) {
    try {
      const fileName = "./services/" + req.body.id + ".ts";
      fs.writeFile(fileName, req.body.value, function () {
        const jsonSchema = convertFileToSchema(
          req.body.id,
          req.body.typeName
        ) as Schema;
        const data = getData(jsonSchema ?? {});

        try {
          fs.unlinkSync(fileName);
          console.log("➡️ fileName: ", fileName);

          //file removed
        } catch (err) {
          console.error(err);
        }

        return res.status(200).json(data);
      });
    } catch (error) {
      return res.status(400).send("something went wrong");
    }
  } else {
    return res.status(404).send("Not Found");
  }
}
