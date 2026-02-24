import { NextResponse } from "next/server";
import { supabaseServer } from "../../../lib/supabaseServer";

export async function GET() {
  try {
    const { data, error } = await supabaseServer
      .from("app_users")
      .select(
        `
        *,
        app_roles(
        role_id,
        name),
        app_stores(
          store_id,
          store_name)`,
      )
      .order("user_id", { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error obteniendo usuarios:", error);

    return NextResponse.json(
      { error: "Error al obtener usuarios" },
      { status: 500 },
    );
  }
}
