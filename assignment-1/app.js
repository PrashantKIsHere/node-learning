const http = require("http");

const server = http.createServer((req, res) => {
  const { url, method } = req;
  if (url === "/" && method === "GET") {
    res.setHeader("Content-Type", "text/html");
    res.write("<html>");
    res.write("<head><title> Assignment 1 </title></head>");
    res.write("<body><h1> Assignment 1</h1></body>");
    res.write(
      "<form action='/create-user' method='POST'><input type='text' name='username' /><button type='submit'> Send </button></form>"
    );
    res.write("</html>");
    return res.end();
  }
  if (url === "/users" && method === "GET") {
    res.setHeader("Content-Type", "text/html");
    res.write("<html>");
    res.write("<head><title> Assignment 1 </title></head>");
    res.write("<body><ul>");
    res.write("<li> User 1 </li>");
    res.write("<li> User 2 </li>");
    res.write("<li> User 3 </li>");
    res.write("<li> User 4 </li>");
    res.write("<li> User 5 </li>");
    res.write("</ul></body>");
    res.write("</html>");
    return res.end();
  }
  if (url === "/create-user" && method === "POST") {
    const body = [];
    req.on("data", (chunk) => body.push(chunk));
    req.on("end", () => {
      const parsedBody = Buffer.concat(body).toString();
      const username = parsedBody.split("=")[1];
      console.log("Username", username);
      res.setHeader("Location", "/");
      res.statusCode = 302;
      return res.end();
    });
  }
});

server.listen(3000);
