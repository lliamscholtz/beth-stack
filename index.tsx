import { Elysia } from 'elysia';
import { html } from '@elysiajs/html';
import * as elements from 'typed-html';

// State

let count = 0;
let reload = 0;

// App

const app = new Elysia();

// Routes

app.use(html())
    .get('/', ({ html }) =>
        html(
            <BaseHtml>
                <body class="flex w-full h-screen justify-center items-center">
                    <main hx-get="/counter" hx-trigger="load" hx-swap="innerHTML" />
                </body>
            </BaseHtml>
        )
    )
    .get('/counter', () => {
        reload++;
        return (
            <div>
                <button class="bg-slate-400 text-white px-6 py-2 rounded-md mr-2">
                    Reload ({reload})
                </button>
                <Button />
                <Reset />
            </div>
        );
    })
    .post('/click', () => {
        count++;
        return <Button />;
    })
    .post('/reset', () => {
        count = 0;
        return <Button />;
    })
    .listen(3000);

// Server listening

console.log(
    `Server running at http://${app?.server?.hostname}:${app?.server?.port}/`
);

// Base HTML

const BaseHtml = ({ children }: elements.Children) => `
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <title>Elysia</title>
        <script src="https://unpkg.com/htmx.org@1.9.5"></script>
        <script src="https://cdn.tailwindcss.com"></script>
    </head>
    ${children}
</html>
`;

// Components

function Reset() {
    return (
        <button
            class="bg-red-600 text-white px-6 py-2 rounded-md ml-2"
            hx-post="/reset"
            hx-target="#counter"
            hx-swap="outerHTML"
        >
            Reset
        </button>
    );
}

function Button() {
    return (
        <button
            id="counter"
            class="bg-slate-900 text-white px-6 py-2 rounded-md"
            hx-post="/click"
            hx-swap="outerHTML"
        >
            Increment ({count})
        </button>
    );
}

// Run
// bun run --watch index.tsx
