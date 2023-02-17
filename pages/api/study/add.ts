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
    if(req.method === 'POST') {
        const session = await getServerSession(req, res, authOptions);
        console.log("CONNECTING TO MONGO");
        await connectMongo();
        console.log("CONNECTED TO MONGO");

        let poem = await axios.get(`https://poetrydb.org/title/${req.body.title}`)



        let newStudy: StudyType = {
            title: poem.data[0].title,
            author: poem.data[0].author,
            lines: [],
            notes: ""
        }

        for(let i = 0; i < poem.data[0].lines.length; i++) {
            if(poem.data[0].lines[i] !== "") {
                let newLine = {
                    line: poem.data[0].lines[i],
                    comment: ""
                }
                newStudy.lines.push(newLine)
            }
        }
        // console.log(newStudy)
        if(session?.user)
            User.findOne(
                {email: session.user.email},
                // { $addToSet: { studies: newStudy } },
                // {new: false},
                async (err: any, user: UserType) => {

                    let alreadyExists = false
                    for(let i = 0; i < user.studies.length; i++) {
                        if(user.studies[i].title === req.body.title) {
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
