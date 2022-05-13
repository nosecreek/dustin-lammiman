import { EleventyEdge } from "eleventy:edge";
import precompiledAppData from "./_generated/eleventy-edge-app-data.js";
import searchData from "./_generated/search-data.js";

export default async (request, context) => {
  try {
    let edge = new EleventyEdge("edge", {
      request,
      context,
      precompiled: precompiledAppData,

      // default is [], add more keys to opt-in e.g. ["appearance", "username"]
      cookies: [],
    });

    edge.config((eleventyConfig) => {
      // make "" falsy https://liquidjs.com/tutorials/truthy-and-falsy.html
      eleventyConfig.setLiquidOptions({
        jsTruthy: true
      });

      // As of v2.0.0-canary.11 Global Data added here is available to all `edge` shortcodes
      eleventyConfig.addGlobalData("search", searchData);

      // e.g. Fancier json output
      eleventyConfig.addFilter("json", obj => JSON.stringify(obj, null, 2));

      eleventyConfig.addFilter("searchFor", ({ text, title }, needle) => {
        needle = needle.toLowerCase();
        return text.toLowerCase().includes(needle) || title.toLowerCase().includes(needle);
      });
    });

    return await edge.handleResponse();
  } catch (e) {
    console.log("ERROR", { e });
    return context.next(e);
  }
};
