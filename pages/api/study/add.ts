import type { NextApiRequest, NextApiResponse } from 'next'
import connectMongo from '@/lib/connectMongo';
import User, {StudyType, UserType} from '@/models/User';
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import axios from 'axios';
import Title from '@/models/Title';

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
    if(req.method === 'POST') {
        const session = await getServerSession(req, res, authOptions);
        console.log("CONNECTING TO MONGO");
        await connectMongo();
        console.log("CONNECTED TO MONGO");

        let poem = await Title.findOne({ title: req.body.title, author: req.body.author })


        let newStudy: StudyType = {
            title: poem.title,
            author: poem.author,
            lines: [],
            notes: "",
            lastUpdatedAt: new Date()
        }

        for(let i = 0; i < poem.lines.length; i++) {
            if(poem.lines[i] !== "") {
                let newLine = {
                    line: poem.lines[i],
                    comment: ""
                }
                newStudy.lines.push(newLine)
            }
        }
        // console.log(newStudy)
        if(session?.user)
            User.findOne(
                {email: session.user.email},
                async (err: any, user: UserType) => {

                    let alreadyExists = false
                    for(let i = 0; i < user.studies.length; i++) {
                        if(user.studies[i].title === req.body.title && user.studies[i].author === req.body.author) {
                            alreadyExists = true
                        }
                    }

                    if(user.studies.length < 1) {
                        if(session.user)
                        User.findOneAndUpdate(
                            { email: session.user.email },
                            { $addToSet: { studies: newStudy } },
                            { new: true },
                            (err: any, user: UserType) => {
                                if(err) {
                                    res.status(403).send({
                                        message: "User not found",
                                        status: "err"
                                    })
                                } else { 
                                    res.status(201).send({
                                        message: "ok",
                                        status: "ok",
                                        study: user.studies
                                    })
                                }
                            }
                        )
                    } else {
                        if(!alreadyExists) {
                            user.studies.push(newStudy)
    
                            // @ts-ignore
                            user.save((err) => {
                                if(err) {
                                    res.status(403).send({
                                        message: "User not found",
                                        status: "err"
                                    })
                                } else {
                                    // Operate Here
                                    res.status(201).send({
                                        message: "ok",
                                        status: "ok",
                                        study: user.studies,
                                        alreadyExists,
                                    })
                                }
                            })
                        } else {
                            res.status(201).send({
                                message: "ok",
                                status: "ok",
                                study: user.studies,
                                alreadyExists,
                            })
                        }
                    }
                }
            )
    }
}
