// server.ts

Deno.serve(async (req: Request) => {
  const url = new URL(req.url);

  // Konfigurasi CORS agar API bisa diakses oleh frontend (React/Next.js)
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*", // Ubah "*" dengan domain frontendmu saat production
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  // Menangani preflight request dari browser
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  // 1. ENDPOINT ROOT: Untuk ngecek apakah server sudah online
  if (req.method === "GET" && url.pathname === "/") {
    return new Response(JSON.stringify({ status: "OK", message: "Server API berjalan lancar!" }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  // 2. ENDPOINT LOGIN: Menerima email & password
  if (req.method === "POST" && url.pathname === "/api/login") {
    try {
      // Mengambil data JSON dari request body
      const body = await req.json();
      const { email, password } = body;

      // Validasi sederhana
      if (!email || !password) {
        return new Response(JSON.stringify({ error: "Email dan password wajib diisi!" }), {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

      // --------------------------------------------------------------------------
      // BAGIAN DATABASE: Di sini tempat kamu memasukkan logika query ke database
      // Contoh mengambil URL database dari tab Environment Variables Deno Deploy:
      // const dbUrl = Deno.env.get("DATABASE_URL");
      // await connectMongoDB(dbUrl) atau eksekusi query T-SQL kamu.
      // --------------------------------------------------------------------------

      // Simulasi pengecekan database sementara (Mocking)
      if (email === "admin@xezai.xyz" && password === "admin123") {
        
        // Buat dummy token (Di real project, gunakan library JWT untuk generate ini)
        const token = "token_rahasia_jwt_12345";

        return new Response(JSON.stringify({ 
            message: "Login sukses!", 
            token: token,
            user: { email: email, role: "admin" }
        }), {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });

      } else {
        return new Response(JSON.stringify({ error: "Email atau password salah!" }), {
          status: 401,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

    } catch (error) {
      // Menangani error jika body yang dikirim frontend bukan format JSON yang valid
      return new Response(JSON.stringify({ error: "Format request tidak valid." }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }
  }

  // 3. FALLBACK: Jika endpoint tidak ditemukan
  return new Response(JSON.stringify({ error: "Endpoint tidak ditemukan (404)" }), {
    status: 404,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
});
