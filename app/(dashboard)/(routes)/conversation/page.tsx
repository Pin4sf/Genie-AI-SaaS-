"use client";

import * as z from "zod";
import axios from "axios";
import { MessageSquare } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";

import Heading from "@/components/heading";
import { useForm } from "react-hook-form";
import { Form, FormField, FormControl, FormItem } from "@/components/ui/form";
import { formSchema } from "./constant";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Empty from "@/components/empty";
import Loader from "@/components/loader";
import { cn } from "@/lib/utils";
import UserAvatar from "@/components/user-avatar";
import BotAvatar from "@/components/bot-avatar";


    interface Message {
        role: string;
        content: string;
    }

    const ConversationPage = () => {
        const [messages, setMessages] = useState<Message[]>([]);
    
        const router = useRouter();
        const form = useForm<z.infer<typeof formSchema>>({
            resolver: zodResolver(formSchema),
            defaultValues: {
                prompt: "",
            },
        });
    
        const isLoading = form.formState.isSubmitting;
    
        const onSubmit = async (values: z.infer<typeof formSchema>) => {
            console.log(values);
            try {
                const userMessage: Message = {
                    role: "user",
                    content: values.prompt,
                };
        
                const newMessages = [...messages, userMessage];
        
                const response = await axios.post("/api/conversation", {
                    prompt: values.prompt,
                });
        
                let botMessage: Message;
                if (response.data && response.data.output) {
                    botMessage = {
                        role: "bot",
                        content: response.data.output,
                    };
                } else {
                    throw new Error("No response from the model");
                }
        
                setMessages((current) => [...current, userMessage, botMessage]);
        
                form.reset();
            } catch (err: any) {
                // TODO : Open Pro Model
                console.log(err);
            } finally {
                router.refresh();
            }
        };
    return (
        <div>
            <Heading
                title="Conversation"
                description="Our most popular conversation tool"
                icon={MessageSquare}
                iconColor="text-violet-500"
                bgColor="bg-violet-500/10"
            />
            ;
            <div className="px-4 lg:px-8">
                <div>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="
                        rounded-lg border w-full p-4 px-3 md:px-6
                        focus-within:shadow-sm grid grid-col-12 gap-2
                        "
                        >
                            <FormField
                                name="prompt"
                                render={({ field }) => (
                                    <FormItem className="col-span-12 lg:col-span-10">
                                        <FormControl className="m-0 p-0">
                                            <Input
                                                className="border-0 outlinr-none focus-visible:ring-0 focus-visible:ring-transparent"
                                                disabled={isLoading}
                                                placeholder="How  is ice formed ?"
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <Button
                                className="col-span-12 lg:col-span-2 w-full"
                                disabled={isLoading}
                            >
                                Generate
                            </Button>
                        </form>
                    </Form>
                </div>
                <div className="space-y-4 mt-4">
                    {isLoading && (
                        <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
                            <Loader />
                        </div>
                    )}
                    {messages.length === 0 && !isLoading && (
                        <Empty label="No conversions started" />
                    )}
                    <div className="flex flex-col-reverse gap-y-4">
                        {messages.map((message) => (
                            <div
                                key={message.content}
                                className={cn(
                                    "p-7 w-full flex items-start gap-x-9 rounded-lg",
                                    message.role === "user"
                                        ? "bg-white border border-black/10"
                                        : "bg-muted"
                                )}
                            >
                                {message.role === "user" ? (
                                    <UserAvatar />
                                ) : (
                                    <BotAvatar />
                                )}
                                <p className="text-sm">{message.content}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConversationPage;