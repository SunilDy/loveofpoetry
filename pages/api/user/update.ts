import type { NextApiRequest, NextApiResponse } from 'next'
import connectMongo from '@/lib/connectMongo';
import User, { UserType} from '@/models/User';
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

type Data = {
  message: string,
  status: string,
  user?: any,
  statusCode: number
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

        let user: any = {}
        if(session?.user)
        user = await User.findOneAndUpdate(
            { email: session.user.email, name: session.user.name },
            { bio: req.body.bio, personalSite: req.body.personalSite }
        )
        
        let responseObject: Data | {} = {}
        if(!user) {
            responseObject = {
                message: "User Could Not Be Found / Unauthorised",
                status: 'err',
                statusCode: 403
            }
        } 
        else {
            console.log(user)
            responseObject = {
                status: 'ok',
                statusCode: 201,
            }
        }
        // @ts-ignore
        res.status(responseObject.statusCode).send(responseObject)
    }
}
