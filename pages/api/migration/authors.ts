import type { NextApiRequest, NextApiResponse } from 'next'
import connectMongo from '@/lib/connectMongo';
import Author from '@/models/Author';
import axios from 'axios';

type Data = {
  message: string,
  status: string,
  likedPoems?: any
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

    if(req.method === 'GET') {
        console.log("CONNECTING TO MONGO");
        await connectMongo();
        console.log("CONNECTED TO MONGO");

        let authorsRes = await axios.get(`https://poetrydb.org/author`)
        let authors = authorsRes.data.authors

        for(let i = 0; i < authors.length; i++) {

            let authorName = ""

            if (authors[i] === "Ann Taylor") {
                authorName = "Ann Taylor (poet)";
              } else if (authors[i] === "Edward Fitzgerald") {
                authorName = "Edward FitzGerald (poet)";
              } else if (authors[i] === "Edward Thomas") {
                authorName = "Edward Thomas (poet)";
              } else if (authors[i] === "James Thomson") {
                authorName = "James Thomson (poet, born 1700)";
              } else if (authors[i] === "Jane Taylor") {
                authorName = "Jane Taylor (poet)";
              } else if (authors[i] === "Major Henry Livingston, Jr.") {
                authorName = "Henry Livingston Jr.";
              } else if (authors[i] === "Oliver Wendell Holmes") {
                authorName = "Oliver Wendell Holmes Sr.";
              } else if (authors[i] === "Richard Lovelace") {
                authorName = "Richard Lovelace (poet)";
              } else if (authors[i] === "Robert Herrick") {
                authorName = "Robert Herrick (poet)";
              } else if (authors[i] === "Robinson") {
                authorName = "Edwin Arlington Robinson";
              } else if (authors[i] === "Sir John Suckling") {
                authorName = "John Suckling (poet)";
              } else if (authors[i] === "Thomas Campbell") {
                authorName = "Thomas Campbell (poet)";
              } else if (authors[i] === "William Browne") {
                authorName = "William Browne (poet)";
              } else if (authors[i] === "Charlotte Smith") {
                authorName = "Charlotte Smith (writer)";
              } else {
                authorName = authors[i];
              }

            let authorMetaRes = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${authorName}`)

            let authorMeta = authorMetaRes.data
            let authorTitlesRes = await axios.get(`https://poetrydb.org/author/${authors[i]}`)
            let authorTitles = authorTitlesRes.data.map((author: any) => author.title)
            
            let ObjectToPush = {}

            if((authorMeta.thumbnail !== undefined) && (authorMeta.originalimage !== undefined)) {
                ObjectToPush = {
                    name: authors[i],
                    images: {
                        thumbnail: authorMeta.thumbnail.source,
                        poster: authorMeta.originalimage.source
                    },
                    description: authorMeta.description,
                    about: authorMeta.extract,
                    titles: authorTitles
                }
            } else {
                ObjectToPush = {
                    name: authors[i],
                    images: {
                        thumbnail: "",
                        poster: ""
                    },
                    description: authorMeta.description,
                    about: authorMeta.extract,
                    titles: authorTitles
                }
            }
            

            let newAuthor = new Author(ObjectToPush)
            await newAuthor.save()
        }

        await res.send({
            message: "Done",
            status: "ok",
        })
    }
}
