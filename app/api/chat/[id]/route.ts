import { StreamingTextResponse, LangChainStream } from "ai";
import { CallbackManager } from "langchain/callbacks";
import { Replicate } from "langchain/llms/replicate";
import { NextRequest, NextResponse } from "next/server";

import { MemoryManager } from "@/lib/memory";
import { rateLimit } from "@/lib/rate-limit";
import prisma from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { prompt } = await request.json();

    const identifier = request.url;
    const { success } = await rateLimit(identifier);

    if (!success) {
      return new NextResponse("Rate limit exceeded", { status: 429 });
    }

    const info = await prisma.info.update({
      where: {
        id: params.id,
      },
      data: {
        messages: {
          create: {
            content: prompt,
            role: "user",
          },
        },
      },
    });

    if (!info) {
      return new NextResponse("Information not found", { status: 404 });
    }

    const name = info.id;
    const information_file_name = name + ".txt";

    const infoKey = {
      informationName: name!,
      modelName: "llama2-13b",
    };

    const memoryManager = await MemoryManager.getInstance();

    const records = await memoryManager.readLatestHistory(infoKey);

    if (records.length === 0) {
      await memoryManager.seedChatHistory(info.seed as string, "\n\n", infoKey);
    }

    await memoryManager.writeToHistory("User: " + prompt + "\n", infoKey);

    const recentChatHistory = await memoryManager.readLatestHistory(infoKey);

    const similarDocs = await memoryManager.vectorSearch(
      recentChatHistory,
      information_file_name,
    );

    let relevantHistory = "";

    if (!!similarDocs && similarDocs.length !== 0) {
      relevantHistory = similarDocs.map((doc) => doc.pageContent).join("\n");
    }

    const { handlers } = LangChainStream();

    const model = new Replicate({
      model:
        "a16z-infra/llama-2-13b-chat:df7690f1994d94e96ad9d568eac121aecf50684a0b0963b25a41cc40061269e5",
      input: {
        max_length: 2048,
      },
      apiKey: process.env.REPLICATE_API_TOKEN,
      callbackManager: CallbackManager.fromHandlers(handlers),
    });

    model.verbose = true;

    const resp = String(
      await model
        .call(
          `
        ONLY generate plain sentences without prefix of who is speaking. DO NOT use ${info.name}: prefix. 

        ${info.instructions}

        Below are relevant details about ${info.name}'s past and the conversation you are in.
        ${relevantHistory}


        ${recentChatHistory}\n${info.name}:`,
        )
        .catch(console.error),
    );

    const cleaned = resp.replaceAll(",", "");
    const chunks = cleaned.split("\n");
    const response = chunks[0];

    await memoryManager.writeToHistory("" + response.trim(), infoKey);
    var Readable = require("stream").Readable;

    let s = new Readable();
    s.push(response);
    s.push(null);
    if (response !== undefined && response.length > 1) {
      memoryManager.writeToHistory("" + response.trim(), infoKey);

      await prisma.info.update({
        where: {
          id: params.id,
        },
        data: {
          messages: {
            create: {
              content: response.trim(),
              role: "system",
            },
          },
        },
      });
    }

    return new StreamingTextResponse(s);
  } catch (error) {
    console.log("[CHAT_POST", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
