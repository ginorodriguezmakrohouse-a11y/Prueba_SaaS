# Supabase Setup Guide

1. Crea proyecto en https://supabase.com
2. Copia Project URL y anon key → `js/store-supabase.js`
3. En SQL Editor, ejecuta `supabase/schema.sql`
4. Reemplaza `js/store.js` con `js/store-supabase.js`

El archivo `store-supabase.js` usa `createClient` y reemplaza cada método `Store` con queries SQL equivalentes.
