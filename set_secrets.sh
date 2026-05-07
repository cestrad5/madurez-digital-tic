#!/bin/bash

# Verificar si el archivo .env existe
if [ ! -f .env ]; then
    echo "Error: Archivo .env no encontrado."
    exit 1
fi

echo "🚀 Iniciando carga masiva de secretos a GitHub..."

# Cargar variables de Firebase desde el .env
while IFS= read -r line || [[ -n "$line" ]]; do
    if [[ $line =~ ^VITE_ ]]; then
        key=$(echo $line | cut -d '=' -f 1)
        value=$(echo $line | cut -d '=' -f 2-)
        echo "Cargando $key..."
        gh secret set "$key" --body "$value"
    fi
done < .env

# Cargar credenciales de la VPS (Valores fijos según tu documentación)
echo "Cargando credenciales de la VPS..."
gh secret set SSH_HOST --body "157.137.216.208"
gh secret set SSH_USER --body "ubuntu"
gh secret set SSH_PORT --body "22"

# Cargar la llave privada desde la ruta que me pasaste
echo "Cargando SSH_PRIVATE_KEY desde el archivo..."
gh secret set SSH_PRIVATE_KEY < /home/camilo/Documents/ORACLE/ssh-key-2026-03-26.key

echo "✅ ¡Todos los secretos han sido cargados exitosamente!"
