const { supabase, isSupabaseEnabled } = require("../config/supabaseClient");

const dummyContacts = [];

const createContactMessage = async (payload) => {
  if (!isSupabaseEnabled) {
    const created = {
      id: `MSG-${Date.now()}`,
      created_at: new Date().toISOString(),
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      message: payload.message
    };
    dummyContacts.push(created);
    return {
      id: created.id,
      created_at: created.created_at
    };
  }

  const { data, error } = await supabase
    .from("contact_messages")
    .insert({
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      message: payload.message
    })
    .select("id, created_at")
    .single();

  if (error) {
    throw error;
  }

  return data;
};

module.exports = {
  createContactMessage,
  dummyContacts
};
