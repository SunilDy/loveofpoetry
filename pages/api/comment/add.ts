import type { NextApiRequest, NextApiResponse } from 'next'
import connectMongo from '@/lib/connectMongo';
import Poem from '@/models/Poem'
import Title from '@/models/Title';
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

type Data = {
  message: string,
  status?: string,
  poems?: any,
  comments?: any;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
    if(req.method === 'POST') {
      const session = await getServerSession(req, res, authOptions);
      console.log("CONNECTING TO MONGO");
      await connectMongo();
      console.log("CONNECTED TO MONGO");
      let poemName = req.body.poemName;
      let comment = {}
      if(session?.user)
        comment = {
          date: Date.now(),
          username: session.user.name,
          avatar: session.user.image,
          comment: req.body.comment
        }

      // console.log(comment)
      let poem = await Title.findOneAndUpdate(
        { title: poemName },
        { $push: { comments: comment } },
        { new: true }
      )

      res.send({
        message: "pushed",
        status: "ok",
        comments: poem.comments
      })

    }

}
