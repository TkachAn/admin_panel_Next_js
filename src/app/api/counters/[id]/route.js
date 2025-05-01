// src/app/api/counters/[id]/route.js
import pool from "@/app/lib/pool_db";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { id } = params;
  console.log("GET request for counter with ID:", id); // Логируем ID для запроса
  try {
    const [rows] = await pool.execute(
      `
      SELECT
        c.id,
        p.plot_number,
        p.id,
        c.serial_number AS sn,
        c.model,
        c.type,
        c.plomb_count AS plomb,
        c.plomb_magnet AS magnet_plomb,
        c.plomb_box AS box_plomb,
        c.install_location AS location,
        c.note
      FROM history_max_id_group_plot c
      LEFT JOIN plots p ON c.plot_id = p.id
      WHERE p.id = ?
      `,
      [id]
    );
    console.log("Query result:", rows); // Логируем результат запроса
    if (rows.length === 0) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error(error);
    return NextResponse.error();
  }
}
export async function PUT(req, { params }) {
  const { id } = params;
  const body = await req.json();
  console.log("PUT request for counter with ID:", id, "Body:", body); // Логируем данные запроса PUT

  const {
    sn,
    model,
    type,
    plomb,
    magnet_plomb,
    box_plomb,
    location,
    note,
  } = body;

  try {
    const [result] = await pool.execute(
      `
      UPDATE counters
      SET 
        serial_number = ?,
        model = ?,
        type = ?,
        plomb_count = ?,
        plomb_magnet = ?,
        plomb_box = ?,
        install_location = ?,
        note = ?
      WHERE id = ?
      `,
      [sn, model, type, plomb, magnet_plomb, box_plomb, location, note, id]
    );
    console.log("Update result:", result); // Логируем результат обновления

    if (result.affectedRows === 0) {
      console.log("No rows updated for ID:", id); // Логируем, если обновление не произошло
      return NextResponse.json({ message: "Update failed" }, { status: 400 });
    }

    return NextResponse.json({ message: "Updated successfully" });
  } catch (error) {
    console.error("Error executing PUT request:", error); // Логируем ошибку
    return NextResponse.error();
  }
}