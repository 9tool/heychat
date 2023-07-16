import { WebSocketServer } from "ws"
import { channelId } from "./GetYoutubeId"
import { LiveChat } from "narze-youtube-chat"

interface ChatMap {
  [key: string]: LiveChat
}

const chats: ChatMap = {}

function start() {
  const wss = new WebSocketServer({ port: 8080 })

  wss.on("connection", function connection(ws, req) {
    const id = req.headers["sec-websocket-key"]!

    ws.on("error", console.error)

    ws.on("close", function close() {
      if (chats[id]) {
        chats[id].stop()
        delete chats[id]
      }
    })

    ws.on("message", function message(data) {
      try {
        data = JSON.parse(data as unknown as string)

        if ("youtubeUrl" in data) {
          // Get YouTube Channel ID By Url & sent live chat events
          const youtubeUrl = data["youtubeUrl"] as string

          channelId(youtubeUrl)
            .then((id) => {
              const chat = startLiveChat(id, ws)
              chats[id] = chat
            })
            .catch((e) => {
              console.error(e)
            })
        } else if ("url" in data) {
          // Get YouTube Channel ID By Url
          const url = data["url"] as string

          channelId(url)
            .then((id) => {
              ws.send(JSON.stringify({ youtubeId: id }))
            })
            .catch((e) => {
              console.error(e)
            })
        } else if (
          "command" in data &&
          (data["command"] as string) == "GET_LIVE_CHAT"
        ) {
          const youtubeId =
            "youtubeId" in data ? (data["youtubeId"] as string) : ""
          const chat = startLiveChat(youtubeId, ws)
          chats[id] = chat
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

function startLiveChat(channelId: string, ws: import("ws")) {
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
