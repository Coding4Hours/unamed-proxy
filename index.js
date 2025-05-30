/// As a proxy developer
import { BareClient } from "@mercuryworkshop/bare-mux";


const client = new BareClient();

(async () => {
  // Fetch
  const resp = await client.fetch("https://example.com");
  console.log(resp);
})
