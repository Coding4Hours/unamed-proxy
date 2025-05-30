/// As a proxy developer
import { BareClient } from "@mercuryworkshop/bare-mux";


const client = new BareClient();

// Fetch
client.fetch("https://example.com").then(function(resp) {
    console.log(resp);
}).catch(function(err) {
    console.log(err);
});
