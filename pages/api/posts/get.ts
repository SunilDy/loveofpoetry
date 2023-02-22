import { UserTitleType } from '@/models/UserTitles';
import type { NextApiRequest, NextApiResponse } from 'next'
import connectMongo from '@/lib/connectMongo';
import User, {StudyType, UserType} from '@/models/User';
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import UserTitle from '@/models/UserTitles';

type Data = {
    nextId: any,
    previousId: any,
  data?:any[],
  likesMapped?: any[]
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

        // let posts = await UserTitle.find({})
        // res.send({
        //     message: 'ok',
        //     status: 'ok',
        //     posts
        // })

        // let cursor = 0
        // if(typeof(req.query.cursor) === 'string')
        // @ts-ignore
        let cursor = +req.query.cursor
        const pageSize = 5
        let skip = (cursor-1)*pageSize
        

        const posts = await UserTitle.find({}).sort({created_on: -1}).skip(skip).limit(pageSize)
        const user = await User.findOne({ email: session?.user?.email })

        let mappedPosts = [...posts]
        if(user.likedUserTitles.length > 0)
          mappedPosts = posts.map((post: any) => {
            let isLiked = user.likedUserTitles.find((likedPost: any) => {
              return likedPost.title === post.title && likedPost.author_email === post.author_email
            }) !== undefined
        
            return {...post._doc, isLiked}
          })
          /*
          * This is the deprecated code -> whats was wrong with it was, with each iteration, the loop was overwriting the isLiked value, causing only the last value in the likedUserTitles to be set as true
          mappedPosts = posts.map((post: any) => {
            let objectToReturn = {}
            for(let i = 0; i < user.likedUserTitles.length; i++) {
              if( (post.title === user.likedUserTitles[i].title) && (post.author_email === user.likedUserTitles[i].author_email) ) objectToReturn = {...post._doc, isLiked: true}
              else objectToReturn = {...post._doc, isLiked: false}
            }
            return objectToReturn
          })
          */

        let collectionLength = await UserTitle.count({})
        console.log(collectionLength)


        let nextCursor = ( cursor*pageSize ) < collectionLength ? cursor+1 : null
        let prevCursor = cursor !== 1 ? cursor : null

        res.send({
            nextId: nextCursor,
            previousId: prevCursor,
            data: mappedPosts,
        })

    }
}
