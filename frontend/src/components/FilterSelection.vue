<template>
  <li>
    <div class="filter-title" @click="toggle">
      <strong>{{ title }}</strong>
      <span>{{ open ? "−" : "+" }}</span>
    </div>

    <div v-show="open">
      <div v-if="clearable" class="clear-filter">
        <label>
          <input
            type="checkbox"
            :checked="modelValue.length === 0"
            @change="clearFilter"
          />
          Tout désélectionner
        </label>
      </div>

      <div v-for="item in items" :key="item" class="filter-item">
        <label>
          <input
            type="checkbox"
            :value="item"
            :checked="modelValue.includes(item)"
            @change="onChange(item, $event)"
          />
          {{ format(item) }}
        </label>
      </div>
    </div>
  </li>
</template>

<script>
export default {
  props: {
    title: String,
    items: Array,
    modelValue: Array,
    formatter: Function,
    clearable: { type: Boolean, default: false },
  },
  emits: ["update:modelValue", "clear"],
  data() {
    return {
      open: false,
    };
  },
  methods: {
    clearFilter() {
      this.$emit("update:modelValue", []);
      this.$emit("clear");
    },
    toggle() {
      this.open = !this.open;
    },
    onChange(item, event) {
      let newValue = [...this.modelValue];

      if (event.target.checked) {
        newValue.push(item);
      } else {
        newValue = newValue.filter((i) => i !== item);
      }

      this.$emit("update:modelValue", newValue);
    },
    format(item) {
      return this.formatter ? this.formatter(item) : item;
    },
  },
};
</script>
