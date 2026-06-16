# 🏋️ PROMPT MAESTRO — WAVE PROJECT GYM PREVENTA
## Sitio Web E-Commerce Completo + Dashboard Admin

---

## 🎯 CONTEXTO DEL PROYECTO

Eres un desarrollador web full-stack y diseñador gráfico senior. Debes construir un sitio web de preventa para **Wave Project Gym**, un gimnasio premium ubicado en Concepción, Chile. El sitio es un e-commerce de cupos limitados (50 preventas) con dashboard de administración.

**Objetivo principal:** Vender 4 tipos de preventas de membresía antes de la apertura oficial del gimnasio, con urgencia real (cupos limitados visibles en tiempo real).

---

## 🛠️ STACK TECNOLÓGICO OBLIGATORIO

```
Framework:        Next.js 14 (App Router, TypeScript)
Estilos:          Tailwind CSS + shadcn/ui
Base de datos:    Supabase (PostgreSQL + Realtime + Auth)
Pagos:            MercadoPago (Checkout Pro para Chile)
Deploy:           Vercel
Repositorio:      GitHub
Animaciones:      Framer Motion
Formularios:      React Hook Form + Zod
Email:            Resend (emails transaccionales)
```

---

## 🎨 SISTEMA DE DISEÑO

### Paleta de colores (EXACTA — no variar)
```css
--color-bg-primary:     #0A0A0A;   /* Negro profundo — fondo principal */
--color-bg-card:        #111111;   /* Negro tarjeta */
--color-bg-card-hover:  #1A1A1A;   /* Negro hover */
--color-gold-primary:   #C9A84C;   /* Dorado principal (texto, íconos) */
--color-gold-bright:    #F5C842;   /* Dorado brillante (CTA, destacados) */
--color-gold-dark:      #8B6914;   /* Dorado oscuro (bordes, sombras) */
--color-white:          #FFFFFF;   /* Blanco — texto principal */
--color-white-muted:    #A0A0A0;   /* Gris claro — texto secundario */
--color-border:         #2A2A2A;   /* Bordes de tarjetas */
--color-border-gold:    rgba(201, 168, 76, 0.3); /* Bordes dorados suaves */
```

### Tipografía
```
Display (títulos grandes): Bebas Neue o Oswald — mayúsculas, bold
Heading (subtítulos):      Montserrat — semibold/bold
Body (cuerpo):             Inter — regular/medium
Accent (etiquetas):        Montserrat — uppercase, letter-spacing amplio
```

### Estética general
- Fondo negro profundo con partículas doradas muy sutiles (canvas animado)
- Bordes con glow dorado en hover (box-shadow: 0 0 20px rgba(201,168,76,0.4))
- Gradientes: `linear-gradient(135deg, #C9A84C, #F5C842)` para botones CTA
- Imágenes con overlay oscuro `rgba(0,0,0,0.5)` para legibilidad
- Animaciones: fade-in + slide-up al hacer scroll (Framer Motion)

---

## 🖼️ ASSETS DISPONIBLES

El cliente proveerá los siguientes archivos (guardarlos en `/public/assets/`):

| Variable | Descripción | Uso |
|----------|-------------|-----|
| `logo-white.png` | Logo ola en blanco sobre negro | Navbar, footer |
| `hero-exterior.jpg` | Fachada exterior con cielo de atardecer dramático | Hero section — ANIMAR el cielo |
| `benefits-exterior.jpg` | Fachada noche oscura con logo iluminado | Sección beneficios |
| `gym-interior.jpg` | Interior del gym con mancuernas y luces doradas | Sección "Nuestro Gym" |
| `plans-bg.jpg` | Imagen de planes de preventa | Fondo sección planes |
| `hero-web.jpg` | Versión web del hero con texto superpuesto | Referencia visual |

