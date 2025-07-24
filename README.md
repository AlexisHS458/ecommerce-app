# Ecommerce Angular App

URL de la app: https://ecommerce-prueba-bambu.web.app/

---

## 📋 Tabla de Contenidos

1. [Requisitos previos](#1-requisitos-previos)
2. [Instalación y configuración](#2-instalación-y-configuración)
   - [Clonar el repositorio](#21-clonar-el-repositorio)
   - [Instalar dependencias](#22-instalar-dependencias)
   - [Configurar variables de entorno](#23-configurar-variables-de-entorno)
   - [Configurar Firebase](#24-configurar-firebase)
3. [Ejecutar la aplicación](#3-ejecutar-la-aplicación)
4. [Reglas de seguridad de Firestore](#4-reglas-de-seguridad-de-firestore)
5. [Deploy a Firebase Hosting](#5-deploy-a-firebase-hosting)
6. [Decisiones técnicas](#6-decisiones-técnicas)
7. [Diagrama Entidad-Relación (ER)](#7-diagrama-entidad-relación-er)


---

## 1. Requisitos previos

- Node.js y npm instalados.
- Cuenta en [Firebase](https://console.firebase.google.com/).
- (Opcional) Angular CLI instalado globalmente:  
  ```bash
  npm install -g @angular/cli
  ```

---

## 2. Instalación y configuración

### 2.1 Clonar el repositorio

```bash
git clone <URL-del-repo>
cd ecommerce-app
```

---

### 2.2 Instalar dependencias

```bash
npm install
```

---

### 2.3 Configurar variables de entorno (environments)

Angular usa archivos de environment para separar la configuración de desarrollo y producción.

1. **Archivos de environment:**
   - `src/environments/environment.ts` (desarrollo)
   - `src/environments/environment.prod.ts` (producción)

2. **Ejemplo de environment de desarrollo (`environment.ts`):**
   ```ts
   export const environment = {
     production: false,
     firebaseConfig: {
       apiKey: "<API_KEY_DEV>",
       authDomain: "<PROJECT_ID_DEV>.firebaseapp.com",
       projectId: "<PROJECT_ID_DEV>",
       storageBucket: "<PROJECT_ID_DEV>.appspot.com",
       messagingSenderId: "<SENDER_ID_DEV>",
       appId: "<APP_ID_DEV>"
     },
     apiUrl: "https://dummyjson.com"
   };
   ```

3. **Ejemplo de environment de producción (`environment.prod.ts`):**
   ```ts
   export const environment = {
     production: true,
     firebaseConfig: {
       apiKey: "<API_KEY_PROD>",
       authDomain: "<PROJECT_ID_PROD>.firebaseapp.com",
       projectId: "<PROJECT_ID_PROD>",
       storageBucket: "<PROJECT_ID_PROD>.appspot.com",
       messagingSenderId: "<SENDER_ID_PROD>",
       appId: "<APP_ID_PROD>"
     },
     apiUrl: "https://dummyjson.com"
   };
   ```

4. **Angular selecciona el environment automáticamente:**
   - `ng serve` y `ng build` usan `environment.ts` (desarrollo).
   - `ng build --configuration production` usa `environment.prod.ts` (producción).

5. **No subas tus archivos reales de environment a git.**
   - El `.gitignore` ya está configurado para ignorarlos.

---

### 2.4 Configurar Firebase

1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com/).
2. Activa **Firestore Database** y **Authentication (Email/Password)**.
3. (Opcional) Configura Firebase Hosting revisando el archivo `firebase.json`.

---

## 3. Ejecutar la aplicación

```bash
npm start
# o
ng serve
```
- Abre [http://localhost:4200](http://localhost:4200) en tu navegador.

---

## 4. Reglas de seguridad de Firestore

El proyecto usa [AngularFire](https://github.com/angular/angularfire) para conectar Angular con Firebase (Auth y Firestore).  
El carrito y la wishlist de cada usuario se guardan en subcolecciones bajo su usuario en Firestore (`users/{uid}/cart` y `users/{uid}/wishlist`).  
El perfil del usuario se guarda en `/users/{uid}`.

**Reglas recomendadas de Firestore:**
```plaintext
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /users/{userId}/cart/{cartItemId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /users/{userId}/wishlist/{wishlistItemId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

## 5. Deploy a Firebase Hosting (multi-ambiente)

Este proyecto está preparado para deployar a dos ambientes de Firebase Hosting:
- **Desarrollo:** Proyecto de Firebase para pruebas/dev
- **Producción:** Proyecto de Firebase para usuarios finales

### 5.1 Configura los proyectos de Firebase

1. Crea dos proyectos en [Firebase Console](https://console.firebase.google.com/): uno para dev y otro para prod.
2. Asócialos con alias usando:
   ```bash
   firebase use --add
   ```
   - Alias recomendados: `dev` y `prod`.
   - El archivo `.firebaserc` debe verse así:
     ```json
     {
       "projects": {
         "dev": "<ID_PROYECTO_DEV>",
         "prod": "<ID_PROYECTO_PROD>"
       }
     }
     ```

### 5.2 Comandos de build y deploy

Agrega estos scripts en tu `package.json`:

```json
"scripts": {
  "deploy:dev": "ng build && firebase deploy --only hosting --project dev",
  "deploy:prod": "ng build --configuration production && firebase deploy --only hosting --project prod"
}
```

- `npm run deploy:dev`: Build con environment de desarrollo y deploy al proyecto de Firebase dev.
- `npm run deploy:prod`: Build con environment de producción y deploy al proyecto de Firebase prod.

### 5.3 Flujo recomendado

- **Desarrollo local:**
  ```bash
  npm start
  # o
  ng serve
  ```
  Usa el environment de desarrollo.

- **Deploy a desarrollo:**
  ```bash
  npm run deploy:dev
  ```
  Sube el build de dev al sitio de Firebase dev.

- **Deploy a producción:**
  ```bash
  npm run deploy:prod
  ```
  Sube el build de prod al sitio de Firebase prod.

### 5.4 Verifica el environment en cada deploy

Puedes agregar un `console.log(environment)` en tu app para verificar que el sitio de dev usa el environment de dev y el de prod el de prod.

---

## 6. Decisiones técnicas

### 6.1 Patrón de estado

- **Signals de Angular:**  
  Se utiliza el sistema de signals de Angular para la gestión reactiva del estado global de la aplicación.  
  Cada servicio singleton (por ejemplo, productos, carrito, usuario, wishlist) expone signals que los componentes pueden consumir directamente.
  ```ts
  @Injectable({ providedIn: 'root' })
  export class CartService {
    cartItems = signal<CartItem[]>([]);
    // ...
  }
  ```
- **Ventajas de signals:**  
  - Reactividad nativa y simple, con bajo boilerplate.
  - Los componentes se actualizan automáticamente cuando cambia el estado.

### 6.2 Estructura y modularidad

- **Modularización por dominio:**  
  El código está organizado en módulos y carpetas por dominio funcional:
  - `core/`: Servicios globales (autenticación, productos, carrito, wishlist, guards, interceptores).
  - `auth/`: Páginas de autenticación (login, registro, perfil).
  - `shop/`: Funcionalidad principal de la tienda (home, productos, detalle, carrito, wishlist, componentes de UI).
  - `shared/`: Componentes reutilizables (navbar, footer, modal login, etc).
  - `not-found/`: Página 404.
- **Ruteo avanzado:**  
  - El archivo `app.routes.ts` define las rutas principales y carga el módulo de la tienda (`shop.routes.ts`) de forma lazy, optimizando el performance inicial.
  - Rutas protegidas con `AuthGuard` para páginas que requieren autenticación, asegurando la seguridad y privacidad de los datos del usuario.

### 6.3 UI y experiencia de usuario

- **PrimeNG + Tailwind CSS:**  
  - Se utilizan componentes de [PrimeNG](https://primeng.org/) para una interfaz rica, accesible y profesional.
  - [Tailwind CSS](https://tailwindcss.com/) se usa para utilidades de diseño responsivo y personalización rápida de estilos.
- **Componentes Standalone:**  
  - El proyecto aprovecha los Angular Standalone Components, lo que simplifica la estructura, reduce dependencias y mejora el rendimiento.

### 6.4 Integración con Firebase

- **AngularFire:**  
  - Se utiliza AngularFire para la integración con Firebase Auth y Firestore.
  - El perfil del usuario, carrito y wishlist se almacenan en Firestore bajo la colección `users/{uid}` y sus subcolecciones.
  - El acceso a los datos está protegido por reglas de seguridad que garantizan que cada usuario solo pueda leer y escribir sus propios datos.
- **Desnormalización:**  
  - Los ítems de carrito y wishlist guardan una copia de los datos relevantes del producto para evitar lecturas adicionales y simplificar la UI.

---

## 7. Diagrama Entidad-Relación (ER)

![Diagrama ER](src/assets/diagrama-er.png)

---

## 8. Guía de comandos y cuándo usarlos

Aquí tienes una guía práctica de **cuándo usar cada comando** en tu flujo de trabajo:

| ¿Qué quieres hacer?                  | Comando                | ¿Cuándo usarlo?                        |
|--------------------------------------|------------------------|----------------------------------------|
| Desarrollar localmente               | `npm start`            | Siempre que estés programando          |
| Build de desarrollo (opcional)       | `npm run build`        | Pruebas locales de build               |
| Build de producción (opcional)       | `npm run build:prod`   | Antes de deploy a prod o pruebas prod  |
| Deploy a Firebase (desarrollo)       | `npm run deploy:dev`   | Publicar avances/pruebas en dev        |
| Deploy a Firebase (producción)       | `npm run deploy:prod`  | Publicar versión final a usuarios      |

### Explicación rápida

- **`npm start`**: Levanta la app en modo desarrollo. Úsalo siempre que estés programando.
- **`npm run build`**: Genera el build usando el environment de desarrollo. Útil para pruebas locales del build.
- **`npm run build:prod`**: Genera el build usando el environment de producción. Útil para probar la app como si estuviera en producción.
- **`npm run deploy:dev`**: Hace build en modo desarrollo y sube el resultado al proyecto de Firebase de desarrollo. Úsalo para publicar avances o pruebas.
- **`npm run deploy:prod`**: Hace build en modo producción y sube el resultado al proyecto de Firebase de producción. Úsalo para publicar la versión final a usuarios.

---