import axios from "axios";

interface priceResponse {
  price: string;
}

export async function fetchPrice(
  price: string
): Promise<priceResponse> {
  return await axios.get(`https://api.price.ovh/v1/${price}`);
}