### 🌅 ANIMACIÓN HERO (IMPORTANTE)
El cielo del hero (`hero-exterior.jpg`) debe tener efecto de movimiento de nubes usando:
```javascript
// Canvas overlay con nubes animadas en CSS/canvas
// O usar CSS animation con múltiples capas del mismo cielo
// Efecto: movimiento sutil horizontal de nubes + parallax scroll
// Implementar con: Framer Motion + useScroll + useTransform
// Las nubes se mueven a velocidades distintas (parallax en layers)
```

---

## 📁 ESTRUCTURA DEL PROYECTO

```
wave-project-gym/
├── app/
│   ├── (public)/
│   │   ├── page.tsx                    # Landing page principal
│   │   ├── planes/page.tsx             # Página de planes
│   │   └── checkout/[planId]/page.tsx  # Checkout por plan
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── callback/page.tsx           # OAuth callback Supabase
│   ├── (dashboard)/
│   │   ├── admin/
│   │   │   ├── page.tsx               # Dashboard admin principal
│   │   │   ├── ventas/page.tsx        # Lista de ventas
│   │   │   ├── clientes/page.tsx      # Lista de clientes
│   │   │   └── cupos/page.tsx         # Gestión de cupos
│   │   └── cliente/
│   │       ├── page.tsx               # Dashboard cliente
│   │       └── mis-preventas/page.tsx # Preventas compradas
│   ├── api/
│   │   ├── mercadopago/
│   │   │   ├── create-preference/route.ts  # Crear preferencia MP
│   │   │   └── webhook/route.ts            # Webhook de pago
│   │   └── cupos/route.ts             # API cupos en tiempo real
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── home/
│   │   ├── HeroSection.tsx            # Hero con cielo animado
│   │   ├── PlansSection.tsx           # 4 tarjetas de planes
│   │   ├── BenefitsSection.tsx        # Beneficios de preventa
│   │   ├── HowItWorks.tsx             # 4 pasos numerados
│   │   ├── GymSection.tsx             # Interior del gym
│   │   ├── FAQSection.tsx             # Preguntas frecuentes
│   │   └── CuposBar.tsx               # Barra de cupos en tiempo real
│   ├── ui/
│   │   ├── GoldButton.tsx             # Botón dorado principal
│   │   ├── PlanCard.tsx               # Tarjeta de plan
│   │   ├── CountdownTimer.tsx         # Timer de urgencia
│   │   └── ParticleCanvas.tsx         # Partículas doradas
│   └── admin/
│       ├── StatsCards.tsx
│       ├── SalesTable.tsx
│       └── CuposManager.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── middleware.ts
│   ├── mercadopago/
│   │   └── client.ts
│   └── utils.ts
├── hooks/
│   ├── useRealtimeCupos.ts            # Hook Supabase Realtime
│   └── useAuth.ts
├── types/
│   └── index.ts
└── middleware.ts                       # Protección de rutas
```

---

## 🗃️ ESQUEMA DE BASE DE DATOS (Supabase)

### Ejecutar en Supabase SQL Editor:

