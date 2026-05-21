---
name: security-review
description: Auditoría de seguridad completa del proyecto antes de publicar. Cubre secrets, configuración Django, autenticación, aislamiento multi-tenant, dependencias y exposición de datos.
---

# Security Review

Auditoría de seguridad orientada a publicación en GitHub. Cubre ambos stacks (Core y SaaS).

## Uso

`/security-review` → auditoría completa
`/security-review saas` → solo SaaS
`/security-review core` → solo Core

## Áreas de revisión

### 1. Secrets y credenciales en el código

Buscar en todo el repo (excluyendo `.git/` y `node_modules/`):
- Claves hardcodeadas: `SECRET_KEY`, `PASSWORD`, `API_KEY`, `TOKEN`, `PRIVATE_KEY`
- Strings con aspecto de credencial: patrones base64 largos, cadenas de 32+ chars alfanuméricos
- Ficheros sensibles no ignorados: `.env`, `*.pem`, `*.key`, `*.p12`, `*.pfx`, `db.sqlite3`

```bash
git grep -i -n "secret_key\|password\s*=\|api_key\s*=\|token\s*=" -- '*.py' '*.ts' '*.js' '*.env*' '*.yml' '*.yaml'
```

### 2. .gitignore — cobertura de ficheros sensibles

Verificar que `.gitignore` en raíz y en `core/` cubren:
- `.env`, `.env.*`, `.env.local`
- `*.sqlite3`
- `*.pem`, `*.key`
- Exports de datos (`*_export*.json`, `portable_*.json`)
- Ficheros de secretos Docker (`docker-compose.override.yml` si contiene credenciales)

### 3. Configuración Django

Revisar `settings.py` / `settings/` en Core y SaaS:
- `DEBUG` no debe ser `True` en producción — verificar que lo lee de env var
- `SECRET_KEY` debe venir de variable de entorno, no hardcodeada
- `ALLOWED_HOSTS` no debe ser `['*']` salvo en dev
- `CORS_ALLOWED_ORIGINS` / `CORS_ALLOW_ALL_ORIGINS` — verificar que no permite todo en prod
- `DATABASES` — contraseña desde env var, no literal

### 4. Autenticación y autorización

- Endpoints de la API: verificar que todos los ViewSets/APIViews tienen `permission_classes` explícitas
- Rutas que no requieren auth: deben ser intencionadas y documentadas
- JWT/session tokens: verificar expiración configurada
- SaaS: verificar que `saas_access` aplica checks de tenant en cada endpoint

### 5. Aislamiento multi-tenant

- Cada queryset en vistas SaaS debe filtrarse por el tenant del usuario (`organization`, `user`, etc.)
- Buscar querysets sin filtro de tenant: `Model.objects.all()` en vistas autenticadas es sospechoso
- Verificar que no hay rutas que permitan a un tenant acceder a datos de otro

### 6. Exposición de datos en la API

- Serializers: verificar que no exponen campos sensibles (`password`, `token`, `stripe_*`, `internal_*`)
- Paginación activa en endpoints que devuelven listas
- Errores de la API: no deben revelar stack traces en producción (`DEBUG=False`)

### 7. Frontend

- No hay credenciales ni tokens hardcodeados en código Vue/TS
- Variables de entorno del frontend (`VITE_*`): verificar que no incluyen secrets de servidor
- CSP / headers de seguridad configurados en el servidor que sirve el frontend

### 8. Dependencias con vulnerabilidades conocidas

```bash
# Python (Core backend)
docker compose -f core/docker-compose.yml exec backend pip-audit 2>/dev/null || \
  docker compose -f core/docker-compose.yml exec backend safety check 2>/dev/null || \
  echo "pip-audit/safety no disponible — revisar manualmente"

# Python (SaaS backend)
docker compose exec saas_backend pip-audit 2>/dev/null || \
  docker compose exec saas_backend safety check 2>/dev/null || \
  echo "pip-audit/safety no disponible — revisar manualmente"

# Node (frontends)
docker compose exec saas_frontend npm audit --audit-level=high
docker compose -f core/docker-compose.yml exec frontend npm audit --audit-level=high
```

### 9. Historial Git

Verificar que nunca se commitaron ficheros sensibles:
```bash
git log --all --full-history -- "*.env" "*.pem" "*.key" "db.sqlite3" "*_export*.json" "portable_*.json"
```

### 10. docker-compose y variables de entorno

- `docker-compose.yml` en raíz y `core/docker-compose.yml`: verificar que no tienen credenciales literales
- Existe un `.env.example` o equivalente para que colaboradores sepan qué vars configurar

## Reporte

Para cada hallazgo indicar:
- **Severidad**: CRÍTICA / ALTA / MEDIA / BAJA / INFO
- **Localización**: fichero y línea si aplica
- **Descripción**: qué es el problema
- **Recomendación**: qué hacer para resolverlo

Terminar con un resumen: N hallazgos (X críticos, Y altos, Z medios/bajos).

## Reglas

1. No modificar ningún fichero durante la auditoría — solo leer y reportar.
2. Si los contenedores no están corriendo, ejecutar los checks que no los requieran e indicar cuáles quedaron pendientes.
3. Priorizar hallazgos que bloqueen la publicación en GitHub (secrets reales, datos personales).
