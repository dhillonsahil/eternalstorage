"use client";
import { CardWrapper } from "./card-wrapper"
import { LoginSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from 'zod';
import {useForm} from "react-hook-form"
import {
    Form,FormControl,FormField,FormItem,FormLabel,FormMessage
} from '@/components/ui/form'
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import FormError from "../form-error";
import FormSucces from "../form-success";
import { useState, useTransition } from "react";
import useTokenStore from '@/store/store';
import { useRouter } from "next/navigation";

export const LoginForm = ()=>{
    const { setToken ,setUserInfo } = useTokenStore();
    const router=useRouter();
    const [isPending,startTransition] = useTransition();
    const [error,setError]=useState<string | undefined>("");
    const [success,setSuccess]=useState<string | undefined>("");

    const form =useForm<z.infer<typeof LoginSchema>>({
        resolver:zodResolver(LoginSchema),
        defaultValues:{
            email:"",
            password:""
        }
    })

    const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
        setError("");
        setSuccess("");
    
        try {
          const response = await fetch(`${process.env.SEVER_HOST}api/users/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: values.email,
              password: values.password,
            }),
          });
    
          const data = await response.json();
    
          if (data.success === false) {
            setError(data.message);
            return;
          }
    
          if (data.token) {
            setToken(data.token);
            setUserInfo({ name: data.name, email: data.email });
    
            router.push("/");
          }
    
          setSuccess("Login successful!");
        } catch (error) {
          console.error("Error:", error);
          setError("Login failed. Please try again.");
        }
      };
    

    return (
    <CardWrapper headerLabel="Welcome back" backButtonLabel="Don't have an account?" backButtonHref="/auth/register">
       <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-4">
            <FormField name="email" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input disabled={isPending} type='email' placeholder="example@ex.com" {...field} />
                            </FormControl>
                            <FormMessage  />
                        </FormItem>
                    )}
                        control={form.control}
                    />
                     <FormField name="password" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input disabled={isPending} type="password" placeholder="******" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                        control={form.control}
                    />
            </div>
            <FormError message={error} />
            <FormSucces message={success} />
            <Button disabled={isPending} type="submit" className="w-full">
                Login
            </Button>
        </form>
       </Form>
    </CardWrapper>
    )
}