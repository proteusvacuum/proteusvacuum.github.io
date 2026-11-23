# My Homepage!

## Run locally

```bash
sudo apt install ruby-full build-essential zlib1g-dev libssl-dev
gem install --user-install bundler   # then add ~/.local/share/gem/ruby/3.3.0/bin to PATH
bundle config set --local path vendor/bundle
bundle install
bundle exec jekyll serve --livereload   # --future to show future-dated posts
```

## Includes

```liquid
{% include figure.html src="/assets/images/foo.jpg" width="400" caption="Caption" %}
```
Captioned image; `.mp4` src becomes a looping muted video.

```liquid
{% capture slides %}
![Caption one](/assets/images/one.jpg)
![Caption two](/assets/images/two.jpg)
{% endcapture %}
{% include image-carousel.html slides=slides %}
```

Add `{: .wrap}` after a code block to wrap long lines.

## Media

Resize photos to ~1600px and strip metadata (phone photos contain GPS) before committing.

## Syntax highlighting

```bash
bundle exec rougify style github > _sass/_syntax-highlighting.scss
```
Then re-apply: keywords `#9a1f24`, function names `#1d6b62`.
