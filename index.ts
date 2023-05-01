import { WebSocketServer } from "ws"
import { channelId } from "@gonetone/get-youtube-id-by-url"

function start() {
  const wss = new WebSocketServer({ port: 8080 })

  wss.on("connection", function connection(ws) {
    ws.on("error", console.error)

    ws.on("message", function message(data) {
      try {
        data = JSON.parse(data as unknown as string)
        console.log({ data }, data["url"])
        if (data["url"]) {
          // Get YouTube Channel ID By Url
          channelId(data["url"])
            .then((id) => {
              console.log(id)

              ws.send(JSON.stringify({ youtubeId: id }))
            })
            .catch((e) => {
              console.error(e)
            })
        }
      } catch (err) {
        console.error(err)
      }
    })
  })

  console.log("Server Started @ port", wss.options.port)
}

start()
