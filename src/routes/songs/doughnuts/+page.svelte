<script>
  import { base } from "$app/paths";
  import { onMount } from "svelte";

  let audioRef;
  onMount(() => {
    audioRef.volume = 1;
  });
</script>

<div
  class="grid place-items-center bg-[#77bbfe] w-full min-h-[100lvh] text-violet-800"
>
  <img src={`${base}/doughnut.gif`} class="my-10" />
  <audio bind:this={audioRef} controls>
    <source src={`${base}/Sweet_Salvation_V2.mp3`} type="audio/mpeg" />
    Your browser does not support the audio element.
  </audio>
  <pre class="text-center text-3xl underline pt-10">Sweet Salvation</pre>
  <pre class="whitespace-pre-wrap text-violet-800 py-10 text-[8pt] px-2">
    In a sterile room
    I'm stuck like glue
    Counting the days
    I want something to chew
    I'm happy but bored
    And my spirit is strong
    Dreaming 'bout food
    Yeah
    All day long
    
    My diet is strange
    It's a twisted game
    Mostly doughnuts and morphine
    That's my claim
    I'm craving more sprinkles
    and I can't get enough
    Oh, Sugary sweetness.
    That's my hospital stuff
    
    Doughnuts are my sweet salvation
    They're my happy pills
    My joyful sensation
    Though I can't go number two
    I'm feeling just fine
    I'm gonna bounce back
    One doughnut at a time
  </pre>
</div>
