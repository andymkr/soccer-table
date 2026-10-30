import type { StandingsRow } from '@/domain/standings'

export interface StandingsSegment {
  endPosition: number
  rows: StandingsRow[]
  startPosition: number
}

export function getStandingsSegmentCount(teamCount: number): number {
  if (teamCount <= 20) return 1
  if (teamCount <= 40) return 2
  return 3
}

export function splitStandingsRows(
  rows: readonly StandingsRow[],
): StandingsSegment[] {
  const segmentCount = getStandingsSegmentCount(rows.length)
  const baseSize = Math.floor(rows.length / segmentCount)
  const remainder = rows.length % segmentCount
  let start = 0

  return Array.from({ length: segmentCount }, (_, segmentIndex) => {
    const size = baseSize + (segmentIndex < remainder ? 1 : 0)
    const segmentRows = rows.slice(start, start + size)
    const startPosition = start + 1
    start += size

    return {
      endPosition: start,
      rows: segmentRows,
      startPosition,
    }
  })
}
