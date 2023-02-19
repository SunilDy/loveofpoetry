import type { NextApiRequest, NextApiResponse } from 'next'
import connectMongo from '@/lib/connectMongo';
import Title from '@/models/Title';

type Data = {
  message: string,
  status: string,
  poem?: any
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
    if(req.method === 'POST') {
        console.log("CONNECTING TO MONGO");
        await connectMongo();
        console.log("CONNECTED TO MONGO");
        let poemName = req.body.title;
        // console.log(poemName)

        let title = await Title.findOne({ title: poemName })

        res.status(200).send({
          message: 'ok',
          status: 'ok',
          poem: title
        })

    }
}