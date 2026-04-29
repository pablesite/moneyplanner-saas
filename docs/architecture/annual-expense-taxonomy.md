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
4. `jewelry_collectibles`
5. `other_tangible_assets`

### `consumption_expenses`
1. `housing_home`
2. `living_expenses`
3. `family_childcare`
4. `transport_mobility`
5. `health_wellbeing`
6. `education_growth`
7. `leisure_lifestyle`
8. `gifts_donations`
9. `financial_commitments`
10. `other_consumption_expenses`

## Behavioral rules
1. `subcategory` must belong to the selected `category`.
2. `expense_type` is normalized from `time_profile` at runtime.
3. Default `cashflow_role` depends on category and sometimes on subcategory:
   - `savings_allocation` -> `savings`
   - `financial_investments` -> `investment`
   - `real_estate_assets` or `tangible_assets` -> `asset_purchase`
   - `real_estate_fees_taxes` -> `tax_fee`
   - otherwise -> `operating`
4. `term_recurrent` expenses are normalized to `temporary_commitment`.
5. `one_off` expenses accept a narrower set of cashflow roles than structural recurrent entries.

## Usage rules
1. Keep this document synchronized with backend taxonomy validation and frontend taxonomy constants.
2. If category/subcategory keys change, update backend, frontend, portable import/export, net-worth generated commitments, and guide diagnostics together.

## Implementation reference
1. `core/backend/budget/services.py`
2. `core/backend/budget/serializers.py`
3. `frontend/src/domains/data-input/expenseTaxonomy.ts`
