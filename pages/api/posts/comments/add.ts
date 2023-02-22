import UserTitle from '@/models/UserTitles';
import type { NextApiRequest, NextApiResponse } from 'next'
import connectMongo from '@/lib/connectMongo';
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";

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

      let titleId = req.body.titleId;
      let commentBody = req.body.commentBody;
    //   console.log(titleId)

      let comment = {}
      if(session?.user)
        comment = {
          date: new Date(),
          username: session.user.name,
          avatar: session.user.image,
          comment: commentBody
        }

      // console.log(comment)
      let title = await UserTitle.findByIdAndUpdate(
        titleId,
        { $push: { comments: comment } },
        { new: true }
      )

      res.send({
        message: "pushed",
        status: "ok",
        comments: title.comments
      })

    }

}
