const http = require('http');

let preguntas = [];

function generarId() {
  const timestamp = Date.now().toString(36);
  const randomValue = Math.random().toString(36).substr(2, 5);
  return `${timestamp}-${randomValue}`;
}

const server = http.createServer((req, res) => {
  if (req.url === '/preguntas' && req.method === 'GET') {
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 200;
    res.end(JSON.stringify(preguntas));
  } else if (req.url === '/preguntas' && req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      const { nombre, campoAmplio, tipoDePregunta } = JSON.parse(body);
      const pregunta = {
        id: generarId(),
        nombre,
        campoAmplio,
        tipoDePregunta,
      };
      preguntas.push(pregunta);
      res.statusCode = 201;
      res.end(JSON.stringify(pregunta));
    });
  } else if (req.url.startsWith('/preguntas/') && req.method === 'GET') {
    const id = req.url.split('/')[2];
    const pregunta = preguntas.find((pregunta) => pregunta.id === id);

    if (pregunta) {
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 200;
      res.end(JSON.stringify(pregunta));
    } else {
      res.statusCode = 404;
      res.end();
    }
  } else if (req.url.startsWith('/preguntas/') && req.method === 'PUT') {
    const id = req.url.split('/')[2];
    const index = preguntas.findIndex((pregunta) => pregunta.id === id);

    if (index !== -1) {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk;
      });
      req.on('end', () => {
        const { nombre, campoAmplio, tipoDePregunta } = JSON.parse(body);
        preguntas[index].nombre = nombre;
        preguntas[index].campoAmplio = campoAmplio;
        preguntas[index].tipoDePregunta = tipoDePregunta;
        res.statusCode = 200;
        res.end(JSON.stringify(preguntas[index]));
      });
    } else {
      res.statusCode = 404;
      res.end();
    }
  } else if (req.url.startsWith('/preguntas/') && req.method === 'DELETE') {
    const id = req.url.split('/')[2];
    const index = preguntas.findIndex((pregunta) => pregunta.id === id);

    if (index !== -1) {
      const preguntaEliminada = preguntas.splice(index, 1);
      res.statusCode = 200;
      res.end(JSON.stringify(preguntaEliminada));
    } else {
      res.statusCode = 404;
      res.end();
    }
  } else {
    res.statusCode = 404;
    res.end();
  }
});

server.listen(3000, () => {
  console.log('Servidor corriendo en el puerto 3000.');
});
