<script setup lang="ts">
// Props
const props = defineProps<{
  title: string;
}>();
</script>

<template>
  <h3 class="title">{{ title }}</h3>

  <form
    method="post"
    action="http://localhost:9090/upload"
    enctype="multipart/form-data"
  >
    <div>
      <label for="file">Choose a file</label>
      <input type="file" id="file" name="avatarUpload" />
    </div>
    <div>
      <button>Send the files</button>
    </div>
  </form>
</template>
