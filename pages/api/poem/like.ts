import type { NextApiRequest, NextApiResponse } from 'next'
import connectMongo from '@/lib/connectMongo';
import User, {UserType} from '@/models/User';
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

type Data = {
  message: string,
  status: string,
  likedPoems?: any
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
        if(session?.user)
            User.findOne(
                {email: session.user.email},
                (err: any, user: UserType) => {
                    if(err) {
                        res.status(403).send({
                            message: "User not found",
                            status: "err"
                        })
                    } else {
                        res.status(200).send({
                            message: "ok",
                            status: "ok",
                            likedPoems: user.likedPoems
                        })
                    }
                }
            )
    }

    if(req.method === 'POST') {
        const session = await getServerSession(req, res, authOptions);
        console.log("CONNECTING TO MONGO");
        await connectMongo();
        console.log("CONNECTED TO MONGO");
        
        let newLikedPoem = {
            title: req.body.poemTitle,
            author: req.body.author
        }
        // Finding The User
        if(session?.user)
        User.findOneAndUpdate(
            {email: session?.user.email},
            {$addToSet: {likedPoems: {"title": req.body.poemTitle,  "author": req.body.author} }},
            {new: true},
            (err, user) => {
                // console.log(newLikedPoem)
                if(err) {
                    res.status(403).send({
                        message: "User not found",
                        status: "err"
                    })
                } 
                else {
                    let alreadyExists = false;
                    for(let i = 0; i < user.likedPoems.length; i++) {
                        if(user.likedPoems[i].title === req.body.poemTitle) {
                            alreadyExists = true
                        }
                    }
                    // if(user.likedPoems.includes(req.body.poemTitle)) {
                    //     res.status(201).send({
                    //         message: "exists",
                    //         status: "ok"
                    //     })
                    // }

                    if(alreadyExists) {
                        res.status(201).send({
                            message: "exists",
                            status: "ok"
                        })
                    } 
                    else {
                        res.status(201).send({
                            message: "updated",
                            status: "ok"
                        })
                    }
                }
            }
        )

    }

    if(req.method === 'PATCH') {
        const session = await getServerSession(req, res, authOptions);
        console.log("CONNECTING TO MONGO");
        await connectMongo();
        console.log("CONNECTED TO MONGO");
        if(session?.user)
            User.findOneAndUpdate(
                { email: session.user.email },
                { $pull: { likedPoems: { title: req.body.title } } },
                { new: true },
                (err: any, user: UserType) => {
                    if(err) {
                        res.status(403).send({
                            message: "User not found",
                            status: "err"
                        })
                    } else {
                        res.status(200).send({
                            message: "ok",
                            status: "ok",
                            likedPoems: user.likedPoems
                        })
                    }
                }
            )
    }
}
