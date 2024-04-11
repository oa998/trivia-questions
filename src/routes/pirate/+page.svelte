<script>
  import { onMount } from "svelte";

  let audioRef;
  onMount(() => {
    audioRef.volume = 1;
  });
</script>

<div
  class="grid place-items-center bg-green-900 w-full min-h-[100lvh] text-lime-300"
>
  <img src="giphy.gif" class="my-10" />
  <audio bind:this={audioRef} controls>
    <source src="pirates_of_the_deep_full.mp3" type="audio/mpeg" />
    Your browser does not support the audio element.
  </audio>
  <pre class="text-center text-3xl underline pt-10">Pirates of the Deep</pre>
  <pre class="text-center text-sm">a sea shanty</pre>
  <pre class="whitespace-pre-wrap text-lime-300 py-10 text-[8pt] px-2">
Hoist the sails, raise the anchor, lads
We're setting sail for distant lands
A legend tells of a hidden chest
Filled with gold, the very best

We sail through storms and treacherous seas
No fear in our hearts, we're pirates, you see
With cutlasses gleaming and cannons ablaze
We'll conquer any danger that comes our way

Yo ho, yo ho, pirates of the deep
Searching for treasure, our fortunes to keep
Through perilous waters, we'll venture afar
Fearless pirates, seizing what's ours

Under the light of the moon we will roam
With the stars as our guide and the ocean our home.
Whispers of fortunes, the treasure it calls
Towards the horizon, we will risk it all

In the heart of the storm, our courage shines bright,
Facing each challenge with all of our might.
With swords in hand, we stand undeterred,
For we are the pirates, our victory assured.

Yo ho, yo ho, pirates of the deep
Searching for treasure, our fortunes to keep
Through perilous waters, we'll venture afar
Fearless pirates, seizing what's ours
  </pre>
</div>
