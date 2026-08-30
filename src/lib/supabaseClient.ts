import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://hlyzmebbhvagtynmumua.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_VGvGLQHnE1px8IzMU-J7yg_RSr-Ny_D";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
