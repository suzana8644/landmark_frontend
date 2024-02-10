This is a web app for Landmark Decor.
## Getting Started

First, clone the repo with:

```bash
git clone https://github.com/dhirajphuyal/landmark-frontend.git
```

Then, create a new .env file with following values assigned:
```text
NEXT_PUBLIC_API_KEY
```

Note: Add link to your backend in the above environment variable. I recommend using ngrok to set up a route to your backend on localhost and add it to the ngrok link to variable.

Then install the packages with:

```bash
npm run install
# or 
yarn install
```

Finally, run the application with:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.