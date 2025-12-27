'use client'

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { clsx } from 'clsx';
import { FormEvent, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { error } from "console";

type Answer = {
  summery: string;
  confidence: number;
  question: string;
}

export default function Home() {

  const [query , setQuery] = useState("");
  const [answers , setAnswers] = useState<Answer[]>([]);
  const [loading , setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleQuerysubmit( e: FormEvent<HTMLFormElement>){
    e.preventDefault();
    const q = query.trim();

    if(!q || loading) return
    setLoading(true);


    try{
      const res = await fetch('/api/ask' , {
        method: 'POST',
        headers : {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({query: q})
      })

      const data = await res.json();

      if(!res.ok){
        console.error(data.error);
        return;
      }

      const {summery , confidence} = data as {
        summery : string;
        confidence: number;
      }

      setAnswers((prev) => [{question: q ,summery , confidence}, ...prev]);
      setQuery('')
      inputRef.current?.focus();


      console.log(data , 'data')
    }catch(e){
     console.log(e);
    }finally{
      setLoading(false)
    }
  }


  return (
    <div className="min-h-dvh w-full bg-gradient-to-tr from-gray-950 via-blue-950 to-slate-900">
      <div className="mx-auto flex h-dvh w-full max-w-2xl flex-col px-4 pb-24 pt-8">
        <header className="mb-4">
          <h1 className="text-white text-xl font-bold tracking-tight">
            Hello Agent - Ask Anything 
          </h1>
        </header>
        <Card className="flex-1 bg-gradient-to-tr from-gray-950 via-blue-950 to-slate-900">
          <CardHeader>
            <CardTitle className="text-white">Answers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {
              answers.length === 0 ?
              (<p className="text-sm text-zinc-300">
                No answers yet. Ask a question below
              </p>) : (
                answers.map((ans , index) => (
                  <div key={index} className="rounded-xl border border-zinc-500 p-3">
                    <div className="text-sm font-semibold text-blue-300">
                      Q: {ans.question}
                    </div>
                    <div className="text-sm leading-6 text-white">
                       {ans.summery}
                    </div>
                    <div className="mt-1 text-xs text-zinc-300">
                      confidence: {ans.confidence.toFixed(2)}
                    </div>
                  </div>
                ))
              )
            }
          </CardContent>
        </Card>
        <form 
        ref={formRef}
        onSubmit={handleQuerysubmit}
        className="fixed inset-x-0 bottom-0 mx-auto w-full max-w-2xl px-4 py-4 backdrop-blur">
          <div className="flex gap-2"> 
            <input 
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Type your questions and press"
            disabled={loading}
            className="flex-1 h-11 rounded-xl bg-slate-900/80 border border-white px-4 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:opacity-60"
            />
            <button type="submit" disabled={loading} className="h-11 rounded-xl px-5 backdrop-blur bg-black border border-white text-white">
              {
                loading ? 'Thinking' : 'Ask'
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
