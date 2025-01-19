// 1 - 소켓 서버를 생성함
import { Server } from "socket.io";

// 2 - 5000포트를 가진 소켓 서버를 만든다, CORS를 추가해서 허락된 브라우저("http://localhost:3000")만 접근하도록 함.
const io = new Server("5001", {
  cors: {
    origin: "*", // *은 일시적으로 모든 도메인 허용하는 것
  },
});

// 3 - 소켓 서버에서 새로운 클라가 연결되었을때 실행되는 이벤트
io.sockets.on("connection", (socket) => {
  console.log("서버: 클라이언트 연결 성공");
  // 4 - 이벤트가 message로 부터 오는 정보를 받는다
  socket.on("message", (message) => {
    // 5 - emit는 서버에서 모두 연결된 클라로 데이터 전송할때 사용! => 메세지 나 포함 모두에게 전송
    socket.broadcast.emit("message", message);
    console.log(message);
  });
  // socket.on("login", (data) => {
  //   // 로그인 정보 모두에게 전달해서 새 사용자가 로그인했음을 알린다.
  //   socket.broadcast.emit("sLogin", data);
  // });
  // 6 - 연결이 끊긴다면 실행되는 이벤트
  socket.on("disconnect", () => {
    console.log("서버: 클라이언트 연결 끊김");
  });
});
