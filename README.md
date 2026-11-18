# AprendeKids

Aplicación educativa infantil con perfiles y progreso guardados en MongoDB,
cuentas adultas y un acompañante virtual local con conversaciones preparadas.

## Estructura

```text
frontend/    Aplicación React/Vite, juegos, pantallas y recursos
backend/     API Node, autenticación, sesiones, MongoDB y conversaciones locales
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
   if (!(Test-Path .env)) { Copy-Item .env.example .env }
   ```

   Hazlo solo la primera vez. Si el archivo `.env` ya está configurado,
   consérvalo: el proyecto reutiliza la misma URI y base de datos cada vez que
   inicias el backend; no necesitas crear de nuevo la base ni repetir Atlas.

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
`"dbAvailable":true` y `"companionAvailable":true`. Si la base de datos no está
disponible, revisa `MONGODB_URI` y que la IP de Atlas esté permitida.

### Modo de prueba sin backend

En el acceso, selecciona **Entrar en modo de prueba** para usar perfiles de
muestra y explorar los juegos, tienda y logros sin llamadas al backend. Los
cambios se guardan en el almacenamiento local del navegador, no en MongoDB.
El acompañante comienza bloqueado; desde Ajustes, usa la contraseña de prueba
`demo12345678` para simular la aprobación adulta y habilitarlo.

El registro requiere una contraseña de adulto de al menos 12 caracteres y
confirmar que quien crea la cuenta es padre, madre o tutor legal. Los perfiles y
el progreso del navegador pueden importarse durante el registro/inicio de sesión;
las contraseñas locales antiguas no se migran. La clave de sesión se guarda como
cookie HttpOnly y la sesión del servidor se almacena en MongoDB.

## Acompañante virtual local

El acompañante utiliza conversaciones incluidas en
[`shared/companion-responses.ts`](./shared/companion-responses.ts). No llama a
OpenAI, Groq ni a otros servicios externos; no requiere claves de IA y no guarda
el historial de chat. El archivo contiene respuestas genéricas en los idiomas
admitidos por la aplicación para los mundos y juegos disponibles.

`ENABLE_CHILD_AI=true` habilita esta simulación en el servidor. Cada perfil
infantil permanece bloqueado inicialmente y una persona adulta debe autenticarse
en **Ajustes** para habilitarlo. El asistente también aplica respuestas locales
para mensajes que contienen posibles datos personales o solicitudes de ayuda.
Consulta [INICIAR_APRENDEKIDS.txt](./INICIAR_APRENDEKIDS.txt) para los pasos
completos de configuración y arranque.

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
