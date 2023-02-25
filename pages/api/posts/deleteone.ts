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
        let userTitle = await UserTitle.findOneAndDelete({
            title: req.body.title,
            author_email: session?.user?.email
        });

        console.log(userTitle)

            res.send({
                message: "ok",
                status: 'ok',
            })

    }
}
