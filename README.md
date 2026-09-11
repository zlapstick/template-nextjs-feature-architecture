# Next.js Feature-Driven Template

Template [Next.js](https://nextjs.org) (App Router) dengan struktur folder **feature-driven** — kode dikelompokkan berdasarkan fitur/domain bisnis, bukan berdasarkan tipe file. Frontend ini murni tampilan (BFF-less): semua data CRUD diambil dari backend API eksternal lewat helper fetch terpusat. Tujuannya agar codebase tetap mudah dinavigasi dan diskalakan seiring bertambahnya fitur.

## Tech Stack

- [Next.js 16](https://nextjs.org) — App Router, typed routes (`PageProps<"...">`), standalone output
- [React 19](https://react.dev)
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS 4](https://tailwindcss.com)
- [Zod](https://zod.dev) — validasi schema di server actions
- [ESLint](https://eslint.org) (`eslint-config-next`)

## Struktur Folder

```
.
├── app/                          # Routing (App Router) — hanya berisi page/layout, tipis
│   ├── layout.tsx
│   ├── page.tsx
│   └── dashboard/
│       ├── page.tsx
│       └── ai-models/
│           ├── page.tsx              # list (GET, dengan pagination & search)
│           ├── create/page.tsx       # form tambah data
│           └── [id]/edit/page.tsx    # form edit data
├── features/                     # Logic per fitur/domain
│   └── dashboard/
│       └── ai-models/
│           ├── components/       # Komponen UI (client component) khusus fitur ini
│           ├── schemas/          # Skema validasi Zod (per field & per aksi)
│           └── server/           # Server actions ("use server") — CRUD ke backend API
├── types/                        # Tipe global lintas fitur (Result, FormState, PaginationMeta)
├── utils/                        # Helper lintas fitur (fetch ke API, pagination, form)
├── components/                   # Komponen UI lintas fitur (shared/reusable) — dibuat saat dibutuhkan
└── public/                       # Static assets
```

### Prinsip

- **`app/`** hanya bertanggung jawab atas routing. Sebuah `page.tsx`/`layout.tsx` cukup memanggil data-fetcher & komponen dari `features/`, tanpa banyak logic di dalamnya.
- **`features/<domain>/<sub-fitur>/`** berisi semua yang berkaitan dengan satu fitur, dinamai per domain lalu per sub-fitur mengikuti struktur route-nya (mis. `features/dashboard/ai-models`, mencerminkan `app/dashboard/ai-models`):
  - `components/` — client component (form, table, dsb.) yang hanya dipakai fitur tersebut.
  - `schemas/` — skema Zod untuk validasi input. Field dasar didefinisikan sekali (mis. `ai-model.ts`) lalu dipakai ulang di skema per aksi (`create-ai-model.ts`, `update-ai-model.ts`) agar pesan error konsisten.
  - `server/` — server actions (diawali `"use server"`) yang melakukan validasi lalu memanggil backend API lewat `apiRequest`. Satu file per operasi (`get-ai-models.ts`, `get-ai-model.ts`, `create-ai-model.ts`, `edit-ai-model.ts`, `delete-ai-model.ts`).
- **`types/`** — tipe yang dipakai lintas fitur, terutama kontrak dengan backend:
  - `Result<T>` — discriminated union hasil pemanggilan API (`{ success: true, data, meta? }` atau `{ success: false, message, errors? }`).
  - `FormState<Fields>` — bentuk return value server action untuk form (`data`, `errors`, `message`, `success`), dikonsumsi oleh `useActionState`.
  - `PaginationMeta` — bentuk meta pagination yang sudah dinormalisasi (`page`, `perPage`, `total`, `totalPages`).
- **`utils/`** — helper generik, tidak spesifik ke satu fitur:
  - `api-fetch.ts` — `apiFetch`/`apiRequest`, wrapper `fetch` ke `API_BASE_URL` yang otomatis redirect ke `/login` saat 401, membungkus response jadi `Result<T>`, dan tetap melempar ulang error control-flow Next.js (`redirect`/`notFound`).
  - `form.ts` — `zodFieldErrors` (ubah `ZodError` jadi field errors) dan `apiFieldErrors` (normalisasi error field dari response backend).
  - `pagination.ts` — `normalizeMeta` untuk menyeragamkan format meta pagination dari backend (mendukung `page`/`current_page`, `perPage`/`per_page`, dst).
- **`components/`** hanya untuk komponen yang benar-benar dipakai lebih dari satu fitur (button, input, card, dsb). Jika sebuah komponen baru dipakai satu fitur, taruh di `features/<domain>/<sub-fitur>/components`, baru dipindah ke sini kalau sudah dipakai fitur lain.
- Path import menggunakan alias `@/*`, contoh:

  ```ts
  import { getAiModels } from "@/features/dashboard/ai-models/server/get-ai-models";
  import { apiRequest } from "@/utils/api-fetch";
  import { Result } from "@/types/api";
  ```

### Pola form & data fetching

- **List/detail (read)**: dilakukan langsung di `page.tsx` (server component) dengan memanggil fungsi dari `features/<fitur>/server/`, lalu meneruskan hasilnya (`result.data`) ke komponen tampilan. Jika `result.success === false`, tampilkan `result.message`.
- **Create/update (write)**: komponen form adalah client component yang memakai `useActionState` dan menunjuk ke server action sebagai `action`. Server action memvalidasi `FormData` dengan Zod, memanggil `apiRequest`, lalu memanggil `revalidatePath` sebelum mengembalikan `FormState`.

### Menambah fitur baru

1. Buat folder baru di `features/<domain>/<sub-fitur>/`, mengikuti path route-nya di `app/`.
2. Tambahkan subfolder sesuai kebutuhan (`components/`, `schemas/`, `server/`, dst — tidak semua fitur butuh ketiganya).
3. Buat route-nya di `app/` yang cukup meng-import data-fetcher/komponen dari `features/<domain>/<sub-fitur>`.
4. Jika perlu tipe atau helper baru yang generik (bukan spesifik satu fitur), taruh di `types/` atau `utils/`, bukan di dalam folder fitur.

## Environment Variables

| Variabel       | Default                       | Keterangan                                   |
| -------------- | ------------------------------ | --------------------------------------------- |
| `API_BASE_URL` | `http://localhost:8000/api`   | Base URL backend API yang dipanggil `apiFetch`/`apiRequest`. |

## Getting Started

Install dependencies:

```bash
npm install
```

Jalankan development server:

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

Script lain yang tersedia:

```bash
npm run build   # build untuk production
npm run start   # jalankan hasil build
npm run lint     # cek lint
```

## Docker

Project ini sudah menyediakan `Dockerfile` (multi-stage build, memanfaatkan `output: "standalone"` dari `next.config.ts`):

```bash
docker build -t nextjs-feature-driven .
docker run -p 3000:3000 -e API_BASE_URL=http://host.docker.internal:8000/api nextjs-feature-driven
```
