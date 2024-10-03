# WCDS app

Front end
repo: wcds-web dev branch
To run the app, `npm run dev`
See package.json for the scripts.

Vite is used for bundling, buidling etc.

.env.local is for local dev, do not check in. (it is excluded in the .gitignore)
VITE_API_BASE_URL=<url to wcds-web-functions api>
VITE_AVIATION_API_BASE_URL=<url to aviation api>
VITE_AVIATION_API_KEY_CODE=<aviation token>
VITE_ENV=<dev or stage or uat or prod>
VITE_AVIATION_APPLICATION_BASE_URL = <URL to aviation application>
VITE_AUTHORIZATION_REALM
VITE_AUTHORIZATION_AUTHSERVERURL
VITE_ENABLE_AUTHORIZATION true or false
VITE_PR_NUMBER: 000
VITE_TARGET_BRANCH: local
VITE_WEB_VERSION: 00
VITE_FINANCE_NAV_ENABLED=true

[Visit Design System](https://ui-components.alberta.ca)

Should be read to go by just running the debugger in visual studio code.
the VITE_AUTHORIZATION... env variables are from the platform team.

Rules:
Use scss modules. They prevent name collisions.
Use scss tokens, as listed in node_modules\@abgov\design-tokens\dist\tokens.scss
-note that tokens in Figma are frequently outdated, so you will have to find the new name!
Use Flexbox or Grid instead of tables and floats.
