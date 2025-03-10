<template>
  <div v-bind="$attrs" :class="classes" aria-label="3d model for outdoor sensor Altruist" ref="modelContainer">
    <div class="img">
      <img src="/images/hardware-2025/altruist/pink/Altruist-Layout-1.webp" alt="Altruist Layout 1" />
      <img v-if="showColor === 'yellow'" src="/images/hardware-2025/altruist/yellow/Altruist-Layout-1.webp" alt="Altruist Layout 1" />
      <img v-if="showColor === 'blue'" src="/images/hardware-2025/altruist/blue/Altruist-Layout-1.webp" alt="Altruist Layout 1" />
    </div>

    <div class="img">
      <img src="/images/hardware-2025/altruist/pink/Altruist-Layout-2.webp" alt="Altruist Layout 2" />
      <img v-if="showColor === 'yellow'" src="/images/hardware-2025/altruist/yellow/Altruist-Layout-2.webp" alt="Altruist Layout 2" />
      <img v-if="showColor === 'blue'" src="/images/hardware-2025/altruist/blue/Altruist-Layout-2.webp" alt="Altruist Layout 2" />
    </div>

    <img class="img" v-if="!noanimation" src="/images/hardware-2025/altruist/Altruist-Layout-3.webp" alt="Altruist Layout 3" />

    <div class="img">
      <img src="/images/hardware-2025/altruist/pink/Altruist-Layout-4.webp" alt="Altruist Layout 4" />
      <img v-if="showColor === 'yellow'" src="/images/hardware-2025/altruist/yellow/Altruist-Layout-4.webp" alt="Altruist Layout 4" />
      <img v-if="showColor === 'blue'" src="/images/hardware-2025/altruist/blue/Altruist-Layout-4.webp" alt="Altruist Layout 4" />
    </div>

  </div>
</template>

<script>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';

