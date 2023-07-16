import { connect } from "@dagger.io/dagger"

connect(
  async (client) => {
    // use a node:18-slim container
    // mount the source code directory on the host
    // at /src in the container
    const source = client
      .container()
      .from("node:18-slim")
      .withDirectory("/src", client.host().directory("."), {
        exclude: ["node_modules/", "ci/", "tmp/"],
      })

    // set the working directory in the container
    // install application dependencies
    const runner = source
      .withWorkdir("/src")
      .withExec(["yarn", "install", "--frozen-lockfile"])

    // build application
    // write the build output to the host
    const buildDir = runner.withExec(["yarn", "build"]).directory("./dist")

    await buildDir.export("./dist")

    const e = await buildDir.entries()

    console.log("build dir contents:\n", e)

    // use an node:18-slim container
    // copy the dist/ directory into the container filesystem
    // publish the resulting container to a registry
    const imageRef = await client
      .container()
      .from("node:18-slim")
      .withDirectory("/app", buildDir)
      .withDirectory("/app/node_modules", runner.directory("./node_modules"))
      .withEntrypoint(["node", "/app/index.js"])
      .withExposedPort(8080)
      // .publish("ttl.sh/heychat-" + Math.floor(Math.random() * 10000000))
      .publish("ghcr.io/9tool/heychat:latest")

    console.log(`Published image to: ${imageRef}`)
  },
  { LogOutput: process.stdout }
)
