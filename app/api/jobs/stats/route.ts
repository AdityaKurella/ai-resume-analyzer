import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const jobs = await prisma.jobApplication.findMany({
      where: {
        userId: user.userId,
      },
    });

    const total = jobs.length;

    const applied = jobs.filter(
      (job: { status: string }) => job.status === "Applied"
    ).length;

    const interview = jobs.filter(
      (job: { status: string }) => job.status === "Interview"
    ).length;

    const rejected = jobs.filter(
      (job: { status: string }) => job.status === "Rejected"
    ).length;

    return NextResponse.json({
      total,
      applied,
      interview,
      rejected,
    });
  } catch (error) {
    console.error("JOB_STATS_ERROR", error);

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}