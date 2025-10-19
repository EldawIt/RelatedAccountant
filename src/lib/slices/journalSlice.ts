// lib/slices/journalSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

interface JournalLine {
  id?: number;
  account: string;
  debit: number;
  credit: number;
}

interface Journal {
  id?: number;
  date: string;
  description: string;
  journal_type_id: number;
  lines: JournalLine[];
}

interface JournalState {
  items: Journal[];
  loading: boolean;
  error: string | null;
}

const initialState: JournalState = {
  items: [],
  loading: false,
  error: null,
};

// تحميل القيود من API
export const fetchJournals = createAsyncThunk("journals/fetch", async () => {
  const res = await fetch("/api/journal/list");
  if (!res.ok) throw new Error("Failed to fetch journals");
  return (await res.json()).data as Journal[];
});

// إضافة قيد جديد
export const addJournal = createAsyncThunk(
  "journals/add",
  async (journal: Omit<Journal, "id">, { dispatch }) => {
    const res = await fetch("/api/journal/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(journal),
    });
    if (!res.ok) throw new Error("Failed to add journal");
    const newJournal = (await res.json()).data as Journal;
    
    
    await dispatch(fetchJournals());
    return newJournal;
  }
);

const journalSlice = createSlice({
  name: "journals",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchJournals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJournals.fulfilled, (state, action: PayloadAction<Journal[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchJournals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Error fetching journals";
      });
  },
});

export default journalSlice.reducer;