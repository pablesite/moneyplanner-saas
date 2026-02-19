# Net Worth Score Model

## Objective
Define, in a transparent and reproducible way, how the `Balance score` (0 to 100) is calculated in the Net Worth view.

This score reflects the quality of the current balance-sheet snapshot, not a time trend.

## Score range
1. Final range: `0..100`
2. Best state: `100`
3. Worst state: `0`

General formula:

```text
score = clamp(100 - (p_leverage + p_unbacked_debt + p_concentration + p_liquidity), 0, 100)
```

Each `p_*` is a continuous penalty in the `0..25` range.

## Dimensions and weights
The model uses 4 dimensions, all with the same maximum weight:

1. `Leverage` (`liabilities / assets`) -> max 25
2. `Unbacked debt` (`unbacked_debt / liabilities`) -> max 25
3. `Asset concentration` (`top_asset_category / assets`) -> max 25
4. `Liquidity coverage` (`liquidity / liabilities`) -> max 25

Maximum total penalty: `100`.

## Penalty curves
Penalties are not binary. They are calculated by segments with linear interpolation between points.

### 1) Leverage
Curve (x = ratio, y = penalty):

1. `(0.00, 0.0)`
2. `(0.20, 0.0)`
3. `(0.40, 6.7)`
4. `(0.60, 15.0)`
5. `(0.80, 25.0)`
6. `(1.20, 25.0)`

Interpretation:
1. Up to 20%: no penalty.
2. Between 20%-80%: progressive penalty increase.
3. From 80% onward: maximum penalty.

### 2) Unbacked debt
Curve:

1. `(0.00, 0.0)`
2. `(0.05, 0.0)`
3. `(0.15, 7.5)`
4. `(0.30, 17.5)`
5. `(0.50, 25.0)`
6. `(1.00, 25.0)`

Interpretation:
1. Up to 5%: no penalty.
2. Above 5%: increasing penalty.
3. From 50% onward: maximum penalty.

### 3) Asset concentration
Curve:

1. `(0.00, 0.0)`
2. `(0.35, 0.0)`
3. `(0.50, 6.25)`
4. `(0.70, 15.0)`
5. `(0.85, 22.5)`
6. `(1.00, 25.0)`

Interpretation:
1. Up to 35%: no penalty.
2. Penalty rises as one category dominates the asset mix.
3. Near 100% concentration: maximum penalty.

### 4) Liquidity coverage
Curve:

1. `(0.00, 25.0)`
2. `(0.25, 22.5)`
3. `(0.50, 15.0)`
4. `(0.80, 7.5)`
5. `(1.20, 0.0)`
6. `(2.00, 0.0)`

Interpretation:
1. This dimension is inverse: more coverage means lower penalty.
2. Coverage >= 120% gets zero penalty.
3. Very low coverage gets high penalty.

## Linear interpolation
For each dimension:

1. Points are sorted by `x`.
2. If value falls between two points `(x1, y1)` and `(x2, y2)`, use:

```text
t = (x - x1) / (x2 - x1)
y = y1 + t * (y2 - y1)
```

3. If value is below/above the curve domain, the nearest endpoint is used.

This avoids abrupt jumps and makes the score evolve smoothly, number by number.

## Missing-data fallback
If a dimension cannot be computed (missing or invalid data):

1. A default penalty of `12.5` is applied for that dimension.
2. This is a neutral-middle fallback that avoids extreme bias.

## Score to risk-level mapping (5 levels)
Badge and meter colors are mapped by score bands:

1. `0..20`: `critical`
2. `21..40`: `high`
3. `41..60`: `medium`
4. `61..80`: `low`
5. `81..100`: `solid`

Current UI labels (Spanish):

1. `critical`: "Riesgo patrimonial critico"
2. `high`: "Riesgo patrimonial alto"
3. `medium`: "Riesgo patrimonial medio"
4. `low`: "Riesgo patrimonial bajo"
5. `solid`: "Patrimonio solido"

## Short example
Given:

1. Leverage: `9%`
2. Unbacked debt: `2%`
3. Asset concentration: `83%`
4. Liquidity coverage: `82%`

Expected behavior:

1. Low leverage penalty
2. Low unbacked-debt penalty
3. High concentration penalty
4. Medium-low liquidity penalty
5. Final score: `100 - total_penalty`, clamped to `0..100`

## Implementation reference
Implemented in:

1. `frontend/src/views/NetWorthView.vue`
2. Core calculation functions: `interpolatePenalty`, `scorePenaltiesValue`, `healthScoreValue`
3. 5-level UI mapping: `healthToneFromScore` and styles `ui-nw-health-*` / `ui-nw-risk-meter-*`
