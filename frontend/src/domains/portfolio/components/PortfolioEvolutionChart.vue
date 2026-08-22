<script setup lang="ts">
import { computed, ref, useId } from 'vue';
import { AButton } from '@/domains/ui';
import { formatCompact, formatMoney, formatPct, toNumber } from '@/lib/format';
import { formatShortMonthYear, formatLongMonthYear } from '@/lib/dates';
import { returnLabel } from '../presentation';
import type { PortfolioTimelinePoint } from '../types';

const props = defineProps<{
  points: PortfolioTimelinePoint[];
  currency: string;
}>();

// Misma geometría que el gráfico de Patrimonio: viewBox fijo y ancho 100%, así el SVG
// escala con el contenedor y las dos vistas comparten proporciones. Bajo la serie va
// una banda de barras, como allí, pero aquí descompone el mes en sus dos causas.
const W = 1280;
const padL = 78;
const padR = 28;
const padT = 18;
const padB = 30;
const gap = 14;
const lineH = 280;
const barsH = 96;
// Fila propia para las fechas: sin ella las barras negativas más largas se metían
// debajo de las etiquetas y se leían cortadas.
const labelRow = 22;
const totalH = lineH + gap + barsH + labelRow;

const wrapRef = ref<HTMLElement | null>(null);
const hoverIndex = ref<number | null>(null);
const returnHoverIndex = ref<number | null>(null);
const chartMode = ref<'value' | 'return'>('value');
const chartId = useId().replace(/[^a-zA-Z0-9_-]/g, '');
const areaGradientId = `a-pf-evo-grad-${chartId}`;

const usablePoints = computed(() =>
  props.points.filter(
    (point): point is PortfolioTimelinePoint & { value: string } => point.value !== null,
  ),
);
const returnPoints = computed(() =>
  (() => {
    const rows = usablePoints.value
      .filter((point) => point.return.nominal !== null)
      .map((point) => ({ point, value: toNumber(point.return.nominal) }));
    const first = usablePoints.value[0];
    if (first && rows.length && rows[0]!.point.date !== first.date) {
      rows.unshift({ point: first, value: 0 });
    }
    return rows;
  })(),
);

// Cada mes se parte en sus dos causas: lo que entró o salió de tu bolsillo y lo que
// hizo el mercado. Δvalor = aportación + revalorización por construcción, así que la
// segunda se deriva restando y no puede descuadrar con la primera.
const movements = computed(() =>
  usablePoints.value.map((point, index) => {
    const previous = index === 0 ? null : usablePoints.value[index - 1]!;
    if (!previous) return { contribution: 0, revaluation: 0, hasPrevious: false };
    const contribution =
      toNumber(point.contributed_to_date) - toNumber(previous.contributed_to_date);
    const change = toNumber(point.value) - toNumber(previous.value);
    return { contribution, revaluation: change - contribution, hasPrevious: true };
  }),
);

const bounds = computed(() => {
  const values = usablePoints.value.flatMap((point) => [
    toNumber(point.value),
    toNumber(point.contributed_to_date),
  ]);
  const min = Math.min(...values, 0);
  const max = Math.max(...values, 1);
  const span = Math.max(max - min, 1);
  // Sin valores negativos el suelo es el cero: dejar aire por debajo solo regalaba un
  // tick negativo que ninguna serie llega a tocar.
  return { min: min < 0 ? min - span * 0.08 : 0, max: max + span * 0.08 };
});

const plotWidth = W - padL - padR;

function x(index: number): number {
  if (usablePoints.value.length <= 1) return padL + plotWidth / 2;
  return padL + (index / (usablePoints.value.length - 1)) * plotWidth;
}

function y(value: number): number {
  const span = bounds.value.max - bounds.value.min || 1;
  return padT + (1 - (value - bounds.value.min) / span) * (lineH - padT - padB);
}

