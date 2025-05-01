//src/app/api/lastReadings/route.js
import pool from "@/app/lib/pool_db";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const plotNumberSearch = searchParams.get("plotNumberSearch") || "";
  const ownerNameSearch = searchParams.get("ownerNameSearch") || "";

  let connection;
  try {
    connection = await pool.getConnection();
    let query = "SELECT * FROM last_all_data WHERE 1=1";
    const values = [];

    if (plotNumberSearch) {
      console.log("plotNumberSearch :", plotNumberSearch);
      query += " AND TRIM(LOWER(plot_number)) = ?"; // Используем '=' для точного совпадения после trim и lowercase
      values.push(plotNumberSearch);
    }

    if (ownerNameSearch) {
      console.log("ownerNameSearch", ownerNameSearch);
      query += " AND owner_name LIKE ?";
      values.push(`%${ownerNameSearch}%`);
    }

    const [rows] = await connection.execute(query, values);
    //console.log('rows!!!!!!!!!!!!!!!!!!!', rows)
    return NextResponse.json({
      readings: rows,
      total: rows.length,
    });
  } catch (error) {
    console.error("Ошибка при выполнении запроса к базе данных:", error);
    return NextResponse.json(
      { error: "Ошибка при получении данных" },
      { status: 500 }
    );
  } finally {
    if (connection) {
      connection.release();
    }
  }
}