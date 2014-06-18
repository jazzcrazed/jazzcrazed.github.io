---
title: "Migrating Away from GitHub Pages and Changing Task Runners (just 'cause)"
date: 2014-06-18 14:57
tags: development
---
I'm changing my workflow again! Partly because the nature of my recent work -- quickly spinning together apps and prototypes one after another -- has gotten me interested in workflow options more than ever before. But also partly because my last change -- to [Wintersmith from Jekyll](/2014/03/30/migrating-my-blog-s-content-to-wintersmith/) -- was already somewhat dissatisfying and behind the times. I'm talking about two things here: hosting on [GitHub Pages](https://pages.github.com/), and using [Grunt](http://gruntjs.com/) as my taskrunner.

<span class="more"></span>

## Github Pages

The first problem with GitHub Pages stems from my choice of moving away from Jekyll. Jekyll is the engine that GitHub uses to build GitHub Pages from source files. But moving away from Jekyll means that source content won't automatically be compiled by GitHub. Not a huge obstacle, as the simple solution is to compile the site locally and commit the files to my repository. So I did just that, using Grunt to help that part of the workflow.

This was immediately dissatisfying, however, because it resulted in the compiled content *and* the source content commingling in the repository together. To make the situation even messier, in order to be served out by GitHub Pages, the compiled content needed to be at the root of the repository. This effectively was a regression from the Jekyll situation, where the source content could be committed normally, and GitHub would handle the page compilation (I actually [moved away](/2013/05/22/jekyll-plugins-in-github-pages/) from that, as well, to accommodate plugins; though, leveraging Rake, I still separated source from compiled). But more importantly, it just felt gross to have both source and compiled content all mixed together at the same root and in the same repository.

## DNS issues

The next problem I had was unexpected: GitHub was intentionally `302` redirecting hits straight to my site. [This blog post](http://helloanselm.com/2014/github-pages-redirect-performance/) sums it up nicely; in short, as a means to better mitigate [DDoS attacks](http://en.wikipedia.org/wiki/Denial-of-service_attack) against their IPs, GitHub first filters against bot user agents before `302`-ing plain ol' humans to Pages. This is only true for Pages using `A` DNS records to point custom domains straight at their server IPs.

I could have used an `ALIAS` record (pluses and minuses of which are well explained by my DNS provider, [DNSimple](http://blog.dnsimple.com/2014/01/why-alias-record/)) pointed at `jazzcrazed.github.io` to handle the redirect issue, but the first repository-cleanliness problem had me turned off to Pages, anyway. It tasted a little sour to have my hosting situation dictate my content management and source control in such specific ways.

## Enter S3

For several quick projects at my most recent job, we threw up frontend-only applications on our [Amazon S3 buckets](http://aws.amazon.com/s3/). They were cheap, easy, and performant. It actually seemed close to an ideal match to my needs for this blog.

I had long ago set up an AWS account that had been idling with the intention of using it more directly. Now that work had me using AWS quite regularly, I felt perfectly comfortable with moving to it. I was already generating my Wintersmith blog on my local machine -- I even had created a bucket long ago named `marcocarag.com` (I can't remember why... I think to host assets?). The only missing piece was deployment.

## ...Also, Enter Gulp.js

I was all ready to add a Grunt plugin for S3, and create a deploy task -- when I had the rug pulled out from under me, a good half a year late.

Turns out, at the beginning of this year, several months before I migrated from Jekyll and Rake to Wintersmith and Grunt, a challenger to Grunt emerged named [Gulp.js](http://gulpjs.com/). The reasons for its success since are well written about by now -- and most all of them resonated with me, as well. Particularly the opinion, which I share, that Gulp.js code is simply more readable than Grunt's JSON configuration.

Since a major part of the existence of this blog is to *learn* stuff, while on the track of migrating to a new host, I may as well spend some time playing with Gulp. So I converted my Grunt to Gulp, and in the process audited my tasks and cleaned them up slightly -- and also added deployment to my build task. I'm no expert by any stretch of the imagination, and so it means something when I was able to change from Grunt to Gulp -- and understand decently what was going on -- in a fraction of the time it took to set up Grunt.

Here's the before:

``` javascript
module.exports = function(grunt) {
  grunt.initConfig({
    cssmin: {
      production: {
        expand: true,
        cwd: 'css',
        src: ['*.css'],
        dest: 'css'
      }
    },
    coffee: {
      preview: {
        sourceMap: true,
        files: {
          'contents/js/script.js': ['contents/coffee/*.coffee']
        }
      },
      production: {
        sourceMap: false,
        files: {
          'contents/js/script.js': ['contents/coffee/*.coffee']
        }
      }
    },
    compass: {
      dist: {
        options: {
          sassDir: 'contents/sass',
          cssDir: 'css',
          environment: 'production'
        }
      },
      dev: {
        options: {
          sassDir: 'contents/sass',
          cssDir: 'contents/css',
          environment: 'development'
        }
      }
    },
    extend: {
      options: {
        deep: true,
        defaults: grunt.file.readJSON('config.json')
      },
      production: {
        files: {
          './config-production.json': ['./config-production-base.json']
        }
      },
      preview: {
        files: {
          './config-preview.json': ['./config-preview-base.json']
        }
      }
    },
    wintersmith: {
      production: {
        options: {
          config: './config-production.json'
        }
      },
      preview: {
        options: {
          action: "preview",
          config: './config-preview.json'
        }
      }
    },
    watch: {
      sass: {
        files: [
          'contents/sass/**/*.scss'
        ],
        tasks: [
          'compass:dev'
        ]
      },
      coffeescript: {
        files: [
          'contents/coffee/**/*.coffee'
        ],
        tasks: [
          'coffee:preview'
        ]
      }
    },
    uglify: {
      production: {
        files: {
          'js/script.js': 'js/script.js'
        }
      }
    },
  });
  grunt.loadNpmTasks("grunt-extend");
  grunt.loadNpmTasks("grunt-contrib-coffee");
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-wintersmith');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.registerTask('preview', [
    'extend:preview',
    'coffee:preview',
    'compass:dev',
    'wintersmith:preview'
  ]);
  grunt.registerTask('buildProduction', [
    'extend:production',
    'coffee:production',
    'compass:dist',
    'wintersmith:production',
    'uglify:production',
    'cssmin:production'
  ]);
};
```

And the `gulpfile.js` that replaced it:

``` javascript
var gulp        = require('gulp');
var gutil       = require('gulp-util');
var cssmin      = require('gulp-cssmin');
var extend      = require('gulp-extend');
var coffee      = require('gulp-coffee');
var compass     = require('gulp-compass');
var wintersmith = require('run-wintersmith');
var clean       = require('gulp-clean');
var uglify      = require('gulp-uglify');
var path        = require('path');
var fs          = require('fs');
var awspublish  = require('gulp-awspublish');

var BUILD_DIR = 'build';
var CONTENT_DIR = 'contents';
var TEMPLATES_DIR = 'templates';

gulp.task('clean', function() {
  return gulp.src(BUILD_DIR, { read: false }).pipe(clean());
});

gulp.task('coffee', function() {
  gulp.src(CONTENT_DIR + '/coffee/*.coffee')
      .pipe(coffee({bare: true}).on('error', gutil.log))
      .pipe(gulp.dest(CONTENT_DIR + '/js/script.js'));
});

gulp.task('uglify', function() {
  var dir = CONTENT_DIR + '/*.js';
  gulp.src(dir)
      .pipe(uglify())
      .pipe(gulp.dest(dir))
});

gulp.task('compass', function() {
  gulp.src(CONTENT_DIR + '/sass/*.scss')
      .pipe(compass({
        project: path.join(__dirname, '/' + CONTENT_DIR),
        css: 'css',
        sass: 'sass'
      }))
      .pipe(gulp.dest(CONTENT_DIR + '/css'));
});

gulp.task('cssmin', function() {
  var dir = CONTENT_DIR + '/css';
  gulp.src(dir + '/**/*.css')
      .pipe(cssmin())
      .pipe(gulp.dest(dir));
});

gulp.task('set-production-config', function() {
  console.log('Creating production config');
  gulp.src(['./config.json', './config-production-base.json'])
      .pipe(extend('config-production.json', true))
      .pipe(gulp.dest('./'));

  console.log('Setting production config for Wintersmith\'s use');
  wintersmith.settings.configFile = 'config-production.json';
});

gulp.task('build-and-deploy', ['clean', 'coffee', 'uglify', 'compass', 'cssmin', 'set-production-config'], function() {
  console.log('Running Wintersmith build');
  wintersmith.build(function(){
    // Log on successful build
    console.log('Wintersmith has finished building!');

    console.log('Reading AWS config');
    // create a new publisher
    var publisher = awspublish.create(JSON.parse(fs.readFileSync('./env.json')));

    return gulp.src('./' + BUILD_DIR + '/**')
      .pipe(publisher.publish())

      // create a cache file to speed up consecutive uploads
      .pipe(publisher.cache())

       // print upload updates to console
      .pipe(awspublish.reporter());
  });
});
```

## The Exploded View

To publish and upload my site, I now run the command `gulp build-and-deploy`. Here's what goes on behind the scenes:

### Cleaning the Build Folder

First, I run a `clean` task using [gulp-clean](https://www.npmjs.org/package/gulp-clean):

``` javascript
var clean = require('gulp-clean');

gulp.task('clean', function() {
  return gulp.src(BUILD_DIR, { read: false }).pipe(clean());
});
```

It's referring to a global I defined earlier called `BUILD_DIR`, which is simply a string of the folder name: `build` (yay, no more compiled content mixed in with source!).

### Compile JS

Then, I compile and minify my coffeescript files (of which I actually have none presently, 'cause I'm not doing any JavaScript on my blog -- yet) using [gulp-coffee](https://www.npmjs.org/package/gulp-coffee) and [gulp-uglify](https://www.npmjs.org/package/gulp-uglify):

``` javascript
var coffee = require('gulp-coffee');
var uglify = require('gulp-uglify');

gulp.task('coffee', function() {
  gulp.src(CONTENT_DIR + '/coffee/*.coffee')
      .pipe(coffee({bare: true}).on('error', gutil.log))
      .pipe(gulp.dest(CONTENT_DIR + '/js/script.js'));
});

gulp.task('uglify', function() {
  var dir = CONTENT_DIR + '/*.js';
  gulp.src(dir)
      .pipe(uglify())
      .pipe(gulp.dest(dir))
});
```

These operate in another folder called `CONTENT_DIR` (which maps to `/contents`, the source folder Wintersmith uses by default). I want to do these operations on the source content so that Wintersmith copies it all wholesale with the HTML to `/build`.

### Compile CSS

Next up, compilation and minification of CSS from `scss` using [gulp-compass](https://www.npmjs.org/package/gulp-compass) and [gulp-cssmin](https://www.npmjs.org/package/gulp-cssmin)

``` javascript
var cssmin = require('gulp-cssmin');
var compass = require('gulp-compass');

gulp.task('compass', function() {
  gulp.src(CONTENT_DIR + '/sass/*.scss')
      .pipe(compass({
        project: path.join(__dirname, '/' + CONTENT_DIR),
        css: 'css',
        sass: 'sass'
      }))
      .pipe(gulp.dest(CONTENT_DIR + '/css'));
});

gulp.task('cssmin', function() {
  var dir = CONTENT_DIR + '/css';
  gulp.src(dir + '/**/*.css')
      .pipe(cssmin())
      .pipe(gulp.dest(dir));
});
```

Just like my coffeescript->JavaScript, I'm compiling my `scss` files to a `/css` folder within `/contents`, and then minifying it in the same folder. Wintersmith will handle copying the results to `/build`.

### Set the config, build, and deploy

There is no plugin specifically for Wintersmith and Gulp. Instead, there's a module called [run-wintersmith](https://github.com/vanjacosic/run-wintersmith) the intention behind which is to remain agnostic to things like Gulp. Using it is rather simple, and I do so right in the `build-and-deploy` task:

``` javascript
gulp.task('build-and-deploy', ['clean', 'coffee', 'uglify', 'compass', 'cssmin', 'set-production-config'], function() {
  console.log('Running Wintersmith build');
  wintersmith.build(function(){
    // Log on successful build
    console.log('Wintersmith has finished building!');
  });
});
```

All of the earlier tasks are called using [dependencies](https://github.com/gulpjs/gulp/blob/master/docs/API.md#deps) -- an array of the task names that need to be run, first.

Within the task callback, there's only one method that matters here: `wintersmith.build()`. However, as you may have inferred from the dependencies, I have to set the config beforehand, as I had already set up Wintersmith to use a preview or production config depending on the task context:

``` javascript
var extend = require('gulp-extend');

gulp.task('set-production-config', function() {
  console.log('Creating production config');
  gulp.src(['./config.json', './config-production-base.json'])
      .pipe(extend('config-production.json', true))
      .pipe(gulp.dest('./'));

  console.log('Setting production config for Wintersmith\'s use');
  wintersmith.settings.configFile = 'config-production.json';
});
```

I'm leaning on a module called [gulp-extend](https://www.npmjs.org/package/gulp-extend) to merge and create a new config JSON file from the base `config.json` and `config-production-base.json`. Then, I set the config option on my instance of `run-wintersmith` to point to `config-production-base.json`.

Now, `wintersmith.build()` will work using my production options (specifically, to output to the `/build` folder, and set locals that are production-specific).

### Deployment

After configuring my `marcocarag.com` and `www.marcocarag.com` buckets as [static websites](https://docs.aws.amazon.com/AmazonS3/latest/dev/website-hosting-custom-domain-walkthrough.html#root-domain-walkthrough-s3-tasks) on the AWS Management Console, I was all set to deploy `/build`. First, I stored my AWS API credentials in a file called `env.json` (which, **crucially**, I made sure to add to my `.gitignore` to prevent from open sourcing my keys):

``` javascript
{
  "key": "[AWS KEY HERE]",
  "secret": "[AWS SECRET HERE]",
  "bucket": "marcocarag.com"
}
```

I installed a module called [gulp-awspublish](https://www.npmjs.org/package/gulp-awspublish), and within the success callback of `wintersmith.build()`, I loaded and parsed `env.json` and sent `/build` through `gulp-awspublish`:

``` javascript
var awspublish  = require('gulp-awspublish');
...
  // Inside of the build-and-deploy task
  console.log('Running Wintersmith build');
  wintersmith.build(function(){
    // Log on successful build
    console.log('Wintersmith has finished building!');

    console.log('Reading AWS config');
    // create a new publisher
    var publisher = awspublish.create(JSON.parse(fs.readFileSync('./env.json')));

    return gulp.src('./' + BUILD_DIR + '/**')
      .pipe(publisher.publish())

      // create a cache file to speed up consecutive uploads
      .pipe(publisher.cache())

       // print upload updates to console
      .pipe(awspublish.reporter());
  });
...
```

The `.pipe(publisher.cache())` bit is pretty cool; it maintains a set of hashes to determine whether a file has changed and needs to be re-uploaded. Effectively, it makes subsequent deploys far, far faster by reducing the number of uploads to only the changed files.

## Some DNS changes

Now, I had to do what I mentioned earlier -- point a new `ALIAS` record at my bucket.

Coincidentally, I wasn't totally thrilled with the management tools of my registrar ([Jumpline](http://jumpline.com), which I was grandfathered into as they apparently took over my old registrar whom I'd been using for the better part of a decade). So I went ahead and signed up for [DNSimple](http://dnsimple.com) -- again, an introduction brokered by work.

I turned off the DNS management tools at Jumpline, and instead pointed my domain at DNSimple's nameservers, recreated all of my records over there, and added a new `ALIAS` record pointing at my bucket endpoint, `marcocarag.com.s3-website-us-east-1.amazonaws.com`. I also added a `CNAME` pointing `www.marcocarag.com` to the "naked" `marcocarag.com`.

## Done...for now

And that's that! My publishing workflow still has the same number of steps as before (building and committing), but there's a (relatively) clean separation between the compiled site and the source. Perhaps the most fun part of the process was `git rm`ing all of the now unnecessary compiled content and Grunt-related files and lines from the repository.

The nicest thing, though, was bringing in Gulp. It's easy enough to use that I want to do more with it. Most immediately, I should bring back my preview task, maybe with some `livereload`ing.

Ah, who am I kidding... Knowing me, I'll probably switch to a whole different platform by the time I write another technical blog post. Whatever the case, I hope others find this useful, and please let me know of questions you have or things I should do to improve this workflow!
