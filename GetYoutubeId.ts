// Ref: https://github.com/GoneToneStudio/node-get-youtube-id-by-url

import axios, { AxiosInstance, AxiosResponse } from "axios"
import cheerio from "cheerio"

const axiosInstance: AxiosInstance = axios.create({
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36",
  },
  validateStatus: () => {
    return true
  },
})

/**
 * Check YouTube Url
 *
 * @param {string} url
 * @returns {boolean}
 */
const checkUrl = (url: string): boolean =>
  url.indexOf("youtube.com") !== -1 || url.indexOf("youtu.be") !== -1

/**
 * Get YouTube Channel ID By Url
 *
 * @param {string} url Channel Url
 * @returns {Promise<string>} Channel ID
 */
const channelId = async (url: string): Promise<string> => {
  if (checkUrl(url)) {
    const ytChannelPageResponse: AxiosResponse = await axiosInstance.get(url)
    const $ = cheerio.load(ytChannelPageResponse.data)

    // It was 'meta[itemprop="channelId"]' before
    const id = $('meta[itemprop="identifier"]').attr("content")
    if (id) {
      return id
    }
  } else {
    throw new Error(`"${url}" is not a YouTube url.`)
  }

  throw new Error(`Unable to get "${url}" channel id.`)
}

/**
 * Get YouTube Video ID By Url
 *
 * @param {string} url Video Url
 * @returns {Promise<string>} Video ID
 */
const videoId = async (url: string): Promise<string> => {
  if (checkUrl(url)) {
    const ytChannelPageResponse: AxiosResponse = await axiosInstance.get(url)
    const $ = cheerio.load(ytChannelPageResponse.data)

    const id = $('meta[itemprop="videoId"]').attr("content")
    if (id) {
      return id
    }
  } else {
    throw new Error(`"${url}" is not a YouTube url.`)
  }

  throw new Error(`Unable to get "${url}" video id.`)
}

export { channelId, videoId }
