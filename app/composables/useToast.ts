// src/composables/useToast.ts
import {ref} from 'vue';

const isVisible = ref<boolean>(false);
const message = ref<string>('');
let timer: number | null = null;

export function useToast(){
    const showToast = (msg: string, duration: number = 2000) =>{
        message.value = msg;
        isVisible.value = true;

        if(timer) clearTimeout(timer);

        timer = window.setTimeout(() => {
            isVisible.value = false;
            timer = null;
          }, duration);
    };
    return {
        isVisible,
        message,
        showToast
    };
}