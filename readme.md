## 🚀 Prisma Quick Guide (Short & Clean)

---

## 🟢 Main Workflow

```bash
# 1. Format schema
npx prisma format

# 2. Create / apply migration
npx prisma migrate dev --name migration_name

# 3. Generate Prisma Client
npx prisma generate
```

---

## 🔍 Migration Status & Debug

```bash
# Check migration health
npx prisma migrate status

# Compare schema vs database
npx prisma migrate diff

# View database (GUI)
npx prisma studio
```

---

## 🧨 Fix Issues (Drift / Broken DB)

```bash
npx prisma migrate reset
npx prisma migrate dev --name fix
npx prisma db seed
```

---

## Direct 

```bash
npx prisma generate

npx prisma db push
```

---

## 🧠 Quick Rule

* `migrate dev` → normal development
* `migrate reset` → fix DB issues (dev only)
* `migrate status` → check migration state
* `studio` → view data
* `db push` → avoid in migration workflow

---