```sql
-- ============================================
-- TABLA: planes
-- ============================================
CREATE TABLE planes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,                    -- 'mensual', 'trimestral', 'semestral', 'anual'
  nombre_display TEXT NOT NULL,            -- 'MENSUAL', 'TRIMESTRAL', 'SEMESTRAL', 'ANUAL'
  precio INTEGER NOT NULL,                 -- En pesos chilenos (CLP)
  duracion_meses INTEGER NOT NULL,         -- 1, 3, 6, 12
  descripcion TEXT,
  es_destacado BOOLEAN DEFAULT FALSE,      -- true = "MEJOR VALOR" (Semestral)
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insertar los 4 planes
INSERT INTO planes (nombre, nombre_display, precio, duracion_meses, es_destacado) VALUES
  ('mensual',     'MENSUAL',     32990,  1,  false),
  ('trimestral',  'TRIMESTRAL',  98970,  3,  false),
  ('semestral',   'SEMESTRAL',   197940, 6,  true),
  ('anual',       'ANUAL',       395880, 12, false);

-- ============================================
-- TABLA: cupos_config
-- ============================================
CREATE TABLE cupos_config (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  total_cupos INTEGER NOT NULL DEFAULT 50,
  cupos_vendidos INTEGER NOT NULL DEFAULT 0,
  activo BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO cupos_config (total_cupos, cupos_vendidos) VALUES (50, 0);

-- ============================================
-- TABLA: perfiles (extends auth.users)
-- ============================================
CREATE TABLE perfiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  nombre TEXT,
  apellido TEXT,
  telefono TEXT,
  rut TEXT,
  rol TEXT DEFAULT 'cliente' CHECK (rol IN ('cliente', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLA: preventas (órdenes de compra)
-- ============================================
CREATE TABLE preventas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario_id UUID REFERENCES auth.users(id),
  plan_id UUID REFERENCES planes(id),
  monto INTEGER NOT NULL,                  -- Precio pagado en CLP
  estado TEXT DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'pagado', 'cancelado', 'reembolsado')),
  mp_preference_id TEXT,                   -- ID de preferencia MercadoPago
  mp_payment_id TEXT,                      -- ID de pago MercadoPago (post-pago)
  mp_order_id TEXT,
  numero_cupo INTEGER,                     -- Número de cupo asignado (1-50)
  email_confirmacion_enviado BOOLEAN DEFAULT FALSE,
  renovaciones_disponibles INTEGER DEFAULT 4,
  fecha_inicio DATE,                       -- Inicio del acceso al gym
  fecha_fin DATE,                          -- Fin del acceso según plan
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- FUNCIÓN: Asignar cupo automáticamente
-- ============================================
CREATE OR REPLACE FUNCTION asignar_cupo(preventa_id UUID)
RETURNS INTEGER AS $$
DECLARE
  cupo_numero INTEGER;
BEGIN
  SELECT cupos_vendidos + 1 INTO cupo_numero
  FROM cupos_config WHERE activo = TRUE FOR UPDATE;
  
  UPDATE cupos_config 
  SET cupos_vendidos = cupo_numero, updated_at = NOW()
  WHERE activo = TRUE;
  
  UPDATE preventas 
  SET numero_cupo = cupo_numero, estado = 'pagado', updated_at = NOW()
  WHERE id = preventa_id;
  
  RETURN cupo_numero;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE perfiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE preventas ENABLE ROW LEVEL SECURITY;

-- Clientes solo ven sus propios datos
CREATE POLICY "Clientes ven su perfil" ON perfiles
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "Clientes ven sus preventas" ON preventas
  FOR SELECT USING (auth.uid() = usuario_id);

-- Admins ven todo
CREATE POLICY "Admins ven todo perfiles" ON perfiles
  FOR ALL USING (
    EXISTS (SELECT 1 FROM perfiles WHERE id = auth.uid() AND rol = 'admin')
  );

CREATE POLICY "Admins ven todo preventas" ON preventas
  FOR ALL USING (
    EXISTS (SELECT 1 FROM perfiles WHERE id = auth.uid() AND rol = 'admin')
  );

-- Cupos son públicos (solo lectura)
ALTER TABLE cupos_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Cupos públicos lectura" ON cupos_config FOR SELECT USING (TRUE);
CREATE POLICY "Planes públicos lectura" ON planes FOR SELECT USING (activo = TRUE);

-- ============================================
-- REALTIME: Habilitar para cupos en vivo
-- ============================================
ALTER PUBLICATION supabase_realtime ADD TABLE cupos_config;
ALTER PUBLICATION supabase_realtime ADD TABLE preventas;
```

---

## 🌐 SECCIONES DEL SITIO (Orden exacto)

