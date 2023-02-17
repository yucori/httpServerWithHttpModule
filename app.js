const users = [
  {
    id: 1,
    name: "Rebekah Johnson",
    email: "Glover12345@gmail.com",
    password: "123qwe",
  },
  {
    id: 2,
    name: "Fabian Predovic",
    email: "Connell29@gmail.com",
    password: "password",
  },
];

const posts = [
  {
    id: 1,
    title: "간단한 HTTP API 개발 시작!",
    content: "Node.js에 내장되어 있는 http 모듈을 사용해서 HTTP server를 구현.",
    userId: 1,
  },
  {
    id: 2,
    title: "HTTP의 특성",
    content: "Request/Response와 Stateless!!",
    userId: 1,
  },
];

const http = require("http");
const server = http.createServer();

const httpRequestListener = (request, response) => {
  if (request.method === "GET") {
    if (request.url === "/data") {
      let mergeData = [];

      for (let i = 0; i < posts.length; i++) {
        if (posts[i].id === users[i].id) {
          mergeData.push({
            userId: parseInt(posts[i].userId),
            userName: users[i].name,
            postingId: parseInt(posts[i].id),
            postingTitle: posts[i].title,
            postingContent: posts[i].content,
          });
        }
      }

      response.writeHead(200, { "Content-Type": "application/json" }); // (4)
      response.end(JSON.stringify({ data: mergeData }));
    }
  } else if (request.method === "POST") {
    if (request.url === "/users") {
      let body = "";
      // data가 stream 형태로 들어온다.
      request.on("data", (data) => {
        body += data;
      });
      request.on("end", () => {
        const user = JSON.parse(body);

        users.push({
          id: parseInt(user.id),
          name: user.name,
          email: user.email,
          password: user.password,
        });

        response.writeHead(201, { "Content-Type": "application/json" }); // (4)
        response.end(JSON.stringify({ users: users })); // (5)
      });
    } else if (request.url === "/posts") {
      let body = "";
      // data가 stream 형태로 들어온다.
      request.on("data", (data) => {
        body += data;
      });
      request.on("end", () => {
        const post = JSON.parse(body);

        posts.push({
          id: parseInt(post.id),
          title: post.title,
          content: post.content,
          userId: parseInt(post.userId),
        });

        response.writeHead(201, { "Content-Type": "application/json" }); // (4)
        response.end(JSON.stringify({ posts: posts })); // (5)
      });
    }
  }
};

server.on("request", httpRequestListener);

server.listen(8000, "127.0.0.1", function () {
  // (7)
  console.log("Listening to requests on port 8000");
});
