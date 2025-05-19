
# pagestate.wlang Usage Chart

```mermaid
graph TD
    A[PageState.wlang variable]
    
    %% Readers
    A --> B1[src/lib/c/WiktDefnPanel.svelte]:::reader
    A --> B2["src/lib/eventHandlers.ts\n(getAndProcessDefinition)"]:::reader
    A --> B3["src/lib/server/ProcessWiktionary.ts\n(processWiktionary, sectionName)"]:::reader
    A --> B4["src/lib/server/db.ts\n(storeWordDataIndB)"]:::reader
    
    %% Writers
    B1 -. writes .-> A
    
    classDef reader fill:#e0f7fa,stroke:#00796b;
    classDef writer fill:#fff3e0,stroke:#e65100;
    
    %% Details
    B1:::reader
    B2:::reader
    B3:::reader
    B4:::reader
```

**Legend:**
- Blue nodes: files/functions that read `pagestate.wlang`
- Orange dashed arrows: files/functions that write to `pagestate.wlang`

**Notes:**
- `src/lib/c/WiktDefnPanel.svelte` both reads and writes `pagestate.wlang` (e.g., via language selection radio buttons).
- `getAndProcessDefinition` and related functions use it to fetch/process definitions.
- `processWiktionary` and `sectionName` use it to select Wiktionary sections.
- `storeWordDataIndB` uses it to store word data in the DB.