### 1. NAVBAR (fijo en top)
```
[Logo Wave Project Gym] [INICIO] [PLANES] [BENEFICIOS] [FAQ] [CONTACTO]  [🛒 COMPRAR PREVENTA]
```
- Fondo: transparente → negro al hacer scroll (backdrop-blur)
- Logo: SVG inline (ola + texto)
- CTA button: borde dorado, texto dorado → fondo dorado en hover
- Mobile: hamburger menu con drawer lateral

### 2. HERO SECTION
```
Left (60%):                          Right (40%):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1ª PREVENTA OFICIAL                  [Imagen exterior
WAVE PROJECT GYM                      con cielo animado
                                      en parallax]
Asegura tu lugar antes de la 
apertura y accede a beneficios         ┌─────────────┐
exclusivos de lanzamiento.             │  QUEDAN     │
                                       │    [N]      │
MOVIMIENTO · DISCIPLINA · PROPÓSITO    │  CUPOS      │
                                       └─────────────┘
[VER PLANES →]  [COMPRAR AHORA 🛒]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[📅 ACCESO FLEXIBLE] [🏋️ ENTRENAMIENTO ALTO NIVEL] [👥 COMUNIDAD] [🔄 PRECIO RENOVABLE]
```
- **Animación cielo:** Framer Motion layers con diferentes velocidades de scroll
- **Counter de cupos:** Número grande animado desde 50, actualiza en tiempo real vía Supabase Realtime
- **Partículas:** Canvas con 50 partículas doradas flotantes muy sutiles

### 3. SECCIÓN PLANES (id="planes")
```
ELIGE TU PLAN DE PREVENTA
Precios especiales de lanzamiento • Renovables hasta 4 veces

┌──────────┐ ┌──────────┐ ┌──────────────────┐ ┌──────────┐
│ MENSUAL  │ │TRIMESTRAL│ │ [MEJOR VALOR]    │ │  ANUAL   │
│PREVENTA 1│ │PREVENTA 1│ │   SEMESTRAL      │ │PREVENTA 1│
│          │ │          │ │   PREVENTA 1     │ │          │
│ $32.990  │ │ $98.970  │ │   $197.940       │ │$395.880  │
│          │ │          │ │                  │ │          │
│✓ 1 mes   │ │✓ 3 meses │ │ ✓ 6 meses       │ │✓ 12 meses│
│✓ Acceso  │ │✓ Acceso  │ │ ✓ Acceso        │ │✓ Acceso  │
│✓ Comunid.│ │✓ Comunid.│ │ ✓ Comunidad     │ │✓ Comunid.│
│✓ Renovab.│ │✓ Renovab.│ │ ✓ Renovable     │ │✓ Renovab.│
│          │ │          │ │                  │ │          │
│[ELEGIR]  │ │[ELEGIR]  │ │  [ELEGIR PLAN]  │ │[ELEGIR]  │
└──────────┘ └──────────┘ └──────────────────┘ └──────────┘

🔒 CUPOS LIMITADOS — SOLO SE VENDERÁN 50 PREVENTAS
[████████████████████████░░░░░░] 0 ————————————— 50
```
- Card semestral: borde dorado brillante + badge "MEJOR VALOR" + botón dorado sólido
- Barra de progreso: actualiza en tiempo real
- Hover en cards: glow dorado suave

### 4. SECCIÓN BENEFICIOS
```
BENEFICIOS DE LA PREVENTA
Sé parte desde el inicio. Entrena con propósito.

[🏷️ Precio especial]  [🔒 Cupo asegurado]  [🎁 Beneficios lanzamiento]  [🌊 Entrena con propósito]
```
- Fondo: imagen del gym exterior nocturno con overlay muy oscuro
- Íconos: dorados en círculo

### 5. SECCIÓN GYM ("Un gimnasio diseñado para tu mejor versión")
```
Left (50%): Imagen interior gym (mancuernas, luz dorada)
Right (50%):
  Un gimnasio diseñado
  para tu mejor versión
  
  Texto descripción...
  
  [🏋️ Equipamiento premium]   [⭐ Ambiente motivador]
  [📊 Entrenamiento funcional] [👥 Comunidad activa]
```

