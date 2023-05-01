// run `node index.js` in the terminal
const { LiveChat } = require("youtube-chat")
// const liveChat = new LiveChat({channelId: "UCoiEtD4v1qMAqHV5MDI5Qpg"}) // 9arm
const liveChat = new LiveChat({ channelId: "UCSJ4gkVC6NrvII8umztf0Ow" }) // LofiGirl
// const liveChat = new LiveChat({ channelId: "UC4plRabXFGdAE6HP-tBQKdQ" }) // HRK

liveChat.on("chat", (chatItem) => {
  /* Your code here! */
  console.log(JSON.stringify(chatItem, null, 2) + ",")
  // console.log("message", chatItem?.message)
})

liveChat.on("error", (err) => {
  /* Your code here! */
  console.error({ err })
  if (err?.response?.status == 400) {
    console.log("400 Error found, retry the livechat request")

    setTimeout(() => {
      restart()
    }, 120000 * Math.random())
  }
  if (err?.response?.status == 429) {
    console.log("Rate limited...")

    // restart()
  }
})

function restart() {
  liveChat.stop()
  liveChat.start().then((ok) => {
    console.log({ ok })

    if (!ok) {
      console.log("Failed to start, check emitted error")
    }
  })
}

restart()
