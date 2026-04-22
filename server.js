const http = require(“http”);
const fs = require(“fs”);
const path = require(“path”);
const { createWispServer } = require(“wisp-server-node”);

const PORT = process.env.PORT || 3000;

const MIME_TYPES = {
“.html”: “text/html”,
“.svg”:  “image/svg+xml”,
“.js”:   “application/javascript”,
“.mjs”:  “application/javascript”,
“.css”:  “text/css”,
“.mp4”:  “video/mp4”,
“.wasm”: “application/wasm”,
“.png”:  “image/png”,
“.ico”:  “image/x-icon”,
“.txt”:  “text/plain”,
“.json”: “application/json”,
};

const server = http.createServer((req, res) => {
let urlPath = req.url.split(”?”)[0];
if (urlPath === “/” || urlPath === “”) urlPath = “/index.html”;

const filePath = path.join(__dirname, urlPath);

if (!filePath.startsWith(__dirname)) {
res.writeHead(403);
res.end(“Forbidden”);
return;
}

fs.readFile(filePath, (err, data) => {
if (err) {
res.writeHead(404, { “Content-Type”: “text/plain” });
res.end(“Not found: “ + urlPath);
return;
}


const ext  = path.extname(filePath).toLowerCase();
const mime = MIME_TYPES[ext] || "application/octet-stream";

res.writeHead(200, {
  "Content-Type":  mime,
  "Cache-Control": "no-cache",
  "Cross-Origin-Opener-Policy":   "same-origin",
  "Cross-Origin-Embedder-Policy": "require-corp",
});
res.end(data);

  

});
});


createWispServer({ server, path: “/ws/” });

server.listen(PORT, () => {
console.log(“CineWeb running on port “ + PORT);
});
