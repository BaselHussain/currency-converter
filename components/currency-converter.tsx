"use client";
import { useState, useEffect, ChangeEvent } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import  {Spinner}  from "@/components/ui/spinner"



type ExchangeRates={
    [key:string]:number
}

type Currency="USD" | "EUR" | "GBP" | "JPY" | "AUD" | "CAD" | "PKR";



export default function CurrencyConverter() {
const [amount,setAmount]=useState<number|null>(null)
const [sourceCurrency,setSourceCurrency]=useState<Currency>("USD")
const [targetCurrency,setTargetCurrency]=useState<Currency>("PKR") 
const [exchangeRates,setExchangeRates]=useState<ExchangeRates>({})
const [convertedAmount,setConvertedAmount]=useState<string>("0.00")
const [loading,setLoading]=useState<boolean>(false)
const [error,setError]=useState<string|null>(null)

useEffect(()=>{
    const fetchExchangeRates=async()=>{
setLoading(true)
setError(null)
try {
    const response=await fetch("https://api.exchangerate-api.com/v4/latest/USD")
const data=await response.json()
setExchangeRates(data.rates)
} catch (error) {
    setError("Error fetching exchange rates")
}finally{
    setLoading(false)
}
    }
    fetchExchangeRates()
},[])


const handleAmountchange=(e:ChangeEvent<HTMLInputElement>):void=>{
setAmount(parseFloat(e.target.value))
}

const handleSourceCurrencyChange=(value:Currency):void=>{
setSourceCurrency(value)
}

const handleTargetCurrencyChange=(value:Currency):void=>{
setTargetCurrency(value)
}

const calculateConvertedAmount=():void=>{
if(sourceCurrency&&targetCurrency&&amount&&exchangeRates){
    const rates=sourceCurrency==="USD"?exchangeRates[targetCurrency]:exchangeRates[targetCurrency]/exchangeRates[sourceCurrency]
const result=amount*rates
setConvertedAmount(result.toFixed(2))
setError(null)
}
}




    return(
        <>
<div className="flex flex-col h-screen items-center justify-center bg-gradient-to-tr from-[#000000] to-[#89bef7]">
<Card className="p-6 w-full max-w-md">
<CardHeader>
    <CardTitle className="text-center text-3xl">Currency Converted</CardTitle>
    <CardDescription className="text-center ">Convert between different currencies</CardDescription>
</CardHeader>
<CardContent>
{loading?(
    <div className="flex justify-center"><Spinner/></div>
):error?(
    <div className="text-red-600 text-center">{error}</div>
):(
    <div className="grid gap-4">
        <div className="grid grid-cols-[1fr_auto] items-center ">
        <Label>From</Label>
        <div className="grid grid-cols-[1fr_auto] items-center gap-8">  
            <Input
            type="number"
            placeholder="amount"
            onChange={handleAmountchange}
            value={amount || ""}
            id="from"
            className="w-full "/>
        
        <Select
        value={sourceCurrency}
        onValueChange={handleSourceCurrencyChange}
        
        >
        <SelectTrigger>
<SelectValue placeholder="USD"/>
        </SelectTrigger>

        <SelectContent>
            <SelectGroup>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
                <SelectItem value="GBP">GBP</SelectItem>
                <SelectItem value="JPY">JPY</SelectItem>
                <SelectItem value="AUD">AUD</SelectItem>
                <SelectItem value="CAD">CAD</SelectItem>
                <SelectItem value="PKR">PKR</SelectItem>
            </SelectGroup>
        </SelectContent>
        </Select>
        </div>
        </div>
        <div className="grid grid-cols-[1fr_auto] items-center gap-2">
        <Label>To</Label>
        <div className="grid grid-cols-[1fr_auto] items-center gap-2">  
        <div className="text-2xl font-bold">{convertedAmount}</div>
        
        <Select
        value={targetCurrency}
        onValueChange={handleTargetCurrencyChange}
        
        >
        <SelectTrigger>
<SelectValue placeholder="EUR"/>
        </SelectTrigger>

        <SelectContent>
            <SelectGroup>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
                <SelectItem value="GBP">GBP</SelectItem>
                <SelectItem value="JPY">JPY</SelectItem>
                <SelectItem value="AUD">AUD</SelectItem>
                <SelectItem value="CAD">CAD</SelectItem>
                <SelectItem value="PKR">PKR</SelectItem>
            </SelectGroup>
        </SelectContent>
        </Select>
        </div>
        </div>
    </div>
)
}
</CardContent>
<CardFooter>
    <Button
    onClick={calculateConvertedAmount}
    className="w-full">
        Convert
    </Button>
</CardFooter>
</Card>
</div>

        </>
    )
}
    



