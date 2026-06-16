# Changelog

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
