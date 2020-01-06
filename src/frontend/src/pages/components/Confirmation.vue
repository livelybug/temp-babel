<template>
  <q-modal v-model="minimizedModalTwo" minimized no-backdrop-dismiss ref="modalRef">
    <div style="padding: 50px">
      <p>{{$t("accountWillBeDeleted")}}</p>

      <q-btn
        id="confirmDisable"
        color="red"
        v-close-overlay
        :label="$t('confirm')"
        v-on:click="confirmDelete(1)"
      />&nbsp;&nbsp;
      <q-btn
        id="cancelDisable"
        color="blue"
        v-close-overlay
        :label="$t('cancel')"
        @click="confirmDelete(0)"
      />
    </div>
  </q-modal>
</template>

<script>
export default {
  name: 'Confirmation',
  // props: ['minimizedModal'],
  props: {
    minimizedModal: {
      type: Boolean
    }
  },
  data () {
    return {
      minimizedModalTwo: this.minimizedModal
    }
  },
  watch: {
    minimizedModal (val) {
      this.minimizedModalTwo = val
    }
  },
  methods: {
    confirmDelete (v) {
      this.$emit('listenToChildEvent', [false, v])
    }
  }
}
</script>
