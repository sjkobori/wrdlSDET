# wrdlSDET
Test project to run automated assertions on [wrdl](https://www.nytimes.com/games/wordle/index.html) using [Playwright](https://playwright.dev/)
## How to Run Locally
### Installation Steps
- Install Node (LTS) and npm
  - Visit https://nodejs.org/en/download/ making sure to choose npm
- Install node packages: `npm install` 
- Install Playwright browser binaries: `npx playwright install --with-deps`
### Run Tests
`npm run test`
- To enable retries, run with: `--retries=<# of retries>`
  - ex w/ 2 retries: `npm run test --retries=2`

## How to Run in CI
CI will run automatically from the following events:
- Any PR
- Pushes to main
- Schedule (00:30 UTC)

This automation can be run manually via `workflow_dispatch` 
[here](https://github.com/sjkobori/wrdlSDET/actions/workflows/test-live.yml):
- Go to GitHub Actions Tab of the repo
- Go to the "Run UI Tests" workflow
- Click Run Workflow and choose which branch to run the workflow from

Automation details can be read from the [workflow file](.github/workflows/test-live.yml)

## Improvements
If I were to continue to work on this project, I would make the following improvements:
- Screenshot Artifacts
  - I think taking reference screenshots and screenshots are part of the test run to compare against each other would be
    really helpful to see what went wrong in a test. When a test does fail, it does generate a screenshot but there is
    no reference to compare it against so it is not so helpful. Having these display as part of the test report and as
    a workflow artifact would make it easier to analyze a report without needing to understand the code as well.
- Standardized Locator Paths 
  - I wanted to make standardized ways of accessing specific elements within the test, but due to the nature of E2E
    tests and how stateful they are, it did not seem like there was an elegant solution to this. Since the locator args 
    are dependent on the page and do not always correspond to the same query method (`getByLabel`, `getByRole` etc.), I 
    could not create a look-up table to abstract those details. I wanted to do this so that there would be a source of 
    how to access each relevant element on the page, and if they need updating due to a functionality change on the
    all the corresponding tests could be updated together.
- CI Job Rename Based on Test Results
  - I would like to make it so that the GitHub action workflow run renames itself with the number of tests that
    passed/failed/skipped etc. I felt like it was probably overengineering a solution for the scope of this project
    since I would have to make a separate GitHub action to rename the run with the test results. Seems like having more
    ability to change the `run-name` is desired https://github.com/orgs/community/discussions/69476
- Update Cron Schedule
  - In a similar vein, I wanted to allow updates to the cron schedule, but this also felt like it would be 
    overengineering a solution. It would be easy enough to add it as a GitHub variable, but then I would want to 
    validate that it was in the proper crontab format which I cannot do from GitHub UI directly. I thought about making 
    another GitHub action to validate and update the schedule, but it felt like the juice was not worth the squeeze.
- Valid words list
  - Based on my research, since nyt took over wrdl, there does not seem to be any official list of valid words which
    are supported by the game. This theoretically introduces flakiness since my tests are dependent on guessing valid
    and invalid words, which I am just guessing at this time. I would like to have at least some sort of standardized 
    list going forward (official or curated).

