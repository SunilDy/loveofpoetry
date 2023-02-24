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
    if(req.method === 'GET') {
        const session = await getServerSession(req, res, authOptions);
        console.log("CONNECTING TO MONGO");
        await connectMongo();
        console.log("CONNECTED TO MONGO");

        let user = await User.findById(req.body.uid)
        
        let responseObject: Data | {} = {}
        if(!user) {
            responseObject = {
                message: "User Could Not Be Found / Unauthorised",
                status: 'err',
                statusCode: 403
            }
        } 
        else {
            responseObject = {
                status: 'err',
                statusCode: 200,
                user
            }
        }
        // @ts-ignore
        res.status(responseObject.statusCode).send(responseObject)
    }
}
