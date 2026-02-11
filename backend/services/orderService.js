const { supabase, isSupabaseEnabled } = require("../config/supabaseClient");

const dummyOrders = [];

const createOrder = async (payload) => {
  if (!isSupabaseEnabled) {
    const created = {
      id: `ORD-${Date.now()}`,
      status: "Pending",
      created_at: new Date().toISOString(),
      ...payload
    };
    dummyOrders.push(created);
    return {
      id: created.id,
      status: created.status,
      created_at: created.created_at
    };
  }

  const orderInsert = {
    customer_name: payload.customer_name,
    email: payload.email,
    phone: payload.phone,
    city: payload.city,
    address: payload.address,
    items: payload.items,
    total_amount: payload.total_amount,
    status: "Pending"
  };

  const { data, error } = await supabase.from("orders").insert(orderInsert).select("id, status, created_at").single();

  if (error) {
    throw error;
  }

  return data;
};

module.exports = {
  createOrder,
  dummyOrders
};
