# Annual Expense Taxonomy

## Objective
Define the current taxonomy used by annual expense records.

This document describes the `category` and `subcategory` layer of the contract. The full runtime model also includes:

1. `expense_type`
2. `time_profile`
3. `cashflow_role`

## Contract Keys
1. Categories and subcategories use stable `snake_case` keys in English.
2. UI labels are human-readable in Spanish.
3. Every category includes a fallback subcategory.
4. API and storage persist keys, not translated labels.

## Categories
1. `savings_allocation`: Ahorro
2. `financial_investments`: Inversion financiera
3. `real_estate_assets`: Activos inmobiliarios
4. `tangible_assets`: Activos mobiliarios
5. `consumption_expenses`: Gastos de consumo

## Subcategories
### `savings_allocation`
1. `emergency_fund`
2. `cash_reserve`
3. `other_savings_allocation`
4. `short_term_savings` and `long_term_savings`: legacy keys, still accepted and shown as `other_savings_allocation`

### `financial_investments`
1. `index_funds`
2. `etf_indexed`
3. `deposits_fixed_income`
4. `index_funds_etf`
5. `crowdfunding_real_estate`
6. `pension_plan`
7. `stocks_dividends`
8. `crypto`
9. `crowdlending_p2p`
10. `roboadvisor`
11. `other_financial_investments`

## Note
`index_funds_etf` is still accepted in the backend taxonomy and should be treated as part of the current contract until legacy usage is fully removed.

### `real_estate_assets`
1. `property_purchase`
2. `mortgage_principal`
3. `property_improvements`
4. `real_estate_fees_taxes`
5. `other_real_estate_assets`

### `tangible_assets`
1. `vehicle_purchase`
2. `home_furniture_appliances`
3. `technology_devices`
4. `sports_equipment`
5. `jewelry_collectibles`
6. `other_tangible_assets`

### `consumption_expenses`
Subcategories classify spending by purpose. A debt payment goes to the purpose it finances (a phone
renting to `technology`, mortgage interest to `housing_home`); `financial_commitments` keeps only what
has no purpose of its own, such as broker and exchange fees or interest of a loan without subcategory.

| Key | Label | Scope |
| --- | --- | --- |
| `housing_home` | Vivienda | Utilities, internet, community fees, IBI, home insurance, cleaning, mortgage interest |
| `living_expenses` | Alimentación | Groceries |
| `family_childcare` | Hijos | Everything for the children, including their clothes and fertility treatment |
| `family_personal_care` | Familia y cuidado personal | Hairdresser, cosmetics, life and funeral insurance, pets, elderly care |
| `transport_mobility` | Transporte y movilidad | Fuel, car insurance and maintenance, parking, public transport |
| `health_wellbeing` | Salud y bienestar | Health insurance, pharmacy, treatments, gym, sport |
| `education_growth` | Formación y desarrollo personal | Courses, books, training |
| `leisure_lifestyle` | Ocio y restauración | Restaurants, events, hobbies |
| `travel_holidays` | Viajes y vacaciones | Lodging, travel transport, spending at destination |
| `clothing` | Vestimenta | Adult clothes and shoes (children's go to `family_childcare`) |
| `technology` | Tecnología | Subscriptions and digital services: streaming, cloud, licences, device renting |
| `personal_allowance` | Gastos personales | A member's discretionary spending without detail; ownership says whose |
| `gifts_donations` | Regalos y donaciones | Gifts and donations |
| `personal_loan_repayment` | Anticipos a devolver | Money advanced for others that will be paid back (shared meal, a subscription paid in full) |
| `financial_commitments` | Deuda: intereses y comisiones | Broker/exchange fees, default for liabilities and mortgage interest without an explicit subcategory |
| `other_consumption_expenses` | Otros gastos de consumo | Residual |

## Behavioral rules
1. `subcategory` must belong to the selected `category`.
2. `expense_type` is normalized from `time_profile` at runtime.
3. Default `cashflow_role` depends on category and sometimes on subcategory:
   - `savings_allocation` -> `savings`
   - `financial_investments` -> `investment`
   - `real_estate_assets` or `tangible_assets` -> `asset_purchase`
   - `real_estate_fees_taxes` -> `tax_fee`
   - otherwise -> `operating`
4. `term_recurrent` expenses entered by the user are normalized to `temporary_commitment`.
5. `one_off` expenses accept a narrower set of cashflow roles than structural recurrent entries.
6. **System-generated entries carry their role by economic nature, not by `time_profile`, and are the only exception to rule 4:**
   - Periodic investment contributions mirrored from an asset (`Aportacion inversion: …`) use `investment` — they are a savings destination, not a commitment that consumes income. The plan counts them once, through the asset's `InvestmentContributionInterval`, never through this mirror entry.
   - Early principal cancellation of a liability (`Cancelacion anticipada principal: …`, `one_off`) uses `transfer` — it is a balance-sheet movement (cash down / liability down), not recurring consumption.
   - Consequence for the foundations engine: `committed_surplus = structural_income − (operating + temporary_commitment)` therefore excludes both, so it measures only recurring flows (permanent + genuine temporary commitments), never one-off patrimonio movements.

## Usage rules
1. Keep this document synchronized with backend taxonomy validation and frontend taxonomy constants.
2. If category/subcategory keys change, update backend, frontend, portable import/export, net-worth generated commitments, and guide diagnostics together.

## Implementation reference
1. `core/backend/budget/services.py`
2. `core/backend/budget/serializers.py`
3. `core/backend/net_worth/models.py` (`Liability.ExpenseSubcategoryOverride`)
4. `frontend/src/domains/budget/taxonomy/expenseTaxonomy.ts` and `core/frontend/src/domains/budget/taxonomy/expenseTaxonomy.ts`
5. Liability subcategory options in `frontend/src/domains/net-worth/components/ItemForm.vue` and `core/frontend/src/domains/net-worth/components/itemFormUtils.ts`
6. Plan groupings in `frontend/src/domains/plan/budgetMilestones.ts` and `frontend/src/views/PlanSetupView.vue`
