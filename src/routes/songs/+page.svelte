<script>
  import { base } from "$app/paths";
</script>

<div class="h-[100vh]">
  <div class="px-10 pt-10 w-full flex flex-col gap-5 items-center h-full">
    <div class="text-white w-full text-center italic text-3xl">
      Jenson's Songs
    </div>
    <a href={`${base}/songs/doughnuts`}>Doughnuts - <u>Sweet Sensation</u></a>
    <a href={`${base}/songs/uranus`}>Uranus - <u>Cosmic Game</u></a>
    <a href={`${base}/songs/uno`}>UNO - <u>Wild Card Winner</u></a>
    <!-- <a href={`${base}/songs/pirate`}>Pirates - <u>Pirates of the Deep</u></a> -->
  </div>
</div>

<style lang="postcss">
  a {
    @apply p-5 bg-blue-900 text-blue-100 whitespace-nowrap rounded-lg w-full text-center;
  }
</style>
