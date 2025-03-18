<template>
  <div class="layout layout__content section-vivid-green">
    <slot />

    <template v-if="available">
      <ProductAvailable 
        :title="title" 
        :price="price" 
        :showOrder="showOrder"
        :orderLinks="orderLinks"
        :info="info"
        @toggle-order="toggleOrder" 
      />
    </template>

    <template v-else>
      <section>
        <PriceSection :price="price" :message1="$tr('Early bird price')" :message2="$tr('Coming in early 2025')" />
        <gsp-form 
          :gscriptID="gscript" 
          :siteKey="siteKey"
          @gsp-beforesubmit="beforeSubmit"
          @gsp-onsubmit="onSubmit"
          @gsp-oncaptchanotverified="captchaError"
        >
          <label class="block"><input type="email" data-gsp-name="Email" :data-gsp-data="email" v-model="email" :placeholder="$tr('Your email')" class="block" required /></label>

          <label class="block"><input disabled type="checkbox" v-model="deviceupdates" /> <span>{{ $tr('Get updates about smart devices') }}</span></label>

          <label class="block"><input type="checkbox" v-model="regularupdates" /> <span>{{ $tr('Receive regular emails from Robonomics') }}</span></label>

          <input type="hidden" data-gsp-name="Location" :data-gsp-data="location" />
          <input type="hidden" data-gsp-name="Tags" :data-gsp-data="tags.toString()" />

          <robo-button class="block" :loading="status === 'process'" :type="buttontype">{{ buttontext }}</robo-button>
          <span class="small-text error" v-if="message">{{ message }}</span>
        </gsp-form>
      </section>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, defineAsyncComponent } from 'vue';
import { translate as $tr } from '../../assets/scripts/utils/translate';

import RoboButton from '../utils/Button.vue';
import ProductAvailable from "./ProductAvailable.vue";
import PriceSection from "./PriceSection.vue";
const GspForm = defineAsyncComponent(() => import('../utils/Form.vue'));

// Props
const props = defineProps({
  price: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    required: true
  },
  orderLinks: {
    type: Array,
    required: true
  },
  info: {
    type: Array,
    required: true
  },
  available: {
    type: Boolean,
    default: false
  }
});

// Reactive data
const email = ref('');
const deviceupdates = ref(true);
const regularupdates = ref(false);
const location = ref(window.location.href);
const gscript = ref(import.meta.env.PUBLIC_CONTACTS_FORM_SCRIPT);
const siteKey = ref(import.meta.env.PUBLIC_RECAPTCHA);
const status = ref('init');
const tags = ref(['devices']);
const message = ref('');
const showOrder = ref(false);

// Computed values
const buttontype = computed(() => {
  return {
    ok: 'ok',
    error: 'error',
    na: 'na'
  }[status.value] ?? 'primary';
});

const buttontext = computed(() => ({
  'ok': $tr('Thanks for the submission!'),
  'error': $tr('Not submitted'),
  'process': $tr('Submitting'),
}[status.value] ?? $tr('Submit')));

// Methods
const toggleOrder = () => {
  showOrder.value = !showOrder.value;
};

const captchaError = () => {
  status.value = 'na';
  message.value = $tr('Captcha is not verified. Please, check your internet connection');
};

const beforeSubmit = () => {
  status.value = 'process';
  if (!regularupdates.value) {
    tags.value.push('only-devices');
  } else {
    tags.value.push('website');
  }
};

const onSubmit = (response) => {
  status.value = response.result === 'success' ? 'ok' : 'error';
  if (status.value === 'error') {
    message.value = response.message
  }
};

// Mounted lifecycle hook
onMounted(() => {
  window.document.addEventListener('click', (e) => {
    const productBuy = document.querySelector('.product-buy__container');
    let clickInside = productBuy.contains(e.target);
    if (!clickInside && productBuy.classList.contains('active')) {
      showOrder.value = false;
    }
  });
});
</script>

<style scoped>
.section-vivid-green {
  position: relative;
  min-height: 568px;
  display: grid;
  grid-template-columns: 1.5fr 2fr;
  gap: calc(var(--space) * 2);
  align-items: center;
  margin-top: calc(var(--space) * 2);
  margin-bottom: calc(var(--space) * 2);
  z-index: 15;
}

@media screen and (max-width: 900px) {
  .section-vivid-green {
    min-height: 498px;
  }
}

@media screen and (max-width: 600px) {
  .section-vivid-green {
    display: flex;
    flex-direction: column;
    gap: var(--space);
  }
}
</style>