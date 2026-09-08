# Encurtador de URLs 🔗☁️

Uma aplicação de encurtamento de URLs projetada com foco em escalabilidade e conceitos de sistemas distribuídos.

## 🛠️ Tecnologias Utilizadas
* **Backend:** Node.js com TypeScript
* **Banco de Dados:** PostgreSQL (SQL)
* **Infraestrutura:** Docker e Docker Compose

## ⚙️ Requisitos do Sistema
* A API recebe uma URL longa e retorna um código curto de 6 caracteres.
* Quando a API é acessada com a URL encurtada, ela redireciona o usuário para a URL original.
* A aplicação roda em Docker.
* Os dados são persistidos em um banco de dados SQL.

## 🚀 Como Executar Localmente
1. Clone este repositório.
2. Certifique-se de ter o Docker Desktop instalado.
3. Crie o arquivo `.env` a partir do modelo: `copy .env.example .env` (PowerShell: `Copy-Item .env.example .env`).
4. Ajuste as credenciais no `.env`, se necessário.
5. Na raiz do projeto, execute o comando: `docker-compose up --build`
6. A API estará disponível em `http://localhost:5000`.

---

## 🧠 Discussão de Arquitetura: Análise de Cenários

O design desta aplicação envolve avaliar cenários críticos de falha e pico de tráfego. Como estabelecido na teoria de sistemas distribuídos, não existe sistema perfeito, existem escolhas de design (tradeoffs).

### 1. O que acontece se o banco de dados cair?
Se a rede entre a nossa API e o banco de dados cair, ocorre uma Partição. Diante disso, o sistema pode adotar diferentes estratégias:
* **Opção Consistente:** A API atua para proteger os dados e diz: "Sistema indisponível". Nesse caso, o redirecionamento de URLs falharia até o banco voltar.
* **Opção de Disponiblidade:** A API libera o acesso e anota a operação para avisar o banco depois. Na prática do nosso encurtador, poderíamos manter as URLs mais acessadas em memória (cache). Assim, o redirecionamento continuaria funcionando para os usuários, garantindo a continuidade do serviço em caso de falhas.

### 2. O que acontece se 10.000 pessoas clicarem no mesmo link simultaneamente?
Um evento com 10.000 cliques simultâneos exige que a arquitetura suporte acesso simultâneo massivo, o que significa que uma vazão alta é essencial. 
* Se a nossa infraestrutura não estiver preparada, a latência (o tempo de resposta de uma operação) aumentará drasticamente. 
* Para suportar essa carga, o sistema precisa de escalabilidade, que é a capacidade de se adaptar e manter ou melhorar a performance à medida que a carga aumenta.
* **Estratégias de mitigação:** 
  1. Poderíamos aplicar a escalabilidade vertical, aumentando os recursos de uma única máquina (CPU, RAM) onde a API e o banco estão hospedados.
  2. A longo prazo, poderíamos evoluir para um sistema distribuído mais robusto, com o objetivo de distribuir a carga entre várias máquinas e melhorar a experiência do usuário.
