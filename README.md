# Simple Fullstack App
Doesn't do much right now, but has a websocket server and basic http server

# Todos
 - Create dev and test environments
    - Create subdomains
    - Create git branches
    - Create git pull and npm install script and cron job for each subdomain
    - For CI/CD pipeline (can do in a bash script or experiment with other tools)
        - When code is pushed to origin dev
            - run any build steps (npm install, lint, etc.)
            - run unit tests
            - run integration tests
            - run E2E tests
            - on results, either allow the merge if passed or reject the merge if failed
        - When code is pushed to origin test
            - same steps
        - When code is pushed to origin main
            - same steps
            - could add a deploy step at the end, if all goes well, push a button in github or something that will restart pm2

# Issues
 - git pull cron seems to be stopped