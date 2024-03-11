<script>
  import Modal from "./modal.svelte";
</script>

<Modal on:close={() => (addDate = false)}>
  <form
    method="dialog"
    on:submit={(e) => {
      const f = new FormData(e.target);
      console.log(f);
    }}
  >
    <div>Add date:</div>
    <input type="date" id="birthday" name="birthday" />
    <button type="submit">Add</button>
  </form>
</Modal>
