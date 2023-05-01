const { channelId, videoId } = require("@gonetone/get-youtube-id-by-url")
// Get YouTube Channel ID By Url
channelId("https://www.youtube.com/@9arm.").then((id) => {
  console.log(id)
})
