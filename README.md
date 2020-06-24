# ejercicio-abbul-rodriguez

## Guia para ejecutar le projecto.

### Dependencias:
- Node.js
- Mysql

### Paso a paso:
1. Clonar el projecto
2. Crear una base de datos con el nombre de preferencia.
3. Crear un archivo llamado ".env" dentro del projecto
4. Copiar todo el contenido del archivo ".env.example" que esta dentro del projecto
5. Cargar con la informacion correspondiente todas las variables que se encuentran en el archivo ".env". No hace faltar colocar el contenido de las variables entre comillas.
6. Navegar por la consola hasta el projecto.
7. Ejecutar en consola : npm i
8. Ejecutar en consola : npm run dev
9. Listo, el projecto esta ejecutandose en el puerto que definiste en .env

### NOTAS: 
1. Cada vez que se inicia el projecto, se hace un DROP de la base de datos y luego se persiste las informacion que esta en "data/initDataBases.json"
2. Los archivos "cableModems-LG.json" y "cableModems-Motorola.json" sirven de ejemplo para probar la aplicacion.