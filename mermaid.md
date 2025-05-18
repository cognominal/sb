## Information flow: clicking a word (English)

```mermaid
flowchart TD
    subgraph User
        A3["Click on a word"]
    end

    subgraph SvelteKit_Server
        B3["/getDefinition action (endpoint)"]
    end

    subgraph Database
        C3[words]
    end

    subgraph External
        D1[Wiktionary API]
    end

    %% Flow when clicking a word
    A3 --> B3
    B3 -- "SELECT * FROM words WHERE word=..." --> C3
    C3 -- "Local definition or not found" --> B3
    B3 -- "If not found, request API" --> D1
    D1 -- "Wiktionary definition" --> B3
    B3 -- "Response (definition)" --> A3
```


# Information flow: routes `/docs` and `/docs/[id]`

This diagram shows how data flows between the user, the SvelteKit server, and the database when accessing the `/docs` and `/docs/[id]` routes.

```mermaid
flowchart TD
    subgraph User
        A1[Request /docs]
        A2["Request /docs/[id]"]
    end

    subgraph SvelteKit_Server
        B1[+page.server.ts in /docs]
        B2["+page.server.ts in /docs/[id]"]
    end

    subgraph Database
        C1[documents]
        C2[docprez]
    end

    %% Route /docs
    A1 --> B1
    B1 -- "SELECT * FROM documents" --> C1
    C1 -- "List of documents" --> B1
    B1 --> A1

    %% Route /docs/[id]
    A2 --> B2
    B2 -- "SELECT * FROM documents WHERE id=..." --> C1
    B2 -- "SELECT * FROM docprez WHERE document_id=..." --> C2
    C1 -- "Document" --> B2
    C2 -- "Related presentations" --> B2
    B2 --> A2
```

## Information flow: clicking a word

```mermaid
flowchart TD
    subgraph User
        A3["Click on a word"]
    end

    subgraph SvelteKit_Server
        B3["/getDefinition action (endpoint)"]
    end

    subgraph Database
        C3[words]
    end

    subgraph External
        D1[Wiktionary API]
    end

    %% Flow when clicking a word
    A3 --> B3
    B3 -- "SELECT * FROM words WHERE word=..." --> C3
    C3 -- "Local definition or not found" --> B3
    B3 -- "If not found, request API" --> D1
    D1 -- "Wiktionary definition" --> B3
    B3 -- "Response (definition)" --> A3
```
