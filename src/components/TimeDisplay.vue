<template>
    <div class="time-display">
      <div class="level">
        <div class="level-item has-text-centered timer">
          {{ displayTime }}
        </div>
      </div>
      <div class="level">
        <div v-if="hasControls" class="level-item has-text-centered buttons has-addons">
          <span @click="toggleTimer"
                class="button is-large">
            <font-awesome-icon :icon="running ? 'pause' : 'play'"
                                size="lg"></font-awesome-icon>
          </span>
          <span @click="stopTimer"
                class="button is-large">
            <font-awesome-icon  icon="stop"
                                size="lg"></font-awesome-icon>
          </span>
          <span v-if="hasCompleteButton" @click="completeTimer(true)"
                class="button is-large">
            <font-awesome-icon  icon="step-forward"
                                size="lg"></font-awesome-icon>
          </span>
        </div>
      </div>
    </div>
</template>

<script>
export default {
  props: {
    durationSec: {
      type: Number,
      default: 60,
    },
    hasCompleteButton: {
      type: Boolean,
      default: false,
    },
    hasControls: {
      type: Boolean,
      default: true,
    },
    useWordsOnControls: {
      type: Boolean,
      default: false,
    },
    precision: {
      type: Number,
      default: 100,
    },
  },
  data() {
    return {
      start: 0,
      remainingMinutes: Math.trunc(this.durationSec / 60),
      remainingSeconds: this.durationSec % 60,
      intervalID: null,
      running: false,
      paused: false,
      localDuration: this.durationSec * 1000,
    };
  },
  computed: {
    displayTime() {
      const min = Math.trunc(this.remainingMinutes);
      const sec = Math.trunc(this.remainingSeconds);
      const minStr = min < 10 ? `0${min}` : String(min);
      const secStr = sec < 10 ? `0${sec}` : String(sec);
      return `${minStr}:${secStr}`;
    },
  },
  watch: {
    durationSec(val) {
      if (!this.running || this.paused) {
        this.localDuration = val * 1000;
        this.remainingMinutes = Math.trunc(val / 60);
        this.remainingSeconds = Math.trunc(val % 60);
      }
    },
  },
  methods: {
    remainingMilliseconds() {
      if (typeof this.start === 'undefined' || this.start === 0) return undefined;
      return this.localDuration - (Date.now() - this.start);
    },
    toggleTimer() {
      if (this.running) {
        console.log('Pausing timer...');
        this.pauseTimer();
      } else {
        console.log('Starting timer...');
        this.startTimer();
      }
    },
    startTimer() {
      if (this.running) {
        console.warn('startTimer called while timer is running');
        return;
      }
      if (!this.paused) {
        this.$emit('timer-started');
      } else {
        this.$emit('timer-continued');
      }
      this.paused = false;
      this.running = true;
      const vm = this;
      this.start = Date.now();
      function timer() {
        const remainingMs = vm.remainingMilliseconds();
        if (remainingMs <= 0 || typeof remainingMs === 'undefined') {
          vm.completeTimer(false);
          return;
        }
        vm.remainingMinutes = remainingMs / 60000; // = remainingMs / 1000 / 60
        vm.remainingSeconds = (remainingMs / 1000) % 60;
      }

      this.intervalID = setInterval(timer, this.precision);
    },
    stopTimer() {
      if (this.localDuration !== this.durationSec * 1000) {
        this.localDuration = this.durationSec * 1000;
      }
      this.start = 0;
      this.remainingMinutes = Math.trunc(this.localDuration / 60000);
      this.remainingSeconds = (this.localDuration / 1000) % 60;
      this.running = false;
      this.paused = false;
      clearInterval(this.intervalID);
      this.$emit('timer-stopped');
    },
    pauseTimer() {
      this.running = false;
      this.paused = true;
      this.localDuration = this.remainingMilliseconds();
      clearInterval(this.intervalID);
      this.$emit('timer-paused');
    },
    completeTimer(manual = false) {
      if (this.localDuration !== this.durationSec * 1000) {
        this.localDuration = this.durationSec * 1000;
      }
      this.start = 0;
      this.remainingMinutes = Math.trunc(this.localDuration / 60000);
      this.remainingSeconds = (this.localDuration / 1000) % 60;
      this.running = false;
      this.paused = false;
      clearInterval(this.intervalID);
      this.$emit('timer-completed', manual);
    },
  },
};
</script>

<style lang="scss">
.time-display {
  padding-bottom: 1rem;
  padding-top: 1rem;
}

.timer {
  font-size: 8rem;
  line-height: 1;
}
</style>
