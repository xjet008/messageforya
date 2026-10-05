# messageforya

A personal note from you to your partner, with the original paper theme and journey.

## What changed

Only the ending was extended: your partner brings two torn postcard pieces together, labelled “my effort” and “your effort.” They snap into an outline, a stitched seam appears, and the message reads “Your effort and my effort make us whole.” Turning over the joined card reveals the letter.

The entrance, 50 apology cards, heart game, and “One more time” sequence remain. The ending now speaks from the person apologising to their partner. Download and WhatsApp sharing remain, with the updated message in the saved image.

Drag with a mouse or finger. Tap either piece to place it, or focus it with Tab and press Enter or Space. Reduced-motion preferences are respected. Sound follows the existing sound toggle. The puzzle runs in the browser; it does not collect or send your partner’s actions.

## Run

Use Node.js 20.9 or newer and pnpm:

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Open http://localhost:3000. To make a production build:

```sh
pnpm build
pnpm start
```

Deploy this folder using the existing Next.js hosting setup. On Vercel, choose the Next.js preset and leave the output directory at its default. After deploying, send your partner the website link.

## Edit your words

- `components/together-card.tsx`: two-piece interaction and completion message.
- `components/keepsake-card.tsx`: final letter displayed on the website.
- `lib/keepsake-canvas.ts`: matching words in the downloaded card.
- `components/one-more-time.tsx`: existing ending sequence.
- `app/globals.css`: original theme plus the two-piece ending styles at the bottom.

Keep the displayed letter and downloaded card text in sync when personalising them.
