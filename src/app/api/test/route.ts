import { NextResponse } from "next/server";
import { prisma }  from "@/lib/prisma";


export async function GET(){
    try{
        await prisma.$connect();

        return NextResponse.json({
            success:true,
            message:"database connected successfully",
        });
    } catch (error){
        console.error(error);
        return NextResponse.json(
            {
                success:false,
                message:"databasae connection failed",
            },
            { status:500}
        )
    }
}