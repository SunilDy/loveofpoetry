import UserTitle from '@/models/UserTitles';
import type { NextApiRequest, NextApiResponse } from 'next'
import connectMongo from '@/lib/connectMongo';
import { getServerSession } from "next-auth";
import { authOptions } from '@/pages/api/auth/[...nextauth]';

type Data = {
  message: string,
  status?: string,
  comment?: any;
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

      let commentId = req.body.commentId;
      let commentBody = req.body.commentBody;

      let subcomment = {
        date: new Date(),
        username: session?.user?.name,
        avatar: session?.user?.image,
        comment: commentBody
      }

      let comment = await UserTitle.findOneAndUpdate(
        { 'comments._id': commentId },
        {
          $push: {
            'comments.$.subcomments': subcomment
          }
        }
      );

      res.send({
        message: "pushed",
        status: "ok",
      })

    }

}
