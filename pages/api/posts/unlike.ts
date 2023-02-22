import type { NextApiRequest, NextApiResponse } from 'next'
import connectMongo from '@/lib/connectMongo';
import User, {StudyType, UserType} from '@/models/User';
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import UserTitle from '@/models/UserTitles';

type Data = {
  message: string,
  status: string,
  statusCode: number,
  dummy?: any
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

        let title = req.body.title
        let author_email = req.body.author_email

        let updatedUser = await User.findOneAndUpdate(
            { email: session?.user?.email },
            { $pull: {likedUserTitles: { author_email, title }} },
            { new: true }
        )

        await UserTitle.findOneAndUpdate(
            { author_email, title },
            { $pull: { likes: session?.user?.email } },
            { new: true }
        )

        let responseObject = {}
        if(!updatedUser) {
            responseObject = {
                message: 'Could Not Update',
                status: 'err',
                statusCode: 403
            }
        } else {
            responseObject = {
                message: 'ok',
                status: 'ok',
                statusCode: 201,
                dummy: updatedUser
            }
        }

        // @ts-ignore
        res.status(responseObject.statusCode).send(responseObject)

    }
}
