<template>
  <section class="section">
    <div class="container">
      <div class="title">Tomato Productivity Timer</div>
      <time-display :duration-sec="currentIntervalDuration"
                    :has-complete-button="true"
                    @timer-completed="timerCompleted"
                    @timer-started="timerStarted"
                    @timer-continued="timerContinued"
                    ref="timeDisplay"></time-display>
      <nav class="level">
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">Started</p>
            <p class="title">{{ startTimeString }}</p>
          </div>
        </div>
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">Status</p>
            <p class="title">{{ statusString }}</p>
          </div>
        </div>
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">Sessions So Far</p>
            <p class="title">{{ completedSessions }}</p>
          </div>
        </div>
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">Next Long Break In</p>
            <p class="title">{{ nextLongBreakIn }}</p>
          </div>
        </div>
      </nav>
      <div class="has-text-centered">
        <button @click="playAudio"
                class="button">Play Audio</button>
      </div>
    </div>
    <audio ref="audioPlayer"
            :src="`${publicPath}correct.wav`"></audio>
  </section>
</template>

<script>
import TimeDisplay from '@/components/TimeDisplay.vue';

const SESSION_STATES = {
  SESSION: 0,
  SHORT_BREAK: 1,
  LONG_BREAK: 2,
  INACTIVE: 3,
};

export default {
  components: {
    TimeDisplay,
  },
  data() {
    return {
      sessionState: SESSION_STATES.INACTIVE,
      completedSessions: 0,
      startTime: 0,
      settings: {
        sessionDuration: 25 * 60,
        shortBreakDuration: 5 * 60,
        longBreakDuration: 20 * 60,
        sessionsUntilLongBreak: 4,
      },
      publicPath: process.env.BASE_URL,
    };
  },
  computed: {
    currentIntervalDuration() {
      switch (this.sessionState) {
        case SESSION_STATES.SESSION:
        case SESSION_STATES.INACTIVE:
          return this.settings.sessionDuration;
        case SESSION_STATES.SHORT_BREAK:
          return this.settings.shortBreakDuration;
        case SESSION_STATES.LONG_BREAK:
          return this.settings.longBreakDuration;
        default:
          console.warn(`Unknown sessionState ${this.sessionState}.`);
          return 0;
      }
    },
    nextLongBreakIn() {
      const remaining = this.settings.sessionsUntilLongBreak
        - (this.completedSessions % this.settings.sessionsUntilLongBreak);
      if (remaining === 1) return 'Next';
      return remaining;
    },
    statusString() {
      switch (this.sessionState) {
        case SESSION_STATES.SESSION:
          return 'In Session';
        case SESSION_STATES.INACTIVE:
          return 'Not Started';
        case SESSION_STATES.SHORT_BREAK:
          return 'Break';
        case SESSION_STATES.LONG_BREAK:
          return 'Long Break';
        default:
          console.warn(`Unknown sessionState ${this.sessionState}.`);
          return 'Unknown';
      }
    },
    startTimeString() {
      if (this.startTime === 0) return 'Not Yet';
      const d = new Date(this.startTime);
      if (d.toString() === 'Invalid Date') return 'Never?';
      const hours = d.gethours() < 10 ? `0${d.getHours()}` : String(d.getHours());
      const mins = d.getMinutes() < 10 ? `0${d.getMinutes()}` : String(d.getMinutes());
      return `${hours}:${mins}`;
    },
  },
  methods: {
    timerStarted() {
      if (this.sessionState === SESSION_STATES.INACTIVE) {
        this.sessionState = SESSION_STATES.SESSION;
        this.startTime = Date.now();
      }
    },
    timerCompleted(manual) {
      if (this.sessionState === SESSION_STATES.INACTIVE) {
        return;
      }
      if (this.sessionState === SESSION_STATES.SESSION) {
        if (this.nextLongBreakIn === 'Next') {
          this.sessionState = SESSION_STATES.LONG_BREAK;
        } else {
          this.sessionState = SESSION_STATES.SHORT_BREAK;
        }
        this.completedSessions += 1;
      } else {
        this.sessionState = SESSION_STATES.SESSION;
      }
    },
    timerPaused() {

    },
    timerContinued() {
      console.log('Timer continued');
    },
    startTimerExternally() {
      this.$refs.timeDisplay.startTimer();
    },
    playAudio() {
      this.$refs.audioPlayer.play();
    },
  },
};
</script>

<style lang="scss">

</style>
