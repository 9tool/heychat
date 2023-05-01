<script lang="ts">
  export let message: MessageItem[] = []

  type MessageItem = { text: string } | EmojiItem
  interface EmojiItem extends ImageItem {
    emojiText: string
    isCustomEmoji: boolean
  }
  interface ImageItem {
    url: string
    alt: string
  }
</script>

{#each message as messageItem}
  {#if "text" in messageItem}
    {messageItem.text}
  {:else if "url" in messageItem}
    <img src={messageItem.url} alt={messageItem.alt} style="width: 24px;" />
    <!-- {messageItem.emojiText} -->
  {/if}
{/each}
