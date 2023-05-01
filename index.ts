import { WebSocketServer } from "ws"

function start() {
  const wss = new WebSocketServer({ port: 8080 })

  wss.on("connection", function connection(ws) {
    ws.on("error", console.error)

    ws.on("message", function message(data) {
      console.log("received: %s", data)
      console.log("sending back the time")

      setTimeout(() => {
        ws.send(+Date.now())
      }, 1000)
    })
  })

  console.log("Server Started @ port", wss.options.port)
}

start()
