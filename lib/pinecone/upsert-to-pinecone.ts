import { PineconeRecord, RecordMetadata } from "@pinecone-database/pinecone";
import { nanoid } from "nanoid";
import { connectPinecone } from "./connect-to-pinecone";

export async function upsert(
  vector: PineconeRecord<RecordMetadata>[],
  subdomain: string,
) {
  //connect to Pinecone
  // const pinecone = new Pinecone({
  //   apiKey: process.env.PINECONE_API_KEY!,
  //   environment: process.env.PINECONE_ENVIRONMENT!,
  // });

  // const index = pinecone.index(process.env.PINECONE_INDEX!);
  const index = await connectPinecone();

  //create a namespace
  const namespace = index.namespace(subdomain);
  console.log("THIS IS THE NAMESPACE:", namespace);
  const resultFromPinecone = await namespace.upsert(vector);

  return resultFromPinecone;
}

export function prepareData(vector: number[][]) {
  let record: PineconeRecord[] = [];

  for (let i = 0; i < vector.length; i++) {
    let current: PineconeRecord = {
      id: nanoid(7),
      values: vector[i],
    };
    record.push(current);
  }

  return record;
}
