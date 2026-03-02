# Release Summary - Milestone 25 (Short-term deposit interest)

## Scope
1. Add explicit duration for cash short-term deposits (`cash:short_term_deposit`).
2. Remove dependency on `estimated_average_balance_for_interest` for short-term deposits.
3. Keep automatic annual income generation for remunerated liquidity assets.

## Functional changes
1. Asset form now shows `deposit_term_months` (1..12) for `cash:short_term_deposit`.
2. `estimated_average_balance_for_interest` stays for other remunerated liquidity assets.
3. Interest for `cash:short_term_deposit` is estimated as:
   - `amount * (annual_interest_tae / 100) * (deposit_term_months / 12)`
4. Generated interest is recorded as annual income:
   - `category=passive_income`
   - `subcategory=interest_income`

## Core API contract updates
1. New `Asset` field: `deposit_term_months` (`null` or integer `1..12`).
2. Validation rules:
   - Required for `cash:short_term_deposit`.
   - Must be in range `1..12`.
   - Cleared to `null` for other asset subcategories.

## Validation and tests
1. Added core backend tests for:
   - required duration in short-term deposits
   - invalid duration range
   - serializer/API acceptance and rejection cases
2. Added frontend ItemForm tests for required duration field and payload mapping.
