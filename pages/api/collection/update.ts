import type { NextApiRequest, NextApiResponse } from "next";
import connectMongo from "@/lib/connectMongo";
import User, { UserType } from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

type Data = {
  message: string;
  status?: string;
  collections?: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "PATCH") {
    const session = await getServerSession(req, res, authOptions);
    console.log("CONNECTING TO MONGO");
    await connectMongo();
    console.log("CONNECTED TO MONGO");

    if (session?.user)
      User.findOneAndUpdate(
        { email: session?.user.email, "collections.name": req.body.collection },
        { $pull: { "collections.$.titles": { title: req.body.title } } },
        { new: true },
        (err: any, doc: any) => {
          if (err) {
            res.status(403).send({
              message: "err",
              status: "err",
            });
          } else {
            res.status(201).send({
              message: "Updated",
              status: "ok",
              collections: doc.collections,
            });
          }
        }
      );
  }
  if (req.method === "POST") {
    const session = await getServerSession(req, res, authOptions);
    console.log("CONNECTING TO MONGO");
    await connectMongo();
    console.log("CONNECTED TO MONGO");

    if (session?.user)
      User.findOneAndUpdate(
        { email: session?.user.email },
        { $pull: { collections: { name: req.body.collectionName } } },
        { new: true },
        (err: any, doc: UserType) => {
          if (err) {
            res.status(403).send({
              message: "err",
              status: "err",
            });
          } else {
            res.status(201).send({
              message: "Updated",
              status: "ok",
              collections: doc.collections,
            });
          }
        }
      );
  }
}
