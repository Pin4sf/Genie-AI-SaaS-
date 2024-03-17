import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN!,
});

export async function POST(req: Request) {
    try {
        const { userId } = auth();
        const body = await req.json();
        const { prompt } = body;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!prompt) {
            return new NextResponse("Prompt are required", { status: 400 });
        }
        const input = {
            prompt: prompt,
        };

        let output = "";
        try {
            for await (const event of replicate.stream(
                "mistralai/mixtral-8x7b-instruct-v0.1",
                { input }
            )) {
                output += event.toString();
            }
        } catch (err) {
            console.log(["CONVERSATION_ERROR"], err);
            return new NextResponse("Error during model execution", {
                status: 500,
            });
        }

        return NextResponse.json({ output });
    } catch (err) {
        console.log(["CONVERSATION_ERROR"], err);
        return new NextResponse("Internal Error", { status: 500 });
    }
}