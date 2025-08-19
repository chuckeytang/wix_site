<template>
    <section class = "search-section">
        <div class = "container search-container">
            <div class = "search-input-wrapper">
                <input
                    v-model="searchQuery"
                    type = "text"
                    v-bind:placeholder = "placeholderText"
                    class = "search-input"
                    v-on:keyup.enter = "handleSearch"
                />
                <button class = "search-button" @click = "handleSearch">
                    <svg
                        xmlns = "http://www.w3.org/2000/svg"
                        width = "24"
                        height = "24"
                        viewBox = "0 0 24 24"
                        fill = "none"
                        stroke = "currentColor"
                        stroke-width = "2"
                        stroke-linecap = "round"
                        stroke-linejoin = "round"
                    >
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                </button>
            </div>
        </div>
    </section>
</template>

<script setup>
    import {ref} from 'vue';

    const props = defineProps({
        placeholderText:{
            type: String,
            default:'Search by genre, mood, purpose or instrument',
        },
    });

    const searchQuery = ref('');

    const emit = defineEmits(['search']);

    const handleSearch = () => {
        emit('search',searchQuery.value);
    };
</script>

<style scoped>
.search-section {
  background-color: #1a1a1a;
  padding: 20px 0;
  padding-top: 100px; 
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}

.search-container {
  display: flex;
  justify-content: center;
}

.search-input-wrapper {
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 800px;
  background-color: #333;
  border-radius: 5px;
  padding: 10px 15px;
}

.search-input {
  flex-grow: 1;
  border: none;
  background: transparent;
  color: #fff;
  font-size: 16px;
  outline: none;
}

.search-input::placeholder {
  color: #888;
}

.search-button {
  background: none;
  border: none;
  cursor: pointer;
  color: #ccc;
  padding: 5px;
}

.search-button svg {
  width: 20px;
  height: 20px;
}
</style>