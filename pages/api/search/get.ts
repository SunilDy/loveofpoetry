import type { NextApiRequest, NextApiResponse } from 'next'
import connectMongo from '@/lib/connectMongo';
import Title from '@/models/Title';
import UserTitle from '@/models/UserTitles';
import User from '@/models/User';

type Data = {
  message: string,
  status: string,
  statusCode: number,
  titles?: any,
  userTitles?: any,
  users?: any
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | {} >
) {
    if(req.method === 'POST') {
        console.log("CONNECTING TO MONGO");
        await connectMongo();
        console.log("CONNECTED TO MONGO");

        let searchTerm = req.body.searchValue

        let titles = await Title.find({ title: { $regex: searchTerm, $options: 'i' } })
        let titlesMapped = titles.map(title => {
            return { title: title.title, author: title.author }
        })

        let userTitles = await UserTitle.find({ title: { $regex: searchTerm, $options: 'i' } })
        let users = await User.find({ name: { $regex: searchTerm, $options: 'i' } })

        let responseObject: Data | {} = {
            titles: titles ? titles : null,
            userTitles: userTitles ? userTitles : null,
            users: users ? users : null
        }
        // if(!titles) responseObject = {
        //     message: 'No Matches',
        //     status: 'err',
        //     statusCode: 403
        // }
        // else responseObject = {
        //     status: 'ok',
        //     titles: titlesMapped,
        //     statusCode: 200
        // }
        
        // @ts-ignore
        res.status(200).send(responseObject)
    }

}