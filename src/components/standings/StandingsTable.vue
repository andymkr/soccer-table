<script setup lang="ts">
import { computed, shallowRef } from 'vue'

import type { Season, TableMode } from '@/domain/models'
import { calculateSeasonStandings } from '@/domain/seasonStandings'

import { splitStandingsRows } from './standingsSegments'
import StandingsTableSegment from './StandingsTableSegment.vue'

interface TableModeOption {
  label: string
  shortLabel: string
  value: TableMode
}

const props = defineProps<{
  season: Season
}>()

const modeOptions: readonly TableModeOption[] = [
  { label: 'Overall', shortLabel: 'All matches', value: 'overall' },
  { label: 'Home only', shortLabel: 'At home', value: 'home' },
  { label: 'Away only', shortLabel: 'On the road', value: 'away' },
]
const activeMode = shallowRef<TableMode>('overall')
const standings = computed(() =>
  calculateSeasonStandings(props.season, activeMode.value),
)
const activeOption = computed(
  () =>
    modeOptions.find((option) => option.value === activeMode.value) ??
    modeOptions[0]!,
)
const tableCaption = computed(
  () => `${activeOption.value.label} standings for ${props.season.name}`,
)
const segments = computed(() => splitStandingsRows(standings.value.rows))
const boardStyle = computed(() => ({
  '--standings-columns': segments.value.length,
}))
</script>

<template>
  <section
    class="standings-board"
    :style="boardStyle"
    aria-labelledby="standings-board-title"
  >
    <div class="mode-console">
      <div>
        <p class="console-label">Table channel</p>
        <h2 id="standings-board-title">{{ activeOption.shortLabel }}</h2>
      </div>

      <div class="mode-selector" role="group" aria-label="Standings mode">
        <button
          v-for="option in modeOptions"
          :key="option.value"
          type="button"
          class="mode-button"
          :class="{ 'mode-button--active': activeMode === option.value }"
          :aria-pressed="activeMode === option.value"
          aria-controls="season-standings-tables"
          @click="activeMode = option.value"
        >
          {{ option.label }}
        </button>
      </div>
    </div>

    <div id="season-standings-tables" class="table-segments">
      <StandingsTableSegment
        v-for="(segment, segmentIndex) in segments"
        :key="segment.rows[0]?.teamId ?? segmentIndex"
        :table-id="segmentIndex === 0 ? 'season-standings-table' : undefined"
        :rows="segment.rows"
        :region-label="
          segments.length === 1
            ? 'Scrollable standings table'
            : `Scrollable standings positions ${segment.startPosition} to ${segment.endPosition}`
        "
        :caption="
          segments.length === 1
            ? tableCaption
            : `${tableCaption}, positions ${segment.startPosition}–${segment.endPosition}`
        "
      >
      </StandingsTableSegment>
    </div>

    <footer class="table-footer" aria-live="polite">
      <span>Average total:</span>
      <strong>{{ standings.averageTotal }}</strong>
    </footer>
  </section>
</template>

<style scoped>
.standings-board {
  width: min(
    calc(100vw - 4rem),
    calc(
      (40.5rem * var(--standings-columns)) +
        (1px * (var(--standings-columns) - 1)) + 2px
    )
  );
  position: relative;
  left: 50%;
  margin-inline: 0;
  transform: translateX(-50%);
  overflow: hidden;
  border: 1px solid var(--color-line-strong);
  border-radius: 0.3rem;
  background: var(--color-panel-deep);
  box-shadow: 0 1.5rem 4rem rgb(0 0 0 / 18%);
}

.mode-console {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  padding: 1rem 1.15rem;
  border-bottom: 1px solid var(--color-line-strong);
  background: var(--color-panel-raised);
}

.console-label {
  margin: 0;
  color: var(--color-muted);
  font: 650 0.62rem/1 var(--font-utility);
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.mode-console h2 {
  margin: 0.3rem 0 0;
  color: var(--color-chalk);
  font: 750 1.15rem/1 var(--font-headline);
}

.mode-selector {
  display: inline-grid;
  grid-template-columns: repeat(3, auto);
  padding: 0.2rem;
  border: 1px solid var(--color-line-strong);
  border-radius: 0.25rem;
  background: var(--color-panel-deep);
}

.mode-button {
  min-height: 2.75rem;
  padding: 0.55rem 0.9rem;
  border: 0;
  border-radius: 0.15rem;
  background: transparent;
  color: var(--color-soft);
  cursor: pointer;
  font: 700 0.7rem/1 var(--font-utility);
  letter-spacing: 0.02em;
}

.mode-button:hover {
  color: var(--color-chalk);
}

.mode-button--active {
  background: var(--color-floodlight-strong);
  color: #fff;
  box-shadow: inset 0 -2px 0 var(--color-floodlight);
}

.table-segments {
  display: grid;
  grid-template-columns: repeat(var(--standings-columns), minmax(0, 1fr));
}

.table-segments > :not(:first-child) {
  border-left: 1px solid var(--color-line-strong);
}

.table-footer {
  display: flex;
  align-items: baseline;
  justify-content: flex-end;
  gap: 0.8rem;
  padding: 1rem 1.15rem;
  border-top: 1px solid var(--color-line-strong);
  background: var(--color-panel);
}

.table-footer span {
  color: var(--color-muted);
  font: 650 0.65rem/1 var(--font-utility);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.table-footer strong {
  color: var(--color-referee);
  font: 800 1.25rem/1 var(--font-utility);
}

@media (max-width: 720px) {
  .standings-board {
    width: 100%;
  }

  .mode-console {
    align-items: stretch;
    flex-direction: column;
  }

  .mode-selector {
    grid-template-columns: repeat(3, 1fr);
  }

  .mode-button {
    padding-inline: 0.45rem;
  }
}

@media (max-width: 82rem) {
  .table-segments {
    grid-template-columns: 1fr;
  }

  .table-segments > :not(:first-child) {
    border-top: 1px solid var(--color-line-strong);
    border-left: 0;
  }
}
</style>