### 6. SECCIÓN CÓMO FUNCIONA
```
¿CÓMO FUNCIONA?

1 → ELIGE TU PLAN     2 → COMPRA TU PREVENTA    3 → ASEGURA TU CUPO    4 → COMIENZA TU CAMBIO
   Selecciona el          Completa tu compra          Recibe la                Prepárate para
   plan que mejor         100% online de              confirmación y           entrenar desde
   se adapte a ti.        forma segura.               asegura tu lugar.        el día 1.
```

### 7. FAQ (Acordeón)
```
¿Cuándo inicia mi plan?              ¿La preventa es renovable?
¿Puedo cambiar de plan después?      ¿Qué pasa si se agotan los 50 cupos?
¿Qué métodos de pago aceptan?        ¿Puedo congelar mi plan?
```

### 8. FOOTER
```
[Logo]          MOVIMIENTO        CONTÁCTANOS              ASEGURA TU LUGAR
                DISCIPLINA        📞 +56 9 XXXX XXXX       50 CUPOS
                PROPÓSITO         ✉ waveprojectchile@      DE LANZAMIENTO
[IG][FB][WA]                        gmail.com              [🛒 COMPRAR PREVENTA AHORA]
                                  📍 Concepción, Chile

© 2024 Wave Project Gym. Todos los derechos reservados.
```

---

## 🔐 SISTEMA DE AUTENTICACIÓN

### Flujo de registro/login
```
Usuario hace click en "COMPRAR PREVENTA"
    ↓
¿Tiene sesión? NO → Modal de Login/Register
    ↓
Register: nombre, apellido, email, password, teléfono, RUT (opcional)
    ↓
Confirmar email (Supabase Auth)
    ↓
Redirect → Selección de plan → Checkout MercadoPago
```

### Middleware de protección de rutas (`middleware.ts`)
```typescript
// Rutas protegidas:
// /checkout/* → requiere sesión (cualquier rol)
// /admin/* → requiere rol 'admin'
// /cliente/* → requiere rol 'cliente'
// Redirect a /login si no hay sesión
// Redirect a / si cliente intenta acceder a /admin
```

### Crear usuario admin manualmente en Supabase:
```sql
-- Después de crear el usuario en auth.users, correr:
UPDATE perfiles SET rol = 'admin' WHERE id = 'UUID-DEL-ADMIN';
```

---

## 💳 INTEGRACIÓN MERCADOPAGO

### Variables de entorno necesarias:
```env
MERCADOPAGO_ACCESS_TOKEN=APP_USR-xxxxxxxxxx
MERCADOPAGO_PUBLIC_KEY=APP_USR-xxxxxxxxxx
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=APP_USR-xxxxxxxxxx
NEXT_PUBLIC_BASE_URL=https://waveprojectgym.cl
```

### Flujo de pago completo:
```
1. Cliente elige plan y hace click en "Elegir Plan"
2. Si no tiene sesión → Modal de login/registro
3. POST /api/mercadopago/create-preference:
   - Crea preferencia en MP con datos del plan
   - Guarda preventa en Supabase con estado 'pendiente'
   - Retorna preference_id
4. Redirect a Checkout Pro de MercadoPago
5. MP procesa el pago
6. MP llama webhook: POST /api/mercadopago/webhook
7. Webhook verifica el pago y llama a asignar_cupo()
8. Se envía email de confirmación con número de cupo
9. Cliente es redirigido a /cliente/mis-preventas
```

