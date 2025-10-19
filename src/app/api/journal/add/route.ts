/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/journal/add/route.ts
import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { journal_type_id, date, description, lines } = body;

    if (!journal_type_id || !date || !lines || !Array.isArray(lines)) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    // نضيف القيد
    const insertEntry = db.prepare(`
      INSERT INTO JournalEntries (date, description, journal_type_id)
      VALUES (?, ?, ?)
    `);
    const result = insertEntry.run(date, description, journal_type_id);

    const entryId = result.lastInsertRowid;

    // نضيف التفاصيل (الخطوط)
    const insertLine = db.prepare(`
      INSERT INTO JournalLines (entry_id, account, debit, credit)
      VALUES (?, ?, ?, ?)
    `);

    for (const line of lines) {
      insertLine.run(entryId, line.account, line.debit || 0, line.credit || 0);
    }

    return NextResponse.json({ success: true, entryId });
  } catch (error: any) {
    console.error("Error inserting journal:", error.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
