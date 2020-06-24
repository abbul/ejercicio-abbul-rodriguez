# ejercicio-abbul-rodriguez

### Dependencias:
- Node.js
- Mysql
- Git

### Paso a paso:
1. Clonar el projecto : git clone https://github.com/abbul/ejercicio-abbul-rodriguez.git
2. Crear una base de datos con el nombre de su preferencia.
3. Copia el archivo llamado ".env.example" que esta dentro del projecto, y renombralo a ".env"
5. Cargar todas las variables que se encuentran en el archivo ".env". No hace faltar colocar el contenido de las variables entre comillas.
6. Navegar por la consola hasta el projecto.
7. Ejecutar en consola : npm i
8. Ejecutar en consola : npm run dev
9. Listo, el projecto esta ejecutandose en el puerto que definiste en el archivo ".env"

### NOTAS: 
- Cada vez que se inicia el projecto, se hace un DROP de la base de datos y luego se persiste las informacion que esta en "data/initDataBases.json"
- Los archivos "cableModems-LG.json" y "cableModems-Motorola.json" sirven de ejemplo para probar la aplicacion.