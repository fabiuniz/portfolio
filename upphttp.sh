#!/bin/bash

# Define a variável da porta
port=8080

# Mata processos na porta especificada
echo "Killing any processes on port $port..."
for pid in $(netstat -ano | grep ":$port" | awk '{print $5}'); do
    # Verifica se a variável pid não está vazia para evitar erros
    if [ -n "$pid" ]; then
        taskkill /PID $pid /F
    fi
done

echo "Done."

# Inicia o servidor HTTP
echo "Starting HTTP server on port $port... "
echo "Acesse: http://localhost:$port/tree.html"
python -m http.server "$port"

#cmd /c "FOR /f \"tokens=5\" %%a in ('netstat -ano ^| findstr :%port%') do @taskkill /PID %%a /F"