### API Route: `/api/mercadopago/create-preference/route.ts`
```typescript
import { MercadoPagoConfig, Preference } from 'mercadopago';

const client = new MercadoPagoConfig({ 
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN! 
});

export async function POST(request: Request) {
  const { planId, userId, userEmail } = await request.json();
  
  // Verificar cupos disponibles
  // Obtener datos del plan
  // Crear preventa pendiente en Supabase
  // Crear preferencia MP
  
  const preference = await new Preference(client).create({
    body: {
      items: [{
        id: plan.id,
        title: `Wave Project Gym - Plan ${plan.nombre_display} PREVENTA 1`,
        quantity: 1,
        unit_price: plan.precio,
        currency_id: 'CLP',
      }],
      payer: { email: userEmail },
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_BASE_URL}/cliente/mis-preventas?success=true`,
        failure: `${process.env.NEXT_PUBLIC_BASE_URL}/planes?error=pago-fallido`,
        pending: `${process.env.NEXT_PUBLIC_BASE_URL}/cliente/mis-preventas?pending=true`,
      },
      auto_return: 'approved',
      external_reference: preventaId,
      notification_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/mercadopago/webhook`,
      statement_descriptor: 'WAVE PROJECT GYM',
    }
  });
  
  return Response.json({ preferenceId: preference.id, initPoint: preference.init_point });
}
```

### API Route: `/api/mercadopago/webhook/route.ts`
```typescript
export async function POST(request: Request) {
  const body = await request.json();
  
  if (body.type === 'payment') {
    const paymentId = body.data.id;
    // Verificar pago con MP SDK
    // Si estado = 'approved':
    //   1. Obtener preventaId de external_reference
    //   2. Llamar a asignar_cupo(preventaId) en Supabase
    //   3. Enviar email de confirmación con Resend
    //   4. Actualizar mp_payment_id en preventa
  }
  
  return Response.json({ received: true });
}
```

---

## 🖥️ DASHBOARD ADMINISTRADOR (`/admin`)

### Layout
```
Sidebar negro (fijo):           Main content:
━━━━━━━━━━━━━━━━━━━             ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Logo WPG]                      
                                ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
📊 Dashboard                    │Cupos   │ │ Ventas │ │Ingresos│ │Pendient│
💰 Ventas                       │Vendidos│ │ Total  │ │ Total  │ │  es    │
👥 Clientes                     │ 23/50  │ │  $XXX  │ │  $XXX  │ │   2    │
🎫 Cupos                        └────────┘ └────────┘ └────────┘ └────────┘
⚙️ Configuración                
                                Tabla de ventas recientes:
[Cerrar sesión]                 | # | Cliente | Plan | Monto | Cupo | Estado | Fecha |
                                |---|---------|------|-------|------|--------|-------|
                                | 1 | Juan P. | Sem. | $197k |  #1  | ✅ Pag. | hoy  |
```

### Funcionalidades del admin:
1. **Dashboard principal:** Cards con métricas en tiempo real (cupos, ventas, ingresos)
2. **Gestión de ventas:** Tabla con filtros por estado, plan, fecha. Exportar a CSV.
3. **Gestión de clientes:** Lista de registrados, ver preventas por cliente
4. **Gestión de cupos:** Ajustar total de cupos disponibles, ver distribución por plan
5. **Configuración:** Cambiar precios, activar/desactivar preventas

---

## 👤 DASHBOARD CLIENTE (`/cliente`)

### Vista cliente
```
Bienvenido, [Nombre] 👋

Tu Preventa                          Información de cuenta
━━━━━━━━━━━━━━━━━━━━━                ━━━━━━━━━━━━━━━━━━━━━
Plan: SEMESTRAL                      Email: usuario@email.com
Cupo: #12 de 50                      Teléfono: +569 XXXX XXXX
Estado: ✅ Confirmado                RUT: XX.XXX.XXX-X
Inicio: 1 Febrero 2025               [Editar perfil]
Fin: 31 Julio 2025
Renovaciones: 4 restantes

[📄 Descargar comprobante]
```

---

## 📧 EMAILS TRANSACCIONALES (Resend)

### Email 1: Confirmación de compra
```
Asunto: ✅ Tu cupo #[N] en Wave Project Gym está asegurado

Cuerpo:
- Logo Wave Project Gym
- "¡Bienvenido a la familia Wave Project!"
- Detalles de la preventa (plan, monto, cupo asignado)
- Fecha de inicio estimada
- Qué sigue (te contactaremos antes de la apertura)
- Firma: Wave Project Gym · waveprojectchile@gmail.com
```

