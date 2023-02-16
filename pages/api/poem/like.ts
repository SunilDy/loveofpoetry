import type { NextApiRequest, NextApiResponse } from 'next'
import connectMongo from '@/lib/connectMongo';
import User from '@/models/User';
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

type Data = {
  message: string,
  status: string,
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
        
        // Finding The User
        if(session?.user)
        User.findOneAndUpdate(
            {name: session?.user.name},
            {$addToSet: {likedPoems: req.body.poemTitle}},
            {new: false},
            (err, user) => {
                if(err) {
                    res.status(403).send({
                        message: "User not found",
                        status: "err"
                    })
                } else {
                    if(user.likedPoems.includes(req.body.poemTitle)) {
                        res.status(201).send({
                            message: "exists",
                            status: "ok"
                        })
                    } else {
                        res.status(201).send({
                            message: "updated",
                            status: "ok"
                        })
                    }

                    
                }
            }
        )

    }
}