function linePath(read: (point: PortfolioTimelinePoint) => number): string {
  return usablePoints.value
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${x(index)} ${y(read(point))}`)
    .join(' ');
}

const valuePath = computed(() => linePath((point) => toNumber(point.value)));
const contributionPath = computed(() => linePath((point) => toNumber(point.contributed_to_date)));
const valueAreaPath = computed(() => {
  if (!usablePoints.value.length) return '';
  const baseline = lineH - padB;
  const last = usablePoints.value.length - 1;
  return `${valuePath.value} L ${x(last)} ${baseline} L ${x(0)} ${baseline} Z`;
});

const yTicks = computed(() =>
  [0, 1, 2, 3, 4].map((index) => {
    const value = bounds.value.min + ((bounds.value.max - bounds.value.min) * index) / 4;
    return { value, y: y(value) };
  }),
);

// Ticks legibles a cualquier ventana: hasta trece puntos cabe el mes de cada uno; por
// encima se rotula uno de cada N para dejar unas ocho fechas, siempre con el cierre
// incluido, y el punto bajo el cursor recupera su mes. Antes se pintaban tres fechas
// fijas —inicio, medio y fin— y en tres años no se sabía dónde caía nada. Etiquetar
// solo el primer mes de cada año tampoco valía: una ventana de un año son trece
// puntos y se quedaba en dos marcas.
const labelStride = computed(() =>
  usablePoints.value.length <= 13 ? 1 : Math.ceil(usablePoints.value.length / 8),
);
const xAxisLabels = computed(() => {
  const points = usablePoints.value;
  const last = points.length - 1;
  return points.map((point, index) => ({
    label: formatShortMonthYear(point.date),
    show: index === last || (last - index) % labelStride.value === 0,
  }));
});
const returnBounds = computed(() => {
  const values = returnPoints.value.map((row) => row.value);
  const min = Math.min(...values, 0);
  const max = Math.max(...values, 0);
  const span = Math.max(max - min, 0.01);
  return { min: min - span * 0.08, max: max + span * 0.08 };
});
function returnX(index: number): number {
  if (returnPoints.value.length <= 1) return padL + plotWidth / 2;
  return padL + (index / (returnPoints.value.length - 1)) * plotWidth;
}
function returnY(value: number): number {
  const span = returnBounds.value.max - returnBounds.value.min || 1;
  return padT + (1 - (value - returnBounds.value.min) / span) * (lineH - padT - padB);
}
const returnPath = computed(() =>
  returnPoints.value
    .map((row, index) => `${index === 0 ? 'M' : 'L'} ${returnX(index)} ${returnY(row.value)}`)
    .join(' '),
);
const returnTicks = computed(() =>
  [0, 1, 2, 3, 4].map((index) => {
    const value =
      returnBounds.value.min + ((returnBounds.value.max - returnBounds.value.min) * index) / 4;
    return { value, y: returnY(value) };
  }),
);
const returnLabelStride = computed(() =>
  returnPoints.value.length <= 13 ? 1 : Math.ceil(returnPoints.value.length / 8),
);
const returnAxisLabels = computed(() => {
  const last = returnPoints.value.length - 1;
  return returnPoints.value.map((row, index) => ({
    label: formatShortMonthYear(row.point.date),
    show: index === last || (last - index) % returnLabelStride.value === 0,
  }));
});
const activeReturnIndex = computed(() =>
  returnHoverIndex.value === null ? returnPoints.value.length - 1 : returnHoverIndex.value,
);
const activeReturnPoint = computed(() => returnPoints.value[activeReturnIndex.value] ?? null);
const showReturnTip = computed(() => returnHoverIndex.value !== null);
// El mes bajo el cursor se rotula siempre, así que el tick fijo que le queda debajo se
// calla: si no, las dos fechas se imprimen una encima de otra y no se lee ninguna.
function showAxisLabel(entry: { show: boolean }, index: number): boolean {
  if (activeIndex.value === index) return true;
  if (!entry.show) return false;
  return !showTip.value || Math.abs(index - activeIndex.value) >= labelStride.value;
}

const barsCenter = lineH + gap + barsH / 2;
const barsScale = computed(() =>
  Math.max(
    1,
    ...movements.value.flatMap((movement) => [
      Math.abs(movement.contribution),
      Math.abs(movement.revaluation),
    ]),
  ),
);
const barSlot = computed(() => plotWidth / Math.max(usablePoints.value.length - 1, 1));
// Dos barras por mes con 2 px de hueco entre ellas: agrupadas, no apiladas. Apilarlas
// mentiría en cuanto los signos se separan (aportas mientras el mercado cae).
const barWidth = computed(() => Math.max(2, Math.min(14, barSlot.value * 0.32)));

function barHeight(amount: number): number {
  return Math.max(1, (Math.abs(amount) / barsScale.value) * (barsH / 2 - 6));
}
function barTop(amount: number): number {
  return amount >= 0 ? barsCenter - barHeight(amount) : barsCenter;
}

const activeIndex = computed(() =>
  hoverIndex.value === null ? usablePoints.value.length - 1 : hoverIndex.value,
);
// El recuadro flotante solo aparece al recorrer el gráfico; en reposo la cifra de
// cierre vive en la leyenda, donde no tapa la propia serie.
const showTip = computed(() => hoverIndex.value !== null);
const activePoint = computed(() => usablePoints.value[activeIndex.value] ?? null);
const activeMovement = computed(() => movements.value[activeIndex.value] ?? null);
// El recuadro se ancla al punto y se recorta a los bordes para no salirse del panel.
const tipLeftPct = computed(() => Math.min(88, Math.max(12, (x(activeIndex.value) / W) * 100)));

function handleMove(event: MouseEvent): void {
  const element = wrapRef.value;
  const total = usablePoints.value.length;
  if (!element || !total) return;
  const rect = element.getBoundingClientRect();
  // Un contenedor sin ancho (pestaña oculta, impresión) devolvía NaN y dejaba el
  // gráfico sin punto activo, así que sin ancho no hay cursor que resolver.
  if (!rect.width) return;
  const position = ((event.clientX - rect.left) / rect.width) * W;
  const index = Math.round(((position - padL) / plotWidth) * (total - 1));
  hoverIndex.value = Math.max(0, Math.min(total - 1, index));
}
function handleReturnMove(event: MouseEvent): void {
  const element = wrapRef.value;
  const total = returnPoints.value.length;
  if (!element || !total) return;
  const rect = element.getBoundingClientRect();
  if (!rect.width) return;
  const position = ((event.clientX - rect.left) / rect.width) * W;
  const index = Math.round(((position - padL) / plotWidth) * (total - 1));
  returnHoverIndex.value = Math.max(0, Math.min(total - 1, index));
}

function money(value: string | number): string {
  return formatMoney(value, props.currency === 'USD' ? 'USD' : 'EUR');
}
function signedMoney(value: number): string {
  return `${value >= 0 ? '+' : ''}${money(value)}`;
}
function pct(value: string | number | null | undefined): string {
  return value == null ? '—' : formatPct(Number(value), 2);
}
</script>

<template>
  <div ref="wrapRef" class="a-pf-chart-shell">
    <div class="a-pf-chart-legend">
      <div class="mini-seg a-pf-chart-mode" role="group" aria-label="Lectura del gráfico">
        <AButton
          size="sm"
          variant="ghost"
          :class="{ on: chartMode === 'value' }"
          :aria-pressed="chartMode === 'value'"
          @click="chartMode = 'value'"
        >
          Valor y aportado
        </AButton>
        <AButton
          size="sm"
          variant="ghost"
          :class="{ on: chartMode === 'return' }"
          :aria-pressed="chartMode === 'return'"
          @click="chartMode = 'return'"
        >
          Rentabilidad acumulada
        </AButton>
      </div>
      <template v-if="chartMode === 'value'">
        <span><i class="is-value"></i> Valor</span>
        <span><i class="is-contributed"></i> Capital aportado</span>
        <span><i class="is-bar-contribution"></i> Aportación del mes</span>
        <span><i class="is-bar-revaluation"></i> Revalorización del mes</span>
      </template>
      <template v-else>
        <span><i class="is-return"></i> Rentabilidad acumulada del activo</span>
      </template>
      <strong v-if="chartMode === 'value' && activePoint && !showTip" class="a-pf-chart-readout">
        {{ formatShortMonthYear(activePoint.date) }} · {{ money(activePoint.value) }}
        <small>aportado {{ money(activePoint.contributed_to_date) }}</small>
      </strong>
      <strong
        v-else-if="chartMode === 'return' && activeReturnPoint && !showReturnTip"
        class="a-pf-chart-readout"
      >
        {{ formatShortMonthYear(activeReturnPoint.point.date) }} ·
        {{ pct(activeReturnPoint.value) }}
        <small>acumulada</small>
      </strong>
    </div>

    <div
      v-if="chartMode === 'value'"
      class="a-pf-chart-plot"
      @mousemove="handleMove"
      @mouseleave="hoverIndex = null"
    >
      <svg
        class="a-pf-chart"
        :viewBox="`0 0 ${W} ${totalH}`"
        role="img"
        aria-label="Evolución mensual del valor de cartera frente al capital aportado, con la aportación y la revalorización de cada mes"
      >
        <defs>
          <linearGradient :id="areaGradientId" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="var(--accent)" stop-opacity="0.26" />
            <stop offset="100%" stop-color="var(--accent)" stop-opacity="0" />
          </linearGradient>
        </defs>

        <g class="a-pf-chart-grid">
          <template v-for="tick in yTicks" :key="tick.y">
            <line :x1="padL" :x2="W - padR" :y1="tick.y" :y2="tick.y" />
            <text :x="padL - 12" :y="tick.y + 4" text-anchor="end">
              {{ formatCompact(tick.value) }}
            </text>
          </template>
        </g>

        <path class="a-pf-chart-area" :d="valueAreaPath" :fill="`url(#${areaGradientId})`" />
        <path class="a-pf-chart-line is-contributed" :d="contributionPath" />
        <path class="a-pf-chart-line is-value" :d="valuePath" />

        <!-- Banda de barras: dos por mes, con la dirección marcando el signo. Así el
             color identifica la causa y no compite con positivo/negativo. -->
        <line
          class="a-pf-chart-bars-axis"
          :x1="padL"
          :x2="W - padR"
          :y1="barsCenter"
          :y2="barsCenter"
        />
        <template v-for="(movement, index) in movements" :key="`bars-${index}`">
          <template v-if="movement.hasPrevious">
            <rect
              class="a-pf-chart-bar is-contribution"
              :class="{ 'is-active': activeIndex === index }"
              :x="x(index) - barWidth - 1"
              :y="barTop(movement.contribution)"
              :width="barWidth"
              :height="barHeight(movement.contribution)"
              rx="1.5"
            />
            <rect
              class="a-pf-chart-bar is-revaluation"
              :class="{ 'is-active': activeIndex === index }"
              :x="x(index) + 1"
              :y="barTop(movement.revaluation)"
              :width="barWidth"
              :height="barHeight(movement.revaluation)"
              rx="1.5"
            />
          </template>
        </template>

        <g class="a-pf-chart-axis">
          <template v-for="(entry, index) in xAxisLabels" :key="`x-${index}`">
            <text
              v-if="showAxisLabel(entry, index)"
              :x="x(index)"
              :y="totalH - 6"
              text-anchor="middle"
              :class="{ 'is-active': activeIndex === index }"
            >
              {{
                activeIndex === index
                  ? formatShortMonthYear(usablePoints[index]!.date)
                  : entry.label
              }}
            </text>
          </template>
        </g>

        <!-- Una marca por punto competía con la propia línea: solo se dibuja la del punto
             bajo el cursor, y por defecto la del cierre. -->
        <g v-if="activePoint" class="a-pf-chart-cursor">
          <line
            v-if="showTip"
            :x1="x(activeIndex)"
            :x2="x(activeIndex)"
            :y1="padT"
            :y2="totalH - labelRow"
          />
          <circle :cx="x(activeIndex)" :cy="y(toNumber(activePoint.value))" r="5" />
        </g>
      </svg>

      <div
        v-if="activePoint && showTip"
        class="a-pf-chart-tip"
        :style="{ left: `${tipLeftPct}%` }"
        role="status"
      >
        <span class="a-pf-chart-tip-label">{{ formatLongMonthYear(activePoint.date) }}</span>
        <strong class="mono">{{ money(activePoint.value) }}</strong>
        <dl v-if="activeMovement?.hasPrevious">
          <div>
            <dt><i class="is-bar-contribution"></i> Aportación</dt>
            <dd class="mono">{{ signedMoney(activeMovement.contribution) }}</dd>
          </div>
          <div>
            <dt><i class="is-bar-revaluation"></i> Revalorización</dt>
            <dd class="mono">{{ signedMoney(activeMovement.revaluation) }}</dd>
          </div>
        </dl>
        <small>Aportado acumulado {{ money(activePoint.contributed_to_date) }}</small>
        <small v-if="activePoint.coverage !== 'complete'">Datos parciales este mes</small>
      </div>
    </div>

    <div
      v-else-if="returnPoints.length"
      class="a-pf-chart-plot"
      @mousemove="handleReturnMove"
      @mouseleave="returnHoverIndex = null"
    >
      <svg
        class="a-pf-chart"
        :viewBox="`0 0 ${W} ${lineH + labelRow}`"
        role="img"
        aria-label="Rentabilidad acumulada de los activos, neutral a las aportaciones y retiradas"
      >
        <g class="a-pf-chart-grid">
          <template v-for="tick in returnTicks" :key="tick.y">
            <line :x1="padL" :x2="W - padR" :y1="tick.y" :y2="tick.y" />
            <text :x="padL - 12" :y="tick.y + 4" text-anchor="end">
              {{ pct(tick.value) }}
            </text>
          </template>
        </g>
        <line
          class="a-pf-chart-return-zero"
          :x1="padL"
          :x2="W - padR"
          :y1="returnY(0)"
          :y2="returnY(0)"
        />
        <path class="a-pf-chart-line is-return" :d="returnPath" />
        <g class="a-pf-chart-axis">
          <template v-for="(entry, index) in returnAxisLabels" :key="`return-x-${index}`">
            <text
              v-if="entry.show"
              :x="returnX(index)"
              :y="lineH + labelRow - 6"
              text-anchor="middle"
              :class="{ 'is-active': activeReturnIndex === index }"
            >
              {{
                activeReturnIndex === index
                  ? formatShortMonthYear(returnPoints[index]!.point.date)
                  : entry.label
              }}
            </text>
          </template>
        </g>
        <g v-if="activeReturnPoint" class="a-pf-chart-cursor">
          <line
            v-if="showReturnTip"
            :x1="returnX(activeReturnIndex)"
            :x2="returnX(activeReturnIndex)"
            :y1="padT"
            :y2="lineH"
          />
          <circle :cx="returnX(activeReturnIndex)" :cy="returnY(activeReturnPoint.value)" r="5" />
        </g>
      </svg>
      <div
        v-if="activeReturnPoint && showReturnTip"
        class="a-pf-chart-tip"
        :style="{ left: `${Math.min(88, Math.max(12, (returnX(activeReturnIndex) / W) * 100))}%` }"
        role="status"
      >
        <span class="a-pf-chart-tip-label">{{
          formatLongMonthYear(activeReturnPoint.point.date)
        }}</span>
        <strong class="mono">{{ pct(activeReturnPoint.value) }}</strong>
        <small>rentabilidad acumulada del activo</small>
        <small v-if="activeReturnPoint.point.return.twr_annualized">
          {{ pct(activeReturnPoint.point.return.twr_annualized) }} anual ·
          {{
            returnLabel(
              activeReturnPoint.point.return.method,
              activeReturnPoint.point.return.estimated,
            )
          }}
        </small>
      </div>
    </div>
    <p v-else class="a-pf-chart-empty">No hay una rentabilidad TWR calculable en este periodo.</p>

    <details class="a-pf-chart-data">
      <summary>Ver datos del gráfico</summary>
      <div class="a-pf-table-scroll">
        <table class="data-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th class="num">Valor</th>
              <th class="num">Aportación del mes</th>
              <th class="num">Revalorización del mes</th>
              <th class="num">Capital aportado</th>
              <th class="num">Rentabilidad acumulada</th>
              <th>Datos</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(point, index) in usablePoints" :key="point.date">
              <td>{{ formatShortMonthYear(point.date) }}</td>
              <td class="num mono">{{ money(point.value) }}</td>
              <td class="num mono">
                {{
                  movements[index]!.hasPrevious ? signedMoney(movements[index]!.contribution) : '—'
                }}
              </td>
              <td class="num mono">
                {{
                  movements[index]!.hasPrevious ? signedMoney(movements[index]!.revaluation) : '—'
                }}
              </td>
              <td class="num mono">{{ money(point.contributed_to_date) }}</td>
              <td class="num mono">{{ pct(point.return.nominal) }}</td>
              <td>{{ point.coverage === 'complete' ? 'Completos' : 'Parciales' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </details>
  </div>
</template>
