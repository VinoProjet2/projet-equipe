<template>
  <li>
    <div class="filter-title" @click="open = !open">
      <strong>{{ label }}</strong>
      <span>{{ open ? "−" : "+" }}</span>
    </div>

    <div v-show="open" class="price-range">
      <div class="slider-container">
        <label>Minimum</label>
        <input
          type="range"
          :min="minLimit"
          :max="maxLimit"
          v-model.number="localMin"
          @input="onMinChange"
        />
        <div class="values">
          <span>{{ localMin }}</span>
        </div>
        <label>Maximum</label>
        <input
          type="range"
          :min="minLimit"
          :max="maxLimit"
          v-model.number="localMax"
          @input="onMaxChange"
        />
        <div class="values">
          <span>{{ localMax }}</span>
        </div>
      </div>
    </div>
  </li>
</template>

<script>
export default {
  props: {
    modelValue: Object,
    minLimit: {
      type: Number,
      default: 0,
    },
    maxLimit: {
      type: Number,
      default: 100,
    },
    label: {
      type: String,
      default: "Prix",
    },
  },
  emits: ["update:modelValue", "change"],

  data() {
    return {
      open: false,
      localMin: this.minLimit,
      localMax: this.maxLimit,
    };
  },

  watch: {
    minLimit: {
      immediate: true,
      handler(val) {
        this.localMin = val;
      },
    },
    maxLimit: {
      immediate: true,
      handler(val) {
        this.localMax = val;
      },
    },
    modelValue: {
      handler(val) {
        if (!val) return;

        this.localMin = val.min ?? this.minLimit;
        this.localMax = val.max ?? this.maxLimit;
      },
      deep: true,
      immediate: true,
    },

    open(val) {
      if (val) {
        this.localMin = this.modelValue?.min ?? this.minLimit;
        this.localMax = this.modelValue?.max ?? this.maxLimit;
      }
    },
  },

  methods: {
    onMinChange() {
      if (this.localMin > this.localMax) {
        this.localMin = this.localMax;
      }
      this.update();
    },

    onMaxChange() {
      if (this.localMax < this.localMin) {
        this.localMax = this.localMin;
      }
      this.update();
    },

    update() {
      const value = {
        min: this.localMin,
        max: this.localMax,
      };

      this.$emit("update:modelValue", value);
      this.$emit("change", value);
    },
  },
};
</script>
