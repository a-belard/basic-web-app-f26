// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Data = string;

import QueryProcessor from "../../utils/QueryProcessor";
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  console.log(req.url);
  
  // q is missing on a bare /api request and an array when it is repeated.
  const q = req.query.q;
  const query = Array.isArray(q) ? q.join(" ") : q;

  if (!query) {
    res.status(200).send("Ask a question with /api?q=<question>, for example /api?q=shakespeare");
    return;
  }

  const response = QueryProcessor(query);

  res.status(200).send(response);
}
