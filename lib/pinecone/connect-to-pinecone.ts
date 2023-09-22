"use server";
import { Pinecone } from "@pinecone-database/pinecone";

export async function connectPinecone() {
  const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!,
    environment: process.env.PINECONE_ENVIRONMENT!,
  });
  const index = pinecone.index(process.env.PINECONE_INDEX!);
  return index;
}
