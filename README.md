# WCDS app

Front end
repo: wcds-web dev branch
To run the app, `npm run dev`
See package.json for the scripts.

Vite is used for bundling, buidling etc.

.env.local is for local dev, do not check in. (it is excluded in the .gitignore)
VITE_API_BASE_URL=<url to aviation api>
VITE_API_KEY_CODE=<aviation token>

[Visit Design System](https://ui-components.alberta.ca)

Should be read to go by just running the debugger in visual studio code.

Rules:
Use scss modules. They prevent name collisions.
Use scss tokens, as listed in node_modules\@abgov\design-tokens\dist\tokens.scss
-note that tokens in Figma are frequently outdated, so you will have to find the new name!
Use Flexbox or Grid instead of tables and floats.
