// src/app/api/counters/list/route.js
import pool from "@/app/lib/pool_db";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        const search = req.nextUrl.searchParams.get('search') || '';
        const page = parseInt(req.nextUrl.searchParams.get('page')) || 1;
        const pageSize = parseInt(req.nextUrl.searchParams.get('pageSize')) || 15;
        const offset = (page - 1) * pageSize;

        let query = `
            SELECT
                c.c_id AS id,
                p.plot_number,
                c.serial_number AS sn,
                c.model,
                c.type,
                c.plomb_count AS plomb,
                c.plomb_magnet AS magnet_plomb,
                c.plomb_box AS box_plomb,
                c.install_location AS location,
                c.counter_note AS note
            FROM history_max_id_group_plot c
            LEFT JOIN plots p ON c.plot_id = p.id
        `;

        let countQuery = `
            SELECT COUNT(*) AS total
            FROM history_data c
            LEFT JOIN plots p ON c.plot_id = p.id
        `;

        const queryParams = [];
        const countQueryParams = [];

        if (search) {
            query += `
            WHERE
                TRIM(LOWER(p.plot_number)) = LOWER(?)
            LIMIT ? OFFSET ?
            `;
            queryParams.push(search.trim(), pageSize, offset);
            countQuery += `
            WHERE
                TRIM(LOWER(p.plot_number)) = LOWER(?)
            `;
            countQueryParams.push(search.trim());
        } else {
            query += `
            LIMIT ? OFFSET ?
            `;
            queryParams.push(pageSize, offset);
        }

        const [rows] = await pool.execute(query, queryParams);
        const [totalResult] = await pool.execute(countQuery, countQueryParams);
        const total = totalResult[0].total;

        return NextResponse.json({ data: rows, total });
    } catch (error) {
        console.error("Error executing GET request:", error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}