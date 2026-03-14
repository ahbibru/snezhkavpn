// Абсолютный минимум без пароля
const UUID = '30a587b7-ef47-4706-bc55-f9f7d34b468a';

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const host = request.headers.get('Host');

    // Главная страница (всегда открыта)
    if (url.pathname === '/') {
      return new Response(getHtml(host), {
        headers: { 'Content-Type': 'text/html;charset=utf-8' }
      });
    }

    // Подписка
    if (url.pathname === '/' + UUID || url.pathname === '/link') {
      const vlessLink = `vless://${UUID}@${host}:443?encryption=none&security=tls&type=ws&path=/?ed=2560#AlgebraVPN`;
      return new Response(btoa(vlessLink), {
        headers: { 'Content-Type': 'text/plain' }
      });
    }

    // Инфо
    if (url.pathname === '/info') {
      return new Response(JSON.stringify({ 
        status: 'online', 
        uuid: UUID,
        server: host 
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response('Not found', { status: 404 });
  }
};

function getHtml(host) {
  return `<!DOCTYPE html>
<html>
<head>
  <title>AlgebraVPN</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      padding: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      margin: 0;
    }
    .container {
      max-width: 600px;
      background: rgba(255,255,255,0.1);
      backdrop-filter: blur(10px);
      padding: 30px;
      border-radius: 20px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.2);
    }
    h1 {
      text-align: center;
      margin-bottom: 30px;
    }
    .info {
      background: rgba(255,255,255,0.2);
      padding: 20px;
      border-radius: 10px;
      margin: 20px 0;
    }
    .info-item {
      display: flex;
      margin-bottom: 10px;
      padding: 8px;
      border-bottom: 1px solid rgba(255,255,255,0.2);
    }
    .label {
      font-weight: bold;
      width: 120px;
    }
    .value {
      flex: 1;
      font-family: monospace;
      word-break: break-all;
    }
    .status {
      display: inline-block;
      width: 10px;
      height: 10px;
      background: #4ade80;
      border-radius: 50%;
      margin-right: 8px;
      animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0% { opacity: 1; }
      50% { opacity: 0.5; }
      100% { opacity: 1; }
    }
    .btn {
      background: #ffd700;
      color: black;
      padding: 10px 20px;
      text-decoration: none;
      border-radius: 5px;
      display: inline-block;
      margin: 5px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>🚀 AlgebraVPN</h1>
    
    <div class="info">
      <div class="info-item">
        <span class="label">Статус:</span>
        <span class="value"><span class="status"></span>Работает</span>
      </div>
      <div class="info-item">
        <span class="label">Адрес:</span>
        <span class="value">${host}</span>
      </div>
      <div class="info-item">
        <span class="label">UUID:</span>
        <span class="value">${UUID}</span>
      </div>
      <div class="info-item">
        <span class="label">Порт:</span>
        <span class="value">443</span>
      </div>
      <div class="info-item">
        <span class="label">Протокол:</span>
        <span class="value">VLESS</span>
      </div>
      <div class="info-item">
        <span class="label">Транспорт:</span>
        <span class="value">WebSocket</span>
      </div>
      <div class="info-item">
        <span class="label">Путь:</span>
        <span class="value">/?ed=2560</span>
      </div>
      <div class="info-item">
        <span class="label">TLS:</span>
        <span class="value">Включен</span>
      </div>
    </div>
    
    <div style="text-align: center;">
      <a href="/${UUID}" class="btn">📋 Скопировать подписку</a>
      <a href="/info" class="btn">ℹ️ Информация о сервере</a>
    </div>
    
    <p style="text-align: center; margin-top: 20px; font-size: 0.9em; opacity: 0.8;">
      AlgebraVPN для vasilek-dfghjc
    </p>
  </div>
</body>
</html>`;
}
