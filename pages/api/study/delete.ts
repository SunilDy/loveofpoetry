import type { NextApiRequest, NextApiResponse } from 'next'
import connectMongo from '@/lib/connectMongo';
import User, {StudyType, UserType} from '@/models/User';
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import axios from 'axios';

type Data = {
  message: string,
  status: string,
  likedPoems?: any,
  study?: StudyType[],
  user?: UserType,
  alreadyExists?: boolean,
  dummy?: any
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
    if(req.method === 'PATCH') {
        const session = await getServerSession(req, res, authOptions);
        console.log("CONNECTING TO MONGO");
        await connectMongo();
        console.log("CONNECTED TO MONGO");

        let user = []
        if(session?.user)
            user = await User.findOneAndUpdate(
                { email: session.user.email },
                { $pull: { studies: { title: req.body.studyTitle } }}
                )
        
        if(!user) {
            res.status(403).send({
                message: "User not found",
                status: "err"
            })
        }
        res.status(201).send({
            message: "ok",
            status: "ok"
        })
    }
}