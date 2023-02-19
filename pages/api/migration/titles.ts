import type { NextApiRequest, NextApiResponse } from 'next'
import connectMongo from '@/lib/connectMongo';
import Author from '@/models/Author';
import Title from '@/models/Title';
import axios from 'axios';

type Data = {
  message: string,
  status: string,
  dummy?: any
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

    if(req.method === 'GET') {
        console.log("CONNECTING TO MONGO");
        await connectMongo();
        console.log("CONNECTED TO MONGO");

        let count = 1;

        const authors = await Author.find({})
        for(let i = 0; i < authors.length; i++) {
            for(let j = 0; j < authors[i].titles.length; j++) {
                
                let title: any = []
                let hasError = false;

                await axios.get(
                    `https://poetrydb.org/title/${authors[i].titles[j]}`
                ).then(res => title = res.data).catch(err => hasError = true)

                let ObjectToPush = {}

                if(Array.isArray(title) && !hasError) {
                    ObjectToPush = {
                        title: title[0].title,
                        author: title[0].author,
                        lines: title[0].lines,
                        comments: [],
                        linesCount: title[0].linecount
                    }
                    let newTitle = new Title(ObjectToPush)
                    await newTitle.save()
                    console.log(`count: ${count}`)
                    count = count + 1
                } 
                else {
                    let author = await Author.findOne({ name: authors[i].name })
                    author.titles = author.titles.filter((title: string) => title !== author.titles[j]);
                    await author.save()
                    console.log(`Removed title -> ${author.titles[j]} xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`)
                }

            }
            console.log(`Done for author: ${authors[i].name} : ${i} ================================`)
        }

        res.send({
            message: "Done",
            status: "ok"
        })

    }
}
