"use client"

import * as z from "zod";
import axios from "axios";
import { Music } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";

import Heading from "@/components/heading";
import { useForm } from "react-hook-form";
import { Form , FormField , FormControl, FormItem } from "@/components/ui/form";
import { formSchema } from "./constant";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChatCompletionRequestMessage } from "openai";
import Empty from "@/components/empty";
import Loader from "@/components/loader";
import { cn } from "@/lib/utils";


const MusicPage = () => {
    const [music,setMusic] = useState<string>();

    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues:{
            prompt:""
        }
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log(values);
        try{
          setMusic(undefined);

          const response = await axios.post("/api/music", values);
          setMusic(response.data.audio);
          form.reset();
        } catch(err:any){
            // TODO : Open Pro Model
            console.log(err);
        } finally{
            router.refresh();
        }
    };
    
    return ( 
        <div>
            <Heading 
            title = "Music Generation"
            description="Turn prompt into music"
            icon={Music}
            iconColor="text-emerald-700"
            bgColor="bg-emerald-700/10"
            />;
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
                            render={({field}) => (
                                <FormItem className="col-span-12 lg:col-span-10">
                                    <FormControl className="m-0 p-0">
                                        <Input 
                                        className="border-0 outlinr-none focus-visible:ring-0 focus-visible:ring-transparent"
                                        disabled={isLoading}
                                        placeholder="Hard Metal music"
                                        {...field}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                            />
                            <Button className="col-span-12 lg:col-span-2 w-full" disabled={isLoading}>
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
                    {!music && !isLoading&& (
                        <Empty
                        label="No music generated"
                         />
                    )}
                    {music && (
                        <audio className="w-full mt-8" controls>
                            <source src = {music} />
                        </audio>
                    )}
                 </div>
            </div>
        </div>
    )
}
 
export default MusicPage;