# SPC-Learn: Russian Language Learning Tool


## Information Flow Diagram

The following diagram illustrates how information flows through the application:

```mermaid
graph TD
    %% Main Components
    A[Raw HTML Content] -->|Processed by| B[processContent.ts]
    B -->|Identifies Russian Words| C[Russian Words in Database]
    B -->|Generates| D[Processed HTML with Interactive Spans]
    D -->|Stored in| E[grok-processed-file.html]

    %% Server-side Flow
    E -->|Loaded by| F[+page.server.ts]
    F -->|Provides data to| G[+page.svelte]

    %% Client-side Flow
    G -->|Initializes| H[PageState]
    G -->|Renders| I[MainPanel.svelte]
    G -->|Conditionally Renders| J[WiktDefnPanel.svelte]

    %% User Interaction Flow
    I -->|User clicks Russian word| K[handleClickRussianWord]
    K -->|Updates| H
    K -->|Calls| L[showDefinition]

    %% Definition Retrieval Flow
    L -->|Checks| C
    L -->|If not in DB, fetches from| M[Wiktionary API]
    M -->|Processed by| N[processWiktionary]
    N -->|Returns| O[Formatted Definition]
    O -->|Stored in| C
    O -->|Updates| H

    %% State Updates
    H -->|Updates| J
    J -->|Displays| O

    %% Section Handling
    I -->|User clicks section| P[handleClickSection]
    P -->|Highlights section| I
    P -->|Shows/hides translations| I

    %% Admin Scripts
    subgraph Admin Scripts
        AA[Admin Menu] -->|Provides UI for| AB[Admin Operations]
        AB -->|Executes| AC[Add Common Words]
        AB -->|Executes| AD[Dump Database]
        AB -->|Executes| AE[Restore Database]
        AB -->|Executes| AF[Clear Database]
        AB -->|Executes| AG[Purge Wiktionary Content]
        AB -->|Executes| AH[Process Content]
    end

    %% Admin Script Effects
    AC -->|Adds common words to| C
    AD -->|Exports| AT[words-dump.yaml]
    AE -->|Imports from| AT
    AE -->|Restores| C
    AF -->|Clears| C
    AG -->|Removes definitions from| C
    AH -->|Same as| B

    %% Database Operations
    subgraph Database Operations
        C -->|getWordData| Q[Retrieve Word Data]
        C -->|storeWordData| R[Store Word Data]
        C -->|dumpDatabaseToYAML| S[Backup Database]
        S -->|Creates| AT
    end

    %% Style Definitions
    classDef component fill:#f9f,stroke:#333,stroke-width:2px;
    classDef data fill:#bbf,stroke:#333,stroke-width:2px;
    classDef function fill:#bfb,stroke:#333,stroke-width:2px;
    classDef api fill:#fbb,stroke:#333,stroke-width:2px;
    classDef admin fill:#fc9,stroke:#333,stroke-width:2px;

    %% Apply Styles
    class A,D,E,O,AT data;
    class B,F,G,I,J component;
    class K,L,N,P,Q,R,S function;
    class M api;
    class C,H data;
    class AA,AB,AC,AD,AE,AF,AG,AH admin;

    %% Add clickable links to GitHub repository
    click B "https://github.com/cognominal/spc-learn/blob/main/src/lib/server/processor.ts" "View processContent.ts on GitHub"
    click C "https://github.com/cognominal/spc-learn/blob/main/src/lib/server/db.ts" "View database implementation on GitHub"
    click F "https://github.com/cognominal/spc-learn/blob/main/src/routes/+page.server.ts" "View +page.server.ts on GitHub"
    click G "https://github.com/cognominal/spc-learn/blob/main/src/routes/+page.svelte" "View +page.svelte on GitHub"
    click H "https://github.com/cognominal/spc-learn/blob/main/src/lib/PageState.svelte" "View PageState implementation on GitHub"
    click I "https://github.com/cognominal/spc-learn/blob/main/src/lib/MainPanel.svelte" "View MainPanel.svelte on GitHub"
    click J "https://github.com/cognominal/spc-learn/blob/main/src/lib/WiktDefnPanel.svelte" "View WiktDefnPanel.svelte on GitHub"
    click K "https://github.com/cognominal/spc-learn/blob/main/src/lib/eventHandlers.ts#L3" "View handleClickRussianWord function on GitHub"
    click N "https://github.com/cognominal/spc-learn/blob/main/src/lib/server/ProcessWiktionary.ts" "View processWiktionary implementation on GitHub"
    click P "https://github.com/cognominal/spc-learn/blob/main/src/lib/eventHandlers.ts#L19" "View handleClickSection function on GitHub"
    click AA "https://github.com/cognominal/spc-learn/blob/main/scripts/adminMenu.ts" "View Admin Menu implementation on GitHub"
```

## Diagram Explanation

This diagram shows the flow of information through the application:

### Main Flow
- Raw HTML content is processed to identify Russian words and generate interactive HTML
- The processed HTML is loaded by the server and provided to the client
- The client initializes the page state and renders the main components
- When a user clicks on a Russian word, its definition is retrieved and displayed

### Admin Scripts (Orange)
- The admin menu provides a central interface for various administrative operations
- Scripts like `add-common-words.ts` add common Russian words to the database
- Database management scripts allow for backing up, restoring, and clearing the database
- Content processing scripts handle the transformation of raw HTML to interactive content

### Database Operations
- Words and their definitions are stored in and retrieved from the database
- The database can be backed up to a YAML file for version control
- The database can be restored from the YAML backup when needed

## Dev

As the db schema is changing, it's pointless to commit the yaml dump of the db.
When changing the format of the processed wiktionary page, better clean the db
before running `pnpm run dev`
