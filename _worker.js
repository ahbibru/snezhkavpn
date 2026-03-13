export default {
  async fetch(request) {
    const url = new URL(request.url);
    const uuid = '30a587b7-ef47-4706-bc55-f9f7d34b468a';
    
    // Главная страница с инструкцией
    if (url.pathname === '/') {
      return new Response(getHtml(), {
        headers: { 'Content-Type': 'text/html;charset=utf-8' }
      });
    }
    
    // Подписка для v2rayTUN (сервер называется Free)
    if (url.pathname === '/' + uuid || url.pathname === '/link') {
      const vlessLink = `vless://${uuid}@time.is:443?encryption=none&security=tls&type=ws&path=/?ed=2560#Free`;
      return new Response(btoa(vlessLink), {
        headers: { 'Content-Type': 'text/plain' }
      });
    }
    
    return new Response('Not found', { status: 404 });
  }
};

function getHtml() {
  return `<!DOCTYPE html>
<html>
<head>
  <title>AlgebraVPN</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      min-height: 100vh;
      margin: 0;
      padding: 40px 20px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .container {
      max-width: 600px;
      background: rgba(255,255,255,0.1);
      backdrop-filter: blur(10px);
      border-radius: 20px;
      padding: 30px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.2);
    }
    h1 {
      text-align: center;
      margin-bottom: 30px;
      font-size: 2.5em;
    }
    h1 span {
      background: linear-gradient(45deg, #ffd700, #ffaa00);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .info {
      background: rgba(255,255,255,0.15);
      border-radius: 10px;
      padding: 20px;
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
    .free-badge {
      background: #ffd700;
      color: #000;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 0.8em;
      font-weight: bold;
      margin-left: 8px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1><span>Algebra</span>VPN</h1>
    
    <div class="info">
      <div class="info-item">
        <span class="label">Статус:</span>
        <span class="value"><span class="status"></span>Активен</span>
      </div>
      <div class="info-item">
        <span class="label">Сервер:</span>
        <span class="value">Free <span class="free-badge">FREE</span></span>
      </div>
      <div class="info-item">
        <span class="label">Адрес:</span>
        <span class="value">algebravpn.vasilek-dfghjc.workers.dev</span>
      </div>
      <div class="info-item">
        <span class="label">UUID:</span>
        <span class="value">30a587b7-ef47-4706-bc55-f9f7d34b468a</span>
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
    
    <p style="text-align: center;">
      <strong>Подписка:</strong> 
      <a href="/30a587b7-ef47-4706-bc55-f9f7d34b468a" style="color: #ffd700;">/uuid</a> 
      или 
      <a href="/link" style="color: #ffd700;">/link</a>
    </p>
    
    <p style="text-align: center; font-size: 0.9em; opacity: 0.8;">
      AlgebraVPN для vasilek-dfghjc
    </p>
  </div>
</body>
</html>`;
}
