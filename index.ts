import { WebSocketServer } from "ws"
import { channelId } from "./GetYoutubeId.js"
import { LiveChat } from "narze-youtube-chat"

const chats = {}

function start() {
  const wss = new WebSocketServer({ port: 8080 })

  wss.on("connection", function connection(ws, req) {
    ws.id = req.headers["sec-websocket-key"]

    ws.on("error", console.error)

    ws.on("close", function close() {
      if (chats[ws.id]) {
        chats[ws.id].stop()
        delete chats[ws.id]
      }
    })

    ws.on("message", function message(data) {
      try {
        data = JSON.parse(data as unknown as string)

        if (data["youtubeUrl"]) {
          // Get YouTube Channel ID By Url & sent live chat events
          channelId(data["youtubeUrl"])
            .then((id) => {
              const chat = startLiveChat(id, ws)
              chats[ws.id] = chat
            })
            .catch((e) => {
              console.error(e)
            })
        } else if (data["url"]) {
          // Get YouTube Channel ID By Url
          channelId(data["url"])
            .then((id) => {
              ws.send(JSON.stringify({ youtubeId: id }))
            })
            .catch((e) => {
              console.error(e)
            })
        } else if (data["command"] == "GET_LIVE_CHAT") {
          const chat = startLiveChat(data["youtubeId"], ws)
          chats[ws.id] = chat
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

function startLiveChat(channelId: string, ws: WebSocket) {
  const liveChat = new LiveChat({ channelId })

  liveChat.on("chat", (chatItem) => {
    /* Your code here! */
    // console.log(JSON.stringify(chatItem, null, 2) + ",")
    ws.send(JSON.stringify({ chat: chatItem }))
    // console.log("message", chatItem?.message)
  })

  liveChat.on("start", (liveChatId) => {
    console.log("started", liveChatId)
  })

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

  return liveChat
}

start()
