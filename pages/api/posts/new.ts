import type { NextApiRequest, NextApiResponse } from 'next'
import connectMongo from '@/lib/connectMongo';
import User, {StudyType, UserType} from '@/models/User';
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import UserTitle from '@/models/UserTitles';

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

        let linesArray = req.body.body.split(/\r?\n/)
        // let splits = body.split(/\r?\n/)
        // console.log(linesArray)

        let existsAlready = []
        if(session?.user)
        existsAlready = await UserTitle.findOne({ 
          title: req.body.title,
          author_email: session.user.email
         })

         let newPostObject = {
          title: req.body.title,
          author_name: session?.user?.name,
          author_email: session?.user?.email,
          avatar: session?.user?.image,
          lines: linesArray,
          linesCount: linesArray.length,
          created_on: Date.now(),
          likes: 0,
          comments: []
         }

         let responseObject = {}
         if(existsAlready) {
            responseObject = {
              message: 'You already have the post by the same title.',
              status: 'err',
              statusCode: 403
            }
         } else {
          let newPost = new UserTitle(newPostObject)
          await newPost.save()
            responseObject = {
              message: 'ok',
              status: 'ok',
              statusCode: 201
            }
         }

        //  @ts-ignore
        res.status(responseObject.statusCode).send(responseObject)

    }
}
