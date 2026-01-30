import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config';
import Tooltip from 'primevue/tooltip';
import Aura from '@primevue/themes/aura';
import 'primeicons/primeicons.css'

const app = createApp(App);

app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            prefix: 'p',
            darkModeSelector: 'system', // or '.my-app-dark'
            cssLayer: false
        }
    }
});
app.directive('tooltip', Tooltip);
app.mount('#app');