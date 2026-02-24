import { NextResponse } from "next/server";
import { supabaseServer } from "../../../../lib/supabaseServer";

export async function PUT(request, context) {
  try {
    const body = await request.json();
    const { id } = await context.params;

    // ✅ SOLO columnas reales de app_users
    const updateData = {
      nombres: body.nombres,
      apellidos: body.apellidos,
      email: body.email,
      employee_code: body.employee_code,
      activo: body.activo,
      role_id: body.role_id,
      store_id: body.store_id,
    };

    const { data, error } = await supabaseServer
      .from("app_users")
      .update(updateData)
      .eq("user_id", id)
      .select();

    if (error) throw error;

    console.log("UPDATED USER:", data);

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("ERROR UPDATE USER:", error);

    return NextResponse.json(
      { error: "Error actualizando usuario" },
      { status: 500 }
    );
  }
}