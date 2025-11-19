# 🗝️ KeyMark - Cofre de Links e Ideias

KeyMark é um cofre de links e ideias minimalista focado em **produtividade** e **organização**. Ele permite capturar URLs, notas e tarefas, categorizá-los em filas, definir prioridades e acompanhar o tempo gasto em cada item usando um timer integrado.

## 💡 Visão Geral das Funcionalidades

| Recurso | Descrição |
| :--- | :--- |
| **Captura Multifuncional** | Salve URLs e notas curtas, com suporte a **Alias (Título Curto)** e **Estimativa de Tempo**. |
| **Priorização Visual** | Classifique seus itens com prioridade **Baixa**, **Média** ou **Alta**, refletida visualmente nos cards. |
| **Organização em Colunas** | Três categorias principais de filas de conteúdo: **📚 Ler Depois**, **📺 Assistir Depois**, e **⚙️ Testar/Implementar**. |
| **Timer Integrado** | Acompanhe o tempo real gasto em cada tarefa. Apenas um timer pode rodar por vez, garantindo foco. |
| **Busca e Filtro** | Pesquise rapidamente por palavra-chave ou URL. Filtre por status (Pendentes/Concluídos). |
| **Modo Claro/Escuro** | Alternância de tema salva no navegador para maior conforto visual. |
| **Lixeira Inteligente** | Itens excluídos são armazenados temporariamente (limite de 10 itens) para restauração ou exclusão permanente. |
| **Persistência & Backup** | Dados salvos automaticamente no Local Storage, com suporte para **Exportação** e **Importação** (formato JSON). |

## 🛠️ Tecnologias Utilizadas

O KeyMark é construído utilizando tecnologias web fundamentais, garantindo leveza e portabilidade:

* **HTML5:** Estrutura semântica.
* **CSS3:** Estilização, sistema de temas (`.light-mode`) e layout responsivo (**Grid Layout**).
* **JavaScript (Vanilla JS):** Lógica de estado, persistência de dados (Local Storage), timers, e manipulação do DOM.

## 🚀 Como Utilizar o KeyMark

### 1. Salvar um Novo Item

1.  No campo principal (**"Cole o link ou digite sua ideia..."**), insira a URL ou o texto da sua nota.
2.  (Opcional) Preencha os campos **Alias** (título curto) e **Estimativa de Tempo** (Ex: `30 min`, `1 hora`).
3.  Clique no botão **Prioridade** para alternar o nível de importância (Baixa é o padrão).
4.  Clique em um dos botões de categoria (📚, 📺, ⚙️) para adicionar o item à fila.

### 2. Acompanhar Tempo com o Timer

O KeyMark foi projetado para focar em uma tarefa por vez.

* Se o item tiver tempo registrado, clique em **⚙️ Controles Timer**.
* Clique em **▶️ Iniciar**. O tempo começará a contar em segundos.
* **Atenção:** Se outro timer estiver rodando, ele será pausado automaticamente.
* Use **⏸️ Pausar** para parar a contagem e **↩️ Resetar** para zerar o tempo registrado.

### 3. Edição e Status

* **Marcar como Concluído:** Clique no botão **✅ Concluído**. O texto do item será riscado e seu status será atualizado nos filtros.
* **Editar Título (Alias):** Para Links (URL), clique em **✏️ Título** para alterar o nome de exibição através do modal. Para Notas, clique diretamente no texto do conteúdo e edite; a alteração é salva ao clicar fora.
* **Excluir:** Clique em **🗑️ Excluir**. O item será movido para a **Lixeira**.

### 4. Backup de Dados

O KeyMark armazena todos os seus dados no Local Storage. Para portabilidade ou segurança:

1.  Clique em **📥 Exportar Links** para baixar um arquivo JSON com todos os seus dados.
2.  Clique em **📤 Importar Links** para carregar um backup JSON e restaurar seu cofre.

## ⚙️ Instalação (Uso Local)

Para rodar o projeto em seu próprio ambiente:

1.  **Clone o repositório:**
    ```bash
    git clone [LINK_DO_SEU_REPOSITORIO]
    ```
2.  **Navegue até a pasta do projeto:**
    ```bash
    cd keymark-cofre-de-links
    ```
3.  **Abra no navegador:** Simplesmente abra o arquivo `index.html` em seu navegador de preferência. Como o projeto é puramente frontend (HTML, CSS e JS), não há necessidade de servidor web.

## 🤝 Contributions

Feel free to explore the code, suggest improvements, or report bugs.

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---
**Developed with 💜 by [[PatrickCaramico](https://github.com/PatrickCaramico)]**
