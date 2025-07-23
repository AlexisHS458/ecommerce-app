# Ecommerce Angular App

## 🚀 Cómo ejecutar el proyecto localmente

### 1. Clona el repositorio

```bash
git clone <URL-del-repo>
cd ecommerce-app
```

### 2. Instala las dependencias

```bash
npm install
```

### 3. Configura Firebase

1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com/).
2. Activa **Firestore Database** y **Authentication (Email/Password)**.
3. Copia las credenciales de tu proyecto y pégalas en `environments/enviroments.ts`:
   ```ts
   export const environment = {
     production: false,
     firebaseConfig: {
       apiKey: "<API_KEY>",
       authDomain: "<PROJECT_ID>.firebaseapp.com",
       projectId: "<PROJECT_ID>",
       storageBucket: "<PROJECT_ID>.appspot.com",
       messagingSenderId: "<SENDER_ID>",
       appId: "<APP_ID>"
     }
   };
   ```
4. (Opcional) Configura Firebase Hosting revisando el archivo `firebase.json`.

### 4. Ejecuta la aplicación

```bash
npm start
# o
ng serve
```
Abre [http://localhost:4200](http://localhost:4200).

---

## 🔒 Configuración de Firebase y reglas de seguridad

- El proyecto usa [AngularFire](https://github.com/angular/angularfire) para conectar Angular con Firebase (Auth y Firestore).
- El carrito y la wishlist de cada usuario se guardan en subcolecciones bajo su usuario en Firestore (`users/{uid}/cart` y `users/{uid}/wishlist`).
- El perfil del usuario se guarda en `/users/{uid}`.

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

## 🛠️ Decisiones técnicas

### Patrón de estado

- **Signals de Angular:**  
  Se utiliza el sistema de signals de Angular para la gestión reactiva del estado global de la aplicación. Cada servicio singleton (por ejemplo, productos, carrito, usuario, wishlist) expone signals que los componentes pueden consumir directamente.  
  Esto permite una reactividad eficiente y sencilla, sin la complejidad de librerías externas como NgRx o Akita.
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
  - Facilita la escalabilidad y el testing, ya que los servicios gestionan la lógica y los componentes solo consumen el estado.

### Estructura y modularidad

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

### UI y experiencia de usuario

- **PrimeNG + Tailwind CSS:**  
  - Se utilizan componentes de [PrimeNG](https://primeng.org/) para una interfaz rica, accesible y profesional.
  - [Tailwind CSS](https://tailwindcss.com/) se usa para utilidades de diseño responsivo y personalización rápida de estilos.
- **Componentes Standalone:**  
  - El proyecto aprovecha los Angular Standalone Components, lo que simplifica la estructura, reduce dependencias y mejora el rendimiento.

### Integración con Firebase

- **AngularFire:**  
  - Se utiliza AngularFire para la integración con Firebase Auth y Firestore.
  - El perfil del usuario, carrito y wishlist se almacenan en Firestore bajo la colección `users/{uid}` y sus subcolecciones.
  - El acceso a los datos está protegido por reglas de seguridad que garantizan que cada usuario solo pueda leer y escribir sus propios datos.

### Buenas prácticas y escalabilidad

- **Desacoplamiento de lógica y presentación:**  
  - Los servicios gestionan la lógica de negocio y el estado, mientras que los componentes solo se encargan de la presentación y la interacción con el usuario.
- **Escalabilidad:**  
  - La arquitectura modular y el uso de signals permiten agregar nuevas funcionalidades o módulos sin afectar el resto de la aplicación.
- **Testing:**  
  - La separación de lógica y UI facilita la creación de pruebas unitarias y de integración.

---

## ✨ Funcionalidades principales

- **Registro y login de usuarios** con Firebase Auth.
- **Gestión de perfil:**  
  - Los datos personales (nombre, apellido, teléfono, etc.) se guardan y editan en Firestore.
  - El email se muestra pero no se puede editar.
  - Cambio de contraseña seguro (requiere contraseña actual).
- **Carrito y wishlist** persistentes por usuario (cada ítem guarda una copia de los datos relevantes del producto).
- **Catálogo de productos** con búsqueda, filtros, paginación y ordenamiento.
- **UI moderna y responsiva** con PrimeNG y Tailwind CSS.

---

## 🗂️ Estructura de carpetas (resumen)

```
src/app/
  core/         # Servicios globales, guards, interceptores
  auth/         # Páginas de login, registro, perfil
  shop/         # Home, productos, carrito, wishlist, componentes de tienda
  shared/       # Navbar, footer, componentes reutilizables
  not-found/    # Página 404
```

---

## 🗺️ Diagrama ER (Entidad-Relación) de la base de datos

> **Nota:** Puedes visualizar este diagrama en [Mermaid Live Editor](https://mermaid.live/) y exportarlo como imagen PNG/SVG para tu documentación.

```mermaid
erDiagram
  USERS {
    string uid PK
    string email
    string firstName
    string lastName
    string phone
    string dateOfBirth
    string gender
    boolean newsletter
  }
  PRODUCTS {
    string id PK
    string title
    number price
    string category
    string brand
    number discountPercentage
    number rating
    string thumbnail
  }
  USERS ||--o{ CART : has
  CART {
    string id PK
    string userId FK
    string productId FK
    number quantity
    string title
    number price
    string thumbnail
    string category
    number discountPercentage
    // ...otros campos del producto
  }
  USERS ||--o{ WISHLIST : has
  WISHLIST {
    string id PK
    string userId FK
    string productId FK
    string title
    number price
    string thumbnail
    string category
    number discountPercentage
    // ...otros campos del producto
  }
  PRODUCTS ||--o{ CART : in
  PRODUCTS ||--o{ WISHLIST : in
```

---

## 🧩 Troubleshooting y buenas prácticas

- **Errores de permisos:** Revisa las reglas de Firestore.
- **Perfil no se muestra:** Asegúrate de que el documento `/users/{uid}` existe y tiene los campos correctos.
- **Página de perfil lenta:** Revisa el uso de signals/effect para evitar ciclos infinitos.
- **Producción:** Usa reglas de seguridad estrictas y variables de entorno adecuadas.

---

¿Dudas? ¿Quieres ejemplos de uso de los servicios, screenshots, o una sección de troubleshooting más detallada? ¡Avísame!
