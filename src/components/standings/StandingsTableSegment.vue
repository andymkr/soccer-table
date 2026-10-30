<script setup lang="ts">
import type { StandingsRow } from '@/domain/standings'

defineProps<{
  caption: string
  regionLabel: string
  rows: readonly StandingsRow[]
  tableId?: string
}>()
</script>

<template>
  <div
    class="table-scroll"
    role="region"
    :aria-label="regionLabel"
    tabindex="0"
  >
    <table :id="tableId" class="standings-table" aria-label="Season standings">
      <caption class="visually-hidden">
        {{
          caption
        }}
      </caption>
      <thead>
        <tr>
          <th scope="col" class="position-column">
            <abbr title="Position">POS</abbr>
          </th>
          <th scope="col" class="team-column">Team</th>
          <th scope="col"><abbr title="Played">PLD</abbr></th>
          <th scope="col"><abbr title="Won">W</abbr></th>
          <th scope="col"><abbr title="Drawn">D</abbr></th>
          <th scope="col"><abbr title="Lost">L</abbr></th>
          <th scope="col"><abbr title="Scored for">SF</abbr></th>
          <th scope="col"><abbr title="Scored against">SA</abbr></th>
          <th scope="col"><abbr title="Score difference">SD</abbr></th>
          <th scope="col" class="points-column">
            <abbr title="Points">PTS</abbr>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row.teamId">
          <td class="position-cell">{{ row.position }}</td>
          <th scope="row" class="team-cell" :title="row.teamName">
            {{ row.teamName }}
          </th>
          <td>{{ row.played }}</td>
          <td>{{ row.won }}</td>
          <td>{{ row.drawn }}</td>
          <td>{{ row.lost }}</td>
          <td>{{ row.scoredFor }}</td>
          <td>{{ row.scoredAgainst }}</td>
          <td>{{ row.scoreDifference }}</td>
          <td class="points-cell">{{ row.points }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.table-scroll {
  min-width: 0;
  overflow-x: auto;
  overscroll-behavior-inline: contain;
}

.standings-table {
  width: 40.5rem;
  min-width: 40.5rem;
  border-collapse: collapse;
  table-layout: fixed;
  font-variant-numeric: tabular-nums;
}

.standings-table th,
.standings-table td {
  height: 2.85rem;
  padding: 0.55rem 0.65rem;
  border-bottom: 1px solid var(--color-line);
  text-align: center;
}

.standings-table thead th {
  height: 2.5rem;
  background: var(--color-panel);
  color: var(--color-muted);
  font: 750 0.65rem/1 var(--font-utility);
  letter-spacing: 0.07em;
}

.standings-table abbr {
  text-decoration: none;
}

.standings-table tbody td {
  color: var(--color-soft);
  font: 650 0.8rem/1 var(--font-utility);
}

.standings-table tbody tr:last-child th,
.standings-table tbody tr:last-child td {
  border-bottom: 0;
}

.standings-table tbody tr:hover {
  background: rgb(100 168 220 / 6%);
}

.position-column {
  width: 3.4rem;
}

.team-column {
  width: 9.5rem;
  text-align: left !important;
}

.points-column {
  width: 4.25rem;
  color: var(--color-floodlight) !important;
}

.position-cell {
  color: var(--color-muted) !important;
}

.team-cell {
  overflow: hidden;
  color: var(--color-chalk);
  font: 700 0.9rem/1.2 var(--font-headline);
  text-align: left !important;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.points-cell {
  color: var(--color-chalk) !important;
  font-weight: 850 !important;
}
</style>
