# Annual Expense Taxonomy

## Objective
Define a generic, reusable taxonomy for annual expense records in Milestone 8.

## Contract Keys
1. Categories and subcategories use stable `snake_case` keys in English.
2. UI labels are human-readable in Spanish.
3. Every category includes a fallback subcategory (`other_*` or `other`).

## Categories
1. `savings_allocation`: Ahorro
2. `financial_investments`: Inversion financiera
3. `real_estate_assets`: Activos inmobiliarios
4. `tangible_assets`: Activos mobiliarios
5. `consumption_expenses`: Gastos

## Subcategories
1. `savings_allocation`
   - `emergency_fund`
   - `cash_reserve`
   - `short_term_savings`
   - `long_term_savings`
   - `other_savings_allocation`
2. `financial_investments`
   - `index_funds_etf`
   - `pension_plan`
   - `stocks_dividends`
   - `crypto`
   - `crowdlending_p2p`
   - `roboadvisor`
   - `other_financial_investments`
3. `real_estate_assets`
   - `property_purchase`
   - `mortgage_principal`
   - `property_improvements`
   - `real_estate_fees_taxes`
   - `other_real_estate_assets`
4. `tangible_assets`
   - `vehicle_purchase`
   - `home_furniture_appliances`
   - `technology_devices`
   - `jewelry_collectibles`
   - `other_tangible_assets`
5. `consumption_expenses`
   - `housing_home`
   - `living_expenses`
   - `family_childcare`
   - `transport_mobility`
   - `health_wellbeing`
   - `education_growth`
   - `leisure_lifestyle`
   - `gifts_donations`
   - `financial_commitments`
   - `other_consumption_expenses`

## Usage Rules
1. Persist only keys (`category`, `subcategory`) in storage and API payloads.
2. Resolve labels at presentation layer.
3. Validate that `subcategory` belongs to selected `category`.
4. Keep this file and frontend taxonomy constants synchronized.

