# Annual Income Taxonomy

## Objective
Define a generic, reusable taxonomy for annual income records in Milestone 8.

## Contract Keys
1. Categories and subcategories use stable `snake_case` keys in English.
2. UI labels are human-readable in Spanish.
3. Every category includes a fallback subcategory (`other_*` or `other`).

## Categories
1. `salary`: Salarios y trabajo
2. `business`: Actividad profesional/negocio
3. `passive_income`: Ingresos pasivos
4. `capital_gains`: Ganancias de capital
5. `transfers_support`: Transferencias y apoyo recibido
6. `public_benefits`: Prestaciones y ayudas
7. `other_income`: Otros ingresos

## Subcategories
1. `salary`
   - `employee_salary`
   - `bonus_commission`
   - `overtime`
   - `severance`
   - `other_salary`
2. `business`
   - `self_employed_services`
   - `business_profit`
   - `professional_fees`
   - `royalties`
   - `other_business`
3. `passive_income`
   - `real_estate_rent`
   - `dividends`
   - `interest_income`
   - `staking_yield`
   - `p2p_lending`
   - `other_passive`
4. `capital_gains`
   - `sale_financial_assets`
   - `sale_real_estate`
   - `sale_business_asset`
   - `sale_personal_asset`
   - `fx_gain`
   - `other_capital_gains`
5. `transfers_support`
   - `family_support`
   - `gifts_received`
   - `inheritance`
   - `alimony_received`
   - `insurance_payout`
   - `other_transfers_support`
6. `public_benefits`
   - `unemployment_benefit`
   - `retirement_pension`
   - `disability_benefit`
   - `scholarship`
   - `subsidy_grant`
   - `other_public_benefits`
7. `other_income`
   - `tax_refund`
   - `one_off_adjustment`
   - `misc`
   - `other`

## Usage Rules
1. Persist only keys (`category`, `subcategory`) in storage and API payloads.
2. Resolve labels at presentation layer.
3. Validate that `subcategory` belongs to selected `category`.
4. Keep this file and frontend taxonomy constants synchronized.
