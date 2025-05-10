This is a reboot of [spc-learn](https://github.com/cognominal/spc-learn) from a clean state by scaffolding using  [sv](https://www.npmjs.com/package/sv)
 which generated the original [sv README](./README.sv.md)

The name of the repo will change.
Currently there is only a database test.


Install with `pnpm install`

Run with `pnpm run dev`

Access from the browser at `http://localhost:5173/` 

From vscode command palette "Focus on test explorer view" to run the test.

* NEXT: bring the UI with access to the db
* NEXT : adapt a table for translated documents to the db and bring the UI do add translated documents


* TBD : script my opportunist workflow. Currently it is messy but the git-pushed result is clean. No branches and no stashes, working (or not) files all over the place.  I do a commit using some of them when I got something working, I create a test  
[worktree][https://git-scm.com/docs/git-worktree], install and test there. Rinse and repeat amending the commit, then push the main branch when the test(s) succeed.
When things will settle, I will do feature branches.

* TBD : run the tests from a fresh vscode using the recommanded extensions from [extensions.json](.vscode/extensions.json) 
