# AprendeKids

Aplicación educativa infantil con perfiles y progreso guardados en MongoDB,
cuentas adultas y una API privada para el acompañante de IA.

## Estructura

```text
frontend/    Aplicación React/Vite, juegos, pantallas y recursos
backend/     API Node, autenticación, sesiones, MongoDB y lógica de IA
.env         Configuración local privada (no se versiona)
```

## Requisitos

- Node.js 22.12 o posterior
- npm
- Un clúster de MongoDB Atlas

## Configurar MongoDB Atlas

El clúster de la captura sirve; no hace falta crear otro. Para aislar los datos
de AprendeKids, se recomienda usar una base llamada `aprendekids`.

1. En Atlas, abre **Security → Database Access** y crea un usuario de base de
   datos con una contraseña propia. No uses la contraseña de tu cuenta de Atlas.
2. En **Security → Network Access**, agrega la IP pública desde la que ejecutarás
   la app. Evita `0.0.0.0/0`, que permite conexiones desde cualquier IP.
3. En **Database → Cluster0 → Connect → Drivers**, elige Node.js y copia la URI.
   Sustituye el usuario y la contraseña de ejemplo por los del usuario de base
   de datos. Codifica los caracteres especiales de la contraseña como URL
   encoding; por ejemplo, `@` se escribe `%40`.
4. Desde la raíz del proyecto, crea tu archivo privado de entorno:

   ```powershell
   Copy-Item .env.example .env
   ```

5. Abre `.env` y pon la URI en `MONGODB_URI`. Usa `aprendekids` como nombre de
   base de datos en la ruta de la URI, antes de `?`, por ejemplo:

   ```text
   MONGODB_URI=mongodb+srv://USUARIO:CONTRASENA@cluster0.ejemplo.mongodb.net/aprendekids?retryWrites=true&w=majority
   ```

   Conserva los parámetros que te dio Atlas si son distintos. No compartas la
   URI ni la contraseña en el chat, capturas, GitHub o código del frontend. `.env`
   está excluido de Git; solo se versiona `.env.example`, que no tiene secretos.
   MongoDB creará la base y las colecciones al guardar el primer registro.

## Ejecutar en local

Desde la raíz, abre dos terminales:

```powershell
npm ci
npm run dev:api
```

En la segunda terminal:

```powershell
npm run dev
```

Abre `http://127.0.0.1:5173`. La interfaz envía las llamadas `/api` al backend.
Comprueba la conexión visitando `http://127.0.0.1:5173/api/health`; debe devolver
`"dbAvailable":true`. Si devuelve `false`, revisa `MONGODB_URI` y que la IP de
Atlas esté permitida.

El registro requiere una contraseña de adulto de al menos 12 caracteres y
confirmar que quien crea la cuenta es padre, madre o tutor legal. Los perfiles y
el progreso del navegador pueden importarse durante el registro/inicio de sesión;
las contraseñas locales antiguas no se migran. La clave de sesión se guarda como
cookie HttpOnly y la sesión del servidor se almacena en MongoDB.

## IA opcional

La IA permanece desactivada hasta configurar estos valores privados en `.env`:

```text
OPENAI_API_KEY=...
ENABLE_CHILD_AI=true
```

Reinicia `npm run dev:api` tras cambiar el archivo. La persona adulta debe volver
a autenticarse y habilitar la IA en **Ajustes** para cada perfil. La API no guarda
el historial de conversación, pero los mensajes enviados pueden ser procesados
por el proveedor; revisa sus políticas y los requisitos legales aplicables antes
de usarla con menores.

## Comprobaciones y compilación

```powershell
npm run typecheck
npm test
npm run build
```

El frontend compilado queda en `frontend/dist/` y el backend en `dist-server/`.
Para un despliegue real, publica el frontend y el backend por separado, configura
los secretos en el servicio del backend y limita el acceso de red de Atlas a la
IP de salida del servidor. No despliegues la aplicación como sitio estático
solamente: autenticación y datos requieren el backend activo.
