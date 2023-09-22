import { OpenAIEmbeddings } from "langchain/embeddings/openai";

const embedder = new OpenAIEmbeddings({
  openAIApiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export async function createVectorEmbeddings(documents: string[]) {
  embedder.modelName = "text-embedding-ada-002";
  const embeddings = await embedder.embedDocuments(documents);
  console.log(embeddings);
  return embeddings;
}
