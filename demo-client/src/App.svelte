<script lang="ts">
  import WebSocket from "isomorphic-ws"

  let url: string = "https://www.youtube.com/@9arm."
  let log: string[] = []
  let youtubeId: string = null

  function connect() {
    const ws = new WebSocket("ws://localhost:8080")

    ws.onopen = function open() {
      console.log("connected")
      status = "connected"

      ws.send(JSON.stringify({ url }))
    }

    ws.onclose = function close() {
      status = "disconnected"
      console.log("disconnected")
    }

    ws.onmessage = function incoming(data) {
      console.log("data", data)
      try {
        const parsed = JSON.parse(data.data as unknown as string)
        if (parsed.youtubeId) {
          youtubeId = parsed.youtubeId
        }
      } catch (e) {
        console.error(e)
      }

      log = [...log, data.data as unknown as string]
      // const time = data.data as unknown as number
      // console.log({ data })
      // console.log(`Roundtrip time: ${Date.now() - time} ms`)
      // setTimeout(function timeout() {
      //   ws.send(Date.now())
      // }, 500)
    }

    ws.onerror = function error(err) {
      console.error(err)
    }
  }

  let status: string = "ready"

  function getLiveChat() {
    console.log("TODO")
  }
</script>

<main>
  <input
    type="text"
    bind:value={url}
    style="width: 16rem; margin-left: 3rem;"
  />
  <button on:click={connect}>Connect</button>

  {#if youtubeId}
    <div>Youtube ID: {youtubeId}</div>
    <button on:click={getLiveChat}>Get Live Chat</button>
  {/if}

  <div class="">
    Status: {status}
  </div>

  <div class="">
    Log: {JSON.stringify(log)}
  </div>
</main>

<style>
</style>
