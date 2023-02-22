import { UserTitleType } from '@/models/UserTitles';
import type { NextApiRequest, NextApiResponse } from 'next'
import connectMongo from '@/lib/connectMongo';
import UserTitle from '@/models/UserTitles';

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
        console.log("CONNECTING TO MONGO");
        await connectMongo();
        console.log("CONNECTED TO MONGO");

        let userTitle = await UserTitle.findById(req.body.postId).select('comments').sort({date: -1})

        console.log("userTitle", userTitle)

        if(!userTitle)
            res.send({
                message: "Post Could Not Be Found",
                status: 'err'
            })
        else
            res.send({
                message: "Post Could Not Be Found",
                status: 'err',
                userTitle
            })

    }
}
