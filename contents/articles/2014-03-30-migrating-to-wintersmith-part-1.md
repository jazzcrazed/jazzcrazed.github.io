---
title: "Migrating my Blog's Content to Wintersmith"
date: 2014-03-30 19:08
tags: development
---
I know now that it takes an inordinate amount of effort for me to consistently update this blog. It's not for want of content, but rather a problem of editing. To jump-start my stalled blogging in a sort of meta way, I've decided to migrate my blog from tried-and-true [Jekyll](http://jekyllrb.com) to Node.js-based [Wintersmith](http://wintersmith.io). Because what's better to blog about than the blog itself? (The answer's "a lot of things," and I promise to get to those later, but this'll be interesting, too.)

<span class="more"></span>

## What is and why Wintersmith?

For a long time, I'd been considering migrating to [Middleman](http://www.middlemanapp.com) because I'd been enjoying it much more often than Jekyll for a variety of projects.

But then a year passed, during which I've been a full-stack Rails developer (yes, I got a new job...one of those "things" I promise to get to later), and I figured I ought to try something completely new. Entre Wintersmith: a fairly mature [Node.js](http://nodejs.org)-based generator that I picked out of several alternatives mostly because it seemed relatively easy for it to accommodate the many customizations I had done in my Jekyll blog. The whole of front-end development had changed around me with JavaScript at its center while I tooled around day after day following [Railscast tutorials](http://railscasts.com), so there was a lot for me to learn -- including using npm, Grunt.js, and Node in general.

Migrating from Jekyll to Wintersmith was not completely straightforward, thanks to the aforementioned customizations. But the basics are a cinch, starting with...

## Installing Wintersmith

This was the easy part -- and I'm going to skip over the installation of Node.js, because in my case it already was installed (thanks to Rails).

The [Wintersmith docs](https://github.com/jnordberg/wintersmith) cover this effort pretty well:

```
$ npm install wintersmith -g
```

Then I made a folder for my new blog, and initialized Wintersmith inside of it:

```
$ mkdir marcocarag.com
$ wintersmith new marcocarag.com
```

After that, I can start a preview server:

```
$ cd marcocarag.com
$ wintersmith preview
```

And my new blog can be browsed at http://localhost:8080. Wintersmith comes with a few demo templates, located under `/templates`, and posts, each located in their own semantically named subdirectory under `contents/articles` with an `index.md` Markdown file inside. Adding a new post is a simple matter of creating another subdirectory under `articles` with its own `index.md` file.

Wintersmith's operation is centered around `config.json` in the root of its install, which -- similar to Jekyll's own config -- contains parameters that are important to the blog. Specifically, a `locals` object right up top that needs to be customized for my purposes:

``` javascript
locals: {
  name: "MarcoCarag.com",
  owner: "Marco Carag",
  description: "Marco Carag's blog about stuff he's into.",
  tagline: "Expert ♥er of things"
}
```

And that is the five-minutes-to-blogging process that is the Wintersmith install.

## Migrating my posts

There are many ways to skin the cat of moving my Jekyll posts over, with the simplest being to rename them all to `index.md` and copy them each to unique subfolders underneath `contents/articles`.

This didn't sit completely well with me, and it's not because it's a little annoying to create a new subfolder for each post -- I could easily make a script or task to one-line that piece every time (like `rake post <title>` in my Jekyll blog).

It was more because if I were to change how post files are organized, I'm not sure that I'd want it to be the Wintersmith default way. Seeing all of the post files with date and titles in one place just seemed more convenient. Also, if I could get it to work in Wintersmith, it'd mean I could copy my posts nearly intact from `_posts` in Jekyll to `contents/articles`.

Fortunately, I didn't have to figure it out... A fellow by the name of [Andrew Clark](http://www.andrewphilipclark.com) (who's own Wintersmith blog I leaned on heavily during this migration) modified Wintersmith to scrape a single folder for uniquely named Markdown files -- exactly as I wanted. The key was in Wintersmith's `plugin/paginator.coffee`; specifically, this bit:

``` coffeescript
getArticles = (contents) ->
  # helper that returns a list of articles found in *contents*
  # note that each article is assumed to have its own directory in the articles directory
  articles = contents[options.articles]._.directories.map (item) -> item.index
  articles.sort (a, b) -> b.date - a.date
  return articles
```

Which Andrew turned into this:

``` coffeescript
getArticles = (contents) ->
  # helper that returns a list of articles found in *contents*
  articles = []
  for key, value of contents[options.articles]
    articles.push value if value instanceof env.plugins.Page

  articles.sort (a, b) -> b.date - a.date
  return articles
```

...leveraging the filename instead of the directory names to create an array of `articles` (which are actually `pages`, which are actually my posts). And with that, I could literally copy all of my post files from `_posts/` to `contents/articles`.

## Changing Permalinks

Wintersmith posts and pages by default get urls like `/this-is-my-post-title/index.html`, thanks to the one-for-one mapping of the subfolders under `contents/articles`. For my purposes, though, I need to reproduce the date and title-based permalinks of my Jekyll blog.

Custom permalinks in Wintersmith are made possible via a [front-matter](http://jekyllrb.com/docs/frontmatter/) property called `filename`, which instructs Wintersmith how to output the compiled HTML:

``` python
# To yield a permalink of /2014/03/30/heres-my-post/index.html
filename: "/:year/:month/:day/:title/index.html"
```

That's good enough to reproduce the urls I want. But it kinda' sucks to have to repeat it in every post. [Andrew Clark](http://www.andrewphilipclark.com) to the rescue again. His post, [How to remove the boilerplate from Wintersmith blog posts](http://andrewphilipclark.com/2013/11/08/removing-the-boilerplate-from-wintersmith-blog-posts/), was actually how I found his ever-helpful blog in the first place.

In that post, he outlines a [plugin](https://github.com/acdlite/andrewphilipclark.com/blob/master/plugins/blog.coffee) that he wrote which enables a Wintersmith blog to set global `filename` values, as well as templates:

``` coffeescript
# plugins/blog.coffee
module.exports = (env, callback) ->

  defaults =
    postsDir: 'articles' # directory containing blog posts
    template: 'post.jade'
    filenameTemplate: '/:year/:month/:day/:title/index.html' # Here's the magic part

  # assign defaults for any option not set in the config file
  options = env.config.blog or {}
  for key, value of defaults
    options[key] ?= defaults[key]

  class BlogpostPage extends env.plugins.MarkdownPage
    ### DRYer subclass of MarkdownPage ###

    getTemplate: ->
      @metadata.template or options.template or super()

    getFilenameTemplate: ->
      @metadata.filenameTemplate or options.filenameTemplate or super()

  # register the plugin
  prefix = if options.postsDir then options.postsDir + '/' else ''
  env.registerContentPlugin 'posts', prefix + '**/*.*(markdown|mkd|md)', BlogpostPage

  # done!
  callback()
```

Saving that to `plugins/blog.coffee` and including it in my Wintersmith blog by adding this snippet to `config.json`:

``` javascript
plugins: [
  "./plugins/blog.coffee"
]
```

...saved me the effort of having to add `filename` to every one of my posts.

Unfortunately, there's many reasons yet for me to inconveniently edit them all, as we'll see in subsequent posts.

## Up next: Templates and Styles

At this point, I have a working Wintersmith blog with all of the posts of my old Jekyll one, accessible at the same urls as the original. If I wanted, I could just run `$ wintersmith build`, take the resulting output of `/build/*` and replace my repo with its contents, push up to `master` and be done.

But as much as I actually really like the default templates that come with Wintersmith -- in many ways, I prefer them to my own -- I wasn't prepared to get rid of my old design. If nothing else, it gives me an excuse to dig in even deeper into using Wintersmith and a Node-driven blog.

So in my next post, I'll go a layer up and talk about migrating my Jekyll blog's layout templates and stylesheets, which comes with the added bonus of setting up [Compass](http://compass-style.org) -- not a default part of Wintersmith.
