import type { NextApiRequest, NextApiResponse } from 'next'
import connectMongo from '@/lib/connectMongo';
import User from '@/models/User'
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

type Data = {
  message: string,
  status?: string,
  collections?: any;
  length?: any;
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
                (err: any, user: any) => {
                    if(err) {
                        res.send({
                            message: "err",
                            status: "err"
                          })
                    } else {
                        let length = user.collections.length
                        if(length < 1) {
                          let newCollection = {
                            name: "Favorite",
                            titles: []
                          }
                          if(session.user)
                          User.findOneAndUpdate(
                            {email: session.user.email},
                            {$push: {collections: newCollection}},
                            {new: true},
                            (err, user) => {
                              if(err) {
                                res.send({
                                  message: "Could not update",
                                  status: "err",
                                })
                              } else {
                                res.send({
                                  message: "Updated",
                                  status: "ok",
                                  collections: user.collections,
                                })
                              }
                            }
                          )
                        } else {
                          res.send({
                            message: "ok",
                            status: "ok",
                            collections: user.collections,
                          })
                        }
                    }
                }
            )
        

    }

}