### Email 2: Recordatorio de apertura (manual desde admin)
```
Asunto: 🌊 Wave Project Gym abre sus puertas [fecha]
```

---

## 🔒 VARIABLES DE ENTORNO (.env.local)

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

# MercadoPago
MERCADOPAGO_ACCESS_TOKEN=APP_USR-xxx
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=APP_USR-xxx

# App
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Resend (emails)
RESEND_API_KEY=re_xxx
RESEND_FROM_EMAIL=noreply@waveprojectgym.cl
```

---

## 📦 PACKAGE.JSON DEPENDENCIAS

```json
{
  "dependencies": {
    "next": "14.2.x",
    "react": "^18",
    "typescript": "^5",
    "tailwindcss": "^3",
    "@supabase/supabase-js": "^2",
    "@supabase/ssr": "^0.5",
    "mercadopago": "^2",
    "framer-motion": "^11",
    "react-hook-form": "^7",
    "zod": "^3",
    "@hookform/resolvers": "^3",
    "resend": "^3",
    "lucide-react": "^0.400",
    "@radix-ui/react-accordion": "^1",
    "@radix-ui/react-dialog": "^1",
    "clsx": "^2",
    "tailwind-merge": "^2"
  }
}
```

---

## 🚀 COMANDOS DE SETUP INICIAL

```bash
# 1. Crear proyecto
npx create-next-app@latest wave-project-gym --typescript --tailwind --app --src-dir=false

# 2. Instalar dependencias
npm install @supabase/supabase-js @supabase/ssr mercadopago framer-motion react-hook-form zod @hookform/resolvers resend lucide-react @radix-ui/react-accordion @radix-ui/react-dialog clsx tailwind-merge

# 3. shadcn/ui setup
npx shadcn-ui@latest init

# 4. Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con las keys reales

# 5. Inicializar repositorio
git init
git remote add origin https://github.com/[usuario]/wave-project-gym.git

