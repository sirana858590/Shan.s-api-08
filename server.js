const axios = require('axios');
const express = require('express');
const app = express();

app.use(express.json());

app.post('/ShAn/imgur', async (req, res) => {
  const { imageUrl } = req.body;

  if (!imageUrl) return res.status(400).json({ error: "Missing image URL" });

  try {
    const imgurRes = await axios.post(
      'https://api.imgur.com/3/image',
      { image: imageUrl },
      {
        headers: {
          Authorization: 'Client-ID 0778d45eee5d31a'
        }
      }
    );

    return res.json({ imageUrl: imgurRes.data.data.link });
  } catch (error) {
    console.error('Imgur API error:', error?.response?.data || error.message);
    return res.status(500).json({ error: 'Upload failed' });
  }
});

app.get('/', (req, res) => {
  const coloredText = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Ewr ShAn.s Api</title>
      <style>
        body {
          background: #121212;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
          font-family: 'Arial', sans-serif;
          overflow: hidden;
        }
        .container {
          text-align: center;
          padding: 30px;
          border-radius: 15px;
          background: rgba(0, 0, 0, 0.7);
          box-shadow: 0 0 30px rgba(0, 255, 255, 0.3);
          position: relative;
          overflow: hidden;
        }
        .title {
          font-size: 3rem;
          font-weight: bold;
          background: linear-gradient(90deg, 
            #ff0000, #ff9900, #ffff00, 
            #33ff00, #00ff99, #0066ff, 
            #3300ff, #9900ff, #ff0099);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          background-size: 400% 400%;
          animation: rainbow 8s ease infinite;
          margin-bottom: 20px;
          text-shadow: 0 0 10px rgba(255,255,255,0.3);
        }
        .subtitle {
          color: #ccc;
          font-size: 1.2rem;
          margin-bottom: 30px;
        }
        .endpoints {
          color: #aaa;
          text-align: left;
          max-width: 500px;
          margin: 0 auto;
          padding: 15px;
          background: rgba(255,255,255,0.1);
          border-radius: 8px;
        }
        .endpoint {
          margin: 10px 0;
          font-family: monospace;
        }
        .endpoint a {
          color: #0af;
          text-decoration: none;
        }
        .endpoint a:hover {
          text-decoration: underline;
        }
        .particles {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
        }
        @keyframes rainbow {
          0% { background-position: 0% 50% }
          50% { background-position: 100% 50% }
          100% { background-position: 0% 50% }
        }
        @keyframes float {
          0% {
            transform: translate(0, 0) rotate(0deg);
            opacity: 0.1;
          }
          50% {
            opacity: 0.6;
          }
          100% {
            transform: translate(var(--tx), var(--ty)) rotate(360deg);
            opacity: 0.1;
          }
        }
      </style>
    </head>
    <body>
      <div class="particles" id="particles"></div>
      <div class="container">
        <div class="title">Ewr ShAn.s Api</div>
        <div class="subtitle">✨ API Is Running Smoothly ✨</div>
        
        <div class="endpoints">
          <div class="endpoint">Available Endpoints:</div>
          <div class="endpoint">• <a href="/ShAn/girlsvideo">/ShAn/girlsvideo</a> - Get random girls video</div>
          <div class="endpoint">• <a href="/ShAn/dpboy">/ShAn/dpboy</a> - Get random boys DP</div>
        </div>
      </div>
      
      <script>
        // Simple particle animation
        const particles = document.getElementById('particles');
        const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
        
        for (let i = 0; i < 50; i++) {
          const particle = document.createElement('div');
          const duration = Math.random() * 20 + 10;
          const tx = Math.random() * 200 - 100;
          const ty = Math.random() * 200 - 100;
          
          particle.style.position = 'absolute';
          particle.style.width = Math.random() * 5 + 2 + 'px';
          particle.style.height = particle.style.width;
          particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
          particle.style.borderRadius = '50%';
          particle.style.opacity = Math.random() * 0.5 + 0.1;
          particle.style.left = Math.random() * 100 + '%';
          particle.style.top = Math.random() * 100 + '%';
          particle.style.setProperty('--tx', tx + 'px');
          particle.style.setProperty('--ty', ty + 'px');
          particle.style.animation = 'float ' + duration + 's linear infinite';
          particle.style.animationDelay = Math.random() * 5 + 's';
          
          particles.appendChild(particle);
        }
      </script>
    </body>
    </html>
  `;
  res.send(coloredText);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
