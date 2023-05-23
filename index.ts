import { WebSocketServer } from "ws"
import { channelId } from "./GetYoutubeId.js"
import { LiveChat } from "youtube-chat"

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
        } else if (data["command"] == "GET_LIVE_CHAT") {
          const liveChat = new LiveChat({ channelId: data["youtubeId"] })

          liveChat.on("chat", (chatItem) => {
            /* Your code here! */
            // console.log(JSON.stringify(chatItem, null, 2) + ",")
            ws.send(JSON.stringify({ chat: chatItem }))
            // console.log("message", chatItem?.message)
          })

          // liveChat.on("start")

          liveChat.on("error", (err) => {
            /* Your code here! */
            console.error({ err })
            ws.send(JSON.stringify({ error: `${err}` }))
          })

          liveChat.on("end", () => {
            /* Your code here! */
            console.log("end")
            ws.send(JSON.stringify({ end: true }))
          })

          liveChat.start()
        } else {
          console.error("Unknown message")
        }
      } catch (err) {
        console.error(err)
      }
    })
  })

  console.log("Server Started @ port", wss.options.port)
}

start()
