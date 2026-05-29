import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { analyzeResume } from "@/lib/analyzeResume";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { fileName, content } = await req.json();

    if (!fileName || !content) {
      return NextResponse.json(
        { message: "File name and content are required" },
        { status: 400 }
      );
    }

    const result = analyzeResume(content);

    const resume = await prisma.resume.create({
      data: {
        fileName,
        content,
        atsScore: result.atsScore,
        summary: result.summary,
        strengths: result.strengths,
        weaknesses: result.weaknesses,
        suggestions: result.suggestions,
        userId: user.userId,
      },
    });

    return NextResponse.json({
      message: "Resume analyzed successfully",
      resume,
    });
  } catch (error) {
    console.error("RESUME_ANALYZE_ERROR", error);

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}