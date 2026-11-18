# Plan de Actualización — Citi API v4

> Auditoría: 34 dependencias desactualizadas · 41 vulnerabilidades (19 high, 19 moderate, 3 low)  
> Tests: No hay — validación manual requerida  
> Producción: No hay — se puede actualizar sin miedo a romper algo en vivo

---

## Fase 1 — Parcheo de seguridad transitivo

```bash
npm audit fix
```

Corrige ~24 vulnerabilidades en dependencias transitivas sin tocar directas.

---

## Fase 2 — Dependencias directas seguras (minor/patch)

| Paquete | De → A | Tipo | Motivo |
|---------|--------|------|--------|
| `axios` | 1.13.2 → 1.18.1 | minor | 23 advisories de seguridad |
| `mysql2` | 3.11.3 → 3.23.0 | minor | Parches + mejoras |
| `class-validator` | 0.14.1 → 0.14.4 | patch | Advisory de seguridad |
| `rxjs` | 7.8.1 → 7.8.2 | patch | Bugfix |
| `cors` | 2.8.5 → 2.8.6 | patch | Bugfix |
| `@types/node` | 20.17.1 → 20.19.43 | minor | Tipados actualizados |
| `prettier` | 3.3.3 → 3.9.5 | minor | Formateo |
| `supertest` | 7.0.0 → 7.2.2 | minor | Bugfixes |
| `ts-jest` | 29.2.5 → 29.4.11 | minor | Bugfixes |
| `ts-loader` | 9.5.1 → 9.6.2 | minor | Bugfixes |

```bash
npm install axios@latest mysql2@latest class-validator@~0.14.4 rxjs@~7.8.2 cors@~2.8.6
npm install --save-dev @types/node@~20.19 prettier@latest supertest@latest ts-jest@latest ts-loader@latest
```

### Post-Fase 2

```bash
npm run build          # compila?
npm run start:apidev   # arranca?
```

---

## Fase 3 — NestJS v10 → v11 (major)

### Dependencias a actualizar

```bash
npm install @nestjs/common@latest @nestjs/core@latest @nestjs/platform-express@latest
npm install @nestjs/jwt@latest @nestjs/passport@latest @nestjs/typeorm@latest
npm install @nestjs/config@latest
npm install --save-dev @nestjs/testing@latest @nestjs/schematics@latest @nestjs/cli@latest
```

### Paquete | De → A
- `@nestjs/common` 10.4.20 → 11.1.28
- `@nestjs/core` 10.4.6 → 11.1.28
- `@nestjs/platform-express` 10.4.20 → 11.1.28
- `@nestjs/jwt` 10.2.0 → 11.0.2
- `@nestjs/passport` 10.0.3 → 11.0.5
- `@nestjs/typeorm` 10.0.2 → 11.0.3
- `@nestjs/config` 3.3.0 → 4.0.4
- `@nestjs/testing` 10.4.6 → 11.1.28
- `@nestjs/schematics` 10.2.2 → 11.1.0
- `@nestjs/cli` 11.0.10 → 11.0.24

### Breaking changes potenciales a revisar

- [ ] `@nestjs/config` v4 — verificar carga de `.env`, namespace syntax
- [ ] `@nestjs/jwt` v11 — verificar `JwtModule.registerAsync` signature
- [ ] `@nestjs/passport` v11 — verificar `JwtStrategy`
- [ ] Guards/interceptors — revisar si cambió la API de `ExecutionContext`
- [ ] `multer` v2 (viene con Express v5) — ver sección aparte

### Multer: v1 → v2

NestJS v11 trae Express v5, que requiere `multer` v2.

**Archivos afectados:**
- `apps/citi-api/src/local/local.module.ts` — `MulterModule.registerAsync` con `diskStorage`
- `apps/citi-api/src/evento/evento.module.ts` — Ídem

**Qué revisar:**
- [ ] `diskStorage({ destination, filename })` — API sigue igual en v2
- [ ] Tipos: actualizar `@types/multer` (o sacarlo si v2 ya incluye tipos)

```bash
npm install multer@latest
npm install --save-dev @types/multer@latest   # o sacar si multer v2 incluye tipos
```

### Post-Fase 3

```bash
npm run build          # compila?
npm run start:apidev   # arranca?
npm run start:backdev  # arranca?
```

---

## Fase 4 — TypeORM v0.3 → v1.1 (major)

```bash
npm install typeorm@latest
```

### Paquete | De → A
- `typeorm` 0.3.27 → 1.1.0
- `@nestjs/typeorm` ya se actualizó en Fase 3 (v11.0.3)

### Breaking changes potenciales

