---
title: "Trust In Styleguide"
tags: css, design, development, type, webfonts
date: 2012-12-04 18:09
image: "/images/couples-styleguide-1.png"
---

![The <a href=\"/demos/couples-styleguide/index.html\" target=\"_blank\">styleguide</a> for <a href=\"http://couples.howaboutwe.com\" target=\"_blank\">HowAboutWe for Couples</a>.](/images/couples-styleguide-1.png?align=fullWidth)

Increasingly, web designers of today also are developers &mdash; which is awesome.
However, in my experience, most I&rsquo;ve worked with have never touched
code, and none expect to as a part of their day-to-day. For this and many
other reasons, coded styleguides are a must.

<span class="more"></span>

<p>
  The styleguide conversation&rsquo;s not a new one &mdash;
  <a href="http://maban.co.uk/" target="_blank">Anna Debenham</a>, for instance,
  <a href="http://24ways.org/2011/front-end-style-guides/" target="_blank">wrote
    about it last year for 24 Ways</a>. I&rsquo;m going to avoid trodden ground
  as best I can. Instead, I wanted to show how styleguides have helped
  myself and my coding and designing coworkers at
  <a href="http://howaboutwe.com" target="_blank">HowAboutWe</a>, and hopefully
  convince others to adopt them.
</p>

<h2>Styleguide as a Proof-of-Concept</h2>
<p>
  My last project at
  <a href="http://www.howaboutwe.com" target="_blank">HowAboutWe</a> was the
  two-month inception of the <a href="http://couples.howaboutwe.com"
    target="_blank">HowAboutWe for Couples</a> minimum-viable-product. By that
  point, we&rsquo;d just started to build out an internal team of designers.
</p>

<blockquote class="big right quotation">
  She was certain many headers and buttons would have to be cut images. It would
  be rocky between us if I couldn&rsquo;t convince her of otherwise.
</blockquote>

<p>
  The designer in charge of Couples had a mixed relationship with developers
  in the past. She didn&rsquo;t trust in the capabilities of modern browsers,
  especially with regards to rendering drop shadows and web fonts, despite
  leaning on both in her designs. She was certain many headers and buttons would
  have to be cut images. It would be rocky between us if I couldn&rsquo;t
  convince her of otherwise.
</p>

<p>
  So on the engineering side, we set out to prove her wrong by incepting the
  <a href="/demos/couples-styleguide/index.html"
    target="_blank">HowAboutWe for Couples Styleguide</a>, starting with
  <a href="/demos/couples-styleguide/ui.html#buttons"
    target="_blank">buttons</a>. And she was convinced.
</p>

<p>
  Another fun thing I managed to convince her of that had even me a little
  suspicious was using a
  <a href="/2012/06/12/futzing-around-with-icon-fonts-and-svg/">web font for
  all icons</a>.
  And that&rsquo;s the other useful thing about a styleguide &mdash; it&rsquo;s
  a place, isolated from the other complex layers of implementation, to prove
  out ideas and hunches. A lab where things can be tried, evolve and change
  without too much difficulty. It could have been that the maintenance cost for
  a font icon or all-CSS buttons would have been too high; a styleguide is the
  place for figuring that out. <small>(Spoiler:
  <a href="/demos/couples-styleguide/ui.html#icons"
    target="_blank">Both succeeded</a>.)</small>
</p>

<h2>For Onramping and Implementation Speed</h2>
<p>
  Designers weren&rsquo;t the only new folks at work. We&rsquo;d also been
  recruiting developers at a fast clip. For these folks, our styleguide was also
  a crucial on-ramping tool. They could quickly grasp most all of our internal
  HTML and CSS coding and naming conventions, and could be prepared much sooner
  to contribute real work.
</p>

<p>
  And delivering work is itself simplified. With modularized styles and markup
  centralized, organized, and presented in one place, the frontend for new
  features becomes a much simpler process. It can also be parallel-ized with
  confidence when developers have a styleguide to consult.
</p>

<h2>For Coding and Designing Authority</h2>
<p>
  The styleguide should have the rule of law. If some design concept isn&rsquo;t
  there, whether it&rsquo;s at a high level like paginated navigation or much
  more granular like a font size, there should be a good reason to add it in
  &mdash; otherwise, whatever&rsquo;s already in the styleguide should be used,
  instead, or the styleguide should be updated to the new design.
</p>

<p>
  Clearly, it requires a special kind of discipline to enforce the styleguide
  so strictly &mdash; but in my experience, this level of tension between design
  and styleguide is important. On frontend teams with more than a few
  developers, nonchalance about (or complete lack of) a styleguide leads
  inevitably to massive bloat and redundant implementations.
</p>

<blockquote class="big right quotation">
  &hellip;aggressive iteration without proper styleguide discipline (by both
  developers and designers) lead to a stylesheet so large that IE8 couldn&rsquo;t
  parse it completely&hellip;
</blockquote>

<p>
  This was a lesson learned the hard way in the HowAboutWe
  <a href="http://www.howaboutwe.com" target="_blank">dating site</a>, where
  aggressive iteration without proper styleguide discipline (by both developers
  and designers) lead to a stylesheet so large that IE8 couldn&rsquo;t parse it
  completely (though, that wasn&rsquo;t the only symptom; inefficient use of
  <a href="http://www.sass-lang.com" target="_blank">sass</a> also played a big
  role). Disciplined styleguide usage makes maintenance far easier, which
  increases developers&rsquo; and designers&rsquo; happiness.
</p>

<figure class="left">
  <div class="curledShadow">
    <a href="/demos/couples-styleguide/ui.html">
      <img src="/images/couples-css-buttons.png"
        alt="Couples CSS buttons in styleguide" />
    </a>
  </div>
  <figcaption>CSS buttons in Couples styleguide.</figcaption>
</figure>
<h2>To Help Finalize Design</h2>

<p>
  No web designer of today should consider a design that only exists in
  Photoshop as final. Things <i>will</i> look different in browsers, and
  designers <i>will</i> want to tweak accordingly &mdash; slightly increasing
  <code>line-height</code>, adjusting a <code>color</code>, or changing a
  <code>margin</code>.
</p>

<p>
  Additionally, few designers I&rsquo;ve met have worked out user interactions
  in Photoshop. It&rsquo;s something that needs to be seen in a browser before
  being settled. In HowAboutWe for Couples, the
  <a href="/demos/couples-styleguide/ui.html#buttons"
    target="_blank">aforementioned buttons</a>&rsquo; initial state was designed
  in a PSD, but interactive states like loading weren&rsquo;t. Coding the
  styleguide was instrumental in working out those interactions, and many other
  kinks. Which leads cleanly to the next benefit&hellip;
</p>

<h2 class="cleared">For Easier Redesign</h2>
<p>
  Having a styleguide in place means the broad UI concepts of the respective
  website have been worked out. And in turn, that makes the inevitable redesign
  much easier.
</p>

<p>
  Naturally, not all concepts in a styleguide will survive a redesign. This
  could be an indication that those concepts were too specific and high-level
  in retrospect. But, in reality, the balance of what&rsquo;s too high-level for
  the styleguide and what&rsquo;s not depends on a lot of things. If the
  implementation of a particular component is reused often enough in designs,
  even if it&rsquo;s fairly complex, then it deserves to be in the styleguide for
  developer ease.  It&rsquo;s one of the reasons the Couples styleguide has a
  <a href="/demos/couples-styleguide/boilerplate.html"
    target="_blank">boilerplate section</a>.
</p>

<h2>Coupling to the App</h2>
<p>
  One last departing bit on where the styleguide lives compared to the
  site(s) it&rsquo;s for. I think it&rsquo;s useful to have the styleguide
  point to the very same stylesheets of its corresponding site(s), which is what
  we did at HowAboutWe. By doing so, the app&rsquo;s stylesheets are implemented
  with the styleguide. And in future maintenance, updates in one force
  developers to keep the other current, as well.
</p>

<p>
  Conversely, it makes little sense to share HTML directly, since it&rsquo;s
  hard to separate HTML from content that isn&rsquo;t relevant. Instead, denote
  the relevant markup blocks in the styleguide somehow &mdash; we used HTML
  comments in the Couples styleguide, only because we were too lazy to get
  <code>textarea</code>s with the relevant markup in them implemented.
</p>

<p>
  <strong>12/13 Update &mdash;</strong>
  <a href="https://twitter.com/lsirivong">Lenny Sirivong</a> commented below
  about a
  <a href="http://codepen.io/davatron5000/pen/tzJKh">bit of simple jQuery</a> by
  <a href="https://twitter.com/davatron5000">Dave Rupert</a> that parses
  for <code>data-codeblock</code> attributes and presents them as a pretty
  string that can be easily copied. Good quick way to get code blocks from your
  code demos!
</p>

<figure>
  <div class="curledShadow">
    <a href="http://middlemanapp.com" target="_blank">
      <img src="/images/middlemanapp-screenshot.png" alt="Middleman Static Site
        Generator" />
    </a>
  </div>
  <figcaption>
    <a href="http://middlemanapp.com" target="_blank">Middleman</a> for maximum
    frontend enjoyment!
  </figcaption>
</figure>

<p>
  In case you were wondering&hellip;
  The HowAboutWe styleguides are implemented via the awesome static site
  generator, <a href="http://middlemanapp.com" target="_blank">Middleman</a>,
  which is like <a href="/2012/04/05/i-love-jekyll-and-github/">Jekyll</a>,
  but supports <a href="http://haml.info/" target="_blank">Haml</a> for HTML,
  <a href="http://compass-style.org" target="_blank">Compass</a> for CSS, and
  <a href="http://coffeescript.org/" target="_blank">CoffeeScript</a> for JS.
  They lived in subfolders within their respective Rails applications, and
  spit out the compiled pages into <code>/public</code> to get served up outside
  of the Rails stack.
</p>

<p>
  In typical &ldquo;me&rdquo; fashion, this endorsement has been a long-winded,
  and I thank you for reading this far. I&rsquo;d love to hear if and how
  styleguides have helped or hurt your own work, so please comment your thoughts!
</p>

<p>
  Merry frontend-ing!
</p>
