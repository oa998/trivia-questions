<script>
  import { base } from "$app/paths";
</script>

<div
  class="grid place-items-center bg-[#010101] w-full min-h-[100lvh] text-white"
>
  <img src={`${base}/disco.gif`} class="my-10 max-w-[90vw]" />
  <audio controls>
    <source src={`${base}/wild_card_winner.mp3`} type="audio/mpeg" />
    Your browser does not support the audio element.
  </audio>
  <pre class="text-center text-3xl underline pt-10">Wild Card Winner</pre>
  <pre class="whitespace-pre-wrap text-white py-10 text-[8pt] px-2">
I'm a wild card winner
Feelin' so fly
A groovy Uno player
can't beat me, you can try.
I got the moves
I got the tricks up my sleeve
A boogie woogie player
Can't you believe?

I'll skip you and reverse
Make you draw two
No one can beat me
I'll leave you feeling blue
I'm the Uno master
Playin' all night long
Got that funky disco beat
This is my victory song

Wild card winner
I'm the king of the game
Got the funk in my soul
"Uno Shark" is my name
Wild card winner
I take my stand
Hustling on the dance floor
Winning card in my hand    
  </pre>
</div>
