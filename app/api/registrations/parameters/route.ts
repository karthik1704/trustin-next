import { SERVER_API_URL } from "@/app/constant";
import { cookies } from "next/headers";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    console.log(searchParams)
    const id = searchParams.get('product')||""
    const test_type = searchParams.get('test_type') || ""
    const query = `test_type=${encodeURIComponent(test_type)}`;
    const access_token = cookies().get("access_token");

    const res = await fetch( `${SERVER_API_URL}/parameters/product/${id}?${query}`,
         {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token?.value}`,
      },
    })
    const product = await res.json()
   
    return Response.json(product)
  }