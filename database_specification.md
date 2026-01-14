# Especificação do Banco de Dados - Plataforma de Conteúdo e Painel Admin

Este documento detalha a estrutura do banco de dados necessária para suportar a plataforma de conteúdo e o painel administrativo. A estrutura foi desenhada para permitir a criação, edição e gerenciamento de notícias, vídeos, newsletters e colunistas.

## Visão Geral das Tabelas

O banco de dados será composto por 5 tabelas principais, conectadas para garantir a integridade das informações e flexibilidade na criação de conteúdo.

---

### 1. Tabela: `columnists` (Colunistas)
**Tipo:** Tabela de Entidade / Perfil
**Funcionalidade:** Armazenar os dados dos autores dos artigos e colunas de opinião. Necessária para vincular conteúdos a seus criadores e exibir perfis no frontend.

| Coluna | Tipo | Descrição |
| :--- | :--- | :--- |
| `id` | `uuid` | Identificador único (Chave Primária). |
| `created_at` | `timestamp` | Data de criação do registro. |
| `name` | `text` | Nome completo do colunista. |
| `role` | `text` | Cargo ou função (ex: CEO, Especialista em Marketing). |
| `company` | `text` | Empresa do colunista. |
| `avatar_url` | `text` | URL da foto de perfil (armazenada no Storage). |
| `bio` | `text` | Breve biografia do colunista. |

---

### 2. Tabela: `news_items` (Artigos e Notícias)
**Tipo:** Tabela de Conteúdo
**Funcionalidade:** Armazenar as notícias gerais e artigos que alimentam o feed principal ("Últimas Notícias"). Permite o gerenciamento de publicações independentes das newsletters.

| Coluna | Tipo | Descrição |
| :--- | :--- | :--- |
| `id` | `uuid` | Identificador único (Chave Primária). |
| `created_at` | `timestamp` | Data de criação. |
| `title` | `text` | Título da notícia. |
| `excerpt` | `text` | Resumo ou chamada para a notícia. |
| `content` | `text` | Conteúdo completo (pode ser HTML ou Rich Text). |
| `category` | `text` | Categoria da notícia (ex: Tecnologia, Negócios). |
| `source` | `text` | Fonte da notícia. |
| `image_url` | `text` | URL da imagem de destaque. |
| `key_points` | `jsonb` | Lista de pontos-chave (array de textos). |
| `author_id` | `uuid` | Chave Estrangeira ligada a `columnists.id` (Opcional). |

---

### 3. Tabela: `videos` (Briefings Visuais)
**Tipo:** Tabela de Mídia
**Funcionalidade:** Gerenciar os vídeos exibidos na plataforma. Serve para organizar o conteúdo audiovisual, incluindo links externos (YouTube/Vimeo) e metadados.

| Coluna | Tipo | Descrição |
| :--- | :--- | :--- |
| `id` | `uuid` | Identificador único (Chave Primária). |
| `created_at` | `timestamp` | Data de criação. |
| `title` | `text` | Título do vídeo. |
| `duration` | `text` | Duração do vídeo (ex: "10:05"). |
| `platform` | `text` | Plataforma de origem (ex: "youtube"). |
| `video_id_or_url` | `text` | ID do vídeo ou URL completa. |
| `thumbnail_url` | `text` | URL da imagem de capa do vídeo. |
| `category` | `text` | Categoria do conteúdo. |

---

### 4. Tabela: `newsletter_editions` (Edições da Newsletter)
**Tipo:** Tabela Agregadora
**Funcionalidade:** Representa uma edição completa da newsletter (ex: "Edição #45"). Funciona como um "container" que agrupa várias histórias (`newsletter_stories`). Define a data de publicação e a identidade visual da edição.

| Coluna | Tipo | Descrição |
| :--- | :--- | :--- |
| `id` | `uuid` | Identificador único (Chave Primária). |
| `created_at` | `timestamp` | Data de criação. |
| `title` | `text` | Título da edição (ex: "Edição #42: O Futuro da IA"). |
| `publication_date` | `date` | Data de publicação da edição. |
| `cover_image_url` | `text` | Imagem de capa da edição. |
| `synthesis` | `text` | Texto introdutório ou resumo da edição. |
| `pdf_url` | `text` | Link para download do PDF (Opcional). |

---

### 5. Tabela: `newsletter_stories` (Conteúdo da Newsletter)
**Tipo:** Tabela de Conteúdo Vinculado
**Funcionalidade:** Armazena os capítulos ou matérias individuais que compõem uma edição de newsletter. Permite que cada edição tenha conteúdo exclusivo e estruturado, independente das notícias do feed.

| Coluna | Tipo | Descrição |
| :--- | :--- | :--- |
| `id` | `uuid` | Identificador único (Chave Primária). |
| `created_at` | `timestamp` | Data de criação. |
| `edition_id` | `uuid` | Chave Estrangeira ligada a `newsletter_editions.id` (Obrigatório). |
| `title` | `text` | Título da história/capítulo. |
| `excerpt` | `text` | Resumo curto. |
| `content` | `text` | Conteúdo completo da história. |
| `image_url` | `text` | Imagem ilustrativa específica desta história. |
| `category` | `text` | Categoria (ex: "Deep Dive", "Insight"). |
| `source` | `text` | Fonte da informação. |
| `key_points` | `jsonb` | Lista de pontos-chave específicos desta história. |
| `order` | `integer` | Número para definir a ordem de exibição dentro da edição. |

---

## Relacionamentos Importantes

1.  **Newsletters**: Relação **1:N** (Um para Muitos) entre `newsletter_editions` e `newsletter_stories`.
    *   Uma edição tem muitas histórias.
    *   Uma história pertence a apenas uma edição.
    
2.  **Autores**: Relação **1:N** (Opcional) entre `columnists` e `news_items`.
    *   Um colunista pode ter escrito várias notícias/artigos.
