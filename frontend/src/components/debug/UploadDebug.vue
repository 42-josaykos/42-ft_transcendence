<script setup lang="ts">
// Props
const props = defineProps<{
  title: string;
}>();
</script>

<template>
  <h3 class="title">{{ title }}</h3>

  <form method="post" action="/upload" enctype="multipart/form-data">
    <div>
      <input type="file" id="file" name="avatarUpload" />
      <button>Upload</button>
    </div>
  </form>
</template>
