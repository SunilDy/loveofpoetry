import type { NextApiRequest, NextApiResponse } from 'next'
import connectMongo from '@/lib/connectMongo';
import User, { StudyType} from '@/models/User';
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

type Data = {
  message: string,
  status: string,
  studies?: any,
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

        let user = [];

        if (session?.user)
            user = await User.findOne(
            { email: session?.user.email, "studies.title": req.body.studyTitle },
            { "studies.$": 1 }
            );
        if (!user) {
            res.status(200).send({
                message: "Study Title Could Not Be Found",
                status: "err",
            })
        } else {
            res.status(200).send({
                message: "ok",
                status: "ok",
                studies: user.studies
            })
        }

    }
    if(req.method === 'PATCH') {
        const session = await getServerSession(req, res, authOptions);
        console.log("CONNECTING TO MONGO");
        await connectMongo();
        console.log("CONNECTED TO MONGO");

        let payload = JSON.parse(req.body.payload)
        console.log(payload)
        payload.lastUpdatedAt = Date.now()

        let updatedUser = []
        if(session?.user)
        updatedUser = await User.findOneAndUpdate(
            { email: session?.user.email , 'studies.title': payload.title},
            { $set: { 'studies.$': payload } },
            { new: true }
        )

        if(!updatedUser) {
            res.status(403).send({
                message: "Study Title Could Not Be Found",
                status: "err",
            })
        }
        let payloadToSend = updatedUser.studies.filter((study: StudyType) => study.title === payload.title)

        res.status(200).send({
            message: "ok",
            status: "ok",
        })

    }
}
