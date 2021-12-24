import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://dwmzsauhrdfgibbhcrbb.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYzNTYxMTczNCwiZXhwIjoxOTUxMTg3NzM0fQ.Nya1NRIhzxo6Eo4PVs-OtG-2vPYrs0Iv1Wj2O6In7oc";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
