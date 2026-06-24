# Changelog

## [0.26.0](https://github.com/pablesite/moneyplanner-saas/compare/moneyplanner-saas-v0.25.0...moneyplanner-saas-v0.26.0) (2026-06-24)


### Features

* **frontend:** accounting daily-operations workspace and net worth scopes ([9652e7d](https://github.com/pablesite/moneyplanner-saas/commit/9652e7d9c7b8df558dfabe474b609c9663f7fcdf))
* **frontend:** add proactive PWA install banner ([d5fe7c4](https://github.com/pablesite/moneyplanner-saas/commit/d5fe7c48a3d9a3525d77aeeec9db920303a396cc))
* **frontend:** PWA phase 2 — offline shell resilience ([f21f851](https://github.com/pablesite/moneyplanner-saas/commit/f21f85172e1a66ff829026e069fc310fcec2daee))

## [0.25.0](https://github.com/pablesite/moneyplanner-saas/compare/moneyplanner-saas-v0.24.1...moneyplanner-saas-v0.25.0) (2026-06-23)


### Features

* **frontend:** add installable PWA (phase 1) ([6a02c6c](https://github.com/pablesite/moneyplanner-saas/commit/6a02c6c8a41b129109d3a743cc4d8c09c7dc4bef))

## [0.24.1](https://github.com/pablesite/moneyplanner-saas/compare/moneyplanner-saas-v0.24.0...moneyplanner-saas-v0.24.1) (2026-06-23)


### Bug Fixes

* **frontend:** full mobile responsive pass + header menus ([#45](https://github.com/pablesite/moneyplanner-saas/issues/45)) ([9fdfe3f](https://github.com/pablesite/moneyplanner-saas/commit/9fdfe3f918b854a8a5a59b21f1b1dfd8b63b6d44))

## [0.24.0](https://github.com/pablesite/moneyplanner-saas/compare/moneyplanner-saas-v0.23.0...moneyplanner-saas-v0.24.0) (2026-06-22)


### Features

* **budget:** apportion monthly-close executed amounts by movement ownership ([4d3ed00](https://github.com/pablesite/moneyplanner-saas/commit/4d3ed0051317cda1918a5aadbc5543c7ae7606e6))
* **frontend:** add assets/liabilities donut to the accounting hero (ADonut) ([e4ec0cd](https://github.com/pablesite/moneyplanner-saas/commit/e4ec0cd848bb06992f1d2d2fb76278e4005c283e))


### Bug Fixes

* **budget:** make monthly-close income honor the ownership filter (consistent with expenses) ([8b5893b](https://github.com/pablesite/moneyplanner-saas/commit/8b5893b773f12e17249790812d14951ae59c3d45))
* **budget:** monthly-close executed totals read from the apportioned bucket when filtering ([f8bff66](https://github.com/pablesite/moneyplanner-saas/commit/f8bff66271a36a2205fbc7af2ddfda899043ed39))
* **frontend:** align accounting "Período" popover selected color with accent ([e5ada14](https://github.com/pablesite/moneyplanner-saas/commit/e5ada143557387e67b813695b32e86432e9c92de))
* **frontend:** ASelect panel sizes to content instead of stretching to max-height ([63e440f](https://github.com/pablesite/moneyplanner-saas/commit/63e440f0b0ca0d6868bbcbe370a04f37c009b7f9))
* **frontend:** make accounting view responsive ([d69abe9](https://github.com/pablesite/moneyplanner-saas/commit/d69abe927f67854a6986a0416604da64d9ed2487))


### Reverts

* **frontend:** remove assets/liabilities donut from accounting hero ([a8fc6c9](https://github.com/pablesite/moneyplanner-saas/commit/a8fc6c9259a934c115944b5d35a217089463ee1b))

## [0.23.0](https://github.com/pablesite/moneyplanner-saas/compare/moneyplanner-saas-v0.22.2...moneyplanner-saas-v0.23.0) (2026-06-21)


### Features

* **frontend:** AContextBar como barra de herramientas contenida ([0d5eea4](https://github.com/pablesite/moneyplanner-saas/commit/0d5eea443d1b381c5b8c304d50da4d0c3e4d76e0))
* **frontend:** add AStepper Direction A primitive ([5655f11](https://github.com/pablesite/moneyplanner-saas/commit/5655f11d14ec32ccb19df897c13b988e4eeba304))
* **frontend:** add hero→detail divider in /presupuesto ([1c125a9](https://github.com/pablesite/moneyplanner-saas/commit/1c125a9f808efa0d864119c10d109e2da7dc7876))
* **frontend:** apply dir-a-sheet label pattern to all remaining modals ([685abfc](https://github.com/pablesite/moneyplanner-saas/commit/685abfc2f8578ca6dae2b464546dc8ef8966feba))
* **frontend:** budget UX pass — declutter, dark selects, wider evo bars, responsive ([caa2bd5](https://github.com/pablesite/moneyplanner-saas/commit/caa2bd530906860f1b2d364d9ba927a963d46eef))
* **frontend:** color identity for budget blocks, dark select popups, header cleanup ([94c1357](https://github.com/pablesite/moneyplanner-saas/commit/94c1357ac1e112f94598c09e42a9637170f8fda3))
* **frontend:** declutter budget coverage + info tooltip for evolution ([103802e](https://github.com/pablesite/moneyplanner-saas/commit/103802ec27e77d2f5d646404fa56ccf00a83c8a6))
* **frontend:** decouple budget views + Direction A budget hero (WIP) ([2ecccfa](https://github.com/pablesite/moneyplanner-saas/commit/2ecccfa83f24fb6fce0f800b8d8e27911b3a0320))
* **frontend:** dir-a-sheet en modales pendientes, nav reorder y patrimonio como raíz ([fb8a542](https://github.com/pablesite/moneyplanner-saas/commit/fb8a5420efaa61faa2cdf32d1ce50de41e9386d8))
* **frontend:** Direction A net-worth fidelity rework + responsive ([c634852](https://github.com/pablesite/moneyplanner-saas/commit/c634852a3bafb9d3fde0b1c4c82287330e0c061c))
* **frontend:** Direction A shell + hero for /cierre-mensual (WIP) ([30c3cfe](https://github.com/pablesite/moneyplanner-saas/commit/30c3cfe842cecba07372414cc441feeab0d289e6))
* **frontend:** footer shows app name + version (no copyright) ([0913f7c](https://github.com/pablesite/moneyplanner-saas/commit/0913f7cf1a435de6a0cf31f521e5baae0b1fe535))
* **frontend:** implement direction a phase 0 shell foundation ([ac29c10](https://github.com/pablesite/moneyplanner-saas/commit/ac29c10f6f960dc95b6783bc5a0bd1ca7c99110f))
* **frontend:** info tooltips for subtitles across budget + monthly close ([f23479d](https://github.com/pablesite/moneyplanner-saas/commit/f23479d99751976908fef5787f963095cf536c8c))
* **frontend:** lay out budget Ingresos/Gastos side by side ([bbedfc3](https://github.com/pablesite/moneyplanner-saas/commit/bbedfc3cec1431836de34c93025c55be858bdeb3))
* **frontend:** mejoras UX en patrimonio y nav ([90a83e0](https://github.com/pablesite/moneyplanner-saas/commit/90a83e01bed558e672a568a4921fa5479eeb99f6))
* **frontend:** minimal footer (version only) + breathing room before it ([0f913e9](https://github.com/pablesite/moneyplanner-saas/commit/0f913e976a5ed7c0764e0ba8c4aafe27f0e9c48c))
* **frontend:** port guide to direction a ([8a27866](https://github.com/pablesite/moneyplanner-saas/commit/8a27866e14ba1b45443e2cc362917eda2ccb7f37))
* **frontend:** pulir consistencia visual entre vistas dir-a ([bd3654e](https://github.com/pablesite/moneyplanner-saas/commit/bd3654e6f771a0573e34bf7b3b22d81959674d89))
* **frontend:** pulir la vista de cierre mensual ([6ceee91](https://github.com/pablesite/moneyplanner-saas/commit/6ceee91d5d981b8771f4078c639359bff80011b6))
* **frontend:** rediseño vista contabilidad al sistema dir-a ([cc52f78](https://github.com/pablesite/moneyplanner-saas/commit/cc52f78e6e02056fe59cc198306015ae03de6086))
* **frontend:** rename guide as financial state ([9ea8839](https://github.com/pablesite/moneyplanner-saas/commit/9ea883904a61caf78364d252f4be2687dc29caca))
* **frontend:** reskin /presupuesto tables to Direction A bdg-row ([219f855](https://github.com/pablesite/moneyplanner-saas/commit/219f8550051b4981c1c724bc93c2d052fb0b3ec6))
* **frontend:** reskin monthly-close Gastos step to Direction A ([7614795](https://github.com/pablesite/moneyplanner-saas/commit/761479543762a8af719991c30f4b0ed7f8eae6df))
* **frontend:** reskin monthly-close Ingresos step to Direction A ([6580453](https://github.com/pablesite/moneyplanner-saas/commit/658045348f52ed133d262d63ed12415aa0d57217))
* **frontend:** reskin monthly-close Liquidez step to Direction A ([5e7e078](https://github.com/pablesite/moneyplanner-saas/commit/5e7e078083c088f5c7faf4b5e9cbc0c022e9d3a8))
* **frontend:** reskin monthly-close Resultado step + drop dashboard.css from /cierre-mensual ([2f71a55](https://github.com/pablesite/moneyplanner-saas/commit/2f71a55c14332982579f64c487104d956cb4612c))
* **frontend:** restore per-row Evol. column with ASparkline in /presupuesto ([ca2cd38](https://github.com/pablesite/moneyplanner-saas/commit/ca2cd382cb3904d35080491f8e32c419de420902))
* **frontend:** unify modals to Direction A sheet style + add app footer ([6b0d267](https://github.com/pablesite/moneyplanner-saas/commit/6b0d267fb834361723b2625c260ea24ea1f6487a))


### Bug Fixes

* **accounting:** clarify movement account impacts ([5f287c7](https://github.com/pablesite/moneyplanner-saas/commit/5f287c78defb5c5ecf59042e23662016867f4077))
* **accounting:** update modal selectors ([b0bb813](https://github.com/pablesite/moneyplanner-saas/commit/b0bb813ff2b9e800ca28538009aef2ea57bcbf4c))
* **ci:** tolerate missing release please PR ([aa4f9b2](https://github.com/pablesite/moneyplanner-saas/commit/aa4f9b23994b422f988b463b5c85c069c2e0ce6b))

## [0.22.2](https://github.com/pablesite/moneyplanner-saas/compare/moneyplanner-saas-v0.22.1...moneyplanner-saas-v0.22.2) (2026-06-16)


### Bug Fixes

* **frontend:** refresh audited lockfile ([b9b499b](https://github.com/pablesite/moneyplanner-saas/commit/b9b499b78ef7ad553aee3f3054c38f16fc899b0b))
* **submodule:** update core deploy fix ([dc8b4ad](https://github.com/pablesite/moneyplanner-saas/commit/dc8b4add29efa476d3c27edf53c7973d4b8de693))

## [0.22.1](https://github.com/pablesite/moneyplanner-saas/compare/moneyplanner-saas-v0.22.0...moneyplanner-saas-v0.22.1) (2026-06-16)


### Bug Fixes

* **deploy:** avoid core startup race ([be93635](https://github.com/pablesite/moneyplanner-saas/commit/be9363535cb0c6a3dd6caae3b56d62b073529c81))

## [0.22.0](https://github.com/pablesite/moneyplanner-saas/compare/moneyplanner-saas-v0.21.0...moneyplanner-saas-v0.22.0) (2026-06-14)


### Features

* **brand:** rename saas app to the arkenstone ([e8c92f6](https://github.com/pablesite/moneyplanner-saas/commit/e8c92f6740fddfb99f77c35d6e832e79ed2230c9))


### Bug Fixes

* **ci:** align production host references ([cc09d76](https://github.com/pablesite/moneyplanner-saas/commit/cc09d76ecc8634f769b71e6ac6bfb6ada7c35cea))
* **ci:** parameterize production url ([124dcd1](https://github.com/pablesite/moneyplanner-saas/commit/124dcd19b509d35eb4a77201a062d937a347816e))
* **ci:** parse release please pr output ([756c191](https://github.com/pablesite/moneyplanner-saas/commit/756c1914428eb639c298d12d7eb7db710532a50e))
* **ci:** pass repository to release pr commands ([53fbf47](https://github.com/pablesite/moneyplanner-saas/commit/53fbf47eb921d3585df1938c65abfd6886609ade))
* **ci:** stabilize release and smoke workflows ([4b15346](https://github.com/pablesite/moneyplanner-saas/commit/4b153469c59b4607937a7222598724c21f6dff13))

## [0.21.0](https://github.com/pablesite/moneyplanner-saas/compare/moneyplanner-saas-v0.20.40...moneyplanner-saas-v0.21.0) (2026-06-12)


### Features

* **admin:** unify saas and core user administration ([deb71f2](https://github.com/pablesite/moneyplanner-saas/commit/deb71f2591a6dc34ab35cb2481b4dd2dbc61a70e))
* **deploy:** add production CI/CD pipeline ([ecf0e75](https://github.com/pablesite/moneyplanner-saas/commit/ecf0e75aa17b9559d0886f5023ccc6f01de576d7))
* **deploy:** add saas production images ([9182e75](https://github.com/pablesite/moneyplanner-saas/commit/9182e75ef091876b96fddc99843da6bf75ce3c22))
* **deploy:** add unified production compose ([0b3a322](https://github.com/pablesite/moneyplanner-saas/commit/0b3a322866d8fbfc4f835e61cbdab15ea7f7e85f))
* **deploy:** harden private production access ([978169b](https://github.com/pablesite/moneyplanner-saas/commit/978169b83532897c0d67416d5d4349153754d1b5))
* **dev:** unify integrated saas-core local environment ([fb99938](https://github.com/pablesite/moneyplanner-saas/commit/fb9993877472b5bca343c393e47d315411918d99))


### Bug Fixes

* **admin:** refresh unified user backend modules ([a691026](https://github.com/pablesite/moneyplanner-saas/commit/a69102693386dc774c6498720130d0a06e1971f9))
* **auth:** load core bootstrap proxy headers ([e5ad212](https://github.com/pablesite/moneyplanner-saas/commit/e5ad212a853122059537aa6c9f87445add63cc03))
* budget expense execution filters + release tooling improvements ([#23](https://github.com/pablesite/moneyplanner-saas/issues/23)) ([1a326bb](https://github.com/pablesite/moneyplanner-saas/commit/1a326bb00d5cef29bbd45cc3fe1018039044eff1))
* **budget:** mirror expense execution filters ([75cd907](https://github.com/pablesite/moneyplanner-saas/commit/75cd9076be0384c7f9d7aeff49264587389731c3))
* **ci:** align budget ytd frontend expectation ([2978793](https://github.com/pablesite/moneyplanner-saas/commit/29787931df367cb532cd18dc15975b5fb63396c3))
* **ci:** allow ghcr push with explicit credentials ([0ced9ad](https://github.com/pablesite/moneyplanner-saas/commit/0ced9add7a2002c77478d787662821f7763fe5c4))
* **ci:** correct migration check command and fix stale api mocks in budget tests ([55c5681](https://github.com/pablesite/moneyplanner-saas/commit/55c5681d440b0bce18d2d440ef7ded1318fad998))
* **ci:** gate sarif upload behind repo setting ([94a0730](https://github.com/pablesite/moneyplanner-saas/commit/94a07302a5e375692da2cee1d44ef9e69c2a3bd3))
* **ci:** grant sarif upload workflow access ([f51f919](https://github.com/pablesite/moneyplanner-saas/commit/f51f91979bcb7c87fe12242fb5f8d3fa0af38f19))
* **ci:** increase deploy wait-timeout from 120s to 300s ([cb63a21](https://github.com/pablesite/moneyplanner-saas/commit/cb63a2142b81e375e9d6a809333740e1f4add346))
* **ci:** pin existing trivy action tag ([5693162](https://github.com/pablesite/moneyplanner-saas/commit/5693162258ff565295c26a4715799ed0063f28d1))
* **ci:** run django tests with debug enabled ([d1a9851](https://github.com/pablesite/moneyplanner-saas/commit/d1a9851fedb3036692536c88652495de5b5d293a))
* **deploy:** align production auto-deploy flow ([e5666b6](https://github.com/pablesite/moneyplanner-saas/commit/e5666b60676a00474eaa1d95ccde12f44ee38e89))
* **deploy:** connect tailscale before ssh ([002ecdf](https://github.com/pablesite/moneyplanner-saas/commit/002ecdf010bd8e36410d9b130a9fa1f691700f4b))
* **deploy:** expand ssh port in remote deploy ([3107ace](https://github.com/pablesite/moneyplanner-saas/commit/3107aceb95ac69a8d34e033ee0309f9998c0574a))
* **deploy:** harden frontend runtime image ([7f8d4a8](https://github.com/pablesite/moneyplanner-saas/commit/7f8d4a8c188b7d943aaff0cdcbfebc0a1ddeace9))
* **deploy:** make production healthchecks proxy-aware ([3cd93a9](https://github.com/pablesite/moneyplanner-saas/commit/3cd93a9f605b124ffd1c25eaf0c6b1729b71f0a4))
* **deploy:** patch production image base packages ([437fbad](https://github.com/pablesite/moneyplanner-saas/commit/437fbadea4b5580357a4971ca54ba39989a08b03))
* **deploy:** support custom ssh port ([40a2608](https://github.com/pablesite/moneyplanner-saas/commit/40a26085146e819260bf5b5714bb31be031fc054))
* **deps:** bump django security release ([ec27045](https://github.com/pablesite/moneyplanner-saas/commit/ec270452d8ec561ad444c9d4a88b7fd0bf1052c3))
* **frontend:** surface async accounting watcher errors ([2cdec4b](https://github.com/pablesite/moneyplanner-saas/commit/2cdec4bc0671a208fb2d3952839a2fb4b6b498ab))
* **submodule:** restore published core pointer ([1bba6db](https://github.com/pablesite/moneyplanner-saas/commit/1bba6db871ef162c0a825a7ed96d6b98778affb8))
* **tests:** add missing store fields in composables spec and drop stale Settings assertion ([c4bbe43](https://github.com/pablesite/moneyplanner-saas/commit/c4bbe43355b6fb595b6030c7283ba1d6967fa5f0))
* **tests:** correct Hipotecas label in composables spec ([3eb95e0](https://github.com/pablesite/moneyplanner-saas/commit/3eb95e060f2333985218ebb1cb03effaf5282e7b))
* **tests:** sync composables specs with current component state ([aee786d](https://github.com/pablesite/moneyplanner-saas/commit/aee786d59514c07b2486268709196e32e04c901d))
* **tests:** sync frontend tests with current component state ([daa373e](https://github.com/pablesite/moneyplanner-saas/commit/daa373e8897ccea41f62f95f5347e37ed4a17388))
* **tests:** sync NetWorthView and ItemForm specs with current component state ([e87d2cb](https://github.com/pablesite/moneyplanner-saas/commit/e87d2cb5133ecfd87d33c4f83c6b42e8db52a2e6))
