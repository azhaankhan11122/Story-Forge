import { NextRequest, NextResponse } from "next/server";
import { serverGetAllStories, serverSaveStory, serverDeleteStory } from "@/lib/storage/serverStore";

export async function GET() {
  try {
    const stories = await serverGetAllStories();
    return NextResponse.json({ stories });
  } catch (error) {
    return NextResponse.json({ error: "Failed to load stories" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    await serverSaveStory(body);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save story" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    await serverSaveStory(body);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update story" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }
    await serverDeleteStory(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete story" }, { status: 500 });
  }
}
