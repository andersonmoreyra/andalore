// ═══════════════════════════════════════════════════════════════════════════
// AUTH.JS - Sistema de Autenticação e Login
// Sistema de Gestão de Manutenção - Marvi Alimentos
// ═══════════════════════════════════════════════════════════════════════════

const Auth = {
  
  // ─── Verificar autenticação ────────────────────────────────────────────────
  
  checkAuth() {
    const user = Storage.getCurrentUser();
    if (!user) {
      this.showLoginScreen();
      return false;
    }
    return true;
  },

  // ─── Mostrar tela de login ─────────────────────────────────────────────────
  
  showLoginScreen() {
    const root = document.getElementById('root');
    if (!root) return;

    root.innerHTML = `
      <div class="login-container">
        <div class="login-box">
          <div class="login-header">
            <div class="login-logo">⚙️</div>
            <h1 class="login-title">MAINT·OS</h1>
            <p class="login-subtitle">Sistema de Gestão de Manutenção</p>
            <p class="login-company">Marvi Alimentos · Planta Ourinhos</p>
          </div>

          <form class="login-form" id="loginForm">
            <div class="form-group">
              <label for="email">E-mail</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                class="form-input" 
                placeholder="seu.email@marvi.com"
                autocomplete="email"
                required
              />
            </div>

            <div class="form-group">
              <label for="senha">Senha</label>
              <input 
                type="password" 
                id="senha" 
                name="senha" 
                class="form-input" 
                placeholder="••••••••"
                autocomplete="current-password"
                required
              />
            </div>

            <div class="form-group-checkbox">
              <input type="checkbox" id="lembrar" name="lembrar" />
              <label for="lembrar">Lembrar-me neste dispositivo</label>
            </div>

            <div id="loginError" class="login-error" style="display: none;"></div>

            <button type="submit" class="btn-login">
              Entrar
            </button>
          </form>

          <div class="login-footer">
            <p class="login-help">Precisa de ajuda? Contate o administrador do sistema</p>
            <div class="login-demo">
              <p><strong>Contas de demonstração:</strong></p>
              <div class="demo-accounts">
                <button class="btn-demo" onclick="Auth.fillDemoAccount('admin')">
                  👤 Admin
                </button>
                <button class="btn-demo" onclick="Auth.fillDemoAccount('coordenador')">
                  👤 Coordenador
                </button>
                <button class="btn-demo" onclick="Auth.fillDemoAccount('tecnico')">
                  👤 Técnico
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Adicionar estilos da tela de login
    this.injectLoginStyles();

    // Adicionar event listener ao formulário
    document.getElementById('loginForm').addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleLogin();
    });

    // Focus no campo de email
    document.getElementById('email').focus();
  },

  // ─── Preencher conta demo ──────────────────────────────────────────────────
  
  fillDemoAccount(tipo) {
    const demoAccounts = {
      admin: {
        email: 'anderson',
        senha: 'admin123'
      },
      coordenador: {
        email: 'coordenador',
        senha: 'coord123'
      },
      tecnico: {
        email: 'tecnico@marvi.com',
        senha: 'tec123'
      }
    };

    const account = demoAccounts[tipo];
    if (account) {
      document.getElementById('email').value = account.email;
      document.getElementById('senha').value = account.senha;
      document.getElementById('email').focus();
    }
  },

  // ─── Processar login ───────────────────────────────────────────────────────
  
  handleLogin() {
    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value;
    const lembrar = document.getElementById('lembrar').checked;

    // Validação básica
    if (!email || !senha) {
      this.showLoginError('Por favor, preencha todos os campos');
      return;
    }

    // Tentar fazer login
    const user = Storage.login(email, senha);

    if (user) {
      // Login bem-sucedido
      if (lembrar) {
        localStorage.setItem('manutencao_remember', 'true');
      }

      // Mostrar mensagem de sucesso
      this.showLoginSuccess(user.nome);

      // Recarregar a aplicação após 800ms
      setTimeout(() => {
        window.location.reload();
      }, 800);
    } else {
      // Login falhou
      this.showLoginError('E-mail ou senha incorretos. Tente novamente.');
    }
  },

  // ─── Mostrar erro de login ─────────────────────────────────────────────────
  
  showLoginError(message) {
    const errorDiv = document.getElementById('loginError');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';

    // Shake animation
    const loginBox = document.querySelector('.login-box');
    loginBox.classList.add('shake');
    setTimeout(() => {
      loginBox.classList.remove('shake');
    }, 500);

    // Esconder erro após 5 segundos
    setTimeout(() => {
      errorDiv.style.display = 'none';
    }, 5000);
  },

  // ─── Mostrar sucesso de login ──────────────────────────────────────────────
  
  showLoginSuccess(userName) {
    const errorDiv = document.getElementById('loginError');
    errorDiv.className = 'login-success';
    errorDiv.textContent = `Bem-vindo, ${userName}! Carregando sistema...`;
    errorDiv.style.display = 'block';
  },

  // ─── Fazer logout ──────────────────────────────────────────────────────────
  
  logout() {
    if (confirm('Deseja realmente sair do sistema?')) {
      Storage.logout();
      localStorage.removeItem('manutencao_remember');
      window.location.reload();
    }
  },

  // ─── Injetar estilos do login ──────────────────────────────────────────────
  
  injectLoginStyles() {
    if (document.getElementById('login-styles')) return;

    const style = document.createElement('style');
    style.id = 'login-styles';
    style.textContent = `
      .login-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
      }

      .login-box {
        background: white;
        border-radius: 16px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        width: 100%;
        max-width: 440px;
        padding: 40px;
        animation: slideUp 0.4s ease-out;
      }

      @keyframes slideUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .login-box.shake {
        animation: shake 0.5s;
      }

      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
        20%, 40%, 60%, 80% { transform: translateX(10px); }
      }

      .login-header {
        text-align: center;
        margin-bottom: 32px;
      }

      .login-logo {
        font-size: 48px;
        margin-bottom: 16px;
        animation: pulse 2s infinite;
      }

      @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }

      .login-title {
        font-size: 28px;
        font-weight: 700;
        color: #1a1a1a;
        margin-bottom: 8px;
        letter-spacing: 2px;
      }

      .login-subtitle {
        font-size: 14px;
        color: #666;
        margin-bottom: 4px;
      }

      .login-company {
        font-size: 13px;
        color: #999;
        font-weight: 500;
      }

      .login-form {
        margin-bottom: 24px;
      }

      .form-group {
        margin-bottom: 20px;
      }

      .form-group label {
        display: block;
        font-size: 13px;
        font-weight: 600;
        color: #333;
        margin-bottom: 8px;
      }

      .form-input {
        width: 100%;
        padding: 12px 16px;
        border: 2px solid #e0e0e0;
        border-radius: 8px;
        font-size: 14px;
        transition: all 0.2s;
        font-family: inherit;
      }

      .form-input:focus {
        outline: none;
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
      }

      .form-group-checkbox {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 24px;
      }

      .form-group-checkbox input[type="checkbox"] {
        width: 18px;
        height: 18px;
        cursor: pointer;
      }

      .form-group-checkbox label {
        font-size: 13px;
        color: #666;
        cursor: pointer;
        user-select: none;
      }

      .login-error {
        background: #fee;
        color: #c33;
        padding: 12px 16px;
        border-radius: 8px;
        font-size: 13px;
        margin-bottom: 16px;
        border: 1px solid #fcc;
      }

      .login-success {
        background: #efe;
        color: #3a3;
        border: 1px solid #cfc;
      }

      .btn-login {
        width: 100%;
        padding: 14px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 15px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
        text-transform: uppercase;
        letter-spacing: 1px;
      }

      .btn-login:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
      }

      .btn-login:active {
        transform: translateY(0);
      }

      .login-footer {
        text-align: center;
        padding-top: 24px;
        border-top: 1px solid #e0e0e0;
      }

      .login-help {
        font-size: 12px;
        color: #999;
        margin-bottom: 20px;
      }

      .login-demo {
        background: #f5f5f5;
        padding: 16px;
        border-radius: 8px;
      }

      .login-demo p {
        font-size: 12px;
        color: #666;
        margin-bottom: 12px;
        font-weight: 600;
      }

      .demo-accounts {
        display: flex;
        gap: 8px;
        justify-content: center;
        flex-wrap: wrap;
      }

      .btn-demo {
        padding: 8px 16px;
        background: white;
        border: 1px solid #ddd;
        border-radius: 6px;
        font-size: 12px;
        cursor: pointer;
        transition: all 0.2s;
        font-weight: 500;
      }

      .btn-demo:hover {
        background: #667eea;
        color: white;
        border-color: #667eea;
        transform: translateY(-1px);
      }

      @media (max-width: 480px) {
        .login-box {
          padding: 24px;
        }

        .login-title {
          font-size: 24px;
        }
      }
    `;

    document.head.appendChild(style);
  }
};

// Exportar para uso global
window.Auth = Auth;