- [ ] `DataSource` API — verificar `getRepository()` vs `dataSource.getRepository()`
- [ ] Decoradores — revisar si cambió `@PrimaryGeneratedColumn`, `@Column`, etc.
- [ ] Query Builder — revisar sintaxis de `createQueryBuilder`
- [ ] Migraciones — verificar compatibilidad
- [ ] `synchronize: true/false` — sigue funcionando igual
- [ ] Soluciona advisory de SQL injection en `orderBy`

### Post-Fase 4

```bash
npm run build          # compila?
npm run start:apidev   # arranca?
```

---

## Fase 5 — bcrypt v5 → v6 (major)

```bash
npm install bcrypt@latest
```

### Paquete | De → A
- `bcrypt` 5.1.1 → 6.0.0

### Breaking changes

- [ ] `bcrypt.hash()` — verificar si cambió la API sync/async
- [ ] `bcrypt.compare()` — verificar firma
- [ ] Drop soporte Node <16 (no afecta, no hay producción)

**Archivos afectados:**
- Revisar imports de `bcrypt` en todo el código

### Post-Fase 5

```bash
npm run build          # compila?
```

---

## Fase 6 — Dev tooling

### ESLint v8 → v10

```bash
npm install --save-dev eslint@latest
npm install --save-dev @typescript-eslint/eslint-plugin@latest @typescript-eslint/parser@latest
npm install --save-dev eslint-config-prettier@latest eslint-plugin-prettier@latest
```

**Breaking: migrar a flat config**

- [ ] Reemplazar `.eslintrc.js` → `eslint.config.js`
- [ ] Migrar sintaxis: `extends` → `plugins` + `rules`
- [ ] Flat config no soporta `.eslintignore` — usar `ignores` en config

Estructura base `eslint.config.js`:

```js
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  prettier,
  {
    ignores: ['dist/', 'node_modules/', '*.js'],
  },
  {
    rules: {
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },
);
```

### Jest v29 → v30

```bash
npm install --save-dev jest@latest @types/jest@latest ts-jest@latest
```

- [ ] Revisar config en `package.json` — puede requerir cambios
- [ ] ts-jest v29.4 → compatible con Jest v30

### TypeScript v5.8 → v5.9

```bash
npm install --save-dev typescript@~5.9
```

Solo minor — no debería romper nada. No ir a v7 (muy disruptivo).

### Post-Fase 6

```bash
npm run belleza        # lint + format pasan?
npm run build          # compila?
```

---

## Fase 7 — Verificación final

```bash
# 1. Build completo
npm run build

# 2. Lint + format
npm run belleza

# 3. Tests (si existieran)
npm test

# 4. Arranque de apps
npm run start:apidev   # Ctrl+C después de verificar que levanta
npm run start:backdev  # Ctrl+C después de verificar que levanta

# 5. Revisar package.json → que no haya duplicados ni conflictos
```

---

## Resumen de comandos por fase

```bash
# === FASE 1 ===
npm audit fix

# === FASE 2 ===
npm install axios@latest mysql2@latest class-validator@~0.14.4 rxjs@~7.8.2 cors@~2.8.6
npm install --save-dev @types/node@~20.19 prettier@latest supertest@latest ts-jest@latest ts-loader@latest

# === FASE 3 ===
npm install @nestjs/common@latest @nestjs/core@latest @nestjs/platform-express@latest
npm install @nestjs/jwt@latest @nestjs/passport@latest @nestjs/typeorm@latest @nestjs/config@latest
npm install --save-dev @nestjs/testing@latest @nestjs/schematics@latest @nestjs/cli@latest
npm install multer@latest
npm install --save-dev @types/multer@latest

# === FASE 4 ===
npm install typeorm@latest

# === FASE 5 ===
npm install bcrypt@latest

# === FASE 6 ===
npm install --save-dev eslint@latest
npm install --save-dev @typescript-eslint/eslint-plugin@latest @typescript-eslint/parser@latest
npm install --save-dev eslint-config-prettier@latest eslint-plugin-prettier@latest
npm install --save-dev jest@latest @types/jest@latest
npm install --save-dev typescript@~5.9

# === FASE 7 ===
npm run build && npm run belleza
```

---

## Checklist rápido

- [ ] Fase 1: `npm audit fix`
- [ ] Fase 2: Actualizar dependencias seguras
- [ ] Verificar build post-Fase 2
- [ ] Fase 3: NestJS v10 → v11
- [ ] Revisar `multer` diskStorage
- [ ] Verificar build post-Fase 3
- [ ] Fase 4: TypeORM v0.3 → v1.1
- [ ] Verificar build post-Fase 4
- [ ] Fase 5: bcrypt v5 → v6
- [ ] Verificar build post-Fase 5
- [ ] Fase 6: ESLint flat config + Jest v30 + TS v5.9
- [ ] Verificar build + lint post-Fase 6
- [ ] Fase 7: Validación final