export default {
  props: {
    noanimation: {
      type: Boolean,
      default: false
    }
  },

  setup(props) {
    const scrollProgress = ref(0);
    const colors = ['pink', 'yellow', 'blue'];
    const colorIndex = ref(0);
    const cycleCount = ref(0);
    const maxCycles = 5;
    const colorChangeDelay = 500; // Задержка в миллисекундах
    const lastColorChangeTime = ref(0);
    const hasEnteredViewport = ref(false);
    const imagesLoaded = ref(false);
    const modelContainer = ref(null);

    const showColor = computed(() => colors[colorIndex.value]);
    const classes = computed(() => ({
      model: true,
      'model-noanimation': props.noanimation
    }));

    const checkViewport = () => {
      if (props.noanimation && !hasEnteredViewport.value) {
        const element = modelContainer.value;
        if (element.classList.contains('in-viewport')) {
          hasEnteredViewport.value = true;
          startColorCycle();
        }
      }
    };

    const startColorCycle = () => {
      if (cycleCount.value < maxCycles) {
        colorIndex.value = (colorIndex.value + 1) % colors.length;
        if (colorIndex.value === 0) {
          cycleCount.value++;
        }
        setTimeout(startColorCycle, colorChangeDelay);
      }
    };

    const updateScrollProgress = () => {
      const rect = modelContainer.value.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const lowerQuarterScreen = windowHeight * 0.75;
      const maxScroll = windowHeight + rect.height;

      if (rect.top > lowerQuarterScreen) {
        scrollProgress.value = 0;
      } else {
        const scrollPos = Math.min(Math.max(windowHeight - rect.top, 0), maxScroll);
        scrollProgress.value = Math.max(0, Math.min(1, (scrollPos - lowerQuarterScreen) / (maxScroll - lowerQuarterScreen)));
      }

      const isVisible = rect.top < windowHeight && rect.bottom > 0;
      const now = Date.now();

      if (isVisible && cycleCount.value < maxCycles && now - lastColorChangeTime.value > colorChangeDelay) {
        colorIndex.value = (colorIndex.value + 1) % colors.length;
        if (colorIndex.value === 0) {
          cycleCount.value++;
        }
        lastColorChangeTime.value = now;
      }

      if (cycleCount.value >= maxCycles) {
        colorIndex.value = 0;
      }

      if (!props.noanimation) {
        const images = modelContainer.value.querySelectorAll('.model:not(.model-noanimation) .img');
        images.forEach(img => {
          img.style.setProperty('--koef', scrollProgress.value);
        });
      }
    };

    const checkImagesLoaded = () => {
      const images = modelContainer.value.querySelectorAll('img');
      let loadedCount = 0;

      images.forEach(img => {
        if (img.complete) {
          loadedCount++;
        } else {
          img.onload = () => {
            loadedCount++;
            if (loadedCount === images.length) {
              imagesLoaded.value = true;
            }
          };
        }
      });

      if (loadedCount === images.length) {
        imagesLoaded.value = true;
      }
    };


  const handleIntersection = (entries) => {
    entries.forEach((entry) => {
      if (entry.target) {
        entry.target.classList.toggle('in-viewport', entry.isIntersecting);
      }
    });
  };

    watch(imagesLoaded, (newValue) => {
      if (newValue) {
        if (!props.noanimation) {
          window.addEventListener('scroll', updateScrollProgress);
        } else {
          setTimeout(() => {
            checkViewport();
            window.addEventListener('scroll', checkViewport);
          }, 1000);
        }
      }
    });

    onMounted(() => {
      checkImagesLoaded();

      const observer = new IntersectionObserver(handleIntersection, {
        rootMargin: '-300px 0px',
      });
      
      if (modelContainer.value) {
        observer.observe(modelContainer.value);
      }
    });

    onBeforeUnmount(() => {
      if (!props.noanimation) {
        window.removeEventListener('scroll', updateScrollProgress);
      } else {
        window.removeEventListener('scroll', checkViewport);
      }
    });

    return {
      scrollProgress,
      colors,
      colorIndex,
      cycleCount,
      maxCycles,
      colorChangeDelay,
      lastColorChangeTime,
      hasEnteredViewport,
      imagesLoaded,
      showColor,
      classes,
      checkViewport,
      startColorCycle,
      updateScrollProgress,
      checkImagesLoaded,
      modelContainer
    };
  }
};
</script>

<style scoped>
@property --koef {
  syntax: '<number>';
  initial-value: 0;
  inherits: false;
}

.model {
  position: relative;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
}

.model .img {
  display: block;
  width: 100%;
  --koef: 0;
  --opengap: 50px;
  transition: transform 0.5s ease-out;
}

.model .img:first-child {
  margin-bottom: calc(var(--opengap) * var(--koef) * 5);
}

.model .img:not(:first-child) {
  position: absolute;
  left: 0;
  top: 0;
}

.model .img:nth-child(1) {
  position: relative;
  z-index: 7;
}

.model .img img:nth-child(2), .model .img img:nth-child(3) {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
}

.model .img img:nth-child(3) {
  z-index: 2;
}

.model .img:nth-child(2) {
  z-index: 7;
  transform: translateY(calc(var(--opengap) * var(--koef) * 4));
}

.model .img:nth-child(3) {
  z-index: 6;
  transform: translateY(calc(var(--opengap) * var(--koef) * 3));
}

.model .img:nth-child(4) {
  z-index: 5;
  transform: translateY(calc(var(--opengap) * var(--koef) * 4));
}

.model .img:nth-child(5) {
  z-index: 3;
  transform: translateY(calc(var(--opengap) * var(--koef) * 3));
}

@media screen and (max-width: 850px) {
  .model .img {
    --opengap: 50px !important;
  }
}

@media screen and (max-width: 650px) {
  .model .img {
    --opengap: 30px !important;
  }
}

@media screen and (max-width: 400px) {
  .model .img {
    --opengap: 20px !important;
  }
}
</style>
