import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const resumes = await prisma.resume.findMany({
      where: {
        userId: user.userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const totalResumes = resumes.length;

    const averageScore =
      totalResumes > 0
        ? Math.round(
            resumes.reduce(
              (sum: number, resume: { atsScore: number }) =>
                sum + resume.atsScore,
              0
            ) / totalResumes
          )
        : 0;

    const latestScore = resumes[0]?.atsScore || 0;

    return NextResponse.json({
      totalResumes,
      averageScore,
      latestScore,
      resumes,
    });
  } catch (error) {
    console.error("RESUME_HISTORY_ERROR", error);

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}