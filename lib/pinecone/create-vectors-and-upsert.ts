"use server";
import {
  Document,
  MarkdownTextSplitter,
} from "@pinecone-database/doc-splitter";
import {
  Pinecone,
  PineconeRecord,
  RecordMetadata,
} from "@pinecone-database/pinecone";
import { SparseValues } from "@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch";
import { getEmbeddings } from "../embeddings";
import md5 from "md5";

type Metadata = Record<string, unknown>;
interface DocumentInput {
  pageContent: string;
  metadata?: Metadata;
}
interface Vector {
  /**
   * This is the vector's unique id.
   * @type {string}
   * @memberof Vector
   */
  id: string;
  /**
   * This is the vector data included in the request.
   * @type {Array<number>}
   * @memberof Vector
   */
  values: Array<number>;
  /**
   *
   * @type {SparseValues}
   * @memberof Vector
   */
  sparseValues?: SparseValues;
  /**
   * This is the metadata included in the request.
   * @type {object}
   * @memberof Vector
   */
  metadata: {
    chunk: string;
    text: string;
    hash: string;
  };
}
interface MetadataInterface {
  chunk: string;
  text: string;
  hash: string;
}
export async function createVectorAndUpsert(text: string) {
  //connect to pinecone
  const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!,
    environment: process.env.PINECONE_ENVIRONMENT!,
  });
  const index = pinecone.index(process.env.PINECONE_INDEX!);
  const namespace = index.namespace("alejah-site");
  // split documents
  const splitter: MarkdownTextSplitter = new MarkdownTextSplitter({});
  const sampleText: DocumentInput = { pageContent: text };

  // splits the textContent of the file into array
  const docs = await splitter.splitDocuments([new Document(sampleText)]);
  const vectors = await Promise.all(docs.flat().map(embedText));
  console.log(vectors);

  const transformed = await transformData(vectors);
  console.log("This is the transformed data: \n", transformed);
  //   upsert to pinecone
  try {
    const upsertResponse = await namespace.upsert(transformed);
    console.log("This is the upsertResponse", upsertResponse);

    return {
      isSuccess: true,
      message: "Successfully upserted vectors",
    };
  } catch (err) {
    return {
      isSuccess: false,
      message: err,
    };
  }
  return "Hello";
}
async function transformData(vector: Vector[]) {
  let record: PineconeRecord<RecordMetadata>[] = [];
  for (let i = 0; i < vector.length; i++) {
    let rar: RecordMetadata = {
      text: vector[i]?.metadata.text,
      chunk: vector[i]?.metadata.chunk,
      hash: vector[i]?.metadata.hash,
    };
    let current: PineconeRecord = {
      id: vector[i].id,
      values: vector[i].values,
      metadata: rar,
    };
    console.log("CURRENT:", current);
    record.push(current);
  }
  return record;
}

//connect to openAI and generate vector embeddings
async function embedText(doc: Document): Promise<Vector> {
  try {
    const embedding = await getEmbeddings(doc.pageContent);
    const hash = md5(doc.pageContent);

    return {
      id: hash,
      values: embedding,
      metadata: {
        // The metadata includes details about the document
        chunk: doc.pageContent, // The chunk of text that the vector represents
        text: doc.pageContent, // The text of the document
        hash: hash, // The hash of the document content
      },
    } as Vector;
  } catch (error) {
    console.error("Error embedding text", error);
    throw error;
  }
}
