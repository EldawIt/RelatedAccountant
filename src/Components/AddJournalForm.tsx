/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/store";
import { addJournal } from "@/lib/slices/journalSlice";

export default function AddJournalForm() {
  const dispatch = useDispatch<AppDispatch>();

  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [journalTypeId, setJournalTypeId] = useState(1);
  const [lines, setLines] = useState([{ account: "", debit: 0, credit: 0 }]);

  const handleAddLine = () => {
    setLines([...lines, { account: "", debit: 0, credit: 0 }]);
  };

  const handleLineChange = (index: number, field: string, value: string | number) => {
    const newLines = [...lines];
    (newLines[index] as any)[field] = value;
    setLines(newLines);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(
      addJournal({
        date,
        description,
        journal_type_id: journalTypeId,
        lines,
      })
    );
    // reset
    setDate("");
    setDescription("");
    setJournalTypeId(1);
    setLines([{ account: "", debit: 0, credit: 0 }]);
  };

  return (
    <form onSubmit={handleSubmit} className="border p-4 rounded-lg shadow mb-6 space-y-4">
      <h2 className="text-lg font-semibold">➕ Add New Journal</h2>

      <div>
        <label className="block text-sm font-medium">Date</label>
        <input
          type="date"
          className="border p-2 rounded w-full"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Description</label>
        <input
          type="text"
          className="border p-2 rounded w-full"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Journal Type</label>
        <select
          className="border p-2 rounded w-full"
          value={journalTypeId}
          onChange={(e) => setJournalTypeId(Number(e.target.value))}
        >
          <option value={1}>General Journal</option>
          <option value={2}>Sales Journal</option>
          <option value={3}>Purchase Journal</option>
          <option value={4}>Cash Journal</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Lines</label>
        {lines.map((line, i) => (
          <div key={i} className="grid grid-cols-3 gap-2 mb-2">
            <input
              type="text"
              placeholder="Account"
              className="border p-2 rounded"
              value={line.account}
              onChange={(e) => handleLineChange(i, "account", e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Debit"
              className="border p-2 rounded"
              value={line.debit}
              onChange={(e) => handleLineChange(i, "debit", Number(e.target.value))}
            />
            <input
              type="number"
              placeholder="Credit"
              className="border p-2 rounded"
              value={line.credit}
              onChange={(e) => handleLineChange(i, "credit", Number(e.target.value))}
            />
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddLine}
          className="text-blue-600 text-sm mt-2"
        >
          + Add Line
        </button>
      </div>

      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Save Journal
      </button>
    </form>
  );
}
