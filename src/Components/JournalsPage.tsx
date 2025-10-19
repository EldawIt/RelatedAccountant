"use client";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store";
import { fetchJournals } from "@/lib/slices/journalSlice";
import AddJournalForm from "./AddJournalForm";

export default function JournalsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading, error } = useSelector((state: RootState) => state.journals);

  useEffect(() => {
    dispatch(fetchJournals());
  }, [dispatch]);

  if (loading) {
    return <p>جاري التحميل...</p>;
  }

  if (error) {
    return <p className="text-red-500">حدث خطأ: {error}</p>;
  }

  if (!items || items.length === 0) {
    return <p>لا يوجد قيود مسجلة حتى الآن.</p>;
  }
  
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">📘 Journal Entries</h1>

      <AddJournalForm />

      <ul className="space-y-4">
        {items.map((journal) => (
          <li key={journal.id} className="border p-4 rounded-lg shadow-sm">
            <p><b>التاريخ:</b> {journal?.date}</p>
            <p><b>الوصف:</b> {journal?.description}</p>
            <ul className="mt-2">
              {journal.lines?.map((line) => (
                <li key={line.id}>
                  {line.account}: مدين {line.debit} | دائن {line.credit}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}