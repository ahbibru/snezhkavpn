// ==Конфигурация== (поменяй на свои)
const UUID = '30a587b7-ef47-4706-bc55-f9f7d34b468a'; // Твой UUID
const PASSWORD = '123'; // Пароль для входа на сайт

// ==Сам Worker== (это трогать не надо)
import { connect } from 'cloudflare:sockets';

export default {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);
      
      // 1️⃣ Если это WebSocket-запрос — обрабатываем как VPN
      const upgradeHeader = request.headers.get('Upgrade');
      if (upgradeHeader && upgradeHeader.toLowerCase() === 'websocket') {
        return handleWebSocket(request);
      }
      
      // 2️⃣ Если запрос на корень — отдаём сайт
      if (url.pathname === '/') {
        return handleSite(request);
      }
      
      // 3️⃣ Если запрос подписки по UUID или /link — отдаём конфиг
      if (url.pathname === '/' + UUID || url.pathname === '/link') {
        return handleSubscription(request);
      }
      
      // 4️⃣ Если запрос на /info — показываем статус
      if (url.pathname === '/info') {
        return new Response(JSON.stringify({ 
          status: 'online', 
          uuid: UUID,
          server: 'Cloudflare Workers'
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      // 5️⃣ Всё остальное — проксируем на случайный сайт
      return handleProxy(request);
      
    } catch (err) {
      return new Response('Error: ' + err.message, { status: 500 });
    }
  }
};

// ============================================
// Обработка WebSocket (VPN)
// ============================================
function handleWebSocket(request) {
  const webSocketPair = new WebSocketPair();
  const [client, server] = Object.values(webSocketPair);
  
  server.accept();
  
  // Создаём TCP-соединение к прокси-серверу
  connectToProxy(server);
  
  return new Response(null, { status: 101, webSocket: client });
}

async function connectToProxy(webSocket) {
  try {
    // Подключаемся к прокси-серверу
    const proxySocket = connect({ hostname: 'cloudflare.com', port: 80 });
    
    // Передаём данные между WebSocket и TCP
    proxySocket.opened.then(() => {
      webSocket.addEventListener('message', event => {
        const writer = proxySocket.writable.getWriter();
        writer.write(event.data);
        writer.releaseLock();
      });
    });
    
    const reader = proxySocket.readable.getReader();
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      webSocket.send(value);
    }
  } catch (e) {
    webSocket.close();
  }
}

// ============================================
// Сайт с инструкцией
// ============================================
function handleSite(request) {
  const url = new URL(request.url);
  const providedPassword = url.searchParams.get('password');
  
  // Если нет пароля или он неверный — показываем логин
  if (!providedPassword || providedPassword !== PASSWORD) {
    return new Response(getLoginPage(request.headers.get('Host')), {
      headers: { 'Content-Type': 'text/html;charset=utf-8' }
    });
  }
  
  // Пароль верный — показываем главную
  return new Response(getMainPage(request.headers.get('Host')), {
    headers: { 'Content-Type': 'text/html;charset=utf-8' }
  });
}

function getLoginPage(host) {
  return `<!DOCTYPE html>
<html>
<head>
  <title>AlgebraVPN</title>
  <style>
    body { font-family: Arial; background: linear-gradient(135deg, #667eea, #764ba2); color: white; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
    .login { background: rgba(255,255,255,0.1); padding: 40px; border-radius: 20px; text-align: center; }
    input { padding: 10px; margin: 10px 0; width: 200px; border-radius: 5px; border: none; }
    button { padding: 10px 20px; background: #ffd700; border: none; border-radius: 5px; cursor: pointer; }
  </style>
</head>
<body>
  <div class="login">
    <h1>🔐 AlgebraVPN</h1>
    <form method="get">
      <input type="password" name="password" placeholder="Введите пароль">
      <br>
      <button type="submit">Войти</button>
    </form>
  </div>
</body>
</html>`;
}

function getMainPage(host) {
  return `<!DOCTYPE html>
<html>
<head>
  <title>AlgebraVPN</title>
  <style>
    body { font-family: Arial; background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 40px; }
    .container { max-width: 600px; margin: 0 auto; background: rgba(255,255,255,0.1); padding: 30px; border-radius: 20px; }
    .info { background: rgba(255,255,255,0.2); padding: 20px; border-radius: 10px; margin: 20px 0; }
    code { background: rgba(0,0,0,0.3); padding: 2px 5px; border-radius: 3px; }
    .btn { background: #ffd700; color: black; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 5px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>🚀 AlgebraVPN</h1>
    <div class="info">
      <h3>📡 Параметры подключения</h3>
      <p><strong>Адрес:</strong> <code>${host}</code></p>
      <p><strong>Порт:</strong> <code>443</code></p>
      <p><strong>UUID:</strong> <code>${UUID}</code></p>
      <p><strong>Протокол:</strong> <code>VLESS</code></p>
      <p><strong>Транспорт:</strong> <code>WebSocket</code></p>
      <p><strong>Путь:</strong> <code>/</code></p>
      <p><strong>TLS:</strong> <code>Включен</code></p>
    </div>
    
    <div style="text-align: center;">
      <a href="/${UUID}" class="btn">📋 Подписка (base64)</a>
      <a href="/info" class="btn">ℹ️ Информация</a>
    </div>
  </div>
</body>
</html>`;
}

// ============================================
// Подписка для клиентов
// ============================================
function handleSubscription(request) {
  const host = request.headers.get('Host');
  
  // Генерируем VLESS-ссылку
  const vlessLink = `vless://${UUID}@${host}:443?encryption=none&security=tls&type=ws&path=/${UUID}?ed=2560#AlgebraVPN`;
  
  // Кодируем в base64 (как ждут клиенты)
  const base64 = btoa(vlessLink);
  
  return new Response(base64, {
    headers: { 'Content-Type': 'text/plain;charset=utf-8' }
  });
}

// ============================================
// Простой прокси для остальных запросов
// ============================================
async function handleProxy(request) {
  const url = new URL(request.url);
  
  // Список сайтов для прокси
  const sites = [
    'cloudflare.com',
    'time.is',
    'github.com'
  ];
  
  const target = sites[Math.floor(Math.random() * sites.length)];
  const proxyUrl = `https://${target}${url.pathname}${url.search}`;
  
  const headers = new Headers(request.headers);
  headers.set('Host', target);
  
  const proxyRequest = new Request(proxyUrl, {
    method: request.method,
    headers: headers,
    body: request.body
  });
  
  try {
    return await fetch(proxyRequest);
  } catch {
    return new Response('Proxy error', { status: 502 });
  }
}
