// src/app/api/counters/types/route.js
import pool from "@/app/lib/pool_db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const [rows] = await pool.execute(
      `
      SELECT DISTINCT type
      FROM history_max_id_group_plot
      WHERE type IS NOT NULL AND type <> ''
      `
    );

    // Извлекаем значения 'type' из результатов и фильтруем null и пустые строки
    const types = rows.map(row => row.type).filter(Boolean);

    return NextResponse.json(types);
  } catch (error) {
    console.error("Error fetching unique counter types:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}