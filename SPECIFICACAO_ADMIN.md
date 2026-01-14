# Especificação Técnica: Painel Administrativo ("Empresário Digital")

Este documento descreve as funcionalidades, estrutura de dados e requisitos para o desenvolvimento do Painel Administrativo que alimentará o frontend do usuário. O objetivo é substituir os dados estáticos (mock) por dados dinâmicos vindos do Supabase.

## 1. Visão Geral da Arquitetura

*   **Frontend Usuário**: Consome dados do Supabase.
*   **Frontend Admin**: Gerencia (Cria, Lê, Atualiza, Deleta) os dados no Supabase.
*   **Banco de Dados**: PostgreSQL (Supabase).
*   **Storage**: Supabase Storage (para imagens e assets).

---

## 2. Estrutura do Banco de Dados (Schema Sugerido)

### 2.1. Tabelas Principais

#### `columnists` (Colunistas)
Autores das colunas e artigos de opinião.
*   `id` (uuid, PK)
*   `name` (text)
*   `role` (text)
*   `company` (text)
*   `avatar_url` (text)
*   `bio` (text)

#### `news_items` (Feed de Notícias / Artigos)
Notícias gerais que aparecem no feed "Últimas Notícias".
*   `id` (uuid, PK)
*   `title` (text)
*   `excerpt` (text)
*   `content` (text/html - Rich Text)
*   `category` (text)
*   `source` (text)
*   `image_url` (text)
*   `key_points` (jsonb/array)
*   `author_id` (uuid, FK -> `columnists.id`) - Opcional.

#### `videos` (Briefings Visuais)
*   `id` (uuid, PK)
*   `title` (text)
*   `duration` (text)
*   `platform` (text)
*   `video_id_or_url` (text)
*   `thumbnail_url` (text)
*   `category` (text)

#### `newsletter_editions` (Edições da Newsletter)
Agrupa o conteúdo de uma edição.
*   `id` (uuid, PK)
*   `title` (text) - Ex: "Edição #42: O Futuro da IA"
*   `publication_date` (date)
*   `cover_image_url` (text)
*   `synthesis` (text) - Texto introdutório / Abstract da edição
*   `pdf_url` (text) - Opcional

#### `newsletter_stories` (Conteúdo Exclusivo da Newsletter)
**Mudança Importante**: Ao invés de vincular notícias existentes, a Newsletter possui seu próprio conteúdo exclusivo. Cada "Story" ou "Item" pertence unicamente a uma edição.
*   `id` (uuid, PK)
*   `edition_id` (uuid, FK -> `newsletter_editions.id`)
*   `title` (text)
*   `excerpt` (text)
*   `content` (text/html) - Conteúdo completo do item/capítulo.
*   `image_url` (text)
*   `category` (text) - Ex: "Insight Estratégico", "Deep Dive"
*   `source` (text) - Ex: "Redação", "Análise de Mercado"
*   `key_points` (jsonb/array) - Pontos chave específicos deste item.
*   `order` (integer) - Ordem de exibição na edição.

---

## 3. Funcionalidades do Painel Administrativo

### 3.1. Autenticação
*   Login seguro para administradores.

### 3.2. Módulo de Newsletters (Otimizado)
A Newsletter funciona como um "Construtor de Conteúdo".

1.  **Criar Edição**: O admin define a "Capa", "Título" e "Síntese" (Abstract).
2.  **Adicionar Stories (Conteúdo)**:
    *   Dentro da edição, o admin clica em **"Adicionar Story"**.
    *   Abre-se um formulário completo para criar o conteúdo ali mesmo (Título, Imagem, Texto, Key Points).
    *   Este conteúdo é salvo como um `newsletter_story` vinculado a esta edição.
    *   **Diferencial**: Isso permite que a newsletter tenha uma narrativa própria, independente das notícias do dia a dia do site.
    *   **Reordenação**: O admin pode arrastar e soltar a ordem das stories.

### 3.3. Outros Módulos
*   **Notícias**: CRUD simples para o feed principal.
*   **Vídeos**: CRUD com inserção de link do YouTube.
*   **Colunistas**: Gestão de perfis e avatares.

---

## 4. Integração Frontend (Impacto)

Com essa mudança na estrutura lógica da Newsletter:

*   **Visual (`NewsletterDetail.tsx`)**: **Nenhuma mudança visual drástica é necessária.** O layout atual já espera uma lista de itens com título, imagem e pontos chave.
*   **Lógica de Dados**:
    *   A única mudança será na **busca de dados** (`lib/mcpClient.ts` ou a nova query do Supabase).
    *   Antes/Mock: Buscava-se notícias globais.
    *   Agora: Deve-se buscar os itens da tabela `newsletter_stories` filtrando pelo ID da edição atual.
    *   O objeto retornado deve manter a estrutura compatível (ter `title`, `imageUrl`, `keyPoints`, etc.), garantindo que o frontend renderize perfeitamente.

## 5. Checklist de Implementação

1.  [ ] Criar tabelas `newsletter_editions` e `newsletter_stories` no Supabase.
2.  [ ] Criar bucket `newsletter-assets`.
3.  [ ] Desenvolver interface Admin para "Builder de Newsletter" (Capa + Lista de Stories editáveis).
4.  [ ] Atualizar query do frontend para buscar `stories` ao carregar uma edição.
