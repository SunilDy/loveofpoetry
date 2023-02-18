import type { NextApiRequest, NextApiResponse } from 'next'
import connectMongo from '@/lib/connectMongo';
import User, { UserType} from '@/models/User';
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

type Data = {
  message: string,
  status: string,
  studies?: any,
  studiesLength?: number;
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
                        res.status(401).send({
                            message: "User Not Found!",
                            status: "err",
                        })
                    } else {

                        let studiesLength = 0
                        let studies: any = []
                        if(user.studies.length < 1) {
                            studiesLength = 0
                        } else {
                            studiesLength = user.studies.length;
                            studies = user.studies.map(study => {
                                return {
                                    title: study.title,
                                    author: study.author,
                                    lastUpdatedAt: study.lastUpdatedAt,
                                    notes: study.notes
                                }
                            })
                        }

                        res.status(200).send({
                            message: "ok",
                            status: "ok",
                            studies,
                            studiesLength
                        })
                    }
                }
            )
    }
}
