import type { NextApiRequest, NextApiResponse } from 'next'
import connectMongo from '@/lib/connectMongo';
import User, { UserType } from '@/models/User'
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

type Data = {
  message: string,
  status?: string,
  collections?: any;
  poemAlreadyInList?: boolean
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
    
        let user: UserType | null
        if(session?.user) {
            user = await User.findOne({email: session.user.email})
            if(!user) {
                res.status(403).send({
                    message: "not-authorised",
                    status: "err"
                })
            } else {
                let alreadyexists = false
                for(let i = 0; i < user.collections.length; i++) {
                    if(user.collections[i].name === req.body.collectionName) {
                        alreadyexists = true
                    }
                }
                if(alreadyexists) {
                    let poemAlreadyInList = false
                    if(session.user)
                    for(let i = 0; i < user.collections.length; i++) {
                        if(user.collections[i].titles.includes(req.body.poemTitle)) poemAlreadyInList = true
                    }
                    User.updateOne(
                        {name: session.user.name, collections: { $elemMatch: {name: req.body.collectionName} } },
                        { $addToSet: { "collections.$.titles": req.body.poemTitle } },
                        (err: any, user: any) => {
                            if(err) {
                                res.status(201).send({
                                    message: "Could not update!",
                                    status: "err"
                                })
                            } else {
                                res.status(201).send({
                                    message: "Updated",
                                    status: "ok",
                                    collections: user.collections,
                                    poemAlreadyInList
                                })
                            }
                        }
                    )
                } else if(!alreadyexists) {
                    let newCollection = {
                        name: req.body.collectionName,
                        titles: [req.body.poemTitle]
                    }
                    if(session.user)
                    User.findOneAndUpdate(
                        {email: session.user.email},
                        {$addToSet: {collections: newCollection}},
                        {new: true},
                        (err, user) => {
                            if(err) {
                                res.status(201).send({
                                    message: "Could not create a new collection",
                                    status: "err"
                                })
                            } else {
                                res.status(201).send({
                                    message: "Updated",
                                    status: "ok",
                                    collections: user.collections,
                                    poemAlreadyInList: false
                                })
                            }
                        }
                    )
                }
            }
        }
        

    }

}
