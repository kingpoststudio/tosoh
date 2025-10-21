# Tosoh - 2025

This is the project for Tosoh Diagnostics.

## Wrap-Up Thoughts For Tailwind

This was the first project where we mainly used Tailwind CSS. While it significantly sped up the development process, it also introduced some unexpected challenges. Below, I’ll outline the pros and cons we observed.

### Pros of Using Tailwind

1. **Consistent Aesthetics with Less Effort**  
   The effort required to maintain aesthetic consistency across modules was much lower compared to previous projects where we used plain CSS.  
   I didn’t have to think about how similar components were styled elsewhere — I simply used Tailwind’s predefined values (e.g., `sm`, `base`, `md`), and things naturally aligned. That, for me, is a major advantage.

2. **Reduced Need for a Custom Design System**  
   The effort of constructing a rigid design system was almost non-existent since Tailwind inherently provides one. Another big plus.

### Cons of Using Tailwind

1. **Conflicts with Shadow DOM Usage**  
   The main issue I encountered was the conflict between Tailwind’s light DOM styling and our previous approach that relied heavily on the Shadow DOM.  
   In this project, I ended up using a hybrid approach that combined Shadow DOM and Light DOM, which could cause confusion in the future.  

   The reason for this is that Tailwind works in the Light DOM. So, if I wanted to reuse styles without writing a dedicated `<style>` block at the end of a Svelte component, I had to disable the Shadow DOM.  
   I could have avoided this by using Tailwind variables inside the component’s style block, allowing everything to remain within the Shadow DOM. It ultimately came down to the mindset of writing as little CSS as possible — something Tailwind naturally encourages.

### Should We Use Tailwind in the Future?

The answer is **yes**. Tailwind offers effortless consistency and significant time savings.  
The issue wasn’t with Tailwind itself but with how it was integrated. I’m confident we can take the best of both worlds — continue using Tailwind while keeping the Shadow DOM intact through the use of Tailwind variables within component style blocks.

## Wrap-Up Thoughts on Using Serverless APIs

Since the project relied heavily on data, we used HubSpot Serverless APIs to fetch it. This approach gave us finer control over the amount of data we requested and also enabled us to make the page function as an SPA (Single Page Application).

### Pros of Using Serverless

1. **Data fetching became very easy**  
   Writing custom queries and filters was straightforward since we moved from Hubl to a JavaScript environment. We were also able to reuse the same functionality across all modules that utilized HubDB fetching logic.

### Cons of Using Serverless

1. **Only available to Enterprise-level clients**  
   This limitation makes the solution harder to reuse for smaller clients.

2. **Client-side rendering**  
   Since the data fetching happens on the client side, SEO benefits do not apply to these pages.

### Should We Use Serverless in the Future?

It depends on the size of the client and whether the page needs to be indexed by search engines.
