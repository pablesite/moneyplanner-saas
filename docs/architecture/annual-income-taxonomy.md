# Annual Income Taxonomy

## Objective
Define the current taxonomy used by annual income records.

This document describes the `category` and `subcategory` layer of the contract. The full runtime model also includes:

1. `income_type`
2. `time_profile`
3. `cashflow_role`

## Contract Keys
1. Categories and subcategories use stable `snake_case` keys in English.
2. UI labels are human-readable in Spanish.
3. Every category includes a fallback subcategory.
4. API and storage persist keys, not translated labels.

## Categories
1. `salary`: Salarios y trabajo
2. `business`: Actividad profesional/negocio
3. `passive_income`: Ingresos pasivos
4. `capital_gains`: Ganancias de capital
5. `transfers_support`: Transferencias y apoyo recibido
6. `public_benefits`: Prestaciones y ayudas
7. `other_income`: Otros ingresos

## Subcategories
### `salary`
1. `employee_salary`
2. `bonus_commission`
3. `overtime`
4. `severance`
5. `other_salary`

### `business`
1. `self_employed_services`
2. `business_profit`
3. `professional_fees`
4. `royalties`
5. `other_business`

### `passive_income`
1. `real_estate_rent`
2. `dividends`
3. `interest_income`
4. `staking_yield`
5. `p2p_lending`
6. `other_passive`

### `capital_gains`
1. `sale_financial_assets`
2. `sale_real_estate`
3. `sale_business_asset`
4. `sale_personal_asset`
5. `fx_gain`
6. `other_capital_gains`

### `transfers_support`
1. `family_support`
2. `gifts_received`
3. `inheritance`
4. `alimony_received`
5. `insurance_payout`
6. `other_transfers_support`

### `public_benefits`
1. `unemployment_benefit`
2. `retirement_pension`
3. `disability_benefit`
4. `scholarship`
5. `subsidy_grant`
6. `other_public_benefits`

### `other_income`
1. `tax_refund`
2. `one_off_adjustment`
3. `misc`
4. `other`

## Behavioral rules
1. `subcategory` must belong to the selected `category`.
2. `income_type` is normalized from `time_profile` at runtime.
3. Default `cashflow_role` depends on category:
   - `capital_gains` -> `asset_sale`
   - `transfers_support` and `public_benefits` -> `transfer`
   - `other_income` -> `other`
   - otherwise -> `operating`

## Usage rules
1. Keep this document synchronized with backend taxonomy validation and frontend taxonomy constants.
2. If category/subcategory keys change, update backend, frontend, portable import/export, and guide diagnostics together.

## Implementation reference
1. `core/backend/budget/services.py`
2. `core/backend/budget/serializers.py`
3. `frontend/src/domains/data-input/incomeTaxonomy.ts`
