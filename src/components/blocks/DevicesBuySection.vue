<template>
  <div class="layout layout__content section-vivid-green">
    <slot />

    <section>
      <div class="price" v-if="price">
        <div class="price-number">{{ price }}</div>
        <div class="price-desc">
          <div>Early bird price</div>
          <div>Coming in early 2025</div>
        </div>
      </div>

      <gsp-form 
        :gscriptID="gscript" 
        :siteKey="siteKey"
        @gsp-beforesubmit="beforeSubmit"
        @gsp-onsubmit="onSubmit"
        @gsp-oncaptchanotverified="captchaError"
      >
        <label class="block"><input type="email" data-gsp-name="Email" :data-gsp-data="email" v-model="email" placeholder='Your email' class="block" required /></label>

        <label class="block"><input disabled type="checkbox" v-model="deviceupdates" /> <span>Get updates about smart devices</span></label>

        <label class="block"><input type="checkbox" v-model="regularupdates" /> <span>Receive regular emails from Robonomics</span></label>

        <input type="hidden" data-gsp-name="Location" :data-gsp-data="location" />
        <input type="hidden" data-gsp-name="Tags" :data-gsp-data="tags.toString()" />

        <robo-button class="block" :loading="status === 'process'" :type="buttontype">{{ buttontext }}</robo-button>
        <span class="small-text error" v-if="message">{{ message }}</span>
      </gsp-form>
    </section>
  </div>
</template>


<script setup>
import { ref, computed, defineAsyncComponent } from 'vue';
import RoboButton from '../utils/Button.vue';

const GspForm = defineAsyncComponent(() => import('../utils/Form.vue'));

const email = ref('');
const location = ref(window.location.href);
const deviceupdates = ref(true);
const regularupdates = ref(false);
const gscript = ref(import.meta.env.PUBLIC_CONTACTS_FORM_SCRIPT);
const siteKey = ref(import.meta.env.PUBLIC_RECAPTCHA);
const status = ref('init');
const tags = ref(['devices']);
const message = ref('');

const props = defineProps({
  price: {
    type: String
  }
});

const buttontype = computed(() => ({
  'ok': 'ok',
  'error': 'error',
  'na': 'na',
}[status.value] ?? 'primary'));

const buttontext = computed(() => ({
  'ok': 'Thanks for the submission!',
  'error': 'Not submitted',
  'process': 'Submitting',
}[status.value] ?? 'Submit'));

const captchaError = () => {
  status.value = 'na';
  message.value = 'Captcha is not verified. Please, check your internet connection';
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


</script>

<style scoped>
.section-vivid-green {
  display: grid;
  grid-template-columns: 1.5fr 2fr;
  gap: calc(var(--space) * 2);
  align-items: center;
  margin-top: calc(var(--space) * 2);
  margin-bottom: calc(var(--space) * 2);
}

@media screen and (max-width: 600px) {
  .section-vivid-green {
    display: flex;
    flex-direction: column;
    gap: var(--space);
  }
}

section {
  max-width: 500px;
}

.price {
  display: flex;
  gap: var(--space);
  align-content: flex-start;
  margin-bottom: var(--space);
}

.price-number {
  font-variation-settings: var(--font-flex-bold);
  font-size: 3rem;
  line-height: 1;
}

.price-desc {
  min-width: 170px;
  font-variation-settings: var(--font-flex-medium);
}

.error {
  display: inline-block;
  margin-bottom: var(--space);
  line-height: 1.2;
  color: var(--color-red);
}
</style>