<template>
    <div class = "page-wrapper">
        <aside class = "sidebar">
            <div class = "sidebar-content">
                <Sidebar :config="filterConfig" @update:filters = "handleFilterChange"/>
            </div>
        </aside>

        <div class = "main-content">
            <div>
                <div class = "search-bar-container">
                    <SearchBar @search="handleSearch"/>
                </div>
                <section class = "title-section">
                    <div class = "container">
                        <div class = "title-flex-wrapper">
                            <h2 class = "main-title">Sound effects for videos, apps, games and more</h2>
                            <p class = "description">    </p>
                        </div>
                    </div>
                </section>
                <section class = "filter-sort-section">
                    <div class = "contianer2">
                        <div class = "header-content-wrapper">
                            <button class = "filter-button" @click = "toggleSidebar">
                                <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                class="feather feather-sliders"
                                >
                                <line x1="4" y1="21" x2="4" y2="14"></line>
                                <line x1="4" y1="10" x2="4" y2="3"></line>
                                <line x1="12" y1="21" x2="12" y2="12"></line>
                                <line x1="12" y1="8" x2="12" y2="3"></line>
                                <line x1="20" y1="21" x2="20" y2="16"></line>
                                <line x1="20" y1="12" x2="20" y2="3"></line>
                                <line x1="1" y1="14" x2="7" y2="14"></line>
                                <line x1="9" y1="8" x2="15" y2="8"></line>
                                <line x1="17" y1="16" x2="23" y2="16"></line>
                                </svg>
                                {{ isSidebarOpen ? "Hide Filters" : "Show Filters"}}
                            </button>
                            <div class = "sort-and-view-options">
                                <div class = "sort-dropdown">
                                    <div class = "dropdown-header" @click.stop= "toggleSortDropdown">
                                        <span class = "current-sort">{{ currentSort?.label }}</span>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            viewbox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            stroke-width="2"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            class="feather feather-chevron-down"
                                        >
                                            <polyline points="6 9 12 15 18 9"></polyline>
                                        </svg>
                                    </div>
                                    <ul class = "dropdown-options">
                                        <li>

                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section class = "sfx-list-section">

                </section>
                <section class = "sfx-grid-section">

                </section>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import SearchBar from '~/components/SearchBar.vue';
import Sidebar from '~/components/Sidebar.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const isSidebarOpen = ref<boolean>(false);

interface FilterItem {
  id: string;
  title: string;
  componentType: string;
  props: {
    min?: number;
    max?: number;
    unit?: string;
    items?: { id: string; name: string; count: number }[];
  };
}

const filterConfig = ref<FilterItem[]>([]);

const handleSearch = (query: string) => {
    if(query){
        router.push({path:"/search",query:{q:query}});
    }
};

const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value;
};

onMounted(() => {
    console.log("SFX page is mounted!");
});
</script>

<style scoped>
.page-wrapper{
    overflow: hidden;
    background-color: #0d0d1a;
    color: #fff;
    transition: transform 0.3s ease-in-out;
}

.search-bar-container{
    background-color: transparent;
    padding-top: 80px;
    margin:0 auto;
    width:100%;
}

.main-title {
  font-size: 2.5em;
  font-weight: 800;
  line-height: 1.2; 
  color: #fff;
  text-align: left;
  margin-bottom: 20px;
  margin-left: 60px;
}

.filter-sort-section{
    padding: 20px 0;
}

.filter-button{
    display: flex;
    color: #0d0d1a;
    background-color: #ff8c62;
    gap: 10px;
    min-width: 170px;
    transition: 
        background-color 0.3s
        transform 0.3s;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 1em;
    padding: 12px 20px;
    border-radius: 50px;
    border: none;
    cursor: pointer;
    text-align: center;
}

.container{
    max-width: 80%;
    margin: 0;
}

.container2{
    max-width: 95%;
    margin:0 auto;
    padding: 0 20px;
}

.dropdown-header{
    display: flex;
    align-items: center;
    gap: 10px;
    background-color: #333;
    color: #fff;
    padding: 8px 12px;
    border-radius: 5px;
    cursor: pointer;
    transition: backgroound-color 0.3s;
    user-select: none;
}

.sort-dropdown{
    position: relative;
}

.sort-and-view-options{
    display: flex;
    align-items: center;
    gap: 20px;
}
</style>