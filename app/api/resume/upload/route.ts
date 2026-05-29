import { NextResponse } from "next/server";
import { PDFParse } from "pdf-parse";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { analyzeResume } from "@/lib/analyzeResume";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("resume") as File | null;

    if (!file) {
      return NextResponse.json(
        { message: "Resume file is required" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const parser = new PDFParse({ data: buffer });
    const parsed = await parser.getText();
    const content = parsed.text;

    const result = analyzeResume(content);

    const resume = await prisma.resume.create({
      data: {
        fileName: file.name,
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
      message: "Resume uploaded and analyzed successfully",
      resume,
    });
  } catch (error) {
    console.error("PDF_UPLOAD_ERROR", error);

    return NextResponse.json(
      { message: "Something went wrong while uploading resume" },
      { status: 500 }
    );
  }
}