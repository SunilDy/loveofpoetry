import type { NextApiRequest, NextApiResponse } from 'next'
import connectMongo from '@/lib/connectMongo';
import Poem from '@/models/Poem'

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
      let poemName = req.body.poemName;
      console.log(poemName)
      try {
        let poem = await Poem.findOne({name: poemName})
        if(!poem) {
          res.status(200).send({
              message: 'non',
              status: 'err'
          })
        } else {
          res.status(200).send({
              message: 'ok',
              status: 'ok',
              poem
          })
        }
      } catch(err) {
        res.status(200).send({
            message: 'err',
            status: 'err',
        })
      }
    }
}
