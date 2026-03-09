import { NextResponse } from "next/server";
import { supabaseServer } from "../../../lib/supabaseServer";

// convertir YYYY-MM-DD a fecha ISO segura
function convertirFechaLocal(fechaISO, isEnd = false) {
  const [year, month, day] = fechaISO.split("-").map(Number);

  const offset = 6; // Nicaragua UTC-6

  const date = new Date(Date.UTC(
    year,
    month - 1,
    day,
    isEnd ? 23 + offset : offset,
    isEnd ? 59 : 0,
    isEnd ? 59 : 0,
    isEnd ? 999 : 0
  ));

  return date.toISOString();
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const inicio = searchParams.get("inicio");
    const fin = searchParams.get("fin");
    const roleName = searchParams.get("roleName");
    const storeId = searchParams.get("storeId");
    const employeeCode = searchParams.get("employeeCode");
    let query = supabaseServer
      .from("orders")
      .select(
        `
        *,
        sales_people (
          full_name,
          email,
          store_id
        ),
        order_items (
          quantity,
          total_price,
          products (
            sku_id,
            product_name
          )
        )
      `,
      )
      .order("order_id", { ascending: false })
      .neq("status", "canceled");
      // Bloquear acceso si no viene roleName
if (!roleName) {
  return NextResponse.json({ error: "Rol no definido" }, { status: 403 });
}
    if (roleName === "gerente" && storeId) {
      // Traer todos los vendedores de la tienda
      const { data: sellers } = await supabaseServer
        .from("sales_people")
        .select("employee_code")
        .eq("store_id", storeId);

      const sellerCodes = sellers?.map((s) => s.employee_code) || [];
      query = query.in("employee_code", sellerCodes);
    } else if (roleName === "vendedor" && employeeCode) {
      query = query.eq("employee_code", employeeCode);
    }
    // 🔹 filtros por fecha
    if (inicio) {
      query = query.gte("created_at", convertirFechaLocal(inicio));
    }

    if (fin) {
      query = query.lte("created_at", convertirFechaLocal(fin, true));
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
