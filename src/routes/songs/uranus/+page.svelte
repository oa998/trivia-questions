<script>
  import { base } from "$app/paths";
  import { onMount } from "svelte";

  let audioRef;
  onMount(() => {
    audioRef.volume = 1;
  });
</script>

<div
  class="grid place-items-center bg-slate-900 w-full min-h-[100lvh] text-white"
>
  <img src={`${base}/star.webp`} class="my-10 max-w-[90vw]" />
  <audio bind:this={audioRef} controls>
    <source src={`${base}/Cosmic_Game_done.mp3`} type="audio/mpeg" />
    Your browser does not support the audio element.
  </audio>
  <pre class="text-center text-3xl underline pt-10">Cosmic Game</pre>
  <pre class="whitespace-pre-wrap text-white py-10 text-[8pt] px-2">
On a cloudless night
I'm on a quest
With my telescope
I won't settle for less
Lookin’ for a planet
Elusive and bright.
Searching for Uranus
Gonna find you tonight

It ain’t a star and
It ain’t my derriere.
Lost in the night sky
But I'll find you I swear
Spinnin' in the darkness
Elusive as can be
Oh Uranus
Won't you come play with me? 

I’m in a cosmic game
Of hide and seek
Trying to find Uranus
And the secrets that it keeps
But I won't give up (No)
I won't back down
I'll keep on searchin'
'til you're finally found
  </pre>
</div>
