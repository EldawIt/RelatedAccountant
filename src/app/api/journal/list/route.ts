/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {
    const journals = db.prepare("SELECT * FROM JournalEntries").all();

    const result = journals.map((journal: { id: any; }) => {
      const lines = db
        .prepare("SELECT * FROM JournalLines WHERE entry_id = ?")
        .all(journal.id);

      return { ...journal, lines };
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
