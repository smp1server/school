# School Social

A simple school social media test site built with Node.js and Express.

## Requirements

- [Node.js](https://nodejs.org/) (version 14 or higher recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- Ubuntu 24.04.2 LTS (or any OS that supports Node.js)

## Installation

1. **Clone the repository** (if you haven't already):

   ```sh
   git clone <your-repo-url>
   cd school
   ```

2. **Install dependencies:**

   ```sh
   npm install
   ```

## Running the Server

Start the server with:

```sh
npm start
```

By default, the server will run on [http://localhost:3000](http://localhost:3000).

## Accessing the Site

- Open your browser and go to: [http://localhost:3000](http://localhost:3000)
- You can register a new user, log in, make posts, like, comment, and view profiles.

## Project Structure

- `server.js` - Main server code (Express app)
- `public/` - Static files (HTML, CSS, client JS)
- `data.json` - (Unused by default, but present for future data storage)
- `package.json` - Project metadata and dependencies

## Notes

- The site is only accessible on the machine where the server is running (localhost).
- To make it accessible on your local network, use your machine's IP address instead of `localhost`.
- For production or public hosting, consider deploying to a platform like [Heroku](https://www.heroku.com/), [Vercel](https://vercel.com/), or a VPS.

## Stopping the Server

Press `Ctrl+C` in the terminal where the server is running.

---

**Enjoy using School