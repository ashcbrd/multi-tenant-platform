// "use server";
// import { Pinecone } from "@pinecone-database/pinecone";
// import { OpenAIApi, Configuration } from "openai-edge";

// export type Metadata = {
//   url: string;
//   text: string;
//   chunk: string;
// };
// export default async function query(input: string, namespace: string) {
//   // connect to pinecone
//   const pinecone = new Pinecone({
//     apiKey: process.env.PINECONE_API_KEY!,
//     environment: process.env.PINECONE_ENVIRONMENT!,
//   });
//   const index = pinecone.index(process.env.PINECONE_INDEX!);
//   console.log(index);

//   // query;
//   const embedding = await getEmbeddings(input);

//   const response = await index.namespace(namespace).query({
//     topK: 3,
//     vector: embedding,
//     includeMetadata: true,
//     includeValues: true,
//   });
//   console.log("This is from the pinecone query:", response);

//   return "hi";
// }

// const config = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY!,
// });
// const openai = new OpenAIApi(config);

// export async function getEmbeddings(input: string) {
//   try {
//     const response = await openai.createEmbedding({
//       model: "text-embedding-ada-002",
//       input: "Hello",
//     });
//     const result = await response.json();
//     // console.log("This is the result from embeddings.ts", result.data[0]);
//     return result.data[0].embedding as number[]; //returning the vector embneddings of the message query
//   } catch (e) {
//     console.log("Error calling OpenAI embedding API: ", e);

//     throw new Error(`Error calling OpenAI embedding API: ${e}`);
//   }
// }
