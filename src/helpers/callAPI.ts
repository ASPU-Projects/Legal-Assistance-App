import axios from "axios";

export async function callAPI(
  role: "user" | "lawyer" | "representative",
  api_name: string,
  token: string,
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" = "GET",
  body: any = null,
  params: any = null
) {
  try {
    const baseUrl =
      role === "user"
        ? import.meta.env.VITE_API_URL_USER
        : role === "lawyer"
          ? import.meta.env.VITE_API_URL_LAWYER
          : import.meta.env.VITE_API_URL_REPRESENTATIVE;

    const url = `${baseUrl}/${api_name}`;

    // لا تضيف Content-Type إذا body هو FormData (الـ browser يضبطه مع boundary)
    const headers: any = {
      Authorization: `Bearer ${token}`,
    };
    if (!(body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    const config = {
      method,
      url,
      headers,
      ...(body && { data: body }),
      ...(params && { params }),
    };

    const res = await axios(config);
    return res.data;
  } catch (error: any) {
    // إذا كان 401
    if (error.response?.status === 401 && api_name !== "refresh-token") {
      try {
        // جرّب تعمل refresh
        const refreshResponse = await axios.post(
          `${import.meta.env.VITE_API_URL_AUTH}/refresh-token`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const newToken = refreshResponse.data.access_token;
        localStorage.setItem("access_token", newToken);
        localStorage.setItem("role", refreshResponse.data.data.role);

        // إعادة الطلب بالتوكن الجديد
        return await callAPI(role, api_name, newToken, method, body);
      } catch (refreshError: any) {
        // لو refresh نفسه فشل → سجل خروج
        console.error("Refresh token failed", refreshError);
        localStorage.clear();
        window.location.href = "/login";
        throw refreshError;
      }
    }

    console.error(error.response?.data?.message ?? error.message);
    throw error;
  }
}