# 6. Deploy a Vercel
npx vercel --prod
```

---

## ⚡ LÓGICA ESPECIAL: CUPOS EN TIEMPO REAL

```typescript
// hooks/useRealtimeCupos.ts
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export function useRealtimeCupos() {
  const [cuposVendidos, setCuposVendidos] = useState(0);
  const [totalCupos, setTotalCupos] = useState(50);
  const supabase = createClient();

  useEffect(() => {
    // Carga inicial
    supabase.from('cupos_config').select('*').single()
      .then(({ data }) => {
        if (data) {
          setCuposVendidos(data.cupos_vendidos);
          setTotalCupos(data.total_cupos);
        }
      });

    // Suscripción en tiempo real
    const channel = supabase
      .channel('cupos-realtime')
      .on('postgres_changes', 
        { event: 'UPDATE', schema: 'public', table: 'cupos_config' },
        (payload) => {
          setCuposVendidos(payload.new.cupos_vendidos);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return { 
    cuposVendidos, 
    totalCupos, 
    cuposDisponibles: totalCupos - cuposVendidos,
    porcentaje: (cuposVendidos / totalCupos) * 100
  };
}
```

---

## 🌊 ANIMACIÓN DEL CIELO (Hero)

```typescript
// components/home/HeroSection.tsx
'use client';
import { motion, useScroll, useTransform } from 'framer-motion';

export function HeroSection() {
  const { scrollY } = useScroll();
  
  // Parallax layers del cielo
  const skyY1 = useTransform(scrollY, [0, 500], [0, -80]);   // Nubes lejanas
  const skyY2 = useTransform(scrollY, [0, 500], [0, -40]);   // Nubes medias
  const skyY3 = useTransform(scrollY, [0, 500], [0, -20]);   // Nubes cercanas
  const opacity = useTransform(scrollY, [0, 400], [1, 0.3]);

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Layer 1: Cielo de fondo (nubes más lentas) */}
      <motion.div style={{ y: skyY1 }} className="absolute inset-0">
        <img src="/assets/hero-exterior.jpg" className="w-full h-[120%] object-cover" />
      </motion.div>
      
      {/* Layer 2: Overlay oscuro gradiente */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20" />
      
      {/* Layer 3: Partículas doradas */}
      <ParticleCanvas />
      
      {/* Contenido Hero */}
      <motion.div style={{ opacity }} className="relative z-10 ...">
        {/* ... hero content ... */}
      </motion.div>
    </section>
  );
}
```

---

## 📱 RESPONSIVE DESIGN

| Breakpoint | Comportamiento |
|------------|---------------|
| Mobile (<768px) | Hamburger nav, cards apiladas verticalmente, hero texto full width |
| Tablet (768-1024px) | 2 columnas en planes, grid 2x2 |
| Desktop (>1024px) | Layout completo como diseño de referencia |

---

## 🔗 INFORMACIÓN DE CONTACTO DEL NEGOCIO

```
Nombre:          Wave Project Gym
Email:           waveprojectchile@gmail.com
Instagram:       @waveprojectgym (https://www.instagram.com/waveprojectgym)
Ubicación:       Concepción, Chile
Moneda:          CLP (Pesos Chilenos)
Cupos totales:   50
Slogan:          Movimiento · Disciplina · Propósito
```

---

## ✅ CHECKLIST DE DESARROLLO (orden recomendado)

### Fase 1: Setup y base (Día 1)
- [ ] Crear proyecto Next.js + configurar Tailwind con colores custom
- [ ] Setup Supabase: crear tablas con el SQL de arriba
- [ ] Configurar autenticación Supabase Auth
- [ ] Middleware de protección de rutas

### Fase 2: Landing page (Días 2-3)
- [ ] Navbar con scroll behavior
- [ ] HeroSection con parallax del cielo
- [ ] PlansSection con 4 tarjetas + barra de cupos
- [ ] BenefitsSection, GymSection, HowItWorks
- [ ] FAQSection con acordeón
- [ ] Footer completo

### Fase 3: E-commerce (Días 4-5)
- [ ] Modal de Login/Register
- [ ] Integración MercadoPago (create-preference)
- [ ] Webhook de MercadoPago
- [ ] Hook useRealtimeCupos
- [ ] Emails de confirmación con Resend

### Fase 4: Dashboards (Días 6-7)
- [ ] Dashboard admin (stats, tabla ventas, gestión cupos)
- [ ] Dashboard cliente (mis preventas, comprobante)
- [ ] Protección de rutas por rol

### Fase 5: Deploy (Día 8)
- [ ] Variables de entorno en Vercel
- [ ] Dominio personalizado
- [ ] Tests de pago con MP sandbox
- [ ] Go live 🚀

---

## 🎁 DETALLES DE UX IMPORTANTES

1. **Anti-spam de cupos:** Verificar cupos disponibles antes de crear la preferencia MP. Si hay 0 cupos, mostrar mensaje "¡Se agotaron los cupos!" y deshabilitar botones.

2. **Loading states:** Skeleton loaders en tarjetas de planes mientras cargan datos de Supabase.

3. **Toast notifications:** Usar Sonner o react-hot-toast para confirmaciones y errores.

4. **Formato de precios:** Usar `Intl.NumberFormat('es-CL', {style: 'currency', currency: 'CLP'})` para mostrar `$32.990`.

5. **SEO básico:** Meta tags con Open Graph para compartir en RRSS (preview con imagen del gym).

6. **Performance:** Imágenes con `next/image` optimization, lazy loading en secciones inferiores.

---

*Prompt generado para Wave Project Gym Preventa — Concepción, Chile*
*Diseño de referencia: dark mode negro #0A0A0A + dorado #C9A84C*
