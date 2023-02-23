import { UserTitleType } from '@/models/UserTitles';
import type { NextApiRequest, NextApiResponse } from 'next'
import connectMongo from '@/lib/connectMongo';
import UserTitle from '@/models/UserTitles';
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

type Data = {
  message: string;
  status: string;
  userTitle?: UserTitleType
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

        // let user = await User.findOne({ email: session?.user?.email })
        let userTitle = await UserTitle.findById(req.body.postId);

        let title = userTitle._doc
        
        if(userTitle.likes.includes(session?.user?.email)) title.isLiked = true
        else if(!userTitle.likes.includes(session?.user?.email)) title.isLiked = false
        
        // console.log("title", title)
        // console.log("userTitle", userTitle)

        if(!userTitle)
            res.send({
                message: "Post Could Not Be Found",
                status: 'err'
            })
        else
            res.send({
                message: "ok",
                status: 'ok',
                userTitle: title
            })

    }
}
