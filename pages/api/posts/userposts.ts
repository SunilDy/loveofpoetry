import type { NextApiRequest, NextApiResponse } from 'next'
import connectMongo from '@/lib/connectMongo';
import User, {StudyType, UserType} from '@/models/User';
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import UserTitle from '@/models/UserTitles';

type Data = {
  message: string,
  status: string,
    userPosts?: any
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
    if(req.method === 'GET') {
        const session = await getServerSession(req, res, authOptions);
        console.log("CONNECTING TO MONGO");
        await connectMongo();
        console.log("CONNECTED TO MONGO");

        let userPosts = await UserTitle.find({
            author_email: session?.user?.email,
            author_name: session?.user?.name
        })

        let responseObject = {}
        if(userPosts.length < 1) {
            responseObject = {
                message: "No posts yet!",
                status: 'err',
                userPosts
            }
        } else {
            responseObject = {
                message: "ok",
                status: 'ok',
                userPosts
            }
        }

        //  @ts-ignore
        res.status(200).send(responseObject)

    }
}
